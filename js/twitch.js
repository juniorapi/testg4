/**
 * Удосконалений скрипт для відстеження стримерів на Twitch і YouTube (2025)
 * Підтримка одночасних стрімів на кількох платформах
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
        avatarUrl: 'img/roha_wot.png',
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
        avatarUrl: 'img/vgostiua.png',
        description: 'Стример G5_UA',
        clan: 'G5_UA',
        telegram: 'vgostiua',
        platforms: ['youtube', 'twitch']
    },
    { 
        id: 'inesp1ki', 
        twitchId: 'inesp1ki',
        youtubeId: 'INeSp1kI', // Цей стример використовує тільки Twitch
        displayName: 'INeSp1kI',
        avatarUrl: 'img/inesp1ki.png',
        description: 'Стример G1_UA',
        clan: 'G1_UA',
        telegram: 'INeSp1kIWOT',
        platforms: ['youtube', 'twitch']
    },
    { 
        id: 'juniortv_gaming', 
        twitchId: 'juniortv_gaming', // Цей стример використовує тільки YouTube
        youtubeId: 'JuniorTV_Gaming',
        displayName: 'JuniorTV_Gaming',
        avatarUrl: 'img/jtv.png',
        description: 'Учасник G4_UA. Спеціалізація на командній грі.',
        clan: 'G4_UA',
        telegram: 'JuniorTV_Gaming',
        platforms: ['youtube', 'twitch']
    },
    { 
        id: 'ceh9', 
        twitchId: 'ceh9',
        youtubeId: 'ceh9live',
        displayName: 'ceh9',
        avatarUrl: 'img/ceh9.png',
        description: 'Відомий стример і коментатор. Командир G2_UA.',
        clan: 'G2_UA',
        telegram: 'ceh9forukraine',
        platforms: ['youtube', 'twitch']
    },
    { 
        id: 'cs2_maincast', 
        twitchId: 'cs2_maincast',
        youtubeId: null,
        displayName: 'cs2_maincast',
        avatarUrl: 'img/cs2_maincast.png',
        description: 'Стример і професійний гравець G1_UA.',
        clan: 'G1_UA',
        telegram: 'cs2_maincast',
        platforms: ['twitch']
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
        
        /* Стилі для багатоплатформних стрімів */
        .multiplatform-streaming .live-badge {
            animation: livePulse 1.5s infinite;
        }
        
        .multiplatform-badge {
            position: absolute;
            top: 0;
            left: 0;
            background-color: #333;
            color: white;
            padding: 3px 8px;
            border-radius: 0 0 4px 0;
            font-size: 10px;
            font-weight: bold;
            z-index: 2;
        }
        
        /* Індикатори платформ */
        .platform-indicators {
            display: flex;
            gap: 5px;
            margin-top: 5px;
        }
        
        .platform-indicator {
            display: flex;
            align-items: center;
            background-color: rgba(0, 0, 0, 0.3);
            border-radius: 3px;
            padding: 2px 5px;
            font-size: 11px;
            line-height: 1;
        }
        
        .platform-indicator.twitch {
            border-left: 2px solid #6441a5;
        }
        
        .platform-indicator.youtube {
            border-left: 2px solid #ff0000;
        }
        
        .platform-indicator i {
            margin-right: 3px;
            font-size: 10px;
        }
        
        /* Анімації для мерехтіння */
        @keyframes livePulse {
            0% { opacity: 1; }
            50% { opacity: 0.6; }
            100% { opacity: 1; }
        }
        
        @keyframes platformBlink {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
        
        .social-icons a.multiplatform {
            animation: platformBlink 2s infinite;
        }
        
        .social-icons a.twitch.multiplatform {
            background-color: #6441a5;
            color: white;
        }
        
        .social-icons a.youtube.multiplatform {
            background-color: #ff0000;
            color: white;
        }
        
        /* Інформація про стрім */
        .stream-info.twitch {
            border-left: 3px solid #6441a5;
        }
        
        .stream-info.youtube {
            border-left: 3px solid #ff0000;
        }
        
        .stream-info.multiplatform {
            animation: platformSwitch 10s infinite;
        }
        
        @keyframes platformSwitch {
            0%, 45% { border-left-color: #6441a5; }
            50%, 95% { border-left-color: #ff0000; }
            100% { border-left-color: #6441a5; }
        }
        
        .platform-switcher {
            display: flex;
            gap: 5px;
            margin-top: 8px;
        }
        
        .platform-button {
            background-color: rgba(0, 0, 0, 0.3);
            border: none;
            color: white;
            padding: 2px 8px;
            font-size: 10px;
            cursor: pointer;
            border-radius: 3px;
            transition: all 0.3s;
        }
        
        .platform-button.twitch {
            border-bottom: 1px solid #6441a5;
        }
        
        .platform-button.youtube {
            border-bottom: 1px solid #ff0000;
        }
        
        .platform-button:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }
        
        .platform-button.active.twitch {
            background-color: rgba(100, 65, 165, 0.3);
        }
        
        .platform-button.active.youtube {
            background-color: rgba(255, 0, 0, 0.3);
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
    // Створюємо структуру для зберігання інформації про стріми
    const liveChannels = {};
    streamers.forEach(streamer => {
        liveChannels[streamer.id] = { 
            twitch: null, 
            youtube: null, 
            activePlatform: null 
        };
    });
    
    try {
        // Перевіряємо Twitch стріми
        await checkTwitchStreams(liveChannels);
        
        // Перевіряємо YouTube стріми
        await checkYouTubeStreams(liveChannels);
        
        // Підраховуємо загальну кількість стримерів онлайн
        let onlineCount = 0;
        Object.values(liveChannels).forEach(channel => {
            if (channel.twitch || channel.youtube) {
                onlineCount++;
            }
        });
        
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
    if (twitchStreamers.length === 0) return;
    
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
                    // Зберігаємо дані стріму в структурі
                    liveChannels[streamer.id].twitch = {
                        title: stream.title,
                        viewers: stream.viewer_count,
                        category: stream.game_name || 'Unknown',
                        platform: 'twitch',
                        streamerId: streamer.id
                    };
                    
                    // Встановлюємо активну платформу, якщо ще не встановлено
                    if (!liveChannels[streamer.id].activePlatform) {
                        liveChannels[streamer.id].activePlatform = 'twitch';
                    }
                }
            });
        }
    } catch (error) {
        console.error('Помилка Twitch API:', error);
    }
}

/**
 * Перевірка стримерів на YouTube
 */
async function checkYouTubeStreams(liveChannels) {
    // Фільтруємо стримерів, які використовують YouTube
    const youtubeStreamers = streamers.filter(s => s.platforms.includes('youtube') && s.youtubeId);
    if (youtubeStreamers.length === 0) return;
    
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
                
                // Зберігаємо дані стріму в структурі
                liveChannels[streamer.id].youtube = {
                    title: stream.snippet.title,
                    viewers: 'N/A', // Недоступно через базовий API
                    category: stream.snippet.categoryId || 'Gaming',
                    platform: 'youtube',
                    streamerId: streamer.id,
                    videoId: stream.id.videoId
                };
                
                // Встановлюємо активну платформу, якщо ще не встановлено
                if (!liveChannels[streamer.id].activePlatform) {
                    liveChannels[streamer.id].activePlatform = 'youtube';
                }
            }
        } catch (error) {
            console.error(`Помилка при перевірці стріму на YouTube для ${streamer.id}:`, error);
        }
    });
    
    // Чекаємо завершення всіх запитів
    await Promise.all(youtubePromises);
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
        const channels = liveChannels[streamer.id];
        const isLive = !!(channels.twitch || channels.youtube);
        const isMultiplatform = !!(channels.twitch && channels.youtube);
        
        updateStreamerCard(streamer, isLive, channels, isMultiplatform);
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
function updateStreamerCard(streamer, isLive, channels, isMultiplatform) {
    const streamerCard = document.getElementById(`streamer-${streamer.id}`);
    if (!streamerCard) return;
    
    // Оновлюємо атрибут і клас для статусу
    streamerCard.setAttribute('data-live', isLive ? 'true' : 'false');
    streamerCard.classList.toggle('live', isLive);
    streamerCard.classList.toggle('multiplatform-streaming', isMultiplatform);
    
    // Знаходимо елемент для відображення статусу
    const streamStatus = streamerCard.querySelector('.stream-status');
    const socialIcons = streamerCard.querySelector('.social-icons');
    
    if (isLive) {
        // Визначаємо активну платформу для відображення
        const activePlatform = channels.activePlatform;
        const activeData = channels[activePlatform];
        
        // Оновлюємо статус для стримера онлайн
        if (isMultiplatform) {
            streamStatus.innerHTML = `
                <span class="status-online">Онлайн на кількох платформах</span>
                <div class="platform-indicators">
                    ${channels.twitch ? `<div class="platform-indicator twitch">
                        <i class="fab fa-twitch"></i> ${channels.twitch.viewers} глядачів
                    </div>` : ''}
                    ${channels.youtube ? `<div class="platform-indicator youtube">
                        <i class="fab fa-youtube"></i> ${channels.youtube.viewers !== 'N/A' ? channels.youtube.viewers : 'N/A'} глядачів
                    </div>` : ''}
                </div>
            `;
        } else {
            streamStatus.innerHTML = `
                <span class="status-online">Онлайн (${activeData.platform.toUpperCase()})</span>
                ${activeData.viewers !== 'N/A' ? `
                <span class="viewers-count">
                    <i class="fas fa-user"></i> ${activeData.viewers}
                </span>` : ''}
            `;
        }
        
        // Додаємо індикатор LIVE
        let liveBadge = streamerCard.querySelector('.live-badge');
        if (!liveBadge) {
            liveBadge = document.createElement('div');
            liveBadge.className = 'live-badge';
            liveBadge.textContent = 'LIVE';
            streamerCard.appendChild(liveBadge);
        }
        
        // Для багатоплатформного стріму додаємо спеціальний індикатор
        let multiplatformBadge = streamerCard.querySelector('.multiplatform-badge');
        if (isMultiplatform) {
            if (!multiplatformBadge) {
                multiplatformBadge = document.createElement('div');
                multiplatformBadge.className = 'multiplatform-badge';
                multiplatformBadge.textContent = 'TWITCH & YOUTUBE';
                streamerCard.appendChild(multiplatformBadge);
            }
        } else if (multiplatformBadge) {
            multiplatformBadge.remove();
        }
        
        // Додаємо інформацію про стрім
        let streamInfo = streamerCard.querySelector('.stream-info');
        if (!streamInfo) {
            streamInfo = document.createElement('div');
            streamInfo.className = `stream-info ${activeData.platform}`;
            streamerCard.insertBefore(streamInfo, socialIcons);
        } else {
            streamInfo.className = `stream-info ${activeData.platform}`;
        }
        
        if (isMultiplatform) {
            streamInfo.classList.add('multiplatform');
            
            // Додаємо кнопки для перемикання між платформами
            streamInfo.innerHTML = `
                <div class="stream-title">${activeData.title}</div>
                <div class="stream-category">${activeData.category}</div>
                <div class="platform-switcher">
                    <button class="platform-button twitch ${activePlatform === 'twitch' ? 'active' : ''}" data-platform="twitch">Twitch інфо</button>
                    <button class="platform-button youtube ${activePlatform === 'youtube' ? 'active' : ''}" data-platform="youtube">YouTube інфо</button>
                </div>
            `;
            
            // Додаємо обробники подій для кнопок перемикання
            const buttons = streamInfo.querySelectorAll('.platform-button');
            buttons.forEach(button => {
                button.addEventListener('click', function() {
                    const platform = this.getAttribute('data-platform');
                    channels.activePlatform = platform;
                    updateStreamerCard(streamer, isLive, channels, isMultiplatform);
                });
            });
        } else {
            streamInfo.innerHTML = `
                <div class="stream-title">${activeData.title}</div>
                <div class="stream-category">${activeData.category}</div>
            `;
        }
        
        // Підсвічуємо іконки платформ
        const twitchIcon = streamerCard.querySelector('.social-icons .twitch');
        const youtubeIcon = streamerCard.querySelector('.social-icons .youtube');
        
        // Скидаємо попередні підсвічування
        if (twitchIcon) {
            twitchIcon.classList.remove('live', 'multiplatform');
            twitchIcon.href = `https://twitch.tv/${streamer.twitchId}`;
            twitchIcon.title = 'Twitch канал';
        }
        
        if (youtubeIcon) {
            youtubeIcon.classList.remove('live', 'multiplatform');
            youtubeIcon.href = `https://youtube.com/channel/${streamer.youtubeId}`;
            youtubeIcon.title = 'YouTube канал';
        }
        
        // Підсвічуємо потрібні іконки
        if (channels.twitch && twitchIcon) {
            twitchIcon.classList.add('live');
            twitchIcon.href = `https://twitch.tv/${streamer.twitchId}`;
            twitchIcon.title = 'Дивитися стрім на Twitch';
            
            if (isMultiplatform) twitchIcon.classList.add('multiplatform');
        }
        
        if (channels.youtube && youtubeIcon) {
            youtubeIcon.classList.add('live');
            youtubeIcon.href = channels.youtube.videoId 
                ? `https://youtube.com/watch?v=${channels.youtube.videoId}` 
                : `https://youtube.com/channel/${streamer.youtubeId}/live`;
            youtubeIcon.title = 'Дивитися стрім на YouTube';
            
            if (isMultiplatform) youtubeIcon.classList.add('multiplatform');
        }
        
        // Додаємо значок платформи
        let platformBadge = streamerCard.querySelector('.platform-badge');
        if (!isMultiplatform) {
            if (!platformBadge) {
                platformBadge = document.createElement('div');
                platformBadge.className = `platform-badge ${activeData.platform}`;
                platformBadge.textContent = activeData.platform.toUpperCase();
                streamerCard.querySelector('.streamer-header').appendChild(platformBadge);
            } else {
                platformBadge.className = `platform-badge ${activeData.platform}`;
                platformBadge.textContent = activeData.platform.toUpperCase();
            }
        } else if (platformBadge) {
            platformBadge.remove();
        }
        
        } else {
        // Оновлюємо статус для стримера офлайн
        streamStatus.innerHTML = '<span class="status-offline">Офлайн</span>';
        
        // Видаляємо елементи, пов'язані зі стрімом
        streamerCard.querySelector('.live-badge')?.remove();
        streamerCard.querySelector('.stream-info')?.remove();
        streamerCard.querySelector('.platform-badge')?.remove();
        streamerCard.querySelector('.multiplatform-badge')?.remove();
        
        // Скидаємо підсвічування іконок
        const twitchIcon = streamerCard.querySelector('.social-icons .twitch');
        const youtubeIcon = streamerCard.querySelector('.social-icons .youtube');
        
        if (twitchIcon) {
            twitchIcon.classList.remove('live', 'multiplatform');
            twitchIcon.href = `https://twitch.tv/${streamer.twitchId}`;
            twitchIcon.title = 'Twitch канал';
        }
        
        if (youtubeIcon) {
            youtubeIcon.classList.remove('live', 'multiplatform');
            youtubeIcon.href = `https://youtube.com/channel/${streamer.youtubeId}`;
            youtubeIcon.title = 'YouTube канал';
        }
    }
}

/**
 * Перемикання між інформацією про стріми на різних платформах
 */
function switchPlatformInfo(streamerId, platform) {
    const streamerCard = document.getElementById(`streamer-${streamerId}`);
    if (!streamerCard) return;
    
    // Оновлюємо активну платформу
    const streamer = streamers.find(s => s.id === streamerId);
    if (!streamer) return;
    
    // Перемикаємо інформацію
    const streamInfo = streamerCard.querySelector('.stream-info');
    if (streamInfo) {
        streamInfo.className = `stream-info ${platform}`;
    }
    
    // Оновлюємо активну кнопку
    const buttons = streamerCard.querySelectorAll('.platform-button');
    buttons.forEach(button => {
        const buttonPlatform = button.getAttribute('data-platform');
        button.classList.toggle('active', buttonPlatform === platform);
    });
}

/**
 * Автоматичне перемикання інформації про стріми для багатоплатформенних стримерів
 */
function setupAutoSwitching() {
    const multiplatformCards = document.querySelectorAll('.streamer-card.multiplatform-streaming');
    
    multiplatformCards.forEach(card => {
        const streamerId = card.id.replace('streamer-', '');
        const streamer = streamers.find(s => s.id === streamerId);
        
        if (!streamer) return;
        
        // Встановлюємо інтервал перемикання
        const switchInterval = setInterval(() => {
            // Отримуємо поточну активну платформу
            const activePlatformButton = card.querySelector('.platform-button.active');
            if (!activePlatformButton) return;
            
            const currentPlatform = activePlatformButton.getAttribute('data-platform');
            const newPlatform = currentPlatform === 'twitch' ? 'youtube' : 'twitch';
            
            // Перемикаємо на іншу платформу
            switchPlatformInfo(streamerId, newPlatform);
        }, 10000); // Перемикання кожні 10 секунд
        
        // Зберігаємо інтервал, щоб можна було його очистити при потребі
        card.setAttribute('data-switch-interval', switchInterval);
    });
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
        const aMultiplatform = a.classList.contains('multiplatform-streaming');
        const bMultiplatform = b.classList.contains('multiplatform-streaming');
        
        // Спочатку багатоплатформні стримери
        if (aMultiplatform && !bMultiplatform) return -1;
        if (!aMultiplatform && bMultiplatform) return 1;
        
        // Потім інші стримери онлайн
        if (aLive && !bLive) return -1;
        if (!aLive && bLive) return 1;
        
        return 0;
    });
    
    streamersContainer.innerHTML = '';
    streamerCards.forEach(card => {
        streamersContainer.appendChild(card);
    });
    
    // Налаштовуємо автоматичне перемикання для багатоплатформних стримерів
    setupAutoSwitching();
}

// Ініціалізуємо сторінку при завантаженні
document.addEventListener('DOMContentLoaded', initStreamersPage);

// Оновлюємо статус кожну хвилину
setInterval(checkStreamStatus, 60000);
