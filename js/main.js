/**
 * Головний JavaScript файл для сайту G_UA Alliance
 * З сучасними ефектами, анімаціями та інтерактивністю
 */

// Чекаємо завантаження DOM
document.addEventListener('DOMContentLoaded', function() {
    // Ініціалізація всіх функцій
    initHeader();
    initMobileMenu();
    initScrollEffects();
    initParallaxEffects();
    initScrollToTop();
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
        });

        // Закриваємо меню при кліку на пункт меню
        const menuItems = mainNav.querySelectorAll('a');
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', false);
            });
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
}

/**
 * Ініціалізація паралакс-ефектів
 */
function initParallaxEffects() {
    // Паралакс-ефект для танка
    const tankImage = document.querySelector('.parallax-tank');
    
    if (tankImage) {
        document.addEventListener('mousemove', function(e) {
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            
            // Коефіцієнт руху (зменшений для більш тонкого ефекту)
            const moveFactorX = 5; 
            const moveFactorY = 3;
            
            // Розрахунок зміщення
            const moveX = (mouseX - windowWidth / 2) / moveFactorX;
            const moveY = (mouseY - windowHeight / 2) / moveFactorY;
            
            // Застосовуємо трансформацію
            tankImage.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
        });
    }

    // Паралакс-ефект для фонових елементів при прокрутці
    const parallaxBgs = document.querySelectorAll('.parallax-bg');
    
    function updateParallaxBg() {
        parallaxBgs.forEach(bg => {
            const scrollPosition = window.scrollY;
            const speed = bg.getAttribute('data-parallax-speed') || 0.2;
            
            bg.style.transform = `translateY(${scrollPosition * speed}px)`;
        });
    }
    
    window.addEventListener('scroll', updateParallaxBg);
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
        }
    }
}
