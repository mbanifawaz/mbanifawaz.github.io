// Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Load data from JSON
async function loadData() {
    try {
        const response = await fetch('assets/data/data.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading data:', error);
        return null;
    }
}

// Typing Animation
const titles = [
    'Senior Full Stack Developer',
    'Software Engineer',
    'ERP Squad Lead',
    'Python Expert',
    'Cloud Architect',
    'DevOps Engineer',
    'System Automator'
];

let titleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingSpeed = 100;
const deletingSpeed = 50;
const pauseDuration = 2000;

function typeWriter() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;
    
    const currentTitle = titles[titleIndex];
    
    if (isDeleting) {
        typingElement.textContent = currentTitle.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = currentTitle.substring(0, charIndex + 1);
        charIndex++;
    }
    
    if (!isDeleting && charIndex === currentTitle.length) {
        setTimeout(() => {
            isDeleting = true;
            typeWriter();
        }, pauseDuration);
        return;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
    }
    
    const speed = isDeleting ? deletingSpeed : typingSpeed;
    setTimeout(typeWriter, speed);
}

// Particle Network Animation
function initParticleNetwork() {
    const canvas = document.getElementById('particle-network');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 100;
    const connectionDistance = 150;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 255, 255, 0.8)';
            ctx.fill();
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < connectionDistance) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 255, 255, ${1 - distance / connectionDistance})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Matrix Rain Effect
function initMatrixRain() {
    const canvas = document.getElementById('matrix-rain');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const matrix = '01';
    const matrixArray = matrix.split('');
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    const drops = [];
    
    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }
    
    function drawMatrix() {
        ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00ff88';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(drawMatrix, 35);
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Navbar Scroll Effect
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Smooth Scroll
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const navbar = document.getElementById('navbar');
    navbar.classList.toggle('menu-open');
}

// Load Skills
async function loadSkills() {
    const data = await loadData();
    if (!data || !data.skills) return;
    
    const container = document.getElementById('skills-container');
    if (!container) return;
    
    const skillsHTML = data.skills.data.map((skill, index) => `
        <div style="width: 100%;" data-aos="fade-up" data-aos-delay="${index * 50}">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span class="terminal-prompt" style="color: var(--neon-green);">${skill.name}</span>
                <span style="color: var(--primary-cyan);">${skill.level}%</span>
            </div>
            <div class="skill-bar">
                <div class="skill-progress" style="width: ${skill.level}%;"></div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = skillsHTML;
}

// Store portfolio data globally
let portfolioData = [];

// Load Portfolio
async function loadPortfolio() {
    const data = await loadData();
    if (!data || !data.portfolio) return;
    
    portfolioData = data.portfolio.items;
    const container = document.getElementById('portfolio-container');
    if (!container) return;
    
    const portfolioHTML = data.portfolio.items.slice(0, 9).map((item, index) => `
        <div class="holo-card portfolio-item ${item.category}" data-aos="zoom-in" data-aos-delay="${index * 100}" onclick="openProjectModal(${index})">
            ${item.video ? 
                `<video src="${item.video}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 10px; margin-bottom: 1rem;" autoplay muted loop></video>` :
                `<img src="${item.image}" alt="${item.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 10px; margin-bottom: 1rem;">`
            }
            <h3 style="color: var(--neon-blue); margin-bottom: 0.5rem; font-family: var(--font-display); font-size: 1.2rem;">${item.title}</h3>
            <p style="color: var(--text-secondary); margin-bottom: 1rem; font-size: 0.9rem;">${item.shortDescription}</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: var(--neon-green); font-family: var(--font-mono); font-size: 0.8rem;">${item.stack.split(' | ')[0]}</span>
                <button class="cyber-btn" style="padding: 0.5rem 1rem; font-size: 0.8rem;" onclick="event.stopPropagation(); window.open('${item.projectURL}', '_blank')">VISIT</button>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = portfolioHTML;
    
    // Filter functionality
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            document.querySelectorAll('.portfolio-item').forEach(item => {
                if (filter === '*' || item.classList.contains(filter.substring(1))) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Open Project Modal
function openProjectModal(index) {
    const project = portfolioData[index];
    if (!project) return;
    
    const modal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMedia = document.getElementById('modalMedia');
    const modalDescription = document.getElementById('modalDescription');
    const modalInfo = document.getElementById('modalInfo');
    const modalActions = document.getElementById('modalActions');
    
    // Set title
    modalTitle.textContent = project.title;
    
    // Set media
    if (project.video) {
        modalMedia.innerHTML = `<video class="modal-media" src="${project.video}" autoplay muted loop controls></video>`;
    } else if (project.image) {
        modalMedia.innerHTML = `<img class="modal-media" src="${project.image}" alt="${project.title}">`;
    }
    
    // Set description
    modalDescription.innerHTML = project.description || project.shortDescription;
    
    // Set info
    modalInfo.innerHTML = `
        ${project.stack ? `
        <div class="modal-info-item">
            <div class="modal-info-label">Tech Stack</div>
            <div class="modal-info-value">${project.stack}</div>
        </div>` : ''}
        ${project.platform ? `
        <div class="modal-info-item">
            <div class="modal-info-label">Platform</div>
            <div class="modal-info-value">${project.platform}</div>
        </div>` : ''}
        ${project.client ? `
        <div class="modal-info-item">
            <div class="modal-info-label">Client</div>
            <div class="modal-info-value">${project.client}</div>
        </div>` : ''}
        ${project.projectDate ? `
        <div class="modal-info-item">
            <div class="modal-info-label">Date</div>
            <div class="modal-info-value">${project.projectDate}</div>
        </div>` : ''}
    `;
    
    // Set actions
    modalActions.innerHTML = `
        <a href="${project.projectURL}" target="_blank" class="cyber-btn">
            ${project.projectURLText || 'VISIT PROJECT'}
        </a>
        <button class="cyber-btn" onclick="closeModal()">CLOSE</button>
    `;
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close Modal
function closeModal() {
    const modal = document.getElementById('projectModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Load Social Links
async function loadSocialLinks() {
    const data = await loadData();
    if (!data || !data.links) return;
    
    const container = document.getElementById('social-links');
    if (!container) return;
    
    const linksHTML = data.links.map(link => `
        <a href="${link.href}" target="_blank" class="cyber-btn" style="padding: 0.8rem 1.5rem;">
            <i class="${link.icon}"></i>
        </a>
    `).join('');
    
    container.innerHTML = linksHTML;
}

// Add Bootstrap Icons CSS
const iconLink = document.createElement('link');
iconLink.rel = 'stylesheet';
iconLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css';
document.head.appendChild(iconLink);

// Helper function to truncate text
function truncateText(text, maxLength = 150) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Toggle read more/less for testimonials
window.toggleTestimonialText = function(button, index) {
    const textElement = document.querySelector(`#testimonial-text-${index}`);
    const fullText = textElement.getAttribute('data-full-text');
    const truncatedText = textElement.getAttribute('data-truncated');
    
    if (button.textContent === 'Read more') {
        textElement.textContent = fullText;
        button.textContent = 'Read less';
    } else {
        textElement.textContent = truncatedText;
        button.textContent = 'Read more';
    }
}

// Load testimonials with futuristic styling
async function loadTestimonials() {
    try {
        const response = await fetch('assets/data/data.json');
        const data = await response.json();
        const testimonials = data.testimonials;
        
        const container = document.querySelector('.swipermaincontainer');
        if (!container) {
            console.error('Testimonials container not found');
            return;
        }
        
        // Create futuristic testimonials grid
        const testimonialsGrid = document.createElement('div');
        const isMobile = window.innerWidth <= 768;
        testimonialsGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(${isMobile ? '280px' : '300px'}, 1fr));
            gap: 1.5rem;
            position: relative;
            width: 100%;
            padding: 0;
            max-width: 1200px;
            margin: 0 auto;
        `;
        
        testimonials.forEach((testimonial, index) => {
            const truncatedText = truncateText(testimonial.text, 120);
            const needsReadMore = testimonial.text.length > 120;
            
            const card = document.createElement('div');
            card.className = 'holo-card testimonial-card';
            card.style.cssText = `
                position: relative;
                z-index: 1;
                opacity: 1;
                visibility: visible;
                background: linear-gradient(135deg, 
                    rgba(0, 255, 255, 0.05) 0%, 
                    rgba(255, 0, 255, 0.05) 50%, 
                    rgba(255, 255, 0, 0.05) 100%);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 15px;
                padding: 0;
                height: 280px;
                display: flex;
                flex-direction: column;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            `;
            
            card.innerHTML = `
                <div style="padding: 1.5rem; height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
                    <div style="flex-grow: 1; overflow: hidden;">
                        <div style="position: relative; margin-bottom: 1rem;">
                            <span style="color: #00d4ff; font-size: 2rem; opacity: 0.3; position: absolute; top: -10px; left: -10px;">❝</span>
                            <p id="testimonial-text-${index}" 
                               data-full-text="${testimonial.text.replace(/"/g, '&quot;')}"
                               data-truncated="${truncatedText.replace(/"/g, '&quot;')}"
                               style="color: #b8b8c8; font-style: italic; line-height: 1.5; font-size: 0.9rem; padding: 0 1rem; margin: 0;">
                                ${truncatedText}
                            </p>
                            ${needsReadMore ? `
                                <button onclick="toggleTestimonialText(this, ${index})" 
                                        style="background: none; border: none; color: #00d4ff; cursor: pointer; font-size: 0.85rem; margin-top: 0.5rem; padding: 0 1rem; text-decoration: underline;">
                                    Read more
                                </button>
                            ` : ''}
                            <span style="color: #9d00ff; font-size: 2rem; opacity: 0.3; position: absolute; bottom: -10px; right: -10px;">❞</span>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: center; gap: 0.75rem; border-top: 1px solid rgba(0, 255, 255, 0.1); padding-top: 1rem; margin-top: auto;">
                        <img src="${testimonial.image}" 
                             style="width: 45px; height: 45px; border-radius: 50%; border: 2px solid #00ff88; object-fit: cover;" 
                             alt="${testimonial.name}"
                             onerror="this.src='assets/img/testimonials/empty.png'">
                        <div style="overflow: hidden;">
                            <h4 style="color: #00ff88; margin: 0; font-size: 0.95rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${testimonial.name}</h4>
                            <p style="color: #b8b8c8; margin: 0; font-size: 0.8rem; opacity: 0.8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${testimonial.title}</p>
                        </div>
                    </div>
                </div>
            `;
            
            // Add hover effect
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 10px 30px rgba(0, 255, 255, 0.3)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            });
            
            testimonialsGrid.appendChild(card);
        });
        
        // Clear container and add grid
        container.innerHTML = '';
        container.style.minHeight = '200px';
        container.style.position = 'relative';
        container.style.display = 'block';
        container.appendChild(testimonialsGrid);
        
        console.log('Testimonials loaded successfully');
        
    } catch (error) {
        console.error('Error loading testimonials:', error);
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', async () => {
    typeWriter();
    initParticleNetwork();
    initMatrixRain();
    initNavbarScroll();
    await loadSkills();
    await loadPortfolio();
    await loadSocialLinks();
    await loadTestimonials();
    
    // Add smooth scroll to nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const sectionId = href.substring(1);
                scrollToSection(sectionId);
                // Close mobile menu if open
                document.getElementById('navbar').classList.remove('menu-open');
            }
        });
    });
    
    // Add glitch effect on hover for neon text
    document.querySelectorAll('.neon-text').forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.animation = 'glitch 0.3s infinite';
        });
        element.addEventListener('mouseleave', function() {
            this.style.animation = 'glitch 2s infinite';
        });
    });
    
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
    
    // Add interactive cursor glow
    const cursor = document.createElement('div');
    cursor.className = 'cursor-glow';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(0, 255, 255, 0.5), transparent);
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        mix-blend-mode: screen;
    `;
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });
    
    // Add hover effect for buttons
    document.querySelectorAll('.cyber-btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Modal close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // Modal close on click outside
    document.getElementById('projectModal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    });
});