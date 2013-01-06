$(function() {
    var game = MemoryStore.read("game");

    if(!game) {
        game = new Game(MemoryStore.read("map"));
        game.create();
        // MemoryStore.save("game", game);
    }
    game.render();

    // var stars = ($.map(galaxy.stars, function(star) {
    //     return [[star.attributes.x_axis, star.attributes.y_axis]];
    // }));
    // console.log(new ConvexHull(stars).getValues());
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
