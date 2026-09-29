/* =====================================================================
 * スクワット音ゲーの曲（作曲データ＋譜面＋合成）
 *
 * 特撮・アニソン風 / Aマイナー / BPM 150 / 約85秒
 * ブラウザでは window.SONG、Node では require('./song.js') で使える。
 *
 * 書き方
 *   chords : 1小節1コード（空白区切り）。'-' はコードなし
 *   lead / brass : 1小節ぶんのメロディを「音名:拍数」で空白区切り。r は休符。1小節=4拍
 *   bass / gtr / drums / fill : 伴奏の型（下の STYLE 参照）
 *   sideUnlock : この区間から左右のノーツが解禁される（ゲーム側の演出の合図）
 *   level  : 伴奏（ギター・ベース・パッド・ドラム）の強さ。1=全開。サビ以外を下げて盛り上がりを作る
 *   chart  : 難易度ごとの譜面 { easy, normal, hard }。それぞれ { rhythm, dirs }
 *            rhythm は8分音符の格子（x=ノーツ, .=なし）を小節ごとに繰り返す。
 *              'lead'       … メロディの音の頭にノーツを置く
 *              'lead/1'     … メロディの音の頭のうち、拍の頭（表拍）にあるものだけ
 *              'lead/2'     … メロディの音の頭のうち、1拍目と3拍目にあるものだけ
 *              'lead+beats' … メロディの音の頭＋毎拍（メロディが伸びている拍にも置く）
 *            dirs は向きの並び（繰り返し）。'contour' ならメロディの上下で決める
 *              （上がる→up, 下がる→down, 5半音以上跳ぶ→right/left, 同じ音→right/left 交互。
 *               'lead+beats' で足した拍は down/up を交互）
 * ===================================================================== */
(function (root, factory) {
  const song = factory();
  if (typeof module === 'object' && module.exports) module.exports = song;
  else root.SONG = song;
})(typeof self !== 'undefined' ? self : this, function () {
'use strict';

const BPM = 150;
const BEATS_PER_BAR = 4;
const MASTER_GAIN = 0.6;   // 全体の音量（リアルタイム再生で割れないように）
const DIFFICULTIES = ['easy', 'normal', 'hard'];

// 譜面の書き方の省略形
const DU = ['down', 'up'];
const DURL = ['down', 'up', 'right', 'left'];
const C = (rhythm, dirs) => ({ rhythm, dirs });

const SECTIONS = [
  { name: 'カウント', chords: '-', drums: 'count' },

  // ---- イントロ：ブラスのファンファーレ ----
  { name: 'イントロ1', chords: 'Am F G E',
    brass: [
      'A4:.5 A4:.5 r:.5 A4:.5 C5:1 E5:1',
      'F5:1.5 E5:.5 C5:1 A4:1',
      'G4:.5 G4:.5 r:.5 G4:.5 B4:1 D5:1',
      'E5:3 G#4:1',
    ],
    bass: 'hit', gtr: 'hit', drums: 'fanfare', fill: 'fill',
    chart: { easy: C(['x.......'], DU), normal: C(['x.......'], DU), hard: C(['x...x...'], DU) } },

  // ---- イントロ：バンドが入ってリフ ----
  { name: 'イントロ2', chords: 'Am F G E', crash: true, level: 0.9,
    brass: [
      'A5:1 G5:.5 E5:.5 r:.5 E5:.5 D5:.5 E5:.5',
      'C5:1 A4:.5 C5:.5 r:.5 D5:1 C5:.5',
      'B4:1 G4:.5 B4:.5 r:.5 D5:.5 E5:.5 F5:.5',
      'E5:2 r:1 G#4:.5 B4:.5',
    ],
    bass: 'eighths', gtr: 'drive', drums: 'rock', fill: 'fill',
    chart: { easy: C(['x.......'], DU), normal: C(['x.......'], DU), hard: C(['x...x...'], DU) } },

  // ---- Aメロ：刻みギターで低めに ----
  { name: 'Aメロ', chords: 'Am F G Am  Am F G E  Am F G Am  Dm Em F E', crash: true, level: 0.65,
    lead: [
      'r:1 E4:.5 A4:.5 A4:.5 B4:.5 C5:1',
      'C5:.5 B4:.5 A4:1 r:.5 A4:.5 C5:1',
      'B4:1.5 A4:.5 G4:1 B4:1',
      'A4:3 r:1',
      'r:1 E4:.5 A4:.5 A4:.5 B4:.5 C5:1',
      'D5:.5 C5:.5 A4:1 r:.5 C5:.5 D5:1',
      'D5:1.5 C5:.5 B4:1 D5:1',
      'E5:2 D5:1 B4:1',
      'r:1 E5:.5 E5:.5 D5:.5 C5:.5 B4:.5 C5:.5',
      'A4:2 r:.5 A4:.5 C5:.5 F5:.5',
      'E5:1 D5:1 B4:1 G4:1',
      'A4:2 r:2',
      'F4:.5 A4:.5 D5:1 D5:.5 E5:.5 F5:1',
      'E5:.5 D5:.5 B4:1 G4:1 B4:1',
      'C5:1 A4:1 C5:1 F5:1',
      'E5:2 G#4:1 B4:1',
    ],
    bass: 'eighths', gtr: 'chug', drums: 'rockLight', fill: 'fill',
    chart: { easy: C('lead/2', DU), normal: C('lead/1', DU), hard: C('lead', DU) } },   // メロディに沿う

  // ---- Bメロ：4つ打ちで盛り上げる ----
  { name: 'Bメロ', chords: 'F G Em Am  Dm Em F G', crash: true, level: 0.8,
    lead: [
      'A4:1 C5:1 F5:1.5 E5:.5',
      'D5:1 B4:1 G5:1.5 F5:.5',
      'E5:1 B4:1 G5:1 E5:1',
      'A5:2 E5:1 C5:1',
      'F5:1 E5:.5 D5:.5 A4:1 D5:1',
      'G5:1 F5:.5 E5:.5 B4:1 E5:1',
      'A5:1 G5:1 F5:1 E5:1',
      'D5:.5 D5:.5 E5:.5 F5:.5 G5:2',
    ],
    bass: 'eighths', gtr: 'sustain', pad: true, drums: 'four', fill: 'roll',
    chart: { easy: C(['x...x...'], DU), normal: C(['x.x.x.x.'], DU), hard: C(['x.x.x.xx'], DU) } },

  // ---- サビ：王道進行で全開 ----
  { name: 'サビ', chords: 'F G Em Am  F G Am Am  F G Em Am  Dm E Am Am', crash: true, crashEvery: 4, sideUnlock: true,
    lead: [
      'A5:1.5 G5:.5 F5:1 E5:1',
      'D5:1.5 E5:.5 G5:2',
      'G5:1 E5:.5 B4:.5 E5:1 G5:1',
      'A5:2 r:.5 C5:.5 D5:.5 E5:.5',
      'F5:1.5 E5:.5 F5:1 A5:1',
      'G5:1.5 F5:.5 D5:1 B4:1',
      'C5:1 D5:1 E5:1 A5:1',
      'A5:3 r:1',
      'A5:1.5 G5:.5 F5:1 E5:1',
      'D5:1 E5:1 G5:1 A5:1',
      'B5:1.5 A5:.5 G5:1 E5:1',
      'A5:2 E5:1 C5:1',
      'D5:1 F5:1 A5:1.5 G5:.5',
      'G#5:1.5 F5:.5 E5:1 D5:1',
      'C5:1 B4:.5 C5:.5 E5:1 A5:1',
      'A5:4',
    ],
    brassStabs: true, bass: 'octave', gtr: 'drive', pad: true, drums: 'heavy', fill: 'fill',
    chart: { easy: C(['x...x...'], DURL), normal: C('lead', 'contour'), hard: C('lead+beats', 'contour') } },

  // ---- アウトロ ----
  { name: 'アウトロ', chords: 'F G Am', crash: true,
    brass: [
      'A5:1.5 G5:.5 F5:1 A5:1',
      'G5:1.5 F5:.5 D5:1 B4:1',
      'A4:.5 C5:.5 E5:.5 A5:.5 r:.5 A5:.5 r:.5 A5:.5',
    ],
    bass: 'octave', gtr: 'drive', pad: true, drums: 'heavy', fill: 'fill',
    chart: {
      easy: C(['x...x...'], DURL),
      normal: C(['x...x...', 'x...x...', 'x.x.x.x.'], ['down', 'up', 'down', 'up', 'right', 'left', 'right', 'left']),
      hard: C(['x.x.x.x.', 'x.x.x.x.', 'x.x.xxxx'], DURL),
    } },

  // ---- 最後のジャン！ ----
  { name: 'ラスト', chords: 'Am',
    brass: ['A5:1 r:3'],
    bass: 'final', gtr: 'final', pad: true, drums: 'end',
    chart: { easy: C(['x.......'], ['down']), normal: C(['x.......'], ['down']), hard: C(['x.......'], ['down']) } },
];

/* ---------------------------------------------------------------------
 * タイトル画面のループ曲とリザルトのジングル（書き方は SECTIONS と同じ）
 * ------------------------------------------------------------------- */
const TITLE_LOOP = [
  { name: 'タイトル', chords: 'F G Em Am  F G Am Am', level: 0.7,
    lead: [
      'A5:1.5 G5:.5 F5:1 E5:1',
      'D5:1.5 E5:.5 G5:2',
      'G5:1 E5:.5 B4:.5 E5:1 G5:1',
      'A5:2 r:.5 C5:.5 D5:.5 E5:.5',
      'F5:1.5 E5:.5 F5:1 A5:1',
      'G5:1.5 F5:.5 D5:1 B4:1',
      'C5:1 D5:1 E5:1 A5:1',
      'A5:3 r:1',
    ],
    bass: 'eighths', gtr: 'sustain', pad: true, drums: 'four' },
];

const JINGLES = {
  // 完走：上がっていくファンファーレ → ジャン！
  clear: [
    { name: 'クリア', chords: 'G C', crash: true,
      brass: ['G4:.5 B4:.5 D5:.5 G5:.5 F5:.5 D5:.5 B4:.5 D5:.5', 'C5:.5 E5:.5 G5:.5 C6:2.5'],
      bass: 'hit', gtr: 'hit', pad: true, drums: 'rock', fill: 'end' },
  ],
  // ダウン：下がっていく「チャン…チャン…」
  over: [
    { name: 'ダウン', chords: 'Dm Am', level: 0.8,
      brass: ['A4:1 G#4:1 G4:1 F#4:1', 'F4:3 r:1'],
      bass: 'hit', drums: 'none' },
  ],
};

/* 伴奏の型 */
const DRUMS = {                       // 16分音符×16。x=強, o=弱
  count:   { stick: 'x...x...x...x...' },
  fanfare: { kick: 'x...............', crash: 'x...............', tomH: '............x...', tomL: '..............x.' },
  rock:    { kick: 'x.......x.x.....', snare: '....x.......x...', hatC: 'x.o.x.o.x.o.x.o.' },
  rockLight: { kick: 'x.......x.......', snare: '....x.......x...', hatC: 'o.o.o.o.o.o.o.o.' },
  four:    { kick: 'x...x...x...x...', snare: '....x.......x...', hatC: 'o...o...o...o...', hatO: '..o...o...o...o.' },
  heavy:   { kick: 'x..x....x.x.....', snare: '....x.......x...', ride: 'x.o.x.o.x.o.x.o.' },
  // 区間の最終小節を差し替えるフィル
  fill:    { kick: 'x.......x.......', snare: '....x...x.o.x...', tomH: '............x.x.', tomL: '.............x.x' },
  roll:    { kick: 'x...x...x...x...', roll: 'xxxxxxxxxxxxxxxx' },
  end:     { kick: 'x...............', snare: 'x...............', crash: 'x...............' },
  none:    {},
};

/* ---------------------------------------------------------------------
 * 楽譜 → ノート列
 * ------------------------------------------------------------------- */
const PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

function midiOf(name) {
  const m = /^([A-G])([#b]?)(-?\d)$/.exec(name);
  if (!m) throw new Error('音名が読めない: ' + name);
  return (Number(m[3]) + 1) * 12 + PC[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0);
}

function parseChord(name) {
  if (name === '-') return null;
  const m = /^([A-G])([#b]?)(m?)(7?)$/.exec(name);
  if (!m) throw new Error('コードが読めない: ' + name);
  const pc = (PC[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + 12) % 12;
  const tones = [0, m[3] ? 3 : 4, 7];
  if (m[4]) tones.push(10);
  const low = 40 + ((pc - 4 + 12) % 12);                       // E2〜D#3 のルート
  const pad = tones.map((t) => { let n = 60 + ((pc + t) % 12); if (n > 67) n -= 12; return n; });
  return { name, pc, low, pad };
}

// 1小節ぶんのメロディ。拍数の合計が4でなければエラー（作曲ミスの検出）
function parseBar(str, where) {
  const notes = [];
  let beat = 0;
  for (const tok of str.trim().split(/\s+/)) {
    const [n, d] = tok.split(':');
    const dur = Number(d);
    if (!(dur > 0)) throw new Error(`${where}: 拍数が読めない "${tok}"`);
    if (n !== 'r') notes.push({ beat, dur, midi: midiOf(n) });
    beat += dur;
  }
  if (Math.abs(beat - BEATS_PER_BAR) > 1e-6) throw new Error(`${where}: ${beat}拍になっている（${BEATS_PER_BAR}拍のはず）`);
  return notes;
}

function buildParts(sections = SECTIONS) {
  const P = { lead: [], brass: [], gtr: [], bass: [], pad: [], drums: [], sections: [] };
  let bar0 = 0;
  for (const s of sections) {
    const chords = s.chords.trim().split(/\s+/).map(parseChord);
    const nBars = chords.length;
    P.sections.push({ name: s.name, startBeat: bar0 * BEATS_PER_BAR, bars: nBars, sideUnlock: !!s.sideUnlock });
    for (const [key, lines] of [['lead', s.lead], ['brass', s.brass]]) {
      if (!lines) continue;
      if (lines.length !== nBars) throw new Error(`${s.name}: ${key} が ${lines.length} 小節（コードは ${nBars} 小節）`);
      lines.forEach((line, i) => {
        for (const n of parseBar(line, `${s.name} ${key} ${i + 1}小節目`)) {
          P[key].push({ t: (bar0 + i) * BEATS_PER_BAR + n.beat, dur: n.dur, midi: n.midi, vel: 1, section: s.name });
        }
      });
    }
    chords.forEach((c, i) => {
      const b = (bar0 + i) * BEATS_PER_BAR;
      const last = i === nBars - 1;
      if (c) {
        // ベース
        const R = c.low;
        if (s.bass === 'hit') P.bass.push({ t: b, dur: 3.5, midi: R, vel: 1 });
        if (s.bass === 'final') P.bass.push({ t: b, dur: 2.5, midi: R, vel: 1 });
        if (s.bass === 'eighths' || s.bass === 'octave') {
          for (let k = 0; k < 8; k++) {
            const up = s.bass === 'octave' && k % 2 === 1;
            P.bass.push({ t: b + k / 2, dur: 0.45, midi: R + (up ? 12 : 0), vel: k % 2 ? 0.8 : 1 });
          }
        }
        // ギター（パワーコード）
        const pw = [R, R + 7, R + 12];
        if (s.gtr === 'hit') P.gtr.push({ t: b, dur: 3.8, midis: pw, vel: 1, muted: false });
        if (s.gtr === 'final') P.gtr.push({ t: b, dur: 3, midis: pw, vel: 1, muted: false });
        if (s.gtr === 'sustain') for (let k = 0; k < 2; k++) P.gtr.push({ t: b + k * 2, dur: 1.9, midis: pw, vel: 0.9, muted: false });
        if (s.gtr === 'drive') for (let k = 0; k < 8; k++) P.gtr.push({ t: b + k / 2, dur: 0.45, midis: pw, vel: k % 2 ? 0.75 : 1, muted: false });
        if (s.gtr === 'chug') for (let k = 0; k < 8; k++) P.gtr.push({ t: b + k / 2, dur: 0.3, midis: pw.slice(0, 2), vel: k % 4 === 0 ? 1 : 0.7, muted: true });
        // パッド・ブラスの合いの手
        if (s.pad) P.pad.push({ t: b, dur: s.bass === 'final' ? 3 : 4, midis: c.pad, vel: 1 });
        if (s.brassStabs) P.brass.push({ t: b, dur: 0.5, midi: c.pad[0] + 12, vel: 0.7, chord: c.pad.map((n) => n + 12) });
      }
      // ドラム
      let pat = DRUMS[s.drums];
      if (last && s.fill) pat = DRUMS[s.fill];
      const crashBar = (s.crash && i === 0) || (s.crashEvery && i % s.crashEvery === 0);
      for (const [inst, steps] of Object.entries(pat)) {
        for (let k = 0; k < 16; k++) {
          const ch = steps[k];
          if (ch === '.') continue;
          let vel = ch === 'x' ? 1 : 0.55;
          let name = inst;
          if (inst === 'roll') { name = 'snare'; vel = 0.25 + 0.75 * (k / 15); }  // だんだん強く
          P.drums.push({ t: b + k / 4, inst: name, vel });
        }
      }
      if (crashBar && !pat.crash) P.drums.push({ t: b, inst: 'crash', vel: 1 });
    });
    // 区間の強さ（level）を伴奏に反映
    const lv = s.level ?? 1;
    if (lv !== 1) {
      const from = bar0 * BEATS_PER_BAR, to = (bar0 + nBars) * BEATS_PER_BAR;
      for (const k of ['gtr', 'bass', 'pad', 'drums']) for (const n of P[k]) if (n.t >= from && n.t < to) n.vel *= lv;
    }
    bar0 += nBars;
  }
  P.totalBeats = bar0 * BEATS_PER_BAR;
  return P;
}

/* ---------------------------------------------------------------------
 * 譜面（beat 単位）
 * ------------------------------------------------------------------- */
function buildChart(difficulty = 'normal') {
  const parts = buildParts();
  const chart = [];
  SECTIONS.forEach((s, si) => {
    const spec = s.chart && (s.chart[difficulty] || s.chart.normal);
    if (!spec) return;
    const { startBeat, bars } = parts.sections[si];
    const melodyAll = parts.lead.filter((n) => n.section === s.name);
    const onsets = new Map(melodyAll.map((n) => [n.t, n]));
    let beats = [];
    const lead = typeof spec.rhythm === 'string' && /^lead(?:\/(\d+))?(\+beats)?$/.exec(spec.rhythm);
    if (lead) {
      const grid = lead[1] ? Number(lead[1]) : 0;   // この拍数の倍数にある音の頭だけ使う
      const onGrid = (t) => !grid || Math.abs(((t - startBeat) / grid) - Math.round((t - startBeat) / grid)) < 1e-6;
      const set = new Set(melodyAll.map((n) => n.t).filter(onGrid));
      if (lead[2]) for (let b = 0; b < bars * BEATS_PER_BAR; b++) set.add(startBeat + b);
      beats = [...set].sort((a, b) => a - b);
    } else {
      for (let i = 0; i < bars; i++) {
        const pat = spec.rhythm[i % spec.rhythm.length];
        for (let k = 0; k < pat.length; k++) if (pat[k] === 'x') beats.push(startBeat + i * BEATS_PER_BAR + k / 2);
      }
    }
    let side = 0;
    let prev = null;          // 直前のメロディの音（上下の判断用）
    let lastDir = 'up';
    if (spec.dirs === 'contour') {
      const before = parts.lead.filter((n) => n.t < startBeat);
      prev = before.length ? before[before.length - 1].midi : null;
    }
    beats.forEach((beat, k) => {
      let dir;
      if (spec.dirs === 'contour') {
        const note = onsets.get(beat);
        if (!note) {
          dir = lastDir === 'down' ? 'up' : 'down';     // メロディが伸びている拍：しゃがむ・立つを交互
        } else {
          const d = prev == null ? 0 : note.midi - prev;
          if (d >= 5) dir = 'right';
          else if (d <= -5) dir = 'left';
          else if (d > 0) dir = 'up';
          else if (d < 0) dir = 'down';
          else dir = side++ % 2 ? 'left' : 'right';
          prev = note.midi;
        }
      } else {
        dir = spec.dirs[k % spec.dirs.length];
      }
      lastDir = dir;
      chart.push({ beat, dir });
    });
  });
  return chart;
}

// 拍の一覧（ゲームの脈動表示用）。accent=小節頭
function beatList() {
  const total = buildParts().totalBeats;
  const list = [];
  for (let b = 0; b < total; b++) list.push({ beat: b, accent: b % BEATS_PER_BAR === 0 });
  return list;
}

/* ---------------------------------------------------------------------
 * 合成エンジン。ゲーム中（リアルタイム）と書き出し（オフライン）の両方で使う
 *   const synth = createSynth(ctx, { output, timeOffset })
 *   synth.scheduleUntil(t) … コンテキスト時刻 t までに鳴り始めるノートを作る（少し先まで先読みして呼ぶ）
 *   synth.sweep(t)         … t より前に鳴り終わったノートをミックスから外す
 * ------------------------------------------------------------------- */
function createSynth(ctx, { output = ctx.destination, timeOffset = 0, mute = [], sections = SECTIONS } = {}) {
  const P = buildParts(sections);
  for (const k of mute) P[k] = [];
  const spb = 60 / BPM;
  const sampleRate = ctx.sampleRate;
  const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);

  // ---- ミキサー ----
  const master = ctx.createGain();
  master.gain.value = MASTER_GAIN;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -14; comp.knee.value = 10; comp.ratio.value = 3;
  comp.attack.value = 0.004; comp.release.value = 0.2;
  master.connect(comp).connect(output);

  const reverb = ctx.createConvolver();
  reverb.buffer = impulse(ctx, 1.8);
  const revReturn = ctx.createGain(); revReturn.gain.value = 0.35;
  reverb.connect(revReturn).connect(master);

  function bus(vol, pan = 0, rev = 0) {
    const g = ctx.createGain(); g.gain.value = vol;
    let out = g;
    if (ctx.createStereoPanner && pan) { const p = ctx.createStereoPanner(); p.pan.value = pan; g.connect(p); out = p; }
    out.connect(master);
    if (rev) { const s = ctx.createGain(); s.gain.value = rev; out.connect(s).connect(reverb); }
    return g;
  }

  const noise = ctx.createBuffer(1, sampleRate * 2, sampleRate);
  { const d = noise.getChannelData(0); let seed = 12345; for (let i = 0; i < d.length; i++) { seed = (seed * 1103515245 + 12345) & 0x7fffffff; d[i] = seed / 0x3fffffff - 1; } }

  const osc = (type, f, t0, t1) => { const o = ctx.createOscillator(); o.type = type; o.frequency.value = f; o.start(t0); o.stop(t1); return o; };
  let noiseOff = 0;             // ノイズの読み出し位置をずらす（毎回同じ音になるよう乱数は使わない）
  const noiseSrc = (t0, t1) => { const n = ctx.createBufferSource(); n.buffer = noise; n.loop = true; noiseOff = (noiseOff + 0.377) % 1.5; n.start(t0, noiseOff); n.stop(t1); return n; };
  const filt = (type, f, q = 0.7) => { const b = ctx.createBiquadFilter(); b.type = type; b.frequency.value = f; b.Q.value = q; return b; };
  const perc = (t, peak, decay) => {            // 叩く系の減衰エンベロープ
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    return g;
  };
  const adsr = (t, dur, a, peak, sus, r) => {   // 伸ばす系のエンベロープ
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + a);
    g.gain.linearRampToValueAtTime(sus, t + Math.max(a, Math.min(dur, a + 0.15)));
    g.gain.setValueAtTime(sus, t + Math.max(dur, a));
    g.gain.linearRampToValueAtTime(0, t + Math.max(dur, a) + r);
    return g;
  };

  // ---- 予定表 ----
  // 全ノートを先に作ると、まだ鳴っていないノードまで毎ブロック処理されて非常に重い。
  // そこで少し先のぶんだけノートを作り（scheduleUntil）、
  // 鳴り終わったノートはミックスから外す（sweep。外さないと無音でも処理され続ける）
  const events = [];
  const at = (t, fn) => events.push({ t, fn });
  let live = [];
  const noteOut = (dest, end) => { const g = ctx.createGain(); g.connect(dest); live.push({ g, end }); return g; };
  const sweep = (now) => { live = live.filter((x) => (x.end < now ? (x.g.disconnect(), false) : true)); };

  // ---- ドラム ----
  const drumBus = bus(0.9, 0, 0.12);
  const DR = {
    kick(t, v) {
      const o = osc('sine', 150, t, t + 0.4);
      o.frequency.setValueAtTime(160, t);
      o.frequency.exponentialRampToValueAtTime(48, t + 0.11);
      o.connect(perc(t, 1.0 * v, 0.38)).connect(noteOut(drumBus, t + 2));
      noiseSrc(t, t + 0.02).connect(filt('highpass', 2500)).connect(perc(t, 0.25 * v, 0.015)).connect(noteOut(drumBus, t + 2));
    },
    snare(t, v) {
      noiseSrc(t, t + 0.25).connect(filt('bandpass', 1800, 0.8)).connect(perc(t, 0.75 * v, 0.17)).connect(noteOut(drumBus, t + 2));
      noiseSrc(t, t + 0.12).connect(filt('highpass', 5000)).connect(perc(t, 0.3 * v, 0.09)).connect(noteOut(drumBus, t + 2));
      const o = osc('triangle', 190, t, t + 0.12);
      o.frequency.exponentialRampToValueAtTime(150, t + 0.08);
      o.connect(perc(t, 0.5 * v, 0.09)).connect(noteOut(drumBus, t + 2));
    },
    hatC(t, v) { noiseSrc(t, t + 0.06).connect(filt('highpass', 7500)).connect(perc(t, 0.22 * v, 0.045)).connect(noteOut(drumBus, t + 2)); },
    hatO(t, v) { noiseSrc(t, t + 0.3).connect(filt('highpass', 7000)).connect(perc(t, 0.18 * v, 0.26)).connect(noteOut(drumBus, t + 2)); },
    ride(t, v) {
      noiseSrc(t, t + 0.5).connect(filt('bandpass', 6500, 1.5)).connect(perc(t, 0.2 * v, 0.45)).connect(noteOut(drumBus, t + 2));
      osc('triangle', 3300, t, t + 0.3).connect(perc(t, 0.03 * v, 0.25)).connect(noteOut(drumBus, t + 2));
    },
    crash(t, v) { noiseSrc(t, t + 1.8).connect(filt('highpass', 4200)).connect(perc(t, 0.4 * v, 1.7)).connect(noteOut(drumBus, t + 2)); },
    tomH(t, v) { tom(t, v, 200); },
    tomL(t, v) { tom(t, v, 130); },
    stick(t, v) {
      noiseSrc(t, t + 0.04).connect(filt('bandpass', 3000, 4)).connect(perc(t, 0.6 * v, 0.03)).connect(noteOut(drumBus, t + 2));
    },
  };
  function tom(t, v, f) {
    const o = osc('sine', f, t, t + 0.4);
    o.frequency.setValueAtTime(f * 1.6, t);
    o.frequency.exponentialRampToValueAtTime(f, t + 0.12);
    o.connect(perc(t, 0.7 * v, 0.35)).connect(noteOut(drumBus, t + 2));
  }
  for (const d of P.drums) at(timeOffset + d.t * spb, () => DR[d.inst](timeOffset + d.t * spb, d.vel));

  // ---- ベース ----
  const bassBus = bus(0.55);
  for (const n of P.bass) at(timeOffset + n.t * spb, () => {
    const t = timeOffset + n.t * spb, d = n.dur * spb, f = hz(n.midi);
    const lp = filt('lowpass', 1400, 1);
    lp.frequency.setValueAtTime(1600, t);
    lp.frequency.exponentialRampToValueAtTime(500, t + Math.max(0.05, d));
    const g = adsr(t, d, 0.005, 0.5 * n.vel, 0.38 * n.vel, 0.04);
    osc('sawtooth', f, t, t + d + 0.06).connect(lp).connect(g);
    osc('sine', f / 2, t, t + d + 0.06).connect(g);
    g.connect(noteOut(bassBus, t + d + 0.2));
  });

  // ---- ギター（左右に2本重ねて歪ませる） ----
  function gtrChain(pan) {
    const pre = ctx.createGain(); pre.gain.value = 3.2;
    const shaper = ctx.createWaveShaper();
    const curve = new Float32Array(2048);
    for (let i = 0; i < curve.length; i++) { const x = i / 1023.5 - 1; curve[i] = Math.tanh(x * 5) / Math.tanh(5); }
    shaper.curve = curve; shaper.oversample = '2x';
    const out = bus(0.13, pan, 0.08);
    const hp = filt('highpass', 90), lp = filt('lowpass', 5000), mid = filt('peaking', 700, 1);
    mid.gain.value = -5;
    pre.connect(shaper).connect(hp).connect(mid).connect(lp).connect(out);
    return pre;
  }
  const gtrL = gtrChain(-0.6), gtrR = gtrChain(0.6);
  for (const n of P.gtr) at(timeOffset + n.t * spb, () => {
    const t = timeOffset + n.t * spb, d = n.dur * spb;
    [[gtrL, -6, 0], [gtrR, 6, 0.008]].forEach(([dest, det, lag]) => {
      const t0 = t + lag;
      const g = n.muted ? perc(t0, 0.5 * n.vel, 0.13) : adsr(t0, d, 0.004, 0.5 * n.vel, 0.4 * n.vel, 0.06);
      const lp = filt('lowpass', n.muted ? 1100 : 3200);
      for (const m of n.midis) {
        const o = osc('sawtooth', hz(m), t0, t0 + d + 0.1);
        o.detune.value = det;
        o.connect(lp);
      }
      lp.connect(g).connect(noteOut(dest, t0 + d + 0.3));
    });
  });

  // ---- パッド（ストリングス的な厚み） ----
  const padBus = bus(0.09, 0, 0.6);
  for (const n of P.pad) at(timeOffset + n.t * spb, () => {
    const t = timeOffset + n.t * spb, d = n.dur * spb;
    const g = adsr(t, d, 0.25, 0.5 * n.vel, 0.45 * n.vel, 0.5);
    const lp = filt('lowpass', 1700);
    for (const m of n.midis) for (const det of [-12, 12]) {
      const o = osc('sawtooth', hz(m), t, t + d + 0.6);
      o.detune.value = det;
      o.connect(lp);
    }
    lp.connect(g).connect(noteOut(padBus, t + d + 0.8));
  });

  // ---- ブラス（ファンファーレと合いの手） ----
  const brassBus = bus(0.2, 0.15, 0.3);
  for (const n of P.brass) at(timeOffset + n.t * spb, () => {
    const t = timeOffset + n.t * spb, d = Math.max(0.08, n.dur * spb - 0.03);
    const notes = n.chord || [n.midi, n.midi - 12];
    const lp = filt('lowpass', 500);
    lp.frequency.setValueAtTime(500, t);
    lp.frequency.exponentialRampToValueAtTime(2800, t + 0.07);
    lp.frequency.exponentialRampToValueAtTime(1800, t + 0.3);
    const g = adsr(t, d, 0.03, 0.55 * n.vel, 0.45 * n.vel, 0.12);
    notes.forEach((m, k) => {
      for (const det of [-9, 0, 9]) {
        const o = osc('sawtooth', hz(m), t, t + d + 0.15);
        o.detune.value = det;
        const lv = ctx.createGain(); lv.gain.value = k === 0 ? 1 : 0.6;
        o.connect(lv).connect(lp);
      }
    });
    lp.connect(g).connect(noteOut(brassBus, t + d + 0.4));
  });

  // ---- リード（歌の代わりのシンセ。付点8分のディレイ付き） ----
  const leadBus = bus(0.34, 0, 0.25);   // サビの譜面はメロディに沿うので、メロディが埋もれない音量に
  const delay = ctx.createDelay(1); delay.delayTime.value = spb * 0.75;
  const fb = ctx.createGain(); fb.gain.value = 0.3;
  const wet = ctx.createGain(); wet.gain.value = 0.2;
  const dlp = filt('lowpass', 3000);
  leadBus.connect(delay); delay.connect(dlp).connect(fb).connect(delay); dlp.connect(wet).connect(master);
  for (const n of P.lead) at(timeOffset + n.t * spb, () => {
    const t = timeOffset + n.t * spb, d = Math.max(0.08, n.dur * spb - (n.dur >= 1 ? 0.02 : 0.04));
    const f = hz(n.midi);
    const g = adsr(t, d, 0.006, 0.95, 0.42, 0.07);   // 頭をはっきり立てて、音の出だしが聞き取れるように
    const lp = filt('lowpass', 4200);
    const vib = osc('sine', 5.5, t, t + d + 0.1);
    const depth = ctx.createGain();
    depth.gain.setValueAtTime(0, t);
    depth.gain.linearRampToValueAtTime(0, t + 0.15);
    depth.gain.linearRampToValueAtTime(d > 0.3 ? 14 : 0, t + Math.max(0.16, d));
    vib.connect(depth);
    for (const [type, det] of [['square', 0], ['sawtooth', 8]]) {
      const o = osc(type, f, t, t + d + 0.1);
      o.detune.value = det;
      depth.connect(o.detune);
      o.connect(lp);
    }
    lp.connect(g).connect(noteOut(leadBus, t + d + 0.3));
  });

  events.sort((x, y) => x.t - y.t);
  let ei = 0;
  return {
    duration: P.totalBeats * spb,
    // skipBefore より前に始まるはずだったノートは作らない（処理が詰まったときにまとめて鳴らさない）
    scheduleUntil(tEnd, skipBefore = -Infinity) {
      while (ei < events.length && events[ei].t < tEnd) { const e = events[ei++]; if (e.t >= skipBefore) e.fn(); }
    },
    sweep,
    done: () => ei >= events.length,
  };
}

// 曲全体を1本の音声にする（書き出し・試聴用）。1秒ごとに止めながら先読みぶんだけノートを作る
async function renderAudio({ sampleRate = 44100, tailSec = 2.5, chunk = 1.0, mute = [], normalize = true } = {}) {
  const OAC = self.OfflineAudioContext || self.webkitOfflineAudioContext;
  const len = Math.ceil(((buildParts().totalBeats * 60) / BPM + tailSec) * sampleRate);
  const ctx = new OAC(2, len, sampleRate);
  const synth = createSynth(ctx, { mute });
  if (typeof ctx.suspend === 'function') {
    synth.scheduleUntil(chunk + 0.05);
    for (let k = 1; k * chunk < len / sampleRate; k++) {
      ctx.suspend(k * chunk).then(() => { synth.sweep(k * chunk); synth.scheduleUntil((k + 1) * chunk + 0.05); ctx.resume(); });
    }
  } else {
    synth.scheduleUntil(Infinity);   // 古いブラウザ：一括（重いが動く）
  }
  const buf = await new Promise((resolve, reject) => {
    ctx.oncomplete = (e) => resolve(e.renderedBuffer);
    const p = ctx.startRendering();
    if (p && p.then) p.then(resolve, reject);
  });
  let peak = 0;
  for (let c = 0; c < buf.numberOfChannels; c++) {
    const d = buf.getChannelData(c);
    for (let i = 0; i < d.length; i++) { const a = Math.abs(d[i]); if (a > peak) peak = a; }
  }
  buf.peak = peak;
  if (normalize && peak > 0) {   // ピークを -1dB にそろえる
    const k = 0.89 / peak;
    for (let c = 0; c < buf.numberOfChannels; c++) { const d = buf.getChannelData(c); for (let i = 0; i < d.length; i++) d[i] *= k; }
  }
  return buf;
}

// AudioBuffer → 16bit WAV（ArrayBuffer）
function toWav(buf) {
  const ch = buf.numberOfChannels, n = buf.length, sr = buf.sampleRate;
  const out = new DataView(new ArrayBuffer(44 + n * ch * 2));
  const str = (o, t) => { for (let i = 0; i < t.length; i++) out.setUint8(o + i, t.charCodeAt(i)); };
  str(0, 'RIFF'); out.setUint32(4, 36 + n * ch * 2, true); str(8, 'WAVE');
  str(12, 'fmt '); out.setUint32(16, 16, true); out.setUint16(20, 1, true); out.setUint16(22, ch, true);
  out.setUint32(24, sr, true); out.setUint32(28, sr * ch * 2, true); out.setUint16(32, ch * 2, true); out.setUint16(34, 16, true);
  str(36, 'data'); out.setUint32(40, n * ch * 2, true);
  const data = [...Array(ch)].map((_, c) => buf.getChannelData(c));
  let o = 44;
  for (let i = 0; i < n; i++) for (let c = 0; c < ch; c++) { const v = Math.max(-1, Math.min(1, data[c][i])); out.setInt16(o, v < 0 ? v * 0x8000 : v * 0x7fff, true); o += 2; }
  return out.buffer;
}

/* ---------------------------------------------------------------------
 * MIDI 書き出し（GarageBand などで開ける Format 1）
 * ------------------------------------------------------------------- */
const GM_DRUM = { kick: 36, stick: 37, snare: 38, hatC: 42, tomL: 45, hatO: 46, crash: 49, tomH: 50, ride: 51 };

function toMidi() {
  const P = buildParts();
  const TPQ = 480;
  const flat = (list) => list.flatMap((n) => (n.midis || n.chord || [n.midi]).map((m) => ({ t: n.t, dur: n.dur, midi: m, vel: n.vel })));
  const tracks = [
    { name: 'Lead', ch: 0, program: 80, notes: flat(P.lead) },
    { name: 'Brass', ch: 1, program: 61, notes: flat(P.brass.map((n) => (n.chord ? n : { ...n, midis: [n.midi, n.midi - 12] }))) },
    { name: 'Guitar', ch: 2, program: 30, notes: flat(P.gtr) },
    { name: 'Bass', ch: 3, program: 34, notes: flat(P.bass) },
    { name: 'Strings', ch: 4, program: 48, notes: flat(P.pad) },
    { name: 'Drums', ch: 9, program: null, notes: P.drums.map((d) => ({ t: d.t, dur: 0.1, midi: GM_DRUM[d.inst], vel: d.vel })) },
  ];
  const bytes = [];
  const u32 = (v) => [(v >>> 24) & 255, (v >>> 16) & 255, (v >>> 8) & 255, v & 255];
  const vlq = (v) => { const out = [v & 127]; while ((v >>= 7)) out.unshift((v & 127) | 128); return out; };
  const text = (str) => Array.from(new TextEncoder().encode(str));
  const chunk = (id, data) => [...text(id), ...u32(data.length), ...data];
  const track = (events) => {       // events: [{tick, data:[...]}]
    events.sort((a, b) => a.tick - b.tick || a.order - b.order);
    const data = [];
    let last = 0;
    for (const e of events) { data.push(...vlq(e.tick - last), ...e.data); last = e.tick; }
    data.push(0, 0xff, 0x2f, 0);
    return chunk('MTrk', data);
  };
  bytes.push(...chunk('MThd', [0, 1, 0, tracks.length + 1, TPQ >> 8, TPQ & 255]));
  const us = Math.round(60000000 / BPM);
  bytes.push(...track([
    { tick: 0, order: 0, data: [0xff, 0x51, 3, (us >> 16) & 255, (us >> 8) & 255, us & 255] },
    { tick: 0, order: 0, data: [0xff, 0x58, 4, BEATS_PER_BAR, 2, 24, 8] },
    ...P.sections.map((s) => ({ tick: s.startBeat * TPQ, order: 0, data: [0xff, 0x06, ...vlq(text(s.name).length), ...text(s.name)] })),
  ]));
  for (const tr of tracks) {
    const ev = [{ tick: 0, order: 0, data: [0xff, 0x03, ...vlq(text(tr.name).length), ...text(tr.name)] }];
    if (tr.program != null) ev.push({ tick: 0, order: 0, data: [0xc0 | tr.ch, tr.program] });
    for (const n of tr.notes) {
      const on = Math.round(n.t * TPQ), off = Math.max(on + 1, Math.round((n.t + n.dur) * TPQ) - 1);
      const vel = Math.max(1, Math.min(127, Math.round(30 + 97 * n.vel)));
      ev.push({ tick: on, order: 2, data: [0x90 | tr.ch, n.midi, vel] });
      ev.push({ tick: off, order: 1, data: [0x80 | tr.ch, n.midi, 0] });
    }
    bytes.push(...track(ev));
  }
  return new Uint8Array(bytes);
}

function impulse(ctx, sec) {
  const len = Math.floor(ctx.sampleRate * sec);
  const b = ctx.createBuffer(2, len, ctx.sampleRate);
  let seed = 777;
  for (let c = 0; c < 2; c++) {
    const d = b.getChannelData(c);
    for (let i = 0; i < len; i++) {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      d[i] = (seed / 0x3fffffff - 1) * Math.pow(1 - i / len, 3);
    }
  }
  return b;
}

return { BPM, BEATS_PER_BAR, DIFFICULTIES, SECTIONS, TITLE_LOOP, JINGLES, DRUMS, midiOf, buildParts, buildChart, beatList, createSynth, renderAudio, toWav, toMidi };
});
