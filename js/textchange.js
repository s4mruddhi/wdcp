// textchange.js

function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'en',
    autoDisplay: false
  }, 'google_translate_element');
}

// Apply selected language
function applyLanguage(lang) {
  const interval = setInterval(() => {
    const translateCombo = document.querySelector('.goog-te-combo');
    if (translateCombo) {
      translateCombo.value = lang;
      translateCombo.dispatchEvent(new Event('change'));
      clearInterval(interval);
    }
  }, 200); // check every 200ms
}

// Wait for DOM and Google Translate
document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('custom-translate');
  if (!select) return;

  const savedLang = localStorage.getItem('selectedLanguage') || 'en';
  select.value = savedLang;

  // Wait for Google Translate widget to be fully loaded
  const waitForTranslateWidget = setInterval(() => {
    if (document.querySelector('.goog-te-combo')) {
      clearInterval(waitForTranslateWidget);
      if (savedLang !== 'en') {
        applyLanguage(savedLang);
      }
    }
  }, 200); // slower to ensure Google widget is ready

  select.addEventListener('change', () => {
    const lang = select.value;
    applyLanguage(lang);
    localStorage.setItem('selectedLanguage', lang);
  });
});
