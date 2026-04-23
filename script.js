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

  // Portfolio filters
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  function filterPortfolio(filter) {
    portfolioItems.forEach(item => {
      const category = item.dataset.category;
      if (filter === 'all' || category === filter) {
        item.style.display = 'block';
        setTimeout(() => item.style.opacity = '1', 10);
      } else {
        item.style.opacity = '0';
        setTimeout(() => item.style.display = 'none', 300);
      }
    });
  }

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      filterPortfolio(button.dataset.filter);
    });
  });

  let testimonialIndex = 0;
  setInterval(() => {
    testimonialIndex = (testimonialIndex + 1) % testimonialCards.length;
    showTestimonial(testimonialIndex);
  }, 6000);

  // Website cost calculator
  const costConfig = {
    base: 7500, // Base price for basic plan
    planType: { wordpress: 0, custom: 12000 }, // Custom adds extra
    pages: { 5: 7800, 10: 12000, 15: 17000 }, // Page additions - keeping as is for flexibility
    features: {
      ecommerce: 10000, // E-commerce functionality
      adminDashboard: 5000, // Admin dashboard
      userAuth: 3000, // User authentication
      paymentGateway: 4000, // Payment gateway
      seo: 3000, // SEO optimization
      maintenance: 1500, // Maintenance
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

  const pricingToggleButtons = Array.from(document.querySelectorAll('.pricing-pill'));
  const pricingCardPrices = Array.from(document.querySelectorAll('.pricing-card-price'));

  function updatePricingMode(mode) {
    pricingToggleButtons.forEach((button) => {
      button.classList.toggle('active', button.dataset.pricingMode === mode);
    });

    pricingCardPrices.forEach((priceBlock) => {
      const value = mode === 'monthly' ? priceBlock.dataset.monthly : priceBlock.dataset.oneTime;
      const valueEl = priceBlock.querySelector('.pricing-card-price-value');
      if (valueEl && value) {
        valueEl.textContent = value;
      }
    });
  }

  pricingToggleButtons.forEach((button) => {
    button.addEventListener('click', () => {
      updatePricingMode(button.dataset.pricingMode);
    });
  });

  updatePricingMode('one-time');

  // Live chatbot DOM references are initialized after the markup loads
  let chatLauncher;
  let liveChat;
  let chatClose;
  let chatMessages;
  let chatForm;
  let chatInput;
  let chatQuickButtons = [];

  chatLauncher = document.getElementById('chatLauncher');
  liveChat = document.getElementById('liveChat');
  chatClose = document.getElementById('chatClose');
  chatMessages = document.getElementById('chatMessages');
  chatForm = document.getElementById('chatForm');
  chatInput = document.getElementById('chatInput');
  chatQuickButtons = Array.from(document.querySelectorAll('.chat-quick-action'));

  const serviceNames = Array.from(document.querySelectorAll('.service-card h3')).map((el) => el.textContent.trim());
  const pricingPlans = Array.from(document.querySelectorAll('.pricing-table .plan-header')).map((el) => {
    return {
      name: el.querySelector('.plan-name')?.textContent.trim() || 'Plan',
      price: el.querySelector('.plan-price')?.textContent.trim() || '',
    };
  });
  const contactDetails = Array.from(document.querySelectorAll('.contact-info ul li')).map((el) => el.textContent.trim());
  const portfolioProjects = Array.from(document.querySelectorAll('.portfolio-item .overlay h3')).map((el) => el.textContent.trim());
  const liveProjects = [
    {
      name: 'RealTech IT Academy Website',
      location: 'Hyderabad, Telangana',
      type: 'WordPress Website',
      link: 'https://realtechitacademy.com'
    },
    {
      name: 'Vetriarasi E-commerce Store',
      location: 'Vellore, Tamil Nadu',
      type: 'Full-stack E-commerce',
      link: 'https://vetriarasi.com'
    },
    {
      name: 'Saidah Collections Jewelry Website',
      location: 'Apex, NC, USA',
      type: 'WordPress E-commerce',
      link: 'https://saidahcollections.com'
    }
  ];

  const chatKnowledge = [
    {
      keywords: ['service', 'offer', 'offers', 'provide', 'what do you do'],
      answer: `We offer ${serviceNames.join(', ')}. Each service is designed to help brands grow online with strategy, design, development and measurable marketing.`,
    },
    {
      keywords: ['web development', 'website development', 'websites', 'custom website', 'apps'],
      answer: 'We create custom websites and web apps optimized for performance, conversions, and growth. Our work includes responsive builds, CMS sites, e-commerce and landing pages using modern technologies like HTML, CSS, JavaScript, React, PHP, Java, WordPress, and more.',
    },
    {
      keywords: ['graphic design', 'design', 'branding'],
      answer: 'Our graphic design service includes branding, creative asset production and visual systems that elevate your identity across digital touch points. We offer design packs from ₹2,500 for basic branding to ₹35,000 for complete brand identity systems.',
    },
    {
      keywords: ['digital marketing', 'marketing', 'campaign'],
      answer: 'We deliver digital marketing strategy and execution across channels to increase visibility, improve ROI, and grow your audience. Our plans range from ₹7,500/month for starter marketing to ₹50,000/month for performance-focused campaigns.',
    },
    {
      keywords: ['seo', 'search engine', 'organic'],
      answer: 'Our SEO service optimizes your website for search engines with technical, on-page and content improvements to help your brand rank higher organically. Plans start from ₹4,999/month for basic SEO to ₹25,000/month for advanced competitive SEO.',
    },
    {
      keywords: ['dropshipping', 'drop shipping', 'ecommerce', 'e-commerce'],
      answer: 'We help build and optimize dropshipping stores with automation, supplier setup, and user-friendly storefronts to scale your e-commerce business. Our e-commerce functionality add-on ranges from ₹10,000 to ₹35,000.',
    },
    {
      keywords: ['pricing', 'cost', 'estimate', 'price', 'plans'],
      answer: `Our pricing includes website development plans from ₹7,500/year for basic sites to ₹25,000/year for corporate solutions. We also offer add-on services like admin dashboards (₹5,000-₹12,000), payment gateways (₹4,000-₹10,000), and maintenance (₹1,500-₹5,000/month). Use our cost calculator for a personalized quote!`,
    },
    {
      keywords: ['calculator', 'estimate', 'cost calculator', 'estimate cost'],
      answer: 'Use the website cost calculator to choose WordPress or Custom Development, number of pages and extra features. The total updates instantly for a quick quote.',
    },
    {
      keywords: ['portfolio', 'projects', 'work', 'showcase'],
      answer: `Our portfolio includes ${portfolioProjects.slice(0, 3).join(', ')} and more. We showcase digital transformation, e-commerce solutions, and branding projects that drive real business results.`,
    },
    {
      keywords: ['live projects', 'real projects', 'case studies', 'examples'],
      answer: `Check out our live projects: ${liveProjects.map(p => `${p.name} (${p.location}) - ${p.type}`).join('; ')}. Each project includes a live demo link - visit our Projects section to explore them!`,
    },
    {
      keywords: ['realtech', 'it academy', 'hyderabad'],
      answer: 'Our RealTech IT Academy website in Hyderabad features a modern WordPress design with course showcases, responsive layout, and inquiry forms. Visit: https://realtechitacademy.com',
    },
    {
      keywords: ['vetriarasi', 'vellore', 'water supply', 'grocery'],
      answer: 'The Vetriarasi e-commerce store in Vellore includes full-stack development with user authentication, product ordering, admin dashboard, and real-time delivery tracking. Visit: https://vetriarasi.com',
    },
    {
      keywords: ['saidah', 'jewelry', 'apex', 'usa', 'collections'],
      answer: 'Saidah Collections jewelry website in Apex, NC, USA features WordPress e-commerce with product listings, secure checkout, and elegant design. Visit: https://saidahcollections.com',
    },
    {
      keywords: ['contact', 'reach', 'email', 'phone', 'location', 'whatsapp'],
      answer: `${contactDetails.join(' ')} You can also reach us via WhatsApp at +91 8072275209 for quick inquiries.`,
    },
    {
      keywords: ['about', 'who are you', 'who is zydual', 'company'],
      answer: 'zyDual is a growth-focused digital consultancy combining strategy, design craftsmanship, and measurable execution for brands that want to scale. We specialize in websites, e-commerce, digital marketing, and complete online solutions.',
    },
    {
      keywords: ['process', 'how do you work', 'approach', 'strategy'],
      answer: 'We start with a strategic roadmap, then execute design and development with growth marketing support, analytics and ongoing optimization. Our process includes consultation, planning, development, testing, launch, and maintenance.',
    },
    {
      keywords: ['technologies', 'tech stack', 'tools', 'frameworks'],
      answer: 'We work with modern technologies including HTML, CSS, JavaScript, React, PHP, Java, WordPress, Shopify, Node.js, MySQL, AWS, and Git. Our tech stack ensures high-performance, scalable solutions.',
    },
    {
      keywords: ['maintenance', 'support', 'updates', 'ongoing'],
      answer: 'We provide website maintenance from ₹1,500-₹5,000/month including updates, fixes, support, monitoring, and content changes. Speed optimization is also available for ₹2,000-₹6,000.',
    },
    {
      keywords: ['payment', 'gateway', 'razorpay', 'stripe', 'paypal'],
      answer: 'We integrate payment gateways like Razorpay, Stripe, PayPal, and UPI for secure online transactions. Integration costs range from ₹4,000-₹10,000 depending on complexity.',
    },
    {
      keywords: ['admin dashboard', 'backend', 'cms', 'management'],
      answer: 'Our admin dashboards allow you to manage website content, forms, users, or products from a backend panel. Perfect for content updates without technical knowledge. Pricing: ₹5,000-₹12,000.',
    },
    {
      keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'greetings'],
      answer: 'Hi there! I\'m zyDual\'s virtual assistant. Ask me about our services, live projects, pricing plans, portfolio, or how to get in touch. I\'m here to help you grow your business online!',
    },
    {
      keywords: ['thank you', 'thanks', 'appreciate'],
      answer: 'You\'re welcome! Feel free to ask if you have any more questions about our services or need help getting started with your project.',
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
