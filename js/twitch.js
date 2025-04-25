```javascript
/**
 * Розширена версія скрипту перевірки статусу стримерів (2025)
 */

const YOUTUBE_API_KEY = 'AIzaSyA-gfxxV6-1bqO7dkPJd4YZ1LVSVYEnqxM';
const TWITCH_CLIENT_ID = 'gp762nuuoqcoxypju8c569th9wz7q5';
const TWITCH_ACCESS_TOKEN = '0b09xd33shszp6496w5m8f03yalc8p';

const streamers = [
    { 
        id: 'roha_wot', 
        twitchId: 'roha_wot',
        youtubeId: 'UC_rV2qI2UW2JL63yaLzuKpQ', 
        displayName: 'Roha_wot',
        avatarUrl: 'img/roha_wot.png',
        description: 'Експерт з артилерії. Член G3_UA.',
        clan: 'G3_UA',
        youtube: 'UC_rV2qI2UW2JL63yaLzuKpQ', 
        youtubeType: 'channel',
        telegram: '+cLlIBjakfuUyMzYy',
        platforms: ['youtube', 'twitch']
    },
    { 
        id: 'vgostiua', 
        twitchId: 'vgostiua',
        youtubeId: 'UCPQAAy7rnk3G4eqMdFh2gng',
        displayName: 'vgostiua',
        avatarUrl: 'img/vgostiua.png',
        description: 'Стример G5_UA',
        clan: 'G5_UA',
        youtube: 'UCPQAAy7rnk3G4eqMdFh2gng',
        youtubeType: 'channel',
        telegram: 'vgostiua',
        platforms: ['youtube', 'twitch']
    },
    { 
        id: 'inesp1ki', 
        twitchId: 'inesp1ki',
        youtubeId: '', 
        displayName: 'INeSp1kI',
        avatarUrl: 'img/inesp1ki.png',
        description: 'Стример G1_UA',
        clan: 'G1_UA',
        youtube: 'INeSp1kI',
        youtubeType: 'user',
        telegram: 'INeSp1kIWOT',
        platforms: ['twitch']
    }
];

function initStreamersPage() {
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
    
    const streamersContainer = document.getElementById('streamers-container');
    if (streamersContainer) {
        streamersContainer.innerHTML = '';
        streamers.forEach(streamer => {
            const card = createStreamerCard(streamer);
            streamersContainer.appendChild(card);
        });
    }
    
    setupFilterButtons();
    checkStreamStatus();
}

function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                filterStreamers(filter);
            });
        });
    }
}

function createStreamerCard(streamer) {
    const card = document.createElement('div');
    card.className = 'streamer-card';
    card.id = `streamer-${streamer.id}`;
    card.setAttribute('data-live', 'false');
    
    const nameClass = streamer.displayName.length > 12 ? 'streamer-name long-name' : 'streamer-name';

    let youtubeUrl = '';
    if (streamer.youtubeType === 'channel') {
        youtubeUrl = `https://youtube.com/channel/${streamer.youtube}`;
    } else if (streamer.youtubeType === 'user') {
        youtubeUrl = `https://youtube.com/@${streamer.youtube}`;
    }
    
    let telegramUrl = `https://t.me/${streamer.telegram}`;
    
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
            ${streamer.platforms.includes('twitch') ? `
                <a href="https://twitch.tv/${streamer.twitchId}" class="twitch" target="_blank" title="Twitch канал">
                    <i class="fab fa-twitch"></i>
                </a>
            ` : ''}
            ${streamer.platforms.includes('youtube') ? `
                <a href="${youtubeUrl}" class="youtube" target="_blank" title="YouTube канал">
                    <i class="fab fa-youtube"></i>
                </a>
            ` : ''}
            <a href="${telegramUrl}" class="telegram" target="_blank" title="Telegram канал">
                <i class="fab fa-telegram"></i>
            </a>
        </div>
    `;
    
    return card;
}

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
    
    const noStreamersMessage = document.querySelector('.no-streamers-message');
    if (!noStreamersMessage && visibleCount === 0 && filter === 'live') {
        const streamersContainer = document.getElementById('streamers-container');
        const message = document.createElement('div');
        message.className = 'no-streamers-message';
        message.innerHTML = '<p>На жаль, зараз немає стримерів в ефірі</p>';
        streamersContainer.appendChild(message);
    } else if (noStreamersMessage && visibleCount > 0) {
        noStreamersMessage.remove();
    }
}

async function checkStreamStatus() {
    const clientId = 'gp762nuuoqcoxypju8c569th9wz7q5';
    const accessToken = '0b09xd33shszp6496w5m8f03yalc8p';
    const youtubeApiKey = 'AIzaSyA-gfxxV6-1bqO7dkPJd4YZ1LVSVYEnqxM';

    let onlineCount = 0;
    const liveChannels = {};

    // Перевірка Twitch-стрімів
    try {
        const twitchStreamers = streamers.filter(s => s.twitchId);
        if (twitchStreamers.length > 0) {
            const twitchQueryParams = twitchStreamers.map(s => `user_login=${s.twitchId}`).join('&');
            const twitchResponse = await fetch(`https://api.twitch.tv/helix/streams?${twitchQueryParams}`, {
                headers: {
                    'Client-ID': clientId,
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            const twitchData = await twitchResponse.json();

            if (twitchData.data && twitchData.data.length > 0) {
                twitchData.data.forEach(stream => {
                    liveChannels[stream.user_login.toLowerCase()] = {
                        title: stream.title,
                        viewers: stream.viewer_count,
                        category: stream.game_name || 'Unknown',
                        platform: 'twitch'
                    };
                    onlineCount++;
                });
            }
        }
    } catch (error) {
        console.error('Помилка Twitch API:', error);
    }

    // Перевірка YouTube-стрімів
    try {
        const youtubeStreamers = streamers.filter(s => s.youtubeId);
        const youtubePromises = youtubeStreamers.map(async streamer => {
            const response = await fetch(
                `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=${streamer.youtubeId}&eventType=live&type=video&key=${youtubeApiKey}`
            );
            const data = await response.json();

            if (data.items && data.items.length > 0) {
                const stream = data.items[0];
                liveChannels[streamer.id.toLowerCase()] = {
                    title: stream.snippet.title,
                    viewers: 'N/A', // YouTube API не надає кількість глядачів у безкоштовній версії
                    category: stream.snippet.channelTitle,
                    platform: 'youtube'
                };
                onlineCount++;
            }
        });

        await Promise.all(youtubePromises);
    } catch (error) {
        console.error('Помилка YouTube API:', error);
    }

    // Оновлення UI та карток стримерів
    updateStreamersUI(liveChannels, onlineCount);
}

function updateStreamersUI(liveChannels, onlineCount) {
    // Оновлення лічильника онлайн-стримерів
    const liveCount = document.querySelector('.live-count');
    if (liveCount) {
        liveCount.textContent = onlineCount;
        
        const liveBtn = document.querySelector('.live-btn');
        if (liveBtn) {
            onlineCount > 0 
                ? liveBtn.classList.add('has-live') 
                : liveBtn.classList.remove('has-live');
        }
    }

    // Оновлення карток стримерів
    streamers.forEach(streamer => {
        const liveData = liveChannels[streamer.id.toLowerCase()] || 
                         liveChannels[streamer.twitchId.toLowerCase()] || 
                         liveChannels[streamer.youtubeId.toLowerCase()];
        
        const isLive = !!liveData;
        updateStreamerCard(streamer, isLive, liveData);
    });

    // Сортування стримерів
    sortStreamers();

    // Перевірка активного фільтра
    const activeLiveFilter = document.querySelector('.filter-btn[data-filter="live"].active');
    if (activeLiveFilter) {
        filterStreamers('live');
    }
}

function updateStreamerCard(streamer, isLive, streamData) {
    const streamerCard = document.getElementById(`streamer-${streamer.id}`);
    if (!streamerCard) return;

    streamerCard.setAttribute('data-live', isLive ? 'true' : 'false');
    streamerCard.classList.toggle('live', isLive);

    const streamStatus = streamerCard.querySelector('.stream-status');
    const socialIcons = streamerCard.querySelector('.social-icons');
    
    if (isLive) {
        // Статус онлайн
        streamStatus.innerHTML = `
            <span class="status-online">Онлайн (${streamData.platform.toUpperCase()})</span>
            ${streamData.viewers !== 'N/A' ? `
            <span class="viewers-count">
                <i class="fas fa-user"></i> ${streamData.viewers}
            </span>` : ''}
        `;

        // Додавання індикатора LIVE
        let liveBadge = streamerCard.querySelector('.live-badge');
        if (!liveBadge) {
            liveBadge = document.createElement('div');
            liveBadge.className = 'live-badge';
            liveBadge.textContent = 'LIVE';
            streamerCard.appendChild(liveBadge);
        }

        // Інформація про стрім
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

        // Підсвічування іконки платформи
        const platformIcons = {
            twitch: streamerCard.querySelector('.social-icons .twitch'),
            youtube: streamerCard.querySelector('.social-icons .youtube')
        };
        
        Object.values(platformIcons).forEach(icon => {
            icon.classList.remove('live');
        });

        if (platformIcons[streamData.platform]) {
            platformIcons[streamData.platform].classList.add('live');
        }
    } else {
        // Статус офлайн
        streamStatus.innerHTML = '<span class="status-offline">Офлайн</span>';
        
        streamerCard.querySelector('.live-badge')?.remove();
        streamerCard.querySelector('.stream-info')?.remove();

        const platformIcons = {
            twitch: streamerCard.querySelector('.social-icons .twitch'),
            youtube: streamerCard.querySelector('.social-icons .youtube')
        };
        Object.values(platformIcons).forEach(icon => {
            icon.classList.remove('live');
        });
    }
}

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
