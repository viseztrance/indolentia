var UI = {};

UI.render = function(object) {
    var klass = Perseverance.getClassName(object).toLowerCase();
    $.proxy(this.views[klass], this)(object);
    if(this.callbacks["afterRender"]) this.callbacks.afterRender();
};

UI.callbacks = {};
UI.views = {};
