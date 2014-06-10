

/* Plugin Body
*/
;(function ( $, window, document, undefined ) {

	"use strict";

	var SliderBox = {
		init: function(el, opts){
			this.opts = opts;
			this.wrap = $(el);
			this.slides = opts.slides;
			this.prev = opts.prev;
			this.next = opts.next;

			this.pos = 0;

			this.getLen();
			this.getHeight(0);
			this.setProps();
			this.setListeners();
		},
		getLen: function(){
			// count the total n° of slides (we subtract one as all the logic
			// below is zero-based)
			this.len = this.slides.length - 1;
		},
		getHeight: function(index){
			// get the height of the first/current slide so we can compare the next one's
			// height and fire the animation to adjust the wrapper's height if needed
			this.lastSlideH = this.slides.eq(index).outerHeight();
		},
		setProps: function(){
			// we make sure that the minimum required css stylings are in place
			this.wrap.css({ 
				position: 'relative',
				height: this.lastSlideH
			});
			this.slides.css({
				position: 'absolute'
			});
			// we hide all slides apart from the first one
			this.slides.slice(1).hide();
		},
		move: function(dir){
			if (dir === 'prev'){
				this.pos = ( this.pos-- === 0 ) ? this.len : this.pos--;
			} else {
				this.pos = ( this.pos++ === this.len ) ? 0 : this.pos++;
			}
			// perform fading
			this.slides.eq( this.pos ).fadeIn(2000).siblings().fadeOut(2000);

			if ( this.opts.animateWrap ) { 
				this.animateWrap();
			}
		},
		animateWrap: function(resize){
			// check next/current height
			this.nextSlideH = this.slides.eq( this.pos ).outerHeight();
			// perform animation only if next image has a different height or
			// if it's invoked on resize (and opts.responsive is true)
			if( this.nextSlideH !== this.lastSlideH || resize ){
				this.wrap.stop().animate({
					height: this.nextSlideH
				});
				// cache the height of the currently visible slide
				this.lastSlideH = this.nextSlideH;
			}
		},
		setListeners: function(){
			var self = this;
			this.prev.on('click', function(){
				self.move('prev');
			});
			this.next.on('click', function(){
				self.move();
			});
			if ( this.opts.resize ){
				$(window).resize(function(){
					self.getHeight(self.pos);
					self.animateWrap(true);
				});
			}
		},
	};

	/**
	 * Object.create Polyfill for ECMAScript 5 Support
	 * http://leoasis.github.io/posts/2013/01/24/javascript-object-creation-patterns/
	 * see also: http://jsperf.com/new-vs-object-create-including-polyfill
	 */
	if (typeof Object.create !== "function") {
		Object.create = (function () {
			function F() {};
			return function (o) {
				F.prototype = o;
				return new F();
			};
		})();
	}


    $.fn.sliderBox = function(custom){

        // Create some defaults, extend them with any options that the user passes in.
        var opts = $.extend( {}, {
									// Defaults
									animateWrap: true,
									resize: true
								},
								// User-defined overrides
								custom);

        return this.each( function(){

			// We set up the prototype chain...
			var sliderBox = Object.create(SliderBox);
			// ...and get the ball rolling, passing the node (wrapper) where
			// the whole plugin fires and the options as arguments
			sliderBox.init( this, opts );
        });
    };

})( jQuery, window, document );




(function(){
	// Slider options
	var slider = $("#mainSlider"),
		// tempo fra una slide l'altra
			timing = 5000,
			prevB = $('.sl-prev'),
			nextB = $('.sl-next');

	if(slider){

		slider.sliderBox({
			slides: $('.mainSlides img'),
			prev: prevB,
			next: nextB
		});

		var rotation = (function(){
			var slide = function(){
				nextB.trigger('click');
				init();
			},
			init = function(){
				setTimeout(function(){
					slide();
				},timing);
			};
			return{
				init: init
			};
		})();

		rotation.init();

	}


	// Menu toggler
	// Responsive Menu

	var toggler = $('#toggler'),
		 closer = $('#closer'),
		 menu = $('#tg_menu');

	toggler.on('click', function(){
		menu.addClass('open_menu');
	});

	closer.on('click', function(){
		menu.removeClass('open_menu');
	});


})();