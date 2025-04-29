/**
 * Оновлений скрипт для роботи зі стримерами альянсу G_UA
 * З підтримкою анімацій, статусів та 3D ефектів
 * Включає інтеграцію з Twitch API
 */

document.addEventListener('DOMContentLoaded', function() {
    // Ініціалізуємо всі функції
    initDropdowns();
    initFilterTabs();
    initModals();
    loadStreamers();
});

/**
 * Реальні дані про стримерів альянсу G_UA
 */
const streamers = [
    { 
        id: 'cs2_maincast', 
        twitchId: 'cs2_maincast',
        displayName: 'cs2_maincast',
        avatarUrl: 'img/cs2_maincast.png',
        description: 'Стример і професійний гравець G1_UA.',
        clan: 'G1_UA',
        youtube: 'cs2_maincast',
        youtubeType: 'user',
        telegram: 'cs2_maincast'
    },
    { 
        id: 'ceh9', 
        twitchId: 'ceh9',
        displayName: 'ceh9',
        avatarUrl: 'img/ceh9.png',
        description: 'Відомий стример і коментатор. Командир G2_UA.',
        clan: 'G2_UA',
        youtube: 'ceh9live',
        youtubeType: 'user',
        telegram: 'ceh9forukraine'
    },
    { 
        id: 'juniortv_gaming', 
        twitchId: 'juniortv_gaming',
        displayName: 'JuniorTV_Gaming',
        avatarUrl: 'img/jtv.png',
        description: 'Учасник G4_UA. Стримить регулярно з фокусом на командну гру.',
        clan: 'G4_UA',
        youtube: 'JuniorTV_Gaming',
        youtubeType: 'user',
        telegram: 'JuniorTV_Gaming'
    },
    { 
        id: 'inesp1ki', 
        twitchId: 'inesp1ki',
        displayName: 'INeSp1kI',
        avatarUrl: 'img/inesp1ki.png',
        description: 'Стример і гравець G1_UA.',
        clan: 'G1_UA',
        youtube: 'INeSp1kI',
        youtubeType: 'user',
        telegram: 'INeSp1kIWOT'
    },
    { 
        id: 'roha_wot', 
        twitchId: 'roha_wot',
        displayName: 'Roha_wot',
        avatarUrl: 'img/roha_wot.png',
        description: 'Експерт з артилерії. Член G3_UA.',
        clan: 'G3_UA',
        youtube: 'UC_rV2qI2UW2JL63yaLzuKpQ',
        youtubeType: 'channel',
        telegram: '+cLlIBjakfuUyMzYy'
    },
    { 
        id: 'vgostiua', 
        twitchId: 'vgostiua',
        displayName: 'vgostiua',
        avatarUrl: 'img/vgostiua.png',
        description: 'Стримить переважно техніку підтримки. Член G5_UA.',
        clan: 'G5_UA',
        youtube: 'UCPQAAy7rnk3G4eqMdFh2gng',
        youtubeType: 'channel',
        telegram: 'vgostiua'
    }
];

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
        // Імітуємо стан завантаження
        streamersContainer.innerHTML = `
            <div class="loading-state">
                <div class="loader"></div>
                <p class="loading-message">Завантаження стримерів...</p>
            </div>
        `;
        
        // Із затримкою додаємо картки стримерів
        setTimeout(() => {
            // Очищуємо контейнер
            streamersContainer.innerHTML = '';
            
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
        }, 800); // Затримка для ефекту завантаження
    }
}

/**
 * Створення картки стримера
 */
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
        if (streamer.youtube.startsWith('@')) {
            youtubeUrl = `https://youtube.com/${streamer.youtube}`;
        } else {
            youtubeUrl = `https://youtube.com/@${streamer.youtube}`;
        }
    }
    
    // Формуємо посилання на Telegram
    let telegramUrl = '';
    if (streamer.telegram.startsWith('+') || streamer.telegram.startsWith('https://')) {
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
                    <span class="status-offline">Офлайн</span>
                </div>
            </div>
        </div>
        <div class="stream-info" style="display: none;">
            <div class="stream-title"></div>
            <div class="stream-meta">
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
                <a href="https://twitch.tv/${streamer.twitchId}" class="watch-btn" target="_blank">
                    <i class="fas fa-play"></i>
                    <span>Дивитися стрім</span>
                </a>
            </div>
        </div>
        <div class="social-links">
            <a href="https://twitch.tv/${streamer.twitchId}" class="social-link twitch" target="_blank" title="Twitch канал">
                <i class="fab fa-twitch"></i>
            </a>
            <a href="${youtubeUrl}" class="social-link youtube" target="_blank" title="YouTube канал">
                <i class="fab fa-youtube"></i>
            </a>
            <a href="${telegramUrl}" class="social-link telegram" target="_blank" title="Telegram канал">
                <i class="fab fa-telegram"></i>
            </a>
        </div>
        <div class="live-status-label">LIVE</div>
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
    const clientId = 'gp762nuuoqcoxypju8c569th9wz7q5';
    const accessToken = '0b09xd33shszp6496w5m8f03yalc8p';
    
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
                    }
                }
                
                // Зберігаємо поточний статус
                localStorage.setItem(`${streamerName}_status`, 'online');
                
                onlineCount++;
            });
        }
        
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
        const activeLiveFilter = document.querySelector('.filter-btn[data-filter="live"].active');
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
        
        // В разі помилки використовуємо демо-дані
        setTimeout(() => {
            handleTwitchAPIError();
        }, 1000);
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
    
    // Оновлюємо статус
    const statusElement = card.querySelector('.stream-status');
    if (statusElement) {
        statusElement.style.opacity = 0;
        setTimeout(() => {
            statusElement.innerHTML = `
                <span class="status-online">Онлайн</span>
                <span class="viewers-count">
                    <i class="fas fa-user"></i> ${streamData.viewers.toLocaleString('uk-UA')}
                </span>
            `;
            statusElement.style.opacity = 1;
        }, 300);
    }
    
    // Додаємо індикатор онлайн до аватару
    const avatar = card.querySelector('.streamer-avatar');
    if (avatar && !avatar.querySelector('.online-indicator')) {
        const indicator = document.createElement('div');
        indicator.className = 'online-indicator';
        avatar.appendChild(indicator);
    }
    
    // Додаємо індикатор LIVE з анімацією
    if (!card.querySelector('.live-badge')) {
        const liveBadge = document.createElement('div');
        liveBadge.className = 'live-badge';
        liveBadge.textContent = 'LIVE';
        liveBadge.style.transform = 'scale(0)';
        card.appendChild(liveBadge);
        
        setTimeout(() => {
            liveBadge.style.transform = 'scale(1)';
        }, 100);
    }
    
    // Відображаємо інформацію про стрім
    const streamInfo = card.querySelector('.stream-info');
    if (streamInfo) {
        streamInfo.style.display = 'block';
        streamInfo.style.opacity = 0;
        streamInfo.style.transform = 'translateY(20px)';
        
        // Заповнюємо дані стріму
        streamInfo.querySelector('.stream-title').textContent = streamData.title;
        streamInfo.querySelector('.stream-category span').textContent = streamData.category;
        streamInfo.querySelector('.viewers-count span').textContent = streamData.viewers.toLocaleString('uk-UA');
        
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
}

/**
 * Оновлення картки стримера до стану "офлайн"
 */
function updateStreamerCardToOffline(card) {
    const streamerId = card.getAttribute('data-id');
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
    
    // Видаляємо індикатор онлайн з анімацією
    const onlineIndicator = card.querySelector('.online-indicator');
    if (onlineIndicator) {
        onlineIndicator.style.transform = 'scale(0)';
        
        setTimeout(() => {
            onlineIndicator.remove();
        }, 300);
    }
    
    // Видаляємо індикатор LIVE з анімацією
    const liveBadge = card.querySelector('.live-badge');
    if (liveBadge) {
        liveBadge.style.transform = 'scale(0)';
        
        setTimeout(() => {
            liveBadge.remove();
        }, 300);
    }
    
    // Приховуємо інформацію про стрім з анімацією
    const streamInfo = card.querySelector('.stream-info');
    if (streamInfo && streamInfo.style.display !== 'none') {
        streamInfo.style.opacity = 0;
        streamInfo.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            streamInfo.style.display = 'none';
        }, 300);
    }
    
    // Видаляємо клас live з іконки Twitch
    const twitchIcon = card.querySelector('.social-link.twitch');
    if (twitchIcon) {
        twitchIcon.classList.remove('live');
        twitchIcon.title = 'Twitch канал';
    }
    
    // Перевіряємо, чи був стример недавно онлайн
    const lastOnline = localStorage.getItem(`streamer_${streamerId}_last_online`);
    if (lastOnline) {
        const now = Date.now();
        const diff = now - parseInt(lastOnline);
        
        // Якщо менше 2 годин тому, показуємо статус "недавно онлайн"
        if (diff < 2 * 60 * 60 * 1000) {
            card.classList.add('recent');
            
            // Розраховуємо, скільки часу пройшло
            const minutes = Math.floor(diff / 60000);
            let timeText = '';
            
            if (minutes < 60) {
                timeText = `${minutes} хв. тому`;
            } else {
                const hours = Math.floor(minutes / 60);
                const mins = minutes % 60;
                timeText = `${hours} год. ${mins} хв. тому`;
            }
            
            // Оновлюємо статус
            const statusElement = card.querySelector('.stream-status');
            if (statusElement) {
                statusElement.style.opacity = 0;
                setTimeout(() => {
                    statusElement.innerHTML = `
                        <span class="status-offline">Офлайн</span>
                        <span class="status-time">Був онлайн ${timeText}</span>
                    `;
                    statusElement.style.opacity = 1;
                }, 300);
            }
        } else {
            card.classList.remove('recent');
            // Звичайний статус офлайн
            const statusElement = card.querySelector('.stream-status');
            if (statusElement) {
                statusElement.style.opacity = 0;
                setTimeout(() => {
                    statusElement.innerHTML = `<span class="status-offline">Офлайн</span>`;
                    statusElement.style.opacity = 1;
                }, 300);
            }
        }
    } else {
        // Звичайний статус офлайн
        const statusElement = card.querySelector('.stream-status');
        if (statusElement) {
            statusElement.style.opacity = 0;
            setTimeout(() => {
                statusElement.innerHTML = `<span class="status-offline">Офлайн</span>`;
                statusElement.style.opacity = 1;
            }, 300);
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
            card.classList.remove('hidden-by-clan');
        } else {
            const cardClan = card.getAttribute('data-clan');
            if (cardClan === clan) {
                card.classList.remove('hidden-by-clan');
            } else {
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
        if (status === 'all') {
            card.classList.remove('hidden-by-status');
            visibleCount++;
        } else if (status === 'live') {
            if (card.classList.contains('live')) {
                card.classList.remove('hidden-by-status');
                visibleCount++;
            } else {
                card.classList.add('hidden-by-status');
                hiddenCount++;
            }
        } else if (status === 'recent') {
            if (card.classList.contains('live') || card.classList.contains('recent')) {
                card.classList.remove('hidden-by-status');
                visibleCount++;
            } else {
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
        return !card.classList.contains('hidden-by-clan') && !card.classList.contains('hidden-by-status');
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
                const aViewers = parseInt(a.querySelector('.viewers-count span').textContent.replace(/\D/g, '')) || 0;
                const bViewers = parseInt(b.querySelector('.viewers-count span').textContent.replace(/\D/g, '')) || 0;
                return bViewers - aViewers; // Спадання
            }
            
            // Якщо обидва офлайн, сортуємо за часом останнього перебування в мережі (якщо є)
            const aId = a.getAttribute('data-id');
            const bId = b.getAttribute('data-id');
            
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
    
    // Очищаємо контейнер і додаємо відсортовані картки
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
 * Обробка помилок при запиті до Twitch API
 */
function handleTwitchAPIError() {
    console.log('Використання демо-даних для стримерів через помилку API');
    
    // Генеруємо випадкові статуси для стримерів
    const liveStreamers = getLiveStreamersDemo();
    
    // Оновлюємо лічильник онлайн-стримерів
    const liveCount = document.querySelector('.live-count');
    if (liveCount) {
        liveCount.textContent = liveStreamers.length;
    }
    
    // Додаємо клас has-live, якщо є стримери онлайн
    const liveBtn = document.querySelector('.live-btn');
    if (liveBtn && liveStreamers.length > 0) {
        liveBtn.classList.add('has-live');
    }
    
    // Оновлюємо статус кожного стримера
    streamers.forEach(streamer => {
        const liveData = liveStreamers.find(live => live.id === streamer.id);
        const streamerCard = document.getElementById(`streamer-${streamer.id}`);
        
        if (streamerCard) {
            if (liveData) {
                // Стример онлайн
                updateStreamerCardToLive(streamerCard, liveData);
                
                // Зберігаємо останній онлайн
                localStorage.setItem(`streamer_${streamer.id}_last_online`, Date.now().toString());
            } else {
                // Стример офлайн
                updateStreamerCardToOffline(streamerCard);
            }
        }
    });
    
    // Сортуємо картки
    sortStreamers('default');
    
    // Якщо активний фільтр "Зараз в ефірі"
    const activeTab = document.querySelector('.filter-tab.active');
    if (activeTab) {
        const filter = activeTab.getAttribute('data-filter');
        if (filter !== 'all') {
            filterByStatus(filter);
        }
    }
}

/**
 * Функція для імітації відповіді API Twitch (для демонстрації)
 */
function getLiveStreamersDemo() {
    // Випадковим чином вибираємо 2-3 стримерів, які зараз "онлайн"
    const liveStreamersCount = Math.floor(Math.random() * 2) + 2; // 2-3 стримери онлайн
    const liveStreamersIndices = [];
    
    // Вибираємо випадкові індекси
    while (liveStreamersIndices.length < liveStreamersCount) {
        const randomIndex = Math.floor(Math.random() * streamers.length);
        if (!liveStreamersIndices.includes(randomIndex)) {
            liveStreamersIndices.push(randomIndex);
        }
    }
    
    // Формуємо дані про стримерів онлайн
    return liveStreamersIndices.map(index => {
        const streamer = streamers[index];
        
        // Генеруємо випадкові дані для стріму
        const streamTitles = [
            "Рейтингові бої на Т-10 | Фарм ЛБЗ | Взвод з глядачами",
            "Турнірна практика з кланом | Стратегії на новій карті",
            "Нерф СТ в патчі 1.22 - аналіз та тест",
            "Нова гілка ПТ - перші враження та тактики",
            "Кланові війни на Глобальній карті | G_UA проти KOPM2",
            "Фарм кредитів на преміум техніці | Відповідаю на питання"
        ];
        
        const streamCategories = ["World of Tanks", "World of Tanks: Ранговані бої", "World of Tanks: Турніри"];
        
        return {
            id: streamer.id,
            title: streamTitles[Math.floor(Math.random() * streamTitles.length)],
            category: streamCategories[Math.floor(Math.random() * streamCategories.length)],
            viewers: Math.floor(Math.random() * 500) + 50 // 50-550 глядачів
        };
    });
}
