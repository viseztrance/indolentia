describe("Player", function() {

    describe("playing", function() {
        var player, game;

        beforeEach(function() {
            game = new Game();
            player = new Player();
            player.game = game;
            spyOn(player, "endTurn");
        });

        afterEach(function() {
            InteractiveEvent.reset();
        });

        it("updates the game current player", function() {
            expect(game.currentPlayer).toBeFalsy();
            player.play();
            expect(game.currentPlayer).toEqual(player);
        });

        it("renders first interactive event", function() {
            var event = new InteractiveEvent("research");
            spyOn(event, "render");
            event.content = new Technology();
            event.create();
            player.play();
            expect(event.render).toHaveBeenCalled();
        });

        describe("as a human", function() {
            beforeEach(function() {
                player.humanControlled = true;
            });

            it("doesn't end the turn automatically", function() {
                player.play();
                expect(player.endTurn.callCount).toEqual(0);
            });
        });

        describe("as a computer", function() {
            beforeEach(function() {
                player.humanControlled = false;
            });

            it("ends turn", function() {
                player.play();
                expect(player.endTurn.callCount).toEqual(1);
            });
        });
    });

    describe("explore", function() {
        it("adds star to the players explored stars", function() {
            var player = new Player();
            var star = new Star();
            player.explore(star);
            expect(player.exploredStars).toEqual([star]);
        });
    });

    describe("ending the turn", function() {
        var game, player;

        beforeEach(function() {
            game = new Game();
            player = new Player();
            player.game = game;
            player.research = new Research(this.technologies);
            spyOn(game, "nextPlayer"); // To avoid recursion, if no human players are present this method should always be stubbed
        });

        it("ends the turn for each player owned star", function() {
            spyOn(player, "play");
            player.game.players = [player];
            player.ownedStars = [new Star(), new Star()];
            for(var i in player.ownedStars) {
                spyOn(player.ownedStars[i], "endTurn");
            }
            player.endTurn();
            for(var j in player.ownedStars) {
                expect(player.ownedStars[j].endTurn.callCount).toEqual(1);
            }
        });

        it("passes control to the next player", function() {
            player.endTurn();
            expect(game.nextPlayer.callCount).toEqual(1);
        });

        it("performs research", function() {
            spyOn(player.research, "perform");
            player.endTurn();
            expect(player.research.perform.callCount).toEqual(1);
        });
    });

    describe("credits", function() {
        it("scales with budget", function() {
            var player = new Player(),
                star = new Star();
            star.budget = { ships: 0.4, population: 0.3, defence: 0.3 };
            player.ownedStars = [star];
            spyOn(star, "calculateCredits").andReturn(120);
            var credits = player.creditsPerTurn();
            expect(credits.ships).toEqual(48);
            expect(credits.population).toEqual(36);
            expect(credits.defence).toEqual(36);
        });

        it("scales with the number of stars", function() {
            var player = new Player();
            var star1 = new Star(),
                star2 = new Star();
            star1.budget = { ships: 0.2, population: 0.5, defence: 0.3 };
            star2.budget = { ships: 0.4, population: 0.6, defence: 0 };
            spyOn(star1, "calculateCredits").andReturn(120);
            spyOn(star2, "calculateCredits").andReturn(60);
            player.ownedStars = [star1, star2];
            var credits = player.creditsPerTurn();
            expect(credits.ships).toEqual(48);
            expect(credits.population).toEqual(96);
            expect(credits.defence).toEqual(36);
        });
    });
});
