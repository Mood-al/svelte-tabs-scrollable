<script>
</script>

<button class={`sts___tab sts___btn`} on:click={(e) => console.log(e)}>
	<slot />
</button>

<style>
	.sts___tab {
		padding: 10px 40px;
		white-space: nowrap;
		vertical-align: middle;
		text-align: center;
		margin: 0 7px;
	}
	.stc___tab___selected {
		background-color: orange;
		color: var(--rts-white-color);
		-webkit-box-shadow: 0 1px 4px rgb(0 0 0 / 16%);
		box-shadow: 0 1px 4px rgb(0 0 0 / 16%);
	}
</style>
