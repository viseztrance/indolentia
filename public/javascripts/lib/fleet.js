function Fleet(attributes) {
    this.attributes = attributes;
    this.ships = [];
}

Fleet.prototype.addShip = function(ship) {
    this.ships.push(ship);
};
