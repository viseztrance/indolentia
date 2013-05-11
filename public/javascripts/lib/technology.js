function Technology(category, attributes) {
    this.category = category;

    for(var name in attributes) {
        this[name] = attributes[name];
    }
};

Technology.BASE_COST = 4;

Technology.create = function(entries) {
    var technologies = {};

    for(var category in entries) {
        if(!technologies[category]) technologies[category] = [];

        for(var i in entries[category]) {
            var entry = new Technology(category, entries[category][i]);
            technologies[category].push(entry);
        }
    }
    return technologies;
};

Technology.prototype.cost = function() {
    return Technology.BASE_COST * this.level;
};
