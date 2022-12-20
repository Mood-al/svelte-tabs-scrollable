<script>
	// @ts-nocheck

	import Tabs from '$lib/Tabs.svelte';
	import Tab from '$lib/Tab.svelte';

	let isRTL = false;
	const onClick = () => {
		isRTL = !isRTL;
	};
	let activeTab = 13;
	const onTabClick = (e, index) => {
		console.log(e, index);
	};
	$: {
		if (typeof window !== 'undefined') {
			const body = window.document.body;
			isRTL ? (body.dir = 'rtl') : (body.dir = 'ltr');
		}
	}
	let goToEnd;
	let goToStart;
</script>

<Tabs {activeTab} {onTabClick} bind:goToEnd bind:goToStart {isRTL}>
	{#each [...Array(33).keys()] as item}
		<Tab>
			tab {item}
		</Tab>
	{/each}
</Tabs>

<button on:click={() => goToEnd()}>go to end</button>
<button on:click={() => goToStart()}>go to start</button>
<button on:click={onClick}>{isRTL ? 'rtl' : 'ltr'}</button>

<h3>
	I'm working now on the demo and on adding the API to the component. if you want to see demos on
	react-tabs-scrollable please visit this <a nopo href="https://react-tabs-scrollable.vercel.app/"
		><h2>Website</h2></a
	> until i can finish the svelte one, they both have the same features and functionality.
</h3>
