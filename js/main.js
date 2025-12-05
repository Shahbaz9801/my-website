// ===============================================================================================
// ========================= MAIN JAVASCRIPT FILE FOR DATASOLUTION WEBSITE =======================
// ===============================================================================================

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
  
// ===========================================================================================================
// ======================================== NAVBAR BACKGROUND ON SCROLL ======================================
// ===========================================================================================================

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
    
    
// ========================================================================================================
// =========================================== EMAILJS INITIALIZATION =====================================
// ========================================================================================================


// Aapko ye values EmailJS dashboard se milengi
emailjs.init("0cLHah5uAh-3tbhC0"); // Replace with your actual public key

// ===== FILE UPLOAD HANDLING =====
const fileUpload = document.getElementById('file-upload');
const fileName = document.getElementById('fileName');

if (fileUpload && fileName) {
    fileUpload.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            // File size validation (10MB limit)
            if (file.size > 10 * 1024 * 1024) {
                alert('File size too large! Please upload files smaller than 10MB.');
                this.value = '';
                fileName.textContent = 'No file chosen';
                return;
            }
            fileName.textContent = file.name;
        } else {
            fileName.textContent = 'No file chosen';
        }
    });
}

// ===== FORM SUBMISSION WITH EMAIL =====
const sampleForm = document.getElementById('sampleForm');

if (sampleForm) {
    sampleForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form elements
        const submitBtn = this.querySelector('button[type="submit"]');
        const successMessage = document.getElementById('successMessage');
        const errorMessage = document.getElementById('errorMessage');
        
        // Hide previous messages
        if (successMessage) successMessage.style.display = 'none';
        if (errorMessage) errorMessage.style.display = 'none';
        
        // Get form values
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            company: document.getElementById('company').value.trim(),
            service: document.getElementById('service').value,
            message: document.getElementById('message').value.trim(),
            fileName: fileName.textContent
        };
        
        // Basic validation
        if (!formData.name || !formData.email || !formData.phone || !formData.service || !formData.message) {
            alert('Please fill all required fields.');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // Show loading state
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            // Prepare email data
            const emailParams = {
                to_email: "alamshahbaz2017@gmail.com",
                from_name: formData.name,
                from_email: formData.email,
                phone: formData.phone,
                company: formData.company || 'Not provided',
                service: formData.service,
                message: formData.message,
                file_name: formData.fileName,
                submission_date: new Date().toLocaleString(),
                subject: `Free Sample Request from ${formData.name}`
            };
            
            // Send email using EmailJS
            const response = await emailjs.send(
                'service_47x41ws', // Replace with your Service ID
                'template_12nh4pq', // Replace with your Template ID
                emailParams
            );
            
            console.log('Email sent successfully:', response);
            
            // Show success message
            if (successMessage) {
                successMessage.style.display = 'flex';
            }
            
            // Show success alert
            alert(`Thank you ${formData.name}! Your free sample request has been sent successfully. We'll contact you within 24 hours at ${formData.email}.`);
            
            // Reset form
            this.reset();
            if (fileName) fileName.textContent = 'No file chosen';
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                if (successMessage) {
                    successMessage.style.display = 'none';
                }
            }, 5000);
            
        } catch (error) {
            console.error('Email sending failed:', error);
            
            // Show error message
            if (errorMessage) {
                errorMessage.style.display = 'flex';
            }
            
            // Show error alert
            alert('Sorry! There was an error sending your request. Please try again or contact us directly at alamshahbaz2017@gmail.com');
            
        } finally {
            // Restore button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// =======================================================================================================
// ========================================== FORM VALIDATION ENHANCEMENTS ===============================
// =======================================================================================================

// Real-time validation
const emailInput = document.getElementById('email');
if (emailInput) {
    emailInput.addEventListener('blur', function() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (this.value && !emailRegex.test(this.value)) {
            this.style.borderColor = '#ef4444';
        } else {
            this.style.borderColor = '';
        }
    });
}

const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', function() {
        // Basic phone number formatting
        this.value = this.value.replace(/[^\d+]/g, '');
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

// =========================================================================================================
// ====================================== Particle Background Creation =====================================
// =========================================================================================================


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

// =========================================================================================================
// ==================================== Enhanced Portfolio Interactions ====================================
// =========================================================================================================

function enhancePortfolioItems() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        // Add click event to show more details
        item.addEventListener('click', function() {
            // Toggle active state for mobile
            this.classList.toggle('active');
            
            // If implementing modal or expanded view, add that logic here
            console.log('📱 Portfolio item clicked:', this.querySelector('h3').textContent);
        });
        
        // Add keyboard navigation
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // Touch device optimizations
        item.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        });
        
        item.addEventListener('touchend', function() {
            this.classList.remove('touch-active');
        });
        
        // Add tabindex for accessibility
        if (!item.hasAttribute('tabindex')) {
            item.setAttribute('tabindex', '0');
        }
    });
    
    // Add portfolio statistics animation
    animatePortfolioStats();
}


// =======================================================================================================
// ========================================PORTFOLIO FILTERING CODE ======================================
// =======================================================================================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Portfolio Filtering Functionality
    const filterButtons = document.querySelectorAll('.portfolio-filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    // Check if elements exist
    if (filterButtons.length === 0 || portfolioItems.length === 0) {
        console.log('Portfolio filtering elements not found');
        return;
    }
    
    // Add click event to each filter button
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.style.transform = 'translateY(0)';
            });
            
            // Add active class to clicked button with animation
            this.classList.add('active');
            this.style.transform = 'translateY(-3px)';
            
            // Get filter value
            const filterValue = this.getAttribute('data-filter');
            
            // Animate filter change
            animateFilterChange(filterValue);
        });
    });
    
    // Filter animation function - FIXED
    function animateFilterChange(filterValue) {
        let visibleItems = [];
        
        // Clear any existing no-results message
        const existingMessage = document.querySelector('.no-results-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Check which items should be visible
        portfolioItems.forEach(item => {
            const categories = item.getAttribute('data-category');
            const categoryArray = categories ? categories.split(' ') : [];
            
            // FIX: Exact category matching
            if (filterValue === 'all' || categoryArray.includes(filterValue)) {
                visibleItems.push(item);
            }
        });
        
        // First, hide items that shouldn't be visible
        portfolioItems.forEach(item => {
            const categories = item.getAttribute('data-category');
            const categoryArray = categories ? categories.split(' ') : [];
            
            if (filterValue === 'all' || categoryArray.includes(filterValue)) {
                // Will show this item
                item.style.display = 'flex';
                item.classList.remove('hidden');
            } else {
                // Hide this item immediately
                item.style.display = 'none';
                item.classList.add('hidden');
            }
        });
        
        // If no items found, show message
        if (visibleItems.length === 0 && filterValue !== 'all') {
            showNoResultsMessage();
            return;
        }
        
        // Animate visible items with staggered effect
        visibleItems.forEach((item, index) => {
            // Reset for animation
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            
            // Staggered animation
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 80);
        });
    }
    
    // No results message
    function showNoResultsMessage() {
        let message = document.querySelector('.no-results-message');
        if (!message) {
            message = document.createElement('div');
            message.className = 'no-results-message';
            message.innerHTML = `
                <div style="text-align: center; padding: 40px; background: var(--dark-card); 
                     border-radius: 12px; border: 1px solid var(--border-color); margin-top: 30px; grid-column: 1 / -1;">
                    <i class="fas fa-search" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 20px;"></i>
                    <h3 style="color: var(--text-primary); margin-bottom: 10px;">No Projects Found</h3>
                    <p style="color: var(--text-secondary);">Try selecting a different filter category.</p>
                    <button class="btn btn-primary" style="margin-top: 20px;" onclick="document.querySelector('.portfolio-filter-btn[data-filter=\"all\"]').click()">
                        Show All Projects
                    </button>
                </div>
            `;
            document.querySelector('.portfolio-grid').appendChild(message);
        }
    }
    
    // Initialize with all items visible
    animateFilterChange('all');
    
    // Add CSS for filtering animations - IMPROVED
    const style = document.createElement('style');
    style.textContent = `
        .portfolio-item {
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
            will-change: transform, opacity;
        }
        
        .portfolio-filter-btn {
            transition: all 0.3s ease !important;
            cursor: pointer;
        }
        
        .portfolio-filter-btn.active {
            background: var(--gradient-1) !important;
            color: white !important;
            border-color: transparent !important;
            box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3) !important;
        }
        
        .portfolio-filter-btn:not(.active):hover {
            transform: translateY(-2px);
            background: rgba(99, 102, 241, 0.1) !important;
        }
        
        @media (max-width: 768px) {
            .portfolio-section-controls {
                overflow-x: auto;
                padding-bottom: 15px;
                justify-content: flex-start;
                -webkit-overflow-scrolling: touch;
                scrollbar-width: thin;
            }
            
            .portfolio-section-controls::-webkit-scrollbar {
                height: 4px;
            }
            
            .portfolio-section-controls::-webkit-scrollbar-track {
                background: var(--dark-surface);
            }
            
            .portfolio-section-controls::-webkit-scrollbar-thumb {
                background: var(--primary);
                border-radius: 2px;
            }
            
            .portfolio-filter-btn {
                white-space: nowrap;
                font-size: 0.9rem;
                padding: 10px 20px;
                flex-shrink: 0;
            }
        }
        
        .portfolio-item.hidden {
            display: none !important;
            opacity: 0 !important;
            transform: translateY(20px) !important;
            pointer-events: none;
        }
        
        .portfolio-item:not(.hidden) {
            display: flex !important;
            animation: fadeInUp 0.4s ease forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* Fix for overlay positioning */
        .portfolio-overlay {
            z-index: 10;
            pointer-events: none;
        }
        
        .portfolio-item:hover .portfolio-overlay {
            pointer-events: auto;
        }
        
        /* Fix for button inside portfolio item */
        .portfolio-view-btn {
            pointer-events: auto;
        }
    `;
    document.head.appendChild(style);
    
    // Portfolio item hover effects
    portfolioItems.forEach(item => {
        // Desktop hover effects - IMPROVED
        if (window.innerWidth > 768) {
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px)';
                this.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(99, 102, 241, 0.3)';
                this.style.zIndex = '5';
                
                // Bring overlay to front
                const overlay = this.querySelector('.portfolio-overlay');
                if (overlay) {
                    overlay.style.zIndex = '15';
                }
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.3)';
                this.style.zIndex = '1';
                
                // Reset overlay
                const overlay = this.querySelector('.portfolio-overlay');
                if (overlay) {
                    overlay.style.zIndex = '10';
                }
            });
        }
        
        // Mobile touch effects - IMPROVED
        item.addEventListener('touchstart', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                this.style.transform = 'scale(0.98)';
                
                // Show overlay on mobile tap
                const overlay = this.querySelector('.portfolio-overlay');
                if (overlay) {
                    const isVisible = overlay.style.opacity === '1';
                    overlay.style.opacity = isVisible ? '0' : '1';
                    overlay.style.pointerEvents = isVisible ? 'none' : 'auto';
                }
            }
        }, { passive: false });
        
        item.addEventListener('touchend', function() {
            if (window.innerWidth <= 768) {
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            }
        });
    });
    
    // Close overlay when clicking outside (for mobile)
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && !e.target.closest('.portfolio-item')) {
            portfolioItems.forEach(item => {
                const overlay = item.querySelector('.portfolio-overlay');
                if (overlay) {
                    overlay.style.opacity = '0';
                    overlay.style.pointerEvents = 'none';
                }
            });
        }
    });
    
    // Portfolio CTA button click
    const portfolioCTA = document.querySelector('.portfolio-cta-button');
    if (portfolioCTA) {
        portfolioCTA.addEventListener('click', function(e) {
            e.preventDefault();
            // Smooth scroll to contact section
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                contactSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            } else {
                // If no contact section, scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
    
    // Portfolio view buttons - IMPROVED
    const viewButtons = document.querySelectorAll('.portfolio-view-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Get parent portfolio item
            const portfolioItem = this.closest('.portfolio-item');
            const title = portfolioItem.querySelector('.portfolio-title').textContent;
            const category = portfolioItem.getAttribute('data-category');
            
            // Show detailed modal
            showCaseStudyModal(title, category);
        });
    });
    
    // Case study modal function - IMPROVED
    function showCaseStudyModal(title, category) {
        // Remove any existing modal
        const existingModal = document.querySelector('.case-study-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        const modal = document.createElement('div');
        modal.className = 'case-study-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <div>
                        <span class="modal-category">${category.toUpperCase()}</span>
                        <h3>${title}</h3>
                    </div>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="modal-preview">
                        <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71" alt="${title}" style="width:100%;border-radius:8px;margin-bottom:20px;">
                    </div>
                    <div class="modal-details">
                        <h4>Project Details</h4>
                        <p>This is a detailed case study of the project. In a real implementation, this content would be dynamically loaded from a database.</p>
                        
                        <div class="modal-stats">
                            <div class="modal-stat">
                                <strong>99.8%</strong>
                                <span>Accuracy</span>
                            </div>
                            <div class="modal-stat">
                                <strong>48h</strong>
                                <span>Delivery</span>
                            </div>
                            <div class="modal-stat">
                                <strong>95%</strong>
                                <span>Client Satisfaction</span>
                            </div>
                        </div>
                        
                        <h4>Key Achievements</h4>
                        <ul>
                            <li>Increased operational efficiency by 40%</li>
                            <li>Reduced data processing time by 60%</li>
                            <li>Improved data accuracy to 99.8%</li>
                            <li>Client reported 25% growth in productivity</li>
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" id="closeModal">
                        <i class="fas fa-times"></i> Close
                    </button>
                    <button class="btn btn-primary" id="getQuote">
                        <i class="fas fa-paper-plane"></i> Get Quote
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal events
        const closeModal = () => modal.remove();
        
        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
        modal.querySelector('#closeModal').addEventListener('click', closeModal);
        
        // Get Quote button
        modal.querySelector('#getQuote').addEventListener('click', function() {
            modal.remove();
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                contactSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
        
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        modal.addEventListener('click', function(e) {
            if (e.target === this.querySelector('.modal-overlay')) {
                document.body.style.overflow = '';
            }
        });
    }
    
    // Add modal CSS - IMPROVED
    const modalStyle = document.createElement('style');
    modalStyle.textContent = `
        .case-study-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(15, 15, 35, 0.95);
            backdrop-filter: blur(10px);
        }
        
        .modal-content {
            position: relative;
            background: var(--dark-card);
            border-radius: 16px;
            max-width: 800px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            border: 1px solid var(--border-color);
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
            animation: modalSlideUp 0.3s ease;
        }
        
        .modal-header {
            padding: 24px;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            background: var(--dark-surface);
            border-radius: 16px 16px 0 0;
        }
        
        .modal-header h3 {
            margin: 10px 0 0 0;
            color: var(--text-primary);
            font-size: 1.5rem;
        }
        
        .modal-category {
            display: inline-block;
            background: var(--gradient-1);
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .modal-close {
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: var(--text-primary);
            font-size: 1.8rem;
            cursor: pointer;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: var(--transition);
            flex-shrink: 0;
        }
        
        .modal-close:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: rotate(90deg);
        }
        
        .modal-body {
            padding: 24px;
        }
        
        .modal-details h4 {
            color: var(--primary);
            margin: 20px 0 10px 0;
            font-size: 1.2rem;
        }
        
        .modal-stats {
            display: flex;
            gap: 15px;
            margin: 20px 0;
            flex-wrap: wrap;
        }
        
        .modal-stat {
            text-align: center;
            background: rgba(99, 102, 241, 0.1);
            padding: 15px;
            border-radius: 12px;
            min-width: 100px;
            flex: 1;
            border: 1px solid rgba(99, 102, 241, 0.2);
        }
        
        .modal-stat strong {
            display: block;
            font-size: 1.8rem;
            color: var(--primary);
            font-weight: 700;
            margin-bottom: 5px;
        }
        
        .modal-stat span {
            font-size: 0.8rem;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
        }
        
        .modal-body ul {
            margin: 15px 0;
            padding-left: 20px;
        }
        
        .modal-body li {
            margin-bottom: 8px;
            color: var(--text-secondary);
            position: relative;
            padding-left: 10px;
        }
        
        .modal-body li:before {
            content: '✓';
            position: absolute;
            left: -15px;
            color: var(--secondary);
            font-weight: bold;
        }
        
        .modal-footer {
            padding: 24px;
            border-top: 1px solid var(--border-color);
            display: flex;
            gap: 15px;
            justify-content: flex-end;
        }
        
        .modal-footer .btn {
            min-width: 140px;
        }
        
        @keyframes modalSlideUp {
            from {
                opacity: 0;
                transform: translateY(50px) scale(0.9);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        @media (max-width: 768px) {
            .modal-content {
                max-height: 95vh;
                margin: 10px;
            }
            
            .modal-header {
                padding: 20px;
            }
            
            .modal-body {
                padding: 20px;
            }
            
            .modal-footer {
                padding: 20px;
                flex-direction: column;
            }
            
            .modal-footer .btn {
                width: 100%;
            }
            
            .modal-stats {
                flex-direction: column;
            }
        }
    `;
    document.head.appendChild(modalStyle);
    
    // Add keyboard support for modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.querySelector('.case-study-modal');
            if (modal) {
                modal.remove();
                document.body.style.overflow = '';
            }
        }
    });
});
// =========================================================================================================
// ==================================== Enhanced About Section Animations ==================================
// =========================================================================================================

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
/**
 * Animate portfolio statistics on hover
 */
function animatePortfolioStats() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const stats = this.querySelectorAll('.portfolio-stats .stat strong');
            stats.forEach((stat, index) => {
                // Add animation delay for staggered effect
                setTimeout(() => {
                    stat.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        stat.style.transform = 'scale(1)';
                    }, 300);
                }, index * 100);
            });
        });
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

// =========================================================================================================
// ======================================= ENHANCED AI CHATBOT FUNCTIONALITY ===============================
// =========================================================================================================

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

// =========================================================================================================
// ===================================== HERO VISUAL ANIMATIONS ============================================
// =========================================================================================================

function initHeroVisualAnimations() {
    const chartBars = document.querySelectorAll('.chart-bar');
    
    // Animate chart bars when in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const chartBar = entry.target;
                const percent = chartBar.getAttribute('data-percent');
                const barFill = chartBar.querySelector('.bar-fill');
                
                // Animate bar fill with delay based on index
                const index = Array.from(chartBars).indexOf(chartBar);
                setTimeout(() => {
                    barFill.style.height = `${percent}%`;
                    
                    // Add glow effect after animation
                    setTimeout(() => {
                        chartBar.style.boxShadow = '0 0 25px rgba(99, 102, 241, 0.4)';
                        setTimeout(() => {
                            chartBar.style.boxShadow = '0 0 10px rgba(99, 102, 241, 0.1)';
                        }, 800);
                    }, 1500);
                }, index * 200);
            }
        });
    }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });
    
    // Observe each chart bar
    chartBars.forEach(bar => {
        observer.observe(bar);
    });
    
    // Add hover effects to chart items
    const chartItems = document.querySelectorAll('.chart-item');
    chartItems.forEach((item) => {
        item.addEventListener('mouseenter', function() {
            const bar = this.querySelector('.bar-fill');
            const chartBar = this.querySelector('.chart-bar');
            bar.style.transform = 'scale(1.05)';
            bar.style.filter = 'brightness(1.3)';
            chartBar.style.borderColor = 'rgba(99, 102, 241, 0.5)';
        });
        
        item.addEventListener('mouseleave', function() {
            const bar = this.querySelector('.bar-fill');
            const chartBar = this.querySelector('.chart-bar');
            bar.style.transform = 'scale(1)';
            bar.style.filter = 'brightness(1)';
            chartBar.style.borderColor = 'rgba(99, 102, 241, 0.2)';
        });
    });
}

// Animate Statistics Numbers
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseFloat(stat.getAttribute('data-target'));
        const hasPlus = stat.textContent.includes('+');
        const hasPercent = stat.textContent.includes('%');
        const duration = 2000;
        const startTime = Date.now();
        
        function updateNumber() {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(target * easeOutQuart);
            
            stat.textContent = currentValue + 
                (hasPlus ? '+' : '') + 
                (hasPercent ? '%' : '');
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        }
        
        updateNumber();
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initHeroVisualAnimations();
    
    // Animate stats when hero section is in view
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                heroObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    const heroSection = document.getElementById('home');
    if (heroSection) {
        heroObserver.observe(heroSection);
    }
});
