$(document).ready(function() {

	$('.slider').zRS({

		pager: $('.pager'),
		visibleSlides: 1,
		touch: true,
		transition: 'verticalSlide',
		slideBy: 2

	});

	$('.backstretch').zRS({

		pager: $('.bs-pager'),
		backstretch : true,
		transition: 'fade',
		procedural: true

	});

});