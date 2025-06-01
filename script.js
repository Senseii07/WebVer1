// Cross-browser optimized initialization
(function() {
    // Function to run when DOM is ready
    function ready(callback) {
        // Check if document is already loaded
        if (document.readyState !== 'loading') {
            setTimeout(callback, 0);
        } else if (document.addEventListener) {
            // Modern browsers
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            // IE <= 8
            document.attachEvent('onreadystatechange', function() {
                if (document.readyState === 'complete') {
                    callback();
                }
            });
        }
    }
    
    // Main initialization function
    function initialize() {
        if (window.console && window.console.log) {
            console.log('DOM ready, initializing components...');
        }
        
        // Detect browser capabilities
        var supportsRequestAnimationFrame = window.requestAnimationFrame || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame || 
            window.msRequestAnimationFrame;
            
        // Store browser capabilities globally
        window.browserCapabilities = {
            requestAnimationFrame: supportsRequestAnimationFrame,
            supportsCanvas: !!document.createElement('canvas').getContext,
            supportsClassList: !!document.documentElement.classList,
            isIE: /MSIE|Trident/.test(window.navigator.userAgent),
            isSafari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
            isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
        };
        
        // Single initialization with proper error handling
        try {
            initTerminal();
            
            // Only initialize other components if their functions exist
            if (typeof initSkillBars === 'function') initSkillBars();
            if (typeof initStatsCounters === 'function') initStatsCounters();
            if (typeof initGlitchText === 'function') initGlitchText();
            if (typeof initBinaryRain === 'function') initBinaryRain();
            if (typeof initParticles === 'function') initParticles();
        } catch (error) {
            if (window.console && window.console.error) {
                console.error('Initialization error:', error);
            }
            
            // Fallback static content if animations fail
            var terminalContent = document.querySelector('.terminal-content');
            if (terminalContent) {
                terminalContent.innerHTML = 
                    '<div class="command-line"><span class="prompt">> </span><span class="line-content">whoami</span></div>' +
                    '<div class="response-line"><span class="line-content">Cyberpunk Developer & Digital Architect</span></div>' +
                    '<div class="command-line"><span class="prompt">> </span><span class="line-content">skills --list</span></div>' +
                    '<div class="response-line"><span class="line-content">Frontend Development<br>UI/UX Design<br>Creative Coding<br>Interactive Experiences</span></div>' +
                    '<div class="command-line"><span class="prompt">> </span><span class="cursor"></span></div>';
            }
        }
    }
    
    // Run initialization when DOM is ready
    ready(initialize);
})();
function initTerminal() {
    // Safe console logging
    if (window.console && window.console.log) {
        console.log('Initializing terminal...');
    }
    
    // Get terminal content with fallback methods
    var terminalContent = document.querySelector('.terminal-content');
    if (!terminalContent) {
        // Try alternative selector methods for older browsers
        if (document.getElementsByClassName) {
            var elements = document.getElementsByClassName('terminal-content');
            if (elements && elements.length > 0) {
                terminalContent = elements[0];
            }
        }
        
        // If still not found, try by ID as last resort
        if (!terminalContent && document.getElementById('terminal-content')) {
            terminalContent = document.getElementById('terminal-content');
        }
        
        // Exit if terminal element still not found
        if (!terminalContent) {
            if (window.console && window.console.error) {
                console.error('Terminal content element not found');
            }
            return;
        }
    }
    
    // Clear terminal - cross-browser compatible way
    while (terminalContent.firstChild) {
        terminalContent.removeChild(terminalContent.firstChild);
    }
    
    // Define commands
    var commands = [
        { cmd: 'whoami', response: 'Cyberpunk Developer & Digital Architect' },
        { cmd: 'skills --list', response: 'Frontend Development\nUI/UX Design\nCreative Coding\nInteractive Experiences' },
        { cmd: 'projects --featured', response: 'Neural Interface (2024)\nCyber Security System (2023)\nVR Experience (2022)' },
        { cmd: 'contact --info', response: 'Email: aayushthapamaga07@gmail.com\nLocation: Kathmandu' }
    ];
    
    // Start typing animation with browser capability check
    try {
        typeCommands(terminalContent, commands);
    } catch (e) {
        // Fallback for browsers where animation fails
        displayStaticTerminal(terminalContent, commands);
    }
}

/**
 * Display terminal commands and responses without animation (static fallback)
 * @param {HTMLElement} terminal - The terminal container element
 * @param {Array} commands - Array of command objects with cmd and response properties
 */
function displayStaticTerminal(terminal, commands) {
    if (!terminal || !commands || !commands.length) return;
    
    try {
        // Create a document fragment for better performance
        var fragment = document.createDocumentFragment();
        
        // Add each command and response
        for (var i = 0; i < commands.length; i++) {
            var cmd = commands[i];
            
            // Command line
            var cmdLine = document.createElement('div');
            cmdLine.className = 'command-line';
            
            var prompt = document.createElement('span');
            prompt.className = 'prompt';
            prompt.appendChild(document.createTextNode('> '));
            cmdLine.appendChild(prompt);
            
            var cmdContent = document.createElement('span');
            cmdContent.className = 'line-content';
            cmdContent.appendChild(document.createTextNode(cmd.cmd));
            cmdLine.appendChild(cmdContent);
            
            fragment.appendChild(cmdLine);
            
            // Response line
            var responseLine = document.createElement('div');
            responseLine.className = 'response-line';
            
            var responseContent = document.createElement('span');
            responseContent.className = 'line-content';
            
            // Handle newlines in response
            var responseLines = cmd.response.split('\n');
            for (var j = 0; j < responseLines.length; j++) {
                responseContent.appendChild(document.createTextNode(responseLines[j]));
                
                // Add line breaks between lines but not after the last line
                if (j < responseLines.length - 1) {
                    responseContent.appendChild(document.createElement('br'));
                }
            }
            
            responseLine.appendChild(responseContent);
            fragment.appendChild(responseLine);
        }
        
        // Add final cursor line
        var finalLine = document.createElement('div');
        finalLine.className = 'command-line';
        
        var finalPrompt = document.createElement('span');
        finalPrompt.className = 'prompt';
        finalPrompt.appendChild(document.createTextNode('> '));
        finalLine.appendChild(finalPrompt);
        
        var cursor = document.createElement('span');
        cursor.className = 'cursor';
        finalLine.appendChild(cursor);
        
        fragment.appendChild(finalLine);
        
        // Append all elements to terminal
        terminal.appendChild(fragment);
        
        // Scroll to bottom
        if (typeof terminal.scrollTop !== 'undefined') {
            terminal.scrollTop = terminal.scrollHeight;
        }
    } catch (error) {
        if (window.console && window.console.error) {
            console.error('Error displaying static terminal:', error);
        }
    }
}

/**
 * Type commands and responses with animation
 * @param {HTMLElement} terminal - The terminal container element
 * @param {Array} commands - Array of command objects
 * @param {Number} index - Current command index
 */
function typeCommands(terminal, commands, index) {
    // Default parameter for older browsers
    index = typeof index !== 'undefined' ? index : 0;
    
    if (!terminal || !commands) return;
    
    if (index >= commands.length) {
        // Add final cursor
        try {
            var finalLine = document.createElement('div');
            finalLine.className = 'command-line';
            
            var finalPrompt = document.createElement('span');
            finalPrompt.className = 'prompt';
            finalPrompt.appendChild(document.createTextNode('> '));
            finalLine.appendChild(finalPrompt);
            
            var cursor = document.createElement('span');
            cursor.className = 'cursor';
            finalLine.appendChild(cursor);
            
            terminal.appendChild(finalLine);
        } catch (e) {
            if (window.console && window.console.error) {
                console.error('Error adding final cursor:', e);
            }
        }
        return;
    }
    
    var cmd = commands[index];
    
    try {
        // Type command
        var cmdLine = document.createElement('div');
        cmdLine.className = 'command-line';
        
        var prompt = document.createElement('span');
        prompt.className = 'prompt';
        prompt.appendChild(document.createTextNode('> '));
        cmdLine.appendChild(prompt);
        
        var cmdContent = document.createElement('span');
        cmdContent.className = 'line-content';
        cmdLine.appendChild(cmdContent);
        
        terminal.appendChild(cmdLine);
        
        // Use a safer callback approach for older browsers
        typeText(cmdContent, cmd.cmd, function() {
            // After command is typed, type response
            safeSetTimeout(function() {
                try {
                    var responseLine = document.createElement('div');
                    responseLine.className = 'response-line';
                    
                    var responseContent = document.createElement('span');
                    responseContent.className = 'line-content';
                    responseLine.appendChild(responseContent);
                    
                    terminal.appendChild(responseLine);
                    
                    typeText(responseContent, cmd.response, function() {
                        // After response is typed, proceed to next command
                        safeSetTimeout(function() {
                            typeCommands(terminal, commands, index + 1);
                        }, 800);
                    });
                } catch (e) {
                    if (window.console && window.console.error) {
                        console.error('Error typing response:', e);
                    }
                    // Try to continue with next command
                    typeCommands(terminal, commands, index + 1);
                }
            }, 500);
        });
        
        // Scroll to bottom - cross-browser compatible
        if (typeof terminal.scrollTop !== 'undefined') {
            terminal.scrollTop = terminal.scrollHeight;
        }
    } catch (e) {
        if (window.console && window.console.error) {
            console.error('Error in typeCommands:', e);
        }
        // Try to continue with next command
        safeSetTimeout(function() {
            typeCommands(terminal, commands, index + 1);
        }, 500);
    }
}

/**
 * Type text with animation character by character
 * @param {HTMLElement} element - Element to append text to
 * @param {String} text - Text to type
 * @param {Function} callback - Function to call when typing is complete
 */
function typeText(element, text, callback) {
    if (!element || typeof text !== 'string') {
        if (callback) callback();
        return;
    }
    
    var i = 0;
    var lines = text.split('\n');
    var currentLine = 0;
    var typingTimer;
    
    function type() {
        try {
            if (currentLine < lines.length) {
                var line = lines[currentLine];
                
                if (i < line.length) {
                    // Safely append text character by character
                    var textNode = element.lastChild;
                    if (!textNode || textNode.nodeType !== 3) { // Not a text node
                        textNode = document.createTextNode('');
                        element.appendChild(textNode);
                    }
                    
                    textNode.nodeValue += line.charAt(i);
                    i++;
                    typingTimer = safeSetTimeout(type, 30);
                } else {
                    if (currentLine < lines.length - 1) {
                        // Add line break for multiline text
                        var br = document.createElement('br');
                        element.appendChild(br);
                        element.appendChild(document.createTextNode(''));
                        currentLine++;
                        i = 0;
                        typingTimer = safeSetTimeout(type, 30);
                    } else {
                        if (callback) callback();
                    }
                }
            }
        } catch (e) {
            if (window.console && window.console.error) {
                console.error('Error in typeText:', e);
            }
            // Complete immediately if error occurs
            clearTimeout(typingTimer);
            if (callback) callback();
        }
    }
    
    // Start typing
    type();
}

/**
 * Cross-browser compatible setTimeout
 * @param {Function} callback - Function to call
 * @param {Number} delay - Delay in milliseconds
 * @returns {Number} Timeout ID
 */
function safeSetTimeout(callback, delay) {
    if (typeof callback !== 'function') return;
    
    delay = delay || 0;
    
    try {
        return setTimeout(callback, delay);
    } catch (e) {
        // Fallback for very old browsers
        callback();
        return 0;
    }
}

/**
 * Initialize binary rain animation with cross-browser compatibility
 */
function initBinaryRain() {
    if (window.console && window.console.log) {
        console.log('Initializing binary rain...');
    }
    
    // Get the canvas element
    var canvas = document.getElementById('binary-rain');
    if (!canvas) {
        if (window.console && window.console.error) {
            console.error('Binary rain canvas not found');
        }
        return;
    }
    
    // Check if canvas is supported
    var supportsCanvas = !!(canvas.getContext && canvas.getContext('2d'));
    if (!supportsCanvas) {
        if (window.console && window.console.warn) {
            console.warn('Canvas not supported in this browser, using fallback');
        }
        createFallbackBinaryRain(canvas);
        return;
    }
    
    try {
        var ctx = canvas.getContext('2d');
        if (!ctx) {
            if (window.console && window.console.error) {
                console.error('Could not get 2D context from canvas');
            }
            return;
        }
        
        // Set canvas dimensions to match parent container
        function updateCanvasSize() {
            try {
                var parent = canvas.parentElement;
                if (parent) {
                    canvas.width = parent.offsetWidth || window.innerWidth;
                    canvas.height = parent.offsetHeight || window.innerHeight;
                } else {
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                }
            } catch (e) {
                // Fallback dimensions if there's an error
                canvas.width = window.innerWidth || document.documentElement.clientWidth || 800;
                canvas.height = window.innerHeight || document.documentElement.clientHeight || 600;
            }
        }
        
        updateCanvasSize();
        
        // Add resize listener with debounce for performance
        var resizeTimer;
        function handleResize() {
            clearTimeout(resizeTimer);
            resizeTimer = safeSetTimeout(function() {
                updateCanvasSize();
                initDrops(); // Reinitialize drops when resized
            }, 250);
        }
        
        // Cross-browser event listener
        if (window.addEventListener) {
            window.addEventListener('resize', handleResize, false);
        } else if (window.attachEvent) {
            window.attachEvent('onresize', handleResize);
        }
        
        // Binary characters
        var binaryChars = '01';
        
        // Set up the drops
        var fontSize = 16; // Increased font size
        var columns = Math.floor(canvas.width / (fontSize * 1.5)); // Reduced density
        var drops = [];
        var frameCount = 0;
        var frameDelay = 3; // Only update every 3 frames
        
        // Initialize drops at random positions
        function initDrops() {
            columns = Math.floor(canvas.width / (fontSize * 1.5));
            drops = [];
            for (var i = 0; i < columns; i++) {
                drops[i] = Math.floor(Math.random() * canvas.height / fontSize);
            }
        }
        
        initDrops();
        
        // Drawing function
        function draw() {
            if (!ctx) return;
            
            // Semi-transparent black background for fade effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Set text color and font - with fallbacks
            ctx.fillStyle = '#00ff9d';
            ctx.font = fontSize + 'px monospace, Courier, "Courier New"';
            
            // Only update positions on certain frames to slow down the animation
            frameCount++;
            if (frameCount % frameDelay === 0) {
                // Draw each character
                for (var i = 0; i < drops.length; i++) {
                    // Random binary character
                    var text = binaryChars.charAt(Math.floor(Math.random() * binaryChars.length));
                    
                    // Draw the character
                    ctx.fillText(text, i * (fontSize * 1.5), drops[i] * fontSize);
                    
                    // Move the drop down with varied speeds
                    if (Math.random() > 0.3) {
                        drops[i]++;
                    }
                    
                    // Random reset to top when drop reaches bottom
                    if (drops[i] * fontSize > canvas.height && Math.random() > 0.99) {
                        drops[i] = 0;
                    }
                }
            } else {
                // Just redraw existing characters without moving them
                for (var i = 0; i < drops.length; i++) {
                    var text = binaryChars.charAt(Math.floor(Math.random() * binaryChars.length));
                    ctx.fillText(text, i * (fontSize * 1.5), drops[i] * fontSize);
                }
            }
            
            // Continue animation loop with browser-specific requestAnimationFrame
            if (window.browserCapabilities && window.browserCapabilities.requestAnimationFrame) {
                var requestAnimFrame = window.requestAnimationFrame || 
                                      window.webkitRequestAnimationFrame || 
                                      window.mozRequestAnimationFrame || 
                                      window.msRequestAnimationFrame;
                requestAnimFrame(draw);
            } else {
                // Fallback for browsers without requestAnimationFrame
                safeSetTimeout(draw, 50);
            }
        }
        
        // Start animation loop
        draw();
        
        if (window.console && window.console.log) {
            console.log('Binary rain initialized successfully');
        }
    } catch (error) {
        if (window.console && window.console.error) {
            console.error('Error initializing binary rain:', error);
        }
        // Try fallback method
        createFallbackBinaryRain(canvas);
    }
}

/**
 * Create a fallback binary rain for browsers that don't support canvas
 * @param {HTMLElement} container - The container element
 */
function createFallbackBinaryRain(container) {
    try {
        // Clear container
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        
        // Create simple div-based binary rain
        var characters = '01';
        var columns = Math.floor((window.innerWidth || document.documentElement.clientWidth) / 20);
        
        for (var i = 0; i < columns; i++) {
            var delay = Math.random() * 5;
            var duration = 5 + Math.random() * 10;
            
            var column = document.createElement('div');
            column.className = 'binary-digit';
            column.style.left = (i / columns * 100) + '%';
            column.style.animationDelay = delay + 's';
            column.style.animationDuration = duration + 's';
            
            // Create random binary string
            var binaryText = '';
            var length = 10 + Math.floor(Math.random() * 20);
            for (var j = 0; j < length; j++) {
                binaryText += characters.charAt(Math.floor(Math.random() * characters.length));
                binaryText += '\n';
            }
            
            // Use textContent for modern browsers, innerText for IE
            if (typeof column.textContent !== 'undefined') {
                column.textContent = binaryText;
            } else {
                column.innerText = binaryText;
            }
            
            container.appendChild(column);
        }
    } catch (e) {
        if (window.console && window.console.error) {
            console.error('Error creating fallback binary rain:', e);
        }
    }
}