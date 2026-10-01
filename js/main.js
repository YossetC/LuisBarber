/**
 * LUIS BARBER - Main JavaScript
 * Funcionalidades: Tema claro/oscuro, menú móvil, navbar scroll, sistema de citas
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // THEME TOGGLE (Dark/Light Mode)
    // ============================================
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        html.classList.add('dark');
    }
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', function() {
        html.classList.toggle('dark');
        
        // Save preference
        const currentTheme = html.classList.contains('dark') ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
        
        // Add animation effect
        themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeToggle.style.transform = 'rotate(0deg)';
        }, 300);
    });
    
    // ============================================
    // MOBILE MENU
    // ============================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
        
        // Animate icon
        const icon = mobileMenuBtn.querySelector('i');
        if (mobileMenu.classList.contains('hidden')) {
            icon.classList.remove('ri-close-line');
            icon.classList.add('ri-menu-line');
        } else {
            icon.classList.remove('ri-menu-line');
            icon.classList.add('ri-close-line');
        }
    });
    
    // Close mobile menu when clicking a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('ri-close-line');
            icon.classList.add('ri-menu-line');
        });
    });
    
    // ============================================
    // NAVBAR SCROLL EFFECT
    // ============================================
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const offset = 80; // Navbar height
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // ============================================
    // BOOKING SYSTEM
    // ============================================
    const services = [
        { id: 1, name: 'Corte clásico', price: 130 },
        { id: 2, name: 'Corte Fade', price: 120 },
        { id: 3, name: 'Corte regular', price: 80 },
        { id: 4, name: 'Barba', price: 80 },
        { id: 5, name: 'Cejas', price: 30 }
    ];
    
    let currentStep = 1;
    let selectedService = null;
    let clientName = '';
    let clientDate = '';
    let clientTime = '';
    
    const serviceOptionsContainer = document.getElementById('service-options');
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');
    const btnContinue = document.getElementById('btn-continue');
    const btnBack = document.getElementById('btn-back');
    const clientNameInput = document.getElementById('client-name');
    const clientDateInput = document.getElementById('client-date');
    const clientTimeInput = document.getElementById('client-time');
    const bookingSummary = document.getElementById('booking-summary');
    
    // Populate service options
    services.forEach(service => {
        const option = document.createElement('div');
        option.className = 'service-option bg-stone-50 dark:bg-dark-700 rounded-xl p-4 flex items-center justify-between';
        option.dataset.serviceId = service.id;
        option.innerHTML = `
            <div>
                <h4 class="font-bold text-stone-900 dark:text-white">${service.name}</h4>
                <p class="text-gold-500 font-medium">$${service.price} MXN</p>
            </div>
            <i class="ri-arrow-right-circle-line text-2xl text-stone-400"></i>
        `;
        option.addEventListener('click', function() {
            // Remove selection from all
            document.querySelectorAll('.service-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            // Add selection to clicked
            this.classList.add('selected');
            selectedService = service;
            btnContinue.disabled = false;
        });
        serviceOptionsContainer.appendChild(option);
    });
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    clientDateInput.min = today;
    
    // Continue button
    btnContinue.addEventListener('click', function() {
        if (currentStep === 1 && selectedService) {
            currentStep = 2;
            step1.classList.add('hidden');
            step2.classList.remove('hidden');
            btnBack.classList.remove('hidden');
            btnContinue.disabled = true;
        } else if (currentStep === 2) {
            clientName = clientNameInput.value.trim();
            clientDate = clientDateInput.value;
            clientTime = clientTimeInput.value;
            
            if (clientName && clientDate && clientTime) {
                currentStep = 3;
                step2.classList.add('hidden');
                step3.classList.remove('hidden');
                btnBack.classList.remove('hidden');
                btnContinue.innerHTML = '<i class="ri-whatsapp-fill"></i><span>Enviar a WhatsApp</span>';
                btnContinue.classList.remove('bg-gold-500', 'hover:bg-gold-600');
                btnContinue.classList.add('bg-green-600', 'hover:bg-green-700');
                
                // Format date for display
                const dateObj = new Date(clientDate + 'T00:00:00');
                const formattedDate = dateObj.toLocaleDateString('es-MX', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });
                
                // Format time for display
                const timeFormatted = formatTime(clientTime);
                
                // Show summary
                bookingSummary.innerHTML = `
                    <p><strong>Servicio:</strong> ${selectedService.name}</p>
                    <p><strong>Precio:</strong> $${selectedService.price} MXN</p>
                    <p><strong>Nombre:</strong> ${clientName}</p>
                    <p><strong>Fecha:</strong> ${formattedDate}</p>
                    <p><strong>Hora:</strong> ${timeFormatted}</p>
                `;
            } else {
                alert('Por favor completa todos los campos');
            }
        } else if (currentStep === 3) {
            // Send to WhatsApp
            sendToWhatsApp();
        }
    });
    
    // Back button
    btnBack.addEventListener('click', function() {
        if (currentStep === 2) {
            currentStep = 1;
            step2.classList.add('hidden');
            step1.classList.remove('hidden');
            btnBack.classList.add('hidden');
            btnContinue.disabled = false;
        } else if (currentStep === 3) {
            currentStep = 2;
            step3.classList.add('hidden');
            step2.classList.remove('hidden');
            btnContinue.innerHTML = '<span>Continuar</span><i class="ri-arrow-right-line"></i>';
            btnContinue.classList.add('bg-gold-500', 'hover:bg-gold-600');
            btnContinue.classList.remove('bg-green-600', 'hover:bg-green-700');
        }
    });
    
    // Enable continue button when all fields are filled
    [clientNameInput, clientDateInput, clientTimeInput].forEach(input => {
        input.addEventListener('input', checkFormValidity);
        input.addEventListener('change', checkFormValidity);
    });
    
    function checkFormValidity() {
        if (currentStep === 2) {
            const allFilled = clientNameInput.value.trim() && clientDateInput.value && clientTimeInput.value;
            btnContinue.disabled = !allFilled;
        }
    }
    
    // Format time to 12-hour format
    function formatTime(time24) {
        const [hours, minutes] = time24.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    }
    
    // Send to WhatsApp
    function sendToWhatsApp() {
        const phoneNumber = '5215669330062';
        
        // Format date
        const dateObj = new Date(clientDate + 'T00:00:00');
        const formattedDate = dateObj.toLocaleDateString('es-MX', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        // Format time
        const timeFormatted = formatTime(clientTime);
        
        // Create message
        const message = `Hola Luis Barber, soy ${clientName} y me gustaría adquirir el servicio de *${selectedService.name}* ($${selectedService.price} MXN) para el día ${formattedDate} a las ${timeFormatted}. ¿Podrían confirmarme la cita?`;
        
        // Encode message for URL
        const encodedMessage = encodeURIComponent(message);
        
        // Open WhatsApp
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(whatsappURL, '_blank');
    }
    
    // ============================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-card, .hover-lift');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // ============================================
    // IMAGE LAZY LOADING
    // ============================================
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.setAttribute('loading', 'lazy');
    });
    
    // ============================================
    // CONSOLE BRANDING
    // ============================================
    console.log(
        '%c LUIS BARBER %c Premium Barbería ',
        'background: #d4a017; color: white; font-size: 16px; padding: 5px 10px; border-radius: 3px 0 0 3px;',
        'background: #1a1a1a; color: #d4a017; font-size: 16px; padding: 5px 10px; border-radius: 0 3px 3px 0;'
    );
    console.log('%c Estilo & Elegancia - Cuernavaca, Morelos ', 'color: #d4a017; font-style: italic;');
    
});
