function Galaxy(data) {
    this.data = data;
    this.stars = [];
}

Galaxy.generate = function(attributes) {
    var starscape = new Poisson.Distribution(attributes);

    var data = $.map(starscape.generate(), function(location) {
        var x = location[0] * 90,
            y = location[1] * 90;
        var type = (function() {
            var types = [];
            for(var type in Star.TYPES) {
                types.push(type);
            };
            var seed = Faker.Helpers.randomNumber(types.length);
            return types[seed];
        })();
        var name = (function() {
            var text = Faker.Lorem.sentence();
            return text.charAt(0).toUpperCase() + text.slice(1, 10);
        })();
        return {
            name: name,
            x_axis: x,
            y_axis: y,
            type: type
        };
    });

    var galaxy = new Galaxy(data);
    galaxy.origin = [starscape.startPoint[0] * 90, starscape.startPoint[1] * 90];

    return galaxy;
};

Galaxy.prototype.create = function() {
    for(var i = 0; i < this.data.length; i++) {
        var star = new Star(this.data[i]);
        star.galaxy = this;
        this.stars.push(star);
    }
};

Galaxy.prototype.render = function() {
    for(var i in this.stars) {
        this.stars[i].create();
    }
};

Galaxy.prototype.setCurrentStar = function(star) {
    if(this.currentStar && this.currentStar.selection) {
        $.proxy(this.currentStar.animations.deselect, this.currentStar)();
    }
    this.currentStar = star;
    UI.render(this.currentStar);
};

Galaxy.prototype.findStarByCoordinates = function(point) {
    for(var i in this.stars) {
        var star = this.stars[i];
        if(star.attributes.x_axis == point[0] && star.attributes.y_axis == point[1]) {
            return star;
        }
    }
    return undefined;
};
