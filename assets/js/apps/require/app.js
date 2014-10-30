define(['app',
        'image!assets/img/lol_cat.jpg',
        'image!http://30.media.tumblr.com/tumblr_lgd1neNYSL1qbwkzvo1_500.jpg',
        'image!assets/img/bike.jpg!bust',
        'image!assets/img/bike.jpg!bust',
        'image!assets/img/lol_cat.jpg',
        'image!assets/img/software_engineer.png'], function(App, cat, awesome, bike1, bike2, sameCat, engineer){
	App.module('RequirePluginTest', function(RequirePluginTest, App, Backbone, Marionette, $, _){		
		
		RequirePluginTest.View = Marionette.ItemView.extend({
		      template: '<div id="wrapper"/>',
		      render: function(){
	                var wrapper = $(this.template)[0];

	                //add loaded images to the document!
	                //returns an Image object..
	                wrapper.appendChild(awesome);
	                wrapper.appendChild(cat);

	                //requireJS will return same image object unless you use `!bust`

	                var sameBike = document.createElement('div');
	                sameBike.innerHTML = 'Is same bike cat? : '+ (bike1 === bike2);
	                wrapper.appendChild(sameBike);

	                wrapper.appendChild(bike1);
	                wrapper.appendChild(bike2);

	                var sameLol = document.createElement('div');
	                sameLol.innerHTML = 'Is same lol cat? : '+ (cat === sameCat);
	                wrapper.appendChild(sameLol);

	                //so we need to "deep-clone" the Element to be able
	                //to insert it multiple times into the same document

	                //wrapper.appendChild(sameCat.cloneNode(true)); //insert a clone of the image
	                wrapper.appendChild(sameCat);//swap image position

	                engineer.style.display = 'block';
	                wrapper.appendChild(engineer);
	                
	                $(this.el).append(wrapper);
		      }
		    });
		
		App.on("plugintest:show", function(){
		    App.navigate("plugintest");
		    var view = new RequirePluginTest.View();
		    App.mainRegion.show(view);
		  });
		
	    App.Router = Marionette.AppRouter.extend({
	        appRoutes: {
	          "plugintest": "show"
	        }
	      });
	    
	    RequirePluginTest.controller = {
	    	show: function(){
			    var view = new RequirePluginTest.View();
			    App.mainRegion.show(view);
	    	}
	    };
	    
	    App.addInitializer(function(){
	        new App.Router({
	          controller: RequirePluginTest.controller
	        });
	      });
	});
	return App.RequirePluginTest.View;
})