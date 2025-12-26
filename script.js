// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    // Hide loader after animation completes
    const loader = document.getElementById('loader');
    if (loader) {
        // Wait for the loading bar animation to complete (2.5s) + small buffer
        setTimeout(() => {
            loader.classList.add('hidden');
            // Remove loader from DOM after transition completes
            setTimeout(() => {
                loader.remove();
            }, 800);
        }, 2800);
    }

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in-up').forEach(el => {
        observer.observe(el);
    });

    // ============================================
    // MENU CATEGORY FILTER
    // ============================================
    const menuTabs = document.querySelectorAll('.menu-tab');
    const menuItems = document.querySelectorAll('.menu-item');

    menuTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            menuTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');

            const category = tab.dataset.category;

            menuItems.forEach(item => {
                if (category === 'all' || item.dataset.category === category) {
                    item.classList.remove('hidden');
                    item.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const closeMenu = document.querySelector('.close-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-links a');

    function toggleMenu() {
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
    }

    if (mobileToggle) mobileToggle.addEventListener('click', toggleMenu);
    if (closeMenu) closeMenu.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // Parallax Effect for Hero
    window.addEventListener('scroll', () => {
        const hero = document.querySelector('.hero');
        const scrolled = window.pageYOffset;
        if (hero) {
            hero.style.backgroundPositionY = -(scrolled * 0.3) + 'px';
        }
    });

    // Floating Bar Close
    const closeBtn = document.querySelector('.close-btn');
    const floatingBar = document.querySelector('.floating-bar');

    if (closeBtn && floatingBar) {
        closeBtn.addEventListener('click', () => {
            floatingBar.style.display = 'none';
        });
    }

    // Active Link Highlighting
    const sections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') && link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // ============================================
    // RESERVATION FORM - SEND TO WHATSAPP
    // ============================================
    const reservationForm = document.getElementById('reservationForm');

    // Owner's WhatsApp number (with country code, no + or spaces)
    const ownerWhatsAppNumber = '917435905500'; // Owner's WhatsApp number

    if (reservationForm) {
        reservationForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const guests = document.getElementById('guests').value;
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const occasion = document.getElementById('occasion').value.trim();

            // Format date for readability
            const formattedDate = new Date(date).toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // Format time for readability
            const timeOptions = {
                '11:00': '11:00 AM',
                '12:00': '12:00 PM',
                '13:00': '1:00 PM',
                '14:00': '2:00 PM',
                '15:00': '3:00 PM',
                '16:00': '4:00 PM',
                '17:00': '5:00 PM',
                '18:00': '6:00 PM',
                '19:00': '7:00 PM',
                '20:00': '8:00 PM',
                '21:00': '9:00 PM'
            };
            const formattedTime = timeOptions[time] || time;

            // Build the WhatsApp message
            let message = `🍽️ *NEW TABLE RESERVATION*\n`;
            message += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
            message += `👤 *Name:* ${name}\n`;
            message += `📞 *Phone:* ${phone}\n`;
            message += `👥 *Guests:* ${guests}\n`;
            message += `📅 *Date:* ${formattedDate}\n`;
            message += `🕐 *Time:* ${formattedTime}\n`;

            if (occasion) {
                message += `🎉 *Occasion:* ${occasion}\n`;
            }

            message += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
            message += `📍 _Sent from The Grenade Cafe Website_`;

            // Encode the message for URL
            const encodedMessage = encodeURIComponent(message);

            // Create WhatsApp URL
            const whatsappURL = `https://wa.me/${ownerWhatsAppNumber}?text=${encodedMessage}`;

            // Show success feedback
            const submitBtn = reservationForm.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Opening WhatsApp...';
            submitBtn.style.background = 'var(--accent-lime)';

            // Open WhatsApp in new tab
            window.open(whatsappURL, '_blank');

            // Reset button after delay
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                // Reset the form after submission
                reservationForm.reset();
            }, 2000);
        });
    }
});

