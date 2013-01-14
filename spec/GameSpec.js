describe("Game", function() {
    var options = {
        color: "blue",
        race: "beta",
        players: 3,
        size: 50
    };

    describe("creating", function() {
        it("creates a galaxy", function() {
            var game = new Game(options);
            game.create();
            expect(game.galaxy instanceof Galaxy).toBeTruthy();
        });

        it("creates an arbitrary number of players", function() {
            var game = new Game(options);
            game.create();
            expect(game.players.length).toEqual(3);
        });
    });

    describe("next turn", function() {
        it("increments turn count", function() {
            var game = new Game(options);
            game.create();
            game.nextTurn();
            expect(game.turnCount).toEqual(1);
            game.nextTurn();
            expect(game.turnCount).toEqual(2);
        });
    });

});
