const KEY = "markdown-slides";

const DEFAULT_MD = `# Slide 1

Hello **world**

---

# Slide 2

- Point one
- Point two

---

# Slide 3

**Thank you!**`;

const input = document.getElementById("input");
const status = document.getElementById("status");
const saveBtn = document.getElementById("save");

const editView = document.getElementById("editView");
const presentView = document.getElementById("presentView");
const tabEdit = document.getElementById("tabEdit");
const tabPresent = document.getElementById("tabPresent");

const previewSlide = document.getElementById("previewSlide");
const presentSlide = document.getElementById("presentSlide");
const count1 = document.getElementById("count1");
const count2 = document.getElementById("count2");
const prev1 = document.getElementById("prev1");
const prev2 = document.getElementById("prev2");
const next1 = document.getElementById("next1");
const next2 = document.getElementById("next2");
const fs1 = document.getElementById("fs1");
const fs2 = document.getElementById("fs2");

let slides = [];
let index = 0;
let timer;

function splitSlides(md) {
  return (
    md
      .split(/^\s*---\s*$/m)
      .map((s) => s.trim())
      .filter(Boolean) || [""]
  );
}

function render() {
  const html = marked.parse(slides[index] || "");
  previewSlide.innerHTML = html;
  presentSlide.innerHTML = html;

  const counter = `${index + 1} / ${slides.length}`;
  count1.textContent = counter;
  count2.textContent = counter;

  prev1.disabled = prev2.disabled = index === 0;
  next1.disabled = next2.disabled = index === slides.length - 1;
}

function refresh() {
  slides = splitSlides(input.value);
  if (index >= slides.length) index = slides.length - 1;
  render();
}

function go(i) {
  if (i < 0 || i >= slides.length) return;
  index = i;
  render();
}

// Save / Load
function save() {
  localStorage.setItem(KEY, input.value);
  status.textContent = "Saved";
  status.classList.remove("unsaved");
}

function load() {
  input.value = localStorage.getItem(KEY) || DEFAULT_MD;
  refresh();
}

// Tab switching
function showTab(edit) {
  editView.hidden = !edit;
  presentView.hidden = edit;
  tabEdit.classList.toggle("active", edit);
  tabPresent.classList.toggle("active", !edit);
}

// Fullscreen
function toggleFS(panel) {
  if (document.fullscreenElement) document.exitFullscreen();
  else panel.requestFullscreen().catch(() => {});
}

document.addEventListener("fullscreenchange", () => {
  const label = document.fullscreenElement ? "Exit full screen" : "Full screen";
  fs1.textContent = label;
  fs2.textContent = label;
});

// Events
input.addEventListener("input", () => {
  status.textContent = "Unsaved";
  status.classList.add("unsaved");
  clearTimeout(timer);
  timer = setTimeout(refresh, 150);
});

tabEdit.addEventListener("click", () => showTab(true));
tabPresent.addEventListener("click", () => showTab(false));
saveBtn.addEventListener("click", save);

prev1.addEventListener("click", () => go(index - 1));
next1.addEventListener("click", () => go(index + 1));
prev2.addEventListener("click", () => go(index - 1));
next2.addEventListener("click", () => go(index + 1));
fs1.addEventListener("click", () => toggleFS(editView));
fs2.addEventListener("click", () => toggleFS(presentView));

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
    e.preventDefault();
    save();
    return;
  }
  if (e.target === input) return;
  if (e.key === "ArrowRight") go(index + 1);
  if (e.key === "ArrowLeft") go(index - 1);
  if (e.key === "F11") {
    e.preventDefault();
    toggleFS(presentView.hidden ? editView : presentView);
  }
});

// Save on close
window.addEventListener("beforeunload", () => {
  if (status.classList.contains("unsaved")) save();
});

// Start
load();
