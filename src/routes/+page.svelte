<script>
	// @ts-nocheck

	import Tabs from '$lib/Tabs.svelte';
	import Tab from '$lib/Tab.svelte';

	let isRTL = false;
	const onClick = () => {
		isRTL = !isRTL;
	};
	let activeTab = 5;
	const onTabClick = (e, index) => {
		console.log(e, index);
	};
	$: {
		if (typeof window !== 'undefined') {
			const body = window.document.body;
			isRTL ? (body.dir = 'rtl') : (body.dir = 'ltr');
		}
	}
</script>

<Tabs {activeTab} {onTabClick} {isRTL}>
	{#each [...Array(33).keys()] as item}
		<Tab>
			tab {item}
		</Tab>
	{/each}
</Tabs>

<button on:click={onClick}>{isRTL ? 'rtl' : 'ltr'}</button>
<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
