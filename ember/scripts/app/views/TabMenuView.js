define([
  "ember",
  "controllers/tabListController",
  "views/TabMenuItemView"
], function(Em, tabListController, TabMenuItemView){  
  var TabMenuView = Em.CollectionView.extend({
      tagName: 'ul',
      classNames: ["nav nav-tabs", "tab-menu"],
      controller: tabListController,
      contentBinding: "controller.tabs",
      itemViewClass: TabMenuItemView
  });
  
  return TabMenuView;
});