// ===== PREMIUM PORTFOLIO - ÍVAN ALFREDO SANCHEZ ROJAS =====
// Main JS con efectos visuales avanzados, Lenis, GSAP y ScrollTrigger

document.addEventListener('DOMContentLoaded', function() {
    // ===== LENIS SMOOTH SCROLL CON PHYSICS =====
    const lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gesture: {
            swipe: { class: 'swipe' }
        },
        smooth: true,
        mouseia: true
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // ===== MOUSE REACTIVE BACKGROUND =====
    const mouse = { x: 0, y: 0, lastX: 0, lastY: 0 };
    const particles = [];

    document.addEventListener('mousemove', (e) => {
        mouse.lastX = mouse.x;
        mouse.lastY = mouse.y;
        mouse.x = e.clientX;
        mouse.y = e.clientY;

        // Add mouse-active class for transitions
        document.body.classList.add('mouse-active');
        
        // Remove after transition
        setTimeout(() => {
            document.body.classList.remove('mouse-active');
        }, 100);
    });

    // Create particles on mousedown/click
    document.addEventListener('click', (e) => {
        createParticle(e.clientX, e.clientY);
    });

    function createParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            left: ${x}px;
            top: ${y}px;
            width: 8px;
            height: 8px;
            opacity: 1;
        `;
        
        // Animate particle
        const endX = x + (Math.random() - 0.5) * 300;
        const endY = y + (Math.random() - 0.5) * 300;
        const endScale = Math.random() * 0.5 + 0.3;
        const endOpacity = 0;
        
        particle.style.transition = 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
        particle.style.transform = `scale(${endScale})`;
        particle.style.opacity = '1';
        
        document.querySelector('.particles').appendChild(particle);
        
        setTimeout(() => {
            document.querySelector('.particles').removeChild(particle);
        }, 1500);
    });

    // ===== GSAP ANIMATIONS WITH SCROLLTRIGGER =====
    gsap.registerPlugin(ScrollTrigger);

    // Color scheme based on mouse position for gradient background
    function updateGradient() {
        const gradientX = mouse.x / window.innerWidth;
        const gradientY = mouse.y / window.innerHeight;
        
        const fromColor = `rgba(13, 13, 20, 0.9)`;
        const toColor = `rgba(245, 208, 196, 0.03)`;
        
        document.body.style.background = `radial-gradient(at ${mouse.x}px ${mouse.y}px, ${fromColor} 0%, ${toColor} 100%)`;
    }

    // ===== REVEAL ANIMATIONS ON SCROLL =====
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger based on index
                gsap.from(entry.target, {
                    opacity: 0,
                    y: 60,
                    duration: 0.8,
                    delay: 0.1 * index,
                    ease: 'power3.out',
                    overwrite: 'auto'
                });
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ===== STAGGERED ANIMATIONS =====

    // Hero entrance animation
    gsap.from('.hero__badge', {
        y: -30,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        ease: 'back.out(1.7)'
    });

    gsap.from('.hero__name', {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.5,
        ease: 'power3.out'
    });

    gsap.from('.hero__role', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.6,
        ease: 'power2.out'
    });

    gsap.from('.hero__cta', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.7,
        ease: 'power2.out'
    });

    // Profile cards staggered
    const profileCards = document.querySelectorAll('.profile__card');
    profileCards.forEach((card, index) => {
        gsap.from(card, {
            opacity: 0,
            x: index % 2 === 0 ? -40 : 40,
            duration: 0.8,
            delay: 0.15 * index,
            ease: 'power3.out'
        });
    });

    // Stats counter animation
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stats = document.querySelectorAll('.profile__stat-number');
                stats.forEach((stat, i) => {
                    const targets = [
                        { from: 0, to: 3 },    // 3+ años
                        { from: 0, to: 4.15 }, // promedio
                        { from: 0, to: 1 }     // proyecto actual
                    ];
                    
                    const target = targets[i];
                    const duration = 1.2;
                    
                    gsap.fromTo(stat, 
                        { innerText: target.from },
                        { 
                            innerText: target.to,
                            duration: duration,
                            ease: 'power2.out',
                            snap: { innerText: 0.1 },
                            onUpdate: function() {
                                stat.innerText = Math.floor(this.targets()[0].innerText);
                            }
                        }
                    );
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const profileSection = document.querySelector('.profile__stats');
    if (profileSection) {
        statsObserver.observe(profileSection.parentElement);
    }

    // Timeline items stagger
    const timelineItems = document.querySelectorAll('.timeline__item');
    timelineItems.forEach((item, index) => {
        gsap.from(item, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            delay: 0.1 * (index + 1),
            ease: 'power2.out'
        });
    });

    // Skill pills hover with 3D lift
    const skillTags = document.querySelectorAll('.skill__tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            gsap.to(tag, {
                y: -5,
                scale: 1.1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        tag.addEventListener('mouseleave', () => {
            gsap.to(tag, {
                y: 0,
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // Project cards 3D tilt on mousemove
    const projectCards = document.querySelectorAll('.project__card');
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;
            
            gsap.to(card.querySelector('.project__body'), {
                rotateX: rotateX,
                rotateY: rotateY,
                x: 10,
                y: -10,
                duration: 0.4,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card.querySelector('.project__body'), {
                rotateX: 0,
                rotateY: 0,
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    });

    // Education cards hover
    const educationCards = document.querySelectorAll('.education__card');
    educationCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -10,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // ===== NAV SCROLLED STATE =====
    let lastScroll = 0;
    const header = document.querySelector('.header');
    
    function handleScroll() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScroll && currentScroll > 200) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll <= 0 ? 0 : currentScroll;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ===== SKILL PROGRESS ANIMATIONS =====
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillCards = document.querySelectorAll('.skill__card');
                skillCards.forEach((card, i) => {
                    gsap.fromTo(card.querySelector('.skill__tag'),
                        { y: 20, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.5, delay: 0.1 * i, ease: 'power2.out' }
                    );
                });
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const skillsSection = document.querySelector('.skills__grid');
    if (skillsSection) {
        skillsSection.parentElement.style.position = 'relative';
        skillsSection.parentElement.style.zIndex = '10';
        skillsSection.parentElement.style.top = '0';
        skillsObserver.observe(skillsSection.parentElement);
    }

    // ===== PARALLAX EFFECTS =====

    // Hero tilt effect based on mouse position
    document.addEventListener('mousemove', (e) => {
        const docEl = document.documentElement;
        const scrollTop = (window.pageYOffset || docEl.scrollTop) - (docEl.clientTop || 0);
        
        const maxRotation = 8;
        const xRotation = (e.clientY / window.innerHeight - 0.5) * maxRotation;
        const yRotation = (e.clientX / window.innerWidth - 0.5) * -maxRotation;
        
        gsap.to('.hero', {
            rotationX: xRotation,
            rotationY: yRotation,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    // ===== SMOOTH ANCHOR SCROLLING =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                lenis.scrollTo(targetElement, {
                    duration: 1.2,
                    easing: (t) => Math.min(1, 1 - Math.pow(2, -10 * t))
                });
            }
        });
    });

    // ===== LOADER ANIMATION =====
    window.addEventListener('load', () => {
        const loader = document.querySelector('#loader');
        if (loader) {
            loader.style.opacity = '0';
            loader.style.transition = 'opacity 0.8s ease';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 800);
        }
        
        // Re-observe after loader disappears
        setTimeout(() => {
            revealElements.forEach(el => revealObserver.observe(el));
        }, 500);
    });

    // ===== ACTIVE NAV LINK =====
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.header__nav-link');
    
    function activateNav() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', activateNav);

    // ===== INITIALIZE LENIS SCROLL ON PAGE LOAD =====
    setTimeout(() => {
        document.body.classList.add('lenis-initialized');
    }, 1000);
});