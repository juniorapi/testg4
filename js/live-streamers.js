/**
 * Скрипт для відображення живих стримерів на головній сторінці
 * Використовує дані про стримерів, які зберігаються в localStorage
 */

document.addEventListener('DOMContentLoaded', function() {
    initLiveStreamers();
});

/**
 * Ініціалізує відображення стримерів на головній сторінці
 */
function initLiveStreamers() {
    // Знаходимо контейнер для стримерів
    const streamersContainer = document.querySelector('.streamers-live-grid');
    if (!streamersContainer) return;

    // Отримуємо дані про стримерів онлайн з localStorage
    const liveStreamersData = getLiveStreamers();
    
    // Якщо дані застарілі або відсутні, робимо запит
    if (!liveStreamersData || liveStreamersData.length === 0) {
        // Перевіряємо, коли останній раз оновлювалися дані
        const lastUpdated = localStorage.getItem('gua_live_streamers_updated');
        const now = Date.now();
        
        // Якщо дані старші за 5 хвилин або відсутні, робимо новий запит
        if (!lastUpdated || (now - parseInt(lastUpdated)) > 5 * 60 * 1000) {
            // Запитуємо нові дані для стримерів
            checkStreamers();
            return;
        }
        
        // Якщо немає стримерів онлайн, показуємо дефолтний вміст
        showDefaultStreamers();
        return;
    }
    
    // Відображаємо стримерів, які зараз онлайн
    showLiveStreamers(liveStreamersData);
}

/**
 * Отримує дані про стримерів з localStorage
 */
function getLiveStreamers() {
    const liveStreamersJSON = localStorage.getItem('gua_live_streamers');
    if (!liveStreamersJSON) return [];
    
    try {
        return JSON.parse(liveStreamersJSON);
    } catch (e) {
        console.error('Помилка при парсингу даних про стримерів', e);
        return [];
    }
}

/**
 * Відображає стримерів, які зараз онлайн
 */
function showLiveStreamers(streamers) {
    const streamersContainer = document.querySelector('.streamers-live-grid');
    if (!streamersContainer) return;
    
    // Очищаємо контейнер
    streamersContainer.innerHTML = '';
    
    // Сортуємо стримерів за кількістю глядачів (спадання)
    streamers.sort((a, b) => b.viewers - a.viewers);
    
    // Перший стример буде головним (featured)
    if (streamers.length > 0) {
        const featuredStreamer = streamers[0];
        const featuredStreamHTML = createFeaturedStreamHTML(featuredStreamer);
        streamersContainer.innerHTML += featuredStreamHTML;
        
        // Додаємо інших стримерів (максимум 2)
        const regularStreamers = streamers.slice(1, 3);
        regularStreamers.forEach(streamer => {
            const regularStreamHTML = createRegularStreamHTML(streamer);
            streamersContainer.innerHTML += regularStreamHTML;
        });
        
        // Якщо стримерів менше 3, додаємо офлайн стримерів
        if (streamers.length < 3) {
            const offlineStreamersCount = 3 - streamers.length;
            for (let i = 0; i < offlineStreamersCount; i++) {
                streamersContainer.innerHTML += createOfflineStreamerHTML();
            }
        }
    } else {
        // Якщо немає стримерів онлайн, показуємо дефолтний вміст
        showDefaultStreamers();
    }
}

/**
 * Створює HTML для головного стримера
 */
function createFeaturedStreamHTML(streamer) {
    return `
    <div class="live-stream featured-stream">
        <div class="stream-thumbnail">
            <img src="img/stream-thumb-1.jpg" alt="Live стрім">
            <div class="live-badge">LIVE</div>
            <div class="viewers-count">
                <i class="fas fa-eye"></i>
                <span>${streamer.viewers}</span>
            </div>
        </div>
        <div class="stream-info">
            <div class="streamer-avatar">
                <img src="${streamer.avatarUrl}" alt="${streamer.displayName}">
                <div class="online-indicator"></div>
            </div>
            <div class="stream-details">
                <h3 class="stream-title">${streamer.title}</h3>
                <div class="streamer-name">
                    <span>${streamer.displayName}</span>
                    <span class="clan-tag">${streamer.clan}</span>
                </div>
            </div>
            <a href="https://twitch.tv/${streamer.twitchId}" target="_blank" class="watch-link">
                <i class="fab fa-twitch"></i>
                <span>Дивитися</span>
            </a>
        </div>
    </div>
    `;
}

/**
 * Створює HTML для звичайного стримера
 */
function createRegularStreamHTML(streamer) {
    return `
    <div class="live-stream">
        <div class="stream-thumbnail">
            <img src="img/stream-thumb-2.jpg" alt="Live стрім">
            <div class="live-badge">LIVE</div>
            <div class="viewers-count">
                <i class="fas fa-eye"></i>
                <span>${streamer.viewers}</span>
            </div>
        </div>
        <div class="stream-info">
            <div class="streamer-avatar">
                <img src="${streamer.avatarUrl}" alt="${streamer.displayName}">
                <div class="online-indicator"></div>
            </div>
            <div class="stream-details">
                <h3 class="stream-title">${streamer.title}</h3>
                <div class="streamer-name">
                    <span>${streamer.displayName}</span>
                    <span class="clan-tag">${streamer.clan}</span>
                </div>
            </div>
            <a href="https://twitch.tv/${streamer.twitchId}" target="_blank" class="watch-link">
                <i class="fab fa-twitch"></i>
                <span>Дивитися</span>
            </a>
        </div>
    </div>
    `;
}

/**
 * Створює HTML для офлайн стримера
 */
function createOfflineStreamerHTML() {
    // Випадкові дані для офлайн стримера
    const offlineStreamers = [
        {
            name: "LightTank_Girl",
            clan: "G4_UA",
            avatar: "img/streamer-3.jpg",
            lastOnline: "вчора"
        },
        {
            name: "ArtyPro",
            clan: "G2_UA",
            avatar: "img/streamer-2.jpg",
            lastOnline: "2 години тому"
        },
        {
            name: "TankMaster_UA",
            clan: "G1_UA",
            avatar: "img/streamer-1.jpg",
            lastOnline: "3 години тому"
        }
    ];
    
    const randomIndex = Math.floor(Math.random() * offlineStreamers.length);
    const streamer = offlineStreamers[randomIndex];
    
    return `
    <div class="offline-streamer">
        <div class="streamer-header">
            <div class="streamer-avatar">
                <img src="${streamer.avatar}" alt="Аватар стримера">
            </div>
            <div class="streamer-info">
                <h3>${streamer.name}</h3>
                <div class="clan-tag">${streamer.clan}</div>
                <div class="last-online">
                    <i class="fas fa-clock"></i>
                    <span>Остання трансляція: ${streamer.lastOnline}</span>
                </div>
            </div>
            <div class="social-links">
                <a href="https://twitch.tv/" target="_blank" class="social-link twitch">
                    <i class="fab fa-twitch"></i>
                </a>
                <a href="https://youtube.com/" target="_blank" class="social-link youtube">
                    <i class="fab fa-youtube"></i>
                </a>
            </div>
        </div>
    </div>
    `;
}

/**
 * Показує дефолтні (демонстраційні) стримери
 */
function showDefaultStreamers() {
    // Нічого не робимо, так як HTML вже містить структуру з демо-стримерами
    console.log('Показую дефолтних стримерів (які вже є в HTML)');
    
    // Якщо потрібно завантажити актуальні дані, перевіряємо стримерів
    setTimeout(checkStreamers, 3000);
}

/**
 * Перевіряє статус стримерів
 */
function checkStreamers() {
    // Це просто заглушка, яка імітує запит до API Twitch
    // В реальному випадку тут був би AJAX запит
    
    // Отримуємо стримерів з streamers.js
    const streamers = getStreamersData();
    
    // Генеруємо лайв стримерів
    const liveStreamers = generateDemoLiveStreamers(streamers);
    
    // Зберігаємо дані
    localStorage.setItem('gua_live_streamers', JSON.stringify(liveStreamers));
    localStorage.setItem('gua_live_streamers_updated', Date.now().toString());
    
    // Показуємо стримерів
    showLiveStreamers(liveStreamers);
}

/**
 * Отримує дані про стримерів (те саме, що в streamers.js)
 */
function getStreamersData() {
    return [
        { 
            id: 'mrexclusivel', 
            twitchId: 'mrexclusivel',
            displayName: 'MrExclusivel',
            avatarUrl: 'img/exclusivel.png',
            description: 'Стример і професійний гравець G4_UA.',
            clan: 'G4_UA',
            youtube: 'none',
            youtubeType: 'user',
            telegram: 'none'
        },
         { 
            id: 'lazerok07', 
            twitchId: 'lazerok07',
            displayName: 'lazerok07',
            avatarUrl: 'img/lazerok07.png',
            description: 'Стример і професійний гравець G4_UA.',
            clan: 'G4_UA',
            youtube: 'lazerok07',
            youtubeType: 'user',
            telegram: 'lazerok07'
        },
        { 
            id: 'iyouxin', 
            twitchId: 'iyouxin',
            displayName: 'iyouxin',
            avatarUrl: 'img/iyouxin.png',
            description: 'Стример і професійний гравець G4_UA.',
            clan: 'G3_UA',
            youtube: 'UCb1Cc16ozngmp1gAP-GJoFA',
            youtubeType: 'channel',
            telegram: 'none'
        },
        { 
            id: 'cs2_maincast', 
            twitchId: 'cs2_maincast',
            displayName: 'cs2_maincast',
            avatarUrl: 'img/cs2_maincast.png',
            description: 'Стример і професійний гравець G4_UA.',
            clan: 'G_UA',
            youtube: 'none',
            youtubeType: 'user',
            telegram: 'none'
        },
        { 
            id: 'ykp_boih_wot', 
            twitchId: 'ykp_boih_wot',
            displayName: 'YKP_BOIH',
            avatarUrl: 'img/ykp_boih_wot.png',
            description: 'Відомий стример і коментатор. Командир G2_UA.',
            clan: 'G0_UA',
            youtube: 'UCUG710-yQ1nldw3d5ApQfgA',
            youtubeType: 'channel',
            telegram: 'Bad_company_HUB'
        },
        { 
            id: 'juniortv_gaming', 
            twitchId: 'juniortv_gaming',
            displayName: 'JuniorTV_Gaming',
            avatarUrl: 'img/jtv.png',
            description: 'Учасник G4_UA. Стримить регулярно з фокусом на командну гру.',
            clan: 'G4_UA',
            youtube: 'JuniorTV_Gaming',
            youtubeType: 'user',
            telegram: 'JuniorTV_Gaming'
        },
        { 
            id: 'inesp1ki', 
            twitchId: 'inesp1ki',
            displayName: 'INeSp1kI',
            avatarUrl: 'img/inesp1ki.png',
            description: 'Стример і гравець G1_UA.',
            clan: 'GO_UA',
            youtube: 'INeSp1kI',
            youtubeType: 'user',
            telegram: 'INeSp1kIWOT'
        },
        { 
            id: 'el_sld', 
            twitchId: 'el_sld',
            displayName: 'El_SlD',
            avatarUrl: 'img/el_sid.png',
            description: 'Експерт з артилерії. Член G0_UA.',
            clan: 'G0_UA',
            youtube: 'UCMP24qFvIZ3te2oCGdIBIYg',
            youtubeType: 'channel',
            telegram: 'ghosts_ua_official'
        },
        { 
            id: 'firestormyo', 
            twitchId: 'firestormyo',
            displayName: 'Firestormyo',
            avatarUrl: 'img/firestormyo.png',
            description: 'Експерт з артилерії. Член G3_UA.',
            clan: 'G3_UA',
            youtube: '',
            youtubeType: '',
            telegram: 'firestormyo'
        },
        { 
            id: 'vgostiua', 
            twitchId: 'vgostiua',
            displayName: 'vgostiua',
            avatarUrl: 'img/vgostiua.png',
            description: 'Стримить переважно техніку підтримки. Член G5_UA.',
            clan: 'G2_UA',
            youtube: 'UCPQAAy7rnk3G4eqMdFh2gng',
            youtubeType: 'channel',
            telegram: 'vgostiua'
        }
    ];
}

/**
 * Генерує демонстраційних лайв стримерів
 */
function generateDemoLiveStreamers(streamers) {
    // Випадкова кількість стримерів (1-3)
    const liveCount = Math.floor(Math.random() * 3) + 1;
    
    // Перемішуємо масив стримерів
    const shuffled = [...streamers].sort(() => 0.5 - Math.random());
    
    // Вибираємо перші liveCount елементів
    const liveStreamers = shuffled.slice(0, liveCount);
    
    // Додаємо необхідні дані про стрім
    return liveStreamers.map(streamer => {
        const streamTitles = [
            "Рейтингові бої на Об'єкт 268/4 - прокачуємо ЛБЗ",
            "Турнірні тренування з командою",
            "Фарм срібла на преміум техніці",
            "Вечірній стрім - катаємо з глядачами",
            "Нова гілка британців - перші враження",
            "Кланові війни на Глобальній карті"
        ];
        
        return {
            id: streamer.id,
            twitchId: streamer.twitchId,
            displayName: streamer.displayName,
            avatarUrl: streamer.avatarUrl,
            clan: streamer.clan,
            title: streamTitles[Math.floor(Math.random() * streamTitles.length)],
            viewers: Math.floor(Math.random() * 450) + 50 // 50-500 глядачів
        };
    });
}
