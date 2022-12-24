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
			console.log(index);
		};
		$: {
			if (typeof window !== 'undefined') {
				const body = window.document.body;
				isRTL ? (body.dir = 'rtl') : (body.dir = 'ltr');
			}
		}
		let goToEnd;
		let goToStart;

		const didReachEnd = (val) => {
			// sets if the tabs reached the end point of the tab's container
		};
		const didReachStart = (val) => {
			// sets if the tabs reached the start point of the tab's container
		};
	</script>

<!-- I couldn't add comments between the <Tabs/>'s props -_- -->
<Tabs
	{activeTab}
	{onTabClick}
	bind:goToEnd
	bind:goToStart
	{isRTL}
	{didReachStart}
	{didReachEnd}
	scrollSelectedToCenterOfView={true}
	scrollSelectedToEndOfView={false}
	animationDuration={300}
	hideNavBtnsOnMobile={true}
	showTabsScroll={false}
	hideNavBtns={false}
	tabsClassName="ss"
	tabsContainerClassName="ss"
>
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
