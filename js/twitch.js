function checkStreamStatus() {
    // Налаштування API
    const clientId = 'gp762nuuoqcoxypju8c569th9wz7q5';
    const accessToken = 'dxbgwq1vwbuhb1078n72hs9ohygj4i';
    
    // Масив каналів Twitch, які потрібно перевірити
    const twitchChannels = [
        { id: 'tankmaster_ua', element: 'streamer-1' },
        { id: 'artypro', element: 'streamer-2' },
        { id: 'lighttank_girl', element: 'streamer-3' }
    ];
    
    // Формуємо параметри запиту для кількох каналів
    const queryParams = twitchChannels.map(channel => `user_login=${channel.id}`).join('&');
    
    fetch(`https://api.twitch.tv/helix/streams?${queryParams}`, {
        headers: {
            'Client-ID': clientId,
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Створюємо мапу для швидкого пошуку каналів
        const liveChannels = {};
        
        // Заповнюємо мапу каналами, які зараз онлайн
        if (data.data && data.data.length > 0) {
            data.data.forEach(stream => {
                liveChannels[stream.user_login.toLowerCase()] = {
                    title: stream.title,
                    viewers: stream.viewer_count
                };
            });
        }
        
        // Оновлюємо стан для кожного стримера на сторінці
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
                `;
                
                // Змінюємо текст кнопки
                if (twitchButton) {
                    twitchButton.textContent = 'Дивитись';
                    twitchButton.classList.add('streaming');
                }
            } else {
                // Стример офлайн
                streamerCard.classList.remove('streaming');
                statusIndicator.classList.remove('online');
                statusIndicator.classList.add('offline');
                statusText.textContent = 'Офлайн';
                
                // Залишаємо стандартний опис
                if (streamerDescription) {
                    streamerDescription.innerHTML = '<strong>Стример зараз не в ефірі</strong>';
                }
                
                // Змінюємо текст кнопки
                if (twitchButton) {
                    twitchButton.textContent = 'Слідкувати';
                    twitchButton.classList.remove('streaming');
                }
            }
        });
    })
    .catch(error => {
        console.error('Помилка отримання даних Twitch API:', error);
    });
}

// Перевіряємо статус при завантаженні сторінки
document.addEventListener('DOMContentLoaded', checkStreamStatus);

// Оновлюємо статус кожну хвилину
setInterval(checkStreamStatus, 60000);
