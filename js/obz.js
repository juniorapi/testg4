/**
 * Оновлений JavaScript для функціоналу секції ОБЗ
 * З удосконаленим калькулятором та інтерактивним вибором завдань
 */

// Функція ініціалізації ОБЗ секції
function initOBZSection() {
    // Ініціалізація всіх компонентів
    initOBZCampaignSelector();
    initOBZTechSelector();
    initOBZCheckboxes();
    initOBZMissionsInterface();
    updateOBZPrice();
}

// Ініціалізація селектора кампаній ОБЗ
function initOBZCampaignSelector() {
    const campaignOptions = document.querySelectorAll('.difficulty-option[data-difficulty]');
    
    campaignOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Знімаємо виділення з усіх опцій
            campaignOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Встановлюємо виділення на поточній опції
            this.classList.add('selected');
            
            // Оновлюємо інтерфейс завдань і калькулятор
            updateOBZMissionsInterface();
            updateOBZPrice();
            
            // Оновлюємо назву кампанії в калькуляторі
            updateCampaignName();
        });
    });
}

// Ініціалізація селектора класу техніки
function initOBZTechSelector() {
    const techOptions = document.querySelectorAll('.difficulty-option[data-tech]');
    
    techOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Знімаємо виділення з усіх опцій
            techOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Встановлюємо виділення на поточній опції
            this.classList.add('selected');
            
            // Оновлюємо інтерфейс завдань і калькулятор
            updateOBZMissionsInterface();
            updateOBZPrice();
        });
    });
}

// Ініціалізація чекбоксів для додаткових опцій
function initOBZCheckboxes() {
    const checkboxes = document.querySelectorAll('#obz-priority, #obz-night');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Оновлюємо ціну при зміні чекбоксів
            updateOBZPrice();
        });
    });
}

// Оновлення назви кампанії в калькуляторі
function updateCampaignName() {
    const selectedCampaign = document.querySelector('.difficulty-option[data-difficulty].selected').getAttribute('data-difficulty');
    
    // Формуємо словник назв кампаній
    const campaignNames = {
        'stug': 'StuG IV',
        't28': 'T28 HTC',
        't55a': 'T-55A',
        'obj260': 'Об\'єкт 260'
    };
    
    // Оновлюємо відображення назви кампанії у всіх потрібних елементах
    const campaignTitles = document.querySelectorAll('.campaign-name');
    campaignTitles.forEach(element => {
        element.textContent = campaignNames[selectedCampaign];
    });
}
// Ініціалізація інтерфейсу вибору завдань
function initOBZMissionsInterface() {
    // Очищаємо контейнер для завдань
    const missionsContainer = document.getElementById('missions-container');
    if (!missionsContainer) return;
    
    // Створюємо кнопки для швидкого вибору завдань
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'missions-buttons';
    
    // Кнопка "Вибрати всі"
    const selectAllBtn = document.createElement('button');
    selectAllBtn.className = 'btn btn-outline select-all-btn';
    selectAllBtn.textContent = 'Вибрати всі';
    selectAllBtn.addEventListener('click', handleSelectAll);
    
    // Кнопка "Завдання 1-7"
    const selectEasyBtn = document.createElement('button');
    selectEasyBtn.className = 'btn btn-outline select-easy-btn';
    selectEasyBtn.textContent = 'Завдання 1-7';
    selectEasyBtn.addEventListener('click', function() {
        handleSelectGroup('easy');
    });
    
    // Кнопка "Завдання 8-15"
    const selectHardBtn = document.createElement('button');
    selectHardBtn.className = 'btn btn-outline select-hard-btn';
    selectHardBtn.textContent = 'Завдання 8-15';
    selectHardBtn.addEventListener('click', function() {
        handleSelectGroup('hard');
    });
    
    // Кнопка "Очистити вибір"
    const clearAllBtn = document.createElement('button');
    clearAllBtn.className = 'btn btn-outline clear-all-btn';
    clearAllBtn.textContent = 'Очистити вибір';
    clearAllBtn.addEventListener('click', function() {
        document.querySelectorAll('.mission-checkbox').forEach(cb => {
            cb.checked = false;
        });
        updateOBZPrice();
    });
    
    // Додаємо кнопки в контейнер
    buttonsContainer.appendChild(selectAllBtn);
    buttonsContainer.appendChild(selectEasyBtn);
    buttonsContainer.appendChild(selectHardBtn);
    buttonsContainer.appendChild(clearAllBtn);
    
    // Додаємо контейнер з кнопками на сторінку
    missionsContainer.appendChild(buttonsContainer);
    
    // Запускаємо оновлення інтерфейсу завдань
    updateOBZMissionsInterface();
}

// Оновлення інтерфейсу завдань на основі вибраної кампанії і класу техніки
function updateOBZMissionsInterface() {
    const selectedCampaign = document.querySelector('.difficulty-option[data-difficulty].selected').getAttribute('data-difficulty');
    const selectedTech = document.querySelector('.difficulty-option[data-tech].selected').getAttribute('data-tech');
    
    // Отримуємо контейнер для завдань
    const missionsContainer = document.getElementById('missions-container');
    if (!missionsContainer) return;
    
    // Видаляємо існуючий список завдань, якщо він є
    const existingList = document.querySelector('.missions-list');
    if (existingList) {
        existingList.remove();
}
// Ціни для різної кампанії та класу техніки
    const priceTable = {
        'stug': {
            'lt': [
                [25, 0], [25, 0], [25, 0], [25, 0], [25, 0],
                [25, 0], [25, 0], [50, 0], [40, 0], [40, 0],
                [40, 0], [40, 0], [40, 0], [40, 0], [201, 251]
            ],
            'mt': [
                [25, 0], [25, 0], [25, 0], [25, 0], [25, 0],
                [25, 0], [25, 0], [25, 0], [40, 0], [40, 0],
                [40, 0], [55, 0], [40, 0], [40, 0], [201, 251]
            ],
            'ht': [
                [25, 0], [25, 0], [25, 0], [25, 0], [25, 0],
                [25, 0], [25, 0], [25, 0], [25, 0], [25, 0],
                [45, 0], [25, 0], [55, 0], [25, 0], [201, 251]
            ],
            'td': [
                [25, 0], [25, 0], [25, 0], [25, 0], [25, 0],
                [25, 0], [25, 0], [35, 0], [35, 0], [35, 0],
                [35, 0], [35, 0], [35, 0], [35, 0], [251, 301]
            ],
            'spg': [
                [35, 0], [35, 0], [35, 0], [35, 0], [35, 0],
                [35, 0], [35, 0], [35, 0], [35, 0], [35, 0],
                [35, 0], [35, 0], [35, 0], [35, 0], [251, 301]
            ]
        },
        't28': {
            'lt': [
                [40, 0], [40, 0], [40, 0], [40, 0], [40, 0],
                [40, 0], [40, 0], [60, 0], [50, 0], [50, 0],
                [50, 0], [50, 0], [50, 0], [50, 0], [251, 301]
            ],
            'mt': [
                [40, 0], [40, 0], [40, 0], [40, 0], [40, 0],
                [40, 0], [40, 0], [40, 0], [50, 0], [50, 0],
                [50, 0], [65, 0], [50, 0], [50, 0], [251, 301]
            ],
            'ht': [
                [40, 0], [40, 0], [40, 0], [40, 0], [40, 0],
                [40, 0], [40, 0], [40, 0], [40, 0], [40, 0],
                [60, 0], [40, 0], [65, 0], [40, 0], [251, 301]
            ],
            'td': [
                [40, 0], [40, 0], [40, 0], [40, 0], [40, 0],
                [40, 0], [40, 0], [50, 0], [50, 0], [50, 0],
                [50, 0], [50, 0], [50, 0], [50, 0], [301, 352]
            ],
            'spg': [
                [50, 0], [50, 0], [50, 0], [50, 0], [50, 0],
                [50, 0], [50, 0], [50, 0], [50, 0], [50, 0],
                [50, 0], [50, 0], [50, 0], [50, 0], [301, 352]
            ]
        },
        't55a': {
            'lt': [
                [60, 0], [60, 0], [60, 0], [60, 0], [60, 0],
                [60, 0], [60, 0], [75, 0], [70, 0], [70, 0],
                [70, 0], [70, 0], [70, 0], [70, 0], [327, 402]
            ],
            'mt': [
                [60, 0], [60, 0], [60, 0], [60, 0], [60, 0],
                [60, 0], [60, 0], [60, 0], [70, 0], [70, 0],
                [70, 0], [85, 0], [70, 0], [70, 0], [327, 402]
            ],
            'ht': [
                [60, 0], [60, 0], [60, 0], [60, 0], [60, 0],
                [60, 0], [60, 0], [60, 0], [60, 0], [60, 0],
                [80, 0], [60, 0], [85, 0], [60, 0], [327, 402]
            ],
            'td': [
                [60, 0], [60, 0], [60, 0], [60, 0], [60, 0],
                [60, 0], [60, 0], [70, 0], [70, 0], [70, 0],
                [70, 0], [70, 0], [70, 0], [70, 0], [352, 427]
            ],
            'spg': [
                [70, 0], [70, 0], [70, 0], [70, 0], [70, 0],
                [70, 0], [70, 0], [70, 0], [70, 0], [70, 0],
                [70, 0], [70, 0], [70, 0], [70, 0], [352, 427]
            ]
        },
        'obj260': {
            'lt': [
                [90, 0], [90, 0], [90, 0], [90, 0], [90, 0],
                [90, 0], [90, 0], [110, 0], [100, 0], [100, 0],
                [100, 0], [100, 0], [100, 0], [100, 0], [402, 502]
            ],
            'mt': [
                [90, 0], [90, 0], [90, 0], [90, 0], [90, 0],
                [90, 0], [90, 0], [90, 0], [100, 0], [100, 0],
                [100, 0], [125, 0], [100, 0], [100, 0], [402, 502]
            ],
            'ht': [
                [90, 0], [90, 0], [90, 0], [90, 0], [90, 0],
                [90, 0], [90, 0], [90, 0], [90, 0], [90, 0],
                [125, 0], [90, 0], [125, 0], [90, 0], [402, 502]
            ],
            'td': [
                [90, 0], [90, 0], [90, 0], [90, 0], [90, 0],
                [90, 0], [90, 0], [100, 0], [100, 0], [100, 0],
                [100, 0], [100, 0], [100, 0], [100, 0], [452, 552]
            ],
            'spg': [
                [100, 0], [100, 0], [100, 0], [100, 0], [100, 0],
                [100, 0], [100, 0], [100, 0], [100, 0], [100, 0],
                [100, 0], [100, 0], [100, 0], [100, 0], [452, 552]
            ]
        }
    };
// Створюємо список завдань
    const missionsList = document.createElement('div');
    missionsList.className = 'missions-list';
    
    // Створюємо завдання
    for (let i = 0; i < 15; i++) {
        const missionItem = document.createElement('div');
        missionItem.className = 'mission-item';
        
        // Номер завдання
        const missionNumber = document.createElement('div');
        missionNumber.className = 'mission-number';
        missionNumber.textContent = i + 1;
        
        // Чекбокс для вибору завдання
        const missionCheckbox = document.createElement('input');
        missionCheckbox.type = 'checkbox';
        missionCheckbox.className = 'mission-checkbox';
        missionCheckbox.dataset.missionIndex = i;
        missionCheckbox.addEventListener('change', updateOBZPrice);
        
        // Ціна завдання
        const missionPrice = document.createElement('div');
        missionPrice.className = 'mission-price';
        missionPrice.textContent = priceTable[selectedCampaign][selectedTech][i][0] + '₴';
        
        // Додаємо елементи в картку завдання
        missionItem.appendChild(missionCheckbox);
        missionItem.appendChild(missionNumber);
        missionItem.appendChild(missionPrice);
        
        // Додаємо особливі елементи для 15-го завдання (відзнака)
        if (i === 14) {
            const excellentLabel = document.createElement('label');
            excellentLabel.className = 'excellent-label';
            
            const excellentCheckbox = document.createElement('input');
            excellentCheckbox.type = 'checkbox';
            excellentCheckbox.id = 'mission-excellent';
            excellentCheckbox.className = 'excellent-checkbox';
            excellentCheckbox.addEventListener('change', updateOBZPrice);
            
            const excellentText = document.createElement('span');
            excellentText.textContent = 'З відзнакою +' + (priceTable[selectedCampaign][selectedTech][i][1] - priceTable[selectedCampaign][selectedTech][i][0]) + '₴';
            
            excellentLabel.appendChild(excellentCheckbox);
            excellentLabel.appendChild(excellentText);
            
            missionItem.appendChild(excellentLabel);
        }
        
        // Додаємо в список
        missionsList.appendChild(missionItem);
    }
    
    // Додаємо список завдань в контейнер
    missionsContainer.appendChild(missionsList);
    
    // Додаємо обробники для кліку по всій картці
    document.querySelectorAll('.mission-item').forEach(item => {
        item.addEventListener('click', function(e) {
            // Якщо клік не по чекбоксу, переключаємо стан чекбоксу
            if (!e.target.classList.contains('mission-checkbox') && 
                !e.target.classList.contains('excellent-checkbox')) {
                const checkbox = this.querySelector('.mission-checkbox');
                checkbox.checked = !checkbox.checked;
                updateOBZPrice();
            }
        });
    });
}

// Обробник для кнопки "Вибрати всі"
function handleSelectAll() {
    const checkboxes = document.querySelectorAll('.mission-checkbox');
    // Перевіряємо, чи всі чекбокси вже вибрані
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    
    // Встановлюємо стан всіх чекбоксів
    checkboxes.forEach(cb => {
        cb.checked = !allChecked;
    });
    
    // Оновлюємо ціну
    updateOBZPrice();
}

// Обробник для кнопок вибору груп завдань
function handleSelectGroup(group) {
    const checkboxes = document.querySelectorAll('.mission-checkbox');
    
    if (group === 'easy') {
        // Завдання 1-7 (індекси 0-6)
        const allEasySelected = Array.from(checkboxes)
            .filter((_, index) => index < 7)
            .every(cb => cb.checked);
        
        // Встановлюємо стан чекбоксів для легких завдань
        checkboxes.forEach((cb, index) => {
            if (index < 7) {
                cb.checked = !allEasySelected;
            }
        });
    } else if (group === 'hard') {
        // Завдання 8-15 (індекси 7-14)
        const allHardSelected = Array.from(checkboxes)
            .filter((_, index) => index >= 7)
            .every(cb => cb.checked);
        
        // Встановлюємо стан чекбоксів для складних завдань
        checkboxes.forEach((cb, index) => {
            if (index >= 7) {
                cb.checked = !allHardSelected;
            }
        });
    }
    
    // Оновлюємо ціну
    updateOBZPrice();
}
// Оновлення відображення вартості в калькуляторі
function updateOBZPrice() {
    const selectedCampaign = document.querySelector('.difficulty-option[data-difficulty].selected').getAttribute('data-difficulty');
    const selectedTech = document.querySelector('.difficulty-option[data-tech].selected').getAttribute('data-tech');
    const priorityCheckbox = document.getElementById('obz-priority');
    const nightCheckbox = document.getElementById('obz-night');
    
    // Ціни для різних кампаній в гривнях
    const campaignPrices = {
        'stug': { full: 1508, all: 14073 },
        't28': { full: 2513, all: 14073 },
        't55a': { full: 4021, all: 14073 },
        'obj260': { full: 6031, all: 14073 }
    };
    
    // Отримуємо вибрані завдання
    const selectedMissions = Array.from(document.querySelectorAll('.mission-checkbox:checked')).map(cb => 
        parseInt(cb.dataset.missionIndex, 10)
    );
    
    // Тотальні ціни для класів техніки
    const totalPrices = {
        'stug': {
            'lt': 477, 'mt': 452, 'ht': 452, 'td': 477, 'spg': 578
        },
        't28': {
            'lt': 603, 'mt': 578, 'ht': 578, 'td': 603, 'spg': 703
        },
        't55a': {
            'lt': 854, 'mt': 829, 'ht': 829, 'td': 854, 'spg': 954
        },
        'obj260': {
            'lt': 1206, 'mt': 1181, 'ht': 1181, 'td': 1206, 'spg': 1306
        }
    };
    
    // Рахуємо вартість вибраних завдань
    let totalPrice = 0;
    
    // Якщо є вибрані завдання, сумуємо їх вартість
    if (selectedMissions.length > 0) {
        for (const missionIndex of selectedMissions) {
            // Перевіряємо, чи це останнє завдання (15-те) і чи є активний чекбокс для виконання з відзнакою
            if (missionIndex === 14) {
                const excellentCheckbox = document.getElementById('mission-excellent');
                if (excellentCheckbox && excellentCheckbox.checked) {
                    // Ціна для завдання з відзнакою
                    totalPrice += priceTable[selectedCampaign][selectedTech][missionIndex][1];
                } else {
                    // Звичайна ціна
                    totalPrice += priceTable[selectedCampaign][selectedTech][missionIndex][0];
                }
            } else {
                // Для всіх інших завдань - звичайна ціна
                totalPrice += priceTable[selectedCampaign][selectedTech][missionIndex][0];
            }
        }
    } else {
        // Якщо немає вибраних завдань, показуємо повну вартість класу техніки
        totalPrice = totalPrices[selectedCampaign][selectedTech]; 
    }
    
    // Застосовуємо множники для додаткових опцій
    if (priorityCheckbox && priorityCheckbox.checked) {
        totalPrice *= 1.25; // +25% за пріоритетне виконання
    }
    
    if (nightCheckbox && nightCheckbox.checked) {
        totalPrice *= 1.4; // +40% за нічне виконання
    }
    
    // Оновлюємо відображення ціни для вибраних завдань
    const taskPrice = document.getElementById('task-price');
    if (taskPrice) {
        taskPrice.innerHTML = `${Math.round(totalPrice)}<span class="currency">₴</span>`;
    }
    
    // Оновлюємо ціни для кампаній
    // Ціна за всю поточну кампанію
    let campaignPrice = campaignPrices[selectedCampaign].full;
    
    // Застосовуємо множники для додаткових опцій до ціни за кампанію
    if (priorityCheckbox && priorityCheckbox.checked) {
        campaignPrice *= 1.25;
    }
    
    if (nightCheckbox && nightCheckbox.checked) {
        campaignPrice *= 1.4;
    }
    
    // Ціна за всі кампанії
    let allCampaignsPrice = campaignPrices[selectedCampaign].all;
    
    // Застосовуємо множники для додаткових опцій до ціни за всі кампанії
    if (priorityCheckbox && priorityCheckbox.checked) {
        allCampaignsPrice *= 1.25;
    }
    
    if (nightCheckbox && nightCheckbox.checked) {
        allCampaignsPrice *= 1.4;
    }
    
    // Оновлюємо ціни в відповідних елементах
    const campaignPriceElement = document.getElementById('campaign-price');
    if (campaignPriceElement) {
        campaignPriceElement.innerHTML = `${Math.round(campaignPrice)}<span class="currency">₴</span>`;
    }
    
    const allCampaignsPriceElement = document.getElementById('all-campaigns-price');
    if (allCampaignsPriceElement) {
        allCampaignsPriceElement.innerHTML = `${Math.round(allCampaignsPrice)}<span class="currency">₴</span>`;
    }
}

// Запускаємо ініціалізацію секції ОБЗ після завантаження DOM
document.addEventListener('DOMContentLoaded', function() {
    // Перевіряємо, чи існує секція ОБЗ на сторінці
    if (document.getElementById('obz')) {
        initOBZSection();
    }
});
	