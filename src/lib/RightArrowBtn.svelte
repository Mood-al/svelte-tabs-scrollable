<script>
	export let onNavBtnClick;
	export let showNavBtns;
	export let navBtnsIconColor = 'rgba(0, 0, 0, 0.6)';
	export let rightBtnIcon;
</script>

<button
	disabled={!showNavBtns.start}
	class="sts___right___nav___btn sts___btn sts___nav___btn"
	on:click={() => onNavBtnClick('right')}
>
	{#if rightBtnIcon}
		<svelte:component this={rightBtnIcon} />
	{:else}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke={navBtnsIconColor}
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			class="feather feather-arrow-right"
		>
			<line x1="5" y1="12" x2="19" y2="12" />
			<polyline points="12 5 19 12 12 19" />
		</svg>
	{/if}
</button>
