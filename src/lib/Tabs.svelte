<script>
	import animate from './utils/animate';
	import { getNormalizedScrollLeft } from '$lib/utils/getNormalizedScrollLeft';
	import { onMount } from 'svelte/internal';
	import { debounce } from './utils/debounce';

	export let isRTL;
	export let activeTab;
	export let onTabClick;
	export let scrollSelectedToCenterOfView = true;
	export let scrollSelectedToEndOfView = true;
	export let tabsScrollAmount = 3;
	export let goToStart = () => {
		scroll(0);
	};
	export let goToEnd = () => {
		const { tabsRects } = getTabsRects();
		const { scrollWidth } = tabsRects;
		scroll((isRTL ? -1 : 1) * scrollWidth);
	};
	let tabsRef;
	let tabRef;
	let showNavBtns = {
		start: false,
		end: false
	};

	const scroll = (scrollValue = 100, duration = 300, animation = true) => {
		if (animation) {
			animate('scrollLeft', tabsRef, scrollValue, {
				duration: duration || 300
			});
		} else {
			tabsRef.scrollLeft = scrollValue;
		}
	};

	const getTabsRects = (tabsEl, tabEl) => {
		const tabsNode = tabsEl ? tabsEl : tabsRef;

		let tabsRects;

		if (tabsNode) {
			const rect = tabsNode.getBoundingClientRect();

			tabsRects = {
				clientWidth: tabsNode?.clientWidth,
				scrollLeft: tabsNode.scrollLeft,
				scrollTop: tabsNode.scrollTop,
				scrollLeftNormalized: getNormalizedScrollLeft(tabsNode, isRTL ? 'rtl' : 'ltr'),
				scrollWidth: tabsNode.scrollWidth,
				top: rect.top,
				bottom: rect.bottom,
				left: rect.left,
				right: rect.right
			};
		}

		let tabRects;

		if (tabsNode) {
			tabRects = tabEl ? tabEl.getBoundingClientRect() : tabRef.getBoundingClientRect();
			if (!activeTab && activeTab !== 0) {
				console.error('svelte-tabs-scrollable : You have to add activeTab prop');
			}
		}

		return {
			tabsRects,
			tabRects
		};
	};

	const handleTabsAction = (el) => {
		if (!el.children) return;

		tabRef = el.children[activeTab];
		tabRef.classList.add('stc___tab___selected');
		[...el.children].forEach((tab, idx) => {
			tab.addEventListener('click', (e) => {
				activeTab = idx;

				if (activeTab === idx) {
					[...el.children].forEach((tab) => tab.classList.remove('stc___tab___selected'));
					e.target.classList.add('stc___tab___selected');
				}

				if (e.target.classList.contains('stc___tab___selected')) {
					const { tabsRects, tabRects } = getTabsRects(el, e.target);
					const centerOfViewValue = scrollSelectedToCenterOfView
						? tabsRects.clientWidth / 2 - tabRects.width
						: 0;
					const endOfViewValue = scrollSelectedToEndOfView
						? tabsRects.clientWidth - tabRects.width
						: 0;
					const additionalScrollValue = centerOfViewValue || endOfViewValue;
					scrollSelectedIntoView(tabsRects, tabRects, additionalScrollValue);
				}

				onTabClick(tab, idx);
			});
		});
	};

	const onNavBtnClick = (dir) => {
		if (dir === 'left') {
			scroll(tabsRef?.scrollLeft - tabRef?.clientWidth * tabsScrollAmount, 300, true);
		}
		if (dir === 'right') {
			scroll(tabsRef?.scrollLeft + tabRef?.clientWidth * tabsScrollAmount, 300, true);
		}
	};

	onMount(() => {
		const { tabsRects, tabRects } = getTabsRects();

		updateNavbtnsState(tabsRef);
		scrollSelectedIntoView(tabsRects, tabRects);
	});

	onMount(() => {
		const resizeObserver = new ResizeObserver((entries) => {
			const { tabsRects, tabRects } = getTabsRects();

			updateNavbtnsState(tabsRef);
			scrollSelectedIntoView(tabsRects, tabRects);
		});

		resizeObserver.observe(tabsRef);

		// This callback cleans up the observer
		return () => resizeObserver.unobserve(tabsRef);
	});

	const scrollSelectedIntoView = (tabsRects, tabRects, additionalScrollValue = 0) => {
		if (tabRects && tabRects) {
			if (tabRects.left < tabsRects.left) {
				// left side of button is out of view
				const nextScrollStart =
					tabsRects.scrollLeft + (tabRects.left - tabsRects.left) - additionalScrollValue;

				scroll(nextScrollStart, 300, true, tabsRef);
			} else if (tabRects.right > tabsRects.right) {
				// right side of button is out of view
				const nextScrollStart =
					tabsRects.scrollLeft + (tabRects.right - tabsRects.right) + additionalScrollValue;

				scroll(nextScrollStart, 300, true, tabsRef);
			}
		}
	};

	const updateNavbtnsState = (tabsElement) => {
		const scrollLeft = getNormalizedScrollLeft(tabsElement, isRTL ? 'rtl' : 'ltr');
		const scrollWidth = tabsElement.scrollWidth;
		const clientWidth = tabsElement.clientWidth;
		const showStartScroll = Math.floor(scrollLeft.toFixed(2)) > 1;

		const showEndScroll = Math.ceil(scrollLeft.toFixed(2)) < scrollWidth - clientWidth - 1;

		showNavBtns = {
			start: showStartScroll,
			end: showEndScroll
		};
	};
	const onTabsScroll = debounce((e) => {
		updateNavbtnsState(e.target);
	});
</script>

<div class="sts___tabs___container">
	{#if !(!showNavBtns.end && !showNavBtns.start)}
		<div class="sts___nav___btn___container display___md___none">
			{#if isRTL}
				<button
					disabled={!showNavBtns.end}
					class="sts___right___nav___btn sts___btn sts___nav___btn"
					on:click={() => onNavBtnClick('right')}>right</button
				>
			{:else}
				<button
					disabled={!showNavBtns.start}
					class="sts___left___nav___btn sts___btn sts___nav___btn"
					on:click={() => onNavBtnClick('left')}>left</button
				>
			{/if}
		</div>
	{/if}

	<div
		class="sts___tabs  hide___sts___tabs___scroll"
		use:handleTabsAction
		bind:this={tabsRef}
		on:scroll={onTabsScroll}
	>
		<slot />
	</div>
	{#if !(!showNavBtns.end && !showNavBtns.start)}
		<div class="sts___nav___btn___container display___md___none">
			{#if isRTL}
				<button
					disabled={!showNavBtns.start}
					class="sts___left___nav___btn sts___btn sts___nav___btn"
					on:click={() => onNavBtnClick('left')}>left</button
				>
			{:else}
				<button
					disabled={!showNavBtns.end}
					class="sts___right___nav___btn sts___btn sts___nav___btn"
					on:click={() => onNavBtnClick('right')}>right</button
				>
			{/if}
		</div>
	{/if}
</div>

<style>
	.sts___tabs___container {
		display: -webkit-flex;
		display: flex;
		box-sizing: border-box;
	}
	.sts___tabs.hide___sts___tabs___scroll {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
	.sts___tabs {
		display: -webkit-flex;
		display: flex;
		overflow: auto;
		padding: 10px 0;
	}
	.sts___nav___btn___container {
		display: -webkit-flex;
		display: flex;
	}
	.sts___nav___btn {
		color: rgba(0, 0, 0, 0.6);
		font-size: 18px;
		font-weight: 700;
		display: -webkit-flex;
		display: flex;
		-webkit-justify-content: center;
		justify-content: center;
		-webkit-align-items: center;
		align-items: center;
	}
	.sts___nav___btn:disabled {
		background-color: red;
	}
	.sts___btn {
		/* cursor: pointer; */
		background-color: transparent;
		border-radius: 40px;
		border: 2px solid var(--rts-gray-color);
	}
</style>
