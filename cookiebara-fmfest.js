// Inject the cookie popup HTML into the page
document.body.insertAdjacentHTML('beforeend', `
    <div id="popup-banner" class="popup-container" style="display: none;">
        <div class="overlay"></div>
        <div class="popup-content">
            <h1>Používáme cookies</h1>
            <p>Sbíráme anonymizovaná data, abychom mohli web postupně zlepšovat a optimalizovat marketingové kampaně.</p>
            <div class="popup-bottom">
                <a href="#" class="popup-link" id="settings-link">Nastavení</a>
                <button class="popup-button" id="accept-all">Povolit vše</button>
            </div>
        </div>
    </div>
    
    <div id="popup-settings" class="popup-container" style="display: none;">
        <div class="overlay"></div>
        <div class="popup-content">
            <h1>Nastavení cookies</h1>
            <form id="cookie-manager-form">
                <div class="cookie-item">
                    <div class="cookie-header">
                        <h2>Analytické cookies</h2>
                        <label class="cookie-switch">
                            <input type="checkbox" class="cookie-checkbox" id="analytics-checkbox">
                            <span class="cookie-slider"></span>
                        </label>
                    </div>
                    <p>Analytické cookies nám pomáhají lépe pochopit, jak návštěvníci používají web, a umožňují jeho zlepšování. Informace jsou anonymní.</p>
                </div>
                <div class="cookie-item">
                    <div class="cookie-header">
                        <h2>Marketingové cookies</h2>
                        <label class="cookie-switch">
                            <input type="checkbox" class="cookie-checkbox" id="marketing-checkbox">
                            <span class="cookie-slider"></span>
                        </label>
                    </div>
                    <p>Marketingové cookies umožňují zobrazování personalizovaných reklam na externích platformách (např. Google nebo PPC), a měření jejich efektivity.</p>
                </div>
                <div class="popup-bottom">
                    <a href="#" class="popup-link" id="save-selected">Povolit vybrané</a>
                    <button type="button" class="popup-button" id="accept-all-settings">Povolit vše</button>
                </div>
            </form>
        </div>
    </div>

    <div id="cookie-settings-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M7.5 0.943882C3.88119 0.943882 0.9375 3.88757 0.9375 7.50638C0.9375 11.1252 3.88119 14.0689 7.5 14.0689C7.50031 14.0689 7.50062 14.0689 7.50094 14.0689C10.5337 14.0613 13.1709 11.9708 13.8703 9.01975C13.8912 8.93139 13.8859 8.83887 13.8553 8.75342C13.8246 8.66797 13.7697 8.59327 13.6974 8.5384C13.6251 8.48352 13.5384 8.45082 13.4478 8.44428C13.3573 8.43774 13.2667 8.45764 13.1873 8.50156C12.9425 8.63712 12.6678 8.70927 12.388 8.71122C11.7385 8.71028 11.1512 8.33535 10.8756 7.74717C10.8406 7.67293 10.7868 7.60917 10.7195 7.56226C10.6522 7.51535 10.5737 7.48692 10.492 7.47983C8.79989 7.33013 7.50768 5.9244 7.50002 4.22605V4.2251C7.50237 3.30689 7.88915 2.43163 8.56661 1.81177C8.63233 1.75154 8.6795 1.67382 8.70262 1.58773C8.72573 1.50163 8.72382 1.41073 8.6971 1.32569C8.67039 1.24064 8.61998 1.16497 8.55179 1.10756C8.4836 1.05015 8.40045 1.01337 8.31209 1.00153C8.04438 0.965532 7.77471 0.946605 7.50461 0.943854C7.50304 0.943846 7.50156 0.943874 7.5 0.943882ZM7.36816 1.90793C6.89798 2.59915 6.56435 3.37282 6.5625 4.2233C6.5625 4.22424 6.5625 4.22518 6.5625 4.22612C6.57023 6.33118 8.14819 8.07133 10.2127 8.35789C10.6831 9.12483 11.4759 9.6481 12.3889 9.64879C12.3899 9.64879 12.3908 9.64879 12.3917 9.64879C12.4734 9.64832 12.5443 9.59553 12.6252 9.58745C11.7769 11.6759 9.81122 13.1253 7.50006 13.1315C4.38792 13.1315 1.87506 10.6186 1.87506 7.50645C1.87506 4.44111 4.32099 1.98195 7.36816 1.90793Z" fill="#21AAB0"/>
        </svg>
    </div>

    <style>
        .popup-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 999;
        }

        .overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            z-index: 998;
        }

        .popup-content {
            position: relative;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #FFF;
            padding: 64px;
            border-radius: 4px;
            width: 50rem;
            max-width: calc(100% - 64px);
            border: 5px solid;
            border-image: linear-gradient(45deg, #21AAB0, #F05A7E) 1;
            z-index: 1000;
            box-sizing: border-box;
            max-height: 90vh;
            overflow-y: auto;
        }

        .popup-content h1 {
            color: #002239;
            font-family: Raleway, sans-serif;
            font-size: 36px;
            font-weight: 700;
            margin: 0 0 16px 0;
        }

        .cookie-item {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 26px;
            align-self: stretch;
            padding-bottom: 24px;
            border-bottom: 1px solid #CCC;
            margin-bottom: 24px;
        }

        .cookie-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            align-self: stretch;
        }

        .cookie-header h2 {
            color: #000;
            font-family: Raleway, sans-serif;
            font-size: 28px;
            font-weight: 700;
            margin: 0;
        }

        .popup-content p {
            color: #002239;
            font-family: Raleway, sans-serif;
            font-size: 18px;
            font-weight: 500;
            line-height: 1.5;
            margin: 0 0 16px 0;
        }

        .cookie-checkbox {
            display: none;
        }

        .cookie-switch {
            position: relative;
            display: inline-block;
            width: 57px;
            height: 35px;
        }

        .cookie-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            border-radius: 16px;
            transition: 0.4s;
        }

        .cookie-slider:before {
            position: absolute;
            content: "";
            height: 30px;
            width: 30px;
            left: 2.5px;
            bottom: 2.5px;
            background-color: white;
            border-radius: 50%;
            transition: 0.4s;
        }

        .cookie-checkbox:checked + .cookie-slider {
            background-color: #EA5178;
        }

        .cookie-checkbox:checked + .cookie-slider:before {
            transform: translateX(22px);
        }

        .popup-bottom {
            display: flex;
            justify-content: space-between;
            align-items: center;
            align-self: stretch;
            height: 56px;
            margin-top: 24px;
        }

        .popup-link {
            color: #EA5178;
            text-align: center;
            font-family: Raleway, sans-serif;
            font-size: 18px;
            font-weight: 500;
            text-decoration: underline;
            line-height: normal;
        }

        .popup-link:hover {
            text-decoration: none;
        }

        .popup-button {
            display: flex;
            padding: 14px 22px;
            justify-content: center;
            align-items: center;
            gap: 10px;
            border-radius: 2px;
            background: #EA5178;
            color: #FFF;
            border: none;
            font-family: Raleway, sans-serif;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
        }

        .popup-button:hover {
            background: #902A44;
        }

        #cookie-settings-icon {
            display: flex;
            justify-content: center;
            align-items: center;
            position: fixed;
            bottom: 16px;
            left: 16px;
            width: 32px;
            height: 32px;
            background: #002239;
            border-radius: 50%;
            cursor: pointer;
            z-index: 1000;
        }

        @media (max-width: 500px) {
            .popup-content {
                padding: 32px;
                max-width: calc(100% - 32px);
            }

            .popup-bottom {
                flex-direction: column;
                gap: 16px;
                align-items: stretch;
            }

            .popup-link, .popup-button {
                width: 100%;
                text-align: center;
            }
        }
    </style>
`);

// Add interaction logic
document.getElementById('settings-link').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('popup-banner').style.display = 'none';
    document.getElementById('popup-settings').style.display = 'block';
});

document.getElementById('accept-all').addEventListener('click', function() {
    closePopup();
});

document.getElementById('accept-all-settings').addEventListener('click', function() {
    closePopup();
});

document.getElementById('save-selected').addEventListener('click', function() {
    closePopup();
});

document.getElementById('cookie-settings-icon').addEventListener('click', function() {
    document.getElementById('popup-settings').style.display = 'block';
});

function closePopup() {
    document.getElementById('popup-banner').style.display = 'none';
    document.getElementById('popup-settings').style.display = 'none';
}
