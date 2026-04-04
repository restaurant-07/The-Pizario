// ==================================================
// DYNAMIC WEBSITE GENERATOR - Reads from CONFIG
// ==================================================

// Wait for DOM and CONFIG to load
document.addEventListener('DOMContentLoaded', function() {
    if (typeof CONFIG === 'undefined') {
        console.error('CONFIG not loaded! Make sure config.js exists.');
        return;
    }
    
    // ========== GENERATE ALL CONTENT ==========
    generateWebsite();
    
    // ========== INITIALIZE ANIMATIONS ==========
    AOS.init({
        duration: 800,
        once: true,
        offset: 50,
        disable: 'mobile'
    });
    
    // ========== MOBILE MENU ==========
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            const icon = this.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.className = 'fas fa-times';
                document.body.style.overflow = 'hidden';
            } else {
                icon.className = 'fas fa-bars';
                document.body.style.overflow = 'auto';
            }
        });
        
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = 'auto';
            });
        });
        
        document.addEventListener('click', function(e) {
            if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target) && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // ========== NAVBAR SCROLL EFFECT ==========
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
            navbar.style.padding = '0.5rem 0';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            navbar.style.padding = '1rem 0';
        }
    });
    
    // ========== COUNTER ANIMATION ==========
    let animated = false;
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const increment = target / 50;
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(animateCounters, 30);
            } else {
                counter.innerText = target + '+';
            }
        });
    }
    
    const statsSection = document.querySelector('#stats');
    window.addEventListener('scroll', function() {
        if (!animated && statsSection) {
            const statsPosition = statsSection.getBoundingClientRect().top;
            if (statsPosition < window.innerHeight) {
                animateCounters();
                animated = true;
            }
        }
    });
    
    // ========== SMOOTH SCROLL ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // ========== LOYALTY BUTTONS ==========
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-loyalty')) {
            const card = e.target.closest('.loyalty-card');
            const level = card.querySelector('.loyalty-level').textContent;
            const discount = card.querySelector('.loyalty-discount').textContent;
            const message = encodeURIComponent(`Hello! I'm interested in joining the ${level} (${discount}) membership.`);
            window.open(`https://wa.me/${CONFIG.contact.phoneRaw}?text=${message}`, '_blank');
        }
    });
    
    console.log(`${CONFIG.restaurant.name} website loaded successfully!`);
});

// ========== MAIN GENERATOR FUNCTION ==========
function generateWebsite() {
    const name = CONFIG.restaurant.name;
    const nameParts = name.split(' ');
    
    // Page Title
    document.title = `${name} | ${CONFIG.restaurant.tagline}`;
    
    // ===== LOGO - Space between first 2 words =====
    const logoElement = document.getElementById('logo');
    if (logoElement) {
        if (nameParts.length >= 2) {
            // First two words get special styling with space
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
    
    // ===== HERO SECTION - Full name with space =====
    const heroName = document.getElementById('heroName');
    if (heroName) {
        heroName.innerHTML = name;
    }
    
    // Hero Description
    document.getElementById('heroDesc').textContent = CONFIG.restaurant.description;
    document.getElementById('heroSubtitle').textContent = CONFIG.restaurant.welcomeText;
    
    // ===== CLUB NAME - Full name + "Club" =====
    const clubName = document.getElementById('clubName');
    if (clubName) {
        clubName.textContent = `${name} Club`;
    }
    
    // ===== HASHTAG - #FullNameNoSpaces =====
    const hashTag = document.getElementById('hashTag');
    if (hashTag) {
        hashTag.textContent = `#${name.replace(/ /g, '')}`;
    }
    
    // Stats Grid
    const statsGrid = document.getElementById('statsGrid');
    if (statsGrid) {
        statsGrid.innerHTML = `
            <div class="stat-item" data-aos="fade-up">
                <div class="stat-number" data-target="${CONFIG.stats.years}">0</div>
                <div class="stat-label">${CONFIG.stats.yearsLabel}</div>
            </div>
            <div class="stat-item" data-aos="fade-up" data-aos-delay="100">
                <div class="stat-number" data-target="${CONFIG.stats.chefs}">0</div>
                <div class="stat-label">${CONFIG.stats.chefsLabel}</div>
            </div>
            <div class="stat-item" data-aos="fade-up" data-aos-delay="200">
                <div class="stat-number" data-target="${CONFIG.stats.dishes}">0</div>
                <div class="stat-label">${CONFIG.stats.dishesLabel}</div>
            </div>
            <div class="stat-item" data-aos="fade-up" data-aos-delay="300">
                <div class="stat-number" data-target="${CONFIG.stats.customers}">0</div>
                <div class="stat-label">${CONFIG.stats.customersLabel}</div>
            </div>
        `;
    }
    
    // Dishes Grid - NO PRICE
    const dishesGrid = document.getElementById('dishesGrid');
    if (dishesGrid && CONFIG.dishes) {
        dishesGrid.innerHTML = CONFIG.dishes.map((dish, i) => `
            <div class="dish-card" data-aos="fade-up" data-aos-delay="${i * 100}">
                <img src="${dish.image}" alt="${dish.name}" class="dish-image" loading="lazy">
                <div class="dish-info">
                    <h3 class="dish-title">${dish.name}</h3>
                    <p class="dish-desc">${dish.description}</p>
                </div>
            </div>
        `).join('');
    }
    
    // Loyalty Grid
    const loyaltyGrid = document.getElementById('loyaltyGrid');
    if (loyaltyGrid && CONFIG.loyalty) {
        const levels = ['silver', 'gold', 'diamond'];
        loyaltyGrid.innerHTML = levels.map((level, i) => {
            const l = CONFIG.loyalty[level];
            const cardClass = level;
            return `
                <div class="loyalty-card ${cardClass}" data-aos="fade-up" data-aos-delay="${i * 100}">
                    <div class="loyalty-icon"><i class="${l.icon}"></i></div>
                    <div class="loyalty-level">${l.level}</div>
                    <div class="loyalty-discount">${l.discount}</div>
                    <ul class="loyalty-features">
                        ${l.features.map(f => `<li><i class="fas fa-check-circle"></i> ${f}</li>`).join('')}
                    </ul>
                    <button class="btn-loyalty">${l.buttonText}</button>
                </div>
            `;
        }).join('');
    }
    
    // Gallery Grid
    const galleryGrid = document.getElementById('galleryGrid');
    if (galleryGrid && CONFIG.gallery) {
        galleryGrid.innerHTML = CONFIG.gallery.map((img, i) => `
            <div class="gallery-item" data-aos="fade-up" data-aos-delay="${i * 50}">
                <img src="${img}" alt="Gallery ${i+1}" loading="lazy">
            </div>
        `).join('');
    }
    
    // Contact Details
    const contactDesc = document.getElementById('contactDesc');
    if (contactDesc) contactDesc.textContent = CONFIG.restaurant.description;
    
    const contactDetails = document.getElementById('contactDetails');
    if (contactDetails) {
        contactDetails.innerHTML = `
            <div class="contact-item" data-aos="fade-right" data-aos-delay="300">
                <div class="contact-icon"><i class="fas fa-phone-alt"></i></div>
                <div class="contact-text">
                    <h4>Reservations</h4>
                    <p>${CONFIG.contact.phone}</p>
                    <p>${CONFIG.contact.phone2}</p>
                </div>
            </div>
            <div class="contact-item" data-aos="fade-right" data-aos-delay="400">
                <div class="contact-icon"><i class="fas fa-briefcase"></i></div>
                <div class="contact-text">
                    <h4>Business Enquiries</h4>
                    <p>${CONFIG.contact.emailEvents}</p>
                    <p>${CONFIG.contact.emailPartner}</p>
                </div>
            </div>
            <div class="contact-item" data-aos="fade-right" data-aos-delay="500">
                <div class="contact-icon"><i class="fas fa-map-marker-alt"></i></div>
                <div class="contact-text">
                    <h4>Location</h4>
                    <p>${CONFIG.contact.address}</p>
                </div>
            </div>
            <div class="contact-item" data-aos="fade-right" data-aos-delay="600">
                <div class="contact-icon"><i class="fas fa-clock"></i></div>
                <div class="contact-text">
                    <h4>Opening Hours</h4>
                    <p>Mon-Fri: ${CONFIG.hours.weekdays}</p>
                    <p>Sat-Sun: ${CONFIG.hours.weekends}</p>
                </div>
            </div>
        `;
    }
    
    // Map
    const mapContainer = document.getElementById('mapContainer');
    if (mapContainer && CONFIG.mapEmbedUrl) {
        mapContainer.innerHTML = `<iframe src="${CONFIG.mapEmbedUrl}" loading="lazy"></iframe>`;
    }
    
    // WhatsApp Float
    const waFloat = document.getElementById('whatsappFloat');
    if (waFloat) {
        waFloat.href = `https://wa.me/${CONFIG.contact.phoneRaw}?text=Hello!%20I'd%20like%20to%20know%20more%20about%20${encodeURIComponent(name)}`;
    }
    
    const mobileReserve = document.getElementById('mobileReserveBtn');
    if (mobileReserve) {
        mobileReserve.href = `https://wa.me/${CONFIG.contact.phoneRaw}?text=Hello!%20I'd%20like%20to%20book%20a%20table`;
    }
    
    // ===== FOOTER - Space between first 2 words =====
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
                    <a href="#dishes">Dishes</a>
                    <a href="#loyalty">Membership</a>
                    <a href="#gallery">Gallery</a>
                    <a href="#contact">Contact</a>
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
}