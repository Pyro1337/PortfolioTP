// Premium Portfolio - Iván Alfredo Sanchez Rojas
// Main JS con Lenis, GSAP, ScrollTrigger y fondo reactivo al mouse

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lenis for smooth scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gesture: {
            swipe: {
                class: 'swipe',
            }
        },
        smooth: true
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Mouse reactive background
    let fromX = 0;
    let fromY = 0;
    let toX = 0;
    let toY = 0;

    document.addEventListener('mousemove', (e) => {
        fromX = toX;
        fromY = toY;
        toX = e.clientX;
        toY = e.clientY;
        
        // Add mouse-active class for transition
        document.body.classList.add('mouse-active');
        
        // Remove after transition
        setTimeout(() => {
            document.body.classList.remove('mouse-active');
        }, 100);
    });

    // GSAP animations on scroll
    gsap.registerPlugin(ScrollTrigger);

    // Observer para animaciones al entrar en viewport
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all reveal elements
    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });

    // Hero title animation
    gsap.from('.hero-title', {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out'
    });

    gsap.from('.hero-subtitle', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.5,
        ease: 'power2.out'
    });

    gsap.from('.hero-badge', {
        y: -20,
        opacity: 0,
        duration: 0.8,
        delay: 0.6,
        ease: 'back.out(1.7)'
    });

    // Timeline stagger animation
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        gsap.from(item, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            delay: 0.1 * (index + 1),
            ease: 'power2.out'
        });
    });

    // Skill pills hover effect
    const skillPills = document.querySelectorAll('.skill-pill');
    skillPills.forEach(pill => {
        pill.addEventListener('mouseenter', function() {
            gsap.to(this, {
                y: -5,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        pill.addEventListener('mouseleave', function() {
            gsap.to(this, {
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // Project card hover with 3D tilt
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            gsap.to(card.find('.project-body'), {
                rotateX: rotateX,
                rotateY: rotateY,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card.find('.project-body'), {
                rotateX: 0,
                rotateY: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    });

    // Stagger fade-in for sections
    const sections = document.querySelectorAll('.section');
    sections.forEach((section, index) => {
        gsap.from(section, {
            y: 80,
            opacity: 0,
            duration: 1,
            delay: 0.2 * index,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // Nav scrolled class
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

    // Smooth reveal on load with lenis
    lenis.on('scroll', (e) => {
        // Update gradient based on scroll position
    });

    // Initialize all cards hidden, reveal on scroll
    document.querySelectorAll('.card, .timeline-item, .project-card, .education-card').forEach(el => {
        el.classList.add('reveal');
    });

    // Call observer after setTimeout to allow lenis to settle
    setTimeout(() => {
        document.querySelectorAll('.reveal').forEach(el => {
            observer.observe(el);
        });
    }, 500);

    // Parallax tilt effect for hero on mousemove
    document.addEventListener('mousemove', (e) => {
        const docEl = document.documentElement;
        const scrollTop = (window.pageYOffset || docEl.scrollTop) - (docEl.clientTop || 0);
        
        const maxRotation = 10;
        const xRotation = (e.clientY / window.innerHeight - 0.5) * maxRotation;
        const yRotation = (e.clientX / window.innerWidth - 0.5) * -maxRotation;
        
        gsap.to('.hero', {
            rotationX: xRotation,
            rotationY: yRotation,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    // Prevent default link behavior for external links
    document.querySelectorAll('a[href^="mailto:"], a[href^="tel:"], a[href^="https"]').forEach(link => {
        link.addEventListener('click', (e) => {
            // Allow native behavior, just track
        });
    });

    // Initialize all GSAP when page is fully loaded
    window.addEventListener('load', () => {
        document.querySelectorAll('.loader').forEach(loader => {
            loader.style.opacity = '0';
            loader.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        });
        
        // Re-observe after loader disappears
        setTimeout(() => {
            document.querySelectorAll('.reveal').forEach(el => {
                observer.observe(el);
            });
        }, 600);
    });
});