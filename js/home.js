/**
 * JavaScript файл для інтерактивних елементів головної сторінки G_UA Alliance
 */

document.addEventListener('DOMContentLoaded', function() {
    // Ініціалізація всіх функцій для головної сторінки
    initSlider();
    initPlayButton();
    init3DEffect();
    initCountAnimation();
    initLiveDemo();
});

/**
 * Ініціалізація слайдера кланів
 */
function initSlider() {
    const sliderContainer = document.querySelector('.clans-slider-container');
    const prevButton = document.querySelector('.slider-arrow.prev');
    const nextButton = document.querySelector('.slider-arrow.next');
    const sliderDots = document.querySelector('.slider-dots');
    
    if (sliderContainer && prevButton && nextButton) {
        // Отримуємо всі клан-карточки
        const slides = sliderContainer.querySelectorAll('.clan-card');
        const slideWidth = slides[0]?.offsetWidth + 20; // Ширина слайда + gap
        let currentSlide = 0;
        const slidesCount = slides.length;
        
        // Створюємо точки індикатора слайдів
        if (sliderDots) {
            for (let i = 0; i < slidesCount; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                
                dot.addEventListener('click', () => {
                    goToSlide(i);
                });
                
                sliderDots.appendChild(dot);
            }
        }
        
        // Функція переходу до конкретного слайда
        function goToSlide(index) {
            if (index < 0) index = 0;
            if (index >= slidesCount) index = slidesCount - 1;
            
            currentSlide = index;
            
            // Прокручуємо контейнер
            if (window.innerWidth > 992) {
                sliderContainer.scrollTo({
                    left: slideWidth * currentSlide,
                    behavior: 'smooth'
                });
            } else {
                slides[currentSlide].scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'start'
                });
            }
            
            // Оновлюємо активну точку
            updateActiveDot();
        }
        
        // Функція оновлення активної точки
        function updateActiveDot() {
            const dots = sliderDots.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                if (index === currentSlide) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
        
        // Обробники кнопок
        prevButton.addEventListener('click', () => {
            goToSlide(currentSlide - 1);
        });
        
        nextButton.addEventListener('click', () => {
            goToSlide(currentSlide + 1);
        });
        
        // Обробник свайпів для мобільних
        let touchStartX = 0;
        let touchEndX = 0;
        
        sliderContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        sliderContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            
            if (touchEndX < touchStartX - swipeThreshold) {
                goToSlide(currentSlide + 1); // Свайп вліво
            } else if (touchEndX > touchStartX + swipeThreshold) {
                goToSlide(currentSlide - 1); // Свайп вправо
            }
        }
    }
}

/**
 * Ініціалізація кнопки відтворення відео
 */
function initPlayButton() {
    const mediaCard = document.querySelector('.media-card');
    const playButton = document.querySelector('.play-button');
    
    if (mediaCard && playButton) {
        playButton.addEventListener('click', function() {
            // Тут можна додати код для відтворення відео
            // Наприклад, створити модальне вікно з відео
            alert('Відтворення відео демонстрації альянсу');
        });
    }
}

/**
 * Ініціалізація 3D ефектів для карток
 */
function init3DEffect() {
    // 3D ефект для карток при наведенні
    const cards = document.querySelectorAll('.clan-card, .live-stream, .offline-streamer');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            // Перевіряємо, чи не мобільний пристрій
            if (window.innerWidth > 992) {
                const cardRect = this.getBoundingClientRect();
                
                // Отримуємо позицію миші відносно центру картки
                const cardCenterX = cardRect.left + cardRect.width / 2;
                const cardCenterY = cardRect.top + cardRect.height / 2;
                
                const mouseX = e.clientX - cardCenterX;
                const mouseY = e.clientY - cardCenterY;
                
                // Розраховуємо кут нахилу (максимум ±10 градусів)
                const maxTilt = 10;
                const tiltX = (mouseY / (cardRect.height / 2)) * maxTilt * -1;
                const tiltY = (mouseX / (cardRect.width / 2)) * maxTilt;
                
                // Застосовуємо 3D трансформацію
                this.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
                
                // Додаємо ефект світла, що рухається за курсором
                const glare = `radial-gradient(circle at ${e.clientX - cardRect.left}px ${e.clientY - cardRect.top}px, rgba(255, 255, 255, 0.1), transparent 50%)`;
                this.style.backgroundImage = glare;
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.backgroundImage = '';
        });
    });
}

/**
 * Ініціалізація анімації лічильників
 */
function initCountAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateCount(element, targetValue) {
        let currentValue = 0;
        const duration = 2000; // 2 секунди
        const interval = 20; // Оновлення кожні 20мс
        const steps = duration / interval;
        const increment = targetValue / steps;
        
        const timer = setInterval(() => {
            currentValue += increment;
            
            if (currentValue >= targetValue) {
                currentValue = targetValue;
                clearInterval(timer);
            }
            
            if (Number.isInteger(targetValue)) {
                element.textContent = Math.floor(currentValue);
            } else {
                element.textContent = targetValue;
            }
        }, interval);
    }
    
    // Функція перевірки, чи елемент у зоні видимості
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= window.innerHeight * 0.8 &&
            rect.bottom >= 0
        );
    }
    
    // Функція запуску анімації для видимих лічильників
    function checkCounters() {
        statNumbers.forEach(stat => {
            if (isElementInViewport(stat) && !stat.getAttribute('data-animated')) {
                const targetValue = stat.textContent.replace(/\+/g, '');
                const plusSign = stat.textContent.includes('+') ? '+' : '';
                
                animateCount(stat, parseInt(targetValue));
                stat.setAttribute('data-animated', 'true');
                
                // Додаємо "+" назад після завершення анімації
                if (plusSign) {
                    setTimeout(() => {
                        stat.textContent += plusSign;
                    }, 2000);
                }
            }
        });
    }
    
    // Перевіряємо при завантаженні
    checkCounters();
    
    // Слухаємо подію прокрутки
    window.addEventListener('scroll', checkCounters);
}

/**
 * Ініціалізація демонстрації стримерів онлайн
 */
function initLiveDemo() {
    // Тут можна додати функціонал для демонстрації стримерів онлайн
    // Наприклад, отримання даних про стримерів і оновлення UI
    
    // Приклад: лічильник глядачів, що змінюється
    const viewerCounts = document.querySelectorAll('.viewers-count span');
    
    if (viewerCounts.length > 0) {
        // Функція випадкового оновлення кількості глядачів
        setInterval(() => {
            viewerCounts.forEach(counter => {
                const currentValue = parseInt(counter.textContent);
                // Додаємо або віднімаємо випадкове число (1-5)
                const change = Math.floor(Math.random() * 5) + 1;
                // З ймовірністю 70% додаємо, 30% - віднімаємо
                const newValue = Math.random() > 0.3 
                    ? currentValue + change 
                    : Math.max(currentValue - change, 1);
                
                counter.textContent = newValue;
            });
        }, 3000); // Оновлення кожні 3 секунди
    }
}
