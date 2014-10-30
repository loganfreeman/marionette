define(['marionette', 'app', 'tpl!apps/productList/templates/productView.tpl'], function(Marionette, vent, tpl) {
  "use strict";
  var ProductView;
  return ProductView = Marionette.ItemView.extend({
    template: tpl,
    tagName: 'tr',
    events: {
      'click button[data-action="remove"]': 'removeProduct',
      'click button[data-action="edit"]': 'editProduct'
    },
    removeProduct: function() {
      vent.trigger('Totals.removeValue', this.model.get('price'));
      return this.model.destroy();
    },
    editProduct: function() {
      vent.trigger('Form.setState', 'edit');
      vent.trigger('Form.set_ui_val', 'id', this.model.get('id'));
      vent.trigger('Form.set_ui_val', 'name', this.model.get('name'));
      return vent.trigger('Form.set_ui_val', 'price', this.model.get('price'));
    },
    modelEvents: {
      "change": "modelChanged"
    },
    modelChanged: function() {
      return this.render();
    }
  });
});
