/**
 * Преміум-версія скрипту для роботи зі стримерами
 * З підтримкою 3D ефектів, інтерактивності та преміум анімацій
 */

// Масив з даними про стримерів
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
 * Ініціалізація преміум сторінки стримерів з 3D ефектами
 */
function initPremiumStreamersPage() {
    // Очищення та підготовка контейнера стримерів
    const streamersContainer = document.getElementById('streamers-container');
    if (streamersContainer) {
        // Додаємо індикатор завантаження
        streamersContainer.innerHTML = `
            <div class="loading-indicator">
                <div class="loading-spinner"></div>
            </div>
        `;
        
        // Створюємо всі картки з невеликою затримкою для анімації
        setTimeout(() => {
            streamersContainer.innerHTML = '';
            
            // Створення карток для всіх стримерів
            streamers.forEach((streamer, index) => {
                const card = createPremiumStreamerCard(streamer);
                streamersContainer.appendChild(card);
                
                // Додаємо 3D ефект при наведенні
                initializeCard3DEffect(card);
            });
            
            // Позначаємо, що сітка завантажена для анімації
            streamersContainer.classList.add('loaded');
        }, 800);
    }
    
    // Додавання обробників для кнопок фільтрації з преміум анімаціями
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Анімація натискання кнопки
                this.style.transform = 'scale(0.95)';
                setTimeout(() => this.style.transform = '', 150);
                
                // Видаляємо активний клас з усіх кнопок
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Додаємо активний клас поточній кнопці
                this.classList.add('active');
                
                // Отримуємо значення фільтра
                const filter = this.getAttribute('data-filter');
                
                // Додаємо/видаляємо клас для ефекту розмиття неактивних карток
                const streamersContainer = document.getElementById('streamers-container');
                if (filter === 'live') {
                    streamersContainer.classList.add('filter-active');
                } else {
                    streamersContainer.classList.remove('filter-active');
                }
                
                // Застосовуємо фільтр з преміум анімацією
                premiumFilterStreamers(filter);
            });
        });
    }
    
    // Перевірка статусу стримерів з преміум сповіщеннями
    checkPremiumStreamStatus();
}

/**
 * Створення преміум картки стримера з 3D ефектами
 */
function createPremiumStreamerCard(streamer) {
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
        <div class="social-icons">
            <a href="https://twitch.tv/${streamer.twitchId}" class="twitch" target="_blank" title="Twitch канал">
                <i class="fab fa-twitch"></i>
            </a>
            <a href="${youtubeUrl}" class="youtube" target="_blank" title="YouTube канал">
                <i class="fab fa-youtube"></i>
            </a>
            <a href="${telegramUrl}" class="telegram" target="_blank" title="Telegram канал">
                <i class="fab fa-telegram"></i>
            </a>
        </div>
    `;
    
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
 * Фільтрація стримерів з преміум анімаціями
 */
function premiumFilterStreamers(filter) {
    const streamerCards = document.querySelectorAll('.streamer-card');
    let visibleCount = 0;
    
    streamerCards.forEach((card, index) => {
        // Додаємо затримку для каскадного ефекту анімації
        setTimeout(() => {
            if (filter === 'all') {
                card.classList.remove('hidden');
                card.style.animation = 'card-appear 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards';
                visibleCount++;
            } else if (filter === 'live') {
                if (card.getAttribute('data-live') === 'true') {
                    card.classList.remove('hidden');
                    card.style.animation = 'card-live-appear 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards';
                    visibleCount++;
                } else {
                    card.classList.add('hidden');
                }
            }
        }, index * 50); // Затримка для каскадного ефекту
    });
    
    // Показуємо преміум повідомлення, якщо немає стримерів онлайн і вибрано фільтр 'live'
    setTimeout(() => {
        const noStreamersMessage = document.querySelector('.no-streamers-message');
        
        if (visibleCount === 0 && filter === 'live') {
            if (!noStreamersMessage) {
                const streamersContainer = document.getElementById('streamers-container');
                const message = document.createElement('div');
                message.className = 'no-streamers-message';
                message.innerHTML = `
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
                        <i class="fas fa-satellite-dish" style="font-size: 36px; color: #666; margin-bottom: 10px;"></i>
                        <p>На жаль, зараз немає стримерів в ефірі</p>
						<p>Перевірте пізніше або подивіться записи трансляцій на каналах стримерів</p>
                    </div>
                `;
                streamersContainer.appendChild(message);
                
                // Додаємо анімацію появи повідомлення
                setTimeout(() => {
                    message.style.animation = 'message-fade-in 0.8s ease-out forwards';
                }, 100);
            }
        } else if (noStreamersMessage) {
            // Анімація зникнення перед видаленням
            noStreamersMessage.style.animation = 'message-fade-in 0.5s ease-out reverse forwards';
            
            setTimeout(() => {
                noStreamersMessage.remove();
            }, 500);
        }
    }, streamerCards.length * 50 + 100); // Після завершення всіх анімацій карток
}

/**
 * Перевірка статусу стримерів з преміум сповіщеннями
 */
function checkPremiumStreamStatus() {
    // Видаляємо індикатор завантаження, якщо він є
    const loadingIndicator = document.querySelector('.loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.remove();
    }
    
    // Налаштування API Twitch
    const clientId = 'gp762nuuoqcoxypju8c569th9wz7q5';
    const accessToken = '0b09xd33shszp6496w5m8f03yalc8p';
    
    // Формуємо параметри запиту для кількох каналів одночасно
    const queryParams = streamers.map(streamer => `user_login=${streamer.twitchId}`).join('&');
    
    // Отримуємо дані про стріми
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
                updatePremiumStreamerCard(streamer, isLive, streamData);
            }, index * 100); // Затримка для каскадного ефекту
        });
        
        // Перевіряємо, чи активний фільтр "Зараз в ефірі"
        const activeLiveFilter = document.querySelector('.filter-btn[data-filter="live"].active');
        if (activeLiveFilter) {
            premiumFilterStreamers('live');
        }
        
        // Сортування стримерів з анімацією
        setTimeout(() => {
            premiumSortStreamers();
        }, streamers.length * 100 + 100);
        
        // Показуємо сповіщення про нових стримерів в ефірі
        if (newlyOnlineStreamers.length > 0) {
            setTimeout(() => {
                showStreamNotification(newlyOnlineStreamers[0]);
            }, 1000);
        }
    })
    .catch(error => {
        console.error('Помилка отримання даних Twitch API:', error);
        
        // Показуємо повідомлення про помилку
        const streamersContainer = document.getElementById('streamers-container');
        if (streamersContainer && !document.querySelector('.no-streamers-message')) {
            streamersContainer.innerHTML = `
                <div class="no-streamers-message" style="animation: message-fade-in 0.8s ease-out forwards;">
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 36px; color: var(--primary-color); margin-bottom: 10px;"></i>
                        <p>Не вдалося отримати дані про стримерів</p>
                        <p style="font-size: 14px; color: #888;">Спробуйте оновити сторінку або перевірте підключення до мережі</p>
                        <button onclick="location.reload()" class="btn" style="margin-top: 10px;">
                            <i class="fas fa-sync-alt"></i> Оновити сторінку
                        </button>
                    </div>
                </div>
            `;
        }
    });
}

/**
 * Оновлення преміум картки стримера
 */
function updatePremiumStreamerCard(streamer, isLive, streamData) {
    const streamerCard = document.getElementById(`streamer-${streamer.id}`);
    if (!streamerCard) return;
    
    // Оновлюємо атрибут data-live
    streamerCard.setAttribute('data-live', isLive ? 'true' : 'false');
    
    // Перевіряємо, чи був стример недавно онлайн
    const lastOnline = localStorage.getItem(`${streamer.id}_lastOnline`);
    const wasRecentlyLive = lastOnline && (Date.now() - parseInt(lastOnline)) < 3600000; // менше години тому
    
    // Видаляємо класи перед додаванням нових
    streamerCard.classList.remove('live', 'recent-live');
    
    // Оновлюємо клас картки з анімацією
    if (isLive) {
        // Плавна анімація зміни статусу
        const currentTransform = streamerCard.style.transform;
        streamerCard.style.transform = `${currentTransform || ''} scale(1.05)`;
        
        setTimeout(() => {
            streamerCard.classList.add('live');
            setTimeout(() => {
                streamerCard.style.transform = currentTransform || '';
            }, 300);
        }, 100);
        
        // Зберігаємо час останнього онлайну
        localStorage.setItem(`${streamer.id}_lastOnline`, Date.now().toString());
    } else {
        // Якщо стример був недавно в ефірі, додаємо клас з плавною анімацією
        if (wasRecentlyLive) {
            setTimeout(() => {
                streamerCard.classList.add('recent-live');
            }, 100);
        }
    }
    
    // Оновлюємо статус стримера
    const streamStatus = streamerCard.querySelector('.stream-status');
    if (streamStatus) {
        if (isLive) {
            // Анімація зміни статусу
            streamStatus.style.opacity = 0;
        setTimeout(() => {
            streamStatus.innerHTML = `
                <span class="viewers-count">
                    <i class="fas fa-user"></i> ${streamData.viewers.toLocaleString('uk-UA')}
                </span>
            `;
            streamStatus.style.opacity = 1;
        }, 300);
        } else if (wasRecentlyLive) {
            const minutesAgo = Math.floor((Date.now() - parseInt(lastOnline)) / 60000);
            
            // Анімація зміни статусу
            streamStatus.style.opacity = 0;
            setTimeout(() => {
                streamStatus.innerHTML = `
                    <span class="status-offline">Офлайн</span>
                    <span class="status-recent">був у мережі ${minutesAgo} хв. тому</span>
                `;
                streamStatus.style.opacity = 1;
            }, 300);
        } else {
            // Анімація зміни статусу
            streamStatus.style.opacity = 0;
            setTimeout(() => {
                streamStatus.innerHTML = '<span class="status-offline">Офлайн</span>';
                streamStatus.style.opacity = 1;
            }, 300);
        }
    }
    
    // Оновлюємо іконку Twitch з анімацією
    const twitchIcon = streamerCard.querySelector('.social-icons .twitch');
    if (twitchIcon) {
        if (isLive) {
            twitchIcon.classList.add('live');
            twitchIcon.title = 'Дивитись стрім';
            
            // Додаємо анімацію при зміні статусу
            twitchIcon.style.transform = 'scale(1.2)';
            setTimeout(() => {
                twitchIcon.style.transform = '';
            }, 500);
        } else {
            twitchIcon.classList.remove('live');
            twitchIcon.title = 'Twitch канал';
        }
    }
    
    // Перевіряємо, чи існує індикатор LIVE
    let liveBadge = streamerCard.querySelector('.live-badge');
    
    if (isLive && !liveBadge) {
        // Якщо стример онлайн і немає індикатора, додаємо його з анімацією
        liveBadge = document.createElement('div');
        liveBadge.className = 'live-badge';
        liveBadge.textContent = 'LIVE';
        liveBadge.style.transform = 'translateZ(20px) scale(0)';
        streamerCard.appendChild(liveBadge);
        
        // Анімація появи
        setTimeout(() => {
            liveBadge.style.transform = 'translateZ(20px) scale(1)';
        }, 100);
        
        // Також додаємо інформацію про стрім з анімацією
        let streamInfo = streamerCard.querySelector('.stream-info');
        if (!streamInfo) {
            streamInfo = document.createElement('div');
            streamInfo.className = 'stream-info';
            streamInfo.style.opacity = 0;
            streamInfo.style.transform = 'translateY(20px)';
            streamerCard.insertBefore(streamInfo, streamerCard.querySelector('.social-icons'));
            
            streamInfo.innerHTML = `
                <div class="stream-title">${streamData.title}</div>
                <div class="stream-category">${streamData.category}</div>
            `;
            
            // Анімація появи
            setTimeout(() => {
                streamInfo.style.opacity = 1;
                streamInfo.style.transform = 'translateY(0)';
            }, 200);
        }
    } else if (!isLive && liveBadge) {
        // Якщо стример офлайн, видаляємо індикатор LIVE та інформацію про стрім з анімацією
        liveBadge.style.transform = 'translateZ(20px) scale(0)';
        
        setTimeout(() => {
            liveBadge.remove();
        }, 300);
        
        const streamInfo = streamerCard.querySelector('.stream-info');
        if (streamInfo) {
            streamInfo.style.opacity = 0;
            streamInfo.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                streamInfo.remove();
            }, 300);
        }
    } else if (isLive && liveBadge) {
        // Якщо стример онлайн і є індикатор, оновлюємо інформацію про стрім
        const streamInfo = streamerCard.querySelector('.stream-info');
        if (streamInfo) {
            // Анімація оновлення
            streamInfo.style.opacity = 0.5;
            setTimeout(() => {
                streamInfo.innerHTML = `
                    <div class="stream-title">${streamData.title}</div>
                    <div class="stream-category">${streamData.category}</div>
                `;
                streamInfo.style.opacity = 1;
            }, 300);
        }
    }
}

/**
 * Сортування стримерів з анімацією
 */
function premiumSortStreamers() {
    const streamersContainer = document.getElementById('streamers-container');
    if (!streamersContainer) return;
    
    const streamerCards = Array.from(streamersContainer.querySelectorAll('.streamer-card'));
    
    // Сортуємо картки
    streamerCards.sort((a, b) => {
        const aLive = a.getAttribute('data-live') === 'true';
        const bLive = b.getAttribute('data-live') === 'true';
        
        // Спочатку сортуємо за онлайн статусом
        if (aLive && !bLive) return -1;
        if (!aLive && bLive) return 1;
        
        // Якщо обидва онлайн, сортуємо за кланом
        if (aLive && bLive) {
            const aClan = a.getAttribute('data-clan');
            const bClan = b.getAttribute('data-clan');
            
            if (aClan && bClan) {
                // Отримуємо номер клану
                const aNum = parseInt(aClan.match(/G(\d+)_UA/)[1]);
                const bNum = parseInt(bClan.match(/G(\d+)_UA/)[1]);
                
                return aNum - bNum;
            }
        }
        
        // Якщо обидва офлайн, перевіряємо, хто був недавно онлайн
        const aRecent = a.classList.contains('recent-live');
        const bRecent = b.classList.contains('recent-live');
        
        if (aRecent && !bRecent) return -1;
        if (!aRecent && bRecent) return 1;
        
        // Якщо і це однаково, сортуємо за кланом
        const aClan = a.getAttribute('data-clan');
        const bClan = b.getAttribute('data-clan');
        
        if (aClan && bClan) {
            const aMatch = aClan.match(/G(\d+)_UA/);
            const bMatch = bClan.match(/G(\d+)_UA/);
            
            if (aMatch && bMatch) {
                const aNum = parseInt(aMatch[1]);
                const bNum = parseInt(bMatch[1]);
                
                return aNum - bNum;
            }
        }
        
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
    streamersContainer.innerHTML = '';
    streamerCards.forEach(card => {
        streamersContainer.appendChild(card);
    });
    
    // Анімуємо переміщення карток
    streamerCards.forEach(card => {
        const oldPosition = positions.get(card);
        if (!oldPosition) return;
        
        const newPosition = card.getBoundingClientRect();
        
        // Розраховуємо зміщення
        const deltaX = oldPosition.left - newPosition.left;
        const deltaY = oldPosition.top - newPosition.top;
        
        // Застосовуємо початкове зміщення
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
    });
}

/**
 * Показує сповіщення про нові стріми
 */
function showStreamNotification(streamer) {
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
            <img src="${streamer.avatarUrl}" alt="${streamer.displayName}">
        </div>
        <div class="notification-content">
            <div class="notification-title">${streamer.displayName}</div>
            <div class="notification-message">${streamer.streamData.title}</div>
        </div>
        <button class="notification-close" aria-label="Закрити" style="background: none; border: none; color: #ccc; cursor: pointer; font-size: 16px;">
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
            window.open(`https://twitch.tv/${streamer.twitchId}`, '_blank');
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

// Ініціалізуємо сторінку при завантаженні з перевіркою підтримки 3D
document.addEventListener('DOMContentLoaded', function() {
    // Перевіряємо, чи браузер підтримує 3D трансформації
    const supports3D = 'transform-style' in document.documentElement.style;
    
    // Додаємо клас для сумісності
    if (supports3D) {
        document.body.classList.add('supports-3d');
    } else {
        document.body.classList.add('no-3d-support');
    }
    
    // Ініціалізуємо сторінку
    initPremiumStreamersPage();
    
    // Для демонстрації можна використовувати
    // setTimeout(() => {
    //     runDemoMode();
    // }, 1000);
});

// Оновлюємо статус кожну хвилину
setInterval(checkPremiumStreamStatus, 60000);

/**
 * Функція для запуску демо-режиму
 */
function runDemoMode() {
    console.log('Запуск демо-режиму для тестування дизайну...');
    
    // Імітуємо випадковий онлайн статус для стримерів
    streamers.forEach((streamer, index) => {
        // Для демонстрації робимо перші 2 стримери онлайн
        const isLive = index < 2;
        
        // Випадкові дані для демонстрації
        const demoStreamData = {
            title: `[${streamer.clan}] ${streamer.displayName} грає World of Tanks | Рейтингові бої на Т-10 🔥`,
            viewers: Math.floor(Math.random() * 1000) + 50,
            category: 'World of Tanks',
            startedAt: new Date().toISOString()
        };
        
        // Оновлюємо картку стримера з випадковими даними
        updatePremiumStreamerCard(streamer, isLive, demoStreamData);
        
        // Зберігаємо останній онлайн для "недавно онлайн" стримерів
        if (index === 2 || index === 3) {
            const timeAgo = Math.floor(Math.random() * 50) + 5; // 5-55 хвилин тому
            const timestamp = Date.now() - timeAgo * 60 * 1000;
            localStorage.setItem(`${streamer.id}_lastOnline`, timestamp.toString());
            
            // Оновлюємо картку з "недавно онлайн" статусом
            setTimeout(() => {
                const card = document.getElementById(`streamer-${streamer.id}`);
                if (card) {
                    card.classList.add('recent-live');
                    
                    // Також оновлюємо відображення статусу
                    const streamStatus = card.querySelector('.stream-status');
                    if (streamStatus) {
                        streamStatus.innerHTML = `
                            <span class="status-offline">Офлайн</span>
                            <span class="status-recent">був у мережі ${timeAgo} хв. тому</span>
                        `;
                    }
                }
            }, 500);
        }
    });
    
    // Сортуємо стримерів з анімацією
    setTimeout(() => {
        premiumSortStreamers();
    }, 1000);
    
    // Оновлюємо лічильник онлайн-стримерів
    const liveCount = document.querySelector('.live-count');
    if (liveCount) {
        liveCount.textContent = '2';
        
        // Підсвічуємо кнопку
        const liveBtn = document.querySelector('.live-btn');
        if (liveBtn) {
            liveBtn.classList.add('has-live');
        }
    }
    
    // Показуємо демо-сповіщення
    setTimeout(() => {
        showStreamNotification({
            ...streamers[0],
            streamData: {
                title: `[${streamers[0].clan}] ${streamers[0].displayName} грає World of Tanks | Рейтингові бої на Т-10 🔥`,
                viewers: 257,
                category: 'World of Tanks'
            }
        });
    }, 3000);
}
