// ==========================================
// TYPEWRITER EFFECT
// ==========================================
const text = "Hi, I'm Isabela!";
const typeSpeed = 100;
const eraseSpeed = 60;
const pauseAfterType  = 1800;
const pauseAfterErase = 400;
const typingText = document.getElementById("typing-text");
let index = 0;
let isErasing = false;

function typeWriter() {
    if (!isErasing) {
        typingText.textContent = text.slice(0, index + 1);
        index++;

        if (index == text.length) {
            isErasing = true;
            setTimeout(typeWriter, pauseAfterType);
            return;
        }

        setTimeout(typeWriter, typeSpeed);
    } else {
        typingText.textContent = text.slice(0, index - 1);
        index--;

        if (index == 0) {
            isErasing = false;
            setTimeout(typeWriter, pauseAfterErase);
            return;
        }

        setTimeout(typeWriter, eraseSpeed);
    }

}

window.addEventListener("load", typeWriter);

// ==========================================
// FLOATING SYMBOLS BACKGROUND
// ==========================================
const canvas = document.createElement('canvas');
canvas.id = 'bg-canvas';
canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;';
const section = document.getElementById('section-me');
section.style.position = 'relative';
section.prepend(canvas);

const ctx = canvas.getContext('2d');
function resizeCanvas() { 
    canvas.width = section.offsetWidth; 
    canvas.height = section.offsetHeight; 
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const SYMBOLS = ['{ }','< />','λ','∑','∇','#','⚙','[ ]','01','if','Py','ML','AI','def','git','∫','π','σ','∂'];
const PRIMARY = '#1e466b';
const SECONDARY = '#67baf4';

const particles = Array.from({ length: 28 }, () => spawnRandom());

function spawnRandom() {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -0.25 - Math.random() * 0.55,
        symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        size: 11 + Math.random() * 9,
        alpha: 0,
        targetAlpha: 0.2 + Math.random() * 0.2,
        life: 0,
        maxLife: 280 + Math.random() * 200,
        color: Math.random() > 0.5 ? PRIMARY : SECONDARY,
        rotation: (Math.random() - 0.5) * 0.4,
        rotSpeed: (Math.random() - 0.5) * 0.003,
    };
}

function resetParticle(p) {
    Object.assign(p, spawnRandom());
    p.y = canvas.height + 20; 
}

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;

        const r = p.life / p.maxLife;
        p.alpha = r < 0.15 ? (r / 0.15) * p.targetAlpha
                : r > 0.75 ? ((1 - r) / 0.25) * p.targetAlpha
                : p.targetAlpha;

        if (p.life >= p.maxLife || p.y < -30) resetParticle(p);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.alpha;
        ctx.font = `${p.size}px 'Outfit', monospace`;
        ctx.fillStyle = p.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.symbol, 0, 0);
        ctx.restore();
    });
    requestAnimationFrame(drawParticles);
}
drawParticles();

// ==========================================
// HAMBURGER MENU
// ==========================================
const hamburger = document.getElementById('nav-hamburger');
const navLinks = document.getElementById('nav-links');
 
hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
});
 
// Fechar menu ao clicar em um link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    });
});

// ==========================================
// MODO ESCURO
// ==========================================
const buttonDarkMode = document.querySelector('.nav-theme-btn');
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
}

buttonDarkMode.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});