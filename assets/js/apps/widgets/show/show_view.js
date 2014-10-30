define(["marionette", "app", "tpl!apps/widgets/show/templates/grid-template.tpl",
        "tpl!apps/widgets/show/templates/item-template.tpl",
        "tpl!apps/widgets/show/templates/row-template.tpl",
        'tpl!apps/widgets/show/templates/layout.tpl'], function(Marionette, ContactManager, gridTpl, itemTpl, rowTpl, layoutTpl){
	
	var Item = Backbone.Model.extend();
	var Items = Backbone.Collection.extend({
	    model: Item
	});

	var Views = {};

	Views.GridItem = Backbone.Marionette.ItemView.extend({
	    template: itemTpl,
	    tagName: 'div',
	    className: 'span2',
	    events: {
	    	'click': 'load'
	    },
	    load: function(event){
	    	var that = this;
	    	//alert(this.model.attributes['require']);
	    	require([this.model.attributes['require']], function(){
	    		ContactManager.trigger(that.model.attributes['id'] + ":show");
	    	})
	    }
	});

	Views.GridRow = Backbone.Marionette.CompositeView.extend({
	    template: rowTpl,
	    itemView: Views.GridItem,
	    itemViewContainer: "div.row-fluid",
	    initialize: function() {
	        this.collection = new Backbone.Collection(_.toArray(this.model.attributes));
	    }
	});

	Views.Grid = Backbone.Marionette.CompositeView.extend({
	    template: gridTpl,
	    itemView: Views.GridRow,
	    itemViewContainer: "section",
	    initialize: function() {
	        var grid = this.collection.groupBy(function(list, iterator) {
	            return Math.floor(iterator / 6); // 4 == number of columns
	        });
	        this.collection = new Backbone.Collection(_.toArray(grid));
	    }
	});

	Views.ListItem = Backbone.Marionette.ItemView.extend({
	    template: itemTpl,
	    tagName: 'li'
	});
	


	Views.List = Backbone.Marionette.CompositeView.extend({
	    template: "#list-template",
	    itemView: Views.ListItem,
	    itemViewContainer: "ul",
	});


	var Data = [
	    {id: "contact-manager-link", link: "contacts"},
	    {id: "tetris-link", link: "tetris"},
	    {id: "card_link", link: "card"},
	    {id: "backgrid-link", link: "backgrid"},
	    {id: "transition-link", link: "transition-link"},
	    {id: "plugintest", link: "plugintest"},
	    {id: "sudoku", link: "sudoku"},
	    {id: "gogame", link: "gogame"},
	    {id: "regexp", link: "regexp"},
	    {id: "canvasgame", link: "canvasgame", require: 'apps/simplecanvasgame/app'},
	    {id: 'svgdemo', link: 'svgdemo', require: 'apps/svg/app'},
	    {id: 'svgfilter', link: 'svgfilter', require: 'apps/svgfilter/app'},
	    {id: 'asttree', link: 'asttree', require: 'apps/ASTTree/app'},
	    {id: 'jquery-layout', link: 'jquery-layout', require: 'apps/jlayout/app'},
	    {id: 'ProductTracker', link: 'ProductTracker', require: 'apps/productList/app'},
	    {id: 'youtube', link: 'youtube', require: 'apps/youtube/app'},
	    {id: 'interface', link: 'interface', require: 'apps/interface/app'},
	    {id: 'astar', link: 'astar', require: 'apps/astar/app'},
	    {id: 'jsbeautifier', link: 'jsbeautifier', require: 'apps/JSBeautifier/app'},
	    {id: 'algo-visual', link: 'algo-visual', require: 'apps/algo-visual/app'},
	    {id: 'rocket', link: 'rocket', require: 'apps/rocket/app'},
	    {id: 'album', link: 'album', require: 'apps/album/app'},
	    {id: 'animatedbar', link: 'animatedbar', require: 'apps/rotatingButton/app'},
	    {id: 'gallery', link: 'gallery', require: 'apps/gallery/app'},
	    {id: 'diag-gallery', link: 'diag-gallery', require: 'apps/diagnoal/app'},
	    {id: 'mapapp', link: 'mapapp', require: 'apps/map/app'},
	    {id: 'css-animate', link: 'css-animate', require: 'apps/animate/app'},
	    {id: 'SqlParser', link: 'SqlParser', require: 'apps/sqlparser/app'},
	    {id: 'sweeper', link: 'sweeper', require: 'apps/sweeper/app'},
	    {id: 'minesweeper', link: 'minesweeper', require: 'apps/minesweeper/app'},
	    {id: 'Tiger', link: 'Tiger', require: 'apps/tiger/app'},
	    {id: 'HandleBarsDemo', link: 'HandleBarsDemo', require: 'apps/handlebar/app'},
	    {id: 'IMDB', link: 'IMDB', require: 'apps/imdb/app'},
	    {id: 'doodle', link: 'doodle', require: 'apps/doodle/app'},
	    {id: 'game-of-life', link: 'game-of-life', require: 'apps/game-of-life/app'},
	    {id: 'typeahead', link: 'typeahead', require: 'apps/typeahead/app'},
	    {id: 'affinity', link: 'affinity', require: 'apps/affinity/app'},
	    {id: 'TabManager', link: 'TabManager', require: 'apps/TabManager/app'},
	    {id: 'progressviewdemo', link: 'progressviewdemo', require: 'apps/progressview/app'},
	    {id: 'multimodelview', link: 'multimodelview', require: 'apps/multimodelview/app'},
	    {id: 'marionetteyoutube', link: 'marionetteyoutube', require: 'apps/marionette.youtube/app'},
	    {id: 'waterfall', link: 'waterfall', require: 'apps/waterfall/app'},
	    {id: 'mosaic', link: 'mosaic', require: 'apps/mosaic/app'},
	    {id: 'textcomplete', link: 'textcomplete', require: 'apps/textcomplete/app'},
	    {id: 'gmapsapp', link: 'gmapsapp', require: 'apps/gmaps/app'},
	    {id: 'bootstrapdemo', link: 'bootstrapdemo', require: 'apps/bootstrap/app'},
	    {id: 'wizard', link: 'wizard', require: 'apps/wizard/app'},
	    {id: 'formbuilder', link: 'formbuilder', require: 'apps/formbuilder/app'},
	    {id: 'expressionbuilder', link: 'expressionbuilder', require: 'apps/expressionbuilder/app'},
	    {id: 'canvas-game', link: 'canvas-game', require: 'apps/canvasgame/app'},
	    {id: 'conditionbuilder', link: 'conditionbuilder', require: 'apps/conditionbuilder/app'},
	    {id: 'carousel', link: 'carousel', require: 'apps/carousel/app'},
	    {id: 'paginator', link: 'paginator', require: 'apps/paginator/app'},
	    //{id: 'copy2clip', link: 'copy2clip', require: 'apps/copy2clip/app'},
	    {id: 'chat', link: 'chat', require: 'apps/chat/app'},
	    {id: 'epoxyDemo', link: 'epoxyDemo', require: 'apps/epoxy/app'},
	    {id: 'box2dDemo', link: 'box2dDemo', require: 'apps/box2d/app'},
	    {id: 'animation', link: 'animation', require: 'apps/animation/app'},
	    {id: 'graphics', link: 'graphics', require: 'apps/graphics/app'},
	    {id: 'dataDemo', link: 'dataDemo', require: 'apps/data/app'},
	    {id: 'gamesDemo', link: 'gamesDemo', require: 'apps/gamesDemo/app'},
	    {id: 'form', link: 'form', require: 'apps/form/app'},
	    {id: 'utilities', link: 'utilities', require: 'apps/utilities/app'},
	    {id: 'csstricks', link: 'csstricks', require: 'apps/csstricks/app'},
	    
	    
	];


	var items = new Items(Data);

	var grid = new Views.Grid({
	    collection: items
	});
	
	Views.Layout = Backbone.Marionette.Layout.extend({
		template: layoutTpl,
		regions:{
			'grid' : '#grid-view',
			'paginator': '#paginator'
		},
		onShow: function(){
			this.grid.show(grid);
		}
	})
	
	var layout = new Views.Layout();

  return {
	
	grid : grid,
	layout: layout
	  
  };
});
