/* Service worker do PMPE Ouvir: guarda o app e o conteúdo para uso offline. */
const VERSAO = '__VERSAO__';
const SHELL = `shell-${VERSAO}`;
const DADOS = 'dados-v1';
const AUDIO = 'audio-v1';
const ARQUIVOS = ['./', 'index.html', 'app.js', 'style.css', 'manifest.webmanifest',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(SHELL).then((c) => c.addAll(ARQUIVOS.map((u) => new Request(u, { cache: 'reload' })))));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('shell-') && k !== SHELL) await caches.delete(k);
    await self.clients.claim();
  })());
});

/* O <audio> pede pedaços do arquivo (Range). Para o MP3 guardado, a resposta 206 é montada aqui. */
async function respostaParcial(req, resp) {
  const range = req.headers.get('range');
  const blob = await resp.blob();
  const cab = { 'Content-Type': 'audio/mpeg', 'Accept-Ranges': 'bytes' };
  if (!range) return new Response(blob, { status: 200, headers: { ...cab, 'Content-Length': String(blob.size) } });
  const m = /bytes=(\d*)-(\d*)/.exec(range);
  let ini = m && m[1] ? Number(m[1]) : 0;
  let fim = m && m[2] ? Number(m[2]) : blob.size - 1;
  if (m && !m[1] && m[2]) { ini = blob.size - Number(m[2]); fim = blob.size - 1; }
  fim = Math.min(fim, blob.size - 1);
  if (ini >= blob.size || ini > fim) {
    return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${blob.size}` } });
  }
  return new Response(blob.slice(ini, fim + 1), {
    status: 206,
    headers: { ...cab, 'Content-Range': `bytes ${ini}-${fim}/${blob.size}`, 'Content-Length': String(fim - ini + 1) },
  });
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  const caminho = url.pathname;

  if (caminho.endsWith('/data/catalogo.json')) { // rede primeiro, cópia guardada se offline
    e.respondWith((async () => {
      try {
        const r = await fetch(req, { cache: 'no-cache' });
        if (r.ok) (await caches.open(DADOS)).put(url.href, r.clone());
        return r;
      } catch {
        return (await caches.match(url.href)) || Response.error();
      }
    })());
    return;
  }

  if (caminho.includes('/data/docs/') || caminho.includes('/data/questoes.') || caminho.includes('/data/busca.')) { // nomes com hash: nunca mudam
    e.respondWith((async () => {
      const c = await caches.match(url.href);
      if (c) return c;
      const r = await fetch(req);
      if (r.ok) (await caches.open(DADOS)).put(url.href, r.clone());
      return r;
    })());
    return;
  }

  if (caminho.includes('/audio/')) {
    e.respondWith((async () => {
      const c = await (await caches.open(AUDIO)).match(url.href);
      return c ? respostaParcial(req, c) : fetch(req);
    })());
    return;
  }

  // Arquivos do app: cópia guardada primeiro (abre na hora, mesmo offline).
  e.respondWith((async () => {
    const shell = await caches.open(SHELL);
    const chave = req.mode === 'navigate' ? 'index.html' : req;
    const c = await shell.match(chave, { ignoreSearch: true });
    if (c) return c;
    try { return await fetch(req); } catch { return (await shell.match('index.html')) || Response.error(); }
  })());
});

/* Toque no aviso do cronômetro: volta para o app. */
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil((async () => {
    const janelas = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    if (janelas.length) return janelas[0].focus();
    return self.clients.openWindow('./#/cronometro');
  })());
});
