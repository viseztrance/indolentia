function Grid(attributes) {
    this.tiles  = [];

    for(var key in attributes) {
        this[key] = attributes[key];
    }
}

Grid.prototype.create = function() {
    for(var i = 0; i < this.height; i++) {
        this.tiles[i] = [];
        for(var j = 0; j < this.width; j++) {
            var coordinates = this.translate([j, i]);
            var tile = this.canvas.rect(coordinates[0], coordinates[1], 70, 70).attr({"fill": "#FBB"});
            tile.click(function() {
                console.log("lorem");
            });
            this.grid[i].push(tile);
        }
    }
};

Grid.prototype.translate = function(coordinates) {
    var x = coordinates[0],
        y = coordinates[1];
    return [x * this.multiplier, y * this.multiplier];
};
