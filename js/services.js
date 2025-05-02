/**
 * JavaScript для сторінки послуг G_UA Alliance з підтримкою вибору складності танка
 */

document.addEventListener('DOMContentLoaded', function() {
    // Ініціалізація всіх функцій для сторінки послуг
    initTabs();
    initFAQAccordion();
    initRangeSlider();
    initTankSelector();
    initDifficultySelector();
    initCheckboxes();
    initPricingCalculator();
    
    // Явно ініціалізуємо секцію Натиск, якщо функція доступна
    if (typeof initOnslaughtSection === 'function') {
        initOnslaughtSection();
    }
    
    // Або перевіряємо хеш і ініціалізуємо відповідну секцію
    const hash = window.location.hash.substring(1);
    if (hash === 'onslaught' && typeof initOnslaughtSection === 'function') {
        setTimeout(initOnslaughtSection, 200); // Невелика затримка
    }
});
/**
 * Ініціалізація вкладок послуг
 */
function initTabs() {
    const tabs = document.querySelectorAll('.service-tab');
    const tabContents = document.querySelectorAll('.service-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Видаляємо активний клас з усіх вкладок
            tabs.forEach(t => t.classList.remove('active'));
            
            // Додаємо активний клас до поточної вкладки
            this.classList.add('active');
            
            // Отримуємо ID контенту, який потрібно показати
            const targetId = this.getAttribute('data-tab');
            
            // Ховаємо всі контенти
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Показуємо цільовий контент
            document.getElementById(targetId).classList.add('active');
            
            // Оновлюємо URL з хеш-параметром
            window.location.hash = targetId;
        });
    });
    
    // Перевіряємо хеш-параметр при завантаженні сторінки
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        const activeTab = document.querySelector(`.service-tab[data-tab="${hash}"]`);
        if (activeTab) {
            // Імітуємо клік по вкладці, якщо вона існує
            activeTab.click();
        }
    }
}

/**
 * Ініціалізація акордеонів FAQ
 */
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Закриваємо всі активні елементи
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // Якщо елемент не був активним, відкриваємо його
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/**
 * Ініціалізація слайдера відсотка відзнак
 */
function initRangeSlider() {
    const marksRange = document.getElementById('marksRange');
    if (marksRange) {
        const currentMarkSpan = document.getElementById('currentMark');
        const targetMarkSpan = document.getElementById('targetMark');
        
        // Встановлюємо максимум і мінімум для повзунка
        marksRange.min = 0;
        marksRange.max = 100;
        
        // Початкове значення встановлюємо на 0
        marksRange.value = 0;
        
        // Функція для отримання значення відзнаки відповідно до позиції повзунка
        function getMarkPercentage(sliderValue) {
            const numValue = parseInt(sliderValue, 10);
            
            // Для точного розташування повзунка
            if (numValue < 10) return 0;
            if (numValue < 35) return 65;
            if (numValue < 65) return 85;
            if (numValue <= 100) return 95;
            
            return 0; // За замовчуванням
        }
        
        // Функція для оновлення позиції повзунка до найближчої відзнаки
        function updateSliderPosition(percentage) {
            // Знаходимо відповідну позицію для повзунка
            let sliderPosition;
            if (percentage === 0) sliderPosition = 0;
            else if (percentage === 65) sliderPosition = 25;
            else if (percentage === 85) sliderPosition = 50;
            else if (percentage === 95) sliderPosition = 80;
            else sliderPosition = 0;
            
            // Встановлюємо позицію повзунка
            marksRange.value = sliderPosition;
            
            // Оновлюємо відображувані значення
            updateDisplayedValues(percentage);
        }
        
        // Функція оновлення відображуваних значень
        function updateDisplayedValues(percentage) {
            let markName = '';
            
            if (percentage === 0) markName = '0 відзнак';
            else if (percentage === 65) markName = '1 відзнака';
            else if (percentage === 85) markName = '2 відзнаки';
            else if (percentage === 95) markName = '3 відзнаки';
            
            // Оновлюємо текстове відображення
            currentMarkSpan.textContent = '0%';
            targetMarkSpan.textContent = percentage + '%';
            
            // Оновлюємо калькулятор
            updateCalculator(percentage);
        }
        
        // Встановлюємо початкові значення
        updateSliderPosition(0);
        
        // Слухаємо подію введення (під час руху повзунка)
        marksRange.addEventListener('input', function() {
            const markPercentage = getMarkPercentage(this.value);
            updateDisplayedValues(markPercentage);
        });
        
        // Слухаємо подію зміни (після відпускання повзунка)
        marksRange.addEventListener('change', function() {
            const markPercentage = getMarkPercentage(this.value);
            updateSliderPosition(markPercentage);
        });
        
        // Додаємо слухачів подій для клікабельних відзначок
        document.querySelectorAll('.range-mark').forEach(mark => {
            mark.addEventListener('click', function() {
                const percentage = parseInt(this.textContent.replace('%', ''), 10);
                updateSliderPosition(percentage);
            });
        });
    }
}

/**
 * Ініціалізація вибору танка
 */
function initTankSelector() {
    const tankOptions = document.querySelectorAll('.tank-option');
    
    tankOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Знімаємо виділення з усіх опцій
            tankOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Встановлюємо виділення на поточній опції
            this.classList.add('selected');
            
            // Оновлюємо значення в калькуляторі
            updateCalculator();
        });
    });
}

/**
 * Ініціалізація селектора складності
 */
function initDifficultySelector() {
    const difficultyOptions = document.querySelectorAll('.difficulty-option');
    
    difficultyOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Знімаємо виділення з усіх опцій
            difficultyOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Встановлюємо виділення на поточній опції
            this.classList.add('selected');
            
            // Оновлюємо калькулятор
            updateCalculator();
        });
    });
}

/**
 * Ініціалізація чекбоксів додаткових опцій
 */
function initCheckboxes() {
    const checkboxes = document.querySelectorAll('.checkbox-input');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Оновлюємо значення в калькуляторі при зміні чекбокса
            updateCalculator();
        });
    });
}

/**
 * Ініціалізація калькулятора вартості
 */
function initPricingCalculator() {
    // При першому завантаженні ініціалізуємо калькулятор
    updateCalculator();
}

/**
 * Оновлення калькулятора вартості
 * @param {number} [targetPercent] - Цільовий відсоток відзнаки (якщо передано)
 */
function updateCalculator(targetPercent) {
    // Отримуємо всі необхідні елементи
    const selectedTank = document.querySelector('.tank-option.selected');
    const selectedDifficulty = document.querySelector('.difficulty-option.selected');
    const marksRange = document.getElementById('marksRange');
    const win60Checkbox = document.getElementById('wins60');
    const streamCheckbox = document.getElementById('stream');
    const fastExecCheckbox = document.getElementById('fastexec');
    
    // Отримуємо елементи для відображення значень
    const tankTypeValue = document.querySelector('.calc-option:nth-child(1) .calc-value');
    const difficultyValue = document.querySelector('.calc-option:nth-child(2) .calc-value');
    const currentMarkValue = document.querySelector('.calc-option:nth-child(3) .calc-value');
    const targetMarkValue = document.querySelector('.calc-option:nth-child(4) .calc-value');
    const winsValue = document.querySelector('.calc-option:nth-child(5) .calc-value');
    const streamValue = document.querySelector('.calc-option:nth-child(6) .calc-value');
    const timeframeValue = document.querySelector('.calc-option:nth-child(7) .calc-value');
    const resultPrice = document.querySelector('.result-price');
    
    // Не продовжуємо, якщо якийсь із необхідних елементів відсутній
    if (!selectedTank || !selectedDifficulty || !marksRange || !tankTypeValue || !resultPrice) {
        return;
    }
    
    // Отримуємо рівень танка
    const tankLevel = selectedTank.getAttribute('data-level');
    
    // Отримуємо складність танка
    const tankDifficulty = selectedDifficulty.getAttribute('data-difficulty');
    
    // Визначаємо цільовий відсоток відзнак
    let targetMarkPercent = targetPercent;
    
    if (targetMarkPercent === undefined) {
        // Визначаємо відсоток на основі положення повзунка
        const sliderValue = parseInt(marksRange.value, 10);
        if (sliderValue < 10) targetMarkPercent = 0;
        else if (sliderValue < 35) targetMarkPercent = 65;
        else if (sliderValue < 65) targetMarkPercent = 85;
        else targetMarkPercent = 95;
    }
    
    // Визначаємо назву відмітки
    let markName = '';
    if (targetMarkPercent === 0) markName = '0 відзнак';
    else if (targetMarkPercent === 65) markName = '1 відзнака';
    else if (targetMarkPercent === 85) markName = '2 відзнаки';
    else if (targetMarkPercent === 95) markName = '3 відзнаки';
    
    // Оновлюємо відображення значень у калькуляторі
    tankTypeValue.textContent = tankLevel ? `${tankLevel} рівня` : 'Не вибрано';
    difficultyValue.textContent = tankDifficulty === 'easy' ? 'Легкий' : 
                               tankDifficulty === 'medium' ? 'Середній' : 'Складний';
    currentMarkValue.textContent = '0%';
    targetMarkValue.textContent = `${targetMarkPercent}% (${markName})`;
    winsValue.textContent = win60Checkbox && win60Checkbox.checked ? 'Так' : 'Ні';
    streamValue.textContent = streamCheckbox && streamCheckbox.checked ? 'Так' : 'Ні';
    
    // Встановлюємо термін виконання залежно від цільової відзнаки
    if (targetMarkPercent === 65) {
        timeframeValue.textContent = '1-3 дні';
    } else if (targetMarkPercent === 85) {
        timeframeValue.textContent = '3-5 днів';
    } else if (targetMarkPercent === 95) {
        timeframeValue.textContent = '5-10 днів';
    } else {
        timeframeValue.textContent = 'Потрібне замовлення';
    }
    
    // Розраховуємо базову ціну
    let basePrice = calculateBasePrice(tankLevel, targetMarkPercent, tankDifficulty);
    
    // Додаємо вартість додаткових опцій
    if (win60Checkbox && win60Checkbox.checked) {
        basePrice *= 1.2; // +20% за гарантію перемог
    }
    
    if (streamCheckbox && streamCheckbox.checked) {
        basePrice += 500; // +500₴ за стрім процесу
    }
    
    if (fastExecCheckbox && fastExecCheckbox.checked) {
        basePrice *= 1.3; // +30% за пріоритетне виконання
    }
    
    // Оновлюємо відображення ціни
    resultPrice.innerHTML = `${Math.round(basePrice)}<span class="currency">₴</span>`;
}

/**
 * Розрахунок базової ціни з урахуванням складності
 * @param {string} tankLevel - Рівень танка
 * @param {number} targetMark - Цільовий відсоток відзнак
 * @param {string} difficulty - Складність танка (easy, medium, hard)
 * @returns {number} - Базова ціна
 */
function calculateBasePrice(tankLevel, targetMark, difficulty) {
    let basePrice = 0;
    
    if (tankLevel === '6') {
        if (targetMark === 65) basePrice = 500;
        else if (targetMark === 85) basePrice = 1000;
        else if (targetMark === 95) basePrice = 1800;
    } else if (tankLevel === '8') {
        if (targetMark === 65) basePrice = 800;
        else if (targetMark === 85) basePrice = 1500;
        else if (targetMark === 95) basePrice = 2500;
    } else if (tankLevel === '10') {
        if (targetMark === 65) basePrice = 1200;
        else if (targetMark === 85) basePrice = 2000;
        else if (targetMark === 95) basePrice = 3000;
    }
    
    // Застосовуємо множник за складність
    if (difficulty === 'easy') {
        basePrice *= 1.0; // Без змін для легкого рівня
    } else if (difficulty === 'medium') {
        basePrice *= 1.2; // +20% за середню складність
    } else if (difficulty === 'hard') {
        basePrice *= 1.5; // +50% за високу складність
    }
    
    return basePrice;
}

/**
 * Плавне прокручування до якоря
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') {
            return; // Пропускаємо, якщо просто "#"
        }
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            e.preventDefault();
            
            window.scrollTo({
                top: targetElement.offsetTop - 100, // Враховуємо висоту шапки
                behavior: 'smooth'
            });
        }
    });
});

// Додати до кінця services.js
window.addEventListener('load', function() {
    // Перевіряємо, чи URL містить #onslaught
    if (window.location.hash === '#onslaught') {
        console.log("Виявлено #onslaught після повного завантаження сторінки");
        
        // Перевіряємо, чи існує функція ініціалізації
        if (typeof initOnslaughtSection === 'function') {
            console.log("Викликаємо initOnslaughtSection після повного завантаження");
            
            // Активуємо вкладку і ініціалізуємо секцію
            const onslaughtTab = document.querySelector('.service-tab[data-tab="onslaught"]');
            if (onslaughtTab) {
                onslaughtTab.click();
                setTimeout(initOnslaughtSection, 300);
            }
        }
    }
});