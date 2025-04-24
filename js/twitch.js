/**
 * Скрипт для перевірки статусу Twitch-стримерів
 * Адаптований для рядкового відображення картки стримера
 */

function checkStreamStatus() {
    // Налаштування API Twitch
    // Ці значення потрібно замінити на справжні, отримані через Twitch Developer Portal
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
            game: 'World of Tanks'
        },
        { 
            id: 'posty', 
            element: 'streamer-2',
            displayName: 'Posty',
            avatarUrl: 'https://i.ytimg.com/vi/jnF0PIPJKrM/maxresdefault.jpg',
            description: 'Відомий стример і коментатор. Командир G2_UA. Спеціалізація на тактиці.',
            game: 'World of Tanks'
        },
        { 
            id: 'juniortv_gaming', 
            element: 'streamer-3',
            displayName: 'JuniorTV Gaming',
            avatarUrl: 'https://static-cdn.jtvnw.net/jtv_user_pictures/a88fe91c-d626-470e-b63b-e69af4de1ef2-profile_image-300x300.png',
            description: 'Учасник G4_UA. Стримить регулярно з фокусом на командну гру та навчання новачків.',
            game: 'World of Tanks'
        }
    ];
    
    // Формуємо параметри запиту для кількох каналів одночасно
    const queryParams = twitchChannels.map(channel => `user_login=${channel.id}`).join('&');
    
    // Отримуємо дані про користувачів Twitch для оновлення інформації
    fetch(`https://api.twitch.tv/helix/users?${queryParams}`, {
        headers: {
            'Client-ID': clientId,
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`API error (users): ${response.status}`);
        }
        return response.json();
    })
    .then(userData => {
        // Оновлюємо дані користувачів з Twitch
        if (userData.data && userData.data.length > 0) {
            userData.data.forEach(user => {
                // Знаходимо відповідний канал в нашому масиві
                const channel = twitchChannels.find(c => c.id === user.login.toLowerCase());
                if (!channel) return;
                
                // Оновлюємо дані про стримера, якщо вони є
                channel.displayName = user.display_name || channel.displayName;
                
                // Якщо є аватар з Twitch, оновлюємо його
                if (user.profile_image_url) {
                    channel.avatarUrl = user.profile_image_url;
                }
            });
        }
        
        // Тепер перевіряємо статус стримів
        return fetch(`https://api.twitch.tv/helix/streams?${queryParams}`, {
            headers: {
                'Client-ID': clientId,
                'Authorization': `Bearer ${accessToken}`
            }
        });
    })
    .then(response => {
        // Перевіряємо успішність відповіді
        if (!response.ok) {
            throw new Error(`API error (streams): ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Створюємо мапу для швидкого пошуку каналів, які зараз в ефірі
        const liveChannels = {};
        
        // Заповнюємо мапу каналами, які зараз онлайн
        if (data.data && data.data.length > 0) {
            data.data.forEach(stream => {
                liveChannels[stream.user_login.toLowerCase()] = {
                    title: stream.title,
                    viewers: stream.viewer_count,
                    game: stream.game_name
                };
            });
        }
        
        // Оновлюємо статус для кожного стримера на сторінці
        twitchChannels.forEach(channel => {
            const streamerCard = document.getElementById(channel.element);
            if (!streamerCard) return; // Якщо елемент не знайдено, пропускаємо
            
            // Перевіряємо чи існує сучасна структура елементів
            const isNewStructure = streamerCard.querySelector('.streamer-row-info') !== null;
            
            // Оновлюємо картку в залежності від структури
            if (!isNewStructure) {
                // Створюємо нову структуру картки
                updateToNewStructure(streamerCard, channel, liveChannels[channel.id.toLowerCase()]);
            } else {
                // Оновлюємо існуючу структуру
                updateExistingCard(streamerCard, channel, liveChannels[channel.id.toLowerCase()]);
            }
        });
    })
    .catch(error => {
        console.error('Помилка отримання даних Twitch API:', error);
        
        // Встановлюємо дані вручну, якщо сталася помилка API
        twitchChannels.forEach(channel => {
            const streamerCard = document.getElementById(channel.element);
            if (!streamerCard) return;
            
            // Перевіряємо чи існує сучасна структура елементів
            const isNewStructure = streamerCard.querySelector('.streamer-row-info') !== null;
            
            if (isNewStructure) {
                // Встановлюємо статус "Офлайн" для нової структури
                const statusIndicator = streamerCard.querySelector('.status-indicator');
                const statusText = streamerCard.querySelector('.streamer-status span');
                
                if (statusIndicator && statusText) {
                    statusIndicator.classList.remove('online');
                    statusIndicator.classList.add('offline');
                    statusText.textContent = 'Офлайн';
                }
                
                // Приховуємо індикатор LIVE
                const liveIndicator = streamerCard.querySelector('.live-indicator');
                if (liveIndicator) {
                    liveIndicator.style.display = 'none';
                }
                
                // Змінюємо стиль платформи
                const platformBadge = streamerCard.querySelector('.platform-badge');
                if (platformBadge) {
                    platformBadge.classList.remove('live');
                }
                
                // Приховуємо кількість глядачів
                const viewerCount = streamerCard.querySelector('.viewer-count');
                if (viewerCount) {
                    viewerCount.style.display = 'none';
                }
                
                // Показуємо базовий контент
                const streamContent = streamerCard.querySelector('.stream-content');
                if (streamContent) {
                    streamContent.innerHTML = `<p>${channel.description}</p>`;
                }
                
                // Змінюємо кнопку
                const watchButton = streamerCard.querySelector('.watch-button');
                if (watchButton) {
                    watchButton.textContent = 'Слідкувати';
                }
                
                // Прибираємо клас streaming
                streamerCard.classList.remove('streaming');
            }
        });
    });
}

/**
 * Повністю оновлює картку до нової структури
 */
function updateToNewStructure(card, channelData, streamInfo) {
    // Зберігаємо старі елементи, які потрібно перемістити
    const oldImg = card.querySelector('.streamer-img img')?.src || '/api/placeholder/80/80';
    
    // Очищаємо картку
    card.innerHTML = '';
    
    // Створюємо нову структуру
    const isLive = streamInfo !== undefined;
    
    // Додаємо клас streaming, якщо канал онлайн
    if (isLive) {
        card.classList.add('streaming');
    } else {
        card.classList.remove('streaming');
    }
    
    // Створюємо елементи для хедера
    const headerDiv = document.createElement('div');
    headerDiv.className = 'streamer-header';
    
    // Аватар
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'streamer-avatar';
    const avatarImg = document.createElement('img');
    avatarImg.src = channelData.avatarUrl || oldImg;
    avatarImg.alt = channelData.displayName;
    avatarDiv.appendChild(avatarImg);
    
    // Контейнер для рядка інформації
    const rowInfoDiv = document.createElement('div');
    rowInfoDiv.className = 'streamer-row-info';
    
    // Назва каналу
    const nameDiv = document.createElement('div');
    nameDiv.className = 'streamer-name';
    nameDiv.textContent = channelData.displayName;
    
    // Статус (онлайн/офлайн)
    const statusDiv = document.createElement('div');
    statusDiv.className = 'streamer-status';
    const statusIndicator = document.createElement('div');
    statusIndicator.className = `status-indicator ${isLive ? 'online' : 'offline'}`;
    const statusText = document.createElement('span');
    statusText.textContent = isLive ? 'Онлайн' : 'Офлайн';
    statusDiv.appendChild(statusIndicator);
    statusDiv.appendChild(statusText);
    
    // Додаємо базові елементи
    rowInfoDiv.appendChild(nameDiv);
    rowInfoDiv.appendChild(statusDiv);
    
    // Якщо канал в ефірі, додаємо детальну інформацію
    if (isLive) {
        // Назва стріму
        const titleDiv = document.createElement('div');
        titleDiv.className = 'stream-title';
        titleDiv.textContent = streamInfo.title;
        rowInfoDiv.appendChild(titleDiv);
        
        // Платформи і LIVE індикатор
        const platformsDiv = document.createElement('div');
        platformsDiv.className = 'platform-indicators';
        
        // LIVE індикатор
        const liveIndicator = document.createElement('div');
        liveIndicator.className = 'live-indicator';
        liveIndicator.textContent = 'LIVE';
        platformsDiv.appendChild(liveIndicator);
        
        // Twitch badge
        const twitchBadge = document.createElement('div');
        twitchBadge.className = 'platform-badge twitch live';
        twitchBadge.innerHTML = '<i class="fab fa-twitch"></i> LIVE';
        platformsDiv.appendChild(twitchBadge);
        
        rowInfoDiv.appendChild(platformsDiv);
        
        // Кількість глядачів
        const viewersDiv = document.createElement('div');
        viewersDiv.className = 'viewer-count';
        viewersDiv.innerHTML = `<i class="fas fa-user"></i> ${streamInfo.viewers} глядачів`;
        rowInfoDiv.appendChild(viewersDiv);
    } else {
        // Якщо офлайн, додаємо простий badge
        const platformsDiv = document.createElement('div');
        platformsDiv.className = 'platform-indicators';
        
        // Twitch badge
        const twitchBadge = document.createElement('div');
        twitchBadge.className = 'platform-badge twitch';
        twitchBadge.innerHTML = '<i class="fab fa-twitch"></i> Twitch';
        platformsDiv.appendChild(twitchBadge);
        
        rowInfoDiv.appendChild(platformsDiv);
    }
    
    // Інформація про гру
    const gameDiv = document.createElement('div');
    gameDiv.className = 'game-info';
    gameDiv.innerHTML = `<i class="fas fa-gamepad"></i> ${streamInfo?.game || channelData.game || 'World of Tanks'}`;
    rowInfoDiv.appendChild(gameDiv);
    
    // Складаємо хедер
    headerDiv.appendChild(avatarDiv);
    headerDiv.appendChild(rowInfoDiv);
    
    // Додаємо хедер в картку
    card.appendChild(headerDiv);
    
    // Якщо офлайн, додаємо опис
    if (!isLive) {
        const contentDiv = document.createElement('div');
        contentDiv.className = 'stream-content';
        contentDiv.innerHTML = `<p>${channelData.description}</p>`;
        card.appendChild(contentDiv);
    }
    
    // Додаємо кнопки
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'streamer-buttons';
    
    // Кнопка Twitch
    const twitchButton = document.createElement('a');
    twitchButton.href = `https://twitch.tv/${channelData.id}`;
    twitchButton.className = 'watch-button';
    twitchButton.textContent = isLive ? 'Дивитись зараз' : 'Слідкувати';
    twitchButton.target = '_blank';
    
    // Кнопка YouTube
    const youtubeButton = document.createElement('a');
    youtubeButton.href = `https://youtube.com/@${channelData.id}`;
    youtubeButton.className = 'youtube-button';
    youtubeButton.textContent = 'YouTube';
    youtubeButton.target = '_blank';
    
    // Кнопка Telegram
    const telegramButton = document.createElement('a');
    telegramButton.href = `https://t.me/${channelData.id}`;
    telegramButton.className = 'telegram-button';
    telegramButton.textContent = 'Telegram';
    telegramButton.target = '_blank';
    
    buttonsDiv.appendChild(twitchButton);
    buttonsDiv.appendChild(youtubeButton);
    buttonsDiv.appendChild(telegramButton);
    
    card.appendChild(buttonsDiv);
}

/**
 * Оновлює тільки необхідні частини існуючої картки (продовження)
 */
function updateExistingCard(card, channelData, streamInfo) {
    const isLive = streamInfo !== undefined;
    
    // Оновлюємо статус картки
    if (isLive) {
        card.classList.add('streaming');
    } else {
        card.classList.remove('streaming');
    }
    
    // Оновлюємо аватар
    const avatarImg = card.querySelector('.streamer-avatar img');
    if (avatarImg && channelData.avatarUrl) {
        avatarImg.src = channelData.avatarUrl;
        avatarImg.alt = channelData.displayName;
    }
    
    // Оновлюємо ім'я
    const nameDiv = card.querySelector('.streamer-name');
    if (nameDiv) {
        nameDiv.textContent = channelData.displayName;
    }
    
    // Оновлюємо статус
    const statusIndicator = card.querySelector('.status-indicator');
    const statusText = card.querySelector('.streamer-status span');
    if (statusIndicator && statusText) {
        if (isLive) {
            statusIndicator.classList.add('online');
            statusIndicator.classList.remove('offline');
            statusText.textContent = 'Онлайн';
        } else {
            statusIndicator.classList.remove('online');
            statusIndicator.classList.add('offline');
            statusText.textContent = 'Офлайн';
        }
    }
    
    // Оновлюємо інформацію про стрім
    const titleDiv = card.querySelector('.stream-title');
    const rowInfo = card.querySelector('.streamer-row-info');
    
    // Керуємо відображенням назви стріму
    if (titleDiv) {
        if (isLive) {
            titleDiv.textContent = streamInfo.title;
            titleDiv.style.display = '';
        } else {
            titleDiv.style.display = 'none';
        }
    } else if (isLive && rowInfo) {
        // Якщо елементу назви стріму немає, але стрім онлайн, створюємо його
        const newTitleDiv = document.createElement('div');
        newTitleDiv.className = 'stream-title';
        newTitleDiv.textContent = streamInfo.title;
        
        // Вставляємо після імені та статусу
        const statusDiv = card.querySelector('.streamer-status');
        if (statusDiv) {
            rowInfo.insertBefore(newTitleDiv, statusDiv.nextSibling);
        } else {
            rowInfo.appendChild(newTitleDiv);
        }
    }
    
    // Оновлюємо LIVE індикатори
    let platformsDiv = card.querySelector('.platform-indicators');
    if (!platformsDiv && rowInfo) {
        // Створюємо елемент, якщо його немає
        platformsDiv = document.createElement('div');
        platformsDiv.className = 'platform-indicators';
        rowInfo.appendChild(platformsDiv);
    }
    
    if (platformsDiv) {
        // Оновлюємо вміст блоку платформ
        if (isLive) {
            // Перевіряємо, чи є LIVE індикатор
            let liveIndicator = platformsDiv.querySelector('.live-indicator');
            if (!liveIndicator) {
                liveIndicator = document.createElement('div');
                liveIndicator.className = 'live-indicator';
                liveIndicator.textContent = 'LIVE';
                platformsDiv.appendChild(liveIndicator);
            } else {
                liveIndicator.style.display = '';
            }
            
            // Перевіряємо, чи є Twitch badge
            let twitchBadge = platformsDiv.querySelector('.platform-badge.twitch');
            if (!twitchBadge) {
                twitchBadge = document.createElement('div');
                twitchBadge.className = 'platform-badge twitch live';
                twitchBadge.innerHTML = '<i class="fab fa-twitch"></i> LIVE';
                platformsDiv.appendChild(twitchBadge);
            } else {
                twitchBadge.className = 'platform-badge twitch live';
                twitchBadge.innerHTML = '<i class="fab fa-twitch"></i> LIVE';
            }
        } else {
            // Прибираємо LIVE індикатор, якщо стример офлайн
            const liveIndicator = platformsDiv.querySelector('.live-indicator');
            if (liveIndicator) {
                liveIndicator.style.display = 'none';
            }
            
            // Оновлюємо Twitch badge для офлайн
            const twitchBadge = platformsDiv.querySelector('.platform-badge.twitch');
            if (twitchBadge) {
                twitchBadge.className = 'platform-badge twitch';
                twitchBadge.innerHTML = '<i class="fab fa-twitch"></i> Twitch';
            }
        }
    }
    
    // Оновлюємо кількість глядачів
    let viewerCount = card.querySelector('.viewer-count');
    if (!viewerCount && isLive && rowInfo) {
        // Створюємо елемент для кількості глядачів, якщо його немає
        viewerCount = document.createElement('div');
        viewerCount.className = 'viewer-count';
        rowInfo.appendChild(viewerCount);
    }
    
    if (viewerCount) {
        if (isLive) {
            viewerCount.innerHTML = `<i class="fas fa-user"></i> ${streamInfo.viewers} глядачів`;
            viewerCount.style.display = '';
        } else {
            viewerCount.style.display = 'none';
        }
    }
    
    // Оновлюємо інформацію про гру
    const gameInfo = card.querySelector('.game-info');
    if (gameInfo) {
        gameInfo.innerHTML = `<i class="fas fa-gamepad"></i> ${isLive ? (streamInfo.game || channelData.game || 'World of Tanks') : (channelData.game || 'World of Tanks')}`;
    }
    
    // Оновлюємо зміст стріму
    const contentDiv = card.querySelector('.stream-content');
    if (contentDiv) {
        if (!isLive) {
            contentDiv.innerHTML = `<p>${channelData.description}</p>`;
            contentDiv.style.display = '';
        } else {
            contentDiv.style.display = 'none';
        }
    } else if (!isLive) {
        // Якщо елементу немає, але стример офлайн, створюємо його
        const newContentDiv = document.createElement('div');
        newContentDiv.className = 'stream-content';
        newContentDiv.innerHTML = `<p>${channelData.description}</p>`;
        
        // Вставляємо перед кнопками
        const buttonsDiv = card.querySelector('.streamer-buttons');
        if (buttonsDiv) {
            card.insertBefore(newContentDiv, buttonsDiv);
        } else {
            card.appendChild(newContentDiv);
        }
    }
    
    // Оновлюємо кнопки
    const watchButton = card.querySelector('.watch-button');
    if (watchButton) {
        watchButton.textContent = isLive ? 'Дивитись зараз' : 'Слідкувати';
        watchButton.href = `https://twitch.tv/${channelData.id}`;
    }
}

// Перевіряємо статус при завантаженні сторінки
document.addEventListener('DOMContentLoaded', checkStreamStatus);

// Оновлюємо статус кожну хвилину
setInterval(checkStreamStatus, 60000);
