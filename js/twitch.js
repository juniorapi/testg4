/**
 * Скрипт для перевірки статусу Twitch-стримерів
 * Автоматично отримує дані про стримерів та оновлює їх статус на сторінці
 */

function checkStreamStatus() {
    // Налаштування API Twitch
    // Ці значення потрібно замінити на справжні, отримані через Twitch Developer Portal
    const clientId = 'gp762nuuoqcoxypju8c569th9wz7q5';
    const accessToken = 'dxbgwq1vwbuhb1078n72hs9ohygj4i';
    
    // Масив каналів Twitch, які потрібно перевірити
    // Для кожного стримера вказуємо:
    // - id: ім'я користувача Twitch (маленькими літерами)
    // - element: id елемента на сторінці
    const twitchChannels = [
        { id: 'sh0kerix', element: 'streamer-1' },
        { id: 'ceh9', element: 'streamer-2' },
        { id: 'juniortv_gaming', element: 'streamer-3' }
    ];
    
    // Формуємо параметри запиту для кількох каналів одночасно
    const queryParams = twitchChannels.map(channel => `user_login=${channel.id}`).join('&');
    
    // Виконуємо запит до Twitch API
    fetch(`https://api.twitch.tv/helix/streams?${queryParams}`, {
        headers: {
            'Client-ID': clientId,
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => {
        // Перевіряємо успішність відповіді
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
                    viewers: stream.viewer_count,
                    game: stream.game_name
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
                    <div class="game-info">
                        <i class="fas fa-gamepad"></i> Гра: ${streamInfo.game || 'World of Tanks'}
                    </div>
                `;
                
                // Змінюємо текст кнопки
                if (twitchButton) {
