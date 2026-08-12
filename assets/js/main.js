// Skyline Remodeling & Construction — lightweight vanilla JS (no dependencies)
// Anchor links (e.g. "Get a Free Estimate" -> #estimate) scroll smoothly via
// the `html { scroll-behavior: smooth }` rule in style.css — no JS needed.

document.addEventListener('DOMContentLoaded', function () {
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Submit the estimate form via FormSubmit's dedicated AJAX endpoint
  // (https://formsubmit.co/ajax/<email>), not the plain form-post endpoint
  // used in <form action="...">. That distinction is the actual fix here:
  // the plain endpoint is built for native browser POSTs and doesn't send
  // the CORS headers a page needs to read its response with fetch() — that
  // is what made fetch() throw on Safari/iPhone before, even when the email
  // had already sent. A hidden-iframe target was tried next, but in-app
  // browsers (WhatsApp/Instagram/Facebook) can ignore a form's "target" and
  // navigate the whole page to FormSubmit's own success page instead of the
  // iframe. FormSubmit's /ajax/ endpoint is CORS-enabled by design, so one
  // single fetch()-based implementation now works identically everywhere,
  // and we only redirect to thank-you.html after that request actually
  // confirms success — a failed or blocked request never redirects.
  var estimateForm = document.getElementById('estimateForm');
  if (estimateForm) {
    var AJAX_ENDPOINT = 'https://formsubmit.co/ajax/skylineestimate.floor@gmail.com';

    estimateForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var submitBtn = estimateForm.querySelector('button[type="submit"]');
      var originalLabel = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      var payload = {};
      new FormData(estimateForm).forEach(function (value, key) {
        payload[key] = value;
      });

      fetch(AJAX_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(payload)
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
