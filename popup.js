// Default settings
const defaultSettings = {
    focusColor: '#1a73e8',
    focusWidth: 3,
    textSpacing: 0,
    lineHeight: 1.5,
    textSize: 100,
    highContrast: false,
    foregroundColor: '#000000',
    backgroundColor: '#ffffff',
    stopAnimations: false
};

// Initialize settings
document.addEventListener('DOMContentLoaded', async () => {
    // Load saved settings
    const settings = await chrome.storage.sync.get(defaultSettings);
    
    // Apply saved settings to inputs
    document.getElementById('focus-color').value = settings.focusColor;
    document.getElementById('focus-width').value = settings.focusWidth;
    document.getElementById('text-spacing').value = settings.textSpacing;
    document.getElementById('line-height').value = settings.lineHeight;
    document.getElementById('text-size').value = settings.textSize;
    document.getElementById('high-contrast').checked = settings.highContrast;
    document.getElementById('foreground-color').value = settings.foregroundColor;
    document.getElementById('background-color').value = settings.backgroundColor;
    document.getElementById('stop-animations').checked = settings.stopAnimations;

    // Add event listeners
    addEventListeners();
});

function addEventListeners() {
    // Focus settings
    document.getElementById('focus-color').addEventListener('change', saveSettings);
    document.getElementById('focus-width').addEventListener('change', saveSettings);

    // Text settings
    document.getElementById('text-spacing').addEventListener('input', saveSettings);
    document.getElementById('line-height').addEventListener('input', saveSettings);
    document.getElementById('text-size').addEventListener('input', saveSettings);

    // Color settings
    document.getElementById('high-contrast').addEventListener('change', saveSettings);
    document.getElementById('foreground-color').addEventListener('change', saveSettings);
    document.getElementById('background-color').addEventListener('change', saveSettings);

    // Animation settings
    document.getElementById('stop-animations').addEventListener('change', saveSettings);

    // Reset button
    document.getElementById('reset').addEventListener('click', resetSettings);
}

async function saveSettings() {
    const settings = {
        focusColor: document.getElementById('focus-color').value,
        focusWidth: document.getElementById('focus-width').value,
        textSpacing: document.getElementById('text-spacing').value,
        lineHeight: document.getElementById('line-height').value,
        textSize: document.getElementById('text-size').value,
        highContrast: document.getElementById('high-contrast').checked,
        foregroundColor: document.getElementById('foreground-color').value,
        backgroundColor: document.getElementById('background-color').value,
        stopAnimations: document.getElementById('stop-animations').checked
    };

    // Save to Chrome storage
    await chrome.storage.sync.set(settings);

    // Apply settings to active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, { type: 'updateSettings', settings });
}

async function resetSettings() {
    // Reset storage to defaults
    await chrome.storage.sync.set(defaultSettings);

    // Reset input values
    document.getElementById('focus-color').value = defaultSettings.focusColor;
    document.getElementById('focus-width').value = defaultSettings.focusWidth;
    document.getElementById('text-spacing').value = defaultSettings.textSpacing;
    document.getElementById('line-height').value = defaultSettings.lineHeight;
    document.getElementById('text-size').value = defaultSettings.textSize;
    document.getElementById('high-contrast').checked = defaultSettings.highContrast;
    document.getElementById('foreground-color').value = defaultSettings.foregroundColor;
    document.getElementById('background-color').value = defaultSettings.backgroundColor;
    document.getElementById('stop-animations').checked = defaultSettings.stopAnimations;

    // Apply default settings to active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, { type: 'updateSettings', settings: defaultSettings });
}
