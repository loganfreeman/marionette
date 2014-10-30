// Marionette Analytics
// MIT
// @author James Charlesworth

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root.MarionetteAnalytics = factory();
    }
}(this, function () {

    // Constructor needs the Marionette variable
    // to overload functions
    var MarionetteAnalytics =  {
        _viewCount: {},
        Marionette: null,
        isUniversalAnalytics: function() {
            return typeof window._gaq === 'undefined';
        },
        setLocation: function() {
            if (this.isUniversalAnalytics()) {
                ga('set', 'location', window.location.href);
            } else {
                //cant be done in old GA?
            }
        },
        sendTiming: function( category, variable, value, label ) {
            if (this.isUniversalAnalytics()) {
                ga('send', 'timing', category, variable, value, label||null);
            } else{
                _gaq.push(['_trackTiming', category, variable, value, label||null, 100]);
            }
        },
        sendEvent: function( category, action, label, value ) {

        },
        trackViewRenderingPerformance: function( category ) {
            if (typeof this.Marionette === 'undefined') {
                throw new Error('Marionette is undefined.');
            }

            var gaRateLimitThrottle = [],
                parent = this;

                // creates timestamps when the render() method is called
                // and when it is complete.
                trackView = function () {
                    // if we're not local - don't send the timing
                    if (/local/.test(window.location.host)) {

                        var self = this;
                        if (typeof parent._viewCount[self.moduleName] === 'undefined') {
                            parent._viewCount[self.moduleName] = 0;
                        }
                        parent._viewCount[this.moduleName]++;

                        this._gaStartTime = new Date().getTime();
                        this.on('item:rendered', function(){
                            if (typeof self.moduleName !== 'undefined') {
                                if (gaRateLimitThrottle.indexOf(self.moduleName) === -1) {
                                    gaRateLimitThrottle.push(self.moduleName);
                                    self._gaFinishTime = new Date().getTime();
                                    var loadTime = self._gaFinishTime - self._gaStartTime;

                                    //its necessary to update the location prior to sending the timing
                                    //because the hash can change and GA does not auto update.
                                    //still some issues though because views are rendered prior
                                    //to transitions / navigate is called
                                    parent.setLocation( window.location.href );
                                    parent.sendTiming( category, self.moduleName, loadTime );

                                    if (gaRateLimitThrottle.length > 10) {
                                        gaRateLimitThrottle.splice(0, 9);
                                    }
                                }
                            } else {
                                //usefull for debugging views that dont specify moduleName
                                //console.log('undefined is '+ self.$el.html())
                            }
                        });

                    }
                }


            var constr = this.Marionette.ItemView.prototype.constructor;
            this.Marionette.ItemView = this.Marionette.ItemView.extend({
                constructor: function(){
                    trackView.call(this);
                    constr.apply(this, arguments);
                }
            });

            var collectionConstr = this.Marionette.CollectionView.prototype.constructor;
            this.Marionette.CollectionView = this.Marionette.CollectionView.extend({
                constructor: function(){
                    trackView.call(this);
                    collectionConstr.apply(this, arguments);
                }
            });
        }
    };

    return window.MarionetteAnalytics = MarionetteAnalytics;
}));