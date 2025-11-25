import { createI18n } from "vue-i18n";
import en from "./locales/en.json";
import fr from "./locales/fr.json";

const messages = {
	en: en,
	fr: fr,
};

const i18n = createI18n({
	legacy: false, // Use Composition API mode
	locale: "en", // Set default locale
	fallbackLocale: "en", // Set fallback locale
	messages, // Set locale messages
	globalInjection: true, // Make $t available globally
});

export default i18n;
