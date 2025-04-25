/**
 * Оновлений скрипт для роботи зі стримерами через Twitch API
 * з єдиним списком та відображенням статусу
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
        telegram: 'JuniorTV_Gaming'
    },
    { 
        id: 'inesp1k1', 
        twitchId: 'inesp1k1',
        displayName: 'INeSp1k1',
        avatarUrl: 'img/inesp1ki.png',
        description: 'Стример і гравець G1_UA.',
        clan: 'G1_UA',
        youtube: 'inesp1k1',
        telegram: 'inesp1k1'
    },
    { 
        id: 'roha_wot', 
        twitchId: 'roha_wot',
        displayName: 'Roha_wot',
        avatarUrl: 'img/roha_wot',
        description: 'Експерт з артилерії. Член G3_UA.',
        clan: 'G3_UA',
        youtube: 'UC_rV2qI2UW2JL63yaLzuKpQ',
        telegram: '+cLlIBjakfuUyMzYy'
    },
    { 
        id: 'medicdoc', 
        twitchId: 'medicdoc',
        displayName: 'MedicDoc',
        avatarUrl: '/api/placeholder/80/80',
        description: 'Стримить переважно техніку підтримки. Член G5_UA.',
        clan: 'G5_UA',
        youtube: 'medicdoc',
        telegram: 'medicdoc'
    }
];

/**
 * Ініціалізація сторінки стримерів
 */
function initStreamersPage() {
    // Додавання стилів для довгих імен стримерів
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .streamer-name {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 100%;
        }
        
        .streamer-name.long-name {
            font-size: 14px;
        }
    `;
    document.head.appendChild(styleElement);
    
    // Очищення та заповнення контейнера стримерів
    const streamersContainer = document.getElementById('streamers-container');
    if (streamersContainer) {
        streamersContainer.innerHTML = '';
        
        // Створення карток для всіх стримерів
        streamers.forEach(streamer => {
            const card = createStreamerCard(streamer);
            streamersContainer.appendChild(card);
        });
    }
    
    // Додавання обробників для кнопок фільтрації
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Видаляємо активний клас з усіх кнопок
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Додаємо активний клас поточній кнопці
                this.classList.add('active');
                
                // Отримуємо значення фільтра
                const filter = this.getAttribute('data-filter');
                
                // Застосовуємо фільтр
                filterStreamers(filter);
            });
        });
    }
    
    // Перевірка статусу стримерів
    checkStreamStatus();
}

/**
 * Створення картки стримера
 */
function createStreamerCard(streamer) {
    const card = document.createElement('div');
    card.className = 'streamer-card';
    card.id = `streamer-${streamer.id}`;
    card.setAttribute('data-live', 'false');
    
    // Визначаємо, чи є ім'я довгим
    const nameClass = streamer.displayName.length > 12 ? 'streamer-name long-name' : 'streamer-name';
    
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
            <a href="https://youtube.com/@${streamer.youtube}" class="youtube" target="_blank" title="YouTube канал">
                <i class="fab fa-youtube"></i>
            </a>
            <a href="https://t.me/${streamer.telegram}" class="telegram" target="_blank" title="Telegram канал">
                <i class="fab fa-telegram"></i>
            </a>
        </div>
    `;
    
    return card;
}

/**
 * Фільтрація стримерів за статусом (всі або онлайн)
 */
function filterStreamers(filter) {
    const streamerCards = document.querySelectorAll('.streamer-card');
    
    streamerCards.forEach(card => {
        if (filter === 'all') {
            card.classList.remove('hidden');
        } else if (filter === 'live') {
            if (card.getAttribute('data-live') === 'true') {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        }
    });
}

/**
 * Перевірка статусу стримерів через Twitch API
 */
function checkStreamStatus() {
    // Налаштування API Twitch (потрібно замінити на справжні ключі з Twitch Developer Portal)
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
        
        // Лічильник онлайн-стримерів
        let onlineCount = 0;
        
        // Заповнюємо мапу каналами, які зараз онлайн
        if (data.data && data.data.length > 0) {
            data.data.forEach(stream => {
                liveChannels[stream.user_login.toLowerCase()] = {
                    title: stream.title,
                    viewers: stream.viewer_count,
                    category: stream.game_name || 'Unknown'
                };
                onlineCount++;
            });
        }
        
        // Оновлюємо лічильник онлайн-стримерів у кнопці фільтра
        const liveCount = document.querySelector('.live-count');
        if (liveCount) {
            liveCount.textContent = onlineCount;
            
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
        
        // Оновлюємо дані для кожного стримера
        streamers.forEach(streamer => {
            const isLive = liveChannels[streamer.twitchId.toLowerCase()] !== undefined;
            const streamData = liveChannels[streamer.twitchId.toLowerCase()];
            
            // Оновлюємо картку стримера
            updateStreamerCard(streamer, isLive, streamData);
        });
        
        // Перевіряємо, чи активний фільтр "Зараз в ефірі"
        const activeLiveFilter = document.querySelector('.filter-btn[data-filter="live"].active');
        if (activeLiveFilter) {
            filterStreamers('live');
        }
    })
    .catch(error => {
        console.error('Помилка отримання даних Twitch API:', error);
        
        // Встановлюємо базовий статус "Офлайн" у разі помилки
        streamers.forEach(streamer => {
            const streamerCard = document.getElementById(`streamer-${streamer.id}`);
            if (streamerCard) {
                streamerCard.setAttribute('data-live', 'false');
                streamerCard.classList.remove('live');
                
                const streamStatus = streamerCard.querySelector('.stream-status');
                if (streamStatus) {
                    streamStatus.innerHTML = '<span class="status-offline">Офлайн</span>';
                }
                
                // Видаляємо індикатор LIVE
                const liveBadge = streamerCard.querySelector('.live-badge');
                if (liveBadge) {
                    liveBadge.remove();
                }
                
                // Видаляємо інформацію про стрім
                const streamInfo = streamerCard.querySelector('.stream-info');
                if (streamInfo) {
                    streamInfo.remove();
                }
                
                // Оновлюємо іконку Twitch
                const twitchIcon = streamerCard.querySelector('.social-icons .twitch');
                if (twitchIcon) {
                    twitchIcon.classList.remove('live');
                    twitchIcon.title = 'Twitch канал';
                }
            }
        });
        
        // Скидаємо лічильник онлайн-стримерів
        const liveCount = document.querySelector('.live-count');
        if (liveCount) {
            liveCount.textContent = '0';
        }
        
        // Видаляємо клас з кнопки
        const liveBtn = document.querySelector('.live-btn');
        if (liveBtn) {
            liveBtn.classList.remove('has-live');
        }
    });
}

/**
 * Оновлює картку стримера на основі його онлайн-статусу
 */
function updateStreamerCard(streamer, isLive, streamData) {
    const streamerCard = document.getElementById(`streamer-${streamer.id}`);
    if (!streamerCard) return;
    
    // Оновлюємо атрибут data-live
    streamerCard.setAttribute('data-live', isLive ? 'true' : 'false');
    
    // Оновлюємо клас картки
    if (isLive) {
        streamerCard.classList.add('live');
    } else {
        streamerCard.classList.remove('live');
    }
    
    // Оновлюємо статус стримера
    const streamStatus = streamerCard.querySelector('.stream-status');
    if (streamStatus) {
        if (isLive) {
            streamStatus.innerHTML = `
                <span class="status-online">Онлайн</span>
                <span class="viewers-count">
                    <i class="fas fa-user"></i> ${streamData.viewers}
                </span>
            `;
        } else {
            streamStatus.innerHTML = '<span class="status-offline">Офлайн</span>';
        }
    }
    
    // Оновлюємо іконку Twitch
    const twitchIcon = streamerCard.querySelector('.social-icons .twitch');
    if (twitchIcon) {
        if (isLive) {
            twitchIcon.classList.add('live');
            twitchIcon.title = 'Дивитись стрім';
        } else {
            twitchIcon.classList.remove('live');
            twitchIcon.title = 'Twitch канал';
        }
    }
    
    // Перевіряємо, чи існує індикатор LIVE
    let liveBadge = streamerCard.querySelector('.live-badge');
    
    if (isLive && !liveBadge) {
        // Якщо стример онлайн і немає індикатора, додаємо його
        liveBadge = document.createElement('div');
        liveBadge.className = 'live-badge';
        liveBadge.textContent = 'LIVE';
        streamerCard.appendChild(liveBadge);
        
        // Також додаємо інформацію про стрім
        let streamInfo = streamerCard.querySelector('.stream-info');
        if (!streamInfo) {
            streamInfo = document.createElement('div');
            streamInfo.className = 'stream-info';
            streamerCard.insertBefore(streamInfo, streamerCard.querySelector('.social-icons'));
            
            streamInfo.innerHTML = `
                <div class="stream-title">${streamData.title}</div>
                <div class="stream-category">${streamData.category}</div>
            `;
        }
    } else if (!isLive) {
        // Якщо стример офлайн, видаляємо індикатор LIVE та інформацію про стрім
        if (liveBadge) {
            liveBadge.remove();
        }
        
        const streamInfo = streamerCard.querySelector('.stream-info');
        if (streamInfo) {
            streamInfo.remove();
        }
    } else if (isLive && liveBadge) {
        // Якщо стример онлайн і є індикатор, оновлюємо інформацію про стрім
        const streamInfo = streamerCard.querySelector('.stream-info');
        if (streamInfo) {
            streamInfo.innerHTML = `
                <div class="stream-title">${streamData.title}</div>
                <div class="stream-category">${streamData.category}</div>
            `;
        }
    }
}

// Ініціалізуємо сторінку при завантаженні
document.addEventListener('DOMContentLoaded', initStreamersPage);

// Оновлюємо статус кожну хвилину
setInterval(checkStreamStatus, 60000);
