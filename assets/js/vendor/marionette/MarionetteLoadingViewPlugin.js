/**
 * 
 * 
 * marionette-loadingview-plugin
=============================

A plugin for Marionette to add support for a loadingView parameter

This plugin adds support in `CollectionView` for an optional `loadingView` parameter, in the same vein as `emptyView`, which appears when the `CollectionView` is first loaded, before any data has arrived, and which then removes itself when the first item in the collection is added, or when the collection's `sync` event is fired.

```js

NoItemsView = Backbone.Marionette.ItemView.extend({
  template: "#show-no-items-message-template"
});
LoadingItemsView = Backbone.Marionette.ItemView.extend({
  template: "#show-no-items-yet-template"
});

Backbone.Marionette.CollectionView.extend({
  // ...

  emptyView: NoItemsView,
  loadingView: LoadingItemsView
});
 * 
 * 
 * @param factory
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['marionette', 'underscore'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS
        factory(require('marionette'), require('underscore'));
    } else {
        // Browser globals
        factory(Backbone.Marionette, _);
    }
}(function(Marionette, _) {
    
    var Marionette = Backbone.Marionette
    var originalCollectionView = Marionette.CollectionView
    
    Marionette.CollectionView = originalCollectionView.extend({
        
        _initialEvents: function(){
            if (this.collection){
                this.listenTo(this.collection, "add", this.addChildView, this);
                this.listenToOnce(this.collection, "add", this.firstElement, this);
                this.listenTo(this.collection, "remove", this.removeItemView, this);
                this.listenToOnce(this.collection, "add", this.firstElement, this);
                this.listenTo(this.collection, "sync", this.onSync, this);
            }
        },
        
        // marks the collection as synchronised
        onSync: function() {
            this.collectionFetched = true;
            this.checkEmpty();
        },
        
        // Called once on the addition of the first element to the
        // collection, closing the loading view and setting the 
        // collection as fetched
        firstElement: function() {
            this.collectionFetched = true;
            this.closeLoadingView();
        },
        
        // Internal method. Separated so that CompositeView can have
        // more control over events being triggered, around the rendering
        // process
        _renderChildren: function(){
            this.closeEmptyView();
            this.closeLoadingView();
            this.closeChildren();
            
            if (this.collection && this.collection.length > 0) {
                this.showCollection();
            } else {
                this.checkEmpty()
            }
        },
        
        // Internal method to show an empty view in place of
        // a collection of item views, when the collection is
        // empty
        showEmptyView: function(){
            var EmptyView = Marionette.getOption(this, "emptyView");
            
            if (EmptyView && !this._showingEmptyView){
                this._showingEmptyView = true;
                var model = new Backbone.Model();
                this._emptyView = this.addItemView(model, EmptyView, 0);
            }
        },
        
        // Internal method to show an empty view in place of
        // a collection of item views, when the collection is
        // empty
        showLoadingView: function(){
            var LoadingView = Marionette.getOption(this, "loadingView");
            
            if (LoadingView && !this._showingLoadingView){
                this._showingLoadingView = true;
                var model = new Backbone.Model();
                this._loadingView = this.addItemView(model, LoadingView, 0);
            } else {
                this.showEmptyView();
            }
        },
        
        // Internal method to close an existing emptyView instance
        // if one exists. Called when a collection view has been
        // rendered empty, and then an item is added to the collection.
        closeEmptyView: function(){
            if (this._showingEmptyView){
                this.removeChildView(this._emptyView);
                delete this._showingEmptyView;
                delete this._emptyView;
            }
        },
        
        // Internal method to close an existing loadingView instance
        // if one exists. Called when the collection married to the 
        // collection view has a new item added to it
        closeLoadingView: function(){
            if (this._showingLoadingView){
                this.removeChildView(this._loadingView)
                delete this._showingLoadingView
                delete this._loadingView
            }
        },
        
        // Render the child item's view and add it to the
        // HTML for the collection view.
        addItemView: function(item, ItemView, index){
            // get the itemViewOptions if any were specified
            var itemViewOptions = Marionette.getOption(this, "itemViewOptions");
            if (_.isFunction(itemViewOptions)){
                itemViewOptions = itemViewOptions.call(this, item, index);
            }
            
            // build the view 
            var view = this.buildItemView(item, ItemView, itemViewOptions);
            
            // set up the child view event forwarding
            this.addChildViewEventForwarding(view);
            
            // this view is about to be added
            this.triggerMethod("before:item:added", view);
            
            // Store the child view itself so we can properly
            // remove and/or close it later
            this.children.add(view);
            
            // Render it and show it
            this.renderItemView(view, index);
            
            // call the "show" method if the collection view
            // has already been shown
            if (this._isShown){
                Marionette.triggerMethod.call(view, "show");
            }
            
            // this view was added
            this.triggerMethod("after:item:added", view);
            
            return view
        },
        
        // helper to show the empty view if the collection is empty
        checkEmpty: function() {
            // check if we're empty now, and if we are, show the
            // empty view
            if (!this.collection || this.collection.length === 0){
                if ( this.collectionFetched && this.collectionFetched === true ) {
                    this.closeLoadingView()
                    this.showEmptyView();
                } else {
                    this.showLoadingView()
                }
            }
        }
    })
}));