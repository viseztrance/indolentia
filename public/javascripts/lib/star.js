function Star(attributes) {
    this.data = {};

    this.budget = {
        ship: 0,
        defence: 0,
        industry: 0,
        population: 1,
        technology: 0
    };

    this.attributes = {
        maxPopulation: 0,
        population: 0,
        factories: 0,
        credits: 0,
        waste: 0
    };

    this.setAttributes(attributes);
}

Star.canvas = null;

Star.TYPES = {
    blue: {
          url: "/images/stars/blue.png",
          preview: "/images/preview.png"
    },
    gray: {
        url: "/images/stars/gray.png",
        preview: "/images/preview.png"
    },
    yellow: {
        url: "/images/stars/yellow.png",
        preview: "/images/preview.png"
    }
};

Star.HOMEWORLD = {
    maxPopulation: 100,
    population: 50,
    factories: 15,
    type: "yellow",
    reachable: true
};

Star.COST = {
    population: 20,
    industry: 10,
    waste: 1
};

Star.INCOME = {
    population: 0.5,
    industry: 1
};

Star.MULTIPLIER = {
    waste: 0.5  // physical waste units, not cost
};

Star.prototype.setAttributes = function(attributes) {
    $.extend(this.attributes, attributes);
};

Star.prototype.setPlayer = function(player) {
    if(this.player) {
        this.player.ownedStars.splice(this.player.ownedStars.indexOf(this), 1);
    }
    this.player = player;
    this.player.ownedStars.push(this);
};

Star.prototype.calculateCredits = function() {
    return Star.INCOME.population * this.attributes.population + Star.INCOME.industry * this.getActiveFactories();
};

Star.prototype.creditsPerTurn = function() {
    var that = this;
    var credits = {
        value: this.calculateCredits()
    };
    for(var key in that.budget) {
        (function() {
            var name = key,
                reader = "for" + key.charAt(0).toUpperCase() + name.slice(1, name.length);
            credits[reader] = function() {
                return that.budget[name] * this.value;
            };
        })();
    }
    return credits;
};

Star.prototype.wasteGrowth = function() {
    return Star.MULTIPLIER.waste * this.getActiveFactories();
};

Star.prototype.wasteElimination = function() {
    var wasteCosts = Star.COST.waste * this.attributes.waste;
    if (wasteCosts <= this.creditsPerTurn().forPopulation()) {
        wasteToEliminate = this.attributes.waste
    } else {
        wasteToEliminate = Math.floor(this.creditsPerTurn().forPopulation() / Star.COST.waste)
    }
    return wasteToEliminate;
};

Star.prototype.populationGrowth = function() {
    var growth = (this.creditsPerTurn().forPopulation() - this.wasteElimination() * Star.COST.waste) / Star.COST.population;
    if (this.attributes.waste > this.attributes.maxPopulation) {
        if (this.attributes.population <= (this.attributes.maxPopulation / 100 * 15)) {
            growth = 0
        } else {
            growth = -1
        }
    }
    return growth;
};

Star.prototype.getActiveFactories = function() {
    return Math.floor(this.attributes.factories) || 0;
};

Star.prototype.industryGrowth = function() {
    return this.creditsPerTurn().forIndustry() / Star.COST.industry;
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

Star.prototype.endTurn = function() {
    this.attributes.waste += this.wasteGrowth() - this.wasteElimination();
    this.attributes.population = Math.min(this.attributes.population + this.populationGrowth(),
                                          this.attributes.maxPopulation);
    this.attributes.factories += this.industryGrowth();
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
