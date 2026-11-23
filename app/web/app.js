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
    if (catalogo.cartoes) arquivos.push(catalogo.cartoes.arquivo);
    if (catalogo.banco) arquivos.push(catalogo.banco.arquivo);
    const atuais = new Set(arquivos.map(abs));
    const faltam = [];
    for (const a of arquivos) if (!(await dados.match(abs(a)))) faltam.push(a);
    for (let i = 0; i < faltam.length; i += 8) {
      setStatus(`Guardando textos para usar offline… ${Math.min(i + 8, faltam.length)} de ${faltam.length}`);
      await dados.addAll(faltam.slice(i, i + 8));
    }
    for (const k of await dados.keys()) {
      if (/\/data\/(docs\/|questoes\.|busca\.|cartoes\.|banco\.)/.test(k.url) && !atuais.has(k.url)) await dados.delete(k);
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
  if (!h.startsWith('#/cronometro')) cronoDesenhado = '';
  desenharCrono(); // a barra do cronômetro some na tela dele e aparece nas outras
  if (h === '#/questoes') { telaQuestoes(); return; }
  if (h === '#/progresso') { telaProgresso(); return; }
  if (h === '#/destaques') { telaDestaques(); return; }
  if (h === '#/questoes/resolver') { telaResolver(); return; }
  if (h === '#/questoes/banco') { telaBanco(); return; }
  if (h === '#/simulado') { telaSimulado(); return; }
  if (h === '#/simulado/fazer') { telaSimuladoFazer(); return; }
  if (h === '#/simulado/folha') { telaSimuladoFolha(); return; }
  const rs = h.match(/^#\/simulado\/resultado\/(\d+)$/);
  if (rs) { telaResultadoSim(Number(rs[1])); return; }
  if (h === '#/cartoes') { telaCartoes(); return; }
  if (h === '#/cartoes/estudar') { telaEstudarCartoes(); return; }
  const c = h.match(/^#\/cronometro(?:\/(.+))?$/);
  if (c) { telaCrono(c[1]); return; }
  const m = h.match(/^#\/doc\/(.+)$/);
  if (m) telaDoc(decodeURIComponent(m[1]));
  else telaInicio();
}

function seloOffline(it) {
  if (!it.audio) return '';
  return baixados.has(abs(it.audio.url)) ? '<span class="selo ok">offline</span>' : '';
}

const tituloCurto = (it) => ({ revisao: it.titulo.replace(/^Revisão rápida: /, ''), questoes: it.titulo.replace(/^Questões: /, '') })[it.categoria] || it.titulo;
/* No fim do material, o próximo passo: ir praticar com as questões de hoje (ou o teste-relâmpago do resumão). */
function fimDoMaterial(item) {
  const cad = item.caderno && catalogo.docs.find((d) => d.id === item.caderno);
  if (!cad) return '';
  const teste = cad.titulo.startsWith('Teste-relâmpago');
  const hoje = item.data === dataISO();
  const titulo = teste ? 'Leu o resumão? Agora teste a memória' : 'Terminou o estudo? Agora é praticar';
  const botao = teste ? '⚡ Fazer o teste-relâmpago' : `📝 Responder as questões ${hoje ? 'de hoje' : 'deste dia'}`;
  const meta = teste ? 'Perguntas rápidas, sem consultar, com as respostas no fim'
    : `Estudo dirigido${cad.questoes ? ` e ${cad.questoes} ${cad.questoes === 1 ? 'questão oficial' : 'questões oficiais'}` : ''}, com o gabarito comentado no fim`;
  return `<section class="fim-material" aria-label="Próximo passo">
    <p class="fim-titulo">${titulo}</p>
    <a class="btn primario largo" href="#/doc/${encodeURIComponent(cad.id)}">${botao} →</a>
    <p class="meta">${meta}</p></section>`;
}

/* Botão para o arquivo de questões do dia (estudo dirigido, questões e gabarito), separado do material. */
const linkCaderno = (item, classe = 'btn') => {
  const cad = item.caderno && catalogo.docs.find((d) => d.id === item.caderno);
  if (!cad) return '';
  const rotulo = cad.titulo.startsWith('Teste-relâmpago') ? '⚡ Teste-relâmpago' : `📝 Questões do dia${cad.questoes ? ` · ${cad.questoes}` : ''}`;
  return `<a class="${classe}" href="#/doc/${encodeURIComponent(cad.id)}">${rotulo}</a>`;
};

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
    const blocos = resumoConviteHome() + resumoSimuladoHome() + resumoCronoHome() + resumoProgressoHome() + resumoQuestoesHome() + resumoCartoesHome() + (nDest ? `<a class="cartao cartao-q" href="#/destaques">
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
  const cf = $('#convite-fechar');
  if (cf) cf.addEventListener('click', () => { esquecerConvite(); desenharLista(filtro); });
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
  if (item.categoria === 'questoes') esquecerConvite(item.id);
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
      ${blocosDoItem(item) ? `<a class="btn" href="#/cronometro/${encodeURIComponent(item.id)}">⏱ ${crono && crono.id === item.id && !crono.fim ? 'Cronômetro em andamento' : 'Cronômetro do roteiro'}</a>` : ''}
      ${linkCaderno(item)}
      ${item.questoes && !item.caderno ? `<button class="btn${item.categoria === 'questoes' ? ' primario' : ''}" id="b-questoes">✍ Resolver as ${item.questoes} questões no app</button>` : ''}
      ${item.cartoes ? `<button class="btn" id="b-cartoes">🃏 ${item.cartoes} flashcards</button>` : ''}
      ${rev ? `<a class="btn" href="#/doc/${encodeURIComponent(rev.id)}">⚡ Revisão rápida · ${minutos(duracaoItem(rev))}</a>` : ''}
      ${mat ? `<a class="btn" href="#/doc/${encodeURIComponent(mat.id)}">📄 ${item.categoria !== 'questoes' ? 'Material completo' : item.titulo.startsWith('Teste-relâmpago') ? 'Voltar ao resumão' : 'Material de estudo'}</a>` : ''}
      ${item.audio ? '<button class="btn" id="b-depois">➕ Ouvir depois</button>' : ''}
      ${item.categoria === 'material' ? `<button class="btn" id="b-estudado" aria-pressed="${concluido(item)}">${concluido(item) ? '✓ Estudado' : '☐ Marcar como estudado'}</button>` : ''}
    </div>
    <p class="aviso" id="aviso-doc">${item.audio ? '' : 'Este texto é lido pela voz do celular. A tela fica acesa durante a leitura.'}</p>
    <details class="capitulos"><summary>Capítulos (${caps.length})</summary><ol>
      ${caps.map((c, i) => `<li data-i="${i}"><button>${esc(c.titulo)}${c.inicio != null ? ` <small>${fmt(c.inicio)}</small>` : ''}</button></li>`).join('')}
    </ol></details>
    <article>${doc.html}</article>
    ${fimDoMaterial(item)}`;
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
  const bc = $('#b-cartoes');
  if (bc) bc.addEventListener('click', () => cartoesDoMaterial(item).catch(() => {
    $('#aviso-doc').textContent = 'Os flashcards ainda não foram guardados no celular. Abra o app com internet.';
  }));
  const bq = $('#b-questoes');
  if (bq) bq.addEventListener('click', async () => {
    try {
      const todas = await obterQuestoes();
      const titulo = item.subtitulo ? `Material de ${item.subtitulo.split(' ').pop()}` : item.titulo;
      const dono = item.categoria === 'questoes' ? item.material : item.id; // as questões guardam o id do material
      iniciarSessao(todas.filter((q) => q.doc === dono).map((q) => q.id), titulo);
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
      <span class="meta">${esc(g.it.grupo || ({ material: 'Material do Dia', questoes: 'Questões do dia' })[g.it.categoria] || '')} · ${g.l.length} ${g.l.length === 1 ? 'trecho' : 'trechos'}</span>
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

const estudouNoDia = (dia) => !!dia && ((dia.s || 0) >= 60 || (dia.c || 0) >= 60 || (dia.k || 0) > 0 || (dia.q || 0) > 0 || (dia.m || 0) > 0);
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
    const c = a.c >= 60 ? ` · ${Math.round(a.c / 60)} min no cronômetro` : '';
    const k = a.k ? ` · ${a.k} ${a.k === 1 ? 'flashcard' : 'flashcards'}` : '';
    return `${dataCurta(d)}: ${v} min ouvindo${c}${q}${k}`;
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
  const lista = await r.json();
  let doBanco = [];
  try { doBanco = (await obterBanco()).q; } catch { /* sem o banco (offline na 1ª vez): só as dos materiais */ }
  questoes = lista.concat(doBanco);
  return questoes;
}

const respostas = () => guardado.get('respostas', {});
const incluirAutorais = () => guardado.get('incluirAutorais', true);
const filtrarAutorais = (lista) => (incluirAutorais() ? lista : lista.filter((q) => q.tipo === 'oficial'));
const rotuloResp = (k) => (k === 'CERTO' ? 'Certo' : k === 'ERRADO' ? 'Errado' : k || 'em branco');

/* ---------- caderno de erros com revisão espaçada ---------- */
/* guardado 'revErros': { id: { c: degrau, p: próxima revisão AAAA-MM-DD } }.
   Errou: a questão volta amanhã. Acertou na revisão: volta em 7 dias e depois em 30; acertou de novo: sai da revisão.
   Errou de novo em qualquer momento: recomeça amanhã. */
const INTERV_ERROS = [1, 7, 30];

function revErros() {
  const rev = guardado.get('revErros', null);
  if (rev) return rev;
  const novo = {}; // primeira vez: os erros que já estavam no caderno entram para revisar hoje
  const hoje = dataISO();
  for (const [id, r] of Object.entries(respostas())) if (!r.ok) novo[id] = { c: 0, p: hoje };
  guardado.set('revErros', novo);
  return novo;
}

/* Atualiza a agenda depois de uma resposta e devolve o aviso que a correção mostra. */
function agendarErro(id, ok) {
  const rev = revErros();
  const hoje = dataISO();
  const e = rev[id];
  let aviso = '';
  if (!ok) {
    rev[id] = { c: 0, p: somaDias(hoje, INTERV_ERROS[0]) };
    aviso = '🔁 Entrou na revisão de erros: volta amanhã.';
  } else if (e && e.p <= hoje) {
    const c = e.c + 1;
    if (c >= INTERV_ERROS.length) {
      delete rev[id];
      aviso = '🏆 Recuperada: acertou nas três revisões e saiu da revisão de erros.';
    } else {
      rev[id] = { c, p: somaDias(hoje, INTERV_ERROS[c]) };
      aviso = `🔁 Acertou na revisão: volta em ${INTERV_ERROS[c]} dias.`;
    }
  } else if (e) {
    aviso = `🔁 Revisão marcada para ${dataCurta(e.p)}.`;
  }
  guardado.set('revErros', rev);
  return aviso;
}

const errosParaHoje = (lista) => {
  const rev = revErros();
  const hoje = dataISO();
  return lista.filter((q) => rev[q.id] && rev[q.id].p <= hoje).sort((a, b) => rev[a.id].p.localeCompare(rev[b.id].p));
};

/* Grava uma resposta no histórico (caderno de erros, estatísticas e revisão espaçada). */
function gravarResposta(id, k, ok) {
  const resp = respostas();
  const r = resp[id] || { n: 0, a: 0 };
  resp[id] = { u: k, ok, n: r.n + 1, a: r.a + (ok ? 1 : 0), t: Date.now() };
  guardado.set('respostas', resp);
  return agendarErro(id, ok);
}

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
  const total = (catalogo.questoes ? catalogo.questoes.total : 0) + (catalogo.banco ? catalogo.banco.total : 0);
  if (!total) return '';
  const vals = Object.values(respostas());
  const erros = vals.filter((r) => !r.ok).length;
  const hoje = dataISO();
  const revisar = Object.values(revErros()).filter((e) => e.p <= hoje).length;
  return `<a class="cartao cartao-q" href="#/questoes">
      <div class="icone-q" aria-hidden="true">✍</div>
      <div class="corpo"><strong>Questões${revisar ? ` · 🔁 ${revisar} ${revisar === 1 ? 'erro' : 'erros'} para revisar hoje` : ''}</strong>
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
  const revisarHoje = errosParaHoje(todas);
  const rev = revErros();
  const naRevisao = Object.keys(rev).length;
  const amanha = somaDias(dataISO(), 1);
  const nAmanha = Object.values(rev).filter((e) => e.p === amanha).length;
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
      ${revisarHoje.length ? `<button class="btn primario" id="q-revisar">🔁 Revisar os erros de hoje (${revisarHoje.length})</button>` : ''}
      <button class="btn${revisarHoje.length ? '' : ' primario'}" id="q-novas" ${novas.length ? '' : 'disabled'}>▶ Não resolvidas (${novas.length})</button>
      <button class="btn" id="q-erros" ${erradas.length ? '' : 'disabled'}>Caderno de erros (${erradas.length})</button>
      <button class="btn" id="q-aleatorias">10 aleatórias</button>
    </div>
    ${naRevisao ? `<p class="aviso">Revisão espaçada dos erros: a questão que você errou volta amanhã; acertando, volta em 7 dias e depois em 30, e então sai da revisão.
      ${revisarHoje.length ? '' : `Nada para hoje.${nAmanha ? ` Amanhã: ${nAmanha}.` : ''}`} ${naRevisao} ${naRevisao === 1 ? 'questão está' : 'questões estão'} na revisão.</p>` : ''}
    <a class="cartao cartao-q" href="#/simulado"><div class="icone-q" aria-hidden="true">⏱</div>
      <div class="corpo"><strong>Simulado de prova</strong>
      <span class="meta">60 questões, 10 por disciplina, com cronômetro e o resultado por bloco · folha de respostas dos Simulados 1 e 2</span></div>
      <span aria-hidden="true">›</span></a>
    ${catalogo.banco ? `<a class="cartao cartao-q" href="#/questoes/banco"><div class="icone-q" aria-hidden="true">🔎</div>
      <div class="corpo"><strong>Banco de questões oficiais</strong>
      <span class="meta">${catalogo.banco.total} questões de provas de PM e da AOCP · filtre por disciplina, tópico do edital, banca e prova</span></div>
      <span aria-hidden="true">›</span></a>` : ''}
    <h2 class="secao">Por disciplina</h2>
    ${disciplinas.map(([d, l], i) => linha(d, l, `data-disc="${i}"`)).join('')}
    <h2 class="secao">Por material do dia</h2>
    ${materiais.map((d) => linha(`${(d.subtitulo || '').split(' ').pop()} · ${d.titulo}`, todas.filter((q) => q.doc === d.id), `data-doc="${esc(d.id)}"`)).join('')}
    <div class="rodape">
      <label><input type="checkbox" id="q-autorais" ${incluirAutorais() ? 'checked' : ''}> Incluir questões autorais (no estilo AOCP, não oficiais)</label>
      <div><button class="btn-link" id="q-zerar">Apagar meu histórico de questões</button></div>
    </div>`;

  const ordemTreino = (l) => [...l.filter((q) => !resp[q.id]), ...l.filter((q) => resp[q.id] && !resp[q.id].ok), ...l.filter((q) => resp[q.id] && resp[q.id].ok)];
  const br = $('#q-revisar');
  if (br) br.addEventListener('click', () => iniciarSessao(revisarHoje.map((q) => q.id), 'Revisão dos erros'));
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
    guardado.set('revErros', {});
    guardado.set('sessaoQ', null);
    telaQuestoes();
  });
}

/* ---------- banco de questões oficiais (Banco_de_Provas) ---------- */
/* As questões do banco viram objetos no mesmo formato das questões dos materiais: a resolução, o caderno de erros
   e as estatísticas valem para as duas. O arquivo vem em data/banco.<hash>.json: provas, apoios, tópicos e questões. */

const DISC_SIGLA = { LP: 'Língua Portuguesa', HP: 'História de Pernambuco', HPE: 'História de Pernambuco', RL: 'Raciocínio Lógico',
  INF: 'Informática', DC: 'Direito Constitucional', DH: 'Direitos Humanos e Legislação Extravagante' };
const ORDEM_DISC = ['LP', 'HPE', 'RL', 'INF', 'DC', 'DH'];
let banco = null; // { provas, topicos, q: [questões já no formato do app] }

async function lerJsonDados(arquivo) {
  let r = await caches.match(abs(arquivo));
  if (!r) {
    r = await fetch(arquivo);
    if (!r.ok) throw new Error('indisponível');
    try { (await caches.open(CACHE_DADOS)).put(abs(arquivo), r.clone()); } catch { /* ok */ }
  }
  return r.json();
}

const siglaTopico = (c) => c.split(' ')[0];
const ordemTopico = (c) => {
  const [s, n] = c.split(' ');
  return ORDEM_DISC.indexOf(s) * 1000 + Number(n);
};

async function obterBanco() {
  if (banco) return banco;
  const info = catalogo && catalogo.banco;
  if (!info) return { provas: {}, topicos: {}, q: [] };
  const b = await lerJsonDados(info.arquivo);
  const q = b.q.map((x) => {
    const p = b.provas[x.p] || {};
    const ce = x.a.length === 2 && x.a[0][0] === 'CERTO';
    const avisos = [];
    if (p.status === 'não confirmado') avisos.push('gabarito não confirmado: trate como preliminar');
    else if (p.status && p.status !== 'oficial') avisos.push(`gabarito ${p.status}, não o oficial da banca`);
    if (p.banca && p.banca !== 'Instituto AOCP') avisos.push('outra banca');
    if (p.nivel === 'Superior') avisos.push('prova de nível superior');
    if (ce) avisos.push('item de certo ou errado (na PMPE são 5 alternativas)');
    else if (x.a.length === 4) avisos.push('4 alternativas');
    if (siglaTopico(x.top[0]) === 'INF' && p.ano && p.ano < 2023) avisos.push(`prova de ${p.ano}: confira a versão do programa`);
    return {
      id: x.id, doc: null, numero: String(x.n), banco: true, p: x.p, top: x.top, ce,
      origem: `${p.nome || ''}${p.cargo ? ` · ${p.cargo}` : ''}`,
      tipo: 'oficial',
      disciplina: DISC_SIGLA[siglaTopico(x.top[0])] || 'Outros',
      tema: x.top.map((c) => `${c} – ${b.topicos[c] || ''}`).join('; '),
      fonte: `${p.banca || ''} · ${ce ? 'item' : 'questão'} ${x.n}`,
      meta: avisos.length ? `Atenção: ${avisos.join('; ')}` : '',
      enunciado: x.e, alternativas: x.a, resposta: x.r, comentario: x.c || '',
      apoio: x.ap ? b.apoios[x.ap] || '' : '',
    };
  });
  banco = { provas: b.provas, topicos: b.topicos, q };
  return banco;
}

const filtrosPadrao = { disc: '', top: '', prova: '', banca: '', situacao: 'novas', ce: false, qtd: 10 };
const filtrosBanco = () => Object.assign({}, filtrosPadrao, guardado.get('filtrosBanco', {}));

/* Aplica os filtros, menos os indicados em "ignorar" (para contar as opções de cada filtro). */
function filtrarBanco(lista, f, ignorar = [], resp = respostas()) {
  return lista.filter((q) => {
    if (!f.ce && q.ce) return false;
    if (!ignorar.includes('disc') && f.disc && siglaTopico(q.top[0]) !== f.disc && !(f.disc === 'HPE' && siglaTopico(q.top[0]) === 'HP')) return false;
    if (!ignorar.includes('top') && f.top && !q.top.includes(f.top)) return false;
    if (!ignorar.includes('prova') && f.prova && q.p !== f.prova) return false;
    const p = (banco && banco.provas[q.p]) || {};
    if (!ignorar.includes('banca') && f.banca === 'aocp' && p.banca !== 'Instituto AOCP') return false;
    if (!ignorar.includes('banca') && f.banca === 'pm' && p.grupo !== 'PM') return false;
    if (!ignorar.includes('situacao')) {
      const r = resp[q.id];
      if (f.situacao === 'novas' && r) return false;
      if (f.situacao === 'erradas' && !(r && !r.ok)) return false;
      if (f.situacao === 'certas' && !(r && r.ok)) return false;
    }
    return true;
  });
}

async function telaBanco() {
  pararRelogio();
  setTopo('Banco de questões', true);
  tela.innerHTML = '<p class="aviso">Carregando o banco de questões…</p>';
  let b;
  try { b = await obterBanco(); } catch {
    tela.innerHTML = '<p class="aviso">O banco de questões ainda não foi guardado no celular. Abra o app com internet uma vez.</p>';
    return;
  }
  if (location.hash !== '#/questoes/banco') return;
  const f = filtrosBanco();
  const todas = b.q;
  const salvar = (mudanca) => {
    const novo = Object.assign(filtrosBanco(), mudanca);
    if ('disc' in mudanca) { novo.top = ''; }
    guardado.set('filtrosBanco', novo);
    telaBanco();
  };

  // opções, cada uma com a contagem que daria se fosse escolhida
  const resp = respostas(); // lido uma vez: as contagens abaixo filtram o banco várias vezes
  const conta = (campo, valor) => filtrarBanco(todas, Object.assign({}, f, { [campo]: valor }, campo === 'disc' ? { top: '' } : {}), [], resp).length;
  const discs = ORDEM_DISC.filter((s) => todas.some((q) => siglaTopico(q.top[0]) === s));
  const topicos = [...new Set(filtrarBanco(todas, f, ['top', 'situacao']).flatMap((q) => q.top))]
    .filter((c) => !f.disc || siglaTopico(c) === f.disc).sort((x, y) => ordemTopico(x) - ordemTopico(y));
  const provas = Object.values(b.provas).filter((p) => todas.some((q) => q.p === p.id))
    .sort((x, y) => (x.grupo === y.grupo ? y.ano - x.ano || x.nome.localeCompare(y.nome) : x.grupo === 'PM' ? -1 : 1));
  const resultado = filtrarBanco(todas, f);
  const st = estatisticas(filtrarBanco(todas, f, ['situacao']));
  const qtd = f.qtd === 0 ? resultado.length : Math.min(f.qtd, resultado.length);
  const nomeTop = (c) => `${c} – ${b.topicos[c] || ''}`;
  const chip = (campo, valor, rotulo) => `<button class="chip${f[campo] === valor ? ' ativo' : ''}" data-campo="${campo}" data-valor="${esc(String(valor))}" aria-pressed="${f[campo] === valor}">${esc(rotulo)}</button>`;

  tela.innerHTML = `
    <p class="aviso">${todas.length} questões oficiais de ${provas.length} provas (${provas.filter((p) => p.grupo === 'PM').length} de Polícia Militar), ligadas aos tópicos do edital da PMPE 2026. As da prova de Soldado PMPE 2023 ficam de fora: são o Simulado 1.</p>
    <h2 class="secao">Disciplina</h2>
    <div class="chips">${chip('disc', '', `Todas (${conta('disc', '')})`)}${discs.map((s) => chip('disc', s, `${DISC_SIGLA[s].replace(' e Legislação Extravagante', '')} (${conta('disc', s)})`)).join('')}</div>
    <div class="filtros">
      <label>Tópico do edital
        <select id="f-top"><option value="">Todos os tópicos</option>
          ${topicos.map((c) => `<option value="${esc(c)}" ${f.top === c ? 'selected' : ''}>${esc(nomeTop(c))} (${conta('top', c)})</option>`).join('')}
        </select></label>
      <label>Situação
        <select id="f-situacao">
          ${[['novas', 'Não resolvidas'], ['', 'Todas'], ['erradas', 'Que eu errei'], ['certas', 'Que eu acertei']]
            .map(([v, r]) => `<option value="${v}" ${f.situacao === v ? 'selected' : ''}>${r} (${conta('situacao', v)})</option>`).join('')}
        </select></label>
      <label>Banca e concurso
        <select id="f-banca">
          ${[['', 'Todas as bancas e áreas'], ['aocp', 'Só Instituto AOCP'], ['pm', 'Só provas de Polícia Militar']]
            .map(([v, r]) => `<option value="${v}" ${f.banca === v ? 'selected' : ''}>${r} (${conta('banca', v)})</option>`).join('')}
        </select></label>
      <label>Prova
        <select id="f-prova"><option value="">Todas as provas</option>
          ${provas.map((p) => `<option value="${esc(p.id)}" ${f.prova === p.id ? 'selected' : ''}>${esc(`${p.nome} · ${p.cargo}`)} (${conta('prova', p.id)})</option>`).join('')}
        </select></label>
      <label>Quantas por vez
        <select id="f-qtd">${[10, 20, 30, 50, 0].map((n) => `<option value="${n}" ${f.qtd === n ? 'selected' : ''}>${n || 'Todas'}</option>`).join('')}</select></label>
      <label class="check"><input type="checkbox" id="f-ce" ${f.ce ? 'checked' : ''}> Incluir itens de certo ou errado (Polícia Penal do DF)</label>
    </div>
    <div class="placar">
      <div><b>${st.total}</b><span>com esses filtros</span></div>
      <div><b>${st.resolvidas}</b><span>já resolvidas</span></div>
      <div><b>${st.pct != null ? `${st.pct}%` : '–'}</b><span>de acerto</span></div>
    </div>
    <button class="btn primario largo" id="f-ir" ${qtd ? '' : 'disabled'}>${qtd ? `▶ Resolver ${qtd} ${qtd === 1 ? 'questão' : 'questões'}` : 'Nenhuma questão com esses filtros'}</button>
    ${f.disc || f.top || f.prova || f.banca || f.situacao !== 'novas' || f.ce ? '<button class="btn-link" id="f-limpar">Limpar os filtros</button>' : ''}
    ${f.disc ? desempenhoTopicos(todas, f, b) : ''}`;

  tela.querySelectorAll('.chip').forEach((c) => c.addEventListener('click', () => salvar({ [c.dataset.campo]: c.dataset.valor })));
  $('#f-top').addEventListener('change', (e) => salvar({ top: e.target.value }));
  $('#f-situacao').addEventListener('change', (e) => salvar({ situacao: e.target.value }));
  $('#f-banca').addEventListener('change', (e) => salvar({ banca: e.target.value }));
  $('#f-prova').addEventListener('change', (e) => salvar({ prova: e.target.value }));
  $('#f-qtd').addEventListener('change', (e) => salvar({ qtd: Number(e.target.value) }));
  $('#f-ce').addEventListener('change', (e) => salvar({ ce: e.target.checked }));
  const lim = $('#f-limpar');
  if (lim) lim.addEventListener('click', () => { guardado.set('filtrosBanco', { qtd: f.qtd }); telaBanco(); });
  tela.querySelectorAll('[data-top]').forEach((x) => x.addEventListener('click', () => salvar({ top: x.dataset.top })));
  $('#f-ir').addEventListener('click', () => {
    const ids = embaralhar(resultado).slice(0, qtd).map((q) => q.id);
    const partes = [f.top ? nomeTop(f.top) : f.disc ? DISC_SIGLA[f.disc] : 'Banco de questões'];
    if (f.prova && b.provas[f.prova]) partes.push(b.provas[f.prova].nome);
    iniciarSessao(ids, partes.join(' · '));
  });
}

/* Acerto por tópico da disciplina escolhida: mostra onde está o ponto fraco. */
function desempenhoTopicos(todas, f, b) {
  const lista = filtrarBanco(todas, Object.assign({}, f, { top: '', situacao: '' }));
  const porTop = new Map();
  for (const q of lista) for (const c of q.top) {
    if (siglaTopico(c) !== f.disc) continue;
    if (!porTop.has(c)) porTop.set(c, []);
    porTop.get(c).push(q);
  }
  const linhas = [...porTop].sort((x, y) => ordemTopico(x[0]) - ordemTopico(y[0])).map(([c, l]) => {
    const s = estatisticas(l);
    const pr = s.total ? Math.round((s.resolvidas / s.total) * 100) : 0;
    return `<button class="cartao linha-q" data-top="${esc(c)}"><div class="corpo"><strong>${esc(`${c} – ${b.topicos[c] || ''}`)}</strong>
      <span class="meta">${s.resolvidas} de ${s.total} resolvidas${s.pct != null ? ` · ${s.pct}% de acerto` : ''}${s.erros ? ` · ${s.erros} para revisar` : ''}</span>
      <span class="barra" aria-hidden="true"><span style="width:${pr}%"></span></span></div><span aria-hidden="true">›</span></button>`;
  }).join('');
  return linhas ? `<h2 class="secao">Seu desempenho por tópico</h2>${linhas}` : '';
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
  if (s.revisao && s.resp == null) s.resp = s.revisao[q.id] || ''; // correção de simulado: já vem respondida
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
    if (s.resp != null) return;
    escolhida = b.dataset.k;
    tela.querySelectorAll('.alt').forEach((x) => {
      x.classList.toggle('escolhida', x === b);
      x.setAttribute('aria-checked', String(x === b));
    });
    $('#q-acao').disabled = false;
  }));
  tela.querySelectorAll('.riscar').forEach((b) => b.addEventListener('click', () => b.parentElement.classList.toggle('riscada')));
  $('#q-acao').addEventListener('click', () => {
    if (s.resp == null) { responder(s, q, escolhida); return; }
    s.idx++;
    s.resp = null;
    s.avisoRev = '';
    guardado.set('sessaoQ', s);
    telaResolver();
  });
  if (s.resp != null) mostrarCorrecao(s, q);
  else iniciarRelogio();
}

function responder(s, q, k) {
  if (!k || s.resp != null) return;
  const ok = k === q.resposta;
  const seg = relogioQ ? Math.round((Date.now() - relogioQ.inicio) / 1000) : 0;
  pararRelogio();
  s.resp = k;
  s.feitas++;
  s.tempo += seg;
  if (ok) s.certas++; else s.erradas.push(q.id);
  s.avisoRev = gravarResposta(q.id, k, ok);
  guardado.set('sessaoQ', s);
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
    ${s.avisoRev ? `<p class="q-meta">${esc(s.avisoRev)}</p>` : ''}
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

/* ---------- simulado de prova ---------- */
/* Dois jeitos de fazer:
   - simulado do app: 60 questões do app (10 por disciplina, na ordem da prova), com cronômetro e a correção só no fim;
   - folha de respostas dos simulados do plano (Simulado 1 no papel, Simulado 2 no caderno do app): marca a letra e a
     certeza; a correção sai sozinha quando o gabarito chega ao app, no dia da correção do plano.
   guardado 'simAtual': o simulado em andamento; 'simulados': os entregues (a nota é calculada na hora de mostrar). */

const DISC_PROVA = [['LP', 'Língua Portuguesa'], ['HPE', 'História de Pernambuco'], ['RL', 'Raciocínio Lógico'],
  ['INF', 'Informática'], ['DC', 'Direito Constitucional'], ['DH', 'Direitos Humanos e Legislação Extravagante']];
const BLOCOS = [['I', ['LP', 'HPE']], ['II', ['RL', 'INF']], ['III', ['DC', 'DH']]];
const CERTEZAS = { C: 'certeza', D: 'dúvida', X: 'chute' };
const nomeDisc = (s) => (DISC_PROVA.find((d) => d[0] === s) || ['', s])[1];
const siglaPorNumero = (n) => DISC_PROVA[Math.min(5, Math.floor((n - 1) / 10))][0];
function siglaQuestao(q) {
  if (q.top && q.top.length) { const s = siglaTopico(q.top[0]); return s === 'HP' ? 'HPE' : s; }
  const d = norm(q.disciplina);
  if (d.startsWith('lingua')) return 'LP';
  if (d.startsWith('historia')) return 'HPE';
  if (d.startsWith('raciocinio')) return 'RL';
  if (d.startsWith('informatica')) return 'INF';
  if (d.startsWith('direito constitucional')) return 'DC';
  if (d.startsWith('direitos humanos')) return 'DH';
  return '';
}
const simAtual = () => guardado.get('simAtual', null);
const historicoSim = () => guardado.get('simulados', []);
const fmtDur = (min) => fmtMin(Math.round(min));
let relogioSim = null;

/* 60 questões: as não resolvidas primeiro (oficiais, da AOCP e com 5 alternativas na frente), depois as erradas. */
async function montarSimuladoApp() {
  const todas = filtrarAutorais(await obterQuestoes());
  const resp = respostas();
  const provas = (banco && banco.provas) || {};
  const ids = [];
  const faltas = [];
  for (const [s, nome] of DISC_PROVA) {
    const peso = (q) => {
      const r = resp[q.id];
      let p = r ? (r.ok ? 300 : 200) : 0;
      if (q.tipo !== 'oficial') p += 20;
      if (q.alternativas.length !== 5) p += 10;
      if (q.banco && provas[q.p] && provas[q.p].banca !== 'Instituto AOCP') p += 15;
      return p + Math.random() * 5;
    };
    const escolhidas = todas.filter((q) => siglaQuestao(q) === s && !q.ce && q.alternativas.length >= 4)
      .map((q) => [peso(q), q]).sort((a, b) => a[0] - b[0]).slice(0, 10).map((x) => x[1])
      .sort((a, b) => (a.apoio || '').localeCompare(b.apoio || '')); // as do mesmo texto de apoio ficam juntas
    if (escolhidas.length < 10) faltas.push(`${nome}: ${escolhidas.length}`);
    ids.push(...escolhidas.map((q) => q.id));
  }
  return { ids, faltas };
}

function comecarSimulado(dados) {
  const atual = simAtual();
  if (atual && !window.confirm(`Há um simulado em andamento (${atual.nome}). Descartar e começar outro?`)) return false;
  guardado.set('simAtual', Object.assign({ inicio: Date.now(), resp: {}, cert: {}, marc: {}, risc: {}, idx: 0 }, dados));
  return true;
}

function restanteSim(sim, agora = Date.now()) { return sim.inicio + sim.dur * 60000 - agora; }
function textoRelogioSim(sim) {
  const r = restanteSim(sim);
  return r > 0 ? `⏱ ${fmt(r / 1000)}` : `⏰ Tempo esgotado (+${fmt(-r / 1000)})`;
}
function ligarRelogioSim() {
  if (relogioSim) clearInterval(relogioSim);
  relogioSim = setInterval(() => {
    const el = $('#sim-relogio');
    const sim = simAtual();
    if (!el || !sim) { clearInterval(relogioSim); relogioSim = null; return; }
    el.textContent = textoRelogioSim(sim);
    el.classList.toggle('esgotado', restanteSim(sim) <= 0);
  }, 1000);
}

function resumoSimuladoHome() {
  const sim = simAtual();
  if (sim) {
    return `<a class="cartao cartao-q continuar" href="#/simulado/${sim.tipo === 'folha' ? 'folha' : 'fazer'}">
      <div class="icone-q" aria-hidden="true">⏱</div><div class="corpo"><strong>Continuar: ${esc(sim.nome)}</strong>
      <span class="meta">${Object.keys(sim.resp).length} de ${sim.total} marcadas · ${esc(textoRelogioSim(sim))}</span></div><span aria-hidden="true">▶</span></a>`;
  }
  const hoje = dataISO();
  const feitos = new Set(historicoSim().filter((r) => r.n).map((r) => r.n));
  const prox = (catalogo.simulados || []).find((s) => s.data >= hoje && diasEntre(hoje, s.data) <= 3 && !feitos.has(s.n));
  if (!prox) return '';
  const dias = diasEntre(hoje, prox.data);
  return `<a class="cartao cartao-q" href="#/simulado"><div class="icone-q" aria-hidden="true">⏱</div>
    <div class="corpo"><strong>${esc(prox.nome)} ${dias ? `em ${dias} ${dias === 1 ? 'dia' : 'dias'}` : 'é hoje'}</strong>
    <span class="meta">Abra a folha de respostas no app na hora de começar: ela marca o tempo e corrige quando o gabarito sair</span></div>
    <span aria-hidden="true">›</span></a>`;
}

async function telaSimulado() {
  pararRelogio();
  setTopo('Simulado de prova', true);
  const sim = simAtual();
  const hist = historicoSim();
  const hoje = dataISO();
  const dur = guardado.get('simDur', 180);
  const plano = catalogo.simulados || [];
  const cartaoPlano = (s) => {
    const feitos = hist.map((r, i) => [r, i]).filter(([r]) => r.n === s.n);
    const corrige = s.gabarito ? 'gabarito já no app: corrige na hora' : s.correcao ? `o gabarito chega ao app em ${s.correcao.slice(8, 10)}/${s.correcao.slice(5, 7)}` : 'correção com o Orquestrador';
    const cad = s.caderno && catalogo.docs.find((d) => d.id === s.caderno);
    const mat = s.material && catalogo.docs.find((d) => d.id === s.material);
    return `<div class="cartao sim-plano"><div class="corpo"><strong>${esc(s.nome)} · ${esc(dataCurta(s.data))}</strong>
      <span class="meta">${esc(s.fonte || '')} · ${esc(corrige)}</span>
      <div class="acoes">
        <button class="btn${s.data === hoje ? ' primario' : ''}" data-folha="${s.n}">📝 Folha de respostas</button>
        ${mat ? `<a class="btn" href="#/doc/${encodeURIComponent(mat.id)}">Instruções</a>` : ''}
        ${cad ? `<a class="btn" href="#/doc/${encodeURIComponent(cad.id)}">Caderno</a>` : ''}
        ${feitos.map(([r, i]) => `<a class="btn" href="#/simulado/resultado/${i}">Resultado de ${esc(dataCurta(r.data))}</a>`).join('')}
      </div></div></div>`;
  };

  tela.innerHTML = `
    <p class="aviso">Na prova: 60 questões, 10 por disciplina, e 5 h para a objetiva e a redação juntas. Para passar na objetiva:
      pelo menos 30% dos pontos em cada bloco (6 de 20), nenhuma disciplina zerada e 30% do total (18 de 60). As anuladas contam como acerto.</p>
    ${sim ? `<a class="cartao continuar" href="#/simulado/${sim.tipo === 'folha' ? 'folha' : 'fazer'}"><div class="corpo"><strong>Continuar: ${esc(sim.nome)}</strong>
      <span class="meta">${Object.keys(sim.resp).length} de ${sim.total} marcadas · ${esc(textoRelogioSim(sim))}</span></div><span aria-hidden="true">▶</span></a>` : ''}
    <h2 class="secao">Simulado montado pelo app</h2>
    <p class="aviso">60 questões do app, 10 de cada disciplina, na ordem da prova: primeiro as que você ainda não resolveu.
      Sem correção durante a prova; no fim, a nota por disciplina e por bloco. As respostas entram no caderno de erros.</p>
    <div class="filtros">
      <label>Tempo
        <select id="sim-dur">${[[180, '3 h (como no plano)'], [240, '4 h (sobra 1 h para a redação)'], [300, '5 h (tempo da prova inteira)']]
          .map(([v, r]) => `<option value="${v}" ${dur === v ? 'selected' : ''}>${r}</option>`).join('')}</select></label>
    </div>
    <button class="btn primario largo" id="sim-app">▶ Começar o simulado do app</button>
    <p class="aviso" id="sim-aviso"></p>
    ${plano.length ? `<h2 class="secao">Simulados do plano</h2>
      <p class="aviso">Faça no papel (ou no caderno do app) e marque as respostas na folha do app: ela marca o tempo, guarda a certeza de cada
        resposta e corrige sozinha quando o gabarito chegar.</p>${plano.map(cartaoPlano).join('')}` : ''}
    ${hist.length ? `<h2 class="secao">Seus resultados</h2>
      ${hist.map((r, i) => [r, i]).reverse().map(([r, i]) => {
        const c = notaRapida(r);
        return `<a class="cartao" href="#/simulado/resultado/${i}"><div class="data"><b>${r.data.slice(8, 10)}/${r.data.slice(5, 7)}</b>${esc(DIAS_CURTOS[deISO(r.data).getDay()])}</div>
          <div class="corpo"><strong>${esc(r.nome)}</strong><span class="meta">${c != null ? `${c} de ${r.total} acertos` : 'aguardando o gabarito'} · ${esc(fmtDur(r.usado / 60))}</span></div><span aria-hidden="true">›</span></a>`;
      }).join('')}` : ''}`;

  $('#sim-dur').addEventListener('change', (e) => guardado.set('simDur', Number(e.target.value)));
  $('#sim-app').addEventListener('click', async () => {
    const aviso = $('#sim-aviso');
    aviso.textContent = 'Montando o simulado…';
    let m;
    try { m = await montarSimuladoApp(); } catch {
      aviso.textContent = 'As questões ainda não foram guardadas no celular. Abra o app com internet uma vez.';
      return;
    }
    if (m.ids.length < 30) { aviso.textContent = `Ainda não há questões suficientes (${m.ids.length}).`; return; }
    if (m.faltas.length && !window.confirm(`Ainda não há 10 questões de cada disciplina no app (${m.faltas.join('; ')}). O simulado terá ${m.ids.length} questões. Começar assim?`)) {
      aviso.textContent = '';
      return;
    }
    const d = Number($('#sim-dur').value);
    if (comecarSimulado({ tipo: 'app', nome: 'Simulado do app', ids: m.ids, total: m.ids.length, dur: d })) location.hash = '#/simulado/fazer';
    else aviso.textContent = '';
  });
  tela.querySelectorAll('[data-folha]').forEach((b) => b.addEventListener('click', () => {
    const s = plano.find((x) => String(x.n) === b.dataset.folha);
    if (!s) return;
    const atual = simAtual();
    if (atual && atual.tipo === 'folha' && atual.n === s.n) { location.hash = '#/simulado/folha'; return; }
    if (comecarSimulado({ tipo: 'folha', n: s.n, nome: s.nome, total: s.total || 60, dur: 180 })) location.hash = '#/simulado/folha';
  }));
}

/* Acertos de um simulado entregue (ou null se o gabarito ainda não chegou), sem carregar as questões. */
function notaRapida(r) {
  if (r.tipo === 'app') return r.acertos != null ? r.acertos : null;
  const s = (catalogo.simulados || []).find((x) => x.n === r.n);
  if (!s || !s.gabarito) return null;
  let a = 0;
  for (let i = 1; i <= r.total; i++) {
    const g = s.gabarito[String(i)];
    if (g === 'ANULADA' || (g && r.resp[i - 1] === g)) a++;
  }
  return a;
}

async function telaSimuladoFazer() {
  pararRelogio();
  setTopo('Simulado', true);
  const sim = simAtual();
  if (!sim || sim.tipo !== 'app') { location.hash = '#/simulado'; return; }
  let todas;
  try { todas = await obterQuestoes(); } catch {
    tela.innerHTML = '<p class="aviso">As questões ainda não foram guardadas no celular. Abra o app com internet uma vez.</p>';
    return;
  }
  if (location.hash !== '#/simulado/fazer') return;
  const mapa = new Map(todas.map((q) => [q.id, q]));
  const i = Math.min(sim.idx, sim.ids.length - 1);
  const q = mapa.get(sim.ids[i]);
  const marcadas = Object.keys(sim.resp).length;
  const sig = q ? siglaQuestao(q) : '';
  const riscadas = sim.risc[i] || [];
  tela.innerHTML = `
    <div class="q-topo sim-topo"><span>Questão <b>${i + 1}</b> de ${sim.ids.length} · ${esc(sig)}</span>
      <span id="sim-relogio" class="sim-relogio${restanteSim(sim) <= 0 ? ' esgotado' : ''}">${esc(textoRelogioSim(sim))}</span></div>
    <div class="q-progresso" aria-hidden="true"><span style="width:${(marcadas / sim.ids.length) * 100}%"></span></div>
    ${q ? `
    <div class="q-fonte"><span class="selo ${q.tipo === 'oficial' ? 'oficial' : 'autoral'}">${q.tipo === 'oficial' ? 'Oficial' : 'Autoral · não oficial'}</span>${esc(q.disciplina)}</div>
    <p class="q-meta">${esc([q.fonte, q.origem].filter(Boolean).join(' · '))}</p>
    ${q.apoio ? `<details class="q-apoio"${guardado.get('simApoioAberto', false) ? ' open' : ''}><summary>Texto de apoio</summary><div class="q-html">${q.apoio}</div></details>` : ''}
    <div class="q-html q-enunciado">${q.enunciado}</div>
    <div class="q-alts" role="radiogroup" aria-label="Alternativas">
      ${q.alternativas.map(([k, html]) => `<div class="q-alt${riscadas.includes(k) ? ' riscada' : ''}">
        <button class="alt${sim.resp[i] === k ? ' escolhida' : ''}" data-k="${k}" role="radio" aria-checked="${sim.resp[i] === k}"><span class="letra">${k}</span><span class="txt">${html}</span></button>
        <button class="riscar" data-r="${k}" aria-label="Riscar a alternativa ${k}" title="Riscar alternativa">✂</button></div>`).join('')}
    </div>
    <div class="chips sim-cert" role="group" aria-label="Seu grau de certeza">
      ${Object.entries(CERTEZAS).map(([k, r]) => `<button class="chip${sim.cert[i] === k ? ' ativo' : ''}" data-c="${k}" aria-pressed="${sim.cert[i] === k}">${k} · ${r}</button>`).join('')}
    </div>` : '<p class="aviso">Esta questão não está mais no app. Pule para a próxima.</p>'}
    <div class="q-botoes sim-botoes">
      <button class="btn" id="sim-ant" ${i ? '' : 'disabled'}>‹</button>
      <button class="btn${sim.marc[i] ? ' marcada' : ''}" id="sim-marcar" aria-pressed="${!!sim.marc[i]}">${sim.marc[i] ? '★ Marcada' : '☆ Revisar depois'}</button>
      <button class="btn" id="sim-grade">Folha</button>
      <button class="btn primario" id="sim-prox">${i + 1 < sim.ids.length ? 'Próxima ›' : 'Entregar'}</button>
    </div>
    <div id="sim-grade-caixa" hidden>${gradeSimulado(sim, i)}
      <button class="btn primario largo" id="sim-entregar">Entregar o simulado</button></div>`;
  window.scrollTo(0, 0);
  ligarRelogioSim();

  const salvar = () => guardado.set('simAtual', sim);
  const ir = (n) => { sim.idx = Math.max(0, Math.min(sim.ids.length - 1, n)); salvar(); telaSimuladoFazer(); };
  tela.querySelectorAll('.alt').forEach((b) => b.addEventListener('click', () => {
    if (sim.resp[i] === b.dataset.k) delete sim.resp[i]; else sim.resp[i] = b.dataset.k;
    salvar();
    tela.querySelectorAll('.alt').forEach((x) => {
      x.classList.toggle('escolhida', x.dataset.k === sim.resp[i]);
      x.setAttribute('aria-checked', String(x.dataset.k === sim.resp[i]));
    });
    const n = Object.keys(sim.resp).length;
    tela.querySelector('.q-progresso span').style.width = `${(n / sim.ids.length) * 100}%`;
  }));
  tela.querySelectorAll('.riscar').forEach((b) => b.addEventListener('click', () => {
    const l = sim.risc[i] || [];
    sim.risc[i] = l.includes(b.dataset.r) ? l.filter((x) => x !== b.dataset.r) : l.concat(b.dataset.r);
    salvar();
    b.parentElement.classList.toggle('riscada');
  }));
  tela.querySelectorAll('[data-c]').forEach((b) => b.addEventListener('click', () => {
    if (sim.cert[i] === b.dataset.c) delete sim.cert[i]; else sim.cert[i] = b.dataset.c;
    salvar();
    tela.querySelectorAll('[data-c]').forEach((x) => {
      x.classList.toggle('ativo', x.dataset.c === sim.cert[i]);
      x.setAttribute('aria-pressed', String(x.dataset.c === sim.cert[i]));
    });
  }));
  const ap = tela.querySelector('.q-apoio');
  if (ap) ap.addEventListener('toggle', () => guardado.set('simApoioAberto', ap.open));
  $('#sim-ant').addEventListener('click', () => ir(i - 1));
  $('#sim-prox').addEventListener('click', () => (i + 1 < sim.ids.length ? ir(i + 1) : entregarSimulado()));
  $('#sim-marcar').addEventListener('click', () => { if (sim.marc[i]) delete sim.marc[i]; else sim.marc[i] = 1; salvar(); telaSimuladoFazer(); });
  $('#sim-grade').addEventListener('click', () => { const g = $('#sim-grade-caixa'); g.hidden = !g.hidden; if (!g.hidden) g.scrollIntoView({ block: 'start' }); });
  tela.querySelectorAll('[data-ir]').forEach((b) => b.addEventListener('click', () => ir(Number(b.dataset.ir))));
  $('#sim-entregar').addEventListener('click', entregarSimulado);
}

function gradeSimulado(sim, atual) {
  let html = '';
  for (let d = 0; d * 10 < sim.ids.length; d++) {
    const nums = [];
    for (let i = d * 10; i < Math.min(sim.ids.length, d * 10 + 10); i++) {
      const cls = [sim.resp[i] ? 'feita' : '', sim.marc[i] ? 'marcada' : '', i === atual ? 'atual' : ''].filter(Boolean).join(' ');
      nums.push(`<button class="num ${cls}" data-ir="${i}" aria-label="Questão ${i + 1}${sim.resp[i] ? `, marcou ${sim.resp[i]}` : ', em branco'}${sim.marc[i] ? ', para revisar' : ''}">${i + 1}<small>${sim.resp[i] || ''}</small></button>`);
    }
    html += `<div class="grade-nums">${nums.join('')}</div>`;
  }
  const brancas = sim.ids.length - Object.keys(sim.resp).length;
  return `<p class="aviso">${brancas ? `${brancas} em branco. ` : 'Todas marcadas. '}★ = marcada para revisar. Toque num número para ir à questão.</p>${html}`;
}

function telaSimuladoFolha() {
  pararRelogio();
  const sim = simAtual();
  if (!sim || sim.tipo !== 'folha') { location.hash = '#/simulado'; return; }
  setTopo(`Folha · ${sim.nome}`, true);
  const info = (catalogo.simulados || []).find((s) => s.n === sim.n) || {};
  const linha = (i) => `<div class="folha-linha" data-i="${i}"><b>${i + 1}</b>
    <span class="folha-letras">${['A', 'B', 'C', 'D', 'E'].map((k) => `<button class="letra-btn${sim.resp[i] === k ? ' ativo' : ''}" data-k="${k}" aria-pressed="${sim.resp[i] === k}" aria-label="Questão ${i + 1}, letra ${k}">${k}</button>`).join('')}</span>
    <button class="cert-btn" data-cert aria-label="Certeza da questão ${i + 1}: ${sim.cert[i] ? CERTEZAS[sim.cert[i]] : 'não marcada'}">${sim.cert[i] || '·'}</button></div>`;
  let corpo = '';
  for (let d = 0; d * 10 < sim.total; d++) {
    const ini = d * 10;
    corpo += `<h2 class="secao">${esc(nomeDisc(siglaPorNumero(ini + 1)))} (${ini + 1} a ${Math.min(sim.total, ini + 10)})</h2>`;
    for (let i = ini; i < Math.min(sim.total, ini + 10); i++) corpo += linha(i);
  }
  const cad = info.caderno && catalogo.docs.find((x) => x.id === info.caderno);
  tela.innerHTML = `
    <div class="q-topo sim-topo"><span id="folha-cont">${Object.keys(sim.resp).length} de ${sim.total} marcadas</span>
      <span id="sim-relogio" class="sim-relogio${restanteSim(sim) <= 0 ? ' esgotado' : ''}">${esc(textoRelogioSim(sim))}</span></div>
    <p class="aviso">${esc(info.fonte || '')}. Toque na letra para marcar (de novo, para apagar) e no ponto à direita para a certeza:
      C = certeza, D = dúvida, X = chute. ${cad ? `<a href="#/doc/${encodeURIComponent(cad.id)}">Abrir o caderno</a>.` : ''}</p>
    ${corpo}
    <div class="acoes">
      <button class="btn primario" id="folha-entregar">Entregar a folha</button>
      <button class="btn" id="folha-copiar">Copiar a folha para o Orquestrador</button>
    </div>
    <p class="aviso" id="folha-aviso"></p>`;
  ligarRelogioSim();
  tela.querySelectorAll('.folha-linha').forEach((l) => l.addEventListener('click', (e) => {
    const i = Number(l.dataset.i);
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.k) {
      if (sim.resp[i] === b.dataset.k) delete sim.resp[i]; else sim.resp[i] = b.dataset.k;
      l.querySelectorAll('.letra-btn').forEach((x) => { x.classList.toggle('ativo', x.dataset.k === sim.resp[i]); x.setAttribute('aria-pressed', String(x.dataset.k === sim.resp[i])); });
      $('#folha-cont').textContent = `${Object.keys(sim.resp).length} de ${sim.total} marcadas`;
    } else if (b.hasAttribute('data-cert')) {
      const ordem = ['', 'C', 'D', 'X'];
      const prox = ordem[(ordem.indexOf(sim.cert[i] || '') + 1) % ordem.length];
      if (prox) sim.cert[i] = prox; else delete sim.cert[i];
      b.textContent = prox || '·';
      b.setAttribute('aria-label', `Certeza da questão ${i + 1}: ${prox ? CERTEZAS[prox] : 'não marcada'}`);
    }
    guardado.set('simAtual', sim);
  }));
  $('#folha-entregar').addEventListener('click', entregarSimulado);
  $('#folha-copiar').addEventListener('click', async () => {
    $('#folha-aviso').textContent = (await copiarTexto(textoFolha(Object.assign({ usado: (Date.now() - sim.inicio) / 1000 }, sim), null)))
      ? 'Copiado. Cole na conversa com o Orquestrador.' : 'Não deu para copiar neste celular.';
  });
}

async function entregarSimulado() {
  const sim = simAtual();
  if (!sim) return;
  const brancas = sim.total - Object.keys(sim.resp).length;
  if (!window.confirm(`Entregar o simulado?${brancas ? ` ${brancas} ${brancas === 1 ? 'questão está' : 'questões estão'} em branco.` : ''}`)) return;
  const usado = Math.round((Math.min(Date.now(), sim.inicio + sim.dur * 60000 * 3) - sim.inicio) / 1000);
  const r = { tipo: sim.tipo, n: sim.n || 0, nome: sim.nome, data: dataISO(new Date(sim.inicio)), inicio: sim.inicio,
    usado, dur: sim.dur, total: sim.total, resp: sim.resp, cert: sim.cert, ids: sim.ids || null };
  if (sim.tipo === 'app') { // grava as respostas no histórico: caderno de erros e revisão espaçada
    const mapa = new Map((await obterQuestoes()).map((q) => [q.id, q]));
    let acertos = 0, feitas = 0;
    sim.ids.forEach((id, i) => {
      const q = mapa.get(id);
      if (!q || !sim.resp[i]) return;
      const ok = sim.resp[i] === q.resposta;
      feitas++;
      if (ok) acertos++;
      gravarResposta(id, sim.resp[i], ok);
    });
    r.acertos = acertos;
    r.registrado = true;
    registrarAtividade({ q: feitas, a: acertos });
  }
  registrarAtividade({ c: usado });
  const hist = historicoSim();
  hist.push(r);
  guardado.set('simulados', hist);
  guardado.set('simAtual', null);
  location.hash = `#/simulado/resultado/${hist.length - 1}`;
}

/* Correção item a item: [{i, sig, marcada, gabarito, ok, top, id}] ou null sem gabarito. */
async function corrigirSimulado(r) {
  const itens = [];
  if (r.tipo === 'app') {
    const mapa = new Map((await obterQuestoes()).map((q) => [q.id, q]));
    r.ids.forEach((id, i) => {
      const q = mapa.get(id);
      if (!q) return;
      itens.push({ i, sig: siglaQuestao(q), marcada: r.resp[i] || '', gabarito: q.resposta, ok: r.resp[i] === q.resposta, top: q.top || [], id });
    });
    return itens;
  }
  const s = (catalogo.simulados || []).find((x) => x.n === r.n);
  if (!s || !s.gabarito) return null;
  for (let i = 0; i < r.total; i++) {
    const n = String(i + 1);
    const g = s.gabarito[n];
    itens.push({ i, sig: siglaPorNumero(i + 1), marcada: r.resp[i] || '', gabarito: g, ok: g === 'ANULADA' || (!!g && r.resp[i] === g),
      top: (s.topicos && s.topicos[n]) || [], id: (s.ids && s.ids[n]) || null });
  }
  return itens;
}

function analisarSimulado(itens) {
  const porDisc = {};
  for (const [s] of DISC_PROVA) porDisc[s] = { a: 0, n: 0 };
  for (const it of itens) {
    if (!porDisc[it.sig]) porDisc[it.sig] = { a: 0, n: 0 };
    porDisc[it.sig].n++;
    if (it.ok) porDisc[it.sig].a++;
  }
  const acertos = itens.filter((x) => x.ok).length;
  const blocos = BLOCOS.map(([b, ss]) => {
    const a = ss.reduce((t, s) => t + porDisc[s].a, 0);
    const n = ss.reduce((t, s) => t + porDisc[s].n, 0);
    return { b, a, n, min: Math.ceil(n * 0.3), ok: a >= Math.ceil(n * 0.3) };
  });
  const zeradas = DISC_PROVA.filter(([s]) => porDisc[s].n && !porDisc[s].a).map(([s]) => s);
  const minTotal = Math.ceil(itens.length * 0.3);
  const problemas = [
    ...blocos.filter((b) => b.n && !b.ok).map((b) => `Bloco ${b.b} com ${b.a} (mínimo ${b.min})`),
    ...zeradas.map((s) => `${nomeDisc(s)} zerada`),
    ...(acertos < minTotal ? [`total de ${acertos} (mínimo ${minTotal})`] : []),
  ];
  return { porDisc, acertos, blocos, problemas };
}

async function telaResultadoSim(idx) {
  pararRelogio();
  setTopo('Resultado do simulado', true);
  const hist = historicoSim();
  const r = hist[idx];
  if (!r) { location.hash = '#/simulado'; return; }
  tela.innerHTML = '<p class="aviso">Corrigindo…</p>';
  let itens;
  try { itens = await corrigirSimulado(r); } catch {
    tela.innerHTML = '<p class="aviso">As questões ainda não foram guardadas no celular. Abra o app com internet uma vez.</p>';
    return;
  }
  if (!location.hash.startsWith('#/simulado/resultado/')) return;
  const info = (catalogo.simulados || []).find((x) => x.n === r.n) || {};
  const tempo = `Usou ${fmtDur(r.usado / 60)} de ${fmtDur(r.dur)}${r.usado > r.dur * 60 ? ' (passou do tempo)' : ''}`;
  if (!itens) {
    tela.innerHTML = `<div class="q-fim"><p class="q-fim-pct">📝</p><p><b>${esc(r.nome)}</b> entregue em ${esc(dataCurta(r.data))}.</p>
      <p class="meta">${Object.keys(r.resp).length} de ${r.total} marcadas · ${esc(tempo)}</p></div>
      <p class="aviso">${info.correcao ? `O gabarito chega ao app em ${info.correcao.slice(8, 10)}/${info.correcao.slice(5, 7)}, o dia da correção no plano. Aí o resultado aparece aqui sozinho, por disciplina e por bloco.` : 'O gabarito ainda não está no app.'}
        Até lá, se quiser, mande a folha ao Orquestrador.</p>
      <div class="acoes"><button class="btn primario" id="res-copiar">Copiar a folha para o Orquestrador</button>
        <button class="btn-link" id="res-apagar">Apagar esta folha</button></div><p class="aviso" id="res-aviso"></p>`;
    ligarAcoesResultado(r, idx, null, null);
    return;
  }
  if (!r.registrado && itens.every((x) => x.id)) { // Simulado 2: as questões estão no app, entram no histórico
    let a = 0, f = 0;
    for (const it of itens) {
      if (!it.marcada || it.gabarito === 'ANULADA') continue;
      f++;
      if (it.ok) a++;
      gravarResposta(it.id, it.marcada, it.ok);
    }
    registrarAtividade({ q: f, a });
    r.registrado = true;
    guardado.set('simulados', hist);
  }
  const an = analisarSimulado(itens);
  const pct = itens.length ? Math.round((an.acertos / itens.length) * 100) : 0;
  const nomesTop = new Map((catalogo.edital || []).map((it) => [it.c, it.curto]));
  const errosTop = new Map();
  for (const it of itens.filter((x) => !x.ok)) for (const c of it.top.slice(0, 2)) errosTop.set(c, (errosTop.get(c) || 0) + 1);
  const cert = {};
  for (const it of itens) {
    const k = r.cert[it.i] || '';
    if (!cert[k]) cert[k] = { a: 0, n: 0 };
    cert[k].n++;
    if (it.ok) cert[k].a++;
  }
  const anuladas = itens.filter((x) => x.gabarito === 'ANULADA').length;
  tela.innerHTML = `
    <div class="q-fim">
      <p class="q-fim-pct">${an.acertos}<small>/${itens.length}</small></p>
      <p><b>${esc(r.nome)}</b> · ${esc(dataCurta(r.data))} · ${pct}% de acerto</p>
      <p class="meta">${esc(tempo)}${anuladas ? ` · ${anuladas} ${anuladas === 1 ? 'anulada contou' : 'anuladas contaram'} como acerto` : ''}</p>
    </div>
    <div class="q-veredito ${an.problemas.length ? 'erro' : 'ok'}">${an.problemas.length
      ? `✗ Pelos critérios da objetiva, não passaria: ${esc(an.problemas.join('; '))}.`
      : '✓ Passaria nos critérios mínimos da objetiva (30% em cada bloco, nenhuma zerada, 30% do total).'}</div>
    <div class="placar">${an.blocos.map((b) => `<div><b>${b.a}/${b.n}</b><span>Bloco ${b.b} ${b.ok ? '✓' : `✗ mín. ${b.min}`}</span></div>`).join('')}</div>
    <h2 class="secao">Por disciplina</h2>
    ${DISC_PROVA.filter(([s]) => an.porDisc[s].n).map(([s, nome]) => {
      const x = an.porDisc[s];
      return `<div class="cartao linha-q"><div class="corpo"><strong>${esc(nome)}</strong>
        <span class="meta">${x.a} de ${x.n} certas${x.a ? '' : ' · zerada'}</span>
        <span class="barra" aria-hidden="true"><span style="width:${x.n ? Math.round((x.a / x.n) * 100) : 0}%"></span></span></div></div>`;
    }).join('')}
    ${Object.keys(r.cert).length ? `<h2 class="secao">Certeza × acerto</h2>
      <p class="aviso">${['C', 'D', 'X', ''].filter((k) => cert[k]).map((k) => `${k ? CERTEZAS[k][0].toUpperCase() + CERTEZAS[k].slice(1) : 'Sem marcação'}: ${cert[k].a} de ${cert[k].n} certas`).join(' · ')}.
        Errar com certeza mostra conteúdo aprendido errado; acertar no chute não é conhecimento firme.</p>` : ''}
    ${errosTop.size ? `<h2 class="secao">Onde errou (tópicos do edital)</h2>
      ${[...errosTop].sort((a, b) => b[1] - a[1]).map(([c, n]) => `<div class="cartao"><div class="corpo"><strong>${esc(c)} – ${esc(nomesTop.get(c) || '')}</strong>
        <span class="meta">${n} ${n === 1 ? 'erro' : 'erros'}</span></div></div>`).join('')}` : ''}
    <div class="acoes">
      ${itens.some((x) => x.id) ? '<button class="btn primario" id="res-ver">Ver a correção questão por questão</button>' : ''}
      ${itens.some((x) => x.id && !x.ok) ? '<button class="btn" id="res-refazer">Refazer as erradas</button>' : ''}
      <button class="btn" id="res-copiar">Copiar o resultado para o Orquestrador</button>
    </div>
    ${info.correcaoDoc && catalogo.docs.some((d) => d.id === info.correcaoDoc) ? `<p><a class="btn-link" href="#/doc/${encodeURIComponent(info.correcaoDoc)}">Abrir o material da correção</a></p>` : ''}
    <p class="aviso" id="res-aviso"></p>
    <p class="rodape"><button class="btn-link" id="res-apagar">Apagar este resultado</button></p>`;
  ligarAcoesResultado(r, idx, itens, an);
}

function ligarAcoesResultado(r, idx, itens, an) {
  const ver = $('#res-ver');
  if (ver) ver.addEventListener('click', () => {
    const com = itens.filter((x) => x.id);
    const revisao = {};
    for (const it of com) revisao[it.id] = it.marcada;
    guardado.set('sessaoQ', { titulo: `Correção: ${r.nome}`, ids: com.map((x) => x.id), idx: 0, certas: com.filter((x) => x.ok).length,
      feitas: com.length, tempo: r.usado, erradas: com.filter((x) => !x.ok).map((x) => x.id), resp: null, revisao });
    location.hash = '#/questoes/resolver';
  });
  const ref = $('#res-refazer');
  if (ref) ref.addEventListener('click', () => iniciarSessao(itens.filter((x) => x.id && !x.ok).map((x) => x.id), `Erradas do ${r.nome}`));
  $('#res-copiar').addEventListener('click', async () => {
    $('#res-aviso').textContent = (await copiarTexto(textoFolha(r, itens, an))) ? 'Copiado. Cole na conversa com o Orquestrador.' : 'Não deu para copiar neste celular.';
  });
  $('#res-apagar').addEventListener('click', () => {
    if (!window.confirm('Apagar este resultado? As respostas que já entraram no caderno de erros continuam lá.')) return;
    const hist = historicoSim();
    hist.splice(idx, 1);
    guardado.set('simulados', hist);
    location.hash = '#/simulado';
  });
}

/* Texto para colar na conversa com o Orquestrador: a folha (e o resultado, se já corrigido). */
function textoFolha(r, itens, an) {
  const linhas = [`${r.nome} — ${dataCurta(r.data || dataISO())}, tempo usado: ${fmtDur((r.usado || 0) / 60)} de ${fmtDur(r.dur)}`];
  linhas.push('Folha de respostas (letra e certeza: C = certeza, D = dúvida, X = chute):');
  for (let d = 0; d * 10 < r.total; d++) {
    const parte = [];
    for (let i = d * 10; i < Math.min(r.total, d * 10 + 10); i++) parte.push(`${i + 1} ${r.resp[i] || '—'}${r.cert[i] ? ` (${r.cert[i]})` : ''}`);
    linhas.push(`${nomeDisc(siglaPorNumero(d * 10 + 1))}: ${parte.join(' · ')}`);
  }
  const brancas = [];
  for (let i = 0; i < r.total; i++) if (!r.resp[i]) brancas.push(i + 1);
  if (brancas.length) linhas.push(`Em branco: ${brancas.join(', ')}.`);
  if (itens && an) {
    linhas.push('', `Resultado no app: ${an.acertos} de ${itens.length}. ${an.blocos.map((b) => `Bloco ${b.b}: ${b.a}/${b.n}`).join('; ')}.`);
    linhas.push(DISC_PROVA.filter(([s]) => an.porDisc[s].n).map(([s]) => `${s} ${an.porDisc[s].a}/${an.porDisc[s].n}`).join(' · '));
    const erradas = itens.filter((x) => !x.ok).map((x) => `${x.i + 1} (marquei ${x.marcada || 'nada'}, gabarito ${x.gabarito})`);
    if (erradas.length) linhas.push(`Erradas: ${erradas.join('; ')}.`);
    linhas.push('', 'Comente os meus erros por tópico do edital e me diga o que revisar primeiro.');
  } else {
    linhas.push('', 'Corrija pelo gabarito e registre os erros por disciplina e tópico do edital.');
  }
  return linhas.join('\n');
}

async function copiarTexto(texto) {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    const t = document.createElement('textarea');
    t.value = texto;
    t.setAttribute('readonly', '');
    t.style.position = 'fixed';
    t.style.opacity = '0';
    document.body.appendChild(t);
    t.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch { ok = false; }
    t.remove();
    return ok;
  }
}

/* ---------- flashcards com revisão espaçada ---------- */
/* Cada linha das "Pegadinhas" e dos "Quadros para não confundir" vira um cartão.
   Estado em guardado 'cartoes': { id: { c, p, n, e, u, k } }: c = degrau (INTERVALOS[c] dias), p = próxima revisão,
   n = revisões, e = erros, u = último dia, k = acertou a última.
   Acertou: sobe um degrau (1, 3, 7, 15, 30, 60 dias). Errou: volta para amanhã e repete no fim da sessão. */

const INTERVALOS = [1, 3, 7, 15, 30, 60];
const DOMINADO = 4; // a partir de 30 dias
const OPCOES_NOVOS = [10, 20, 30, 50, 0]; // 0 = sem limite
let cartoes = null;

async function obterCartoes() {
  if (cartoes) return cartoes;
  const info = catalogo && catalogo.cartoes;
  if (!info) return [];
  let r = await caches.match(abs(info.arquivo));
  if (!r) {
    r = await fetch(info.arquivo);
    if (!r.ok) throw new Error('cartões indisponíveis');
    try { (await caches.open(CACHE_DADOS)).put(abs(info.arquivo), r.clone()); } catch { /* ok */ }
  }
  cartoes = await r.json();
  return cartoes;
}

const estadoCartoes = () => guardado.get('cartoes', {});
const novosPorDia = () => guardado.get('novosPorDia', 20);
const somaDias = (iso, n) => { const d = deISO(iso); d.setDate(d.getDate() + n); return dataISO(d); };
const novosHoje = () => { const x = guardado.get('novosHoje', null); return x && x.d === dataISO() ? x.n : 0; };
const quandoVolta = (dias) => (dias === 1 ? 'amanhã' : `em ${dias} dias`);

/* Revisões vencidas (as mais atrasadas primeiro) e cartões novos (dos materiais mais antigos primeiro). */
function filaCartoes(lista, comLimite) {
  const est = estadoCartoes();
  const hoje = dataISO();
  const vencidos = lista.filter((c) => est[c.id] && est[c.id].p <= hoje)
    .sort((a, b) => est[a.id].p.localeCompare(est[b.id].p));
  const lim = novosPorDia();
  const vagas = comLimite && lim ? Math.max(0, lim - novosHoje()) : Infinity;
  const novos = lista.filter((c) => !est[c.id]).slice(0, vagas);
  return { vencidos, novos };
}

function estatCartoes(lista) {
  const est = estadoCartoes();
  const hoje = dataISO();
  let vistos = 0, dominados = 0, hojeN = 0, errados = 0;
  for (const c of lista) {
    const s = est[c.id];
    if (!s) continue;
    vistos++;
    if (s.c >= DOMINADO) dominados++;
    if (s.p <= hoje) hojeN++;
    if (s.k === false) errados++;
  }
  return { total: lista.length, vistos, dominados, vencidos: hojeN, errados };
}

function iniciarCartoes(ids, titulo) {
  if (!ids.length) return;
  guardado.set('sessaoC', { titulo, ids, i: 0, virado: false, certos: 0, errados: [], rep: {}, primeira: 0 });
  if (location.hash === '#/cartoes/estudar') telaEstudarCartoes();
  else location.hash = '#/cartoes/estudar';
}

/* Sessão de um material (do botão na tela do texto): o que está para hoje; se nada, todos os cartões dele. */
async function cartoesDoMaterial(item) {
  const todos = (await obterCartoes()).filter((c) => c.doc === item.id);
  const { vencidos, novos } = filaCartoes(todos, false);
  const ids = vencidos.length + novos.length ? [...vencidos, ...novos] : todos;
  iniciarCartoes(ids.map((c) => c.id), `Flashcards de ${(item.subtitulo || '').split(' ').pop() || item.titulo}`);
}

function resumoCartoesHome() {
  const info = catalogo.cartoes;
  if (!info || !info.total) return '';
  obterCartoes().then((lista) => {
    const el = $('#home-cartoes');
    if (!el) return;
    const { vencidos, novos } = filaCartoes(lista, true);
    const st = estatCartoes(lista);
    el.textContent = vencidos.length + novos.length
      ? `${vencidos.length} para revisar hoje · ${novos.length} novos${st.dominados ? ` · ${st.dominados} dominados` : ''}`
      : `Tudo revisado hoje ✓${st.dominados ? ` · ${st.dominados} dominados` : ''}`;
  }).catch(() => {});
  return `<a class="cartao cartao-q" href="#/cartoes">
      <div class="icone-q" aria-hidden="true">🃏</div>
      <div class="corpo"><strong>Flashcards</strong>
        <span class="meta" id="home-cartoes">${info.total} cartões de pegadinhas e quadros</span></div>
      <span aria-hidden="true">›</span></a>`;
}

async function telaCartoes() {
  pararRelogio();
  setTopo('Flashcards', true);
  tela.innerHTML = '<p class="aviso">Carregando cartões…</p>';
  let lista;
  try { lista = await obterCartoes(); } catch {
    tela.innerHTML = '<p class="aviso">Os cartões ainda não foram guardados no celular. Abra o app com internet uma vez.</p>';
    return;
  }
  if (location.hash !== '#/cartoes') return;
  const est = estadoCartoes();
  const st = estatCartoes(lista);
  const { vencidos, novos } = filaCartoes(lista, true);
  const paraHoje = [...vencidos, ...novos];
  const errados = lista.filter((c) => est[c.id] && est[c.id].k === false);
  const amanha = somaDias(dataISO(), 1);
  const nAmanha = lista.filter((c) => est[c.id] && est[c.id].p === amanha).length;
  const sessao = guardado.get('sessaoC', null);
  const emAndamento = sessao && sessao.i < sessao.ids.length;

  const agrupar = (chave) => {
    const m = new Map();
    for (const c of lista) { const k = chave(c); if (!m.has(k)) m.set(k, []); m.get(k).push(c); }
    return [...m];
  };
  const disciplinas = agrupar((c) => c.disciplina).sort((a, b) => a[0].localeCompare(b[0], 'pt-BR'));
  const materiais = agrupar((c) => c.doc).sort((a, b) => b[1][0].data.localeCompare(a[1][0].data));
  const linha = (nome, l, attr) => {
    const s = estatCartoes(l);
    const f = filaCartoes(l, false);
    const pend = f.vencidos.length + f.novos.length;
    return `<button class="cartao linha-q" ${attr}><div class="corpo"><strong>${esc(nome)}</strong>
      <span class="meta">${s.total} cartões · ${s.vistos} vistos${pend ? ` · ${pend} para estudar` : ''}${s.dominados ? ` · ${s.dominados} dominados` : ''}</span>
      <span class="barra" aria-hidden="true"><span style="width:${s.total ? Math.round((s.dominados / s.total) * 100) : 0}%"></span></span></div><span aria-hidden="true">›</span></button>`;
  };
  const lim = novosPorDia();

  tela.innerHTML = `
    <div class="placar">
      <div><b>${paraHoje.length}</b><span>para hoje</span></div>
      <div><b>${st.vistos}</b><span>de ${st.total} vistos</span></div>
      <div><b>${st.dominados}</b><span>dominados</span></div>
    </div>
    ${emAndamento ? `<a class="cartao continuar" href="#/cartoes/estudar"><div class="corpo"><strong>Continuar: ${esc(sessao.titulo)}</strong>
      <span class="meta">cartão ${sessao.i + 1} de ${sessao.ids.length}</span></div><span aria-hidden="true">▶</span></a>` : ''}
    <div class="acoes">
      <button class="btn primario" id="c-hoje" ${paraHoje.length ? '' : 'disabled'}>▶ Estudar os de hoje (${paraHoje.length})</button>
      <button class="btn" id="c-errados" ${errados.length ? '' : 'disabled'}>Os que errei (${errados.length})</button>
    </div>
    <p class="aviso">${paraHoje.length
      ? `${vencidos.length} ${vencidos.length === 1 ? 'revisão vencida' : 'revisões vencidas'} e ${novos.length} ${novos.length === 1 ? 'cartão novo' : 'cartões novos'}.`
      : `Tudo em dia. ${nAmanha ? `Amanhã: ${nAmanha} ${nAmanha === 1 ? 'cartão' : 'cartões'}.` : ''}`}
      Acertou: o cartão volta em 1, 3, 7, 15, 30 e 60 dias. Errou: volta amanhã.</p>
    <h2 class="secao">Por disciplina</h2>
    ${disciplinas.map(([d, l], i) => linha(d, l, `data-disc="${i}"`)).join('')}
    <h2 class="secao">Por material</h2>
    ${materiais.map(([id, l], i) => linha(`${l[0].origem.replace(/^(Material|Resumão) de /, '')} · ${tituloCurto(catalogo.docs.find((d) => d.id === id) || { titulo: l[0].disciplina })}`, l, `data-mat="${i}"`)).join('')}
    <div class="rodape">
      <label>Cartões novos por dia:
        <select id="c-novos">${OPCOES_NOVOS.map((n) => `<option value="${n}"${n === lim ? ' selected' : ''}>${n || 'sem limite'}</option>`).join('')}</select></label>
      <div><button class="btn-link" id="c-zerar">Apagar meu histórico de flashcards</button></div>
    </div>`;

  // por disciplina ou material: o que está para estudar; se nada, todos (treino)
  const sessaoDe = (l, titulo) => {
    const f = filaCartoes(l, false);
    const ids = f.vencidos.length + f.novos.length ? [...f.vencidos, ...f.novos] : embaralhar(l);
    iniciarCartoes(ids.map((c) => c.id), titulo);
  };
  $('#c-hoje').addEventListener('click', () => iniciarCartoes(paraHoje.map((c) => c.id), 'Cartões de hoje'));
  $('#c-errados').addEventListener('click', () => iniciarCartoes(embaralhar(errados).map((c) => c.id), 'Os que errei'));
  tela.querySelectorAll('[data-disc]').forEach((b) => b.addEventListener('click', () => {
    const [nome, l] = disciplinas[Number(b.dataset.disc)];
    sessaoDe(l, nome);
  }));
  tela.querySelectorAll('[data-mat]').forEach((b) => b.addEventListener('click', () => {
    const l = materiais[Number(b.dataset.mat)][1];
    sessaoDe(l, `Flashcards de ${l[0].origem.replace(/^(Material|Resumão) de /, '')}`);
  }));
  $('#c-novos').addEventListener('change', (e) => { guardado.set('novosPorDia', Number(e.target.value)); telaCartoes(); });
  $('#c-zerar').addEventListener('click', () => {
    if (!window.confirm('Apagar todo o histórico dos flashcards? Os cartões voltam a ser novos. Não dá para desfazer.')) return;
    guardado.set('cartoes', {});
    guardado.set('sessaoC', null);
    guardado.set('novosHoje', null);
    telaCartoes();
  });
}

/* Lê o cartão com a voz do celular (a frente; depois de virar, também o verso). */
function falarCartao(c, comVerso) {
  if (!('speechSynthesis' in window)) return;
  if (player.modo === 'tts' && tts.tocando) ttsPausar();
  if (player.modo === 'audio' && !audio.paused) audio.pause();
  speechSynthesis.cancel();
  const partes = [`${c.rf ? `${c.rf.replace('…', '')}: ` : ''}${c.ff}`];
  if (comVerso) partes.push(`${c.rv ? `${c.rv.replace('…', '')}: ` : ''}${c.fv}`);
  for (const t of partes) {
    const u = new SpeechSynthesisUtterance(t);
    u.lang = 'pt-BR';
    const voz = tts.voz || escolherVoz();
    if (voz) u.voice = voz;
    speechSynthesis.speak(u);
  }
}

async function telaEstudarCartoes() {
  pararRelogio();
  setTopo('Flashcards', true);
  const s = guardado.get('sessaoC', null);
  if (!s) { location.hash = '#/cartoes'; return; }
  let lista;
  try { lista = await obterCartoes(); } catch {
    tela.innerHTML = '<p class="aviso">Os cartões ainda não foram guardados no celular. Abra o app com internet uma vez.</p>';
    return;
  }
  if (location.hash !== '#/cartoes/estudar') return;
  const mapa = new Map(lista.map((c) => [c.id, c]));
  s.ids = s.ids.filter((id) => mapa.has(id));
  if (s.i >= s.ids.length) { telaFimCartoes(s); return; }
  const c = mapa.get(s.ids[s.i]);
  const est = estadoCartoes()[c.id];
  const repeticao = !!s.rep[c.id];
  const treino = !repeticao && !!est && est.u === dataISO(); // já respondido hoje: não muda a agenda
  const proximo = est ? Math.min(est.c + 1, INTERVALOS.length - 1) : 0;
  const diasAcerto = INTERVALOS[proximo];

  tela.innerHTML = `
    <div class="q-topo"><span>${esc(s.titulo)} · <b>${s.i + 1}</b> de ${s.ids.length}</span>
      <button class="btn-link" id="f-ouvir" aria-label="Ouvir o cartão">🔊 Ouvir</button></div>
    <div class="q-progresso" aria-hidden="true"><span style="width:${(s.i / s.ids.length) * 100}%"></span></div>
    <div class="q-fonte"><span class="selo ${c.tipo === 'pegadinha' ? 'autoral' : 'oficial'}">${c.tipo === 'pegadinha' ? 'Pegadinha' : 'Quadro'}</span>
      ${esc(c.disciplina)} · ${esc(c.origem)}${est ? '' : ' · <b>novo</b>'}${repeticao ? ' · de novo' : treino ? ' · treino (já visto hoje)' : ''}</div>
    ${c.tipo === 'quadro' ? `<p class="q-meta">${esc(c.ctx)}</p>` : ''}
    <button class="flash" id="flash" aria-expanded="${s.virado}" aria-label="${s.virado ? 'Cartão virado' : 'Toque para ver a resposta'}">
      <span class="flash-rotulo">${esc(c.rf)}</span>
      <span class="flash-texto">${c.f}</span>
      ${c.tipo === 'pegadinha' && !s.virado ? '<span class="flash-dica">Onde está o erro? Pense na resposta e toque para conferir.</span>' : ''}
      ${!s.virado && c.tipo !== 'pegadinha' ? `<span class="flash-dica">${c.rv ? `${esc(c.rv)}? ` : ''}Pense na resposta e toque para conferir.</span>` : ''}
      <span class="flash-verso"${s.virado ? '' : ' hidden'}>
        ${c.rv ? `<span class="flash-rotulo">${esc(c.rv)}</span>` : ''}
        <span class="flash-texto">${c.v}</span>
        ${c.onde ? `<span class="flash-onde">${esc(c.onde)}</span>` : ''}
      </span>
    </button>
    ${c.b != null ? '<p class="flash-links"><button class="btn-link" id="f-ver">Ver no material</button></p>' : ''}
    <div class="q-botoes flash-botoes">
      ${s.virado
        ? `<button class="btn errei" id="f-errei">✗ Errei<small>${repeticao || treino ? 'vai de novo' : 'volta amanhã'}</small></button>
           <button class="btn primario" id="f-acertei">✓ Acertei<small>${repeticao || treino ? 'próximo' : `volta ${quandoVolta(diasAcerto)}`}</small></button>`
        : '<button class="btn primario" id="f-virar">Mostrar resposta</button>'}
    </div>`;
  window.scrollTo(0, 0);

  const virar = () => {
    if (s.virado) return;
    s.virado = true;
    guardado.set('sessaoC', s);
    telaEstudarCartoes();
  };
  $('#flash').addEventListener('click', virar);
  const bv = $('#f-virar');
  if (bv) bv.addEventListener('click', virar);
  $('#f-ouvir').addEventListener('click', () => falarCartao(c, s.virado));
  const ver = $('#f-ver');
  if (ver) ver.addEventListener('click', () => {
    irParaDestaque = { id: c.doc, h: { f: c.b }, confiarF: true };
    location.hash = `#/doc/${encodeURIComponent(c.doc)}`;
  });
  const be = $('#f-errei');
  if (be) be.addEventListener('click', () => responderCartao(s, c, false));
  const ba = $('#f-acertei');
  if (ba) ba.addEventListener('click', () => responderCartao(s, c, true));
}

function responderCartao(s, c, acertou) {
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  if (!s.rep[c.id]) { // primeira vez na sessão: conta e reagenda
    const tudo = estadoCartoes();
    const hoje = dataISO();
    const ant = tudo[c.id];
    if (!ant) guardado.set('novosHoje', { d: hoje, n: novosHoje() + 1 });
    if (ant && ant.u === hoje) { // treino no mesmo dia: só atualiza o último resultado
      ant.k = acertou;
    } else {
      const degrau = acertou ? (ant ? Math.min(ant.c + 1, INTERVALOS.length - 1) : 0) : 0;
      tudo[c.id] = { c: degrau, p: somaDias(hoje, INTERVALOS[degrau]), n: ((ant && ant.n) || 0) + 1,
        e: ((ant && ant.e) || 0) + (acertou ? 0 : 1), u: hoje, k: acertou };
    }
    guardado.set('cartoes', tudo);
    registrarAtividade({ k: 1 });
    s.primeira++;
    if (acertou) s.certos++; else s.errados.push(c.id);
  }
  if (!acertou && (s.rep[c.id] || 0) < 2) { // errou: aparece de novo no fim (até 2 vezes)
    s.rep[c.id] = (s.rep[c.id] || 0) + 1;
    s.ids.push(c.id);
  } else if (!s.rep[c.id]) {
    s.rep[c.id] = 0;
  }
  s.i++;
  s.virado = false;
  guardado.set('sessaoC', s);
  telaEstudarCartoes();
}

function telaFimCartoes(s) {
  const pct = s.primeira ? Math.round((s.certos / s.primeira) * 100) : 0;
  const est = estadoCartoes();
  const amanha = somaDias(dataISO(), 1);
  const nAmanha = Object.values(est).filter((x) => x.p === amanha).length;
  tela.innerHTML = `<div class="q-fim">
      <p class="q-fim-pct">${pct}%</p>
      <p><b>${s.certos} de ${s.primeira}</b> certos de primeira</p>
      <p class="meta">${nAmanha ? `Amanhã: ${nAmanha} ${nAmanha === 1 ? 'cartão' : 'cartões'} para revisar.` : 'Nada marcado para amanhã.'}</p>
    </div>
    <div class="acoes">
      ${s.errados.length ? `<button class="btn primario" id="f-refazer">Revisar os ${s.errados.length} que errei</button>` : ''}
      <button class="btn" id="f-painel">Voltar aos flashcards</button>
    </div>`;
  const r = $('#f-refazer');
  if (r) r.addEventListener('click', () => iniciarCartoes(s.errados.slice(), 'Os que errei agora'));
  $('#f-painel').addEventListener('click', () => { guardado.set('sessaoC', null); location.hash = '#/cartoes'; });
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
  mostrarConvitePlayer();
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

const disciplinaDoc = (it) => (['material', 'revisao', 'questoes'].includes(it.categoria)
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

/* ---------- cronômetro da sessão (roteiro do material) ---------- */
/* Estado em guardado 'cronometro':
   { id, titulo, blocos: [{ titulo, min, texto, f?, pausa? }], idx, acum, desde, contadoBloco, pendente, fim, doPlano }.
   acum = ms já corridos no bloco atual até a última pausa; desde = quando voltou a correr (null = pausado).
   O tempo sai do relógio (Date.now), então fica certo mesmo com a tela apagada ou o app fechado;
   o aviso de troca de bloco (som, vibração) toca quando o app está aberto. */

const PAUSAS_CRONO = [0, 5, 10];
let crono = guardado.get('cronometro', null);
let cronoTick = null;
let cronoTrava = null;
let somCtx = null;
let cronoDesenhado = '';
let cronoAvisoAte = 0;

const msBloco = (b) => b.min * 60000;
const cronoAtivo = () => !!crono && !crono.fim;
const decorrido = (agora = Date.now()) => crono.acum + (crono.desde ? agora - crono.desde : 0);
const restanteBloco = (agora = Date.now()) => Math.max(0, msBloco(crono.blocos[crono.idx]) - decorrido(agora));
const fmtMin = (min) => (min >= 60 ? `${Math.floor(min / 60)} h${min % 60 ? ` ${min % 60} min` : ''}` : `${min} min`);
const horaRelogio = (ms) => new Date(ms).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

/* Blocos do material: a tabela "Roteiro"; sem ela, blocos de até 1 h pelas horas do plano naquele dia. */
function blocosDoItem(it) {
  if (!it || it.categoria !== 'material') return null;
  if (it.roteiro && it.roteiro.length) return { blocos: it.roteiro.map((b) => ({ ...b })), doPlano: false };
  if (!it.data || !catalogo.plano || /^Resumão/.test(it.titulo)) return null;
  const blocos = [];
  for (const s of sessoesDeEstudo().filter((x) => x.data === it.data)) {
    let resto = Math.round(s.h * 60);
    let n = 1;
    while (resto > 0) {
      const min = Math.min(60, resto);
      blocos.push({ titulo: `${min === 60 ? `${n}ª hora` : `${min} min`} — ${s.disciplina}`, min, texto: 'Siga o material na ordem das seções.' });
      resto -= min; n++;
    }
    if (s.r > 0) blocos.push({ titulo: `${fmtMin(Math.round(s.r * 60))} — Redação`, min: Math.round(s.r * 60), texto: 'Parte de redação do dia.' });
  }
  return blocos.length >= 2 ? { blocos, doPlano: true } : null;
}

function comPausas(blocos, pausa) {
  if (!pausa) return blocos;
  const out = [];
  blocos.forEach((b, i) => {
    out.push(b);
    if (i < blocos.length - 1) out.push({ titulo: 'Pausa', min: pausa, texto: 'Levante, beba água e descanse a vista.', pausa: true });
  });
  return out;
}

const salvarCrono = () => guardado.set('cronometro', crono);

/* Soma o tempo estudado (fora das pausas) do bloco atual e manda para o progresso de tempos em tempos. */
function contarCrono(forcar) {
  if (!crono) return;
  const b = crono.blocos[crono.idx];
  const feito = Math.min(decorrido(), msBloco(b));
  if (!b.pausa && feito > crono.contadoBloco) crono.pendente += feito - crono.contadoBloco;
  crono.contadoBloco = Math.max(crono.contadoBloco, feito);
  if (crono.pendente >= (forcar ? 1000 : 30000)) {
    const seg = Math.floor(crono.pendente / 1000);
    registrarAtividade({ c: seg });
    crono.pendente -= seg * 1000;
  }
}

/* Passa para o próximo bloco quando o tempo acaba (inclusive vários, se o app ficou fechado). */
function cronoAtualizar() {
  avancarCrono();
  desenharCrono();
}

function avancarCrono() {
  if (!cronoAtivo()) return;
  const agora = Date.now();
  let trocouEm = 0;
  while (!crono.fim && crono.desde && decorrido(agora) >= msBloco(crono.blocos[crono.idx])) {
    const fimBloco = agora - (decorrido(agora) - msBloco(crono.blocos[crono.idx]));
    contarCrono(false);
    trocouEm = fimBloco;
    if (crono.idx >= crono.blocos.length - 1) {
      crono.acum = msBloco(crono.blocos[crono.idx]);
      crono.desde = null;
      crono.fim = true;
    } else {
      crono.idx++;
      crono.acum = 0;
      crono.contadoBloco = 0;
      crono.desde = fimBloco;
    }
  }
  contarCrono(crono.fim);
  salvarCrono();
  if (trocouEm) {
    if (agora - trocouEm < 5 * 60000) avisarTroca(); // aviso antigo (app ficou fechado) não toca
    if (crono.fim) { cronoSoltarTela(); pararTickCrono(); }
  }
}

function ligarTickCrono() { if (!cronoTick) cronoTick = setInterval(cronoAtualizar, 1000); }
function pararTickCrono() { if (cronoTick) clearInterval(cronoTick); cronoTick = null; }

async function cronoSegurarTela() {
  if (!guardado.get('cronoTela', true) || !crono || !crono.desde) return;
  try {
    if ('wakeLock' in navigator && !cronoTrava) {
      cronoTrava = await navigator.wakeLock.request('screen');
      cronoTrava.addEventListener('release', () => { cronoTrava = null; });
    }
  } catch { /* ok */ }
}
function cronoSoltarTela() { if (cronoTrava) { cronoTrava.release().catch(() => {}); cronoTrava = null; } }

/* O som precisa ser liberado por um toque (regra do iPhone); por isso é preparado nos botões. */
function prepararSom() {
  try {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!somCtx && C) somCtx = new C();
    if (somCtx && somCtx.state === 'suspended') somCtx.resume();
  } catch { /* sem som */ }
}
function bipar(n) {
  if (!somCtx) return;
  try {
    somCtx.resume();
    const t0 = somCtx.currentTime + 0.05;
    for (let i = 0; i < n; i++) {
      const o = somCtx.createOscillator();
      const g = somCtx.createGain();
      const t = t0 + i * 0.38;
      o.type = 'sine';
      o.frequency.value = i === n - 1 ? 1175 : 880;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.5, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
      o.connect(g);
      g.connect(somCtx.destination);
      o.start(t);
      o.stop(t + 0.3);
    }
  } catch { /* sem som */ }
}

async function notificar(titulo, corpo, { tag = 'cronometro', url = '#/cronometro' } = {}) {
  if (!('Notification' in window) || Notification.permission !== 'granted' || document.visibilityState === 'visible') return;
  try {
    const reg = await navigator.serviceWorker.ready;
    await reg.showNotification(titulo, { body: corpo, tag, renotify: true, icon: 'icons/icon-192.png', data: { url } });
  } catch { /* ok */ }
}

function avisarTroca() {
  const b = crono.blocos[crono.idx];
  const titulo = crono.fim ? 'Sessão concluída!' : b.pausa ? `Pausa de ${b.min} min` : `Agora: ${b.titulo}`;
  bipar(crono.fim ? 4 : 3);
  try { if (navigator.vibrate) navigator.vibrate([300, 150, 300, 150, 300]); } catch { /* ok */ }
  notificar(titulo, crono.fim ? 'Bom trabalho! Marque o material como estudado.' : b.texto);
  cronoAvisoAte = Date.now() + 8000;
  const barra = $('#crono-barra');
  if (barra) barra.dataset.aviso = titulo;
}

/* ações */
function comecarCrono(item) {
  const base = blocosDoItem(item);
  if (!base) return;
  if (cronoAtivo() && crono.id !== item.id && !confirm(`Encerrar o cronômetro de "${crono.titulo}" e começar este?`)) return;
  if (cronoAtivo()) contarCrono(true);
  prepararSom();
  if ('Notification' in window && Notification.permission === 'default') {
    try { Notification.requestPermission().catch(() => {}); } catch { /* ok */ }
  }
  const pausa = guardado.get('cronoPausa', 0);
  crono = {
    id: item.id, titulo: tituloCurto(item), blocos: comPausas(base.blocos, pausa), doPlano: base.doPlano,
    idx: 0, acum: 0, desde: Date.now(), contadoBloco: 0, pendente: 0, fim: false,
  };
  salvarCrono();
  ligarTickCrono();
  cronoSegurarTela();
  if (location.hash !== '#/cronometro') location.hash = '#/cronometro';
  else telaCrono();
}

function pausarCrono() {
  if (!cronoAtivo() || !crono.desde) return;
  cronoAtualizar();
  if (!cronoAtivo()) return;
  crono.acum = decorrido();
  crono.desde = null;
  contarCrono(true);
  salvarCrono();
  pararTickCrono();
  cronoSoltarTela();
  desenharCrono();
}

function continuarCrono() {
  if (!cronoAtivo() || crono.desde) return;
  prepararSom();
  crono.desde = Date.now();
  salvarCrono();
  ligarTickCrono();
  cronoSegurarTela();
  desenharCrono();
}

/* Vai para outro bloco (o tempo já feito no atual continua contado no progresso). */
function irParaBlocoCrono(i) {
  if (!crono) return;
  if (cronoAtivo()) cronoAtualizar();
  contarCrono(true);
  const rodando = cronoAtivo() && !!crono.desde;
  if (i >= crono.blocos.length) {
    crono.acum = decorrido();
    crono.desde = null;
    crono.fim = true;
    pararTickCrono();
    cronoSoltarTela();
  } else {
    crono.idx = Math.max(0, i);
    crono.acum = 0;
    crono.contadoBloco = 0;
    crono.fim = false;
    crono.desde = rodando ? Date.now() : null;
  }
  salvarCrono();
  desenharCrono(true);
}

function encerrarCrono() {
  if (crono && !crono.fim && !confirm('Encerrar o cronômetro desta sessão?')) return;
  if (crono) contarCrono(true);
  const id = crono && crono.id;
  crono = null;
  guardado.set('cronometro', null);
  pararTickCrono();
  cronoSoltarTela();
  desenharCrono();
  if (location.hash.startsWith('#/cronometro')) location.hash = id ? `#/cronometro/${encodeURIComponent(id)}` : '#/';
}

/* desenho: barra no topo (em todas as telas) e a tela do cronômetro */
function desenharCrono(refazer) {
  const barra = $('#crono-barra');
  const naTela = location.hash.startsWith('#/cronometro');
  if (barra) {
    barra.hidden = !cronoAtivo() || naTela;
    if (!barra.hidden) {
      const b = crono.blocos[crono.idx];
      const aviso = Date.now() < cronoAvisoAte && barra.dataset.aviso;
      $('#cb-tempo').textContent = fmt(restanteBloco() / 1000);
      $('#cb-bloco').textContent = aviso || (crono.desde ? b.titulo : `${b.titulo} · pausado`);
      barra.classList.toggle('alerta', !!aviso);
      barra.classList.toggle('pausado', !crono.desde);
      const bp = $('#cb-play');
      bp.textContent = crono.desde ? '⏸' : '▶';
      bp.setAttribute('aria-label', crono.desde ? 'Pausar o cronômetro' : 'Continuar o cronômetro');
    }
  }
  if (!naTela || !crono || !$('#c-tempo')) return;
  const chave = `${crono.id}|${crono.idx}|${crono.fim}|${!!crono.desde}`;
  if (refazer || chave !== cronoDesenhado) { telaCrono(); return; }
  if (crono.fim) return;
  const b = crono.blocos[crono.idx];
  const resta = restanteBloco();
  $('#c-tempo').textContent = fmt(resta / 1000);
  $('#c-prog').style.width = `${Math.min(100, (decorrido() / msBloco(b)) * 100)}%`;
  const fimSessao = Date.now() + resta + crono.blocos.slice(crono.idx + 1).reduce((t, x) => t + msBloco(x), 0);
  $('#c-quando').textContent = crono.desde
    ? `Este bloco termina às ${horaRelogio(Date.now() + resta)} · a sessão, às ${horaRelogio(fimSessao)}`
    : 'Pausado. Toque em Continuar quando voltar.';
}

function listaBlocosCrono(blocos, atual, fim) {
  return `<ol class="crono-blocos">${blocos.map((b, i) => {
    const estado = fim || i < atual ? 'feito' : i === atual ? 'atual' : '';
    return `<li class="${estado}${b.pausa ? ' pausa' : ''}">
      <button data-i="${i}" ${atual < 0 ? 'disabled' : ''} aria-label="${esc(`${b.titulo}, ${fmtMin(b.min)}${atual >= 0 && !fim ? '. Toque para ir para este bloco' : ''}`)}">
        <span class="marca" aria-hidden="true">${estado === 'feito' ? '✓' : estado === 'atual' ? '▶' : b.pausa ? '☕' : i + 1}</span>
        <span class="corpo"><strong>${esc(b.titulo)}</strong>${b.pausa ? '' : `<span class="meta">${esc(b.texto)}</span>`}</span>
        <span class="dur">${fmtMin(b.min)}</span>
      </button></li>`;
  }).join('')}</ol>`;
}

function opcoesCrono(podePausa) {
  const pausa = guardado.get('cronoPausa', 0);
  return `<div class="crono-opcoes">
    ${podePausa ? `<label>Pausa entre os blocos:
      <select id="c-pausa">${PAUSAS_CRONO.map((p) => `<option value="${p}"${p === pausa ? ' selected' : ''}>${p ? `${p} min` : 'sem pausa'}</option>`).join('')}</select></label>` : ''}
    <label><input id="c-tela" type="checkbox" ${guardado.get('cronoTela', true) ? 'checked' : ''}> Manter a tela acesa enquanto o cronômetro corre</label>
  </div>`;
}

function ligarOpcoesCrono(id) {
  const sp = $('#c-pausa');
  if (sp) sp.addEventListener('change', () => { guardado.set('cronoPausa', Number(sp.value)); telaCrono(id); });
  $('#c-tela').addEventListener('change', (e) => {
    guardado.set('cronoTela', e.target.checked);
    if (e.target.checked) cronoSegurarTela(); else cronoSoltarTela();
  });
}

function telaCrono(idPedido) {
  if (!catalogo) { telaInicio(); return; }
  pararRelogio();
  setTopo('Cronômetro da sessão', true);
  if (idPedido) idPedido = decodeURIComponent(idPedido);
  const id = idPedido || (crono && crono.id);
  const item = id && catalogo.docs.find((d) => d.id === id);
  cronoDesenhado = '';

  if (!item) { // sem sessão: sugere os materiais mais recentes com roteiro
    const comRoteiro = catalogo.docs.filter((d) => d.categoria === 'material' && d.data && blocosDoItem(d)).slice(0, 5);
    tela.innerHTML = `<p class="aviso">Escolha o material da sessão. O cronômetro segue o roteiro dele, bloco por bloco, e avisa com som e vibração quando é hora de mudar de atividade.</p>
      ${comRoteiro.map((it) => `<a class="cartao" href="#/cronometro/${encodeURIComponent(it.id)}"><div class="data"><b>${esc((it.subtitulo || '').split(' ')[1] || '')}</b>${esc((it.subtitulo || '').split(' ')[0])}</div>
        <div class="corpo"><strong>${esc(tituloCurto(it))}</strong><span class="meta">${blocosDoItem(it).blocos.length} blocos · ${fmtMin(blocosDoItem(it).blocos.reduce((t, b) => t + b.min, 0))}</span></div><span aria-hidden="true">›</span></a>`).join('')}`;
    return;
  }

  const desta = crono && crono.id === item.id;
  if (!desta) { // prévia antes de começar
    const base = blocosDoItem(item);
    if (!base) { location.hash = `#/doc/${encodeURIComponent(item.id)}`; return; }
    const blocos = comPausas(base.blocos, guardado.get('cronoPausa', 0));
    const total = blocos.reduce((t, b) => t + b.min, 0);
    tela.innerHTML = `<h2 class="crono-titulo">${esc(tituloCurto(item))} <small>${esc(item.subtitulo || '')}</small></h2>
      <p class="aviso">${base.doPlano ? 'Este material não tem tabela de roteiro; os blocos seguem as horas do plano para o dia.' : 'Blocos do roteiro do material.'}
        Termina por volta das ${horaRelogio(Date.now() + total * 60000)} se começar agora.</p>
      ${listaBlocosCrono(blocos, -1, false)}
      ${opcoesCrono(true)}
      ${cronoAtivo() ? `<p class="aviso">Há um cronômetro em andamento para "${esc(crono.titulo)}". Começar este encerra aquele. <a href="#/cronometro">Ver o que está em andamento</a></p>` : ''}
      <button class="btn primario largo" id="c-comecar">▶ Começar a sessão · ${fmtMin(total)}</button>
      <a class="btn largo" href="#/doc/${encodeURIComponent(item.id)}">📄 Abrir o material</a>
      ${linkCaderno(item, 'btn largo')}
      <p class="aviso">O aviso de troca de bloco (som e vibração) toca com o app aberto. Com a tela apagada, o celular pode atrasar o aviso, mas o tempo continua certo.</p>`;
    $('#c-comecar').addEventListener('click', () => comecarCrono(item));
    ligarOpcoesCrono(item.id);
    return;
  }

  // sessão em andamento ou concluída
  avancarCrono();
  const b = crono.blocos[crono.idx];
  const estudo = crono.blocos.filter((x) => !x.pausa);
  const nEstudo = estudo.indexOf(b) + 1;
  const etapa = crono.fim ? 'Sessão concluída' : b.pausa ? 'Pausa' : `Bloco ${nEstudo} de ${estudo.length}`;
  const at = guardado.get('atividade', {});
  const minHoje = Math.round(((at[dataISO()] && at[dataISO()].c) || 0) / 60);
  const estudado = concluido(item);
  cronoDesenhado = `${crono.id}|${crono.idx}|${crono.fim}|${!!crono.desde}`;
  tela.innerHTML = `<h2 class="crono-titulo">${esc(crono.titulo)} <small>${esc(item.subtitulo || '')}</small></h2>
    <div class="crono-painel${b.pausa ? ' pausa' : ''}${crono.fim ? ' fim' : ''}${crono.desde ? '' : ' parado'}" aria-live="polite">
      <span class="crono-etapa">${esc(etapa)}</span>
      <strong class="crono-bloco">${crono.fim ? '🎉 Bom trabalho!' : esc(b.titulo)}</strong>
      <b class="crono-tempo" id="c-tempo" role="timer">${crono.fim ? '0:00' : fmt(restanteBloco() / 1000)}</b>
      <span class="crono-prog" aria-hidden="true"><span id="c-prog"></span></span>
      <small id="c-quando">${crono.fim ? `${minHoje} min cronometrados hoje` : ''}</small>
    </div>
    ${!crono.fim && !b.pausa ? `<p class="crono-tarefa">${esc(b.texto)}${b.f != null ? ' <button class="btn-link" id="c-ver">Ver no material</button>' : ''}</p>` : ''}
    <div class="acoes crono-acoes">
      ${crono.fim
        ? `${estudado ? '' : '<button class="btn primario" id="c-estudado">✓ Marcar material como estudado</button>'}
           <button class="btn" id="c-recomecar">↺ Recomeçar</button>`
        : `<button class="btn primario" id="c-play">${crono.desde ? '⏸ Pausar' : '▶ Continuar'}</button>
           <button class="btn" id="c-prox">${crono.idx >= crono.blocos.length - 1 ? '⏹ Concluir' : '⏭ Próximo bloco'}</button>
           <button class="btn" id="c-encerrar">Encerrar</button>`}
      <a class="btn" href="#/doc/${encodeURIComponent(item.id)}">📄 Abrir o material</a>
      ${linkCaderno(item)}
    </div>
    ${listaBlocosCrono(crono.blocos, crono.fim ? crono.blocos.length : crono.idx, crono.fim)}
    ${opcoesCrono(false)}
    ${crono.fim ? '' : '<p class="aviso">Toque num bloco da lista para ir para ele. O aviso de troca (som e vibração) toca com o app aberto.</p>'}`;

  if (!crono.fim) desenharCrono();
  const on = (sel, fn) => { const el = $(sel); if (el) el.addEventListener('click', fn); };
  on('#c-play', () => (crono.desde ? pausarCrono() : continuarCrono()));
  on('#c-prox', () => { prepararSom(); irParaBlocoCrono(crono.idx + 1); });
  on('#c-encerrar', encerrarCrono);
  on('#c-recomecar', () => { crono = null; guardado.set('cronometro', null); telaCrono(item.id); });
  on('#c-estudado', () => {
    guardado.set(`estudado:${item.id}`, true);
    registrarAtividade({ m: 1 });
    $('#c-estudado').remove();
  });
  on('#c-ver', () => {
    irParaDestaque = { id: item.id, h: { f: b.f }, confiarF: true };
    location.hash = `#/doc/${encodeURIComponent(item.id)}`;
  });
  if (!crono.fim) {
    tela.querySelectorAll('.crono-blocos button').forEach((bt) => bt.addEventListener('click', () => {
      const i = Number(bt.dataset.i);
      if (i !== crono.idx) { prepararSom(); irParaBlocoCrono(i); }
    }));
  }
  ligarOpcoesCrono(item.id);
}

/* Cartão na tela inicial: sessão em andamento ou a sessão de hoje. */
function resumoCronoHome() {
  if (cronoAtivo()) {
    const b = crono.blocos[crono.idx];
    return `<a class="cartao cartao-q" href="#/cronometro">
      <div class="icone-q" aria-hidden="true">⏱</div>
      <div class="corpo"><strong>Cronômetro: ${esc(b.titulo)}</strong>
        <span class="meta">${esc(crono.titulo)} · ${crono.desde ? `faltam ${Math.ceil(restanteBloco() / 60000)} min` : 'pausado'}</span></div>
      <span aria-hidden="true">›</span></a>`;
  }
  const hoje = catalogo.docs.find((d) => d.categoria === 'material' && d.data === dataISO() && blocosDoItem(d));
  if (!hoje || concluido(hoje)) return '';
  const base = blocosDoItem(hoje);
  return `<a class="cartao cartao-q" href="#/cronometro/${encodeURIComponent(hoje.id)}">
    <div class="icone-q" aria-hidden="true">⏱</div>
    <div class="corpo"><strong>Começar a sessão de hoje</strong>
      <span class="meta">${esc(tituloCurto(hoje))} · ${base.blocos.length} blocos · ${fmtMin(base.blocos.reduce((t, x) => t + x.min, 0))}</span></div>
    <span aria-hidden="true">›</span></a>`;
}

$('#cb-play').addEventListener('click', () => { if (!cronoAtivo()) return; if (crono.desde) pausarCrono(); else continuarCrono(); });
document.addEventListener('visibilitychange', () => {
  if (!crono) return;
  if (document.visibilityState === 'visible') {
    cronoTrava = null;
    cronoAtualizar();
    if (cronoAtivo() && crono.desde) { ligarTickCrono(); cronoSegurarTela(); }
  } else if (cronoAtivo()) {
    contarCrono(true);
    salvarCrono();
  }
});
if (cronoAtivo() && crono.desde) ligarTickCrono();

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
  mostrarFim(t, d, audio.playbackRate || 1);
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
  convidarQuestoes(player.item);
  if (sono.modo === 'cap') { dormir(); return; } // o fim do material também é fim de capítulo
  avancarFila();
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (e) => {
    if (e.data && typeof e.data.abrir === 'string' && e.data.abrir.startsWith('#/')) location.hash = e.data.abrir;
  });
}

/* ---------- convite para as questões quando o áudio do material termina ---------- */
/* Quem estuda ouvindo não vê o cartão do fim do texto: o convite aparece no reprodutor,
   na tela inicial (até abrir as questões, dispensar ou passar 3 dias) e, com a tela apagada, como notificação. */
const DIAS_CONVITE = 3;

function conviteAtual() {
  const c = guardado.get('convite', null);
  if (!c || !catalogo || Date.now() - c.t > DIAS_CONVITE * 864e5) return null;
  const mat = catalogo.docs.find((d) => d.id === c.id);
  const cad = mat && mat.caderno && catalogo.docs.find((d) => d.id === mat.caderno);
  return cad ? { mat, cad } : null;
}

const textoConvite = (cad) => (cad.titulo.startsWith('Teste-relâmpago') ? '⚡ Fazer o teste-relâmpago'
  : `📝 Responder as questões${cad.data === dataISO() ? ' de hoje' : ''}`);

function mostrarConvitePlayer() {
  const el = $('#p-convite');
  const c = conviteAtual();
  el.hidden = !c;
  if (c) {
    el.href = `#/doc/${encodeURIComponent(c.cad.id)}`;
    el.textContent = `Fim de "${tituloCurto(c.mat)}". ${textoConvite(c.cad)} ›`;
  }
}

function convidarQuestoes(item) {
  if (!item || !item.caderno || !catalogo.docs.some((d) => d.id === item.caderno)) return;
  guardado.set('convite', { id: item.id, t: Date.now() });
  mostrarConvitePlayer();
  const c = conviteAtual();
  if (!c) return;
  const teste = c.cad.titulo.startsWith('Teste-relâmpago');
  notificar(teste ? 'Resumão ouvido! Hora do teste-relâmpago' : 'Material ouvido! Agora é praticar',
    teste ? 'Toque para fazer o teste-relâmpago, sem consultar.'
      : `Toque para responder ${c.cad.questoes ? `as ${c.cad.questoes} questões` : 'as questões'} de ${(c.mat.subtitulo || '').split(' ').pop() || 'hoje'}.`,
    { tag: 'convite', url: `#/doc/${encodeURIComponent(c.cad.id)}` });
}

function esquecerConvite(idCaderno) {
  const c = conviteAtual();
  if (idCaderno && (!c || c.cad.id !== idCaderno)) return;
  guardado.set('convite', null);
  const el = $('#p-convite');
  if (el) el.hidden = true;
}

function resumoConviteHome() {
  const c = conviteAtual();
  if (!c) return '';
  const meta = c.cad.titulo.startsWith('Teste-relâmpago') ? 'Perguntas rápidas, sem consultar, com as respostas no fim'
    : `Estudo dirigido${c.cad.questoes ? ` e ${c.cad.questoes} questões oficiais` : ''}, com o gabarito no fim`;
  return `<div class="cartao cartao-q convite-home">
    <a class="corpo" href="#/doc/${encodeURIComponent(c.cad.id)}"><strong>🎧 Você ouviu "${esc(tituloCurto(c.mat))}" (${esc((c.mat.subtitulo || '').split(' ').pop())}). ${esc(textoConvite(c.cad))}</strong>
    <span class="meta">${esc(meta)}</span></a>
    <button class="icone-btn" id="convite-fechar" aria-label="Dispensar o convite">×</button></div>`;
}

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
    convidarQuestoes(player.item);
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
  mostrarFim(seg(tts.palavrasAntes[tts.idx] || 0), seg(tts.total), 1, '~'); // seg() já conta a velocidade
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

/* À direita da barra: o tempo que falta (padrão, já na velocidade escolhida) ou a duração total. Toque alterna. */
let ultimoFim = null;
function mostrarFim(t, d, taxa, prefixo = '') {
  ultimoFim = [t, d, taxa, prefixo];
  const restante = guardado.get('mostrarRestante', true);
  const el = $('#p-total');
  el.textContent = restante ? `−${prefixo}${fmt(Math.max(0, d - t) / taxa)}` : `${prefixo}${fmt(d)}`;
  el.setAttribute('aria-label', restante ? `Faltam ${el.textContent.slice(1)}. Toque para ver a duração total`
    : `Duração total ${el.textContent}. Toque para ver o tempo que falta`);
}
$('#p-total').addEventListener('click', () => {
  guardado.set('mostrarRestante', !guardado.get('mostrarRestante', true));
  if (ultimoFim) mostrarFim(...ultimoFim);
});

let arrastando = false;
const progresso = $('#p-progresso');
progresso.addEventListener('input', () => {
  arrastando = true;
  if (player.modo === 'audio') {
    const t = (progresso.value / 1000) * (audio.duration || 0);
    $('#p-tempo').textContent = fmt(t);
    mostrarFim(t, audio.duration || 0, audio.playbackRate || 1);
  }
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
