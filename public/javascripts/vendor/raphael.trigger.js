Raphael.el.trigger = function(name, argument) {
    var event = this.events.filter(function(event) {
        return event.name == name;
    })[0];

    $.proxy(event.f, argument)();
};
