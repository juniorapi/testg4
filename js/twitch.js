/**
 * Удосконалений скрипт для відстеження стримерів на Twitch і YouTube (2025)
 * Виправлена версія з урахуванням знайдених помилок
 */

// API ключі (в реальному проєкті потрібно зберігати в безпечнішому місці)
const YOUTUBE_API_KEY = 'AIzaSyA-gfxxV6-1bqO7dkPJd4YZ1LVSVYEnqxM';
const TWITCH_CLIENT_ID = 'gp762nuuoqcoxypju8c569th9wz7q5';
const TWITCH_ACCESS_TOKEN = '0b09xd33shszp6496w5m8f03yalc8p';

// Масив з інформацією про стримерів
const streamers = [
    { 
        id: 'roha_wot', 
        twitchId: 'roha_wot',
        youtubeId: 'UC_rV2qI2UW2JL63yaLzuKpQ', 
        displayName: 'Roha_wot',
        avatarUrl: '/api/placeholder/100/100',
        description: 'Експерт з артилерії. Член G3_UA.',
        clan: 'G3_UA',
        telegram: '+cLlIBjakfuUyMzYy',
        platforms: ['youtube', 'twitch'] // Підтримувані платформи для стримінгу
    },
    { 
        id: 'vgostiua', 
        twitchId: 'vgostiua',
        youtubeId: 'UCPQAAy7rnk3G4eqMdFh2gng',
        displayName: 'vgostiua',
        avatarUrl: '/api/placeholder/100/100',
        description: 'Стример G5_UA',
        clan: 'G5_UA',
        telegram: 'vgostiua',
        platforms: ['youtube', 'twitch']
    },
    { 
        id: 'inesp1ki', 
        twitchId: 'inesp1ki',
        youtubeId: null, // Цей стример використовує тільки Twitch
        displayName: 'INeSp1kI',
        avatarUrl: '/api/placeholder/100/100',
        description: 'Стример G1_UA',
        clan: 'G1_UA',
        telegram: 'INeSp1kIWOT',
        platforms: ['twitch']
    },
    { 
        id: 'juniortv_gaming', 
        twitchId: null, // Цей стример використовує тільки YouTube
        youtubeId: 'UC5MzGUms3TJ2xylh8FfdIHA',
        displayName: 'JuniorTV_Gaming',
        avatarUrl: '/api/placeholder/100/100',
        description: 'Учасник G4_UA. Спеціалізація на командній грі.',
        clan: 'G4_UA',
        telegram: 'JuniorTV_Gaming',
        platforms: ['youtube']
    },
    { 
        id: 'ceh9', 
        twitchId: 'ceh9',
        youtubeId: 'UC3o2jtSL42bSXbVT8X3qoJw',
        displayName: 'ceh9',
        avatarUrl: '/api/placeholder/100/100',
        description: 'Відомий стример і коментатор. Командир G2_UA.',
        clan: 'G2_UA',
        telegram: 'ceh9forukraine',
        platforms: ['youtube', 'twitch']
    },
    { 
        id: 'cs2_maincast', 
        twitchId: 'cs2_maincast',
        youtubeId: 'UCVRrQpbIjFk_IbNzmECFZaA',
        displayName: 'cs2_maincast',
        avatarUrl: '/api/placeholder/100/100',
        description: 'Стример і професійний гравець G1_UA.',
        clan: 'G1_UA',
        telegram: 'cs2_maincast',
        platforms: ['youtube', 'twitch']
    }
];

/**
 * Ініціалізація сторінки стримерів
 */
function initStreamersPage() {
    // Додаємо додаткові стилі для карток
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
        
        /* Індикатор для різних платформ */
        .platform-badge {
            position: absolute;
            bottom: 0;
            right: 0;
            padding: 2px 5px;
            font-size: 10px;
            border-radius: 3px 0 0 0;
            font-weight: bold;
            z-index: 2;
        }
        
        .platform-badge.twitch {
            background-color: #6441a5;
            color: white;
        }
        
        .platform-badge.youtube {
            background-color: #ff0000;
            color: white;
        }
    `;
    document.head.appendChild(styleElement);
    
    // Створюємо картки стримерів
    const streamersContainer = document.getElementById('streamers-container');
    if (streamersContainer) {
        streamersContainer.innerHTML = '';
        streamers.forEach(streamer => {
            const card = createStreamerCard(streamer);
            streamersContainer.appendChild(card);
        });
    }
    
    // Налаштовуємо кнопки фільтрації
    setupFilterButtons();
    
    // Перевіряємо статус стримерів
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
    
    // Визначаємо клас імені в залежності від довжини
    const nameClass = streamer.displayName.length > 12 ? 'streamer-name long-name' : 'streamer-name';

    // Створюємо соціальні іконки
    let socialIcons = '';
    
    // Додаємо Twitch іконку, якщо стример використовує цю платформу
    if (streamer.platforms.includes('twitch') && streamer.twitchId) {
        socialIcons += `
            <a href="https://twitch.tv/${streamer.twitchId}" class="twitch" target="_blank" title="Twitch канал">
                <i class="fab fa-twitch"></i>
            </a>
        `;
    }
    
    // Додаємо YouTube іконку, якщо стример використовує цю платформу
    if (streamer.platforms.includes('youtube') && streamer.youtubeId) {
        const youtubeUrl = `https://youtube.com/channel/${streamer.youtubeId}`;
        socialIcons += `
            <a href="${youtubeUrl}" class="youtube" target="_blank" title="YouTube канал">
                <i class="fab fa-youtube"></i>
            </a>
        `;
    }
    
    // Додаємо Telegram іконку для всіх
    let telegramUrl = streamer.telegram.startsWith('+') 
        ? `https://t.me/${streamer.telegram}` 
        : `https://t.me/${streamer.telegram}`;
        
    socialIcons += `
        <a href="${telegramUrl}" class="telegram" target="_blank" title="Telegram канал">
            <i class="fab fa-telegram"></i>
        </a>
    `;
    
    // Формуємо HTML картки
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
            ${socialIcons}
        </div>
    `;
    
    return card;
}

/**
 * Налаштування кнопок фільтрації
 */
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Змінюємо активний стан кнопок
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Отримуємо значення фільтра
                const filter = this.getAttribute('data-filter');
                
                // Фільтруємо стримерів
                filterStreamers(filter);
            });
        });
    }
}

/**
 * Фільтрація стримерів (всі або тільки онлайн)
 */
function filterStreamers(filter) {
    const streamerCards = document.querySelectorAll('.streamer-card');
    let visibleCount = 0;
    
    streamerCards.forEach(card => {
        if (filter === 'all') {
            card.classList.remove('hidden');
            visibleCount++;
        } else if (filter === 'live') {
            if (card.getAttribute('data-live') === 'true') {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        }
    });
    
    // Показуємо повідомлення, якщо немає стримерів онлайн
    const noStreamersMessage = document.querySelector('.no-streamers-message');
    if (visibleCount === 0 && filter === 'live') {
        if (!noStreamersMessage) {
            const streamersContainer = document.getElementById('streamers-container');
            const message = document.createElement('div');
            message.className = 'no-streamers-message';
            message.innerHTML = '<p>На жаль, зараз немає стримерів в ефірі</p>';
            streamersContainer.appendChild(message);
        }
    } else if (noStreamersMessage) {
        noStreamersMessage.remove();
    }
}

/**
 * Перевірка статусів стримерів на всіх платформах
 */
async function checkStreamStatus() {
    let onlineCount = 0;
    const liveChannels = {};
    
    try {
        // Перевіряємо Twitch стріми
        const twitchCount = await checkTwitchStreams(liveChannels);
        onlineCount += twitchCount;
        
        // Перевіряємо YouTube стріми
        const youtubeCount = await checkYouTubeStreams(liveChannels);
        onlineCount += youtubeCount;
        
        // Оновлюємо UI з отриманими даними
        updateStreamersUI(liveChannels, onlineCount);
    } catch (error) {
        console.error('Помилка при перевірці статусу стримерів:', error);
    }
}

/**
 * Перевірка стримерів на Twitch
 */
async function checkTwitchStreams(liveChannels) {
    // Фільтруємо стримерів, які використовують Twitch
    const twitchStreamers = streamers.filter(s => s.platforms.includes('twitch') && s.twitchId);
    if (twitchStreamers.length === 0) return 0;
    
    let count = 0;
    
    try {
        // Формуємо параметри запиту для всіх Twitch-стримерів одночасно
        const twitchQueryParams = twitchStreamers.map(s => `user_login=${s.twitchId}`).join('&');
        
        const response = await fetch(`https://api.twitch.tv/helix/streams?${twitchQueryParams}`, {
            headers: {
                'Client-ID': TWITCH_CLIENT_ID,
                'Authorization': `Bearer ${TWITCH_ACCESS_TOKEN}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`Twitch API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
            data.data.forEach(stream => {
                // Знаходимо стримера за ідентифікатором Twitch
                const streamer = streamers.find(s => 
                    s.twitchId && s.twitchId.toLowerCase() === stream.user_login.toLowerCase()
                );
                
                if (streamer) {
                    liveChannels[streamer.id] = {
                        title: stream.title,
                        viewers: stream.viewer_count,
                        category: stream.game_name || 'Unknown',
                        platform: 'twitch',
                        streamerId: streamer.id
                    };
                    count++;
                }
            });
        }
    } catch (error) {
        console.error('Помилка Twitch API:', error);
    }
    
    return count;
}

/**
 * Перевірка стримерів на YouTube
 */
async function checkYouTubeStreams(liveChannels) {
    // Фільтруємо стримерів, які використовують YouTube
    const youtubeStreamers = streamers.filter(s => s.platforms.includes('youtube') && s.youtubeId);
    if (youtubeStreamers.length === 0) return 0;
    
    let count = 0;
    
    // YouTube API вимагає окремих запитів для кожного каналу
    const youtubePromises = youtubeStreamers.map(async streamer => {
        try {
            const response = await fetch(
                `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=${streamer.youtubeId}&eventType=live&type=video&key=${YOUTUBE_API_KEY}`
            );
            
            if (!response.ok) {
                throw new Error(`YouTube API error for ${streamer.id}: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Якщо знайдено активний стрім
            if (data.items && data.items.length > 0) {
                const stream = data.items[0];
                
                // Додаємо інформацію про стрім у загальний об'єкт
                liveChannels[streamer.id] = {
                    title: stream.snippet.title,
                    viewers: 'N/A', // Недоступно через базовий API
                    category: stream.snippet.categoryId || 'Gaming',
                    platform: 'youtube',
                    streamerId: streamer.id,
                    videoId: stream.id.videoId
                };
                
                count++;
            }
        } catch (error) {
            console.error(`Помилка при перевірці стріму на YouTube для ${streamer.id}:`, error);
        }
    });
    
    // Чекаємо завершення всіх запитів
    await Promise.all(youtubePromises);
    
    return count;
}

/**
 * Оновлення інтерфейсу після перевірки стримерів
 */
function updateStreamersUI(liveChannels, onlineCount) {
    // Оновлюємо лічильник онлайн-стримерів
    const liveCount = document.querySelector('.live-count');
    if (liveCount) {
        liveCount.textContent = onlineCount;
        
        // Підсвічуємо кнопку, якщо є стримери онлайн
        const liveBtn = document.querySelector('.live-btn');
        if (liveBtn) {
            if (onlineCount > 0) {
                liveBtn.classList.add('has-live');
            } else {
                liveBtn.classList.remove('has-live');
            }
        }
    }
    
    // Оновлюємо статуси всіх стримерів
    streamers.forEach(streamer => {
        const liveData = liveChannels[streamer.id];
        const isLive = !!liveData;
        
        updateStreamerCard(streamer, isLive, liveData);
    });
    
    // Сортуємо картки стримерів (спочатку онлайн)
    sortStreamers();
    
    // Перевіряємо, чи активний фільтр "live"
    const activeLiveFilter = document.querySelector('.filter-btn[data-filter="live"].active');
    if (activeLiveFilter) {
        filterStreamers('live');
    }
}

/**
 * Оновлення картки стримера
 */
function updateStreamerCard(streamer, isLive, streamData) {
    const streamerCard = document.getElementById(`streamer-${streamer.id}`);
    if (!streamerCard) return;
    
    // Оновлюємо атрибут і клас для статусу
    streamerCard.setAttribute('data-live', isLive ? 'true' : 'false');
    streamerCard.classList.toggle('live', isLive);
    
    // Знаходимо елемент для відображення статусу
    const streamStatus = streamerCard.querySelector('.stream-status');
    const socialIcons = streamerCard.querySelector('.social-icons');
    
    if (isLive) {
        // Оновлюємо статус для стримера онлайн
        streamStatus.innerHTML = `
            <span class="status-online">Онлайн (${streamData.platform.toUpperCase()})</span>
            ${streamData.viewers !== 'N/A' ? `
            <span class="viewers-count">
                <i class="fas fa-user"></i> ${streamData.viewers}
            </span>` : ''}
        `;
        
        // Додаємо індикатор LIVE
        let liveBadge = streamerCard.querySelector('.live-badge');
        if (!liveBadge) {
            liveBadge = document.createElement('div');
            liveBadge.className = 'live-badge';
            liveBadge.textContent = 'LIVE';
            streamerCard.appendChild(liveBadge);
        }
        
        // Додаємо інформацію про стрім
        let streamInfo = streamerCard.querySelector('.stream-info');
        if (!streamInfo) {
            streamInfo = document.createElement('div');
            streamInfo.className = 'stream-info';
            streamerCard.insertBefore(streamInfo, socialIcons);
        }
        
        streamInfo.innerHTML = `
            <div class="stream-title">${streamData.title}</div>
            <div class="stream-category">${streamData.category}</div>
        `;
        
        // Підсвічуємо іконку відповідної платформи
        const twitchIcon = streamerCard.querySelector('.social-icons .twitch');
        const youtubeIcon = streamerCard.querySelector('.social-icons .youtube');
        
        // Скидаємо попередні підсвічування
        if (twitchIcon) twitchIcon.classList.remove('live');
        if (youtubeIcon) youtubeIcon.classList.remove('live');
        
        // Підсвічуємо потрібну іконку
        if (streamData.platform === 'twitch' && twitchIcon) {
            twitchIcon.classList.add('live');
            twitchIcon.href = `https://twitch.tv/${streamer.twitchId}`;
            twitchIcon.title = 'Дивитися стрім на Twitch';
        } else if (streamData.platform === 'youtube' && youtubeIcon) {
            youtubeIcon.classList.add('live');
            youtubeIcon.href = streamData.videoId 
                ? `https://youtube.com/watch?v=${streamData.videoId}` 
                : `https://youtube.com/channel/${streamer.youtubeId}/live`;
            youtubeIcon.title = 'Дивитися стрім на YouTube';
        }
        
        // Додаємо значок платформи
        let platformBadge = streamerCard.querySelector('.platform-badge');
        if (!platformBadge) {
            platformBadge = document.createElement('div');
            platformBadge.className = `platform-badge ${streamData.platform}`;
            platformBadge.textContent = streamData.platform.toUpperCase();
            streamerCard.querySelector('.streamer-header').appendChild(platformBadge);
        } else {
            platformBadge.className = `platform-badge ${streamData.platform}`;
            platformBadge.textContent = streamData.platform.toUpperCase();
        }
    } else {
        // Оновлюємо статус для стримера офлайн
        streamStatus.innerHTML = '<span class="status-offline">Офлайн</span>';
        
        // Видаляємо елементи, пов'язані зі стрімом
        streamerCard.querySelector('.live-badge')?.remove();
        streamerCard.querySelector('.stream-info')?.remove();
        streamerCard.querySelector('.platform-badge')?.remove();
        
        // Скидаємо підсвічування іконок
        const twitchIcon = streamerCard.querySelector('.social-icons .twitch');
        const youtubeIcon = streamerCard.querySelector('.social-icons .youtube');
        
        if (twitchIcon) {
            twitchIcon.classList.remove('live');
            twitchIcon.href = `https://twitch.tv/${streamer.twitchId}`;
            twitchIcon.title = 'Twitch канал';
        }
        
        if (youtubeIcon) {
            youtubeIcon.classList.remove('live');
            youtubeIcon.href = `https://youtube.com/channel/${streamer.youtubeId}`;
            youtubeIcon.title = 'YouTube канал';
        }
    }
}

/**
 * Сортування карток стримерів (онлайн спочатку)
 */
function sortStreamers() {
    const streamersContainer = document.getElementById('streamers-container');
    if (!streamersContainer) return;
    
    const streamerCards = Array.from(streamersContainer.querySelectorAll('.streamer-card'));
    
    streamerCards.sort((a, b) => {
        const aLive = a.getAttribute('data-live') === 'true';
        const bLive = b.getAttribute('data-live') === 'true';
        
        if (aLive && !bLive) return -1;
        if (!aLive && bLive) return 1;
        
        return 0;
    });
    
    streamersContainer.innerHTML = '';
    streamerCards.forEach(card => {
        streamersContainer.appendChild(card);
    });
}

// Ініціалізуємо сторінку при завантаженні
document.addEventListener('DOMContentLoaded', initStreamersPage);

// Оновлюємо статус кожну хвилину
setInterval(checkStreamStatus, 60000);
