$(document).ready(function() {

	$('.slider').zRS({

		pager: $('.pager'),
		visibleSlides: 2,
		touch: true,
		transition: 'verticalSlide',
		slideBy: 1

	});

	$('.backstretch').zRS({

		pager: $('.bs-pager'),
		backstretch : true,
		transition: 'fade',
		procedural: true

	});

});