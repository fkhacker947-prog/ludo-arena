(function () {
  if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    });
  }
  var dp = null;
  var b = document.createElement('button');
  b.textContent = '📲 Install App';
  b.style.cssText = 'position:fixed;right:12px;bottom:14px;z-index:120;display:none;background:#ffd84d;color:#3b2a00;font-weight:bold;border:0;border-radius:22px;padding:11px 18px;font-size:15px;box-shadow:0 4px 14px rgba(0,0,0,.5)';
  document.body.appendChild(b);
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault(); dp = e; b.style.display = 'block';
  });
  b.onclick = function () {
    if (!dp) return;
    dp.prompt();
    dp.userChoice.then(function () { dp = null; b.style.display = 'none'; });
  };
  window.addEventListener('appinstalled', function () { b.style.display = 'none'; });
})();