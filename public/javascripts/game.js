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
        // Load game scene
        var content = new Template("layouts/game").process({});
        var scene = new Scene("game", content);
        scene.active = true;
        scene.create();
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
        UI.getInstance().render(game.galaxy.currentStar);
    };

    UI.getInstance().set({
        info: $("aside.info")
    });

    game.map.center(game.galaxy.origin[0], game.galaxy.origin[1]);
    var homeworld = game.currentPlayer.ownedStars[0];
    $.proxy(homeworld.events.click, homeworld)();
});
