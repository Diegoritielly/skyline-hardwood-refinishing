// Skyline Remodeling & Construction — lightweight vanilla JS (no dependencies)
// Anchor links (e.g. "Get a Free Estimate" -> #estimate) scroll smoothly via
// the `html { scroll-behavior: smooth }` rule in style.css — no JS needed.

document.addEventListener('DOMContentLoaded', function () {
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
