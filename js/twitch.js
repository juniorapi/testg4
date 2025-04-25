/**
 * Оновлений скрипт для роботи зі стримерами через Twitch API
 */

// Масив з даними про стримерів
const streamers = [
    { 
        id: 'sh0kerix', 
        twitchId: 'sh0kerix',
        displayName: 'Sh0kerix',
        avatarUrl: 'img/sh0kerix',
        description: 'Стример і професійний гравець G1_UA. Експерт по важких танках.',
        clan: 'G1_UA',
        game: 'World of Tanks',
        youtube: 'sh0kerix',
        telegram: 'sh0kerix',
        schedule: {
            'Понеділок': '19:00-23:00',
            'Вівторок': '—',
            'Середа': '19:00-23:00',
            'Четвер': '—',
            'П\'ятниця': '19:00-23:00',
            'Субота': '14:00-20:00',
            'Неділя': '—'
        }
    },
    { 
        id: 'ceh9', 
        twitchId: 'ceh9',
        displayName: 'ceh9',
        avatarUrl: 'img/ceh9.png',
        description: 'Відомий стример і коментатор. Командир G2_UA. Спеціалізація на тактиці.',
        clan: 'G2_UA',
        game: 'World of Tanks',
        youtube: 'posty',
        telegram: 'posty',
        schedule: {
            'Понеділок': '—',
            'Вівторок': '20:00-00:00',
            'Середа': '—',
            'Четвер': '20:00-00:00',
            'П\'ятниця': '—',
            'Субота': '16:00-00:00',
            'Неділя': '16:00-00:00'
        }
    },
    { 
        id: 'juniortv_gaming', 
        twitchId: 'juniortv_gaming',
        displayName: 'JuniorTV_Gaming',
        avatarUrl: 'img/jtv.png',
        description: 'Учасник G4_UA. Стримить 3 рази на тиждень. Спеціалізація на легких танках та розвідці.',
        clan: 'G4_UA',
        game: 'World of Tanks',
        youtube: 'lighttank_girl',
        telegram: 'lighttank_girl',
        schedule: {
            'Понеділок': '—',
            'Вівторок': '18:00-22:00',
            'Середа': '—',
            'Четвер': '—',
            'П\'ятниця': '18:00-22:00',
            'Субота': '—',
            'Неділя': '12:00-18:00'
        }
    }
];

/**
 * Ініціалізація сторінки стримерів
 */
function initStreamersPage() {
    // Очищення та заповнення контейнера всіх стримерів
    const allStreamersContainer = document.getElementById('all-streamers');
    if (allStreamersContainer) {
        allStreamersContainer.innerHTML = '';
        
        // Створення карток для всіх стримерів
        streamers.forEach(streamer => {
            const card = createStreamerCard(streamer);
            allStreamersContainer.appendChild(card);
        });
    }
    
    // Заповнення розкладу стримів
    const scheduleBody = document.getElementById('schedule-body');
    if (scheduleBody) {
        scheduleBody.innerHTML = '';
        
        // Створення рядків розкладу для кожного стримера
        streamers.forEach(streamer => {
            const scheduleRow = document.createElement('tr');
            
            // Ім'я стримера
            const nameCell = document.createElement('td');
            nameCell.textContent = streamer.displayName;
            scheduleRow.appendChild(nameCell);
            
            // Додавання розкладу для кожного дня тижня
            const days = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота', 'Неділя'];
            
            days.forEach(day => {
                const timeCell = document.createElement('td');
                timeCell.textContent = streamer.schedule[day] || '—';
                scheduleRow.appendChild(timeCell);
            });
            
            scheduleBody.appendChild(scheduleRow);
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
    
    card.innerHTML = `
        <div class="streamer-header">
            <div class="streamer-avatar">
                <img src="${streamer.avatarUrl}" alt="${streamer.displayName}">
            </div>
            <div class="streamer-info">
                <h3 class="streamer-name">${streamer.displayName}</h3>
                <div class="streamer-status">
                    <span class="status-dot offline"></span>
                    <span class="status-text">Офлайн</span>
                </div>
            </div>
            <div class="platform-tags">
                <span class="platform twitch">
                    <i class="fab fa-twitch"></i> Twitch
                </span>
            </div>
        </div>
        <div class="streamer-description">
            <p>${streamer.description}</p>
            <div class="streamer-meta">
                <span class="clan-tag">${streamer.clan}</span>
                <span class="game-tag">
                    <i class="fas fa-gamepad"></i> ${streamer.game}
                </span>
            </div>
        </div>
        <div class="streamer-links">
            <a href="https://twitch.tv/${streamer.twitchId}" class="btn btn-twitch" target="_blank">
                <i class="fab fa-twitch"></i> Канал
            </a>
            <a href="https://youtube.com/@${streamer.youtube}" class="btn btn-youtube" target="_blank">
                <i class="fab fa-youtube"></i> YouTube
            </a>
            <a href="https://t.me/${streamer.telegram}" class="btn btn-telegram" target="_blank">
                <i class="fab fa-telegram"></i> Telegram
            </a>
        </div>
    `;
    
    return card;
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
        streamers.forEach(streamer => {
            const isLive = liveChannels[streamer.twitchId.toLowerCase()] !== undefined;
            const streamData = liveChannels[streamer.twitchId.toLowerCase()];
            
            // Оновлюємо картку в основному списку
            updateStreamerCard(streamer, isLive, streamData);
            
            // Якщо стример онлайн, додаємо його в секцію "Зараз в ефірі"
            if (isLive && onlineStreamers) {
                addOnlineStreamerCard(onlineStreamers, streamer, streamData);
            }
        });
    })
    .catch(error => {
        console.error('Помилка отримання даних Twitch API:', error);
        
        // Встановлюємо базовий статус "Офлайн" у разі помилки
        streamers.forEach(streamer => {
            const streamerCard = document.getElementById(`streamer-${streamer.id}`);
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
function updateStreamerCard(streamer, isLive, streamData) {
    const streamerCard = document.getElementById(`streamer-${streamer.id}`);
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
    
    // Оновлюємо посилання на канал Twitch
    const twitchLink = streamerCard.querySelector('.btn-twitch');
    if (twitchLink) {
        twitchLink.href = `https://twitch.tv/${streamer.twitchId}`;
        twitchLink.innerHTML = isLive 
            ? '<i class="fab fa-twitch"></i> Дивитись зараз' 
            : '<i class="fab fa-twitch"></i> Канал';
    }
}

/**
 * Додає картку онлайн-стримера до секції "Зараз в ефірі"
 */
function addOnlineStreamerCard(container, streamer, streamData) {
    // Створюємо нову картку для онлайн-стримера
    const card = document.createElement('div');
    card.className = 'streamer-card live';
    card.id = `online-${streamer.id}`;
    
    card.innerHTML = `
        <div class="live-badge">LIVE</div>
        <div class="streamer-header">
            <div class="streamer-avatar">
                <img src="${streamer.avatarUrl}" alt="${streamer.displayName}">
            </div>
            <div class="streamer-info">
                <h3 class="streamer-name">${streamer.displayName}</h3>
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
            <p>${streamer.description}</p>
            <div class="streamer-meta">
                <span class="clan-tag">${streamer.clan}</span>
                <span class="game-tag">
                    <i class="fas fa-gamepad"></i> ${streamer.game}
                </span>
            </div>
        </div>
        
        <div class="streamer-links">
            <a href="https://twitch.tv/${streamer.twitchId}" class="btn btn-twitch" target="_blank">
                <i class="fab fa-twitch"></i> Дивитись зараз
            </a>
            <a href="https://youtube.com/@${streamer.youtube}" class="btn btn-youtube" target="_blank">
                <i class="fab fa-youtube"></i> YouTube
            </a>
            <a href="https://t.me/${streamer.telegram}" class="btn btn-telegram" target="_blank">
                <i class="fab fa-telegram"></i> Telegram
            </a>
        </div>
    `;
    
    // Додаємо картку до контейнера
    container.appendChild(card);
}

// Ініціалізуємо сторінку при завантаженні
document.addEventListener('DOMContentLoaded', initStreamersPage);

// Оновлюємо статус кожну хвилину
setInterval(checkStreamStatus, 60000);
