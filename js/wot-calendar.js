// Функція ініціалізації календаря
document.addEventListener('DOMContentLoaded', function() {
    fetchWargamingEvents();
});

// Функція для отримання даних подій з API Wargaming
async function fetchWargamingEvents() {
    const applicationId = 'f5f97f92233a59f3d8dbaec28d22ce0f'; // Ваш API ключ
    const url = `https://api.worldoftanks.eu/wot/globalmap/events/?application_id=${applicationId}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.status === 'ok') {
            displayEvents(data.data);
        } else {
            console.error('API Error:', data.error);
            document.getElementById('wot-calendar').innerHTML = 'Не вдалося завантажити події.';
        }
    } catch (error) {
        console.error('Fetch error:', error);
        document.getElementById('wot-calendar').innerHTML = 'Помилка завантаження даних.';
    }
}

// Функція для відображення подій у форматі календаря
function displayEvents(events) {
    const calendarContainer = document.getElementById('wot-calendar');
    
    // Створюємо структуру календаря
    let calendarHTML = `
        <div class="event-calendar">
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
    
    // Додаємо дні до календаря
    const daysContainer = document.querySelector('.event-calendar_days');
    const currentDate = new Date();
    
    // Створюємо 7 днів, починаючи з поточного дня
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(currentDate.getDate() + i);
        
        const dayOfWeek = new Intl.DateTimeFormat('uk-UA', { weekday: 'short' }).format(date);
        const dayOfMonth = date.getDate();
        
        const dayHTML = `
            <div class="event-calendar_day ${i === 0 ? 'event-calendar_day__current' : ''}">
                <div class="event-calendar_day-header">
                    <div class="event-calendar_day-weekday">${dayOfWeek}</div>
                    <div class="event-calendar_day-date">${dayOfMonth}</div>
                </div>
            </div>
        `;
        
        daysContainer.innerHTML += dayHTML;
    }
    
    // Додаємо події
    const eventsContainer = document.querySelector('.event-calendar_events');
    
    events.forEach(event => {
        // Конвертуємо рядки дат у об'єкти Date
        const startDate = new Date(event.start);
        const endDate = new Date(event.end);
        const currentDate = new Date();
        
        // Розраховуємо дні, що залишились
        const daysLeft = Math.ceil((endDate - currentDate) / (1000 * 60 * 60 * 24));
        let statusText = '';
        
        if (currentDate > endDate) {
            statusText = 'Завершено';
        } else if (currentDate < startDate) {
            statusText = 'Скоро';
        } else {
            statusText = `${daysLeft} д. залишилось`;
        }
        
        // Визначаємо тип події (колір)
        const eventType = getEventTypeByName(event.event_name || '');
        
        // Створюємо елемент події
        const eventHTML = `
            <div class="event-calendar_event event-calendar_event__${eventType}">
                <a href="${event.fronts && event.fronts.length > 0 ? event.fronts[0].url : '#'}" class="event-calendar_event-link">
                    <div class="event-calendar_event-body-container">
                        <div class="event-calendar_event-body">
                            <div class="event-calendar_event-content">
                                <div class="event-calendar_event-content-upper">
                                    <div class="event-calendar_event-icon">
                                        <i class="fas fa-calendar-alt"></i>
                                    </div>
                                    <div class="event-calendar_event-tag-container">
                                        <div class="event-calendar_event-tag">
                                            <span class="event-calendar_event-tag-text">${statusText}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="event-calendar_event-title">${event.event_name}</div>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        `;
        
        eventsContainer.innerHTML += eventHTML;
    });
    
    // Якщо подій немає
    if (events.length === 0) {
        eventsContainer.innerHTML = `
            <div class="event-calendar_empty">
                <p>Немає запланованих подій. Слідкуйте за оновленнями!</p>
            </div>
        `;
    }
}

// Функція для визначення типу події за назвою
function getEventTypeByName(name) {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('frontline') || lowerName.includes('фронтлайн')) {
        return 'green';
    } else if (lowerName.includes('battle pass') || lowerName.includes('бойовий пропуск')) {
        return 'azure';
    } else if (lowerName.includes('onslaught') || lowerName.includes('натиск')) {
        return 'orange';
    } else if (lowerName.includes('token') || lowerName.includes('токен')) {
        return 'purple';
    } else {
        return 'green'; // За замовчуванням
    }
}