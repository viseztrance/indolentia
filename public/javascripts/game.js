function Game(options) {
    this.options = options;
    this.turnCount = 0;
}

Game.prototype.create = function() {
    this.setGalaxy();
    this.setPlayers();
    this.setHomeWorlds();
};

Game.prototype.setGalaxy = function() {
    this.galaxy = Galaxy.generate({
        minDist: 2,
        width: parseInt(this.options.size, 10),
        height: parseInt(this.options.size, 10),
        tries: 30,
        max: parseInt(this.options.size, 10) / 2
    });
    this.galaxy.create();
    this.galaxy.game = this;
};

Game.prototype.setPlayers = function() {
    this.currentPlayer = new Player({
        color: this.options.color,
        race: this.options.race
    });
    this.currentPlayer.create();
    this.players = [this.currentPlayer];
    for(var i = 0; i < this.options.players - 1; i++) {
        var player = new Player();
        player.create();
        this.players.push(player);
    }
};

Game.prototype.setHomeWorlds = function() {
    var coordinates = ($.map(this.galaxy.stars, function(star) {
        return [[star.attributes.x_axis, star.attributes.y_axis]];
    }));
    var boundries = new ConvexHull(coordinates).getValues();
    for(var i = 0; i < this.options.players; i++) {
        var star = this.galaxy.findStarByCoordinates(boundries[i * Math.floor(boundries.length / this.options.players)]);
        var player = this.players[i];
        star.setAttributes(Star.HOMEWORLD);
        player.explore(star);
        star.setPlayer(player);
    }
};

Game.prototype.render = function() {
    this.map = new Map($("div.map"));
    this.map.create();

    Star.canvas = this.map.canvas;
    this.galaxy.render();
};

Game.prototype.nextTurn = function() {
    this.turnCount++;
};
