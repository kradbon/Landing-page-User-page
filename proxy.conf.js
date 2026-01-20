const DEFAULT_TARGET = process.env.API_TARGET || 'http://99.110.149.130/identity';
const HEADER_NAME = 'x-company-domain';

function normalizeHost(value) {
  if (!value) return '';
  const trimmed = value.trim();
  if (!trimmed) return '';
  const withoutProtocol = trimmed.replace(/^https?:\/\//i, '');
  return withoutProtocol.split('/')[0];
}

function hasHostParts(value) {
  return value.includes('.') || value.includes(':');
}

function withProtocol(host) {
  if (!host) return '';
  if (/^https?:\/\//i.test(host)) return host;
  return `http://${host}`;
}

function getHeaderHost(req) {
  const header = req.headers[HEADER_NAME];
  const raw = Array.isArray(header) ? header[0] : header;
  return normalizeHost(typeof raw === 'string' ? raw : '');
}

function resolveTarget(req) {
  const host = getHeaderHost(req);
  if (!host) return DEFAULT_TARGET;
  if (hasHostParts(host)) return withProtocol(host);
  return DEFAULT_TARGET;
}

function resolveHostHeader(req) {
  const host = getHeaderHost(req);
  if (!host) return '';
  if (hasHostParts(host)) return host;
  return '';
}

module.exports = {
  '/api': {
    target: DEFAULT_TARGET,
    changeOrigin: true,
    secure: false,
    logLevel: 'debug',
    router: resolveTarget,
    onProxyReq: (proxyReq, req) => {
      const hostHeader = resolveHostHeader(req);
      if (hostHeader) {
        proxyReq.setHeader('host', hostHeader);
      }
    },
  },
};
