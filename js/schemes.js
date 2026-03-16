// js/schemes.js
// Handles Schemes page interactivity: filtering, scheme details modal, application form

document.addEventListener('DOMContentLoaded', function() {
    // Apply saved theme before doing anything else
    applyTheme();
    
    const searchInput = document.getElementById('scheme-search');
    const typeFilter = document.getElementById('type-filter');
    const eligibilityFilter = document.getElementById('eligibility-filter');
    const schemeCards = document.querySelectorAll('.scheme-card');
    const modal = document.getElementById('scheme-modal');
    const closeModal = document.querySelector('.close-modal');
    const schemeDetailsContent = document.getElementById('scheme-details-content');
    const applicationForm = document.getElementById('scheme-application-form');
    const detailButtons = document.querySelectorAll('.btn-details');

    // Scheme data for modal
    const schemesData = {
        'Khelo India': {
            title: 'Khelo India',
            icon: '<i class="fas fa-running"></i>',
            description: 'Reviving sports culture at the grassroots level through competitions and talent identification.',
            longDescription: 'Khelo India is a national program for the development of sports in India. The program aims to build a strong framework for all sports played in our country and establish India as a great sporting nation. It focuses on grassroots development, talent identification, and providing support to potential elite sportspersons.',
            eligibility: 'All ages, emphasis on youth under 17 years',
            funding: 'Up to ₹5 Lakhs per athlete annually',
            duration: 'Year-round program with seasonal competitions',
            process: [
                'Participate in local and state-level Khelo India competitions',
                'Top performers are selected for national championships',
                'Selected athletes receive training and financial support'
            ],
            documents: [
                'Age proof (Birth Certificate/Aadhar Card)',
                'Sports certificates (if any)',
                'Medical fitness certificate',
                'Parental consent (for minors)'
            ]
        },
        'National Youth Corps': {
            title: 'National Youth Corps',
            icon: '<i class="fas fa-graduation-cap"></i>',
            description: 'Engaging youth in voluntary social service and community development programs.',
            longDescription: 'The National Youth Corps scheme is designed to engage young men and women in nation-building activities while providing them with opportunities for personal development. Volunteers work on various social service projects, community mobilization, and national integration programs.',
            eligibility: '18-25 years with minimum educational qualification of 10th pass',
            funding: 'Monthly stipend of ₹5,000',
            duration: '2 Years of service',
            process: [
                'Apply through online portal',
                'Complete screening and interview process',
                'Attend mandatory induction training',
                'Assignment to community service projects'
            ],
            documents: [
                'Age proof (Birth Certificate/Aadhar Card)',
                'Educational certificates',
                'Character certificate',
                'Medical fitness certificate'
            ]
        },
        'Skill Development Program': {
            title: 'Skill Development Program',
            icon: '<i class="fas fa-tools"></i>',
            description: 'Vocational training and skill enhancement for youth employment.',
            longDescription: 'The Skill Development Program aims to enhance the employability of youth by providing them with industry-relevant skills. The program offers various short-term and long-term courses in different sectors including manufacturing, service industry, healthcare, IT, and more.',
            eligibility: 'All ages, with focus on unemployed youth',
            funding: 'Free training with stipend for some courses',
            duration: '3-6 Months depending on the course',
            process: [
                'Select a training program from available options',
                'Complete application and aptitude test',
                'Attend regular training sessions',
                'Complete certification and placement assistance'
            ],
            documents: [
                'Identity proof (Aadhar Card)',
                'Educational certificates',
                'Income certificate (if applicable)',
                'Recent photograph'
            ]
        },
        // New scheme data
        'Startup India Youth Program': {
            title: 'Startup India Youth Program',
            icon: '<i class="fas fa-briefcase"></i>',
            description: 'Supporting youth entrepreneurs with funding, mentorship, and business development resources.',
            longDescription: 'The Startup India Youth Program is designed to foster entrepreneurship among young Indians by providing comprehensive support for new business ventures. The program offers financial assistance, business mentoring, networking opportunities, and incubation support to transform innovative ideas into successful startups.',
            eligibility: 'Entrepreneurs aged 18-35 years with innovative business ideas',
            funding: 'Up to ₹10 Lakhs in seed funding with additional funding based on performance',
            duration: '3 Years of support and mentorship',
            process: [
                'Submit detailed business plan and application',
                'Present idea to selection committee',
                'Complete entrepreneurship training program',
                'Receive funding and ongoing mentorship support'
            ],
            documents: [
                'Identity and age proof documents',
                'Business plan and proposal',
                'Educational and experience certificates',
                'Financial projections and market analysis'
            ]
        },
        'Target Olympic Podium': {
            title: 'Target Olympic Podium',
            icon: '<i class="fas fa-medal"></i>',
            description: 'Elite training program for young athletes with potential for Olympic success, providing international exposure.',
            longDescription: 'The Target Olympic Podium scheme identifies and supports potential medal prospects for upcoming Olympic Games. Selected athletes receive specialized coaching, international training exposure, and financial support to prepare them for competing at the highest level of international sports.',
            eligibility: 'Athletes under 18 showing exceptional promise in Olympic sports',
            funding: 'Monthly stipend of up to ₹50,000 plus competition and training expenses',
            duration: 'Full Olympic cycle (4 years) with annual performance reviews',
            process: [
                'Nomination by national sports federations or talent scouts',
                'Performance evaluation at national selection trials',
                'Interview and physical assessment',
                'Final selection by expert committee'
            ],
            documents: [
                'Sports achievement certificates',
                'Medical and fitness reports',
                'Coach recommendations',
                'Training history and performance metrics'
            ]
        },
        'Sports Scholarship Program': {
            title: 'Sports Scholarship Program',
            icon: '<i class="fas fa-book"></i>',
            description: 'Academic scholarships for student athletes balancing sports excellence with education.',
            longDescription: 'The Sports Scholarship Program supports student athletes who excel both in academics and sports. It aims to ensure that talented sportspersons can pursue their education without financial constraints while continuing their sporting careers. The program covers educational expenses and provides additional support for sports training.',
            eligibility: 'Students of all ages with proven sports achievements and good academic records',
            funding: 'Full tuition coverage with additional allowance for books and sports equipment',
            duration: 'Throughout the duration of academic program with annual renewal based on performance',
            process: [
                'Submit application with academic and sports credentials',
                'Participate in sports trials if required',
                'Academic interview and evaluation',
                'Performance review for scholarship renewal'
            ],
            documents: [
                'Academic transcripts',
                'Sports certificates and achievement records',
                'Letter of recommendation from coaches/teachers',
                'Financial documentation if applicable'
            ]
        },
        'Digital Skills Initiative': {
            title: 'Digital Skills Initiative',
            icon: '<i class="fas fa-laptop-code"></i>',
            description: 'Training in digital technologies, coding, and software development for career advancement in tech.',
            longDescription: 'The Digital Skills Initiative aims to bridge the digital skills gap by providing comprehensive training in various technology domains. Participants learn in-demand skills such as programming, web development, mobile app development, data analysis, and cloud computing, preparing them for careers in the growing tech industry.',
            eligibility: 'Individuals aged 18-30 with basic computer literacy',
            funding: 'Heavily subsidized course fees with placement assistance',
            duration: '6-12 Months of intensive training with practical projects',
            process: [
                'Complete basic aptitude test for technical skills',
                'Select specialization track based on aptitude and interest',
                'Attend regular classes and complete assignments',
                'Build portfolio through capstone projects'
            ],
            documents: [
                'Educational certificates',
                'Identity proof',
                'Basic computer literacy certificate if available',
                'Statement of purpose'
            ]
        },
        'Rural Sports Enterprise': {
            title: 'Rural Sports Enterprise',
            icon: '<i class="fas fa-chart-line"></i>',
            description: 'Promoting entrepreneurship in sports-related businesses in rural areas with special incentives.',
            longDescription: 'The Rural Sports Enterprise scheme encourages the establishment of sports-related businesses in rural areas to improve sports infrastructure, increase employment opportunities, and promote sports culture. The program provides financial and technical support for ventures such as sports academies, equipment manufacturing, facility management, and sports tourism.',
            eligibility: 'Residents of rural areas interested in sports-related business ventures',
            funding: 'Low-interest loans up to ₹25 Lakhs with interest subsidies',
            duration: '5 Years of support with business development assistance',
            process: [
                'Submit business proposal focusing on local sports development',
                'Participate in business planning workshops',
                'Secure approval from local panchayat or municipal body',
                'Complete training in sports business management'
            ],
            documents: [
                'Rural domicile certificate',
                'Land/property documentation (if applicable)',
                'Business plan with feasibility study',
                'Local authority recommendation'
            ]
        },
        'Young Athlete Development': {
            title: 'Young Athlete Development',
            icon: '<i class="fas fa-dumbbell"></i>',
            description: 'Comprehensive physical training and coaching for promising junior athletes in Olympic sports.',
            longDescription: 'The Young Athlete Development Program identifies and nurtures sporting talent at an early age. It provides structured training, scientific support, and competitive exposure to help young athletes develop their full potential. The program includes specialized coaching, nutritional guidance, sports science support, and a progressive competition pathway.',
            eligibility: 'Children aged 10-16 with aptitude for Olympic sports',
            funding: 'Free coaching, equipment support, and competition expenses',
            duration: 'Ongoing program with quarterly progress assessments',
            process: [
                'Participate in talent identification camps',
                'Complete physical ability and sports-specific tests',
                'Undergo medical and fitness evaluation',
                'Join structured training program at designated centers'
            ],
            documents: [
                'Birth certificate',
                'School enrollment proof',
                'Parental consent form',
                'Medical fitness certificate'
            ]
        }
    };

    // Implement search functionality
    searchInput.addEventListener('input', filterSchemes);

    // Implement filtering
    typeFilter.addEventListener('change', filterSchemes);
    eligibilityFilter.addEventListener('change', filterSchemes);

    // Filter function for schemes
    function filterSchemes() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedType = typeFilter.value;
        const selectedEligibility = eligibilityFilter.value;

        console.log(`Filtering - Search: "${searchTerm}", Type: ${selectedType}, Eligibility: ${selectedEligibility}`);

        // Loop through all scheme cards
        schemeCards.forEach(card => {
            const cardType = card.getAttribute('data-type');
            const cardEligibility = card.getAttribute('data-eligibility');
            const cardTitle = card.querySelector('h3').textContent.toLowerCase();
            const cardDescription = card.querySelector('.scheme-description').textContent.toLowerCase();
            
            // Check if card matches all filters
            const matchesSearch = cardTitle.includes(searchTerm) || cardDescription.includes(searchTerm) || searchTerm === '';
            const matchesType = selectedType === 'all' || cardType === selectedType;
            const matchesEligibility = selectedEligibility === 'all' || cardEligibility === selectedEligibility;

            // Show or hide the card based on filter results
            if (matchesSearch && matchesType && matchesEligibility) {
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
        schemeCards.forEach(card => {
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
                <p>No schemes match your criteria. Please try different filters.</p>
                <button class="btn reset-filters">Reset Filters</button>
            `;
            document.querySelector('.schemes-grid').appendChild(message);
            
            // Add event listener to reset button
            message.querySelector('.reset-filters').addEventListener('click', resetFilters);
        }
    }

    // Reset all filters
    function resetFilters() {
        searchInput.value = '';
        typeFilter.value = 'all';
        eligibilityFilter.value = 'all';
        filterSchemes();
    }

    // Modal functionality
    detailButtons.forEach(button => {
        button.addEventListener('click', function() {
            const schemeCard = this.closest('.scheme-card');
            const schemeTitle = schemeCard.querySelector('h3').textContent;
            
            if (schemesData[schemeTitle]) {
                const scheme = schemesData[schemeTitle];
                
                // Populate modal with scheme details
                schemeDetailsContent.innerHTML = `
                    <div class="modal-header">
                        <div class="modal-icon">${scheme.icon}</div>
                        <h2>${scheme.title}</h2>
                    </div>
                    <div class="modal-body">
                        <p class="modal-description">${scheme.longDescription}</p>
                        
                        <div class="modal-info-grid">
                            <div class="info-item">
                                <h4>Eligibility</h4>
                                <p>${scheme.eligibility}</p>
                            </div>
                            <div class="info-item">
                                <h4>Funding</h4>
                                <p>${scheme.funding}</p>
                            </div>
                            <div class="info-item">
                                <h4>Duration</h4>
                                <p>${scheme.duration}</p>
                            </div>
                        </div>
                        
                        <div class="modal-section">
                            <h4>Application Process</h4>
                            <ol>
                                ${scheme.process.map(step => `<li>${step}</li>`).join('')}
                            </ol>
                        </div>
                        
                        <div class="modal-section">
                            <h4>Required Documents</h4>
                            <ul>
                                ${scheme.documents.map(doc => `<li>${doc}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                `;
                
                // Show modal
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
            }
        });
    });

    // Close modal
    closeModal.addEventListener('click', function() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Handle application form submission
    applicationForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get form data
        const name = document.getElementById('applicant-name').value;
        const email = document.getElementById('applicant-email').value;
        const phone = document.getElementById('applicant-phone').value;
        const age = document.getElementById('applicant-age').value;
        
        // Simple validation
        if (!name || !email || !phone || !age) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Show success message and reset form
        alert(`Thank you, ${name}! Your application has been submitted successfully. We will contact you soon at ${email} or ${phone}.`);
        applicationForm.reset();
        
        // Close modal
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    // Initial filtering to set up the page
    filterSchemes();
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