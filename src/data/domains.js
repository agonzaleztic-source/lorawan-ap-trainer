/* Los ocho dominios temáticos. El id se usa en preguntas, tarjetas y lecciones. */
export const DOMAINS = [
  { id: "phy", n: "Capa física LoRa", c: "#35D6C6" },
  { id: "arq", n: "Arquitectura de red", c: "#9A8CFA" },
  { id: "cls", n: "Clases A / B / C", c: "#F2A63C" },
  { id: "sec", n: "Activación y seguridad", c: "#58D68D" },
  { id: "mac", n: "Formato de trama", c: "#5FB0F0" },
  { id: "cmd", n: "Comandos MAC y ADR", c: "#E88BC0" },
  { id: "reg", n: "Parámetros regionales", c: "#F0736A" },
  { id: "ops", n: "Despliegue y operación", c: "#C9D46A" },
];

export const DOM_NAME = Object.fromEntries(DOMAINS.map((d) => [d.id, d.n]));
export const DOM_COLOR = Object.fromEntries(DOMAINS.map((d) => [d.id, d.c]));
