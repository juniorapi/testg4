/**
 * JavaScript для сторінки послуг G_UA Alliance з виправленим функціоналом повзунка відміток
 */

document.addEventListener('DOMContentLoaded', function() {
    // Ініціалізація всіх функцій для сторінки послуг
    initTabs();
    initFAQAccordion();
    initRangeSlider();
    initTankSelector();
    initCheckboxes();
    initPricingCalculator();
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
 * Ініціалізація слайдера відсотка відзнак - ВИПРАВЛЕНИЙ КОД
 */
function initRangeSlider() {
    const marksRange = document.getElementById('marksRange');
    if (marksRange) {
        const currentMarkSpan = document.getElementById('currentMark');
        const targetMarkSpan = document.getElementById('targetMark');
        
        // Встановлюємо початкові значення
        // Початкове значення встановлюємо на 95% (третю відмітку)
        marksRange.value = 95;
        
        // Визначаємо відмітки для точних положень повзунка
        const markPositions = {
            0: 0,    // 0%
            65: 65,  // 1 відмітка
            85: 85,  // 2 відмітки
            95: 95   // 3 відмітки
        };
        
        // Функція для налаштування повзунка на найближчу відмітку
        function snapToNearestMark(value) {
            // Знаходимо найближчу відмітку
            const marks = Object.keys(markPositions).map(Number);
            return marks.reduce((prev, curr) => {
                return (Math.abs(curr - value) < Math.abs(prev - value)) ? curr : prev;
            });
        }
        
        // Оновлюємо відмітки при завантаженні
        setMarksPercentage(marksRange.value);
        
        // Оновлюємо відсоток при зміні слайдера
        marksRange.addEventListener('input', function() {
            setMarksPercentage(this.value);
        });
        
        // Встановлюємо точне значення при відпусканні слайдера
        marksRange.addEventListener('change', function() {
            const exactValue = snapToNearestMark(parseInt(this.value));
            this.value = exactValue;
            setMarksPercentage(exactValue);
        });
        
        // Обробляємо зміну відсотка
        function setMarksPercentage(value) {
            // Переконуємося, що значення числове
            value = parseInt(value);
            
            // Визначаємо найближчий поріг відзнак (0%, 65%, 85%, 95%)
            let targetPercent = snapToNearestMark(value);
            
            // Оновлюємо відображення поточного та цільового відсотка
            currentMarkSpan.textContent = '0%';
            targetMarkSpan.textContent = targetPercent + '%';
            
            // Оновлюємо значення в калькуляторі
            updateCalculator(targetPercent);
        }
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
    const marksRange = document.getElementById('marksRange');
    const win60Checkbox = document.getElementById('wins60');
    const streamCheckbox = document.getElementById('stream');
    const fastExecCheckbox = document.getElementById('fastexec');
    
    // Отримуємо елементи для відображення значень
    const tankTypeValue = document.querySelector('.calc-option:nth-child(1) .calc-value');
    const currentMarkValue = document.querySelector('.calc-option:nth-child(2) .calc-value');
    const targetMarkValue = document.querySelector('.calc-option:nth-child(3) .calc-value');
    const complexityValue = document.querySelector('.calc-option:nth-child(4) .calc-value');
    const winsValue = document.querySelector('.calc-option:nth-child(5) .calc-value');
    const streamValue = document.querySelector('.calc-option:nth-child(6) .calc-value');
    const timeframeValue = document.querySelector('.calc-option:nth-child(7) .calc-value');
    const resultPrice = document.querySelector('.result-price');
    
    // Не продовжуємо, якщо якийсь із необхідних елементів відсутній
    if (!selectedTank || !marksRange || !tankTypeValue || !resultPrice) {
        return;
    }
    
    // Отримуємо рівень танка
    const tankLevel = selectedTank.getAttribute('data-level');
    
    // Визначаємо цільовий відсоток відзнак
    let targetMarkPercent = targetPercent || parseInt(marksRange.value);
    let markName = '';
    
    // Забезпечуємо точну відповідність цільового відсотка
    if (targetMarkPercent < 32) {
        targetMarkPercent = 0;
        markName = '0 відзнак';
    } else if (targetMarkPercent < 75) {
        targetMarkPercent = 65;
        markName = '1 відзнака';
    } else if (targetMarkPercent < 90) {
        targetMarkPercent = 85;
        markName = '2 відзнаки';
    } else {
        targetMarkPercent = 95;
        markName = '3 відзнаки';
    }
    
    // Оновлюємо відображення значень у калькуляторі
    tankTypeValue.textContent = tankLevel ? `${tankLevel} рівня` : 'Не вибрано';
    currentMarkValue.textContent = '0%';
    targetMarkValue.textContent = `${targetMarkPercent}% (${markName})`;
    complexityValue.textContent = 'Середня';
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
    let basePrice = calculateBasePrice(tankLevel, targetMarkPercent);
    
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
 * Розрахунок базової ціни
 * @param {string} tankLevel - Рівень танка
 * @param {number} targetMark - Цільовий відсоток відзнак
 * @returns {number} - Базова ціна
 */
function calculateBasePrice(tankLevel, targetMark) {
    let basePrice = 0;
    
    // Встановлюємо базову ціну залежно від рівня танка і цільової відзнаки
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
