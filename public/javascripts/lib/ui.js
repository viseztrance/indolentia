var UI = {
    callbacks: {},
    views: {}
};

UI.render = function(view, object, locals) {
    locals = locals || {};
    $.proxy(this.views[view], this)(object, locals);
    if(this.callbacks["afterRender"]) this.callbacks.afterRender();
};
