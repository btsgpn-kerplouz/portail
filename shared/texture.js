/* =====================================================================
   MOTEUR DE TEXTURES — charte « Atlas naturaliste » · btsgpn-kerplouz
   ---------------------------------------------------------------------
   Dessine, en <canvas>, le motif d'un bandeau. Même langage graphique
   partout (traits fins), mais un motif THÉMATIQUE par contexte :

     grille          → le portail / le hub (carte d'ensemble)
     scatter         → Phytoscope        (nuage d'ordination = données de relevé)
     ondes           → Habitats-Gâvres   (lignes de marée = littoral)
     relief          → Habitats-Landes   (anneaux = courbes de niveau)
     classification  → Végétations       (cladogramme = arbre phytosociologique)

   Usage (HTML) :
     <canvas class="banner-texture"
             data-texture="scatter"
             data-tint="rgba(170,235,196,.5)" aria-hidden="true"></canvas>

   La teinte (data-tint) est une couleur claire semi-transparente, lisible
   sur le bandeau foncé. S'exécute une fois au chargement + au redimension.
   ===================================================================== */
(function () {
  function build(cv) {
    var mode = cv.getAttribute('data-texture');
    var color = cv.getAttribute('data-tint') || 'rgba(255,255,255,.15)';

    function draw() {
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      var w = cv.clientWidth, h = cv.clientHeight;
      if (!w || !h) return;
      cv.width = w * dpr; cv.height = h * dpr;
      var g = cv.getContext('2d');
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, w, h);
      g.strokeStyle = color; g.fillStyle = color; g.lineWidth = 1;

      if (mode === 'grille') {                 // grille de relevé / carte
        var step = 24;
        for (var gx = step; gx < w; gx += step) { g.beginPath(); g.moveTo(gx, 0); g.lineTo(gx, h); g.stroke(); }
        for (var gy = step; gy < h; gy += step) { g.beginPath(); g.moveTo(0, gy); g.lineTo(w, gy); g.stroke(); }
      }
      else if (mode === 'ondes') {             // lignes d'eau horizontales, denses vers le bas
        var lines = 22;
        for (var i = 0; i < lines; i++) {
          var yb = (i / (lines - 1)) * h;
          g.globalAlpha = 0.30 + 0.55 * (i / (lines - 1));
          g.beginPath();
          for (var x = 0; x <= w; x += 4) {
            var y = yb + Math.sin(x * 0.021 + i * 0.5) * 4 + Math.sin(x * 0.047 + i * 0.9) * 2.2;
            x === 0 ? g.moveTo(x, y) : g.lineTo(x, y);
          }
          g.stroke();
        }
        g.globalAlpha = 1;
      }
      else if (mode === 'relief') {            // anneaux concentriques = courbes de niveau
        var centers = [{ cx: w * 0.30, cy: h * 0.58 }, { cx: w * 0.74, cy: h * 0.30 }];
        for (var c = 0; c < centers.length; c++) {
          var C = centers[c];
          for (var r = 12; r < Math.max(w, h) * 0.95; r += 15) {
            g.beginPath();
            for (var a = 0; a <= 6.29; a += 0.11) {
              var wob = Math.sin(a * 3 + c) * 4 + Math.sin(a * 5 + c * 2) * 2.4;
              var rr = r + wob;
              var px = C.cx + Math.cos(a) * rr, py = C.cy + Math.sin(a) * rr * 0.8;
              a === 0 ? g.moveTo(px, py) : g.lineTo(px, py);
            }
            g.closePath(); g.stroke();
          }
        }
      }
      else if (mode === 'scatter') {           // nuage d'ordination + axes
        g.save(); g.globalAlpha = 0.5;
        g.beginPath(); g.moveTo(30, h - 22); g.lineTo(w - 14, h - 22); g.moveTo(30, 14); g.lineTo(30, h - 22); g.stroke();
        g.restore();
        var s = 42; function rnd() { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; }
        for (var p = 0; p < 48; p++) {
          var qx = 34 + rnd() * (w - 56), qy = 16 + rnd() * (h - 46), rad = 1.6 + rnd() * 2.4;
          g.beginPath(); g.arc(qx, qy, rad, 0, 6.2832);
          rnd() > 0.5 ? g.fill() : g.stroke();
        }
      }
      else if (mode === 'classification') {    // dendrogramme CIRCULAIRE, fondu croissant vers la droite
        var cm = color.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
        var crgb = cm ? (cm[1] + ',' + cm[2] + ',' + cm[3]) : '245,212,182';
        var grad = g.createLinearGradient(0, 0, w, 0);
        grad.addColorStop(0, 'rgba(' + crgb + ',0.05)');
        grad.addColorStop(0.55, 'rgba(' + crgb + ',0.30)');
        grad.addColorStop(1, 'rgba(' + crgb + ',0.85)');
        g.strokeStyle = grad; g.fillStyle = grad; g.lineWidth = 1.4; g.lineCap = 'round';
        var cs = 11, crnd = function () { cs = (cs * 1103515245 + 12345) & 0x7fffffff; return cs / 0x7fffffff; };
        var Cx = w * 0.66, Cy = h * 2.3, cdepth = 4, rOut = h * 2.2, dstep = h * 0.21;
        var polar = function (r, a) { return [Cx + r * Math.cos(a), Cy + r * Math.sin(a)]; };
        var cseg = function (p, q) { g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]); g.stroke(); };
        var carc = function (r, a1, a2) { g.beginPath(); g.arc(Cx, Cy, r, a1, a2); g.stroke(); };
        var cdot = function (p, rr) { g.beginPath(); g.arc(p[0], p[1], rr, 0, 6.2832); g.fill(); };
        var aUp = -Math.PI / 2, span0 = 1.5, rRoot = rOut - cdepth * dstep;
        cseg(polar(rRoot - dstep, aUp), polar(rRoot, aUp));
        (function node(a, r, span, d) {
          if (d <= 0) { cdot(polar(r, a), 2.4); return; }
          var rc = r + dstep * (0.9 + crnd() * 0.2);
          var a1 = a - span * 0.5 * (0.8 + crnd() * 0.4), a2 = a + span * 0.5 * (0.8 + crnd() * 0.4);
          carc(rc, a1, a2);
          cseg(polar(r, a), polar(rc, a));
          node(a1, rc, span * 0.5, d - 1);
          node(a2, rc, span * 0.5, d - 1);
        })(aUp, rRoot, span0, cdepth);
      }
    }

    draw();
    var t;
    window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(draw, 120); });
  }

  function init() { document.querySelectorAll('canvas[data-texture]').forEach(build); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
