/* Web-Werkstatt: Bedienlogik */
(function () {
  "use strict";
  var KEY = "webwerkstatt.v3", OLD_KEY = "webwerkstatt.v1";
  var S = load();
  function load() {
    var d = { visited: [], skills: {}, lessons: {}, code: {}, quizBest: 0, launch: {}, api: [], dns: [], proChecks: {}, lastLesson: "h1" };
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw && localStorage.getItem(OLD_KEY)) { raw = localStorage.getItem(OLD_KEY); localStorage.setItem(KEY, raw); } // Fortschritt aus Version 2 übernehmen
      var x = JSON.parse(raw); if (x) for (var k in d) if (!(k in x)) x[k] = d[k]; return x || d;
    } catch (e) { return d; }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function el(t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h !== undefined) e.innerHTML = h; return e; }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function table(target, data) {
    $(target).innerHTML = "<thead><tr>" + data.h.map(function (h) { return "<th>" + h + "</th>"; }).join("") + "</tr></thead><tbody>" +
      data.r.map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody>";
  }
  function eur(n) { return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n); }

  /* ---------- Fortschritt ---------- */
  var TABS = $$(".tabs button").map(function (b) { return b.dataset.tab; });
  var allSkills = 0; C.path.forEach(function (s) { allSkills += s.skills.length; });
  /* Fortschritt = gewichtete Summe; weitere Module melden sich über WW.parts an */
  var PARTS = [
    { w: 5, f: function () { return S.visited.length / TABS.length; } },
    { w: 30, f: function () { return Object.keys(S.lessons).filter(function (k) { return S.lessons[k]; }).length / C.lessons.length; } },
    { w: 10, f: function () { return Object.keys(S.skills).filter(function (k) { return S.skills[k]; }).length / allSkills; } },
    { w: 5, f: function () { return (S.quizBest || 0) / 100; } },
    { w: 3, f: function () { return S.api.length / C.apiTasks.length; } },
    { w: 2, f: function () { return S.dns.length / C.dnsQuiz.length; } }
  ];
  function progress() {
    var sw = 0, sum = 0;
    PARTS.forEach(function (p) { var v = 0; try { v = Math.min(1, p.f() || 0); } catch (e) {} sw += p.w; sum += p.w * v; });
    var p = Math.round(100 * sum / sw);
    $("#progressText").textContent = p + " %";
    $("#progressBar").style.width = p + "%";
  }
  $("#resetAll").addEventListener("click", function () {
    if (confirm("Gesamten Fortschritt inkl. deines Codes im Labor zurücksetzen?")) { localStorage.removeItem(KEY); location.reload(); }
  });

  /* ---------- Tabs ---------- */
  function show(tab) {
    if (TABS.indexOf(tab) < 0) tab = "start";
    $$(".tabs button").forEach(function (b) { var on = b.dataset.tab === tab; b.classList.toggle("active", on); if (on) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current"); });
    $$(".panel").forEach(function (p) { p.classList.toggle("active", p.id === tab); });
    if (S.visited.indexOf(tab) < 0) { S.visited.push(tab); save(); }
    if (history.replaceState) history.replaceState(null, "", "#/" + tab);
    window.scrollTo(0, 0);
    progress();
    document.dispatchEvent(new CustomEvent("ww:show", { detail: tab }));
  }
  $$(".tabs button").forEach(function (b) { b.addEventListener("click", function () { show(b.dataset.tab); }); });

  /* ---------- Lernpfad ---------- */
  function renderPath() {
    var wrap = $("#pathList"); wrap.innerHTML = "";
    C.path.forEach(function (st, si) {
      var ticked = st.skills.filter(function (s, i) { return S.skills[si + "." + i]; }).length;
      var box = el("div", "stage" + (ticked === st.skills.length ? " done" : ""));
      box.innerHTML = "<div class=\"stage-h\"><div class=\"stage-n\">" + (ticked === st.skills.length ? "✓" : si) + "</div><div><h3>" + st.t + "</h3><div class=\"meta\">" + st.meta + "</div></div><span class=\"pct\">" + ticked + "/" + st.skills.length + " Fähigkeiten</span></div>" +
        "<div class=\"stage-b\"><div class=\"cols\"><div><h4>Das lernst du</h4><ul>" + st.learn.map(function (l) { return "<li>" + l + "</li>"; }).join("") + "</ul>" +
        "<h4>Gute Quellen</h4><ul>" + st.res.map(function (r) { return "<li><a href=\"" + r[1] + "\" target=\"_blank\" rel=\"noopener\">" + r[0] + "</a></li>"; }).join("") + "</ul></div>" +
        "<div><h4>Das kann ich sicher</h4><div class=\"skills\"></div><div class=\"go\"></div></div></div></div>";
      st.skills.forEach(function (s, i) {
        var id = si + "." + i, lab = el("label", "skill", "<input type=\"checkbox\"" + (S.skills[id] ? " checked" : "") + "><span>" + s + "</span>");
        $("input", lab).addEventListener("change", function (e) { S.skills[id] = e.target.checked; save(); progress(); var open = box.classList.contains("open"); renderPath(); if (open) $$(".stage")[si].classList.add("open"); });
        $(".skills", box).appendChild(lab);
      });
      st.go.forEach(function (g) { var b = el("button", "small", "→ " + g[1]); b.addEventListener("click", function () { show(g[0]); }); $(".go", box).appendChild(b); });
      $(".stage-h", box).addEventListener("click", function () { box.classList.toggle("open"); });
      wrap.appendChild(box);
    });
  }
  renderPath();

  /* ---------- Web ---------- */
  var step = 0;
  function renderStep() {
    var s = C.reqSteps[step];
    $$("#reqSvg .node").forEach(function (n) { n.classList.toggle("on", s.on.indexOf(n.dataset.n) >= 0); });
    $$("#reqSvg .lnk").forEach(function (l) { l.classList.toggle("on", s.l.indexOf(l.dataset.l) >= 0); });
    $("#reqLabel").textContent = s.lbl;
    $("#reqInfo").innerHTML = "<h3>" + s.t + "</h3><p>" + s.d + "</p>";
    $("#reqCount").textContent = "Schritt " + (step + 1) + " / " + C.reqSteps.length;
    $("#reqPrev").disabled = step === 0; $("#reqNext").disabled = step === C.reqSteps.length - 1;
  }
  $("#reqPrev").addEventListener("click", function () { step--; renderStep(); });
  $("#reqNext").addEventListener("click", function () { step++; renderStep(); });
  renderStep();
  $("#webConcepts").innerHTML = C.webConcepts.map(function (c) { return "<div class=\"card\"><h3>" + c.t + "</h3><p>" + c.d + "</p></div>"; }).join("");
  table("#renderTable", C.renderTable);

  /* ---------- Code-Labor ---------- */
  var cur = null, curFile = "html", runId = 0, logs = [];
  var iframe = $("#preview"), codeTA = $("#code");
  function lessonById(id) { for (var i = 0; i < C.lessons.length; i++) if (C.lessons[i].id === id) return C.lessons[i]; return C.lessons[0]; }
  /* Lektionen nach Bereich ordnen (stabil), damit Zusatzdateien sich einreihen */
  var SEC = ["HTML", "CSS", "JavaScript", "Barrierefreiheit", "Sicherheit & Performance", "Projekt: Portfolio", "Projekt: To-do-App", "Projekt: Mini-Shop"];
  C.lessons = C.lessons.map(function (l, i) { return [l, i]; }).sort(function (a, b) {
    var x = SEC.indexOf(a[0].sec), y = SEC.indexOf(b[0].sec); if (x < 0) x = 99; if (y < 0) y = 99; return x - y || a[1] - b[1];
  }).map(function (p) { return p[0]; });
  function code(l) {
    if (!S.code[l.id]) {
      var idx = C.lessons.indexOf(l), prev = C.lessons[idx - 1], base = l.start;
      if (l.carry && prev) base = S.code[prev.id] && S.lessons[prev.id] ? S.code[prev.id] : prev.sol; // Projekt: weiter mit dem Stand der vorigen Etappe
      S.code[l.id] = { html: base.html, css: base.css, js: base.js };
    }
    return S.code[l.id];
  }
  function renderLessonList() {
    var box = $("#lessonList"), sec = null; box.innerHTML = "";
    C.lessons.forEach(function (l, i) {
      if (l.sec !== sec) { sec = l.sec; box.appendChild(el("h4", "", sec)); }
      var b = el("button", (S.lessons[l.id] ? "ok " : "") + (cur && cur.id === l.id ? "cur" : ""), (i + 1) + ". " + l.t);
      b.addEventListener("click", function () { openLesson(l.id); });
      box.appendChild(b);
    });
  }
  function openLesson(id) {
    cur = lessonById(id); S.lastLesson = cur.id; save();
    var idx = C.lessons.indexOf(cur), c = code(cur);
    $("#lessonHead").innerHTML = "<h3>Lektion " + (idx + 1) + ": " + cur.t + " <small style=\"color:var(--muted);font-weight:500\">· " + cur.sec + "</small></h3><div class=\"theory\">" + cur.theory + "</div><div class=\"task\"><b>Aufgabe:</b> " + cur.task + "</div>";
    var files = ["html", "css", "js"];
    $("#edTabs").innerHTML = "";
    files.forEach(function (f) {
      var b = el("button", "", f.toUpperCase());
      b.addEventListener("click", function () { switchFile(f); });
      $("#edTabs").appendChild(b);
    });
    curFile = cur.sec === "JavaScript" ? "js" : cur.sec === "CSS" ? "css" : "html";
    switchFile(curFile);
    $("#checkOut").innerHTML = "";
    hintN = 0;
    renderLessonList(); run();
  }
  function switchFile(f) {
    curFile = f;
    $$("#edTabs button").forEach(function (b) { b.classList.toggle("on", b.textContent.toLowerCase() === f); });
    codeTA.value = code(cur)[f];
  }
  codeTA.addEventListener("input", function () { code(cur)[curFile] = codeTA.value; save(); clearTimeout(codeTA._t); codeTA._t = setTimeout(run, 600); });
  codeTA.addEventListener("keydown", function (e) {
    if (e.key === "Tab") { e.preventDefault(); var s = codeTA.selectionStart; codeTA.setRangeText("  ", s, codeTA.selectionEnd, "end"); codeTA.dispatchEvent(new Event("input")); }
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); check(); }
  });
  var PREFIX_LINES;
  function buildDoc(c, id) {
    var head = "<!DOCTYPE html><html lang=\"de\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><style>body{font-family:system-ui,sans-serif;margin:12px}</style><style>\n" + c.css + "\n</style>" +
      "<script>(function(){try{var P='ww-lab:',L=parent.localStorage,M={};var api={getItem:function(k){try{return L.getItem(P+k)}catch(e){return k in M?M[k]:null}},setItem:function(k,v){try{L.setItem(P+k,String(v))}catch(e){M[k]=String(v)}},removeItem:function(k){try{L.removeItem(P+k)}catch(e){delete M[k]}}," +
      "clear:function(){try{Object.keys(L).forEach(function(k){if(k.indexOf(P)===0)L.removeItem(k)})}catch(e){M={}}},key:function(i){return Object.keys(L).filter(function(k){return k.indexOf(P)===0}).map(function(k){return k.slice(P.length)})[i]||null}};" +
      "Object.defineProperty(api,'length',{get:function(){return Object.keys(L).filter(function(k){return k.indexOf(P)===0}).length}});Object.defineProperty(window,'localStorage',{value:api,configurable:true});}catch(e){}})();<\/script>" +
      "<script>(function(){var R=" + id + ";function s(t,a){try{parent.postMessage({lab:R,t:t,m:Array.prototype.map.call(a,function(x){if(typeof x==='object'){try{return JSON.stringify(x)}catch(e){}}return String(x)}).join(' ')},'*')}catch(e){}}" +
      "var o=console.log;console.log=function(){s('log',arguments);o.apply(console,arguments)};console.error=function(){s('err',arguments)};console.warn=function(){s('warn',arguments)};" +
      "window.addEventListener('error',function(e){s('err',[e.message+(e.lineno?' (JS-Zeile '+(e.lineno-window.__OFF)+')':'')])});})();<\/script></head><body>\n" + c.html + "\n<script>\n";
    var off = head.split("\n").length - 1;
    return head.replace("var R=", "window.__OFF=" + off + ";var R=") + c.js + "\n<\/script></body></html>";
  }
  window.addEventListener("message", function (e) {
    if (!e.data || e.data.lab !== runId) return;
    logs.push(e.data.m);
    var line = el("div", e.data.t === "err" ? "err" : "", esc((e.data.t === "err" ? "✖ " : e.data.t === "warn" ? "⚠ " : "› ") + e.data.m));
    $("#console").appendChild(line); $("#console").scrollTop = 1e6;
  });
  function run() {
    return new Promise(function (resolve) {
      runId++; logs = [];
      $("#console").innerHTML = "";
      var done = false;
      iframe.onload = function () { if (done) return; done = true; setTimeout(resolve, 120); };
      iframe.srcdoc = buildDoc(code(cur), runId);
      setTimeout(function () { if (!done) { done = true; resolve(); } }, 2500);
    });
  }
  function check() {
    var l = cur, out = $("#checkOut");
    out.innerHTML = "<div class=\"c\">Prüfe …</div>";
    run().then(function () {
      var ctx = { d: iframe.contentDocument, w: iframe.contentWindow }, src = code(l), results = [];
      function reload() { return run().then(function () { ctx.d = iframe.contentDocument; ctx.w = iframe.contentWindow; return ctx; }); }
      var chain = Promise.resolve();
      l.checks.forEach(function (c) {
        chain = chain.then(function () {
          var r; try { r = c[1](ctx.d, ctx.w, src, logs.slice(), reload, ctx); } catch (e) { r = false; }
          return Promise.resolve(r).catch(function () { return false; }).then(function (ok) { results.push([c[0], !!ok]); });
        });
      });
      chain.then(function () {
        var all = results.every(function (r) { return r[1]; });
        out.innerHTML = results.map(function (r) { return "<div class=\"c " + (r[1] ? "y" : "n") + "\">" + (r[1] ? "✔ " : "✖ ") + r[0] + "</div>"; }).join("");
        if (all) {
          var idx = C.lessons.indexOf(l), next = C.lessons[idx + 1];
          out.innerHTML += "<div class=\"win\">🎉 <b>Geschafft!</b> " + (next ? "<button class=\"small\" id=\"nextLesson\">Weiter: " + next.t + " →</button>" : "Du hast alle Lektionen abgeschlossen! Zeit für ein eigenes Projekt.") + "</div>";
          if (next) $("#nextLesson").addEventListener("click", function () { openLesson(next.id); window.scrollTo(0, $("#labor").offsetTop); });
          if (!S.lessons[l.id]) { S.lessons[l.id] = true; save(); progress(); renderLessonList(); }
        }
      });
    });
  }
  var hintN = 0;
  $("#runBtn").addEventListener("click", run);
  $("#checkBtn").addEventListener("click", check);
  $("#hintBtn").addEventListener("click", function () {
    var h = cur.hints[hintN % cur.hints.length]; hintN++;
    $("#checkOut").insertAdjacentHTML("beforeend", "<div class=\"hint\">💡 " + h + "</div>");
  });
  $("#solBtn").addEventListener("click", function () {
    if (!confirm("Lösung laden? Dein aktueller Code in dieser Lektion wird ersetzt. Tipp: erst selbst versuchen!")) return;
    S.code[cur.id] = { html: cur.sol.html, css: cur.sol.css, js: cur.sol.js }; save(); switchFile(curFile); run();
  });
  $("#resetCode").addEventListener("click", function () {
    if (!confirm("Code dieser Lektion auf den Anfang zurücksetzen?")) return;
    delete S.code[cur.id]; save(); switchFile(curFile); run(); $("#checkOut").innerHTML = "";
  });
  openLesson(S.lastLesson || "h1");

  /* ---------- Backend: API-Simulator ---------- */
  var db = { items: [{ id: 1, name: "Laptop", preis: 999 }, { id: 2, name: "Maus", preis: 25 }, { id: 3, name: "Monitor", preis: 249.5 }], next: 4 };
  var reasons = { 200: "OK", 201: "Created", 204: "No Content", 400: "Bad Request", 401: "Unauthorized", 404: "Not Found", 405: "Method Not Allowed" };
  function api(m, path, auth, body) {
    var u = path.split("?"), p = u[0].replace(/\/+$/, ""), qs = new URLSearchParams(u[1] || "");
    var mm = p.match(/^\/api\/produkte(?:\/(\d+))?$/);
    if (!mm) return { s: 404, b: { fehler: "Route nicht gefunden: " + p } };
    var id = mm[1] ? +mm[1] : null, item = id ? db.items.filter(function (x) { return x.id === id; })[0] : null;
    if (m !== "GET" && !auth) return { s: 401, h: { "WWW-Authenticate": "Bearer" }, b: { fehler: "Anmeldung erforderlich (Token fehlt)" } };
    if (id && !item) return { s: 404, b: { fehler: "Produkt " + id + " existiert nicht" } };
    function parse() { try { var o = JSON.parse(body); if (typeof o.name !== "string" || !o.name.trim() || typeof o.preis !== "number" || o.preis < 0) return { err: "name (Text) und preis (Zahl ≥ 0) sind Pflicht" }; return { o: o }; } catch (e) { return { err: "Ungültiges JSON: " + e.message }; } }
    if (m === "GET") {
      if (item) return { s: 200, b: item };
      var list = db.items; if (qs.get("maxPreis")) list = list.filter(function (x) { return x.preis <= +qs.get("maxPreis"); });
      return { s: 200, b: list };
    }
    if (m === "POST") { if (id) return { s: 405, b: { fehler: "POST nur auf /api/produkte" } }; var r = parse(); if (r.err) return { s: 400, b: { fehler: r.err } }; var n = { id: db.next++, name: r.o.name, preis: r.o.preis }; db.items.push(n); return { s: 201, h: { Location: "/api/produkte/" + n.id }, b: n }; }
    if (m === "PUT") { if (!id) return { s: 405, b: { fehler: "PUT braucht eine ID: /api/produkte/1" } }; var r2 = parse(); if (r2.err) return { s: 400, b: { fehler: r2.err } }; item.name = r2.o.name; item.preis = r2.o.preis; return { s: 200, b: item }; }
    if (m === "DELETE") { if (!id) return { s: 405, b: { fehler: "DELETE braucht eine ID" } }; db.items = db.items.filter(function (x) { return x.id !== id; }); return { s: 204 }; }
    return { s: 405, b: { fehler: "Methode nicht erlaubt" } };
  }
  function renderApiTasks() {
    $("#apiTasks").innerHTML = "<b>Aufgaben</b><ol>" + C.apiTasks.map(function (t, i) { return "<li class=\"" + (S.api.indexOf(i) >= 0 ? "done" : "") + "\">" + t.t + "</li>"; }).join("") + "</ol>";
  }
  $("#apiSend").addEventListener("click", function () {
    var m = $("#apiMethod").value, p = $("#apiPath").value.trim() || "/", auth = $("#apiAuth").checked, body = $("#apiBody").value;
    var r = api(m, p, auth, body), hasBody = (m === "POST" || m === "PUT");
    var req = m + " " + p + " HTTP/1.1\nHost: shop.example.de\nAccept: application/json" + (auth ? "\nAuthorization: Bearer geheim123" : "") + (hasBody ? "\nContent-Type: application/json\n\n" + body : "");
    var headers = "Content-Type: application/json; charset=utf-8"; if (r.h) for (var k in r.h) headers += "\n" + k + ": " + r.h[k];
    var cls = r.s < 300 ? "s2" : r.s < 500 ? "s4" : "s5";
    $("#apiOut").innerHTML = "<span class=\"dim\">── Anfrage (Browser → Server) ──</span>\n<span class=\"rq\">" + esc(req) + "</span>\n\n<span class=\"dim\">── Antwort (Server → Browser) ──</span>\n<span class=\"" + cls + "\">HTTP/1.1 " + r.s + " " + (reasons[r.s] || "") + "</span>\n" + esc(r.s === 204 ? "" : headers) + (r.b !== undefined ? "\n\n" + esc(JSON.stringify(r.b, null, 2)) : "");
    var info = { m: m, p: p.split("?")[0].replace(/\/+$/, ""), s: r.s };
    C.apiTasks.forEach(function (t, i) { if (S.api.indexOf(i) < 0 && t.ok(info)) S.api.push(i); });
    save(); renderApiTasks(); progress();
  });
  C.apiPresets.forEach(function (pr) { var b = el("button", "ghost small", pr[0] + " " + pr[1]); b.addEventListener("click", function () { $("#apiMethod").value = pr[0]; $("#apiPath").value = pr[1]; }); $("#apiPresets").appendChild(b); });
  renderApiTasks();
  $("#statusCodes").innerHTML = C.statusCodes.map(function (c) { return "<div class=\"card code-c c" + c[3] + "\"><div class=\"num\">" + c[0] + "</div><b>" + c[1] + "</b><p class=\"meta\">" + c[2] + "</p></div>"; }).join("");
  function parts(list, target, info, label) {
    list.forEach(function (p) {
      var d = el("div", "part", "<span class=\"ico\">" + p.ico + "</span><b>" + p.n + "</b><span>" + p.s + "</span>");
      d.addEventListener("click", function () {
        $$(target + " .part").forEach(function (x) { x.classList.remove("sel"); }); d.classList.add("sel");
        $(info).innerHTML = "<h3>" + p.ico + " " + p.n + "</h3><p>" + p.d + "</p>" + (p.c ? "<pre>" + esc(p.c) + "</pre>" : "");
      });
      $(target).appendChild(d);
    });
  }
  parts(C.beParts, "#beParts", "#beInfo");

  /* ---------- Werkzeuge ---------- */
  $("#toolCards").innerHTML = C.tools.map(function (t) { return "<div class=\"card\"><h3>" + t.t + "</h3><p class=\"meta\">Lernen: " + t.m + "</p><p>" + t.d + "</p></div>"; }).join("");
  table("#fwTable", C.fwTable);
  Object.keys(C.stacks).forEach(function (k, i) {
    var b = el("button", "chip", k);
    b.addEventListener("click", function () { $$("#stackChips .chip").forEach(function (x) { x.classList.toggle("active", x === b); }); $("#stackOut").innerHTML = "<h3>" + k + "</h3><p>" + C.stacks[k] + "</p>"; });
    $("#stackChips").appendChild(b);
    if (i === 0) b.click();
  });

  /* ---------- Hosting ---------- */
  var wz = {};
  function renderWizard() {
    var w = $("#wizard"); w.innerHTML = "";
    C.wizardQ.forEach(function (q) {
      var box = el("div", "wz-q", "<b>" + q.q + "</b>"), ch = el("div", "chips");
      q.o.forEach(function (o) { var b = el("button", "chip" + (wz[q.k] === o[0] ? " active" : ""), o[1]); b.addEventListener("click", function () { wz[q.k] = o[0]; renderWizard(); }); ch.appendChild(b); });
      box.appendChild(ch); w.appendChild(box);
    });
    var res = el("div", "wz-res");
    if (Object.keys(wz).length < C.wizardQ.length) { res.innerHTML = "<p class=\"note\">Beantworte alle Fragen, dann erscheint deine Empfehlung.</p>"; w.appendChild(res); return; }
    var limit = { "0": 0, "10": 10, "50": 50, more: 1e9 }[wz.budget];
    var scored = C.hostOptions.filter(function (o) { return o.for.indexOf(wz.art) >= 0; }).map(function (o) {
      var s = 10, notes = [];
      if (o.skill.indexOf(wz.skill) < 0) { s -= 8; notes.push("braucht mehr Technikwissen als angegeben"); }
      if (o.cost > limit) { s -= 6; notes.push("über deinem Budget"); }
      if (wz.eu === "yes") { if (o.eu) s += 3; else { s -= 4; notes.push("kein EU-Anbieter"); } }
      s -= o.cost / 20;
      return { o: o, s: s, notes: notes };
    }).sort(function (a, b) { return b.s - a.s; }).slice(0, 3);
    res.innerHTML = "<h3>Deine Empfehlung</h3>" + scored.map(function (x, i) {
      return "<div class=\"rec" + (i === 0 ? " best" : "") + "\"><h3>" + (i === 0 ? "⭐ " : "") + x.o.n + " <small>· " + x.o.c + "</small></h3><p>👍 " + x.o.pro + "</p><p>👎 " + x.o.con + "</p>" + (x.notes.length ? "<p class=\"meta\">⚠️ " + x.notes.join(", ") + "</p>" : "") + "</div>";
    }).join("") + "<p class=\"note\">Preise ca., Stand 2025/26; vor Abschluss beim Anbieter prüfen.</p>";
    w.appendChild(res);
  }
  renderWizard();
  table("#hostTable", C.hostTable);
  var dnsI = 0;
  function renderDns() {
    var box = $("#dnsQuiz");
    if (dnsI >= C.dnsQuiz.length) { box.innerHTML = "<div class=\"q-result\"><p>DNS-Übung abgeschlossen ✔</p><button class=\"small\" id=\"dnsAgain\">Nochmal</button></div>"; $("#dnsAgain").addEventListener("click", function () { dnsI = 0; renderDns(); }); return; }
    var q = C.dnsQuiz[dnsI];
    box.innerHTML = "<div class=\"q-head\"><span>Situation " + (dnsI + 1) + " von " + C.dnsQuiz.length + "</span></div><div class=\"q-text\">" + q.q + "</div><div class=\"chips\" id=\"dnsOpts\"></div><div class=\"q-expl\" id=\"dnsEx\"></div><div class=\"q-foot\"><button id=\"dnsNext\" style=\"display:none\">Weiter →</button></div>";
    C.dnsTypes.forEach(function (t) {
      var b = el("button", "chip", t);
      b.addEventListener("click", function () {
        $$("#dnsOpts .chip").forEach(function (x) { x.disabled = true; if (x.textContent === q.a) x.classList.add("active"); });
        var ok = t === q.a;
        $("#dnsEx").innerHTML = (ok ? "✅ Richtig! " : "❌ Richtig wäre <b>" + q.a + "</b>. ") + q.e; $("#dnsEx").classList.add("show");
        if (ok && S.dns.indexOf(dnsI) < 0) { S.dns.push(dnsI); save(); progress(); }
        $("#dnsNext").style.display = "";
      });
      $("#dnsOpts").appendChild(b);
    });
    $("#dnsNext").addEventListener("click", function () { dnsI++; renderDns(); });
  }
  renderDns();
  $("#deploySteps").innerHTML = C.deploySteps.map(function (s) { return "<li><b>" + s[0] + "</b>" + s[1] + "</li>"; }).join("");
  function renderLaunch() {
    $("#launchList").innerHTML = "";
    C.launch.forEach(function (g, gi) {
      var done = g.i.filter(function (x, i) { return S.launch[gi + "." + i]; }).length;
      var box = el("div", "cl-group", "<h3>" + g.g + " <small>" + done + "/" + g.i.length + "</small></h3>");
      g.i.forEach(function (it, i) {
        var id = gi + "." + i, lab = el("label", S.launch[id] ? "on" : "", "<input type=\"checkbox\"" + (S.launch[id] ? " checked" : "") + "><span>" + esc(it) + "</span>");
        $("input", lab).addEventListener("change", function (e) { S.launch[id] = e.target.checked; save(); renderLaunch(); });
        box.appendChild(lab);
      });
      $("#launchList").appendChild(box);
    });
    var rb = el("button", "ghost small", "↺ Checkliste zurücksetzen (neues Projekt)");
    rb.addEventListener("click", function () { S.launch = {}; save(); renderLaunch(); });
    $("#launchList").appendChild(rb);
  }
  renderLaunch();
  $("#opsCards").innerHTML = C.ops.map(function (o) { return "<div class=\"card\"><h3>" + o.t + "</h3><p>" + o.d + "</p></div>"; }).join("");

  /* ---------- Business ---------- */
  $("#bizModels").innerHTML = "";
  C.bizModels.forEach(function (m) {
    var c = el("div", "card", "<div class=\"icon\">" + m.i + "</div><h3>" + m.t + "</h3><p>" + m.d + "</p><span class=\"more\">mehr ▾</span><div class=\"ex\">" + m.ex + "</div>");
    c.addEventListener("click", function () { c.classList.toggle("open"); });
    $("#bizModels").appendChild(c);
  });
  var rate = { val: 0 };
  function field(f, store) { return "<div class=\"f\"><label for=\"f_" + f[0] + "\">" + f[1] + "</label><input type=\"number\" id=\"f_" + f[0] + "\" value=\"" + (store[f[0]] !== undefined ? store[f[0]] : f[2]) + "\">" + (f[3] ? "<small>" + f[3] + "</small>" : "") + "</div>"; }
  S.rate = S.rate || {};
  $("#rateCalc").innerHTML = "<div>" + C.rateFields.map(function (f) { return field(f, S.rate); }).join("") + "</div><div class=\"out\" id=\"rateOut\"></div>";
  function calcRate() {
    var v = {}; C.rateFields.forEach(function (f) { v[f[0]] = parseFloat($("#f_" + f[0]).value) || 0; S.rate[f[0]] = v[f[0]]; }); save();
    var bedarf = v.netto + v.kv + v.rente, gewinn = bedarf / Math.max(0.01, 1 - v.steuer / 100), umsatz = (gewinn + v.kosten) * 12;
    var tage = Math.max(1, 52 * 5 - v.urlaub - v.krank - v.weiter), stunden = tage * v.std * v.quote / 100;
    rate.val = umsatz / Math.max(1, stunden);
    $("#rateOut").innerHTML = "<p>Mindest-Stundensatz (netto)</p><div class=\"big\">" + eur(Math.ceil(rate.val)) + "</div><p class=\"meta\">zzgl. ggf. 19 % USt</p><table>" +
      "<tr><td>Bedarf pro Monat (Netto + KV + Rente)</td><td>" + eur(bedarf) + "</td></tr><tr><td>Gewinn vor Steuern pro Monat</td><td>" + eur(gewinn) + "</td></tr>" +
      "<tr><td>+ Betriebskosten pro Monat</td><td>" + eur(v.kosten) + "</td></tr><tr class=\"sum\"><td>Nötiger Jahresumsatz</td><td>" + eur(umsatz) + "</td></tr>" +
      "<tr><td>Arbeitstage / Jahr</td><td>" + tage + "</td></tr><tr><td>Abrechenbare Stunden / Jahr</td><td>" + Math.round(stunden) + "</td></tr></table>" +
      "<p class=\"meta\">Grobe Orientierung. Marktüblich für Webentwicklung in DE: ca. 60–120 €/h, Spezialisten mehr. Liegt dein Ergebnis darüber, brauchst du Spezialisierung oder Produkte.</p>";
    calcQuote();
  }
  S.quote = S.quote || {};
  $("#quoteCalc").innerHTML = "<div>" +
    "<div class=\"f\"><label for=\"q_seiten\">Anzahl Seiten (Start, Über uns, Leistungen …)</label><input type=\"number\" id=\"q_seiten\" value=\"" + (S.quote.seiten || 5) + "\"></div>" +
    "<div class=\"f\"><label for=\"q_design\">Design</label><select id=\"q_design\"><option value=\"3\">Vorlage anpassen</option><option value=\"5\">Individuelles Design</option><option value=\"8\">Aufwendig / Animationen</option></select><small>Stunden pro Seite für Design + Umsetzung</small></div>" +
    C.quoteFeatures.map(function (f) { return "<div class=\"f\"><label><input type=\"checkbox\" id=\"q_" + f[0] + "\"" + (S.quote[f[0]] ? " checked" : "") + "> " + f[1] + "</label><span class=\"meta\" style=\"text-align:right\">" + (f[2] ? f[2] + " h" : "") + "</span></div>"; }).join("") +
    "<div class=\"f\"><label for=\"q_rate\">Stundensatz (€) <small>(aus dem Rechner oben)</small></label><input type=\"number\" id=\"q_rate\"></div>" +
    "<div class=\"f\"><label for=\"q_puffer\">Puffer für Unvorhergesehenes (%)</label><input type=\"number\" id=\"q_puffer\" value=\"" + (S.quote.puffer || 20) + "\"></div></div><div class=\"out\" id=\"quoteOut\"></div>";
  $("#q_design").value = S.quote.design || "5";
  var rateTouched = !!S.quote.rate;
  function calcQuote() {
    var rEl = $("#q_rate"); if (!rateTouched) rEl.value = Math.ceil(rate.val);
    var seiten = +$("#q_seiten").value || 0, design = +$("#q_design").value, std = seiten * design, rows = [["Seiten (" + seiten + " × " + design + " h)", seiten * design]];
    C.quoteFeatures.forEach(function (f) {
      var on = $("#q_" + f[0]).checked; S.quote[f[0]] = on; if (!on) return;
      var h = f[0] === "texte" ? seiten * 2 : f[0] === "mehrspr" ? Math.round(std * 0.3) + f[2] : f[2];
      rows.push([f[1], h]); std += h;
    });
    var pm = Math.round(std * 0.15); rows.push(["Projektmanagement & Abstimmung (15 %)", pm]); std += pm;
    var puffer = Math.round(std * (+$("#q_puffer").value || 0) / 100); rows.push(["Puffer", puffer]); std += puffer;
    var r = +rEl.value || 0, netto = std * r;
    S.quote.seiten = seiten; S.quote.design = $("#q_design").value; S.quote.puffer = +$("#q_puffer").value; if (rateTouched) S.quote.rate = r; save();
    $("#quoteOut").innerHTML = "<p>Angebotspreis (netto)</p><div class=\"big\">" + eur(netto) + "</div><p class=\"meta\">" + std + " Stunden × " + eur(r) + " · brutto inkl. 19 % USt: " + eur(netto * 1.19) + "</p><table>" +
      rows.map(function (x) { return "<tr><td>" + x[0] + "</td><td>" + x[1] + " h</td></tr>"; }).join("") + "<tr class=\"sum\"><td>Summe</td><td>" + std + " h</td></tr></table>" +
      "<p class=\"meta\">Zusätzlich anbieten: Wartung ca. " + eur(Math.max(30, r)) + "–" + eur(r * 2) + " pro Monat (Updates, Backups, 1 h Änderungen).</p>";
  }
  $$("#rateCalc input").forEach(function (i) { i.addEventListener("input", calcRate); });
  $$("#quoteCalc input, #quoteCalc select").forEach(function (i) { i.addEventListener("input", function () { if (i.id === "q_rate") rateTouched = true; calcQuote(); }); i.addEventListener("change", calcQuote); });
  calcRate();
  $("#legalList").innerHTML = C.legal.map(function (l) { return "<details><summary><span>" + l.t + "</span><span class=\"tag " + l.tag + "\">" + { pflicht: "Pflicht", oft: "häufig relevant", info: "wissen" }[l.tag] + "</span></summary><div class=\"body\">" + l.b + "</div></details>"; }).join("");
  table("#shopTable", C.shopTable);

  /* ---------- Profi ---------- */
  function renderPro(i) {
    var t = C.pro[i];
    $$("#proChips .chip").forEach(function (x, n) { x.classList.toggle("active", n === i); });
    $("#proOut").innerHTML = "<div class=\"pro\"><div class=\"card\"><h3>" + t.t + "</h3>" + t.k + "</div><div><div class=\"card\"><h3>Beispiel</h3><pre>" + esc(t.c) + "</pre></div><div class=\"card checklist\" style=\"display:block;margin-top:1rem\"><h3>Prüfliste</h3></div></div></div>";
    var box = $("#proOut .checklist");
    t.l.forEach(function (it, j) {
      var id = i + "." + j, lab = el("label", S.proChecks[id] ? "on" : "", "<input type=\"checkbox\"" + (S.proChecks[id] ? " checked" : "") + "><span>" + esc(it) + "</span>");
      $("input", lab).addEventListener("change", function (e) { S.proChecks[id] = e.target.checked; save(); renderPro(i); });
      box.appendChild(lab);
    });
  }
  C.pro.forEach(function (t, i) { var b = el("button", "chip", t.t); b.addEventListener("click", function () { renderPro(i); }); $("#proChips").appendChild(b); });
  renderPro(0);

  /* ---------- Quiz ---------- */
  var cats = ["Alle"].concat(C.quiz.map(function (q) { return q.cat; }).filter(function (c, i, a) { return a.indexOf(c) === i; })), qcat = "Alle", R;
  cats.forEach(function (c) { var b = el("button", "chip" + (c === "Alle" ? " active" : ""), c); b.addEventListener("click", function () { qcat = c; $$("#quizModes .chip").forEach(function (x) { x.classList.toggle("active", x === b); }); startQuiz(); }); $("#quizModes").appendChild(b); });
  function startQuiz() {
    var pool = C.quiz.filter(function (q) { return qcat === "Alle" || q.cat === qcat; });
    R = { qs: shuffle(pool).slice(0, qcat === "Alle" ? 15 : pool.length), i: 0, right: 0 }; R.first = R.qs.length; renderQ();
  }
  function renderQ() {
    var box = $("#quizBox");
    if (R.i >= R.qs.length) {
      var pct = Math.round(R.right / R.first * 100);
      if (qcat === "Alle" && pct > S.quizBest) { S.quizBest = pct; save(); progress(); }
      box.innerHTML = "<div class=\"q-result\"><p>Ergebnis (erster Versuch)</p><div class=\"big\">" + R.right + " / " + R.first + "</div><p>" + (pct >= 90 ? "Hervorragend! 🚀" : pct >= 70 ? "Gut! Ein paar Lücken noch schließen." : "Schau dir die Bereiche noch einmal an und versuch es erneut.") + "</p><p class=\"note\">Bestes Gesamtergebnis (Runde „Alle“): " + S.quizBest + " %</p><button id=\"qAgain\">Neue Runde</button></div>";
      $("#qAgain").addEventListener("click", startQuiz); return;
    }
    var q = R.qs[R.i], retry = R.i >= R.first;
    box.innerHTML = "<div class=\"q-head\"><span>" + (retry ? "🔁 Wiederholung" : "Frage " + (R.i + 1) + " von " + R.first) + " · " + q.cat + "</span><span>✔ " + R.right + "</span></div><div class=\"q-text\">" + q.q + "</div><div class=\"q-opts\"></div><div class=\"q-expl\"></div><div class=\"q-foot\"><button style=\"display:none\">Weiter →</button></div>";
    var opts = shuffle(q.o.map(function (t, i) { return { t: t, ok: i === q.a }; }));
    opts.forEach(function (o) {
      var b = el("button", "q-opt", o.t);
      b.addEventListener("click", function () {
        $$(".q-opt", box).forEach(function (x, n) { x.disabled = true; if (opts[n].ok) x.classList.add("right"); });
        if (!o.ok) b.classList.add("wrong");
        if (!retry && o.ok) R.right++;
        if (!retry && !o.ok) R.qs.push(q);
        var ex = $(".q-expl", box); ex.innerHTML = (o.ok ? "✅ <b>Richtig!</b> " : "❌ <b>Nicht ganz.</b> ") + q.e; ex.classList.add("show");
        var nb = $(".q-foot button", box); nb.style.display = ""; nb.focus(); nb.addEventListener("click", function () { R.i++; renderQ(); });
      });
      $(".q-opts", box).appendChild(b);
    });
  }
  startQuiz();

  /* ---------- Glossar ---------- */
  function renderGloss() {
    var q = $("#glossSearch").value.trim().toLowerCase();
    $("#glossList").innerHTML = C.glossary.filter(function (g) { return !q || (g[0] + " " + g[1]).toLowerCase().indexOf(q) >= 0; }).sort(function (a, b) { return a[0].localeCompare(b[0], "de"); })
      .map(function (g) { return "<div><dt>" + esc(g[0]) + "</dt><dd>" + esc(g[1]) + "</dd></div>"; }).join("") || "<p class=\"note\">Kein Begriff gefunden.</p>";
  }
  $("#glossSearch").addEventListener("input", renderGloss);
  renderGloss();

  /* Schnittstelle für Erweiterungsmodule (js/mod-*.js) */
  window.WW = { S: S, save: save, $: $, $$: $$, el: el, esc: esc, shuffle: shuffle, table: table, eur: eur, show: show, progress: progress, parts: PARTS, TABS: TABS, openLesson: openLesson, KEY: KEY };
  window.addEventListener("load", function () { show(location.hash.replace(/^#\/?/, "") || "start"); });
})();
