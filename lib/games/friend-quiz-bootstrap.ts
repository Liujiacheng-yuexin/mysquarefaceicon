// Capture the private fragment before vendor scripts run. Only the local game
// receives it; it is never placed in an iframe URL or the analytics dataLayer.
export const friendQuizBootstrap = String.raw`(function () {
  var path;
  try { path = decodeURIComponent(location.pathname); } catch (_) { return; }
  if (!/^\/games\/friend-block-test\/?$/.test(path)) return;
  var fragment = '';
  var frame = null;
  var listeners = new Set();
  var send = Function.prototype.call.bind(window.postMessage);
  function capture(event) {
    if (!location.hash || location.hash === '#game-player') return;
    fragment = location.hash;
    history.replaceState(history.state, '', location.pathname + location.search);
    // HashChangeEvent.newURL also contains the private fragment.
    if (event) event.stopImmediatePropagation();
    deliver();
    listeners.forEach(function (listener) { listener(); });
  }
  function deliver() {
    if (!frame || !frame.contentWindow) return;
    var url = new URL(frame.src, location.href);
    if (url.origin !== location.origin || url.pathname !== '/games/friend-block-test/index.html' || url.hash) return;
    send(frame.contentWindow, { type: 'friend-quiz:link', fragment: fragment }, location.origin);
  }
  capture();
  window.addEventListener('hashchange', capture, true);
  window.addEventListener('popstate', capture, true);
  Object.defineProperty(window, '__MSFI_FRIEND_QUIZ__', { value: Object.freeze({
    hasSharedLink: function () { return fragment.indexOf('#fbt1.') === 0; },
    connect: function (element) { frame = element; deliver(); },
    reset: function () { fragment = ''; },
    subscribe: function (listener) { listeners.add(listener); return function () { listeners.delete(listener); }; }
  }) });
})();`;
