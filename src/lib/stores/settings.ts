import { writable } from 'svelte/store';

const defaultSettings = {
	isDarkMode: false
};

function getSettings() {
	if (typeof localStorage === 'undefined') return defaultSettings;

	const isDarkMode = localStorage.getItem('isDarkMode');
	if (isDarkMode && isDarkMode.length > 0) {
		defaultSettings.isDarkMode = isDarkMode.toLowerCase() === 'true';
	}

	return defaultSettings;
}

function setSettings(key: string, value: string) {
	if (typeof localStorage === 'undefined') return;

	localStorage.setItem(key, value);
}

function createSettings() {
	const { subscribe, set, update } = writable(getSettings());

	return {
		subscribe,
		set: (key: string, value: any) => {
			setSettings(key, value.toString());
			update((prev) => {
				const prevData: { [key: string]: any } = { ...prev };
				prevData[key] = value;
				return prevData as typeof prev;
			});
		},
		toggleDarkMode: () => {
			update((prev) => {
				const prevData = { ...prev };
				prevData.isDarkMode = !prevData.isDarkMode;
				setSettings('isDarkMode', prevData.isDarkMode.toString());
				return prevData;
			});
		},
		reset: () => set(getSettings())
	};
}

export const settingsStore = createSettings();
