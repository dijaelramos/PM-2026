'use strict';
/* PMPE Ouvir — ler e ouvir o Material do Dia e a Base de Conhecimento, mesmo offline. */

const $ = (s) => document.querySelector(s);
const tela = $('#tela');
const audio = $('#audio');
const CACHE_DADOS = 'dados-v1';
const CACHE_AUDIO = 'audio-v1';
const VELOCIDADES = [0.85, 1, 1.15, 1.25, 1.5, 1.75, 2];
const PALAVRAS_POR_MIN = 155;

const guardado = {
  get(k, padrao) { try { const v = localStorage.getItem(k); return v == null ? padrao : JSON.parse(v); } catch { return padrao; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* armazenamento indisponível */ } },
};

let catalogo = null;
const docs = new Map();
let baixados = new Set();
let statusSync = '';
const baixando = new Map(); // url -> fração 0..1

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const abs = (u) => new URL(u, location.href).href;
const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
function fmt(seg) {
  seg = Math.max(0, Math.round(seg || 0));
  const h = Math.floor(seg / 3600), m = Math.floor((seg % 3600) / 60), s = seg % 60;
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`;
}
const minutos = (seg) => `${Math.max(1, Math.round(seg / 60))} min`;
const duracaoItem = (it) => (it.audio ? it.audio.duracao : (it.palavras / PALAVRAS_POR_MIN) * 60);

/* ---------- dados ---------- */

async function carregarCatalogo() {
  try {
    const r = await fetch('data/catalogo.json', { cache: 'no-cache' });
    if (!r.ok) throw new Error(r.status);
    catalogo = await r.json();
  } catch {
    const c = await caches.match(abs('data/catalogo.json'));
    if (c) catalogo = await c.json();
  }
  try {
    const keys = await (await caches.open(CACHE_AUDIO)).keys();
    baixados = new Set(keys.map((k) => k.url));
  } catch { /* sem Cache API */ }
}

async function obterDoc(item) {
  if (docs.has(item.id)) return docs.get(item.id);
  let r = await caches.match(abs(item.arquivo));
  if (!r) {
    r = await fetch(item.arquivo);
    if (!r.ok) throw new Error('não foi possível abrir o documento');
    try { (await caches.open(CACHE_DADOS)).put(abs(item.arquivo), r.clone()); } catch { /* ok */ }
  }
  const doc = await r.json();
  docs.set(item.id, doc);
  return doc;
}

async function sincronizar() {
  if (!navigator.onLine || !catalogo || !('caches' in window)) return;
  try {
    const dados = await caches.open(CACHE_DADOS);
    const arquivos = catalogo.docs.map((d) => d.arquivo);
    if (catalogo.questoes) arquivos.push(catalogo.questoes.arquivo);
    if (catalogo.busca) arquivos.push(catalogo.busca.arquivo);
    const atuais = new Set(arquivos.map(abs));
    const faltam = [];
    for (const a of arquivos) if (!(await dados.match(abs(a)))) faltam.push(a);
    for (let i = 0; i < faltam.length; i += 8) {
      setStatus(`Guardando textos para usar offline… ${Math.min(i + 8, faltam.length)} de ${faltam.length}`);
      await dados.addAll(faltam.slice(i, i + 8));
    }
    for (const k of await dados.keys()) {
      if (/\/data\/(docs\/|questoes\.|busca\.)/.test(k.url) && !atuais.has(k.url)) await dados.delete(k);
    }
    const audiosAtuais = new Set(catalogo.docs.filter((d) => d.audio).map((d) => abs(d.audio.url)));
    const cacheAudio = await caches.open(CACHE_AUDIO);
    for (const k of await cacheAudio.keys()) {
      if (!audiosAtuais.has(k.url)) { await cacheAudio.delete(k); baixados.delete(k.url); }
    }
    if (guardado.get('autoBaixar', true)) {
      const recentes = [ // revisões primeiro: são pequenas e as mais úteis fora de casa
        ...catalogo.docs.filter((d) => d.categoria === 'revisao' && d.audio).slice(0, 5),
        ...catalogo.docs.filter((d) => d.categoria === 'material' && d.audio && d.data).slice(0, 3)];
      for (const it of recentes) {
        if (!baixados.has(abs(it.audio.url))) {
          setStatus(`Baixando áudio: ${it.titulo}…`);
          await baixarAudio(it);
        }
      }
    }
    setStatus('');
  } catch (e) {
    setStatus(`Sincronização incompleta (${e.message || e}). Tenta de novo ao abrir o app com internet.`);
  }
}

function setStatus(t) {
  statusSync = t;
  const el = $('#status-sync');
  if (el) el.textContent = textoStatus();
}
function textoStatus() {
  if (statusSync) return statusSync;
  return catalogo ? `Conteúdo de ${catalogo.gerado_em}. ${navigator.onLine ? 'Textos disponíveis offline.' : 'Você está offline.'}` : '';
}

async function baixarAudio(item) {
  const url = abs(item.audio.url);
  if (baixando.has(url)) return;
  baixando.set(url, 0);
  atualizarBotaoBaixar(item);
  try {
    const r = await fetch(url, { cache: 'no-store' });
    if (!r.ok || !r.body) throw new Error(`erro ${r.status}`);
    const total = Number(r.headers.get('Content-Length')) || item.audio.bytes;
    const leitor = r.body.getReader();
    const partes = [];
    let recebido = 0;
    for (;;) {
      const { done, value } = await leitor.read();
      if (done) break;
      partes.push(value);
      recebido += value.length;
      baixando.set(url, recebido / total);
      atualizarBotaoBaixar(item);
    }
    const blob = new Blob(partes, { type: 'audio/mpeg' });
    await (await caches.open(CACHE_AUDIO)).put(url, new Response(blob, {
      headers: { 'Content-Type': 'audio/mpeg', 'Content-Length': String(blob.size) },
    }));
    baixados.add(url);
    if (navigator.storage && navigator.storage.persist) navigator.storage.persist();
  } finally {
    baixando.delete(url);
    atualizarBotaoBaixar(item);
  }
}

async function removerAudio(item) {
  const url = abs(item.audio.url);
  await (await caches.open(CACHE_AUDIO)).delete(url);
  baixados.delete(url);
  atualizarBotaoBaixar(item);
}

/* ---------- telas ---------- */

let rolagemInicio = 0;

function setTopo(titulo, comVoltar) {
  $('#titulo-topo').textContent = titulo;
  $('#voltar').hidden = !comVoltar;
  document.title = comVoltar ? `${titulo} · PMPE Ouvir` : 'PMPE Ouvir';
}

function rota() {
  esconderDaqui();
  seguir = true;
  $('#seguir').hidden = true;
  const h = location.hash;
  if (h === '#/questoes') { telaQuestoes(); return; }
  if (h === '#/progresso') { telaProgresso(); return; }
  if (h === '#/destaques') { telaDestaques(); return; }
  if (h === '#/questoes/resolver') { telaResolver(); return; }
  const m = h.match(/^#\/doc\/(.+)$/);
  if (m) telaDoc(decodeURIComponent(m[1]));
  else telaInicio();
}

function seloOffline(it) {
  if (!it.audio) return '';
  return baixados.has(abs(it.audio.url)) ? '<span class="selo ok">offline</span>' : '';
}

const tituloCurto = (it) => (it.categoria === 'revisao' ? it.titulo.replace(/^Revisão rápida: /, '') : it.titulo);

function cartaoMaterial(it) {
  const [dia, data] = (it.subtitulo || '').split(' ');
  const ouvido = guardado.get(`ouvido:${it.id}`, false) ? ' · ✓ ouvido' : '';
  const dur = it.audio ? `${minutos(it.audio.duracao)} de áudio` : `~${minutos(duracaoItem(it))} de leitura`;
  return `<a class="cartao" href="#/doc/${encodeURIComponent(it.id)}">
    <div class="data"><b>${esc(data || dia)}</b>${esc(data ? dia : '')}</div>
    <div class="corpo"><strong>${esc(tituloCurto(it))}</strong><span class="meta">${dur}${ouvido}</span></div>
    ${seloOffline(it)}</a>`;
}

/* Revisões com áudio dos últimos 7 dias (ou as 5 mais recentes), da mais antiga para a mais nova. */
function revisoesDaSemana() {
  const revs = catalogo.docs.filter((d) => d.categoria === 'revisao' && d.audio);
  const limite = new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 10);
  let sel = revs.filter((d) => d.data >= limite);
  if (!sel.length) sel = revs.slice(0, 5);
  return sel.slice().reverse();
}

function secaoRevisoes(lista, filtrando) {
  const semana = filtrando ? [] : revisoesDaSemana();
  const dur = semana.reduce((s, d) => s + d.audio.duracao, 0);
  const visiveis = filtrando ? lista : lista.slice(0, 3);
  const resto = filtrando ? [] : lista.slice(3);
  return `<h2 class="secao">Revisão rápida</h2>
    ${semana.length > 1 ? `<button class="btn primario largo" id="b-semana">▶ Ouvir em sequência as revisões dos últimos 7 dias (${semana.length} · ${minutos(dur)})</button>` : ''}
    ${visiveis.map(cartaoMaterial).join('')}
    ${resto.length ? `<details class="grupo"><summary>Revisões anteriores <small>(${resto.length})</small></summary>
      ${resto.map((it) => `<a href="#/doc/${encodeURIComponent(it.id)}">${esc((it.subtitulo || '').split(' ').pop())} · ${esc(tituloCurto(it))}</a>`).join('')}</details>` : ''}`;
}

/* Toca vários áudios em sequência (fila). */
function tocarSequencia(itens) {
  const ok = itens.filter((it) => it.audio && (navigator.onLine || baixados.has(abs(it.audio.url))));
  if (!ok.length) { setStatus('Sem internet, e estas revisões não foram baixadas.'); return; }
  const [primeiro, ...resto] = ok;
  const comecar = (doc) => iniciarAudio(primeiro, doc, 0, resto.map((d) => d.id));
  if (docs.has(primeiro.id)) comecar(docs.get(primeiro.id)); // sem espera: o iPhone exige o toque
  else obterDoc(primeiro).then(comecar).catch(() => {});
}

function grupos(itens, aberto) {
  const porGrupo = new Map();
  for (const it of itens) {
    const g = it.grupo || 'Outros';
    if (!porGrupo.has(g)) porGrupo.set(g, []);
    porGrupo.get(g).push(it);
  }
  return [...porGrupo].map(([g, lista]) => `<details class="grupo"${aberto ? ' open' : ''}>
    <summary>${esc(g)} <small>(${lista.length})</small></summary>
    ${lista.map((it) => `<a href="#/doc/${encodeURIComponent(it.id)}">${esc(it.titulo)}</a>`).join('')}
  </details>`).join('');
}

function telaInicio() {
  pararLeituraNaTela();
  seguir = true;
  $('#seguir').hidden = true;
  setTopo('PMPE Ouvir', false);
  if (!catalogo) {
    tela.innerHTML = '<p class="aviso">Não foi possível carregar o conteúdo. Abra o app uma vez com internet.</p>';
    return;
  }
  tela.innerHTML = `<div class="busca-caixa">
      <input id="busca" class="busca" type="search" placeholder="Buscar material, lei, assunto ou trecho…" autocomplete="off"
        aria-label="Buscar nos títulos e dentro dos textos" aria-describedby="busca-dica">
      <label for="busca" id="busca-dica" class="busca-dica">
        <span><b>Várias palavras:</b> mostra os trechos que têm todas elas, em qualquer ordem. Ex.: <code>prisão flagrante</code></span>
        <span><b>Frase entre aspas:</b> busca a frase exata. Ex.: <code>"cláusula pétrea"</code></span>
      </label>
    </div>
    <div id="lista"></div>
    <div class="rodape">
      <div id="status-sync">${esc(textoStatus())}</div>
      <label>Ao terminar um áudio:
        <select id="ao-terminar">
          <option value="seguir">tocar a revisão e o próximo material</option>
          <option value="revisao">tocar só a revisão do material</option>
          <option value="parar">parar</option>
        </select></label><br>
      <label><input id="auto" type="checkbox" ${guardado.get('autoBaixar', true) ? 'checked' : ''}> Baixar sozinho o áudio das 5 revisões e dos 3 materiais mais recentes</label>
    </div>`;
  const busca = $('#busca');
  busca.value = guardado.get('busca', '');
  busca.addEventListener('input', () => { guardado.set('busca', busca.value); desenharLista(busca.value); });
  const sel = $('#ao-terminar');
  sel.value = aoTerminar();
  sel.addEventListener('change', () => { guardado.set('aoTerminar', sel.value); if (player.item) mostrarASeguir(); });
  $('#auto').addEventListener('change', (e) => { guardado.set('autoBaixar', e.target.checked); if (e.target.checked) sincronizar(); });
  desenharLista(busca.value);
  requestAnimationFrame(() => window.scrollTo(0, rolagemInicio));
}

function desenharLista(filtro) {
  const f = norm(filtro).trim();
  const itens = catalogo.docs.filter((d) => !f || norm(`${d.titulo} ${d.grupo || ''} ${d.subtitulo || ''}`).includes(f));
  const materiais = itens.filter((d) => d.categoria === 'material' && d.data);
  const revisoes = itens.filter((d) => d.categoria === 'revisao');
  const extras = itens.filter((d) => d.categoria === 'material' && !d.data);
  const plano = itens.filter((d) => d.categoria === 'plano');
  const base = itens.filter((d) => d.categoria === 'base');
  let html = '';

  const ultimo = guardado.get('ultimo', null);
  const itUlt = !f && ultimo && catalogo.docs.find((d) => d.id === ultimo.id);
  if (itUlt) {
    html += `<h2 class="secao">Continuar</h2>
      <a class="cartao continuar" href="#/doc/${encodeURIComponent(itUlt.id)}">
      <div class="corpo"><strong>${esc(itUlt.titulo)}</strong><span class="meta">${esc(ultimo.onde || '')}</span></div><span>▶</span></a>`;
  }
  if (!f) {
    const nDest = contarDestaques();
    const blocos = resumoProgressoHome() + resumoQuestoesHome() + (nDest ? `<a class="cartao cartao-q" href="#/destaques">
      <div class="icone-q" aria-hidden="true">🖍</div><div class="corpo"><strong>Meus destaques</strong>
      <span class="meta">${nDest} ${nDest === 1 ? 'trecho destacado' : 'trechos destacados'}, por disciplina</span></div><span aria-hidden="true">›</span></a>` : '');
    if (blocos) html += `<h2 class="secao">Seu estudo</h2>${blocos}`;
  }
  if (revisoes.length) html += secaoRevisoes(revisoes, !!f);
  if (materiais.length) html += `<h2 class="secao">Material do Dia</h2>${materiais.map(cartaoMaterial).join('')}`;
  if (extras.length || plano.length) html += `<h2 class="secao">Plano, edital e extras</h2>${grupos([...plano, ...extras], !!f)}`;
  if (base.length) html += `<h2 class="secao">Base de Conhecimento</h2>${grupos(base, !!f)}`;
  if (!itens.length) html = f.length >= 3 ? '<p class="aviso">Nenhum título com esse nome.</p>' : '<p class="aviso">Nada encontrado.</p>';
  if (f.length >= 3) html += '<div id="busca-textos" aria-live="polite"><p class="aviso">Buscando dentro dos textos…</p></div>';
  $('#lista').innerHTML = html;
  if (f.length >= 3) agendarBuscaTextos(filtro);
  const bs = $('#b-semana');
  if (bs) {
    const semana = revisoesDaSemana();
    semana.forEach((it) => obterDoc(it).catch(() => {})); // deixa pronto para tocar no toque
    bs.addEventListener('click', () => tocarSequencia(semana));
  }
}

async function telaDoc(id) {
  const item = catalogo && catalogo.docs.find((d) => d.id === id);
  if (!item) { location.hash = '#/'; return; }
  setTopo(item.titulo, true);
  tela.innerHTML = '<p class="aviso">Abrindo…</p>';
  let doc;
  try { doc = await obterDoc(item); } catch {
    tela.innerHTML = '<p class="aviso">Este texto ainda não foi guardado no celular. Abra o app com internet uma vez.</p>';
    return;
  }
  if (!location.hash.endsWith(encodeURIComponent(id))) return; // usuário já saiu

  const pos = guardado.get(`pos:${id}`, 0);
  const posTts = guardado.get(`tts:${id}`, 0);
  const caps = doc.capitulos;
  const rev = item.revisao && catalogo.docs.find((d) => d.id === item.revisao);
  const mat = item.material && catalogo.docs.find((d) => d.id === item.material);
  tela.innerHTML = `
    <div class="acoes">
      ${item.audio ? `<button class="btn primario" id="b-ouvir">▶ ${pos > 5 ? `Continuar de ${fmt(pos)}` : `Ouvir · voz natural · ${minutos(item.audio.duracao)}`}</button>` : ''}
      <button class="btn ${item.audio ? '' : 'primario'}" id="b-tts">🔊 ${posTts > 0 ? 'Continuar com a voz do celular' : 'Ouvir com a voz do celular'}</button>
      ${item.audio ? '<button class="btn" id="b-baixar"></button>' : ''}
      ${item.questoes ? `<button class="btn" id="b-questoes">✍ Resolver as ${item.questoes} questões</button>` : ''}
      ${rev ? `<a class="btn" href="#/doc/${encodeURIComponent(rev.id)}">⚡ Revisão rápida · ${minutos(duracaoItem(rev))}</a>` : ''}
      ${mat ? `<a class="btn" href="#/doc/${encodeURIComponent(mat.id)}">📄 Material completo</a>` : ''}
      ${item.audio ? '<button class="btn" id="b-depois">➕ Ouvir depois</button>' : ''}
      ${item.categoria === 'material' ? `<button class="btn" id="b-estudado" aria-pressed="${concluido(item)}">${concluido(item) ? '✓ Estudado' : '☐ Marcar como estudado'}</button>` : ''}
    </div>
    <p class="aviso" id="aviso-doc">${item.audio ? '' : 'Este texto é lido pela voz do celular. A tela fica acesa durante a leitura.'}</p>
    <details class="capitulos"><summary>Capítulos (${caps.length})</summary><ol>
      ${caps.map((c, i) => `<li data-i="${i}"><button>${esc(c.titulo)}${c.inicio != null ? ` <small>${fmt(c.inicio)}</small>` : ''}</button></li>`).join('')}
    </ol></details>
    <article>${doc.html}</article>`;
  window.scrollTo(0, 0);

  const ouvir = $('#b-ouvir');
  if (ouvir) ouvir.addEventListener('click', () => iniciarAudio(item, doc, null));
  const art = tela.querySelector('article');
  art.addEventListener('click', (e) => {
    if (e.target.closest('a, button, summary, input') || String(window.getSelection() || '').trim()) return;
    const nota = e.target.closest('.nota-bloco');
    if (nota) {
      const alvo = art.querySelector(`[data-f="${nota.dataset.notaDe}"]`);
      if (alvo) abrirEditorNota(item, alvo);
      return;
    }
    const bloco = e.target.closest('[data-f]');
    if (!bloco) { esconderDaqui(); return; }
    mostrarDaqui(bloco, e.clientY, item, doc);
  });
  aplicarDestaques(item);
  if (irParaDestaque && irParaDestaque.id === id) {
    const el = irParaDestaque.confiarF // vindo da busca: o número do bloco é do mesmo build
      ? art.querySelector(`[data-f="${irParaDestaque.h.f}"]`) : acharBloco(art, irParaDestaque.h);
    irParaDestaque = null;
    if (el) {
      seguir = false;
      el.scrollIntoView({ block: 'center' });
      el.classList.add('escolhido');
      setTimeout(() => el.classList.remove('escolhido'), 2500);
    }
  }
  const aviso = $('#aviso-doc');
  aviso.textContent = `${aviso.textContent} Dica: toque num parágrafo para ouvir daqui, destacar ou anotar.`.trim();
  const bd = $('#b-depois');
  if (bd) bd.addEventListener('click', () => {
    if (!disponivel(item)) { $('#aviso-doc').textContent = 'Sem internet e o áudio não foi baixado.'; return; }
    $('#aviso-doc').textContent = ouvirDepois(item);
  });
  const be = $('#b-estudado');
  if (be) be.addEventListener('click', () => {
    const novo = !concluido(item);
    guardado.set(`estudado:${item.id}`, novo);
    if (!novo) guardado.set(`ouvido:${item.id}`, false);
    if (novo) registrarAtividade({ m: 1 });
    be.textContent = novo ? '✓ Estudado' : '☐ Marcar como estudado';
    be.setAttribute('aria-pressed', String(novo));
  });
  const bq = $('#b-questoes');
  if (bq) bq.addEventListener('click', async () => {
    try {
      const todas = await obterQuestoes();
      const titulo = item.subtitulo ? `Material de ${item.subtitulo.split(' ').pop()}` : item.titulo;
      iniciarSessao(todas.filter((q) => q.doc === item.id).map((q) => q.id), titulo);
    } catch { $('#aviso-doc').textContent = 'As questões ainda não foram guardadas no celular. Abra o app com internet.'; }
  });
  $('#b-tts').addEventListener('click', () => iniciarTts(item, doc, null));
  if (item.audio) {
    atualizarBotaoBaixar(item);
    $('#b-baixar').addEventListener('click', () => {
      const url = abs(item.audio.url);
      if (baixando.has(url)) return;
      if (baixados.has(url)) removerAudio(item);
      else baixarAudio(item).catch(() => { $('#aviso-doc').textContent = 'Não deu para baixar agora. Confira a internet.'; });
    });
  }
  tela.querySelectorAll('.capitulos li').forEach((li) => li.addEventListener('click', () => {
    const i = Number(li.dataset.i);
    seguir = true;
    $('#seguir').hidden = true;
    if (player.item && player.item.id === id) irParaCapitulo(i);
    else if (item.audio && (navigator.onLine || baixados.has(abs(item.audio.url)))) iniciarAudio(item, doc, i);
    else iniciarTts(item, doc, i);
    const alvo = document.getElementById(`cap-${i}`);
    if (alvo) levarAte(alvo, true);
  }));
  marcarCapituloNaTela();
  seguir = true;
  $('#seguir').hidden = true;
  if (docNaTela()) marcarLeitura(player.f, estaTocando());
}

function atualizarBotaoBaixar(item) {
  const b = $('#b-baixar');
  if (!b || !item.audio || !location.hash.endsWith(encodeURIComponent(item.id))) return;
  const url = abs(item.audio.url);
  const mb = (item.audio.bytes / 1e6).toFixed(0);
  if (baixando.has(url)) b.textContent = `Baixando… ${Math.round(baixando.get(url) * 100)}%`;
  else if (baixados.has(url)) b.textContent = '✓ Áudio no celular (remover)';
  else b.textContent = `⬇ Baixar áudio (${mb} MB)`;
}

/* ---------- busca dentro dos textos ---------- */
/* Índice: { ids: [doc], b: [[i doc, bloco, texto]] }. A versão normalizada (sem acento, minúscula) tem o
   mesmo tamanho do texto original, para marcar o termo no lugar certo. */

let indiceBusca = null;
let buscaTimer = null;
let buscaSeq = 0;

function normPos(s) {
  let o = '';
  for (let i = 0; i < s.length; i++) {
    const n = s[i].normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    o += n.length === 1 ? n : (n[0] || ' ');
  }
  return o;
}

async function obterIndiceBusca() {
  if (indiceBusca) return indiceBusca;
  const info = catalogo && catalogo.busca;
  if (!info) return null;
  let r = await caches.match(abs(info.arquivo));
  if (!r) {
    r = await fetch(info.arquivo);
    if (!r.ok) throw new Error('índice indisponível');
    try { (await caches.open(CACHE_DADOS)).put(abs(info.arquivo), r.clone()); } catch { /* ok */ }
  }
  const dados = await r.json();
  dados.norm = dados.b.map((x) => normPos(x[2]));
  indiceBusca = dados;
  return dados;
}

/* Palavras soltas (todas precisam aparecer) e "frases entre aspas". */
function termosBusca(q) {
  const out = [];
  for (const m of q.matchAll(/"([^"]+)"|(\S+)/g)) {
    const t = normPos((m[1] || m[2]).trim());
    if (t.length >= 2) out.push(t);
  }
  return out;
}

function trechoMarcado(texto, norm, termos) {
  let pos = Math.min(...termos.map((t) => { const p = norm.indexOf(t); return p < 0 ? Infinity : p; }));
  if (!isFinite(pos)) pos = 0;
  const ini = Math.max(0, pos - 70);
  const fim = Math.min(texto.length, pos + 150);
  const marcas = [];
  for (const t of termos) {
    let p = norm.indexOf(t, ini);
    while (p >= 0 && p < fim) { marcas.push([p, Math.min(p + t.length, fim)]); p = norm.indexOf(t, p + t.length); }
  }
  marcas.sort((a, b) => a[0] - b[0]);
  let html = ini > 0 ? '…' : '';
  let cur = ini;
  for (const [a, b] of marcas) {
    if (a < cur) continue;
    html += `${esc(texto.slice(cur, a))}<mark>${esc(texto.slice(a, b))}</mark>`;
    cur = b;
  }
  return html + esc(texto.slice(cur, fim)) + (fim < texto.length ? '…' : '');
}

function agendarBuscaTextos(q) {
  clearTimeout(buscaTimer);
  const seq = ++buscaSeq;
  buscaTimer = setTimeout(() => buscarTextos(q, seq), 250);
}

async function buscarTextos(q, seq) {
  let idx;
  try { idx = await obterIndiceBusca(); } catch { idx = null; }
  const alvo = $('#busca-textos');
  if (seq !== buscaSeq || !alvo) return;
  if (!idx) { alvo.innerHTML = '<p class="aviso">A busca nos textos precisa ser baixada: abra o app com internet uma vez.</p>'; return; }
  const termos = termosBusca(q);
  if (!termos.length) { alvo.innerHTML = ''; return; }
  const porDoc = new Map();
  idx.b.forEach((x, i) => {
    const n = idx.norm[i];
    if (!termos.every((t) => n.includes(t))) return;
    const id = idx.ids[x[0]];
    if (!porDoc.has(id)) porDoc.set(id, []);
    porDoc.get(id).push({ f: x[1], texto: x[2], norm: n });
  });
  const grupos = [...porDoc]
    .map(([id, l]) => ({ it: catalogo.docs.find((d) => d.id === id), l }))
    .filter((g) => g.it)
    .sort((a, b) => b.l.length - a.l.length);
  const total = grupos.reduce((s, g) => s + g.l.length, 0);
  if (!total) { alvo.innerHTML = '<h2 class="secao">Dentro dos textos</h2><p class="aviso">Nenhum trecho encontrado.</p>'; return; }
  const refs = [];
  const botao = (g, t) => {
    refs.push({ id: g.it.id, f: t.f, texto: t.texto });
    return `<button class="trecho" data-r="${refs.length - 1}">${trechoMarcado(t.texto, t.norm, termos)}</button>`;
  };
  const mostrar = grupos.slice(0, 30);
  alvo.innerHTML = `<h2 class="secao">Dentro dos textos · ${total} ${total === 1 ? 'trecho' : 'trechos'} em ${grupos.length} ${grupos.length === 1 ? 'documento' : 'documentos'}</h2>
    ${mostrar.map((g) => `<div class="cartao resultado"><div class="corpo">
      <strong>${esc(g.it.subtitulo ? `${g.it.subtitulo.split(' ').pop()} · ` : '')}${esc(g.it.titulo)}</strong>
      <span class="meta">${esc(g.it.grupo || (g.it.categoria === 'material' ? 'Material do Dia' : ''))} · ${g.l.length} ${g.l.length === 1 ? 'trecho' : 'trechos'}</span>
      ${g.l.slice(0, 3).map((t) => botao(g, t)).join('')}
      ${g.l.length > 3 ? `<details class="mais-trechos"><summary>Mais ${g.l.length - 3} ${g.l.length - 3 === 1 ? 'trecho' : 'trechos'}</summary>
        ${g.l.slice(3, 40).map((t) => botao(g, t)).join('')}</details>` : ''}
    </div></div>`).join('')}
    ${grupos.length > mostrar.length ? `<p class="aviso">Mais ${grupos.length - mostrar.length} documentos. Refine a busca com mais palavras ou "frase entre aspas".</p>` : ''}`;
  alvo.querySelectorAll('.trecho').forEach((b) => b.addEventListener('click', () => {
    const r = refs[Number(b.dataset.r)];
    irParaDestaque = { id: r.id, h: { f: r.f, texto: r.texto }, confiarF: true };
    location.hash = `#/doc/${encodeURIComponent(r.id)}`;
  }));
}

/* ---------- progresso ---------- */
/* guardado 'atividade': { 'AAAA-MM-DD': { s: segundos ouvindo, q: questões, a: acertos, m: materiais marcados } } */

const doisDig = (n) => String(n).padStart(2, '0');
const dataISO = (d = new Date()) => `${d.getFullYear()}-${doisDig(d.getMonth() + 1)}-${doisDig(d.getDate())}`;
const deISO = (s) => { const [a, m, d] = s.split('-').map(Number); return new Date(a, m - 1, d); };
const diasEntre = (de, ate) => Math.round((deISO(ate) - deISO(de)) / 864e5);
const DIAS_CURTOS = ['dom.', 'seg.', 'ter.', 'qua.', 'qui.', 'sex.', 'sáb.'];
const dataCurta = (s) => `${DIAS_CURTOS[deISO(s).getDay()]} ${s.slice(8, 10)}/${s.slice(5, 7)}`;

let segPendentes = 0;
let ultimoTempoAudio = null;

function registrarAtividade(valores) {
  const at = guardado.get('atividade', {});
  const k = dataISO();
  const dia = at[k] || {};
  for (const [campo, v] of Object.entries(valores)) dia[campo] = Math.round(((dia[campo] || 0) + v) * 10) / 10;
  at[k] = dia;
  guardado.set('atividade', at);
}
function registrarAudioPendente() {
  if (segPendentes >= 1) registrarAtividade({ s: segPendentes });
  segPendentes = 0;
}

const estudouNoDia = (dia) => !!dia && ((dia.s || 0) >= 60 || (dia.q || 0) > 0 || (dia.m || 0) > 0);
const concluido = (it) => guardado.get(`estudado:${it.id}`, false) || guardado.get(`ouvido:${it.id}`, false);
const sessoesDeEstudo = () => ((catalogo.plano && catalogo.plano.sessoes) || []).filter((s) => s.h + s.r > 0);

/* Dias de estudo do plano seguidos com atividade; hoje sem atividade ainda não quebra a sequência. */
function sequencia() {
  const at = guardado.get('atividade', {});
  const hoje = dataISO();
  let n = 0;
  for (const s of sessoesDeEstudo().filter((x) => x.data <= hoje).reverse()) {
    if (estudouNoDia(at[s.data])) n++;
    else if (s.data !== hoje) break;
  }
  return n;
}

function resumoProgressoHome() {
  const datas = catalogo.plano || {};
  if (!datas.prova) return '';
  const faltam = diasEntre(dataISO(), datas.prova);
  const seq = sequencia();
  return `<a class="cartao cartao-q" href="#/progresso">
      <div class="icone-q" aria-hidden="true">📊</div>
      <div class="corpo"><strong>${faltam > 0 ? `Faltam ${faltam} dias para a prova` : 'Dia da prova'}</strong>
        <span class="meta">${seq ? `Sequência: ${seq} ${seq === 1 ? 'dia' : 'dias'} de estudo` : 'Veja o seu progresso no plano'}</span></div>
      <span aria-hidden="true">›</span></a>`;
}

function telaProgresso() {
  pararRelogio();
  registrarAudioPendente();
  setTopo('Progresso', true);
  const plano = catalogo.plano || {};
  const hoje = dataISO();
  const at = guardado.get('atividade', {});
  const sessoes = sessoesDeEstudo();
  const faltam = plano.prova ? diasEntre(hoje, plano.prova) : null;
  const diasRestantes = sessoes.filter((s) => s.data >= hoje).length;
  const minHoje = Math.round(((at[hoje] && at[hoje].s) || 0) / 60);
  let minSemana = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    minSemana += ((at[dataISO(d)] && at[dataISO(d)].s) || 0) / 60;
  }
  const seq = sequencia();

  // gráfico: minutos ouvindo nos últimos 14 dias
  const dias = [];
  for (let i = 13; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); dias.push(dataISO(d)); }
  const valores = dias.map((d) => Math.round(((at[d] && at[d].s) || 0) / 60));
  const maximo = Math.max(10, ...valores);
  const descricaoDia = (d, v) => {
    const a = at[d] || {};
    const q = a.q ? ` · ${a.q} ${a.q === 1 ? 'questão' : 'questões'} (${a.a || 0} certas)` : '';
    return `${dataCurta(d)}: ${v} min ouvindo${q}`;
  };
  const totalPeriodo = valores.reduce((s, v) => s + v, 0);

  // plano por disciplina: horas já previstas até hoje e materiais concluídos
  const porDisc = new Map();
  const soma = (nome, campo, s) => {
    if (!porDisc.has(nome)) porDisc.set(nome, { total: 0, ate: 0, mats: 0, feitos: 0 });
    const x = porDisc.get(nome);
    x.total += s[campo];
    if (s.data <= hoje) x.ate += s[campo];
  };
  for (const s of sessoes) {
    if (s.h) soma(s.disciplina, 'h', s);
    if (s.r) soma('Redação', 'r', s);
  }
  const materiais = catalogo.docs.filter((d) => d.categoria === 'material' && d.data);
  for (const m of materiais) {
    const s = sessoes.find((x) => x.data === m.data && porDisc.has(x.disciplina));
    if (!s) continue;
    const x = porDisc.get(s.disciplina);
    x.mats++;
    if (concluido(m)) x.feitos++;
  }
  const fmtH = (h) => String(Math.round(h * 10) / 10).replace('.', ',');
  const proximas = sessoes.filter((s) => s.data >= hoje).slice(0, 5);
  const simulados = (plano.simulados || []).filter((s) => s.situacao === 'pendente' && s.data >= hoje);

  tela.innerHTML = `
    ${faltam != null ? `<div class="contagem">
      <b>${Math.max(faltam, 0)}</b>
      <span>${faltam === 1 ? 'dia' : 'dias'} para a prova · ${esc(dataCurta(plano.prova))}/${plano.prova.slice(0, 4)}</span>
      <small>${diasRestantes} dias de estudo no plano${simulados.map((s) => ` · ${esc(s.nome)} em ${s.data.slice(8, 10)}/${s.data.slice(5, 7)} (faltam ${diasEntre(hoje, s.data)} dias)`).join('')}</small>
    </div>` : ''}
    <div class="placar">
      <div><b>${seq}</b><span>${seq === 1 ? 'dia seguido' : 'dias seguidos'}</span></div>
      <div><b>${minHoje}</b><span>min hoje</span></div>
      <div><b>${Math.round(minSemana)}</b><span>min em 7 dias</span></div>
    </div>

    <figure class="grafico">
      <figcaption>Minutos ouvindo por dia · últimos 14 dias</figcaption>
      <div class="grafico-area">
        <span class="grafico-max">${maximo} min</span>
        <div class="barras" role="group" aria-label="Minutos ouvindo nos últimos 14 dias: ${totalPeriodo} no total">
          ${dias.map((d, i) => `<button class="barra-dia${d === hoje ? ' hoje' : ''}" data-i="${i}" aria-label="${esc(descricaoDia(d, valores[i]))}" title="${esc(descricaoDia(d, valores[i]))}">
            <span class="b" style="height:${valores[i] ? Math.max(3, (valores[i] / maximo) * 100) : 0}%"></span></button>`).join('')}
        </div>
        <div class="rotulos" aria-hidden="true">${dias.map((d) => `<span${d === hoje ? ' class="hoje"' : ''}>${d.slice(8, 10)}</span>`).join('')}</div>
      </div>
      <p class="dica" id="g-dica" aria-live="polite">${totalPeriodo ? 'Toque numa barra para ver o dia.' : 'O app começa a contar a partir de agora: ouça um material ou resolva questões.'}</p>
    </figure>

    <h2 class="secao">Plano por disciplina</h2>
    <p class="aviso">Horas que o plano previu até hoje e materiais que você concluiu (ouviu até o fim ou marcou como estudado).</p>
    ${[...porDisc].map(([nome, x]) => `<div class="cartao linha-q"><div class="corpo"><strong>${esc(nome)}</strong>
      <span class="meta">${fmtH(x.ate)} de ${fmtH(x.total)} h do plano${x.mats ? ` · ${x.feitos} de ${x.mats} materiais concluídos` : ''}</span>
      <span class="barra" aria-hidden="true"><span style="width:${x.total ? Math.round((x.ate / x.total) * 100) : 0}%"></span></span></div></div>`).join('')}

    ${proximas.length ? `<h2 class="secao">Próximas sessões</h2>
      ${proximas.map((s) => `<div class="cartao"><div class="data"><b>${s.data.slice(8, 10)}/${s.data.slice(5, 7)}</b>${esc(DIAS_CURTOS[deISO(s.data).getDay()])}</div>
        <div class="corpo"><strong>${esc(s.disciplina)}</strong><span class="meta">${esc(s.sessao)}${s.topicos ? ` · ${esc(s.topicos)}` : ''}</span></div></div>`).join('')}` : ''}

    <p class="rodape">A atividade é registrada só neste celular.</p>`;

  tela.querySelectorAll('.barra-dia').forEach((b) => b.addEventListener('click', () => {
    tela.querySelectorAll('.barra-dia').forEach((x) => x.classList.toggle('ativa', x === b));
    $('#g-dica').textContent = b.getAttribute('aria-label');
  }));
}

/* ---------- questões ---------- */
/* Respostas ficam em guardado 'respostas': { id: { u: última, ok: acertou a última, n: tentativas, a: acertos, t: quando } }.
   O caderno de erros são as questões cuja última resposta foi errada. */

let questoes = null;
let relogioQ = null;

async function obterQuestoes() {
  if (questoes) return questoes;
  const info = catalogo && catalogo.questoes;
  if (!info) return [];
  let r = await caches.match(abs(info.arquivo));
  if (!r) {
    r = await fetch(info.arquivo);
    if (!r.ok) throw new Error('questões indisponíveis');
    try { (await caches.open(CACHE_DADOS)).put(abs(info.arquivo), r.clone()); } catch { /* ok */ }
  }
  questoes = await r.json();
  return questoes;
}

const respostas = () => guardado.get('respostas', {});
const incluirAutorais = () => guardado.get('incluirAutorais', true);
const filtrarAutorais = (lista) => (incluirAutorais() ? lista : lista.filter((q) => q.tipo === 'oficial'));
const rotuloResp = (k) => (k === 'CERTO' ? 'Certo' : k === 'ERRADO' ? 'Errado' : k);

function estatisticas(lista) {
  const resp = respostas();
  let resolvidas = 0, tentativas = 0, acertos = 0, erros = 0;
  for (const q of lista) {
    const r = resp[q.id];
    if (!r) continue;
    resolvidas++;
    tentativas += r.n;
    acertos += r.a;
    if (!r.ok) erros++;
  }
  return { total: lista.length, resolvidas, erros, pct: tentativas ? Math.round((acertos / tentativas) * 100) : null };
}

function resumoQuestoesHome() {
  const total = catalogo.questoes ? catalogo.questoes.total : 0;
  if (!total) return '';
  const vals = Object.values(respostas());
  const erros = vals.filter((r) => !r.ok).length;
  return `<a class="cartao cartao-q" href="#/questoes">
      <div class="icone-q" aria-hidden="true">✍</div>
      <div class="corpo"><strong>Questões</strong>
        <span class="meta">${total} questões · ${vals.length} resolvidas${erros ? ` · ${erros} no caderno de erros` : ''}</span></div>
      <span aria-hidden="true">›</span></a>`;
}

function embaralhar(lista) {
  const a = lista.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function iniciarSessao(ids, titulo) {
  if (!ids.length) return;
  guardado.set('sessaoQ', { titulo, ids, idx: 0, certas: 0, feitas: 0, tempo: 0, erradas: [], resp: null });
  if (location.hash === '#/questoes/resolver') rota();
  else location.hash = '#/questoes/resolver';
}

async function telaQuestoes() {
  pararRelogio();
  setTopo('Questões', true);
  tela.innerHTML = '<p class="aviso">Carregando questões…</p>';
  let todas;
  try { todas = await obterQuestoes(); } catch {
    tela.innerHTML = '<p class="aviso">As questões ainda não foram guardadas no celular. Abra o app com internet uma vez.</p>';
    return;
  }
  if (location.hash !== '#/questoes') return;
  const lista = filtrarAutorais(todas);
  const resp = respostas();
  const st = estatisticas(lista);
  const novas = lista.filter((q) => !resp[q.id]);
  const erradas = lista.filter((q) => resp[q.id] && !resp[q.id].ok);
  const porDisc = new Map();
  for (const q of lista) {
    if (!porDisc.has(q.disciplina)) porDisc.set(q.disciplina, []);
    porDisc.get(q.disciplina).push(q);
  }
  const disciplinas = [...porDisc].sort((a, b) => a[0].localeCompare(b[0], 'pt-BR'));
  const materiais = catalogo.docs.filter((d) => d.questoes);
  const sessao = guardado.get('sessaoQ', null);
  const emAndamento = sessao && sessao.idx < sessao.ids.length;

  const linha = (nome, l, attr) => {
    const s = estatisticas(l);
    const pr = s.total ? Math.round((s.resolvidas / s.total) * 100) : 0;
    return `<button class="cartao linha-q" ${attr}><div class="corpo"><strong>${esc(nome)}</strong>
      <span class="meta">${s.resolvidas} de ${s.total} resolvidas${s.pct != null ? ` · ${s.pct}% de acerto` : ''}${s.erros ? ` · ${s.erros} para revisar` : ''}</span>
      <span class="barra" aria-hidden="true"><span style="width:${pr}%"></span></span></div><span aria-hidden="true">›</span></button>`;
  };

  tela.innerHTML = `
    <div class="placar">
      <div><b>${st.resolvidas}</b><span>de ${st.total} resolvidas</span></div>
      <div><b>${st.pct != null ? `${st.pct}%` : '–'}</b><span>de acerto</span></div>
      <div><b>${st.erros}</b><span>no caderno de erros</span></div>
    </div>
    ${emAndamento ? `<a class="cartao continuar" href="#/questoes/resolver"><div class="corpo"><strong>Continuar: ${esc(sessao.titulo)}</strong>
      <span class="meta">questão ${sessao.idx + 1} de ${sessao.ids.length}</span></div><span aria-hidden="true">▶</span></a>` : ''}
    <div class="acoes">
      <button class="btn primario" id="q-novas" ${novas.length ? '' : 'disabled'}>▶ Não resolvidas (${novas.length})</button>
      <button class="btn" id="q-erros" ${erradas.length ? '' : 'disabled'}>Caderno de erros (${erradas.length})</button>
      <button class="btn" id="q-aleatorias">10 aleatórias</button>
    </div>
    <h2 class="secao">Por disciplina</h2>
    ${disciplinas.map(([d, l], i) => linha(d, l, `data-disc="${i}"`)).join('')}
    <h2 class="secao">Por material do dia</h2>
    ${materiais.map((d) => linha(`${(d.subtitulo || '').split(' ').pop()} · ${d.titulo}`, todas.filter((q) => q.doc === d.id), `data-doc="${esc(d.id)}"`)).join('')}
    <div class="rodape">
      <label><input type="checkbox" id="q-autorais" ${incluirAutorais() ? 'checked' : ''}> Incluir questões autorais (no estilo AOCP, não oficiais)</label>
      <div><button class="btn-link" id="q-zerar">Apagar meu histórico de questões</button></div>
    </div>`;

  const ordemTreino = (l) => [...l.filter((q) => !resp[q.id]), ...l.filter((q) => resp[q.id] && !resp[q.id].ok), ...l.filter((q) => resp[q.id] && resp[q.id].ok)];
  $('#q-novas').addEventListener('click', () => iniciarSessao(novas.map((q) => q.id), 'Não resolvidas'));
  $('#q-erros').addEventListener('click', () => iniciarSessao(embaralhar(erradas).map((q) => q.id), 'Caderno de erros'));
  $('#q-aleatorias').addEventListener('click', () => iniciarSessao(embaralhar(lista).slice(0, 10).map((q) => q.id), '10 aleatórias'));
  tela.querySelectorAll('[data-disc]').forEach((b) => b.addEventListener('click', () => {
    const [nome, l] = disciplinas[Number(b.dataset.disc)];
    iniciarSessao(ordemTreino(l).map((q) => q.id), nome);
  }));
  tela.querySelectorAll('[data-doc]').forEach((b) => b.addEventListener('click', () => {
    const d = materiais.find((x) => x.id === b.dataset.doc);
    iniciarSessao(todas.filter((q) => q.doc === d.id).map((q) => q.id), `Material de ${(d.subtitulo || '').split(' ').pop()}`);
  }));
  $('#q-autorais').addEventListener('change', (e) => { guardado.set('incluirAutorais', e.target.checked); telaQuestoes(); });
  $('#q-zerar').addEventListener('click', () => {
    if (!window.confirm('Apagar todas as suas respostas e o caderno de erros? Não dá para desfazer.')) return;
    guardado.set('respostas', {});
    guardado.set('sessaoQ', null);
    telaQuestoes();
  });
}

async function telaResolver() {
  setTopo('Questões', true);
  const s = guardado.get('sessaoQ', null);
  if (!s) { location.hash = '#/questoes'; return; }
  let todas;
  try { todas = await obterQuestoes(); } catch {
    tela.innerHTML = '<p class="aviso">As questões ainda não foram guardadas no celular. Abra o app com internet uma vez.</p>';
    return;
  }
  if (location.hash !== '#/questoes/resolver') return;
  const mapa = new Map(todas.map((q) => [q.id, q]));
  s.ids = s.ids.filter((id) => mapa.has(id));
  if (s.idx >= s.ids.length) { telaFimSessao(s); return; }
  const q = mapa.get(s.ids[s.idx]);
  const fonte = [q.fonte, q.meta].filter(Boolean).join(' · ');

  tela.innerHTML = `
    <div class="q-topo"><span>${esc(s.titulo)} · <b>${s.idx + 1}</b> de ${s.ids.length}</span><span id="q-relogio" aria-label="Tempo nesta questão"></span></div>
    <div class="q-progresso" aria-hidden="true"><span style="width:${(s.idx / s.ids.length) * 100}%"></span></div>
    <div class="q-fonte"><span class="selo ${q.tipo === 'oficial' ? 'oficial' : 'autoral'}">${q.tipo === 'oficial' ? 'Oficial' : 'Autoral · não oficial'}</span>
      ${esc(q.disciplina)}${q.tema ? ` · ${esc(q.tema)}` : ''}</div>
    <p class="q-meta">${esc(fonte)}${fonte ? ' · ' : ''}${esc(q.origem)}</p>
    ${q.apoio ? `<details class="q-apoio"><summary>Texto de apoio</summary><div class="q-html">${q.apoio}</div></details>` : ''}
    <div class="q-html q-enunciado">${q.enunciado}</div>
    <div class="q-alts" role="radiogroup" aria-label="Alternativas">
      ${q.alternativas.map(([k, html]) => `<div class="q-alt">
        <button class="alt" data-k="${k}" role="radio" aria-checked="false"><span class="letra">${k.length > 1 ? k[0] : k}</span><span class="txt">${html}</span></button>
        ${k.length === 1 ? `<button class="riscar" aria-label="Riscar a alternativa ${k}" title="Riscar alternativa">✂</button>` : ''}
      </div>`).join('')}
    </div>
    <div id="q-resultado" aria-live="polite"></div>
    <div class="q-botoes"><button id="q-acao" class="btn primario" disabled>Responder</button></div>`;
  window.scrollTo(0, 0);

  let escolhida = null;
  tela.querySelectorAll('.alt').forEach((b) => b.addEventListener('click', () => {
    if (s.resp) return;
    escolhida = b.dataset.k;
    tela.querySelectorAll('.alt').forEach((x) => {
      x.classList.toggle('escolhida', x === b);
      x.setAttribute('aria-checked', String(x === b));
    });
    $('#q-acao').disabled = false;
  }));
  tela.querySelectorAll('.riscar').forEach((b) => b.addEventListener('click', () => b.parentElement.classList.toggle('riscada')));
  $('#q-acao').addEventListener('click', () => {
    if (!s.resp) { responder(s, q, escolhida); return; }
    s.idx++;
    s.resp = null;
    guardado.set('sessaoQ', s);
    telaResolver();
  });
  if (s.resp) mostrarCorrecao(s, q);
  else iniciarRelogio();
}

function responder(s, q, k) {
  if (!k || s.resp) return;
  const ok = k === q.resposta;
  const seg = relogioQ ? Math.round((Date.now() - relogioQ.inicio) / 1000) : 0;
  pararRelogio();
  s.resp = k;
  s.feitas++;
  s.tempo += seg;
  if (ok) s.certas++; else s.erradas.push(q.id);
  guardado.set('sessaoQ', s);
  const resp = respostas();
  const r = resp[q.id] || { n: 0, a: 0 };
  resp[q.id] = { u: k, ok, n: r.n + 1, a: r.a + (ok ? 1 : 0), t: Date.now() };
  guardado.set('respostas', resp);
  registrarAtividade({ q: 1, a: ok ? 1 : 0 });
  mostrarCorrecao(s, q);
}

function mostrarCorrecao(s, q) {
  const ok = s.resp === q.resposta;
  tela.querySelectorAll('.alt').forEach((b) => {
    b.disabled = true;
    b.classList.toggle('certa', b.dataset.k === q.resposta);
    b.classList.toggle('errada', b.dataset.k === s.resp && !ok);
    b.classList.toggle('escolhida', b.dataset.k === s.resp);
  });
  tela.querySelectorAll('.riscar').forEach((b) => { b.disabled = true; });
  const naCatalogo = q.doc && catalogo.docs.some((d) => d.id === q.doc);
  $('#q-resultado').innerHTML = `
    <div class="q-veredito ${ok ? 'ok' : 'erro'}">${ok ? '✓ Você acertou!' : `✗ Você marcou ${rotuloResp(s.resp)}. Resposta: ${rotuloResp(q.resposta)}`}</div>
    ${q.comentario ? `<div class="q-comentario"><h3>Comentário</h3><div class="q-html">${q.comentario}</div></div>` : ''}
    ${naCatalogo ? `<p><a class="btn-link" href="#/doc/${encodeURIComponent(q.doc)}">Abrir o material desta questão</a></p>` : ''}`;
  const b = $('#q-acao');
  b.textContent = s.idx + 1 >= s.ids.length ? 'Ver resultado' : 'Próxima questão ›';
  b.disabled = false;
}

function telaFimSessao(s) {
  pararRelogio();
  const pct = s.feitas ? Math.round((s.certas / s.feitas) * 100) : 0;
  tela.innerHTML = `
    <div class="q-fim">
      <p class="q-fim-pct">${pct}%</p>
      <p>Você acertou <b>${s.certas}</b> de <b>${s.feitas}</b> ${s.feitas === 1 ? 'questão' : 'questões'} em “${esc(s.titulo)}”.</p>
      <p class="meta">Tempo médio por questão: ${fmt(s.feitas ? s.tempo / s.feitas : 0)}</p>
    </div>
    <div class="acoes">
      ${s.erradas.length ? `<button class="btn primario" id="q-refazer">Refazer as que errei (${s.erradas.length})</button>` : ''}
      <button class="btn" id="q-painel">Voltar às questões</button>
    </div>`;
  const refazer = $('#q-refazer');
  if (refazer) refazer.addEventListener('click', () => iniciarSessao(s.erradas.slice(), 'Refazer as que errei'));
  $('#q-painel').addEventListener('click', () => { guardado.set('sessaoQ', null); location.hash = '#/questoes'; });
}

function iniciarRelogio() {
  pararRelogio();
  const el = $('#q-relogio');
  if (el) el.textContent = '0:00';
  relogioQ = { inicio: Date.now(), id: null };
  relogioQ.id = setInterval(() => {
    const e = $('#q-relogio');
    if (!e || !relogioQ) { pararRelogio(); return; }
    e.textContent = fmt((Date.now() - relogioQ.inicio) / 1000);
  }, 1000);
}
function pararRelogio() {
  if (relogioQ && relogioQ.id) clearInterval(relogioQ.id);
  if (relogioQ) relogioQ.id = null;
}

/* ---------- reprodutor ---------- */

const player = { modo: null, item: null, doc: null, cap: 0, f: -1, marcas: [], fila: [] };
let velocidade = guardado.get('velocidade', 1);
let ultimoSalvo = 0;

function mostrarPlayer() {
  $('#player').hidden = false;
  $('#player').classList.toggle('tts', player.modo === 'tts');
  document.body.classList.add('tocando');
  const naFila = player.fila && player.fila.length;
  $('#p-titulo').textContent = player.item.titulo + (naFila ? ` (+${naFila} na sequência)` : '');
  $('#p-vel').textContent = `${String(velocidade).replace('.', ',')}×`;
  $('#p-voltar').textContent = player.modo === 'tts' ? '⟲' : '−15';
  $('#p-avancar').textContent = player.modo === 'tts' ? '⟳' : '+30';
  aoMudarCapitulo();
  mostrarASeguir();
}

function pararTudo() {
  if (player.modo === 'audio') { salvarPosicao(true); audio.pause(); }
  if (player.modo === 'tts') ttsParar();
  player.modo = null;
}

function iniciarAudio(item, doc, cap, fila = [], inicioForcado = null) {
  const url = abs(item.audio.url);
  if (!navigator.onLine && !baixados.has(url)) {
    const av = $('#aviso-doc');
    if (av) av.textContent = 'Sem internet e o áudio não foi baixado. Use a voz do celular.';
    return;
  }
  pararTudo();
  Object.assign(player, { modo: 'audio', item, doc, cap: 0, f: -1, marcas: [], fila: fila.slice() });
  doc.capitulos.forEach((c) => (c.t || []).forEach((t, i) => {
    const f = (c.f || [])[i];
    if (f != null && f >= 0) player.marcas.push([t, f]);
  }));
  const inicio = inicioForcado != null ? inicioForcado
    : cap != null ? (doc.capitulos[cap].inicio || 0) : guardado.get(`pos:${item.id}`, 0);
  player.cap = capituloNoTempo(inicio);
  registrarAudioPendente();
  ultimoTempoAudio = null;
  audio.src = item.audio.url;
  audio.playbackRate = velocidade;
  audio.addEventListener('loadedmetadata', () => {
    if (inicio > 0) audio.currentTime = inicio;
    audio.playbackRate = velocidade;
  }, { once: true });
  audio.play().catch(() => { /* o usuário toca no ▶ */ });
  mostrarPlayer();
  configurarMediaSession();
}

function capituloNoTempo(t) {
  const caps = player.doc.capitulos;
  let i = 0;
  while (i + 1 < caps.length && caps[i + 1].inicio != null && caps[i + 1].inicio <= t + 0.3) i++;
  return i;
}

/* ---------- ouvir a partir de um parágrafo ---------- */

let acaoDaqui = null;

function tempoDoBloco(doc, f) {
  for (const c of doc.capitulos) {
    const i = (c.f || []).indexOf(f);
    if (i >= 0) return c.t ? c.t[i] : (c.inicio != null ? c.inicio : null);
  }
  return null;
}

function ouvirDaqui(item, doc, f) {
  seguir = true;
  $('#seguir').hidden = true;
  if (player.item && player.item.id === item.id) {
    if (player.modo === 'audio') {
      const t = tempoDoBloco(doc, f);
      if (t != null) {
        audio.currentTime = t;
        if (audio.paused) audio.play().catch(() => {});
        return;
      }
    } else if (player.modo === 'tts') {
      const i = tts.pedacos.findIndex((p) => p.f === f);
      if (i >= 0) { tts.idx = i; ttsTocar(); }
      return;
    }
  }
  if (item.audio && disponivel(item)) iniciarAudio(item, doc, null, [], tempoDoBloco(doc, f));
  else iniciarTts(item, doc, null, f);
}

/* Barra de ações do trecho tocado: ouvir daqui, destacar e anotar. */
function mostrarDaqui(bloco, y, item, doc) {
  esconderDaqui();
  bloco.classList.add('escolhido');
  blocoAtual = { item, doc, el: bloco };
  const h = destaqueDoBloco(item, bloco);
  $('#ab-destacar').textContent = h ? '✕ Tirar destaque' : '🖍 Destacar';
  $('#ab-anotar').textContent = h && h.nota ? '📝 Editar anotação' : '📝 Anotar';
  const b = $('#acoes-bloco');
  const topo = $('.topo').offsetHeight + 8;
  const baixo = window.innerHeight - ($('#player').hidden ? 0 : $('#player').offsetHeight) - 56;
  b.style.top = `${Math.min(Math.max(y - 64, topo), baixo)}px`;
  b.hidden = false;
  acaoDaqui = true;
}

function esconderDaqui() {
  $('#acoes-bloco').hidden = true;
  acaoDaqui = null;
  const e = tela.querySelector('.escolhido');
  if (e) e.classList.remove('escolhido');
}

$('#ab-ouvir').addEventListener('click', () => {
  const b = blocoAtual;
  esconderDaqui();
  if (b) ouvirDaqui(b.item, b.doc, Number(b.el.dataset.f));
});
$('#ab-destacar').addEventListener('click', () => {
  const b = blocoAtual;
  esconderDaqui();
  if (b) alternarDestaque(b.item, b.el);
});
$('#ab-anotar').addEventListener('click', () => {
  const b = blocoAtual;
  esconderDaqui();
  if (b) abrirEditorNota(b.item, b.el);
});

/* ---------- destaques e anotações ---------- */
/* guardado 'destaques': { idDoc: [{ f, texto, nota, t }] }. O trecho é achado pelo número do bloco
   e, se o texto do documento mudou, pelo começo do texto. */

let blocoAtual = null;
let irParaDestaque = null; // { id, h }: abrir o documento já no trecho

const textoBloco = (el) => el.textContent.replace(/\s+/g, ' ').trim();
const todosDestaques = () => guardado.get('destaques', {});
const destaquesDoc = (id) => todosDestaques()[id] || [];
function salvarDestaquesDoc(id, lista) {
  const d = todosDestaques();
  if (lista.length) d[id] = lista; else delete d[id];
  guardado.set('destaques', d);
}

function acharBloco(raiz, h) {
  const inicio = h.texto.slice(0, 60);
  const el = raiz.querySelector(`[data-f="${h.f}"]`);
  if (el && textoBloco(el).startsWith(inicio)) return el;
  return [...raiz.querySelectorAll('[data-f]')].find((x) => textoBloco(x).startsWith(inicio)) || null;
}

function destaqueDoBloco(item, el) {
  const art = tela.querySelector('article');
  return art ? destaquesDoc(item.id).find((h) => acharBloco(art, h) === el) : null;
}

function aplicarDestaques(item) {
  const art = tela.querySelector('article');
  if (!art) return;
  art.querySelectorAll('.destacado').forEach((e) => e.classList.remove('destacado'));
  art.querySelectorAll('.nota-bloco').forEach((e) => e.remove());
  for (const h of destaquesDoc(item.id)) {
    const el = acharBloco(art, h);
    if (!el) continue;
    el.classList.add('destacado');
    if (h.nota) {
      const n = document.createElement('div');
      n.className = 'nota-bloco';
      n.textContent = h.nota;
      n.dataset.notaDe = el.dataset.f;
      if (el.tagName === 'TR') el.lastElementChild.appendChild(n);
      else el.insertAdjacentElement('afterend', n);
    }
  }
}

function alternarDestaque(item, el) {
  const h = destaqueDoBloco(item, el);
  let lista = destaquesDoc(item.id);
  if (h) {
    if (h.nota && !window.confirm('Tirar o destaque apaga também a anotação deste trecho. Continuar?')) return;
    const art = tela.querySelector('article');
    lista = lista.filter((x) => acharBloco(art, x) !== el);
  } else {
    lista.push({ f: Number(el.dataset.f), texto: textoBloco(el).slice(0, 500), nota: '', t: Date.now() });
  }
  salvarDestaquesDoc(item.id, lista);
  aplicarDestaques(item);
}

let editorAberto = null;
function abrirEditorNota(item, el) {
  const h = destaqueDoBloco(item, el);
  editorAberto = { item, el };
  const trecho = textoBloco(el);
  $('#en-trecho').textContent = trecho.length > 220 ? `${trecho.slice(0, 220)}…` : trecho;
  $('#en-texto').value = h ? h.nota : '';
  $('#en-apagar').hidden = !(h && h.nota);
  $('#editor-nota').hidden = false;
  setTimeout(() => $('#en-texto').focus(), 50);
}
function fecharEditorNota() {
  $('#editor-nota').hidden = true;
  editorAberto = null;
}
function salvarNota(texto) {
  if (!editorAberto) return;
  const { item, el } = editorAberto;
  const art = tela.querySelector('article');
  const lista = destaquesDoc(item.id);
  let h = lista.find((x) => acharBloco(art, x) === el);
  if (!h) {
    h = { f: Number(el.dataset.f), texto: textoBloco(el).slice(0, 500), nota: '', t: Date.now() };
    lista.push(h);
  }
  h.nota = texto.trim();
  h.t = Date.now();
  salvarDestaquesDoc(item.id, lista);
  fecharEditorNota();
  aplicarDestaques(item);
}
$('#en-salvar').addEventListener('click', () => salvarNota($('#en-texto').value));
$('#en-apagar').addEventListener('click', () => salvarNota(''));
$('#en-cancelar').addEventListener('click', fecharEditorNota);
$('#editor-nota').addEventListener('click', (e) => { if (e.target.id === 'editor-nota') fecharEditorNota(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && editorAberto) fecharEditorNota(); });

const disciplinaDoc = (it) => ((it.categoria === 'material' || it.categoria === 'revisao')
  ? tituloCurto(it).replace(/\s*(?:e|\+)\s*Redação$/, '') : (it.grupo || 'Outros'));

function contarDestaques() {
  return Object.values(todosDestaques()).reduce((s, l) => s + l.length, 0);
}

function telaDestaques() {
  setTopo('Meus destaques', true);
  const grupos = new Map();
  for (const [id, lista] of Object.entries(todosDestaques())) {
    const it = catalogo.docs.find((x) => x.id === id);
    if (!it) continue;
    const g = disciplinaDoc(it);
    if (!grupos.has(g)) grupos.set(g, []);
    lista.forEach((h) => grupos.get(g).push({ it, h }));
  }
  if (!grupos.size) {
    tela.innerHTML = `<p class="aviso">Você ainda não destacou nenhum trecho. Abra um material, toque num parágrafo e escolha
      <b>🖍 Destacar</b> ou <b>📝 Anotar</b>.</p>`;
    return;
  }
  const ordenados = [...grupos].sort((a, b) => a[0].localeCompare(b[0], 'pt-BR'));
  for (const [, l] of ordenados) {
    l.sort((a, b) => ((b.it.data || '') + b.it.id).localeCompare((a.it.data || '') + a.it.id) || a.h.f - b.h.f);
  }
  let n = 0;
  const refs = [];
  tela.innerHTML = `
    <div class="acoes"><button class="btn" id="d-copiar">📋 Copiar tudo como texto</button></div>
    <p class="aviso" id="d-aviso">${contarDestaques()} trechos destacados. Eles ficam só neste celular: copie de vez em quando para guardar.</p>
    ${ordenados.map(([g, l]) => `<details class="grupo" open><summary>${esc(g)} <small>(${l.length})</small></summary>
      ${l.map(({ it, h }) => {
        refs.push({ it, h });
        return `<div class="destaque-item">
          <div class="meta">${esc(it.subtitulo ? `${it.subtitulo.split(' ').pop()} · ` : '')}${esc(it.titulo)}</div>
          <blockquote>${esc(h.texto)}</blockquote>
          ${h.nota ? `<p class="nota">${esc(h.nota)}</p>` : ''}
          <div class="acoes-item"><button class="btn-link" data-abrir="${n}">Abrir no texto</button>
            <button class="btn-link" data-remover="${n++}">Remover</button></div>
        </div>`;
      }).join('')}</details>`).join('')}`;

  tela.querySelectorAll('[data-abrir]').forEach((b) => b.addEventListener('click', () => {
    const { it, h } = refs[Number(b.dataset.abrir)];
    irParaDestaque = { id: it.id, h };
    location.hash = `#/doc/${encodeURIComponent(it.id)}`;
  }));
  tela.querySelectorAll('[data-remover]').forEach((b) => b.addEventListener('click', () => {
    const { it, h } = refs[Number(b.dataset.remover)];
    if (h.nota && !window.confirm('Remover este destaque e a anotação?')) return;
    salvarDestaquesDoc(it.id, destaquesDoc(it.id).filter((x) => !(x.f === h.f && x.texto === h.texto)));
    telaDestaques();
  }));
  $('#d-copiar').addEventListener('click', async () => {
    const texto = ordenados.map(([g, l]) => `# ${g}\n\n${l.map(({ it, h }) =>
      `- ${it.subtitulo ? `${it.subtitulo.split(' ').pop()} · ` : ''}${it.titulo}\n  "${h.texto}"${h.nota ? `\n  Anotação: ${h.nota}` : ''}`).join('\n\n')}`).join('\n\n');
    try {
      await navigator.clipboard.writeText(texto);
      $('#d-aviso').textContent = 'Copiado. Cole num e-mail, nas notas do celular ou onde preferir.';
    } catch {
      $('#d-aviso').textContent = 'Não deu para copiar neste navegador.';
    }
  });
}

/* ---------- timer de sono ---------- */

const OPCOES_SONO = [0, 15, 30, 45, 60, 'cap'];
const ICONE_SONO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>';
let sono = { modo: 0, fim: 0, id: null };

function definirSono(modo) {
  if (sono.id) clearInterval(sono.id);
  sono = { modo, fim: typeof modo === 'number' && modo ? Date.now() + modo * 60000 : 0, id: null };
  if (sono.fim) sono.id = setInterval(tickSono, 1000);
  audio.volume = 1;
  desenharSono();
}

function tickSono() {
  const resta = sono.fim - Date.now();
  if (resta <= 0) { dormir(); return; }
  if (player.modo === 'audio' && !audio.paused && resta < 10000) audio.volume = Math.max(0.05, resta / 10000); // some no iPhone
  desenharSono();
}

/* Pausa a leitura e desliga o timer. */
function dormir() {
  if (player.modo === 'audio') audio.pause();
  else if (player.modo === 'tts' && tts.tocando) ttsPausar();
  definirSono(0);
  $('#p-capitulo').textContent = 'Timer de sono: leitura pausada. Toque em ▶ para continuar.';
}

function desenharSono() {
  const b = $('#p-sono');
  let texto = '', rotulo = 'Timer de sono: desligado';
  if (sono.modo === 'cap') { texto = 'fim do cap.'; rotulo = 'Timer de sono: para no fim do capítulo'; }
  else if (sono.fim) {
    texto = fmt((sono.fim - Date.now()) / 1000);
    rotulo = `Timer de sono: ${Math.ceil((sono.fim - Date.now()) / 60000)} min`;
  }
  b.innerHTML = ICONE_SONO + (texto ? `<span>${texto}</span>` : '');
  b.classList.toggle('ativo', !!sono.modo);
  b.setAttribute('aria-label', rotulo);
  b.title = rotulo;
}

$('#p-sono').addEventListener('click', () => {
  const i = OPCOES_SONO.indexOf(sono.modo);
  definirSono(OPCOES_SONO[(i + 1) % OPCOES_SONO.length]);
});
desenharSono();

/* ---------- marcação do trecho que está sendo lido ---------- */

let seguir = true; // a tela acompanha a leitura até o usuário rolar com o dedo

function blocoNoTempo(t) {
  const m = player.marcas;
  let lo = 0, hi = m.length - 1, achou = -1;
  while (lo <= hi) {
    const meio = (lo + hi) >> 1;
    if (m[meio][0] <= t + 0.15) { achou = meio; lo = meio + 1; } else hi = meio - 1;
  }
  return achou >= 0 ? m[achou][1] : -1;
}

const docNaTela = () => !!player.item && location.hash.endsWith(encodeURIComponent(player.item.id));

function marcarLeitura(f, forcar) {
  if (f === player.f && !forcar) return;
  player.f = f;
  const anterior = tela.querySelector('.lendo');
  if (anterior) anterior.classList.remove('lendo');
  if (f == null || f < 0 || !docNaTela()) return;
  const el = tela.querySelector(`[data-f="${f}"]`);
  if (!el) return;
  el.classList.add('lendo');
  if (seguir) levarAte(el, forcar);
}

/* Mantém o trecho lido na metade de cima da área visível. */
function levarAte(el, sempre) {
  const r = el.getBoundingClientRect();
  const topo = $('.topo').offsetHeight + 8;
  const baixo = window.innerHeight - ($('#player').hidden ? 0 : $('#player').offsetHeight) - 8;
  const limite = topo + (baixo - topo) * 0.55;
  if (!sempre && r.top >= topo && r.top <= limite && r.bottom <= baixo) return;
  window.scrollTo({ top: window.scrollY + r.top - topo - (baixo - topo) * 0.2, behavior: 'smooth' });
}

function pararDeSeguir(e) {
  if (!docNaTela() || !estaTocando() || (e.target && e.target.closest && e.target.closest('#player, #seguir'))) return;
  if (!seguir) return;
  seguir = false;
  const b = $('#seguir');
  b.style.bottom = `${$('#player').offsetHeight + 12}px`;
  b.hidden = false;
}
function voltarASeguir() {
  seguir = true;
  $('#seguir').hidden = true;
  marcarLeitura(player.f, true);
}

function salvarPosicao(forcar) {
  if (!player.item) return;
  if (player.modo === 'audio' && audio.ended) return; // terminou: a posição já foi zerada
  const agora = Date.now();
  if (!forcar && agora - ultimoSalvo < 4000) return;
  ultimoSalvo = agora;
  const cap = player.doc.capitulos[player.cap];
  if (player.modo === 'audio') {
    guardado.set(`pos:${player.item.id}`, Math.floor(audio.currentTime));
    guardado.set('ultimo', { id: player.item.id, onde: `${cap ? cap.titulo : ''} · ${fmt(audio.currentTime)} de ${fmt(audio.duration || player.item.audio.duracao)}` });
  } else if (player.modo === 'tts') {
    guardado.set(`tts:${player.item.id}`, tts.idx);
    guardado.set('ultimo', { id: player.item.id, onde: `${cap ? cap.titulo : ''} · voz do celular` });
  }
}

audio.addEventListener('timeupdate', () => {
  if (player.modo !== 'audio') return;
  const t = audio.currentTime, d = audio.duration || player.item.audio.duracao;
  $('#p-tempo').textContent = fmt(t);
  $('#p-total').textContent = fmt(d);
  if (!arrastando) $('#p-progresso').value = String(Math.round((t / d) * 1000) || 0);
  // tempo real ouvindo (saltos e avanços não contam)
  const delta = ultimoTempoAudio == null ? -1 : t - ultimoTempoAudio;
  const natural = delta > 0 && delta < 3; // tocando normalmente, sem salto
  if (!audio.paused && natural) {
    segPendentes += delta / (audio.playbackRate || 1);
    if (segPendentes >= 20) registrarAudioPendente();
  }
  ultimoTempoAudio = t;
  const cap = capituloNoTempo(t);
  if (cap !== player.cap) {
    const anterior = player.cap;
    player.cap = cap;
    if (sono.modo === 'cap' && natural && cap === anterior + 1) {
      audio.currentTime = player.doc.capitulos[cap].inicio || t; // continua do começo do próximo
      aoMudarCapitulo();
      dormir();
      return;
    }
    aoMudarCapitulo();
  }
  if (player.marcas.length) marcarLeitura(blocoNoTempo(t));
  salvarPosicao(false);
  if ('mediaSession' in navigator && navigator.mediaSession.setPositionState && isFinite(d)) {
    try { navigator.mediaSession.setPositionState({ duration: d, position: Math.min(t, d), playbackRate: audio.playbackRate }); } catch { /* ok */ }
  }
});
audio.addEventListener('play', () => {
  if (!sono.fim || sono.fim - Date.now() > 10000) audio.volume = 1;
  atualizarPlay(true);
});
audio.addEventListener('pause', () => { atualizarPlay(false); salvarPosicao(true); registrarAudioPendente(); });
audio.addEventListener('ended', () => {
  if (player.modo !== 'audio' || !player.item) return;
  guardado.set(`pos:${player.item.id}`, 0);
  guardado.set(`ouvido:${player.item.id}`, true);
  atualizarPlay(false);
  if (sono.modo === 'cap') { dormir(); return; } // o fim do material também é fim de capítulo
  avancarFila();
});

const disponivel = (it) => !!it && !!it.audio && (navigator.onLine || baixados.has(abs(it.audio.url)));
const aoTerminar = () => guardado.get('aoTerminar', 'seguir');

/* O que tocar quando este áudio acabar, se a fila estiver vazia:
   material → a revisão dele; depois (modo "seguir") → o próximo material, mais novo, ainda não concluído. */
function proximoAutomatico(item) {
  const modo = aoTerminar();
  if (!item || modo === 'parar') return null;
  const achar = (id) => catalogo.docs.find((d) => d.id === id);
  if (item.categoria === 'material' && item.revisao && disponivel(achar(item.revisao))) return achar(item.revisao);
  if (modo !== 'seguir') return null;
  const base = item.categoria === 'revisao' ? achar(item.material) : item;
  if (!base || !base.data) return null;
  const chave = (d) => `${d.data} ${d.id}`;
  return catalogo.docs
    .filter((d) => d.categoria === 'material' && d.data && chave(d) > chave(base) && disponivel(d) && !concluido(d))
    .sort((a, b) => (chave(a) < chave(b) ? -1 : 1))[0] || null;
}

function proximoItem() {
  const it = (player.fila || []).map((id) => catalogo.docs.find((d) => d.id === id)).find(disponivel);
  return it || (player.modo === 'audio' ? proximoAutomatico(player.item) : null);
}

function mostrarASeguir() {
  const prox = player.item ? proximoItem() : null;
  $('#p-aseguir').hidden = !prox;
  if (prox) {
    $('#p-aseguir-txt').textContent = `A seguir: ${prox.titulo}${prox.subtitulo ? ` (${prox.subtitulo.split(' ').pop()})` : ''}`;
    obterDoc(prox).catch(() => {}); // deixa pronto para começar sem espera
  }
}

/* Passa para o próximo: primeiro a fila montada; se ela estiver vazia, a fila automática. */
function avancarFila() {
  while (player.fila && player.fila.length) {
    const it = catalogo.docs.find((d) => d.id === player.fila.shift());
    if (!disponivel(it)) continue;
    comecarItem(it, player.fila.slice());
    return;
  }
  const prox = player.modo === 'audio' ? proximoAutomatico(player.item) : null;
  if (prox) comecarItem(prox, []);
}

function comecarItem(it, resto) {
  const comecar = (doc) => iniciarAudio(it, doc, it.categoria === 'revisao' ? 0 : null, resto);
  if (docs.has(it.id)) comecar(docs.get(it.id));
  else obterDoc(it).then(comecar).catch(() => {});
}

function ouvirDepois(item) {
  if (!player.item || player.modo !== 'audio') { comecarItem(item, []); return 'Tocando agora.'; }
  if (player.item.id === item.id || player.fila.includes(item.id)) return 'Já está na fila.';
  player.fila.push(item.id);
  mostrarPlayer();
  return `Adicionado à fila (${player.fila.length}º).`;
}

$('#p-pular').addEventListener('click', () => {
  if (player.modo === 'audio') { salvarPosicao(true); audio.pause(); }
  avancarFila();
});

function atualizarPlay(tocando) {
  $('#p-play').textContent = tocando ? '⏸' : '▶';
  $('#p-play').setAttribute('aria-label', tocando ? 'Pausar' : 'Tocar');
  if ('mediaSession' in navigator) navigator.mediaSession.playbackState = tocando ? 'playing' : 'paused';
}

function aoMudarCapitulo() {
  const cap = player.doc.capitulos[player.cap];
  $('#p-capitulo').textContent = cap ? `${player.cap + 1}/${player.doc.capitulos.length} · ${cap.titulo}` : '';
  configurarMediaSession();
  marcarCapituloNaTela();
}

function marcarCapituloNaTela() {
  tela.querySelectorAll('.capitulos li').forEach((li) => {
    li.classList.toggle('atual', !!player.item && location.hash.endsWith(encodeURIComponent(player.item.id)) && Number(li.dataset.i) === player.cap);
  });
}

function irParaCapitulo(i) {
  const caps = player.doc.capitulos;
  i = Math.max(0, Math.min(caps.length - 1, i));
  if (player.modo === 'audio') {
    audio.currentTime = caps[i].inicio || 0;
    if (audio.paused) audio.play().catch(() => {});
  } else if (player.modo === 'tts') {
    tts.idx = tts.pedacos.findIndex((p) => p.cap === i);
    ttsTocar();
  }
}

const estaTocando = () => (player.modo === 'audio' ? !audio.paused : player.modo === 'tts' && tts.tocando);

function tocarPausar() {
  if (player.modo === 'audio') { if (audio.paused) audio.play().catch(() => {}); else audio.pause(); }
  else if (player.modo === 'tts') { if (tts.tocando) ttsPausar(); else ttsTocar(); }
}
function pular(seg) {
  if (player.modo === 'audio') audio.currentTime = Math.max(0, audio.currentTime + seg);
  else if (player.modo === 'tts') { tts.idx = Math.max(0, Math.min(tts.pedacos.length - 1, tts.idx + (seg > 0 ? 1 : -1))); ttsTocar(); }
}

function configurarMediaSession() {
  if (!('mediaSession' in navigator) || !player.item) return;
  const cap = player.doc.capitulos[player.cap];
  navigator.mediaSession.metadata = new MediaMetadata({
    title: cap ? cap.titulo : player.item.titulo,
    artist: player.item.titulo,
    album: 'PMPE Ouvir',
    artwork: [{ src: abs('icons/icon-512.png'), sizes: '512x512', type: 'image/png' }],
  });
  const acoes = {
    play: () => { if (!estaTocando()) tocarPausar(); },
    pause: () => { if (estaTocando()) tocarPausar(); },
    seekbackward: () => pular(-15), seekforward: () => pular(30),
    previoustrack: () => irParaCapitulo(player.cap - 1), nexttrack: () => irParaCapitulo(player.cap + 1),
    seekto: (e) => { if (player.modo === 'audio' && e.seekTime != null) audio.currentTime = e.seekTime; },
  };
  for (const [acao, fn] of Object.entries(acoes)) {
    try { navigator.mediaSession.setActionHandler(acao, fn); } catch { /* ação não suportada */ }
  }
}

/* ---------- voz do celular (speechSynthesis) ---------- */

const tts = { pedacos: [], idx: 0, tocando: false, atual: null, voz: null, palavrasAntes: [], total: 0, trava: null };

function escolherVoz() {
  if (!('speechSynthesis' in window)) return null;
  const vozes = speechSynthesis.getVoices().filter((v) => /^pt[-_]BR/i.test(v.lang));
  const pref = ['Antonio', 'Google português do Brasil', 'Luciana', 'Francisca', 'Thalita'];
  for (const p of pref) { const v = vozes.find((x) => x.name.includes(p)); if (v) return v; }
  return vozes.find((v) => v.localService) || vozes[0] || null;
}
if ('speechSynthesis' in window && speechSynthesis.addEventListener) {
  speechSynthesis.addEventListener('voiceschanged', () => { tts.voz = escolherVoz(); });
}

/* Divide em pedaços curtos (algumas vozes param em falas longas). Só corta após
   pontuação seguida de espaço, para não partir números como 11.343. */
function quebrar(texto, max = 220) {
  if (texto.length <= max) return [texto];
  const out = [];
  const add = (s) => { if (s.trim()) out.push(s.trim()); };
  let atual = '';
  for (let f of texto.split(/(?<=[.!?;:]["”)]?)\s+/)) {
    while (f.length > max) { // frase longa: corta em vírgula ou espaço
      let corte = f.lastIndexOf(', ', max);
      if (corte < max / 3) corte = f.lastIndexOf(' ', max);
      if (corte < 1) corte = max;
      add(atual); atual = '';
      add(f.slice(0, corte + 1));
      f = f.slice(corte + 1);
    }
    if (atual && atual.length + f.length + 1 > max) { add(atual); atual = ''; }
    atual = atual ? `${atual} ${f}` : f;
  }
  add(atual);
  return out;
}

function iniciarTts(item, doc, cap, bloco = null) {
  if (!('speechSynthesis' in window)) {
    const av = $('#aviso-doc');
    if (av) av.textContent = 'Este navegador não tem leitura em voz alta.';
    return;
  }
  pararTudo();
  Object.assign(player, { modo: 'tts', item, doc, cap: 0, f: -1, marcas: [], fila: [] });
  tts.pedacos = [];
  doc.capitulos.forEach((c, ci) => c.paragrafos.forEach((p, pi) => {
    const f = c.f ? c.f[pi] : -1;
    quebrar(p).forEach((t) => tts.pedacos.push({ cap: ci, f, texto: t }));
  }));
  tts.palavrasAntes = [];
  let soma = 0;
  for (const p of tts.pedacos) { tts.palavrasAntes.push(soma); soma += p.texto.split(/\s+/).length; }
  tts.total = soma;
  tts.idx = cap != null ? tts.pedacos.findIndex((p) => p.cap === cap) : Math.min(guardado.get(`tts:${item.id}`, 0), tts.pedacos.length - 1);
  if (bloco != null) {
    const i = tts.pedacos.findIndex((p) => p.f === bloco);
    if (i >= 0) tts.idx = i;
  }
  if (tts.idx < 0) tts.idx = 0;
  tts.voz = tts.voz || escolherVoz();
  player.cap = tts.pedacos[tts.idx] ? tts.pedacos[tts.idx].cap : 0;
  mostrarPlayer();
  configurarMediaSession();
  ttsTocar();
}

function ttsFalar(natural = false) {
  const p = tts.pedacos[tts.idx];
  if (!p && natural && sono.modo === 'cap') { // fim do texto com o timer em "fim do capítulo"
    definirSono(0);
  }
  if (!p) { // fim
    tts.tocando = false;
    guardado.set(`tts:${player.item.id}`, 0);
    guardado.set(`ouvido:${player.item.id}`, true);
    atualizarPlay(false);
    soltarTela();
    return;
  }
  if (p.cap !== player.cap) {
    player.cap = p.cap;
    aoMudarCapitulo();
    if (natural && sono.modo === 'cap') { dormir(); return; } // para antes do próximo capítulo
  }
  marcarLeitura(p.f);
  const u = new SpeechSynthesisUtterance(p.texto);
  u.lang = 'pt-BR';
  if (tts.voz) u.voice = tts.voz;
  u.rate = velocidade;
  const inicioFala = Date.now();
  u.onend = () => {
    if (u !== tts.atual || !tts.tocando) return;
    const seg = (Date.now() - inicioFala) / 1000;
    if (seg > 0 && seg < 120) registrarAtividade({ s: seg });
    tts.idx++;
    salvarPosicao(false);
    ttsFalar(true);
  };
  u.onerror = (e) => {
    if (u !== tts.atual || e.error === 'interrupted' || e.error === 'canceled') return;
    tts.idx++;
    ttsFalar();
  };
  tts.atual = u;
  speechSynthesis.speak(u);
  ttsAtualizarBarra();
}

function ttsTocar() {
  tts.tocando = true;
  tts.atual = null;
  speechSynthesis.cancel();
  atualizarPlay(true);
  segurarTela();
  ttsFalar();
}
function ttsPausar() {
  tts.tocando = false;
  tts.atual = null;
  speechSynthesis.cancel();
  atualizarPlay(false);
  salvarPosicao(true);
  soltarTela();
}
function ttsParar() { ttsPausar(); }

function ttsAtualizarBarra() {
  const seg = (n) => (n / PALAVRAS_POR_MIN / velocidade) * 60;
  $('#p-tempo').textContent = `~${fmt(seg(tts.palavrasAntes[tts.idx] || 0))}`;
  $('#p-total').textContent = `~${fmt(seg(tts.total))}`;
  $('#p-progresso').value = String(Math.round(((tts.palavrasAntes[tts.idx] || 0) / Math.max(1, tts.total)) * 1000));
}

async function segurarTela() {
  try { if ('wakeLock' in navigator && !tts.trava) tts.trava = await navigator.wakeLock.request('screen'); } catch { /* ok */ }
}
function soltarTela() {
  if (tts.trava) { tts.trava.release().catch(() => {}); tts.trava = null; }
}
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && player.modo === 'tts' && tts.tocando) { tts.trava = null; segurarTela(); }
});
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') registrarAudioPendente();
});
function pararLeituraNaTela() { /* a leitura continua ao voltar para o início */ }

/* ---------- controles ---------- */

let arrastando = false;
const progresso = $('#p-progresso');
progresso.addEventListener('input', () => {
  arrastando = true;
  if (player.modo === 'audio') $('#p-tempo').textContent = fmt((progresso.value / 1000) * (audio.duration || 0));
});
progresso.addEventListener('change', () => {
  arrastando = false;
  if (player.modo === 'audio' && audio.duration) audio.currentTime = (progresso.value / 1000) * audio.duration;
});
$('#p-play').addEventListener('click', tocarPausar);
$('#p-voltar').addEventListener('click', () => pular(-15));
$('#p-avancar').addEventListener('click', () => pular(30));
$('#p-cap-ant').addEventListener('click', () => {
  // no áudio, se já passou alguns segundos do capítulo, volta ao começo dele
  if (player.modo === 'audio' && audio.currentTime - (player.doc.capitulos[player.cap].inicio || 0) > 5) irParaCapitulo(player.cap);
  else irParaCapitulo(player.cap - 1);
});
$('#p-cap-prox').addEventListener('click', () => irParaCapitulo(player.cap + 1));
$('#p-vel').addEventListener('click', () => {
  const i = VELOCIDADES.indexOf(velocidade);
  velocidade = VELOCIDADES[(i + 1) % VELOCIDADES.length];
  guardado.set('velocidade', velocidade);
  $('#p-vel').textContent = `${String(velocidade).replace('.', ',')}×`;
  if (player.modo === 'audio') audio.playbackRate = velocidade;
  if (player.modo === 'tts' && tts.tocando) ttsTocar();
});
$('#p-fechar').addEventListener('click', () => {
  definirSono(0);
  pararTudo();
  marcarLeitura(-1);
  player.item = null;
  $('#seguir').hidden = true;
  $('#player').hidden = true;
  document.body.classList.remove('tocando');
  marcarCapituloNaTela();
});
$('#voltar').addEventListener('click', () => {
  if (history.length > 1 && sessionStorage.getItem('navegou')) history.back();
  else location.hash = '#/';
});
window.addEventListener('hashchange', () => {
  try { sessionStorage.setItem('navegou', '1'); } catch { /* ok */ }
  rota();
});
window.addEventListener('touchmove', pararDeSeguir, { passive: true });
window.addEventListener('wheel', pararDeSeguir, { passive: true });
$('#seguir').addEventListener('click', voltarASeguir);
const esconderDaquiAoRolar = () => { if (acaoDaqui) esconderDaqui(); }; // só rolagem feita pelo usuário
window.addEventListener('touchmove', esconderDaquiAoRolar, { passive: true });
window.addEventListener('wheel', esconderDaquiAoRolar, { passive: true });
window.addEventListener('scroll', () => {
  if (!location.hash || location.hash === '#/' || location.hash === '#') rolagemInicio = window.scrollY;
}, { passive: true });

function atualizarRede() {
  $('#rede').textContent = navigator.onLine ? '' : '● offline';
  setStatus(statusSync);
}
window.addEventListener('online', () => { atualizarRede(); sincronizar(); });
window.addEventListener('offline', atualizarRede);

/* ---------- tema claro / escuro ---------- */

const ICONE_SOL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></svg>';
const ICONE_LUA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z"/></svg>';
const sistemaEscuro = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : { matches: false };

/* Sem escolha salva, o app segue o tema do celular. */
const temaAtual = () => document.documentElement.dataset.theme || (sistemaEscuro.matches ? 'dark' : 'light');

function desenharBotaoTema() {
  const escuro = temaAtual() === 'dark';
  const b = $('#tema');
  b.innerHTML = escuro ? ICONE_SOL : ICONE_LUA;
  const rotulo = escuro ? 'Usar tema claro' : 'Usar tema escuro';
  b.setAttribute('aria-label', rotulo);
  b.title = rotulo;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = escuro ? '#0f2742' : '#14365c';
}

$('#tema').addEventListener('click', () => {
  const novo = temaAtual() === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = novo;
  guardado.set('tema', novo);
  desenharBotaoTema();
});
if (sistemaEscuro.addEventListener) sistemaEscuro.addEventListener('change', desenharBotaoTema);
desenharBotaoTema();

/* ---------- tamanho do texto ---------- */

const ESCALAS = [0.85, 1, 1.15, 1.3, 1.5, 1.75];
let escala = guardado.get('escalaTexto', 1);
if (!ESCALAS.includes(escala)) escala = 1;

function aplicarEscala(nova) {
  escala = nova;
  document.documentElement.style.setProperty('--escala-texto', String(escala));
  guardado.set('escalaTexto', escala);
  $('#t-valor').textContent = `${Math.round(escala * 100)}%`;
  const i = ESCALAS.indexOf(escala);
  $('#t-menos').disabled = i <= 0;
  $('#t-mais').disabled = i >= ESCALAS.length - 1;
}

function abrirPainelTexto(abrir) {
  $('#painel-texto').hidden = !abrir;
  $('#tamanho').setAttribute('aria-expanded', String(abrir));
}

$('#tamanho').addEventListener('click', (e) => {
  e.stopPropagation();
  abrirPainelTexto($('#painel-texto').hidden);
});
$('#t-menos').addEventListener('click', () => aplicarEscala(ESCALAS[Math.max(0, ESCALAS.indexOf(escala) - 1)]));
$('#t-mais').addEventListener('click', () => aplicarEscala(ESCALAS[Math.min(ESCALAS.length - 1, ESCALAS.indexOf(escala) + 1)]));
document.addEventListener('click', (e) => {
  if (!$('#painel-texto').hidden && !e.target.closest('#painel-texto, #tamanho')) abrirPainelTexto(false);
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') abrirPainelTexto(false); });
aplicarEscala(escala);

/* Largura da coluna de texto (em telas grandes). */
function aplicarLargura(l) {
  if (!['estreita', 'media', 'toda'].includes(l)) l = 'media';
  document.documentElement.dataset.largura = l;
  guardado.set('larguraTexto', l);
  document.querySelectorAll('[data-largura]').forEach((b) => {
    if (b.tagName === 'BUTTON') b.setAttribute('aria-checked', String(b.dataset.largura === l));
  });
}
document.querySelectorAll('button[data-largura]').forEach((b) => b.addEventListener('click', () => aplicarLargura(b.dataset.largura)));
aplicarLargura(guardado.get('larguraTexto', 'media'));

/* ---------- início ---------- */

(async function iniciar() {
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
  atualizarRede();
  await carregarCatalogo();
  rota();
  sincronizar();
}());
