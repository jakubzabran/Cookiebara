(function () {
    const COOKIE_NAME = 'ckbr';
    const COOKIE_UPDATED_FLAG = 'ckbr_updated-ui';
    const COOKIE_EXPIRATION_DAYS = 180;

    // Default categories with flexibility for dynamic setup
    const ALL_CATEGORIES = ['essential', 'analytics', 'marketing', 'personalization', 'uncategorized'];
    let CATEGORIES = [...ALL_CATEGORIES];

    const DEFAULT_CONSENT = {
        essential: false,
        analytics: false,
        marketing: false,
        personalization: false,
        uncategorized: false
    };

    function getAllowedCategories() {
        const scriptElement = document.querySelector('script[data-allowed-categories]');
        if (scriptElement) {
            const allowed = scriptElement.getAttribute('data-allowed-categories');
            if (allowed) {
                return allowed.split(',').map(cat => cat.trim());
            }
        }
        return ALL_CATEGORIES;
    }

    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${JSON.stringify(value)}; expires=${date.toUTCString()}; path=/`;
    }

    function getCookie(name) {
        const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
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

    // This updated function only triggers consent change events for available cookies
    function triggerConsentChange(category, newConsent, oldConsent) {
        if (oldConsent !== undefined && newConsent !== oldConsent) {
            const event = `${category}-${newConsent ? 'activated' : 'deactivated'}`;
            pushToGTM(event);
        }
    }

    function updateConsent(newConsents) {
        const existingConsents = getCookie(COOKIE_NAME) || DEFAULT_CONSENT;
        setCookie(COOKIE_NAME, newConsents, COOKIE_EXPIRATION_DAYS);
        setCookie(COOKIE_UPDATED_FLAG, true, COOKIE_EXPIRATION_DAYS);

        for (const category of CATEGORIES) {
            if (existingConsents[category] !== undefined) {
                triggerConsentChange(category, newConsents[category], existingConsents[category]);
            }
        }
    }

    function loadConsentsIntoForm() {
        const formElement = document.querySelector('[data-ckbr-ui="consent-manager"]');
        if (!formElement) return;

        const currentConsents = getCookie(COOKIE_NAME) || DEFAULT_CONSENT;

        CATEGORIES.forEach(category => {
            const checkbox = formElement.querySelector(`input[data-ckbr-ui="${category}"]`);
            if (checkbox) {
                updateCheckbox(checkbox, currentConsents[category]);
            }
        });
    }

    function updateCheckbox(checkbox, shouldCheck) {
        if (checkbox.checked !== shouldCheck) {
            checkbox.checked = shouldCheck;

            checkbox.dispatchEvent(new Event('click', { bubbles: true }));
            checkbox.dispatchEvent(new Event('input', { bubbles: true }));
            checkbox.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    function handleUserAction(action, consentElement = null) {
        const existingConsents = getCookie(COOKIE_NAME) || DEFAULT_CONSENT;
        const consents = { ...existingConsents };

        if (action === 'allow' || action === 'deny') {
            CATEGORIES.forEach(category => {
                consents[category] = (action === 'allow');
            });
        } else if (action === 'submit' && consentElement) {
            const checkboxes = consentElement.querySelectorAll('input[type="checkbox"][data-ckbr-ui]');
            checkboxes.forEach(checkbox => {
                const category = checkbox.getAttribute('data-ckbr-ui');
                if (CATEGORIES.includes(category)) {
                    consents[category] = checkbox.checked;
                }
            });
        }

        updateConsent(consents);
        hideElement(document.querySelector('[data-ckbr-ui="consent-banner"]'));
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
        CATEGORIES = getAllowedCategories();  

        const existingConsents = getCookie(COOKIE_NAME);
        const consentBanner = document.querySelector('[data-ckbr-ui="consent-banner"]');

        if (!existingConsents) {
            showElement(consentBanner);
        } else {
            CATEGORIES.forEach(category => {
                if (existingConsents[category] !== undefined) {
                    triggerConsentChange(category, existingConsents[category]);
                }
            });
        }

        const elements = document.querySelectorAll('[data-ckbr-ui]');
        elements.forEach(element => {
            const action = element.getAttribute('data-ckbr-ui');
            if (['allow', 'deny', 'submit'].includes(action)) {
                element.addEventListener('click', (event) => {
                    event.preventDefault();  // Prevent the default link behavior
                    const formContainer = element.closest('[data-ckbr-ui="consent-manager"]');
                    handleUserAction(action, formContainer);
                });
            }
        });

        const openManagerButton = document.querySelector('[data-ckbr-ui="open-manager"]');
        if (openManagerButton) {
            openManagerButton.addEventListener('click', () => {
                const formContainer = openManagerButton.closest('[data-ckbr-ui="consent-manager"]');
                loadConsentsIntoForm(formContainer);  // Ensure the right context is passed if necessary
            });
        }
    }

    window.addEventListener('load', initialize);
})();
