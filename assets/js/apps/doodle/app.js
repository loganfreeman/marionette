define([ 'app',
         'tpl!apps/doodle/view.tpl',
         'apps/doodle/pic',
         'css!apps/doodle/style'], function(App, viewTpl) {
	App.module('doodle', function(doodle, App, Backbone, Marionette, $, _) {		

		doodle.MainView = Marionette.ItemView.extend({
			template : viewTpl,
			onShow: function(){
				var page	= $('#page');

				// Creating the expanding images:
					
				var picArr = [
					new pic({
						top : 100, left : 30, width : 60,height : 100, href:'#',
						img : { src : 'assets/js/apps/doodle/img/1.jpg', offsetTop : 50, offsetLeft: 10}
					}),
					new pic({
						top : 55, left : 107, width : 70,height : 115, href:'#',
						img : { src : 'assets/js/apps/doodle/img/2.jpg', offsetTop : 30, offsetLeft: 46}
					}),
					new pic({
						top : 188, left : 115, width : 82,height : 69, href:'#',
						img : { src : 'assets/js/apps/doodle/img/3.jpg', offsetTop : 10, offsetLeft: 36}
					}),
					new pic({
						top : 90, left : 198, width : 100,height : 62, href:'#',
						img : { src : 'assets/js/apps/doodle/img/4.jpg', offsetTop : 43, offsetLeft: 73}
					}),
					new pic({
						top : 52, left : 315, width : 58,height : 90, href:'#',
						img : { src : 'assets/js/apps/doodle/img/5.jpg', offsetTop : 13, offsetLeft: 42}
					}),
					new pic({
						top : 167, left : 216, width : 90,height : 58, href:'#',
						img : { src : 'assets/js/apps/doodle/img/6.jpg', offsetTop : 0, offsetLeft: 13}
					}),
					new pic({
						top : 159, left : 325, width : 63,height : 93, href:'#',
						img : { src : 'assets/js/apps/doodle/img/7.jpg', offsetTop : 37, offsetLeft: 9}
					}),
					new pic({
						top : 148, left : 406, width : 137,height : 74, href:'#',
						img : { src : 'assets/js/apps/doodle/img/8.jpg', offsetTop : 19, offsetLeft: 56}
					}),
					new pic({
						top : 69, left : 394, width : 75,height : 63, href:'#',
						img : { src : 'assets/js/apps/doodle/img/9.jpg', offsetTop : 56, offsetLeft: 54}
					}),
					new pic({
						top : 30, left : 491, width : 62,height : 93, href:'#',
						img : { src : 'assets/js/apps/doodle/img/10.jpg', offsetTop : 30, offsetLeft: 37}
					}),
					new pic({
						top : 72, left : 576, width : 64,height : 107, href:'#',
						img : { src : 'assets/js/apps/doodle/img/11.jpg', offsetTop : 40, offsetLeft: 50}
					})
				];
				
				// Appending the images to the #page div:
				
				$.each(picArr,function(){
					page.append(this.elem);
				});
				

				page.mousemove(function(e){
					
					var left = (e.pageX - page.offset().left),
						top = (e.pageY - page.offset().top),
						pic = null;
					
					// On each mouse movement, loop through the pics
					// and check whether the cursor is above any of them.

					for(var i = 0;i < picArr.length;i++){
						pic = picArr[i];
						
						if(pic.near(left,top)){

							if(pic.over(left,top)){
								pic.open();
							}
							else pic.focus();
						}
						else pic.close();
					}
					
				}).mouseleave(function(){
					
					// When the mose leaves the #page div,
					// foce a close on all the images.
					
					for(var i = 0;i < picArr.length;i++){
						picArr[i].close();
					}
					
				});
			}
		});

		doodle.controller = {
			show : function() {
				App.navigate("doodle");
				App.mainRegion.show(new doodle.MainView());
			}
		}

		App.on("doodle:show", function() {
			doodle.controller.show();
		});

		doodle.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"doodle" : "show"
			}
		});

		App.addInitializer(function() {
			new doodle.Router({
				controller : doodle.controller
			});
		});
	});
	return App.doodle.controller;
})