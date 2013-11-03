function InteractiveEvent(category) {
    this.category = category;
}

InteractiveEvent.entries = {};

InteractiveEvent.first = function() {
    for(var category in InteractiveEvent.entries) {
        if(InteractiveEvent.entries[category].length) {
            return InteractiveEvent.entries[category][0];
        }
    }
    return false;
};

InteractiveEvent.current = function() {
    for(var category in InteractiveEvent.entries) {
        for(var i in InteractiveEvent.entries[category]) {
            var entry = InteractiveEvent.entries[category][i];
            if(entry.current) return entry;
        }
    }
    return false;
};

InteractiveEvent.reset = function() {
    this.entries = {};
};

InteractiveEvent.prototype.create = function() {
    InteractiveEvent.entries[this.category] = InteractiveEvent.entries[this.category] || [];
    InteractiveEvent.entries[this.category].push(this);
};

InteractiveEvent.prototype.render = function() {
    this.current = true;
    UI.render(this.content);
};

InteractiveEvent.prototype.next = function() {
    var event = InteractiveEvent.entries[this.category][0];
    if(event) {
        return event;
    } else {
        return InteractiveEvent.first();
    }
};

InteractiveEvent.prototype.destroy = function() {
    var index = InteractiveEvent.entries[this.category].indexOf(this);
    InteractiveEvent.entries[this.category].splice(index, 1);
};

InteractiveEvent.prototype.end = function() {
    this.destroy();
    var nextEvent = this.next();
    if(nextEvent) {
        nextEvent.render();
    } else {
        UI.render(UI.game);
    }
};
