(() => {
  "use strict";
  const { keys, languages } = window.PI_DEVEAGENT_LOCALES;
  const product = window.PI_DEVEAGENT_PRODUCT;
  const picker = document.querySelector("#language");
  const themes = ["white", "dark", "parchment", "green", "rose", "blush", "lavender", "midnight"];
  const params = new URLSearchParams(location.search);
  let language = languages.find((item) => item.code === params.get("lang")) || languages[0];
  let theme = themes.includes(params.get("theme")) ? params.get("theme") : "white";
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
    const copy = Object.fromEntries(keys.map((key, index) => [key, item.text[index]]));
    document.documentElement.lang = item.code;
    document.documentElement.dir = item.dir || "ltr";
    picker.value = item.code;
    for (const element of document.querySelectorAll("[data-i18n]")) element.textContent = copy[element.dataset.i18n];
    document.querySelector(".skip").textContent = copy.skipLabel;
    picker.setAttribute("aria-label", copy.languageLabel);
    document.querySelector("nav")?.setAttribute("aria-label", copy.navigationLabel);
    document.querySelector(".theme-options")?.setAttribute("aria-label", copy.themeLabel);
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
    theme = value;
    document.documentElement.dataset.theme = value;
    const heroImage = document.querySelector(".hero-screen > img");
    const source = `assets/workspace-${value === "dark" || value === "midnight" ? "dark" : "light"}.png`;
    if (heroImage && heroImage.getAttribute("src") !== source) heroImage.src = source;
    for (const button of document.querySelectorAll("[data-theme-choice]")) button.setAttribute("aria-pressed", String(button.dataset.themeChoice === value));
    syncLinks();
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
  });
  for (const button of document.querySelectorAll("[data-theme-choice]")) button.addEventListener("click", () => { setTheme(button.dataset.themeChoice); updateAddress(); });
  for (const button of document.querySelectorAll("[data-gallery]")) button.addEventListener("click", () => {
    const image = document.querySelector("#gallery-image");
    image.classList.add("is-switching");
    image.onload = image.onerror = () => image.classList.remove("is-switching");
    image.src = `assets/${button.dataset.gallery}.png`;
    if (image.complete) image.classList.remove("is-switching");
    for (const item of document.querySelectorAll("[data-gallery]")) item.setAttribute("aria-pressed", String(item === button));
  });
  setLanguage(language);
  setTheme(theme);

  // Progressive enhancement: no observer, no JavaScript, or reduced motion keeps all content visible.
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  let observer;
  function disableMotion() {
    document.documentElement.classList.remove("motion-ready");
    observer?.disconnect();
  }
  if (!motion.matches && "IntersectionObserver" in window) {
    try {
      const elements = document.querySelectorAll(".hero-copy, .hero-screen, .section-heading, .feature-grid article, .section-copy, .detail-screen, .toolkit article, .gallery, .architecture-line, .download-section");
      observer = new IntersectionObserver((entries) => {
        for (const entry of entries) if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }, { threshold: 0.05, rootMargin: "0px 0px -24px 0px" });
      for (const element of elements) {
        element.dataset.reveal = "";
        const bounds = element.getBoundingClientRect();
        if (bounds.top < innerHeight && bounds.bottom > 0) element.classList.add("is-visible");
        observer.observe(element);
      }
      document.documentElement.classList.add("motion-ready");
      // Keyboard jumps cannot land in transparent content while waiting for the observer.
      document.addEventListener("focusin", (event) => event.target.closest?.("[data-reveal]")?.classList.add("is-visible"));
      motion.addEventListener("change", (event) => { if (event.matches) disableMotion(); });
      addEventListener("pagehide", disableMotion, { once: true });
    } catch { disableMotion(); }
  }
})();
