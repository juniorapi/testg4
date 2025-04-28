/**
 * Покращений головний JavaScript файл для сайту G_UA Alliance
 * З сучасними 3D ефектами, анімаціями та інтерактивністю
 */

// Чекаємо завантаження DOM
document.addEventListener('DOMContentLoaded', function() {
    // Ініціалізація всіх функцій
    initHeader();
    initMobileMenu();
    initScrollEffects();
    initParallaxEffects();
    initScrollToTop();
    initAnimatedElements();
    initIntensiveParticles();
    init3DEffects();
    initFancyLinks();
    initTypewriterEffect();
});

/**
 * Ініціалізація ефектів для шапки сайту
 */
function initHeader() {
    const header = document.querySelector('.main-header');
    const scrollThreshold = 50;

    // Функція оновлення класу шапки при прокрутці
    function updateHeaderOnScroll() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // Відразу перевіряємо стан прокрутки
    updateHeaderOnScroll();

    // Слухаємо подію прокрутки
    window.addEventListener('scroll', updateHeaderOnScroll);
    
    // Додаємо ефект блиску при руху миші
    if (header) {
        header.addEventListener('mousemove', function(e) {
            const headerWidth = header.offsetWidth;
            const headerHeight = header.offsetHeight;
            const moveX = (e.clientX - headerWidth / 2) / 25;
            const moveY = (e.clientY - headerHeight / 2) / 25;
            
            header.style.backgroundPosition = `${moveX}px ${moveY}px`;
        });
    }
}

/**
 * Ініціалізація мобільного меню
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
            
            // Оновлюємо атрибут aria-expanded
            const isExpanded = this.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);
            
            // Блокуємо прокрутку фону, коли меню відкрите
            if (isExpanded) {
                document.body.classList.add('nav-open');
            } else {
                document.body.classList.remove('nav-open');
            }
        });

        // Закриваємо меню при кліку на пункт меню
        const menuItems = mainNav.querySelectorAll('a');
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', false);
                document.body.classList.remove('nav-open');
            });
        });
        
        // Закриваємо меню при кліку за межами меню
        document.addEventListener('click', function(event) {
            if (mainNav.classList.contains('active') && 
                !mainNav.contains(event.target) && 
                !menuToggle.contains(event.target)) {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', false);
                document.body.classList.remove('nav-open');
            }
        });
    }
}

/**
 * Ініціалізація ефектів прокрутки
 */
function initScrollEffects() {
    // Плавна прокрутка для якірних посилань
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Враховуємо висоту шапки
                    behavior: 'smooth'
                });
            }
        });
    });

    // Анімація для елементів при прокрутці
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    function checkScroll() {
        const triggerPosition = window.innerHeight * 0.85;
        
        animatedElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            
            if (elementPosition < triggerPosition) {
                element.classList.add('animated');
            }
        });
    }
    
    // Початкова перевірка для елементів, які вже видно
    checkScroll();
    
    // Слухаємо подію прокрутки
    window.addEventListener('scroll', checkScroll);
    
    // Ефект паралаксу для секцій при прокрутці
    const parallaxSections = document.querySelectorAll('.parallax-section');
    
    window.addEventListener('scroll', function() {
        parallaxSections.forEach(section => {
            const scrollPosition = window.pageYOffset;
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            // Перевіряємо, чи секція видима
            if (scrollPosition + window.innerHeight > sectionTop && 
                scrollPosition < sectionTop + sectionHeight) {
                
                const speed = section.getAttribute('data-parallax-speed') || 0.15;
                const yPos = (scrollPosition - sectionTop) * speed;
                section.style.backgroundPosition = `center ${-yPos}px`;
            }
        });
    });
}

/**
 * Ініціалізація паралакс-ефектів
 */
function initParallaxEffects() {
    // Паралакс-ефект при руху миші
    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // Застосовуємо паралакс для елементів з атрибутом data-parallax
        document.querySelectorAll('[data-parallax]').forEach(element => {
            const speed = element.getAttribute('data-parallax') || 0.1;
            const moveX = (mouseX - windowWidth / 2) * speed;
            const moveY = (mouseY - windowHeight / 2) * speed;
            
            element.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
        });
        
        // Унікальний паралакс для фонових елементів на головній сторінці
        const starsLayers = [
            document.getElementById('stars'),
            document.getElementById('stars2'),
            document.getElementById('stars3'),
            document.getElementById('stars4')
        ];
        
        if (starsLayers.every(layer => layer)) {
            const speeds = [0.01, 0.02, 0.03, 0.04];
            
            starsLayers.forEach((layer, index) => {
                const moveX = (mouseX - windowWidth / 2) * speeds[index];
                const moveY = (mouseY - windowHeight / 2) * speeds[index];
                
                layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
            });
        }
    });
}

/**
 * Ініціалізація кнопки прокрутки вгору
 */
function initScrollToTop() {
    const scrollTopBtn = document.querySelector('.scroll-top');
    const scrollThreshold = 300;
    
    if (scrollTopBtn) {
        // Перевірка позиції прокрутки
        function checkScrollPosition() {
            if (window.scrollY > scrollThreshold) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }
        
        // Початкова перевірка
        checkScrollPosition();
        
        // Слухаємо подію прокрутки
        window.addEventListener('scroll', checkScrollPosition);
        
        // Прокручуємо вгору при натисканні на кнопку
        const scrollTopButton = scrollTopBtn.querySelector('button');
        
        if (scrollTopButton) {
            scrollTopButton.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
            
            // Додаємо анімацію при наведенні
            scrollTopButton.addEventListener('mouseenter', function() {
                this.querySelector('i').classList.add('fa-beat');
            });
            
            scrollTopButton.addEventListener('mouseleave', function() {
                this.querySelector('i').classList.remove('fa-beat');
            });
        }
    }
}

/**
 * Ініціалізація анімованих елементів
 */
function initAnimatedElements() {
    // Анімовані картки
    const animatedCards = document.querySelectorAll('.animated-card');
    
    animatedCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
    });
    
    // Елементи з ефектом подвійного псевдоелемента
    const dualElements = document.querySelectorAll('.dual-pseudo');
    
    dualElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        
        element.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
    });
    
    // Пульсуючі елементи
    const pulseElements = document.querySelectorAll('.pulse-element');
    
    pulseElements.forEach(element => {
        // Додаємо випадкову затримку для анімації
        const delay = Math.random() * 2;
        element.style.animationDelay = `${delay}s`;
    });
}

/**
 * Ініціалізація інтенсивних частинок для фону
 */
function initIntensiveParticles() {
    // Перевіряємо, чи є контейнер для анімації фону
    const bgAnimation = document.querySelector('.bg-animation');
    
    if (bgAnimation) {
        // Створюємо контейнер для частинок
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        bgAnimation.appendChild(particlesContainer);
        
        // Створюємо певну кількість частинок
        const particlesCount = window.innerWidth > 768 ? 30 : 15;
        
        for (let i = 0; i < particlesCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Встановлюємо випадкові розміри та позиції
            const size = Math.random() * 5 + 1;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = Math.random() * 20 + 10;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.animationDelay = `${delay}s`;
            particle.style.animationDuration = `${duration}s`;
            
            particlesContainer.appendChild(particle);
        }
        
        // Додаємо CSS для частинок
        const style = document.createElement('style');
        style.textContent = `
            .particles-container {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1;
                overflow: hidden;
            }
            
            .particle {
                position: absolute;
                background-color: rgba(227, 41, 39, 0.6);
                border-radius: 50%;
                box-shadow: 0 0 10px rgba(227, 41, 39, 0.8);
                animation: float-particle linear infinite;
            }
            
            @keyframes float-particle {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Ініціалізація 3D-ефектів для елементів
 */
function init3DEffects() {
    // Карточки з 3D ефектом при наведенні
    const cards3D = document.querySelectorAll('.card-3d');
    
    cards3D.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            // Відключаємо на мобільних пристроях
            if (window.innerWidth <= 768) return;
            
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Розрахунок кутів повороту
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            // Застосовуємо трансформацію
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            
            // Додаємо ефект світла
            const shine = this.querySelector('.card-shine');
            if (shine) {
                const percentX = x / rect.width * 100;
                const percentY = y / rect.height * 100;
                shine.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 50%)`;
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            
            const shine = this.querySelector('.card-shine');
            if (shine) {
                shine.style.background = '';
            }
        });
    });
    
    // Ініціалізація перевертання карток (якщо є)
    const flipTriggers = document.querySelectorAll('.flip-trigger');
    
    flipTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const targetId = this.getAttribute('data-flip-target');
            const targetCard = document.getElementById(targetId);
            
            if (targetCard) {
                targetCard.classList.toggle('flipped');
            }
        });
    });
}

/**
 * Ініціалізація анімованих посилань
 */
function initFancyLinks() {
    const fancyLinks = document.querySelectorAll('.fancy-link');
    
    fancyLinks.forEach(link => {
        // Створюємо пульсуючий елемент для посилання
        const pulse = document.createElement('span');
        pulse.className = 'link-pulse';
        link.appendChild(pulse);
        
        link.addEventListener('mouseenter', function() {
            pulse.style.transform = 'scale(1.5)';
            pulse.style.opacity = '0';
        });
        
        link.addEventListener('mouseleave', function() {
            pulse.style.transform = 'scale(1)';
            pulse.style.opacity = '1';
        });
    });
    
    // Створюємо CSS для посилань
    const style = document.createElement('style');
    style.textContent = `
        .fancy-link {
            position: relative;
            display: inline-block;
            overflow: hidden;
        }
        
        .link-pulse {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(227, 41, 39, 0.2);
            border-radius: 4px;
            z-index: -1;
            transition: transform 0.3s ease, opacity 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Ініціалізація ефекту друкарської машинки
 */
function initTypewriterEffect() {
    const typewriterElements = document.querySelectorAll('.typewriter');
    
    typewriterElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        
        let charIndex = 0;
        const typeSpeed = element.getAttribute('data-type-speed') || 100;
        
        function typeText() {
            if (charIndex < text.length) {
                element.textContent += text.charAt(charIndex);
                charIndex++;
                setTimeout(typeText, typeSpeed);
            }
        }
        
        // Запускаємо анімацію, коли елемент стає видимим
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(typeText, 500);
                    observer.unobserve(element);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(element);
    });
}
