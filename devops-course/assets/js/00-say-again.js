(function(){
  var q = document.getElementById('q'), c = document.getElementById('count');
  var items = Array.prototype.slice.call(document.querySelectorAll('.gi'));
  var secs  = Array.prototype.slice.call(document.querySelectorAll('section[data-g]'));
  function render(){
    var t = (q.value || '').trim().toLowerCase();
    var shown = 0;
    items.forEach(function(el){
      var hit = !t || el.textContent.toLowerCase().indexOf(t) !== -1;
      el.hidden = !hit;
      if (hit) shown++;
    });
    secs.forEach(function(s){ s.hidden = !s.querySelector('.gi:not([hidden])'); });
    c.textContent = t ? shown + ' of ' + items.length : items.length + ' phrases';
  }
  q.addEventListener('input', render);
  render();
})();
