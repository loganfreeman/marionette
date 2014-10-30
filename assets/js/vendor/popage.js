// 
// jQuery Plugins - popage
// 
// Copyright (C) 2013 Leman Kwok <leman@lmswork.com>
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
// 
;(function(){

var _log = function(){
	if(typeof window.console != 'undefined'){
		console.log.apply(console, arguments);
	}
};

function getBrowserSize() {
	var o = {};
    if (navigator.userAgent.indexOf('IE')!=-1) {
    	if( document.compatMode == "CSS1Compat"){
    		o.width = document.documentElement.clientWidth;
    		o.height = document.documentElement.clientHeight;
    	}else{
    		o.width = document.body.clientWidth;
    		o.height = document.body.clientHeight;
    	}
    } else {
        o.width = self.innerWidth;
        o.height = self.innerHeight;
    }
    return o;
}


var defaults = {
	width: 1000,
	height: 600,
	scrollLeft:0,
	scrollTop:0,
	paddingTop:0,
	paddingBottom:0,
	paddingLeft:0,
	paddingRight:0,
	boundToWindow:false,
	useScrollbar:true
};

var Popage = function(options){
	this.options = options;
	this.initialize.apply(this,arguments);
};
Popage.instancesCounter = 0;
Popage.prototype = {
	options:null,
	$el: null,
	
	$shadow: null,
	$frame: null,
	__instanceIndex : -1,
	initialize: function(){
		this.__instanceIndex = Popage.instancesCounter++;
		this.createUI();
	},
	
	createUI : function(){
		this.$el = jQuery('<div class="popage-wrap" />').hide().appendTo('body');
		this.$shadow = jQuery('<div class="popage-shadow" />').appendTo(this.$el);
		this.$frame = jQuery('<div class="popage-frame" />').appendTo(this.$el);
		
		this._width = defaults.width;
		this._height = defaults.height;
	},
	
	_beforeState: null,
	_isOpened: false,
	onOpened: null,
	onClosed:null,
	open : function( options ){
		_log('Popage['+this.__instanceIndex +'].open');
		var $body = jQuery('body');
		
		if(this._isOpened){
			this.close();
		}
	    
	    var href,html;
	    if(typeof options == 'string'){
	    	href = options;
	    	options = {
	    		href: options
	    	};
	    	this.options = $.extend({
	    		href: options
	    	}, defaults);
	    } else if(typeof options == 'object'){
	    	this.options = {};
	    	this.options = $.extend(this.options ,options);
	    	this.options = $.extend(this.options ,defaults);

	    	if(this.options.url)
		    	href = this.options.url;
	    	else if(this.options.href)
		    	href = this.options.href;
	    	else if(this.options.html)
	    		html = this.options.html;
	    	
	    }
	    
	    
	    this.$el.show();
	    this.$frame.empty();
	    if(html){
	    	var $wrap = $('<div class="popage-frame-content" />');
	    	var $content = $('<div class="popage-content" />');
	    	$content.append(html);
	    	
	    	var self = this;
	    	
	    	$content.find('.popage-close').on('click',function(){
	    		self.close();
	    	});
	    	
	    	$wrap.append($content);
	  		this.$frame.append($wrap);
	    	this._width = $content.width();
	    	this._height = $content.height();
	    }else{
	    	var scrollbar = options.useScrollbar ? 'auto':'no';
		    this.$frame.append('<iframe class="popage-frame-content" src="'+href+'" scrolling="'+scrollbar+'" frameborder="0" allowtransparency="true" />');
	    }
	    if(options){
	    	if(options.width)
	    		this._width = options.width;
	    	if(options.height)
	    		this._height = options.height;
	    		
	    	if(options.boundToWindow){
	    		this._width = $(window).width() - options.paddingLeft - options.paddingRight;
	    		this._height = $(window).height() - options.paddingTop - options.paddingBottom;
	    		
	    	}
    	}
	    this.render();
	    if(!this._isOpened){
	    	var self = this;
			this._beforeState = $body.css('overflow');
			
			jQuery(window).on('resize.popage',function(){
				self.render();
			});
			
			this.$frame.on('scroll.popage', function(){
				if(self.options && self.options.onScroll){
					self.options.onScroll();
				}
			});
	    }
	    this._isOpened = true;
	    
	    $body.css('overflow','hidden');
	    if(typeof this.onOpened == 'function')
		    this.onOpened();
	},
	close: function(){
		_log('Popage['+this.__instanceIndex +'].close');
	    this.$el.hide();
	    jQuery('body').css('overflow',this._beforeState);
	    this.$frame.empty();
	    
	    this.scrollTop(0);
	    
	    if(this._isOpened){
			jQuery(window).off('resize.popage');
	    }
	    if(this._isOpened){
		    this._isOpened = false;
		    this.options.html = null;
		    this.options.href = null;
		    if(typeof this.onClosed == 'function')
			    this.onClosed();
		}
	},
	
	_width: 0,
	_height:0,
	_scrollTop:0,
	_scrollLeft:0,
	
	width: function(){
		if(arguments.length > 0){
			this._width = arguments[0];
			this.render();
			return this;
		}
		return this._width;
	},
	
	height: function(){
		if(arguments.length > 0){
			this._height = arguments[0];
			this.render();
			return this;
		}
		return this._height;
	},
	
	setScrollbar: function(val){
		this.$frame.find('iframe.popage-frame-content').attr('scrolling',val);
	},
	
	getScrollbar: function(){
		return this.$frame.find('iframe.popage-frame-content').attr('scrolling');
	},
	
	scrollLeft: function(){
		this._scrollLeft = this.$frame.scrollLeft();
		if(arguments.length > 0){
			this._scrollLeft = arguments[0];
			this.$frame.scrollLeft(this._scrollLeft);
			return this;
		}
		return this._scrollLeft ;
	},
	
	scrollByX: function(val){
		return this.scrollLeft(this.$frame.scrollLeft()  + val);
	},
	
	scrollTop: function(){
		this._scrollTop = this.$frame.scrollTop() ;
		if(arguments.length > 0){
			this._scrollTop = arguments[0];
			this.$frame.scrollTop(this._scrollTop);
			return this;
		}
		return this._scrollTop ;
	},
	
	scrollByY: function(val){
		return this.scrollTop(this.$frame.scrollTop() + val);
	},
	
	setSize: function(w,h){
		this._width = w;
		this._height = h;
		this.render();
	},
	
	render: function(){
		var $body = $('body');
	    var $frame = this.$frame;
	    var $wrap = this.$el;
	    
	    var s = getBrowserSize();
	    var bw = $body.width();
	    var bh = $body.height();
	    var csw= s.width * 0.5;
	    var csh= s.height * 0.5;
	    
	    
	    $wrap.css('top', $body.scrollTop());
	    
	    var fw = this._width, fh = this._height;
	    if(this.options.paddingLeft > 0) fw += this.options.paddingLeft;
	    if(this.options.paddingRight > 0) fw += this.options.paddingRight;
	    if(this.options.paddingTop > 0) fh += this.options.paddingTop;
	    if(this.options.paddingBottom > 0) fh += this.options.paddingBottom;
	    
	    $frame.width(s.width).height(s.height);
	    
	    var prop = {};
	    prop.marginLeft = csw - fw *0.5;
	    prop.marginTop = csh- fh *0.5;
	    if(prop.marginLeft< 0) prop.marginLeft = 0;
	    if(prop.marginTop< 0) prop.marginTop = 0;
	    prop.width = fw;
	    prop.height =fh;
	    $frame.find('.popage-frame-content').css(prop);
	},
	
	destroy: function(){
		_log('Popage['+this.__instanceIndex +'].destroy');
		this.$el.remove();
		this.$shadow.remove();
		this.$frame.remove();
		this.$el = null;
		this.$shadow = null;
		this.$frame = null;
		
		this.onOpened = null;
		this.onClosed = null;
	}
};

var popages = [];

var getInstance = function(){
	if(popages.length > 0)
		return popages[ popages.length - 1];
	if(window.parent != window.self && window.parent.$ && window.parent.$.popage)
		return window.parent.$.popage.getInstance();
	if(window.parent != window.self && window.top.$ && window.top.$.popage)
		return window.top.$.popage.getInstance();
	
	return null;
};

var createInstance = function(){
	var ins = null;
	//ins = getInstance();
	//if(!ins){
		var _options = $.extend({onScroll: function(){
				jQuery(window).trigger('popage_scroll');
			}
		},defaults) ;
		ins = new Popage(_options);
		popages.push(ins);
		
	//}
	return ins;
};
var eventPrefix = 'popage_';

var closeAllInstance = function(){
	
	for(var i = 0; i < popages.length; i ++){
		
		var ins = popages[i];
		if(ins){
			ins.close();
			ins.destroy();
			ins = null;
		}
	}
	popages.length = 0;
};

var popage = function(method, options){
	
	var isParentExist = window.parent != window.self && typeof window.parent.popage == 'function';
	
	if( arguments.length == 1 && typeof arguments[0] == 'object'){
		method = 'open';
		options = arguments[0];
	}
	
	if( method == 'open'){
		
		if(isParentExist)
			return window.parent.popage.apply(window.parent, arguments);
		
		var ins = createInstance();
		ins.open(options);
		ins.onOpened = function(){
			jQuery(window).trigger(eventPrefix+'open', ins);
		};
		ins.onClosed = function(){
			jQuery(window).trigger(eventPrefix+'close', ins);
		};
	}else if( method == 'close'){
		
		if(isParentExist)
			return window.parent.popage.apply(window.parent, arguments);
		
		var ins = getInstance();
		if(ins){
			ins.close();
			ins.destroy();
			ins = null;
			popages.length --;
		}else{
			if(typeof window.console != 'undefined') console.error('Cannot find the last instance.');
		}
		
	}else if( method == 'closeAll'){
		
		closeAllInstance();
		
	}else if( method == 'width'){
		
		var ins = getInstance();
		if(ins){
			if(arguments.length > 1)
				ins.width( arguments[1]);
			else
				return ins.width();
		}
		
	}else if( method == 'height'){
		
		var ins = getInstance();
		if(ins){
			if(arguments.length > 1)
				ins.height( arguments[1]);
			else
				return ins.height();
		}
		
	}else if( method == 'scrollByX'){
		
		var ins = getInstance();
		if(ins){
			ins.scrollByX( options);
			
			jQuery(window).trigger(eventPrefix+'scroll');
		}
	}else if( method == 'scrollByY'){
		
		var ins = getInstance();
		if(ins){
			ins.scrollByY( options);
			jQuery(window).trigger(eventPrefix+'scroll');
		}
		
	
	}else if( method == 'scrollTop' || method == 'scrollToY'){
		
		var ins = getInstance();
		if(ins){
			if(arguments.length > 1){
				ins.scrollTop( arguments[1]);
				jQuery(window).trigger(eventPrefix+'scroll');
			}else
				return ins.scrollTop();
		}
	}else if( method == 'scrollLeft' || method == 'scrollToX'){
		
		var ins = getInstance();
		if(ins){
			if(arguments.length > 1){
				ins.scrollLeft( arguments[1]);
				jQuery(window).trigger(eventPrefix+'scroll');
			}else
				return ins.scrollLeft();
		}
		
	}else if( method == 'scrollbar' ||  method == 'scrolling'){
		
		var ins = getInstance();
		if(ins){
			if(arguments.length > 1)
				ins.setScrollbar( arguments[1]);
			else
				return ins.getScrollbar( );
		}
		
	}else if( method ==  'setSize'){
		
		var ins = getInstance();
		if(ins){
			if( arguments.length >= 3)
				ins.setSize(arguments[1], arguments[2]);
			if( arguments.length >= 2 && typeof arguments[1] == 'object' && typeof arguments[1].width != 'undefined' && typeof arguments[1].height != 'undefined')
				ins.setSize(arguments[1], arguments[2]);
		}
		
	}else if( method == 'destroy'){
		
		closeAllInstance();
		
		if(myPopover){
			myPopover.destroy();
			myPopover = null;
		}
	}else if( method == 'on'){
		if(arguments.length > 1){
			var eventName = arguments[1];
			if(eventName.length> 0 && eventName.substr(0,eventPrefix.length) != eventPrefix)
				eventName = eventPrefix + eventName;
			if(arguments.length > 2 && typeof arguments[2] == 'function')
				jQuery(window).on( eventName, arguments[2]);
		}
	}else if( method == 'off'){
		
		if(arguments.length > 1){
			var eventName = arguments[1];
			if(eventName.length> 0 && eventName.substr(0,eventPrefix.length) != eventPrefix)
				eventName = eventPrefix + eventName;
			if(arguments.length > 2 && typeof arguments[2] == 'function')
				jQuery(window).off( eventName, arguments[2]);
			jQuery(window).off(eventName);
		}
	}else if( method == 'instance'){
		return popages;
	}
};

popage.open = function(opts){
	return popage('open',opts);
};
popage.close = function(){
	return popage('close');
};

if(typeof jQuery != 'undefined'){
	jQuery.popage = function(){
		var val = popage.apply(null,arguments);
		if(typeof val != 'undefined')
			return val;
		return jQuery; 
	};
	jQuery.popage.defaults = defaults;
	jQuery.popage.getInstance = getInstance;
}
if(typeof window != 'undefined'){
	if(typeof window.popage == 'object'){
		defaults = $.extend(defaults,window.popage);
	}
	window.popage = function(){
		var val = popage.apply(null,arguments);
		if(typeof val != 'undefined')
			return val;
		return window; 
	};

	window.popage.open = function(opts){
		return popage('open',opts);
	};
	window.popage.close = function(){
		return popage('close');
	};
	// Hack: if we loaded this page inside a popage frame, replace window.close
	// and tell
	if(window.parent != window.self && typeof window.parent.popage == 'function'){
		window.close = function(){
			window.parent.popage('close');
		};
		
		var frameSizeUpdateTimer = 0;
		var tellParentSize = function(){
			clearTimeout(frameSizeUpdateTimer);
			var $elm = $('.popage-content');
			if($elm.length> 0){
			
				var w = $elm.width(), h = $elm.height();
				$elm.attr('data-popage-width',w).attr('data-popage-height',h);
				if(h < 200) h = 200;
				if(w < 300) w = 300;
				window.parent.popage('setSize', w,h );
			}
			frameSizeUpdateTimer = setTimeout(tellParentSize,250);
		};
		$(window).on('unload',function(){
			clearTimeout(frameSizeUpdateTimer);
		});
		$('body').ready( function(){
			tellParentSize();
		});
	}else{

		$(window).on('resize', function(){
			var ins = getInstance();
			if(!ins) return;
			var options = ins.options;
			if(options.boundToWindow){
				
	    		ins.setSize(
					$(window).width() - options.paddingLeft - options.paddingRight,
					$(window).height() - options.paddingTop - options.paddingBottom
				);
			}
		});
	}
	window.popage.defaults = defaults;
	window.popage.getInstance = getInstance;
	
}
})();