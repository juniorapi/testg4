/**
 * ClanApiManager.js
 * Клас для роботи з API Wargaming
 * 
 * Цей клас надає зручні методи для роботи з API Wargaming
 * та оновлення інформації про клани на сайті.
 * 
 * @version 1.0.0
 * @author G_UA Alliance Team
 */

class ClanApiManager {
    /**
     * Конструктор класу
     * @param {Object} options - Налаштування
     */
    constructor(options = {}) {
        // API ключ для Wargaming API
        this.apiKey = options.apiKey || 'f5f97f92233a59f3d8dbaec28d22ce0f';
        
        // ID кланів
        this.clanIds = options.clanIds || {};
        
        // Налаштування API
        this.useProxy = options.useProxy || false;
        this.proxyUrl = options.proxyUrl || '/api-proxy.php';
        
        // Управління UI
        this.showLoadingIndicator = options.showLoadingIndicator !== false;
        this.showSuccessMessage = options.showSuccessMessage !== false;
        this.showRefreshButton = options.showRefreshButton !== false;
        
        // Елементи UI
        this.loadingIndicator = null;
        this.errorMessageElement = null;
        this.successMessageElement = null;
        this.refreshButton = null;
        
        // Налаштування оновлення
        this.autoUpdateInterval = options.autoUpdateInterval || null;
        this.intervalId = null;
        
        // Дані про клани
        this.clansData = {};
    }
    
    /**
     * Ініціалізація менеджера
     */
    init() {
        // Додаємо кнопку оновлення, якщо потрібно
        if (this.showRefreshButton) {
            this.addRefreshButton();
        }
        
        // Запускаємо автоматичне оновлення, якщо вказано інтервал
        if (this.autoUpdateInterval) {
            this.startAutoUpdate();
        }
        
        // Запускаємо оновлення інформації
        this.updateClanInfo();
    }
    
    /**
     * Запит до API Wargaming
     * @param {string} endpoint - Ендпоінт API
     * @param {Object} params - Параметри запиту
     * @returns {Promise<Object>} - Відповідь API
     */
    async fetchFromApi(endpoint, params = {}) {
        try {
            // Додаємо API ключ
            params.application_id = this.apiKey;
            
            // Формуємо URL залежно від використання проксі
            let url;
            if (this.useProxy) {
                url = `${this.proxyUrl}?endpoint=${endpoint}`;
                
                // Додаємо параметри до URL
                for (const [key, value] of Object.entries(params)) {
                    url += `&${key}=${value}`;
                }
            } else {
                // Базовий URL API
                url = `https://api.worldoftanks.eu/${endpoint}/?`;
                
                // Додаємо параметри до URL
                for (const [key, value] of Object.entries(params)) {
                    url += `${key}=${value}&`;
                }
                url = url.slice(0, -1); // Видаляємо останній &
            }
            
            // Виконуємо запит
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.status !== 'ok') {
                throw new Error(`API returned error: ${data.error?.message || 'Unknown error'}`);
            }
            
            return data.data;
        } catch (error) {
            console.error(`Error fetching from API (${endpoint}):`, error);
            throw error;
        }
    }
    
    /**
     * Отримання інформації про клани
     * @returns {Promise<Object>} - Інформація про клани
     */
    async fetchClanInfo() {
        try {
            // Формуємо ID кланів для запиту
            const clanIdsParam = Object.values(this.clanIds).join(',');
            
            // Виконуємо запит
            const data = await this.fetchFromApi('wgn/clans/info', {
                clan_id: clanIdsParam,
                fields: 'clan_id,members_count,tag,name'
            });
            
            this.clansData = data;
            return data;
        } catch (error) {
            console.error('Error fetching clan info:', error);
            this.showError('Не вдалося отримати інформацію про клани. Спробуйте пізніше.');
            return null;
        }
    }
    
    /**
     * Отримання рейтингу клану
     * @param {string} clanId - ID клану
     * @returns {Promise<Object>} - Інформація про рейтинг
     */
    async fetchClanRating(clanId) {
        try {
            const data = await this.fetchFromApi('wot/clanratings/clans', {
                clan_id: clanId
            });
            
            if (data && data[clanId]) {
                return {
                    global_rating: data[clanId].global_rating_position || null,
                    efficiency: data[clanId].efficiency_rating || null
                };
            }
            
            return { global_rating: null, efficiency: null };
        } catch (error) {
            console.error(`Error fetching rating for clan ${clanId}:`, error);
            return { global_rating: null, efficiency: null };
        }
    }
    
    /**
     * Отримання інформації про командира клану
     * @param {string} clanId - ID клану
     * @returns {Promise<Object|null>} - Інформація про командира
     */
    async fetchClanCommander(clanId) {
        try {
            const data = await this.fetchFromApi('wgn/clans/info', {
                clan_id: clanId,
                fields: 'members'
            });
            
            // Шукаємо командира серед членів клану
            const members = data[clanId].members || [];
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
    
    /**
     * Отримання статистики гравця
     * @param {string} accountId - ID облікового запису
     * @returns {Promise<Object>} - Статистика гравця
     */
    async fetchPlayerStats(accountId) {
        try {
            const data = await this.fetchFromApi('wot/account/info', {
                account_id: accountId,
                fields: 'global_rating,statistics.all.battles,statistics.all.wins'
            });
            
            if (!data[accountId]) {
                throw new Error(`No data for player ${accountId}`);
            }
            
            const playerData = data[accountId];
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
    
    /**
     * Оновлення інформації на сторінці
     */
    async updateClanInfo() {
        // Показуємо індикатор завантаження
        if (this.showLoadingIndicator) {
            this.showLoading();
        }
        
        try {
            // Отримуємо інформацію про клани
            const clansInfo = await this.fetchClanInfo();
            
            if (!clansInfo) {
                return;
            }
            
            // Для кожного клану оновлюємо інформацію на сторінці
            const updatePromises = Object.entries(this.clanIds).map(async ([clanKey, clanId]) => {
                if (clansInfo[clanId]) {
                    await this.updateClanElement(clanKey, clanId, clansInfo[clanId]);
                }
            });
            
            // Чекаємо завершення всіх оновлень
            await Promise.all(updatePromises);
            
            // Ховаємо індикатор завантаження і показуємо повідомлення про успіх
            if (this.showLoadingIndicator) {
                this.hideLoading();
            }
            
            if (this.showSuccessMessage) {
                this.showSuccess('Інформацію про клани оновлено!');
            }
        } catch (error) {
            console.error('Error updating clan info:', error);
            
            // Ховаємо індикатор завантаження
            if (this.showLoadingIndicator) {
                this.hideLoading();
            }
            
            this.showError('Помилка оновлення інформації про клани');
        }
    }
    
    /**
     * Оновлення інформації для конкретного клану
     * @param {string} clanKey - Ключ клану в DOM
     * @param {string} clanId - ID клану
     * @param {Object} clanData - Дані клану
     */
    async updateClanElement(clanKey, clanId, clanData) {
        const clanElement = document.getElementById(clanKey);
        
        if (!clanElement) {
            return;
        }
        
        // Оновлюємо кількість учасників
        const membersStat = clanElement.querySelector('.stat:nth-child(1) .stat-value');
        if (membersStat) {
            membersStat.textContent = clanData.members_count;
        }
        
        // Отримуємо рейтинг клану
        const ratingInfo = await this.fetchClanRating(clanId);
        
        // Оновлюємо рейтинг
        const ratingStat = clanElement.querySelector('.stat:nth-child(2) .stat-value');
        if (ratingStat) {
            if (ratingInfo.efficiency) {
                ratingStat.textContent = Math.round(ratingInfo.efficiency);
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
            }
        }
    }
    
    /**
     * Запуск автоматичного оновлення
     */
    startAutoUpdate() {
        // Очищаємо попередній інтервал, якщо він був
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        
        // Встановлюємо новий інтервал
        this.intervalId = setInterval(() => {
            this.updateClanInfo();
        }, this.autoUpdateInterval);
    }
    
    /**
     * Зупинка автоматичного оновлення
     */
    stopAutoUpdate() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    
    /**
     * Додавання кнопки оновлення
     */
    addRefreshButton() {
        // Знаходимо заголовок секції кланів
        const clanIntro = document.querySelector('.clan-intro');
        if (!clanIntro) {
            return;
        }
        
        // Створюємо кнопку
        this.refreshButton = document.createElement('button');
        this.refreshButton.className = 'btn btn-outline refresh-clan-data';
        this.refreshButton.innerHTML = '<i class="fas fa-sync-alt"></i> Оновити дані';
        this.refreshButton.style.marginTop = '15px';
        
        // Додаємо обробник подій
        this.refreshButton.addEventListener('click', () => {
            this.updateClanInfo();
        });
        
        // Додаємо кнопку на сторінку
        clanIntro.appendChild(this.refreshButton);
    }
    
    /**
     * Показ індикатора завантаження
     */
    showLoading() {
        // Якщо індикатор уже існує, не створюємо новий
        if (document.getElementById('api-loading-indicator')) {
            return;
        }
        
        // Створюємо елемент індикатора завантаження
        this.loadingIndicator = document.createElement('div');
        this.loadingIndicator.id = 'api-loading-indicator';
        this.loadingIndicator.className = 'api-loading';
        this.loadingIndicator.innerHTML = `
            <div class="loading-spinner"></div>
            <p>Оновлення інформації про клани...</p>
        `;
        
        // Додаємо стилі, якщо вони ще не додані
        if (!document.getElementById('api-manager-styles')) {
            this.addStyles();
        }
        
        // Додаємо індикатор на сторінку
        document.body.appendChild(this.loadingIndicator);
    }
    
    /**
     * Приховування індикатора завантаження
     */
    hideLoading() {
        if (this.loadingIndicator) {
            this.loadingIndicator.style.opacity = '0';
            this.loadingIndicator.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                if (this.loadingIndicator && this.loadingIndicator.parentNode) {
                    this.loadingIndicator.parentNode.removeChild(this.loadingIndicator);
                }
                this.loadingIndicator = null;
            }, 300);
        }
    }
    
    /**
     * Показ повідомлення про помилку
     * @param {string} message - Текст повідомлення
     */
    showError(message) {
        // Якщо повідомлення вже існує, не створюємо нове
        if (document.getElementById('api-error-message')) {
            return;
        }
        
        // Створюємо елемент повідомлення
        this.errorMessageElement = document.createElement('div');
        this.errorMessageElement.id = 'api-error-message';
        this.errorMessageElement.className = 'api-error';
        this.errorMessageElement.innerHTML = `
            <div class="error-icon"><i class="fas fa-exclamation-triangle"></i></div>
            <p>${message}</p>
            <button class="close-message"><i class="fas fa-times"></i></button>
        `;
        
        // Додаємо стилі, якщо вони ще не додані
        if (!document.getElementById('api-manager-styles')) {
            this.addStyles();
        }
        
        // Додаємо повідомлення на сторінку
        document.body.appendChild(this.errorMessageElement);
        
        // Додаємо обробник подій для кнопки закриття
        const closeButton = this.errorMessageElement.querySelector('.close-message');
        closeButton.addEventListener('click', () => {
            this.hideError();
        });
        
        // Автоматично закриваємо повідомлення через 5 секунд
        setTimeout(() => {
            this.hideError();
        }, 5000);
    }
    
    /**
     * Приховування повідомлення про помилку
     */
    hideError() {
        if (this.errorMessageElement) {
            this.errorMessageElement.style.opacity = '0';
            this.errorMessageElement.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                if (this.errorMessageElement && this.errorMessageElement.parentNode) {
                    this.errorMessageElement.parentNode.removeChild(this.errorMessageElement);
                }
                this.errorMessageElement = null;
            }, 300);
        }
    }
    
    /**
     * Показ повідомлення про успіх
     * @param {string} message - Текст повідомлення
     */
    showSuccess(message) {
        // Якщо повідомлення вже існує, не створюємо нове
        if (document.getElementById('api-success-message')) {
            return;
        }
        
        // Створюємо елемент повідомлення
        this.successMessageElement = document.createElement('div');
        this.successMessageElement.id = 'api-success-message';
        this.successMessageElement.className = 'api-success';
        this.successMessageElement.innerHTML = `
            <div class="success-icon"><i class="fas fa-check-circle"></i></div>
            <p>${message}</p>
        `;
        
        // Додаємо стилі, якщо вони ще не додані
        if (!document.getElementById('api-manager-styles')) {
            this.addStyles();
        }
        
        // Додаємо повідомлення на сторінку
        document.body.appendChild(this.successMessageElement);
        
        // Автоматично закриваємо повідомлення через 3 секунди
        setTimeout(() => {
            this.hideSuccess();
        }, 3000);
    }
    
    /**
     * Приховування повідомлення про успіх
     */
    hideSuccess() {
        if (this.successMessageElement) {
            this.successMessageElement.style.opacity = '0';
            this.successMessageElement.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                if (this.successMessageElement && this.successMessageElement.parentNode) {
                    this.successMessageElement.parentNode.removeChild(this.successMessageElement);
                }
                this.successMessageElement = null;
            }, 300);
        }
    }
    
    /**
     * Додавання стилів
     */
    addStyles() {
        const style = document.createElement('style');
        style.id = 'api-manager-styles';
        style.textContent = `
            /* Індикатор завантаження */
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
            
            /* Повідомлення про помилку */
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
            .close-message {
                margin-left: 15px;
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                opacity: 0.7;
                transition: opacity 0.3s;
            }
            .close-message:hover {
                opacity: 1;
            }
            
            /* Повідомлення про успіх */
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
            
            /* Кнопка оновлення */
            .refresh-clan-data {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                margin-top: 15px;
            }
            .refresh-clan-data i {
                transition: transform 0.3s;
            }
            .refresh-clan-data:hover i {
                transform: rotate(180deg);
            }
        `;
        
        document.head.appendChild(style);
    }
}

// Експорт класу
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = ClanApiManager;
} else {
    window.ClanApiManager = ClanApiManager;
}
