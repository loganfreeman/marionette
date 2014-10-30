define(["app", "apps/widgets/show/show_view"], function(ContactManager, View){
  return {
	  showWidgets: function(){
      //var view = new View.Widgets();
      ContactManager.mainRegion.show(View.layout);
    }
  };
});
