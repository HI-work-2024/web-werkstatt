/* Web-Werkstatt 3.1 · Themen-Optik je Seite: Farbe, technisches Muster, Illustration
   Alle Grafiken als SVG im Code (keine externen Bilder). © 2026 Ibtissam Hommada */
(function () {
  var W = window.WW, $$ = W.$$;

  /* ---------- Muster (Kacheln) ---------- */
  function uri(svg) { return "url(\"data:image/svg+xml," + encodeURIComponent(svg) + "\")"; }
  function tile(w, h, body, c) { return "<svg xmlns='http://www.w3.org/2000/svg' width='" + w + "' height='" + h + "' viewBox='0 0 " + w + " " + h + "'><g fill='none' stroke='" + c + "' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round'>" + body + "</g></svg>"; }
  function txt(x, y, t, c, s) { return "<text x='" + x + "' y='" + y + "' fill='" + c + "' stroke='none' font-family='Consolas,monospace' font-size='" + (s || 13) + "'>" + t + "</text>"; }
  var PAT = {
    circuit: function (c) { return tile(140, 140, "<path d='M0 30h40l15 15h45M100 45v40l20 20h20M30 140v-35l20-20h30M140 70h-25M70 0v20l-15 15'/><circle cx='100' cy='45' r='4'/><circle cx='80' cy='85' r='4'/><circle cx='115' cy='70' r='3'/><circle cx='55' cy='35' r='3'/><rect x='18' y='60' width='26' height='18' rx='3'/><path d='M22 60v-6M30 60v-6M38 60v-6M22 78v6M30 78v6M38 78v6'/>", c); },
    binary: function (c) { return tile(160, 110, txt(6, 22, "01101001", c) + txt(40, 50, "1010 0111", c) + txt(4, 78, "0011010", c) + txt(70, 104, "110 0101", c), c); },
    grid: function (c) { return tile(100, 100, "<path d='M0 0h100M0 0v100' stroke-width='1.6'/><path d='M0 25h100M0 50h100M0 75h100M25 0v100M50 0v100M75 0v100' stroke-width='.6'/><circle cx='50' cy='50' r='14' stroke-dasharray='3 3'/>", c); },
    nodes: function (c) { return tile(160, 160, "<path d='M20 30L80 60L140 25M80 60L60 120L130 135M80 60L130 135M20 30L60 120'/><circle cx='20' cy='30' r='5'/><circle cx='80' cy='60' r='7'/><circle cx='140' cy='25' r='4'/><circle cx='60' cy='120' r='5'/><circle cx='130' cy='135' r='6'/>", c); },
    braces: function (c) { return tile(170, 120, txt(8, 30, "&lt;/&gt;", c, 16) + txt(90, 30, "{ }", c, 16) + txt(30, 72, "( ) =&gt;", c, 14) + txt(110, 80, ";", c, 18) + txt(6, 108, "[ ]", c, 15) + txt(78, 110, "&lt;div&gt;", c, 13), c); },
    db: function (c) { return tile(130, 120, "<ellipse cx='35' cy='25' rx='20' ry='7'/><path d='M15 25v28c0 4 9 7 20 7s20-3 20-7V25M15 39c0 4 9 7 20 7s20-3 20-7'/><path d='M75 75h45v32H75zM75 86h45M75 97h45M90 75v32M105 75v32' stroke-width='1'/>", c); },
    branch: function (c) { return tile(120, 150, "<path d='M30 0v150M30 40c0 25 50 20 50 45v65'/><circle cx='30' cy='20' r='6'/><circle cx='30' cy='75' r='6'/><circle cx='30' cy='125' r='6'/><circle cx='80' cy='100' r='6'/>", c); },
    terminal: function (c) { return tile(180, 110, txt(8, 24, "$ ssh deploy@server", c, 12) + txt(8, 50, "$ sudo systemctl restart", c, 12) + txt(8, 76, "&gt; 200 OK", c, 12) + txt(8, 102, "$ _", c, 12), c); },
    cloud: function (c) { return tile(160, 120, "<path d='M30 60a14 14 0 0 1 4-27 20 20 0 0 1 37-3 15 15 0 0 1 9 30z'/><path d='M100 95h40v-14h-40zM100 81v-14h40v14M108 74h2M108 88h2'/><circle cx='20' cy='105' r='2'/><circle cx='140' cy='20' r='2'/>", c); },
    chart: function (c) { return tile(140, 120, "<path d='M15 105h110M25 105V75M45 105V60M65 105V80M85 105V45M105 105V30' stroke-width='5' opacity='.8'/><path d='M20 70L45 50L70 62L100 25L125 15' stroke-dasharray='4 4'/>", c); },
    hex: function (c) { return tile(104, 120, "<path d='M52 5l45 26v52l-45 26-45-26V31z'/><path d='M52 35l20 12v24l-20 12-20-12V47z' stroke-width='.8'/>", c); },
    cards: function (c) { return tile(150, 130, "<rect x='15' y='20' width='50' height='34' rx='6' transform='rotate(-8 40 37)'/><rect x='80' y='70' width='50' height='34' rx='6' transform='rotate(7 105 87)'/>" + txt(33, 44, "?", c, 16) + txt(100, 94, "✓", c, 15), c); },
    question: function (c) { return tile(120, 120, txt(15, 40, "?", c, 30) + txt(70, 95, "?", c, 22) + "<circle cx='90' cy='30' r='10'/><path d='M85 30l4 4 7-8'/>", c); },
    lines: function (c) { return tile(120, 40, "<path d='M0 30h120' stroke-width='.8'/><path d='M14 0v40' stroke-width='.5' opacity='.6'/>", c); },
    letters: function (c) { return tile(150, 120, txt(10, 35, "A", c, 26) + txt(70, 60, "Ω", c, 22) + txt(30, 105, "λ", c, 24) + txt(110, 100, "Z", c, 20), c); },
    dots: function (c) { return tile(30, 30, "<circle cx='15' cy='15' r='1.4' fill='" + c + "'/>", c); },
    route: function (c) { return tile(180, 140, "<path d='M10 120C60 120 40 40 90 40S130 110 170 20' stroke-dasharray='5 6'/><circle cx='10' cy='120' r='5'/><circle cx='90' cy='40' r='5'/><path d='M170 20v-16l14 6-14 6'/>", c); }
  };

  /* ---------- Illustrationen (weiß, für den Seitenkopf) ---------- */
  var S0 = "<svg class='illu' viewBox='0 0 260 170' aria-hidden='true' fill='none' stroke='#fff' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'>";
  function win(inner, title) { return "<rect x='20' y='14' width='220' height='142' rx='14' fill='rgba(255,255,255,.12)'/><path d='M20 42h220'/><circle cx='40' cy='28' r='4' fill='#fff'/><circle cx='54' cy='28' r='4' fill='rgba(255,255,255,.6)'/><circle cx='68' cy='28' r='4' fill='rgba(255,255,255,.35)'/>" + (title ? "<text x='130' y='33' fill='#fff' stroke='none' font-size='12' font-family='Consolas,monospace' style='text-anchor:middle'>" + title + "</text>" : "") + inner; }
  function t(x, y, s, size, op) { return "<text x='" + x + "' y='" + y + "' fill='rgba(255,255,255," + (op || 1) + ")' stroke='none' font-family='Consolas,monospace' font-size='" + (size || 13) + "'>" + s + "</text>"; }
  var ILL = {
    route: "<path d='M25 140C80 140 60 60 120 70S170 140 225 40' stroke-dasharray='8 9'/>" + [[25, 140], [72, 100], [120, 70], [165, 110], [205, 70]].map(function (p, i) { return "<circle cx='" + p[0] + "' cy='" + p[1] + "' r='10' fill='rgba(255,255,255," + (i < 3 ? .9 : .25) + ")'/>"; }).join("") + "<path d='M225 40V8l26 10-26 10' fill='rgba(255,255,255,.9)'/>",
    globe: "<circle cx='130' cy='85' r='62' fill='rgba(255,255,255,.1)'/><ellipse cx='130' cy='85' rx='26' ry='62'/><path d='M68 85h124M78 55h104M78 115h104'/><circle cx='30' cy='40' r='9' fill='#fff'/><circle cx='232' cy='130' r='9' fill='#fff'/><circle cx='228' cy='30' r='7' fill='rgba(255,255,255,.6)'/><path d='M38 45l40 18M224 125l-38-14M222 35l-38 22' stroke-dasharray='4 5'/>",
    code: win(t(36, 68, "&lt;main&gt;", 14) + t(52, 90, "&lt;h1&gt;Hallo&lt;/h1&gt;", 14, .85) + t(52, 112, "display: grid;", 14, .7) + t(36, 134, "&lt;/main&gt;", 14) + "<path d='M196 120l14 0' stroke-width='4'/>", "index.html"),
    db: "<ellipse cx='95' cy='38' rx='55' ry='16' fill='rgba(255,255,255,.18)'/><path d='M40 38v86c0 9 25 16 55 16s55-7 55-16V38M40 67c0 9 25 16 55 16s55-7 55-16M40 96c0 9 25 16 55 16s55-7 55-16'/><rect x='168' y='60' width='76' height='70' rx='8' fill='rgba(255,255,255,.12)'/><path d='M168 80h76M168 98h76M168 114h76M196 60v70' stroke-width='2'/>" + t(176, 75, "id", 11) + t(203, 75, "name", 11),
    branch: "<path d='M60 155V15M60 60c0 30 90 20 90 55v40M150 115c0-25 50-25 50-55V30'/>" + [[60, 30], [60, 75], [60, 135], [150, 95], [150, 135], [200, 55]].map(function (p) { return "<circle cx='" + p[0] + "' cy='" + p[1] + "' r='11' fill='rgba(255,255,255,.9)' stroke='none'/>"; }).join("") + t(78, 34, "main", 13) + t(166, 100, "feature", 13),
    terminal: "<rect x='15' y='14' width='230' height='142' rx='14' fill='rgba(0,0,0,.28)'/><path d='M15 42h230'/>" + t(30, 33, "deploy@server: ~", 12, .8) + t(30, 66, "$ sudo apt install nginx", 13) + t(30, 88, "$ sudo ufw enable", 13) + t(30, 110, "$ curl -I https://…", 13, .85) + t(30, 132, "HTTP/1.1 200 OK", 13, .95) + "<rect x='205' y='120' width='10' height='16' fill='#fff' stroke='none'/>",
    api: "<rect x='14' y='50' width='80' height='70' rx='12' fill='rgba(255,255,255,.14)'/><rect x='166' y='50' width='80' height='70' rx='12' fill='rgba(255,255,255,.14)'/>" + t(34, 92, "App", 16) + t(184, 92, "API", 16) + "<path d='M100 70h58l-8-7M158 100h-58l8 7'/>" + t(106, 60, "GET /api", 10) + t(106, 124, "200 JSON", 10),
    gear: "<circle cx='95' cy='85' r='34' stroke-dasharray='12 8' stroke-width='14' opacity='.9'/><circle cx='95' cy='85' r='14' fill='rgba(255,255,255,.25)'/><circle cx='178' cy='55' r='20' stroke-dasharray='8 6' stroke-width='10' opacity='.7'/><circle cx='178' cy='55' r='7'/><path d='M150 140l60-60M200 70l14-14a12 12 0 0 1 16 16l-14 14'/>",
    trophy: "<path d='M95 30h70v35a35 35 0 0 1-70 0zM95 40H72a18 18 0 0 0 23 30M165 40h23a18 18 0 0 1-23 30M130 100v25M105 140h50v-15h-50z' fill='rgba(255,255,255,.14)'/><path d='M40 40l4 10 10 1-8 7 3 10-9-6-9 6 3-10-8-7 10-1z' fill='#fff' stroke='none'/><path d='M215 100l3 7 7 1-5 5 2 7-7-4-7 4 2-7-5-5 7-1z' fill='rgba(255,255,255,.7)' stroke='none'/>",
    rocket: "<path d='M130 20c26 18 32 52 22 82h-44c-10-30-4-64 22-82z' fill='rgba(255,255,255,.2)'/><circle cx='130' cy='60' r='10'/><path d='M108 102l-16 18 22-4M152 102l16 18-22-4M120 112c2 14 8 22 10 26 2-4 8-12 10-26' /><path d='M30 150a18 18 0 0 1 8-34 26 26 0 0 1 48-4 20 20 0 0 1 14 38z' fill='rgba(255,255,255,.18)'/><rect x='180' y='110' width='56' height='16' rx='4'/><rect x='180' y='132' width='56' height='16' rx='4'/><circle cx='190' cy='118' r='2' fill='#fff'/><circle cx='190' cy='140' r='2' fill='#fff'/>",
    chart: "<path d='M30 150h210' /><path d='M50 150V110M85 150V90M120 150V100M155 150V65M190 150V45' stroke-width='18' opacity='.85'/><path d='M40 100l45-25 35 10 40-35 45-25' stroke-dasharray='6 6'/>" + t(200, 40, "€", 34),
    briefcase: "<rect x='45' y='60' width='130' height='90' rx='12' fill='rgba(255,255,255,.15)'/><path d='M90 60V45a8 8 0 0 1 8-8h24a8 8 0 0 1 8 8v15M45 95h130'/><path d='M195 150l0-30h20v-30h20v-30' /><path d='M222 40l13-13 13 13' />",
    cards: "<rect x='40' y='40' width='120' height='80' rx='12' fill='rgba(255,255,255,.12)' transform='rotate(-10 100 80)'/><rect x='80' y='50' width='120' height='80' rx='12' fill='rgba(255,255,255,.2)' transform='rotate(6 140 90)'/>" + t(128, 102, "?", 34) + "<path d='M210 30l8 8 16-18' stroke-width='4'/>",
    question: "<path d='M40 30h150a16 16 0 0 1 16 16v60a16 16 0 0 1-16 16H90l-30 26v-26H40a16 16 0 0 1-16-16V46a16 16 0 0 1 16-16z' fill='rgba(255,255,255,.15)'/>" + t(98, 100, "?", 56) + "<circle cx='222' cy='130' r='18'/><path d='M213 130l7 7 12-14'/>",
    cap: "<path d='M130 30l100 40-100 40-100-40z' fill='rgba(255,255,255,.2)'/><path d='M70 85v35c0 12 27 22 60 22s60-10 60-22V85M230 70v45'/><circle cx='230' cy='122' r='6' fill='#fff'/>",
    doc: "<path d='M70 15h90l30 30v110H70z' fill='rgba(255,255,255,.14)'/><path d='M160 15v30h30M90 70h80M90 90h80M90 110h60M90 130h70' stroke-width='2.5'/><path d='M200 120l30-30 10 10-30 30h-10z' fill='rgba(255,255,255,.5)'/>",
    book: "<path d='M130 45c-25-15-60-15-95-5v105c35-10 70-10 95 5 25-15 60-15 95-5V40c-35-10-70-10-95 5zM130 45v105' fill='rgba(255,255,255,.13)'/>" + t(58, 95, "A–Z", 20) + "<path d='M150 75h55M150 95h55M150 115h40' stroke-width='2'/>",
    info: "<circle cx='130' cy='85' r='60' fill='rgba(255,255,255,.14)'/><circle cx='130' cy='58' r='7' fill='#fff' stroke='none'/><path d='M130 78v42' stroke-width='9'/>",
    shield: "<path d='M130 18l75 28v40c0 40-32 64-75 76-43-12-75-36-75-76V46z' fill='rgba(255,255,255,.15)'/><path d='M100 88l22 22 40-44' stroke-width='6'/>"
  };

  /* ---------- Zuordnung Seite → Farbe, Muster, Illustration ---------- */
  var T = {
    start:    ["#4c1d95", "#7c3aed", "circuit", null],
    pfad:     ["#4338ca", "#7c3aed", "route", "route"],
    web:      ["#1d4ed8", "#0891b2", "nodes", "globe"],
    backend:  ["#0f766e", "#0891b2", "circuit", "api"],
    tools:    ["#c2410c", "#d97706", "grid", "gear"],
    profi:    ["#9f1239", "#d97706", "hex", "trophy"],
    labor:    ["#4338ca", "#9333ea", "braces", "code"],
    sql:      ["#0369a1", "#2563eb", "db", "db"],
    git:      ["#c2410c", "#e11d48", "branch", "branch"],
    server:   ["#065f46", "#15803d", "terminal", "terminal"],
    hosting:  ["#1e3a8a", "#0e7490", "cloud", "rocket"],
    business: ["#047857", "#0f766e", "chart", "chart"],
    karriere: ["#7e22ce", "#db2777", "nodes", "briefcase"],
    karten:   ["#a21caf", "#db2777", "cards", "cards"],
    quiz:     ["#b45309", "#dc2626", "question", "question"],
    pruefung: ["#3730a3", "#a16207", "hex", "cap"],
    spick:    ["#334155", "#2563eb", "lines", "doc"],
    glossar:  ["#92400e", "#b45309", "letters", "book"],
    ueber:    ["#475569", "#6d28d9", "dots", "info"]
  };
  var root = document.documentElement;
  function dark() { return root.getAttribute("data-theme") === "dark"; }
  function apply(tab) {
    var th = T[tab] || T.start;
    root.style.setProperty("--c1", th[0]);
    root.style.setProperty("--c2", th[1]);
    root.style.setProperty("--pat-banner", uri(PAT[th[2]]("rgba(255,255,255,0.16)")));
    root.style.setProperty("--pat-body", uri(PAT[th[2]](dark() ? "rgba(255,255,255,0.035)" : "rgba(30,40,80,0.05)")));
    document.body.setAttribute("data-page", tab);
  }
  function illustrate(tab) {
    var th = T[tab], p = document.getElementById(tab); if (!th || !th[3] || !p) return;
    var intro = p.querySelector(":scope > .intro");
    if (intro && !intro.querySelector(".illu")) { intro.insertAdjacentHTML("beforeend", S0 + ILL[th[3]] + "</svg>"); intro.classList.add("themed"); }
  }
  Object.keys(T).forEach(function (tab) {
    illustrate(tab);
    var p = document.getElementById(tab);
    if (p) new MutationObserver(function () { illustrate(tab); }).observe(p, { childList: true });
  });
  var current = "start";
  document.addEventListener("ww:show", function (e) { current = e.detail; apply(current); });
  new MutationObserver(function () { apply(current); }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  apply((location.hash.replace(/^#\/?/, "") || "start"));
  W.themeOf = function (tab) { return T[tab]; };
})();
