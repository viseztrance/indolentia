function Research(technologies) {
    this.technologies = {};
    var value = 1 / 6;
    this.budget  = {
        computers:    value,
        construction: value,
        shields:      value,
        planetology:  value,
        propulsion:   value,
        weapons:      value
    };

    // Set technologies
    for(var category in technologies) {
        this.technologies[category] = {
            available: [],
            researchable: [],
            researching: { item: undefined, credits: 0 }
        };
        for(var i in technologies[category]) {
            var technology = technologies[category][i];
            if(technology.default) {
                // Default entries are already researched
                this.technologies[category].available.push(technology);
            } else if(!this.technologies[category].researching.item) {
                // If no technology is being researched, use first entry
                this.technologies[category].researching.item = technology;
            } else {
                this.technologies[category].researchable.push(technology);
            }
        }
    }
}

Research.prototype.study = function(technology) {
    // Prevent any action if something is already being researched
    if(this.technologies[technology.category].researching.item) return false;
    var index = this.technologies[technology.category].researchable.map(function(currentTechnology) {
        return currentTechnology.level;
    }).indexOf(technology.level);
    if(index != -1) {
        // Move technology from the researchable stack to the researching item location
        this.technologies[technology.category].researchable.splice(index, 1);
        this.technologies[technology.category].researching.item = technology;
    }
    return technology;
};

Research.prototype.perform = function(credits, callback) {
    for(var category in this.budget) {
        if(this.technologies[category]) {
            this.technologies[category].researching.credits += this.creditsFor(category, credits);
            var technology = this.technologies[category].researching.item;
            // Enough credits raised for current research
            if(technology && this.technologies[category].researching.credits >= technology.cost()) {
                this.technologies[category].researching.credits -= technology.cost(); // Substract current cost
                this.technologies[category].researching.item = undefined; // Remove item from currently researching
                this.technologies[category].available.push(technology); // Add item to the available (researched) stack
                if(callback) callback(technology);
            }
        }
    }
};

Research.prototype.creditsFor = function(category, credits) {
    return credits * this.budget[category];
};
