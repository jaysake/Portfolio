document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. HEADER SCROLL EFFECT
     ========================================================================== */
  const header = document.getElementById('header');

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run once in case page starts scrolled

  /* ==========================================================================
     2. MOBILE MENU TOGGLE
     ========================================================================== */
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  /* ==========================================================================
     3. SCROLL REVEAL ANIMATIONS (Intersection Observer)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add delay for a sequenced staggering look
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, 100);
        observer.unobserve(entry.target); // Reveal only once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ==========================================================================
     4. ACTIVE NAVIGATION LINK INDICATOR
     ========================================================================== */
  const sections = document.querySelectorAll('section, main');
  const navItems = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(item => {
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }, {
    threshold: 0.25, // When 25% of the section is visible
    rootMargin: '-80px 0px -20% 0px'
  });

  sections.forEach(sec => sectionObserver.observe(sec));

  /* ==========================================================================
     5. TESTIMONIAL SLIDER
     ========================================================================== */
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.slider-dot');
  const authorName = document.getElementById('author-name');
  const authorRole = document.getElementById('author-role');

  const authorData = [
    { name: 'Amit Sharma', role: 'Creative Director, WildRoot Films' },
    { name: 'Elena Rostova', role: 'Editor, Earth Conservation' },
    { name: 'Rajesh Mehta', role: 'Lead Editor, NatGeo India contributor' }
  ];

  let currentSlide = 0;
  let slideInterval;

  const showSlide = (index) => {
    // Hide current slide
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    // Set next slide
    currentSlide = index;

    // Show next slide
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');

    // Update author info
    authorName.textContent = authorData[currentSlide].name;
    authorRole.textContent = authorData[currentSlide].role;
  };

  const nextSlide = () => {
    let nextIdx = (currentSlide + 1) % slides.length;
    showSlide(nextIdx);
  };

  const startSlider = () => {
    slideInterval = setInterval(nextSlide, 5000);
  };

  const stopSlider = () => {
    clearInterval(slideInterval);
  };

  // Set up dot controls
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      stopSlider();
      showSlide(index);
      startSlider();
    });
  });

  startSlider(); // Initialize auto slider

  /* ==========================================================================
     6. PORTFOLIO LIGHTBOX GALLERY
     ========================================================================== */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  const galleryItems = document.querySelectorAll('.card-photo-grid');
  let activeImageIdx = -1;
  const galleryData = [];

  // Populate the gallery datasets
  galleryItems.forEach((item, index) => {
    const src = item.getAttribute('data-src');
    const title = item.getAttribute('data-title') || 'Wild Frame';
    const desc = item.getAttribute('data-desc') || 'Captured by Baiju Patil';

    galleryData.push({ src, title, desc });

    item.addEventListener('click', (e) => {
      e.preventDefault();
      activeImageIdx = index;
      openLightbox(activeImageIdx);
    });
  });

  const openLightbox = (index) => {
    const data = galleryData[index];
    lightboxImg.src = data.src;
    lightboxTitle.textContent = data.title;
    lightboxDesc.textContent = data.desc;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Stop body scroll
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Resume body scroll
    // Delay clearing src to avoid flash during transitions
    setTimeout(() => {
      lightboxImg.src = '';
    }, 400);
  };

  const navigateLightbox = (direction) => {
    if (activeImageIdx === -1) return;

    if (direction === 'next') {
      activeImageIdx = (activeImageIdx + 1) % galleryData.length;
    } else {
      activeImageIdx = (activeImageIdx - 1 + galleryData.length) % galleryData.length;
    }

    // Add a quick fade out/in effect for the image navigation
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      const data = galleryData[activeImageIdx];
      lightboxImg.src = data.src;
      lightboxTitle.textContent = data.title;
      lightboxDesc.textContent = data.desc;
      lightboxImg.style.opacity = '1';
    }, 150);
  };

  // Event listeners for lightbox controls
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxNext.addEventListener('click', () => navigateLightbox('next'));
  lightboxPrev.addEventListener('click', () => navigateLightbox('prev'));

  // Close lightbox on click outside the image
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      navigateLightbox('next');
    } else if (e.key === 'ArrowLeft') {
      navigateLightbox('prev');
    }
  });

  /* ==========================================================================
     7. CONTACT FORM SUBMISSION
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const subject = document.getElementById('form-subject').value.trim();
    const message = document.getElementById('form-message').value.trim();

    // Simple Validation
    if (!name || !email || !subject || !message) {
      showStatus('Please fill in all required fields.', 'error');
      return;
    }

    // Display sending state
    showStatus('Sending your message... Please wait.', '');

    // Simulate API Request
    setTimeout(() => {
      showStatus('Thank you, Sir! Your message was sent successfully. We will get back to you shortly.', 'success');
      contactForm.reset();
    }, 1500);
  });

  const showStatus = (msg, type) => {
    formStatus.textContent = msg;
    formStatus.className = 'form-status'; // Reset classes

    if (type === 'success') {
      formStatus.classList.add('success');
    } else if (type === 'error') {
      formStatus.classList.add('error');
    } else {
      // In-progress status
      formStatus.style.display = 'block';
      formStatus.style.backgroundColor = 'rgba(255, 110, 24, 0.1)';
      formStatus.style.border = '1px solid rgba(255, 110, 24, 0.3)';
      formStatus.style.color = 'var(--accent-orange)';
    }
  };

});
