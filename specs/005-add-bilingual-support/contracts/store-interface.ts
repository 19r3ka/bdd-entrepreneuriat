export type SupportedLocale = 'en' | 'fr';

export interface LanguageStoreState {
  /**
   * The currently active locale code.
   */
  currentLocale: SupportedLocale;
  
  /**
   * List of available locales with metadata.
   */
  availableLocales: {
    code: SupportedLocale;
    label: string; // e.g., "Français"
  }[];
}

export interface LanguageStoreActions {
  /**
   * Changes the active language and persists the choice.
   * Updates the i18n instance locale.
   * @param locale The new locale to set
   */
  setLocale(locale: SupportedLocale): Promise<void>;
  
  /**
   * Initializes the store, reading from storage or detecting browser preference.
   */
  initialize(): void;
}
