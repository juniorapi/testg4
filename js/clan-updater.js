/**
 * Скрипт для автоматичного оновлення інформації про клани через API Wargaming
 * 
 * Цей скрипт отримує кількість учасників, рейтинг та позицію кланів
 * з офіційного API Wargaming та оновлює цю інформацію на сторінці.
 * 
 * @version 1.0.0
 * @author G_UA Alliance Team
 */

document.addEventListener('DOMContentLoaded', function() {
    // Індикатор завантаження
    function showLoadingIndicator() {
        // Створюємо елемент індикатора завантаження
        const loadingIndicator = document.createElement('div');
        loadingIndicator.id = 'api-loading-indicator';
        loadingIndicator.classList.add('api-loading');
        loadingIndicator.innerHTML = `
            <div class="loading-spinner"></div>
            <p>Оновлення інформації про клани...</p>
        `;
        
        // Додаємо стилі
        const style = document.createElement('style');
        style.textContent = `
            .api-loading {
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 15px 20px;
                background: rgba(0, 0, 0, 0.7);
                border-radius: 8px;
                display: flex;
                align-items: center;
                color: white;
                z-index: 9999;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                font-size: 14px;
                backdrop-filter: blur(5px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                transition: opacity 0.3s, transform 0.3s;
            }
            .api-loading p {
                margin: 0 0 0 10px;
            }
            .loading-spinner {
                width: 20px;
                height: 20px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                border-top-color: var(--primary, #e32927);
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(loadingIndicator);
    }

    function hideLoadingIndicator() {
        const loadingIndicator = document.getElementById('api-loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.style.opacity = '0';
            loadingIndicator.style.transform = 'translateY(20px)';
            setTimeout(() => {
                loadingIndicator.remove();
            }, 300);
        }
    }

    // Показуємо індикатор завантаження даних з API
    showLoadingIndicator();

    // API ключ для Wargaming API
    const API_KEY = 'f5f97f92233a59f3d8dbaec28d22ce0f';
    
    // ID кланів альянсу G_UA
    const CLAN_IDS = {
        'g_ua': '500225794',
        'g0_ua': '500309708',
        'go_ua': '500227079',
        'g1_ua': '500226271',
        'g2_ua': '500226326',
        'g3_ua': '500226614',
        'g4_ua': '500226790'
    };
    
    // Основні дані про клани
    let clansData = {};
    
    // Отримання інформації про клани
    async function fetchClanInfo() {
        try {
            // Формуємо ID кланів для запиту
            const clanIdsParam = Object.values(CLAN_IDS).join(',');
            
            // Захищений режим запиту через проксі
            // Якщо ви використовуєте проксі на сервері, розкоментуйте та налаштуйте цей рядок:
            // const response = await fetch(`/api-proxy.php?clan_id=${clanIdsParam}&fields=clan_id,members_count,tag,name`);
            
            // Прямий запит до API Wargaming
            const response = await fetch(`https://api.worldoftanks.eu/wgn/clans/info/?application_id=${API_KEY}&clan_id=${clanIdsParam}&fields=clan_id,members_count,tag,name`);
            
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.status !== 'ok') {
                throw new Error(`API returned error: ${data.error.message}`);
            }
            
            // Зберігаємо дані
            clansData = data.data;
            
            return clansData;
        } catch (error) {
            console.error('Error fetching clan info:', error);
            
            // Показуємо повідомлення про помилку
            showErrorMessage('Не вдалося отримати інформацію про клани. Спробуйте пізніше.');
            
            return null;
        }
    }
    
    // Показ повідомлення про помилку
    function showErrorMessage(message) {
        // Ховаємо індикатор завантаження
        hideLoadingIndicator();
        
        // Створюємо елемент повідомлення про помилку
        const errorMessage = document.createElement('div');
        errorMessage.id = 'api-error-message';
        errorMessage.classList.add('api-error');
        errorMessage.innerHTML = `
            <div class="error-icon"><i class="fas fa-exclamation-triangle"></i></div>
            <p>${message}</p>
            <button class="close-error"><i class="fas fa-times"></i></button>
        `;
        
        // Додаємо стилі
        const style = document.createElement('style');
        style.textContent = `
            .api-error {
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 15px 20px;
                background: rgba(220, 53, 69, 0.9);
                border-radius: 8px;
                display: flex;
                align-items: center;
                color: white;
                z-index: 9999;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                font-size: 14px;
                backdrop-filter: blur(5px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                transition: opacity 0.3s, transform 0.3s;
            }
            .api-error p {
                margin: 0 0 0 10px;
            }
            .error-icon {
                color: white;
                font-size: 16px;
            }
            .close-error {
                margin-left: 15px;
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                opacity: 0.7;
                transition: opacity 0.3s;
            }
            .close-error:hover {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(errorMessage);
        
        // Додаємо обробник події для кнопки закриття
        const closeButton = errorMessage.querySelector('.close-error');
        closeButton.addEventListener('click', () => {
            errorMessage.style.opacity = '0';
            errorMessage.style.transform = 'translateY(20px)';
            setTimeout(() => {
                errorMessage.remove();
            }, 300);
        });
        
        // Автоматично закриваємо повідомлення через 5 секунд
        setTimeout(() => {
            if (document.body.contains(errorMessage)) {
                errorMessage.style.opacity = '0';
                errorMessage.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    if (document.body.contains(errorMessage)) {
                        errorMessage.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
    
    // Отримання рейтингу клану
    async function fetchClanRating(clanId) {
        try {
            // Захищений режим запиту через проксі
            // Якщо ви використовуєте проксі на сервері, розкоментуйте та налаштуйте цей рядок:
            // const response = await fetch(`/api-proxy-ratings.php?clan_id=${clanId}`);
            
            // Прямий запит до API Wargaming
            const response = await fetch(`https://api.worldoftanks.eu/wot/clanratings/clans/?application_id=${API_KEY}&clan_id=${clanId}`);
            
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.status !== 'ok') {
                throw new Error(`API returned error: ${data.error.message}`);
            }
            
            // Якщо є дані рейтингу, повертаємо їх
            if (data.data && data.data[clanId]) {
                return {
                    global_rating: data.data[clanId].global_rating_position || null,
                    efficiency: data.data[clanId].efficiency_rating || null
                };
            }
            
            return { global_rating: null, efficiency: null };
        } catch (error) {
            console.error(`Error fetching rating for clan ${clanId}:`, error);
            return { global_rating: null, efficiency: null };
        }
    }
    
    // Функція для отримання інформації про командира клану
    async function fetchClanCommander(clanId) {
        try {
            const response = await fetch(`https://api.worldoftanks.eu/wgn/clans/info/?application_id=${API_KEY}&clan_id=${clanId}&fields=members`);
            
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.status !== 'ok') {
                throw new Error(`API returned error: ${data.error.message}`);
            }
            
            // Шукаємо командира серед членів клану
            const members = data.data[clanId].members || [];
            const commander = members.find(member => member.role === 'commander');
            
            if (commander) {
                return {
                    account_id: commander.account_id,
                    account_name: commander.account_name
                };
            }
            
            return null;
        } catch (error) {
            console.error(`Error fetching commander for clan ${clanId}:`, error);
            return null;
        }
    }
    
    // Функція для отримання статистики гравця
    async function fetchPlayerStats(accountId) {
        try {
            const response = await fetch(`https://api.worldoftanks.eu/wot/account/info/?application_id=${API_KEY}&account_id=${accountId}&fields=global_rating,statistics.all.battles,statistics.all.wins`);
            
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.status !== 'ok' || !data.data[accountId]) {
                throw new Error(`API returned error or no data for player ${accountId}`);
            }
            
            const playerData = data.data[accountId];
            const battles = playerData.statistics.all.battles || 0;
            const wins = playerData.statistics.all.wins || 0;
            const winRate = battles > 0 ? (wins / battles * 100).toFixed(2) : 0;
            
            return {
                battles: battles,
                win_rate: winRate
            };
        } catch (error) {
            console.error(`Error fetching stats for player ${accountId}:`, error);
            return { battles: 0, win_rate: 0 };
        }
    }
    
    // Функція для оновлення інформації на сторінці
    async function updateClanInfo() {
        const clansInfo = await fetchClanInfo();
        
        if (!clansInfo) {
            hideLoadingIndicator();
            return;
        }
        
        // Для кожного клану оновлюємо інформацію на сторінці
        const updatePromises = Object.entries(CLAN_IDS).map(async ([clanKey, clanId]) => {
            if (clansInfo[clanId]) {
                const clanData = clansInfo[clanId];
                const clanElement = document.getElementById(clanKey);
                
                if (clanElement) {
                    // Оновлюємо кількість учасників
                    const membersStat = clanElement.querySelector('.stat:nth-child(1) .stat-value');
                    if (membersStat) {
                        membersStat.textContent = clanData.members_count;
                    }
                    
                    // Отримуємо рейтинг клану
                    const ratingInfo = await fetchClanRating(clanId);
                    
                    // Оновлюємо рейтинг
                    const ratingStat = clanElement.querySelector('.stat:nth-child(2) .stat-value');
                    if (ratingStat) {
                        if (ratingInfo.efficiency) {
                            ratingStat.textContent = Math.round(ratingInfo.efficiency);
                        } else {
                            // Якщо рейтингу немає, залишаємо поточне значення
                        }
                    }
                    
                    // Оновлюємо позицію
                    const positionStat = clanElement.querySelector('.stat:nth-child(3) .stat-value');
                    if (positionStat) {
                        if (ratingInfo.global_rating) {
                            // Форматуємо позицію залежно від значення
                            if (ratingInfo.global_rating <= 300) {
                                positionStat.textContent = `Топ ${ratingInfo.global_rating}`;
                            } else {
                                positionStat.textContent = ratingInfo.global_rating;
                            }
                        } else {
                            // Якщо позиції немає, залишаємо поточне значення
                        }
                    }
                    
                    // Оновлюємо інформацію про командира клану (опціонально)
                    // Це ресурсомістка операція, тому можна відключити, якщо не потрібно
                    const updateCommanderInfo = false;
                    if (updateCommanderInfo) {
                        const commander = await fetchClanCommander(clanId);
                        if (commander) {
                            const commanderNameElement = clanElement.querySelector('.commander-info h4');
                            if (commanderNameElement) {
                                commanderNameElement.textContent = commander.account_name;
                            }
                            
                            // Отримуємо статистику командира
                            const playerStats = await fetchPlayerStats(commander.account_id);
                            
                            // Оновлюємо статистику командира
                            const commanderStatsElement = clanElement.querySelector('.commander-stats');
                            if (commanderStatsElement && playerStats) {
                                // WN8 не надається API Wargaming, тому залишаємо поточне значення
                                const currentText = commanderStatsElement.textContent;
                                const wn8Match = currentText.match(/WN8:\s*(\d+)/);
                                const wn8 = wn8Match ? wn8Match[1] : '?';
                                
                                commanderStatsElement.textContent = `WN8: ${wn8} | WR: ${playerStats.win_rate}%`;
                            }
                        }
                    }
                    
                    console.log(`Updated info for clan ${clanData.tag}`);
                }
            }
        });
        
        // Чекаємо завершення всіх оновлень
        await Promise.all(updatePromises);
        
        // Ховаємо індикатор завантаження і показуємо повідомлення про успіх
        hideLoadingIndicator();
        showSuccessMessage();
    }
    
    // Показуємо повідомлення про успішне оновлення
    function showSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.id = 'api-success-message';
        successMessage.classList.add('api-success');
        successMessage.innerHTML = `
            <div class="success-icon"><i class="fas fa-check-circle"></i></div>
            <p>Інформацію про клани оновлено!</p>
        `;
        
        // Додаємо стилі
        const style = document.createElement('style');
        style.textContent = `
            .api-success {
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 15px 20px;
                background: rgba(40, 167, 69, 0.9);
                border-radius: 8px;
                display: flex;
                align-items: center;
                color: white;
                z-index: 9999;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                font-size: 14px;
                backdrop-filter: blur(5px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                transition: opacity 0.3s, transform 0.3s;
            }
            .api-success p {
                margin: 0 0 0 10px;
            }
            .success-icon {
                color: white;
                font-size: 16px;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(successMessage);
        
        // Автоматично закриваємо повідомлення через 3 секунди
        setTimeout(() => {
            successMessage.style.opacity = '0';
            successMessage.style.transform = 'translateY(20px)';
            setTimeout(() => {
                successMessage.remove();
            }, 300);
        }, 3000);
    }
    
    // Запускаємо оновлення при завантаженні сторінки
    updateClanInfo();
    
    // Додаємо кнопку ручного оновлення інформації (опціонально)
    function addRefreshButton() {
        // Знаходимо заголовок секції кланів
        const clanIntro = document.querySelector('.clan-intro');
        if (clanIntro) {
            const refreshButton = document.createElement('button');
            refreshButton.className = 'btn btn-outline refresh-clan-data';
            refreshButton.innerHTML = '<i class="fas fa-sync-alt"></i> Оновити дані';
            refreshButton.style.marginTop = '15px';
            
            refreshButton.addEventListener('click', function() {
                // Показуємо індикатор завантаження
                showLoadingIndicator();
                
                // Запускаємо оновлення
                updateClanInfo();
            });
            
            clanIntro.appendChild(refreshButton);
        }
    }
    
    // Активуємо кнопку оновлення
    addRefreshButton();
    
    // Можна додати періодичне оновлення, наприклад, кожну годину
    // Розкоментуйте, якщо потрібно
    // const AUTO_UPDATE_INTERVAL = 3600000; // 3600000 мс = 1 година
    // setInterval(updateClanInfo, AUTO_UPDATE_INTERVAL);
});
