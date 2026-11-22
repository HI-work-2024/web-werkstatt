/* DNS-Zonen-Editor mit Szenarien (im Reiter Hosting) */
(function () {
  var W = window.WW, S = W.S, $ = W.$, el = W.el, esc = W.esc;
  S.zones = S.zones || {}; S.zoneDone = S.zoneDone || [];
  W.parts.push({ w: 3, f: function () { return S.zoneDone.length / SC.length; } });
  var PARK = { type: "A", name: "@", value: "192.0.2.1", prio: "", ttl: 3600, note: "Parkseite des Registrars" };
  function norm(v) { return String(v || "").trim().toLowerCase().replace(/\.$/, "").replace(/^"|"$/g, ""); }
  function recs(z, type, name) { return z.filter(function (r) { return r.type === type && norm(r.name) === name; }); }
  function hasVal(z, type, name, val) { return recs(z, type, name).some(function (r) { return norm(r.value) === norm(val); }); }

  var SC = [
    { t: "GitHub Pages mit eigener Domain", d: "Deine Seite liegt auf <code>lea-muster.github.io</code>. <code>meine-seite.de</code> (ohne www) soll auf die vier GitHub-Pages-IPs zeigen (<code>185.199.108.153</code>, <code>185.199.109.153</code>, <code>185.199.110.153</code>, <code>185.199.111.153</code>), <code>www</code> per Alias auf <code>lea-muster.github.io</code>. Die Parkseite des Registrars muss weg.",
      req: [
        ["4 A-Einträge für @ auf die GitHub-IPs", function (z) { return ["185.199.108.153", "185.199.109.153", "185.199.110.153", "185.199.111.153"].every(function (ip) { return hasVal(z, "A", "@", ip); }); }],
        ["Keine weiteren A-Einträge für @ (Parkseite entfernt)", function (z) { return recs(z, "A", "@").length === 4; }],
        ["CNAME www → lea-muster.github.io", function (z) { return hasVal(z, "CNAME", "www", "lea-muster.github.io"); }]
      ], tip: "Ein Name (@) kann mehrere A-Einträge haben; der Browser nimmt einen davon (Ausfallsicherheit). Für Subdomains wie www ist CNAME ideal." },
    { t: "E-Mail beim Anbieter (mit SPF & DMARC)", d: "E-Mails für <code>@meine-seite.de</code> sollen beim Anbieter ankommen: Hauptserver <code>mx1.mailbox.example</code> (Priorität 10), Ersatz <code>mx2.mailbox.example</code> (20). Lege SPF an (<code>v=spf1 include:_spf.mailbox.example ~all</code>) und eine DMARC-Richtlinie unter dem Namen <code>_dmarc</code> (<code>v=DMARC1; p=quarantine; rua=mailto:dmarc@meine-seite.de</code>).",
      req: [
        ["MX @ mx1.mailbox.example mit Priorität 10", function (z) { return recs(z, "MX", "@").some(function (r) { return norm(r.value) === "mx1.mailbox.example" && +r.prio === 10; }); }],
        ["MX @ mx2.mailbox.example mit höherer Zahl (Ersatz)", function (z) { var a = recs(z, "MX", "@").filter(function (r) { return norm(r.value) === "mx1.mailbox.example"; })[0], b = recs(z, "MX", "@").filter(function (r) { return norm(r.value) === "mx2.mailbox.example"; })[0]; return a && b && +b.prio > +a.prio; }],
        ["SPF als TXT auf @", function (z) { return recs(z, "TXT", "@").some(function (r) { return /^v=spf1 .*include:_spf\.mailbox\.example .*~all$/.test(norm(r.value)); }); }],
        ["Nur ein SPF-Eintrag", function (z) { return recs(z, "TXT", "@").filter(function (r) { return /^v=spf1/.test(norm(r.value)); }).length === 1; }],
        ["DMARC als TXT auf _dmarc", function (z) { return recs(z, "TXT", "_dmarc").some(function (r) { return /^v=dmarc1;\s*p=(quarantine|reject|none)/.test(norm(r.value)); }); }]
      ], tip: "Niedrigere MX-Priorität = wird zuerst versucht. Mehrere SPF-Einträge machen SPF ungültig, daher immer zu einem zusammenfassen." },
    { t: "Shop auf einer Subdomain", d: "Dein Shopify-Shop soll unter <code>shop.meine-seite.de</code> erreichbar sein. Shopify verlangt einen CNAME auf <code>shops.myshopify.com</code>. Außerdem will Shopify den Domainbesitz per TXT-Eintrag <code>shopify-verification=7f3a9c</code> auf <code>@</code> prüfen.",
      req: [
        ["CNAME shop → shops.myshopify.com", function (z) { return hasVal(z, "CNAME", "shop", "shops.myshopify.com"); }],
        ["Kein weiterer Eintrag auf „shop“ (CNAME muss allein stehen)", function (z) { return z.filter(function (r) { return norm(r.name) === "shop"; }).length === 1; }],
        ["Verifizierungs-TXT auf @", function (z) { return hasVal(z, "TXT", "@", "shopify-verification=7f3a9c"); }]
      ], tip: "Ein CNAME darf nicht mit anderen Einträgen desselben Namens kombiniert werden, und am Domain-Apex (@) ist CNAME nicht erlaubt." },
    { t: "Eigener Server mit IPv4 & IPv6", d: "Dein VPS hat <code>203.0.113.10</code> und <code>2001:db8::10</code>. <code>meine-seite.de</code> und <code>www.meine-seite.de</code> sollen beide über IPv4 <b>und</b> IPv6 erreichbar sein. Parkseite entfernen. Setze die TTL des A-Eintrags für @ auf <b>300</b> (5 Min.), weil du bald umziehen willst.",
      req: [
        ["A @ → 203.0.113.10 (einziger A-Eintrag)", function (z) { var a = recs(z, "A", "@"); return a.length === 1 && norm(a[0].value) === "203.0.113.10"; }],
        ["AAAA @ → 2001:db8::10", function (z) { return hasVal(z, "AAAA", "@", "2001:db8::10"); }],
        ["www erreichbar (CNAME auf meine-seite.de oder eigene A + AAAA)", function (z) { return hasVal(z, "CNAME", "www", "meine-seite.de") || (hasVal(z, "A", "www", "203.0.113.10") && hasVal(z, "AAAA", "www", "2001:db8::10")); }],
        ["TTL von A @ = 300", function (z) { var a = recs(z, "A", "@"); return a.length === 1 && +a[0].ttl === 300; }]
      ], tip: "Kurze TTL vor einem Umzug: Resolver fragen dann schneller neu nach. Danach wieder erhöhen (z. B. 3600)." }
  ];

  var box = el("div", "", "");
  var anchor = $("#dnsQuiz");
  anchor.insertAdjacentElement("afterend", box);
  box.insertAdjacentHTML("beforebegin", "<h2>DNS-Zonen-Editor: selbst konfigurieren</h2><p class=\"note\">So sieht die DNS-Verwaltung bei deinem Registrar aus. Wähle ein Szenario, lege die nötigen Einträge an und prüfe. <code>@</code> steht für die Domain selbst (<code>meine-seite.de</code>).</p>");
  box.className = "zone";
  var cur = 0;
  function zone() { if (!S.zones[cur]) S.zones[cur] = [JSON.parse(JSON.stringify(PARK))]; return S.zones[cur]; }
  function render() {
    var sc = SC[cur], z = zone();
    box.innerHTML = "<div class=\"chips\">" + SC.map(function (s, i) { return "<button class=\"chip" + (i === cur ? " active" : "") + "\" data-i=\"" + i + "\">" + (S.zoneDone.indexOf(i) >= 0 ? "✓ " : "") + (i + 1) + ". " + s.t + "</button>"; }).join("") + "</div>" +
      "<div class=\"lesson-head\"><h3>" + sc.t + "</h3><div class=\"task\">" + sc.d + "</div></div>" +
      "<div class=\"table-wrap\"><table class=\"cmp zt\"><thead><tr><th>Typ</th><th>Name</th><th>Wert</th><th>Prio</th><th>TTL</th><th></th></tr></thead><tbody>" +
      z.map(function (r, i) { return "<tr><td><b>" + esc(r.type) + "</b></td><td>" + esc(r.name) + "</td><td class=\"mono\">" + esc(r.value) + (r.note ? " <span class=\"meta\">(" + esc(r.note) + ")</span>" : "") + "</td><td>" + esc(r.prio || "") + "</td><td>" + esc(r.ttl) + "</td><td><button class=\"ghost small\" data-del=\"" + i + "\" aria-label=\"Eintrag löschen\">🗑</button></td></tr>"; }).join("") +
      "<tr class=\"zadd\"><td><select id=\"zType\"><option>A</option><option>AAAA</option><option>CNAME</option><option>MX</option><option>TXT</option></select></td><td><input id=\"zName\" value=\"@\" size=\"8\" aria-label=\"Name\"></td><td><input id=\"zVal\" placeholder=\"Wert\" aria-label=\"Wert\" style=\"width:100%\"></td><td><input id=\"zPrio\" size=\"3\" placeholder=\"10\" aria-label=\"Priorität (nur MX)\"></td><td><input id=\"zTtl\" size=\"5\" value=\"3600\" aria-label=\"TTL\"></td><td><button class=\"small\" id=\"zAdd\">+ Hinzufügen</button></td></tr></tbody></table></div>" +
      "<div class=\"ed-actions\"><button id=\"zCheck\">✔ Prüfen</button><button class=\"ghost\" id=\"zTip\">💡 Tipp</button><button class=\"ghost\" id=\"zReset\">↺ Zone zurücksetzen</button></div><div id=\"zOut\" class=\"checks\"></div>";
    $$(".chip", box).forEach(function (b) { b.addEventListener("click", function () { cur = +b.dataset.i; render(); }); });
    $$("[data-del]", box).forEach(function (b) { b.addEventListener("click", function () { z.splice(+b.dataset.del, 1); W.save(); render(); }); });
    $("#zAdd").addEventListener("click", function () {
      var r = { type: $("#zType").value, name: $("#zName").value.trim() || "@", value: $("#zVal").value.trim(), prio: $("#zPrio").value.trim(), ttl: +$("#zTtl").value || 3600 };
      var err = !r.value ? "Wert fehlt." : r.type === "A" && !/^(\d{1,3}\.){3}\d{1,3}$/.test(r.value) ? "Ein A-Eintrag braucht eine IPv4-Adresse." : r.type === "AAAA" && !/:/.test(r.value) ? "Ein AAAA-Eintrag braucht eine IPv6-Adresse." : r.type === "CNAME" && r.name === "@" ? "CNAME ist am Domain-Apex (@) nicht erlaubt." : r.type === "MX" && !/^\d+$/.test(r.prio) ? "MX braucht eine Priorität (Zahl)." : r.type === "CNAME" && /^(\d{1,3}\.){3}\d{1,3}$/.test(r.value) ? "Ein CNAME zeigt auf einen Namen, nicht auf eine IP (dafür A)." : null;
      if (err) { $("#zOut").innerHTML = "<div class=\"c n\">✖ " + err + "</div>"; return; }
      z.push(r); W.save(); render();
    });
    $("#zCheck").addEventListener("click", function () {
      var res = sc.req.map(function (q) { return [q[0], q[1](z)]; }), all = res.every(function (x) { return x[1]; });
      $("#zOut").innerHTML = res.map(function (x) { return "<div class=\"c " + (x[1] ? "y" : "n") + "\">" + (x[1] ? "✔ " : "✖ ") + x[0] + "</div>"; }).join("") + (all ? "<div class=\"win\">🎉 Zone korrekt konfiguriert! (In echt dauert es je nach TTL Minuten bis Stunden, bis alle Resolver die Änderung sehen.)</div>" : "");
      if (all && S.zoneDone.indexOf(cur) < 0) { S.zoneDone.push(cur); W.save(); W.progress(); }
    });
    $("#zTip").addEventListener("click", function () { $("#zOut").innerHTML = "<div class=\"hint\">💡 " + sc.tip + "</div>"; });
    $("#zReset").addEventListener("click", function () { delete S.zones[cur]; W.save(); render(); });
  }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  render();
})();
