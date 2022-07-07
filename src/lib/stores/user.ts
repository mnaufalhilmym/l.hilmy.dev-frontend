import randomString from '$lib/helpers/random';
import { writable } from 'svelte/store';

const defaultUser = {
	userId: ''
};

function getUser() {
	if (typeof localStorage === 'undefined') return defaultUser;

	const userId = localStorage.getItem('userId');
	if (userId && userId.length > 0) {
		defaultUser.userId = userId;
	} else {
		defaultUser.userId = randomString(12, {
			withLowerChar: true,
			withUpperChar: true,
			withNumber: true
		});
		setUser('userId', defaultUser.userId);
	}

	return defaultUser;
}

function setUser(key: string, value: any) {
	if (typeof localStorage === 'undefined') return;

	localStorage.setItem(key, value);
}

function createUser() {
	const { subscribe, set, update } = writable(getUser());

	return {
		subscribe,
		set: (key: string, value: any) => {
			setUser(key, value);
			update((prev) => {
				const prevData: { [key: string]: any } = { ...prev };
				prevData[key] = value;
				return prevData as typeof prev;
			});
		},
		setUserId: (userId: string) => {
			setUser('userId', userId);
			update((prev) => {
				const prevData = { ...prev };
				prevData.userId = userId;
				return prevData;
			});
		},
		reset: () => set(getUser())
	};
}

export const userStore = createUser();
