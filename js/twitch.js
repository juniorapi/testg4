/**
 * Скрипт для перевірки статусу Twitch-стримерів
 * Автоматично отримує дані про стримерів та оновлює їх статус на сторінці
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
            description: 'Стример і професійний гравець G1_UA. Експерт по важких танках.'
        },
        { 
            id: 'ceh9', 
            element: 'streamer-2',
            displayName: 'Ceh9',
            avatarUrl: 'https://i.ytimg.com/vi/jnF0PIPJKrM/maxresdefault.jpg',
            description: 'Відомий стример і коментатор. Командир G2_UA. Спеціалізація на тактиці.'
        },
        { 
            id: 'juniortv_gaming', 
            element: 'streamer-3',
            displayName: 'JuniorTV Gaming',
            avatarUrl: 'https://static-cdn.jtvnw.net/jtv_user_pictures/a88fe91c-d626-470e-b63b-e69af4de1ef2-profile_image-300x300.png',
            description: 'Учасник G4_UA. Стримить регулярно з фокусом на командну гру та навчання новачків.'
        }
    ];
    
    // Спочатку встановлюємо базову інформацію для всіх стримерів
    twitchChannels.forEach(channel => {
        const streamerCard = document.getElementById(channel.element);
        if (!streamerCard) return; // Якщо елемент не знайдено, пропускаємо
        
        // Оновлюємо заголовок з іменем стримера
        const nameElement = streamerCard.querySelector('h3');
        if (nameElement) {
            nameElement.textContent = channel.displayName;
        }
        
        // Оновлюємо зображення стримера
        const avatarImg = streamerCard.querySelector('.streamer-img img');
        if (avatarImg && channel.avatarUrl) {
            avatarImg.src = channel.avatarUrl;
            avatarImg.alt = channel.displayName;
        }
        
        // Встановлюємо базовий опис
        const descriptionElement = streamerCard.querySelector('.streamer-description');
        if (descriptionElement) {
            descriptionElement.innerHTML = `<p>${channel.description}</p>`;
        }
    });
    
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
                
                // Оновлюємо інформацію на сторінці
                const streamerCard = document.getElementById(channel.element);
                if (!streamerCard) return;
                
                // Оновлюємо ім'я
                const nameElement = streamerCard.querySelector('h3');
                if (nameElement) {
                    nameElement.textContent = channel.displayName;
                }
                
                // Оновлюємо аватар
                const avatarImg = streamerCard.querySelector('.streamer-img img');
                if (avatarImg && channel.avatarUrl) {
                    avatarImg.src = channel.avatarUrl;
                    avatarImg.alt = channel.displayName;
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
            
            const statusIndicator = streamerCard.querySelector('.status-indicator');
            const statusText = streamerCard.querySelector('.streamer-status span');
            const streamerDescription = streamerCard.querySelector('.streamer-description');
            const twitchButton = streamerCard.querySelector('.twitch-button');
            
            // Перевіряємо, чи стример онлайн
            if (liveChannels[channel.id.toLowerCase()]) {
                // Стример онлайн
                streamerCard.classList.add('streaming');
                statusIndicator.classList.add('online');
                statusIndicator.classList.remove('offline');
                statusText.textContent = 'Онлайн';
                
                // Додаємо інформацію про стрім
                const streamInfo = liveChannels[channel.id.toLowerCase()];
                streamerDescription.innerHTML = `
                    <strong>${streamInfo.title}</strong>
                    <div class="viewer-count">
                        <i class="fas fa-user"></i> Глядачів: ${streamInfo.viewers}
                    </div>
                    <div class="game-info">
                        <i class="fas fa-gamepad"></i> Гра: ${streamInfo.game || 'World of Tanks'}
                    </div>
                `;
                
                // Змінюємо текст кнопки та стилі
                if (twitchButton) {
                    twitchButton.textContent = 'Дивитись';
                    twitchButton.classList.add('streaming');
                    // Оновлюємо посилання для перегляду
                    twitchButton.href = `https://twitch.tv/${channel.id}`;
                }
            } else {
                // Стример офлайн
                streamerCard.classList.remove('streaming');
                statusIndicator.classList.remove('online');
                statusIndicator.classList.add('offline');
                statusText.textContent = 'Офлайн';
                
                // Відображаємо опис стримера коли він офлайн
                if (streamerDescription) {
                    streamerDescription.innerHTML = `<strong>Стример зараз не в ефірі</strong><p>${channel.description}</p>`;
                }
                
                // Змінюємо текст кнопки
                if (twitchButton) {
                    twitchButton.textContent = 'Слідкувати';
                    twitchButton.classList.remove('streaming');
                    // Оновлюємо посилання на канал
                    twitchButton.href = `https://twitch.tv/${channel.id}`;
                }
            }
        });
    })
    .catch(error => {
        console.error('Помилка отримання даних Twitch API:', error);
        
        // Встановлюємо дані вручну, якщо сталася помилка API
        twitchChannels.forEach(channel => {
            const streamerCard = document.getElementById(channel.element);
            if (!streamerCard) return;
            
            // Встановлюємо статус "Офлайн" у разі помилки
            const statusIndicator = streamerCard.querySelector('.status-indicator');
            const statusText = streamerCard.querySelector('.streamer-status span');
            if (statusIndicator && statusText) {
                statusIndicator.classList.remove('online');
                statusIndicator.classList.add('offline');
                statusText.textContent = 'Офлайн';
            }
            
            // Показуємо базову інформацію про стримера
            const streamerDescription = streamerCard.querySelector('.streamer-description');
            if (streamerDescription) {
                streamerDescription.innerHTML = `<p>${channel.description}</p>`;
            }
        });
    });
}

// Перевіряємо статус при завантаженні сторінки
document.addEventListener('DOMContentLoaded', checkStreamStatus);

// Оновлюємо статус кожну хвилину
setInterval(checkStreamStatus, 60000);
