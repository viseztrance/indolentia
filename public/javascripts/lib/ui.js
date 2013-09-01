var UI = {};

UI.render = function(object) {
    var klass = MemoryStore.getClassName(object).toLowerCase();
    $.proxy(this.modules[klass], this)(object);
};

UI.modules = {
    game: function(game) {
        var content = new Template("layouts/game").process({});
        var scene = Scene.findOrCreate("game");
        scene.render(content);
        scene.setActive(true);

        game.map = new Map($("div.map"));
        game.map.create();

        Star.canvas = game.map.canvas;
        game.galaxy.render();

        game.map.center(game.galaxy.origin[0], game.galaxy.origin[1]);
        var homeworld = game.currentPlayer.ownedStars[0];
        $.proxy(homeworld.events.click, homeworld)();
    },
    research: function(research) {
        var content = new Template("layouts/research").process(research);
        var scene = Scene.findOrCreate("research");
        scene.render(content);
        scene.setActive(true);

        $("#research .back").click(function() {
            scene.destroy();
            UI.render(UI.game);
            return false;
        });

        for(var i in research.budget) {
            $("#research input.slider[name=" + i + "]").val(research.budget[i] * 100);
        }
        $("#research input.slider").slide({
            equalize: true,
            change: function() {
                $("#research input.slider").each(function(i, item) {
                    research.budget[$(item).attr("name")] = $(item).val() / 100;
                });
                UI.game.save();
            },
            load: function(slider) {
                slider.ui.wrapper.siblings("label").click(function() {
                    slider.isFrozen() ? slider.unfreeze() : slider.freeze();
                });
            }
        });
        $("#research .available nav a").click(function() {
            $("#research .available").find("nav li, .contents div").removeClass("active");
            $("#" + $(this).data("content-for") + "-content").add($(this).parents("li")).addClass("active");
            return false;
        });
        $("#research .available nav a:first").click();
    },
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
            // Refresh sidebar at the end of turn
            star.galaxy.game.currentPlayer.endTurn();
            return false;
        });

        $("#research-link").click(function() {
            UI.render(star.galaxy.game.currentPlayer.research);
            star.galaxy.game.save();
            return false;
        });
    }
};
