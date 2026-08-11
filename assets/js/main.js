// Skyline Remodeling & Construction — lightweight vanilla JS (no dependencies)
// Anchor links (e.g. "Get a Free Estimate" -> #estimate) scroll smoothly via
// the `html { scroll-behavior: smooth }` rule in style.css — no JS needed.

document.addEventListener('DOMContentLoaded', function () {
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Submit the estimate form via fetch instead of a normal browser POST.
  // This guarantees the redirect to thank-you.html happens under our own
  // control on every submission (desktop and mobile alike), instead of
  // depending on FormSubmit's server-side "_next" redirect, which has
  // been unreliable (showing FormSubmit's own default success page).
  var estimateForm = document.getElementById('estimateForm');
  if (estimateForm) {
    estimateForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var submitBtn = estimateForm.querySelector('button[type="submit"]');
      var originalLabel = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      fetch(estimateForm.action, {
        method: 'POST',
        body: new FormData(estimateForm),
        headers: { Accept: 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            window.location.href = 'thank-you.html';
          } else {
            throw new Error('Form submission failed');
          }
        })
        .catch(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalLabel;
          }
          alert('Something went wrong sending your request. Please try again or call/message us on WhatsApp.');
        });
    });
  }
});
