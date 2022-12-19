<script>
	import animate from './utils/animate';
	import { getNormalizedScrollLeft } from '$lib/utils/getNormalizedScrollLeft';

	import { onMount } from 'svelte/internal';
	import { debounce } from './utils/debounce';
	import { json } from '@sveltejs/kit';

	export let isRTL;
	export let activeTab;
	export let onTabClick;
	export let scrollSelectedToCenterOfView = false;
	export let scrollSelectedToEndOfView = false;
	export let tabsScrollAmount = 6;
	let tabsRef;
	let tabRef;
	let showScrollBtns = {
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

	const handleTabs = (el) => {
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
					// const tabRects = e.target.getBoundingClientRect();
					// const tabsBounding = el.getBoundingClientRect();
					const { tabsRects, tabRects } = getTabsRects(el, e.target);
					const centerOfViewValue = scrollSelectedToCenterOfView
						? tabsRects.clientWidth / 2 - tabRects.width
						: 0;
					const endOfViewValue = scrollSelectedToEndOfView
						? tabsRects.clientWidth - tabRects.width
						: 0;
					const additionalScrollValue = centerOfViewValue || endOfViewValue;
					if (tabRects.right > tabsRects.right) {
						const pushScrollValue =
							el.scrollLeft + (tabRects.right - tabsRects.right) + additionalScrollValue;
						scroll(pushScrollValue, 300, true);
					} else if (tabRects.left < tabsRects.left) {
						const pushScrollValue =
							el.scrollLeft + (tabRects.left - tabsRects.left) - additionalScrollValue;
						scroll(pushScrollValue, 300, true);
					}
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

		if (tabRects && tabRects) {
			const scrollLeft = getNormalizedScrollLeft(tabsRef, isRTL ? 'rtl' : 'ltr');
			const scrollWidth = tabsRef.scrollWidth;
			const clientWidth = tabsRef.clientWidth;
			const showStartScroll = Math.floor(scrollLeft.toFixed(2)) > 1;

			const showEndScroll = Math.ceil(scrollLeft.toFixed(2)) < scrollWidth - clientWidth - 1;
			showScrollBtns = {
				start: showStartScroll,
				end: showEndScroll
			};
			if (tabRects.left < tabsRects.left) {
				// left side of button is out of view
				const nextScrollStart = tabsRects.scrollLeft + (tabRects.left - tabsRects.left);

				scroll(nextScrollStart, 300, true, tabsRef);
			} else if (tabRects.right > tabsRects.right) {
				// right side of button is out of view
				const nextScrollStart = tabsRects.scrollLeft + (tabRects.right - tabsRects.right);

				scroll(nextScrollStart, 300, true, tabsRef);
			}
		}
	});

	const onTabsScroll = debounce((e) => {
		const scrollLeft = getNormalizedScrollLeft(e.target, isRTL ? 'rtl' : 'ltr');
		const scrollWidth = e.target.scrollWidth;
		const clientWidth = e.target.clientWidth;
		const showStartScroll = Math.floor(scrollLeft.toFixed(2)) > 1;

		const showEndScroll = Math.ceil(scrollLeft.toFixed(2)) < scrollWidth - clientWidth - 1;

		if (showStartScroll !== showScrollBtns.start || showEndScroll !== showScrollBtns.end) {
			showScrollBtns = {
				start: showStartScroll,
				end: showEndScroll
			};
		}
	});
</script>

<div class="sts___tabs___container">
	<div class="sts___nav___btn___container display___md___none">
		{#if isRTL}
			<button
				disabled={!showScrollBtns.end}
				class="sts___right___nav___btn sts___btn sts___nav___btn"
				on:click={() => onNavBtnClick('right')}>right</button
			>
		{:else}
			<button
				disabled={!showScrollBtns.start}
				class="sts___left___nav___btn sts___btn sts___nav___btn"
				on:click={() => onNavBtnClick('left')}>left</button
			>
		{/if}
	</div>
	<div
		class="sts___tabs  hide___sts___tabs___scroll"
		use:handleTabs
		bind:this={tabsRef}
		on:scroll={onTabsScroll}
	>
		<slot />
	</div>
	<div class="sts___nav___btn___container display___md___none">
		{#if isRTL}
			<button
				disabled={!showScrollBtns.start}
				class="sts___left___nav___btn sts___btn sts___nav___btn"
				on:click={() => onNavBtnClick('left')}>left</button
			>
		{:else}
			<button
				disabled={!showScrollBtns.end}
				class="sts___right___nav___btn sts___btn sts___nav___btn"
				on:click={() => onNavBtnClick('right')}>right</button
			>
		{/if}
	</div>
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
