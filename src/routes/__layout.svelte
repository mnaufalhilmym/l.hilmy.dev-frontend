<script>
	import globalConf from '$lib/conf/globalConf';

	import '../app.css';
</script>

<svelte:head>
	<title>{globalConf.APP_NAME}</title>
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0"
	/>
</svelte:head>

<slot />
