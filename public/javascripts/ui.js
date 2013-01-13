function UI() {
    if (arguments.callee._singletonInstance) {
        return arguments.callee._singletonInstance;
    }
    this.templates = {};
    return arguments.callee._singletonInstance = this;

};

UI.getInstance = function() {
    return new UI();
};

UI.prototype.set = function(objects) {
    for(var name in objects) {
        this[name] = objects[name];
    }
    return this;
};

UI.prototype.render = function(object) {
    var klass = MemoryStore.getClassName(object).toLowerCase();
    $.proxy(this.modules[klass], this)(object);
};

UI.prototype.modules = {
    star: function(star) {
        var preview = Star.TYPES[star.attributes.type].preview;
        var args = $.extend({}, star.attributes, { preview: preview });
        var template = new Template("star").process(args);
        this.info.html(template);
        $("input.slider").slide({
            equalize: true
        });
    }
};
