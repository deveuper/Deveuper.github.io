(() => {
  "use strict";
  const { keys, languages } = window.PI_DEVEAGENT_LOCALES;
  const product = window.PI_DEVEAGENT_PRODUCT;
  const picker = document.querySelector("#language");
  const themes = ["white", "dark"];
  const previewButtons = [...document.querySelectorAll("[data-preview-choice]")];
  let preview = "workspace-light";
  let loadedPreview = preview;
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  let copy = {};
  const params = new URLSearchParams(location.search);
  let language = languages.find((item) => item.code === params.get("lang")) || languages[0];
  let theme = params.get("theme") === "midnight" ? "dark" : themes.includes(params.get("theme")) ? params.get("theme") : "white";
  const sources = [
    ["Pi", "earendil-works/pi", "main"],
    ["PiDeck / Pi Desk", "ayuayue/PiDeck", "main"],
    ["Pi Agent Desktop · Chasen-Liao", "Chasen-Liao/pi-agent-desktop", "main"],
    ["Pi Agent Desktop · DLYZZT", "DLYZZT/pi-desktop", "main"],
    ["PI-Desktop", "vastsa/PI-Desktop", "main"],
    ["Pi Desktop", "rubengarciajr/pi-desktop", null],
    ["Hermes Agent", "NousResearch/hermes-agent", "main"],
    ["DeepSeek Harness / DSH", "deepseek-ai/deepseek-harness", "master"]
  ];
  const sourceRoot = document.querySelector("#sources");
  if (sourceRoot) {
    for (const [name, repository, branch] of sources) {
      const card = document.createElement("article");
      card.className = "source-card";
      const heading = document.createElement("h2");
      heading.textContent = name;
      card.append(heading);
      const links = [["sourceLabel", `https://github.com/${repository}`]];
      if (branch) links.push(["licenseLabel", `https://github.com/${repository}/blob/${branch}/LICENSE`]);
      for (const [key, url] of links) {
        const link = document.createElement("a");
        link.href = url;
        link.dataset.i18n = key;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        card.append(link);
      }
      sourceRoot.append(card);
    }
  }
  for (const item of languages) {
    const option = document.createElement("option");
    option.value = item.code;
    option.textContent = item.name;
    picker.append(option);
  }
  function syncLinks() {
    for (const link of document.querySelectorAll("[data-page-link]")) {
      const target = new URL(link.dataset.pageLink, location.href);
      target.searchParams.set("lang", language.code);
      target.searchParams.set("theme", theme);
      link.href = target.href;
    }
  }
  function updateAddress() {
    const url = new URL(location.href);
    url.searchParams.set("lang", language.code);
    url.searchParams.set("theme", theme);
    // Some file:// hosts disallow replaceState; the content and page links still work.
    try { history.replaceState(null, "", url); } catch {}
  }
  function setLanguage(item) {
    language = item;
    copy = Object.fromEntries(keys.map((key, index) => [key, item.text[index]]));
    document.documentElement.lang = item.code;
    document.documentElement.dir = item.dir || "ltr";
    picker.value = item.code;
    for (const element of document.querySelectorAll("[data-i18n]")) element.textContent = copy[element.dataset.i18n];
    document.querySelector(".skip").textContent = copy.skipLabel;
    picker.setAttribute("aria-label", copy.languageLabel);
    document.querySelector("nav")?.setAttribute("aria-label", copy.navigationLabel);
    for (const element of document.querySelectorAll("[data-i18n-aria]")) element.setAttribute("aria-label", copy[element.dataset.i18nAria]);
    updatePreviewLabel();
    document.querySelector(".workspace-preview")?.setAttribute("aria-label", copy.previewAria);
    const credits = document.body.dataset.page === "credits";
    document.title = `${credits ? copy.creditsTitle : copy.title} · Pi Deve Agent`;
    document.querySelector('meta[name="description"]').content = credits ? copy.creditsIntro : copy.description;
    for (const download of document.querySelectorAll("[data-download]")) download.textContent = downloadUrl ? copy.downloadAction : copy.secondary;
    const state = document.querySelector("#download-state");
    if (state) { state.hidden = Boolean(downloadUrl); state.textContent = downloadUrl ? "" : copy.pendingDownload; }
    syncLinks();
  }
  function setTheme(value) {
    if (!themes.includes(value)) return;
    theme = value;
    document.documentElement.dataset.theme = value;
    for (const button of document.querySelectorAll("[data-website-theme]")) button.setAttribute("aria-pressed", String(button.dataset.websiteTheme === value));
    syncLinks();
  }
  function updatePreviewLabel() {
    const selected = previewButtons.find((button) => button.dataset.previewChoice === preview);
    const name = document.querySelector("#preview-name");
    if (name && selected) name.textContent = selected.textContent.trim();
  }
  function setPreview(value) {
    if (!previewButtons.some((button) => button.dataset.previewChoice === value)) return;
    const image = document.querySelector("#gallery-image");
    if (!image || value === preview) return;
    const previous = loadedPreview;
    preview = value;
    image.classList.add("is-switching");
    const finish = () => {
      image.classList.remove("is-switching");
      for (const button of previewButtons) button.setAttribute("aria-pressed", String(button.dataset.previewChoice === preview));
      updatePreviewLabel();
    };
    image.onload = () => {
      loadedPreview = preview;
      finish();
      if (!motion.matches) image.animate([{ opacity: 0.4, transform: "translateY(9px) scale(.99)" }, { opacity: 1, transform: "none" }], { duration: 420, easing: "cubic-bezier(.2,.7,.2,1)" });
    };
    image.onerror = () => {
      image.onerror = null;
      preview = previous;
      image.src = `assets/${previous}.png`;
      finish();
    };
    image.src = `assets/${value}.png`;
    // Software screenshots have their own selection; the website theme is independent.
  }
  function publishedUrl(value) {
    if (!value) return undefined;
    try {
      const url = new URL(value);
      return url.protocol === "https:" && !url.username && !url.password && !url.port ? url.href : undefined;
    } catch { return undefined; }
  }
  const localReleases = document.querySelector("#local-releases");
  if (localReleases) localReleases.hidden = !(location.protocol === "file:" && product.localReleaseAvailable === true);
  // Only an explicitly audited public release becomes a direct download.
  const proposedDownload = publishedUrl(product.downloadUrl);
  const downloadUrl = proposedDownload && product.publicDownloadVerified === true && new URL(proposedDownload).hostname === "github.com" && new URL(proposedDownload).pathname.startsWith("/deveuper/Deveuper.github.io/releases/download/") ? proposedDownload : undefined;
  const releasePage = publishedUrl(product.releasesUrl) || "https://github.com/deveuper/Deveuper.github.io/releases";
  for (const download of document.querySelectorAll("[data-download]")) download.href = downloadUrl || releasePage;
  const repositoryUrl = publishedUrl(product.repositoryUrl);
  if (repositoryUrl) for (const link of document.querySelectorAll("[data-repository]")) link.href = repositoryUrl;
  picker.addEventListener("change", () => {
    setLanguage(languages.find((item) => item.code === picker.value) || languages[0]);
    updateAddress();
    scheduleScrollMotion();
  });
  for (const button of document.querySelectorAll("[data-website-theme]")) button.addEventListener("click", () => { setTheme(button.dataset.websiteTheme); updateAddress(); });
  for (const button of previewButtons) button.addEventListener("click", () => setPreview(button.dataset.previewChoice));
  setLanguage(language);
  setTheme(theme);

  // Progressive enhancement: no observer, no JavaScript, or reduced motion keeps all content visible.
  let observer;
  let motionFrame;
  const hero = document.querySelector(".hero");
  function renderScrollMotion() {
    motionFrame = undefined;
    const height = document.documentElement.scrollHeight - innerHeight;
    document.documentElement.style.setProperty("--page-progress", String(height > 0 ? Math.min(1, Math.max(0, scrollY / height)) : 0));
    if (hero) {
      const bounds = hero.getBoundingClientRect();
      document.documentElement.style.setProperty("--hero-scroll", String(Math.min(1, Math.max(0, -bounds.top / bounds.height))));
    }
  }
  function scheduleScrollMotion() {
    if (!motion.matches && motionFrame === undefined) motionFrame = requestAnimationFrame(renderScrollMotion);
  }
  function disableMotion() {
    document.documentElement.classList.remove("motion-ready");
    observer?.disconnect();
    removeEventListener("scroll", scheduleScrollMotion);
    removeEventListener("resize", scheduleScrollMotion);
    if (motionFrame !== undefined) cancelAnimationFrame(motionFrame);
    motionFrame = undefined;
    document.querySelector("#gallery-image")?.getAnimations().forEach((animation) => animation.cancel());
    document.documentElement.style.removeProperty("--hero-scroll");
    document.documentElement.style.removeProperty("--page-progress");
  }
  function enableMotion() {
    disableMotion();
    if (motion.matches || !("IntersectionObserver" in window)) return;
    try {
      const elements = document.querySelectorAll(".hero-copy, .hero-screen, .section-heading, .feature-grid article, .section-copy, .detail-screen, .toolkit article, .gallery, .architecture-line, .architecture-node, .download-section");
      observer = new IntersectionObserver((entries) => {
        for (const entry of entries) if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }, { threshold: 0.05, rootMargin: "0px 0px -24px 0px" });
      for (const element of elements) {
        element.dataset.reveal = "";
        if (element.matches(".feature-grid article, .architecture-node")) element.style.setProperty("--reveal-order", String([...element.parentElement.children].indexOf(element) % 4));
        const bounds = element.getBoundingClientRect();
        if (bounds.top < innerHeight && bounds.bottom > 0) element.classList.add("is-visible");
        observer.observe(element);
      }
      document.documentElement.classList.add("motion-ready");
      addEventListener("scroll", scheduleScrollMotion, { passive: true });
      addEventListener("resize", scheduleScrollMotion, { passive: true });
      scheduleScrollMotion();
    } catch { disableMotion(); }
  }
  // Keyboard jumps keep content visible before an observer callback.
  document.addEventListener("focusin", (event) => event.target.closest?.("[data-reveal]")?.classList.add("is-visible"));
  motion.addEventListener("change", enableMotion);
  addEventListener("pagehide", disableMotion);
  addEventListener("pageshow", enableMotion);
  enableMotion();
})();
