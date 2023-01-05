# svelte-tabs-scrollable

> A simple svelte scrollable tabs with a lot of additional features and with fully supporting of RTL mode
> This package is the Svelte version of <a href="https://www.npmjs.com/package/react-tabs-scrollable" target="_blank" rel="noopener"><span>react-tabs-scrollable</span> </a> package!!

[![NPM](https://img.shields.io/npm/v/svelte-tabs-scrollable.svg)](https://www.npmjs.com/package/svelte-tabs-scrollable) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save svelte-tabs-scrollable
yarn add svelte-tabs-scrollable
```

## Demo

### <a href="https://svelte-tabs-scrollable.vercel.app" target="_blank" rel="noopener"><span>Demo</span> </a>

## Features

- This package is the svelte version of <code>react-tabs-scrollable </code> package!!
- Easy to start with it takes you less than minute to start it up!
- It has many features and so easy to customize
- Fully support for RTL (actually the reason why I built this component is because RTL)
- You can control in literally everything inside it
- Great to use in navigation , menus and lists or any proper use for tabs
- And much more ..

## Usage

```jsx

<script>


import Tabs from 'svelte-tabs-scrollable/Tabs.svelte';
import Tab from 'svelte-tabs-scrollable/Tab.svelte';

// define the initail state of the active tab to start with
let activeTab = 10;

</script>
<Tabs {activeTab} >
	{#each [...Array(33).keys()] as item}
		<Tab>
			tab {item}
		</Tab>
	{/each}
</Tabs>

```

## Advanced example

```jsx

<script>
	// @ts-nocheck

	import Tabs from 'svelte-tabs-scrollable/Tabs.svelte';
	import Tab from 'svelte-tabs-scrollable/Tab.svelte';

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
	let showTabsScroll = false;
	let hideNavBtns = false;
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
	scrollSelectedToCenterOfView={false}
	scrollSelectedToEndOfView={false}
	animationDuration={300}
	hideNavBtnsOnMobile={true}
	{showTabsScroll}
	{hideNavBtns}
	tabsClassName="ss"
	tabsContainerClassName="ss"
>
	{#each [...Array(33).keys()] as item}
          <Tab
            as="a"
            asProps={{
                href: '/#',
                ['data-item']: item
            }}
            tabClassName="custom-class">
            tab {item}
         </Tab>
	{/each}
</Tabs>

<button on:click={() => goToEnd()}>go to end</button>
<button on:click={() => goToStart()}>go to start</button>
<button on:click={onClick}>{isRTL ? 'RTL' : 'LTR'}</button>
<div style="border : 1px solid #000; display: inline-block">
	<input bind:checked={showTabsScroll} type="checkbox" id="showTabsScroll" />
	<label for="showTabsScroll"> showTabsScroll : {showTabsScroll} </label>
</div>
<div style="border : 1px solid #000; display: inline-block">
	<input bind:checked={hideNavBtns} type="checkbox" id="hideNavBtns" />
	<label for="hideNavBtns"> hideNavBtns : {hideNavBtns}</label>
</div>
```

> You can see the full examples in the <a href="https://svelte-tabs-scrollable.vercel.app/demos" target="_blank" rel="noopener"><span>demos</span></a>'s page

## Tabs' API

<table>
    <tr>
        <td>Name</td>
        <td>Default</td>
        <td>Type</td>
        <td>Description</td>
    </tr>
    <tr>
        <td><code>activeTab*</code> </td>
        <td>-</td>
        <td>integer</td>
        <td>the selected tab value which must be passed to the commponent</td>
    </tr>
    <tr>
        <td><code>onTabClick</code></td>
        <td>-</td>
        <td>function</td>
        <td> <code>function(event, value) =&gt; void</code> callback function fires on tab click. It has two props, the first on is the event object the second on is the selected tab value</td>
    </tr>
    <!-- <tr>
        <td><code>action</code></td>
        <td>-</td>
        <td>ref</td>
        <td>react ref fired when the component mounts. It's useful if you want to some functionalities programmatically. It supports 4 function : <br />
                <div><code>onLeftBtnClick ,onRightBtnClick, goToStart, goToEnd</code></div>
                <br />  <div><code>onLeftBtnClick</code> : to control the left btn click and use your own navigation button. you can call it by so  <code>ref.onLeftBtnClick()</code> </div> 
        <br/>
       <div> <code>onRightBtnClick</code> : to control the right btn click and use your own navigation button. you can call it by so  <code>ref.onRightBtnClick()</code> 
         <br/>
        </div> 
        <br/>
       <div> <code>goToStart</code> : to control the tabs to go to the start of the tabs container. you can call it by so  <code>ref.goToStart()</code> </div> <br /> 
       <div> <code>goToEnd</code> : to control the tabs to go to the end of the tabs container. you can call it by so  <code>ref.goToEnd()</code> </div> 
        <span></span>
     </td>
    </tr> -->
	 <tr>
        <td><code>tabsContainerClassName</code></td>
        <td>-</td>
        <td> string</td>
        <td> adds a css class for the tabs' container </td>
    </tr>
	 <tr>
        <td><code>tabsClassName</code></td>
        <td>-</td>
        <td> string</td>
        <td>adds a css class for the tabs </td>
    </tr>
	 <tr>
        <td><code>goToStart</code></td>
        <td>-</td>
        <td> function</td>
        <td>  <code>goToStart</code> : a function that scrolls to the start of the tabs container. to use it you must bind it with the <Tabs /> component like so <code> bind:goToStart </code> </code> </td>
    </tr>
	 </tr>
        <tr>
        <td><code>goToEnd</code></td>
        <td>-</td>
        <td> function</td>
        <td>  <code>goToEnd</code> : a function that scrolls to the end of the tabs container. to use it you must bind it with the <Tabs /> component like so <code> bind:goToEnd</code> </code> </td>
    </tr>
	<tr>
        <tr>
        <td><code>isRTL</code></td>
        <td>false</td>
        <td>boolean</td>
        <td> sets if the direction of the tabs is RTL or not</td>
    </tr>
      </tr>
        <tr>
        <td><code>didReachEnd</code></td>
        <td>-</td>
        <td>function</td>
        <td> sets if the tabs reached the end point of the container <code>didReachEnd={(val) => console.log(val)}</code>  </td>
    </tr>
       </tr>
      </tr>
        <tr>
        <td><code>didReachStart</code></td>
        <td>-</td>
        <td>function</td>
        <td> sets if the tabs reached the start point of the container <code>didReachStart={(val) => console.log(val)}</code>  </td>
    </tr>
     <tr>
        <td><code>tabsScrollAmount</code></td>
        <td>3</td>
        <td>string | integer</td>
        <td> sets how many tabs you want to scroll on every move <code> tabsScrollAmount={3}</code>  </td>
    </tr>
     <tr>
        <td><code>animationDuration</code></td>
        <td>300s</td>
        <td> integer</td>
        <td>  sets the animation duration of the scroll when you click on the navigation buttons
               note : this will overwirte the animationDuration value <code> animationDuration={300}</code>  </td>
    </tr>
     
  <tr>
      <tr>
        <td><code>rightBtnIcon</code></td>
        <td>feather arrow-right svg icon</td>
        <td> Svelte component </td>
        <td>   sets the right navitgation button icon <code>  rightBtnIcon={SvelteComponent}</code>  </td>
    </tr>
     <tr>
        <td><code>leftBtnIcon</code></td>
        <td>feather arrow-left svg icon</td>
        <td> Svelte component </td>
        <td>   sets the left navitgation button icon <code>  leftBtnIcon={SvelteComponent}</code>  </td>
    </tr>
      <tr>
        <td><code>hideNavBtns</code></td>
        <td>false</td>
        <td> boolean</td>
        <td>  hides the navigantion button <code>  hideNavBtns={false}</code>  </td>
    </tr>
       <tr>
        <td><code>hideNavBtnsOnMobile</code></td>
        <td>true</td>
        <td> boolean</td>
        <td>  hides the navigation buttons on mobile devices  </td>
    </tr>
        <tr>
        <td><code>showTabsScroll</code></td>
        <td>false</td>
        <td> boolean</td>
        <td>  shows the scroll of the tabsn  </td>
    </tr>
      </tr>
        <tr>
        <td><code>scrollSelectedToCenterOfView</code></td>
        <td>false</td>
        <td> boolean</td>
        <td> scroll the selected tab to the center of the view.
        I will add examples about it in the demos' page
        </td>
    </tr>
	 </tr>
        <tr>
        <td><code>scrollSelectedToEndOfView</code></td>
        <td>false</td>
        <td> boolean</td>
        <td>  scroll the selected tab to the end of the view.  I will add examples about it in the demos' page </td>
    </tr>
</table>

## Tab's API

<table>
    <tr>
        <td>Name</td>
        <td>Default</td>
        <td>Type</td>
        <td>Description</td>
    </tr>
     </tr>
        <tr>
        <td><code>as</code></td>
        <td>button</td>
        <td> string</td>
        <td>  You can change the HTML element of the 
<code>
    Tab
</code> 's component by passing <code>as="a"</code>.
this becomes handy if u wanted to use anchor with href or any custom element.

> Note : if u want to pass props or attribute to the html element u must use <code>asProps</code> prop

</td>
    </tr>
     </tr>
        <tr>
        <td><code>asProps</code></td>
        <td>-</td>
        <td> object</td>
        <td> You can pass attributes to the element u passed with <code>as</code> prop.
        For example if you want <code>as="a"</code> and u want to pass <code>href</code> as an attribute.
        you can use <code>asProps</code> like so <code>asProps={{
				href: '/#',
			}}</code>.
<br />
<br />

> Note : this prop uses <code><svelte:element {...asProps} /></code> inisde so basically you can pass anything as prop to it!

</td>
    </tr>
      <tr>
        <td><code>tabClassName</code></td>
        <td><code>sts___tab sts___btn</code></td>
        <td>string</td>
        <td>you can pass a custom class to the <code>Tab</code> component</td>
    </tr>
    </table>
<br />

> Please let me see your reviews and if there're any features you want me to add them to the project!

> Dont forget to star the project on GITHUB 0_0

## License

MIT © [Mohammed Aliwi](https://github.com/Mood-al/react-tabs-scrollable)
