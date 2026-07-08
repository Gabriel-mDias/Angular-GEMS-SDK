/**
 * Gera identificadores únicos de forma segura em qualquer contexto.
 *
 * `crypto.randomUUID()` só existe em *secure context* (HTTPS ou localhost) e
 * pode estar ausente em SSR / http:// / runtimes antigos. Este utilitário usa
 * `randomUUID` quando disponível e, caso contrário, um fallback determinístico
 * o suficiente para IDs de elementos (contador + timestamp + aleatório).
 */

let counter = 0;

export function gemsUniqueId(prefix = 'gems'): string {
  const cryptoRef = typeof globalThis !== 'undefined' ? globalThis.crypto : undefined;

  if (cryptoRef && typeof cryptoRef.randomUUID === 'function') {
    return `${prefix}-${cryptoRef.randomUUID()}`;
  }

  counter = (counter + 1) % Number.MAX_SAFE_INTEGER;
  const time = Date.now().toString(36);
  const rand = Math.floor(Math.random() * 1e9).toString(36);
  return `${prefix}-${time}-${counter.toString(36)}-${rand}`;
}
