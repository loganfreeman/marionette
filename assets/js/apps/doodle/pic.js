	// This is the constructor of the pics
		
		function pic(options){
			
			// All the properties of the options object
			// are copied to the current pic:
			
			$.extend(this,options);
			
			// Creating the markup of the pic,
			// and storing it in the elem property:
			
			this.elem = $('<a>',{
				class: 'pic',
				href: this.href,
				css : {
					top : this.top,
					left : this.left,
					width: this.width,
					height: this.height
				}
			});

			var borderWidth = 5;

			// The bottom and right properties are not passed
			// as arguments, so we need to calculate them.
					
			this.bottom = this.top+this.height+2*borderWidth;
			this.right = this.left+this.width+2*borderWidth;
			
			this.image = $('<img>',{
				css:{
					left : -this.img.offsetLeft,
					top : -this.img.offsetTop
				}
			});
			
			var self = this;
			
			// Appending the image to the body so we can get
			// its dimensions. After we do this, we remove it
			// and append it to the markup stored in this.elem:
			
			this.image.hide().appendTo('body').load(function(){
				
				self.img.width = self.image.width();
				self.img.height = self.image.height();
				self.elem.append(self.image.show());
				
			}).attr('src',this.img.src);
			
		}
		
		// The prototype holds the class methods,
		// that are common for all objects.
		
		pic.prototype = {
			open	: function(){
				if(this.opened){
					return false;
				}
				
				this.opened = true;
				
				// Firing our own expand method with a percentage of 100:
				this.expand(100);
			},
			close	: function(){
				if(!this.opened && !this.focused){
					return false;
				}
				
				this.opened = this.focused = false;
				this.expand(0);
			},
			focus	: function(){
				if(this.focused || this.opened){
					return false;
				}
				
				this.focused = true;
				
				//Expanding to 30%:
				this.expand(30);
			},
			
			near	: function(x,y){
				// Checking whether the passed x and y coordinates are near the current image:
				return (x > this.left-15 && x < this.right+15 && y > this.top-15 && y < this.bottom+15);
			},
			
			over	: function(x,y){
				// The same, but returning true only when directly above the image:
				return (x > this.left && x < this.right && y > this.top && y < this.bottom);
			},
			
			expand : function(animPercent){
				if(!this.animateObj){
					this.animateObj = {count:0};
				}
				
				// We use jQuery's animate method to
				// change the count property of the object:
				
				$(this.animateObj).stop().animate({
					count:animPercent
				},{
					duration:150,
					
					// The step funciton is executed on every animation frame.
					// With jQuery's proxy we pass the "this" of the function:
					step:$.proxy(this.stepAnimation,this)
				});
			},
			
			stepAnimation : function(p,fx){
				
				// P holds the current value of the count property,
				// between 0 and 100. Below we are turning into percentage.
				
				p = p/100;
				
				// Changing the size and position of the image holder:
				
				this.elem.css({
					width : (this.img.width - this.width)*p + this.width ,
					height : (this.img.height - this.height)*p + this.height,
					marginTop : -this.img.offsetTop*p,
					marginLeft: -this.img.offsetLeft*p,
					zIndex: 100*p
				});
				
				// Moving the image so it appears as if fixed:
				
				this.image.css({
					marginLeft : p*this.img.offsetLeft,
					marginTop : p*this.img.offsetTop
				});
			}
		};