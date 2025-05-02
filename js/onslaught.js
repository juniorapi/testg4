/**
 * JavaScript для функціоналу секції "Натиск" (Onslaught)
 * Забезпечує інтерактивність калькулятора вартості та інших елементів
 */

document.addEventListener('DOMContentLoaded', function() {
    // Ініціалізація реєстрації таба
    registerOnslaughtTab();
});

/**
 * Реєстрація ініціалізатора для таба Натиск
 */
function registerOnslaughtTab() {
    // Створюємо глобальний масив для ініціалізаторів, якщо він не існує
    if (typeof window.servicesInitializers === 'undefined') {
        window.servicesInitializers = [];
    }
    
    // Додаємо ініціалізатор для таба "onslaught"
    window.servicesInitializers.push({
        tabId: 'onslaught',
        initializer: initOnslaughtSection
    });
    
    // Перевіряємо, чи активний зараз таб "onslaught"
    const onslaughtTab = document.querySelector('.service-tab[data-tab="onslaught"]');
    const isOnslaughtActive = onslaughtTab && onslaughtTab.classList.contains('active');
    
    // Якщо таб "onslaught" зараз активний, ініціалізуємо його
    if (isOnslaughtActive) {
        initOnslaughtSection();
    }
}

/**
 * Ініціалізація секції "Натиск"
 */
function initOnslaughtSection() {
    console.log("Ініціалізація секції Натиск");
    const onslaughtSection = document.getElementById('onslaught');
    
    if (!onslaughtSection) {
        console.log("Секція Натиск не знайдена на сторінці.");
        return;
    }
    
    initRankSelector();
    initCheckboxOptions();
    updateOnslaughtPrice();
}

/**
 * Ініціалізація селектора рангів
 */
function initRankSelector() {
    const rankOptions = document.querySelectorAll('#onslaught .difficulty-option[data-rank]');
    
    if (rankOptions.length === 0) {
        console.log("Селектор рангів не знайдений");
        return;
    }
    
    rankOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Знімаємо виділення з усіх опцій
            rankOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Встановлюємо виділення на поточній опції
            this.classList.add('selected');
            
            // Оновлюємо вартість
            updateOnslaughtPrice();
        });
    });
}

/**
 * Ініціалізація чекбоксів для додаткових опцій
 */
function initCheckboxOptions() {
    const checkboxes = document.querySelectorAll('#onslaught #weekly-missions, #onslaught #priority-execution, #onslaught #silver-farming');
    
    checkboxes.forEach(checkbox => {
        if (checkbox) {
            checkbox.addEventListener('change', updateOnslaughtPrice);
        }
    });
}

/**
 * Оновлення відображення вартості в калькуляторі
 */
function updateOnslaughtPrice() {
    // Отримуємо поточні налаштування
    const selectedRankEl = document.querySelector('#onslaught .difficulty-option[data-rank].selected');
    
    if (!selectedRankEl) {
        console.log("Не знайдено вибраний ранг");
        return;
    }
    
    const selectedRank = selectedRankEl.getAttribute('data-rank');
    const weeklyMissionsCheckbox = document.getElementById('weekly-missions');
    const priorityExecutionCheckbox = document.getElementById('priority-execution');
    const silverFarmingCheckbox = document.getElementById('silver-farming');
    
    // Встановлюємо базову ціну залежно від обраного рангу
    let basePrice = 0;
    
    switch (selectedRank) {
        case 'silver':
            basePrice = 800;
            break;
        case 'gold':
            basePrice = 1500;
            break;
        case 'champion':
            basePrice = 3000;
            break;
        case 'legend':
            basePrice = 5000;
            break;
        default:
            basePrice = 800;
    }
    
    // Застосовуємо множники для додаткових опцій
    let finalPrice = basePrice;
    
    if (weeklyMissionsCheckbox && weeklyMissionsCheckbox.checked) {
        finalPrice *= 1.2; // +20% за виконання щотижневих місій
    }
    
    if (priorityExecutionCheckbox && priorityExecutionCheckbox.checked) {
        finalPrice *= 1.3; // +30% за першочергове виконання
    }
    
    if (silverFarmingCheckbox && silverFarmingCheckbox.checked) {
        finalPrice += 500; // +500₴ за фарм срібла (5M кредитів)
    }
    
    // Оновлюємо відображення ціни
    const resultPrice = document.querySelector('#onslaught-calculator .result-price');
    if (resultPrice) {
        resultPrice.innerHTML = `${Math.round(finalPrice)}<span class="currency">₴</span>`;
    } else {
        console.log("Елемент для відображення ціни не знайдено");
    }
}