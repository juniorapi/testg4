/**
 * Оновлений скрипт для роботи зі стримерами через Twitch API з компактним дизайном
 */

// Масив з даними про стримерів
const streamers = [
    { 
        id: 'cs2_maincast', 
        twitchId: 'cs2_maincast',
        displayName: 'cs2_maincast',
        avatarUrl: 'img/cs2_maincast.png',
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
        youtube: 'ceh9live',
        telegram: 'ceh9forukraine',
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
        youtube: 'JuniorTV_Gaming',
        telegram: 'JuniorTV_Gaming',
        schedule: {
            'Понеділок': '—',
            'Вівторок': '18:00-22:00',
            'Середа': '—',
            'Четвер': '—',
            'П\'ятниця': '18:00-22:00',
            'Субота': '—',
            'Неділя': '12:00-18:00'
        }
    },
    // Додамо більше стримерів для прикладу
    { 
        id: 'tankace', 
        twitchId: 'tankace',
        displayName: 'TankAce',
        avatarUrl: '/api/placeholder/80/80',
        description: 'Ветеран WoT з 10+ років досвіду. Член G1_UA.',
        clan: 'G1_UA',
        game: 'World of Tanks',
        youtube: 'tankace',
        telegram: 'tankace',
        schedule: {
            'Понеділок': '—',
            'Вівторок': '19:00-22:00',
            'Середа': '—',
            'Четвер': '19:00-22:00',
            'П\'ятниця': '—',
            'Субота': '15:00-20:00',
            'Неділя': '15:00-20:00'
        }
    },
    { 
        id: 'artypro', 
        twitchId: 'artypro',
        displayName: 'ArtyPro',
        avatarUrl: '/api/placeholder/80/80',
        description: 'Експерт з артилерії. Член G3_UA.',
        clan: 'G3_UA',
        game: 'World of Tanks',
        youtube: 'artypro',
        telegram: 'artypro',
        schedule: {
            'Понеділок': '21:00-00:00',
            'Вівторок': '—',
            'Середа': '21:00-00:00',
            'Четвер': '—',
            'П\'ятниця': '21:00-00:00',
            'Субота': '—',
            'Неділя': '18:00-22:00'
        }
    },
    { 
        id: 'medicdoc', 
        twitchId: 'medicdoc',
        displayName: 'MedicDoc',
        avatarUrl: '/api/placeholder/80/80',
        description: 'Стримить переважно техніку підтримки. Член G5_UA.',
        clan: 'G5_UA',
        game: 'World of Tanks',
        youtube: 'medicdoc',
        telegram: 'medicdoc',
        schedule: {
            'Понеділок': '18:00-21:00',
            'Вівторок': '—',
            'Середа': '18:00-21:00',
            'Четвер': '—',
            'П\'ятниця': '18:00-21:00',
            'Субота': '12:00-16:00',
            'Неділя': '—'
        }
    }
];

/**
 * Ініціалізація сторінки стримерів
 */
function initStreamersPage() {
    // Додаємо CSS для компактного режиму списку стримерів
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .streamers-compact {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)) !important;
        }
        
        .streamer-compact {
            display: flex;
            flex-direction: column;
            max-width: 250px;
        }
        
        .streamer-compact .streamer-header {
            padding: 10px;
        }
        
        .streamer-compact .streamer-avatar {
            width: 50px;
            height: 50px;
        }
        
        .streamer-compact .social-icons {
            display: flex;
            gap: 8px;
            padding: 8px 10px;
            background-color: rgba(0, 0, 0, 0.2);
            justify-content: center;
        }
        
        .streamer-compact .social-icons a {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background-color: rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 16px;
            transition: all 0.2s;
        }
        
        .streamer-compact .social-icons .twitch {
            background-color: #6441a5;
        }
        
        .streamer-compact .social-icons .youtube {
            background-color: #ff0000;
        }
        
        .streamer-compact .social-icons .telegram {
            background-color: #0088cc;
        }
        
        .streamer-compact .social-icons a:hover {
            transform: translateY(-2px);
            filter: brightness(1.1);
        }
        
        .streamer-compact .platform-tags {
            position: static;
            margin-top: 8px;
        }
    `;
    document.head.appendChild(styleElement);
    
    // Очищення та заповнення контейнера всіх стримерів
    const allStreamersContainer = document.getElementById('all-streamers');
    if (allStreamersContainer) {
        allStreamersContainer.innerHTML = '';
        
        // Створення компактних карток для всіх стримерів
        streamers.forEach(streamer => {
            const card = createCompactStreamerCard(streamer);
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
 * Створення компактної картки стримера для списку "Всі стримери"
 */
function createCompactStreamerCard(streamer) {
    const card = document.createElement('div');
    card.className = 'streamer-card streamer-compact';
    card.id = `streamer-${streamer.id}`;
    
    card.innerHTML = `
        <div class="streamer-header">
            <div class="streamer-avatar">
                <img src="${streamer.avatarUrl}" alt="${streamer.displayName}">
            </div>
            <div class="streamer-info">
                <h3 class="streamer-name">${streamer.displayName}</h3>
                <div class="clan-tag">${streamer.clan}</div>
                <div class="platform-tags">
                    <span class="platform twitch">
                        <i class="fab fa-twitch"></i> Twitch
                    </span>
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
 * Створення розширеної картки стримера для розділу "Зараз в ефірі"
 */
function createOnlineStreamerCard(streamer, streamData) {
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
                <div class="clan-tag">${streamer.clan}</div>
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
        </div>
        
        <div class="streamer-links">
            <a href="https://twitch.tv/${streamer.twitchId}" class="btn btn-twitch" target="_blank">
                <i class="fab fa-twitch"></i> Дивитись зараз
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
            updateCompactStreamerCard(streamer, isLive);
            
            // Якщо стример онлайн, додаємо його в секцію "Зараз в ефірі"
            if (isLive && onlineStreamers) {
                const onlineCard = createOnlineStreamerCard(streamer, streamData);
                onlineStreamers.appendChild(onlineCard);
            }
        });
    })
    .catch(error => {
        console.error('Помилка отримання даних Twitch API:', error);
        
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
 * Оновлює компактну картку стримера
 */
function updateCompactStreamerCard(streamer, isLive) {
    const streamerCard = document.getElementById(`streamer-${streamer.id}`);
    if (!streamerCard) return;
    
    // Оновлюємо клас картки
    if (isLive) {
        streamerCard.classList.add('live');
    } else {
        streamerCard.classList.remove('live');
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
        streamerCard.insertBefore(liveBadge, streamerCard.firstChild);
    } else if (!isLive && liveBadge) {
        // Якщо стример офлайн, а індикатор є, видаляємо його
        liveBadge.remove();
    }
    
    // Оновлюємо Twitch іконку для онлайн-статусу
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
}

// Ініціалізуємо сторінку при завантаженні
document.addEventListener('DOMContentLoaded', initStreamersPage);

// Оновлюємо статус кожну хвилину
setInterval(checkStreamStatus, 60000);
