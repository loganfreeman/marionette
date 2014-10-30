define([ 'app',
         'tpl!apps/typeahead/view.tpl',
         'css!apps/typeahead/style', "jquery-ui"], function(App, viewTpl) {
	App.module('typeahead', function(typeahead, App, Backbone, Marionette, $, _) {
		
	    // search only, if the regexp matches
	    var cities = [
	        "Amsterdam", "Stuttgart", "Singapore", "Madrid", "Barcelona", "Hamburg",
	        "Esslingen", "Berlin", "Frankfurt", "Essingen", "Straßburg", "London",
	        "Hannover", "Weil am Rhein", "Tuttlingen", "München", "Marsaille", "Paris",
	        "Manchester", "Rome", "Neapel", "New York", "Brasil", "Rio de Janeiro"
	    ];
	    
	    
	    function _setCursorPosition(area, pos) {
	        if (area.setSelectionRange) {
	            area.setSelectionRange(pos, pos);
	        } else if (area.createTextRange) {
	            var range = area.createTextRange();
	            range.collapse(true);
	            range.moveEnd('character', pos);
	            range.moveStart('character', pos);
	            range.select();
	        }
	    }

		typeahead.MainView = Marionette.ItemView.extend({
			template : viewTpl,
			onShow: function(){
			    $("#cities").autocomplete({
			        position: { my : "right top", at: "right bottom" },
			        source: function(request, response) {
			        	var last = request.term.split(" ").pop();
			        	console.log(last);
			            response($.ui.autocomplete.filter(
			                    cities, last));
			        },
			        //minLength: 2,  // does have no effect, regexpression is used instead
			        focus: function() {
			            // prevent value inserted on focus
			            return false;
			        },
			        // Insert the match inside the ui element at the current position by replacing the matching substring
			        select: function(event, ui) {
			        	 //alert("completing "+ui.item.value);},
			        	var items = this.value.split(' ');
			            this.value = items.slice(0, items.length-1).join(' ') + ' '+ ui.item.value ;
			            _setCursorPosition(this, this.value.length);
			            return false;
			        },
			        search:function(event, ui) {
			            return true;
			        }
			    });
			}
		});

		typeahead.controller = {
			show : function() {
				App.navigate("typeahead");
				App.mainRegion.show(new typeahead.MainView());
			}
		}

		App.on("typeahead:show", function() {
			typeahead.controller.show();
		});

		typeahead.Router = Marionette.AppRouter.extend({
			appRoutes : {
				"typeahead" : "show"
			}
		});

		App.addInitializer(function() {
			new typeahead.Router({
				controller : typeahead.controller
			});
		});
	});
	return App.typeahead.controller;
})