// GreenTrail Hiking Club - script.js

// Helpers
const $ = (sel, scope=document) => scope.querySelector(sel);
const $$ = (sel, scope=document) => Array.from(scope.querySelectorAll(sel));

// Year in footer
$("#year").textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = $(".nav-toggle");
const navMenu = $("#nav-menu");
navToggle.addEventListener("click", () => {
  const expanded = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!expanded));
  navMenu.classList.toggle("show");
});

// Smooth scroll for anchor links
$$('a[href^="#"]').forEach(a => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (id.length > 1) {
      const target = $(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        navMenu.classList.remove("show");
        navToggle.setAttribute("aria-expanded", "false");
      }
    }
  });
});

// Dark mode toggle (persisted)
const themeToggle = $("#themeToggle");
const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
const savedTheme = localStorage.getItem("gt-theme");
if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
  document.documentElement.classList.add("dark");
}
themeToggle.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
  const isDark = document.documentElement.classList.contains("dark");
  localStorage.setItem("gt-theme", isDark ? "dark" : "light");
});

// Back-to-top button
const toTop = $("#toTop");
window.addEventListener("scroll", () => {
  if (window.scrollY > 600) toTop.classList.add("show");
  else toTop.classList.remove("show");
});
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// Events filter
const filterButtons = $$(".chip[data-filter]");
const eventCards = $$(".event");
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;
    eventCards.forEach(card => {
      const show = filter === "all" || card.dataset.difficulty === filter;
      card.style.display = show ? "" : "none";
    });
  });
});

// FAQ details: only one open at a time
const faqList = $("#faqList");
faqList.addEventListener("toggle", (e) => {
  if (e.target.tagName.toLowerCase() === "details" && e.target.open) {
    $$("#faqList details").forEach(d => { if (d !== e.target) d.removeAttribute("open"); });
  }
}, true);

// Contact form validation (client-side demo)
const form = $("#contactForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let ok = true;
  const name = $("#name");
  const email = $("#email");
  const message = $("#message");
  const terms = $("#terms");

  const setError = (id, msg) => { const el = $("#" + id); el.textContent = msg; };

  // Name
  if (!name.value.trim()) { setError("nameError", "Please enter your name."); ok = false; } 
  else setError("nameError", "");

  // Email - simple regex
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
  if (!emailOk) { setError("emailError", "Please enter a valid email address."); ok = false; } 
  else setError("emailError", "");

  // Message
  if (!message.value.trim()) { setError("messageError", "Please include a short message."); ok = false; } 
  else setError("messageError", "");

  // Terms
  if (!terms.checked) { setError("termsError", "You must accept to proceed."); ok = false; } 
  else setError("termsError", "");

  if (!ok) return;

  // Demo success (no network request in this demo)
  $("#formSuccess").textContent = "Thanks! We’ll be in touch within 2–3 days.";
  form.reset();
  $("#terms").checked = false;
  setTimeout(() => $("#formSuccess").textContent = "", 5000);
});
