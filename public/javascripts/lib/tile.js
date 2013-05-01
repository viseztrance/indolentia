function Tile(coordinates, options) {
    options = options || {};

    this.coordinates = coordinates;
    this.size = options.size || 70;
}

Tile.canvas = null;

Tile.prototype.translate = function() {
    if(!this.translatedCoordinates) {
        var x = this.coordinates[0],
            y = this.coordinates[1];
        this.translatedCoordinates = [x * this.size, y * this.size];
    }
    return this.translatedCoordinates;
};

Tile.prototype.create = function() {
    this.element = Tile.canvas.rect(this.translate()[0], this.translate()[1], this.size, this.size).attr({"fill": "#FBB"});
};
