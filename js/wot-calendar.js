// Функція ініціалізації календаря
document.addEventListener('DOMContentLoaded', function() {
    displayCurrentWeekEvents();
});

// Масив з фіксованими подіями (якщо API недоступний)
const wotEvents = [
    {
        id: 'obj780-lion',
        title: 'Зберіть їх обох: Об\'єкт 780 і Lion повертаються',
        type: 'green',
        imageUrl: 'img/events/obj780-lion.jpg',
        startDate: new Date('2025-04-30T10:00:00'),
        endDate: new Date('2025-05-01T22:45:00'),
        url: 'https://worldoftanks.eu/uk/news/specials/obj780-lion-return/'
    },
    {
        id: 'frontline',
        title: 'Весняний запуск Лінії фронту!',
        type: 'green',
        imageUrl: 'img/events/frontline.jpg',
        startDate: new Date('2025-04-29T12:00:00'),
        endDate: new Date('2025-05-05T03:00:00'),
        url: 'https://worldoftanks.eu/uk/news/general-news/frontline-spring/'
    },
    {
        id: 'onslaught',
        title: 'Натиск. Сезон Нефритової Мантикори',
        type: 'orange',
        imageUrl: 'img/events/onslaught.jpg',
        startDate: new Date('2025-04-15T10:00:00'),
        endDate: new Date('2025-05-25T10:00:00'),
        url: 'https://worldoftanks.eu/uk/news/general-news/onslaught-jade-manticore/'
    },
    {
        id: 'amd-tokens',
        title: 'Магазин жетонів СЛН від AMD',
        type: 'purple',
        imageUrl: 'img/events/amd-tokens.jpg',
        startDate: new Date('2025-04-10T10:00:00'),
        endDate: new Date('2025-05-30T10:00:00'),
        url: 'https://worldoftanks.eu/uk/news/specials/amd-tokens/'
    },
    {
        id: 'battle-pass',
        title: 'XVI сезон Бойової перепустки',
        type: 'azure',
        imageUrl: 'img/events/battle-pass.jpg',
        startDate: new Date('2025-04-05T10:00:00'),
        endDate: new Date('2025-06-03T10:00:00'),
        url: 'https://worldoftanks.eu/uk/news/general-news/battle-pass-season-16/'
    }
];

// Функція для відображення подій поточного тижня
function displayCurrentWeekEvents() {
    const calendarContainer = document.getElementById('wot-calendar');
    const currentDate = new Date();
    
    // Знаходимо початок і кінець тижня (пн-нд)
    const currentDay = currentDate.getDay();
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDay + (currentDay === 0 ? -6 : 1)); // Понеділок
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Неділя
    
    // Форматуємо діапазон дат для заголовка
    const startDate = startOfWeek.getDate();
    const startMonth = startOfWeek.toLocaleString('uk-UA', { month: 'short' });
    const endDate = endOfWeek.getDate();
    const endMonth = endOfWeek.toLocaleString('uk-UA', { month: 'short' });
    
    const dateRange = `${startDate} ${startMonth}. - ${endDate} ${endMonth}.`;
    
    // Створюємо HTML структуру календаря
    let calendarHTML = `
        <div class="event-calendar">
            <div class="event-calendar_header">
                <h3 class="event-calendar_title">ГОЛОВНЕ ЦЬОГО ТИЖНЯ</h3>
                <div class="event-calendar_date-range">${dateRange}</div>
            </div>
            <div class="event-calendar_inner">
                <div class="event-calendar_days">
                    <!-- Дні будуть додані динамічно -->
                </div>
                <div class="event-calendar_events">
                    <!-- Події будуть додані тут -->
                </div>
            </div>
        </div>
    `;
    
    calendarContainer.innerHTML = calendarHTML;
    
    // Додаємо дні тижня
    const daysContainer = document.querySelector('.event-calendar_days');
    const weekDays = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'НД'];
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        
        const dayNum = date.getDate();
        const isCurrentDay = isSameDay(date, currentDate);
        
        const dayHTML = `
            <div class="event-calendar_day ${isCurrentDay ? 'event-calendar_day__current' : ''}">
                <div class="event-calendar_day-header">
                    <div class="event-calendar_day-weekday">${weekDays[i]}.</div>
                    <div class="event-calendar_day-date">${dayNum}</div>
                </div>
            </div>
        `;
        
        daysContainer.innerHTML += dayHTML;
    }
    
    // Додаємо події
    const eventsContainer = document.querySelector('.event-calendar_events');
    
    // Фільтруємо та сортуємо події
    const activeEvents = wotEvents
        .filter(event => event.endDate >= currentDate) // Показуємо тільки активні та майбутні події
        .sort((a, b) => a.endDate - b.endDate); // Сортуємо за часом завершення (найближчі спочатку)
    
    activeEvents.forEach(event => {
        // Розраховуємо скільки часу залишилось
        const timeLeft = getTimeLeft(currentDate, event.endDate);
        
        // Створюємо елемент події
        const eventHTML = `
            <div class="event-calendar_event event-calendar_event__${event.type}">
                <a href="${event.url}" class="event-calendar_event-link" target="_blank">
                    <div class="event-calendar_event-body-container">
                        <div class="event-calendar_event-image-container">
                            <img src="${event.imageUrl}" alt="${event.title}" class="event-calendar_event-image">
                        </div>
                        <div class="event-calendar_event-body">
                            <div class="event-calendar_event-content">
                                <div class="event-calendar_event-time-left">
                                    <i class="fas fa-clock"></i> ${timeLeft}
                                </div>
                                <div class="event-calendar_event-title">${event.title}</div>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        `;
        
        eventsContainer.innerHTML += eventHTML;
    });
    
    // Якщо подій немає
    if (activeEvents.length === 0) {
        eventsContainer.innerHTML = `
            <div class="event-calendar_empty">
                <p>Немає запланованих подій. Слідкуйте за оновленнями!</p>
            </div>
        `;
    }
}

// Функція для перевірки, чи два дати - це один і той самий день
function isSameDay(date1, date2) {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
}

// Функція для форматування залишку часу
function getTimeLeft(currentDate, endDate) {
    const diffMs = endDate - currentDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
        return `${diffDays} д залишилося`;
    }
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours > 0) {
        const remainingMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${diffHours} год ${remainingMinutes} хв залишилося`;
    }
    
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return `${diffMinutes} хв залишилося`;
}

// Функція для отримання даних подій через API Wargaming
// Може використовуватись замість локального масиву даних
async function fetchWargamingEvents() {
    const applicationId = 'f5f97f92233a59f3d8dbaec28d22ce0f'; 
    const url = `https://api.worldoftanks.eu/wot/globalmap/events/?application_id=${applicationId}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.status === 'ok') {
            return data.data;
        } else {
            console.error('API Error:', data.error);
            return [];
        }
    } catch (error) {
        console.error('Fetch error:', error);
        return [];
    }
}
