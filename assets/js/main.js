// Skyline Remodeling & Construction — lightweight vanilla JS (no dependencies)
// Anchor links (e.g. "Get a Free Estimate" -> #estimate) scroll smoothly via
// the `html { scroll-behavior: smooth }` rule in style.css — no JS needed.

document.addEventListener('DOMContentLoaded', function () {
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Shared setup for both the project gallery and reviews carousels: a
  // horizontally scrolling, CSS scroll-snap track. Touch/swipe works
  // natively via the browser's own scroll handling (no custom touch
  // handlers needed, which also avoids fighting native momentum
  // scrolling on iOS); the arrows just nudge the scroll position by one
  // slide, and the dots reflect/control which slide is currently in view.
  function setupCarousel(trackId, prevId, nextId, dotsId, label) {
    var track = document.getElementById(trackId);
    if (!track) return;

    var slides = Array.prototype.slice.call(track.children);
    var prevBtn = document.getElementById(prevId);
    var nextBtn = document.getElementById(nextId);
    var dotsWrap = document.getElementById(dotsId);

    slides.forEach(function (slide, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Go to ' + label + ' ' + (i + 1));
      dot.addEventListener('click', function () {
        slide.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      });
      dotsWrap.appendChild(dot);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function updateActiveDot() {
      var trackLeft = track.getBoundingClientRect().left;
      var closestIndex = 0;
      var closestDist = Infinity;
      slides.forEach(function (slide, i) {
        var dist = Math.abs(slide.getBoundingClientRect().left - trackLeft);
        if (dist < closestDist) {
          closestDist = dist;
          closestIndex = i;
        }
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === closestIndex);
      });
    }

    function scrollByOneSlide(direction) {
      var slideWidth = slides[0].getBoundingClientRect().width;
      var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || '0');
      track.scrollBy({ left: direction * (slideWidth + gap), behavior: 'smooth' });
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { scrollByOneSlide(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { scrollByOneSlide(1); });

    var scrollTimer;
    track.addEventListener('scroll', function () {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(updateActiveDot, 100);
    });

    updateActiveDot();
  }

  setupCarousel('galleryTrack', 'galleryPrev', 'galleryNext', 'galleryDots', 'project');
  setupCarousel('reviewsTrack', 'reviewsPrev', 'reviewsNext', 'reviewsDots', 'review');

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
