import animate from './animate';

export const scroll = (scrollValue = 100, duration = 300, animation = true, element) => {
	if (animation) {
		animate('scrollLeft', element, scrollValue, {
			duration: duration || 300
		});
	} else {
		element.scrollLeft = scrollValue;
	}
};
