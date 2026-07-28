import React from 'react';

// ── Dot grid generator ────────────────────────────────────────────────────────
// Takes continent row definitions [{y, x0, x1}] and returns [cx, cy][] arrays.
// Every `step` pixels horizontally, a dot is placed.
type Row = { y: number; x0: number; x1: number };

function dots(rows: Row[], step = 9): [number, number][] {
  const out: [number, number][] = [];
  for (const { y, x0, x1 } of rows) {
    for (let x = x0; x <= x1; x += step) out.push([x, y]);
  }
  return out;
}

// ── Continent row data ────────────────────────────────────────────────────────
// All coordinates in the 960×960 SVG space.
// Globe centre: (480, 480)  Radius: 378
// y increases downward; x increases east.
// Rows are spaced 9px apart (matching the horizontal dot step).

// ─── North America ───
const NA = dots([
  { y: 270, x0: 306, x1: 360 }, // Alaska
  { y: 279, x0: 308, x1: 354 },
  { y: 288, x0: 330, x1: 414 }, // main body begins
  { y: 297, x0: 328, x1: 418 },
  { y: 306, x0: 328, x1: 418 },
  { y: 315, x0: 330, x1: 416 },
  { y: 324, x0: 332, x1: 412 },
  { y: 333, x0: 334, x1: 408 },
  { y: 342, x0: 336, x1: 402 },
  { y: 351, x0: 338, x1: 398 },
  { y: 360, x0: 340, x1: 394 },
  { y: 369, x0: 342, x1: 390 },
  { y: 378, x0: 346, x1: 386 },
  { y: 387, x0: 350, x1: 382 },
  { y: 396, x0: 354, x1: 378 },
  { y: 405, x0: 358, x1: 376 },
  { y: 414, x0: 362, x1: 376 }, // Mexico
  { y: 423, x0: 364, x1: 380 }, // Gulf / Yucatan
  { y: 432, x0: 374, x1: 396 }, // Caribbean
]);

// ─── South America ───
const SA = dots([
  { y: 423, x0: 366, x1: 402 },
  { y: 432, x0: 364, x1: 410 },
  { y: 441, x0: 364, x1: 412 },
  { y: 450, x0: 366, x1: 414 },
  { y: 459, x0: 368, x1: 416 },
  { y: 468, x0: 370, x1: 414 },
  { y: 477, x0: 372, x1: 412 },
  { y: 486, x0: 374, x1: 408 },
  { y: 495, x0: 376, x1: 404 },
  { y: 504, x0: 378, x1: 400 },
  { y: 513, x0: 378, x1: 396 },
  { y: 522, x0: 380, x1: 392 },
  { y: 531, x0: 380, x1: 390 },
  { y: 540, x0: 382, x1: 388 },
  { y: 549, x0: 382, x1: 388 },
  { y: 558, x0: 384, x1: 386 },
]);

// ─── Europe (mainland + Scandinavia + UK + Iberian) ───
const EU = dots([
  { y: 246, x0: 524, x1: 548 }, // Scandinavia tip
  { y: 255, x0: 516, x1: 556 },
  { y: 264, x0: 492, x1: 558 }, // + British Isles
  { y: 273, x0: 490, x1: 566 },
  { y: 282, x0: 494, x1: 576 },
  { y: 291, x0: 496, x1: 578 },
  { y: 300, x0: 498, x1: 576 },
  { y: 309, x0: 496, x1: 572 },
  { y: 318, x0: 494, x1: 562 },
  { y: 327, x0: 490, x1: 554 }, // Iberian Peninsula starts
  { y: 336, x0: 490, x1: 546 },
  { y: 345, x0: 492, x1: 538 },
  { y: 354, x0: 494, x1: 530 },
  { y: 363, x0: 498, x1: 514 }, // SE Europe / Greece
]);

// ─── Africa ───
const AF = dots([
  { y: 342, x0: 510, x1: 568 },
  { y: 351, x0: 508, x1: 580 },
  { y: 360, x0: 508, x1: 584 },
  { y: 369, x0: 508, x1: 584 },
  { y: 378, x0: 510, x1: 582 },
  { y: 387, x0: 512, x1: 580 },
  { y: 396, x0: 514, x1: 578 },
  { y: 405, x0: 516, x1: 574 },
  { y: 414, x0: 516, x1: 570 },
  { y: 423, x0: 518, x1: 566 },
  { y: 432, x0: 520, x1: 560 },
  { y: 441, x0: 522, x1: 556 },
  { y: 450, x0: 524, x1: 550 },
  { y: 459, x0: 526, x1: 548 },
  { y: 468, x0: 526, x1: 544 },
  { y: 477, x0: 528, x1: 542 },
  { y: 486, x0: 530, x1: 540 },
  { y: 495, x0: 530, x1: 538 },
  { y: 504, x0: 531, x1: 537 }, // Cape tip
]);

// ─── Asia (Siberia + Central + Middle East + India + East + SE Asia) ───
const AS = dots([
  // Russia / Siberia
  { y: 264, x0: 648, x1: 728 },
  { y: 273, x0: 646, x1: 736 },
  { y: 282, x0: 642, x1: 742 },
  { y: 291, x0: 636, x1: 746 },
  // Central / East Asia bulk
  { y: 300, x0: 616, x1: 750 },
  { y: 309, x0: 612, x1: 752 },
  { y: 318, x0: 610, x1: 752 },
  // Middle East joins at these rows
  { y: 327, x0: 574, x1: 750 },
  { y: 336, x0: 572, x1: 746 },
  { y: 345, x0: 576, x1: 742 },
  // India / SE Asia region
  { y: 354, x0: 580, x1: 738 },
  { y: 363, x0: 584, x1: 732 },
  { y: 372, x0: 588, x1: 726 },
  { y: 381, x0: 614, x1: 720 }, // India fully (gulf gap simplified)
  { y: 390, x0: 618, x1: 714 },
  { y: 399, x0: 622, x1: 706 },
  { y: 408, x0: 626, x1: 698 },
  { y: 417, x0: 630, x1: 688 }, // India tip + SE Asia
  { y: 426, x0: 632, x1: 678 },
  { y: 435, x0: 634, x1: 666 },
  { y: 444, x0: 636, x1: 654 }, // southernmost India
]);

// ─── Australia + New Zealand ───
const AU = dots([
  { y: 495, x0: 656, x1: 720 },
  { y: 504, x0: 654, x1: 730 },
  { y: 513, x0: 654, x1: 736 },
  { y: 522, x0: 656, x1: 736 },
  { y: 531, x0: 658, x1: 732 },
  { y: 540, x0: 660, x1: 726 },
  { y: 549, x0: 662, x1: 720 },
  { y: 558, x0: 664, x1: 714 },
  { y: 567, x0: 668, x1: 706 },
  { y: 576, x0: 670, x1: 698 },
  { y: 585, x0: 670, x1: 690 },
  // New Zealand
  { y: 549, x0: 730, x1: 742 },
  { y: 558, x0: 728, x1: 742 },
  { y: 567, x0: 730, x1: 740 },
]);

// ─── Greenland ───
const GL = dots([
  { y: 234, x0: 396, x1: 444 },
  { y: 243, x0: 392, x1: 452 },
  { y: 252, x0: 392, x1: 456 },
  { y: 261, x0: 394, x1: 452 },
  { y: 270, x0: 398, x1: 444 },
  { y: 279, x0: 400, x1: 434 },
  { y: 288, x0: 404, x1: 424 },
]);

// ── Component ─────────────────────────────────────────────────────────────────
const DigitalGlobe: React.FC = () => (
  <>
    <style>{`
      /* ── Wrapper ── */
      .dg-wrap {
        position: absolute;
        top: 50%;
        right: -8%;
        transform: translateY(-50%);
        width:  clamp(500px, 62vw, 900px);
        height: clamp(500px, 62vw, 900px);
        pointer-events: none;
        z-index: 2;
        opacity: 0.92;
      }

      @media (max-width: 1023px) and (min-width: 640px) {
        .dg-wrap {
          width:  clamp(340px, 52vw, 600px);
          height: clamp(340px, 52vw, 600px);
          right: -16%;
          opacity: 0.60;
        }
      }
      @media (max-width: 639px) {
        .dg-wrap { display: none; }
      }

      /* ── Globe rotation ── */
      @keyframes dg-spin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }
      /* ── Node pulse ── */
      @keyframes dg-pulse {
        0%, 100% { r: 5;   opacity: 1;    }
        50%       { r: 9.5; opacity: 0.25; }
      }
      /* ── Travelling spark ── */
      @keyframes dg-spark {
        0%   { stroke-dashoffset:    0; opacity: 0; }
        8%   {                          opacity: 1; }
        92%  {                          opacity: 1; }
        100% { stroke-dashoffset: -280; opacity: 0; }
      }
      /* ── SVG fade-in (opacity only) ── */
      @keyframes dg-fadein {
        from { opacity: 0; }
        to   { opacity: 1; }
      }

      .dg-svg { animation: dg-fadein 1.8s ease both;
                width: 100%; height: 100%; overflow: visible; }

      /* Globe internals spin — 80 s full cycle */
      .dg-globe { transform-origin: 480px 480px;
                  animation: dg-spin 80s linear infinite; }

      /* Node pulses — staggered */
      .np1 { animation: dg-pulse 4.0s ease-in-out infinite;       }
      .np2 { animation: dg-pulse 5.2s ease-in-out infinite 1.4s;  }
      .np3 { animation: dg-pulse 3.8s ease-in-out infinite 2.8s;  }
      .np4 { animation: dg-pulse 6.0s ease-in-out infinite 0.7s;  }
      .np5 { animation: dg-pulse 4.6s ease-in-out infinite 3.5s;  }

      /* Travelling sparks */
      .sp1 { animation: dg-spark  7.0s ease-in-out infinite;      }
      .sp2 { animation: dg-spark  8.5s ease-in-out infinite 2.2s; }
      .sp3 { animation: dg-spark  9.0s ease-in-out infinite 4.5s; }
      .sp4 { animation: dg-spark  6.5s ease-in-out infinite 1.1s; }
    `}</style>

    <div className="dg-wrap" aria-hidden="true">
      {/*
       * SVG viewBox 960×960 — Globe centre (480,480), radius 378.
       *
       * Visible portion (with right:-8%, width≈62vw on 1440px viewport):
       *   Element left edge  ≈ 46% of viewport
       *   Globe centre       ≈ 77% of viewport
       *   ~85% of globe visible (right 15% cropped by overflow:hidden)
       *
       * The globe contains ONLY:
       *   - Thin boundary circle
       *   - Dense dotted continent fills (no lat/long grid)
       *   - 5 network hub nodes + 4 faint connection arcs
       *   - Ambient glow + specular highlight for depth
       */}
      <svg
        className="dg-svg"
        viewBox="0 0 960 960"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Brand gradient indigo→blue→violet */}
          <linearGradient id="dg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>

          {/* Ambient halo glow */}
          <radialGradient id="dg-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.20" />
            <stop offset="58%" stopColor="#7c3aed" stopOpacity="0.07" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
          </radialGradient>

          {/* Edge depth — darkens the rim for spherical feel */}
          <radialGradient id="dg-edge" cx="50%" cy="50%" r="50%">
            <stop offset="68%" stopColor="transparent" />
            <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.18" />
          </radialGradient>

          {/* Specular highlight — simulates light on left-top */}
          <radialGradient id="dg-spec" cx="34%" cy="33%" r="28%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>

          {/* Clip to sphere boundary */}
          <clipPath id="dg-clip">
            <circle cx="480" cy="480" r="378" />
          </clipPath>

          {/* Node glow filter */}
          <filter id="dg-nf" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ① Ambient halo */}
        <circle cx="480" cy="480" r="455" fill="url(#dg-glow)" />

        {/* ② Sphere boundary — thin, brand gradient */}
        <circle cx="480" cy="480" r="378"
          stroke="url(#dg-grad)"
          strokeWidth="1.2"
          strokeOpacity="0.45"
          fill="none" />

        {/* ══════ ROTATING GLOBE GROUP ══════ */}
        <g className="dg-globe">

          {/* ── CONTINENT DOT FILLS (all clipped to sphere) ── */}
          <g clipPath="url(#dg-clip)">

            {/* North America — indigo/blue */}
            {NA.map(([cx, cy], i) => (
              <circle key={`na${i}`} cx={cx} cy={cy} r="2.8"
                fill="#6366f1" fillOpacity="0.82" />
            ))}

            {/* South America — slightly lighter blue */}
            {SA.map(([cx, cy], i) => (
              <circle key={`sa${i}`} cx={cx} cy={cy} r="2.8"
                fill="#818cf8" fillOpacity="0.80" />
            ))}

            {/* Europe — violet */}
            {EU.map(([cx, cy], i) => (
              <circle key={`eu${i}`} cx={cx} cy={cy} r="2.8"
                fill="#a78bfa" fillOpacity="0.82" />
            ))}

            {/* Africa — violet/blue */}
            {AF.map(([cx, cy], i) => (
              <circle key={`af${i}`} cx={cx} cy={cy} r="2.8"
                fill="#818cf8" fillOpacity="0.78" />
            ))}

            {/* Asia — indigo */}
            {AS.map(([cx, cy], i) => (
              <circle key={`as${i}`} cx={cx} cy={cy} r="2.8"
                fill="#6366f1" fillOpacity="0.80" />
            ))}

            {/* Australia — blue */}
            {AU.map(([cx, cy], i) => (
              <circle key={`au${i}`} cx={cx} cy={cy} r="2.8"
                fill="#818cf8" fillOpacity="0.76" />
            ))}

            {/* Greenland — faint blue */}
            {GL.map(([cx, cy], i) => (
              <circle key={`gl${i}`} cx={cx} cy={cy} r="2.4"
                fill="#818cf8" fillOpacity="0.55" />
            ))}

          </g>{/* end continent dots */}

          {/* ── Network connection arcs (subtle, dashed) ── */}
          <g clipPath="url(#dg-clip)">
            {/* India ↔ Europe */}
            <path d="M 644 360 Q 594 308 532 300"
              stroke="#a5b4fc" strokeWidth="0.9" strokeOpacity="0.30"
              strokeDasharray="5 8" fill="none" />
            {/* Europe ↔ N. America */}
            <path d="M 524 306 Q 476 286 392 318"
              stroke="#a5b4fc" strokeWidth="0.9" strokeOpacity="0.28"
              strokeDasharray="5 8" fill="none" />
            {/* India ↔ East Asia */}
            <path d="M 644 360 Q 672 340 704 326"
              stroke="#a5b4fc" strokeWidth="0.9" strokeOpacity="0.26"
              strokeDasharray="5 8" fill="none" />
            {/* Asia ↔ Australia */}
            <path d="M 694 362 Q 700 430 688 508"
              stroke="#a5b4fc" strokeWidth="0.8" strokeOpacity="0.22"
              strokeDasharray="4 9" fill="none" />
          </g>

          {/* ── Travelling sparks ── */}
          <path d="M 644 360 Q 594 308 532 300"
            stroke="#e0e7ff" strokeWidth="2.8" fill="none"
            strokeDasharray="20 500" className="sp1" />
          <path d="M 524 306 Q 476 286 392 318"
            stroke="#ddd6fe" strokeWidth="2.8" fill="none"
            strokeDasharray="20 500" className="sp2" />
          <path d="M 644 360 Q 672 340 704 326"
            stroke="#e0e7ff" strokeWidth="2.8" fill="none"
            strokeDasharray="20 500" className="sp3" />
          <path d="M 694 362 Q 700 430 688 508"
            stroke="#c7d2fe" strokeWidth="2.8" fill="none"
            strokeDasharray="20 500" className="sp4" />

          {/* ── Network hub nodes ── */}
          <g filter="url(#dg-nf)">
            {/* India */}
            <circle className="np1" cx="644" cy="360" r="5"
              fill="#6366f1" />
            <circle cx="644" cy="360" r="12"
              stroke="#6366f1" strokeOpacity="0.22" strokeWidth="1.1" fill="none" />

            {/* London / Europe */}
            <circle className="np2" cx="522" cy="298" r="5"
              fill="#818cf8" />
            <circle cx="522" cy="298" r="12"
              stroke="#818cf8" strokeOpacity="0.22" strokeWidth="1.1" fill="none" />

            {/* New York / N. America */}
            <circle className="np3" cx="390" cy="332" r="5"
              fill="#7c3aed" />
            <circle cx="390" cy="332" r="12"
              stroke="#7c3aed" strokeOpacity="0.22" strokeWidth="1.1" fill="none" />

            {/* Shanghai / East Asia */}
            <circle className="np4" cx="702" cy="322" r="4.5"
              fill="#818cf8" fillOpacity="0.95" />
            <circle cx="702" cy="322" r="11"
              stroke="#818cf8" strokeOpacity="0.20" strokeWidth="1.0" fill="none" />

            {/* Sydney / Australia */}
            <circle className="np5" cx="686" cy="528" r="4.5"
              fill="#6366f1" fillOpacity="0.92" />
            <circle cx="686" cy="528" r="11"
              stroke="#6366f1" strokeOpacity="0.18" strokeWidth="1.0" fill="none" />
          </g>

        </g>{/* end rotating group */}

        {/* ③ Edge depth ring — darkens rim for spherical look */}
        <circle cx="480" cy="480" r="378" fill="url(#dg-edge)" />

        {/* ④ Specular highlight — simulates top-left light source */}
        <ellipse cx="384" cy="366" rx="120" ry="78"
          fill="url(#dg-spec)"
          transform="rotate(-22 384 366)" />

      </svg>
    </div>
  </>
);

export default DigitalGlobe;