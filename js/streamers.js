/**
 * Оновлений скрипт для роботи зі стримерами альянсу G_UA
 * З підтримкою анімацій, статусів, 3D ефектів та завантаженням стримерів з JSON
 * Включає інтеграцію з Twitch API
 */

document.addEventListener('DOMContentLoaded', function() {
    // Ініціалізуємо всі функції
    initDropdowns();
    initFilterTabs();
    initModals();
    loadStreamersData();
});

/**
 * Глобальна змінна для зберігання даних стримерів
 */
let streamers = [];

/**
 * Завантаження даних стримерів з JSON-файлу
 */
function loadStreamersData() {
    // Показуємо стан завантаження
    const streamersContainer = document.getElementById('streamers-container');
    if (streamersContainer) {
        streamersContainer.innerHTML = `
            <div class="loading-state">
                <div class="loader"></div>
                <p class="loading-message">Завантаження стримерів...</p>
            </div>
        `;
    }
    
    // Завантажуємо JSON з даними (з тієї ж директорії)
    fetch('js/streamers.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Не вдалося завантажити дані стримерів');
            }
            return response.json();
        })
        .then(data => {
            // Зберігаємо дані у глобальну змінну
            streamers = data.streamers || [];
            // Створюємо картки стримерів
            loadStreamers();
        })
        .catch(error => {
            console.error('Помилка завантаження даних стримерів:', error);
            
            // Якщо неможливо завантажити JSON, показуємо повідомлення про помилку
            if (streamersContainer) {
                streamersContainer.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <h3 class="empty-title">Помилка завантаження</h3>
                        <p class="empty-message">Не вдалося завантажити дані стримерів. Перевірте наявність файлу js/streamers.json</p>
                        <button class="btn btn-primary" onclick="location.reload()">Оновити сторінку</button>
                    </div>
                `;
            }
        });
}

/**
 * Ініціалізація випадаючих списків
 */
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.filter-dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (toggle && menu) {
            // Відкриття/закриття випадаючого списку
            toggle.addEventListener('click', function() {
                this.classList.toggle('active');
                menu.classList.toggle('show');
            });
            
            // Вибір елементу списку
            const items = menu.querySelectorAll('.dropdown-item');
            items.forEach(item => {
                item.addEventListener('click', function() {
                    // Оновлюємо активний елемент
                    items.forEach(i => i.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Оновлюємо текст кнопки
                    toggle.querySelector('span').textContent = this.textContent;
                    
                    // Закриваємо меню
                    toggle.classList.remove('active');
                    menu.classList.remove('show');
                    
                    // Застосовуємо фільтр
                    const value = this.getAttribute('data-value');
                    if (toggle.id === 'clanFilter') {
                        filterByClan(value);
                    } else if (toggle.id === 'sortFilter') {
                        sortStreamers(value);
                    }
                });
            });
            
            // Закриваємо меню при кліку поза ним
            document.addEventListener('click', function(e) {
                if (!dropdown.contains(e.target)) {
                    toggle.classList.remove('active');
                    menu.classList.remove('show');
                }
            });
        }
    });
}

/**
 * Ініціалізація вкладок фільтрів
 */
function initFilterTabs() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Оновлюємо активну вкладку
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Застосовуємо фільтр
            const filter = this.getAttribute('data-filter');
            filterByStatus(filter);
        });
    });
}

/**
 * Ініціалізація модальних вікон
 */
function initModals() {
    // Модальне вікно з вимогами
    const requirementsBtn = document.querySelector('.open-requirements');
    const requirementsModal = document.getElementById('requirementsModal');
    
    if (requirementsBtn && requirementsModal) {
        requirementsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            requirementsModal.classList.add('active');
            document.body.classList.add('modal-open');
        });
        
        // Закриття модального вікна
        const closeBtn = requirementsModal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                requirementsModal.classList.remove('active');
                document.body.classList.remove('modal-open');
            });
        }
        
        // Закриття модального вікна при кліку на оверлей
        requirementsModal.addEventListener('click', function(e) {
            if (e.target === requirementsModal) {
                requirementsModal.classList.remove('active');
                document.body.classList.remove('modal-open');
            }
        });
    }
}

/**
 * Завантаження стримерів та перевірка їх статусу
 */
function loadStreamers() {
    const streamersContainer = document.getElementById('streamers-container');
    
    if (streamersContainer) {
        // Очищуємо контейнер
        streamersContainer.innerHTML = '';
        
        // Перевіряємо, чи є стримери
        if (streamers.length === 0) {
            streamersContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">
                        <i class="fas fa-users-slash"></i>
                    </div>
                    <h3 class="empty-title">Стримерів не знайдено</h3>
                    <p class="empty-message">На даний момент в альянсі немає зареєстрованих стримерів.</p>
                </div>
            `;
            return;
        }
        
        // Додаємо стримерів з каскадною анімацією
        streamers.forEach((streamer, index) => {
            setTimeout(() => {
                const card = createStreamerCard(streamer);
                streamersContainer.appendChild(card);
                
                // Додаємо 3D ефект при наведенні
                initializeCard3DEffect(card);
            }, index * 100);
        });
        
        // Перевіряємо статус стримерів після додавання всіх карток
        setTimeout(() => {
            checkStreamStatus();
            
            // Запускаємо таймер для періодичної перевірки статусу
            setInterval(checkStreamStatus, 60000); // Кожну хвилину
        }, streamers.length * 100 + 200);
    }
}

/**
 * Створення картки стримера
 */
function createStreamerCard(streamer) {
    const card = document.createElement('div');
    card.className = 'streamer-card';
    card.id = `streamer-${streamer.id}`;
    card.setAttribute('data-live', 'false');
    card.setAttribute('data-clan', streamer.clan);
    
    // Визначаємо, чи є ім'я довгим
    const nameClass = streamer.displayName.length > 12 ? 'streamer-name long-name' : 'streamer-name';

    // Формуємо посилання на YouTube
    let youtubeUrl = '';
    if (streamer.youtubeType === 'channel') {
        youtubeUrl = `https://youtube.com/channel/${streamer.youtube}`;
    } else if (streamer.youtubeType === 'UC') {
        youtubeUrl = `https://youtube.com/channel/${streamer.youtube}`;
    } else {
        if (streamer.youtube === 'none' || streamer.youtube === '') {
            youtubeUrl = '#';
        } else if (streamer.youtube.startsWith('@')) {
            youtubeUrl = `https://youtube.com/${streamer.youtube}`;
        } else {
            youtubeUrl = `https://youtube.com/@${streamer.youtube}`;
        }
    }
    
    // Формуємо посилання на Telegram
    let telegramUrl = '';
    if (streamer.telegram === 'none' || streamer.telegram === '') {
        telegramUrl = '#';
    } else if (streamer.telegram.startsWith('+') || streamer.telegram.startsWith('https://')) {
        telegramUrl = `https://t.me/${streamer.telegram}`;
    } else {
        telegramUrl = `https://t.me/${streamer.telegram}`;
    }
    
    // HTML для картки стримера
    card.innerHTML = `
        <div class="streamer-header">
            <div class="streamer-avatar">
                <img src="${streamer.avatarUrl}" alt="${streamer.displayName}">
            </div>
            <div class="streamer-info">
                <h3 class="${nameClass}">${streamer.displayName}</h3>
                <div class="clan-tag">${streamer.clan}</div>
                <div class="stream-status">
                    <div class="status-offline">Офлайн</div>
                </div>
            </div>
        </div>
        <div class="stream-info" style="display: none;">
            <div class="stream-title"></div>
            <div class="stream-meta">
                <div class="stream-game-info">
                    <div class="stream-category">
                        <i class="fas fa-gamepad"></i>
                        <span></span>
                    </div>
                    <div class="viewers-count">
                        <i class="fas fa-user"></i>
                        <span></span>
                    </div>
                </div>
                <div class="stream-actions">
                    <a href="https://twitch.tv/${streamer.twitchId}" class="watch-link" target="_blank">
                        <i class="fab fa-twitch"></i>
                        <span>Дивитися</span>
                    </a>
                </div>
            </div>
        </div>
        <div class="streamer-social-links">
            <a href="https://twitch.tv/${streamer.twitchId}" class="social-link twitch" target="_blank" title="Twitch канал">
                <i class="fab fa-twitch"></i>
            </a>
            ${youtubeUrl !== '#' ? `
            <a href="${youtubeUrl}" class="social-link youtube" target="_blank" title="YouTube канал">
                <i class="fab fa-youtube"></i>
            </a>` : ''}
            ${telegramUrl !== '#' ? `
            <a href="${telegramUrl}" class="social-link telegram" target="_blank" title="Telegram канал">
                <i class="fab fa-telegram"></i>
            </a>` : ''}
        </div>
        <div class="live-indicator">LIVE</div>
    `;
    
    // Додаємо анімацію появи картки
    card.style.animation = 'fadeInUp 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards';
    card.style.animationDelay = '0.1s';
    
    return card;
}

/**
 * Ініціалізація 3D ефекту при наведенні на картку
 */
function initializeCard3DEffect(card) {
    card.addEventListener('mousemove', function(e) {
        // Пропускаємо ефект на мобільних пристроях
        if (window.innerWidth < 992) return;
        
        const cardRect = this.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top + cardRect.height / 2;
        
        // Розрахунок позиції миші відносно центру картки
        const mouseX = e.clientX - cardCenterX;
        const mouseY = e.clientY - cardCenterY;
        
        // Максимальний кут повороту
        const maxRotation = 5;
        
        // Розрахунок кутів повороту з нормалізацією 
        const rotateY = (mouseX / (cardRect.width / 2)) * maxRotation;
        const rotateX = -((mouseY / (cardRect.height / 2)) * maxRotation);
        
        // Застосування трансформації з плавністю
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        
        // Рухаємо світло за курсором
        const intensity = 0.2;
        const light = `radial-gradient(circle at ${e.clientX - cardRect.left}px ${e.clientY - cardRect.top}px, rgba(255, 255, 255, ${intensity}), transparent 40%)`;
        
        // Додаємо світловий ефект
        card.style.background = `linear-gradient(135deg, rgba(20, 20, 20, 0.7), rgba(15, 15, 15, 0.7)), ${light}`;
    });
    
    // Повернення в початковий стан при виході курсору
    card.addEventListener('mouseleave', function() {
        this.style.transform = '';
        this.style.background = '';
    });
    
    // Ефект натискання
    card.addEventListener('mousedown', function() {
        this.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(0.98)`;
    });
    
    // Повернення після натискання
    card.addEventListener('mouseup', function() {
        this.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1.02)`;
    });
}

/**
 * Перевірка статусу стримерів через API Twitch
 */
function checkStreamStatus() {
    // Налаштування API Twitch
    const clientId = 'gp762nuuoqcoxypju8c569th9wz7q5'; // Замініть на ваш Client ID
    const accessToken = '0b09xd33shszp6496w5m8f03yalc8p'; // Замініть на ваш Access Token
    
    // Формуємо параметри запиту для кількох каналів одночасно
    const queryParams = streamers.map(streamer => `user_login=${streamer.twitchId}`).join('&');
    
    // Видаляємо повідомлення про завантаження
    const loadingMessage = document.querySelector('.loading-state');
    if (loadingMessage) {
        loadingMessage.remove();
    }
    
    // Отримуємо дані про стріми з API
    fetch(`https://api.twitch.tv/helix/streams?${queryParams}`, {
        headers: {
            'Client-ID': clientId,
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`API error (streams): ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Створюємо мапу для швидкого пошуку каналів, які зараз в ефірі
        const liveChannels = {};
        
        // Лічильник онлайн-стримерів і масив нових стримерів (які щойно з'явились)
        let onlineCount = 0;
        const newlyOnlineStreamers = [];
        const allLiveStreamers = []; // Новий масив для всіх лайв стримерів
        
        // Заповнюємо мапу каналами, які зараз онлайн
        if (data.data && data.data.length > 0) {
            data.data.forEach(stream => {
                const streamerName = stream.user_login.toLowerCase();
                
                liveChannels[streamerName] = {
                    title: stream.title,
                    viewers: stream.viewer_count,
                    category: stream.game_name || 'Unknown',
                    startedAt: stream.started_at
                };
                
                // Перевіряємо, чи стример щойно з'явився в мережі
                const lastStatus = localStorage.getItem(`${streamerName}_status`);
                if (lastStatus === 'offline' || !lastStatus) {
                    // Знаходимо стример об'єкт за іменем
                    const streamerObj = streamers.find(s => s.twitchId.toLowerCase() === streamerName);
                    if (streamerObj) {
                        newlyOnlineStreamers.push({
                            ...streamerObj,
                            streamData: liveChannels[streamerName]
                        });
                        // Додаємо в масив всіх лайв стримерів
                        allLiveStreamers.push({
                            ...streamerObj,
                            streamData: liveChannels[streamerName]
                        });
                    }
                } else {
                    // Якщо стример вже був в мережі, також додаємо його в масив
                    const streamerObj = streamers.find(s => s.twitchId.toLowerCase() === streamerName);
                    if (streamerObj) {
                        allLiveStreamers.push({
                            ...streamerObj,
                            streamData: liveChannels[streamerName]
                        });
                    }
                }
                
                // Зберігаємо поточний статус
                localStorage.setItem(`${streamerName}_status`, 'online');
                
                onlineCount++;
            });
        }
        
        // Синхронізуємо інформацію про лайв стримерів
        syncLiveStreamers(allLiveStreamers);
        
        // Позначаємо як офлайн тих, хто не в ефірі зараз
        streamers.forEach(streamer => {
            if (!liveChannels[streamer.twitchId.toLowerCase()]) {
                localStorage.setItem(`${streamer.twitchId.toLowerCase()}_status`, 'offline');
            }
        });
        
        // Оновлюємо лічильник онлайн-стримерів у кнопці фільтра з анімацією
        const liveCount = document.querySelector('.live-count');
        if (liveCount) {
            // Якщо кількість змінилась, додаємо анімацію оновлення
            if (liveCount.textContent !== onlineCount.toString()) {
                liveCount.style.transform = 'scale(1.5)';
                setTimeout(() => {
                    liveCount.textContent = onlineCount;
                    setTimeout(() => {
                        liveCount.style.transform = '';
                    }, 150);
                }, 150);
            } else {
                liveCount.textContent = onlineCount;
            }
            
            // Якщо є онлайн-стримери, підсвічуємо кнопку
            const liveBtn = document.querySelector('.live-btn');
            if (liveBtn) {
                if (onlineCount > 0) {
                    liveBtn.classList.add('has-live');
                } else {
                    liveBtn.classList.remove('has-live');
                }
            }
        }
        
        // Оновлюємо дані для кожного стримера з затримкою для каскадного ефекту
        streamers.forEach((streamer, index) => {
            setTimeout(() => {
                const isLive = liveChannels[streamer.twitchId.toLowerCase()] !== undefined;
                const streamData = liveChannels[streamer.twitchId.toLowerCase()];
                
                // Оновлюємо картку стримера
                const streamerCard = document.getElementById(`streamer-${streamer.id}`);
                if (streamerCard) {
                    if (isLive) {
                        // Стример онлайн
                        updateStreamerCardToLive(streamerCard, streamData);
                        
                        // Зберігаємо останній онлайн
                        localStorage.setItem(`streamer_${streamer.id}_last_online`, Date.now().toString());
                    } else {
                        // Стример офлайн
                        updateStreamerCardToOffline(streamerCard);
                    }
                }
            }, index * 100); // Затримка для каскадного ефекту
        });
        
        // Перевіряємо, чи активний фільтр "Зараз в ефірі"
        const activeLiveFilter = document.querySelector('.filter-tab[data-filter="live"].active');
        if (activeLiveFilter) {
            setTimeout(() => {
                filterByStatus('live');
            }, streamers.length * 100 + 100);
        }
        
        // Сортування стримерів з анімацією
        setTimeout(() => {
            sortStreamers('default');
        }, streamers.length * 100 + 200);
        
        // Показуємо сповіщення про нових стримерів в ефірі
        if (newlyOnlineStreamers.length > 0) {
            setTimeout(() => {
                showStreamNotification(newlyOnlineStreamers[0]);
            }, streamers.length * 100 + 300);
        }
    })
    .catch(error => {
        console.error('Помилка отримання даних Twitch API:', error);
        
        // Показуємо повідомлення про помилку
        const streamersContainer = document.getElementById('streamers-container');
        if (streamersContainer) {
            streamersContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <h3 class="empty-title">Помилка підключення до Twitch</h3>
                    <p class="empty-message">Не вдалося отримати дані про стріми. Перевірте ключі API Twitch або підключення до інтернету.</p>
                    <button class="btn btn-primary" onclick="location.reload()">
                        <i class="fas fa-sync"></i> Оновити сторінку
                    </button>
                </div>
            `;
        }
    });
}

/**
 * Оновлення картки стримера до стану "онлайн"
 */
function updateStreamerCardToLive(card, streamData) {
    // Додаємо клас live з анімацією
    card.classList.remove('recent');
    card.setAttribute('data-live', 'true');
    
    // Плавна анімація зміни статусу
    const currentTransform = card.style.transform;
    card.style.transform = `${currentTransform || ''} scale(1.05)`;
    
    setTimeout(() => {
        card.classList.add('live');
        setTimeout(() => {
            card.style.transform = currentTransform || '';
        }, 300);
    }, 100);
    
    // Замінюємо статус на категорію та глядачів у верхній частині
    const statusElement = card.querySelector('.stream-status');
    if (statusElement) {
        statusElement.style.opacity = 0;
        setTimeout(() => {
            statusElement.innerHTML = `
                <div class="stream-category-badge">
                    <i class="fas fa-gamepad"></i>
                    <span>${streamData.category}</span>
                </div>
                <div class="viewers-badge">
                    <i class="fas fa-user"></i>
                    <span>${streamData.viewers.toLocaleString('uk-UA')}</span>
                </div>
            `;
            statusElement.style.opacity = 1;
        }, 300);
    }
    
    // Відображаємо інформацію про стрім, але без дублювання категорії та глядачів
    const streamInfo = card.querySelector('.stream-info');
    if (streamInfo) {
        streamInfo.style.display = 'block';
        streamInfo.style.opacity = 0;
        streamInfo.style.transform = 'translateY(20px)';
        
        // Заповнюємо тільки назву стріму
        streamInfo.querySelector('.stream-title').textContent = streamData.title;
        
        // Приховуємо блок з інформацією про гру та глядачів
        const gameInfoBlock = streamInfo.querySelector('.stream-game-info');
        if (gameInfoBlock) {
            gameInfoBlock.style.display = 'none';
        }
        
        // Анімація появи інформації про стрім
        setTimeout(() => {
            streamInfo.style.opacity = 1;
            streamInfo.style.transform = 'translateY(0)';
        }, 200);
    }
    
    // Додаємо клас live до іконки Twitch
    const twitchIcon = card.querySelector('.social-link.twitch');
    if (twitchIcon) {
        twitchIcon.classList.add('live');
        twitchIcon.title = 'Дивитись стрім';
        
        // Додаємо анімацію при зміні статусу
        twitchIcon.style.transform = 'scale(1.2)';
        setTimeout(() => {
            twitchIcon.style.transform = '';
        }, 500);
    }
    
    // Показуємо індикатор LIVE
    const liveIndicator = card.querySelector('.live-indicator');
    if (liveIndicator) {
        liveIndicator.style.display = 'flex';
    }
}

/**
 * Оновлення картки стримера до стану "офлайн"
 */
function updateStreamerCardToOffline(card) {
    const streamerId = card.id.replace('streamer-', '');
    card.setAttribute('data-live', 'false');
    
    // Видаляємо клас live з анімацією
    if (card.classList.contains('live')) {
        const currentTransform = card.style.transform;
        card.style.transform = `${currentTransform || ''} scale(0.95)`;
        
        setTimeout(() => {
            card.classList.remove('live');
            setTimeout(() => {
                card.style.transform = currentTransform || '';
            }, 300);
        }, 100);
    }
    
    // Приховуємо інформацію про стрім з анімацією
    const streamInfo = card.querySelector('.stream-info');
    if (streamInfo && streamInfo.style.display !== 'none') {
        streamInfo.style.opacity = 0;
        streamInfo.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            streamInfo.style.display = 'none';
            
            // Повертаємо видимість блоку з інформацією про гру та глядачів
            const gameInfoBlock = streamInfo.querySelector('.stream-game-info');
            if (gameInfoBlock) {
                gameInfoBlock.style.display = '';
            }
        }, 300);
    }
    
    // Видаляємо клас live з іконки Twitch
    const twitchIcon = card.querySelector('.social-link.twitch');
    if (twitchIcon) {
        twitchIcon.classList.remove('live');
        twitchIcon.title = 'Twitch канал';
    }
    
    // Ховаємо індикатор LIVE
    const liveIndicator = card.querySelector('.live-indicator');
    if (liveIndicator) {
        liveIndicator.style.display = 'none';
    }
    
    // Повертаємо звичайний статус офлайн
    const statusElement = card.querySelector('.stream-status');
    if (statusElement) {
        statusElement.style.opacity = 0;
        setTimeout(() => {
            statusElement.innerHTML = `<div class="status-offline">Офлайн</div>`;
            statusElement.style.opacity = 1;
        }, 300);
    }
    
    // Перевіряємо, чи був стример недавно онлайн
    const lastOnline = localStorage.getItem(`streamer_${streamerId}_last_online`);
    if (lastOnline) {
        const now = Date.now();
        const diff = now - parseInt(lastOnline);
        
        // Якщо менше 2 годин тому, показуємо статус "недавно онлайн"
        if (diff < 2 * 60 * 60 * 1000) {
            card.classList.add('recent');
        } else {
            card.classList.remove('recent');
        }
    }
}

/**
 * Фільтрація стримерів за кланом
 */
function filterByClan(clan) {
    const streamerCards = document.querySelectorAll('.streamer-card');
    
    // Рахуємо кількість прихованих карток
    let hiddenCount = 0;
    
    streamerCards.forEach(card => {
        if (clan === 'all') {
            card.style.display = '';
            card.classList.remove('hidden-by-clan');
        } else {
            const cardClan = card.getAttribute('data-clan');
            if (cardClan === clan) {
                card.style.display = '';
                card.classList.remove('hidden-by-clan');
            } else {
                card.style.display = 'none';
                card.classList.add('hidden-by-clan');
                hiddenCount++;
            }
        }
    });
    
    // Перевіряємо, чи потрібно показати пустий стан
    checkEmptyState();
}

/**
 * Фільтрація стримерів за статусом
 */
function filterByStatus(status) {
    const streamerCards = document.querySelectorAll('.streamer-card');
    
    // Рахуємо кількість прихованих карток
    let hiddenCount = 0;
    let visibleCount = 0;
    
    streamerCards.forEach(card => {
        // Спочатку перевіряємо чи не прихований картка через фільтр клану
        const isHiddenByClan = card.classList.contains('hidden-by-clan');
        
        if (status === 'all') {
            if (!isHiddenByClan) {
                card.style.display = '';
                card.classList.remove('hidden-by-status');
                visibleCount++;
            }
        } else if (status === 'live') {
            if (card.classList.contains('live') && !isHiddenByClan) {
                card.style.display = '';
                card.classList.remove('hidden-by-status');
                visibleCount++;
            } else {
                card.style.display = 'none';
                card.classList.add('hidden-by-status');
                hiddenCount++;
            }
        } else if (status === 'recent') {
            if ((card.classList.contains('live') || card.classList.contains('recent')) && !isHiddenByClan) {
                card.style.display = '';
                card.classList.remove('hidden-by-status');
                visibleCount++;
            } else {
                card.style.display = 'none';
                card.classList.add('hidden-by-status');
                hiddenCount++;
            }
        }
    });
    
    // Перевіряємо, чи потрібно показати пустий стан
    checkEmptyState();
}

/**
 * Перевірка на пустий стан (коли всі стримери відфільтровані)
 */
function checkEmptyState() {
    const streamersContainer = document.getElementById('streamers-container');
    const visibleCards = Array.from(document.querySelectorAll('.streamer-card')).filter(card => {
        return card.style.display !== 'none';
    });
    
    // Видаляємо попередній empty-state, якщо він є
    const existingEmptyState = streamersContainer.querySelector('.empty-state');
    if (existingEmptyState) {
        existingEmptyState.remove();
    }
    
    // Якщо немає видимих карток, показуємо пустий стан
    if (visibleCards.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        
        emptyState.innerHTML = `
            <div class="empty-icon">
                <i class="fas fa-search"></i>
            </div>
            <h3 class="empty-title">Нічого не знайдено</h3>
            <p class="empty-message">Стримерів, що відповідають заданим критеріям, не знайдено</p>
            <button class="btn reset-filters">Скинути фільтри</button>
        `;
        
        // Додаємо обробник для кнопки скидання фільтрів
        const resetBtn = emptyState.querySelector('.reset-filters');
        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                // Скидаємо фільтр кланів
                const clanFilter = document.getElementById('clanFilter');
                if (clanFilter) {
                    clanFilter.querySelector('span').textContent = 'Всі клани';
                    document.querySelector('#clanFilterMenu .dropdown-item[data-value="all"]').click();
                }
                
                // Скидаємо фільтр статусу
                document.querySelector('.filter-tab[data-filter="all"]').click();
                
                // Скидаємо сортування
                const sortFilter = document.getElementById('sortFilter');
                if (sortFilter) {
                    sortFilter.querySelector('span').textContent = 'За замовчуванням';
                    document.querySelector('#sortFilterMenu .dropdown-item[data-value="default"]').click();
                }
            });
        }
        
        streamersContainer.appendChild(emptyState);
    }
}

/**
 * Сортування стримерів
 */
function sortStreamers(sortType) {
    const streamersContainer = document.getElementById('streamers-container');
    const streamerCards = Array.from(document.querySelectorAll('.streamer-card'));
    
    // Сортуємо картки
    streamerCards.sort((a, b) => {
        const aLive = a.classList.contains('live');
        const bLive = b.classList.contains('live');
        
        // За замовчуванням: спочатку онлайн, потім недавно онлайн
        if (sortType === 'default') {
            // Спочатку сортуємо за статусом (онлайн)
            if (aLive && !bLive) return -1;
            if (!aLive && bLive) return 1;
            
            const aRecent = a.classList.contains('recent');
            const bRecent = b.classList.contains('recent');
            
            // Потім за статусом "недавно"
            if (aRecent && !bRecent) return -1;
            if (!aRecent && bRecent) return 1;
            
            // Потім за кланом (G1_UA має пріоритет)
            const aClan = a.getAttribute('data-clan');
            const bClan = b.getAttribute('data-clan');
            
            const getClanPriority = (clan) => {
                const match = clan.match(/G(\d+)_UA/);
                return match ? parseInt(match[1]) : 999;
            };
            
            return getClanPriority(aClan) - getClanPriority(bClan);
        }
        // За іменем (А-Я)
        else if (sortType === 'name-asc') {
            const aName = a.querySelector('.streamer-name').textContent;
            const bName = b.querySelector('.streamer-name').textContent;
            return aName.localeCompare(bName, 'uk');
        }
        // За іменем (Я-А)
        else if (sortType === 'name-desc') {
            const aName = a.querySelector('.streamer-name').textContent;
            const bName = b.querySelector('.streamer-name').textContent;
            return bName.localeCompare(aName, 'uk');
        }
        // За кількістю глядачів (тільки для стримерів онлайн)
        else if (sortType === 'viewers') {
            // Спочатку онлайн стримери
            if (aLive && !bLive) return -1;
            if (!aLive && bLive) return 1;
            
            // Якщо обидва онлайн, порівнюємо кількість глядачів
            if (aLive && bLive) {
                const aViewers = parseInt(a.querySelector('.viewers-badge span').textContent.replace(/\D/g, '')) || 0;
                const bViewers = parseInt(b.querySelector('.viewers-badge span').textContent.replace(/\D/g, '')) || 0;
                return bViewers - aViewers; // Спадання
            }
            
            // Якщо обидва офлайн, сортуємо за часом останнього перебування в мережі (якщо є)
            const aId = a.id.replace('streamer-', '');
            const bId = b.id.replace('streamer-', '');
            
            const aLastOnline = localStorage.getItem(`streamer_${aId}_last_online`) || 0;
            const bLastOnline = localStorage.getItem(`streamer_${bId}_last_online`) || 0;
            
            return bLastOnline - aLastOnline; // Від найновішого до найстарішого
        }
        
        // За замовчуванням
        return 0;
    });
    
    // Запам'ятовуємо поточну позицію кожної картки
    const positions = new Map();
    
    streamerCards.forEach(card => {
        const rect = card.getBoundingClientRect();
        positions.set(card, {
            left: rect.left,
            top: rect.top
        });
    });
    
    // Очищуємо контейнер і додаємо відсортовані картки
    streamerCards.forEach(card => card.remove());
    streamerCards.forEach(card => {
        streamersContainer.appendChild(card);
    });
    
    // Анімуємо переміщення карток, якщо в контейнері більше 1 елемента
    if (streamerCards.length > 1) {
        streamerCards.forEach(card => {
            const oldPosition = positions.get(card);
            if (!oldPosition) return;
            
            const newPosition = card.getBoundingClientRect();
            
            // Розраховуємо зміщення
            const deltaX = oldPosition.left - newPosition.left;
            const deltaY = oldPosition.top - newPosition.top;
            
            // Застосовуємо початкове зміщення
            if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
                card.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
                
                // Анімуємо повернення на нову позицію
                requestAnimationFrame(() => {
                    card.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
                    card.style.transform = '';
                    
                    // Видаляємо властивості після завершення анімації
                    setTimeout(() => {
                        card.style.transition = '';
                    }, 500);
                });
            }
        });
    }
}

/**
 * Показує сповіщення про нові стріми
 */
function showStreamNotification(streamerInfo) {
    // Видаляємо попередні сповіщення
    const existingNotification = document.querySelector('.stream-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Створюємо нове сповіщення
    const notification = document.createElement('div');
    notification.className = 'stream-notification';
    
    notification.innerHTML = `
        <div class="notification-avatar">
            <img src="${streamerInfo.avatarUrl}" alt="${streamerInfo.displayName}">
        </div>
        <div class="notification-content">
            <div class="notification-title">
                <span class="streamer-name">${streamerInfo.displayName}</span>
                <span class="live-badge">LIVE</span>
            </div>
            <div class="notification-message">${streamerInfo.streamData.title}</div>
        </div>
        <button class="notification-close" aria-label="Закрити">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Додаємо обробник для закриття
    const closeButton = notification.querySelector('.notification-close');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            notification.style.transform = 'translateX(120%)';
            setTimeout(() => {
                notification.remove();
            }, 500);
        });
    }
    
    // Додаємо обробник для переходу на стрім при кліку на сповіщення
    notification.addEventListener('click', (e) => {
        if (!e.target.closest('.notification-close')) {
            window.open(`https://twitch.tv/${streamerInfo.twitchId}`, '_blank');
            notification.style.transform = 'translateX(120%)';
            setTimeout(() => {
                notification.remove();
            }, 500);
        }
    });
    
    // Показуємо сповіщення з затримкою
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Автоматично ховаємо сповіщення через 8 секунд
    setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 8000);
}

/**
 * Зберігаємо лайв стримерів в localStorage для використання на інших сторінках
 */
function syncLiveStreamers(liveStreamers) {
    // Зберігаємо основну інформацію про стримерів онлайн
    const liveStreamersInfo = liveStreamers.map(streamer => {
        // Обробляємо дані про стрім
        const streamData = streamer.streamData || {};
        
        return {
            id: streamer.id,
            twitchId: streamer.twitchId,
            displayName: streamer.displayName,
            avatarUrl: streamer.avatarUrl,
            clan: streamer.clan,
            title: streamData.title || '',
            viewers: streamData.viewers || 0,
            category: streamData.category || 'World of Tanks'
        };
    });
    
    // Зберігаємо в localStorage
    localStorage.setItem('gua_live_streamers', JSON.stringify(liveStreamersInfo));
    localStorage.setItem('gua_live_streamers_updated', Date.now().toString());
}

document.addEventListener('DOMContentLoaded', function() {
    const requirementsBtn = document.querySelector('.open-requirements');
    const requirementsModal = document.createElement('div');
    requirementsModal.className = 'requirements-modal';
    requirementsModal.id = 'requirementsModal';
    requirementsModal.innerHTML = `
        <div class="requirements-modal-content">
            <div class="requirements-modal-header">
                <h2 class="requirements-modal-title">Вимоги до офіційних стримерів альянсу</h2>
                <button class="requirements-modal-close modal-close" aria-label="Закрити">&times;</button>
            </div>
            <div class="requirements-modal-body">
                <div class="requirement-item">
                    <div class="requirement-item-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <h3 class="requirement-item-title">Членство в клані</h3>
                    <p class="requirement-item-description">
                        Активне членство в одному з кланів альянсу G_UA. 
                        Підтвердження внеску в розвиток клану та альянсу.
                    </p>
                </div>
                <div class="requirement-item">
                    <div class="requirement-item-icon">
                        <i class="fas fa-calendar-alt"></i>
                    </div>
                    <h3 class="requirement-item-title">Регулярні трансляції</h3>
                    <p class="requirement-item-description">
                        Мінімум 3 стріми на тиждень з грою World of Tanks. 
                        Кожен стрім має тривати не менше 2 годин.
                    </p>
                </div>
                <div class="requirement-item">
                    <div class="requirement-item-icon">
                        <i class="fas fa-video"></i>
                    </div>
                    <h3 class="requirement-item-title">Якість контенту</h3>
                    <p class="requirement-item-description">
                        Висока якість відео та звуку. Корисний, інформативний 
                        та розважальний контент для аудиторії.
                    </p>
                </div>
                <div class="requirement-item">
                    <div class="requirement-item-icon">
                        <i class="fas fa-smile"></i>
                    </div>
                    <h3 class="requirement-item-title">Позитивний імідж</h3>
                    <p class="requirement-item-description">
                        Дотримання етичних норм, відсутність токсичної поведінки. 
                        Гідне представлення альянсу в медіа-просторі.
                    </p>
                </div>
                <div class="requirement-item">
                    <div class="requirement-item-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <h3 class="requirement-item-title">Розвиток каналу</h3>
                    <p class="requirement-item-description">
                        Активна робота над зростанням аудиторії. 
                        Постійне вдосконалення контенту та взаємодія з глядачами.
                    </p>
                </div>
                <div class="requirement-item">
                    <div class="requirement-item-icon">
                        <i class="fas fa-server"></i>
                    </div>
                    <h3 class="requirement-item-title">Технічні вимоги</h3>
                    <p class="requirement-item-description">
                        Стабільне інтернет-з'єднання. Можливість стримити 
                        з роздільною здатністю не нижче 1080p.
                    </p>
                </div>
            </div>
            <div class="requirements-modal-footer">
                <a href="contact.html" class="btn btn-primary btn-lg">
                    <span>Подати заявку на стримера</span>
                    <i class="fas fa-paper-plane"></i>
                </a>
            </div>
        </div>
    `;

    document.body.appendChild(requirementsModal);
});
