/* ============================================================
   CINE MODULE — CALC (savings / ROI calculator)
   Archetype 1 of the Cinematic Kit interactive library.
   Sliders + numeric inputs, animated computed outputs, result
   panel with the site's real CTA. Dependency-free.

   Mount:
     <div class="cine-mod" data-cine-mod="calc"
          style="--cine-accent:#…;--cine-accent-2:#…">
       <noscript>…fallback with CTA…</noscript>
       <script type="application/json" class="cine-mod-config">
       { …config… }
       </script>
     </div>
   Config contract: see modules/README.md.

   Formulas are config expressions over input ids and earlier
   output ids, evaluated by a small safe parser (+ - * / parens,
   unary minus, and max()/min() calls — v3.2). No eval, ever.
   Every assumption is a control the visitor sets — the module
   ships no hidden constants except those the config prints on
   its face.
   ============================================================ */
(function () {
  "use strict";
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- formatting ---------- */
  function fmt(v, format) {
    if (!isFinite(v)) return "—";
    if (format === "money") {
      return "$" + Math.round(v).toLocaleString("en-US");
    }
    if (format === "pct") {
      return (Math.round(v * 10) / 10).toLocaleString("en-US") + "%";
    }
    return Math.round(v).toLocaleString("en-US");
  }
  function fmtInput(v, format) {
    if (format === "money") return "$" + Number(v).toLocaleString("en-US");
    if (format === "pct") return Number(v).toLocaleString("en-US") + "%";
    return Number(v).toLocaleString("en-US");
  }

  /* ---------- safe expression evaluator ---------- */
  function tokenize(src) {
    var tokens = [], i = 0, c;
    while (i < src.length) {
      c = src[i];
      if (c === " " || c === "\t") { i++; continue; }
      if ("+-*/(),".indexOf(c) >= 0) { tokens.push({ t: c }); i++; continue; }
      if (/[0-9.]/.test(c)) {
        var num = "";
        while (i < src.length && /[0-9.]/.test(src[i])) num += src[i++];
        tokens.push({ t: "num", v: parseFloat(num) });
        continue;
      }
      if (/[A-Za-z_]/.test(c)) {
        var id = "";
        while (i < src.length && /[A-Za-z0-9_]/.test(src[i])) id += src[i++];
        tokens.push({ t: "id", v: id });
        continue;
      }
      throw new Error("calc: bad character in expression: " + c);
    }
    return tokens;
  }
  function evaluate(src, scope) {
    var tokens = tokenize(src), pos = 0;
    function peek() { return tokens[pos]; }
    function next() { return tokens[pos++]; }
    function parseExpr() {
      var v = parseTerm();
      while (peek() && (peek().t === "+" || peek().t === "-")) {
        var op = next().t, r = parseTerm();
        v = op === "+" ? v + r : v - r;
      }
      return v;
    }
    function parseTerm() {
      var v = parseFactor();
      while (peek() && (peek().t === "*" || peek().t === "/")) {
        var op = next().t, r = parseFactor();
        v = op === "*" ? v * r : v / r;
      }
      return v;
    }
    function parseFactor() {
      var tk = next();
      if (!tk) throw new Error("calc: unexpected end of expression");
      if (tk.t === "-") return -parseFactor();
      if (tk.t === "(") { var v = parseExpr(); next(); return v; }
      if (tk.t === "num") return tk.v;
      if (tk.t === "id") {
        /* max(a, b, …) / min(a, b, …) — added v3.2 for tiered pricing
           (e.g. overage past an included quota: 49 + max(0, events-50)
           * 1.5). Pure functions of the arguments; no other names are
           callable, and unknown ids still throw. */
        if ((tk.v === "max" || tk.v === "min") && peek() && peek().t === "(") {
          next();
          var args = [parseExpr()];
          while (peek() && peek().t === ",") { next(); args.push(parseExpr()); }
          if (peek() && peek().t === ")") next();
          return tk.v === "max" ? Math.max.apply(null, args) : Math.min.apply(null, args);
        }
        if (!(tk.v in scope)) throw new Error("calc: unknown id " + tk.v);
        return scope[tk.v];
      }
      throw new Error("calc: unexpected token " + tk.t);
    }
    var out = parseExpr();
    if (pos !== tokens.length) throw new Error("calc: trailing tokens");
    return out;
  }

  /* ---------- animated number ---------- */
  function tween(elm, from, to, format, round) {
    function apply(v) {
      var x = v;
      if (round === "ceil") x = Math.ceil(x);
      elm.textContent = fmt(x, format);
    }
    if (reduced || from === to || !isFinite(from) || !isFinite(to)) { apply(to); return; }
    var t0 = performance.now(), dur = 550;
    (function frame(now) {
      var p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      apply(from + (to - from) * e);
      if (p < 1) requestAnimationFrame(frame);
    })(t0);
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function mount(root) {
    var cfgNode = root.querySelector(".cine-mod-config");
    if (!cfgNode) return;
    var cfg;
    try { cfg = JSON.parse(cfgNode.textContent); } catch (e) { return; }

    var panel = el("div", "cmod-panel");
    if (cfg.eyebrow) panel.appendChild(el("p", "cmod-eyebrow", cfg.eyebrow));
    if (cfg.title) panel.appendChild(el("h3", "cmod-title", cfg.title));
    if (cfg.intro) panel.appendChild(el("p", "cmod-intro", cfg.intro));
    if (cfg.demoNote) {
      var chip = el("span", "cmod-demo", "Demo");
      panel.appendChild(chip);
    }

    var grid = el("div", "cmod-grid");
    var controls = el("div", "cmod-col");
    var results = el("div", "cmod-col");
    grid.appendChild(controls); grid.appendChild(results);
    panel.appendChild(grid);

    var scope = {}, inputs = {}, outNodes = {};

    (cfg.inputs || []).forEach(function (inp) {
      scope[inp.id] = inp.value;
      var field = el("div", "cmod-field");
      var head = el("div", "cmod-field-head");
      var lab = el("label", "cmod-label", inp.label);
      lab.setAttribute("for", ""); // set below once ids exist
      var val = el("span", "cmod-value", fmtInput(inp.value, inp.format));
      head.appendChild(lab); head.appendChild(val);
      field.appendChild(head);

      var row = document.createElement("div");
      row.style.display = "flex"; row.style.gap = "12px"; row.style.alignItems = "center";
      var slider = document.createElement("input");
      slider.type = "range";
      slider.min = inp.min; slider.max = inp.max; slider.step = inp.step;
      slider.value = inp.value;
      slider.id = "cmod-" + inp.id + "-" + Math.random().toString(36).slice(2, 7);
      slider.setAttribute("aria-label", inp.label);
      slider.style.flex = "1";
      lab.setAttribute("for", slider.id);
      var num = document.createElement("input");
      num.type = "number"; num.className = "cmod-num";
      num.min = inp.min; num.max = inp.max; num.step = inp.step; num.value = inp.value;
      num.style.width = "104px"; num.style.flex = "none";
      num.setAttribute("aria-label", inp.label + " (number)");
      row.appendChild(slider); row.appendChild(num);
      field.appendChild(row);
      if (inp.hint) field.appendChild(el("p", "cmod-hint", inp.hint));
      controls.appendChild(field);

      function paint() {
        var pct = (scope[inp.id] - inp.min) / (inp.max - inp.min) * 100;
        slider.style.setProperty("--cmod-fill", pct + "%");
        val.textContent = fmtInput(scope[inp.id], inp.format);
      }
      function set(v, source) {
        v = Math.min(inp.max, Math.max(inp.min, Number(v) || 0));
        scope[inp.id] = v;
        if (source !== slider) slider.value = v;
        if (source !== num) num.value = v;
        paint(); compute();
      }
      slider.addEventListener("input", function () { set(slider.value, slider); });
      num.addEventListener("change", function () { set(num.value, num); });
      inputs[inp.id] = { paint: paint, set: set };
      paint();
    });

    (cfg.outputs || []).forEach(function (out) {
      var box = el("div", "cmod-out" + (out.hero ? " hero-out" : ""));
      box.appendChild(el("p", "cmod-out-label", out.label));
      var numElm = el("div", "cmod-out-num", "—");
      box.appendChild(numElm);
      if (out.sub) box.appendChild(el("p", "cmod-out-sub", out.sub));
      results.appendChild(box);
      outNodes[out.id] = { elm: numElm, cfg: out, last: NaN };
    });

    function compute() {
      var local = {};
      Object.keys(scope).forEach(function (k) { local[k] = scope[k]; });
      (cfg.outputs || []).forEach(function (out) {
        var v;
        try { v = evaluate(out.expr, local); } catch (e) { v = NaN; }
        local[out.id] = v;
        var node = outNodes[out.id];
        var from = isFinite(node.last) ? node.last : v;
        tween(node.elm, from, v, out.format, out.round);
        node.last = v;
      });
    }

    if (cfg.cta) {
      var row = el("div", "cmod-cta-row");
      var a = el("a", "cmod-cta", cfg.cta.label);
      a.href = cfg.cta.href;
      row.appendChild(a);
      if (cfg.secondaryCta) {
        var b = el("a", "cmod-cta ghost", cfg.secondaryCta.label);
        b.href = cfg.secondaryCta.href;
        row.appendChild(b);
      }
      if (cfg.cta.note) row.appendChild(el("span", "cmod-cta-note", cfg.cta.note));
      results.appendChild(row);
    }
    if (cfg.demoNote) panel.appendChild(el("p", "cmod-note", cfg.demoNote));

    root.appendChild(panel);
    compute();
    root._cineCalc = { setInput: function (id, v) { if (inputs[id]) inputs[id].set(v); }, getScope: function () { return scope; } };
  }

  document.querySelectorAll('[data-cine-mod="calc"]').forEach(mount);
})();
