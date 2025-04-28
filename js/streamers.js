/**
 * JavaScript для сторінки стримерів Альянсу G_UA
 * Із сучасними фільтрами, анімаціями та відображенням статусу стримерів
 */

document.addEventListener('DOMContentLoaded', function() {
    // Ініціалізуємо всі функції
    initDropdowns();
    initFilterTabs();
    initModals();
    loadStreamers();
});

/**
 * Дані про стримерів
 * У реальному проекті ці дані завантажувалися б з API або CMS
 */
const streamersData = [
    {
        id: 'tankmaster',
        twitchId: 'tankmaster_ua',
        displayName: 'TankMaster_UA',
        avatarUrl: 'img/streamers/streamer1.jpg',
        clan: 'G1_UA',
        description: 'Стример і професійний гравець G1_UA. Спеціалізується на важких танках та тактичній грі.',
        youtube: '@TankMaster_UA',
        discord: 'discord.gg/tankmaster',
        telegram: 'tankmaster_ua'
    },
    {
        id: 'artypro',
        twitchId: 'artypro',
        displayName: 'ArtyPro',
        avatarUrl: 'img/streamers/streamer2.jpg',
        clan: 'G2_UA',
        description: 'Командир клану G2_UA. Експерт з артилерії та СТ.',
        youtube: '@ArtyProWoT',
        discord: 'discord.gg/artypro',
        telegram: 'artypro_wot'
    },
    {
        id: 'lightgirl',
        twitchId: 'lighttank_girl',
        displayName: 'LightTank_Girl',
        avatarUrl: 'img/streamers/streamer3.jpg',
        clan: 'G4_UA',
        description: 'Учасниця G4_UA. Спеціалізується на світлових танках та розвідці.',
        youtube: '@LightTankGirl',
        discord: 'discord.gg/lighttankgirl',
        telegram: 'lighttank_girl'
    },
    {
        id: 'tacticmaster',
        twitchId: 'tactic_master',
        displayName: 'Tactic_Master',
        avatarUrl: 'img/streamers/streamer4.jpg',
        clan: 'G1_UA',
        description: 'Професійний гравець та стратег. Проводить навчальні стріми та аналіз тактик.',
        youtube: '@TacticMaster',
        discord: 'discord.gg/tacticmaster',
        telegram: 'tacticmaster_wot'
    },
    {
        id: 'sniperelite',
        twitchId: 'sniper_elite_ua',
        displayName: 'Sniper_Elite_UA',
        avatarUrl: 'img/streamers/streamer5.jpg',
        clan: 'G2_UA',
        description: 'Спеціаліст з ПТ-САУ та далекобійних СТ.',
        youtube: '@SniperEliteUA',
        discord: 'discord.gg/sniperelite',
        telegram: 'sniper_elite_ua'
    },
    {
        id: 'speedmeister',
        twitchId: 'speed_meister',
        displayName: 'Speed_Meister',
        avatarUrl: 'img/streamers/streamer6.jpg',
        clan: 'G3_UA',
        description: 'Спеціаліст зі швидких танків та агресивної гри.',
        youtube: '@SpeedMeister',
        discord: 'discord.gg/speedmeister',
        telegram: 'speed_meister_wot'
    },
    {
        id: 'commander',
        twitchId: 'commander_ua',
        displayName: 'Commander_UA',
        avatarUrl: 'img/streamers/streamer7.jpg',
        clan: 'G1_UA',
        description: 'Головний командир альянсу G_UA. Стріми з фокусом на командну гру та кланові бої.',
        youtube: '@CommanderUA',
        discord: 'discord.gg/commanderua',
        telegram: 'commander_ua'
    },
    {
        id: 'analyticsexpert',
        twitchId: 'analytics_expert',
        displayName: 'Analytics_Expert',
        avatarUrl: 'img/streamers/streamer8.jpg',
        clan: 'G5_UA',
        description: 'Аналітика статистики, огляд оновлень та навчальні стріми для новачків.',
        youtube: '@AnalyticsExpertWoT',
        discord: 'discord.gg/analyticsexpert',
        telegram: 'analytics_expert'
    }
];

/**
 * Ініціалізація випадаючих списків
 */
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.filter-dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (toggle && menu) {
            // Відкриття/закриття випадаючого списку
            toggle.addEventListener('click', function() {
                this.classList.toggle('active');
                menu.classList.toggle('show');
            });
            
            // Вибір елементу списку
            const items = menu.querySelectorAll('.dropdown-item');
            items.forEach(item => {
                item.addEventListener('click', function() {
                    // Оновлюємо активний елемент
                    items.forEach(i => i.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Оновлюємо текст кнопки
                    toggle.querySelector('span').textContent = this.textContent;
                    
                    // Закриваємо меню
                    toggle.classList.remove('active');
                    menu.classList.remove('show');
                    
                    // Застосовуємо фільтр
                    const value = this.getAttribute('data-value');
                    if (toggle.id === 'clanFilter') {
                        filterByClan(value);
                    } else if (toggle.id === 'sortFilter') {
                        sortStreamers(value);
                    }
                });
            });
            
            // Закриваємо меню при кліку поза ним
            document.addEventListener('click', function(e) {
                if (!dropdown.contains(e.target)) {
                    toggle.classList.remove('active');
                    menu.classList.remove('show');
                }
            });
        }
    });
}

/**
 * Ініціалізація вкладок фільтрів
 */
function initFilterTabs() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Оновлюємо активну вкладку
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Застосовуємо фільтр
            const filter = this.getAttribute('data-filter');
            filterByStatus(filter);
        });
    });
}

/**
 * Ініціалізація модальних вікон
 */
function initModals() {
    // Модальне вікно з вимогами
    const requirementsBtn = document.querySelector('.open-requirements');
    const requirementsModal = document.getElementById('requirementsModal');
    
    if (requirementsBtn && requirementsModal) {
        requirementsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            requirementsModal.classList.add('active');
            document.body.classList.add('modal-open');
        });
        
        // Закриття модального вікна
        const closeBtn = requirementsModal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                requirementsModal.classList.remove('active');
                document.body.classList.remove('modal-open');
            });
        }
        
        // Закриття модального вікна при кліку на оверлей
        requirementsModal.addEventListener('click', function(e) {
            if (e.target === requirementsModal) {
                requirementsModal.classList.remove('active');
                document.body.classList.remove('modal-open');
            }
        });
    }
}

/**
 * Завантаження стримерів та отримання їх статусу
 */
function loadStreamers() {
    const streamersContainer = document.getElementById('streamers-container');
    
    if (streamersContainer) {
        // Імітуємо завантаження (в реальному проекті тут був би запит до API)
        setTimeout(() => {
            // Очищаємо контейнер від стану завантаження
            streamersContainer.innerHTML = '';
            
            // Додаємо стримерів
            streamersData.forEach(streamer => {
                const streamerCard = createStreamerCard(streamer);
                streamersContainer.appendChild(streamerCard);
            });
            
            // Отримуємо статус стримерів
            checkStreamersStatus();
            
            // Запускаємо таймер для періодичної перевірки статусу
            setInterval(checkStreamersStatus, 60000); // Кожну хвилину
        }, 1500);
    }
}

/**
 * Створення картки стримера
 */
function createStreamerCard(streamer) {
    // Використовуємо шаблон
    const template = document.getElementById('streamer-template');
    const card = document.importNode(template.content, true).querySelector('.streamer-card');
    
    // Заповнюємо дані
    card.setAttribute('data-id', streamer.id);
    card.setAttribute('data-clan', streamer.clan);
    
    // Аватар та ім'я
    const avatar = card.querySelector('.streamer-avatar img');
    avatar.src = streamer.avatarUrl;
    avatar.alt = streamer.displayName;
    
    card.querySelector('.streamer-name').textContent = streamer.displayName;
    card.querySelector('.clan-tag').textContent = streamer.clan;
    
    // Соціальні посилання
    const twitchLink = card.querySelector('.social-link.twitch');
    twitchLink.href = `https://twitch.tv/${streamer.twitchId}`;
    
    const youtubeLink = card.querySelector('.social-link.youtube');
    youtubeLink.href = `https://youtube.com/${streamer.youtube}`;
    
    if (streamer.discord) {
        const discordLink = card.querySelector('.social-link.discord');
        discordLink.href = `https://${streamer.discord}`;
    } else {
        card.querySelector('.social-link.discord').style.display = 'none';
    }
    
    if (streamer.telegram) {
        const telegramLink = card.querySelector('.social-link.telegram');
        telegramLink.href = `https://t.me/${streamer.telegram}`;
    } else {
        card.querySelector('.social-link.telegram').style.display = 'none';
    }
    
    return card;
}

/**
 * Перевірка статусу стримерів через API Twitch
 * У демо-версії імітуємо відповідь API
 */
function checkStreamersStatus() {
    // Отримуємо всі картки стримерів
    const streamerCards = document.querySelectorAll('.streamer-card');
    
    // У реальному проекті тут був би запит до API Twitch
    // Імітуємо відповідь для демонстрації
    const liveStreamers = getLiveStreamersDemo();
    
    // Оновлюємо лічильник стримерів онлайн
    const liveCount = document.querySelector('.live-count');
    if (liveCount) {
        liveCount.textContent = liveStreamers.length;
    }
    
    // Додаємо клас has-live, якщо є стримери онлайн
    const liveBtn = document.querySelector('.live-btn');
    if (liveBtn) {
        if (liveStreamers.length > 0) {
            liveBtn.classList.add('has-live');
        } else {
            liveBtn.classList.remove('has-live');
        }
    }
    
    // Оновлюємо картки стримерів
    streamerCards.forEach(card => {
        const streamerId = card.getAttribute('data-id');
        const liveData = liveStreamers.find(live => live.id === streamerId);
        
        if (liveData) {
            // Стример онлайн
            updateStreamerCardToLive(card, liveData);
            
            // Якщо стример щойно з'явився онлайн, показуємо сповіщення
            const wasOffline = card.getAttribute('data-last-status') === 'offline' || !card.getAttribute('data-last-status');
            if (wasOffline) {
                showStreamNotification(liveData);
            }
            
            // Запам'ятовуємо, що стример був онлайн
            card.setAttribute('data-last-status', 'online');
            localStorage.setItem(`streamer_${streamerId}_last_online`, Date.now());
        } else {
            // Стример офлайн
            updateStreamerCardToOffline(card);
            card.setAttribute('data-last-status', 'offline');
        }
    });
    
    // Сортуємо картки: спочатку онлайн
    sortStreamers('default');
    
    // Оновлюємо активний фільтр, якщо потрібно
    const activeTab = document.querySelector('.filter-tab.active');
    if (activeTab) {
        const filter = activeTab.getAttribute('data-filter');
        if (filter !== 'all') {
            filterByStatus(filter);
        }
    }
}

/**
 * Оновлення картки стримера до стану "онлайн"
 */
function updateStreamerCardToLive(card, liveData) {
    // Додаємо клас live
    card.classList.add('live');
    card.classList.remove('recent');
    
    // Оновлюємо статус
    const statusElement = card.querySelector('.stream-status');
    statusElement.innerHTML = `
        <span class="status-online">Онлайн</span>
    `;
    
    // Додаємо індикатор онлайн до аватару
    const avatar = card.querySelector('.streamer-avatar');
    if (!avatar.querySelector('.online-indicator')) {
        const indicator = document.createElement('div');
        indicator.className = 'online-indicator';
        avatar.appendChild(indicator);
    }
    
    // Додаємо живий індикатор
    if (!card.querySelector('.live-indicator')) {
        const liveIndicator = document.createElement('div');
        liveIndicator.className = 'live-indicator';
        liveIndicator.innerHTML = 'LIVE';
        card.appendChild(liveIndicator);
    }
    
    // Відображаємо інформацію про стрім
    const streamInfo = card.querySelector('.stream-info');
    streamInfo.style.display = 'block';
    
    // Заповнюємо дані стріму
    card.querySelector('.stream-title').textContent = liveData.title;
    card.querySelector('.stream-category span').textContent = liveData.category;
    card.querySelector('.viewers-count span').textContent = liveData.viewers;
    
    // Оновлюємо посилання на стрім
    const watchBtn = card.querySelector('.watch-btn');
    const twitchId = streamersData.find(s => s.id === liveData.id)?.twitchId;
    watchBtn.href = `https://twitch.tv/${twitchId}`;
    
    // Додаємо клас live до іконки Twitch
    card.querySelector('.social-link.twitch').classList.add('live');
}

/**
 * Оновлення картки стримера до стану "офлайн"
 */
function updateStreamerCardToOffline(card) {
    const streamerId = card.getAttribute('data-id');
    
    // Видаляємо клас live
    card.classList.remove('live');
    
    // Видаляємо індикатор онлайн
    const onlineIndicator = card.querySelector('.online-indicator');
    if (onlineIndicator) {
        onlineIndicator.remove();
    }
    
    // Видаляємо живий індикатор
    const liveIndicator = card.querySelector('.live-indicator');
    if (liveIndicator) {
        liveIndicator.remove();
    }
    
    // Приховуємо інформацію про стрім
    const streamInfo = card.querySelector('.stream-info');
    streamInfo.style.display = 'none';
    
    // Видаляємо клас live з іконки Twitch
    card.querySelector('.social-link.twitch').classList.remove('live');
    
    // Перевіряємо, чи був стример недавно онлайн
    const lastOnline = localStorage.getItem(`streamer_${streamerId}_last_online`);
    if (lastOnline) {
        const now = Date.now();
        const diff = now - parseInt(lastOnline);
        
        // Якщо менше 2 годин тому
        if (diff < 2 * 60 * 60 * 1000) {
            card.classList.add('recent');
            
            // Розраховуємо, скільки часу пройшло
            const minutes = Math.floor(diff / 60000);
            let timeText = '';
            
            if (minutes < 60) {
                timeText = `${minutes} хв. тому`;
            } else {
                const hours = Math.floor(minutes / 60);
                const mins = minutes % 60;
                timeText = `${hours} год. ${mins} хв. тому`;
            }
            
            // Оновлюємо статус
            const statusElement = card.querySelector('.stream-status');
            statusElement.innerHTML = `
                <span class="status-offline">Офлайн</span>
                <span class="status-time">Був онлайн ${timeText}</span>
            `;
        } else {
            card.classList.remove('recent');
            // Звичайний статус офлайн
            const statusElement = card.querySelector('.stream-status');
            statusElement.innerHTML = `<span class="status-offline">Офлайн</span>`;
        }
    } else {
        // Звичайний статус офлайн
        const statusElement = card.querySelector('.stream-status');
        statusElement.innerHTML = `<span class="status-offline">Офлайн</span>`;
    }
}

/**
 * Фільтрація стримерів за кланом
 */
function filterByClan(clan) {
    const streamerCards = document.querySelectorAll('.streamer-card');
    
    // Рахуємо кількість прихованих карток
    let hiddenCount = 0;
    
    streamerCards.forEach(card => {
        if (clan === 'all') {
            card.classList.remove('hidden-by-clan');
        } else {
            const cardClan = card.getAttribute('data-clan');
            if (cardClan === clan) {
                card.classList.remove('hidden-by-clan');
            } else {
                card.classList.add('hidden-by-clan');
                hiddenCount++;
            }
        }
    });
    
    // Перевіряємо, чи потрібно показати пустий стан
    checkEmptyState();
}

/**
 * Фільтрація стримерів за статусом
 */
function filterByStatus(status) {
    const streamerCards = document.querySelectorAll('.streamer-card');
    
    // Рахуємо кількість прихованих карток
    let hiddenCount = 0;
    
    streamerCards.forEach(card => {
        if (status === 'all') {
            card.classList.remove('hidden-by-status');
        } else if (status === 'live') {
            if (card.classList.contains('live')) {
                card.classList.remove('hidden-by-status');
            } else {
                card.classList.add('hidden-by-status');
                hiddenCount++;
            }
        } else if (status === 'recent') {
            if (card.classList.contains('live') || card.classList.contains('recent')) {
                card.classList.remove('hidden-by-status');
            } else {
                card.classList.add('hidden-by-status');
                hiddenCount++;
            }
        }
    });
    
    // Перевіряємо, чи потрібно показати пустий стан
    checkEmptyState();
}

/**
 * Сортування стримерів
 */
function sortStreamers(sortType) {
    const streamersContainer = document.getElementById('streamers-container');
    const streamerCards = Array.from(document.querySelectorAll('.streamer-card'));
    
    // Сортуємо картки
    streamerCards.sort((a, b) => {
        const aLive = a.classList.contains('live');
        const bLive = b.classList.contains('live');
        
        // За замовчуванням: спочатку онлайн, потім недавно онлайн
        if (sortType === 'default') {
            // Спочатку сортуємо за статусом (онлайн)
            if (aLive && !bLive) return -1;
            if (!aLive && bLive) return 1;
            
            const aRecent = a.classList.contains('recent');
            const bRecent = b.classList.contains('recent');
            
            // Потім за статусом "недавно"
            if (aRecent && !bRecent) return -1;
            if (!aRecent && bRecent) return 1;
            
            // Потім за кланом (G1_UA має пріоритет)
            const aClan = a.getAttribute('data-clan');
            const bClan = b.getAttribute('data-clan');
            
            const getClanPriority = (clan) => {
                const match = clan.match(/G(\d+)_UA/);
                return match ? parseInt(match[1]) : 999;
            };
            
            return getClanPriority(aClan) - getClanPriority(bClan);
        }
        // За іменем (А-Я)
        else if (sortType === 'name-asc') {
            const aName = a.querySelector('.streamer-name').textContent;
            const bName = b.querySelector('.streamer-name').textContent;
            return aName.localeCompare(bName);
        }
        // За іменем (Я-А)
        else if (sortType === 'name-desc') {
            const aName = a.querySelector('.streamer-name').textContent;
            const bName = b.querySelector('.streamer-name').textContent;
            return bName.localeCompare(aName);
        }
        // За кількістю глядачів (тільки для стримерів онлайн)
        else if (sortType === 'viewers') {
            // Спочатку онлайн стримери
            if (aLive && !bLive) return -1;
            if (!aLive && bLive) return 1;
            
            // Якщо обидва онлайн, порівнюємо кількість глядачів
            if (aLive && bLive) {
                const aViewers = parseInt(a.querySelector('.viewers-count span').textContent) || 0;
                const bViewers = parseInt(b.querySelector('.viewers-count span').textContent) || 0;
                return bViewers - aViewers; // Спадання
            }
            
            // Якщо обидва офлайн, сортуємо за часом останнього перебування в мережі (якщо є)
            const aId = a.getAttribute('data-id');
            const bId = b.getAttribute('data-id');
            
            const aLastOnline = localStorage.getItem(`streamer_${aId}_last_online`) || 0;
            const bLastOnline = localStorage.getItem(`streamer_${bId}_last_online`) || 0;
            
            return bLastOnline - aLastOnline; // Від найновішого до найстарішого
        }
        
        // За замовчуванням
        return 0;
    });
    
    // Видаляємо картки з контейнера
    streamerCards.forEach(card => card.remove());
    
    // Додаємо відсортовані картки назад
    streamerCards.forEach(card => {
        streamersContainer.appendChild(card);
    });
}

/**
 * Перевірка на пустий стан (коли всі стримери відфільтровані)
 */
function checkEmptyState() {
    const streamersContainer = document.getElementById('streamers-container');
    const visibleCards = Array.from(document.querySelectorAll('.streamer-card')).filter(card => {
        return !card.classList.contains('hidden-by-clan') && !card.classList.contains('hidden-by-status');
    });
    
    // Видаляємо попередній empty-state, якщо він є
    const existingEmptyState = streamersContainer.querySelector('.empty-state');
    if (existingEmptyState) {
        existingEmptyState.remove();
    }
    
    // Якщо немає видимих карток, показуємо пустий стан
    if (visibleCards.length === 0) {
        const template = document.getElementById('empty-template');
        const emptyState = document.importNode(template.content, true);
        
        // Додаємо обробник для кнопки скидання фільтрів
        const resetBtn = emptyState.querySelector('.reset-filters');
        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                // Скидаємо фільтр кланів
                const clanFilter = document.getElementById('clanFilter');
                if (clanFilter) {
                    clanFilter.querySelector('span').textContent = 'Всі клани';
                    document.querySelector('#clanFilterMenu .dropdown-item[data-value="all"]').click();
                }
                
                // Скидаємо фільтр статусу
                document.querySelector('.filter-tab[data-filter="all"]').click();
                
                // Скидаємо сортування
                const sortFilter = document.getElementById('sortFilter');
                if (sortFilter) {
                    sortFilter.querySelector('span').textContent = 'За замовчуванням';
                    document.querySelector('#sortFilterMenu .dropdown-item[data-value="default"]').click();
                }
            });
        }
        
        streamersContainer.appendChild(emptyState);
    }
}

/**
 * Показ сповіщення про стрімера, який почав трансляцію
 */
function showStreamNotification(streamerData) {
    // Видаляємо попереднє сповіщення, якщо воно є
    const existingNotification = document.querySelector('.stream-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Знаходимо дані стримера
    const streamer = streamersData.find(s => s.id === streamerData.id);
    if (!streamer) return;
    
    // Використовуємо шаблон для сповіщення
    const template = document.getElementById('notification-template');
    const notification = document.importNode(template.content, true).querySelector('.stream-notification');
    
    // Заповнюємо дані
    notification.querySelector('.notification-avatar img').src = streamer.avatarUrl;
    notification.querySelector('.streamer-name').textContent = streamer.displayName;
    notification.querySelector('.notification-message').textContent = streamerData.title;
    
    // Додаємо до сторінки
    document.body.appendChild(notification);
    
    // Додаємо клас для анімації
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Додаємо обробник для закриття
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 500);
        });
    }
    
    // Додаємо обробник для кліку на сповіщення (перенаправлення на стрім)
    notification.addEventListener('click', function(e) {
        if (!e.target.closest('.notification-close')) {
            window.open(`https://twitch.tv/${streamer.twitchId}`, '_blank');
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }
    });
    
    // Автоматично закриваємо сповіщення через 8 секунд
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }
    }, 8000);
}

/**
 * Функція для імітації відповіді API Twitch (для демонстрації)
 * У реальному проекті тут був би запит до API
 */
function getLiveStreamersDemo() {
    // Випадковим чином вибираємо 2-3 стримерів, які зараз "онлайн"
    const liveStreamersCount = Math.floor(Math.random() * 2) + 2; // 2-3 стримери онлайн
    const liveStreamersIndices = [];
    
    // Вибираємо випадкові індекси
    while (liveStreamersIndices.length < liveStreamersCount) {
        const randomIndex = Math.floor(Math.random() * streamersData.length);
        if (!liveStreamersIndices.includes(randomIndex)) {
            liveStreamersIndices.push(randomIndex);
        }
    }
    
    // Формуємо дані про стримерів онлайн
    return liveStreamersIndices.map(index => {
        const streamer = streamersData[index];
        
        // Генеруємо випадкові дані для стріму
        const streamTitles = [
            "Рейтингові бої на Т-10 | Фарм ЛБЗ | Взвод з глядачами",
            "Турнірна практика з кланом | Стратегії на новій карті",
            "Нерф СТ в патчі 1.22 - аналіз та тест",
            "Нова гілка ПТ - перші враження та тактики",
            "Кланові війни на Глобальній карті | G_UA проти KOPM2",
            "Фарм кредитів на преміум техніці | Відповідаю на питання"
        ];
        
        const streamCategories = ["World of Tanks", "World of Tanks: Ранговані бої", "World of Tanks: Турніри"];
        
        return {
            id: streamer.id,
            title: streamTitles[Math.floor(Math.random() * streamTitles.length)],
            category: streamCategories[Math.floor(Math.random() * streamCategories.length)],
            viewers: Math.floor(Math.random() * 500) + 50 // 50-550 глядачів
        };
    });
}

/**
 * Додавання CSS стилів для модальних вікон
 */
(function addModalStyles() {
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .modal-overlay.active {
            opacity: 1;
            visibility: visible;
        }
        
        .modal-content {
            background: var(--bg-dark);
            border-radius: var(--radius-lg);
            width: 100%;
            max-width: 700px;
            max-height: 80vh;
            overflow-y: auto;
            transform: scale(0.9);
            transition: transform 0.3s ease;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: var(--shadow-xl);
        }
        
        .modal-overlay.active .modal-content {
            transform: scale(1);
        }
        
        .modal-header {
            padding: var(--space-lg);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .modal-header h3 {
            margin: 0;
            font-size: 20px;
        }
        
        .modal-close {
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: 20px;
            cursor: pointer;
            transition: all var(--transition-normal);
        }
        
        .modal-close:hover {
            color: var(--primary);
            transform: rotate(90deg);
        }
        
        .modal-body {
            padding: var(--space-lg);
        }
        
        .requirements-list {
            list-style: none;
            margin: 0;
            padding: 0;
        }
        
        .requirements-list li {
            display: flex;
            gap: var(--space-md);
            margin-bottom: var(--space-lg);
        }
        
        .requirements-list li i {
            color: var(--primary);
            font-size: 20px;
            flex-shrink: 0;
            margin-top: 5px;
        }
        
        .requirements-list li h4 {
            margin: 0 0 var(--space-xs);
            font-size: 18px;
        }
        
        .requirements-list li p {
            margin: 0;
            color: var(--text-secondary);
        }
        
        .modal-actions {
            margin-top: var(--space-xl);
            text-align: center;
        }
        
        body.modal-open {
            overflow: hidden;
        }
        
        @media (max-width: 768px) {
            .modal-content {
                width: 90%;
            }
            
            .requirements-list li {
                flex-direction: column;
                gap: var(--space-xs);
            }
        }
    `;
    document.head.appendChild(styleEl);
})();
