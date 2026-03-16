// js/contact.js
// Handles Contact page interactivity: form validation, FAQ toggles

document.addEventListener('DOMContentLoaded', function() {
    // Apply saved theme before doing anything else
    applyTheme();
    
    // Contact Form Submission Example
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Message sent! We will get back to you soon.');
            contactForm.reset();
        });
    }

    // FAQ Toggle Example
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });
});

// Function to apply saved theme
function applyTheme() {
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
        console.log('Applied saved theme:', savedTheme);
    }
} 