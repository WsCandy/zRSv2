$(document).ready(function() {

	$('.slider').zRS({

		pager: $('.pager'),
		touch: true,
		transition: 'slide',
		slideBy: 1,
		next : $('.next'),
		prev : $('.prev')

	});

	$('.backstretch').zRS({

		pager: $('.bs-pager'),
		backstretch : true,
		transition: 'fade'

	});

});