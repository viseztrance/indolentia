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
            game.endTurn();
            expect(game.turnCount).toEqual(1);
            game.endTurn();
            expect(game.turnCount).toEqual(2);
        });

        it("ends stars turn", function() {
            var game = new Game(options);
            game.create();

            for(var i in game.galaxy.stars) {
                spyOn(game.galaxy.stars[i], "endTurn");
            }
            game.endTurn();
            for(var j in game.galaxy.stars) {
                expect(game.galaxy.stars[j].endTurn.callCount).toEqual(1);
            }
        });
    });

});
