// Replace your current initialization code with this:
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded, initializing components...');
    
    // Single initialization with proper error handling
    try {
        initTerminal();
        initSkillBars();
        initStatsCounters();
        initGlitchText();
        initBinaryRain();
        initParticles();
    } catch (error) {
        console.error('Initialization error:', error);
        // Fallback static content if animations fail
        const terminalContent = document.querySelector('.terminal-content');
        if (terminalContent) {
            terminalContent.innerHTML = `
                <div class="command-line"><span class="prompt">> </span><span class="line-content">whoami</span></div>
                <div class="response-line"><span class="line-content">Cyberpunk Developer & Digital Architect</span></div>
                <div class="command-line"><span class="prompt">> </span><span class="line-content">skills --list</span></div>
                <div class="response-line"><span class="line-content">Frontend Development<br>UI/UX Design<br>Creative Coding<br>Interactive Experiences</span></div>
                <div class="command-line"><span class="prompt">> </span><span class="cursor"></span></div>
            `;
        }
    }
});
function initTerminal() {
    console.log('Initializing terminal...');
    const terminalContent = document.querySelector('.terminal-content');
    
    if (!terminalContent) {
        console.error('Terminal content element not found');
        return;
    }
    
    // Clear terminal
    terminalContent.innerHTML = '';
    
    // Define commands
    const commands = [
        { cmd: 'whoami', response: 'Cyberpunk Developer & Digital Architect' },
        { cmd: 'skills --list', response: 'Frontend Development\nUI/UX Design\nCreative Coding\nInteractive Experiences' },
        { cmd: 'projects --featured', response: 'Neural Interface (2024)\nCyber Security System (2023)\nVR Experience (2022)' },
        { cmd: 'contact --info', response: 'Email: cyber@dev.com\nLocation: Neo Tokyo' }
    ];
    
    // Start typing animation
    typeCommands(terminalContent, commands);
}

function typeCommands(terminal, commands, index = 0) {
    if (index >= commands.length) {
        // Add final cursor
        const finalLine = document.createElement('div');
        finalLine.className = 'command-line';
        finalLine.innerHTML = '<span class="prompt">> </span><span class="cursor"></span>';
        terminal.appendChild(finalLine);
        return;
    }
    
    const cmd = commands[index];
    
    // Type command
    const cmdLine = document.createElement('div');
    cmdLine.className = 'command-line';
    cmdLine.innerHTML = '<span class="prompt">> </span><span class="line-content"></span>';
    terminal.appendChild(cmdLine);
    
    typeText(cmdLine.querySelector('.line-content'), cmd.cmd, () => {
        // After command is typed, type response
        setTimeout(() => {
            const responseLine = document.createElement('div');
            responseLine.className = 'response-line';
            responseLine.innerHTML = '<span class="line-content"></span>';
            terminal.appendChild(responseLine);
            
            typeText(responseLine.querySelector('.line-content'), cmd.response, () => {
                // After response is typed, proceed to next command
                setTimeout(() => typeCommands(terminal, commands, index + 1), 800);
            });
        }, 500);
    });
    
    // Scroll to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

function typeText(element, text, callback) {
    let i = 0;
    const lines = text.split('\n');
    let currentLine = 0;
    
    function type() {
        if (currentLine < lines.length) {
            const line = lines[currentLine];
            
            if (i < line.length) {
                element.textContent += line.charAt(i);
                i++;
                setTimeout(type, 30);
            } else {
                if (currentLine < lines.length - 1) {
                    element.innerHTML += '<br>';
                    currentLine++;
                    i = 0;
                    setTimeout(type, 30);
                } else {
                    if (callback) callback();
                }
            }
        }
    }
    
    type();
}