zRS - Responsive Slider - v2.2
===

2.2 Update:
---

Added additional options to support image swapping on smaller viewports, this can be invoked by using the following structure:

	$('.slider').zRS({

		sizes: {

			mobile : 480,
			tablet : 768

		}

	});

The labels 'mobile' and 'tablet' are just examples you can use any label and any sizes. The number in the option refers to which data attribute will be read if the screensize is SMALLER than the number; data-src will be used if it's larger than the highest value.

Here's a markup example for the above example.

	<img src="_blank.gif" alt="example" data-src="highres.jpg" data-tablet="midres.jpg" data-mobile="smallres.jpg" />

If the slide itself isn't an image then it will search the slide for the images!

Basic Implementation:
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

Use the following JS structure when implementing the slider to your webpage.

	Update coming soon...

Some options aren't compatable with one another, make sure you check the console if things aren't working correctly, you will get an error message that gives you more insight.

Options:
---

Here's a list of options with all their defualt values:

	delay: 5000, 				// The amount of time before the slide transitions automatically, set to 0 to turn off automatic transition.
	speed : 1000, 				// The speed of the animation.
	transition : 'slide', 		// Transition type, currently 'slide' and 'fade' are the only ones.
	procedural : false, 		// Proceedural image loading, more info below.
	pager : false, 				// A selector for pagination e.g. $('.pager').
	pauseOnHover : false, 		// Explains itself!
	visibleSlides : 1, 			// The number of slides visible at anytime, not comatable with fade.
	slideSpacing : 0,			// The spacing in pixels between each slide.
	pre_trans_callback : null,	// A callback just before the slide transitions.
	trans_callback : null, 		// A callback for when the slide has finished it's transition.
	load_callback : null,		// A callback for when the slide has finished loading.
	sizes: null 				// An object full of sizes to swap out for smaller images on mobile devices.

Methods:
---

zRS has a few methods that you can call in order to manipulate the plugin once it's up and running, they are as follows:

	Update coming soon...

Bind them to whatever events you need to!