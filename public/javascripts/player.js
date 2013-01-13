function Player(attributes) {
    this.attributes = attributes || {};
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
