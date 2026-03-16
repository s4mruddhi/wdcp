// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const themeToggle = document.querySelector('.theme-toggle');
const assistantToggle = document.querySelector('.assistant-toggle');
const assistantPanel = document.querySelector('.assistant-panel');
const closeAssistant = document.querySelector('.close-assistant');
const startVoiceBtn = document.getElementById('start-voice');
const voiceStatus = document.querySelector('.voice-status');
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const prevArrow = document.querySelector('.arrow.prev');
const nextArrow = document.querySelector('.arrow.next');
const testimonials = document.querySelectorAll('.testimonial');
const testimonialDots = document.querySelectorAll('.testimonial-dot');
const newsletterForm = document.getElementById('newsletter-form');
const counterItems = document.querySelectorAll('.counter');

// Hamburger Menu Toggle with improved functionality
if (hamburger) {
    hamburger.addEventListener('click', () => {
        console.log("Hamburger clicked");
        hamburger.classList.toggle('active');
        
        if (navLinks) {
            navLinks.classList.toggle('active');
            console.log("Nav links toggled");
        }
    });
}

// Close nav when clicking on a nav link
if (navLinks) {
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger) hamburger.classList.remove('active');
            if (navLinks) navLinks.classList.remove('active');
            console.log("Nav closed on link click");
        });
    });
}

// Apply saved theme on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check for saved theme preference and apply it immediately
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
        const icon = document.querySelector('.theme-toggle i');
        if (icon) {
            if (savedTheme === 'dark') {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        }
    }
    
    // Initialize other components and functionality
    if (typeof initializeComponents === 'function') {
        initializeComponents();
    }
});

// Dark Mode Toggle
if (themeToggle) {
    // Initialize theme on page load
    document.addEventListener('DOMContentLoaded', function() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.body.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    });

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Set theme attribute
        document.body.setAttribute('data-theme', newTheme);
        
        // Update icon and save preference
        updateThemeIcon(newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (icon) {
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }
}

// PERMANENTLY FIXED SLIDER - NO AUTO ROTATION
console.log("Content fix initialization - found " + slides.length + " slides");

// Force first slide to be active initially
if (slides.length > 0) {
    slides.forEach(slide => {
        slide.classList.remove('active');
        // Make sure all slides have proper z-index
        slide.style.zIndex = "1";
    });
    
    // Set the first slide as active with higher z-index
    slides[0].classList.add('active');
    slides[0].style.zIndex = "5";
    console.log("First slide activated with z-index 5");
    
    // Manually click controls
    let currentSlide = 0;
    
    function showSlide(index) {
        // Calculate the correct index
        currentSlide = index;
        if (currentSlide >= slides.length) currentSlide = 0;
        if (currentSlide < 0) currentSlide = slides.length - 1;
        
        console.log("Manually showing slide " + currentSlide);
        
        // Hide all slides - but keep them in the DOM
        slides.forEach(slide => {
            slide.classList.remove('active');
            slide.style.zIndex = "1";
        });
        
        // Show the current slide with higher z-index
        slides[currentSlide].classList.add('active');
        slides[currentSlide].style.zIndex = "5";
        
        // Update dots if they exist
        if (dots && dots.length > 0) {
            dots.forEach(dot => {
                dot.classList.remove('active');
            });
            
            if (dots[currentSlide]) {
                dots[currentSlide].classList.add('active');
            }
        }
        
        console.log("Slide " + currentSlide + " is now active");
    }
    
    // Next/Previous Controls
    if (nextArrow) {
        nextArrow.addEventListener('click', () => {
            showSlide(currentSlide + 1);
        });
    }
    
    if (prevArrow) {
        prevArrow.addEventListener('click', () => {
            showSlide(currentSlide - 1);
        });
    }
    
    // Dot Controls
    if (dots && dots.length > 0) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
            });
        });
    }
}

// Testimonials - NO AUTO ROTATION
console.log("Setting up testimonials - found " + testimonials.length);
if (testimonials.length > 0) {
    // Force first testimonial to be active
    testimonials.forEach(testimonial => {
        testimonial.classList.remove('active');
    });
    
    testimonials[0].classList.add('active');
    console.log("First testimonial activated");
    
    // Manual controls for testimonials
    if (testimonialDots && testimonialDots.length > 0) {
        testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                testimonials.forEach(t => t.classList.remove('active'));
                testimonialDots.forEach(d => d.classList.remove('active'));
                
                testimonials[index].classList.add('active');
                dot.classList.add('active');
                console.log("Switched to testimonial " + index);
            });
        });
    }
}

// Animated counter implementation
if (counterItems.length > 0) {
    console.log("Setting up animated counters - found " + counterItems.length);
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target')) || 0;
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current).toString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toString();
            }
        };
        
        updateCounter();
    };
    
    // Create an Intersection Observer to trigger animation when counter is visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the element is visible
    });
    
    // Observe each counter
    counterItems.forEach(counter => {
        observer.observe(counter);
    });
}

// Newsletter Form
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for subscribing to our newsletter!');
        newsletterForm.reset();
    });
}

// Section visibility enhancement
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded - ensuring all content is visible");
    
    // Make sure all sections are visible
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
        section.style.visibility = 'visible';
        section.style.display = 'block';
    });
    
    // Double-check hero section and slides visibility
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.style.visibility = 'visible';
        heroSection.style.display = 'block';
        console.log("Hero section visibility enforced");
    }
    
    // Force first slide to be visible again after DOM load
    if (slides.length > 0) {
        setTimeout(() => {
            slides[0].classList.add('active');
            slides[0].style.zIndex = "5";
            console.log("First slide visibility reinforced after DOM load");
        }, 100);
    }
});

// Voice Assistant Toggle
if (assistantToggle && assistantPanel && closeAssistant) {
    // Show voice assistant automatically after page load
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            assistantPanel.classList.add('active');
            console.log("Voice assistant panel opened automatically");
        }, 1000); // Wait 1 second before showing
    });
    
    assistantToggle.addEventListener('click', () => {
        assistantPanel.classList.toggle('active');
        console.log("Voice assistant panel toggled");
    });
    
    closeAssistant.addEventListener('click', () => {
        assistantPanel.classList.remove('active');
        console.log("Voice assistant panel closed");
    });
}

// Voice Assistant initialization
if (typeof webkitSpeechRecognition !== 'undefined') {
    const voiceAssistant = {
        recognition: null,
        isListening: false,
        
        init() {
            if ('webkitSpeechRecognition' in window) {
                this.recognition = new webkitSpeechRecognition();
                this.recognition.continuous = false;
                this.recognition.lang = 'en-US';
                
                this.recognition.onstart = () => {
                    this.isListening = true;
                    if (voiceStatus) voiceStatus.textContent = 'Listening...';
                    if (startVoiceBtn) startVoiceBtn.classList.add('listening');
                    console.log("Voice recognition started");
                };
                
                this.recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript.toLowerCase();
                    if (voiceStatus) voiceStatus.textContent = `"${transcript}"`;
                    console.log("Voice command received: " + transcript);
                    
                    // Process commands
                    this.processCommand(transcript);
                };
                
                this.recognition.onend = () => {
                    this.isListening = false;
                    if (voiceStatus) voiceStatus.textContent = 'Click to speak';
                    if (startVoiceBtn) startVoiceBtn.classList.remove('listening');
                    console.log("Voice recognition ended");
                };
                
                this.recognition.onerror = (event) => {
                    console.error('Speech recognition error', event.error);
                    if (voiceStatus) voiceStatus.textContent = 'Error. Try again.';
                    this.isListening = false;
                    if (startVoiceBtn) startVoiceBtn.classList.remove('listening');
                };
            }
        },
        
        processCommand(command) {
            // Simple command processing
            if (command.includes('home') || command.includes('main page')) {
                window.location.href = 'index.html';
            } else if (command.includes('about')) {
                window.location.href = 'about.html';
            } else if (command.includes('events') || command.includes('activities')) {
                window.location.href = 'events.html';
            } else if (command.includes('schemes') || command.includes('programs')) {
                window.location.href = 'schemes.html';
            } else if (command.includes('contact') || command.includes('reach')) {
                window.location.href = 'contact.html';
            } else if (command.includes('news') || command.includes('news page')) {
                window.location.href = 'news.html';
            } else if (command.includes('dark mode') || command.includes('night mode')) {
                document.body.setAttribute('data-theme', 'dark');
                const themeIcon = document.querySelector('.theme-toggle i');
                if (themeIcon) {
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                }
                localStorage.setItem('theme', 'dark');
            } else if (command.includes('light mode') || command.includes('day mode')) {
                document.body.setAttribute('data-theme', 'light');
                const themeIcon = document.querySelector('.theme-toggle i');
                if (themeIcon) {
                    themeIcon.classList.remove('fa-sun');
                    themeIcon.classList.add('fa-moon');
                }
                localStorage.setItem('theme', 'light');
            } else {
                if (voiceStatus) voiceStatus.textContent = "I didn't understand that command";
            }
        }
    };
    
    voiceAssistant.init();
}

console.log("Script completed successfully - all content should remain visible");

// Common Form Validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
            
            // Add error message if not exists
            let errorMsg = input.nextElementSibling;
            if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'This field is required';
                input.parentNode.insertBefore(errorMsg, input.nextSibling);
            }
        } else {
            input.classList.remove('error');
            const errorMsg = input.nextElementSibling;
            if (errorMsg && errorMsg.classList.contains('error-message')) {
                errorMsg.remove();
            }
        }
    });
    
    return isValid;
}

// Add form validation to all forms
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
            }
        });
        
        // Clear error on input
        form.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('input', function() {
                this.classList.remove('error');
                const errorMsg = this.nextElementSibling;
                if (errorMsg && errorMsg.classList.contains('error-message')) {
                    errorMsg.remove();
                }
            });
        });
    });
}); 