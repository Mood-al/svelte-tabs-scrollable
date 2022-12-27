<script>
	export let tabClassName = '';
	export let as = undefined;
	export let asProps = {};
	const tabClasses = `sts___tab sts___btn ${tabClassName}`;
</script>

{#if as}
	<svelte:element this={as} {...asProps} class={tabClasses}>
		<slot />
	</svelte:element>
{:else}
	<button class={tabClasses}>
		<slot />
	</button>
{/if}
