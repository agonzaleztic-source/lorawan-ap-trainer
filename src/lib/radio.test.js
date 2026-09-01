import { describe, it, expect } from "vitest";
import { timeOnAir, shuffle, shuffleOptions, randSeed, rng } from "./radio.js";

/* Los tiempos en aire se contrastan contra los valores de referencia que
   publica Semtech para la modulacion LoRa (AN1200.13). Si alguien toca la
   formula, estos dos numeros lo delatan. */
describe("tiempo en aire", () => {
  it("SF7 / BW125 / CR4:5 / 13 B da 46,3 ms", () => {
    const r = timeOnAir({ sf: 7, bw: 125000, cr: 1, payload: 13 });
    expect(r.toa).toBeCloseTo(46.336, 3);
    expect(r.tSym).toBeCloseTo(1.024, 3);
    expect(r.symbols).toBe(33);
    expect(r.de).toBe(0);
  });

  it("SF12 / BW125 / CR4:5 / 13 B da 1,155 s", () => {
    const r = timeOnAir({ sf: 12, bw: 125000, cr: 1, payload: 13 });
    expect(r.toa).toBeCloseTo(1155.072, 3);
    expect(r.symbols).toBe(23);
  });

  it("activa el optimizador de baja tasa solo con SF11-12 en 125 kHz", () => {
    expect(timeOnAir({ sf: 11, bw: 125000, cr: 1, payload: 10 }).de).toBe(1);
    expect(timeOnAir({ sf: 12, bw: 125000, cr: 1, payload: 10 }).de).toBe(1);
    expect(timeOnAir({ sf: 10, bw: 125000, cr: 1, payload: 10 }).de).toBe(0);
    expect(timeOnAir({ sf: 12, bw: 250000, cr: 1, payload: 10 }).de).toBe(0);
  });

  it("subir un SF en 125 kHz aproximadamente duplica el tiempo en aire", () => {
    for (let sf = 7; sf <= 9; sf++) {
      const a = timeOnAir({ sf, bw: 125000, cr: 1, payload: 20 }).toa;
      const b = timeOnAir({ sf: sf + 1, bw: 125000, cr: 1, payload: 20 }).toa;
      expect(b / a).toBeGreaterThan(1.7);
      expect(b / a).toBeLessThan(2.3);
    }
  });
});

describe("barajado", () => {
  it("conserva los elementos y no muta el array de entrada", () => {
    const orig = [1, 2, 3, 4, 5];
    const copia = [...orig];
    const out = shuffle(orig, 42);
    expect(orig).toEqual(copia);
    expect([...out].sort((a, b) => a - b)).toEqual(copia);
  });

  it("es reproducible con la misma semilla", () => {
    expect(shuffle([1, 2, 3, 4, 5, 6, 7, 8], 12345)).toEqual(
      shuffle([1, 2, 3, 4, 5, 6, 7, 8], 12345)
    );
  });

  it("produce permutaciones tan variadas como un generador ideal", () => {
    // Barajar 8 elementos solo admite 8! = 40.320 ordenes distintos, asi que
    // con 20.000 semillas las repeticiones son las del problema del cumpleanos:
    // K * (1 - (1 - 1/K)^N) = 15.768. Salirse por debajo delata estructura.
    const K = 40320, N = 20000;
    const ideal = K * (1 - Math.pow(1 - 1 / K, N));
    const ordenes = new Set();
    for (let s = 1; s <= N; s++) ordenes.add(shuffle([0, 1, 2, 3, 4, 5, 6, 7], s).join(""));
    expect(ordenes.size).toBeGreaterThan(ideal * 0.97);
  });

  it("reparte la respuesta correcta al 25 % entre las cuatro posiciones", () => {
    const q = { opts: ["a", "b", "c", "d"], a: 1 };
    const pos = [0, 0, 0, 0];
    const N = 40000;
    for (let i = 0; i < N; i++) pos[shuffleOptions(q, randSeed()).a]++;
    const esperado = N / 4;
    const chi2 = pos.reduce((s, o) => s + (o - esperado) ** 2 / esperado, 0);
    expect(chi2).toBeLessThan(16.27); // 3 gl, p = 0,001
  });

  it("mueve el indice de la correcta con la opcion, no lo deja fijo", () => {
    const q = { opts: ["uno", "dos", "tres", "cuatro"], a: 2 };
    for (let s = 1; s < 500; s++) {
      const r = shuffleOptions(q, s);
      expect(r.opts[r.a]).toBe("tres");
      expect([...r.opts].sort()).toEqual([...q.opts].sort());
    }
  });
});

/* El generador anterior era un congruencial lineal cuya multiplicacion
   (s * 1103515245) alcanza 2,4e18, muy por encima de Number.MAX_SAFE_INTEGER:
   el redondeo le comia los bits bajos y lo metia en ciclos cortos, apenas
   15.820 valores distintos en 100.000 pasos. Este es el test que aquella
   version no pasaba. */
describe("generador con semilla", () => {
  it("no cae en ciclos cortos: casi todos los pasos dan valores distintos", () => {
    const paso = rng(987654321);
    const vistos = new Set();
    const N = 100000;
    for (let i = 0; i < N; i++) vistos.add(paso());
    expect(vistos.size).toBeGreaterThan(N * 0.99);
  });

  it("se mantiene dentro de [0, 1) y en aritmetica exacta de 32 bits", () => {
    const paso = rng(1);
    for (let i = 0; i < 10000; i++) {
      const v = paso();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
      expect(Number.isSafeInteger(v * 4294967296)).toBe(true);
    }
  });

  it("la misma semilla da la misma secuencia", () => {
    const a = rng(2024), b = rng(2024);
    for (let i = 0; i < 100; i++) expect(a()).toBe(b());
  });
});
