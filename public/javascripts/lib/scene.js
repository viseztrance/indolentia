function Scene(name, content) {
    this.name = name;
    this.content = content;
    this.active = false;
}

Scene.entries = [];

Scene.render = function() {
    for(var i in this.entries) {
        this.entries[i].render();
    }
};

Scene.prototype.render = function() {
    var element = $("<div>").attr({
        "class": "scene",
        id: this.name
    });

    element.html(this.content);
    $("body").append(element);

    if(this.active) this.setActive();
};

Scene.prototype.create = function() {
    Scene.entries.push(this);
    return this;
};

Scene.prototype.getElement = function() {
    return $("#" + this.name);
};

Scene.prototype.setActive = function(clear) {
    if(clear) {
        for(var i in Scene.entries) {
            Scene.entries[i].setInactive();
        }
    }
    this.active = true;
    this.getElement().addClass("active");
};

Scene.prototype.setInactive = function() {
    this.active = false;
    this.getElement().removeClass("active");
};
