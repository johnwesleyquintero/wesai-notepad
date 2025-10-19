import { AppSettings } from '../types/settings';

const SETTINGS_KEY = 'wesai_settings';

export const settingsUtils = {
  getSettings(): AppSettings {
    try {
      const settings = localStorage.getItem(SETTINGS_KEY);
      return settings ? JSON.parse(settings) : { geminiApiKey: '' };
    } catch (error) {
      console.error('Failed to load settings:', error);
      return { geminiApiKey: '' };
    }
  },

  saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  },

  hasApiKey(): boolean {
    const settings = this.getSettings();
    return settings.geminiApiKey.trim().length > 0;
  }
};
