$(function() {
    var game = Perseverance.read("game");

    if(!game) {
        game = new Game(Perseverance.read("map"));
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
        Perseverance.save("game", game);
    }
    game.render();
    game.save = function() {
        Perseverance.save("game", game, function(object) {
            if(typeof(object) == "object") {
                var klassName = Perseverance.getClassName(object);
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
