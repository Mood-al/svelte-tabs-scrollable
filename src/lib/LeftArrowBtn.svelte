<script>
	export let onNavBtnClick;
	export let showNavBtns;
	export let navBtnsIconColor = 'rgba(0, 0, 0, 0.6)';
</script>

<button
	disabled={!showNavBtns.start}
	class="sts___left___nav___btn sts___btn sts___nav___btn"
	on:click={() => onNavBtnClick('left')}
>
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
		class="feather feather-arrow-left"
	>
		<line x1="19" y1="12" x2="5" y2="12" />
		<polyline points="12 19 5 12 12 5" />
	</svg>
</button>
