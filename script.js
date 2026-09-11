(function () {
  "use strict";

  const DEFAULT_BG_EN = "background_en.png";
  const DEFAULT_BG_AR = "background_ar.png";

  const state = {
    bgImage: null,
    currentBgPath: "",
    box: { x: 132, y: 192, w: 810, h: 966 },
  };

  const el = (id) => document.getElementById(id);
  const stageCanvas = el("stageCanvas");
  const boxOverlay = el("boxOverlay");
  const statusLine = el("statusLine");
  const pagesOutput = el("pagesOutput");

  function setStatus(msg, warn) {
    statusLine.textContent = msg || "";
    statusLine.className = "status" + (warn ? " warn" : "");
  }

  function currentCanvasSize() {
    if (state.bgImage)
      return { w: state.bgImage.naturalWidth, h: state.bgImage.naturalHeight };
    return { w: 1080, h: 1350 };
  }

  function getDisplayWidth() {
    const stageWidth = stageCanvas.parentElement.clientWidth || 360;
    return Math.min(480, stageWidth);
  }

  function redrawStage() {
    const { w, h } = currentCanvasSize();
    stageCanvas.width = w;
    stageCanvas.height = h;
    const dispW = getDisplayWidth();
    const scale = dispW / w;

    stageCanvas.style.width = dispW + "px";
    stageCanvas.style.height = h * scale + "px";

    const ctx = stageCanvas.getContext("2d");
    if (state.bgImage) {
      ctx.drawImage(state.bgImage, 0, 0, w, h);
    } else {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
    }
    updateBoxOverlay();
  }

  function updateBoxOverlay() {
    const { w } = currentCanvasSize();
    const scale = getDisplayWidth() / w;
    const b = state.box;
    boxOverlay.style.left = b.x * scale + "px";
    boxOverlay.style.top = b.y * scale + "px";
    boxOverlay.style.width = b.w * scale + "px";
    boxOverlay.style.height = b.h * scale + "px";
  }

  function syncBoxInputs() {
    el("boxX").value = Math.round(state.box.x);
    el("boxY").value = Math.round(state.box.y);
    el("boxW").value = Math.round(state.box.w);
    el("boxH").value = Math.round(state.box.h);
  }

  ["boxX", "boxY", "boxW", "boxH"].forEach((id) => {
    el(id).addEventListener("input", () => {
      state.box.x = parseFloat(el("boxX").value) || 0;
      state.box.y = parseFloat(el("boxY").value) || 0;
      state.box.w = parseFloat(el("boxW").value) || 10;
      state.box.h = parseFloat(el("boxH").value) || 10;
      updateBoxOverlay();
    });
  });

  (function enableBoxInteraction() {
    let mode = null;
    let startPos = { x: 0, y: 0 };
    let startBox = { x: 0, y: 0, w: 0, h: 0 };

    function getEventPos(e) {
      const t = e.touches ? e.touches[0] : e;
      return { x: t.clientX, y: t.clientY };
    }

    function onStart(e) {
      const handle = e.target.getAttribute("data-h");
      mode = handle || "move";
      startPos = getEventPos(e);
      startBox = { ...state.box };
    }

    function onMove(e) {
      if (!mode) return;
      const pos = getEventPos(e);
      const { w } = currentCanvasSize();
      const scale = getDisplayWidth() / w;
      const dx = (pos.x - startPos.x) / scale;
      const dy = (pos.y - startPos.y) / scale;
      const b = state.box;

      if (mode === "move") {
        b.x = startBox.x + dx;
        b.y = startBox.y + dy;
      } else if (mode === "se") {
        b.w = Math.max(30, startBox.w + dx);
        b.h = Math.max(30, startBox.h + dy);
      } else if (mode === "ne") {
        b.w = Math.max(30, startBox.w + dx);
        b.h = Math.max(30, startBox.h - dy);
        b.y = startBox.y + dy;
      } else if (mode === "sw") {
        b.w = Math.max(30, startBox.w - dx);
        b.x = startBox.x + dx;
        b.h = Math.max(30, startBox.h + dy);
      } else if (mode === "nw") {
        b.w = Math.max(30, startBox.w - dx);
        b.x = startBox.x + dx;
        b.h = Math.max(30, startBox.h - dy);
        b.y = startBox.y + dy;
      }
      updateBoxOverlay();
      syncBoxInputs();
      if (e.cancelable) e.preventDefault();
    }

    function onEnd() {
      mode = null;
    }

    boxOverlay.addEventListener("mousedown", onStart);
    boxOverlay.addEventListener("touchstart", onStart, { passive: false });
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchend", onEnd);
  })();

  function loadBackgroundForLanguage(lang, callback) {
    const bgPath = lang === "ar" ? DEFAULT_BG_AR : DEFAULT_BG_EN;
    if (state.currentBgPath === bgPath && state.bgImage) {
      if (callback) callback();
      return;
    }

    const img = new Image();
    img.onload = () => {
      state.bgImage = img;
      state.currentBgPath = bgPath;
      redrawStage();
      setStatus(`Background (${bgPath}) loaded successfully.`);
      if (callback) callback();
    };
    img.onerror = () => {
      setStatus(`Failed to load background (${bgPath}).`, true);
      state.bgImage = null;
      state.currentBgPath = "";
      redrawStage();
      if (callback) callback();
    };
    img.src = bgPath;
  }

  function wireLock(lockId, colorId) {
    const lock = el(lockId),
      color = el(colorId);
    lock.addEventListener("change", () => {
      color.disabled = lock.checked;
    });
  }
  wireLock("lockBold", "colorBold");
  wireLock("lockBig", "colorBig");
  wireLock("lockSmall", "colorSmall");

  el("lang").addEventListener("change", () => {
    const isAr = el("lang").value === "ar";
    el("align").value = isAr ? "right" : "left";
    el("justify").checked = isAr;
    loadBackgroundForLanguage(el("lang").value, () => {
      generate();
    });
  });

  window.addEventListener("resize", redrawStage);

  const EXAMPLE_EN = `++What Happens If You Lose a Sense of Smell?++

The first generations of humans depended on smell to build maps of their surroundings and remember where they had been. Today we don't need smell to know where we are, but if we lose it we feel adrift and confused.

Also, research suggests there is a ##link between loss of smell and Alzheimer's disease.## The strange part is that scientists think they can delay the disease's progression by exposing patients to smells from their past — called **"reminiscence therapy"**. It isn't proven yet.

++Olfactory System Plasticity++

In mouse experiments, researchers paired a benzene smell with a small foot shock. Afterward, exposing the mice to the odor alone made them **develop fear of that smell**, and researchers found **more neurons in the nose** tuned to that odor.`;

  const EXAMPLE_AR = `++ماذا يحدث إذا فقدت حاسة الشم؟++

اعتمدت الأجيال الأولى من البشر على الشم لبناء خرائط لمحيطهم وتذكر الأماكن التي زاروها: في يومنا هذا، لا نحتاج إلى الشم لمعرفة مكاننا، ولكن إذا فقدنا حاسة الشم فسوف نشعر بالضياع والارتباك.

أيضاً، يعتقد الباحثون أن هناك ##صلة بين فقدان حاسة الشم ومرض ألزهايمر:## ويقترحون أنه إذا فقد الشخص القدرة على التعرف على الروائح، فقد يصبح مريضاً بهذا المرض بعد سنوات. ويسمى العلاج التجريبي **"العلاج بالذكريات"**.

++لدونة الجهاز الشمي++

في تجارب على الفئران، عرّض العلماء الفئران لصدمة خفيفة مع رائحة معينة. بعدها، لاحظوا أن الفئران **يتولد لديها خوف من هذه الرائحة** وأيضاً وجدوا **زيادة في عدد الخلايا العصبية في الأنف.**`;

  el("loadEn").addEventListener("click", () => {
    el("script").value = EXAMPLE_EN;
    el("lang").value = "en";
    el("align").value = "left";
    el("justify").checked = false;
    loadBackgroundForLanguage("en", () => generate());
  });
  el("loadAr").addEventListener("click", () => {
    el("script").value = EXAMPLE_AR;
    el("lang").value = "ar";
    el("align").value = "right";
    el("justify").checked = true;
    loadBackgroundForLanguage("ar", () => generate());
  });
  el("script").value = EXAMPLE_EN;

  const INLINE_RE = /(\*\*.+?\*\*|\+\+.+?\+\+|~~.+?~~|##.+?##)/gs;

  function parseInline(text) {
    const runs = [];
    const parts = text.split(INLINE_RE);
    for (const token of parts) {
      if (!token) continue;
      let style = "normal",
        content = token;
      if (token.startsWith("**") && token.endsWith("**") && token.length >= 4) {
        style = "bold";
        content = token.slice(2, -2);
      } else if (
        token.startsWith("++") &&
        token.endsWith("++") &&
        token.length >= 4
      ) {
        style = "big";
        content = token.slice(2, -2);
      } else if (
        token.startsWith("~~") &&
        token.endsWith("~~") &&
        token.length >= 4
      ) {
        style = "small";
        content = token.slice(2, -2);
      } else if (
        token.startsWith("##") &&
        token.endsWith("##") &&
        token.length >= 4
      ) {
        style = "customGreen";
        content = token.slice(2, -2);
      }
      for (const word of content.split(/\s+/)) {
        if (word) runs.push({ word, style });
      }
    }
    return runs;
  }

  function parseParagraphs(script) {
    return script
      .trim()
      .split(/\n\s*\n/)
      .map((block) =>
        parseInline(
          block
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean)
            .join(" "),
        ),
      )
      .filter((p) => p.length);
  }

  function sizeFor(style) {
    if (style === "big") return parseFloat(el("bigSize").value) || 46;
    if (style === "small") return parseFloat(el("smallSize").value) || 20;
    if (style === "customGreen")
      return parseFloat(el("customGreenSize")?.value) || 24;
    return parseFloat(el("baseSize").value) || 28;
  }

  function fontStringFor(style) {
    const isAr = el("lang").value === "ar";
    let fontFamily = "";

    if (isAr) {
      fontFamily =
        style === "big"
          ? "'ArFontBig', sans-serif"
          : "'ArFontSmall', sans-serif";
    } else {
      fontFamily =
        style === "big"
          ? "'EnFontBig', sans-serif"
          : "'EnFontSmall', sans-serif";
    }

    const weight =
      style === "bold" || style === "big" || style === "customGreen"
        ? "700"
        : "400";
    return `${weight} ${sizeFor(style)}px ${fontFamily}`;
  }

  function colorFor(style) {
    if (style === "customGreen") {
      const elGreen = el("colorCustomGreen");
      return elGreen ? elGreen.value : "#4e7a2c";
    }
    if (style === "bold")
      return el("lockBold").checked
        ? el("colorNormal").value
        : el("colorBold").value;
    if (style === "big")
      return el("lockBig").checked
        ? el("colorNormal").value
        : el("colorBig").value;
    if (style === "small")
      return el("lockSmall").checked
        ? el("colorNormal").value
        : el("colorSmall").value;
    return el("colorNormal").value;
  }

  function lineHeightFor(style) {
    return sizeFor(style);
  }

  function formatWordForBidi(word, isAr) {
    if (isAr) {
      return "\u2067" + word + "\u2069";
    }
    return word;
  }

  function wrapParagraph(measureCtx, words, maxWidth, spaceWidth) {
    const lines = [];
    let cur = [],
      curW = 0;
    const isAr = el("lang").value === "ar";

    for (const { word, style } of words) {
      measureCtx.font = fontStringFor(style);
      const displayWord = formatWordForBidi(word, isAr);
      const w = measureCtx.measureText(displayWord).width;
      const extra = cur.length === 0 ? w : w + spaceWidth;
      if (cur.length && curW + extra > maxWidth) {
        lines.push(cur);
        cur = [{ word, displayWord, w, style }];
        curW = w;
      } else {
        cur.push({ word, displayWord, w, style });
        curW += extra;
      }
    }
    if (cur.length) lines.push(cur);
    return lines;
  }

  function flattenLines(
    measureCtx,
    paragraphs,
    maxWidth,
    spaceWidth,
    lineSpacing,
  ) {
    const flat = [];
    paragraphs.forEach((para, pIdx) => {
      if (!para.length) return;
      const lines = wrapParagraph(measureCtx, para, maxWidth, spaceWidth);
      const isHeading = para.every((w) => w.style === "big");
      lines.forEach((line, i) => {
        const isFirst = i === 0;
        const isLast = i === lines.length - 1;
        const lineH =
          Math.max(...line.map((w) => lineHeightFor(w.style))) * lineSpacing;
        flat.push({
          line,
          lineH,
          isFirst,
          isLast,
          isHeading,
          paragraphIndex: pIdx,
        });
      });
    });
    return flat;
  }

  function drawLine(
    ctx,
    line,
    left,
    right,
    y,
    spaceWidth,
    justify,
    align,
    isAr,
  ) {
    const n = line.length;
    const lineWidth = line.reduce((s, w) => s + w.w, 0);
    const maxWidth = right - left;
    const gap =
      justify && n > 1 ? (maxWidth - lineWidth) / (n - 1) : spaceWidth;

    ctx.textBaseline = "top";
    ctx.direction = isAr ? "rtl" : "ltr";

    if (align === "right") {
      let x = right;
      for (let i = 0; i < line.length; i++) {
        const w = line[i];
        ctx.font = fontStringFor(w.style);
        ctx.fillStyle = colorFor(w.style);
        ctx.textAlign = "right";
        ctx.fillText(w.displayWord, x, y);
        x -= w.w + gap;
      }
    } else if (align === "center") {
      const total = lineWidth + gap * (n - 1);
      let x = left + (maxWidth - total) / 2;
      for (let i = 0; i < line.length; i++) {
        const w = line[i];
        ctx.font = fontStringFor(w.style);
        ctx.fillStyle = colorFor(w.style);
        ctx.textAlign = "left";
        ctx.fillText(w.displayWord, x, y);
        x += w.w + gap;
      }
    } else {
      let x = left;
      for (let i = 0; i < line.length; i++) {
        const w = line[i];
        ctx.font = fontStringFor(w.style);
        ctx.fillStyle = colorFor(w.style);
        ctx.textAlign = "left";
        ctx.fillText(w.displayWord, x, y);
        x += w.w + gap;
      }
    }
  }

  function drawPageNumber(ctx, pageIndex, W, H, isAr, box) {
    const pageNum = (pageIndex + 2).toString().padStart(2, "0");
    const fontSize = sizeFor("big");

    ctx.font = `400 ${fontSize}px 'EnFontSmall', sans-serif`;

    ctx.fillStyle = colorFor("big");
    ctx.textBaseline = "top";

    const posY = 1247.3;

    if (isAr) {
      const posX = W - 981.5;
      ctx.textAlign = "left";
      ctx.direction = "ltr";
      ctx.fillText(pageNum, posX, posY);
    } else {
      const posX = 981.5;
      ctx.textAlign = "left";
      ctx.direction = "ltr";
      ctx.fillText(pageNum, posX, posY);
    }
  }

  function makePageCanvas(w, h) {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    if (state.bgImage) ctx.drawImage(state.bgImage, 0, 0, w, h);
    else {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
    }
    return { canvas: c, ctx };
  }

  async function generate() {
    if (document.fonts) {
      await document.fonts.ready;
    }

    const script = el("script").value;
    const align = el("align").value;
    const justify = el("justify").checked;
    const isAr = el("lang").value === "ar";
    const lineSpacing = parseFloat(el("lineSpacing").value) || 1.35;
    const headingTopSpace = parseFloat(el("headingTopSpace").value) || 24;
    const headingSpacing = parseFloat(el("headingSpacing").value) || 10;
    const bodySpacing = parseFloat(el("bodySpacing").value) || 20;

    const { w: W, h: H } = currentCanvasSize();
    const b = state.box;
    const left = b.x,
      top = b.y,
      right = b.x + b.w,
      bottom = b.y + b.h;

    const measureCanvas = document.createElement("canvas");
    const measureCtx = measureCanvas.getContext("2d");
    measureCtx.font = fontStringFor("normal");
    let spaceWidth = measureCtx.measureText(" ").width;
    if (!spaceWidth || spaceWidth <= 0) spaceWidth = sizeFor("normal") * 0.28;

    const paragraphs = parseParagraphs(script);
    if (!paragraphs.length) {
      setStatus("Nothing to render — write script text first.", true);
      return;
    }
    const flat = flattenLines(
      measureCtx,
      paragraphs,
      right - left,
      spaceWidth,
      lineSpacing,
    );

    const pages = [];
    let { canvas, ctx } = makePageCanvas(W, H);
    let cursor = top;
    let warned = false;

    flat.forEach((lineObj, idx) => {
      const { line, lineH, isFirst, isLast, isHeading, paragraphIndex } =
        lineObj;

      if (isFirst && isHeading && paragraphIndex > 0) {
        cursor += headingTopSpace;
      }

      if (cursor + lineH > bottom) {
        if (cursor > top) {
          drawPageNumber(ctx, pages.length, W, H, isAr, b);
          pages.push(canvas);
          ({ canvas, ctx } = makePageCanvas(W, H));
          cursor = top;
        } else if (!warned) {
          setStatus("Warning: text exceeds box height.", true);
          warned = true;
        }
      }

      drawLine(
        ctx,
        line,
        left,
        right,
        cursor,
        spaceWidth,
        justify && !isLast,
        align,
        isAr,
      );
      cursor += lineH;

      if (isLast) {
        cursor += isHeading ? headingSpacing : bodySpacing;
      }
    });

    drawPageNumber(ctx, pages.length, W, H, isAr, b);
    pages.push(canvas);

    if (!warned) setStatus(pages.length + " page(s) generated.");
    renderPageCards(pages);
  }

  function renderPageCards(pages) {
    pagesOutput.innerHTML = "";
    pages.forEach((canvas, i) => {
      const card = document.createElement("div");
      card.className = "page-card";

      const img = document.createElement("img");
      img.src = canvas.toDataURL("image/png");

      const lbl = document.createElement("div");
      lbl.className = "lbl";
      lbl.textContent = "Page " + (i + 1);

      const btn = document.createElement("button");
      btn.className = "btn btn-small btn-teal";
      btn.style.width = "100%";
      btn.textContent = "Download";
      btn.addEventListener("click", () => {
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "page_" + (i + 1) + ".png";
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
        }, "image/png");
      });

      card.appendChild(img);
      card.appendChild(lbl);
      card.appendChild(btn);
      pagesOutput.appendChild(card);
    });
  }

  el("generateBtn").addEventListener("click", generate);

  async function initializeApp() {
    try {
      if (document.fonts) {
        await Promise.all([
          document.fonts.load('400 28px "EnFontSmall"'),
          document.fonts.load('700 46px "EnFontBig"'),
          document.fonts.load('400 28px "ArFontSmall"'),
          document.fonts.load('700 46px "ArFontBig"'),
          document.fonts.ready,
        ]);
      }
    } catch (error) {
      console.warn("Some custom fonts could not be loaded.", error);
    }

    loadBackgroundForLanguage(el("lang").value, () => {
      requestAnimationFrame(() => {
        setTimeout(generate, 50);
      });
    });
  }

  initializeApp();
})();
