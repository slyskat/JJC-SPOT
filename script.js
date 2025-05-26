document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Navbar Toggle for Mobile ---
  const hamburger = document.querySelector('.hamburger-menu');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-links li a');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.classList.toggle('nav-open');
    });

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('nav-open');
      });
    });
  }

  // --- 2. Hero Section Entrance Animation ---
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    setTimeout(() => {
      heroContent.classList.add('loaded');
    }, 500);
  }

  // --- 3. Scroll-Triggered Section Animations ---
  const sectionsToAnimate = document.querySelectorAll(
    '.story-snippet, .featured-dishes, .our-team, .gallery, .branches'
  );

  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');

        const applyStagger = (selector, delayBase = 0.1) => {
          const elements = entry.target.querySelectorAll(selector);
          elements.forEach((el, i) => el.style.setProperty('--delay', `${i * delayBase}s`));
        };

        if (entry.target.classList.contains('featured-dishes')) {
          applyStagger('.dish-card');
        } else if (entry.target.classList.contains('our-team')) {
          applyStagger('.team-member-card');
        } else if (entry.target.classList.contains('gallery')) {
          applyStagger('.gallery-item', 0.08);
        } else if (entry.target.classList.contains('branches')) {
          applyStagger('.branch-card');
        }

        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  });

  sectionsToAnimate.forEach(section => sectionObserver.observe(section));

  // --- 4. Gallery Filtering ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      const category = button.dataset.category;

      galleryItems.forEach(item => {
        const show = category === 'all' || item.dataset.category === category;
        item.style.display = show ? 'block' : 'none';

        if (show) {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(() => {
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        }
      });
    });
  });

  // --- 5. Order Now Modal ---
  const orderBtn = document.querySelector('.order-btn');
  const orderModal = document.getElementById('orderModal');
  const closeButton = document.querySelector('.close-button');
  const orderForm = document.querySelector('.order-form');
  const orderSuccessMessage = document.querySelector('.order-success-message');
  const closeModalAfterSuccessBtn = document.querySelector('.close-modal-after-success-btn');

  if (orderBtn && orderModal && closeButton && orderForm && orderSuccessMessage && closeModalAfterSuccessBtn) {
    const openModal = () => {
      orderModal.classList.remove('hide-animation');
      orderModal.classList.add('show');
      document.body.style.overflow = 'hidden';
      orderForm.style.display = 'block';
      orderSuccessMessage.style.display = 'none';
      orderForm.reset();
      orderForm.querySelectorAll('.form-group').forEach(group => group.classList.remove('error'));
    };

    const closeModalanimated = () => {
      orderModal.classList.add('hide-animation');
      orderModal.classList.remove('show');
      setTimeout(() => {
        document.body.style.overflow = '';
        orderModal.classList.remove('hide-animation');
      }, 400);
    };

    const validateForm = () => {
      let isValid = true;
      orderForm.querySelectorAll('input[required], textarea[required]').forEach(input => {
        const formGroup = input.closest('.form-group');
        if (input.value.trim() === '') {
          formGroup.classList.add('error');
          isValid = false;
        } else {
          formGroup.classList.remove('error');
        }
      });
      return isValid;
    };

    orderBtn.addEventListener('click', openModal);
    closeButton.addEventListener('click', closeModalanimated);
    closeModalAfterSuccessBtn.addEventListener('click', closeModalanimated);

    orderModal.addEventListener('click', (e) => {
      if (e.target === orderModal) closeModalanimated();
    });

    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateForm()) {
        orderForm.style.display = 'none';
        orderSuccessMessage.style.display = 'block';
        setTimeout(closeModalanimated, 3000);
      }
    });
  }

  // --- 6. Leaflet Map Initialization ---
  const mapElement = document.getElementById('jjc-map');
  if (mapElement) {
    const map = L.map('jjc-map').setView([8.9999, 7.0000], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    const branchesData = [
      { name: 'JJC Spot – Lekki Phase 1, Lagos', lat: 6.4343, lng: 3.4516, address: '123 Jerk Blvd, Lekki Phase 1, Lagos' },
      { name: 'JJC Spot – Yaba, Lagos', lat: 6.5095, lng: 3.3718, address: '45 Yaba Way, Yaba, Lagos' },
      { name: 'JJC Spot – Ring Road, Ibadan', lat: 7.3707, lng: 3.8964, address: '78 Ring Road, Ibadan' },
      { name: 'JJC Spot – Wuse 2, Abuja', lat: 9.0820, lng: 7.4764, address: '90 Wuse 2 Street, Abuja' },
      { name: 'JJC Spot – Gwarinpa, Abuja', lat: 9.1000, lng: 7.3833, address: '10 Gwarinpa Avenue, Abuja' }
    ];

    branchesData.forEach(branch => {
      L.marker([branch.lat, branch.lng]).addTo(map)
        .bindPopup(`
          <strong>${branch.name}</strong><br/>
          ${branch.address}<br/>
          <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address)}" target="_blank" rel="noopener noreferrer">Get Directions</a>
        `);
    });

    if (branchesData.length > 0) {
      const bounds = L.latLngBounds(branchesData.map(branch => [branch.lat, branch.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }

  // --- 7. Smooth Scrolling for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.getElementById(this.getAttribute('href').substring(1));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });


  // --- 9. Back to Top Button Functionality ---
  const backToTopBtn = document.getElementById('backToTopBtn');

  if (backToTopBtn) { // Ensure the button exists before trying to manipulate it
    // Show/hide the button based on scroll position
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) { // Show button after scrolling down 300px
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });

    // Smooth scroll to top when button is clicked
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0, // Scroll to the very top of the page
        behavior: 'smooth' // Enable smooth scrolling
      });
    });
  }
});
