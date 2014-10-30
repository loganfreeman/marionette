define([ 'app'
         ,'stache!apps/formbuilder/main'
         , "apps/formbuilder/collections/snippets" 
         , "apps/formbuilder/collections/my-form-snippets"
         , "apps/formbuilder/views/tab" 
         , "apps/formbuilder/views/my-form"
         , "text!apps/formbuilder/data/input.json"
         , "text!apps/formbuilder/data/radio.json"
         , "text!apps/formbuilder/data/select.json"
         , "text!apps/formbuilder/data/buttons.json"
         , "text!apps/formbuilder/templates/app/render.html"
         , "text!apps/formbuilder/templates/app/about.html"
         , 'css!apps/formbuilder/style'        
         ], function(App
        		 ,viewTpl
        		 ,SnippetsCollection
        		 , MyFormSnippetsCollection
        		  , TabView
        		  , MyFormView
        		  , inputJSON
        		  , radioJSON
        		  , selectJSON
        		  , buttonsJSON
        		  , renderTab
        		  , aboutTab) {
	App.module('formbuilder', function(formbuilder, App, Backbone, Marionette, $, _) {
		
		console.log(radioJSON);

		formbuilder.MainView = Marionette.ItemView.extend({
			template : viewTpl,
			onShow: function(){
				  //Bootstrap tabs from json.
			      new TabView({
			        title: "Input"
			        , collection: new SnippetsCollection(JSON.parse(inputJSON))
			      });
			      new TabView({
			        title: "Radios / Checkboxes"
			        , collection: new SnippetsCollection(JSON.parse(radioJSON))
			      });
			      new TabView({
			        title: "Select"
			        , collection: new SnippetsCollection(JSON.parse(selectJSON))
			      });
			      new TabView({
			        title: "Buttons"
			        , collection: new SnippetsCollection(JSON.parse(buttonsJSON))
			      });
			      new TabView({
			        title: "Rendered"
			        , content: renderTab
			      });
			      new TabView({
			        title: "About"
			        , content: aboutTab
			      });

			      //Make the first tab active!
			      $("#components .tab-pane").first().addClass("active");
			      $("#formtabs li").first().addClass("active");
			      // Bootstrap "My Form" with 'Form Name' snippet.
			      new MyFormView({
			        title: "Original"
			        , collection: new MyFormSnippetsCollection([
			          { "title" : "Form Name"
			            , "fields": {
			              "name" : {
			                "label"   : "Form Name"
			                , "type"  : "input"
			                , "value" : "Form Name"
			              }
			            }
			          }
			        ])
			      });
			}
		});

		formbuilder.controller = {
			show : function() {
				App.navigate("formbuilder");
				App.mainRegion.show(new formbuilder.MainView());
			}
		}

		App.on("formbuilder:show", function() {
			formbuilder.controller.show();
		});

		formbuilder.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"formbuilder" : "show"
			}
		});

		App.addInitializer(function() {
			new formbuilder.Router({
				controller : formbuilder.controller
			});
		});
	});
	return App.formbuilder.controller;
})