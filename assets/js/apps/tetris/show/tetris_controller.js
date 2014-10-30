define(["app", "apps/tetris/show/tetris_view"], function(ContactManager, View){
  ContactManager.module("TetrisApp", function(TetrisApp, ContactManager, Backbone, Marionette, $, _){
	  TetrisApp.startWithParent = false;
	  

	  TetrisApp.onStart = function(){
		

	    };

	    TetrisApp.onStop = function(){
	    };
	  });
	  
  return {
    showTetris: function(){
      var view = new View.Tetris();
      
      view.on("item:rendered", function(){
    	  console.log("tetris rendered");
      }),
      
      view.on("item:closed", function(){
    	  console.log("tetris destoryed");
      }),

      ContactManager.mainRegion.show(view);
    }
  };
});
