App.DemotemplateController = Ember.ObjectController.extend({
  booleanValue: true,
  list: [
    { name: "José Mota" },
    { name: "Jeffrey Way" }
  ],
  toggle: function() {
    this.set("booleanValue", !this.get("booleanValue"));
  },
});
