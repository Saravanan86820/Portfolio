
(() => {
    'use strict';

    /* =======================
       GLOBAL STATE
    ======================= */
    const state = {
        canvas: null,
        ctx: null,
        particles: [],
        particleColor: '#2563eb',
        maxParticles: 100,
        connectDistance: 100
    };

    /* =======================
       INIT
    ======================= */
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        setupCanvas();
        setupTheme();
        setupUI();
        setupEffects();

        initParticles();
        animate();

        window.addEventListener('resize', onResize);
        document.addEventListener('visibilitychange', handleVisibility);
    }

    /* =======================
       CANVAS & PARTICLES
    ======================= */
    function setupCanvas() {
        state.canvas = document.getElementById('background-canvas');
        if (!state.canvas) return;

        state.ctx = state.canvas.getContext('2d');
        updateCanvasSize();
        updateThemeColor();
    }

    function updateCanvasSize() {
        state.canvas.width = window.innerWidth;
        state.canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * state.canvas.width;
            this.y = Math.random() * state.canvas.height;
            this.size = Math.random() * 2 + 1;
            this.vx = Math.random() - 0.5;
            this.vy = Math.random() - 0.5;
            this.alpha = Math.random() * 0.4 + 0.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > state.canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > state.canvas.height) this.vy *= -1;
        }

        draw(ctx) {
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = state.particleColor;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        state.particles = [];
        const count = Math.min(
            state.maxParticles,
            (state.canvas.width * state.canvas.height) / 12000
        );

        for (let i = 0; i < count; i++) {
            state.particles.push(new Particle());
        }
    }

    function connectParticles() {
        const { ctx, particles, connectDistance } = state;

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = dx * dx + dy * dy;

                if (dist < connectDistance * connectDistance) {
                    ctx.globalAlpha = 0.15;
                    ctx.strokeStyle = state.particleColor;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        if (!state.ctx) return;

        state.ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);

        state.particles.forEach(p => {
            p.update();
            p.draw(state.ctx);
        });

        connectParticles();
        requestAnimationFrame(animate);
    }

    /* =======================
       THEME
    ======================= */
    function setupTheme() {
        const toggle = document.getElementById('theme-toggle');
        if (!toggle) return;

        const icon = toggle.querySelector('i');
        const saved = localStorage.getItem('theme');

        if (saved === 'dark') {
            document.body.classList.add('dark-mode');
            icon?.classList.replace('fa-moon', 'fa-sun');
        }

        toggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const dark = document.body.classList.contains('dark-mode');

            icon?.classList.toggle('fa-sun', dark);
            icon?.classList.toggle('fa-moon', !dark);

            localStorage.setItem('theme', dark ? 'dark' : 'light');
            updateThemeColor();
        });
    }

    function updateThemeColor() {
        state.particleColor =
            getComputedStyle(document.documentElement)
                .getPropertyValue('--primary-color')
                .trim() || state.particleColor;
    }

    /* =======================
       UI SETUP
    ======================= */
    function setupUI() {
        setupMobileMenu();
        setupHeaderScroll();
        setupResumeDownload();
        setupTypingEffect();
    }

    function setupMobileMenu() {
        const toggle = document.getElementById('mobile-toggle');
        const nav = document.querySelector('.nav-links');
        if (!toggle || !nav) return;

        toggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            toggle.innerHTML = nav.classList.contains('active')
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';
        });
    }

    function setupHeaderScroll() {
        const header = document.getElementById('header');
        if (!header) return;

        window.addEventListener('scroll', () => {
            header.classList.toggle('header-scrolled', window.scrollY > 80);
        });
    }

    function setupResumeDownload() {
        const btn = document.getElementById('download-resume');
        if (!btn) return;

        btn.addEventListener('click', () => {
            window.open('assets/Saravanan_R_Resume.pdf', '_blank');
        });
    }

    function setupTypingEffect() {
        const el = document.querySelector('.typing-text');
        if (!el) return;

        const text = 'Saravanan R';
        let i = 0;

        const type = () => {
            el.textContent = text.slice(0, i++);
            if (i <= text.length) setTimeout(type, 100);
        };

        setTimeout(type, 800);
    }

    /* =======================
       EFFECTS
    ======================= */
    function setupEffects() {
        setupIntersectionObserver();
        setupRippleEffect();
        setupFloatingIcons();
        setupProjectHover();
    }

    function setupIntersectionObserver() {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(e => {
                    if (e.isIntersecting) e.target.classList.add('animated');
                });
            },
            { threshold: 0.15 }
        );

        document.querySelectorAll(
            '.skill-card, .timeline-item, .education-card, .contact-item'
        ).forEach(el => observer.observe(el));
    }

    function setupRippleEffect() {
        document.querySelectorAll('.skill-tag, .tech-tag').forEach(tag => {
            tag.addEventListener('mouseenter', () => {
                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                tag.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    function setupFloatingIcons() {
        document.querySelectorAll('.floating-icon').forEach((icon, i) => {
            icon.style.animationDelay = `${i * 2.5}s`;
        });
    }

    function setupProjectHover() {
        document.querySelectorAll('.project-image').forEach(img => {
            img.addEventListener('mouseenter', () => img.style.transform = 'scale(1.03)');
            img.addEventListener('mouseleave', () => img.style.transform = 'scale(1)');
        });
    }

    /* =======================
       HELPERS
    ======================= */
    function onResize() {
        updateCanvasSize();
        initParticles();
    }

    function handleVisibility() {
        if (document.hidden) state.ctx?.clearRect(0, 0, state.canvas.width, state.canvas.height);
    }
})();