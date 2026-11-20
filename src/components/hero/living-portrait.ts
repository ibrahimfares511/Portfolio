// ===== LIVING PORTRAIT =====
// A photo-like head on a soft sheet. Every expression, gaze and blink is a separately generated
// picture of the same face (public/avatar/face/*.webp, all pixel-aligned); the code only decides
// which one to show and makes the skin move. Adapted from the "living portrait" engine:
// - only ONE picture is ever on screen; changes are a crossfade of 70ms at most
// - the sheet never folds (the untangle step), physics runs at a fixed 1/240s step
// - it never changes his expression on its own while the visitor is active
//
// startLivingPortrait() returns a cleanup that removes every listener, observer and frame loop,
// so remounting (locale switch, client navigation, StrictMode) never stacks two engines.

const FACES = [
  "rest", "half", "closed",
  "up", "down", "left", "right", "upleft", "upright", "downleft", "downright",
  "grin", "hearts", "winkr", "winkl", "sad", "shock", "ouch", "dizzy",
] as const;
type Face = (typeof FACES)[number];

// sixteen gaze cells, drawn with the eight gaze pictures we have
const RING = ["e", "ene", "ne", "nne", "n", "nnw", "nw", "wnw", "w", "wsw", "sw", "ssw", "s", "sse", "se", "ese"] as const;
type Cell = (typeof RING)[number] | "half" | "closed" | "rest";
const EYEFILE: Record<Exclude<Cell, "rest">, Face> = {
  e: "right", ene: "right", ne: "upright", nne: "up", n: "up", nnw: "up", nw: "upleft", wnw: "left",
  w: "left", wsw: "left", sw: "downleft", ssw: "down", s: "down", sse: "down", se: "downright", ese: "right",
  half: "half", closed: "closed",
};
const fileOf = (cell: Cell): Face => (cell === "rest" ? "rest" : EYEFILE[cell]);

// where things are on his face, in picture coordinates (0..1)
const EYE_CENTRE: [number, number] = [0.507, 0.375];
const SPOT = {
  nose: [0.507, 0.45], brow: [0.507, 0.3], cheekR: [0.615, 0.46], cheekL: [0.395, 0.46], mouth: [0.507, 0.51],
} as const;
type Zone = "outside" | "brow" | "eyeL" | "eyeR" | "nose" | "mouth" | "cheek" | "chin";
const zoneAt = (u: number, v: number): Zone => {
  const a = (u - 0.507) / 0.155, b = (v - 0.43) / 0.22;
  if (a * a + b * b > 1 || v < 0.2) return "outside";
  if (v < 0.35) return "brow";
  if (Math.abs(v - 0.375) < 0.03 && u > 0.395 && u < 0.49) return "eyeL";
  if (Math.abs(v - 0.375) < 0.03 && u > 0.525 && u < 0.62) return "eyeR";
  if (Math.abs(u - 0.507) < 0.04 && v < 0.475) return "nose";
  if (v > 0.48 && v < 0.545 && Math.abs(u - 0.507) < 0.08) return "mouth";
  return v > 0.545 ? "chin" : "cheek";
};
// what each part of him answers to
const HOVER: Partial<Record<Zone, Face>> = { eyeL: "winkl", eyeR: "winkr", mouth: "grin" };
const TAP: Partial<Record<Zone, Face>> = {
  brow: "shock", eyeL: "ouch", eyeR: "ouch", nose: "dizzy", mouth: "grin", cheek: "ouch", chin: "grin",
};

// Any link to the contact section (or anything marked data-portrait="contact") makes him fall in love.
const CONTACT = 'a[href$="#contact"], [data-portrait="contact"]';

type Extras = { jolt?: [number, number, number, number, number]; lean?: [number, number]; call?: (now: number) => void };
type Step = [show: string, fadeMs: number, holdMs: number, extras?: Extras];

export type PortraitElements = {
  wrap: HTMLElement;
  canvas: HTMLCanvasElement;
  fallback: HTMLImageElement;
  fly: SVGSVGElement;
  hand: SVGSVGElement;
};

export function startLivingPortrait(els: PortraitElements, base = "/avatar/face/"): () => void {
  const { wrap, canvas, fallback, fly, hand } = els;
  const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: true });
  if (!gl || gl.isContextLost()) return () => {}; // no WebGL (or none right now): the plain picture stays

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Phones (no cursor): the face moves gently, so 30 frames a second and a lighter canvas are enough.
  const lowPower = matchMedia("(pointer: coarse)").matches;
  const url = (name: Face) => `${base}${name}.webp`;
  const idleGap = () => 12000 + Math.random() * 8000; // quiet time before he starts doing something on his own

  const OVER = 1.7, N = 72, M = N + 1, SPAN = OVER / N, ORIGIN = 0.5 - OVER / 2;
  const WOBBLE = 2.3 * 2 * Math.PI, REACH = 0.085 / SPAN, C = REACH * WOBBLE, GAMMA = 2 * 0.14 * WOBBLE, NU = 0.2 * C;

  const VS = `attribute vec2 a, d; attribute float s; varying vec2 vUv; varying float vS;
    uniform vec2 lean; uniform float overS;
    void main(){ vUv = a; vS = s; vec2 p = a + d + lean; gl_Position = vec4(vec2(p.x-.5, .5-p.y)*2./overS, 0., 1.); }`;
  const FS = `precision highp float; varying vec2 vUv; varying float vS;
    uniform sampler2D faceA, faceB;
    uniform float fade;
    void main(){
      if(vUv.x<0.||vUv.y<0.||vUv.x>1.||vUv.y>1.){ gl_FragColor = vec4(0.); return; }
      vec4 c = mix(texture2D(faceA,vUv), texture2D(faceB,vUv), fade);
      if(c.a<.004){ gl_FragColor = vec4(0.); return; }
      gl_FragColor = vec4(c.rgb*vS, c.a);
    }`;
  const sh = (t: number, s: string) => {
    const o = gl.createShader(t)!;
    gl.shaderSource(o, s);
    gl.compileShader(o);
    if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(o));
    return o;
  };
  const pr = gl.createProgram()!;
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS));
  gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(pr);
  gl.useProgram(pr);
  const uLean = gl.getUniformLocation(pr, "lean"), uFade = gl.getUniformLocation(pr, "fade");
  gl.uniform1f(gl.getUniformLocation(pr, "overS"), OVER);
  gl.uniform1i(gl.getUniformLocation(pr, "faceA"), 0);
  gl.uniform1i(gl.getUniformLocation(pr, "faceB"), 1);

  // ---- the sheet: a damped wave equation on the displacement of each node ----
  const count = M * M;
  const ux = new Float32Array(count), uy = new Float32Array(count), vx = new Float32Array(count), vy = new Float32Array(count);
  const rest = new Float32Array(count * 2), dyn = new Float32Array(count * 3);
  const sx = new Float32Array(count), sy = new Float32Array(count);
  for (let j = 0, k = 0; j < M; j++) for (let i = 0; i < M; i++) { rest[k++] = ORIGIN + i * SPAN; rest[k++] = ORIGIN + j * SPAN; }
  const idx = new Uint16Array(N * N * 6);
  for (let j = 0, k = 0; j < N; j++)
    for (let i = 0; i < N; i++) {
      const a = j * M + i, b = a + 1, c = a + M, d = c + 1;
      idx[k++] = a; idx[k++] = c; idx[k++] = b; idx[k++] = b; idx[k++] = c; idx[k++] = d;
    }
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, rest, gl.STATIC_DRAW);
  const aa = gl.getAttribLocation(pr, "a");
  gl.enableVertexAttribArray(aa);
  gl.vertexAttribPointer(aa, 2, gl.FLOAT, false, 0, 0);
  const dynBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, dynBuf);
  gl.bufferData(gl.ARRAY_BUFFER, dyn, gl.DYNAMIC_DRAW);
  const ad = gl.getAttribLocation(pr, "d"), as = gl.getAttribLocation(pr, "s");
  gl.enableVertexAttribArray(ad);
  gl.vertexAttribPointer(ad, 2, gl.FLOAT, false, 12, 0);
  gl.enableVertexAttribArray(as);
  gl.vertexAttribPointer(as, 1, gl.FLOAT, false, 12, 8);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  // a handful of skin: nodes near the point follow the hand, fully at the centre
  type Brush = { u: number; v: number; list: [number, number, number, number][]; px: number; py: number };
  let brush: Brush | null = null;
  // The sheet sleeps while it is still: no simulation and no upload until something shoves it.
  let calm = false;
  function takeHold(u: number, v: number, radius = 0.22) {
    if (calm) { calm = false; simLeft = 0; }
    const list: Brush["list"] = [];
    for (let k = 0; k < count; k++) {
      const dx = rest[k * 2] + ux[k] - u, dy = rest[k * 2 + 1] + uy[k] - v;
      const w = Math.exp(-(dx * dx + dy * dy) / (radius * radius));
      if (w > 0.02) list.push([k, w, ux[k], uy[k]]);
    }
    brush = { u, v, list, px: 0, py: 0 };
  }
  // The sheet must never fold over itself: overlapping triangles draw as a comb of cuts.
  // Every frame each row and column is forced back into order with a minimum gap.
  const GAP = SPAN * 0.34, lineA = new Float32Array(M), lineB = new Float32Array(M), lineP = new Float32Array(M);
  function order(start: number, stride: number, field: Float32Array, baseLine: Float32Array) {
    for (let i = 0; i < M; i++) { const k = start + i * stride; lineP[i] = baseLine[k] + field[k]; }
    lineA[0] = lineP[0];
    for (let i = 1; i < M; i++) lineA[i] = Math.max(lineP[i], lineA[i - 1] + GAP);
    lineB[N] = lineP[N];
    for (let i = N - 1; i >= 0; i--) lineB[i] = Math.min(lineP[i], lineB[i + 1] - GAP);
    for (let i = 0; i < M; i++) { const k = start + i * stride; field[k] = (lineA[i] + lineB[i]) / 2 - baseLine[k]; }
  }
  const restX = new Float32Array(count), restY = new Float32Array(count);
  for (let k = 0; k < count; k++) { restX[k] = rest[k * 2]; restY[k] = rest[k * 2 + 1]; }
  function untangle() {
    for (let pass = 0; pass < 2; pass++) {
      for (let j = 0; j < M; j++) order(j * M, 1, sx, restX);
      for (let i = 0; i < M; i++) order(i, M, sy, restY);
    }
  }

  const H = 1 / 240;
  let simLeft = 0;
  function step(dt: number) {
    const c2 = C * C, wo2 = WOBBLE * WOBBLE;
    for (let j = 1; j < N; j++)
      for (let i = 1; i < N; i++) {
        const k = j * M + i, l = k - 1, r = k + 1, t = k - M, b = k + M;
        const lx = ux[l] + ux[r] + ux[t] + ux[b] - 4 * ux[k], ly = uy[l] + uy[r] + uy[t] + uy[b] - 4 * uy[k];
        const lvx = vx[l] + vx[r] + vx[t] + vx[b] - 4 * vx[k], lvy = vy[l] + vy[r] + vy[t] + vy[b] - 4 * vy[k];
        vx[k] += (c2 * lx - wo2 * ux[k] - GAMMA * vx[k] + NU * lvx) * dt;
        vy[k] += (c2 * ly - wo2 * uy[k] - GAMMA * vy[k] + NU * lvy) * dt;
      }
    if (brush)
      for (const [k, w, u0, v0] of brush.list) {
        const K = 3000 * w, D = 90 * w;
        vx[k] += ((u0 + brush.px * w - ux[k]) * K - vx[k] * D) * dt;
        vy[k] += ((v0 + brush.py * w - uy[k]) * K - vy[k] * D) * dt;
      }
    for (let k = 0; k < count; k++) { ux[k] += vx[k] * dt; uy[k] += vy[k] * dt; }
  }
  // a shove from nowhere: jolts, a fly landing
  function poke(u: number, v: number, dx: number, dy: number, radius = 0.09) {
    if (calm) { calm = false; simLeft = 0; }
    for (let k = 0; k < count; k++) {
      const ax = rest[k * 2] - u, ay = rest[k * 2 + 1] - v, w = Math.exp(-(ax * ax + ay * ay) / (radius * radius));
      vx[k] += dx * w;
      vy[k] += dy * w;
    }
  }

  // ---- pictures ----
  const tex: Partial<Record<Face, WebGLTexture>> = {};
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  const load = (name: Face) =>
    new Promise<HTMLImageElement | null>((res) => {
      const i = new Image();
      i.crossOrigin = "anonymous";
      i.onload = () => res(i);
      i.onerror = () => res(null);
      i.src = url(name);
    });
  function upload(name: Face, img: HTMLImageElement) {
    const t = gl!.createTexture()!;
    gl!.activeTexture(gl!.TEXTURE5);
    gl!.bindTexture(gl!.TEXTURE_2D, t);
    gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, gl!.RGBA, gl!.UNSIGNED_BYTE, img);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR);
    tex[name] = t;
  }
  let alphaMap: Uint8ClampedArray | null = null;
  function hitMap(img: HTMLImageElement) {
    const a = document.createElement("canvas");
    a.width = a.height = 128;
    const ac = a.getContext("2d", { willReadFrequently: true })!;
    ac.drawImage(img, 0, 0, 128, 128);
    alphaMap = ac.getImageData(0, 0, 128, 128).data;
  }

  // ---- what he does ----
  let flyPos: [number, number] = [1.4, 0];
  let handFrom: [number, number] = [1.4, 0.9], handTo: [number, number] = [1.4, 0.9];
  let flyFrom: [number, number] = [1.4, 0], flyTo: [number, number] = [1.4, 0];
  let moveT = 0, moveMs = 1;
  let handGrip: false | "on" | "pull" | "off" = false, handHeld = false;
  const moveHand = (u: number, v: number, ms: number) => (now: number) => { handFrom = handTo; handTo = [u, v]; moveT = now; moveMs = ms; };
  const moveFly = (u: number, v: number, ms: number) => (now: number) => { flyFrom = flyTo; flyTo = [u, v]; moveT = now; moveMs = ms; };

  const ACTS: Record<string, Step[] | (() => Step[])> = {
    shifty: [["eye:w", 60, 520], ["eye:e", 60, 600], ["eye:w", 60, 400], ["eye:rest", 60, 260]],
    roll: [["eye:w", 70, 200], ["eye:wnw", 50, 55], ["eye:nw", 50, 55], ["eye:nnw", 50, 60], ["eye:n", 50, 140], ["eye:nne", 50, 60],
      ["eye:ne", 50, 55], ["eye:ene", 50, 55], ["eye:e", 50, 240], ["eye:rest", 90, 200], ["grin", 120, 600]],
    winkR: [["winkr", 90, 500], ["grin", 120, 800]],
    winkL: [["eye:sw", 60, 500], ["winkl", 90, 500], ["grin", 120, 700]],
    love: [["hearts", 120, 1100], ["grin", 140, 600]],
    doze: [["half", 450, 700, { lean: [0.006, 0.006] }], ["closed", 320, 500, { lean: [0.012, 0.012] }], ["half", 200, 340],
      ["closed", 400, 2400, { lean: [0.02, 0.02] }], ["shock", 50, 650, { jolt: [0.5, 0.45, 0, -0.9, 0.3] }]],
    fly: () => {
      flyTo = [1.35, 0.02];
      fly.style.opacity = "1";
      lookAt = () => flyPos;
      const hop = (u: number, v: number, ms: number): Step => ["rest", 40, ms, { call: moveFly(u, v, ms * 0.9) }];
      return [hop(0.92, 0.2, 620), hop(0.1, 0.32, 680), hop(0.9, 0.62, 640), hop(0.16, 0.58, 600), hop(...SPOT.nose, 520),
        ["shock", 110, 700, { jolt: [0.507, 0.45, 0, 0.28, 0.05] }],
        ["dizzy", 110, 800],
        ["ouch", 90, 420, { jolt: [0.507, 0.45, 0, 0.28, 0.05], call: moveFly(1.5, -0.35, 600) }],
        ["grin", 120, 700]];
    },
    tug: () => {
      handTo = [1.3, 0.86];
      hand.style.opacity = "1";
      hand.classList.remove("shut");
      const g = (u: number, v: number, ms: number, face: string, grip: typeof handGrip): Step =>
        [face, 90, ms, { call: (now) => { moveHand(u, v, ms * 0.8)(now); handGrip = grip; } }];
      return [g(...SPOT.cheekR, 760, "eye:se", false), g(...SPOT.cheekR, 240, "shock", "on"),
        g(0.82, 0.5, 620, "ouch", "pull"), g(0.74, 0.54, 240, "ouch", "pull"), g(0.84, 0.48, 240, "ouch", "pull"),
        g(0.77, 0.51, 260, "ouch", "pull"), g(1.4, 0.22, 1000, "dizzy", "off"), ["sad", 120, 700]];
    },
  };
  const ROTATION = ["winkR", "love", "tug", "shifty", "fly", "winkL", "roll", "doze"];

  // state
  let ready = false, tStart = 0, last = performance.now(), raf = 0, alive = true;
  let pu = 0.5, pv = 0.5, onHead = false, zone: Zone | null = null, zoneSince = 0;
  let lastInput = -1e9, awake = false, pressed = false, downAt = 0, downU = 0, downV = 0, lastX = 0, lastY = 0, speed = 0, shake = 0;
  let moodFace: Face | null = null, moodUntil = 0, pulls: number[] = [];
  let lookAt: (() => [number, number]) | null = null;
  let act: Step[] | null = null, actName = "", actI = 0, actT = 0, rotation: string[] = [], nextIdle = idleGap();
  let faceA: Face = "rest", faceB: Face = "rest", fadeT = 0, fadeMs = 1;
  let logical: Face = "rest", logicalMs = 70, eyeNow: Cell = "rest", eyeNowMs = 40;
  let nextBlink = 0, blinkStep = -1, blinkT = 0;
  let leanX = 0, leanY = 0, lvX = 0, lvY = 0, wantLean: [number, number] = [0, 0];
  let wantEyes: Cell | null = null;

  const isFace = (n: string): n is Face => (FACES as readonly string[]).includes(n);
  // a picture we don't have (yet) falls back to his resting face
  const setFace = (n: string, ms: number) => { logical = isFace(n) && tex[n] ? n : "rest"; logicalMs = ms; };
  const setEye = (cell: Cell, ms: number) => { if (tex[fileOf(cell)]) { eyeNow = cell; eyeNowMs = ms; } };
  // one picture on screen at a time, always
  function show(n: Face, ms: number, now: number) {
    if (!tex[n] || n === faceB) return;
    faceA = (now - fadeT) / fadeMs > 0.5 ? faceB : faceA;
    faceB = n;
    fadeT = now;
    fadeMs = Math.min(70, Math.max(1, ms));
  }
  function compose(now: number) {
    if (logical !== "rest") show(logical, logicalMs, now);
    else show(fileOf(eyeNow), eyeNowMs, now);
  }
  const ringFor = (dx: number, dy: number): Cell =>
    RING[Math.round(((Math.atan2(-dy, dx) + Math.PI * 2) % (Math.PI * 2)) / (Math.PI / 8)) % 16];

  function startAct(name: string, now: number) {
    endAct();
    const a = ACTS[name];
    act = typeof a === "function" ? a() : a;
    actName = name;
    actI = -1;
    actT = now;
    advance(now);
  }
  function endAct() {
    act = null;
    actName = "";
    wantEyes = null;
    fly.style.opacity = "0";
    hand.style.opacity = "0";
    lookAt = null;
    handGrip = false;
    if (handHeld) { handHeld = false; brush = null; hand.classList.remove("shut"); }
  }
  function advance(now: number) {
    actI++;
    if (!act || actI >= act.length) { endAct(); return; }
    const [what, fade, , x] = act[actI];
    actT = now;
    if (what.startsWith("eye:")) { setFace("rest", fade); wantEyes = what.slice(4) as Cell; setEye(wantEyes, fade); }
    else if (what === "half" || what === "closed") { setFace("rest", fade); wantEyes = what; setEye(what, fade); }
    else { wantEyes = null; setFace(what, fade); }
    wantLean = x?.lean ?? [0, 0];
    if (x?.jolt) poke(...x.jolt);
    x?.call?.(now);
  }
  const place = (el: SVGSVGElement, u: number, v: number) => {
    el.style.left = (u - 0.5) * 100 + 50 + "%";
    el.style.top = (v - 0.5) * 100 + 50 + "%";
  };

  // ---- input ----
  const toUv = (x: number, y: number): [number, number] => {
    const r = canvas.getBoundingClientRect();
    return [((x - r.left) / r.width - 0.5) * OVER + 0.5, ((y - r.top) / r.height - 0.5) * OVER + 0.5];
  };
  const solid = (u: number, v: number) =>
    !!alphaMap && u >= 0 && v >= 0 && u < 1 && v < 1 && alphaMap[(((v * 128) | 0) * 128 + ((u * 128) | 0)) * 4 + 3] > 40;
  let wakeTimer = 0;
  function wake(now: number) {
    lastInput = now;
    if (!awake) {
      awake = true;
      nextBlink = now + 1600;
      setEye("half", 90);
      wakeTimer = window.setTimeout(() => awake && setEye("rest", 100), 110);
    }
    nextIdle = idleGap();
  }

  const onMove = (e: PointerEvent) => {
    const now = performance.now();
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    [pu, pv] = toUv(e.clientX, e.clientY);
    speed += Math.hypot(dx, dy) * 0.004;
    wake(now);
    if (act && !pressed) {
      if (actName === "doze") { actI = act.length - 2; advance(now); } // startled awake
      else endAct();
    }
    onHead = solid(pu, pv);
    const z = onHead ? zoneAt(pu, pv) : null;
    if (z !== zone) { zone = z; zoneSince = now; }
    wrap.style.cursor = pressed ? "grabbing" : onHead ? "grab" : "";
    // a cursor on the skin rubs it along
    if (onHead && !pressed) poke(pu, pv, dx * 0.00035, dy * 0.00035, 0.07);
    if (pressed && brush) {
      let px = pu - brush.u, py = pv - brush.v;
      const L = Math.hypot(px, py), lim = 0.24;
      if (L > 0) { const k = (lim * (1 - Math.exp(-L / lim))) / L; px *= k; py *= k; }
      brush.px = px;
      brush.py = py;
    }
  };
  const onDown = (e: PointerEvent) => {
    const now = performance.now(), [u, v] = toUv(e.clientX, e.clientY);
    if (!solid(u, v)) return;
    wake(now);
    endAct();
    pressed = true;
    downAt = now;
    downU = u;
    downV = v;
    takeHold(u, v);
    moodFace = null;
    wrap.setPointerCapture(e.pointerId);
    e.preventDefault();
  };
  const onUp = () => {
    if (!pressed || !brush) return;
    const b = brush as Brush;
    const now = performance.now(), L = Math.hypot(b.px, b.py), z = zoneAt(downU, downV), held = now - downAt;
    pressed = false;
    brush = null;
    wrap.style.cursor = onHead ? "grab" : "";
    pulls = pulls.filter((t) => now - t < 14000);
    if (L < 0.03 && held < 380) {
      // a tap
      const r = TAP[z];
      if (r) { moodFace = r; moodUntil = now + 1100; poke(downU, downV, 0, 0.5, 0.06); }
      return;
    }
    pulls.push(now);
    const n = pulls.length;
    moodFace = n >= 8 ? "sad" : n >= 5 ? "ouch" : L > 0.1 ? "dizzy" : "grin";
    moodUntil = now + (n >= 5 ? 2600 : 700 + L * 2800);
  };
  const onLeaveWindow = () => { zone = null; };
  // contact links: in love while hovered, sad when left
  let overContact: Element | null = null;
  const onOver = (e: PointerEvent) => {
    const c = (e.target as Element | null)?.closest?.(CONTACT) ?? null;
    if (c === overContact) return;
    const now = performance.now();
    if (c) { moodFace = "hearts"; moodUntil = now + 1e7; }
    else if (overContact) { moodFace = "sad"; moodUntil = now + 1400; }
    overContact = c;
  };
  let lastScroll = scrollY, scrollUntil = 0;
  const onScroll = () => {
    const n = performance.now();
    if (Math.abs(scrollY - lastScroll) > 2) { scrollUntil = n + 500; lastScroll = scrollY; }
    wake(n);
  };

  addEventListener("pointermove", onMove);
  addEventListener("pointerup", onUp);
  addEventListener("pointercancel", onUp);
  document.documentElement.addEventListener("pointerleave", onLeaveWindow);
  document.addEventListener("pointerover", onOver);
  addEventListener("scroll", onScroll, { passive: true });
  wrap.addEventListener("pointerdown", onDown);

  let visible = true, seenCheck = 0, cssW = 1;
  // what the last drawn frame showed: an unchanged, settled face isn't drawn again
  let drawnA = "", drawnB = "", drawnFade = -1, drawnLX = 0, drawnLY = 0;
  const io = new IntersectionObserver((es) => { visible = es[0].isIntersecting; }, { threshold: 0 });
  io.observe(canvas);
  const ro = new ResizeObserver(() => {
    const r = Math.min(devicePixelRatio || 1, lowPower ? 1.5 : 2), b = canvas.getBoundingClientRect();
    if (!b.width || !b.height) return; // hidden for a moment: keep the last size
    cssW = b.width;
    drawnFade = -1; // the canvas was cleared by the resize: draw again
    canvas.width = Math.round(b.width * r);
    canvas.height = Math.round(b.height * r);
    gl.viewport(0, 0, canvas.width, canvas.height);
  });
  ro.observe(canvas);

  // ---- frame ----
  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    if (lowPower && now - last < 30) return; // ~30 fps on phones
    const dt = Math.min(0.04, (now - last) / 1000);
    last = now;
    // the observer can miss a change while the page is swapped under the cover: check by hand now and then
    if (!visible && now - seenCheck > 500) {
      seenCheck = now;
      const b = canvas.getBoundingClientRect();
      visible = b.bottom > 0 && b.top < innerHeight && b.width > 0;
    }
    if (!ready || !visible || document.hidden) return;
    const f = (r: number) => 1 - Math.exp(-dt * r);

    speed *= Math.exp(-dt * 6);
    shake += ((speed > 1.5 ? 1 : 0) - shake) * f(speed > 1.5 ? 1.2 : 0.9);

    // acts when the page goes quiet
    if (act) { if (now - actT > act[actI][2]) advance(now); }
    else if (!reduced && !pressed && tStart && now - Math.max(lastInput, tStart) > nextIdle) {
      if (!rotation.length) rotation = [...ROTATION];
      if (!awake) wake(now);
      startAct(rotation.shift()!, now);
      lastInput = now;
      nextIdle = idleGap();
    }

    // moving props
    const mk = Math.min(1, (now - moveT) / moveMs), me = mk * mk * (3 - 2 * mk), buzz = mk >= 1 ? 0.15 : 1;
    flyPos = [
      flyFrom[0] + (flyTo[0] - flyFrom[0]) * me + Math.sin(now * 0.02) * 0.012 * buzz,
      flyFrom[1] + (flyTo[1] - flyFrom[1]) * me + Math.cos(now * 0.027) * 0.012 * buzz,
    ];
    place(fly, flyPos[0], flyPos[1]);
    const hp: [number, number] = [handFrom[0] + (handTo[0] - handFrom[0]) * me, handFrom[1] + (handTo[1] - handFrom[1]) * me];
    place(hand, hp[0], hp[1]);
    if (handGrip === "on" && !handHeld) { takeHold(hp[0], hp[1], 0.22); handHeld = true; hand.classList.add("shut"); handGrip = "pull"; }
    if (handHeld && brush) { brush.px = hp[0] - brush.u; brush.py = hp[1] - brush.v; }
    if (handGrip === "off" && handHeld) { handHeld = false; brush = null; hand.classList.remove("shut"); handGrip = false; }

    // which picture
    let want: Face | null = "rest";
    const pull = brush ? Math.hypot(brush.px, brush.py) : 0;
    if (act) want = null;
    else if (pressed) want = pull > 0.1 ? "ouch" : "shock";
    else if (moodFace && now < moodUntil) want = moodFace;
    else if (shake > 0.92) want = "dizzy";
    else if (zone && now - zoneSince > 80 && HOVER[zone]) want = HOVER[zone]!;
    if (want) setFace(want, want === "rest" ? 110 : 90);

    // eyes: only over the resting face, and they stay shut until the visitor moves
    if (logical === "rest") {
      if (wantEyes) setEye(wantEyes, 60);
      else if (!awake) setEye("closed", 200);
      else if (blinkStep >= 0) {
        const s = ((now - blinkT) / 62) | 0;
        if (s !== blinkStep) {
          blinkStep = s;
          if (s === 0 || s === 2) setEye("half", 20);
          else if (s === 1) setEye("closed", 20);
          else blinkStep = -1;
        }
      } else {
        let target: [number, number];
        if (lookAt) { const p = lookAt(); target = [p[0] - EYE_CENTRE[0], p[1] - EYE_CENTRE[1]]; }
        else if (now < scrollUntil) target = [0, 1];
        else target = [pu - EYE_CENTRE[0], pv - EYE_CENTRE[1]];
        setEye(Math.hypot(target[0], target[1]) < 0.13 ? "rest" : ringFor(target[0], target[1]), 50);
        if (now > nextBlink) { blinkStep = 0; blinkT = now; setEye("half", 20); nextBlink = now + 2200 + Math.random() * 3400; }
      }
    }

    compose(now);

    // the head leans toward the pull, the cursor, and whatever the act asks
    const tx = (pressed || handHeld ? (brush ? brush.px * 0.16 : 0) : awake ? (pu - 0.5) * 0.012 : 0) + wantLean[0] + Math.sin(now * 0.0009) * 0.0015;
    const ty = (pressed || handHeld ? (brush ? brush.py * 0.16 : 0) : awake ? (pv - 0.46) * 0.008 : 0) + wantLean[1] + Math.sin(now * 0.0013) * 0.0022;
    lvX += ((tx - leanX) * 70 - lvX * 8) * dt;
    lvY += ((ty - leanY) * 70 - lvY * 8) * dt;
    leanX += lvX * dt;
    leanY += lvY * dt;

    // skin (skipped entirely while the sheet sleeps)
    const g = gl!;
    let moved = false;
    if (!calm || brush) {
      moved = true;
      simLeft += dt;
      let steps = 0;
      while (simLeft >= H && steps < 9) { step(H); simLeft -= H; steps++; }
      if (steps === 9) simLeft = 0;
      for (let j = 0; j < M; j++)
        for (let i = 0; i < M; i++) {
          const k = j * M + i, edge = i === 0 || j === 0 || i === N || j === N;
          sx[k] = edge ? ux[k] : (ux[k] * 4 + ux[k - 1] + ux[k + 1] + ux[k - M] + ux[k + M]) / 8;
          sy[k] = edge ? uy[k] : (uy[k] * 4 + uy[k - 1] + uy[k + 1] + uy[k - M] + uy[k + M]) / 8;
        }
      untangle();
      let energy = 0;
      for (let k = 0, o = 0; k < count; k++) {
        dyn[o++] = sx[k];
        dyn[o++] = sy[k];
        const r = k % M, c = (k / M) | 0;
        let shade = 1;
        if (r > 0 && r < N && c > 0 && c < N)
          shade = Math.max(0.86, Math.min(1.16, 1 - (sx[k + 1] - sx[k - 1] + (sy[k + M] - sy[k - M])) * 1.8));
        dyn[o++] = shade;
        const e = Math.abs(ux[k]) + Math.abs(uy[k]) + (Math.abs(vx[k]) + Math.abs(vy[k])) * 0.05;
        if (e > energy) energy = e;
      }
      // settled (well under a hundredth of a pixel): snap to rest and let the sheet sleep
      if (!brush && energy < 2e-6) {
        calm = true;
        ux.fill(0); uy.fill(0); vx.fill(0); vy.fill(0);
        for (let k = 0, o = 0; k < count; k++) { dyn[o++] = 0; dyn[o++] = 0; dyn[o++] = 1; }
      }
      g.bindBuffer(g.ARRAY_BUFFER, dynBuf);
      g.bufferSubData(g.ARRAY_BUFFER, 0, dyn);
    }
    // nothing visible changed since the last frame (same pictures, fade done, the lean moved
    // less than a third of a pixel, the sheet asleep): keep what is on screen
    const fadeNow = Math.min(1, (now - fadeT) / fadeMs);
    const tol = (0.33 * OVER) / Math.max(1, cssW);
    if (!moved && faceA === drawnA && faceB === drawnB && fadeNow === 1 && drawnFade === 1 &&
        Math.abs(leanX - drawnLX) < tol && Math.abs(leanY - drawnLY) < tol) return;
    drawnA = faceA; drawnB = faceB; drawnFade = fadeNow; drawnLX = leanX; drawnLY = leanY;
    g.clear(g.COLOR_BUFFER_BIT);
    g.activeTexture(g.TEXTURE0);
    g.bindTexture(g.TEXTURE_2D, tex[faceA] ?? tex.rest!);
    g.activeTexture(g.TEXTURE1);
    g.bindTexture(g.TEXTURE_2D, tex[faceB] ?? tex.rest!);
    g.uniform1f(uFade, fadeNow);
    g.uniform2f(uLean, leanX, leanY);
    g.drawElements(g.TRIANGLES, idx.length, g.UNSIGNED_SHORT, 0);
  }

  (async () => {
    const first = await load("rest");
    if (!first || !alive) return;
    upload("rest", first);
    hitMap(first);
    ready = true;
    tStart = performance.now();
    // phones have no cursor to wake him: open his eyes on his own shortly after he appears
    if (matchMedia("(pointer: coarse)").matches) wakeTimer = window.setTimeout(() => alive && wake(performance.now()), 1400);
    raf = requestAnimationFrame(frame);
    // hide the plain picture only once the canvas has drawn its first frame
    requestAnimationFrame(() => requestAnimationFrame(() => { if (alive) fallback.style.visibility = "hidden"; }));
    const take = async (n: Face) => { const img = await load(n); if (img && alive) upload(n, img); };
    await take("closed");
    await take("half");
    const names = FACES.filter((n) => !["rest", "closed", "half"].includes(n));
    // the other faces are only needed once he reacts: fetch them when the browser is idle
    await new Promise<void>((r) => ("requestIdleCallback" in window ? requestIdleCallback(() => r(), { timeout: 4000 }) : setTimeout(r, 2000)));
    let i = 0;
    await Promise.all(Array.from({ length: lowPower ? 2 : 4 }, async () => { while (i < names.length && alive) await take(names[i++]); }));
  })();

  return () => {
    alive = false;
    cancelAnimationFrame(raf);
    clearTimeout(wakeTimer);
    removeEventListener("pointermove", onMove);
    removeEventListener("pointerup", onUp);
    removeEventListener("pointercancel", onUp);
    document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
    document.removeEventListener("pointerover", onOver);
    removeEventListener("scroll", onScroll);
    wrap.removeEventListener("pointerdown", onDown);
    io.disconnect();
    ro.disconnect();
    for (const t of Object.values(tex)) gl.deleteTexture(t!);
    fallback.style.visibility = "";
    wrap.style.cursor = "";
    // the context is kept: a remount (StrictMode, locale switch) asks the same canvas for it again
  };
}
