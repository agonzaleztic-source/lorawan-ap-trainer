/* Calculos de radio LoRa: tiempo en aire, sensibilidad y utilidades. */
export function timeOnAir({ sf, bw, cr, payload, preamble = 8, crc = 1, header = 0 }) {
  const de = bw === 125000 && sf >= 11 ? 1 : 0;
  const tSym = Math.pow(2, sf) / bw;
  const tPre = (preamble + 4.25) * tSym;
  const num = 8 * payload - 4 * sf + 28 + 16 * crc - 20 * header;
  const den = 4 * (sf - 2 * de);
  const nPayload = 8 + Math.max(Math.ceil(num / den) * (cr + 4), 0);
  const tPay = nPayload * tSym;
  return { tSym: tSym * 1000, toa: (tPre + tPay) * 1000, symbols: nPayload, de };
}
export const SENS = { 7: -123, 8: -126, 9: -129, 10: -132, 11: -134.5, 12: -137 };
const DR_EU_SF = { 0: 12, 1: 11, 2: 10, 3: 9, 4: 8, 5: 7 };
export const fmt = (n, d = 1) => n.toLocaleString("es-ES", { minimumFractionDigits: d, maximumFractionDigits: d });

export function shuffle(arr, seed) {
  const a = [...arr];
  let s = seed;
  const rnd = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
