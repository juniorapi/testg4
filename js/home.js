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
    fixStreamThumbnails(); // Виправлення фонових зображень та стилів карток стримерів
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
    // Знаходимо контейнер для стримерів
    const streamersContainer = document.querySelector('.streamers-live-grid');
    if (!streamersContainer) return;

    // Отримуємо дані про стримерів онлайн з localStorage
    const liveStreamersJSON = localStorage.getItem('gua_live_streamers');
    let liveStreamers = [];
    
    if (liveStreamersJSON) {
        try {
            liveStreamers = JSON.parse(liveStreamersJSON);
        } catch (e) {
            console.error('Помилка при парсингу даних про стримерів', e);
        }
    }
    
    // Перевіряємо, коли останній раз оновлювались дані
    const lastUpdated = localStorage.getItem('gua_live_streamers_updated');
    const now = Date.now();
    
    // Якщо дані відсутні або старіші за 5 хвилин, генеруємо тимчасові
    if (!liveStreamers.length || !lastUpdated || (now - parseInt(lastUpdated)) > 5 * 60 * 1000) {
        // Генеруємо тимчасові дані про стримерів
        liveStreamers = generateDemoLiveStreamers();
        
        // Зберігаємо згенеровані дані
        localStorage.setItem('gua_live_streamers', JSON.stringify(liveStreamers));
        localStorage.setItem('gua_live_streamers_updated', now.toString());
    }
    
    // Відображаємо стримерів
    if (liveStreamers.length > 0) {
        // Очищаємо контейнер
        streamersContainer.innerHTML = '';
        
        // Сортуємо стримерів за кількістю глядачів
        liveStreamers.sort((a, b) => b.viewers - a.viewers);
        
        // Обмежуємо кількість стримерів до показу
        const streamersToShow = liveStreamers.slice(0, 3);
        
        // Перший стример буде featured
        if (streamersToShow.length > 0) {
            const featuredStreamer = streamersToShow[0];
            const featuredStreamHTML = `
                <div class="live-stream featured-stream">
                    <div class="stream-thumbnail">
                        <img src="img/stream-thumb-1.jpg" alt="Live стрім">
                        <div class="live-badge">LIVE</div>
                        <div class="viewers-count">
                            <i class="fas fa-eye"></i>
                            <span>${featuredStreamer.viewers}</span>
                        </div>
                    </div>
                    <div class="stream-info">
                        <div class="streamer-avatar">
                            <img src="${featuredStreamer.avatarUrl}" alt="${featuredStreamer.displayName}">
                            <div class="online-indicator"></div>
                        </div>
                        <div class="stream-details">
                            <h3 class="stream-title">${featuredStreamer.title}</h3>
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
            streamersContainer.innerHTML += featuredStreamHTML;
        }
        
        // Додаємо інших стримерів
        for (let i = 1; i < streamersToShow.length; i++) {
            const streamer = streamersToShow[i];
            const streamHTML = `
                <div class="live-stream">
                    <div class="stream-thumbnail">
                        <img src="img/stream-thumb-${(i % 2) + 1}.jpg" alt="Live стрім">
                        <div class="live-badge">LIVE</div>
                        <div class="viewers-count">
                            <i class="fas fa-eye"></i>
                            <span>${streamer.viewers}</span>
                        </div>
                    </div>
                    <div class="stream-info">
                        <div class="streamer-avatar">
                            <img src="${streamer.avatarUrl}" alt="${streamer.displayName}">
                            <div class="online-indicator"></div>
                        </div>
                        <div class="stream-details">
                            <h3 class="stream-title">${streamer.title}</h3>
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
            streamersContainer.innerHTML += streamHTML;
        }
        
        // Якщо менше 3 стримерів, додаємо офлайн-стримера
        if (streamersToShow.length < 3) {
            // Дані для офлайн-стримера
            const offlineStreamers = [
                {
                    name: "Firestormyo",
                    clan: "G3_UA",
                    avatar: "img/firestormyo.png",
                    twitch: "firestormyo",
                    telegram: "firestormyo"
                },
                {
                    name: "El_SlD",
                    clan: "G0_UA",
                    avatar: "img/el_sid.png",
                    twitch: "el_sld",
                    telegram: "ghosts_ua_official"
                },
                {
                    name: "INeSp1kI",
                    clan: "GO_UA",
                    avatar: "img/inesp1ki.png",
                    twitch: "inesp1ki",
                    telegram: "INeSp1kIWOT"
                }
            ];
            
            const offlineIndex = Math.floor(Math.random() * offlineStreamers.length);
            const offline = offlineStreamers[offlineIndex];
            
            const offlineHTML = `
                <div class="offline-streamer">
                    <div class="streamer-header">
                        <div class="streamer-avatar">
                            <img src="${offline.avatar}" alt="Аватар стримера">
                        </div>
                        <div class="streamer-info">
                            <h3>${offline.name}</h3>
                            <div class="clan-tag">${offline.clan}</div>
                            <div class="last-online">
                                <i class="fas fa-clock"></i>
                                <span>Остання трансляція: вчора</span>
                            </div>
                        </div>
                        <div class="social-links">
                            <a href="https://twitch.tv/${offline.twitch}" target="_blank" class="social-link twitch">
                                <i class="fab fa-twitch"></i>
                            </a>
                            <a href="https://t.me/${offline.telegram}" target="_blank" class="social-link telegram">
                                <i class="fab fa-telegram"></i>
                            </a>
                        </div>
                    </div>
                </div>
            `;
            streamersContainer.innerHTML += offlineHTML;
        }
    }
    
    // Виправляємо стилі після динамічного оновлення
    fixStreamThumbnails();
    
    // Періодичне оновлення кількості глядачів для анімації
    setInterval(() => {
        const viewerCounters = document.querySelectorAll('.viewers-count span');
        viewerCounters.forEach(counter => {
            const currentValue = parseInt(counter.textContent);
            if (!isNaN(currentValue)) {
                // Додаємо або віднімаємо випадкове число (1-5)
                const change = Math.floor(Math.random() * 5) + 1;
                // З ймовірністю 70% додаємо, 30% - віднімаємо
                const newValue = Math.random() > 0.3 
                    ? currentValue + change 
                    : Math.max(currentValue - change, 1);
                
                counter.textContent = newValue;
            }
        });
    }, 3000); // Оновлення кожні 3 секунди
}

/**
 * Генерує демо-дані про стримерів, які зараз в ефірі
 */
function generateDemoLiveStreamers() {
    // Дані про стримерів, з яких випадково вибираємо тих, хто "онлайн"
    const streamers = [
        { 
            id: 'mrexclusivel', 
            twitchId: 'mrexclusivel',
            displayName: 'MrExclusivel',
            avatarUrl: 'img/exclusivel.png',
            clan: 'G4_UA'
        },
        { 
            id: 'lazerok07', 
            twitchId: 'lazerok07',
            displayName: 'lazerok07',
            avatarUrl: 'img/lazerok07.png',
            clan: 'G4_UA'
        },
        { 
            id: 'iyouxin', 
            twitchId: 'iyouxin',
            displayName: 'iyouxin',
            avatarUrl: 'img/iyouxin.png',
            clan: 'G3_UA'
        },
        { 
            id: 'cs2_maincast', 
            twitchId: 'cs2_maincast',
            displayName: 'cs2_maincast',
            avatarUrl: 'img/cs2_maincast.png',
            clan: 'G_UA'
        },
        { 
            id: 'ykp_boih_wot', 
            twitchId: 'ykp_boih_wot',
            displayName: 'YKP_BOIH',
            avatarUrl: 'img/ykp_boih_wot.png',
            clan: 'G0_UA'
        },
        { 
            id: 'juniortv_gaming', 
            twitchId: 'juniortv_gaming',
            displayName: 'JuniorTV_Gaming',
            avatarUrl: 'img/jtv.png',
            clan: 'G4_UA'
        },
        { 
            id: 'inesp1ki', 
            twitchId: 'inesp1ki',
            displayName: 'INeSp1kI',
            avatarUrl: 'img/inesp1ki.png',
            clan: 'GO_UA'
        },
        { 
            id: 'el_sld', 
            twitchId: 'el_sld',
            displayName: 'El_SlD',
            avatarUrl: 'img/el_sid.png',
            clan: 'G0_UA'
        },
        { 
            id: 'firestormyo', 
            twitchId: 'firestormyo',
            displayName: 'Firestormyo',
            avatarUrl: 'img/firestormyo.png',
            clan: 'G3_UA'
        },
        { 
            id: 'vgostiua', 
            twitchId: 'vgostiua',
            displayName: 'vgostiua',
            avatarUrl: 'img/vgostiua.png',
            clan: 'G2_UA'
        }
    ];
    
    // Випадкові назви стримів
    const streamTitles = [
        "Рейтингові бої на Об'єкт 268/4 - прокачуємо ЛБЗ",
        "Турнірні тренування з командою",
        "Фарм срібла на преміум техніці",
        "Вечірній стрім - катаємо з глядачами",
        "Нова гілка британців - перші враження",
        "Кланові війни на Глобальній карті"
    ];
    
    // Випадково вибираємо 1-3 стримерів, які "онлайн"
    const liveCount = Math.floor(Math.random() * 3) + 1;
    const shuffled = [...streamers].sort(() => 0.5 - Math.random());
    const liveStreamers = shuffled.slice(0, liveCount);
    
    // Додаємо необхідні дані
    return liveStreamers.map(streamer => {
        return {
            ...streamer,
            title: streamTitles[Math.floor(Math.random() * streamTitles.length)],
            viewers: Math.floor(Math.random() * 450) + 50 // 50-500 глядачів
        };
    });
}

/**
 * Виправлення фонових зображень та стилів карток стримерів
 * Адаптовано для роботи з живими стримерами
 */
function fixStreamThumbnails() {
    // Знаходимо всі ескізи стримів
    const thumbnails = document.querySelectorAll('.stream-thumbnail img');
    
    // Якщо є битий фон, замінюємо його на фіксовані зображення
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('error', function() {
            // Якщо зображення битее, замінюємо його на фіксоване
            if (index === 0 || this.closest('.featured-stream')) {
                // Для головного (featured) стримера
                this.src = 'img/featured-stream-bg.jpg';
            } else {
                // Для інших стримерів
                this.src = `img/stream-thumb-${(index % 3) + 1}.jpg`;
            }
        });
        
       // Також перевіряємо поточний src
        if (!thumbnail.src || thumbnail.src === 'data:,' || thumbnail.src.endsWith('undefined')) {
            if (index === 0 || thumbnail.closest('.featured-stream')) {
                thumbnail.src = 'img/featured-stream-bg.jpg';
            } else {
                thumbnail.src = `img/stream-thumb-${(index % 3) + 1}.jpg`;
            }
        }
    });
    
    // Виправляємо стиль для ескізів стримів
    thumbnails.forEach(thumbnail => {
        thumbnail.style.objectFit = 'cover';
        thumbnail.style.width = '100%';
        thumbnail.style.height = '100%';
        
        // Переконуємося, що батьківський елемент має правильне відношення сторін
        const container = thumbnail.closest('.stream-thumbnail');
        if (container) {
            container.style.aspectRatio = '16 / 9';
            container.style.overflow = 'hidden';
        }
    });
    
    // Виправляємо стиль для лічильників глядачів
    const viewerCounters = document.querySelectorAll('.viewers-count');
    viewerCounters.forEach(counter => {
        counter.style.position = 'absolute';
        counter.style.bottom = '10px';
        counter.style.right = '10px';
        counter.style.background = 'rgba(0, 0, 0, 0.7)';
        counter.style.color = 'white';
        counter.style.padding = '3px 8px';
        counter.style.borderRadius = 'var(--radius-sm)';
        counter.style.fontSize = '12px';
        counter.style.display = 'flex';
        counter.style.alignItems = 'center';
        counter.style.gap = 'var(--space-xs)';
        counter.style.zIndex = '2';
        counter.style.maxWidth = '80px';
        counter.style.overflow = 'hidden';
        counter.style.whiteSpace = 'nowrap';
    });
    
    // Перевіряємо аватарки стримерів
    const avatars = document.querySelectorAll('.streamer-avatar img');
    avatars.forEach(avatar => {
        avatar.addEventListener('error', function() {
            // Якщо зображення аватарки битее, замінюємо на заглушку
            this.src = 'img/default-avatar.png';
        });
    });
}
