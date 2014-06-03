function screenSize(compare, size) {
	switch (compare) {
		case 'smaller':
			if(document.documentElement.clientWidth <= size) {
				return true;
			} else {
				return false;
			}
		break;
		case 'larger':
			if(document.documentElement.clientWidth > size) {
				return true;
			} else {
				return false;
			}
		break;
	}
};

;(function() {

	var version = '2.6.2',
		pluginName = 'zRS';

	$.fn.zRS = function(options, param) {

		var results = [];

		for(var i = 0; i < this.length; i++) {

			var self = $(this[i]);

			if(!self.data('instance') && typeof options != 'string') {

				var instance = new pluginCore(self, options);
				self.data('instance', instance);
				instance.private_methods.initialise();

			} else {

				var instance = self.data('instance');

				if(!instance) {

					console.log('['+pluginName+' v'+version+'] - You\'re trying to fire a method on an element with no instance!');
					return false;

				} else if(instance.public_methods[options]) {

					if(options == 'transition') {

						return instance.public_methods['transition'].handler(param);

					}

					if (this.length > 1) {

						results.push(instance.public_methods[options](param));

					} else {

						return instance.public_methods[options](param);
						
					}				

				} else {

					instance.private_methods.error(options + ' is not a defined method! Here\'s a list of methods! https://github.com/WsCandy/zRSv2#methods');

				}

			}

		}

		return results;

	}

	function pluginCore(self, options, param) {

		var instance = this;

		instance.defaults = {

			delay: 5000,
			speed : 1000,
			transition : 'slide',
			procedural : false,
			pager : false,
			pauseOnHover : false,
			visibleSlides : 1,
			setVisibleSlides : null,
			slideSpacing : 0,
			touch : false,
			backstretch : false,
			slideBy: 1,
			pre_trans_callback : null,
			trans_callback : null,
			sizes: null,
			load_callback : null

		};

		var settings = $.extend(instance.defaults, options);

		var inner = self.data('inner') == undefined ? self.children('.inner-slider') : self.data('inner'),
			slides = inner.children(),
			slideCount = slides.length,
			currentSlide = 0,
			mostVisible = settings.visibleSlides,
			startX,
			startY;

		instance.loading = false;

		instance.private_methods = {

			initialise: function() {

				if(settings.procedural == true) {

					instance.private_methods['procedural'].setUp();

				}

				instance.private_methods.markSlides();

				if (typeof settings.pager == 'object' && settings.pager.size() > 0) {

					instance.private_methods['pager'].setUp();

				} else if(typeof settings.pager == 'object' && settings.pager.size() <= 0) {

					instance.private_methods.error('Pager container not found!');

				}

				if(settings.touch == true) {

					instance.private_methods['touch'].setUp();

				}

				if(settings.pauseOnHover == true) {

					self.hover(function() {

						instance.public_methods.pause();

					}, function() {

						instance.public_methods.play();

					});

				}

				$(window).resize(function() {

					instance.private_methods.resizeFuncs();

				});

				$(window).load(function() {

					instance.private_methods.countSlides();
					instance.public_methods['transition'][settings.transition].setUp();
					
					if (settings.backstretch == true) {

						instance.private_methods['backstretch'].setUp();

					}

					if(slides.is(':hidden')) {

						self.find('.inner-slider').css({

							'height' : 'auto'

						});

						self.find('.loader').remove();

					}

					if($.isFunction(settings.load_callback)) {

						settings.load_callback.call(self);

					}

					instance.private_methods.setVisibleSlides();
					instance.public_methods.widthAdjustments();
					instance.public_methods.play();
					
				});

				if(slideCount <= 1) {

					instance.private_methods.error('Less than one slide, shutting down');
					return false;

				}

			},

			error: function(message) {

				console.log('['+ pluginName +' v'+version+'] - ' + message + ' D:');

			},

			countSlides: function() {

				slides = inner.children();
				slideCount = slides.length;

			},

			resizeFuncs: function() {

				instance.public_methods.pause();
				instance.public_methods.widthAdjustments();
				instance.private_methods.setVisibleSlides();

				if(settings.backstretch == true) {

					instance.private_methods['backstretch'].sizes();
					
				}

				window.clearTimeout(instance.resizeTimer);

				instance.resizeTimer = window.setTimeout(function(){

					instance.public_methods.play();
					instance.private_methods.swapSize();

				}, 200);

			},

			updateCurrentSlide: function(difference, direction) {

				if(currentSlide >= slides.length -1 && direction == 'forward') {

					currentSlide = 0;

				} else if(currentSlide == 0 && direction == 'back') {

					currentSlide = slideCount + difference;

				} else {

					currentSlide = currentSlide + difference;

				}

				if($.isFunction(settings.trans_callback)) {

					settings.trans_callback.call($('.slide[data-slide="'+currentSlide+'"]'), {

						slide: currentSlide

					});

				}

			},

			determinTarget: function(difference, direction) {

				if(currentSlide >= slides.length -1 && direction == 'forward') {

					var targetSlide = 0;

				} else if(currentSlide == 0 && direction == 'back') {

					var	targetSlide = slideCount + difference;

				} else {

					var targetSlide = currentSlide + difference;

				}

				if(targetSlide < 0) {

					var targetSlide = slides.length -1;

				} else if(targetSlide > slides.length -1) {

					var targetSlide = 0;

				}

				return targetSlide;

			},

			markSlides: function() {

				for(var i = 0; i < slideCount; i++) { 

					inner.children().eq(i).attr('data-slide', i).addClass('slide');

				}

			},

			procedural: {

				setUp: function() {

					for(var i = 0; i < slideCount; i++) {

						var slide = inner.children().eq(i);

						if(!(slide.is('img'))) {

							slide = slide.find('img');

						}

						if(i == 0) {

							slide.attr('src', slide.attr('data-'+instance.private_methods.deriveSize()));

						}

					}

				},

				transition: function(direction, difference) {
					
					instance.loading = true;

					var targetSlide = inner.children('*[data-slide='+instance.private_methods.determinTarget(difference, direction)+']');
					var source = instance.private_methods.deriveSize();

					if(!(targetSlide.is('img'))) {

						targetSlide = targetSlide.find('img');

					}

					if(targetSlide.attr('src') != targetSlide.data(source)) {

						targetSlide.unbind().load(function(){

							settings.backstretch ? instance.private_methods['backstretch'].sizes() : '';
							instance.loading = false;
							instance.public_methods['transition'][settings.transition][direction](difference);							

						}).attr('src', targetSlide.data(source));

					} else {
						
						instance.loading = false;
						instance.public_methods['transition'][settings.transition][direction](difference);
							
					}					

				}

			},

			swapSize : function() {

				var size = instance.private_methods.deriveSize();
				var slide = self.find('*[data-slide='+currentSlide+']');

				if(!(slide.is('img'))) {

					slide = slide.find('img');

				}

				if(slide.attr('src') != slide.data(size)) {

					slide.unbind().attr('src', slide.data(size));

				}

			},

			deriveSize : function() {

				highest = 0;

				if(!settings.sizes) {

					return 'src';

				} else if(typeof settings.sizes == 'object') {

					for(var view in settings.sizes) {

						if(screenSize('smaller', settings.sizes[view])) {

							var size = String(view);

							if(settings.sizes[view] > highest) {

								highest = settings.sizes[view];

							}

						} else if(screenSize('larger', highest)) {

							var size = 'src'

						}

					}

					return size;

				}

			},

			setVisibleSlides: function(number) {

				if(!settings.setVisibleSlides) {

					return false;

				} else if(typeof settings.setVisibleSlides == 'object') {

					for(var size in settings.setVisibleSlides) {

						if(screenSize('smaller', size)) {

							settings.visibleSlides = settings.setVisibleSlides[size];
							return false;

						} else if(screenSize('larger', size)) {

							settings.visibleSlides = mostVisible;

						}

					}

				}

			},

			pager : {

				setUp: function() {

					for(var i = 0; i < slideCount; i++) { 

						$('<a />', {

							'class': 'javascript:void(0)',
							'data-target' : i

						}).appendTo(settings.pager);

					}

					instance.private_methods['pager'].update(0);

					settings.pager.children().click(function() {

						instance.public_methods.goTo($(this).data('target'));

					});

				},

				update: function(targetSlide) {


					if(typeof settings.pager == 'object' && settings.pager.size() > 0) {

						settings.pager.children().removeClass();
						settings.pager.children('a[data-target='+targetSlide+']').addClass('active');

					}

				}

			},

			touch : {

				setUp: function() {

					self.on('touchstart', function(e) {

						startX = instance.private_methods.touch.pos(e.originalEvent.touches[0].pageX, 'x');
						startY = instance.private_methods.touch.pos(e.originalEvent.touches[0].pageY, 'y');

					});

					self.on('touchmove', function(e) {

						e.preventDefault();

					});

					self.on('touchcancel, touchend', function(e) {

						var x = instance.private_methods.touch.pos(e.originalEvent.changedTouches[0].pageX, 'x');
						var y = instance.private_methods.touch.pos(e.originalEvent.changedTouches[0].pageY, 'y');

						instance.private_methods.touch.end(x, y);

					});

				},

				pos: function(local, coOrd) {

					var x = Math.round(local - self.offset().left);
					var y = Math.round(local - self.offset().top);

					return coOrd == 'x' ? x : y;

				},

				end: function(x, y) {

					if(x < (startX - 100)) {

						instance.public_methods.transition.handler('forward');

					} else if(x > (startX + 100)) {

						instance.public_methods.transition.handler('back');

					}

				}

			},

			backstretch : {

				setUp: function() {

					self.css({

						'overflow' : 'hidden'

					});

					if(settings.transition == 'slide') {

						inner.css({

							'width' : Math.ceil(inner.parent().width() * (slideCount + 1)) / settings.visibleSlides + 'px'

						});

					}

					instance.private_methods['backstretch'].sizes();

				},

				sizes: function() {

					var sliderWidth = self.outerWidth();
					var sliderHeight = self.outerHeight();

					for(var i = 0; i < slides.length; i++) { 
						
						var slide = $(slides[i]);
						var slideWidth = slide.outerWidth();
						var slideHeight = slide.outerHeight();

						slide.css({

							'height' : sliderHeight + 'px',
							'width' : 'auto'							

						});

						slideWidth = slide.outerWidth();
						slideHeight = slide.outerHeight();			

						if(slideWidth < sliderWidth) {

							slide.css({

								'width' : sliderWidth + 'px',
								'height' : 'auto'

							});	

						}

						if(settings.transition == 'fade') {

							if (sliderWidth < slideWidth) {

								slide.css({
								
									'left' : sliderWidth / 2 +'px',
									'margin-left' : '-' + slideWidth / 2 + 'px'

								});

							} else {

								slide.css({
								
									'left' : '0',
									'margin-left' : '0px'

								});

							}							

						}

					}

				}

			}

		};

		instance.public_methods = {

				transition: {

					handler: function(direction, difference) {

						if(slides.is(':animated') || inner.is(':animated') || instance.loading) {

							return "Be Patient, let it finish its tranistion...";

						} else {

							difference = typeof difference == 'undefined' 
								? (direction == 'back' ? -settings.slideBy : settings.slideBy) 
								: difference;
							direction = typeof direction == 'undefined' 
								? 'forward' 
								: direction;
							var target = instance.private_methods.determinTarget(difference);

							if($.isFunction(settings.pre_trans_callback)) {

								settings.pre_trans_callback.call($('.slide[data-slide="'+target+'"]'), {

									target: target,
									current: slides.eq(currentSlide)

								});

							}

							if(settings.procedural == true) {

								instance.private_methods['procedural'].transition(direction, difference);

							} else {

								instance.public_methods['transition'][settings.transition][direction](difference);								

							}

							instance.public_methods.play();
							instance.private_methods['pager'].update(instance.private_methods.determinTarget(difference, direction));

						}

						return "Weeeeeeeeeeee... Look at it go!";

					},

					fade: {

						setUp: function() {

							slides.eq(0).show();

							slides.css({

								'top' : '0px',
								'left' : '0px'

							});

							for(var i = 0; i < slideCount; i++) {

								if(i == 0) {

									slides.eq(i).css({

										'position' : 'relative',
										'z-index' : '1'

									});

								} else {

									slides.eq(i).css({

										'position' : 'absolute',
										'z-index' : '0'

									}).hide();

								}

							}

						},

						forward: function(difference) {
							
							inner.children().eq(difference).css({

								'z-index' : '2'

							}).fadeIn(settings.speed, function() {
							
								inner.children().eq(difference).css({

									'position' : 'relative'

								});
								
								for(var i = 0; i < difference; i++) {

									inner.children().eq(0).css({

										'z-index' : '1',
										'position' : 'absolute'

									}).appendTo(inner).hide();
									
								}

								instance.private_methods.updateCurrentSlide(difference, 'forward');

							});

						},

						back : function(difference) {							

							for(var i = 0; i > difference; i--) {

								inner.children(':last-child').prependTo(inner);

							}

							inner.children().css({

								'z-index' : '0'

							});

							inner.children().eq(0).css({

								'z-index' : '1',
								'position' : 'absolute'

							}).fadeIn(settings.speed, function(){

								inner.children().eq(0).css({

									'position' : 'relative'

								});

								inner.children().not(':first-child').css({

									'z-index' : '0',
									'position' : 'absolute'

								}).hide();

								instance.private_methods.updateCurrentSlide(difference, 'back');

							});

						}
						
					},

					slide: {

						setUp: function() {
							
							slides.wrapAll('<div class="carousel" />');
							slides.show();
							inner = self.children('.inner-slider').children('.carousel');

							self.data('inner', inner);

							inner.css({

								'position' : 'relative'

							});

							slides.css({

								'float' : 'left',
								'margin-left' : settings.slideSpacing / 2 + 'px',
								'margin-right' : settings.slideSpacing / 2 + 'px'

							});							

							instance.public_methods.widthAdjustments();

						},

						forward: function(difference) {

							inner.animate({

								'left' : '-' + slides.outerWidth(true) * difference + 'px'


							}, settings.speed, function(){

								inner.css({

									'left' : '0px'

								});

								for(var i = 0; i < difference; i++) {

									inner.children(':first-child').appendTo(inner);

								}

								instance.private_methods.updateCurrentSlide(difference, 'forward');

							});

						},

						back: function(difference) {

							for(var i = 0; i > difference; i--) {

								inner.children(':last-child').prependTo(inner);

							}

							inner.css({

								'left' : '-' + slides.outerWidth(true) * Math.abs(difference) + 'px'

							});

							inner.animate({

								'left' : '0px'

							}, settings.speed, function() {

								instance.private_methods.updateCurrentSlide(difference, 'back');
								
							});

						}

					},

					verticalSlide: {

						setUp: function() {
							
							slides.wrapAll('<div class="carousel" />');
							slides.show();
							inner = self.children('.inner-slider').children('.carousel');

							self.data('inner', inner);

							inner.css({

								'position' : 'relative'

							});

							slides.css({

								'float' : 'left',
								'margin-left' : settings.slideSpacing / 2 + 'px',
								'margin-right' : settings.slideSpacing / 2 + 'px'

							});							

							instance.public_methods.widthAdjustments();

						},

						forward: function(difference) {

							inner.animate({

								'top' : '-' + slides.outerHeight(true) * difference + 'px'


							}, settings.speed, function(){

								inner.css({

									'top' : '0px'

								});

								for(var i = 0; i < difference; i++) {

									inner.children(':first-child').appendTo(inner);

								}

								instance.private_methods.updateCurrentSlide(difference, 'forward');

							});

						},

						back: function(difference) {

							for(var i = 0; i > difference; i--) {

								inner.children(':last-child').prependTo(inner);

							}

							inner.css({

								'top' : '-' + slides.outerHeight(true) * Math.abs(difference) + 'px'

							});

							inner.animate({

								'top' : '0px'

							}, settings.speed, function() {

								instance.private_methods.updateCurrentSlide(difference, 'back');
								
							});

						}

					}

				},

				widthAdjustments: function() {

					if(settings.transition == 'slide' && settings.backstretch != true) {

						slides.css({

							'width' : (inner.parent().width() / settings.visibleSlides) - settings.slideSpacing + 'px'

						});

						inner.css({

							'width' : Math.ceil(inner.parent().width() * slideCount) / settings.visibleSlides + 'px'

						});
						
					} else if(settings.transition == 'verticalSlide' && settings.backstretch != true) {

						slides.css({

							'width' : (inner.parent().width() / settings.visibleSlides) - settings.slideSpacing + 'px'

						});

						inner.css({

							'height' : Math.ceil(slides.height() * slideCount) / settings.visibleSlides + 'px'

						});

						inner.parent().css({

							'height' : slides.height() + 'px'

						});

					}

				},

				goTo: function(target) {

					var difference = target - currentSlide;

					if(target > slideCount -1) {

						instance.private_methods.error('Stop trying to go to a slide that doesn\'t exist!');
						return "Denied!";

					}

					if(target > currentSlide) {

						instance.public_methods['transition'].handler('forward', difference);

					} else if(target < currentSlide) {

						instance.public_methods['transition'].handler('back', difference);

					} else {

						instance.private_methods.error('You\'re trying to go to the same slide you\'re on!');
						return "Denied!";

					}

					return 'Get you going to slides, '+ settings.transition +' it baby!';

				},

				play: function() {

					window.clearTimeout(self.timer);

					if(settings.delay > 0) {

						self.timer = window.setTimeout(instance.public_methods['transition'].handler, settings.delay);						
						
					}

					return "Playing!";

				},

				pause: function() {

					window.clearTimeout(self.timer);

					return "Paused!";

				}

		};

	}
	
})();