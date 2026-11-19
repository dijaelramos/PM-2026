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
    const atuais = new Set(catalogo.docs.map((d) => abs(d.arquivo)));
    const faltam = [];
    for (const d of catalogo.docs) if (!(await dados.match(abs(d.arquivo)))) faltam.push(d.arquivo);
    for (let i = 0; i < faltam.length; i += 8) {
      setStatus(`Guardando textos para usar offline… ${Math.min(i + 8, faltam.length)} de ${faltam.length}`);
      await dados.addAll(faltam.slice(i, i + 8));
    }
    for (const k of await dados.keys()) {
      if (k.url.includes('/data/docs/') && !atuais.has(k.url)) await dados.delete(k);
    }
    const audiosAtuais = new Set(catalogo.docs.filter((d) => d.audio).map((d) => abs(d.audio.url)));
    const cacheAudio = await caches.open(CACHE_AUDIO);
    for (const k of await cacheAudio.keys()) {
      if (!audiosAtuais.has(k.url)) { await cacheAudio.delete(k); baixados.delete(k.url); }
    }
    if (guardado.get('autoBaixar', true)) {
      const recentes = catalogo.docs.filter((d) => d.categoria === 'material' && d.audio && d.data).slice(0, 3);
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
  const m = location.hash.match(/^#\/doc\/(.+)$/);
  if (m) telaDoc(decodeURIComponent(m[1]));
  else telaInicio();
}

function seloOffline(it) {
  if (!it.audio) return '';
  return baixados.has(abs(it.audio.url)) ? '<span class="selo ok">offline</span>' : '';
}

function cartaoMaterial(it) {
  const [dia, data] = (it.subtitulo || '').split(' ');
  const ouvido = guardado.get(`ouvido:${it.id}`, false) ? ' · ✓ ouvido' : '';
  const dur = it.audio ? `${minutos(it.audio.duracao)} de áudio` : `~${minutos(duracaoItem(it))} de leitura`;
  return `<a class="cartao" href="#/doc/${encodeURIComponent(it.id)}">
    <div class="data"><b>${esc(data || dia)}</b>${esc(data ? dia : '')}</div>
    <div class="corpo"><strong>${esc(it.titulo)}</strong><span class="meta">${dur}${ouvido}</span></div>
    ${seloOffline(it)}</a>`;
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
  tela.innerHTML = `<input id="busca" class="busca" type="search" placeholder="Buscar material, lei, assunto…" autocomplete="off">
    <div id="lista"></div>
    <div class="rodape">
      <div id="status-sync">${esc(textoStatus())}</div>
      <label><input id="auto" type="checkbox" ${guardado.get('autoBaixar', true) ? 'checked' : ''}> Baixar sozinho o áudio dos 3 materiais mais recentes</label>
    </div>`;
  const busca = $('#busca');
  busca.value = guardado.get('busca', '');
  busca.addEventListener('input', () => { guardado.set('busca', busca.value); desenharLista(busca.value); });
  $('#auto').addEventListener('change', (e) => { guardado.set('autoBaixar', e.target.checked); if (e.target.checked) sincronizar(); });
  desenharLista(busca.value);
  requestAnimationFrame(() => window.scrollTo(0, rolagemInicio));
}

function desenharLista(filtro) {
  const f = norm(filtro).trim();
  const itens = catalogo.docs.filter((d) => !f || norm(`${d.titulo} ${d.grupo || ''} ${d.subtitulo || ''}`).includes(f));
  const materiais = itens.filter((d) => d.categoria === 'material' && d.data);
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
  if (materiais.length) html += `<h2 class="secao">Material do Dia</h2>${materiais.map(cartaoMaterial).join('')}`;
  if (extras.length || plano.length) html += `<h2 class="secao">Plano, edital e extras</h2>${grupos([...plano, ...extras], !!f)}`;
  if (base.length) html += `<h2 class="secao">Base de Conhecimento</h2>${grupos(base, !!f)}`;
  if (!itens.length) html = '<p class="aviso">Nada encontrado.</p>';
  $('#lista').innerHTML = html;
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
  tela.innerHTML = `
    <div class="acoes">
      ${item.audio ? `<button class="btn primario" id="b-ouvir">▶ ${pos > 5 ? `Continuar de ${fmt(pos)}` : `Ouvir · voz natural · ${minutos(item.audio.duracao)}`}</button>` : ''}
      <button class="btn ${item.audio ? '' : 'primario'}" id="b-tts">🔊 ${posTts > 0 ? 'Continuar com a voz do celular' : 'Ouvir com a voz do celular'}</button>
      ${item.audio ? '<button class="btn" id="b-baixar"></button>' : ''}
    </div>
    <p class="aviso" id="aviso-doc">${item.audio ? '' : 'Este texto é lido pela voz do celular. A tela fica acesa durante a leitura.'}</p>
    <details class="capitulos"><summary>Capítulos (${caps.length})</summary><ol>
      ${caps.map((c, i) => `<li data-i="${i}"><button>${esc(c.titulo)}${c.inicio != null ? ` <small>${fmt(c.inicio)}</small>` : ''}</button></li>`).join('')}
    </ol></details>
    <article>${doc.html}</article>`;
  window.scrollTo(0, 0);

  const ouvir = $('#b-ouvir');
  if (ouvir) ouvir.addEventListener('click', () => iniciarAudio(item, doc, null));
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

/* ---------- reprodutor ---------- */

const player = { modo: null, item: null, doc: null, cap: 0, f: -1, marcas: [] };
let velocidade = guardado.get('velocidade', 1);
let ultimoSalvo = 0;

function mostrarPlayer() {
  $('#player').hidden = false;
  $('#player').classList.toggle('tts', player.modo === 'tts');
  document.body.classList.add('tocando');
  $('#p-titulo').textContent = player.item.titulo;
  $('#p-vel').textContent = `${String(velocidade).replace('.', ',')}×`;
  $('#p-voltar').textContent = player.modo === 'tts' ? '⟲' : '−15';
  $('#p-avancar').textContent = player.modo === 'tts' ? '⟳' : '+30';
  aoMudarCapitulo();
}

function pararTudo() {
  if (player.modo === 'audio') { salvarPosicao(true); audio.pause(); }
  if (player.modo === 'tts') ttsParar();
  player.modo = null;
}

function iniciarAudio(item, doc, cap) {
  const url = abs(item.audio.url);
  if (!navigator.onLine && !baixados.has(url)) {
    const av = $('#aviso-doc');
    if (av) av.textContent = 'Sem internet e o áudio não foi baixado. Use a voz do celular.';
    return;
  }
  pararTudo();
  Object.assign(player, { modo: 'audio', item, doc, cap: 0, f: -1, marcas: [] });
  doc.capitulos.forEach((c) => (c.t || []).forEach((t, i) => {
    const f = (c.f || [])[i];
    if (f != null && f >= 0) player.marcas.push([t, f]);
  }));
  const inicio = cap != null ? (doc.capitulos[cap].inicio || 0) : guardado.get(`pos:${item.id}`, 0);
  player.cap = capituloNoTempo(inicio);
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
  const cap = capituloNoTempo(t);
  if (cap !== player.cap) { player.cap = cap; aoMudarCapitulo(); }
  if (player.marcas.length) marcarLeitura(blocoNoTempo(t));
  salvarPosicao(false);
  if ('mediaSession' in navigator && navigator.mediaSession.setPositionState && isFinite(d)) {
    try { navigator.mediaSession.setPositionState({ duration: d, position: Math.min(t, d), playbackRate: audio.playbackRate }); } catch { /* ok */ }
  }
});
audio.addEventListener('play', () => atualizarPlay(true));
audio.addEventListener('pause', () => { atualizarPlay(false); salvarPosicao(true); });
audio.addEventListener('ended', () => {
  if (player.modo !== 'audio' || !player.item) return;
  guardado.set(`pos:${player.item.id}`, 0);
  guardado.set(`ouvido:${player.item.id}`, true);
  atualizarPlay(false);
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

function iniciarTts(item, doc, cap) {
  if (!('speechSynthesis' in window)) {
    const av = $('#aviso-doc');
    if (av) av.textContent = 'Este navegador não tem leitura em voz alta.';
    return;
  }
  pararTudo();
  Object.assign(player, { modo: 'tts', item, doc, cap: 0, f: -1, marcas: [] });
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
  if (tts.idx < 0) tts.idx = 0;
  tts.voz = tts.voz || escolherVoz();
  player.cap = tts.pedacos[tts.idx] ? tts.pedacos[tts.idx].cap : 0;
  mostrarPlayer();
  configurarMediaSession();
  ttsTocar();
}

function ttsFalar() {
  const p = tts.pedacos[tts.idx];
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
  }
  marcarLeitura(p.f);
  const u = new SpeechSynthesisUtterance(p.texto);
  u.lang = 'pt-BR';
  if (tts.voz) u.voice = tts.voz;
  u.rate = velocidade;
  u.onend = () => {
    if (u !== tts.atual || !tts.tocando) return;
    tts.idx++;
    salvarPosicao(false);
    ttsFalar();
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
window.addEventListener('scroll', () => { if (!location.hash.startsWith('#/doc/')) rolagemInicio = window.scrollY; }, { passive: true });

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

/* ---------- início ---------- */

(async function iniciar() {
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
  atualizarRede();
  await carregarCatalogo();
  rota();
  sincronizar();
}());
