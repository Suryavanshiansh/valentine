// Get button elements
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const modal = document.getElementById('successModal');
const buttonsContainer = document.querySelector('.buttons-container');

// Track the current size multiplier for the Yes button
let yesSizeMultiplier = 1;
let isMoving = false;

// Detect if device is mobile
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Function to get random position within the viewport
function getRandomPosition() {
    const btnRect = noBtn.getBoundingClientRect();
    
    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Add padding to keep button away from edges
    const padding = 20;
    const buttonWidth = btnRect.width;
    const buttonHeight = btnRect.height;
    
    // Calculate safe boundaries
    const maxX = viewportWidth - buttonWidth - padding;
    const maxY = viewportHeight - buttonHeight - padding;
    
    // Generate random positions within safe boundaries
    const randomX = Math.random() * (maxX - padding) + padding;
    const randomY = Math.random() * (maxY - padding) + padding;
    
    return { 
        x: Math.max(padding, Math.min(randomX, maxX)), 
        y: Math.max(padding, Math.min(randomY, maxY))
    };
}

// Function to get random size
function getRandomSize() {
    // Random size between 0.6x and 1.6x of original for mobile, slightly smaller range
    const minSize = isMobile ? 0.7 : 0.6;
    const maxSize = isMobile ? 1.4 : 1.8;
    const randomSize = Math.random() * (maxSize - minSize) + minSize;
    
    // Random padding
    const randomPadding = isMobile ? Math.floor(Math.random() * 25) + 12 : Math.floor(Math.random() * 40) + 10;
    
    return { scale: randomSize, padding: randomPadding };
}

// Function to move and resize the No button
function moveNoButton(e) {
    // Prevent default touch behavior
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // Prevent rapid consecutive moves
    if (isMoving) return;
    isMoving = true;
    
    const position = getRandomPosition();
    const size = getRandomSize();
    
    // Apply random position
    noBtn.style.position = 'fixed';
    noBtn.style.left = position.x + 'px';
    noBtn.style.top = position.y + 'px';
    
    // Apply random size
    noBtn.style.padding = `${size.padding}px ${size.padding * 2}px`;
    
    // Add a fun rotation effect
    const randomRotation = Math.random() * 20 - 10; // -10 to 10 degrees
    noBtn.style.transform = `scale(${size.scale}) rotate(${randomRotation}deg)`;
    
    // Grow the Yes button each time No is avoided
    yesSizeMultiplier += isMobile ? 0.1 : 0.15;
    yesBtn.style.transform = `scale(${yesSizeMultiplier})`;
    
    // Add a fun message randomly
    const messages = ['No? 😢', 'Nope? 😅', 'Really? 🥺', 'Come on! 💕', 'Please? 🥰', 'Why not? 😊'];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    noBtn.textContent = randomMessage;
    
    // Change button color randomly
    const colors = [
        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
        'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
        'linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)'
    ];
    noBtn.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    // Reset moving flag after animation
    setTimeout(() => {
        isMoving = false;
    }, 200);
}

// For mobile devices - use touchstart instead of mouseenter
if (isMobile) {
    // Prevent click on No button
    noBtn.addEventListener('touchstart', (e) => {
        moveNoButton(e);
    }, { passive: false });
    
    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        moveNoButton(e);
    });
    
    // Add visual feedback for mobile
    noBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
    }, { passive: false });
    
} else {
    // Desktop - use hover and click
    noBtn.addEventListener('mouseenter', moveNoButton);
    
    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        moveNoButton(e);
    });
}

// Event listener for Yes button - works on both mobile and desktop
yesBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    
    // Prevent double-clicking
    yesBtn.disabled = true;
    
    // Create confetti effect
    createConfetti();
    
    // Show success modal after a brief delay
    setTimeout(() => {
        modal.style.display = 'block';
        yesBtn.disabled = false;
    }, 500);
});

// For mobile - also handle touch
yesBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    yesBtn.click();
}, { passive: false });

// Close modal when clicking/touching outside of it
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

window.addEventListener('touchend', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

function closeModal() {
    modal.style.display = 'none';
    // Reset everything
    yesSizeMultiplier = 1;
    yesBtn.style.transform = 'scale(1)';
    noBtn.textContent = 'No';
    noBtn.style.background = 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)';
    
    // Reset No button position
    setTimeout(() => {
        const initialPos = getRandomPosition();
        noBtn.style.left = initialPos.x + 'px';
        noBtn.style.top = initialPos.y + 'px';
    }, 100);
}

// Confetti effect function - optimized for mobile
function createConfetti() {
    const colors = ['#ff6b6b', '#ff85a2', '#ffd93d', '#6bcf7f', '#4d96ff', '#b57edc'];
    const confettiCount = isMobile ? 30 : 50; // Fewer confetti on mobile for better performance
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-10px';
            confetti.style.opacity = '1';
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            
            document.body.appendChild(confetti);
            
            // Animate confetti falling
            let top = -10;
            let left = parseFloat(confetti.style.left);
            const fallSpeed = Math.random() * 3 + 2;
            const sway = Math.random() * 2 - 1;
            
            const fallInterval = setInterval(() => {
                top += fallSpeed;
                left += sway;
                confetti.style.top = top + 'px';
                confetti.style.left = left + 'px';
                confetti.style.opacity = parseFloat(confetti.style.opacity) - 0.01;
                
                if (top > window.innerHeight || parseFloat(confetti.style.opacity) <= 0) {
                    clearInterval(fallInterval);
                    confetti.remove();
                }
            }, 20);
        }, i * 30);
    }
}

// Initialize - set initial random position for No button
window.addEventListener('load', () => {
    // Give the No button an initial position after a short delay
    setTimeout(() => {
        const initialPos = getRandomPosition();
        noBtn.style.position = 'fixed';
        noBtn.style.left = initialPos.x + 'px';
        noBtn.style.top = initialPos.y + 'px';
    }, 100);
});

// Handle orientation change on mobile
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        const newPos = getRandomPosition();
        noBtn.style.left = newPos.x + 'px';
        noBtn.style.top = newPos.y + 'px';
    }, 200);
});

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        const newPos = getRandomPosition();
        noBtn.style.left = newPos.x + 'px';
        noBtn.style.top = newPos.y + 'px';
    }, 250);
});