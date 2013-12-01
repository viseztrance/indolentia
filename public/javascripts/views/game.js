UI.views.game = function(game) {
    var content = new Template("layouts/game").process({});
    var scene = Scene.findOrCreate("game");
    scene.render(content);
    scene.setActive(true);

    game.map = new Map($("div.map"));
    game.map.create();

    Star.canvas = game.map.canvas;
    game.galaxy.render();

    game.galaxy.stars.every(function(star) {
        star.data.body.click(function() {
            if(game.galaxy.currentStar && game.galaxy.currentStar.selection) {
                $.proxy(game.galaxy.currentStar.animations.deselect, game.galaxy.currentStar)();
                if(game.galaxy.currentStar == star) {
                    UI.render("landscape", star);
                    return false;
                }
            }

            UI.render("star", star);
            game.galaxy.setCurrentStar(star);
            $.proxy(star.animations.select, star)();
            return true;
        });

        star.data.body.hover(function() {
            if(game.galaxy.currentStar && star.attributes.reachable) {
                game.galaxy.path = game.galaxy.currentStar.pathTo(star);
            }
        }, function() {
            if(game.galaxy.path) {
                game.galaxy.path.remove();
            }
        });

        return true;
    });

    game.map.center(game.galaxy.origin[0], game.galaxy.origin[1]);
    var homeworld = game.currentPlayer.ownedStars[0];
    game.galaxy.currentStar = null;
    homeworld.data.body.trigger("click");
};
