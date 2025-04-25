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
        youtubeId: '', // Немає YouTube
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
    const promises = streamers.map(async streamer => {
        let isLive = false;
        let platform = '';
        let streamData = null;

        // Перевірка YouTube
        if (streamer.platforms.includes('youtube') && streamer.youtubeId) {
            try {
                const youtubeResponse = await fetch(
                    `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=${streamer.youtubeId}&eventType=live&type=video&key=${YOUTUBE_API_KEY}`
                );
                const youtubeData = await youtubeResponse.json();

                if (youtubeData.items && youtubeData.items.length > 0) {
                    isLive = true;
                    platform = 'youtube';
                    streamData = {
                        title: youtubeData.items[0].snippet.title,
                        category: youtubeData.items[0].snippet.channelTitle,
                        viewers: 'N/A'
                    };
                }
            } catch (error) {
                console.error('YouTube API error:', error);
            }
        }

        // Перевірка Twitch, якщо YouTube не в ефірі
        if (!isLive && streamer.platforms.includes('twitch') && streamer.twitchId) {
            try {
                const twitchResponse = await fetch(
                    `https://api.twitch.tv/helix/streams?user_login=${streamer.twitchId}`, 
                    {
                        headers: {
                            'Client-ID': TWITCH_CLIENT_ID,
                            'Authorization': `Bearer ${TWITCH_ACCESS_TOKEN}`
                        }
                    }
                );
                const twitchData = await twitchResponse.json();

                if (twitchData.data && twitchData.data.length > 0) {
                    isLive = true;
                    platform = 'twitch';
                    streamData = {
                        title: twitchData.data[0].title,
                        category: twitchData.data[0].game_name || 'Unknown',
                        viewers: twitchData.data[0].viewer_count
                    };
                }
            } catch (error) {
                console.error('Twitch API error:', error);
            }
        }

        return { streamer, isLive, platform, streamData };
    });

    const results = await Promise.all(promises);
    updateStreamers(results);
}

function updateStreamers(results) {
    let onlineCount = 0;

    results.forEach(({ streamer, isLive, platform, streamData }) => {
        const streamerCard = document.getElementById(`streamer-${streamer.id}`);
        
        if (streamerCard) {
            streamerCard.setAttribute('data-live', isLive ? 'true' : 'false');
            
            if (isLive) {
                onlineCount++;
                streamerCard.classList.add('live');
                updateLiveCard(streamerCard, platform, streamData);
            } else {
                streamerCard.classList.remove('live');
                resetOfflineCard(streamerCard);
            }
        }
    });

    updateLiveButton(onlineCount);
    sortStreamers();
}

function updateLiveCard(card, platform, streamData) {
    const statusEl = card.querySelector('.stream-status');
    const socialIcons = card.querySelector('.social-icons');

    statusEl.innerHTML = `
        <span class="status-online">Онлайн (${platform.toUpperCase()})</span>
        <span class="viewers-count">
            <i class="fas fa-user"></i> ${streamData.viewers || 'N/A'}
        </span>
    `;

    const existingBadge = card.querySelector('.live-badge');
    if (!existingBadge) {
        const liveBadge = document.createElement('div');
        liveBadge.className = 'live-badge';
        liveBadge.textContent = 'LIVE';
        card.appendChild(liveBadge);
    }

    let streamInfoEl = card.querySelector('.stream-info');
    if (!streamInfoEl) {
        streamInfoEl = document.createElement('div');
        streamInfoEl.className = 'stream-info';
        card.insertBefore(streamInfoEl, socialIcons);
    }

    streamInfoEl.innerHTML = `
        <div class="stream-title">${streamData.title}</div>
        <div class="stream-category">${streamData.category}</div>
    `;

    const platformIcons = {
        twitch: card.querySelector('.social-icons .twitch'),
        youtube: card.querySelector('.social-icons .youtube')
    };

    Object.values(platformIcons).forEach(icon => {
        icon.classList.remove('live');
    });

    platformIcons[platform]?.classList.add('live');
}

function resetOfflineCard(card) {
    const statusEl = card.querySelector('.stream-status');
    const streamInfoEl = card.querySelector('.stream-info');
    const liveBadge = card.querySelector('.live-badge');
    const socialIcons = card.querySelector('.social-icons');

    statusEl.innerHTML = '<span class="status-offline">Офлайн</span>';
    streamInfoEl?.remove();
    liveBadge?.remove();

    const platformIcons = {
        twitch: card.querySelector('.social-icons .twitch'),
        youtube: card.querySelector('.social-icons .youtube')
    };
    Object.values(platformIcons).forEach(icon => {
        icon.classList.remove('live');
    });
}

function updateLiveButton(count) {
    const liveCountEl = document.querySelector('.live-count');
    const liveBtnEl = document.querySelector('.live-btn');

    if (liveCountEl) liveCountEl.textContent = count;
    if (liveBtnEl) {
        count > 0 
            ? liveBtnEl.classList.add('has-live') 
            : liveBtnEl.classList.remove('has-live');
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

document.addEventListener('DOMContentLoaded', initStreamersPage);
setInterval(checkStreamStatus, 60000);
```
