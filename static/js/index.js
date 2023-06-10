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

document.getElementById("enter-button").addEventListener("click", function () {
    var email = document.getElementById("email-input").value;
    var password = document.getElementById("password-input").value;
    var address = document.getElementById("address-input").value;

    var loginData = {
        email: email,
        password: password
    };

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:5000/api/user/login", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                var accessToken = response.access_token;

                var addressData = {
                    address: address
                };

                var xhr2 = new XMLHttpRequest();
                xhr2.open("POST", "http://127.0.0.1:5000/api/buildings/get_by_address", true);
                xhr2.setRequestHeader("Content-Type", "application/json");
                xhr2.setRequestHeader("Authorization", "Bearer " + accessToken);

                xhr2.onreadystatechange = function () {
                    if (xhr2.readyState === 4) {
                        if (xhr2.status === 200) {
                            var response2 = JSON.parse(xhr2.responseText);
                            var buildingId = response2._id.$oid;
                            var userId = response2.user_id;

                            var configData = {
                                address: address,
                                user_id: userId
                            };

                            var xhr3 = new XMLHttpRequest();
                            xhr3.open("POST", "http://127.0.0.1:5001/save-config", true);
                            xhr3.setRequestHeader("Content-Type", "application/json");

                            xhr3.onreadystatechange = function () {
                                if (xhr3.readyState === 4 && xhr3.status === 200) {
                                    const success = new Notification({});
                                    success.success({titleKey: 'successTitle', messageKey: 'successUserData'});
                                    console.log("Config saved successfully!");
                                }
                            };

                            xhr3.send(JSON.stringify(configData));
                        } else if (xhr2.status === 404) {
                            const notificationUser = new Notification({});
                            notificationUser.error({titleKey: 'errorTitle', messageKey: 'invalidAddressData'});
                        }
                    }
                };

                xhr2.send(JSON.stringify(addressData));
            } else if (xhr.status === 401) {
                const notificationAddress = new Notification({});
                notificationAddress.error({titleKey: 'errorTitle', messageKey: 'invalidUserData'});
            }
        }
    };
    xhr.send(JSON.stringify(loginData));
});

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
fetch('/static/locales/uk.json')
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
    document.querySelector('#email-input').placeholder = i18next.t('email');
    document.querySelector('#password-input').placeholder = i18next.t('password');
    document.querySelector('#address-input').placeholder = i18next.t('address');
    document.querySelector('#enter-button').textContent = i18next.t('enter');
}

// Отримати елемент вибору мови
const languageSelector = document.getElementById("language-selector");

// Слухати подію зміни вибору мови
languageSelector.addEventListener("change", function () {
    const selectedLanguage = languageSelector.value;

    // Зберегти вибрану мову у локальному сховищі
    localStorage.setItem("selectedLanguage", selectedLanguage);
});
