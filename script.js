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

  // Live chatbot
  const chatLauncher = document.getElementById('chatLauncher');
  const liveChat = document.getElementById('liveChat');
  const chatClose = document.getElementById('chatClose');
  const chatMessages = document.getElementById('chatMessages');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatQuickButtons = Array.from(document.querySelectorAll('.chat-quick-action'));

  const serviceNames = Array.from(document.querySelectorAll('.service-card h3')).map((el) => el.textContent.trim());
  const pricingPlans = Array.from(document.querySelectorAll('.pricing-table .plan-header')).map((el) => {
    return {
      name: el.querySelector('.plan-name')?.textContent.trim() || 'Plan',
      price: el.querySelector('.plan-price')?.textContent.trim() || '',
    };
  });
  const contactDetails = Array.from(document.querySelectorAll('.contact-info ul li')).map((el) => el.textContent.trim());
  const portfolioProjects = Array.from(document.querySelectorAll('.portfolio-item .overlay h3')).map((el) => el.textContent.trim());

  const chatKnowledge = [
    {
      keywords: ['service', 'offer', 'offers', 'provide', 'what do you do'],
      answer: `We offer ${serviceNames.join(', ')}. Each service is designed to help brands grow online with strategy, design, development and measurable marketing.`,
    },
    {
      keywords: ['web development', 'website development', 'websites', 'custom website', 'apps'],
      answer: 'We create custom websites and web apps optimized for performance, conversions, and growth. Our work includes responsive builds, CMS sites, e-commerce and landing pages.',
    },
    {
      keywords: ['graphic design', 'design', 'branding'],
      answer: 'Our graphic design service includes branding, creative asset production and visual systems that elevate your identity across digital touch points.',
    },
    {
      keywords: ['digital marketing', 'marketing', 'campaign'],
      answer: 'We deliver digital marketing strategy and execution across channels to increase visibility, improve ROI, and grow your audience.',
    },
    {
      keywords: ['seo', 'search engine', 'organic'],
      answer: 'Our SEO service optimizes your website for search engines with technical, on-page and content improvements to help your brand rank higher organically.',
    },
    {
      keywords: ['dropshipping', 'drop shipping'],
      answer: 'We help build and optimize dropshipping stores with automation, supplier setup, and user-friendly storefronts to scale your e-commerce business.',
    },
    {
      keywords: ['pricing', 'cost', 'estimate', 'price'],
      answer: `Our pricing plans include ${pricingPlans.map((plan) => `${plan.name} at ${plan.price}`).join(', ')}. For a tailored quote, use the cost calculator or contact us directly.`,
    },
    {
      keywords: ['calculator', 'estimate', 'cost calculator', 'estimate cost'],
      answer: 'Use the website cost calculator to choose WordPress or Custom Development, number of pages and extra features. The total updates instantly for a quick quote.',
    },
    {
      keywords: ['portfolio', 'projects', 'work'],
      answer: `We have completed work like ${portfolioProjects.slice(0, 3).join(', ')} and more. Our portfolio highlights digital, e-commerce, and branding projects.`,
    },
    {
      keywords: ['contact', 'reach', 'email', 'phone', 'location'],
      answer: `${contactDetails.join(' ')}`,
    },
    {
      keywords: ['about', 'who are you', 'who is zydual', 'company'],
      answer: 'zyDual is a growth-focused digital consultancy combining strategy, design craftsmanship, and measurable execution for brands that want to scale.',
    },
    {
      keywords: ['process', 'how do you work', 'approach', 'strategy'],
      answer: 'We start with a strategic roadmap, then execute design and development with growth marketing support, analytics and ongoing optimization.',
    },
    {
      keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon'],
      answer: 'Hi there! I’m zyDual’s virtual assistant. Ask me about our services, plans, portfolio, or how to get in touch.',
    },
  ];

  function normalizeText(text) {
    return text.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function getChatReply(message) {
    const normalized = normalizeText(message);
    const matching = chatKnowledge.find((entry) => entry.keywords.every((keyword) => normalized.includes(keyword)));
    if (matching) return matching.answer;

    const partial = chatKnowledge.find((entry) => entry.keywords.some((keyword) => normalized.includes(keyword)));
    if (partial) return partial.answer;

    return 'I can help with our services, pricing plans, portfolio highlights, contact details, and how to start your project. Try asking: “What services do you offer?” or “How can I contact zyDual?”.';
  }

  function scrollChatToBottom() {
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  function appendChatMessage(text, sender = 'bot') {
    if (!chatMessages) return;
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message ${sender}`;
    messageElement.textContent = text;
    chatMessages.appendChild(messageElement);
    scrollChatToBottom();
  }

  function openChat() {
    if (!liveChat) return;
    liveChat.classList.add('active');
    liveChat.setAttribute('aria-hidden', 'false');
    if (chatInput) chatInput.focus();
  }

  function closeChat() {
    if (!liveChat) return;
    liveChat.classList.remove('active');
    liveChat.setAttribute('aria-hidden', 'true');
  }

  if (chatLauncher) {
    chatLauncher.addEventListener('click', () => {
      openChat();
      if (chatMessages && chatMessages.children.length === 0) {
        appendChatMessage('Welcome! I’m here to answer questions about zyDual, our services, pricing, and contact options.');
      }
    });
  }

  if (chatClose) {
    chatClose.addEventListener('click', closeChat);
  }

  if (chatForm) {
    chatForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const userMessage = chatInput?.value.trim();
      if (!userMessage) return;
      appendChatMessage(userMessage, 'user');
      const reply = getChatReply(userMessage);
      setTimeout(() => appendChatMessage(reply, 'bot'), 250);
      if (chatInput) chatInput.value = '';
    });
  }

  chatQuickButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const quickQuery = button.dataset.question;
      if (!quickQuery) return;
      if (chatInput) chatInput.value = quickQuery;
      chatForm?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeChat();
  });
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
