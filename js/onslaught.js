/**
 * JavaScript для функціоналу секції "Натиск" (Onslaught)
 * Забезпечує інтерактивність калькулятора вартості та інших елементів
 */

document.addEventListener('DOMContentLoaded', function() {
    // Перевіряємо, чи існує секція "Натиск" на сторінці
    if (document.getElementById('onslaught')) {
        initOnslaughtSection();
    } else {
        console.log("Секція Натиск не знайдена на сторінці.");
    }
});

/**
 * Ініціалізація секції "Натиск"
 */
function initOnslaughtSection() {
    console.log("Ініціалізація секції Натиск");
    initRankSelector();
    initCheckboxOptions();
    updateOnslaughtPrice();
}

/**
 * Ініціалізація селектора рангів
 */
function initRankSelector() {
    const rankOptions = document.querySelectorAll('.difficulty-option[data-rank]');
    
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
    const checkboxes = document.querySelectorAll('#weekly-missions, #priority-execution, #silver-farming');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateOnslaughtPrice);
    });
}

/**
 * Оновлення відображення вартості в калькуляторі
 */
function updateOnslaughtPrice() {
    // Отримуємо поточні налаштування
    const selectedRank = document.querySelector('.difficulty-option[data-rank].selected').getAttribute('data-rank');
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
    }
}

/**
 * Додавання обробника події для секції в головному файлі
 */
if (typeof window.servicesInitializers === 'undefined') {
    window.servicesInitializers = [];
}

window.servicesInitializers.push({
    tabId: 'onslaught',
    initializer: initOnslaughtSection
});