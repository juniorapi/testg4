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
    // Додаємо ініціалізацію відображення стримерів онлайн
    initLiveStreamers();
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
        const slides = Array.from(sliderContainer.querySelectorAll('.clan-card'));
        let currentSlide = 0;
        const slidesCount = slides.length;
        
        // Визначаємо кількість видимих слайдів залежно від ширини екрану
        const getVisibleSlidesCount = () => {
            if (window.innerWidth <= 576) return 1;
            if (window.innerWidth <= 992) return 2;
            return 3;
        };
        
        let slidesPerView = getVisibleSlidesCount();
        
        // Обчислюємо ширину одного слайда з урахуванням відступів
        const calculateSlideWidth = () => {
            // Отримуємо ширину контейнера
            const containerWidth = sliderContainer.offsetWidth;
            // Обчислюємо проміжок між слайдами
            const gap = parseInt(window.getComputedStyle(sliderContainer).gap) || 20;
            
            // Обчислюємо ширину слайда (з урахуванням gap)
            const slideWidth = (containerWidth - (gap * (slidesPerView - 1))) / slidesPerView;
            
            // Встановлюємо ширину для кожного слайда
            slides.forEach(slide => {
                slide.style.flexBasis = `${slideWidth}px`;
                slide.style.minWidth = `${slideWidth}px`;
            });
            
            return slideWidth + gap;
        };
        
        // Функція переходу до конкретного слайда
        function goToSlide(index) {
            if (index < 0) index = 0;
            const maxIndex = slidesCount - slidesPerView;
            if (index > maxIndex) index = maxIndex;
            
            currentSlide = index;
            
            // Розраховуємо ширину слайда
            const slideWidth = calculateSlideWidth();
            
            // Прокручуємо контейнер до потрібного слайда
            sliderContainer.scrollTo({
                left: slideWidth * currentSlide,
                behavior: 'smooth'
            });
            
            // Оновлюємо активну точку
            updateActiveDot();
            // Оновлюємо стан кнопок
            updateButtonsState();
        }
        
        // Функція оновлення точок
        function updateDots() {
            if (!sliderDots) return;
            
            sliderDots.innerHTML = ''; // Очищаємо всі існуючі точки
            
            // Визначаємо кількість точок
            const dotsCount = Math.max(1, slidesCount - slidesPerView + 1);
            
            for (let i = 0; i < dotsCount; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === currentSlide) dot.classList.add('active');
                
                dot.addEventListener('click', () => {
                    goToSlide(i);
                });
                
                sliderDots.appendChild(dot);
            }
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
        
        // Перевіряємо доступність кнопок
        function updateButtonsState() {
            prevButton.disabled = currentSlide === 0;
            nextButton.disabled = currentSlide >= slidesCount - slidesPerView;
            
            prevButton.style.opacity = prevButton.disabled ? '0.5' : '1';
            nextButton.style.opacity = nextButton.disabled ? '0.5' : '1';
        }
        
        // Функція для оновлення слайдера при зміні розміру вікна
        function handleResize() {
            const newSlidesPerView = getVisibleSlidesCount();
            
            // Якщо змінилася кількість видимих слайдів, оновлюємо точки
            if (newSlidesPerView !== slidesPerView) {
                slidesPerView = newSlidesPerView;
                updateDots();
            }
            
            // Переходимо до поточного слайду з новими розмірами
            calculateSlideWidth();
            goToSlide(currentSlide);
        }
        
        // Ініціалізуємо слайдер
        calculateSlideWidth();
        updateDots();
        updateButtonsState();
        
        // Додаємо обробник зміни розміру вікна
        window.addEventListener('resize', handleResize);
    }
}

/**
 * Ініціалізація кнопки відтворення відео
 */
function initPlayButton() {
    const mediaCard = document.querySelector('.media-card');
    const playButton = document.querySelector('.media-overlay .play-button');
    
    if (mediaCard && playButton) {
        playButton.addEventListener('click', function() {
            // Створюємо модальне вікно для відтворення відео
            const videoModal = document.createElement('div');
            videoModal.className = 'video-modal';
            videoModal.innerHTML = `
                <div class="video-modal-content">
                    <button class="video-modal-close"><i class="fas fa-times"></i></button>
                    <div class="video-container">
                        <!-- Вставляємо YouTube iframe з автовідтворенням і без елементів керування -->
                        <iframe src="https://www.youtube.com/embed/YShh-G6dL4A?autoplay=1&controls=0&disablekb=1&rel=0&showinfo=0" 
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                allowfullscreen>
                        </iframe>
                    </div>
                </div>
            `;
            
            document.body.appendChild(videoModal);
            document.body.style.overflow = 'hidden'; // Блокуємо прокрутку
            
            // Додаємо стилі для відео-модальника
            const style = document.createElement('style');
            style.textContent = `
                .video-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.9);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.3s;
                }
                .video-modal-content {
                    position: relative;
                    width: 80%;
                    max-width: 900px;
                    background: #000;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 0 30px rgba(0, 0, 0, 0.8);
                }
                .video-modal-close {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: rgba(0, 0, 0, 0.5);
                    border: none;
                    color: white;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    cursor: pointer;
                    z-index: 10;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.3s;
                }
                .video-modal-close:hover {
                    background: rgba(227, 41, 39, 0.8);
                }
                .video-container {
                    position: relative;
                    padding-bottom: 56.25%; /* 16:9 */
                    height: 0;
                    overflow: hidden;
                }
                .video-container iframe {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border: 0;
                }
            `;
            document.head.appendChild(style);
            
            // Анімуємо появу модального вікна
            setTimeout(() => {
                videoModal.style.opacity = '1';
            }, 10);
            
            // Додаємо обробник для закриття модального вікна
            const closeButton = videoModal.querySelector('.video-modal-close');
            if (closeButton) {
                closeButton.addEventListener('click', function() {
                    videoModal.style.opacity = '0';
                    setTimeout(() => {
                        videoModal.remove();
                        document.body.style.overflow = ''; // Знову дозволяємо прокрутку
                    }, 300);
                });
            }
            
            // Також закриваємо при кліку за межами контенту
            videoModal.addEventListener('click', function(e) {
                if (e.target === videoModal) {
                    closeButton.click();
                }
            });
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

/**
 * Ініціалізація відображення стримерів онлайн на головній сторінці
 */
function initLiveStreamers() {
    const streamersContainer = document.querySelector('.streamers-live-grid');
    if (!streamersContainer) return;
    
    // Отримуємо стримерів онлайн з localStorage
    const liveStreamersData = localStorage.getItem('gua_live_streamers');
    const lastUpdated = localStorage.getItem('gua_live_streamers_updated');
    
    if (liveStreamersData && lastUpdated) {
        try {
            const liveStreamers = JSON.parse(liveStreamersData);
            const updateTime = parseInt(lastUpdated);
            const currentTime = Date.now();
            
            // Перевіряємо, чи дані не застарілі (не старше 5 хвилин)
            if (currentTime - updateTime < 5 * 60 * 1000 && liveStreamers.length > 0) {
                updateLiveStreamersSection(streamersContainer, liveStreamers);
                return;
            }
        } catch (e) {
            console.error('Помилка при обробці даних стримерів:', e);
        }
    }
    
    // Якщо даних немає або вони застарілі, використовуємо демо-дані
    useDemoStreamers(streamersContainer);
}

/**
 * Оновлення секції стримерів на головній сторінці
 */
function updateLiveStreamersSection(container, liveStreamers) {
    // Очищаємо контейнер від демо-стримерів
    container.innerHTML = '';
    
    // Якщо немає стримерів онлайн, показуємо повідомлення
    if (liveStreamers.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: span 12; text-align: center; padding: 50px;">
                <div style="font-size: 48px; color: var(--text-muted); margin-bottom: 20px;">
                    <i class="fas fa-video-slash"></i>
                </div>
                <h3 style="margin-bottom: 10px;">Наразі немає активних стримів</h3>
                <p style="color: var(--text-secondary); max-width: 500px; margin: 0 auto 20px;">
                    Наші стримери зараз не в ефірі. Слідкуйте за розкладом або перегляньте список всіх стримерів.
                </p>
                <a href="streamers.html" class="btn btn-primary">Всі стримери</a>
            </div>
        `;
        return;
    }
    
    // Сортуємо стримерів за кількістю глядачів (спочатку з найбільшою)
    liveStreamers.sort((a, b) => (b.streamData?.viewers || 0) - (a.streamData?.viewers || 0));
    
    // Визначаємо, хто буде featured стример (перший в списку)
    const featuredStreamer = liveStreamers[0];
    
    // Створюємо HTML для featured стримера
    const featuredStreamHTML = `
        <div class="live-stream featured-stream">
            <div class="stream-thumbnail">
                <img src="img/stream-thumb-1.jpg" alt="${featuredStreamer.displayName} стрім">
                <div class="live-badge">LIVE</div>
                <div class="viewers-count">
                    <i class="fas fa-eye"></i>
                    <span>${featuredStreamer.streamData?.viewers || 0}</span>
                </div>
            </div>
            <div class="stream-info">
                <div class="streamer-avatar">
                    <img src="${featuredStreamer.avatarUrl}" alt="${featuredStreamer.displayName}">
                    <div class="online-indicator"></div>
                </div>
                <div class="stream-details">
                    <h3 class="stream-title">${featuredStreamer.streamData?.title || 'Стрім без назви'}</h3>
                    <div class="streamer-name">
                        <span>${featuredStreamer.displayName}</span>
                        <span class="clan-tag">${featuredStreamer.clan}</span>
                    </div>
                </div>
                <a href="https://twitch.tv/${featuredStreamer.twitchId}" target="_blank" class="watch-link">
                    <i class="fab fa-twitch"></i>
                    <span>Дивитися</span>
                </a>
            </div>
        </div>
    `;
    
    // Додаємо featured стримера
    container.innerHTML = featuredStreamHTML;
    
    // Додаємо решту стримерів (максимум 2 для балансу секції)
    const maxRegularStreamers = Math.min(2, liveStreamers.length - 1);
    for (let i = 1; i <= maxRegularStreamers; i++) {
        const streamer = liveStreamers[i];
        
        const streamerHTML = `
            <div class="live-stream">
                <div class="stream-thumbnail">
                    <img src="img/stream-thumb-${i + 1}.jpg" alt="${streamer.displayName} стрім">
                    <div class="live-badge">LIVE</div>
                    <div class="viewers-count">
                        <i class="fas fa-eye"></i>
                        <span>${streamer.streamData?.viewers || 0}</span>
                    </div>
                </div>
                <div class="stream-info">
                    <div class="streamer-avatar">
                        <img src="${streamer.avatarUrl}" alt="${streamer.displayName}">
                        <div class="online-indicator"></div>
                    </div>
                    <div class="stream-details">
                        <h3 class="stream-title">${streamer.streamData?.title || 'Стрім без назви'}</h3>
                        <div class="streamer-name">
                            <span>${streamer.displayName}</span>
                            <span class="clan-tag">${streamer.clan}</span>
                        </div>
                    </div>
                    <a href="https://twitch.tv/${streamer.twitchId}" target="_blank" class="watch-link">
                        <i class="fab fa-twitch"></i>
                        <span>Дивитися</span>
                    </a>
                </div>
            </div>
        `;
        
        container.innerHTML += streamerHTML;
    }
    
    // Якщо є місце, додаємо offline стример для балансу сітки (якщо є менше 2 додаткових стримерів)
    if (maxRegularStreamers < 2) {
        const offlineHTML = `
            <div class="offline-streamer">
                <div class="streamer-header">
                    <div class="streamer-avatar">
                        <img src="img/streamer-3.jpg" alt="Офлайн стример">
                    </div>
                    <div class="streamer-info">
                        <h3>LightTank_Girl</h3>
                        <div class="clan-tag">G4_UA</div>
                        <div class="last-online">
                            <i class="fas fa-clock"></i>
                            <span>Остання трансляція: вчора</span>
                        </div>
                    </div>
                    <div class="social-links">
                        <a href="https://twitch.tv/" target="_blank" class="social-link">
                            <i class="fab fa-twitch"></i>
                        </a>
                        <a href="https://youtube.com/" target="_blank" class="social-link">
                            <i class="fab fa-youtube"></i>
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML += offlineHTML;
    }
}

/**
 * Показує демо-стримерів, якщо немає реальних даних
 */
function useDemoStreamers(container) {
    // Залишаємо контейнер з демо-даними, які вже є в HTML
    console.log('Використання демо-даних для стримерів на головній сторінці');
}
