// Region 
// ------

// Manage the visual regions of your composite application. See
// http://lostechies.com/derickbailey/2011/12/12/composite-js-apps-regions-and-region-managers/
Backbone.Marionette.AnimationRegion = Backbone.Marionette.Region.extend({

  initialize: function(){
    this.animation = 'dissolve';
    this.has3d = (Modernizr.cssanimations && Modernizr.csstransforms3d && Modernizr.positionfixed);
  },

  open: function(view){

    if(!this.$el.children('div').length)
      view.$el.addClass('current');

    if(!this.$el.find('#'+view.el.id).length)
      this.$el.prepend(view.el);

  },

  show: function(view){

    this.ensureEl();
    //this.close();

    this.open(view);
    view.render();

    if (view.onShow) { view.onShow(); }
    view.trigger("show");

    if (this.onShow) { this.onShow(view); }
    this.trigger("view:show", view);

    //DO NAVIGATE HERE
    this.doNavigation((this.currentView) ? this.currentView.$el : [], view.$el, {name: this.animation });

    this.currentView = view;
    window.scrollTo(0, 0);

    this.animation= "dissolve";
  },

  doNavigation: function(fromPage, toPage, animation) {
    var self = this;
    // Error check for target page
    if (toPage.length === 0 || fromPage.length === 0) {
      return false;
    }

    // Error check for fromPage===toPage
    if (toPage.hasClass('current')) {
        return false;
    }

    // Collapse the keyboard
    $(':focus').trigger('blur');

    fromPage.trigger('pageAnimationStart', { direction: 'out' });
    toPage.trigger('pageAnimationStart', { direction: 'in' });

    if (this.has3d && animation.name) {

        // Reverse animation if need be
        var finalAnimationName = animation.name;

        // Bind internal "cleanup" callback
        fromPage.bind('webkitAnimationEnd animationend', navigationEndHandler);

        // Trigger animations
        //$('body').addClass('animating');

        toPage.addClass(finalAnimationName + ' in current');
        fromPage.addClass(finalAnimationName + ' out');

    } else {
        toPage.addClass('current in');
        navigationEndHandler();
    }

    // Private navigationEnd callback
    function navigationEndHandler(event) {

        var bufferTime = 100;

        if (self.has3d && finalAnimationName) {
            fromPage.unbind('webkitAnimationEnd animationend', navigationEndHandler);
            fromPage.removeClass('current ' + finalAnimationName + ' out');
            toPage.removeClass(finalAnimationName);

            //$('body').removeClass('animating');

            window.scrollTo(0, 0);

        } else {
            fromPage.removeClass(finalAnimationName + ' out current');
            bufferTime += 260;
        }

        // In class is intentionally delayed, as it is our ghost click hack
        setTimeout(function(){
            toPage.removeClass('in');
        }, bufferTime);

        // Trigger custom events
        toPage.trigger('pageAnimationEnd', { direction:'in', animation: animation});
        fromPage.trigger('pageAnimationEnd', { direction:'out', animation: animation});

        fromPage.remove();
    }

    return true;
  }

});