<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { userStore } from '$lib/stores/user';
	import apiMoveShortUrlsToNewUserId from '$lib/apis/moveShortUrlsToNewUserId';
	export let getShortUrls: () => void;

	const dispatch = createEventDispatcher();

	function closeModal() {
		dispatch('close');
	}

	async function submitFormHandler(
		event: SubmitEvent & {
			currentTarget: EventTarget & HTMLFormElement;
		}
	) {
		const newUserId = event.currentTarget.userId.value;
		const oldUserId = $userStore.userId;
		userStore.setUserId(newUserId);

		closeModal();

		const res = await apiMoveShortUrlsToNewUserId({ oldUserId, newUserId });
		if (!res?.ok) {
			// TODO handle error
			return;
		}
		getShortUrls();
	}
</script>

<div
	on:click={closeModal}
	class="w-screen h-screen fixed top-0 left-0 flex items-center justify-center bg-neutral-900/20 dark:bg-white/20 dark:text-white"
>
	<form
		on:click|stopPropagation={() => {}}
		on:submit|preventDefault={submitFormHandler}
		class="p-8 w-3/4 sm:w-2/3 md:w-7/12 lg:w-1/2 xl:w-5/12 2xl:w-1/3 rounded-3xl bg-white dark:bg-neutral-900"
	>
		<h3 class="font-bold text-2xl text-center">User ID</h3>
		<span class="mt-6 block">Input User ID to sync short URLs</span>
		<input
			type="text"
			name="userId"
			value={$userStore.userId}
			minlength="5"
			placeholder="Input User ID"
			required
			autocomplete="off"
			class="mt-1 py-1 px-2 w-full block bg-transparent border rounded-lg outline-none"
		/>
		<button type="submit" class="mt-6 mx-auto py-2 px-5 block border hover:border-sky-400 rounded-lg hover:text-sky-400">Confirm</button>
	</form>
</div>
