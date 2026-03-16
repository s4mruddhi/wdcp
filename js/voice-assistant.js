class VoiceAssistant {
    constructor() {
        this.isListening = false;
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.initializeSpeechRecognition();
        this.initializeAssistantPanel();
    }

    initializeSpeechRecognition() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            this.recognition.onresult = (event) => {
                const command = event.results[0][0].transcript.toLowerCase();
                this.processCommand(command);
            };

            this.recognition.onend = () => {
                this.isListening = false;
                this.updateButtonState();
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.isListening = false;
                this.updateButtonState();
                this.speak('Sorry, there was an error with speech recognition.');
            };
        }
    }

    initializeAssistantPanel() {
        const toggle = document.querySelector('.assistant-toggle');
        const panel = document.querySelector('.assistant-panel');
        const closeBtn = document.querySelector('.close-assistant');
        const startVoiceBtn = document.getElementById('start-voice');
        const voiceStatus = document.querySelector('.voice-status');

        if (toggle && panel && closeBtn && startVoiceBtn) {
            toggle.addEventListener('click', () => {
                panel.classList.toggle('active');
            });

            closeBtn.addEventListener('click', () => {
                panel.classList.remove('active');
            });

            startVoiceBtn.addEventListener('click', () => this.toggleListening());
        }
    }

    toggleListening() {
        if (!this.recognition) {
            this.speak('Speech recognition is not supported in your browser.');
            return;
        }

        if (this.isListening) {
            this.recognition.stop();
            this.isListening = false;
            document.querySelector('.voice-status').textContent = 'Click to speak';
        } else {
            this.recognition.start();
            this.isListening = true;
            document.querySelector('.voice-status').textContent = 'Listening...';
            this.speak('How can I help you?');
        }
        this.updateButtonState();
    }

    updateButtonState() {
        const button = document.getElementById('start-voice');
        if (button) {
            button.classList.toggle('listening', this.isListening);
        }
    }

    speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        utterance.pitch = 1;
        this.synthesis.speak(utterance);
    }

    processCommand(command) {
        console.log('Command received:', command);

        // Navigation commands
        if (command.includes('go to') || command.includes('navigate to')) {
            this.handleNavigation(command);
        }
        // Reading commands
        else if (command.includes('read') || command.includes('tell me about')) {
            this.handleReading(command);
        }
        // Theme commands
        else if (command.includes('dark mode') || command.includes('light mode')) {
            this.handleTheme(command);
        }
        // Help command
        else if (command.includes('help') || command.includes('what can you do')) {
            this.speak('I can help you navigate the website, read content, and switch themes. Just say "go to" followed by the page name, or "read" followed by the section name.');
        }
        else {
            this.speak("I'm not sure how to help with that. Say 'help' to learn what I can do.");
        }
    }

    handleNavigation(command) {
        const pages = {
            'home': 'index.html',
            'about': 'about.html',
            'events': 'events.html',
            'news': 'news.html',
            'schemes': 'schemes.html',
            'contact': 'contact.html'
        };

        for (const [page, url] of Object.entries(pages)) {
            if (command.includes(page)) {
                this.speak(`Navigating to ${page} page`);
                window.location.href = url;
                return;
            }
        }
        this.speak("I couldn't find that page. Available pages are: home, about, events, news, schemes, and contact.");
    }

    handleReading(command) {
        const sections = document.querySelectorAll('section');
        for (const section of sections) {
            const title = section.querySelector('h1, h2')?.textContent.toLowerCase();
            if (title && command.includes(title)) {
                const content = section.textContent.replace(/\s+/g, ' ').trim();
                this.speak(content);
                return;
            }
        }
        this.speak("I couldn't find that section. Please try again.");
    }

    handleTheme(command) {
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            if (command.includes('dark mode')) {
                document.body.classList.add('dark');
                themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('theme', 'dark');
                this.speak('Switching to dark mode');
            } else if (command.includes('light mode')) {
                document.body.classList.remove('dark');
                themeToggle.querySelector('i').classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('theme', 'light');
                this.speak('Switching to light mode');
            }
        }
    }
}

// Initialize voice assistant when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.voiceAssistant = new VoiceAssistant();
}); 