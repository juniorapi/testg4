/**
 * Спрощений та чистий скрипт для перевірки статусу стримерів через Twitch API
 */

function checkStreamStatus() {
    // Налаштування API Twitch (потрібно замінити на справжні ключі з Twitch Developer Portal)
    const clientId = 'gp762nuuoqcoxypju8c569th9wz7q5';
    const accessToken = '0b09xd33shszp6496w5m8f03yalc8p';
    
    // Масив каналів Twitch з даними для відображення
    const twitchChannels = [
        { 
            id: 'sh0kerix', 
            element: 'streamer-1',
            displayName: 'Sh0kerix',
            avatarUrl: 'https://yt3.googleusercontent.com/ytc/AIf8zZReJRPCiWh2-Vc7hVaIkSaPT5LRiwnC4hfLJnmJEw=s900-c-k-c0x00ffffff-no-rj',
            description: 'Стример і професійний гравець G1_UA. Експерт по важких танках.',
            clan: 'G1_UA',
            game: 'World of Tanks'
        },
        { 
            id: 'posty', 
            element: 'streamer-2',
            displayName: 'Posty',
            avatarUrl: 'https://i.ytimg.com/vi/jnF0PIPJKrM/maxresdefault.jpg',
            description: 'Відомий стример і коментатор. Командир G2_UA. Спеціалізація на тактиці.',
            clan: 'G2_UA',
            game: 'World of Tanks'
        },
        { 
            id: 'juniortv_gaming', 
            element: 'streamer-3',
            displayName: 'JuniorTV Gaming',
            avatarUrl: 'https://static-cdn.jtvnw.net/jtv_user_pictures/a88fe91c-d626-470e-b63b-e69af4de1ef2-profile_image-300x300.png',
            description: 'Учасник G4_UA. Стримить регулярно з фокусом на командну гру та навчання новачків.',
            clan: 'G4_UA',
            game: 'World of Tanks'
        }
    ];
    
    // Формуємо параметри запиту для кількох каналів одночасно
    const queryParams = twitchChannels.map(channel => `user_login=${channel.id}`).join('&');
    
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
        const onlineStreamers = document.getElementById('online-streamers');
        
        // Очищаємо секцію онлайн-стримерів
        if (onlineStreamers) {
            onlineStreamers.innerHTML = '';
        }
        
        // Заповнюємо мапу каналами, які зараз онлайн
        let onlineCount = 0;
        if (data.data && data.data.length > 0) {
            data.data.forEach(stream => {
                liveChannels[stream.user_login.toLowerCase()] = {
                    title: stream.title,
                    viewers: stream.viewer_count,
                    game: stream.game_name || 'World of Tanks'
                };
                onlineCount++;
            });
        }
        
        // Якщо немає стримерів онлайн, показуємо повідомлення
        if (onlineCount === 0 && onlineStreamers) {
            onlineStreamers.innerHTML = `
                <div class="no-streamers-message">
                    <p>Зараз немає стримерів у прямому ефірі. Перевірте розклад майбутніх стрімів.</p>
                </div>
            `;
        }
        
        // Оновлюємо дані для кожного стримера
        twitchChannels.forEach(channel => {
            const isLive = liveChannels[channel.id.toLowerCase()] !== undefined;
            const streamData = liveChannels[channel.id.toLowerCase()];
            
            // Оновлюємо картку в основному списку
            updateStreamerCard(channel, isLive, streamData);
            
            // Якщо стример онлайн, додаємо його в секцію "Зараз в ефірі"
            if (isLive && onlineStreamers) {
                addOnlineStreamerCard(onlineStreamers, channel, streamData);
            }
        });
    })
    .catch(error => {
        console.error('Помилка отримання даних Twitch API:', error);
        
        // Встановлюємо базовий статус "Офлайн" у разі помилки
        twitchChannels.forEach(channel => {
            const streamerCard = document.getElementById(channel.element);
            if (streamerCard) {
                const statusDot = streamerCard.querySelector('.status-dot');
                const statusText = streamerCard.querySelector('.status-text');
                
                if (statusDot) {
                    statusDot.className = 'status-dot offline';
                }
                
                if (statusText) {
                    statusText.textContent = 'Офлайн';
                }
                
                streamerCard.classList.remove('live');
            }
        });
        
        // Показуємо повідомлення про помилку в секції онлайн-стримерів
        const onlineStreamers = document.getElementById('online-streamers');
        if (onlineStreamers) {
            onlineStreamers.innerHTML = `
                <div class="no-streamers-message">
                    <p>Не вдалося отримати інформацію про стримерів. Спробуйте оновити сторінку пізніше.</p>
                </div>
            `;
        }
    });
}

/**
 * Оновлює існуючу картку стримера
 */
function updateStreamerCard(channel, isLive, streamData) {
    const streamerCard = document.getElementById(channel.element);
    if (!streamerCard) return;
    
    // Оновлюємо клас картки
    if (isLive) {
        streamerCard.classList.add('live');
    } else {
        streamerCard.classList.remove('live');
    }
    
    // Оновлюємо статус
    const statusDot = streamerCard.querySelector('.status-dot');
    const statusText = streamerCard.querySelector('.status-text');
    
    if (statusDot) {
        statusDot.className = isLive ? 'status-dot online' : 'status-dot offline';
    }
    
    if (statusText) {
        statusText.textContent = isLive ? 'Онлайн' : 'Офлайн';
    }
    
    // Оновлюємо аватар, якщо він є у даних
    const avatar = streamerCard.querySelector('.streamer-avatar img');
    if (avatar && channel.avatarUrl) {
        avatar.src = channel.avatarUrl;
        avatar.alt = channel.displayName;
    }
    
    // Оновлюємо ім'я
    const nameElem = streamerCard.querySelector('.streamer-name');
    if (nameElem) {
        nameElem.textContent = channel.displayName;
    }
    
    // Оновлюємо тег платформи
    const platformTags = streamerCard.querySelector('.platform-tags');
    if (platformTags) {
        // Перевіряємо, чи є тег Twitch
        let twitchTag = platformTags.querySelector('.platform.twitch');
        
        if (!twitchTag) {
            // Якщо тег не існує, створюємо його
            twitchTag = document.createElement('span');
            twitchTag.className = 'platform twitch';
            twitchTag.innerHTML = '<i class="fab fa-twitch"></i> Twitch';
            platformTags.appendChild(twitchTag);
        }
        
        // Оновлюємо класи тегу в залежності від статусу
        if (isLive) {
            twitchTag.classList.add('live');
            twitchTag.innerHTML = '<i class="fab fa-twitch"></i> LIVE';
        } else {
            twitchTag.classList.remove('live');
            twitchTag.innerHTML = '<i class="fab fa-twitch"></i> Twitch';
        }
    }
    
    // Перевіряємо, чи існує індикатор LIVE
    let liveBadge = streamerCard.querySelector('.live-badge');
    
    if (isLive && !liveBadge) {
        // Якщо стример онлайн і немає індикатора, додаємо його
        liveBadge = document.createElement('div');
        liveBadge.className = 'live-badge';
        liveBadge.textContent = 'LIVE';
        streamerCard.querySelector('.streamer-header').appendChild(liveBadge);
    } else if (!isLive && liveBadge) {
        // Якщо стример офлайн, а індикатор є, видаляємо його
        liveBadge.remove();
    }
    
    // Перевіряємо, чи існує блок з інформацією про стрім
    let streamInfo = streamerCard.querySelector('.stream-info');
    
    if (isLive) {
        // Якщо стример онлайн, додаємо інформацію про стрім
        if (!streamInfo) {
            streamInfo = document.createElement('div');
            streamInfo.className = 'stream-info';
            
            // Вставляємо після заголовка
            const header = streamerCard.querySelector('.streamer-header');
            if (header) {
                header.insertAdjacentElement('afterend', streamInfo);
            }
        }
        
        // Оновлюємо вміст блоку стріму
        streamInfo.innerHTML = `
            <div class="stream-title">${streamData.title}</div>
            <div class="stream-meta">
                <span class="viewer-count">
                    <i class="fas fa-user"></i> ${streamData.viewers}
                </span>
                <span class="game-tag">
                    <i class="fas fa-gamepad"></i> ${streamData.game}
                </span>
            </div>
        `;
    } else if (!isLive && streamInfo) {
        // Якщо стример офлайн, а блок стріму є, видаляємо його
        streamInfo.remove();
    }
    
    // Оновлюємо опис
    const description = streamerCard.querySelector('.streamer-description p');
    if (description) {
        description.textContent = channel.description;
    }
    
    // Оновлюємо мета-інформацію
    const clanTag = streamerCard.querySelector('.clan-tag');
    if (clanTag) {
        clanTag.textContent = channel.clan;
    }
    
    const gameTag = streamerCard.querySelector('.game-tag');
    if (gameTag) {
        gameTag.innerHTML = `<i class="fas fa-gamepad"></i> ${channel.game}`;
    }
    
    // Оновлюємо посилання на канал Twitch
    const twitchLink = streamerCard.querySelector('.btn-twitch');
    if (twitchLink) {
        twitchLink.href = `https://twitch.tv/${channel.id}`;
        twitchLink.innerHTML = isLive 
            ? '<i class="fab fa-twitch"></i> Дивитись зараз' 
            : '<i class="fab fa-twitch"></i> Канал';
    }
}

/**
 * Додає картку онлайн-стримера до секції "Зараз в ефірі"
 */
function addOnlineStreamerCard(container, channel, streamData) {
    // Створюємо нову картку для онлайн-стримера
    const card = document.createElement('div');
    card.className = 'streamer-card live';
    card.id = `online-${channel.element}`;
    
    card.innerHTML = `
        <div class="live-badge">LIVE</div>
        <div class="streamer-header">
            <div class="streamer-avatar">
                <img src="${channel.avatarUrl}" alt="${channel.displayName}">
            </div>
            <div class="streamer-info">
                <h3 class="streamer-name">${channel.displayName}</h3>
                <div class="streamer-status">
                    <span class="status-dot online"></span>
                    <span class="status-text">Онлайн</span>
                </div>
            </div>
            <div class="platform-tags">
                <span class="platform twitch live">
                    <i class="fab fa-twitch"></i> LIVE
                </span>
            </div>
        </div>
        
        <div class="stream-info">
            <div class="stream-title">${streamData.title}</div>
            <div class="stream-meta">
                <span class="viewer-count">
                    <i class="fas fa-user"></i> ${streamData.viewers}
                </span>
                <span class="game-tag">
                    <i class="fas fa-gamepad"></i> ${streamData.game}
                </span>
            </div>
        </div>
        
        <div class="streamer-description">
            <p>${channel.description}</p>
            <div class="streamer-meta">
                <span class="clan-tag">${channel.clan}</span>
                <span class="game-tag">
                    <i class="fas fa-gamepad"></i> ${channel.game}
                </span>
            </div>
        </div>
        
        <div class="streamer-links">
            <a href="https://twitch.tv/${channel.id}" class="btn btn-twitch" target="_blank">
                <i class="fab fa-twitch"></i> Дивитись зараз
            </a>
            <a href="https://youtube.com/@${channel.id}" class="btn btn-youtube" target="_blank">
                <i class="fab fa-youtube"></i> YouTube
            </a>
            <a href="https://t.me/${channel.id}" class="btn btn-telegram" target="_blank">
                <i class="fab fa-telegram"></i> Telegram
            </a>
        </div>
    `;
    
    // Додаємо картку до контейнера
    container.appendChild(card);
}

// Перевіряємо статус при завантаженні сторінки
document.addEventListener('DOMContentLoaded', checkStreamStatus);

// Оновлюємо статус кожну хвилину
setInterval(checkStreamStatus, 60000);
