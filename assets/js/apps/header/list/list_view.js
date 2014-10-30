define(["app",
        "tpl!apps/header/list/templates/list.tpl",
        "tpl!apps/header/list/templates/list_item.tpl",
        "tpl!apps/header/list/templates/dropdown_menu.tpl",
        "tpl!apps/header/list/templates/bootstrap_menu.tpl",
        'bootstrap/bootstrap'],
        function(ContactManager, listTpl, listItemTpl, dropdownMnTpl, bootstrapMenuTpl){
  ContactManager.module("HeaderApp.List.View", function(View, ContactManager, Backbone, Marionette, $, _){
    View.Header = Marionette.ItemView.extend({
      template: listItemTpl,
      tagName: "li",

      events: {
        "click a": "navigate",
        "click #javascript-file-encrypter": "showEncrypter",
        "click #books": "showBooks",
        "click #tetris": "showTetris",
        'click #memorygame': 'showMemoryGame',
        'click #reactgo': 'showReactGo',
        'click #fruit-ninja' : 'showFruitNinja'
      },
      showReactGo: function(){
    	  window.location.href = "demo/reactgo/index.html";  
      },
      showFruitNinja: function(){
    	window.location.href = 'demo/fruit-ninja/index.html';  
      },
      showMemoryGame: function(){
    	  window.location.href = "demo/memorygame/index.html"; 
      },
      showTetris: function(){
    	  window.location.href = "demo/tetris/";
      },
      showEncrypter: function(){
    	  window.location.href = "demo/javascript-file-encrypter/";
      },
      showBooks: function(){
    	  window.location.href = "demo/books/";
      },
      setTemplate: function(){
    	  if(this.model.get('name') == 'Demos') {
    		  this.template = dropdownMnTpl;
    	  }
    	  if(this.model.get('name') == 'Bootstrap') {
    		  this.template = bootstrapMenuTpl;
    	  }
      },
      navigate: function(e){
        e.preventDefault();
        this.trigger("navigate", this.model);
      },
      
      render: function(){
    	    this.setTemplate();
    	    var args = Array.prototype.slice.apply(arguments);
    	    var result = Marionette.ItemView.prototype.render.apply(this, args);

    	    return result;
      },
      
      onRender: function(){
        if(this.model.selected){
          // add class so Bootstrap will highlight the active entry in the navbar
          this.$el.addClass("active");
        };
      }
    });

    View.Headers = Marionette.CompositeView.extend({
      template: listTpl,
      className: "navbar navbar-inverse",
      itemView: View.Header,
      itemViewContainer: "ul",

      events: {
        "click a.brand": "brandClicked"
      },

      brandClicked: function(e){
        e.preventDefault();
        this.trigger("brand:clicked");
      }
    });
  });

  return ContactManager.HeaderApp.List.View;
});
