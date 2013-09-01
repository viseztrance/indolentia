$(function() {
    var game = MemoryStore.read("game");

    if(!game) {
        game = new Game(MemoryStore.read("map"));
        // Load technologies
        $.ajax({
            url: "/data/tech-tree.json",
            async: false,
            cache: false,
            dataType: "json",
            success: function(entries) {
                game.technologies = Technology.create(entries);
            }
        });
        game.scenes = Scene.entries;

        game.create();
        MemoryStore.save("game", game);
    }
    game.render();
    game.save = function() {
        MemoryStore.save("game", game, function(object) {
            if(typeof(object) == "object") {
                var klassName = MemoryStore.getClassName(object);
                // Avoid serializing third party objects
                if(!klassName || klassName.match(/svg/i)) return false;
            }
            return object;
        });
    };
    game.onEndTurn = function() {
        game.save();
        UI.render(game.galaxy.currentStar);
    };
});
