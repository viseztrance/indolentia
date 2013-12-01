function Game(options) {
    this.options   = options;
    this.turnCount = 0;
    this.players   = [];
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
    this.currentPlayer.humanControlled = true;
    this.currentPlayer.game = this;
    this.currentPlayer.research = new Research(this.technologies);
    this.currentPlayer.create();

    this.players = [this.currentPlayer];
    for(var i = 0; i < this.options.players - 1; i++) {
        var player = new Player();
        player.game = this;
        player.research = new Research(this.technologies);
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
    UI.game = this;
    Scene.entries = this.scenes;
    InteractiveEvent.entries = this.currentPlayer.interactiveEvents;
    var scene = Scene.find({ active: true });
    switch (scene && scene.name) {
    case "research":
        UI.render("research", this.currentPlayer.research);
        break;
    case "technology":
        InteractiveEvent.current().render();
        break;
    default:
        UI.render("game", this);
    }
};

Game.prototype.endTurn = function() {
    this.turnCount++;
    if(this.onEndTurn) {
        this.onEndTurn();
    }
};

Game.prototype.nextPlayer = function() {
    var index = this.players.indexOf(this.currentPlayer);
    var nextPlayer = this.players[index + 1];
    if(nextPlayer) {
        nextPlayer.play();
    } else {
        this.players[0].play();
        this.endTurn();
    }
};

Game.prototype.save = function() {
    // Override method to add functionality
};
