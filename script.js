const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scrollTopBtn');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const navItems = Array.from(document.querySelectorAll('.nav-item'));
const sections = Array.from(document.querySelectorAll('main section'));
const form = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const counters = document.querySelectorAll('.stat-number');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const testimonialButtons = document.querySelectorAll('.testimonial-btn');

function setNavbarState() {
  if (window.scrollY > 40) {
    navbar.classList.add('solid');
  } else {
    navbar.classList.remove('solid');
  }
}

function setScrollTopVisibility() {
  if (window.scrollY > 480) {
    scrollTopBtn.style.display = 'flex';
  } else {
    scrollTopBtn.style.display = 'none';
  }
}

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  menuToggle.classList.toggle('open');
});

navItems.forEach((item) => {
  item.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.classList.remove('open');
  });
});

window.addEventListener('scroll', () => {
  setNavbarState();
  setScrollTopVisibility();
  const scrollPos = window.scrollY + window.innerHeight / 2;

  sections.forEach((section) => {
    if (section.offsetTop <= scrollPos && section.offsetTop + section.offsetHeight > scrollPos) {
      navItems.forEach((link) => link.classList.remove('active'));
      const activeLink = document.querySelector(`.nav-item[href*="${section.id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
});

window.addEventListener('DOMContentLoaded', () => {
  setNavbarState();
  setScrollTopVisibility();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));

  // Counter animation
  const counterObserver = new IntersectionObserver(
    (entries, counterObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = +el.dataset.target;
          let count = 0;
          const step = Math.max(1, Math.floor(target / 120));

          const interval = setInterval(() => {
            count += step;
            if (count >= target) {
              el.textContent = target;
              clearInterval(interval);
            } else {
              el.textContent = count;
            }
          }, 18);

          counterObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));

  // Testimonials
  function showTestimonial(index) {
    testimonialCards.forEach((card, i) => {
      card.classList.toggle('active', i === index);
    });
    testimonialButtons.forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
    });
  }

  testimonialButtons.forEach((button) => {
    button.addEventListener('click', () => showTestimonial(Number(button.dataset.index)));
  });

  showTestimonial(0);

  let testimonialIndex = 0;
  setInterval(() => {
    testimonialIndex = (testimonialIndex + 1) % testimonialCards.length;
    showTestimonial(testimonialIndex);
  }, 6000);

  // Website cost calculator
  const costConfig = {
    base: 5000, // 400 USD
    planType: { wordpress: 5000, custom: 12000 }, // 1200 USD
    pages: { 5: 1500, 10: 4700, 15: 7900 }, // 500, 900, 1300 USD
    features: {
      ecommerce: 9600, // 1200 USD
      adminDashboard: 1400, // 800 USD
      userAuth: 9800, // 600 USD
      paymentGateway: 5000, // 900 USD
      seo: 1999, // 500 USD
      maintenance: 3000, // 350 USD
    },
  };

  const planTypeEl = document.getElementById('planType');
  const pageInputs = Array.from(document.querySelectorAll('input[name="pageCount"]'));
  const featureInputs = [
    'ecommerce',
    'adminDashboard',
    'userAuth',
    'paymentGateway',
    'seo',
    'maintenance',
  ].map((id) => document.getElementById(id));
  const breakdownList = document.getElementById('breakdownList');
  const totalCostEl = document.getElementById('totalCost');

  function updateCostCalculator() {
    if (!planTypeEl || !breakdownList || !totalCostEl) return;

    const selectedPlan = planTypeEl.value;
    const selectedPage = Number(document.querySelector('input[name="pageCount"]:checked').value);

    const breakdown = [];
    let total = costConfig.base;

    breakdown.push({ label: 'Project setup fee', value: costConfig.base });
    breakdown.push({ label: `${selectedPlan === 'wordpress' ? 'WordPress site' : 'Custom site'}`, value: costConfig.planType[selectedPlan] });
    total += costConfig.planType[selectedPlan];

    breakdown.push({ label: `${selectedPage} pages`, value: costConfig.pages[selectedPage] });
    total += costConfig.pages[selectedPage];

    featureInputs.forEach((input) => {
      if (input && input.checked) {
        breakdown.push({ label: `${input.parentElement.textContent.trim()}`, value: costConfig.features[input.id] });
        total += costConfig.features[input.id];
      }
    });

    breakdownList.innerHTML = breakdown
      .map((item) => `<li><span>${item.label}</span><span>₹${item.value.toLocaleString()}</span></li>`)
      .join('');

    totalCostEl.textContent = `₹${total.toLocaleString()}`;
  }

  if (planTypeEl) planTypeEl.addEventListener('change', updateCostCalculator);
  pageInputs.forEach((input) => input.addEventListener('change', updateCostCalculator));
  featureInputs.forEach((input) => input && input.addEventListener('change', updateCostCalculator));

  updateCostCalculator();
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    formMessage.textContent = 'Please fill in all fields before submitting.';
    formMessage.style.color = '#f97316';
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    formMessage.textContent = 'Please provide a valid email address.';
    formMessage.style.color = '#f97316';
    return;
  }

  formMessage.textContent = 'Thanks! Your message has been sent successfully.';
  formMessage.style.color = '#22c55e';

  form.reset();
});
