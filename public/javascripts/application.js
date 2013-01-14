$(function() {
    var game = MemoryStore.read("game");

    if(!game) {
        game = new Game(MemoryStore.read("map"));
        game.create();
        MemoryStore.save("game", game);
    }
    game.render();

    UI.getInstance().set({
        info: $("aside.info")
    });

    game.map.center(game.galaxy.origin[0], game.galaxy.origin[1]);
    var homeworld = game.currentPlayer.ownedStars[0];
    $.proxy(homeworld.events.click, homeworld)();
});
