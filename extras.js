/* extras.js - Step 7: sound, vibration, settings, Team Up */

/* ---------- options ---------- */
var xOpt = { sound: true, vib: true };
try {
  var xs = JSON.parse(localStorage.getItem('ludoOpts'));
  if (xs) { xOpt.sound = xs.sound !== false; xOpt.vib = xs.vib !== false; }
} catch (e) {}
function xSave() {
  try { localStorage.setItem('ludoOpts', JSON.stringify(xOpt)); } catch (e) {}
}

/* ---------- sound ---------- */
var xCtx = null;
function xAc() {
  if (!xCtx) {
    try { xCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
  }
  if (xCtx && xCtx.state === 'suspended') { try { xCtx.resume(); } catch (e) {} }
  return xCtx;
}
document.addEventListener('click', function () { xAc(); });

function xBeep(freq, dur, type, vol, delay) {
  if (!xOpt.sound) return;
  var a = xAc();
  if (!a) return;
  var t = a.currentTime + (delay || 0);
  var o = a.createOscillator();
  var g = a.createGain();
  o.type = type || 'sine';
  o.frequency.value = freq;
  g.gain.setValueAtTime(vol || 0.15, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g);
  g.connect(a.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}
function xvib(p) {
  if (xOpt.vib && navigator.vibrate) { try { navigator.vibrate(p); } catch (e) {} }
}

function sndRoll() {
  for (var i = 0; i < 9; i++) xBeep(420 + Math.random() * 400, 0.04, 'square', 0.06, i * 0.06);
}
function sndMove() { xBeep(660, 0.06, 'triangle', 0.12); }
function sndSix() {
  xBeep(523, 0.1, 'sine', 0.15, 0);
  xBeep(659, 0.1, 'sine', 0.15, 0.1);
  xBeep(784, 0.18, 'sine', 0.15, 0.2);
}
function sndCapture() {
  xBeep(400, 0.15, 'sawtooth', 0.12, 0);
  xBeep(200, 0.25, 'sawtooth', 0.12, 0.12);
}
function sndHome() {
  xBeep(784, 0.12, 'sine', 0.15, 0);
  xBeep(988, 0.12, 'sine', 0.15, 0.12);
  xBeep(1175, 0.22, 'sine', 0.15, 0.24);
}
function sndWin() {
  [523, 659, 784, 1047, 784, 1047].forEach(function (f, i) {
    xBeep(f, 0.2, 'triangle', 0.18, i * 0.15);
  });
}

/* ---------- team helpers ---------- */
var X_TEAM = { blue: 0, green: 0, red: 1, yellow: 1 };
function xTeam(color) { return X_TEAM[color]; }
function xMate(pl) {
  return game.players.filter(function (o) {
    return o !== pl && xTeam(o.color) === xTeam(pl.color);
  })[0];
}
function xDone(pl) {
  return pl.tokens.every(function (t) { return t === 56; });
}

/* ---------- rule overrides (Team Up) ---------- */
var _capturedAt = capturedAt;
capturedAt = function (pl, to) {
  var r = _capturedAt(pl, to);
  if (game.type !== 'teamup') return r;
  return r.filter(function (c) { return xTeam(c.player.color) !== xTeam(pl.color); });
};

var _isWinner = isWinner;
isWinner = function (pl) {
  if (game.type !== 'teamup') return _isWinner(pl);
  var m = xMate(pl);
  return xDone(pl) && !!m && xDone(m);
};

nextTurn = function () {
  game.sixes = 0;
  var n = game.players.length;
  for (var k = 0; k < n; k++) {
    game.turn = (game.turn + 1) % n;
    if (!(game.type === 'teamup' && xDone(cur()))) break;
  }
  game.state = 'roll';
  updateTurnUI();
  maybeAI();
};

/* ---------- sound + vibration hooks ---------- */
var _doRoll = doRoll;
doRoll = function () {
  var was = game && game.state === 'roll';
  _doRoll();
  if (was) { sndRoll(); xvib(30); }
};

var _afterRoll = afterRoll;
afterRoll = function (v) {
  if (v === 6) { sndSix(); xvib([40, 40, 40]); }
  _afterRoll(v);
};

var _doMove = doMove;
doMove = function (m) {
  if (!game) return;
  var steps = m.from === -1 ? 1 : (m.to - m.from);
  for (var i = 0; i < steps; i++) setTimeout(sndMove, i * 160);
  _doMove(m);
};

var _afterMove = afterMove;
afterMove = function (pl, n, to) {
  var caps = capturedAt(pl, to);
  if (caps.length) { sndCapture(); xvib(120); }
  else if (to === 56) { sndHome(); xvib([60, 40, 60]); }
  _afterMove(pl, n, to);
};

var _showWin = showWin;
showWin = function (pl) {
  _showWin(pl);
  if (game && game.type === 'teamup') {
    var m = xMate(pl);
    document.getElementById('winText').textContent =
      'Team ' + pl.name + ' + ' + (m ? m.name : '') + ' jeet gayi!';
  }
  sndWin();
  xvib([100, 60, 100, 60, 200]);
};

/* ---------- board hooks ---------- */
var _openBoard2 = openBoard;
openBoard = function () {
  _openBoard2();
  if (game && game.type === 'teamup') {
    var chips = document.querySelectorAll('#strip .pchip');
    game.players.forEach(function (p, i) {
      if (!chips[i]) return;
      var t = document.createElement('small');
      t.textContent = ' • Team ' + (xTeam(p.color) === 0 ? 'A' : 'B');
      chips[i].appendChild(t);
    });
  }
};

var _exitGame2 = exitGame;
exitGame = function () {
  if (game && game.state && game.state !== 'over') {
    if (!confirm('Game chhod kar Home jana hai?')) return;
  }
  _exitGame2();
};

/* ---------- settings screen ---------- */
function xBuildSettings() {
  var st = document.createElement('style');
  st.textContent =
    '#xSet{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.75);display:none;align-items:center;justify-content:center;z-index:100}' +
    '#xSet.show{display:flex}' +
    '.xcard{width:86%;max-width:340px;background:#06255a;border:3px solid #ffd700;border-radius:16px;padding:18px;text-align:center;color:#fff}' +
    '.xcard h2{color:#ffd700;margin-bottom:12px}' +
    '.xrow{display:flex;align-items:center;justify-content:space-between;background:#0b3d91;border-radius:12px;padding:10px 14px;margin:8px 0;font-size:17px}' +
    '.xtog{min-width:64px;padding:8px 12px;border-radius:20px;border:2px solid #fff;font-weight:bold;font-size:15px;color:#fff;background:#546e7a}' +
    '.xtog.on{background:#43a047}';
  document.head.appendChild(st);

  var box = document.createElement('div');
  box.id = 'xSet';
  box.innerHTML =
    '<div class="xcard"><h2>⚙️ Settings</h2>' +
    '<div class="xrow"><span>🔊 Sound</span><button class="xtog" id="xSnd"></button></div>' +
    '<div class="xrow"><span>📳 Vibration</span><button class="xtog" id="xVib"></button></div>' +
    '<button class="gold" id="xClose">Close</button></div>';
  document.body.appendChild(box);

  document.getElementById('xSnd').addEventListener('click', function () {
    xOpt.sound = !xOpt.sound; xSave(); xRefresh();
    if (xOpt.sound) sndMove();
  });
  document.getElementById('xVib').addEventListener('click', function () {
    xOpt.vib = !xOpt.vib; xSave(); xRefresh();
    if (xOpt.vib) xvib(60);
  });
  document.getElementById('xClose').addEventListener('click', function () {
    box.classList.remove('show');
  });
  xRefresh();
}
function xRefresh() {
  var a = document.getElementById('xSnd');
  var b = document.getElementById('xVib');
  a.textContent = xOpt.sound ? 'ON' : 'OFF';
  a.classList.toggle('on', xOpt.sound);
  b.textContent = xOpt.vib ? 'ON' : 'OFF';
  b.classList.toggle('on', xOpt.vib);
}
function openSettings() {
  document.getElementById('xSet').classList.add('show');
}

function xAddGearButtons() {
  var tb = document.querySelector('#home .topbar');
  if (tb) {
    var lo = tb.querySelector('.logout');
    var g = document.createElement('button');
    g.className = 'logout';
    g.textContent = '⚙️';
    g.addEventListener('click', openSettings);
    tb.insertBefore(g, lo);
  }
  var rb = document.querySelector('#board .row-btns');
  if (rb) {
    var g2 = document.createElement('button');
    g2.className = 'ghost';
    g2.textContent = '⚙️ Settings';
    g2.addEventListener('click', openSettings);
    rb.insertBefore(g2, rb.lastElementChild);
  }
}

xBuildSettings();
xAddGearButtons();

/* END extras.js */