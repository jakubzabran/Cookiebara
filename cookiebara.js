(function () {
    const COOKIE_NAME = 'ckbr';
    const COOKIE_UPDATED_FLAG = 'ckbr_updated-ui';
    const COOKIE_EXPIRATION_DAYS = 180;
    const CATEGORIES = ['essential', 'analytics', 'marketing', 'personalization', 'uncategorized'];
    const DEFAULT_CONSENT = {
        essential: true,
        analytics: false,
        marketing: false,
        personalization: false,
        uncategorized: false
    };

    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${JSON.stringify(value)}; expires=${date.toUTCString()}; path=/`;
    }

    function getCookie(name) {
        const cookies = document.cookie
            .split("; ")
            .reduce((acc, cookie) => {
                const [key, value] = cookie.split("=");
                acc[key] = value;
                return acc;
            }, {});
        return cookies[name] ? JSON.parse(cookies[name]) : null;
    }    

    function pushToGTM(event) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: event });
    }

    function triggerConsentChange(category, consent) {
        const event = `${category}-${consent ? 'activated' : 'deactivated'}`;
        pushToGTM(event);
    }

    function updateConsent(consents) {
        setCookie(COOKIE_NAME, consents, COOKIE_EXPIRATION_DAYS);
        setCookie(COOKIE_UPDATED_FLAG, true, COOKIE_EXPIRATION_DAYS);
        for (const category of CATEGORIES) {
            triggerConsentChange(category, consents[category]);
        }
    }

    function loadConsentsIntoForm() {
        const formElement = document.getElementById('consent-manager');
        if (!formElement) return;

        const currentConsents = getCookie(COOKIE_NAME) || DEFAULT_CONSENT;
        CATEGORIES.forEach(category => {
            if (category !== 'essential') {
                const checkbox = formElement.querySelector(`input[ckbr-ui="${category}"]`);
                if (checkbox) {
                    checkbox.checked = currentConsents[category];
                }
            }
        });
    }

    function handleUserAction(action, consentElement = null) {
        const existingConsents = getCookie(COOKIE_NAME) || DEFAULT_CONSENT;
        const consents = { ...existingConsents };

        if (action === 'allow') {
            CATEGORIES.forEach(category => consents[category] = true);
        } else if (action === 'deny') {
            CATEGORIES.forEach(category => {
                if (category !== 'essential') {
                    consents[category] = false;
                }
            });
        } else if (action === 'submit' && consentElement) {
            const checkboxes = consentElement.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                const category = checkbox.getAttribute('ckbr-ui');
                if (CATEGORIES.includes(category)) {
                    consents[category] = checkbox.checked;
                }
            });
        }

        updateConsent(consents);
        hideElement(document.querySelector('[ckbr-ui="consent-banner"]'));
    }

    function showElement(element, display = 'block') {
        if (element) {
            element.style.display = display;
        }
    }

    function hideElement(element) {
        if (element) {
            element.style.display = 'none';
        }
    }

    function initialize() {
        const existingConsents = getCookie(COOKIE_NAME);
        const consentBanner = document.querySelector('[ckbr-ui="consent-banner"]');

        if (!existingConsents) {
            showElement(consentBanner);
        } else {
            CATEGORIES.forEach(category => {
                triggerConsentChange(category, existingConsents[category]);
            });
        }

        const elements = document.querySelectorAll('[ckbr-ui]');
        elements.forEach(element => {
            const action = element.getAttribute('ckbr-ui');
            if (['allow', 'deny', 'submit'].includes(action)) {
                element.addEventListener('click', () => handleUserAction(action, element.closest('#consent-manager')));
            }
        });

        const formElement = document.querySelector('#consent-form');
        if (formElement) {
            formElement.addEventListener('submit', event => {
                event.preventDefault(); // Prevent the default form submission
                handleUserAction('submit', formElement);
            });
        }

        const openManagerButton = document.querySelector('[ckbr-ui="open-manager"]');
        if (openManagerButton) {
            openManagerButton.addEventListener('click', loadConsentsIntoForm);
        }
    }

    window.addEventListener('load', initialize);
})();