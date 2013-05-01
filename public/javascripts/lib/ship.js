function Ship(attributes) {
    this.data = {};

    var defaults = {
        initiative: 5,
        speed: 5
    };
    this.attributes = $.extend({}, defaults, attributes);
}

Ship.canvas = null;

Ship.prototype.render = function() {
    var imagePath = "/images/ships/" + (Faker.Helpers.randomNumber(2) + 1) + ".png";
    this.data.body = Ship.canvas.image(imagePath, 0, 0, 50, 50);
    this.coordinates = [0, 0];
    // this.data.transform("");
    // console.log(this.data);
    // this.data.attr({ transform: "r" + 90 });
};

Ship.prototype.move = function(tile, options) {
    options = options || {};

    var speed = options.speed || 300;
    this.tile = tile;
    this.orientation = options.orientation || this.orientation;

    this.coordinates = this.tile.translate();
    var x = this.coordinates[0] + 10,
        y = this.coordinates[1] + 10;
    this.data.body.animate({ transform: "R" + this.orientation + " T" + x + "," + y }, speed);
};

Ship.prototype.select = function() {
    var x = this.coordinates[0],
        y = this.coordinates[1];
    this.data.selection = Ship.canvas.rect(x + 5, y + 5, 60, 60).attr({ fill: "#888", 'stroke-width': 0 });
    this.data.body.toFront();
};
