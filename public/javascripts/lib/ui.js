function UI() {
    if (arguments.callee._singletonInstance) {
        return arguments.callee._singletonInstance;
    }
    this.templates = {};
    return arguments.callee._singletonInstance = this;

};

UI.getInstance = function() {
    return new UI();
};

UI.prototype.set = function(objects) {
    for(var name in objects) {
        this[name] = objects[name];
    }
    return this;
};

UI.prototype.render = function(object) {
    var klass = MemoryStore.getClassName(object).toLowerCase();
    $.proxy(this.modules[klass], this)(object);
};

UI.prototype.modules = {
    star: function(star) {
        var preview = Star.TYPES[star.attributes.type].preview,
            currentPlayer = star.galaxy.game.currentPlayer;
        var defaults = {
            preview: preview,
            player: star.player || false,
            currentPlayer: star.player == currentPlayer,
            explored: currentPlayer.exploredStars.indexOf(star) != -1,
            activeFactories: star.getActiveFactories()
        };
        var args = $.extend({}, star.attributes, defaults);
        var template = new Template("star").process(args);
        this.info.html(template);

        for(var i in star.budget) {
            $("input.slider[name=" + i + "]").val(star.budget[i] * 100);
        }
        $("input.slider").slide({
            equalize: true,
            change: function() {
                $("input.slider").each(function(i, item) {
                    star.budget[$(item).attr("name")] = $(item).val() / 100;
                });
                star.galaxy.game.save();
            }
        });

        $("#end-turn").click(function() {
            // Refresh sidebar at the end of turn
            star.galaxy.game.endTurn();
            return false;
        });
    }
};
