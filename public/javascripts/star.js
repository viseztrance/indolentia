function Star(attributes) {
    this.data = {};
    this.attributes = {
        maxPopulation: 0,
        currentPopulation: 0,
        factories: 0,
        reachable: false
    };
    this.setAttributes(attributes);
}

Star.canvas = null;

Star.TYPES = {
    blue: {
          url: "/images/stars/blue.png",
          preview: "/images/wasteland.png"
    },
    gray: {
        url: "/images/stars/gray.png",
        preview: "/images/wasteland.png"
    },
    yellow: {
        url: "/images/stars/yellow.png",
        preview: "/images/wasteland.png"
    }
};

Star.HOMEWORLD = {
    reachable: true,
    maxPopulation: 100,
    currentPopulation: 50,
    factories: 15,
    type: "yellow"
};

Star.prototype.setAttributes = function(attributes) {
    $.extend(this.attributes, attributes);
};

Star.prototype.create = function() {
    this.render();
    this.data.body.click(this.events.click, this);
    this.data.body.hover(this.events.hover, this.events.unhover, this, this);
};

Star.prototype.pathTo = function(destination) {
    var path = Star.canvas.path("M" + this.attributes.x_axis + " " + this.attributes.y_axis +
                                "L" + destination.attributes.x_axis + " " + destination.attributes.y_axis);
    path.toBack();
    path.attr({
        "stroke-width": 2,
        stroke: "#ccc",
        "stroke-dasharray": "-",
        "stroke-width": 3,
        "stroke-linecap": "round",
        "opacity": 0
    });
    path.animate({ opacity: 1 }, 200);
    return path;
};

Star.prototype.render = function() {
    var imagePath = Star.TYPES[this.attributes.type]["url"];
    this.data.body = Star.canvas.image(imagePath, this.attributes.x_axis - 20, this.attributes.y_axis - 20, 40, 40);
    // Star.canvas.image("/assets/ships/fleet.png", this.attributes.x_axis - 40, this.attributes.y_axis -40, 20, 10);
    // this.data.body.attr({
    //     fill: "#999",
    //     stroke: "#f00"
    // });
    // this.data.body.node.setAttribute("class", "star-body");
    if(this.attributes.reachable) {
        this.data.name = Star.canvas.text(this.attributes.x_axis, this.attributes.y_axis + 25, this.attributes.name);
        this.data.name.node.setAttribute("class","star-name");
        if(this.player) {
            this.data.name.attr({
                stroke: this.player.color
            });
        }
    }
};

Star.prototype.events = {
    click: function() {
        this.galaxy.setCurrentStar(this);
        $.proxy(this.animations.select, this)();
    },

    hover: function() {
        if(this.galaxy.currentStar && this.attributes.reachable) {
            this.galaxy.path = this.galaxy.currentStar.pathTo(this);
        }
    },

    unhover: function() {
        if(this.galaxy.path) {
            this.galaxy.path.remove();
        }
    }
};

Star.prototype.animations = {
    select: function() {
        if(this.data.name) {
            this.data.name.animate({
                y: this.attributes.y_axis + 50
            }, 200);
        }

        this.selection = Star.canvas.circle(this.attributes.x_axis, this.attributes.y_axis, 50);
        this.selection.attr({
            stroke: "#28AD50",
            "stroke-dasharray": "-",
            "stroke-width": 3,
            "stroke-linecap": "round",
            "stroke-opacity": 0.8
        });
        this.selection.animate({
            r: 30
        }, 200, "easeOut");
    },

    deselect: function() {
        if(this.data.name) {
            this.data.name.animate({
                y: this.attributes.y_axis + 25
            }, 200);
        }

        this.selection.animate({
            opacity: 0
        }, 200, function() {
            this.remove();
        });
    }
};
