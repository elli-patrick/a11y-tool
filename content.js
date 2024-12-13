// Create and inject custom styles
const styleElement = document.createElement('style');
document.head.appendChild(styleElement);

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'updateSettings') {
        applySettings(message.settings);
    }
});

// Apply settings to the page
function applySettings(settings) {
    const css = `
        /* Focus styles */
        *:focus {
            outline: ${settings.focusWidth}px solid ${settings.focusColor} !important;
            outline-offset: 2px !important;
        }

        /* Text spacing and size */
        body {
            letter-spacing: ${settings.textSpacing}px !important;
            line-height: ${settings.lineHeight} !important;
            font-size: ${settings.textSize}% !important;
        }

        /* High contrast mode */
        ${settings.highContrast ? `
            body, body * {
                background-color: ${settings.backgroundColor} !important;
                color: ${settings.foregroundColor} !important;
                border-color: ${settings.foregroundColor} !important;
            }
            
            img, video {
                filter: grayscale(100%) contrast(150%) !important;
            }
        ` : ''}

        /* Animation control */
        ${settings.stopAnimations ? `
            *, *::before, *::after {
                animation: none !important;
                transition: none !important;
            }
            
            @keyframes none {
                0% { }
                100% { }
            }
        ` : ''}
    `;

    styleElement.textContent = css;
}

// Load and apply initial settings
chrome.storage.sync.get(null, (settings) => {
    if (Object.keys(settings).length > 0) {
        applySettings(settings);
    }
});
