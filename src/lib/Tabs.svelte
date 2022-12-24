<script>
	import animate from './utils/animate';
	import { getNormalizedScrollLeft } from '$lib/utils/getNormalizedScrollLeft';
	import { onMount } from 'svelte/internal';
	import { debounce } from './utils/debounce';
	import LeftArrowBtn from './LeftArrowBtn.svelte';
	import RightArrowBtn from './RightArrowBtn.svelte';

	export let isRTL = false;
	export let activeTab;
	export let onTabClick;
	export let scrollSelectedToCenterOfView = false;
	export let scrollSelectedToEndOfView = false;
	export let tabsScrollAmount = 3;
	export let animationDuration = 300;
	export let hideNavBtnsOnMobile = true;
	export let showTabsScroll = false;
	export let rightBtnIcon = undefined;
	export let leftBtnIcon = undefined;
	export let hideNavBtns = false;
	export let tabsClassName = '';
	export let tabsContainerClassName = '';
	export const goToStart = () => {
		scroll(0);
	};

	export const goToEnd = () => {
		const { tabsRects } = getTabsRects();
		const { scrollWidth } = tabsRects;
		scroll((isRTL ? -1 : 1) * scrollWidth);
	};
	export const onLeftBtnClick = () => {
		scroll(tabsRef?.scrollLeft - tabRef?.clientWidth * tabsScrollAmount, animationDuration, true);
	};
	export const onRightBtnClick = () => {
		scroll(tabsRef?.scrollLeft + tabRef?.clientWidth * tabsScrollAmount, animationDuration, true);
	};

	let tabsRef;
	let tabRef;
	let showNavBtns = {
		start: false,
		end: false
	};

	export let didReachEnd;
	export let didReachStart;

	const scroll = (scrollValue = 100, duration = animationDuration, animation = true) => {
		if (animation) {
			animate('scrollLeft', tabsRef, scrollValue, {
				duration: duration || 300
			});
		} else {
			tabsRef.scrollLeft = scrollValue;
		}
	};

	const getTabsRects = (tabsEl) => {
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
			tabRects = tabsNode?.children[activeTab].getBoundingClientRect();
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
		tabRef?.classList.add('sts___tab___selected');
		[...el.children].forEach((tab, idx) => {
			tab.addEventListener('click', (e) => {
				activeTab = idx;

				if (activeTab === idx) {
					[...el.children].forEach((tab) => tab.classList.remove('sts___tab___selected'));
					e.target.classList.add('sts___tab___selected');
				}

				if (e.target.classList.contains('sts___tab___selected')) {
					const { tabsRects, tabRects } = getTabsRects(el, e.target);
					const centerOfViewValue = scrollSelectedToCenterOfView
						? tabsRects.clientWidth / 2 - tabRects.width / 2
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
			onLeftBtnClick();
		}
		if (dir === 'right') {
			onRightBtnClick();
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

				scroll(nextScrollStart, animationDuration, true, tabsRef);
			} else if (tabRects.right > tabsRects.right) {
				// right side of button is out of view
				const nextScrollStart =
					tabsRects.scrollLeft + (tabRects.right - tabsRects.right) + additionalScrollValue;

				scroll(nextScrollStart, animationDuration, true, tabsRef);
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
		didReachStart(!showStartScroll);
		didReachEnd(!showEndScroll);
	};
	const onTabsScroll = debounce((e) => {
		updateNavbtnsState(e.target);
	});

	$: {
		// it's really weird -_- we don't have useEffect to add isRTL as a dep!
		// so i put the isRTL and it seems useless just to run the function on direction change"
		isRTL;
		const { tabsRects, tabRects } = getTabsRects();
		scrollSelectedIntoView(tabsRects, tabRects);
	}
</script>

<div class={`sts___tabs___container ${tabsContainerClassName}`}>
	{#if !((!showNavBtns.end && !showNavBtns.start) || hideNavBtns)}
		<div class={`sts___nav___btn___container ${hideNavBtnsOnMobile ? 'display___md___none' : ''}`}>
			{#if isRTL}
				<RightArrowBtn {rightBtnIcon} {onNavBtnClick} {showNavBtns} />
			{:else}
				<LeftArrowBtn {leftBtnIcon} {onNavBtnClick} {showNavBtns} />
			{/if}
		</div>
	{/if}

	<div
		class={`sts___tabs ${tabsClassName} ${!showTabsScroll ? 'hide___sts___tabs___scroll' : ''}`}
		use:handleTabsAction
		bind:this={tabsRef}
		on:scroll={onTabsScroll}
	>
		<slot />
	</div>
	{#if !((!showNavBtns.end && !showNavBtns.start) || hideNavBtns)}
		<div class={`sts___nav___btn___container ${hideNavBtnsOnMobile ? 'display___md___none' : ''}`}>
			{#if isRTL}
				<LeftArrowBtn {leftBtnIcon} {onNavBtnClick} {showNavBtns} />
			{:else}
				<RightArrowBtn {rightBtnIcon} {onNavBtnClick} {showNavBtns} />
			{/if}
		</div>
	{/if}
</div>

<style>
	/* created at 5:39 AM at 11/04/2022*/
	/* react tabs scrollable */

	:global(:root) {
		--sts-primary-color: #fd9e02;
		--sts-gray-color: #ddd;
		--sts-white-color: #fff;
	}
	.sts___tabs___container {
		display: -webkit-flex;
		display: flex;
		box-sizing: border-box;
	}
	.sts___tabs.hide___sts___tabs___scroll {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
	.sts___tabs.hide___sts___tabs___scroll::-webkit-scrollbar {
		display: none; /* for Chrome, Safari, and Opera */
	}
	.sts___tabs {
		display: -webkit-flex;
		display: flex;
		overflow: auto;
		padding: 10px 0;
	}

	:global(.display___block) {
		display: block;
	}
	:global(.display____inline___block) {
		display: inline-block;
	}
	:global(.display___none) {
		display: none !important;
	}
	@media (max-width: 991.98px) {
		:global(.display___md___none) {
			display: none !important;
		}
	}

	.sts___tabs___container {
		display: flex;
	}
	@media (max-width: 991.98px) {
		.sts___tabs___container {
			padding: 5px;
		}
	}
	.sts___tabs {
		display: flex;
		overflow: auto;
		padding: 10px 0;
	}
	.sts___tabs.hide___sts___tabs___scroll {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
	.sts___tabs.hide___sts___tabs___scroll::-webkit-scrollbar {
		display: none;
	}
	:global(.sts___tab) {
		padding: 10px 40px;
		white-space: nowrap;
		vertical-align: middle;

		text-align: center;
		margin: 0 5px;
	}

	@media (max-width: 991.98px) {
		:global(.sts___tab) {
			margin: 0 2px;
		}
	}
	@media (max-width: 767.98px) {
		:global(.sts___tab) {
			padding: 5px 20px;
		}
	}

	:global(.sts___nav___btn___container) {
		display: flex;
	}

	:global(.sts___btn) {
		cursor: pointer;
		background-color: transparent;
		border-radius: 40px;
		border: 2px solid var(--sts-gray-color);
		/* transition: 0.3s all linear; */
	}
	:global(.sts___tab___selected) {
		background-color: var(--sts-primary-color);
		color: var(--sts-white-color);
		box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
	}
	:global(.sts___nav___btn) {
		color: rgba(0, 0, 0, 0.6);
		font-size: 18px;
		font-weight: bold;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	:global(.sts___nav___btn):hover {
		background-color: var(--sts-primary-color);
		transition: 0.5s all;
	}
	:global(.sts___nav___btn :hover > svg) {
		stroke: var(--sts-white-color);
	}
	@media (max-width: 767.98px) {
		:global(.sts___nav___btn > svg) {
			width: 15px;
		}
	}
	:global(button:disabled.sts___btn),
	:global(button[disabled].sts___btn) {
		cursor: not-allowed;
		color: var(--sts-gray-color);
		pointer-events: none;
	}
	:global(button:disabled.sts___btn),
	:global(button[disabled].sts___btn svg) {
		stroke: var(--sts-gray-color);
	}
	/* 
	.sts___right___nav___btn {
	}
	.sts___left___nav___btn {
	} */
</style>
