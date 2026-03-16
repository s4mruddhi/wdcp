// Carousel functionality
let currentSlide = 0;
let carouselInterval;

function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const totalSlides = slides.length;

    function showSlide(index) {
        slides.forEach(slide => {
            slide.style.display = 'none';
        });
        currentSlide = (index + totalSlides) % totalSlides;
        slides[currentSlide].style.display = 'block';
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    // Start carousel
    showSlide(0);
    carouselInterval = setInterval(nextSlide, 5000);

    // Add event listeners for navigation
    const nextBtn = document.querySelector('.carousel-btn.next');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const carousel = document.querySelector('.news-carousel');

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            clearInterval(carouselInterval);
            nextSlide();
            carouselInterval = setInterval(nextSlide, 5000);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            clearInterval(carouselInterval);
            prevSlide();
            carouselInterval = setInterval(nextSlide, 5000);
        });
    }

    if (carousel) {
        carousel.addEventListener('mouseenter', () => clearInterval(carouselInterval));
        carousel.addEventListener('mouseleave', () => {
            carouselInterval = setInterval(nextSlide, 5000);
        });
    }
}

// Search and Filter functionality
function initSearchAndFilter() {
    const searchBar = document.getElementById('searchBar');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const newsCards = document.querySelectorAll('.news-card');

    function filterNews() {
        const searchTerm = searchBar ? searchBar.value.toLowerCase().trim() : '';
        const activeCategory = document.querySelector('.category-btn.active')?.dataset.category || 'all';

        newsCards.forEach(card => {
            const title = card.querySelector('h3').innerText.toLowerCase();
            const content = card.querySelector('p').innerText.toLowerCase();
            const category = card.dataset.category;

            const matchesSearch = !searchTerm || title.includes(searchTerm) || content.includes(searchTerm);
            const matchesCategory = activeCategory === 'all' || category === activeCategory;

            card.style.display = matchesSearch && matchesCategory ? 'block' : 'none';
        });
    }

    if (searchBar) {
        searchBar.addEventListener('input', filterNews);
    }

    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            filterNews();
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initCarousel();
    initSearchAndFilter();
    
    // Add click event to assistant header for minimizing
    document.querySelector('.assistant-header').addEventListener('click', function(e) {
        if (e.target !== document.querySelector('.minimize-btn')) {
            toggleAssistant();
        }
    });

    // Voice Assistant Functionality
    const assistantToggle = document.querySelector('.assistant-toggle');
    const assistantPanel = document.querySelector('.assistant-panel');
    const closeAssistant = document.querySelector('.close-assistant');
    const startVoiceBtn = document.getElementById('start-voice');
    const voiceStatus = document.querySelector('.voice-status');

    // Toggle assistant panel
    assistantToggle.addEventListener('click', () => {
        assistantPanel.classList.add('active');
        // Remove any display style that might have been set
        assistantToggle.style.removeProperty('display');
    });

    // Close assistant panel
    closeAssistant.addEventListener('click', () => {
        assistantPanel.classList.remove('active');
        // Remove any display style that might have been set
        assistantToggle.style.removeProperty('display');
    });

    // Voice recognition setup
    let recognition;
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            voiceStatus.textContent = 'Listening...';
            startVoiceBtn.style.backgroundColor = '#ff4444';
        };

        recognition.onresult = (event) => {
            const command = event.results[0][0].transcript.toLowerCase();
            voiceStatus.textContent = 'Processing...';
            processVoiceCommand(command);
        };

        recognition.onend = () => {
            voiceStatus.textContent = 'Click to speak';
            startVoiceBtn.style.backgroundColor = '';
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            voiceStatus.textContent = 'Error occurred. Click to try again.';
            startVoiceBtn.style.backgroundColor = '';
        };
    }

    // Start voice recognition
    startVoiceBtn.addEventListener('click', () => {
        if (recognition) {
            recognition.start();
        } else {
            voiceStatus.textContent = 'Voice recognition not supported';
        }
    });

    // Process voice commands
    function processVoiceCommand(command) {
        console.log('Processing command:', command);
        
        // Navigation commands
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
        }
        // Theme commands
        else if (command.includes('dark mode') || command.includes('night mode')) {
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
        }
        // News-specific commands
        else if (command.includes('search')) {
            const searchTerm = command.replace('search', '').trim();
            if (searchTerm) {
                document.getElementById('searchBar').value = searchTerm;
                document.getElementById('searchBar').dispatchEvent(new Event('input'));
            }
        } else if (command.includes('category')) {
            const category = command.replace('category', '').trim();
            const categoryBtn = Array.from(document.querySelectorAll('.category-btn')).find(
                btn => btn.textContent.toLowerCase().includes(category)
            );
            if (categoryBtn) {
                categoryBtn.click();
            }
        } else if (command.includes('read more')) {
            const newsCards = document.querySelectorAll('.news-card');
            if (newsCards.length > 0) {
                newsCards[0].querySelector('button').click();
            }
        } else if (command.includes('close')) {
            assistantPanel.classList.remove('active');
        } else {
            voiceStatus.textContent = "I didn't understand that command";
        }
    }
});

// Modal functionality
function readMore(button) {
    const card = button.parentElement;
    const title = card.querySelector('h3').innerText;
    const desc = card.querySelector('p').innerText;
    const category = card.querySelector('.category').innerText;
    const date = card.querySelector('.date').innerText;
    const image = card.querySelector('img').src;

    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalCategory').innerText = category;
    document.getElementById('modalDate').innerText = date;
    document.getElementById('modalImage').src = image;
    document.getElementById('modalBody').innerText = desc;
    
    const fullContent = `
        <p>${desc}</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    `;
    document.getElementById('modalFullContent').innerHTML = fullContent;
    
    document.getElementById('modal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
    document.body.style.overflow = '';
}

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
});

// Share functionality
function shareNews() {
    const title = document.getElementById('modalTitle').innerText;
    const url = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: title,
            url: url
        }).catch(console.error);
    } else {
        const dummy = document.createElement('input');
        document.body.appendChild(dummy);
        dummy.value = url;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        alert('Link copied to clipboard!');
    }
}

// Theme toggle
document.querySelector('.theme-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark');
    const icon = this.querySelector('i');
    if (document.body.classList.contains('dark')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
});

// Initialize theme based on user preference
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark');
    const icon = document.querySelector('.theme-toggle i');
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
}

// Assistant Panel functionality
function toggleAssistant() {
    const panel = document.getElementById('assistantPanel');
    panel.classList.toggle('minimized');
    const icon = document.querySelector('.minimize-btn i');
    if (panel.classList.contains('minimized')) {
        icon.classList.remove('fa-minus');
        icon.classList.add('fa-plus');
    } else {
        icon.classList.remove('fa-plus');
        icon.classList.add('fa-minus');
    }
}

function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    
    if (message) {
        addMessage(message, 'user');
        input.value = '';
        
        // Simulate assistant response
        setTimeout(() => {
            const response = generateResponse(message);
            addMessage(response, 'assistant');
        }, 1000);
    }
}

function addMessage(text, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = text;
    
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function generateResponse(message) {
    // Simple response generation based on keywords
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        return 'Hello! How can I help you today?';
    }
    
    if (lowerMessage.includes('news') || lowerMessage.includes('article')) {
        return 'I can help you find news articles. You can use the search bar above or filter by categories.';
    }
    
    if (lowerMessage.includes('category') || lowerMessage.includes('filter')) {
        return 'You can filter news by categories like Sports, Youth Programs, and Announcements using the category buttons.';
    }
    
    if (lowerMessage.includes('search')) {
        return 'Use the search bar at the top to find specific news articles. You can search by title or content.';
    }
    
    if (lowerMessage.includes('help')) {
        return 'I can help you with:\n- Finding news articles\n- Using search and filters\n- Understanding categories\n- Navigating the news page';
    }
    
    return "I'm not sure I understand. Could you please rephrase your question? I can help you with finding news articles, using search and filters, or understanding the different categories.";
}

// Add event listener for Enter key in chat input
document.getElementById('userInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

