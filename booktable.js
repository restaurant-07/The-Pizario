// ==================================================
// BOOKING PAGE DYNAMIC GENERATOR
// ==================================================

document.addEventListener('DOMContentLoaded', function() {
    if (typeof CONFIG === 'undefined') {
        console.error('CONFIG not loaded!');
        return;
    }
    
    const name = CONFIG.restaurant.name;
    const nameParts = name.split(' ');
    
    // Generate Tables (NO SELECT BUTTON)
    generateTables();
    
    // Generate Hours
    generateHours();
    
    // ===== LOGO - Space between first 2 words =====
    const logoElement = document.getElementById('logo');
    if (logoElement) {
        if (nameParts.length >= 2) {
            const firstTwo = nameParts.slice(0, 2).join(' ');
            const rest = nameParts.slice(2).join(' ');
            if (rest) {
                logoElement.innerHTML = `<span>${firstTwo}</span><span class="logo-rest"> ${rest}</span>`;
            } else {
                logoElement.innerHTML = `<span>${firstTwo}</span>`;
            }
        } else {
            logoElement.innerHTML = `<span>${name}</span>`;
        }
    }
    
    // Update WhatsApp Number Display
    const waNumber = document.getElementById('waNumber');
    if (waNumber) waNumber.textContent = CONFIG.contact.phone;
    
    // ===== WHATSAPP CHIP CLICK - Uses config phone =====
    const waChip = document.getElementById('waChip');
    if (waChip) {
        waChip.addEventListener('click', function() {
            const message = encodeURIComponent("Hello! I'm interested in booking a table. Can you help me?");
            window.open(`https://wa.me/${CONFIG.contact.phoneRaw}?text=${message}`, '_blank');
        });
    }
    
    // ===== WHATSAPP FLOAT BUTTON - Uses config phone =====
    const waFloat = document.getElementById('whatsappFloat');
    if (waFloat) {
        waFloat.href = `https://wa.me/${CONFIG.contact.phoneRaw}?text=Hello!%20I'd%20like%20to%20book%20a%20table`;
    }
    
    // ===== MOBILE RESERVE BUTTON - Uses config phone =====
    const mobileReserve = document.getElementById('mobileReserveBtn');
    if (mobileReserve) {
        mobileReserve.href = `https://wa.me/${CONFIG.contact.phoneRaw}?text=Hello!%20I'd%20like%20to%20book%20a%20table`;
    }
    
    // ===== BOOKING FORM SUBMIT - NO EMAIL, NO TABLE PREFERENCE =====
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values (NO EMAIL, NO TABLE PREFERENCE)
            const nameField = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const guests = document.getElementById('guests').value;
            const requests = document.getElementById('requests').value || 'None';
            
            // Validate required fields
            if (!nameField || !phone || !date || !time || !guests) {
                alert('Please fill in all required fields');
                return;
            }
            
            // Format date nicely
            const formattedDate = new Date(date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            
            // Create the WhatsApp message with only needed details
            const message = `Hello! I'd like to book a table at ${CONFIG.restaurant.name}:

*Name:* ${nameField}
*Phone:* ${phone}
*Date:* ${formattedDate}
*Time:* ${time}
*Guests:* ${guests} people
*Special Requests:* ${requests}

Please confirm my reservation.`;
            
            // Encode the message for URL
            const encodedMessage = encodeURIComponent(message);
            
            // Open WhatsApp with the message
            window.open(`https://wa.me/${CONFIG.contact.phoneRaw}?text=${encodedMessage}`, '_blank');
            
            // Show confirmation
            alert('Redirecting to WhatsApp for booking confirmation!');
        });
    }
    
    // ===== FOOTER =====
    const footerGrid = document.getElementById('footerGrid');
    if (footerGrid) {
        let logoHtml = '';
        if (nameParts.length >= 2) {
            const firstTwo = nameParts.slice(0, 2).join(' ');
            const rest = nameParts.slice(2).join(' ');
            if (rest) {
                logoHtml = `<div class="footer-logo"><span>${firstTwo}</span><span class="footer-logo-rest"> ${rest}</span></div>`;
            } else {
                logoHtml = `<div class="footer-logo"><span>${firstTwo}</span></div>`;
            }
        } else {
            logoHtml = `<div class="footer-logo">${name}</div>`;
        }
        
        footerGrid.innerHTML = `
            <div class="footer-col">
                ${logoHtml}
                <p class="footer-desc">${CONFIG.restaurant.description}</p>
                <div class="footer-social">
                    <a href="${CONFIG.social.instagram}"><i class="fab fa-instagram"></i></a>
                    <a href="${CONFIG.social.facebook}"><i class="fab fa-facebook"></i></a>
                    <a href="${CONFIG.social.twitter}"><i class="fab fa-twitter"></i></a>
                    <a href="${CONFIG.social.youtube}"><i class="fab fa-youtube"></i></a>
                </div>
            </div>
            <div class="footer-col">
                <h4 class="footer-title">Quick Links</h4>
                <div class="footer-links">
                    <a href="index.html">Home</a>
                    <a href="index.html#dishes">Dishes</a>
                    <a href="index.html#loyalty">Membership</a>
                    <a href="index.html#gallery">Gallery</a>
                    <a href="index.html#contact">Contact</a>
                </div>
            </div>
            <div class="footer-col">
                <h4 class="footer-title">Contact</h4>
                <div class="footer-links">
                    <a href="tel:${CONFIG.contact.phoneRaw}">${CONFIG.contact.phone}</a>
                    <a href="mailto:${CONFIG.contact.email}">${CONFIG.contact.email}</a>
                    <a href="#">${CONFIG.contact.address.split(',')[0]}</a>
                </div>
            </div>
        `;
    }
    
    const copyright = document.getElementById('copyright');
    if (copyright) {
        copyright.innerHTML = `&copy; ${new Date().getFullYear()} ${name}. All rights reserved. | Designed with ❤️ in India`;
    }
    
    // Initialize AOS
    AOS.init({
        duration: 600,
        once: true,
        offset: 30,
        disable: 'mobile'
    });
    
    // Set minimum date for date input
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
    
    // Time validation
    const timeInput = document.getElementById('time');
    if (timeInput) {
        timeInput.addEventListener('change', function() {
            const time = this.value;
            const hour = parseInt(time.split(':')[0]);
            if (hour < 11 || hour > 23) {
                alert('Please select a time between Opening Hours');
                this.value = '';
            }
        });
    }
    
    // Phone formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 10) value = value.slice(0, 10);
            if (value.length > 5) {
                value = value.slice(0, 5) + ' ' + value.slice(5);
            }
            e.target.value = value;
        });
    }
    
    // Set active nav link
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });
    
    console.log('Booking page loaded successfully!');
});

function generateTables() {
    const tablesGrid = document.getElementById('tablesGrid');
    if (!tablesGrid || !CONFIG.tables) return;
    
    // Display tables WITHOUT the "SELECT THIS TABLE" button
    tablesGrid.innerHTML = CONFIG.tables.map((table, i) => `
        <div class="table-card" data-aos="fade-up" data-aos-delay="${i * 50}">
            <img src="${table.image}" alt="${table.name}" class="table-image" loading="lazy">
            ${table.badge ? `<span class="table-badge">${table.badge}</span>` : ''}
            <div class="table-info">
                <h3 class="table-title">${table.name}</h3>
                <p class="table-capacity"><i class="fas fa-users"></i> ${table.capacity}</p>
                <p class="table-desc">${table.description}</p>
                <div class="table-features">
                    ${table.features.map(f => `<span><i class="fas fa-${f.toLowerCase().replace(/ /g, '-')}"></i> ${f}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

function generateHours() {
    const hoursGrid = document.getElementById('hoursGrid');
    if (!hoursGrid) return;
    
    hoursGrid.innerHTML = `
        <div class="hours-item">
            <div class="hours-day">Monday - Friday</div>
            <div class="hours-time">${CONFIG.hours.weekdays}</div>
        </div>
        <div class="hours-item">
            <div class="hours-day">Saturday - Sunday</div>
            <div class="hours-time">${CONFIG.hours.weekends}</div>
        </div>
    `;
}