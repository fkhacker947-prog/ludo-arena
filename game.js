/* game.js - Step 6: dice, turns, moves, AI, win */

var SAFE = STARS.concat([0, 13, 26, 39]);
var playId = 0;
var uiReady = false;
var DICE_PAT = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };

function later(fn, ms) {
  var id = playId;
  setTimeout(function () { if (id === playId && game) fn(); }, ms);
}
function cur() { return game.players[game.turn]; }
function rollDie() { return 1 + Math.floor(Math.random() * 6); }

/* ---------- UI ---------- */
function ensureUI() {
  if (uiReady) return;
  uiReady = true;
  var st = document.createElement('style');
  st.textContent =
    '#turnBar{display:flex;align-items:center;justify-content:center;gap:16px;margin-top:10px}' +
    '#turnInfo{text-align:left;min-width:130px}' +
    '#turnName{font-weight:bold;font-size:17px}' +
    '#turnHint{font-size:12px;opacity:.85;margin-top:3px}' +
    '#dice{width:64px;height:64px;background:#fff;border-radius:12px;border:3px solid #ffd700;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,1fr);padding:7px;gap:2px}' +
    '#dice span{border-radius:50%}' +
    '#dice span.on{background:#222}' +
    '#dice.glow{box-shadow:0 0 16px 5px #ffd700}' +
    '#winBox{position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.78);display:none;flex-direction:column;align-items:center;justify-content:center;z-index:50}' +
    '#winBox.show{display:flex}' +
    '#winBox h1{font-size:32px;color:#ffd700;margin:10px 0}';
  document.head.appendChild(st);

  var bar = document.createElement('div');
  bar.id = 'turnBar';
  bar.innerHTML = '<div id="turnInfo"><div id="turnName"></div><div id="turnHint"></div></div><div id="dice"></div>';
  var strip = document.getElementById('strip');
  strip.parentNode.insertBefore(bar, strip);

  var d = document.getElementById('dice');
  for (var i = 0; i < 9; i++) d.appendChild(document.createElement('span'));
  d.addEventListener('click', onDiceTap);
  document.getElementById('cv').addEventListener('click', onCanvasClick);

  var wb = document.createElement('div');
  wb.id = 'winBox';
  wb.innerHTML = '<div style="font-size:70px">🏆</div><h1 id="winText"></h1>' +
    '<button class="gold" onclick="playAgain()">Play Again</button>' +
    '<button class="ghost" onclick="exitGame()">Home</button>';
  document.getElementById('board').appendChild(wb);
}

function setFace(n) {
  var spans = document.getElementById('dice').children;
  for (var i = 0; i < 9; i++) {
    spans[i].className = DICE_PAT[n].indexOf(i) >= 0 ? 'on' : '';
  }
}

function updateTurnUI() {
  if (!game) return;
  var pl = cur();
  var nm = document.getElementById('turnName');
  nm.textContent = pl.name + (pl.isAI ? ' 🤖' : '') + ' ki baari';
  nm.style.color = COL[pl.color];
  var hint = '';
  if (game.state === 'roll') hint = pl.isAI ? 'Computer dice phenkega...' : 'Dice dabao 👉';
  else if (game.state === 'rolling') hint = 'Dice ghoom raha hai...';
  else if (game.state === 'pick') hint = 'Sunehri ring wala token chuno';
  document.getElementById('turnHint').textContent = hint;
  document.getElementById('dice').classList.toggle('glow', game.state === 'roll' && !pl.isAI);
}

function showWin(pl) {
  document.getElementById('winText').textContent = pl.name + ' jeet gaya!';
  document.getElementById('winBox').classList.add('show');
}
function hideWin() {
  var w = document.getElementById('winBox');
  if (w) w.classList.remove('show');
}
function playAgain() {
  hideWin();
  startGame();
}

/* ---------- RULES ---------- */
function legalMoves(pl, d) {
  var res = [];
  for (var n = 0; n < 4; n++) {
    var p = pl.tokens[n];
    if (p === -1) {
      if (d === 6) res.push({ n: n, from: -1, to: 0 });
    } else if (p < 56 && p + d <= 56) {
      res.push({ n: n, from: p, to: p + d });
    }
  }
  return res;
}

function capturedAt(pl, to) {
  var res = [];
  if (to < 0 || to > 50) return res;
  var abs = (START[pl.color] + to) % 52;
  if (SAFE.indexOf(abs) >= 0) return res;
  game.players.forEach(function (o) {
    if (o === pl) return;
    o.tokens.forEach(function (p, n) {
      if (p >= 0 && p <= 50 && (START[o.color] + p) % 52 === abs) {
        res.push({ player: o, n: n });
      }
    });
  });
  return res;
}

function isWinner(pl) {
  if (game.type === 'quick') {
    return pl.tokens.some(function (p) { return p === 56; });
  }
  return pl.tokens.every(function (p) { return p === 56; });
}

function aiPick(pl, moves) {
  var best = null, bs = -1;
  moves.forEach(function (m) {
    var s = m.to;
    if (capturedAt(pl, m.to).length) s += 100;
    if (m.to === 56) s += 80;
    if (m.from === -1) s += 60;
    if (m.to > 50) s += 25;
    var abs = (START[pl.color] + m.to) % 52;
    if (m.to <= 50 && SAFE.indexOf(abs) >= 0) s += 15;
    if (s > bs) { bs = s; best = m; }
  });
  return best;
}

/* ---------- TURN FLOW ---------- */
function initPlay() {
  playId++;
  ensureUI();
  game.turn = 0;
  game.dice = 0;
  game.state = 'roll';
  game.sixes = 0;
  game.moves = null;
  var tp = document.querySelector('.row-btns button');
  if (tp) tp.style.display = 'none';
  hideWin();
  setFace(1);
  updateTurnUI();
  maybeAI();
}

function maybeAI() {
  if (game && game.state === 'roll' && cur().isAI) {
    later(doRoll, 900);
  }
}

function onDiceTap() {
  if (!game || game.state !== 'roll' || cur().isAI) return;
  doRoll();
}

function doRoll() {
  if (!game || game.state !== 'roll') return;
  game.state = 'rolling';
  updateTurnUI();
  var id = playId, frames = 0;
  var iv = setInterval(function () {
    if (id !== playId || !game) { clearInterval(iv); return; }
    setFace(rollDie());
    frames++;
    if (frames >= 10) {
      clearInterval(iv);
      var v = rollDie();
      setFace(v);
      game.dice = v;
      afterRoll(v);
    }
  }, 60);
}

function afterRoll(v) {
  var pl = cur();
  if (v === 6) game.sixes++; else game.sixes = 0;
  if (game.sixes >= 3) {
    document.getElementById('turnHint').textContent = 'Teen 6! Baari gayi';
    later(nextTurn, 1000);
    return;
  }
  var moves = legalMoves(pl, v);
  if (!moves.length) {
    document.getElementById('turnHint').textContent = 'Koi move nahi';
    later(nextTurn, 900);
    return;
  }
  var keys = {}, count = 0;
  moves.forEach(function (m) {
    var k = m.from + '>' + m.to;
    if (!keys[k]) { keys[k] = 1; count++; }
  });
  if (pl.isAI) {
    var b = aiPick(pl, moves);
    later(function () { doMove(b); }, 700);
  } else if (count === 1) {
    later(function () { doMove(moves[0]); }, 400);
  } else {
    game.moves = moves;
    game.state = 'pick';
    updateTurnUI();
    drawBoard();
  }
}

function onCanvasClick(e) {
  if (!game || game.state !== 'pick' || !game.moves) return;
  var r = cv.getBoundingClientRect();
  var gx = (e.clientX - r.left) / r.width * 15;
  var gy = (e.clientY - r.top) / r.height * 15;
  var pl = cur(), best = null, bd = 0.8;
  game.moves.forEach(function (m) {
    var xy = tokenXY(pl.color, pl.tokens[m.n], m.n);
    var dx = xy[0] - gx, dy = xy[1] - gy;
    var d = Math.sqrt(dx * dx + dy * dy);
    if (d < bd) { bd = d; best = m; }
  });
  if (best) doMove(best);
}

function doMove(m) {
  if (!game) return;
  game.state = 'anim';
  game.moves = null;
  updateTurnUI();
  var pl = cur(), n = m.n, from = pl.tokens[n], to = m.to;
  var path = [];
  if (from === -1) path = [0];
  else for (var p = from + 1; p <= to; p++) path.push(p);
  var i = 0, id = playId;
  var iv = setInterval(function () {
    if (id !== playId || !game) { clearInterval(iv); return; }
    pl.tokens[n] = path[i];
    drawBoard();
    i++;
    if (i >= path.length) {
      clearInterval(iv);
      afterMove(pl, n, to);
    }
  }, 160);
}

function afterMove(pl, n, to) {
  var caps = capturedAt(pl, to);
  caps.forEach(function (c) { c.player.tokens[c.n] = -1; });
  drawBoard();
  if (isWinner(pl)) {
    game.state = 'over';
    showWin(pl);
    return;
  }
  var extra = game.dice === 6 || caps.length > 0 || to === 56;
  later(function () {
    if (extra) {
      game.state = 'roll';
      updateTurnUI();
      maybeAI();
    } else {
      nextTurn();
    }
  }, 500);
}

function nextTurn() {
  game.sixes = 0;
  game.turn = (game.turn + 1) % game.players.length;
  game.state = 'roll';
  updateTurnUI();
  maybeAI();
}

/* ---------- DRAW EXTRAS (gold rings) ---------- */
function drawExtras() {
  if (!game || game.state !== 'pick' || !game.moves) return;
  var pl = cur();
  game.moves.forEach(function (m) {
    var t = tokenXY(pl.color, m.to, m.n);
    ctx.beginPath();
    ctx.arc(t[0] * cell, t[1] * cell, cell * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,215,0,0.45)';
    ctx.fill();
    var xy = tokenXY(pl.color, pl.tokens[m.n], m.n);
    ctx.beginPath();
    ctx.arc(xy[0] * cell, xy[1] * cell, cell * 0.47, 0, Math.PI * 2);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#ffd700';
    ctx.stroke();
  });
}

/* ---------- HOOKS into index.html ---------- */
var _drawBoardBase = drawBoard;
drawBoard = function () { _drawBoardBase(); drawExtras(); };

var _openBoardBase = openBoard;
openBoard = function () { _openBoardBase(); initPlay(); };

var _exitGameBase = exitGame;
exitGame = function () { playId++; hideWin(); _exitGameBase(); };

setupBoard = function () {
  cv = document.getElementById('cv');
  var size = Math.min(window.innerWidth - 16, window.innerHeight - 330, 560);
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
};

/* END game.js */