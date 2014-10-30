define(['marionette', 'app', 'tpl!apps/productList/templates/formView.tpl'], function(Marionette, vent, formView) {
  "use strict";
  var ButtonStates, FormView;
  ButtonStates = {
    create: 'Create',
    edit: 'Save'
  };
  return FormView = Marionette.ItemView.extend({
    _state: 'create',
    template: formView,
    events: {
      'click button': 'createNewProduct'
    },
    ui: {
      name: '#name',
      price: '#price',
      id: '#id',
      button: 'button'
    },
    createNewProduct: function(ev) {
      var errors, model;
      ev.preventDefault();
      errors = [];
      if (!this.ui.name.val().length) {
        errors.push({
          name: 'name',
          message: 'Please fill name field'
        });
      }
      if (!this.ui.price.val() || /[^0-9]/.test(this.ui.price.val())) {
        errors.push({
          name: 'price',
          message: 'Please fill price field with a number'
        });
      }
      if (errors.length) {
        return console.log('errors');
      } else {
        if (this.getState() === 'create') {
          this.collection.add({
            name: this.ui.name.val(),
            price: +this.ui.price.val()
          });
          this.collection.last().save();
          vent.trigger('Totals.addValue', this.ui.price.val());
        } else {
          model = this.collection.get(this.ui.id.val());
          vent.trigger('Totals.removeValue', model.get('price'));
          model.set({
            name: this.ui.name.val(),
            price: +this.ui.price.val()
          });
          model.save();
          vent.trigger('Totals.addValue', model.get('price'));
        }
        this.ui.name.val('');
        this.ui.price.val('');
        this.ui.id.val('');
        return this.setState('create');
      }
    },
    setState: function(state) {
      this._state = state;
      return this.ui.button.text(ButtonStates[state]);
    },
    getState: function() {
      return this._state;
    }
  });
});
