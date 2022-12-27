<script>
	import LeftArrowIcon from './LeftArrowIcon.svelte';
	export let onNavBtnClick;
	export let showNavBtns;
	export let leftBtnIcon;
</script>

<button
	disabled={!showNavBtns.start}
	class="sts___left___nav___btn sts___btn sts___nav___btn"
	on:click={() => onNavBtnClick('left')}
>
	{#if leftBtnIcon}
		<svelte:component this={leftBtnIcon} />
	{:else}
		<LeftArrowIcon />
	{/if}
</button>
