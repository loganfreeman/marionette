
/**
 * A Marionette CollectionView clone that uses Document Fragment to render its children
 * Unlike the normal CollectionView, this will not auto render ItemViews whenever something
 * is added to its collection. As models are added, it will render ItemViews into a 
 * DocumentFragment and keep them there. When render() is called or the collection sends a 
 * 'ready' event, then the View will insert the contents of its DocumentFragment all at once.
 * This should save the many DOM manipulations that normally come from using a CollectionView
 *
 * @author Nicholas Funnell <nick@nick.gs>
 * @since 2013-06-21
 */
Backbone.Marionette.FragmentView = Marionette.ItemView.extend({
	initialize: function(options) {
		this.frag = document.createDocumentFragment();
		console.warn('options:', options);
		this._firstPass();
		this._renderOnReady = options.renderOnReady;
		if( this._renderOnReady === undefined ) {
			this._renderOnReady = true;
		}
	},
	frag: false,
	children: new Backbone.ChildViewContainer(),
	collectionEvents: {
		'add': 'modelAdded',
		'remove': 'modelRemoved',
		'ready': 'readyEvent'
	},
	readyEvent: function() {
		if( !this._renderOnReady ) {
			console.log('FragmentView: do not render on ready event');
			return;
		}
		console.log('FragmentView: heard ready event, calling render()');
		this.render();
	},
	render: function() {
		this.$el.empty();
		while( this.frag.firstChild ) {
			this.frag.removeChild( this.frag.firstChild );
		}
		if( this.collection.length === 0 ) {
			this.renderEmptyView();
		} else {
			this.renderChildren();
		}
		this.$el.append( this.frag );
		console.warn("RENDER WAS CALLED");
	},
	modelAdded: function(model) {
		var View = Marionette.getOption(this, 'itemView');
		var oView = new View({model: model});
		this.children.add(oView, model.id);
		//console.log('model was added:', model.id);
	},
	modelRemoved: function(model) {
		// find the view
		var oView = this.findViewByModel(model);
		if( !oView ) return;
		this.children.remove(oView);

	},
	renderEmptyView: function() {
		var EmptyView = Marionette.getOption(this, 'emptyView');
		var oView = new EmptyView();
		oView.render();
		this.frag.appendChild( oView.el );
		console.log("VIEW IS EMPTY");
		//this.children.add(oView);
	},
	renderChildren: function() {
		this.collection.each(function(model) {
			var oView = this.findViewByModel(model);
		    if( !oView ) {
			console.warn('cant find view');
			return;
		    }
			oView.render();
			this.frag.appendChild( oView.el );
		}, this);
	},
	findViewByModel: function( oModel ) {
		return this.children.findByCustom(oModel.id);
	},
	_firstPass: function() {
		// add all the models that were in the collection 
		// that was initially passed to the view on creation
		// we wont get `add` events for these models because
		// they have already been added
		this.collection.each(function(model) {
			this.modelAdded(model);
		}, this);
	}
});
