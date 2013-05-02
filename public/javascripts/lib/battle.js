function Battle(attacker, defender) {
    this.attacker  = attacker;
    this.defender  = defender;
    this.usedShips = [];
}

// Battle.prototype.create = function(location) {
//     this.canvas.click(this.events.click, this);
//     this.canvas.hover(this.events.hover, this.events.unhover, this, this);
// };

Battle.prototype.setup = function(options) {
    this.canvas = Raphael(options.canvas.element, options.canvas.width, options.canvas.height);
    Ship.canvas = Tile.canvas = this.canvas;
    this.setGrid(options.grid.width, options.grid.height);
    this.setFleets();
    this.bind();
    this.nextTurn();
};

Battle.prototype.setGrid = function(width, height) {
    var that = this;

    this.grid = [];
    for(var i = 0; i < height; i++) {
        this.grid[i] = [];
        for(var j = 0; j < width; j++) {
            (function() {
                var tile = new Tile([j, i]);
                tile.create();
                tile.element.click(function() {
                    that.takeAction("move", tile);
                });
                that.grid[i].push(tile);
            })();
        }
    }
};

Battle.prototype.setFleets = function() {
    for(var i = 0; i < this.grid.length; i++) {
        var attacking = this.attacker.ships[i],
            defending = this.defender.ships[i];
        if(attacking) {
            this.place(attacking, this.grid[i][0], 90);
        }
        if(defending) {
            this.place(defending, this.grid[i][this.grid[i].length - 1], -90);
        }
    }
};

Battle.prototype.place = function(ship, tile, orientation) {
    ship.render();
    ship.move(tile, {
        speed: "0", // Prevent number from being evaluated to false
        orientation: orientation
    });
};

Battle.prototype.getShips = function() {
    return this.attacker.ships.concat(this.defender.ships);
};

Battle.prototype.bind = function(location) {
    var ships = this.getShips();
    for(var i = 0; i < ships.length; i++) {
        var currentShip = ships[i];
        currentShip.data.body.click(this.events.click, this);
        // console.log(currentShip);
        // currentShip.data.hover(this.events.hover, this.events.unhover, this, this);
    }
};

Battle.prototype.getFastestShip = function() {
    var ships = this.getShips(),
        fastestShip;
    for(var i = 0; i < ships.length; i++) {
        var currentShip = ships[i];
        // Make sure ship wasn't already used
        if(this.usedShips.indexOf(currentShip) == -1) {
            // Get ship with the highest initiative
            if(!fastestShip || fastestShip.attributes.initiative < currentShip.attributes.initiative) {
                fastestShip = currentShip;
            }
        }
    }
    return fastestShip;
};

Battle.prototype.takeAction = function(type, location, options) {
    options = options || {};
    if(type == "move") {
        console.log("moving ...");
        console.log(location);
        this.currentShip.move(location);
    }
    console.log(type);
    console.log(this.currentShip);
    console.log(location);
    this.nextTurn();
};

Battle.prototype.nextTurn = function() {
    // Mark ship as used
    if(this.currentShip) {
        this.currentShip.data.selection.animate({ opacity: 0 }, 300, function() {
            this.remove();
        });
        this.usedShips.push(this.currentShip);
    }
    if(this.usedShips.length == this.getShips().length) {
        this.usedShips = [];
    }
    this.currentShip = this.getFastestShip();
    this.currentShip.select();
};

Battle.prototype.events = {
    click: function(coordinates) {
        console.log("clicked ...");
    },

    hover: function(coordinates) {
        console.log("hover ...");
    },

    unhover: function(coordinates) {
        console.log("unhover ...");
    }
};
