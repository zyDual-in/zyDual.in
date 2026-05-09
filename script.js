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

  // Pricing category show/hide toggles
  const pricingCategories = document.querySelectorAll('.pricing-category');
  pricingCategories.forEach((category) => {
    const heading = category.querySelector('.section-subtitle');
    if (!heading) return;

    category.classList.add('collapsed');
    heading.setAttribute('role', 'button');
    heading.setAttribute('tabindex', '0');
    heading.classList.add('pricing-category-toggle');
    heading.setAttribute('aria-expanded', 'false');

    const toggleCategory = () => {
      const isOpen = category.classList.toggle('collapsed');
      heading.setAttribute('aria-expanded', String(!isOpen));
      category.classList.toggle('open', !isOpen);
    };

    heading.addEventListener('click', toggleCategory);
    heading.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleCategory();
      }
    });
  });

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
      keywords: ['app development', 'mobile app', 'ios', 'android', 'mobile'],
      answer: 'We develop native and cross-platform mobile applications for iOS and Android. Our app development includes UI/UX design, backend integration, app store deployment, and ongoing maintenance. We use modern frameworks like React Native, Flutter, and native technologies.',
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
      answer: `Our pricing includes website development plans from ₹7,500/year for basic sites to ₹25,000/year for corporate solutions, app development from ₹25,000 for basic apps to ₹3,00,000 for premium apps, and add-on services like admin dashboards (₹5,000-₹12,000), payment gateways (₹4,000-₹10,000), and maintenance (₹1,500-₹5,000/month). Use our cost calculator for a personalized quote!`,
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
      answer: `${contactDetails.join(' ')} You can also reach us via email at zydual.in@gmail.com or fill out our contact form to get in touch.`,
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

  // Construct email message
  const emailSubject = `New Contact Form Submission from ${name}`;
  const emailBody = `Hi zyDual,%0A%0AI would like to contact you.%0A%0AName: ${encodeURIComponent(name)}%0AEmail: ${encodeURIComponent(email)}%0A%0AMessage:%0A${encodeURIComponent(message)}`;
  const mailtoLink = `mailto:zydual.in@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${emailBody}`;

  // Open email client
  window.location.href = mailtoLink;

  formMessage.textContent = 'Opening your email client to send your message...';
  formMessage.style.color = '#22c55e';

  form.reset();
});

/* ========================================
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
  const pricingRevealBtn = document.getElementById('pricingRevealBtn');
  const serviceAccordions = document.querySelectorAll('.service-accordion');

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
      updateSummaryToggleVisibility();
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

  function updateSummaryToggleVisibility() {
    const summaryToggle = document.querySelector('.summary-toggle');
    if (billingMode === 'one-time') {
      summaryToggle.style.display = 'none';
    } else {
      summaryToggle.style.display = 'flex';
    }
  }

  // Plan/Add-on selection - use change event for proper radio/checkbox handling
  planInputs.forEach(input => {
    input.addEventListener('change', updateCalculation);
  });

  if (serviceAccordions.length > 0) {
    serviceAccordions.forEach((item, index) => {
      const header = item.querySelector('.service-accordion-header');
      item.classList.toggle('active', index === 0);
      header.setAttribute('aria-expanded', String(index === 0));
      header.addEventListener('click', () => {
        serviceAccordions.forEach((other) => {
          const otherHeader = other.querySelector('.service-accordion-header');
          other.classList.remove('active');
          otherHeader.setAttribute('aria-expanded', 'false');
        });
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
      });
    });
  }

  if (pricingRevealBtn) {
    const pricingContent = document.querySelector('.pricing-content');
    pricingRevealBtn.addEventListener('click', () => {
      if (!pricingContent) return;
      const isHidden = pricingContent.classList.toggle('pricing-hidden');
      pricingRevealBtn.textContent = isHidden ? 'Show pricing plans' : 'Hide pricing plans';
      pricingRevealBtn.setAttribute('aria-expanded', String(!isHidden));
    });
  }

  // Also handle click on plan-option labels for better UX
  document.querySelectorAll('.plan-option').forEach(label => {
    label.addEventListener('click', function() {
      // Small delay to let the radio/checkbox state update first
      setTimeout(updateCalculation, 50);
    });
  });

  // Main calculation function
  function updateCalculation() {
    const selectedPlans = [];
    const selectedAddons = [];
    let monthlyTotal = 0;
    let yearlyTotal = 0;


    // Get all selected radio groups (plans) and allow deselection
    const planGroups = document.querySelectorAll('.radio-group');
    planGroups.forEach(group => {
      const checked = group.querySelector('input:checked');
      if (checked) {
        const label = checked.dataset.label;
        const price = parseInt(checked.dataset.price) || 0;
        const isMonthly = checked.dataset.monthly === 'true';
        const name = checked.name;
        const value = checked.value;

        selectedPlans.push({ label, price, isMonthly, name, value });

        if (billingMode === 'monthly') {
          // If monthly billing, convert everything to monthly
          if (isMonthly) {
            monthlyTotal += price;
          } else {
            monthlyTotal += Math.round(price / 12);
          }
          yearlyTotal += monthlyTotal * 12;
        } else {
          // One-time billing
          if (isMonthly) {
            monthlyTotal += price;
            yearlyTotal += price * 12;
          } else {
            yearlyTotal += price;
          }
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
        const name = checked.name;
        const value = checked.value;

        selectedAddons.push({ label, price, isMonthly, name, value });

        if (billingMode === 'monthly') {
          // If monthly billing, convert everything to monthly
          if (isMonthly) {
            monthlyTotal += price;
          } else {
            monthlyTotal += Math.round(price / 12);
          }
          yearlyTotal += monthlyTotal * 12;
        } else {
          // One-time billing
          if (isMonthly) {
            monthlyTotal += price;
            yearlyTotal += price * 12;
          } else {
            yearlyTotal += price;
          }
        }
      });
    });

    // Update UI
    renderSelectedItems(selectedPlans, selectedAddons);
    renderTotal(monthlyTotal, yearlyTotal);
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
          <span class="item-price">₹${plan.price.toLocaleString()}</span>
          <button class="remove-btn" data-type="plan" data-name="${plan.name}" data-value="${plan.value}" title="Remove this plan">×</button>
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
          <span class="item-price">₹${addon.price.toLocaleString()}</span>
          <button class="remove-btn" data-type="addon" data-name="${addon.name}" data-value="${addon.value}" title="Remove this add-on">×</button>
        </li>
      `).join('');
    }

    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const type = this.dataset.type;
        const name = this.dataset.name;
        const value = this.dataset.value;

        if (type === 'plan') {
          // For radio buttons, uncheck the specific input
          const input = document.querySelector(`input[name="${name}"][value="${value}"]`);
          if (input) {
            input.checked = false;
          }
        } else if (type === 'addon') {
          // For checkboxes, uncheck the specific input
          const input = document.querySelector(`input[name="${name}"][value="${value}"]`);
          if (input) {
            input.checked = false;
          }
        }

        // Update calculation after removal
        updateCalculation();
      });
    });
  }

  // Render total amount
  function renderTotal(monthly, yearly) {
    let displayAmount;
    let displayPeriod;

    if (billingMode === 'monthly') {
      if (summaryView === 'monthly') {
        displayAmount = monthly;
        displayPeriod = 'per month';
      } else {
        displayAmount = yearly;
        displayPeriod = 'per year';
      }
    } else {
      // One-time billing
      displayAmount = yearly;
      displayPeriod = 'one-time';
    }

    totalAmountEl.textContent = `₹${displayAmount.toLocaleString()}`;
    totalPeriodEl.textContent = displayPeriod;
  }

  // Initial calculation
  updateCalculation();
  updateSummaryToggleVisibility();
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
    const invoiceWindow = window.open('', '_blank');
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
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8f9fa; padding: 20px; color: #333; }
    .invoice-container { max-width: 850px; margin: 0 auto; background: white; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.12); overflow: hidden; }
    .invoice-header { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 40px; display: flex; justify-content: space-between; align-items: center; position: relative; }
    .invoice-header::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>'); opacity: 0.3; }
    .invoice-header h1 { font-size: 2.5rem; margin-bottom: 8px; font-weight: 700; position: relative; z-index: 1; }
    .invoice-header .invoice-number { font-size: 1.2rem; opacity: 0.95; position: relative; z-index: 1; }
    .invoice-header .logo-section { display: flex; align-items: center; gap: 20px; position: relative; z-index: 1; }
    .invoice-header .logo-img { height: 70px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
    .invoice-header .company-details h2 { font-size: 1.8rem; margin-bottom: 4px; }
    .invoice-header .company-details p { opacity: 0.9; font-size: 1rem; }
    .invoice-details { text-align: right; position: relative; z-index: 1; }
    .invoice-details .invoice-number { font-size: 1.3rem; font-weight: 600; margin-bottom: 8px; }
    .invoice-details p { margin-bottom: 4px; font-size: 1rem; }
    
    .invoice-body { padding: 40px; }
    .billing-section { display: flex; gap: 50px; margin-bottom: 40px; }
    .billing-info { flex: 1; }
    .billing-info h3 { color: #6366f1; margin-bottom: 15px; font-size: 1.3rem; font-weight: 600; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; }
    .billing-info p { color: #666; line-height: 1.8; margin-bottom: 8px; }
    .billing-info strong { color: #333; }
    
    .invoice-table { width: 100%; border-collapse: collapse; margin: 40px 0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
    .invoice-table th { background: linear-gradient(135deg, #f8fafc, #e2e8f0); padding: 20px; text-align: left; font-weight: 700; color: #374151; border-bottom: 2px solid #d1d5db; font-size: 1rem; }
    .invoice-table td { padding: 20px; border-bottom: 1px solid #f3f4f6; background: white; }
    .invoice-table tr:last-child td { border-bottom: none; }
    .invoice-table .amount { text-align: right; font-weight: 600; color: #059669; font-size: 1.1rem; }
    .invoice-table .description { font-weight: 500; color: #111827; }
    .invoice-table .type { color: #6b7280; font-style: italic; }
    
    .invoice-summary { background: linear-gradient(135deg, #f0f9ff, #e0f2fe); padding: 30px; border-radius: 16px; margin-top: 40px; border: 1px solid #bae6fd; }
    .invoice-summary .summary-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
    .invoice-summary .summary-row:last-child { margin-bottom: 0; border-top: 2px solid #0ea5e9; padding-top: 20px; margin-top: 20px; }
    .invoice-summary .summary-label { font-size: 1.2rem; color: #374151; font-weight: 500; }
    .invoice-summary .summary-amount { font-size: 1.8rem; font-weight: 700; color: #0ea5e9; }
    .invoice-summary .total-label { font-size: 1.4rem; color: #0f172a; font-weight: 600; }
    .invoice-summary .total-amount { font-size: 2.5rem; font-weight: 800; color: #0ea5e9; background: linear-gradient(135deg, #0ea5e9, #0284c7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    
    .invoice-footer { background: linear-gradient(135deg, #1e293b, #334155); color: white; padding: 30px 40px; display: flex; justify-content: space-between; align-items: center; position: relative; }
    .invoice-footer::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="footer-grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.05)"/><circle cx="20" cy="80" r="0.5" fill="rgba(255,255,255,0.05)"/><circle cx="80" cy="20" r="0.5" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23footer-grain)"/></svg>'); }
    .invoice-footer .footer-content { position: relative; z-index: 1; }
    .invoice-footer .footer-content p { font-size: 1rem; opacity: 0.9; margin-bottom: 4px; }
    .invoice-footer .footer-content .thank-you { font-size: 1.2rem; font-weight: 600; margin-bottom: 8px; }
    .print-btn { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; border: none; padding: 14px 28px; border-radius: 8px; cursor: pointer; font-size: 1rem; font-weight: 600; position: relative; z-index: 1; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3); }
    .print-btn:hover { background: linear-gradient(135deg, #5855eb, #7c3aed); transform: translateY(-2px); box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4); }
    
    .terms-section { margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #6366f1; }
    .terms-section h4 { color: #374151; margin-bottom: 10px; font-size: 1.1rem; }
    .terms-section p { color: #6b7280; font-size: 0.9rem; line-height: 1.6; }
    
    @media print { 
      body { padding: 0; background: white; } 
      .invoice-container { box-shadow: none; max-width: none; } 
      .print-btn { display: none; }
      .terms-section { page-break-inside: avoid; }
    }
    
    @media (max-width: 768px) {
      .invoice-header { flex-direction: column; text-align: center; gap: 20px; padding: 20px; }
      .billing-section { flex-direction: column; gap: 30px; }
      .invoice-table th, .invoice-table td { padding: 12px; font-size: 0.9rem; }
      .invoice-footer { flex-direction: column; gap: 20px; text-align: center; padding: 20px; }
      .invoice-summary { padding: 20px; }
      .invoice-body { padding: 20px; }
    }
    
    @media (max-width: 480px) {
      .invoice-header h1 { font-size: 2rem; }
      .invoice-table { font-size: 0.8rem; }
      .invoice-summary .total-amount { font-size: 2rem; }
      .billing-info h3 { font-size: 1.1rem; }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="invoice-header">
      <div class="logo-section">
        <img src="zyDual-logo.jpeg" alt="zyDual Logo" class="logo-img" onerror="this.style.display='none'" />
        <div class="company-details">
          <h2>zyDual</h2>
          <p>IT & Digital Service Company</p>
        </div>
      </div>
      <div class="invoice-details">
        <div class="invoice-number">Invoice #${invoiceNumber}</div>
        <p><strong>Issue Date:</strong> ${today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <p><strong>Due Date:</strong> ${dueDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <p><strong>Status:</strong> <span style="color: #059669; font-weight: 600;">Pending Payment</span></p>
      </div>
    </div>
    
    <div class="invoice-body">
      <div class="billing-section">
        <div class="billing-info">
          <h3>From</h3>
          <p><strong>zyDual</strong><br>
          Thudiyalur road near KGISL campus<br>
          saravanampatti, coimbatore<br>
          TamilNadu - 641035, India<br>
          <strong>Email:</strong> zydual.in@gmail.com<br>
          <strong>Phone:</strong> +91 8072275209 | +91 9087899641<br>
          <strong>GST:</strong> [GST Number if applicable]</p>
        </div>
        <div class="billing-info">
          <h3>To</h3>
          <p><strong>[Customer Name]</strong></p>
        </div>
      </div>
      
      <table class="invoice-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Type</th>
            <th style="text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${plans.length > 0 ? plans.map(plan => {
            const priceMatch = plan.match(/₹([\d,]+)/);
            const price = priceMatch ? priceMatch[1] : '0';
            const description = plan.replace(/\s*₹[\d,]+.*$/, '').trim();
            return `
          <tr>
            <td class="description">${description}</td>
            <td class="type">Plan</td>
            <td class="amount">₹${price}</td>
          </tr>`;
          }).join('') : '<tr><td colspan="3" style="text-align: center; color: #6b7280;">No plans selected</td></tr>'}
          ${addons.length > 0 ? addons.map(addon => {
            const priceMatch = addon.match(/₹([\d,]+)/);
            const price = priceMatch ? priceMatch[1] : '0';
            const description = addon.replace(/\s*₹[\d,]+.*$/, '').trim();
            return `
          <tr>
            <td class="description">${description}</td>
            <td class="type">Add-on</td>
            <td class="amount">₹${price}</td>
          </tr>`;
          }).join('') : ''}
        </tbody>
      </table>
      
      <div class="invoice-summary">
        ${(() => {
          let subtotal = 0;
          plans.forEach(plan => {
            const priceMatch = plan.match(/₹([\d,]+)/);
            if (priceMatch) {
              subtotal += parseInt(priceMatch[1].replace(/,/g, ''));
            }
          });
          addons.forEach(addon => {
            const priceMatch = addon.match(/₹([\d,]+)/);
            if (priceMatch) {
              subtotal += parseInt(priceMatch[1].replace(/,/g, ''));
            }
          });
          return `
        <div class="summary-row">
          <span class="total-label">Total Amount (${billingPeriod})</span>
          <span class="total-amount">₹${subtotal.toLocaleString()}</span>
        </div>`;
        })()}
      </div>
      
      <div class="terms-section">
        <h4>Terms & Conditions</h4>
        <p>• Payment is due within 7 days of invoice date.<br>
        • Late payments may incur additional charges.<br>
        • All services are subject to our standard terms of service.<br>
        • For any queries, please contact us at zydual.in@gmail.com or +91 8072275209.</p>
      </div>
    </div>
    
    <div class="invoice-footer">
      <div class="footer-content">
        <p class="thank-you">Thank you for choosing zyDual!</p>
        <p>We appreciate your business and look forward to serving you.</p>
        <p>Payment due within 7 days • Questions? Contact us anytime</p>
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
