function Scene(name) {
    this.name = name;
    this.active = false;
}

Scene.entries = [];

Scene.findOrCreate = function(name) {
    return this.find({ name: name }) || (function() {
        var scene = new Scene(name);
        scene.create();
        return scene;
    })();
};

Scene.find = function(criteria) {
    for(var i in this.entries) {
        var matched = true;
        for(var attr in criteria) {
            if(this.entries[i][attr] != criteria[attr]) {
                matched = false;
                break;
            }
        }
        if(matched) return this.entries[i];
    }
    return false;
};

Scene.prototype.render = function(content) {
    if(!this.getElement().length) {
        var element = $("<div>").attr({
            "class": "scene",
            id: this.name
        });

        element.html(content);
        $("body").append(element);
    }

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

Scene.prototype.destroy = function() {
    var index = Scene.entries.indexOf(this);
    Scene.entries.splice(index, 1);
    Scene.entries[0].setActive(true);
    this.setInactive();
    this.getElement().remove();
};
