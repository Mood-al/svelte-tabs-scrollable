<script>
	import RightArrowIcon from './RightArrowIcon.svelte';
	export let onNavBtnClick;
	export let showNavBtns;
	export let rightBtnIcon;
</script>

<button
	disabled={!showNavBtns.end}
	class="sts___right___nav___btn sts___btn sts___nav___btn"
	on:click={() => onNavBtnClick('right')}
>
	{#if rightBtnIcon}
		<svelte:component this={rightBtnIcon} />
	{:else}
		<RightArrowIcon />
	{/if}
</button>
