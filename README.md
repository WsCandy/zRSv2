zRS - Responsive Slider
===

Here's a list of options with all their defualt values:

	speed : 1000
	delay : 0
	pager : 'undefined'
	slideSpacing: 0
	next : $('.next', this)
	prev : $('.prev', this)
	visibleSlides : 1
	transition: 'slide'
	pauseOnHover : false
	trans_callback : null
	load_callback : null
	adjustWidth : true
	fixed : false

Implementation:
---

Use the following HTML structure when implementing the slider to your webpage.

	<div class="slider"> <!-- The element the slider needs to be called on -->
		<div class="inner-slider"> <!-- Inner slider is necessary to make the plugin function correctly, make sure this is 100% width if you want it responsive! -->
			<img src="img/trans/1.jpg" alt="Tester" />
			<img src="img/trans/2.jpg" alt="Tester" />
			<img src="img/trans/3.jpg" alt="Tester" />
			<img src="img/trans/4.jpg" alt="Tester" />
			<img src="img/trans/5.jpg" alt="Tester" />
			<img src="img/trans/6.jpg" alt="Tester" />
			<img src="img/trans/7.jpg" alt="Tester" />
			<img src="img/trans/8.jpg" alt="Tester" />
		</div>
	</div>

Basic Implementation :
---

	$('.slider').zRS({

		speed : 1000,
		delay: 6000,
		transition: 'fade'

	});

Some options aren't compatable with one another, make sure you check the console if things aren't working correctly, you will get an error message that gives you more insight :)

Methods
---

zRS has a few methods that you can call in order to manipulate the plugin once it's up and running, they are as follows:

	$('.slider').zRS('transition', 'next'); // These speak for themselves...
	$('.slider').zRS('transition', 'prev'); // These speak for themselves...

	$('.slider').zRS('pause'); // As do these...
	$('.slider').zRS('resume'); // As do these...

	$('.slider').zRS('slideWidthAdjust'); // Forces the plugin to update it's height and width calculations

	$('.slider').zRS('setVisibleSlides', 2); // Set the number of visible slides

Bind them to whatever events you need to!








