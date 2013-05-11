function Player(attributes) {
    this.attributes      = attributes || {};
    this.ownedStars      = [];
    this.exploredStars   = [];
    this.technologies    = {};
    this.humanControlled = false;
}

Player.colors = ["red", "green", "yellow"];
Player.races = ["alpha", "beta", "gamma"];

Player.prototype.setAttr = function(name, value) {
    var collection = name + "s";
    if(!value) {
        value = Player[collection].shift();
    } else {
        Player[collection].splice(Player[collection].indexOf(value), 1);
    }
    this[name] = value;
};

Player.prototype.create = function() {
    this.setAttr("color", this.attributes.color);
    this.setAttr("race", this.attributes.race);
};

Player.prototype.explore = function(star) {
    this.exploredStars.push(star);
};

Player.prototype.setTechnologies = function(technologies) {
    for(var category in technologies) {
        this.technologies[category] = {
            available: [],
            researchable: [],
            researching: { item: undefined, credits: 0 }
        };
        for(var i in technologies[category]) {
            var technology = technologies[category][i];
            if(technology.default) {
                this.technologies[category].available.push(technology);
            } else {
                this.technologies[category].researchable.push(technology);
            }
        }
    }
};

Player.prototype.research = function(technology) {
    // Prevent any action if something is already being researched
    if(this.technologies[technology.category].researching.item) return false;
    var index = this.technologies[technology.category].researchable.indexOf[technology];
    if(index != -1) {
        // Move technology from the researchable stack to the researching item location
        this.technologies[technology.category].researchable.splice(index, 1);
        this.technologies[technology.category].researching.item = technology;
    }
    return technology;
};

Player.prototype.play = function() {
    this.game.currentPlayer = this;

    // End the turn automatically for the cpu, but it should be manually triggered for people
    if(!this.humanControlled) {
        // TODO: AI routines should be called here
        this.endTurn();
    }
};

Player.prototype.endTurn = function() {
    for(var i in this.ownedStars) {
        this.ownedStars[i].endTurn();
    }
    this.game.nextPlayer();
};
