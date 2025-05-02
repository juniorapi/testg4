/**
 * Оновлений JavaScript для функціоналу секції ОБЗ
 * З удосконаленим калькулятором та інтерактивним вибором завдань
 */

// Глобальні змінні для кешування часто використовуваних даних
let cachedCampaignPrices = {
    'stug': { full: 1508, all: 14073 },
    't28': { full: 2513, all: 14073 },
    't55a': { full: 4021, all: 14073 },
    'obj260': { full: 6031, all: 14073 }
};

let cachedTotalPrices = {
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

// Функція ініціалізації ОБЗ секції
function initOBZSection() {
    console.log("Ініціалізація ОБЗ секції");
    initOBZSelectors();
    initOBZCheckboxes();
    initOBZMissionsInterface();
    updateOBZPrice();
}

// Ініціалізація селекторів кампаній і класу техніки
function initOBZSelectors() {
    const campaignOptions = document.querySelectorAll('.option-item[data-difficulty]');
    
    campaignOptions.forEach(option => {
        option.addEventListener('click', function() {
            campaignOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            
            updateOBZMissionsInterface();
            updateOBZPrice();
            updateCampaignName();
        });
    });
    
    const techOptions = document.querySelectorAll('.option-item[data-tech]');
    
    techOptions.forEach(option => {
        option.addEventListener('click', function() {
            techOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            
            updateOBZMissionsInterface();
            updateOBZPrice();
        });
    });
}

// Ініціалізація чекбоксів для додаткових опцій
function initOBZCheckboxes() {
    const checkboxes = document.querySelectorAll('#obz-priority, #obz-night');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateOBZPrice);
    });
}

// Оновлення назви кампанії в калькуляторі
function updateCampaignName() {
    const selectedCampaign = document.querySelector('.option-item[data-difficulty].selected').getAttribute('data-difficulty');
    
    const campaignNames = {
        'stug': 'StuG IV',
        't28': 'T28 HTC',
        't55a': 'T-55A',
        'obj260': 'Об\'єкт 260'
    };
    
    const campaignTitles = document.querySelectorAll('.campaign-name');
    campaignTitles.forEach(element => {
        element.textContent = campaignNames[selectedCampaign];
    });
}

// Ініціалізація інтерфейсу вибору завдань
function initOBZMissionsInterface() {
    const missionsContainer = document.getElementById('missions-container');
    
    if (!missionsContainer) {
        console.error("Помилка: Контейнер для завдань не знайдено!");
        return;
    }
    
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
    selectEasyBtn.addEventListener('click', () => handleSelectGroup('easy'));
    
    // Кнопка "Завдання 8-15"
    const selectHardBtn = document.createElement('button');
    selectHardBtn.className = 'btn btn-outline select-hard-btn';
    selectHardBtn.textContent = 'Завдання 8-15';
    selectHardBtn.addEventListener('click', () => handleSelectGroup('hard'));
    
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
    buttonsContainer.append(selectAllBtn, selectEasyBtn, selectHardBtn, clearAllBtn);
    
    // Додаємо контейнер з кнопками на сторінку
    missionsContainer.appendChild(buttonsContainer);
    
    // Запускаємо оновлення інтерфейсу завдань
    updateOBZMissionsInterface();
}

// Оновлення інтерфейсу завдань на основі вибраної кампанії і класу техніки
function updateOBZMissionsInterface() {
    const selectedCampaign = document.querySelector('.option-item[data-difficulty].selected').getAttribute('data-difficulty');
    const selectedTech = document.querySelector('.option-item[data-tech].selected').getAttribute('data-tech');
    
    // Отримуємо контейнер для завдань
    const missionsContainer = document.getElementById('missions-container');
    if (!missionsContainer) {
        console.error("Помилка: Контейнер для завдань не знайдено при оновленні!");
        return;
    }
    
    // Видаляємо існуючий список завдань, якщо він є
    const existingList = document.querySelector('.missions-list');
    if (existingList) {
        existingList.remove();
    }
    
    // Встановлюємо відзнаку для 15-го завдання, якщо не встановлено
    for (let i = 0; i < priceTable[selectedCampaign][selectedTech].length; i++) {
        if (priceTable[selectedCampaign][selectedTech][i][1] === 0 && i === 14) {
            priceTable[selectedCampaign][selectedTech][i][1] = Math.round(priceTable[selectedCampaign][selectedTech][i][0] * 1.25);
        }
    }
    
    // Створюємо список завдань
    const missionsList = document.createElement('div');
    missionsList.className = 'missions-list';
    
    // Створюємо завдання
    for (let i = 0; i < 15; i++) {
        const missionItem = document.createElement('div');
        missionItem.className = 'mission-item';
        
        // Чекбокс для вибору завдання
        const missionCheckbox = document.createElement('input');
        missionCheckbox.type = 'checkbox';
        missionCheckbox.className = 'mission-checkbox';
        missionCheckbox.dataset.missionIndex = i;
        missionCheckbox.addEventListener('change', updateOBZPrice);
        
        // Номер завдання
        const missionNumber = document.createElement('div');
        missionNumber.className = 'mission-number';
        missionNumber.textContent = i + 1;
        
        // Ціна завдання
        const missionPrice = document.createElement('div');
        missionPrice.className = 'mission-price';
        missionPrice.textContent = priceTable[selectedCampaign][selectedTech][i][0] + '₴';
        
        // Додаємо елементи в картку завдання
        missionItem.append(missionCheckbox, missionNumber, missionPrice);
        
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
            
            excellentLabel.append(excellentCheckbox, excellentText);
            
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
    // Отримуємо поточні налаштування
    const selectedCampaign = document.querySelector('.option-item[data-difficulty].selected').getAttribute('data-difficulty');
    const selectedTech = document.querySelector('.option-item[data-tech].selected').getAttribute('data-tech');
    const priorityCheckbox = document.getElementById('obz-priority');
    const nightCheckbox = document.getElementById('obz-night');
    
    // Отримуємо всі відмічені чекбокси завдань
    const checkboxes = document.querySelectorAll('.mission-checkbox');
    const selectedMissions = [];
    
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedMissions.push(parseInt(checkbox.dataset.missionIndex, 10));
        }
    });
    
    // Рахуємо вартість вибраних завдань
    let totalPrice = 0;
    
    // Якщо є вибрані завдання, сумуємо їх вартість
    if (selectedMissions.length > 0) {
        selectedMissions.forEach(missionIndex => {
            // Перевіряємо, чи це останнє завдання (15-те) і чи є активний чекбокс для відзнаки
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
        });
    }
    
    // Застосовуємо множники для додаткових опцій
    let finalTotalPrice = totalPrice;
    
    if (priorityCheckbox?.checked) {
        finalTotalPrice *= 1.25; // +25% за пріоритетне виконання
    }
    
    if (nightCheckbox?.checked) {
        finalTotalPrice *= 1.4; // +40% за нічне виконання
    }
    
    // Оновлюємо відображення ціни для вибраних завдань
    const taskPrice = document.getElementById('task-price');
    if (taskPrice) {
        taskPrice.innerHTML = `${selectedMissions.length > 0 ? Math.round(finalTotalPrice) : 0}<span class="currency">₴</span>`;
    }
    
    // Оновлюємо назву техніки
    const techNames = {
        'lt': 'ЛТ', 'mt': 'СТ', 'ht': 'ВТ', 'td': 'ПТ-САУ', 'spg': 'САУ'
    };
    
    document.querySelectorAll('.tech-name').forEach(element => {
        element.textContent = techNames[selectedTech];
    });
    
    // Вартість повного набору класу техніки
    let fullTechPrice = cachedTotalPrices[selectedCampaign][selectedTech];
    let finalFullTechPrice = fullTechPrice;
    
    // Ціна за всю поточну кампанію
    let campaignPrice = cachedCampaignPrices[selectedCampaign].full;
    
    // Ціна за всі кампанії
    let allCampaignsPrice = cachedCampaignPrices[selectedCampaign].all;
    
    // Застосовуємо множники для додаткових опцій
    if (priorityCheckbox?.checked) {
        finalFullTechPrice *= 1.25;
        campaignPrice *= 1.25;
        allCampaignsPrice *= 1.25;
    }
    
    if (nightCheckbox?.checked) {
        finalFullTechPrice *= 1.4;
        campaignPrice *= 1.4;
        allCampaignsPrice *= 1.4;
    }
    
    // Оновлюємо ціни в відповідних елементах
    const fullTechPriceElement = document.getElementById('full-tech-price');
    if (fullTechPriceElement) {
        fullTechPriceElement.innerHTML = `${Math.round(finalFullTechPrice)}<span class="currency">₴</span>`;
    }
    
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
    } else {
        console.error("Секція OBZ не знайдена на сторінці!");
    }
});