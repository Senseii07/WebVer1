// DOM Elements
// Wait for DOM to be fully loaded before initializing elements
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded, initializing all components...');
    
    // Initialize all components with a longer delay to ensure everything is ready
    // This helps with GitHub Pages and other hosting environments
    setTimeout(() => {
        console.log('Starting component initialization...');
        try {
            initTerminal();
            console.log('Terminal initialized');
            
            initSkillBars();
            console.log('Skill bars initialized');
            
            initStatsCounters();
            console.log('Stats counters initialized');
            
            initGlitchText();
            console.log('Glitch text initialized');
            
            initBinaryRain();
            console.log('Binary rain initialized');
            
            initParticles();
            console.log('Particles initialized');
            
            console.log('All components initialized successfully');
        } catch (error) {
            console.error('Error during initialization:', error);
        }
    }, 500); // Increased delay to ensure DOM is fully ready
});

// Fallback initialization in case DOMContentLoaded already fired
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('Document already loaded, initializing with fallback...');
    setTimeout(() => {
        try {
            initTerminal();
            initSkillBars();
            initStatsCounters();
            initGlitchText();
            initBinaryRain();
            initParticles();
        } catch (error) {
            console.error('Error during fallback initialization:', error);
        }
    }, 1000);
}

const themeToggle = document.querySelector('.theme-toggle');
const html = document.documentElement;
const themeIcon = themeToggle?.querySelector('i');
const navLinks = document.querySelectorAll('.nav-links a');
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const scrollProgress = document.querySelector('.scroll-progress');
const contactForm = document.getElementById('contact-form');
const submitBtn = contactForm?.querySelector('.submit-btn');
const sections = document.querySelectorAll('section');
const navbar = document.querySelector('.navbar');
const glitchTexts = document.querySelectorAll('.glitch-text');
const cyberTexts = document.querySelectorAll('.cyber-text');

// Binary Rain Effect
function createBinaryRain() {
    const container = document.getElementById('binary-rain');
    if (!container) return;
    
    const characters = '01';
    const columns = Math.floor(window.innerWidth / 20); // Adjust density
    
    for (let i = 0; i < columns; i++) {
        const delay = Math.random() * 5;
        const duration = 5 + Math.random() * 10;
        
        const column = document.createElement('div');
        column.className = 'binary-digit';
        column.style.left = `${(i / columns) * 100}%`;
        column.style.animationDelay = `${delay}s`;
        column.style.animationDuration = `${duration}s`;
        
        // Create random binary string
        let binaryText = '';
        const length = 10 + Math.floor(Math.random() * 20);
        for (let j = 0; j < length; j++) {
            binaryText += characters.charAt(Math.floor(Math.random() * characters.length));
            binaryText += '\n';
        }
        
        column.textContent = binaryText;
        container.appendChild(column);
    }
}

// Animate Statistics
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    if (!stats.length) return;
    
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCount = () => {
            current += step;
            if (current < target) {
                stat.textContent = Math.ceil(current);
                requestAnimationFrame(updateCount);
            } else {
                stat.textContent = target;
            }
        };
        
        // Start animation when stat is in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCount();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(stat);
    });
}

// Theme Toggle
// Check for saved theme preference or use preferred color scheme
const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
html.setAttribute('data-theme', savedTheme);

// Update icon based on theme
function updateThemeIcon(theme) {
    themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    createGlitchEffect(themeToggle);
});

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

// Enhanced mobile menu handling
let touchStartX = 0;
let touchEndX = 0;
let menuOpen = false;

// Touch event handlers for mobile menu
burger.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    e.preventDefault();
}, { passive: false });

burger.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    e.preventDefault();
}, { passive: false });

// Close menu when clicking outside
const handleClickOutside = (e) => {
    if (menuOpen && !nav.contains(e.target) && !burger.contains(e.target)) {
        toggleMenu();
    }
};

// Handle menu toggling
function toggleMenu() {
    nav.classList.toggle('active');
    burger.classList.toggle('active');
    menuOpen = !menuOpen;
    
    if (menuOpen) {
        document.body.style.overflow = 'hidden';
        document.addEventListener('click', handleClickOutside);
    } else {
        document.body.style.overflow = '';
        document.removeEventListener('click', handleClickOutside);
    }
    
    // Animate menu items
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach((link, index) => {
        if (menuOpen) {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        } else {
            link.style.animation = '';
        }
    });
}

// Handle swipe gestures
function handleSwipe() {
    const swipeThreshold = 50;
    if (Math.abs(touchEndX - touchStartX) > swipeThreshold) {
        if (touchEndX > touchStartX && !menuOpen) {
            // Swipe right - open menu
            toggleMenu();
        } else if (touchEndX < touchStartX && menuOpen) {
            // Swipe left - close menu
            toggleMenu();
        }
    }
}

// Close menu when clicking on a nav link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (menuOpen) {
            toggleMenu();
        }
    });
});

burger.addEventListener('click', () => {
    toggleMenu();
    createGlitchEffect(burger);
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
    
    // Prevent double submission
    if (submitBtn.disabled) return;
    
    // Hide keyboard on mobile after form submission
    if (document.activeElement) {
        document.activeElement.blur();
    }
    
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
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });

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
    
    // Show notification with proper positioning
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });
    
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

// Initialize particles and binary rain
function initParticles() {
    // Initialize particles
    const particles = document.querySelector('.particles');
    if (particles) {
        // Clear any existing particles
        particles.innerHTML = '';
        
        // Create particles
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random position
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            
            // Random size
            const size = Math.random() * 3 + 1;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Random animation delay
            particle.style.animationDelay = `${Math.random() * 5}s`;
            
            particles.appendChild(particle);
        }
    }
    
    // Initialize binary rain
    initBinaryRain();
}

// Create binary rain effect
function initBinaryRain() {
    const binaryRain = document.getElementById('binary-rain');
    if (!binaryRain) return;
    
    // Clear any existing content
    binaryRain.innerHTML = '';
    
    const canvas = document.createElement('canvas');
    binaryRain.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = binaryRain.offsetWidth;
        canvas.height = binaryRain.offsetHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Binary characters
    const binaryChars = '01';
    
    // Column settings
    const fontSize = 12;
    const columns = Math.floor(canvas.width / fontSize);
    
    // Array to track the y position of each column
    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100;
    }
    
    // Draw the binary rain
    function draw() {
        // Semi-transparent black to create fade effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Set text color and font
        ctx.fillStyle = '#00ff9d';
        ctx.font = `${fontSize}px monospace`;
        
        // Draw each character
        for (let i = 0; i < drops.length; i++) {
            // Random binary character
            const text = binaryChars.charAt(Math.floor(Math.random() * binaryChars.length));
            
            // Draw the character
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            // Move the drop down
            drops[i]++;
            
            // Random reset to top when drop reaches bottom
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
        }
    }
    
    // Animation loop
    setInterval(draw, 50);
}

// Particle Effect for legacy support
function initLegacyParticles() {
    const container = document.getElementById('particles-js');
    if (!container) return;
    
    // Initialize particles.js if available
    if (typeof particlesJS === 'function') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: '#00ff9d' },
                shape: { type: 'circle' },
                opacity: { value: 0.5, random: true },
                size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: '#00ff9d', opacity: 0.4, width: 1 },
                move: { enable: true, speed: 2, direction: 'none', random: true, out_mode: 'out' }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'grab' },
                    onclick: { enable: true, mode: 'push' },
                    resize: true
                }
            },
            retina_detect: true
        });
    }
}

// Initialize particles effect for the background
function initParticles() {
    const particlesContainer = document.getElementById('particles-js');
    if (!particlesContainer) return;
    
    // Check if particlesJS is available
    if (typeof particlesJS !== 'function') {
        console.warn('particlesJS not loaded');
        return;
    }
    
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: '#00ff9d' },
            shape: { type: 'circle' },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: '#00ff9d', opacity: 0.4, width: 1 },
            move: { enable: true, speed: 2, direction: 'none', random: true, out_mode: 'out' }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: { enable: true, mode: 'grab' },
                onclick: { enable: true, mode: 'push' },
                resize: true
            },
            modes: {
                grab: { distance: 140, line_linked: { opacity: 1 } },
                push: { particles_nb: 4 }
            }
        },
        retina_detect: true
    });
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation toggle
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    
    if (burger) {
        burger.addEventListener('click', toggleMenu);
    }
    
    // Initialize particles effect
    initParticles();
    
    // Initialize binary rain animation
    initBinaryRain();
    
    // Initialize terminal typing effect
    initTerminal();
    
    // Initialize stats counters
    initStatsCounters();
    
    // Initialize skill progress bars
    initSkillBars();
    
    // Add glitch text data attributes
    initGlitchText();
    
    // Initialize other components
    if (typeof initializeMobileMenu === 'function') initializeMobileMenu();
    if (typeof initializeSmoothScroll === 'function') initializeSmoothScroll();
    if (typeof initializeFormSubmission === 'function') initializeFormSubmission();
    if (typeof initializeAnimations === 'function') initializeAnimations();
});

// Initialize binary rain animation in the background
function initBinaryRain() {
    console.log('Initializing binary rain...');
    const canvas = document.getElementById('binary-rain');
    if (!canvas) {
        console.error('Binary rain canvas not found');
        return;
    }
    
    // Make sure we're working with a canvas element
    if (!(canvas instanceof HTMLCanvasElement)) {
        console.error('Binary rain element is not a canvas');
        return;
    }
    
    try {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Could not get 2D context from canvas');
            return;
        }
        
        // Set canvas dimensions to match parent container
        const updateCanvasSize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.offsetWidth;
                canvas.height = parent.offsetHeight;
            } else {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        };
        
        updateCanvasSize();
        
        // Binary characters
        const binaryChars = '01';
        
        // Set up the drops - increased font size and reduced density
        const fontSize = 16; // Increased font size
        let columns = Math.floor(canvas.width / (fontSize * 1.5)); // Reduced density by increasing spacing
        let drops = [];
        let frameCount = 0; // Counter for frames to slow down animation
        let frameDelay = 3; // Only update every 3 frames
        
        // Initialize drops at random positions
        const initDrops = () => {
            columns = Math.floor(canvas.width / (fontSize * 1.5)); // Maintain reduced density on resize
            drops = [];
            for (let i = 0; i < columns; i++) {
                drops[i] = Math.floor(Math.random() * canvas.height / fontSize);
            }
        };
        
        initDrops();
        
        // Drawing function
        function draw() {
            if (!ctx) return;
            
            // Semi-transparent black background to create fade effect - increased opacity for slower trail
            ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'; // Increased opacity for slower trail effect
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Set text color and font
            ctx.fillStyle = '#00ff9d';
            ctx.font = `${fontSize}px monospace`;
            
            // Only update positions on certain frames to slow down the animation
            frameCount++;
            if (frameCount % frameDelay === 0) { // Only update every few frames
                // Draw each character
                for (let i = 0; i < drops.length; i++) {
                    // Random binary character
                    const text = binaryChars.charAt(Math.floor(Math.random() * binaryChars.length));
                    
                    // Draw the character
                    ctx.fillText(text, i * (fontSize * 1.5), drops[i] * fontSize);
                    
                    // Move the drop down - slower movement
                    // Only move some drops each frame for varied speeds
                    if (Math.random() > 0.3) { // 70% chance to move each drop
                        drops[i]++;
                    }
                    
                    // Random reset to top when drop reaches bottom
                    if (drops[i] * fontSize > canvas.height && Math.random() > 0.99) { // Reduced chance of resetting
                        drops[i] = 0;
                    }
                }
            } else {
                // Just redraw existing characters without moving them on other frames
                for (let i = 0; i < drops.length; i++) {
                    const text = binaryChars.charAt(Math.floor(Math.random() * binaryChars.length));
                    ctx.fillText(text, i * (fontSize * 1.5), drops[i] * fontSize);
                }
            }
            
            // Continue animation loop
            requestAnimationFrame(draw);
        }
        
        // Start animation loop using requestAnimationFrame instead of setInterval
        requestAnimationFrame(draw);
        
        // Resize handler
        window.addEventListener('resize', () => {
            updateCanvasSize();
            initDrops();
        });
        
        console.log('Binary rain initialized successfully');
    } catch (error) {
        console.error('Error initializing binary rain:', error);
    }
}

// Initialize glitch text effect on headings
function initGlitchText() {
    const glitchElements = document.querySelectorAll('.section-title, .hero-title');
    
    if (!glitchElements.length) return;
    
    glitchElements.forEach(element => {
        const text = element.textContent;
        element.setAttribute('data-text', text);
        element.classList.add('glitch');
    });
}

// Terminal typing effect with interactive commands
function initTerminal() {
    console.log('Initializing terminal...');
    
    // Ensure the terminal content element exists
    let terminalContent = document.querySelector('.terminal-content');
    let attempts = 0;
    const maxAttempts = 5;
    
    // If terminal content is not found, try again a few times with increasing delays
    function findTerminalWithRetry() {
        if (terminalContent) {
            console.log('Terminal content found, proceeding with initialization');
            setupTerminal(terminalContent);
            return;
        }
        
        attempts++;
        if (attempts <= maxAttempts) {
            console.log(`Terminal content not found, retrying (${attempts}/${maxAttempts})...`);
            setTimeout(() => {
                terminalContent = document.querySelector('.terminal-content');
                findTerminalWithRetry();
            }, attempts * 200); // Increasing delay with each attempt
        } else {
            console.error('Terminal content element not found after multiple attempts');
        }
    }
    
    // Start the retry process
    findTerminalWithRetry();
    
    // Main terminal setup function
    function setupTerminal(terminalContent) {
        try {
            // Clear terminal initially
            terminalContent.innerHTML = '';
            
            // Define terminal commands and responses
            const commands = [
                { 
                    cmd: 'whoami', 
                    response: 'Cyberpunk Developer & Digital Architect'
                },
                { 
                    cmd: 'skills --list', 
                    response: 'Frontend Development\nUI/UX Design\nCreative Coding\nInteractive Experiences'
                },
                { 
                    cmd: 'projects --featured', 
                    response: 'Neural Interface (2024)\nCyber Security System (2023)\nVR Experience (2022)'
                },
                {
                    cmd: 'contact --info',
                    response: 'Email: cyber@dev.com\nLocation: Neo Tokyo'
                }
            ];
            
            // Add initial command line immediately
            const initialLine = document.createElement('div');
            initialLine.className = 'command-line';
            
            const initialPrompt = document.createElement('span');
            initialPrompt.className = 'prompt';
            initialPrompt.textContent = '> ';
            initialLine.appendChild(initialPrompt);
            
            const initialContent = document.createElement('span');
            initialContent.className = 'line-content';
            initialContent.textContent = 'Initializing cyberpunk terminal...';
            initialLine.appendChild(initialContent);
            
            terminalContent.appendChild(initialLine);
            
            // Function to add a new line to the terminal
            function addLine(text, isCommand = false) {
                if (!terminalContent || !document.body.contains(terminalContent)) {
                    console.error('Terminal content no longer in DOM');
                    return null; // Safety check
                }
                
                const line = document.createElement('div');
                line.className = isCommand ? 'command-line' : 'response-line';
                
                if (isCommand) {
                    const prompt = document.createElement('span');
                    prompt.className = 'prompt';
                    prompt.textContent = '> ';
                    line.appendChild(prompt);
                }
                
                const content = document.createElement('span');
                content.className = 'line-content';
                line.appendChild(content);
                
                terminalContent.appendChild(line);
                
                // Simple non-animated text display as fallback
                function setTextDirectly() {
                    const formattedText = text.replace(/\n/g, '<br>');
                    content.innerHTML = formattedText;
                    
                    // For non-command lines, add cursor and proceed to next command
                    if (!isCommand) {
                        const cursor = document.createElement('span');
                        cursor.className = 'cursor';
                        line.appendChild(cursor);
                        setTimeout(nextCommand, 1000);
                    }
                }
                
                // Animate typing effect with error handling
                let i = 0;
                const text_arr = text.split('\n');
                let currentLineIndex = 0;
                let typingFailed = false;
                
                function typeWriter() {
                    try {
                        if (!content || !terminalContent || !document.body.contains(terminalContent)) {
                            console.error('Terminal elements no longer available');
                            typingFailed = true;
                            return; // Safety check
                        }
                        
                        if (currentLineIndex < text_arr.length) {
                            const currentLine = text_arr[currentLineIndex];
                            
                            if (i < currentLine.length) {
                                content.textContent += currentLine.charAt(i);
                                i++;
                                setTimeout(typeWriter, 30); // typing speed
                            } else {
                                // Move to next line if there is one
                                if (currentLineIndex < text_arr.length - 1) {
                                    content.innerHTML += '<br>';
                                    currentLineIndex++;
                                    i = 0;
                                    setTimeout(typeWriter, 30);
                                } else {
                                    // Add blinking cursor at the end
                                    if (!isCommand) {
                                        setTimeout(() => {
                                            try {
                                                if (!line || !document.body.contains(line)) return; // Safety check
                                                
                                                const cursor = document.createElement('span');
                                                cursor.className = 'cursor';
                                                line.appendChild(cursor);
                                                
                                                // Start next command after a delay
                                                setTimeout(nextCommand, 1000);
                                            } catch (err) {
                                                console.error('Error adding cursor:', err);
                                                nextCommand(); // Try to continue anyway
                                            }
                                        }, 500);
                                    }
                                }
                            }
                        }
                    } catch (err) {
                        console.error('Error in typeWriter:', err);
                        typingFailed = true;
                        setTextDirectly(); // Fallback to direct text setting
                    }
                }
                
                // Start typing with a fallback
                try {
                    typeWriter();
                    
                    // If typing fails, use the fallback after a short timeout
                    setTimeout(() => {
                        if (typingFailed) {
                            console.log('Typing animation failed, using fallback');
                            setTextDirectly();
                        }
                    }, 1000);
                    
                } catch (err) {
                    console.error('Error starting typeWriter:', err);
                    setTextDirectly(); // Fallback
                }
                
                // Scroll to bottom of terminal
                try {
                    if (terminalContent) {
                        terminalContent.scrollTop = terminalContent.scrollHeight;
                    }
                } catch (err) {
                    console.error('Error scrolling terminal:', err);
                }
                
                return line;
            }
            
            // Start typing commands sequentially
            let commandIndex = 0;
            
            function nextCommand() {
                try {
                    if (!terminalContent || !document.body.contains(terminalContent)) {
                        console.error('Terminal content no longer in DOM');
                        return; // Safety check
                    }
                    
                    if (commandIndex < commands.length) {
                        const command = commands[commandIndex];
                        
                        // Type the command
                        addLine(command.cmd, true);
                        
                        // Type the response after a delay
                        setTimeout(() => {
                            addLine(command.response);
                            commandIndex++;
                        }, 800);
                    } else {
                        // Add final cursor when all commands are done
                        try {
                            const finalLine = document.createElement('div');
                            finalLine.className = 'command-line';
                            
                            const prompt = document.createElement('span');
                            prompt.className = 'prompt';
                            prompt.textContent = '> ';
                            finalLine.appendChild(prompt);
                            
                            const cursor = document.createElement('span');
                            cursor.className = 'cursor';
                            finalLine.appendChild(cursor);
                            
                            terminalContent.appendChild(finalLine);
                        } catch (err) {
                            console.error('Error adding final cursor:', err);
                        }
                    }
                } catch (err) {
                    console.error('Error in nextCommand:', err);
                }
            }
            
            // Start the first command after a short delay
            setTimeout(() => {
                try {
                    // Clear the initial line
                    if (terminalContent && document.body.contains(terminalContent)) {
                        terminalContent.innerHTML = '';
                        // Start the command sequence
                        nextCommand();
                    }
                } catch (err) {
                    console.error('Error starting command sequence:', err);
                }
            }, 1500);
            
            console.log('Terminal initialized successfully');
        } catch (error) {
            console.error('Error in terminal setup:', error);
            
            // Emergency fallback - just display static content
            try {
                if (terminalContent) {
                    terminalContent.innerHTML = `
                        <div class="command-line"><span class="prompt">> </span><span class="line-content">whoami</span></div>
                        <div class="response-line"><span class="line-content">Cyberpunk Developer & Digital Architect</span></div>
                        <div class="command-line"><span class="prompt">> </span><span class="line-content">skills --list</span></div>
                        <div class="response-line"><span class="line-content">Frontend Development<br>UI/UX Design<br>Creative Coding<br>Interactive Experiences</span></div>
                        <div class="command-line"><span class="prompt">> </span><span class="cursor"></span></div>
                    `;
                }
            } catch (fallbackError) {
                console.error('Even fallback failed:', fallbackError);
            }
        }
    }
}

// Initialize stats counters with animated counting effect
function initStatsCounters() {
    const statValues = document.querySelectorAll('.stat-number');
    
    if (!statValues.length) return;
    console.log('Found stat numbers:', statValues.length);
    
    // Create an intersection observer to detect when stats are in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseInt(target.getAttribute('data-value') || target.innerText, 10);
                
                // Store the final value as a data attribute if not already set
                if (!target.getAttribute('data-value')) {
                    target.setAttribute('data-value', finalValue);
                }
                
                // Reset to zero
                target.innerText = '0';
                
                // Animate the counter
                let currentValue = 0;
                const duration = 2000; // 2 seconds
                const stepTime = Math.abs(Math.floor(duration / finalValue));
                
                const timer = setInterval(() => {
                    currentValue += 1;
                    target.innerText = currentValue;
                    
                    if (currentValue >= finalValue) {
                        clearInterval(timer);
                        target.innerText = finalValue;
                        
                        // Add a class for additional styling
                        target.classList.add('counted');
                    }
                }, stepTime);
                
                // Unobserve after animation starts
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.1 });
    
    // Observe each stat value
    statValues.forEach(stat => {
        observer.observe(stat);
    });
}

// Initialize and animate skill bars
function initSkillBars() {
    const skillSection = document.querySelector('.skills');
    const progressBars = document.querySelectorAll('.progress');
    
    if (!skillSection || !progressBars.length) return;
    
    // Reset all progress bars to 0 width initially
    progressBars.forEach(bar => {
        // Store the original width as a data attribute
        const originalWidth = bar.style.width;
        bar.dataset.width = originalWidth;
        bar.style.width = '0';
    });
    
    // Create an intersection observer to detect when skill section is in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate progress bars when section is in view
                progressBars.forEach((bar, index) => {
                    // Get the target width from the data attribute
                    const targetWidth = bar.dataset.width;
                    
                    // Stagger the animations slightly
                    setTimeout(() => {
                        // Animate to the target width
                        bar.style.width = targetWidth;
                        
                        // Add a glow effect class
                        bar.classList.add('active');
                    }, index * 200);
                });
                
                // Disconnect the observer once animation is triggered
                observer.disconnect();
            }
        });
    }, { threshold: 0.2 }); // Trigger when 20% of the element is visible
    
    // Start observing the skills section
    observer.observe(skillSection);
}

// This function has been replaced by initStatsCounters (note the plural)
// to match the function called in the DOMContentLoaded event handler

// Add passive event listeners for better scroll performance
document.addEventListener('touchstart', () => {}, { passive: true });
document.addEventListener('touchmove', () => {}, { passive: true });

// Handle orientation changes
window.addEventListener('orientationchange', () => {
    // Close menu on orientation change
    if (nav.classList.contains('active')) {
        toggleMenu();
    }
    
    // Reset any fixed positioning
    setTimeout(() => {
        window.scrollTo(0, window.scrollY);
    }, 100);
});

// Optimize scroll performance
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
            scrollTimeout = null;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            scrollProgress.style.width = `${scrolled}%`;

            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Update active navigation
            updateActiveNavigation();
        }, 100);
    }
});

// Handle touch events for project cards
document.querySelectorAll('.project-card').forEach(card => {
    let touchStartY = 0;
    let touchEndY = 0;

    card.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY;
    });

    card.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].screenY;
        if (Math.abs(touchEndY - touchStartY) < 10) {
            // If it's a tap (not a swipe)
            card.classList.add('hover');
            createGlitchEffect(card);
            setTimeout(() => {
                card.classList.remove('hover');
            }, 1000);
        }
    });
}); 