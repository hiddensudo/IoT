function Notification(options) {
    const position = options.position || 'top-right';
    const duration = options.duration || 3000;

    function createNotification(type, titleKey, messageKey) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
         <div class="title">${i18next.t(titleKey)}</div>
         <div class="message">${i18next.t(messageKey)}</div>
         `;
        document.body.appendChild(notification);

        if (duration > 0) {
            setTimeout(() => {
                notification.style.opacity = 0;
                setTimeout(() => {
                    notification.remove();
                }, 1000);
            }, duration);
        }
    }

    return {
        info: function ({titleKey, messageKey}) {
            createNotification('info', titleKey, messageKey);
        },
        success: function ({titleKey, messageKey}) {
            createNotification('success', titleKey, messageKey);
        },
        warning: function ({titleKey, messageKey}) {
            createNotification('warning', titleKey, messageKey);
        },
        error: function ({titleKey, messageKey}) {
            createNotification('error', titleKey, messageKey);
        },
        dialog: function ({titleKey, messageKey, callback}) {
            const dialog = document.createElement('div');
            dialog.className = 'dialog';
            dialog.innerHTML = `
             <div class="title">${i18next.t(titleKey)}</div>
             <div class="message">${i18next.t(messageKey)}</div>
             <div class="actions">
             <button class="confirm">${i18next.t('confirm')}</button>
             <button class="cancel">${i18next.t('cancel')}</button>
             </div>
             `;
            document.body.appendChild(dialog);

            const confirmButton = dialog.querySelector('.confirm');
            const cancelButton = dialog.querySelector('.cancel');

            confirmButton.addEventListener('click', () => {
                callback(true);
                dialog.remove();
            });

            cancelButton.addEventListener('click', () => {
                callback(false);
                dialog.remove();
            });
        },
        showPopup: function ({type, titleKey, messageKey, callback}) {
            if (type === 'dialog') {
                this.dialog({titleKey, messageKey, callback});
            } else {
                this[type]({titleKey, messageKey});
            }
        }
    };
}
