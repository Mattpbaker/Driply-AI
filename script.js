// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            
            // Animate cards with stagger
            if (entry.target.classList.contains('features-section')) {
                const cards = entry.target.querySelectorAll('.card-animate');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('animate');
                    }, index * 100);
                });
            }
            
            if (entry.target.classList.contains('why-section')) {
                const items = entry.target.querySelectorAll('.card-animate');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('animate');
                    }, index * 100);
                });
            }
            
            if (entry.target.classList.contains('tech-section')) {
                const items = entry.target.querySelectorAll('.card-animate');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('animate');
                    }, index * 100);
                });
            }
            
            if (entry.target.classList.contains('how-it-works-section')) {
                const steps = entry.target.querySelectorAll('.step-animate');
                steps.forEach((step, index) => {
                    setTimeout(() => {
                        step.classList.add('animate');
                    }, index * 150);
                });
            }
        }
    });
}, observerOptions);

// Observe all sections
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section-animate');
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Animate hero immediately
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.opacity = '1';
    }
});
