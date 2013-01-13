$(function() {
    var game = MemoryStore.read("game");

    if(!game) {
        game = new Game(MemoryStore.read("map"));
        game.create();
        MemoryStore.save("game", game);
    }
    game.render();
    game.map.center(game.galaxy.origin[0], game.galaxy.origin[1]);

    UI.getInstance().set({
        info: $("aside.info")
    });

    // $("#zoom-in").click(function() {
    //     map.zoomIn(1.05);
    // });
    // $("#zoom-out").click(function() {
    //     map.zoomOut(1.05);
    // });

});
