/* board8.js - Step 8: Ludo-King-style play area */

(function () {
  var PCOL = { red: '#c62828', green: '#2e7d32', blue: '#1976d2', yellow: '#f9a825' };

  /* ---------- CSS ---------- */
  var css =
    '#board{justify-content:flex-start;padding:8px 6px;' +
      'background:repeating-linear-gradient(45deg,rgba(255,255,255,.05) 0 22px,transparent 22px 44px),' +
      'repeating-linear-gradient(-45deg,rgba(0,0,0,.14) 0 22px,transparent 22px 44px),' +
      'linear-gradient(#1257c4,#08265f)}' +
    '#strip{display:none}' +
    '#boardTitle{font-size:12px;opacity:.85;margin:0 0 4px}' +
    '#bwrap{margin:0 auto}' +
    '#cvHold{line-height:0}' +
    '#cv{display:block;border-radius:6px;box-shadow:0 0 0 3px #ffd700,0 8px 22px rgba(0,0,0,.65)}' +
    '.prow{display:flex;justify-content:space-between;align-items:center;width:100%;height:70px}' +
    '.gp{display:flex;align-items:center;gap:8px;padding:5px 9px;border:3px solid #ffd700;border-radius:14px;' +
      'background:linear-gradient(90deg,var(--c),#0d3b9c);opacity:.5;transition:opacity .2s}' +
    '.gp.right{flex-direction:row-reverse;background:linear-gradient(270deg,var(--c),#0d3b9c)}' +
    '.gp.active{opacity:1;box-shadow:0 0 14px 3px #ffd700}' +
    '.gp.off{visibility:hidden}' +
    '.gpin{width:40px;height:44px;display:flex;align-items:center;justify-content:center}' +
    '.gpin .pin{width:30px;height:30px}' +
    '.gslot{width:56px;height:56px;display:flex;align-items:center;justify-content:center}' +
    '#board #dice{width:54px;height:54px;padding:6px;border-radius:12px}' +
    '.garrow{font-size:22px;color:#ff9800;visibility:hidden;width:18px;text-align:center}' +
    '.gp.active .garrow{visibility:visible;animation:gblink .7s infinite}' +
    '@keyframes gblink{50%{opacity:.25}}' +
    '#turnBar{margin-top:6px}';
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  /* ---------- DOM: wrapper + 4 panels ---------- */
  var board = document.getElementById('board');
  var cvEl = document.getElementById('cv');
  var wrap = document.createElement('div');
  wrap.id = 'bwrap';
  wrap.innerHTML = '<div class="prow" id="rowTop"></div><div id="cvHold"></div><div class="prow" id="rowBot"></div>';
  board.insertBefore(wrap, cvEl);
  document.getElementById('cvHold').appendChild(cvEl);

  function makePanel(color, right, rowId) {
    var p = document.createElement('div');
    p.className = 'gp off' + (right ? ' right' : '');
    p.id = 'gp-' + color;
    p.style.setProperty('--c', PCOL[color]);
    p.innerHTML =
      '<div class="gpin"><div class="pin ' + color + '"></div></div>' +
      '<div class="gslot" id="slot-' + color + '"></div>' +
      '<div class="garrow">' + (right ? '▶' : '◀') + '</div>';
    document.getElementById(rowId).appendChild(p);
  }
  makePanel('red', false, 'rowTop');
  makePanel('green', true, 'rowTop');
  makePanel('blue', false, 'rowBot');
  makePanel('yellow', true, 'rowBot');

  function setupPanels() {
    ['red', 'green', 'blue', 'yellow'].forEach(function (c) {
      var has = game.players.some(function (p) { return p.color === c; });
      document.getElementById('gp-' + c).classList.toggle('off', !has);
    });
  }

  /* ---------- dice follows the turn ---------- */
  function moveDice() {
    if (!game || !game.players) return;
    var c = cur().color;
    ['red', 'green', 'blue', 'yellow'].forEach(function (k) {
      document.getElementById('gp-' + k).classList.toggle('active', k === c);
    });
    var slot = document.getElementById('slot-' + c);
    var d = document.getElementById('dice');
    if (slot && d && d.parentNode !== slot) slot.appendChild(d);
  }
  var _utu = updateTurnUI;
  updateTurnUI = function () { _utu(); moveDice(); };

  /* ---------- board size ---------- */
  setupBoard = function () {
    cv = document.getElementById('cv');
    var size = Math.min(window.innerWidth - 12, window.innerHeight - 310, 620);
    size = Math.max(size, 240);
    S = size;
    var dpr = window.devicePixelRatio || 1;
    cv.style.width = size + 'px';
    cv.style.height = size + 'px';
    cv.width = Math.round(size * dpr);
    cv.height = Math.round(size * dpr);
    ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cell = size / 15;
    document.getElementById('bwrap').style.width = size + 'px';
  };

  /* ---------- pin-shaped tokens ---------- */
  var stackN = {};

  function drawPin(px, ty, color) {
    var r = cell * 0.34, d = r * 1.5, hx = px, hy = ty - d;

    // ring on the ground
    ctx.beginPath();
    ctx.ellipse(px, ty, r * 0.95, r * 0.42, 0, 0, Math.PI * 2);
    ctx.fillStyle = COL[color];
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(0,0,0,0.55)';
    ctx.stroke();

    // silver pin body
    ctx.beginPath();
    ctx.moveTo(px, ty);
    ctx.lineTo(hx + r * 0.745, hy + r * 0.667);
    ctx.arc(hx, hy, r, 0.7297, Math.PI - 0.7297, true);
    ctx.closePath();
    var g = ctx.createLinearGradient(hx - r, 0, hx + r, 0);
    g.addColorStop(0, '#ffffff');
    g.addColorStop(1, '#a9b2c0');
    ctx.fillStyle = g;
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(0,0,0,0.45)';
    ctx.stroke();

    // coloured head
    ctx.beginPath();
    ctx.arc(hx, hy, r * 0.68, 0, Math.PI * 2);
    ctx.fillStyle = COL[color];
    ctx.fill();
    ctx.beginPath();
    ctx.arc(hx - r * 0.22, hy - r * 0.25, r * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.fill();
  }

  drawToken = function (x, y, color) {
    var key = Math.round(x * 10) + ',' + Math.round(y * 10);
    var k = stackN[key] || 0;
    stackN[key] = k + 1;
    var off = (k % 2 === 0 ? 1 : -1) * Math.ceil(k / 2) * cell * 0.15;
    drawPin(x * cell + off, y * cell + cell * 0.3, color);
  };

  /* ---------- names inside homes ---------- */
  function drawNames() {
    if (!game) return;
    game.players.forEach(function (pl) {
      var o = BASE[pl.color];
      var top = (pl.color === 'red' || pl.color === 'green');
      var cx = (o[0] + 3) * cell;
      var cy = (o[1] + (top ? 0.5 : 5.5)) * cell;
      ctx.save();
      ctx.translate(cx, cy);
      if (top) ctx.rotate(Math.PI);
      ctx.font = 'bold ' + Math.round(cell * 0.5) + 'px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0,0,0,0.7)';
      ctx.shadowBlur = 3;
      ctx.fillStyle = '#fff';
      ctx.fillText(pl.name, 0, 0, cell * 4.6);
      ctx.restore();
    });
  }

  var _db8 = drawBoard;
  drawBoard = function () {
    stackN = {};
    _db8();
    drawNames();
  };

  /* ---------- open board hook ---------- */
  var _ob8 = openBoard;
  openBoard = function () {
    setupPanels();
    _ob8();
  };
})();
/* END board8.js */