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

// Portfolio Image Carousel Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Carousel elements
    const mainImage = document.querySelector('.main-image');
    const thumbnailItems = document.querySelectorAll('.thumbnail-item');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const mainImageContainer = document.querySelector('.main-image-wrapper');
    const portfolioSection = document.getElementById('portfolio');
    
    // Image data for carousel
    const carouselData = [
        {
            index: 0,
            largeImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            alt: 'E-commerce Catalog Management',
            category: 'E-commerce',
            title: 'Amazon Seller Catalog Optimization',
            description: 'Processed 10,000+ products with 99.9% accuracy'
        },
        {
            index: 1,
            largeImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            alt: 'Analytics Dashboard',
            category: 'Analytics',
            title: 'Real-time Business Intelligence Dashboard',
            description: 'Reduced reporting time by 85% with interactive dashboards'
        },
        {
            index: 2,
            largeImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            alt: 'Data Migration',
            category: 'Data Migration',
            title: 'Enterprise Data Migration Project',
            description: 'Seamlessly migrated 2TB of data with zero downtime'
        },
        {
            index: 3,
            largeImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            alt: 'Predictive Analytics',
            category: 'AI Analytics',
            title: 'Predictive Analytics for Retail',
            description: 'Increased sales forecast accuracy by 40% using AI models'
        },
        {
            index: 4,
            largeImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            alt: 'Customer Data',
            category: 'Customer Data',
            title: '360° Customer View Platform',
            description: 'Unified 500K+ customer profiles for personalized marketing'
        },
        {
            index: 5,
            largeImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            alt: 'Supply Chain',
            category: 'Supply Chain',
            title: 'Supply Chain Optimization System',
            description: 'Reduced logistics costs by 25% through data-driven insights'
        },
        {
            index: 6,
            largeImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            alt: 'Financial Analytics',
            category: 'Financial Analytics',
            title: 'Financial Risk Analysis Platform',
            description: 'Identified $2M+ in cost-saving opportunities'
        },
        {
            index: 7,
            largeImage: 'https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            alt: 'Healthcare Data',
            category: 'Healthcare',
            title: 'Healthcare Data Integration',
            description: 'Integrated patient data across 10+ healthcare systems'
        },
        {
            index: 8,
            largeImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            alt: 'Marketing Analytics',
            category: 'Marketing',
            title: 'Marketing Campaign Analytics',
            description: 'Improved ROI by 300% through data-driven campaign optimization'
        },
        {
            index: 9,
            largeImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            alt: 'Cloud Migration',
            category: 'Cloud Migration',
            title: 'Cloud Infrastructure Migration',
            description: 'Migrated entire infrastructure to cloud with 99.99% uptime'
        }
    ];
    
    // Carousel state
    let currentIndex = 0;
    let autoPlayInterval;
    const autoPlayDelay = 10000; // 10 seconds
    let isAutoPlaying = true;
    
    // Issue #2 Fix: Auto-scroll prevention flag
    let isManuallyChangingImage = false;
    
    // Create auto-play status indicator
    createAutoPlayStatus();
    
    // Initialize carousel
    initCarousel();
    
    // Initialize carousel with first image active
    function initCarousel() {
        // Set initial active states
        updateMainImage(currentIndex);
        updateActiveThumbnail(currentIndex);
        
        // Start auto-play
        startAutoPlay();
        
        // Add keyboard navigation
        document.addEventListener('keydown', handleKeyboardNavigation);
        
        // Issue #2 Fix: Add scroll event listener to prevent auto-scroll
        setupScrollPrevention();
    }
    
    // Issue #2 Fix: Setup scroll prevention
    function setupScrollPrevention() {
        // Listen for click events that might cause scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
            });
        });
        
        // Prevent scrollIntoView from scrolling the page
        const originalScrollIntoView = Element.prototype.scrollIntoView;
        Element.prototype.scrollIntoView = function(options) {
            // Only allow smooth scrolling within our carousel
            if (this.closest('.image-carousel-wrapper') && options && options.behavior === 'smooth') {
                // Call the original but with preventScroll option
                originalScrollIntoView.call(this, { 
                    behavior: 'smooth', 
                    block: 'nearest',
                    inline: 'center'
                });
            }
        };
    }
    
    // Create auto-play status indicator
    function createAutoPlayStatus() {
        const autoPlayStatus = document.createElement('div');
        autoPlayStatus.className = 'auto-play-status';
        autoPlayStatus.innerHTML = `
            <div class="status-text">Auto-play</div>
            <div class="status-indicator ${isAutoPlaying ? 'active' : ''}"></div>
            <button class="toggle-auto-play" title="${isAutoPlaying ? 'Pause' : 'Play'}">
                <i class="fas fa-${isAutoPlaying ? 'pause' : 'play'}"></i>
            </button>
        `;
        
        mainImageContainer.appendChild(autoPlayStatus);
        
        // Add click event to toggle auto-play
        const toggleBtn = autoPlayStatus.querySelector('.toggle-auto-play');
        toggleBtn.addEventListener('click', toggleAutoPlay);
    }
    
    // Update auto-play status UI
    function updateAutoPlayStatus() {
        const statusIndicator = document.querySelector('.status-indicator');
        const toggleBtn = document.querySelector('.toggle-auto-play');
        const icon = toggleBtn.querySelector('i');
        
        if (isAutoPlaying) {
            statusIndicator.classList.add('active');
            icon.className = 'fas fa-pause';
            toggleBtn.title = 'Pause';
        } else {
            statusIndicator.classList.remove('active');
            icon.className = 'fas fa-play';
            toggleBtn.title = 'Play';
        }
    }
    
    // Toggle auto-play on/off
    function toggleAutoPlay() {
        isAutoPlaying = !isAutoPlaying;
        
        if (isAutoPlaying) {
            startAutoPlay();
        } else {
            stopAutoPlay();
        }
        
        updateAutoPlayStatus();
        
        // Add visual feedback
        const toggleBtn = document.querySelector('.toggle-auto-play');
        toggleBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            toggleBtn.style.transform = 'scale(1)';
        }, 150);
    }
    
    // Start auto-play
    function startAutoPlay() {
        stopAutoPlay(); // Clear any existing interval
        
        autoPlayInterval = setInterval(() => {
            nextImage();
        }, autoPlayDelay);
        
        // Visual indicator for auto-play start
        highlightAutoPlayStatus();
    }
    
    // Stop auto-play
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
    }
    
    // Highlight auto-play status briefly
    function highlightAutoPlayStatus() {
        if (!isAutoPlaying) return;
        
        const statusIndicator = document.querySelector('.status-indicator');
        statusIndicator.style.animation = 'pulseIndicator 0.5s ease';
        
        setTimeout(() => {
            statusIndicator.style.animation = 'pulseIndicator 2s infinite';
        }, 500);
    }
    
    // Update main image based on index
    function updateMainImage(index) {
        const imageData = carouselData[index];
        
        // Create new image element
        const newImage = document.createElement('img');
        newImage.src = imageData.largeImage;
        newImage.alt = imageData.alt;
        newImage.className = 'main-image';
        
        // Add to DOM before current image
        const currentImage = document.querySelector('.main-image.active');
        currentImage.parentNode.insertBefore(newImage, currentImage);
        
        // Wait for new image to load
        newImage.onload = function() {
            // Remove active class from current image
            currentImage.classList.remove('active');
            currentImage.classList.add('fading-out');
            
            // Add active class to new image
            newImage.classList.add('active');
            
            // Remove old image after transition
            setTimeout(() => {
                if (currentImage.parentNode) {
                    currentImage.parentNode.removeChild(currentImage);
                }
            }, 800);
            
            // Update overlay content
            updateOverlayContent(imageData);
            
            // Add visual effect to main container
            addMainImageEffect();
        };
    }
    
    // Update overlay content
    function updateOverlayContent(data) {
        const overlayContent = document.querySelector('.overlay-content');
        
        // Create new overlay content
        overlayContent.innerHTML = `
            <span class="image-category" style="background: rgba(99, 102, 241, 0.2); color: #a5b4fc; padding: 6px 16px; border-radius: 20px; font-size: 0.9rem; font-weight: 600; letter-spacing: 1px; display: inline-block; margin-bottom: 1rem; border: 1px solid rgba(99, 102, 241, 0.3);">
                ${data.category}
            </span>
            <h3 class="image-title">${data.title}</h3>
            <p class="image-description">${data.description}</p>
        `;
        
        // Animate in
        overlayContent.style.animation = 'none';
        setTimeout(() => {
            overlayContent.style.animation = 'fadeInUp 0.6s ease forwards';
        }, 10);
    }
    
    // Update active thumbnail
    function updateActiveThumbnail(index) {
        // Remove active class from all thumbnails
        thumbnailItems.forEach(item => {
            item.classList.remove('active');
            
            // Reset animation for non-active thumbnails
            if (parseInt(item.dataset.index) !== index) {
                item.style.animationPlayState = 'running';
            }
        });
        
        // Add active class to current thumbnail
        const activeThumbnail = document.querySelector(`.thumbnail-item[data-index="${index}"]`);
        if (activeThumbnail) {
            activeThumbnail.classList.add('active');
            
            // Pause animation for active thumbnail
            activeThumbnail.style.animationPlayState = 'paused';
            
            // Issue #2 Fix: Use custom scroll function instead of scrollIntoView
            scrollThumbnailIntoViewCustom(activeThumbnail);
            
            // Add visual effect to active thumbnail
            addThumbnailEffect(activeThumbnail);
        }
    }
    
    // Issue #2 Fix: Custom scroll function that doesn't scroll the whole page
    function scrollThumbnailIntoViewCustom(thumbnail) {
        const gallery = document.querySelector('.thumbnail-gallery');
        const galleryRect = gallery.getBoundingClientRect();
        const thumbnailRect = thumbnail.getBoundingClientRect();
        
        // Check if thumbnail is not fully visible
        if (thumbnailRect.left < galleryRect.left || thumbnailRect.right > galleryRect.right) {
            // Calculate scroll position
            const scrollLeft = thumbnail.offsetLeft - (gallery.offsetWidth / 2) + (thumbnail.offsetWidth / 2);
            
            // Smooth scroll within the gallery only
            gallery.scrollTo({
                left: scrollLeft,
                behavior: 'smooth'
            });
        }
    }
    
    // Add visual effect to main image
    function addMainImageEffect() {
        const mainContainer = document.querySelector('.main-image-container');
        
        // Add glow effect
        mainContainer.style.boxShadow = '0 0 40px rgba(99, 102, 241, 0.5)';
        
        // Reset after animation
        setTimeout(() => {
            mainContainer.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.5)';
        }, 500);
    }
    
    // Add visual effect to thumbnail
    function addThumbnailEffect(thumbnail) {
        // Add pulse effect
        thumbnail.style.boxShadow = '0 0 25px rgba(99, 102, 241, 0.7)';
        
        // Reset after animation
        setTimeout(() => {
            if (thumbnail.classList.contains('active')) {
                thumbnail.style.boxShadow = '0 15px 30px rgba(99, 102, 241, 0.3)';
            } else {
                thumbnail.style.boxShadow = 'none';
            }
        }, 500);
    }
    
    // Go to next image
    function nextImage() {
        currentIndex = (currentIndex + 1) % carouselData.length;
        changeImage(currentIndex);
    }
    
    // Go to previous image
    function prevImage() {
        currentIndex = (currentIndex - 1 + carouselData.length) % carouselData.length;
        changeImage(currentIndex);
    }
    
    // Change image with transition
    function changeImage(index) {
        // Reset auto-play timer when manually changing image
        if (isAutoPlaying) {
            restartAutoPlay();
        }
        
        currentIndex = index;
        updateMainImage(currentIndex);
        updateActiveThumbnail(currentIndex);
    }
    
    // Restart auto-play timer
    function restartAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
        highlightAutoPlayStatus();
    }
    
    // Handle keyboard navigation
    function handleKeyboardNavigation(e) {
        if (e.key === 'ArrowLeft') {
            prevImage();
            e.preventDefault();
        } else if (e.key === 'ArrowRight') {
            nextImage();
            e.preventDefault();
        } else if (e.key === ' ' || e.key === 'Spacebar') {
            toggleAutoPlay();
            e.preventDefault();
        }
    }
    
    // Add click events to thumbnails
    thumbnailItems.forEach(thumbnail => {
        thumbnail.addEventListener('click', function(e) {
            e.preventDefault();
            const index = parseInt(this.dataset.index);
            isManuallyChangingImage = true;
            changeImage(index);
            
            // Add click effect
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
                isManuallyChangingImage = false;
            }, 150);
        });
    });
    
    // Add click events to arrow buttons
    prevBtn.addEventListener('click', function(e) {
        e.preventDefault();
        isManuallyChangingImage = true;
        prevImage();
        addButtonClickEffect(this);
        setTimeout(() => {
            isManuallyChangingImage = false;
        }, 150);
    });
    
    nextBtn.addEventListener('click', function(e) {
        e.preventDefault();
        isManuallyChangingImage = true;
        nextImage();
        addButtonClickEffect(this);
        setTimeout(() => {
            isManuallyChangingImage = false;
        }, 150);
    });
    
    // Add click effect to buttons
    function addButtonClickEffect(button) {
        button.style.transform = 'scale(0.9)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }
    
    // Add hover effect to controls
    const controlButtons = document.querySelectorAll('.control-btn');
    controlButtons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.boxShadow = '0 0 25px rgba(99, 102, 241, 0.6)';
        });
        
        btn.addEventListener('mouseleave', function() {
            if (!this.style.transform.includes('0.9')) {
                this.style.transform = 'scale(1)';
            }
            this.style.boxShadow = '';
        });
    });
    
    // Add touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    mainImageContainer.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    mainImageContainer.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    // Handle swipe gestures
    function handleSwipe() {
        const swipeThreshold = 50;
        const difference = touchStartX - touchEndX;
        
        if (Math.abs(difference) > swipeThreshold) {
            if (difference > 0) {
                // Swipe left - next image
                nextImage();
            } else {
                // Swipe right - previous image
                prevImage();
            }
        }
    }
    
    // Add progress indicator for auto-play
    createProgressIndicator();
    
    // Create visual progress indicator for auto-play
    function createProgressIndicator() {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'auto-play-progress';
        progressContainer.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            z-index: 3;
            border-radius: 0 0 20px 20px;
            overflow: hidden;
        `;
        
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.style.cssText = `
            width: 0%;
            height: 100%;
            background: linear-gradient(90deg, #6366f1, #8b5cf6);
            transition: width ${autoPlayDelay/1000}s linear;
            border-radius: 0 0 20px 20px;
        `;
        
        progressContainer.appendChild(progressBar);
        mainImageContainer.appendChild(progressContainer);
        
        // Update progress bar
        updateProgressBar();
    }
    
    // Update progress bar animation
    function updateProgressBar() {
        const progressBar = document.querySelector('.progress-bar');
        
        if (isAutoPlaying) {
            // Reset and animate progress bar
            progressBar.style.transition = 'none';
            progressBar.style.width = '0%';
            
            // Force reflow
            progressBar.offsetHeight;
            
            // Start animation
            progressBar.style.transition = `width ${autoPlayDelay/1000}s linear`;
            progressBar.style.width = '100%';
        } else {
            // Pause progress bar
            const computedStyle = window.getComputedStyle(progressBar);
            const currentWidth = computedStyle.getPropertyValue('width');
            progressBar.style.transition = 'none';
            progressBar.style.width = currentWidth;
        }
    }
    
    // Listen for auto-play changes to update progress bar
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.classList.contains('status-indicator')) {
                    updateProgressBar();
                }
            }
        });
    });
    
    const statusIndicator = document.querySelector('.status-indicator');
    if (statusIndicator) {
        observer.observe(statusIndicator, { attributes: true });
    }
    
    // Add CSS for progress bar animation
    const progressStyle = document.createElement('style');
    progressStyle.textContent = `
        @keyframes progressAnimation {
            0% { width: 0%; }
            100% { width: 100%; }
        }
        
        .progress-bar {
            animation: progressAnimation ${autoPlayDelay/1000}s linear infinite;
        }
        
        .main-image.fading-out {
            animation: fadeOut 0.8s ease forwards;
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(progressStyle);
    
    // Issue #1 Fix: Update CSS for image-category styling
    const categoryStyle = document.createElement('style');
    categoryStyle.textContent = `
        .image-category {
            background: rgba(99, 102, 241, 0.15) !important;
            color: #c7d2fe !important;
            padding: 6px 16px !important;
            border-radius: 20px !important;
            font-size: 0.9rem !important;
            font-weight: 600 !important;
            letter-spacing: 1px !important;
            display: inline-block !important;
            margin-bottom: 1rem !important;
            border: 1px solid rgba(99, 102, 241, 0.3) !important;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
        }
        
        /* Override any existing styles that might be hiding the text */
        .overlay-content span {
            opacity: 1 !important;
            visibility: visible !important;
        }
    `;
    document.head.appendChild(categoryStyle);
    
    // Pause auto-play when page is not visible
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Page is hidden, pause auto-play
            const wasAutoPlaying = isAutoPlaying;
            if (isAutoPlaying) {
                stopAutoPlay();
                isAutoPlaying = false;
                updateAutoPlayStatus();
            }
            
            // Restore state when page becomes visible again
            document.addEventListener('visibilitychange', function restoreState() {
                if (!document.hidden && wasAutoPlaying) {
                    isAutoPlaying = true;
                    startAutoPlay();
                    updateAutoPlayStatus();
                    document.removeEventListener('visibilitychange', restoreState);
                }
            }, { once: true });
        }
    });
    
    // Issue #2 Fix: Prevent any anchor links from scrolling the page
    document.addEventListener('click', function(e) {
        if (e.target.closest('.thumbnail-item') || 
            e.target.closest('.control-btn') ||
            e.target.closest('.toggle-auto-play')) {
            e.preventDefault();
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
