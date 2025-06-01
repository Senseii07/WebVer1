// DOM Elements
const themeToggle = document.querySelector('.theme-toggle');
const html = document.documentElement;
const themeIcon = themeToggle.querySelector('i');
const navLinks = document.querySelectorAll('.nav-links a');
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const scrollProgress = document.querySelector('.scroll-progress');
const contactForm = document.getElementById('contact-form');
const submitBtn = contactForm.querySelector('.submit-btn');
const sections = document.querySelectorAll('section');
const navbar = document.querySelector('.navbar');
const glitchTexts = document.querySelectorAll('.glitch-text');
const cyberTexts = document.querySelectorAll('.cyber-text');

// Theme Toggle
// Check for saved theme preference
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    createGlitchEffect(themeToggle);
});

function updateThemeIcon(theme) {
    themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Scroll Progress Bar
window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    scrollProgress.style.width = `${scrolled}%`;
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Navigation menu toggle
burger.addEventListener('click', () => {
    // Toggle navigation
    nav.classList.toggle('active');
    
    // Animate links
    navLinks.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });
    
    // Burger animation
    burger.classList.toggle('toggle');
    createGlitchEffect(burger);
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (nav.classList.contains('active')) {
            nav.classList.remove('active');
            burger.classList.remove('toggle');
            navLinks.forEach(link => {
                link.style.animation = '';
            });
        }
    });
});

// Smooth scrolling with offset
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
                top: targetPosition - navHeight,
                behavior: 'smooth'
            });
        }
    });
});

// Form submission with loading state
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };
    
    // Basic form validation
    if (!formData.name || !formData.email || !formData.message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    // Add glitch effect to form
    contactForm.classList.add('glitch');
    
    try {
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success message
        showNotification('Thank you for your message! I will get back to you soon.', 'success');
        
        // Reset form
        contactForm.reset();
    } catch (error) {
        showNotification('There was an error sending your message. Please try again later.', 'error');
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message';
        contactForm.classList.remove('glitch');
    }
});

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <div class="notification-progress"></div>
    `;
    
    document.body.appendChild(notification);
    
    // Add glitch effect
    createGlitchEffect(notification);
    
    // Animate progress bar
    const progress = notification.querySelector('.notification-progress');
    progress.style.width = '100%';
    
    // Remove notification after animation
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.classList.contains('project-card')) {
                entry.target.style.animationDelay = `${entry.target.dataset.delay || 0}s`;
            }
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.querySelectorAll('.about-content, .project-card, .contact-content').forEach((element, index) => {
    if (element.classList.contains('project-card')) {
        element.dataset.delay = index * 0.2;
    }
    observer.observe(element);
});

// Add active class to navigation links based on scroll position
window.addEventListener('scroll', () => {
    let current = '';
    const navHeight = document.querySelector('.navbar').offsetHeight;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navHeight - 50;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Glitch Effect
function createGlitchEffect(element) {
    element.classList.add('glitch');
    setTimeout(() => {
        element.classList.remove('glitch');
    }, 500);
}

// Cyber Text Animation
function animateCyberText() {
    cyberTexts.forEach(text => {
        const originalText = text.textContent;
        let currentIndex = 0;
        
        const interval = setInterval(() => {
            if (currentIndex < originalText.length) {
                text.textContent = originalText.slice(0, currentIndex + 1) + '█';
                currentIndex++;
            } else {
                clearInterval(interval);
                text.textContent = originalText;
            }
        }, 50);
    });
}

// Initialize cyber text animation when elements are in view
const cyberObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('cyber-text')) {
                animateCyberText();
            }
            cyberObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

cyberTexts.forEach(text => cyberObserver.observe(text));

// Random Glitch Effect
function randomGlitch() {
    const elements = document.querySelectorAll('.glitch-text, .section-title, .project-card, .skill-category');
    const randomElement = elements[Math.floor(Math.random() * elements.length)];
    createGlitchEffect(randomElement);
}

// Initialize random glitch effect
setInterval(randomGlitch, 5000);

// Add hover effects to project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.classList.add('hover');
        createGlitchEffect(card);
    });
    
    card.addEventListener('mouseleave', () => {
        card.classList.remove('hover');
    });
});

// Add hover effects to skill bars
document.querySelectorAll('.skill-bar').forEach(bar => {
    bar.addEventListener('mouseenter', () => {
        const progress = bar.querySelector('.progress');
        progress.style.width = progress.style.width;
        createGlitchEffect(bar);
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Add initial glitch effect to hero title
    setTimeout(() => {
        glitchTexts.forEach(text => createGlitchEffect(text));
    }, 1000);
    
    // Add scanline effect
    const scanline = document.querySelector('.scanline');
    setInterval(() => {
        scanline.style.opacity = Math.random() * 0.5;
    }, 100);
}); 