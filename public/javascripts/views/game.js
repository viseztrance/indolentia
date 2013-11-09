UI.views.game = function(game) {
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
};
