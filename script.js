const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scrollTopBtn');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const navItems = Array.from(document.querySelectorAll('.nav-item'));
const sections = Array.from(document.querySelectorAll('main section'));
const contactForms = Array.from(document.querySelectorAll('.contact-form'));
const counters = document.querySelectorAll('.stat-number');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const testimonialButtons = document.querySelectorAll('.testimonial-btn');
const GOOGLE_REVIEW_LINK = 'https://g.page/r/Cbk1ta5vNH_SEAE/review';
const reviews = [
  {
    name: 'Vetriarasiwatersuppyl',
    initial: 'V',
    rating: 5,
    date: 'Recently',
    text: 'I had a great experience with the Zydual team for my company website and digital marketing. Their professionalism and support helped me get more customers. I’m very happy with their work and looking forward to working with them again in the future. Highly recommended!.'
  },
  {
    name: 'Songs',
    initial: 'S',
    rating: 5,
    date: 'Recently',
    text: 'Great experience with Zydual! Their team is professional, responsive, and focused on understanding the actual business requirements before suggesting solutions. The quality of their web development, digital marketing, and AI automation services is impressive .'
  },
  {
    name: 'Nivash M',
    initial: 'N',
    rating: 5,
    date: 'Recently',
    text: 'Very good platform to meet your business marketing needs. Also the website design for Commercial business is quite user friendly..'
  }
];

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
  if (testimonialCards.length > 0) {
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
  }

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

  if (testimonialCards.length > 0) {
    let testimonialIndex = 0;
    setInterval(() => {
      testimonialIndex = (testimonialIndex + 1) % testimonialCards.length;
      showTestimonial(testimonialIndex);
    }, 6000);
  }

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
  const estimateOverview = document.getElementById('estimateOverview');
  const heroPricingValue = document.getElementById('heroPricingValue');
  const heroPricingSubtitle = document.getElementById('heroPricingSubtitle');

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

    if (estimateOverview) {
      const planLabel = selectedPlan === 'wordpress' ? 'WordPress site' : 'Custom website';
      const selectedFeatures = featureInputs
        .filter((input) => input && input.checked)
        .map((input) => input.parentElement.textContent.trim())
        .join(', ') || 'No extra features selected';

      estimateOverview.textContent = `Live estimate for ${planLabel}, ${selectedPage} pages, plus ${selectedFeatures}. Final quote will be tailored after discovery.`;
    }
  }

  if (planTypeEl) planTypeEl.addEventListener('change', updateCostCalculator);
  pageInputs.forEach((input) => input.addEventListener('change', updateCostCalculator));
  featureInputs.forEach((input) => input && input.addEventListener('change', updateCostCalculator));

  updateCostCalculator();

  const pricingToggleButtons = Array.from(document.querySelectorAll('.pricing-pill'));
  const pricingCardPrices = Array.from(document.querySelectorAll('.pricing-card-price'));

  function updateHeroPricingSummary(mode) {
    if (!heroPricingValue || !heroPricingSubtitle) return;
    if (mode === 'monthly') {
      heroPricingValue.textContent = '₹15,500 / month';
      heroPricingSubtitle.textContent = 'Flexible monthly payment for teams growing fast.';
    } else {
      heroPricingValue.textContent = '₹15,500 / year';
      heroPricingSubtitle.textContent = 'One-time payment with full launch support included.';
    }
  }

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

    updateHeroPricingSummary(mode);
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
      keywords: ['what services', 'what service', 'services do you offer', 'offer', 'offers'],
      answer: `We provide Web Development, SEO, Digital Marketing, Branding, Mobile App Development, Business Growth, Dropshipping Services, and AI Services. Each service is built to help brands grow online with strategy, design, development and measurable marketing.`,
    },
    {
      keywords: ['web development', 'website development', 'websites', 'e-commerce', 'landing page'],
      priority: 20,
      answer: 'Website Development pricing: Starter ₹7,999, Business ₹14,999, and Professional ₹24,999+. Website add-ons include Admin Dashboard ₹5,000–₹12,000; User Login / Authentication ₹3,000–₹8,000; Payment Gateway Integration ₹4,000–₹10,000; E-commerce Functionality ₹10,000–₹35,000; SEO Setup (Basic) ₹3,000–₹8,000; Website Maintenance ₹1,500–₹5,000/month; Speed Optimization ₹2,000–₹6,000; Additional Page ₹500–₹1,500/page; and CRM Integration ₹4,999+. We build responsive business websites, landing pages, and e-commerce stores. Use the Cost Estimator to calculate your selected package.',
    },
    {
      keywords: ['seo', 'search engine', 'organic visibility', 'technical seo', 'on-page seo', 'off-page seo', 'seo audit'],
      priority: 20,
      answer: 'SEO plans are Starter SEO at ₹5,999/month, Growth SEO at ₹9,999/month, and Advanced SEO at ₹15,999/month. Services include local and technical SEO, on-page optimization, authority building, and SEO audits.',
    },
    {
      keywords: ['digital marketing', 'marketing', 'campaign', 'google ads', 'meta ads', 'content marketing'],
      priority: 20,
      answer: 'Digital Marketing plans are Starter at ₹7,500/month, Growth at ₹15,000/month, and Premium at ₹25,000/month+. Services include social media campaigns, lead generation, Google Ads, Meta Ads, content marketing, and marketing strategy.',
    },
    {
      keywords: ['branding', 'brand identity', 'logo design', 'brand strategy', 'social media branding', 'brand guidelines'],
      priority: 20,
      answer: 'Graphic Design and branding packages are Single Design at ₹499, 5 Designs at ₹1,999, and Monthly Design Package at ₹4,999+/month. Services include logo design, brand identity, brand strategy, social media branding, and brand guidelines.',
    },
    {
      keywords: ['mobile app', 'app development', 'android', 'ios', 'cross-platform', 'app testing', 'app maintenance'],
      priority: 20,
      answer: 'App Development packages are Basic App at ₹14,999, Business App at ₹29,999, and Advanced App at ₹49,999+. We build Android, iOS, and cross-platform apps with UI/UX design, testing, and post-launch support.',
    },
    {
      keywords: ['business growth', 'growth strategy', 'market expansion', 'lead generation', 'conversion optimization', 'customer acquisition', 'revenue planning'],
      priority: 20,
      answer: 'Business Growth and Consulting pricing is Consultation at ₹4,999/session, Growth Strategy at ₹9,999, and Business Growth Management at ₹19,999+. Services cover market expansion, lead generation, conversion optimization, customer acquisition, and revenue planning.',
    },
    {
      keywords: ['dropshipping', 'shopify', 'store setup', 'product research', 'supplier management'],
      priority: 20,
      answer: 'Dropshipping packages use the website development tiers: Starter at ₹7,999, Business at ₹14,999, and Professional at ₹24,999+. We help with Shopify setup, product research, supplier management, marketing, and conversion optimization. Final scope depends on store requirements.',
    },
    {
      keywords: ['ai services', 'ai', 'chatbot', 'automation', 'machine learning', 'generative ai', 'content generation'],
      priority: 20,
      answer: 'AI Automation pricing is Starter Automation at ₹9,999, Business Automation at ₹24,999, and Advanced AI Automation at ₹49,999+. Custom Enterprise Automation is available by custom quote. We build chatbots, workflow automation, AI integrations, and practical machine learning solutions.',
    },
    {
      keywords: ['blog', 'article', 'articles', 'insights', 'guides', 'blog page'],
      answer: 'Our blog shares insights on Web Development, SEO, Digital Marketing, Branding, Mobile Apps, AI Solutions, Business Growth and Dropshipping. Visit the Blog page for guides and expert articles.',
    },
    {
      keywords: ['portfolio', 'projects', 'work', 'showcase', 'case studies'],
      answer: `Our portfolio features projects such as RealTech IT Academy, Vetriarasi E-commerce Store, Saidah Collections Jewelry Website and more. We showcase websites, e-commerce solutions, branding systems and digital growth work.`,
    },
    {
      keywords: ['realtech', 'it academy', 'hyderabad', 'realtech it academy'],
      answer: 'Our RealTech IT Academy project is a modern WordPress website built for course showcase, responsive layout and student inquiries. Visit https://realtechitacademy.com for the live demo.',
    },
    {
      keywords: ['vetriarasi', 'vellore', 'water supply', 'e-commerce store', 'delivery tracking'],
      answer: 'The Vetriarasi project is a full-stack e-commerce store with user authentication, product ordering, an admin dashboard and delivery tracking. Visit https://vetriarasi.com to see the live site.',
    },
    {
      keywords: ['saidah', 'jewelry', 'apex', 'usa', 'saidah collections'],
      answer: 'Saidah Collections is a WordPress jewelry e-commerce website built for a US-based brand in Apex, NC. It includes product listings, secure checkout and elegant shopping design.',
    },
    {
      keywords: ['contact', 'reach', 'email', 'phone', 'whatsapp', 'get in touch'],
      answer: `${contactDetails.join(' ')} You can also contact us on WhatsApp at +91 8072275209 for fast project discussions.`,
    },
    {
      keywords: ['about', 'who are you', 'who is zydual', 'company'],
      answer: 'zyDual is a digital agency based in India that helps businesses grow online with websites, SEO, branding, digital marketing, mobile apps and AI solutions.',
    },
    {
      keywords: ['technologies', 'tech stack', 'tools', 'frameworks', 'html', 'css', 'javascript', 'react', 'php', 'java', 'wordpress', 'shopify', 'node.js', 'mysql', 'aws', 'git'],
      answer: 'We work with technologies like HTML, CSS, JavaScript, React, PHP, Java, WordPress, Shopify, Node.js, MySQL, AWS and Git to build modern, scalable digital products.',
    },
    {
      keywords: ['pricing', 'cost', 'estimate', 'quote', 'plans', 'price'],
      answer: 'Current prices: Websites: Starter ₹7,999, Business ₹14,999, Professional ₹24,999+. Apps: Basic ₹14,999, Business ₹29,999, Advanced ₹49,999+. Graphic Design: Single Design ₹499, 5 Designs ₹1,999, Monthly Design Package ₹4,999+/month. SEO: Starter ₹5,999/month, Growth ₹9,999/month, Advanced ₹15,999/month. Digital Marketing: Starter ₹7,500/month, Growth ₹15,000/month, Premium ₹25,000/month+. Business Growth: Consultation ₹4,999/session, Growth Strategy ₹9,999, Business Growth Management ₹19,999+. AI Automation: Starter ₹9,999, Business ₹24,999, Advanced ₹49,999+, Custom Enterprise Automation by quote. Dropshipping: ₹7,999, ₹14,999, and ₹24,999+ packages. Website Add-Ons: Admin Dashboard ₹5,000–₹12,000; User Login / Authentication ₹3,000–₹8,000; Payment Gateway Integration ₹4,000–₹10,000; E-commerce Functionality ₹10,000–₹35,000; SEO Setup (Basic) ₹3,000–₹8,000; Website Maintenance ₹1,500–₹5,000/month; Speed Optimization ₹2,000–₹6,000; Additional Page ₹500–₹1,500/page; CRM Integration ₹4,999+. Use the Cost Estimator for a combined quote.',
    },
    {
      keywords: ['calculator', 'cost calculator', 'estimate cost'],
      answer: 'Open the Cost Estimator page to compare Website Development, Website Add-Ons, App Development, Graphic Design, SEO, Digital Marketing, Business Growth / Consulting, and AI Automation. Select plans and multiple add-ons to see a live combined estimate.',
    },
    {
      keywords: ['ai automation', 'automation', 'ai assistant', 'chatbot'],
      priority: 20,
      answer: 'AI Automation packages are Starter Automation ₹9,999, Business Automation ₹24,999, and Advanced AI Automation ₹49,999+. Custom Enterprise Automation is available by custom quote. We automate lead capture, customer support, follow-ups, CRM workflows, and reporting. Final scope depends on integrations and workflow requirements.',
    },
    {
      keywords: ['maintenance', 'support', 'updates', 'ongoing'],
      answer: 'We provide ongoing website support, maintenance, updates and performance checks. Maintenance plans keep your site secure, updated and running smoothly.',
    },
    {
      keywords: ['payment gateway', 'payment', 'razorpay', 'stripe', 'paypal', 'upi'],
      answer: 'We integrate payment gateways like Razorpay, Stripe, PayPal and UPI for secure online payments and seamless checkout experiences.',
    },
    {
      keywords: ['admin dashboard', 'backend', 'cms', 'management panel'],
      answer: 'Our admin dashboard solutions let you manage website content, orders, users and products without technical help. They are great for e-commerce and business websites.',
    },
    {
      keywords: ['website add-on', 'website add-ons', 'crm integration', 'admin dashboard', 'user login', 'payment gateway'],
      priority: 20,
      answer: 'Website Add-On pricing: Admin Dashboard ₹5,000–₹12,000; User Login / Authentication ₹3,000–₹8,000; Payment Gateway Integration ₹4,000–₹10,000; E-commerce Functionality ₹10,000–₹35,000; SEO Setup (Basic) ₹3,000–₹8,000; Website Maintenance ₹1,500–₹5,000/month; Speed Optimization ₹2,000–₹6,000; Additional Page ₹500–₹1,500/page; CRM Integration ₹4,999+. You can select multiple add-ons in the Cost Estimator for a combined estimate.',
    },
    {
      keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'greetings', 'welcome'],
      answer: 'Hello! I’m zyDual’s virtual assistant. Ask me about our services, portfolio, pricing, blog, or how to contact us.',
    },
    {
      keywords: ['thank you', 'thanks', 'appreciate', 'thank'],
      answer: 'You’re welcome! Feel free to ask if you want help choosing a service or need a quote for your project.',
    },
  ];

  function normalizeText(text) {
    return text.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function getChatReply(message) {
    const normalized = normalizeText(message);
    const asksPricing = /\b(price|pricing|cost|quote|estimate|rate)\b/.test(normalized);
    const matches = chatKnowledge.flatMap((entry) => entry.keywords
      .map((keyword) => normalizeText(keyword))
      .filter((keyword) => normalized.includes(keyword))
      .map((keyword) => ({ entry, keyword })));
    matches.sort((first, second) => {
      const firstScore = first.keyword.length + (asksPricing ? first.entry.priority || 0 : 0);
      const secondScore = second.keyword.length + (asksPricing ? second.entry.priority || 0 : 0);
      return secondScore - firstScore;
    });
    if (matches.length > 0) return matches[0].entry.answer;

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

function setupContactForm(form) {
  const formMessage = form.querySelector('.form-message');
  const nameField = form.querySelector('input[name="name"]');
  const emailField = form.querySelector('input[name="email"]');
  const messageField = form.querySelector('textarea[name="message"]');

  if (!formMessage || !nameField || !emailField || !messageField) return;

  form.addEventListener('submit', (e) => {
    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const message = messageField.value.trim();

    if (!name || !email || !message) {
      e.preventDefault();
      formMessage.textContent = 'Please fill in all fields before submitting.';
      formMessage.style.color = '#f97316';
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      e.preventDefault();
      formMessage.textContent = 'Please provide a valid email address.';
      formMessage.style.color = '#f97316';
      return;
    }

    if (!form.action) {
      e.preventDefault();
      formMessage.textContent = 'Thanks! Your message has been sent successfully.';
      formMessage.style.color = '#22c55e';
      form.reset();
    }
  });
}

contactForms.forEach(setupContactForm);

/* ========================================"}]}
   COST ESTIMATOR FUNCTIONALITY
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const billingBtns = document.querySelectorAll('.billing-btn');
  const summaryViewBtns = document.querySelectorAll('.summary-view-btn');
  const accordions = document.querySelectorAll('.estimator-accordion');
  const planInputs = document.querySelectorAll('.estimator-options input[type="radio"], .estimator-options input[type="checkbox"]');
  const selectedPlansList = document.getElementById('selectedPlans');
  const selectedAddonsList = document.getElementById('selectedAddons');
  const totalAmountEl = document.getElementById('totalAmount');
  const totalPeriodEl = document.getElementById('totalPeriod');

  // State
  let billingMode = 'one-time'; // 'one-time' or 'monthly'
  let summaryView = 'monthly'; // 'monthly' or 'yearly'

  // Initialize first accordion as open
  if (accordions.length > 0) {
    accordions[0].classList.add('open');
  }

  // Accordion toggle
  accordions.forEach(accordion => {
    const header = accordion.querySelector('.accordion-header');
    header.addEventListener('click', () => {
      accordions.forEach(acc => {
        if (acc !== accordion) acc.classList.remove('open');
      });
      accordion.classList.toggle('open');
    });
  });

  // Billing toggle
  billingBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      billingBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      billingMode = btn.dataset.billing;
      updateCalculation();
    });
  });

  // Summary view toggle
  summaryViewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      summaryViewBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      summaryView = btn.dataset.view;
      updateCalculation();
    });
  });

  // Plan/Add-on selection
  planInputs.forEach(input => {
    input.addEventListener('change', updateCalculation);
  });

  // Main calculation function
  function updateCalculation() {
    const selectedPlans = [];
    const selectedAddons = [];
    let oneTimeTotal = 0;
    let monthlyTotal = 0;
    let yearlyTotal = 0;
    let hasCustomQuote = false;

    // Get all selected radio groups (plans)
    const planGroups = document.querySelectorAll('.radio-group');
    planGroups.forEach(group => {
      const checked = group.querySelector('input:checked');
      if (checked) {
        const label = checked.dataset.label;
        const price = parseInt(checked.dataset.price) || 0;
        const isMonthly = checked.dataset.monthly === 'true';

        const isCustomQuote = checked.dataset.customQuote === 'true';
        const item = { label, price, isMonthly, isCustomQuote };
        if (group.dataset.category === 'addon') {
          selectedAddons.push(item);
        } else {
          selectedPlans.push(item);
        }
        hasCustomQuote = hasCustomQuote || isCustomQuote;

        if (isMonthly) {
          monthlyTotal += price;
          yearlyTotal += price * 12;
        } else {
          oneTimeTotal += price;
        }
      }
    });

    // Get all selected checkboxes (add-ons)
    const checkboxGroups = document.querySelectorAll('.checkbox-group');
    checkboxGroups.forEach(group => {
      const checkedItems = group.querySelectorAll('input:checked');
      checkedItems.forEach(checked => {
        const label = checked.dataset.label;
        const price = parseInt(checked.dataset.price) || 0;
        const isMonthly = checked.dataset.monthly === 'true';

        selectedAddons.push({
          label,
          price,
          displayPrice: checked.dataset.displayPrice,
          isMonthly,
          isCustomQuote: false,
        });

        if (isMonthly) {
          monthlyTotal += price;
          yearlyTotal += price * 12;
        } else {
          oneTimeTotal += price;
        }
      });
    });

    // Update UI
    renderSelectedItems(selectedPlans, selectedAddons);
    renderTotal(oneTimeTotal, monthlyTotal, yearlyTotal, hasCustomQuote);
  }

  // Render selected items to summary
  function renderSelectedItems(plans, addons) {
    // Plans
    if (plans.length === 0) {
      selectedPlansList.innerHTML = '<li class="empty-item">No plan selected</li>';
    } else {
      selectedPlansList.innerHTML = plans.map(plan => `
        <li>
          <span>${plan.label}</span>
          <span class="item-price">${plan.isCustomQuote ? 'Custom Quote' : `₹${plan.price.toLocaleString()}`}</span>
        </li>
      `).join('');
    }

    // Add-ons
    if (addons.length === 0) {
      selectedAddonsList.innerHTML = '<li class="empty-item">No add-ons selected</li>';
    } else {
      selectedAddonsList.innerHTML = addons.map(addon => `
        <li>
          <span>${addon.label}</span>
          <span class="item-price">${addon.isCustomQuote ? 'Custom Quote' : addon.displayPrice || `₹${addon.price.toLocaleString()}`}</span>
        </li>
      `).join('');
    }
  }

  // Render total amount
  function renderTotal(oneTime, monthly, yearly, hasCustomQuote) {
    let displayAmount;
    let displayPeriod;
    const recurringAmount = summaryView === 'monthly' ? monthly : yearly;

    if (summaryView === 'monthly') {
      displayAmount = oneTime + monthly;
      displayPeriod = oneTime > 0 && monthly > 0 ? 'one-time + per month' : oneTime > 0 ? 'one-time' : 'per month';
    } else {
      displayAmount = oneTime + yearly;
      displayPeriod = oneTime > 0 && yearly > 0 ? 'one-time + per year' : oneTime > 0 ? 'one-time' : 'per year';
    }

    totalAmountEl.textContent = hasCustomQuote
      ? `${recurringAmount + oneTime > 0 ? `₹${displayAmount.toLocaleString()} + ` : ''}Custom Quote`
      : `₹${displayAmount.toLocaleString()}`;
    totalPeriodEl.textContent = hasCustomQuote ? 'Contact us for enterprise pricing' : displayPeriod;
  }

  // Initial calculation
  updateCalculation();
});

// Invoice Generator Functionality
document.addEventListener('DOMContentLoaded', function() {
  const generateInvoiceBtn = document.getElementById('generateInvoiceBtn');
  
  if (generateInvoiceBtn) {
    generateInvoiceBtn.addEventListener('click', generateInvoice);
  }
  
  function generateInvoice() {
    // Get selected plans and addons from the summary
    const selectedPlansList = document.getElementById('selectedPlans');
    const selectedAddonsList = document.getElementById('selectedAddons');
    const totalAmountEl = document.getElementById('totalAmount');
    const totalPeriodEl = document.getElementById('totalPeriod');
    
    if (!selectedPlansList || !totalAmountEl) {
      alert('Please select services from the Cost Estimator first.');
      return;
    }
    
    // Extract selected items
    const plans = [];
    const addons = [];
    
    if (selectedPlansList) {
      selectedPlansList.querySelectorAll('li:not(.empty-item)').forEach(item => {
        plans.push(item.textContent);
      });
    }
    
    if (selectedAddonsList) {
      selectedAddonsList.querySelectorAll('li:not(.empty-item)').forEach(item => {
        addons.push(item.textContent);
      });
    }
    
    const totalAmount = totalAmountEl.textContent;
    const billingPeriod = totalPeriodEl.textContent;
    
    // Generate invoice HTML
    const invoiceHTML = generateInvoiceContent(plans, addons, totalAmount, billingPeriod);
    
    // Open invoice in new window
    const invoiceWindow = window.open('', '_blank', 'width=800,height=900');
    invoiceWindow.document.write(invoiceHTML);
    invoiceWindow.document.close();
  }
  
  function generateInvoiceContent(plans, addons, totalAmount, billingPeriod) {
    const today = new Date();
    const invoiceNumber = 'INV-' + Date.now().toString().slice(-8);
    const dueDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice - zyDual</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; padding: 20px; }
    .invoice-container { max-width: 800px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden; }
    .invoice-header { background: linear-gradient(135deg, #7c3aed, #2dd4bf); color: white; padding: 30px; display: flex; justify-content: space-between; align-items: center; }
    .invoice-header h1 { font-size: 2rem; margin-bottom: 5px; }
    .invoice-header .invoice-number { font-size: 1.1rem; opacity: 0.9; }
    .invoice-body { padding: 30px; }
    .company-info, .client-info { margin-bottom: 30px; }
    .company-info h3, .client-info h3 { color: #7c3aed; margin-bottom: 10px; font-size: 1.1rem; }
    .company-info p, .client-info p { color: #666; line-height: 1.8; }
    .invoice-table { width: 100%; border-collapse: collapse; margin: 30px 0; }
    .invoice-table th { background: #f8f9fa; padding: 15px; text-align: left; font-weight: 600; color: #333; border-bottom: 2px solid #7c3aed; }
    .invoice-table td { padding: 15px; border-bottom: 1px solid #eee; }
    .invoice-table tr:last-child td { border-bottom: none; }
    .invoice-table .amount { text-align: right; font-weight: 600; }
    .invoice-total { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: right; }
    .invoice-total .total-label { font-size: 1.1rem; color: #666; }
    .invoice-total .total-amount { font-size: 2rem; font-weight: 700; color: #7c3aed; }
    .invoice-footer { background: #1e1e2e; color: white; padding: 20px 30px; display: flex; justify-content: space-between; align-items: center; }
    .invoice-footer p { font-size: 0.9rem; opacity: 0.8; }
    .print-btn { background: #7c3aed; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 1rem; }
    .print-btn:hover { background: #6d28d9; }
    @media print { body { padding: 0; } .invoice-container { box-shadow: none; } .print-btn { display: none; } }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="invoice-header">
      <div>
        <h1>zyDual</h1>
        <p>IT & Digital Service Company</p>
      </div>
      <div style="text-align: right;">
        <div class="invoice-number">Invoice #${invoiceNumber}</div>
        <p>Date: ${today.toLocaleDateString()}</p>
        <p>Due: ${dueDate.toLocaleDateString()}</p>
      </div>
    </div>
    
    <div class="invoice-body">
      <div style="display: flex; gap: 40px;">
        <div class="company-info">
          <h3>From:</h3>
          <p><strong>zyDual</strong><br>
          Thudiyalur road near KGISL campus<br>
          saravanampatti, coimbatore<br>
          TamilNadu, India<br>
          Email: zydual.in@gmail.com<br>
          Phone: +91 8072275209</p>
        </div>
        <div class="client-info">
          <h3>Bill To:</h3>
          <p><strong>Customer</strong><br>
          [Customer details will be collected]<br>
          <br>
          Thank you for choosing zyDual!</p>
        </div>
      </div>
      
      <table class="invoice-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Type</th>
            <th class="amount">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${plans.length > 0 ? plans.map(plan => `
          <tr>
            <td>${plan}</td>
            <td>Plan</td>
            <td class="amount">Included</td>
          </tr>`).join('') : '<tr><td colspan="3">No plans selected</td></tr>'}
          ${addons.length > 0 ? addons.map(addon => `
          <tr>
            <td>${addon}</td>
            <td>Add-on</td>
            <td class="amount">Included</td>
          </tr>`).join('') : ''}
        </tbody>
      </table>
      
      <div class="invoice-total">
        <div class="total-label">Total Amount (${billingPeriod})</div>
        <div class="total-amount">${totalAmount}</div>
      </div>
    </div>
    
    <div class="invoice-footer">
      <div>
        <p>Thank you for your business!</p>
        <p>Payment due within 7 days</p>
      </div>
      <button class="print-btn" onclick="window.print()">Print Invoice</button>
    </div>
  </div>
</body>
</html>`;
  }
});

// Testimonials Carousel & Portfolio Modal
document.addEventListener('DOMContentLoaded', function() {
  const googleReviewsGrid = document.getElementById('googleReviewsGrid');

  if (googleReviewsGrid) {
    googleReviewsGrid.innerHTML = reviews.map((review) => {
      const stars = Array.from({ length: review.rating }, () => '★').join('');

      return `
        <article class="google-review-card" aria-label="Google review from ${review.name}">
          <div class="google-review-top">
            <div class="google-review-profile">
              <div class="google-review-avatar" aria-hidden="true">${review.initial}</div>
              <div>
                <h3 class="google-review-name">${review.name}</h3>
              </div>
            </div>
            <div class="google-review-source">
              <span class="google-source-mark" aria-hidden="true">G</span>
              <span>Google Review</span>
            </div>
          </div>

          <div class="google-review-stars" aria-label="${review.rating} out of 5 stars">${stars}</div>

          <p class="google-review-text">“${review.text}”</p>

          <div class="google-review-meta">
            <span class="google-review-date">${review.date}</span>
            <span class="google-review-verified" aria-label="Verified Google review">
              <span aria-hidden="true">✓</span>
              Verified
            </span>
          </div>

          <a class="google-review-link" href="${GOOGLE_REVIEW_LINK}" target="_blank" rel="noopener noreferrer" aria-label="View review for ${review.name} on Google">
            View on Google <span aria-hidden="true">→</span>
          </a>
        </article>
      `;
    }).join('');

    const writeReviewButton = document.querySelector('.google-review-button');
    if (writeReviewButton) {
      writeReviewButton.href = GOOGLE_REVIEW_LINK;
    }
  }

  // Testimonials Carousel
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
  const testimonialDots = document.querySelectorAll('.testimonial-dots .dot');
  const carouselPrev = document.querySelector('.carousel-arrow.prev');
  const carouselNext = document.querySelector('.carousel-arrow.next');
  let currentTestimonial = 0;
  
  function showTestimonialSlide(index) {
    testimonialSlides.forEach(slide => slide.classList.remove('active'));
    testimonialDots.forEach(dot => dot.classList.remove('active'));
    
    if (testimonialSlides[index]) {
      testimonialSlides[index].classList.add('active');
    }
    if (testimonialDots[index]) {
      testimonialDots[index].classList.add('active');
    }
    currentTestimonial = index;
  }
  
  if (testimonialDots.length > 0) {
    testimonialDots.forEach((dot, index) => {
      dot.addEventListener('click', () => showTestimonialSlide(index));
    });
  }
  
  if (carouselPrev) {
    carouselPrev.addEventListener('click', () => {
      const newIndex = currentTestimonial > 0 ? currentTestimonial - 1 : testimonialSlides.length - 1;
      showTestimonialSlide(newIndex);
    });
  }
  
  if (carouselNext) {
    carouselNext.addEventListener('click', () => {
      const newIndex = currentTestimonial < testimonialSlides.length - 1 ? currentTestimonial + 1 : 0;
      showTestimonialSlide(newIndex);
    });
  }
  
  // Auto-advance testimonials
  setInterval(() => {
    if (testimonialSlides.length > 0) {
      const newIndex = currentTestimonial < testimonialSlides.length - 1 ? currentTestimonial + 1 : 0;
      showTestimonialSlide(newIndex);
    }
  }, 6000);
  
  // Portfolio Modal
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  const portfolioModal = document.getElementById('portfolioModal');
  const portfolioModalClose = document.querySelector('.portfolio-modal-close');
  
  // Portfolio project data
  const portfolioData = {
    'realtech': {
      title: 'RealTech IT Academy',
      type: 'Web Development - WordPress',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
      description: 'Modern WordPress website for IT training institute designed to improve online presence, showcase courses, and increase student inquiries.',
      features: ['Responsive WordPress Design', 'Course Showcase System', 'Inquiry Form Integration', 'SEO Optimized', 'Fast Loading Speed', 'Mobile-Friendly'],
      link: 'https://realtechitacademy.com'
    },
    'vetriarasi': {
      title: 'Vetriarasi E-commerce',
      type: 'E-commerce - Full Stack',
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80',
      description: 'Full-stack e-commerce with PHP & MySQL for water supply business with user authentication and real-time delivery tracking.',
      features: ['User Authentication', 'Product Management', 'Shopping Cart', 'Order Tracking', 'Admin Dashboard', 'Payment Gateway'],
      link: 'https://vetriarasi.com'
    },
    'saidah': {
      title: 'Saidah Collections',
      type: 'E-commerce - WordPress',
      image: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&w=800&q=80',
      description: 'Jewelry e-commerce website for US-based brand with elegant design and seamless checkout experience.',
      features: ['Product Listings', 'Category Navigation', 'Secure Checkout', 'Payment Integration', 'Responsive Design', 'SSL Security'],
      link: 'https://saidahcollections.com'
    }
  };
  
  // Create modal HTML
  const modalHTML = `
    <div class="portfolio-modal" id="portfolioModal">
      <div class="portfolio-modal-content">
        <button class="portfolio-modal-close" aria-label="Close modal">×</button>
        <img class="portfolio-modal-image" src="" alt="Project Image">
        <div class="portfolio-modal-body">
          <h2></h2>
          <span class="project-type"></span>
          <p class="project-description"></p>
          <div class="project-features">
            <h4>Key Features</h4>
            <ul></ul>
          </div>
          <a href="#" class="project-link" target="_blank">View Live Project →</a>
        </div>
      </div>
    </div>
  `;
  
  // Add modal to body if not exists
  if (!document.getElementById('portfolioModal')) {
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }
  
  const modal = document.getElementById('portfolioModal');
  const modalClose = document.querySelector('.portfolio-modal-close');
  
  // Add click handlers to portfolio items
  portfolioItems.forEach(item => {
    const viewDetailsBtn = item.querySelector('a[href="#Portfolio"]');
    if (viewDetailsBtn) {
      viewDetailsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const projectTitle = item.querySelector('h3').textContent;
        showPortfolioModal(projectTitle);
      });
    }
  });
  
  function showPortfolioModal(projectTitle) {
    const data = portfolioData[Object.keys(portfolioData).find(key => 
      portfolioData[key].title.toLowerCase().includes(projectTitle.toLowerCase())
    )];
    
    if (data && modal) {
      modal.querySelector('.portfolio-modal-image').src = data.image;
      modal.querySelector('.portfolio-modal-body h2').textContent = data.title;
      modal.querySelector('.project-type').textContent = data.type;
      modal.querySelector('.project-description').textContent = data.description;
      modal.querySelector('.project-features ul').innerHTML = data.features.map(f => `<li>${f}</li>`).join('');
      modal.querySelector('.project-link').href = data.link;
      
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }
  
  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
  
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
  
  // Close modal on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
});

// Blog search & filter (lightweight, unobtrusive)
document.addEventListener('DOMContentLoaded', function () {
  const blogSearch = document.getElementById('blogSearch');
  const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
  const blogGrid = document.getElementById('blogGrid');
  if (!blogGrid) return;

  const blogCards = Array.from(blogGrid.querySelectorAll('.blog-card'));

  function applyFilter(filter) {
    blogCards.forEach(card => {
      const cat = card.dataset.category || 'uncategorized';
      if (filter === 'all' || cat === filter) {
        card.style.display = 'block';
        setTimeout(() => card.style.opacity = '1', 20);
      } else {
        card.style.opacity = '0';
        setTimeout(() => card.style.display = 'none', 220);
      }
    });
  }

  function applySearch(q) {
    const needle = (q || '').toLowerCase().trim();
    blogCards.forEach(card => {
      const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
      const excerpt = card.querySelector('.excerpt')?.textContent.toLowerCase() || '';
      const cat = (card.dataset.category || '').toLowerCase();
      const match = !needle || title.includes(needle) || excerpt.includes(needle) || cat.includes(needle);
      if (match) {
        card.style.display = 'block';
        setTimeout(() => card.style.opacity = '1', 10);
      } else {
        card.style.opacity = '0';
        setTimeout(() => card.style.display = 'none', 180);
      }
    });
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter || 'all';
      applyFilter(f);
    });
  });

  if (blogSearch) {
    blogSearch.addEventListener('input', (e) => {
      const v = e.target.value;
      applySearch(v);
    });
  }
});

