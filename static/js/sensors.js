const menu = document.querySelector(".menu");
const menuItems = document.querySelectorAll(".menuItem");
const hamburger = document.querySelector(".hamburger");
const closeIcon = document.querySelector(".closeIcon");
const menuIcon = document.querySelector(".menuIcon");
closeIcon.style.display = "none";

window.addEventListener("load", function () {
    // Отримати елемент вибору мови
    const languageSelector = document.getElementById("language-selector");

    // Отримати збережену мову з локального сховища
    const selectedLanguage = localStorage.getItem("selectedLanguage");

    // Встановити вибрану мову, якщо вона є
    if (selectedLanguage) {
        languageSelector.value = selectedLanguage;
        i18next.changeLanguage(selectedLanguage, updateContent); // Зміна мови
    }

    // Додати обробник подій для зміни мови
    languageSelector.addEventListener("change", function () {
        // Зберегти обрану мову у локальному сховищі
        localStorage.setItem("selectedLanguage", this.value);
        i18next.changeLanguage(this.value, updateContent); // Зміна мови
    });
});


function toggleMenu() {
    if (menu.classList.contains("showMenu")) {
        menu.classList.remove("showMenu");
        closeIcon.style.display = "none";
        menuIcon.style.display = "block";
    } else {
        menu.classList.add("showMenu");
        closeIcon.style.display = "block";
        menuIcon.style.display = "none";
    }
}

hamburger.addEventListener("click", toggleMenu);

menuItems.forEach(function (menuItem) {
    menuItem.addEventListener("click", toggleMenu);
});

// Отримання значення user_id з сервера
let user_id;
fetch('/get_user_id')
    .then(response => response.text())
    .then(text => {
        user_id = text;
        console.log(user_id);
        // Виконання GET-запиту до API
        updateSensors();
    });

function updateSensors() {
    fetch(`http://127.0.0.1:5000/api/daily/get_all?user_id=${user_id}`)
        .then(response => response.json())
        .then(data => {
            // Перевірка наявності даних
            if (data.length > 0) {
                // Вибір першого елемента масиву
                const sensorData = data[0];
                // Відображення отриманих даних на сторінці
                document.getElementById('gas-meter').textContent = sensorData.gas_count || i18next.t('gasMeter');
                document.getElementById('electricity-meter').textContent = sensorData.electricity_count || i18next.t('electricityMeter');
                document.getElementById('water-meter').textContent = sensorData.water_count || i18next.t('waterMeter');
                document.getElementById('temperature-sensor').textContent = sensorData.day_temperature || i18next.t('temperatureSensor');
            } else {
                // Виведення повідомлення про відсутність даних
                document.getElementById('gas-meter').textContent = i18next.t('noData');
                document.getElementById('electricity-meter').textContent = i18next.t('noData');
                document.getElementById('water-meter').textContent = i18next.t('noData');
                document.getElementById('temperature-sensor').textContent = i18next.t('noData');
            }
            // Оновлення тексту на сторінці
            updateContent();
        });
}


i18next.init({
    lng: 'en', // Мова за замовчуванням
    resources: {
        en: {
            translation: {} // Завантаження англійських перекладів
        },
        uk: {
            translation: {} // Завантаження українських перекладів
        }
    }
}, function (err, t) {
    // Оновлення тексту на сторінці
    updateContent();
});

// Завантаження англійських перекладів
fetch('/static/locales/en.json')
    .then(response => response.json())
    .then(data => {
        i18next.addResourceBundle('en', 'translation', data);
        updateContent();
    });

// Завантаження українських перекладів
fetch('../../static/locales/uk.json')
    .then(response => response.json())
    .then(data => {
        i18next.addResourceBundle('uk', 'translation', data);
        updateContent();
    });

document.getElementById('language-selector').addEventListener('change', function () {
    const lng = this.value;
    console.log(lng)
    i18next.changeLanguage(lng, updateContent);
});

function updateContent() {
    document.querySelector('.menuItem[href="/sensors"]').textContent = i18next.t('sensors');
    document.querySelector('.menuItem[href="/"]').textContent = i18next.t('configure');
    document.querySelector('h1').textContent = i18next.t('sensors');
    document.querySelector('#gas-meter').previousSibling.textContent = i18next.t('gasMeter') + ': ';
    document.querySelector('#electricity-meter').previousSibling.textContent = i18next.t('electricityMeter') + ': ';
    document.querySelector('#water-meter').previousSibling.textContent = i18next.t('waterMeter') + ': ';
    document.querySelector('#temperature-sensor').previousSibling.textContent = i18next.t('temperatureSensor') + ': ';
}

// Отримати елемент вибору мови
const languageSelector = document.getElementById("language-selector");

// Отримати збережену мову з локального сховища
const selectedLanguage = localStorage.getItem("selectedLanguage");

// Встановити вибрану мову, якщо вона є
if (selectedLanguage) {
    languageSelector.value = selectedLanguage;
}
