function Player(attributes) {
    this.attributes      = attributes || {};
    this.ownedStars      = [];
    this.exploredStars   = [];
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
    this.research.perform(this.creditsPerTurn().research);
    this.game.nextPlayer();
};

Player.prototype.creditsPerTurn = function() {
    var budget = {};

    for(var i in this.ownedStars) {
        var credits = this.ownedStars[i].creditsPerTurn();

        for(var name in this.ownedStars[i].budget) {
            if(!budget.hasOwnProperty(name)) budget[name] = 0;

            var reader = name.charAt(0).toUpperCase() + name.slice(1, name.length);
            budget[name] += credits["for" + reader]();
        }
    }
    return budget;
};
