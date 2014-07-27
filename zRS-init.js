$(document).ready(function() {

	$('.slider').zRS({

		pager: $('.pager'),
		procedural: true,
		touch: true,
		transition: 'slide',
		slideBy: 1

	});

	$('.backstretch').zRS({

		pager: $('.bs-pager'),
		backstretch : true,
		transition: 'fade'

	});

});