/* home.js - modern 3D home screen */
(function () {
  var home = document.getElementById('home');
  if (!home) return;

  var css = '' +
  '#home{justify-content:flex-start;padding:0;overflow-y:auto;overflow-x:hidden;background:radial-gradient(circle at 50% 18%,#1f6bdc 0%,#0b2a73 50%,#050d2e 100%)}' +
  '.blob{position:absolute;border-radius:50%;opacity:.35;filter:blur(1px);animation:hfloat 9s ease-in-out infinite;pointer-events:none}' +
  '@keyframes hfloat{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-40px) scale(1.15)}}' +
  '.hwrap{position:relative;z-index:2;width:100%;max-width:420px;margin:0 auto;padding:14px 16px 24px;display:flex;flex-direction:column;align-items:center}' +
  '.htop{width:100%;display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:20px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.28);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);box-shadow:0 6px 20px rgba(0,0,0,.35)}' +
  '.havatar{width:46px;height:46px;border-radius:50%;background:linear-gradient(#ffe066,#ffb300);color:#4a2c00;font-weight:900;font-size:22px;display:flex;align-items:center;justify-content:center;border:3px solid #fff;box-shadow:0 3px 0 #b37700}' +
  '.hname{flex:1;text-align:left;font-weight:bold;font-size:15px;min-width:0}' +
  '.hname small{display:block;font-size:11px;opacity:.75;font-weight:normal}' +
  '.hchip{background:rgba(0,0,0,.35);border-radius:16px;padding:6px 10px;font-size:14px;font-weight:bold;white-space:nowrap}' +
  '.hlogo{margin-top:22px;text-align:center;font-family:"Arial Black",Impact,sans-serif}' +
  '.hl1{font-size:66px;line-height:1;letter-spacing:6px;color:#ffd84d;text-shadow:0 1px 0 #e0a800,0 2px 0 #c99700,0 3px 0 #b38600,0 4px 0 #9c7500,0 5px 0 #856400,0 6px 0 #6e5200,0 12px 16px rgba(0,0,0,.55)}' +
  '.hl2{font-size:36px;line-height:1.1;letter-spacing:13px;margin-left:13px;color:#fff;text-shadow:0 1px 0 #7fb2ff,0 2px 0 #4f8df0,0 3px 0 #2f6fe0,0 4px 0 #1d55c0,0 5px 0 #143f95,0 10px 14px rgba(0,0,0,.5)}' +
  '.hl3{margin-top:6px;font-size:12px;letter-spacing:4px;opacity:.85;font-family:Arial,sans-serif}' +
  '.hscene{width:100px;height:100px;margin:34px 0 30px;perspective:500px;animation:hbob 3s ease-in-out infinite}' +
  '@keyframes hbob{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}' +
  '.hcube{position:relative;width:100px;height:100px;transform-style:preserve-3d;animation:hspin 9s linear infinite}' +
  '.hcube.fast{animation-duration:1s}' +
  '@keyframes hspin{from{transform:rotateX(-24deg) rotateY(0)}to{transform:rotateX(-24deg) rotateY(360deg)}}' +
  '.hface{position:absolute;width:100px;height:100px;background:linear-gradient(145deg,#ffffff,#d5dbe6);border-radius:18px;border:2px solid #b8c0cf;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,1fr);padding:14px;box-shadow:inset 0 0 14px rgba(0,0,0,.18)}' +
  '.hface i{border-radius:50%;width:18px;height:18px;margin:auto}' +
  '.hface i.on{background:#1b1b1b;box-shadow:inset 0 2px 3px rgba(255,255,255,.3)}' +
  '.hface.one i.on{background:#e53935}' +
  '.hmenu{width:100%;margin-top:6px}' +
  '.hbtn{position:relative;display:flex;align-items:center;gap:14px;width:100%;border:none;border-radius:24px;padding:14px 16px;margin-bottom:22px;color:#fff;text-align:left;font-weight:900;font-size:22px;overflow:hidden;font-family:"Arial Black",Arial,sans-serif;transition:transform .1s,box-shadow .1s}' +
  '.hbtn small{display:block;font-family:Arial,sans-serif;font-size:12px;font-weight:normal;opacity:.92;margin-top:3px}' +
  '.hb1{background:linear-gradient(180deg,#52b0ff,#1565d8);box-shadow:0 8px 0 #0b3a8f,0 16px 24px rgba(0,0,0,.45)}' +
  '.hb2{background:linear-gradient(180deg,#6be877,#1f9e32);box-shadow:0 8px 0 #0f6a1d,0 16px 24px rgba(0,0,0,.45)}' +
  '.hb1:active{transform:translateY(6px);box-shadow:0 2px 0 #0b3a8f,0 6px 10px rgba(0,0,0,.4)}' +
  '.hb2:active{transform:translateY(6px);box-shadow:0 2px 0 #0f6a1d,0 6px 10px rgba(0,0,0,.4)}' +
  '.hbtn::after{content:"";position:absolute;top:0;left:-70%;width:40%;height:100%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.4),transparent);transform:skewX(-20deg);animation:hshine 3.6s infinite}' +
  '@keyframes hshine{0%{left:-70%}55%,100%{left:130%}}' +
  '.hico{width:58px;height:58px;border-radius:16px;background:rgba(255,255,255,.22);display:flex;align-items:center;justify-content:center;font-size:32px;box-shadow:inset 0 2px 0 rgba(255,255,255,.45);flex-shrink:0}' +
  '.hdock{width:100%;display:flex;gap:8px;margin-top:4px}' +
  '.hd{position:relative;flex:1;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.28);border-radius:18px;padding:10px 2px;color:#fff;font-size:12px;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);box-shadow:0 4px 0 rgba(0,0,0,.3)}' +
  '.hd:active{transform:translateY(3px);box-shadow:0 1px 0 rgba(0,0,0,.3)}' +
  '.hd span{display:block;font-size:24px;margin-bottom:2px}' +
  '.hdot{position:absolute;top:6px;right:14px;width:11px;height:11px;border-radius:50%;background:#ff3d3d;border:2px solid #fff;display:none}' +
  '#hToast{position:fixed;left:50%;bottom:40px;transform:translateX(-50%);background:#ffd84d;color:#3b2a00;font-weight:bold;padding:12px 22px;border-radius:24px;z-index:300;display:none;box-shadow:0 6px 18px rgba(0,0,0,.5)}' +
  '#hModal{position:fixed;inset:0;background:rgba(0,0,0,.75);display:none;align-items:center;justify-content:center;z-index:200;padding:20px}' +
  '#hModal.show{display:flex}' +
  '.hmcard{width:100%;max-width:340px;background:#06255a;border:3px solid #ffd700;border-radius:18px;padding:18px;text-align:left;color:#fff;max-height:80%;overflow-y:auto}' +
  '.hmcard h2{color:#ffd700;text-align:center;margin-bottom:10px}' +
  '.hmcard p{font-size:14px;line-height:1.6;margin:6px 0}';

  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  /* 3D dice faces */
  var PAT = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };
  var FACES = [[1, 'rotateY(0deg)'], [6, 'rotateY(180deg)'], [3, 'rotateY(90deg)'],
               [4, 'rotateY(-90deg)'], [2, 'rotateX(90deg)'], [5, 'rotateX(-90deg)']];
  var cubeHtml = '';
  FACES.forEach(function (f) {
    var pips = '';
    for (var i = 0; i < 9; i++) pips += '<i class="' + (PAT[f[0]].indexOf(i) >= 0 ? 'on' : '') + '"></i>';
    cubeHtml += '<div class="hface' + (f[0] === 1 ? ' one' : '') + '" style="transform:' + f[1] + ' translateZ(50px)">' + pips + '</div>';
  });

  /* background blobs */
  var cols = ['#e53935', '#43a047', '#fdd835', '#1e88e5', '#e53935', '#43a047'];
  var blobs = '';
  cols.forEach(function (c, i) {
    var s = 40 + (i * 23) % 70;
    blobs += '<div class="blob" style="width:' + s + 'px;height:' + s + 'px;background:' + c +
      ';left:' + ((i * 37 + 8) % 85) + '%;top:' + ((i * 29 + 12) % 80) + '%;animation-delay:-' + (i * 1.5) + 's"></div>';
  });

  home.innerHTML = blobs +
    '<div class="hwrap">' +
      '<div class="htop">' +
        '<div class="havatar" id="avatar">G</div>' +
        '<div class="hname"><div id="pname">Guest</div><small>Level 1</small></div>' +
        '<div class="hchip">💎 <span id="gemV">50</span></div>' +
        '<div class="hchip">🪙 <span id="coinV">1,000</span></div>' +
      '</div>' +
      '<div class="hlogo"><div class="hl1">LUDO</div><div class="hl2">ARENA</div><div class="hl3">ROLL • MOVE • WIN</div></div>' +
      '<div class="hscene"><div class="hcube" id="hCube">' + cubeHtml + '</div></div>' +
      '<div class="hmenu">' +
        '<button class="hbtn hb1" id="hMulti"><span class="hico">🌐</span><span>MULTIPLAYER<small>Dosre players ke saath</small></span></button>' +
        '<button class="hbtn hb2" id="hComp"><span class="hico">🤖</span><span>COMPUTER<small>Computer ke against</small></span></button>' +
      '</div>' +
      '<div class="hdock">' +
        '<button class="hd" id="hSet"><span>⚙️</span>Settings</button>' +
        '<button class="hd" id="hBonus"><span>🎁</span>Daily Bonus<i class="hdot" id="hDot"></i></button>' +
        '<button class="hd" id="hHelp"><span>❓</span>How to Play</button>' +
        '<button class="hd" id="hOut"><span>🚪</span>Logout</button>' +
      '</div>' +
    '</div>';

  var toast = document.createElement('div'); toast.id = 'hToast'; document.body.appendChild(toast);
  var modal = document.createElement('div'); modal.id = 'hModal';
  modal.innerHTML = '<div class="hmcard"><h2 id="hmT"></h2><div id="hmB"></div><div style="text-align:center"><button class="gold" id="hmX" style="margin-top:12px;padding:10px 34px;font-size:17px">OK</button></div></div>';
  document.body.appendChild(modal);
  document.getElementById('hmX').onclick = function () { modal.classList.remove('show'); };

  function say(t) {
    toast.textContent = t; toast.style.display = 'block';
    setTimeout(function () { toast.style.display = 'none'; }, 2200);
  }
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function today() { return new Date().toISOString().slice(0, 10); }
  function refresh() {
    document.getElementById('coinV').textContent = Number(lsGet('ludoCoins', 1000)).toLocaleString();
    document.getElementById('gemV').textContent = lsGet('ludoGems', 50);
    document.getElementById('hDot').style.display = lsGet('ludoBonusDay', '') !== today() ? 'block' : 'none';
  }
  refresh();

  document.getElementById('hMulti').onclick = function () { openSelect('multiplayer'); };
  document.getElementById('hComp').onclick = function () { openSelect('computer'); };
  document.getElementById('hOut').onclick = function () { logout(); };
  document.getElementById('hSet').onclick = function () {
    if (typeof openSettings === 'function') openSettings();
    else alert('Settings load nahi hui. index.html mein extras.js wali line check karein.');
  };
  document.getElementById('hBonus').onclick = function () {
    if (lsGet('ludoBonusDay', '') === today()) { say('Aaj ka bonus le liya. Kal aana! 🌙'); return; }
    lsSet('ludoBonusDay', today());
    lsSet('ludoCoins', Number(lsGet('ludoCoins', 1000)) + 500);
    lsSet('ludoGems', Number(lsGet('ludoGems', 50)) + 5);
    refresh();
    say('🎁 +500 coins aur +5 gems mile!');
  };
  document.getElementById('hHelp').onclick = function () {
    document.getElementById('hmT').textContent = 'How to Play';
    document.getElementById('hmB').innerHTML =
      '<p>🎲 Dice dabao, <b>6</b> aane par token ghar se bahar nikalta hai.</p>' +
      '<p>➡️ Token ko apne rang ki lane se hote hue beech mein pahunchao.</p>' +
      '<p>⚔️ Dusre ka token kaato to wo ghar wapas jayega. ⭐ star aur start cell safe hain.</p>' +
      '<p>🔁 6 aane par, kaatne par ya token home pahunchne par extra baari milti hai.</p>' +
      '<p>🏆 <b>Classic:</b> sabhi 4 token pahunchao. <b>Quick:</b> 1 token pahunchao. <b>Team Up:</b> teammate ke saath dono ke saare token.</p>';
    modal.classList.add('show');
  };
  document.getElementById('hCube').onclick = function () {
    var c = this; c.classList.add('fast');
    setTimeout(function () { c.classList.remove('fast'); }, 1200);
    if (typeof sndRoll === 'function') sndRoll();
  };

  /* coins refresh jab home dikhe */
  var obs = new MutationObserver(refresh);
  obs.observe(home, { attributes: true, attributeFilter: ['class'] });
})();
/* END home.js */