(function($){
	
	// Defining the bubbleSlideshow plugin
	
	$.fn.bubbleSlideshow = function(photos){
	
		if(!$.isArray(photos)){
			throw new Error("You need to pass an array of photo URLs as a parameter!");
		}
		
		photos = photos.reverse();
		
		var ul = this.addClass('bubbleSlideshow');
		
		$.each(photos,function(){
			ul.append('<li class="bubbleImageFrame"><img src="'+this+'" /></li>');
		});
		
		// These methods are available externally and 
		// can be used to control the bubble slideshow
		
		ul.showNext = function(){
			showNext(ul);
		};
		
		ul.showPrev = function(){
			showPrev(ul);
		};

		ul.autoAdvance = function(timeout){
			timeout = timeout || 6000;
			autoAdvance(ul,timeout);
		};

		ul.stopAutoAdvance = function(){
			stopAutoAdvance(ul);
		};

		return ul;
	};
	
	// These functions are not available outside the plugin. The stage
	// parameter corresponds to the UL element that holds the slideshow.
	
	function autoAdvance(stage,timeout){
		stage.data('timeout',setTimeout(function(){
			showNext(stage);
			autoAdvance(stage,timeout);
		},timeout));
	}
	
	function stopAutoAdvance(stage){
		clearTimeout(stage.data('timeout'));
	}
	
	function showNext(stage){
		showFrame(stage, stage.find('li.bubbleImageFrame').first());
	}
	
	function showPrev(stage){
		showFrame(stage, stage.find('li.bubbleImageFrame').last().prev());
	}
	
	function showFrame(stage, frame ){
		
		// This function shows a frame,
		// passed as a jQuery object
		
		if(stage.data('working')){
			// Prevents starting more than
			// one animation at a time:
			return false;
		}
		stage.data('working',true);
		
		var frame = frame.hide().detach();
		
		// Using the showBubbles function, defined below.
		// The frame is showed after the bubble animation is over.
		
		showBubbles( stage, frame.find('img').attr('src'), function(){
			stage.append(frame);
			stage.data('working',false);
			
			// This returns a jQuery Promise object.
			return frame.fadeIn('slow');
		});
		
	}
	
	// This function is called by the showFrame method.
	// It taks the UL, an image URL, and a function func,
	// called once all the bubbles are in place.
	
	function showBubbles( stage, imgURL, func ){

		// This function appends a new LI element to the UL
		// and uses it to hold and animate the bubbles.

		var i = 0,
			bubbles = [],
			totalBubbles = 75,
			stageWidth = stage.outerWidth(),
			stageHeight = stage.outerHeight(),
			emptyFunc = function(){};
		
		// This li holds the bubbles
		var li = $('<li class="bubbleStage">').appendTo(stage);

		// This function is passed to the flyFrom method call:
		
		var callBack = function(){
			
			// Waiting for the func function to
			// finish and removing the li.
			
			$.when(func()).then(function(){
				li.remove();
			});
		};
		
		for( i=0; i<totalBubbles; i++ ){
			
			var x	 = rand(0, stageWidth),
				y	 = rand(0,stageHeight),
				size = rand(30,150);
			
			var bubble = new Bubble( x, y, size, imgURL );
			li.append(bubble.elem);
			
			bubbles.push(bubble);
		}
		
		// Sorting the bubbles so that the
		// bubbles closest to the top border of
		// the image come first:
		
		bubbles = bubbles.sort(function( b1, b2 ){
			return b1.top+b1.size/2 > b2.top+b2.size/2;
		});
		
		// Looping through all the bubbles,
		// and triggering their flyFrom method
		
		for( i=0; i<bubbles.length; i++){
			
			(function( bubble, i ){
				setTimeout(function(){
					
					bubble.flyFrom(
						stageWidth/2,
						stageHeight+200,
						250,
						(i == bubbles.length-1) ? callBack : emptyFunc
					);
					
				}, Math.floor(i/5)*100);
				
			})( bubbles[i], i );
		}
	}
	
	// This is the Bubble class. It takes left and top
	// coordinates, size (diameter) and a image URL
	
	function Bubble( left, top, size, imgURL ){

		this.top	= top;
		this.left	= left;
		this.size	= size;
		
		top -= size/2;
		left-= size/2;
		
		this.elem = $('<div>',{
			'class':'bubble',
			'css'	: {
				'width'		: size,
				'height'	: size,
				'top'		: top,
				'left'		: left,
				'background-position': (-left)+'px '+(-top)+'px',
				'background-image': 'url('+imgURL+')'
			}
		});
	
	}
	
	// The fly from method takes a starting position, time,
	// and a callback function, executed when the animation finishes.
	
	Bubble.prototype.flyFrom = function( startX, startY, time, callBack ){
	
		time = time || 250;
		callBack = callBack || function(){};
		
		startX -= this.size/2;
		startY -= this.size/2;
		
		// Offsetting the element
		
		this.elem.css({
			'display'				: 'block',
			'backgroundPositionX'	: -startX,
			'backgroundPositionY'	: -startY,
			'left'					: startX,
			'top'					: startY
		});
		
		// Animating it to where it should be
		
		this.elem.animate({
			'backgroundPositionX'	: -this.left,
			'backgroundPositionY'	: -this.top,
			'left'					: this.left,
			'top'					: this.top
		}, time, 'easeOutCirc', callBack );
	
	};
	
	// Helper function for generating random
	// values in the [min,max] range
	
	function rand( min, max ){
		return Math.floor( Math.random()*((max+1)-min) + min);
	}
	
	// Define a easeOutCirc function. Copied from
	// http://gsgd.co.uk/sandbox/jquery/easing/
	
	$.easing.easeOutCirc = function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	};
	
})(jQuery);