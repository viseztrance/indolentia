UI.views.star = function(star) {
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
    $("#game aside.info").html(template);

    for(var i in star.budget) {
        $("#game input.slider[name=" + i + "]").val(star.budget[i] * 100);
    }
    $("#game input.slider").slide({
        equalize: true,
        change: function() {
            $("#game input.slider").each(function(i, item) {
                star.budget[$(item).attr("name")] = $(item).val() / 100;
            });
            star.galaxy.game.save();
        },
        load: function(slider) {
            slider.ui.wrapper.siblings("label").click(function() {
                slider.isFrozen() ? slider.unfreeze() : slider.freeze();
            });
        }
    });

    $("#end-turn-link").click(function() {
        star.galaxy.game.currentPlayer.endTurn();
        // Refresh sidebar at the end of turn
        UI.render("star", star);
        return false;
    });

    $("#research-link").click(function() {
        UI.render("research", star.galaxy.game.currentPlayer.research);
        star.galaxy.game.save();
        return false;
    });
};
