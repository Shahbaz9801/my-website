// ===== MAIN JAVASCRIPT FILE FOR DATASOLUTION WEBSITE =====

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== MOBILE NAVIGATION TOGGLE =====
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // ===== SMOOTH SCROLLING FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== NAVBAR BACKGROUND ON SCROLL =====
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(15, 15, 35, 0.98)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(15, 15, 35, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
        }
        
        // Show/hide back to top button
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
        
        // Update active navigation link based on scroll position
        updateActiveNavLink();
    });
    
    // ===== BACK TO TOP FUNCTIONALITY =====
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // ===== UPDATE ACTIVE NAV LINK BASED ON SCROLL POSITION =====
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    // ===== ANIMATE STATS COUNTER =====
    function animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000; // Animation duration in ms
            const step = target / (duration / 16); // 60fps
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    stat.textContent = target + (stat.textContent.includes('%') ? '%' : '');
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current) + (stat.textContent.includes('%') ? '%' : '');
                }
            }, 16);
        });
    }
    
    // Initialize stats animation when stats come into view
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }
    
    // ===== FILE UPLOAD HANDLING =====
    const fileUpload = document.getElementById('file-upload');
    const fileName = document.getElementById('fileName');
    
    if (fileUpload && fileName) {
        fileUpload.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                fileName.textContent = this.files[0].name;
            } else {
                fileName.textContent = 'No file chosen';
            }
        });
    }
    
    // ===== FORM SUBMISSION HANDLING =====
    const sampleForm = document.getElementById('sampleForm');
    const contactForm = document.getElementById('contactForm');
    
    // Free sample form submission
    if (sampleForm) {
        sampleForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = this.querySelector('#name').value;
            
            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Show success message
                alert(`Thank you ${name}! We've received your free sample request. We'll process your file and get back to you within 24 hours.`);
                
                // Reset form
                this.reset();
                if (fileName) fileName.textContent = 'No file chosen';
                
                // Restore button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
    
    // Contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = this.querySelector('#contact-name').value;
            
            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Show success message
                alert(`Thank you ${name}! Your message has been sent successfully. We'll get back to you within 2 business hours.`);
                
                // Reset form
                this.reset();
                
                // Restore button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
    
    // ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .portfolio-item, .process-step, .testimonial-card, .stat-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // ===== ADDITIONAL INTERACTIVE FEATURES =====
    
    // Service card hover effects
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('featured')) {
                this.style.transform = 'translateY(0)';
            } else {
                this.style.transform = 'scale(1.05)';
            }
        });
    });
    
    // Chart animations in hero section
    const chartBars = document.querySelectorAll('.chart-bar');
    chartBars.forEach((bar, index) => {
        // Set random heights for visual interest
        const randomHeight = 60 + Math.random() * 40;
        bar.style.height = `${randomHeight}%`;
        
        // Add animation delay
        bar.style.animationDelay = `${index * 0.2}s`;
    });
    
    // ===== PERFORMANCE OPTIMIZATIONS =====
    
    // Lazy loading for images (if added in future)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // ===== ADDITIONAL UTILITY FUNCTIONS =====
    
    // Debounce function for scroll events
    function debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
    
    // Throttle function for resize events
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
    
    console.log('DataSolution website initialized successfully!');
});

// ===== ENHANCED JAVASCRIPT =====

// Add to existing JS

// Particle Background Creation
function createParticleBackground() {
  const container = document.createElement('div');
  container.className = 'particles-container';
  document.body.prepend(container);
  
  const particleCount = 50;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random size between 5px and 20px
    const size = Math.random() * 15 + 5;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Random position
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    
    // Random animation duration and delay
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;
    
    container.appendChild(particle);
  }
}

// Enhanced Portfolio Interactions
function enhancePortfolioItems() {
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  
  portfolioItems.forEach(item => {
    // Add click event to show more details
    item.addEventListener('click', function() {
      // Toggle active state
      this.classList.toggle('active');
      
      // If implementing modal or expanded view, add that logic here
    });
    
    // Add keyboard navigation
    item.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });
}

// Enhanced About Section Animations
function enhanceAboutSection() {
  const statsCards = document.querySelectorAll('.stat-card');
  
  statsCards.forEach(card => {
    // Add intersection observer for stats animation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add animation class when in view
          entry.target.classList.add('animate-in');
          
          // Animate numbers if they have data attributes
          const numberElement = entry.target.querySelector('.stat-number');
          if (numberElement && numberElement.hasAttribute('data-target')) {
            animateNumber(numberElement);
          }
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(card);
  });
}

// Number animation function
function animateNumber(element) {
  const target = parseInt(element.getAttribute('data-target'));
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      element.textContent = target + (element.textContent.includes('%') ? '%' : '+');
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + (element.textContent.includes('%') ? '%' : '+');
    }
  }, 16);
}

// Enhanced Service Cards
function enhanceServiceCards() {
  const serviceCards = document.querySelectorAll('.service-card');
  
  serviceCards.forEach(card => {
    // Add focus styles for accessibility
    card.addEventListener('focus', function() {
      this.style.outline = '2px solid var(--primary)';
      this.style.outlineOffset = '2px';
    });
    
    card.addEventListener('blur', function() {
      this.style.outline = 'none';
    });
    
    // Enhanced hover effects
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
      if (!this.classList.contains('featured')) {
        this.style.transform = 'translateY(0) scale(1)';
      } else {
        this.style.transform = 'scale(1.05)';
      }
    });
  });
}

// Initialize all enhancements when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Existing initialization code...
  
  // Add new enhancements
  createParticleBackground();
  enhancePortfolioItems();
  enhanceAboutSection();
  enhanceServiceCards();
  
  // Add scroll-triggered animations
  const scrollElements = document.querySelectorAll('.feature, .service-card, .portfolio-item');
  
  const elementInView = (el, dividend = 1) => {
    const elementTop = el.getBoundingClientRect().top;
    return (
      elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
    );
  };
  
  const displayScrollElement = (element) => {
    element.classList.add('scrolled');
  };
  
  const hideScrollElement = (element) => {
    element.classList.remove('scrolled');
  };
  
  const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
      if (elementInView(el, 1.25)) {
        displayScrollElement(el);
      } else {
        hideScrollElement(el);
      }
    });
  };
  
  // Initialize scroll animation
  window.addEventListener('scroll', () => {
    handleScrollAnimation();
  });
  
  // Initial check
  handleScrollAnimation();
  
  console.log('Enhanced DataSolution website initialized successfully!');
});

// ===== ENHANCED AI CHATBOT FUNCTIONALITY =====
function initChatbot() {
    const floatingChatbot = document.getElementById('floatingChatbot');
    const chatbotModal = document.getElementById('chatbotModal');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');
    const quickActions = document.querySelectorAll('.quick-action');
    const suggestionBtns = document.querySelectorAll('.suggestion-btn');

    // Enhanced Responses Database
    const responses = {
        // Service Information
        "services": `We offer comprehensive data services:

• Data Entry & Management
  - Product catalog management
  - Database administration
  - PDF to Excel conversion
  - Customer record organization

• Data Cleaning & Standardization
  - Duplicate removal
  - Data formatting & validation
  - Missing value handling
  - Quality assurance

• Business Analytics
  - Sales performance analysis
  - Customer behavior tracking
  - KPI monitoring
  - Growth opportunity identification

• Dashboard & Reporting
  - Looker Studio dashboards
  - Power BI reports
  - Automated reporting
  - Real-time KPI tracking

• E-commerce Support
  - Product catalog optimization
  - Marketplace integration
  - Bulk upload preparation
  - SEO-friendly product data

All services include 99.8% accuracy guarantee and quality assurance.`,

        "pricing": `Our transparent pricing structure:

Data Entry Services:
• Basic Data Entry: Starting at $99
• Advanced Processing: $149 - $299
• Bulk Projects: Custom pricing

Data Cleaning:
• Standard Cleaning: $149 - $349
• Complex Data Sets: $349 - $699
• Enterprise Level: Custom quote

Analytics & Dashboards:
• Basic Analysis: $199 - $499
• Advanced Analytics: $499 - $1,199
• Custom Dashboards: $249 - $999

Factors affecting pricing:
• Data volume and complexity
• Required turnaround time
• Data source formats
• Level of customization

We offer free samples and detailed quotes based on your specific requirements.`,

        "process": `Our 4-step quality process:

1. REQUIREMENT ANALYSIS
   - Project scope definition
   - Timeline planning
   - Resource allocation
   - Client consultation

2. DATA PROCESSING
   - Expert data handling
   - Quality standards implementation
   - Regular progress updates
   - Client communication

3. QUALITY ASSURANCE
   - Automated validation checks
   - Manual expert review
   - Error correction
   - 99.8% accuracy verification

4. DELIVERY & SUPPORT
   - Secure file delivery
   - Project documentation
   - Ongoing support
   - Revision cycles

Standard delivery times:
• Data Entry: 48 hours
• Data Cleaning: 24 hours
• Analytics: 72 hours
• Dashboards: 5 days`,

        "default": `Thank you for your question. I'm trained to provide detailed information about:

• Our comprehensive data services
• Transparent pricing structure
• Quality assurance process
• Project timelines and delivery
• Technical capabilities
• Industry-specific solutions

Could you please specify which aspect you'd like to know more about? I can provide detailed, actionable information to help with your data project planning.`
    };

    // Specific question handlers
    const questionHandlers = {
        "What data services do you offer?": "services",
        "What is your pricing structure?": "pricing",
        "How long does data cleaning take?": "Our standard data cleaning service is delivered within 24 hours. Complex projects or large datasets (50,000+ records) may take 48-72 hours. We offer expedited services for urgent projects.",
        "Do you work with large datasets?": "Yes, we specialize in handling large datasets. Our capabilities include:\n\n• Up to 1 million+ records\n• Multiple data formats\n• Complex data relationships\n• Enterprise-level processing\n\nWe have optimized workflows for large-scale data projects with maintained accuracy and efficiency.",
        "What file formats do you support?": "We support all major file formats:\n\n• Spreadsheets: CSV, XLSX, XLS\n• Documents: PDF, DOC, DOCX\n• Databases: SQL, Access\n• Images: JPEG, PNG (for data extraction)\n• APIs and web scraping\n\nWe can work with any format and help migrate between formats as needed.",
        "How do you ensure data security?": "We implement comprehensive security measures:\n\n• Secure file transfer protocols\n• NDA agreements for all projects\n• Encrypted data storage\n• Access control systems\n• Regular security audits\n• GDPR and compliance adherence\n\nYour data security and confidentiality are our top priorities."
    };

    // Toggle chatbot modal
    floatingChatbot.addEventListener('click', function() {
        chatbotModal.classList.toggle('active');
        // Remove notification dot when opened
        document.querySelector('.notification-dot').style.display = 'none';
    });

    chatbotClose.addEventListener('click', function() {
        chatbotModal.classList.remove('active');
    });

    // Close modal when clicking outside
    document.addEventListener('click', function(event) {
        if (!chatbotModal.contains(event.target) && !floatingChatbot.contains(event.target)) {
            chatbotModal.classList.remove('active');
        }
    });

    // Send message function
    function sendMessage(message, isUser = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'sent' : 'received'}`;
        
        const avatarIcon = isUser ? 'fas fa-user' : 'fas fa-robot';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="${avatarIcon}"></i>
            </div>
            <div class="message-content">
                <div class="message-text">${formatMessage(message)}</div>
                <div class="message-time">${getCurrentTime()}</div>
            </div>
        `;
        
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        
        if (!isUser) {
            // Add quick actions after bot response
            setTimeout(addQuickActions, 300);
        }
    }

    // Format message with proper line breaks
    function formatMessage(text) {
        return text.replace(/\n/g, '<br>');
    }

    // Get current time
    function getCurrentTime() {
        return new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    }

    // Add quick actions
    function addQuickActions() {
        const actions = [
            { action: 'services', icon: 'fas fa-cogs', text: 'Service Details' },
            { action: 'pricing', icon: 'fas fa-tag', text: 'Pricing Information' },
            { action: 'process', icon: 'fas fa-sync-alt', text: 'Our Process' }
        ];

        const actionsHTML = actions.map(action => `
            <button class="quick-action" data-action="${action.action}">
                <i class="${action.icon}"></i>
                ${action.text}
            </button>
        `).join('');

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'quick-actions';
        actionsDiv.innerHTML = actionsHTML;

        // Remove existing quick actions
        const existingActions = chatbotMessages.querySelector('.quick-actions');
        if (existingActions) {
            existingActions.remove();
        }

        chatbotMessages.appendChild(actionsDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

        // Re-attach event listeners
        document.querySelectorAll('.quick-action').forEach(btn => {
            btn.addEventListener('click', handleQuickAction);
        });
    }

    // Handle quick actions
    function handleQuickAction(e) {
        const action = e.target.closest('.quick-action').getAttribute('data-action');
        const question = getQuestionFromAction(action);
        
        sendMessage(question, true);
        
        setTimeout(() => {
            const response = responses[action] || responses.default;
            sendMessage(response, false);
        }, 1000);
    }

    // Get question text from action
    function getQuestionFromAction(action) {
        const questions = {
            'services': 'What data services do you offer?',
            'pricing': 'What is your pricing structure?',
            'process': 'Can you explain your process?'
        };
        return questions[action] || 'Tell me about your services';
    }

    // Handle suggestion buttons
    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const question = this.getAttribute('data-question');
            sendMessage(question, true);
            
            setTimeout(() => {
                const handlerKey = questionHandlers[question];
                const response = typeof handlerKey === 'string' ? 
                    (responses[handlerKey] || questionHandlers[question] || responses.default) : 
                    responses.default;
                sendMessage(response, false);
            }, 1000);
        });
    });

    // Handle send button
    chatbotSend.addEventListener('click', function() {
        const message = chatbotInput.value.trim();
        if (message) {
            sendMessage(message, true);
            chatbotInput.value = '';
            
            setTimeout(() => {
                const response = getAIResponse(message);
                sendMessage(response, false);
            }, 1000);
        }
    });

    // Handle enter key
    chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            chatbotSend.click();
        }
    });

    // Enhanced AI response function
    function getAIResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Service-related queries
        if (lowerMessage.includes('service') || lowerMessage.includes('offer') || lowerMessage.includes('provide')) {
            return responses.services;
        }
        
        // Pricing-related queries
        if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
            return responses.pricing;
        }
        
        // Process-related queries
        if (lowerMessage.includes('process') || lowerMessage.includes('how do you') || lowerMessage.includes('workflow')) {
            return responses.process;
        }
        
        // Timeline queries
        if (lowerMessage.includes('time') || lowerMessage.includes('how long') || lowerMessage.includes('delivery')) {
            return "Our standard delivery times:\n\n• Data Entry: 48 hours\n• Data Cleaning: 24 hours\n• Business Analytics: 72 hours\n• Dashboard Creation: 5 days\n\nExpedited options are available for urgent projects.";
        }
        
        // Accuracy queries
        if (lowerMessage.includes('accuracy') || lowerMessage.includes('quality') || lowerMessage.includes('guarantee')) {
            return "We guarantee 99.8% accuracy through:\n\n• Double-layer quality checks\n• Automated validation systems\n• Manual expert review\n• Client feedback integration\n\nYour satisfaction is 100% guaranteed with our quality assurance process.";
        }
        
        // Specific question match
        for (const [question, response] of Object.entries(questionHandlers)) {
            if (lowerMessage.includes(question.toLowerCase().slice(0, 20))) {
                return typeof response === 'string' ? (responses[response] || response) : responses.default;
            }
        }
        
        return responses.default;
    }

    // Initialize quick actions
    quickActions.forEach(action => {
        action.addEventListener('click', handleQuickAction);
    });

    // Auto-focus input when modal opens
    floatingChatbot.addEventListener('click', function() {
        setTimeout(() => {
            chatbotInput.focus();
        }, 300);
    });
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initChatbot();
});
