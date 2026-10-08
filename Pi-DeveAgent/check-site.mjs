import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = new URL("./", import.meta.url);
const read = name => readFileSync(new URL(name, root), "utf8");
const sandbox = { window: {} };
vm.runInNewContext(read("locales.js"), sandbox);
const { keys, languages } = sandbox.window.PI_DEVEAGENT_LOCALES;
assert.equal(languages.length, 15);
assert.equal(new Set(keys).size, keys.length);
for (const language of languages) {
  assert.equal(language.text.length, keys.length, language.code);
  assert.ok(language.text.every(text => typeof text === "string" && text.trim()), language.code);
  assert.ok(!language.text[keys.indexOf("creditsBoundary")].includes("DSH"), language.code);
}
assert.equal(languages[0].text[keys.indexOf("appearanceTitle")], "不同的颜色配置");
for (const page of ["index.html", "references.html", "acknowledgements.html"]) {
  for (const [, key] of read(page).matchAll(/data-i18n(?:-aria)?="([^"]+)"/g)) {
    assert.ok(keys.includes(key), `${page}: ${key}`);
  }
}
const html = read("index.html");
const previews = [...html.matchAll(/data-preview-choice="([^"]+)"/g)].map(match => match[1]);
assert.equal(previews.length, 12);
assert.equal(new Set(previews).size, previews.length);
assert.ok(!html.includes("data-theme-choice"));
assert.ok(!html.includes("网站配色预览"));
for (const image of previews.map(name => `assets/${name}.png`)) {
  assert.ok(existsSync(fileURLToPath(new URL(image, root))), `Missing real capture: ${image}`);
}
assert.ok(read("styles.css").includes("prefers-reduced-motion:reduce"));
assert.ok(!html.includes("product-tour.gif") && !read("app.js").includes("product-tour.gif"));
assert.ok(!html.includes("motion-play"));
assert.ok(html.indexOf('id="architecture"') < html.indexOf('id="features"'));
assert.equal([...html.matchAll(/<article><span class="feature-symbol"/g)].length, 8);
for (const key of ["computerTitle", "memoryTitle", "localTitle", "lightweightTitle", "coreBody", "workbenchBody", "ecosystemBody"]) assert.ok(html.includes(`data-i18n="${key}"`));
console.log("Website contracts passed: 15 languages, 12 software previews, 8 capabilities, independent Pi core first, live webpage motion without GIF.");
