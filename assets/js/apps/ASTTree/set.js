define(function(require) {
    var _ = require('lodash');

    var Set = function(array) {
        if (!(this instanceof Set)) {
            return new Set(array);
        }

        var self = this;
        this.store = Object.create(null);
        _.each(array, function(item) {
            self.add(item);
        });
    };

    Set.prototype.add = function(item) {
        this.store[item] = true;
    };

    Set.prototype.contains = function(item) {
        return (this.store[item] === true);
    };

    Set.prototype.remove = function(item) {
        delete this.store[item];
    };

    return Set;
});
