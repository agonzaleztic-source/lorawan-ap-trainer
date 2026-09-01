/* Persistencia del progreso y programacion de repaso espaciado.

   Todo vive en localStorage, en este dispositivo. Las lecturas y escrituras
   van envueltas en try/catch: en modo privado, con cuota agotada o con el
   almacenamiento bloqueado, la app debe seguir funcionando sin progreso
   guardado en lugar de romperse. */

const KEY = "lorawan-ap-trainer/v1";

/* Estado inicial. `doms` son los ids de dominio, que se pasan desde fuera
   para no acoplar esta capa a los datos del temario. */
export function emptyState(doms) {
  return {
    v: 1,
    stats: Object.fromEntries(doms.map((d) => [d, { seen: 0, right: 0 }])),
    studied: [],
    cards: {},   // anverso -> { box, due }
    failed: {},  // id de pregunta -> fallos acumulados pendientes
    runs: [],    // historial de tests: { at, score, n, mock }
  };
}

export function loadState(doms) {
  const base = emptyState(doms);
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return base;
    const saved = JSON.parse(raw);
    if (!saved || saved.v !== 1) return base;
    return {
      ...base,
      ...saved,
      // Si el temario gana dominios nuevos, los que falten arrancan a cero.
      stats: { ...base.stats, ...(saved.stats || {}) },
      cards: saved.cards || {},
      failed: saved.failed || {},
      runs: Array.isArray(saved.runs) ? saved.runs : [],
      studied: Array.isArray(saved.studied) ? saved.studied : [],
    };
  } catch {
    return base;
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function clearState() {
  try {
    localStorage.removeItem(KEY);
    return true;
  } catch {
    return false;
  }
}

/* ---------- Repaso espaciado (Leitner de cinco cajas) ----------
   Una tarjeta acertada sube de caja y tarda mas en volver. Una fallada
   cae a la caja 1 y reaparece en la misma sesion. Es lo que convierte
   el mazo en un sistema de memoria en lugar de un carrusel. */

const MIN = 60 * 1000;
const DAY = 24 * 60 * MIN;
export const BOXES = 5;
const INTERVAL = { 1: 10 * MIN, 2: DAY, 3: 3 * DAY, 4: 7 * DAY, 5: 21 * DAY };

/* Una tarjeta nunca vista esta pendiente desde el principio. */
export function cardState(cards, front) {
  return cards[front] || { box: 0, due: 0 };
}

export function isDue(cards, front, now = Date.now()) {
  return cardState(cards, front).due <= now;
}

export function scheduleCard(cards, front, ok, now = Date.now()) {
  const cur = cardState(cards, front);
  const box = ok ? Math.min(cur.box + 1, BOXES) : 1;
  return { ...cards, [front]: { box, due: now + INTERVAL[box] } };
}

/* Reparto del mazo para la interfaz: lo que toca hoy y lo que ya esta asentado. */
export function deckStatus(cards, deck, now = Date.now()) {
  const due = deck.filter((c) => isDue(cards, c.f, now));
  const mastered = deck.filter((c) => cardState(cards, c.f).box >= 4);
  const seen = deck.filter((c) => cardState(cards, c.f).box > 0);
  const nextDue = deck
    .map((c) => cardState(cards, c.f).due)
    .filter((d) => d > now)
    .sort((a, b) => a - b)[0];
  return { due, mastered: mastered.length, seen: seen.length, nextDue };
}

export function humanDelay(ms) {
  if (!ms || ms <= 0) return "ahora";
  const m = Math.round(ms / MIN);
  if (m < 60) return `en ${m} min`;
  const h = Math.round(m / 60);
  if (h < 24) return `en ${h} h`;
  const d = Math.round(h / 24);
  return d === 1 ? "mañana" : `en ${d} días`;
}

/* ---------- Fallos pendientes ----------
   Un fallo entra en la lista y solo sale cuando se acierta la misma
   pregunta mas tarde. Es lo que alimenta el modo de repaso dirigido. */

export function recordAnswer(failed, id, ok) {
  const next = { ...failed };
  if (ok) {
    if (next[id] > 1) next[id] -= 1;
    else delete next[id];
  } else {
    next[id] = (next[id] || 0) + 1;
  }
  return next;
}
