(function () {
  var AREAS = [["linux", "Linux and the network underneath everything"], ["aws", "AWS, past the service names"], ["tf", "Terraform and the state problem"], ["k8s", "Containers and Kubernetes"], ["cicd", "Delivery pipelines"], ["obs", "Observability and being on call"], ["code", "Scripting, and knowing when to stop"], ["data", "State, and the ways it fails"]];
  var XP = [["yrs", "How long have you been responsible for software that other people depended on while it ran?"], ["acc", "What production access have you held?"], ["onc", "On-call?"], ["sys", "The largest system you have operated, not written"], ["iac", "Infrastructure as code"], ["ctr", "Containers in production — not docker-compose on your laptop"], ["cid", "Continuous delivery"], ["inc", "Incidents"]];
  var KEY = "placement-v1";

  function store(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { return {}; } }

  function marks() {
    var out = {};
    document.querySelectorAll('input[name^="m-"]:checked').forEach(function (el) {
      out[el.name.slice(2)] = +el.value;
    });
    return out;
  }
  function experience() {
    var out = {};
    XP.forEach(function (x) {
      var el = document.querySelector('input[name="xp-' + x[0] + '"]:checked');
      if (el) out[x[0]] = el.value;
    });
    return out;
  }

  function verdict(score, answered) {
    if (answered < 4) return ["", "", "not finished"];
    if (score <= 2) return ["v-full", "start here", "Full module, from the beginning."];
    if (score <= 5) return ["v-brisk", "brisk", "Do it, but you will move fast. The value is in the failure modes."];
    return ["v-skip", "skip", "Skip the teaching. Answer the check questions to confirm."];
  }

  function band(total, answered) {
    if (answered < 24) return "Mark at least two thirds of the questions and this becomes meaningful.";
    if (total <= 19) return "<strong>The plan as written.</strong> Twenty-four weeks, six phases, starting at the foundations. Nothing here is wasted on you.";
    if (total <= 38) return "<strong>Compress the first half.</strong> Phases 1 and 2 become reference rather than teaching — read the lessons, do the check questions, skip the exercises you can already do. That buys roughly six weeks, and they should go into the project.";
    if (total <= 52) return "<strong>Start at phase 3, and make the project the spine.</strong> You know most of the ground. What you are missing is almost certainly evidence rather than knowledge: something you built, running, that you can be questioned about.";
    return "<strong>You do not need a course.</strong> You need a portfolio project, interview drills, and a CV that carries the keywords. Say so and the plan becomes eight weeks of building and rehearsing rather than twenty-four of learning.";
  }

  function render() {
    var m = marks(), total = 0, answered = 0, real = 0, fresh = 0, rows = "";
    AREAS.forEach(function (a) {
      var s = 0, n = 0;
      for (var i = 1; i <= 4; i++) {
        var v = m[a[0] + "-" + i];
        if (v !== undefined) { s += v; n++; if (v === 2) real++; if (v === 0) fresh++; }
      }
      total += s; answered += n;
      var v = verdict(s, n);
      var t = document.getElementById("tally-" + a[0]);
      if (t) {
        t.innerHTML = "<b>" + s + "</b>/8 &middot; <span class=\"verdict " + v[0] + "\">" + v[1] + "</span>";
      }
      rows += "<tr><td>" + a[1] + "</td><td class=\"key\">" + s + " / 8</td><td>" + v[2] + "</td></tr>";
    });
    document.getElementById("area-rows").innerHTML = rows;
    document.getElementById("s-total").textContent = total;
    document.getElementById("s-done").textContent = answered;
    document.getElementById("s-real").textContent = real;
    document.getElementById("s-new").textContent = fresh;
    document.getElementById("s-bar").style.width = (total / 64 * 100) + "%";
    document.getElementById("band-text").innerHTML = band(total, answered);

    var xp = experience(), lines = ["PLACEMENT RESULT", ""];
    lines.push("Experience");
    XP.forEach(function (x) { lines.push("  " + x[1] + "  ->  " + (xp[x[0]] || "(not answered)")); });
    lines.push("", "Knowledge, " + total + "/64 across " + answered + "/32 questions");
    AREAS.forEach(function (a) {
      var s = 0, n = 0;
      for (var i = 1; i <= 4; i++) { var v = m[a[0] + "-" + i]; if (v !== undefined) { s += v; n++; } }
      var per = [];
      for (var j = 1; j <= 4; j++) { var w = m[a[0] + "-" + j]; per.push(w === undefined ? "-" : w); }
      lines.push("  " + (s + "/8").padEnd(5) + " [" + per.join(" ") + "]  " + a[1]);
    });
    document.getElementById("summary").value = lines.join("\n");
    store({ marks: m, xp: xp });
  }

  var saved = load();
  Object.keys(saved.marks || {}).forEach(function (k) {
    var el = document.getElementById("m-" + k + "-" + saved.marks[k]);
    if (el) { el.checked = true; var d = document.getElementById("d-" + k); if (d) d.open = true; }
  });
  Object.keys(saved.xp || {}).forEach(function (k) {
    document.querySelectorAll('input[name="xp-' + k + '"]').forEach(function (el) {
      if (el.value === saved.xp[k]) el.checked = true;
    });
  });

  document.addEventListener("change", function (e) {
    if (e.target.matches('input[type="radio"]')) render();
  });
  document.getElementById("copy").addEventListener("click", function () {
    var ta = document.getElementById("summary"), note = document.getElementById("copy-note");
    function ok() { note.textContent = "Copied. Paste it into the chat."; }
    function manual() { ta.focus(); ta.select(); note.textContent = "Select the text below and copy it."; }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(ta.value).then(ok, manual);
    } else { manual(); }
  });
  document.getElementById("reset").addEventListener("click", function () {
    document.querySelectorAll('input[type="radio"]').forEach(function (el) { el.checked = false; });
    document.querySelectorAll("details").forEach(function (d) { d.open = false; });
    try { localStorage.removeItem(KEY); } catch (e) {}
    document.getElementById("copy-note").textContent = "Cleared.";
    render();
  });
  render();
})();
