// js/events.js
// Handles Events page interactivity: event filtering, calendar, registration modal

document.addEventListener('DOMContentLoaded', function() {
    // Apply saved theme before doing anything else
    applyTheme();
    
    // DOM Elements
    const searchInput = document.getElementById('event-search');
    const categoryFilter = document.getElementById('category-filter');
    const locationFilter = document.getElementById('location-filter');
    const eventCards = document.querySelectorAll('.event-card');
    const modal = document.getElementById('registration-modal');
    const registerBtns = document.querySelectorAll('.btn-register');
    const closeModal = document.querySelector('.close-modal');
    const registrationForm = document.getElementById('registration-form');
    const currentMonthElement = document.getElementById('current-month');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const calendarDates = document.getElementById('calendar-dates');

    // Calendar data
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let currentMonth = currentDate.getMonth();

    // Event data for calendar
    const eventDates = [
        { day: 15, month: 5, year: 2024, title: 'National Youth Sports Championship', location: 'Delhi' },
        { day: 22, month: 5, year: 2024, title: 'Leadership Training Workshop', location: 'Mumbai' },
        { day: 30, month: 5, year: 2024, title: 'Inter-State Athletics Meet', location: 'Bangalore' },
        { day: 7, month: 6, year: 2024, title: 'Youth Entrepreneurship Summit', location: 'Chennai' },
        { day: 12, month: 6, year: 2024, title: 'Sports Nutrition Workshop', location: 'Delhi' },
        { day: 18, month: 6, year: 2024, title: 'National Swimming Championship', location: 'Mumbai' },
        { day: 25, month: 6, year: 2024, title: 'Youth Mental Health in Sports', location: 'Bangalore' },
        { day: 2, month: 7, year: 2024, title: 'Beach Volleyball Tournament', location: 'Chennai' },
        { day: 10, month: 7, year: 2024, title: 'Sports Technology Expo', location: 'Delhi' }
    ];

    // Initialize event listeners
    searchInput.addEventListener('input', filterEvents);
    categoryFilter.addEventListener('change', filterEvents);
    locationFilter.addEventListener('change', filterEvents);
    prevMonthBtn.addEventListener('click', () => changeMonth(-1));
    nextMonthBtn.addEventListener('click', () => changeMonth(1));

    // Filter events function
    function filterEvents() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedCategory = categoryFilter.value;
        const selectedLocation = locationFilter.value;
        
        console.log(`Filtering - Search: "${searchTerm}", Category: ${selectedCategory}, Location: ${selectedLocation}`);
        
        // Loop through all event cards
        eventCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardLocation = card.getAttribute('data-location');
            const cardTitle = card.querySelector('h3').textContent.toLowerCase();
            const cardDescription = card.querySelector('.event-description').textContent.toLowerCase();
            
            // Check if card matches all filters
            const matchesSearch = cardTitle.includes(searchTerm) || cardDescription.includes(searchTerm) || searchTerm === '';
            const matchesCategory = selectedCategory === 'all' || cardCategory === selectedCategory;
            const matchesLocation = selectedLocation === 'all' || cardLocation === selectedLocation;
            
            // Show or hide the card based on filter results
            if (matchesSearch && matchesCategory && matchesLocation) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Check if no results
        checkNoResults();
    }
    
    // Check if no results and display message
    function checkNoResults() {
        let visibleCards = 0;
        eventCards.forEach(card => {
            if (card.style.display !== 'none') {
                visibleCards++;
            }
        });
        
        // Remove existing no results message if it exists
        const existingMessage = document.querySelector('.no-results-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Add message if no cards are visible
        if (visibleCards === 0) {
            const message = document.createElement('div');
            message.className = 'no-results-message';
            message.innerHTML = `
                <p>No events match your criteria. Please try different filters.</p>
                <button class="btn reset-filters">Reset Filters</button>
            `;
            document.querySelector('.events-grid').appendChild(message);
            
            // Add event listener to reset button
            message.querySelector('.reset-filters').addEventListener('click', resetFilters);
        }
    }
    
    // Reset all filters
    function resetFilters() {
        searchInput.value = '';
        categoryFilter.value = 'all';
        locationFilter.value = 'all';
        filterEvents();
    }

    // Calendar functions
    function generateCalendar() {
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        // Update month display
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        currentMonthElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        
        // Clear calendar
        calendarDates.innerHTML = '';
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('date-cell', 'empty');
            calendarDates.appendChild(emptyCell);
        }
        
        // Generate calendar days
        for (let day = 1; day <= daysInMonth; day++) {
            const dateCell = document.createElement('div');
            dateCell.classList.add('date-cell');
            
            // Check if date has events
            const hasEvent = eventDates.some(event => {
                return (event.day === day && event.month === currentMonth && event.year === currentYear);
            });
            
            // Add event class if date has events
            if (hasEvent) {
                dateCell.classList.add('has-event');
                
                // Get events for this date
                const dateEvents = eventDates.filter(event => {
                    return (event.day === day && event.month === currentMonth && event.year === currentYear);
                });
                
                // Create tooltip with event details
                const tooltip = document.createElement('div');
                tooltip.classList.add('event-tooltip');
                
                dateEvents.forEach(event => {
                    const eventItem = document.createElement('div');
                    eventItem.classList.add('tooltip-event');
                    eventItem.innerHTML = `
                        <span class="event-title">${event.title}</span>
                        <span class="event-location">${event.location}</span>
                    `;
                    tooltip.appendChild(eventItem);
                });
                
                dateCell.appendChild(tooltip);
                
                // Show tooltip on hover
                dateCell.addEventListener('mouseenter', () => {
                    tooltip.style.display = 'block';
                });
                
                dateCell.addEventListener('mouseleave', () => {
                    tooltip.style.display = 'none';
                });
            }
            
            // Check if it's today's date
            const today = new Date();
            if (day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
                dateCell.classList.add('today');
            }
            
            dateCell.textContent = day;
            calendarDates.appendChild(dateCell);
        }
    }
    
    // Change month function
    function changeMonth(delta) {
        currentMonth += delta;
        
        // Handle year change
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        } else if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        
        generateCalendar();
    }

    // Registration modal functionality
    registerBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Get event details for registration
            const eventCard = this.closest('.event-card');
            const eventTitle = eventCard.querySelector('h3').textContent;
            const eventLocation = eventCard.querySelector('.event-location').textContent.replace('Location: ', '');
            const eventDate = `${eventCard.querySelector('.day').textContent} ${eventCard.querySelector('.month').textContent}`;
            
            // Update modal with event information
            if (modal.querySelector('h2')) {
                modal.querySelector('h2').textContent = `Register for: ${eventTitle}`;
            }
            
            // Add hidden fields with event information
            let eventInput = document.getElementById('event-name');
            if (!eventInput) {
                eventInput = document.createElement('input');
                eventInput.type = 'hidden';
                eventInput.id = 'event-name';
                eventInput.name = 'event-name';
                registrationForm.appendChild(eventInput);
            }
            eventInput.value = eventTitle;
            
            let locationInput = document.getElementById('event-location');
            if (!locationInput) {
                locationInput = document.createElement('input');
                locationInput.type = 'hidden';
                locationInput.id = 'event-location';
                locationInput.name = 'event-location';
                registrationForm.appendChild(locationInput);
            }
            locationInput.value = eventLocation;
            
            let dateInput = document.getElementById('event-date');
            if (!dateInput) {
                dateInput = document.createElement('input');
                dateInput.type = 'hidden';
                dateInput.id = 'event-date';
                dateInput.name = 'event-date';
                registrationForm.appendChild(dateInput);
            }
            dateInput.value = eventDate;
            
            // Show modal
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        });
    });

    // Close modal
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Registration form submission
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const age = document.getElementById('age').value;
            const category = document.getElementById('category').value;
            const eventName = document.getElementById('event-name').value;
            
            // Simple validation
            if (!name || !email || !phone || !age || !category) {
                alert('Please fill in all required fields');
                return;
            }
            
            // Show success message and reset form
            alert(`Thank you, ${name}! Your registration for "${eventName}" has been submitted successfully. We will send confirmation details to ${email}.`);
            
            // Close modal and reset form
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
            registrationForm.reset();
        });
    }

    // Initialize calendar and filtering
    generateCalendar();
    filterEvents();
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