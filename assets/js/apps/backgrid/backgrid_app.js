define(['app', 'backgrid'], function(App){
	App.module('BackGrid', function(BackGrid, App, Backbone, Marionette, $, _){
		
		var columns = [{
		    name: "id", // The key of the model attribute
		    label: "ID", // The name to display in the header
		    editable: false, // By default every cell in a column is editable, but *ID* shouldn't be
		    // Defines a cell type, and ID is displayed as an integer without the ',' separating 1000s.
		    cell: Backgrid.IntegerCell.extend({
		      orderSeparator: ''
		    })
		  }, {
		    name: "name",
		    label: "Name",
		    // The cell type can be a reference of a Backgrid.Cell subclass, any Backgrid.Cell subclass instances like *id* above, or a string
		    cell: "string" // This is converted to "StringCell" and a corresponding class in the Backgrid package namespace is looked up
		  }, {
		    name: "pop",
		    label: "Population",
		    cell: "integer" // An integer cell is a number cell that displays humanized integers
		  }, {
		    name: "percentage",
		    label: "% of World Population",
		    cell: "number" // A cell type for floating point value, defaults to have a precision 2 decimal numbers
		  }, {
		    name: "date",
		    label: "Date",
		    cell: "date"
		  }, {
		    name: "url",
		    label: "URL",
		    cell: "uri" // Renders the value in an HTML anchor element
		}];
		
		BackGrid.columns = columns;
		
		BackGrid.Territory = Backbone.Model.extend({});
		
		BackGrid.Territories = Backbone.Collection.extend({
			  model: BackGrid.Territory,
			  url: "assets/data/territories.json"
			});
		
		BackGrid.territories = new BackGrid.Territories();
		
		// Initialize a new Grid instance
		var grid = new Backgrid.Grid({
		  columns: columns,
		  collection: BackGrid.territories
		});
		
		BackGrid.grid = grid;
		
		BackGrid.View = Marionette.ItemView.extend({
		      template: '<div id="example-1-result"/>',
		      render: function(){
			     $(this.el).append(this.template);
			     $(this.el).find('#example-1-result').append(BackGrid.grid.render().el);
		      }
		    });
		
		BackGrid.on("backgrid:show", function(){
			BackGrid.navigate("backgrid");
		    var view = new BackGrid.View();
		    BackGrid.mainRegion.show(view);
		    BackGrid.territories.fetch({reset: true});
		  });
		
		BackGrid.Router = Marionette.AppRouter.extend({
	        appRoutes: {
	          "backgrid": "show"
	        }
	      });
	    
		BackGrid.controller = {
	    	show: function(){
			    var view = new BackGrid.View();
			    App.mainRegion.show(view);
			    BackGrid.territories.fetch({reset: true});
	    	}
	    };
	    
		BackGrid.addInitializer(function(){
	        new BackGrid.Router({
	          controller: BackGrid.controller
	        });
	      });
	});
	return App.View;
})