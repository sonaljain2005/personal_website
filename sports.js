// ===========================
// PARTICLE ANIMATION
// ===========================
const particlesCanvas = document.getElementById('particles-canvas');
const ctx = particlesCanvas.getContext('2d');

function resizeCanvas() {
    particlesCanvas.width = particlesCanvas.offsetWidth;
    particlesCanvas.height = particlesCanvas.offsetHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particles = [];
const particleCount = 30;

class Particle {
    constructor() {
        this.x = Math.random() * particlesCanvas.width;
        this.y = Math.random() * particlesCanvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > particlesCanvas.width) this.x = 0;
        if (this.x < 0) this.x = particlesCanvas.width;
        if (this.y > particlesCanvas.height) this.y = 0;
        if (this.y < 0) this.y = particlesCanvas.height;
    }

    draw() {
        ctx.fillStyle = `rgba(230, 57, 70, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    // Draw connections
    particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.strokeStyle = `rgba(230, 57, 70, ${0.2 * (1 - distance / 100)})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            }
        });
    });

    requestAnimationFrame(animateParticles);
}

animateParticles();

// ===========================
// PARALLAX SCROLLING
// ===========================
const header = document.querySelector('.sports-header');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    if (header) {
        header.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// ===========================
// SCROLL ANIMATIONS
// ===========================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.sports-section').forEach(section => {
    observer.observe(section);
});

// ===========================
// ANIMATED STATISTICS COUNTER
// ===========================
let statsAnimated = false;

function animateStats() {
    if (statsAnimated) return;

    const statNumbers = document.querySelectorAll('.stat-number');

    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                stat.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = target;
            }
        };

        updateCounter();
    });

    statsAnimated = true;
}

// Trigger stats animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats-grid');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// ===========================
// SKILL RADAR CHART
// ===========================
const skillsCanvas = document.getElementById('skillsChart');
const skillsCtx = skillsCanvas.getContext('2d');

const skills = [
    { name: 'Power', value: 90 },
    { name: 'Speed', value: 85 },
    { name: 'Defense', value: 80 },
    { name: 'Spin', value: 88 },
    { name: 'Strategy', value: 92 },
    { name: 'Consistency', value: 87 }
];

let chartAnimated = false;
let animationProgress = 0;

function drawRadarChart(progress = 1) {
    const centerX = skillsCanvas.width / 2;
    const centerY = skillsCanvas.height / 2;
    const radius = Math.min(centerX, centerY) - 60;
    const angleStep = (Math.PI * 2) / skills.length;

    skillsCtx.clearRect(0, 0, skillsCanvas.width, skillsCanvas.height);

    // Draw background circles
    for (let i = 1; i <= 5; i++) {
        skillsCtx.beginPath();
        skillsCtx.arc(centerX, centerY, (radius / 5) * i, 0, Math.PI * 2);
        skillsCtx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        skillsCtx.lineWidth = 1;
        skillsCtx.stroke();
    }

    // Draw axis lines and labels
    skills.forEach((skill, i) => {
        const angle = angleStep * i - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        // Axis line
        skillsCtx.beginPath();
        skillsCtx.moveTo(centerX, centerY);
        skillsCtx.lineTo(x, y);
        skillsCtx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        skillsCtx.lineWidth = 1;
        skillsCtx.stroke();

        // Label
        const labelX = centerX + Math.cos(angle) * (radius + 30);
        const labelY = centerY + Math.sin(angle) * (radius + 30);

        skillsCtx.fillStyle = '#2d2d2d';
        skillsCtx.font = 'bold 14px "Roboto Condensed", sans-serif';
        skillsCtx.textAlign = 'center';
        skillsCtx.textBaseline = 'middle';
        skillsCtx.fillText(skill.name, labelX, labelY);
    });

    // Draw skill polygon
    skillsCtx.beginPath();
    skills.forEach((skill, i) => {
        const angle = angleStep * i - Math.PI / 2;
        const value = (skill.value / 100) * radius * progress;
        const x = centerX + Math.cos(angle) * value;
        const y = centerY + Math.sin(angle) * value;

        if (i === 0) {
            skillsCtx.moveTo(x, y);
        } else {
            skillsCtx.lineTo(x, y);
        }
    });
    skillsCtx.closePath();
    skillsCtx.fillStyle = 'rgba(230, 57, 70, 0.2)';
    skillsCtx.fill();
    skillsCtx.strokeStyle = '#e63946';
    skillsCtx.lineWidth = 3;
    skillsCtx.stroke();

    // Draw points
    skills.forEach((skill, i) => {
        const angle = angleStep * i - Math.PI / 2;
        const value = (skill.value / 100) * radius * progress;
        const x = centerX + Math.cos(angle) * value;
        const y = centerY + Math.sin(angle) * value;

        skillsCtx.beginPath();
        skillsCtx.arc(x, y, 5, 0, Math.PI * 2);
        skillsCtx.fillStyle = '#e63946';
        skillsCtx.fill();
        skillsCtx.strokeStyle = '#fff';
        skillsCtx.lineWidth = 2;
        skillsCtx.stroke();
    });
}

function animateRadarChart() {
    if (chartAnimated) return;

    const duration = 1500;
    const startTime = Date.now();

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        drawRadarChart(easeProgress);

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            chartAnimated = true;
        }
    }

    animate();
}

// Trigger chart animation when visible
const chartObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateRadarChart();
        }
    });
}, { threshold: 0.5 });

if (skillsCanvas) {
    chartObserver.observe(skillsCanvas);
}

// ===========================
// LIGHTBOX GALLERY
// ===========================
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');
const mediaCards = document.querySelectorAll('.media-card');

mediaCards.forEach(card => {
    card.addEventListener('click', () => {
        const imgSrc = card.getAttribute('data-img');
        lightboxImg.src = imgSrc;
        lightbox.classList.add('active');
    });
});

lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('active');
});

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.classList.remove('active');
    }
});

// Close lightbox with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        lightbox.classList.remove('active');
    }
});

// ===========================
// TESTIMONIALS CAROUSEL
// ===========================
const testimonialCards = document.querySelectorAll('.testimonial-card');
const testimonialDots = document.querySelectorAll('.testimonial-dot');
let currentTestimonial = 0;
let testimonialInterval;

function showTestimonial(index) {
    testimonialCards.forEach(card => card.classList.remove('active'));
    testimonialDots.forEach(dot => dot.classList.remove('active'));

    testimonialCards[index].classList.add('active');
    testimonialDots[index].classList.add('active');
    currentTestimonial = index;
}

function nextTestimonial() {
    const next = (currentTestimonial + 1) % testimonialCards.length;
    showTestimonial(next);
}

// Auto-rotate testimonials
testimonialInterval = setInterval(nextTestimonial, 5000);

// Manual control
testimonialDots.forEach(dot => {
    dot.addEventListener('click', () => {
        const index = parseInt(dot.getAttribute('data-index'));
        showTestimonial(index);

        // Reset auto-rotation
        clearInterval(testimonialInterval);
        testimonialInterval = setInterval(nextTestimonial, 5000);
    });
});

// ===========================
// SMOOTH SCROLL
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===========================
// 3D TILT EFFECT ON HEADER
// ===========================
const sportsHeader = document.querySelector('.sports-header');

if (sportsHeader) {
    sportsHeader.addEventListener('mousemove', (e) => {
        const rect = sportsHeader.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 50;
        const rotateY = (centerX - x) / 50;

        sportsHeader.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${window.pageYOffset * 0.5}px)`;
    });

    sportsHeader.addEventListener('mouseleave', () => {
        sportsHeader.style.transform = `perspective(1000px) rotateX(0) rotateY(0) translateY(${window.pageYOffset * 0.5}px)`;
    });
}

// ===========================
// ACHIEVEMENT CARDS STAGGER
// ===========================
const achievementItems = document.querySelectorAll('.achievement-item');

achievementItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`;
});

// ===========================
// INITIALIZE
// ===========================
console.log('🏓 Sports page loaded successfully!');
