// Skyline Remodeling & Construction — lightweight vanilla JS (no dependencies)
// Anchor links (e.g. "Get a Free Estimate" -> #estimate) scroll smoothly via
// the `html { scroll-behavior: smooth }` rule in style.css — no JS needed.

document.addEventListener('DOMContentLoaded', function () {
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Submit the estimate form natively (a real browser POST) into a hidden
  // iframe instead of using fetch()/AJAX. fetch() reads the cross-origin
  // FormSubmit response, which is subject to CORS and failed silently on
  // Safari/iPhone even when the email actually sent. A native form POST
  // targeted at a hidden iframe is not subject to CORS at all — the
  // browser just submits the form and loads the response inside the
  // iframe, which never navigates the visible page. We only need to know
  // *when* that submission finishes, so we listen for the iframe's "load"
  // event and then redirect the main page to thank-you.html ourselves.
  var estimateForm = document.getElementById('estimateForm');
  var formTargetFrame = document.querySelector('iframe[name="formSubmitTarget"]');
  if (estimateForm && formTargetFrame) {
    var formSubmitted = false;

    estimateForm.addEventListener('submit', function () {
      formSubmitted = true;
      var submitBtn = estimateForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }
      // No preventDefault(): let the browser submit the form natively.
    });

    formTargetFrame.addEventListener('load', function () {
      // The iframe fires an initial blank "load" on page load, before any
      // submission — ignore that one and only redirect after a real submit.
      if (formSubmitted) {
        window.location.href = 'thank-you.html';
      }
    });
  }
});
