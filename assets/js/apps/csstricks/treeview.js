define([], function() {
	var Tree = function() {

	};

	Tree.init = function() {
		// The recursive tree view
		var TreeView = Backbone.Marionette.CompositeView.extend({
			template : "#node-template",

			tagName : "ul",

			className : 'tree',

			childView: TreeView,

			initialize : function() {
				// grab the child collection from the parent model
				// so that we can render the collection as children
				// of this parent node
				this.collection = this.model.nodes;
			},

			appendHtml : function(collectionView, itemView) {
				// ensure we nest the child list inside of
				// the current list item
				collectionView.$("li:first").append(itemView.el);
			}
		});

		// The tree's root: a simple collection view that renders
		// a recursive tree structure for each item in the collection
		var TreeRoot = Backbone.Marionette.CollectionView.extend({
			//childView : TreeView,
			itemView: TreeView
		});

		// ----------------------------------------------------------------
		// Below this line is normal stuff... models, templates, data, etc.
		// ----------------------------------------------------------------
		treeData = [ {
			nodeName : "top level 1",
			nodes : [ {
				nodeName : "2nd level, item 1",
				nodes : [ {
					nodeName : "3rd level, item 1"
				}, {
					nodeName : "3rd level, item 2"
				}, {
					nodeName : "3rd level, item 3"
				} ]
			}, {
				nodeName : "2nd level, item 2",
				nodes : [ {
					nodeName : "3rd level, item 4"
				}, {
					nodeName : "3rd level, item 5",
					nodes : [ {
						nodeName : "4th level, item 1"
					}, {
						nodeName : "4th level, item 2"
					}, {
						nodeName : "4th level, item 3"
					} ]
				}, {
					nodeName : "3rd level, item 6"
				} ]
			} ]
		}, {
			nodeName : "top level 2",
			nodes : [ {
				nodeName : "2nd level, item 3",
				nodes : [ {
					nodeName : "3rd level, item 7"
				}, {
					nodeName : "3rd level, item 8"
				}, {
					nodeName : "3rd level, item 9"
				} ]
			}, {
				nodeName : "2nd level, item 4",
				nodes : [ {
					nodeName : "3rd level, item 10"
				}, {
					nodeName : "3rd level, item 11"
				}, {
					nodeName : "3rd level, item 12"
				} ]
			} ]
		}

		];

		TreeNode = Backbone.Model.extend({
			initialize : function() {
				var nodes = this.get("nodes");
				if (nodes) {
					this.nodes = new TreeNodeCollection(nodes);
					this.unset("nodes");
				}
			}
		});

		TreeNodeCollection = Backbone.Collection.extend({
			model : TreeNode
		});

		var tree = new TreeNodeCollection(treeData);
		var treeView = new TreeRoot({
			collection : tree
		});

		treeView.render();
		$("#tree").html(treeView.el);
	}
	return Tree;
})