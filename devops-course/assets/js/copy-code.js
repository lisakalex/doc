// Adds a Copy button to every .code block on a lesson page.
// Linked from each lesson, like fonts.css; uses the page's --code-* tokens.
(function () {
  var css =
    // the button sits in a strip reserved above the first line, so it never covers code
    '.code-wrap{position:relative;}' +
    '.code-wrap>.code{padding-top:2.6rem;}' +
    '.copy{position:absolute;top:.5rem;right:.5rem;font:500 .7rem "IBM Plex Mono",monospace;' +
    'color:var(--code-ink);background:var(--code-bg);border:1px solid var(--code-muted);' +
    'border-radius:5px;padding:.2rem .55rem;cursor:pointer;opacity:.8;}' +
    '.copy:hover,.copy:focus-visible{opacity:1;}' +
    '.copy:focus-visible{outline:2px solid #7FD8E1;outline-offset:2px;}';
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  document.querySelectorAll('.code').forEach(function (block) {
    var wrap = document.createElement('div');
    wrap.className = 'code-wrap';
    block.parentNode.insertBefore(wrap, block);
    wrap.appendChild(block);

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy';
    button.textContent = 'Copy';
    wrap.appendChild(button);

    button.addEventListener('click', function () {
      var text = block.innerText.replace(/\n$/, '');
      function done(message) {
        button.textContent = message;
        setTimeout(function () { button.textContent = 'Copy'; }, 1600);
      }
      // the clipboard API can be blocked in a sandboxed viewer, so select the text instead
      function fallback() {
        var range = document.createRange();
        range.selectNodeContents(block);
        var selection = getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        var ok = false;
        try { ok = document.execCommand('copy'); } catch (e) {}
        done(ok ? 'Copied' : 'Selected, press Ctrl+C');
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done('Copied'); }, fallback);
      } else {
        fallback();
      }
    });
  });
})();
