<script lang="ts">
	import apiCreateShortUrl from '$lib/apis/createShortUrl';
	import apiDeleteShortUrl from '$lib/apis/deleteShortUrl';
	import apiGetShortUrls from '$lib/apis/getShortUrls';
	import apiModifyShortUrl from '$lib/apis/modifyShortUrl';
	import AuthModal from '$lib/components/authModal.svelte';
	import globalConf from '$lib/conf/globalConf';

	import { settingsStore } from '$lib/stores/settings';
	import { userStore } from '$lib/stores/user';
	import type { IShortUrl } from '$lib/types/shortUrl.type';
	import { onMount } from 'svelte';

	let isMounted = false;
	let isLoading = true;
	let isCustomShortUrl = false;
	let isAuthModalOpen = false;
	let shortUrls: IShortUrl[] = [];

	onMount(() => {
		isMounted = true;

		getShortUrls();
	});

	function setIsLoading(event: CustomEvent<{ state: boolean }>) {
		isLoading = event.detail.state;
	}

	async function getShortUrls() {
		isLoading = true;
		const res = await apiGetShortUrls($userStore.userId);
		isLoading = false;
		if (!res?.ok) {
			console.log(res?.payload);
			return;
		}
		if (res?.payload) {
			shortUrls = res.payload.sort((a, b) =>
				a.updatedAt < b.updatedAt ? 1 : a.updatedAt === b.updatedAt ? 0 : -1
			);
		}
	}

	function toggleDarkModeHandler() {
		settingsStore.toggleDarkMode();
	}

	function loginButtonHandler() {
		isAuthModalOpen = true;
	}

	function closeAuthModal() {
		isAuthModalOpen = false;
	}

	async function submitFormHandler(
		event: SubmitEvent & {
			currentTarget: EventTarget & HTMLFormElement;
		}
	) {
		const userId = $userStore.userId;
		const longUrl = event.currentTarget.longUrl.value;
		const shortUrl = event.currentTarget.shortUrl?.value;

		isLoading = true;
		const res = await apiCreateShortUrl({ userId, longUrl, shortUrl });
		isLoading = false;
		if (!res?.ok) {
			console.log(res?.payload);
			return;
		}
		getShortUrls();
	}

	function toggleCustomShortUrlHandler() {
		isCustomShortUrl = !isCustomShortUrl;
	}

	function copyShortUrlHandler(shortUrl: string) {
		navigator.clipboard.writeText(globalConf.APP_ADDR_ALT + '/' + shortUrl);
	}

	async function forgetShortUrlHandler(shortUrl: string) {
		isLoading = true;
		const res = await apiModifyShortUrl(shortUrl, { userId: $userStore.userId, isShow: false });
		isLoading = false;
		if (!res?.ok) {
			console.log(res?.payload);
			return;
		}
		getShortUrls();
	}

	async function deleteShortUrlHandler(shortUrl: string) {
		isLoading = true;
		const res = await apiDeleteShortUrl(shortUrl, { userId: $userStore.userId });
		isLoading = false;
		if (!res?.ok) {
			console.log(res?.payload);
			return;
		}
		getShortUrls();
	}
</script>

{#if isMounted}
	<div class:dark={$settingsStore.isDarkMode}>
		<div
			class="min-h-screen flex flex-col transition-color duration-300 dark:bg-neutral-900 dark:text-white"
		>
			<header class="py-2 px-3 border-b">
				<div class="mx-auto sm:w-11/12">
					<div class="ml-auto w-fit space-x-4">
						{#if isLoading}
							<span class="animate-spin material-symbols-outlined">autorenew</span>
						{/if}
						<button
							on:click={toggleDarkModeHandler}
							class="p-2 border-2 hover:border-sky-400 hover:text-sky-400 rounded-lg material-symbols-outlined"
						>
							{$settingsStore.isDarkMode ? 'dark_mode' : 'light_mode'}
						</button>
						<button
							on:click={loginButtonHandler}
							class="p-2 border-2 hover:border-sky-400 hover:text-sky-400 rounded-lg material-symbols-outlined"
						>
							login
						</button>
					</div>
				</div>
			</header>
			<div class="py-16 px-2 sm:p-20 flex-1 flex flex-col items-center justify-center">
				<div class="mx-auto w-full md:w-4/5 lg:w-2/3 xl:w-1/2">
					<div class="w-full">
						<h1 class="text-4xl sm:text-6xl text-center">{globalConf.APP_NAME}</h1>
						<h2 class="mt-3 text-xl sm:text-2xl text-center">{globalConf.APP_DESC}</h2>
						<form on:submit|preventDefault={submitFormHandler} class="w-full">
							<div
								class="mt-8 mb-2 p-2 flex items-center border-2 hover:border-sky-400 focus-within:border-sky-400 rounded-3xl space-x-2"
							>
								<span class="material-symbols-outlined">link</span>
								<input
									type="url"
									name="longUrl"
									placeholder="Paste long URL here"
									required
									autocomplete="off"
									class="py-2.5 min-w-0 flex-1 bg-transparent outline-none"
								/>
								<button
									type="submit"
									class="py-2 px-5 border-2 hover:border-sky-400 rounded-2xl hover:text-sky-400"
									>Shorten URL</button
								>
							</div>
							<div class="px-3 w-full">
								<div class="w-full flex flex-col sm:flex-row flex-wrap gap-x-2 gap-y-1">
									{#if isCustomShortUrl}
										<div class="min-w-0 flex-1 flex">
											<span>{globalConf.APP_ADDR_ALT}/</span>
											<input
												type="text"
												name="shortUrl"
												placeholder="enter short URL"
												required
												pattern={'^[a-zA-Z0-9]{3,}$'}
												title="A valid URL path with at least 3 letters"
												autocomplete="off"
												class="w-full bg-transparent outline-none"
											/>
										</div>
									{/if}
									<button
										type="button"
										on:click={toggleCustomShortUrlHandler}
										class="block mx-auto hover:underline"
										>{isCustomShortUrl ? 'Get random short URL' : 'Use custom short URL'}</button
									>
								</div>
							</div>
						</form>
					</div>
				</div>
				{#if shortUrls.length > 0}
					<div class="mt-20 w-full">
						<div class="mb-6">
							<h3 class="font-bold text-xl sm:text-2xl text-center">Short URL List</h3>
							<span class="mt-1 block text-sm text-center"
								>Automatically deleted after 3 months since last use</span
							>
						</div>
						<div class="flex flex-wrap justify-center gap-5">
							{#each shortUrls as shortUrl (shortUrl.shortUrl)}
								<div class="p-5 w-full sm:w-96 flex border hover:border-sky-400 rounded-xl">
									<div class="min-w-0 flex-1">
										<a
											href={'/' + shortUrl.shortUrl}
											target="_blank"
											rel="noopener noreferrer"
											class="min-w-0 block font-bold text-2xl truncate hover:underline"
											>{globalConf.APP_ADDR_ALT + '/' + shortUrl.shortUrl}</a
										>
										<span class="mt-2 min-w-0 block text-xl truncate">{shortUrl.longUrl}</span>
										<span class="mt-1 min-w-0 block truncate"
											>Accessed {shortUrl.numberAccessed} time{shortUrl.numberAccessed > 1
												? 's'
												: ''}</span
										>
										<span class="block min-w-0 truncate"
											>Created at {new Date(shortUrl.createdAt).toLocaleString()}</span
										>
										<span class="block min-w-0 truncate"
											>Last used at {new Date(shortUrl.updatedAt).toLocaleString()}</span
										>
									</div>
									<div class="ml-1 py-1 space-y-2.5">
										<button
											on:click={() => copyShortUrlHandler(shortUrl.shortUrl)}
											title={`Copy this short URL to clipboard`}
											class="block hover:text-sky-400 material-symbols-outlined"
										>
											content_copy
										</button>
										<button
											on:click={() => forgetShortUrlHandler(shortUrl.shortUrl)}
											title={`Forget this URL\n\nThis shortened URL will remain accessible, but removed from the list.`}
											class="block hover:text-amber-400 material-symbols-outlined"
										>
											auto_delete
										</button>
										<button
											on:click={() => deleteShortUrlHandler(shortUrl.shortUrl)}
											title={`Delete this URL\n\nThis shortened URL will be removed from the list and will no longer be accessible.`}
											class="block hover:text-rose-400 material-symbols-outlined"
										>
											delete_forever
										</button>
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
			<footer class="p-2 border-t">
				<span class="block text-center"
					>Made with 🐧 by <a
						href="/splashmodic"
						target="_blank"
						rel="noreferrer noopener"
						class="hover:underline">splashmodic</a
					>
					© {new Date().getFullYear()}</span
				>
			</footer>
		</div>
		{#if isAuthModalOpen}
			<AuthModal
				on:close={closeAuthModal}
				on:getShortUrls={getShortUrls}
				on:setIsLoading={setIsLoading}
			/>
		{/if}
	</div>
{/if}
