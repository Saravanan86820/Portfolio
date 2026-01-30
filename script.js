// ================== GLOBAL VARIABLES ==================
let canvas;
let ctx;
let particles = [];

// ================== DOM READY ==================
document.addEventListener('DOMContentLoaded', () => {
    // Canvas setup
    canvas = document.getElementById('background-canvas');
    if (!canvas) {
        console.error('Canvas not found');
        return;
    }

    ctx = canvas.getContext('2d');
    resizeCanvas();

    initParticles();
    animate();

    // Events
    window.addEventListener('resize', resizeCanvas);
    setupThemeToggle();
    setupMobileMenu();
    setupHeaderScroll();
    setupResumeDownload();
    setupTypingEffect();
    setupRippleEffect();
    setupIntersectionObserver();
    setupFloatingIcons();
    setupProjectHover();
});

// ================== CANVAS ==================
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// ================== PARTICLES ==================
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() - 0.5;
        this.speedY = Math.random() - 0.5;
        this.alpha = Math.random() * 0.5 + 0.1;
        this.color =
            getComputedStyle(document.documentElement)
                .getPropertyValue('--primary-color')
                .trim() || '#2563eb';
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }

    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const count = Math.min(100, (canvas.width * canvas.height) / 10000);
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.strokeStyle =
                    getComputedStyle(document.documentElement)
                        .getPropertyValue('--primary-color')
                        .trim() || '#2563eb';
                ctx.globalAlpha = 0.1 * (1 - distance / 100);
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    connectParticles();
    requestAnimationFrame(animate);
}

// ================== THEME TOGGLE ==================
function setupThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    const icon = toggle.querySelector('i');

    const saved = localStorage.getItem('theme') || 'light';
    if (saved === 'dark') {
        document.body.classList.add('dark-mode');
        icon.classList.replace('fa-moon', 'fa-sun');
    }

    toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const dark = document.body.classList.contains('dark-mode');
        icon.classList.toggle('fa-sun', dark);
        icon.classList.toggle('fa-moon', !dark);
        localStorage.setItem('theme', dark ? 'dark' : 'light');

        particles.forEach(p => {
            p.color = getComputedStyle(document.documentElement)
                .getPropertyValue('--primary-color')
                .trim();
        });
    });
}

// ================== MOBILE MENU ==================
function setupMobileMenu() {
    const toggle = document.getElementById('mobile-toggle');
    const nav = document.querySelector('.nav-links');

    toggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        toggle.innerHTML = nav.classList.contains('active')
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            toggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

// ================== HEADER SCROLL ==================
function setupHeaderScroll() {
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('header-scrolled', window.scrollY > 100);
    });
}

// ================== RESUME DOWNLOAD ==================
function setupResumeDownload() {
    const btn = document.getElementById('download-resume');
    btn.addEventListener('click', () => {
        const blob = new Blob(['Saravanan R - Resume'], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Saravanan_R_Resume.txt';
        a.click();
        URL.revokeObjectURL(url);
    });
}

// ================== TYPING EFFECT ==================
function setupTypingEffect() {
    const el = document.querySelector('.typing-text');
    const text = 'Saravanan R';
    let i = 0;

    function type() {
        el.textContent = text.slice(0, i++);
        if (i <= text.length) setTimeout(type, 120);
    }
    setTimeout(type, 1000);
}

// ================== RIPPLE EFFECT ==================
function setupRippleEffect() {
    document.querySelectorAll('.skill-tag, .tech-tag').forEach(tag => {
        tag.addEventListener('mouseenter', e => {
            const span = document.createElement('span');
            span.className = 'ripple';
            tag.appendChild(span);
            setTimeout(() => span.remove(), 600);
        });
    });
}

// ================== OBSERVER ==================
function setupIntersectionObserver() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => e.isIntersecting && e.target.classList.add('animated'));
    }, { threshold: 0.1 });

    document.querySelectorAll('.skill-card, .timeline-item, .education-card, .contact-item')
        .forEach(el => observer.observe(el));
}

// ================== FLOATING ICONS ==================
function setupFloatingIcons() {
    document.querySelectorAll('.floating-icon')
        .forEach((icon, i) => icon.style.animationDelay = `${i * 3}s`);
}

// ================== PROJECT HOVER ==================
function setupProjectHover() {
    document.querySelectorAll('.project-image').forEach(img => {
        img.addEventListener('mouseenter', () => img.style.transform = 'scale(1.02)');
        img.addEventListener('mouseleave', () => img.style.transform = 'scale(1)');
    });
}
