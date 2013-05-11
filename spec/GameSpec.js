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

    describe("ending turn", function() {
        it("increments turn count", function() {
            var game = new Game(options);
            game.create();
            game.endTurn();
            expect(game.turnCount).toEqual(1);
            game.endTurn();
            expect(game.turnCount).toEqual(2);
        });

        // TODO: revise this, may need to be removed
        xit("ends player turn", function() {
            var game = new Game(options);
            game.create();

            for(var i in game.players) {
                spyOn(game.players[i], "endTurn");
            }
            game.endTurn();
            for(var j in game.players) {
                expect(game.players[j].endTurn.callCount).toEqual(1);
            }
        });
    });

    describe("next player", function() {
        var player1, player2, player3, game;

        beforeEach(function() {
            game = new Game();
            player1 = new Player({ color: "blue" });
            player2 = new Player({ color: "red" });
            player3 = new Player({ color: "yellow" });
            game.players = [player1, player2, player3];
            for(var i in game.players) {
                game.players[i].game = game;
                spyOn(game.players[i], "endTurn");
            }
        });

        it("sets the next player as the current player", function() {
            game.currentPlayer = player1;
            game.nextPlayer();
            expect(game.currentPlayer).toEqual(player2);
            game.nextPlayer();
            expect(game.currentPlayer).toEqual(player3);
        });

        describe("when current player is the last player", function() {
            beforeEach(function() {
                game.currentPlayer = player3;
            });

            it("sets the first player as the current player", function() {
                game.nextPlayer();
                expect(game.currentPlayer).toEqual(player1);
            });

            it("ends the game turn", function() {
                spyOn(game, "endTurn");
                game.nextPlayer();
                expect(game.endTurn.callCount).toEqual(1);
            });
        });
    });

});
