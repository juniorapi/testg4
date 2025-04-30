/**
 * Скрипт для адміністрування стримерів G_UA Alliance
 * Дозволяє додавати, редагувати та видаляти стримерів
 */

document.addEventListener('DOMContentLoaded', function() {
    // Ініціалізуємо інтерфейс
    initializeForm();
    loadStreamersList();
    
    // Обробник для кнопки додавання нового стримера
    document.getElementById('addStreamerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addNewStreamer();
    });
    
    // Обробник для кнопки скасування редагування
    document.getElementById('cancelEdit').addEventListener('click', function() {
        resetForm();
    });
});

// Глобальна змінна для зберігання даних стримерів
let streamers = [];
let editingStreamerId = null;

/**
 * Ініціалізація форми та випадаючих списків
 */
function initializeForm() {
    // Ініціалізуємо випадаючий список кланів
    const clanSelect = document.getElementById('streamerClan');
    const clans = ['G_UA', 'G0_UA', 'GO_UA', 'G1_UA', 'G2_UA', 'G3_UA', 'G4_UA', 'G5_UA'];
    
    clans.forEach(clan => {
        const option = document.createElement('option');
        option.value = clan;
        option.textContent = clan;
        clanSelect.appendChild(option);
    });
    
    // Ініціалізуємо випадаючий список типу YouTube
    const youtubeTypeSelect = document.getElementById('youtubeType');
    const youtubeTypes = [
        { value: 'user', text: 'Користувач (@username)' },
        { value: 'channel', text: 'ID Каналу (UC...)' }
    ];
    
    youtubeTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type.value;
        option.textContent = type.text;
        youtubeTypeSelect.appendChild(option);
    });
    
    // Показуємо/приховуємо відповідні поля при зміні типу YouTube
    youtubeTypeSelect.addEventListener('change', function() {
        const youtubeField = document.getElementById('youtubeField');
        
        if (this.value === 'user') {
            youtubeField.placeholder = 'Ім\'я користувача YouTube (без @)';
        } else {
            youtubeField.placeholder = 'ID YouTube каналу (UC...)';
        }
    });
    
    // Генеруємо ідентифікатор при введенні Twitch ID
    document.getElementById('twitchId').addEventListener('input', function() {
        if (!editingStreamerId) { // Генеруємо ID тільки для нових стримерів
            document.getElementById('streamerId').value = this.value.toLowerCase().trim();
        }
    });
    
    // Перевірка валідності полів
    const form = document.getElementById('addStreamerForm');
    const inputs = form.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            validateForm();
        });
    });
}

/**
 * Валідація форми перед відправкою
 */
function validateForm() {
    const form = document.getElementById('addStreamerForm');
    const submitBtn = document.getElementById('submitStreamer');
    
    // Перевіряємо чи всі обов'язкові поля заповнені
    const isValid = form.checkValidity();
    
    // Перевіряємо унікальність ID (якщо не в режимі редагування)
    let isIdUnique = true;
    if (!editingStreamerId) {
        const streamerId = document.getElementById('streamerId').value.trim();
        isIdUnique = !streamers.some(s => s.id === streamerId);
    }
    
    // Активуємо/деактивуємо кнопку відправки
    submitBtn.disabled = !(isValid && isIdUnique);
    
    // Показуємо помилку, якщо ID не унікальний
    const idError = document.getElementById('idError');
    if (idError) {
        idError.style.display = isIdUnique ? 'none' : 'block';
    }
    
    return isValid && isIdUnique;
}

/**
 * Завантаження списку стримерів з JSON-файлу
 */
function loadStreamersList() {
    const tableBody = document.getElementById('streamersTableBody');
    const loadingMessage = document.getElementById('loadingMessage');
    
    // Показуємо повідомлення про завантаження
    if (loadingMessage) loadingMessage.style.display = 'block';
    
    // Завантажуємо дані
    fetch('../data/streamers.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Не вдалося завантажити дані стримерів');
            }
            return response.json();
        })
        .then(data => {
            // Зберігаємо дані у глобальну змінну
            streamers = data.streamers || [];
            
            // Очищуємо таблицю
            tableBody.innerHTML = '';
            
            // Додаємо стримерів до таблиці
            if (streamers.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="text-center">
                            <div class="empty-message">
                                <i class="fas fa-users-slash"></i>
                                <p>Стримерів поки що немає.</p>
                            </div>
                        </td>
                    </tr>
                `;
            } else {
                streamers.forEach((streamer, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>
                            <div class="streamer-info">
                                <img src="../${streamer.avatarUrl}" alt="${streamer.displayName}" class="avatar-small">
                                <div>
                                    <div class="streamer-name">${streamer.displayName}</div>
                                    <div class="streamer-id text-muted">${streamer.id}</div>
                                </div>
                            </div>
                        </td>
                        <td>${streamer.clan}</td>
                        <td>
                            <a href="https://twitch.tv/${streamer.twitchId}" target="_blank" class="social-link">
                                <i class="fab fa-twitch"></i> ${streamer.twitchId}
                            </a>
                        </td>
                        <td>
                            <div class="actions">
                                <button class="btn btn-sm btn-edit" data-id="${streamer.id}">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-delete" data-id="${streamer.id}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    `;
                    tableBody.appendChild(row);
                    
                    // Додаємо обробники для кнопок
                    row.querySelector('.btn-edit').addEventListener('click', () => {
                        editStreamer(streamer.id);
                    });
                    
                    row.querySelector('.btn-delete').addEventListener('click', () => {
                        deleteStreamer(streamer.id);
                    });
                });
            }
            
            // Оновлюємо лічильник стримерів
            const streamersCount = document.getElementById('streamersCount');
            if (streamersCount) {
                streamersCount.textContent = streamers.length;
            }
            
            // Приховуємо повідомлення про завантаження
            if (loadingMessage) loadingMessage.style.display = 'none';
        })
        .catch(error => {
            console.error('Помилка завантаження даних стримерів:', error);
            
            // Показуємо повідомлення про помилку
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">
                        <div class="error-message">
                            <i class="fas fa-exclamation-triangle"></i>
                            <p>Помилка завантаження даних: ${error.message}</p>
                            <button class="btn btn-primary btn-sm" onclick="loadStreamersList()">
                                <i class="fas fa-sync"></i> Спробувати знову
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            
            // Приховуємо повідомлення про завантаження
            if (loadingMessage) loadingMessage.style.display = 'none';
        });
}

/**
 * Додавання нового стримера
 */
function addNewStreamer() {
    // Перевіряємо валідність форми
    if (!validateForm()) return;
    
    // Отримуємо дані з форми
    const streamerId = document.getElementById('streamerId').value.trim();
    const displayName = document.getElementById('displayName').value.trim();
    const twitchId = document.getElementById('twitchId').value.trim();
    const clan = document.getElementById('streamerClan').value;
    const description = document.getElementById('description').value.trim();
    const avatarFile = document.getElementById('avatarImage').files[0];
    
    // Отримуємо дані для YouTube та Telegram
    const youtubeType = document.getElementById('youtubeType').value;
    let youtube = document.getElementById('youtubeField').value.trim();
    const telegram = document.getElementById('telegramUsername').value.trim() || 'none';
    
    // Очищаємо @ з YouTube імені користувача, якщо потрібно
    if (youtubeType === 'user' && youtube.startsWith('@')) {
        youtube = youtube.substring(1);
    }
    
    // Якщо YouTube не вказано, використовуємо 'none'
    if (!youtube) youtube = 'none';
    
    // Створюємо новий об'єкт стримера
    const newStreamer = {
        id: streamerId,
        twitchId: twitchId,
        displayName: displayName,
        avatarUrl: avatarFile ? `img/${avatarFile.name}` : 'img/default-avatar.png',
        description: description,
        clan: clan,
        youtube: youtube,
        youtubeType: youtubeType,
        telegram: telegram
    };
    
    // Додаємо або оновлюємо стримера в масиві
    if (editingStreamerId) {
        // Оновлюємо існуючого стримера
        const index = streamers.findIndex(s => s.id === editingStreamerId);
        if (index !== -1) {
            // Зберігаємо оригінальний шлях до аватару, якщо новий не вибрано
            if (!avatarFile) {
                newStreamer.avatarUrl = streamers[index].avatarUrl;
            }
            streamers[index] = newStreamer;
        }
    } else {
        // Додаємо нового стримера
        streamers.push(newStreamer);
    }
    
    // Сортуємо стримерів за кланом та ім'ям
    streamers.sort((a, b) => {
        if (a.clan === b.clan) {
            return a.displayName.localeCompare(b.displayName);
        }
        return a.clan.localeCompare(b.clan);
    });
    
    // Зберігаємо зміни
    saveStreamers();
    
    // Скидаємо форму
    resetForm();
    
    // Показуємо сповіщення про успіх
    showNotification(
        editingStreamerId ? 'Стримера успішно оновлено!' : 'Нового стримера успішно додано!',
        'success'
    );
}

/**
 * Редагування існуючого стримера
 */
function editStreamer(streamerId) {
    // Знаходимо стримера за ID
    const streamer = streamers.find(s => s.id === streamerId);
    if (!streamer) return;
    
    // Зберігаємо ID стримера, якого редагуємо
    editingStreamerId = streamerId;
    
    // Заповнюємо форму даними стримера
    document.getElementById('streamerId').value = streamer.id;
    document.getElementById('streamerId').disabled = true; // Блокуємо поле ID
    
    document.getElementById('displayName').value = streamer.displayName;
    document.getElementById('twitchId').value = streamer.twitchId;
    document.getElementById('streamerClan').value = streamer.clan;
    document.getElementById('description').value = streamer.description;
    
    document.getElementById('youtubeType').value = streamer.youtubeType;
    document.getElementById('youtubeField').value = streamer.youtube === 'none' ? '' : streamer.youtube;
    document.getElementById('telegramUsername').value = streamer.telegram === 'none' ? '' : streamer.telegram;
    
    // Оновлюємо підказку для поля YouTube
    const youtubeField = document.getElementById('youtubeField');
    if (streamer.youtubeType === 'user') {
        youtubeField.placeholder = 'Ім\'я користувача YouTube (без @)';
    } else {
        youtubeField.placeholder = 'ID YouTube каналу (UC...)';
    }
    
    // Змінюємо текст кнопки відправки
    const submitBtn = document.getElementById('submitStreamer');
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Зберегти зміни';
    
    // Показуємо кнопку скасування
    document.getElementById('cancelEdit').style.display = 'inline-flex';
    
    // Прокручуємо до форми
    document.getElementById('addStreamerForm').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

/**
 * Видалення стримера
 */
function deleteStreamer(streamerId) {
    // Запитуємо підтвердження
    if (!confirm(`Ви впевнені, що хочете видалити стримера з ID "${streamerId}"?`)) return;
    
    // Знаходимо індекс стримера
    const index = streamers.findIndex(s => s.id === streamerId);
    if (index === -1) return;
    
    // Зберігаємо ім'я стримера для повідомлення
    const streamerName = streamers[index].displayName;
    
    // Видаляємо стримера з масиву
    streamers.splice(index, 1);
    
    // Зберігаємо зміни
    saveStreamers();
    
    // Показуємо сповіщення про успіх
    showNotification(`Стримера "${streamerName}" успішно видалено!`, 'success');
}

/**
 * Збереження даних стримерів у JSON-файл
 */
function saveStreamers() {
    // Формуємо дані для збереження
    const streamersData = {
        streamers: streamers
    };
    
    // Відправляємо на сервер (тут буде AJAX-запит)
    console.log('Дані стримерів для збереження:', streamersData);
    
    // В реальному додатку тут був би код для відправки даних на сервер
    // Наприклад, використовуючи fetch POST запит
    
    // Для демонстрації ми просто оновимо інтерфейс
    loadStreamersList();
    
    // В реальному додатку код міг би бути таким:
    /*
    fetch('/api/save-streamers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(streamersData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Помилка збереження даних');
        }
        return response.json();
    })
    .then(data => {
        // Оновлюємо інтерфейс
        loadStreamersList();
    })
    .catch(error => {
        console.error('Помилка:', error);
        showNotification('Помилка збереження: ' + error.message, 'error');
    });
    */
}

/**
 * Скидання форми до початкового стану
 */
function resetForm() {
    // Очищаємо форму
    document.getElementById('addStreamerForm').reset();
    
    // Розблоковуємо поле ID
    document.getElementById('streamerId').disabled = false;
    
    // Скидаємо ID стримера, якого редагуємо
    editingStreamerId = null;
    
    // Повертаємо початковий текст кнопки
    const submitBtn = document.getElementById('submitStreamer');
    submitBtn.innerHTML = '<i class="fas fa-plus"></i> Додати стримера';
    
    // Приховуємо кнопку скасування
    document.getElementById('cancelEdit').style.display = 'none';
}

/**
 * Показ сповіщення користувачу
 */
function showNotification(message, type = 'info') {
    // Створюємо елемент сповіщення
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Додаємо іконку залежно від типу
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
        <button class="close-notification">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Додаємо до контейнера сповіщень
    const notificationsContainer = document.getElementById('notificationsContainer');
    if (notificationsContainer) {
        notificationsContainer.appendChild(notification);
        
        // Додаємо обробник для закриття
        notification.querySelector('.close-notification').addEventListener('click', () => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        // Автоматично закриваємо через 5 секунд
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.add('fade-out');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 5000);
    }
}
