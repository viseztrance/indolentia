describe("Player", function() {

    describe("playing", function() {
        var player, game;

        beforeEach(function() {
            game = new Game();
            player = new Player();
            player.game = game;
            spyOn(player, "endTurn");
        });

        it("updates the game current player", function() {
            expect(game.currentPlayer).toBeFalsy();
            player.play();
            expect(game.currentPlayer).toEqual(player);
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

    describe("technologies", function() {
        var technology1, technology2, technology3, technology4, technology5, technologies;

        beforeEach(function() {
            technology1 = new Technology("cat1", { level: 1, default: true }),
            technology2 = new Technology("cat1", { level: 1 }),
            technology3 = new Technology("cat1", { level: 2, default: true }),
            technology4 = new Technology("cat2", { level: 1 }),
            technology5 = new Technology("cat2", { level: 2 });
            technologies = { cat1: [technology1, technology2, technology3], cat2: [technology4, technology5] };
        });

        it("makes available defaults available", function() {
            var player = new Player();
            player.setTechnologies(technologies);
            expect(player.technologies.cat1.available).toEqual([technology1, technology3]);
            expect(player.technologies.cat2.available).toEqual([]);
        });

        it("makes all non defaults researchable", function() {
            var player = new Player();
            player.setTechnologies(technologies);
            expect(player.technologies.cat1.researchable).toEqual([technology2]);
            expect(player.technologies.cat2.researchable).toEqual([technology4, technology5]);
        });

        describe("researching", function() {
            it("sets current technology to the researching queue", function() {
                var player = new Player();
                player.setTechnologies(technologies);
                player.research(technology2);
                expect(player.technologies.cat1.researching.item).toEqual(technology2);
            });

            it("removes researched technologies from the researchable stack", function() {
                var player = new Player();
                player.setTechnologies(technologies);
                player.research(technology4);
                expect(player.technologies.cat2.researchable).toEqual([technology5]);
            });

            it("doesn't take any action if something is already being researched", function() {
                var player = new Player();
                player.setTechnologies(technologies);
                player.research(technology4);
                player.research(technology5);
                expect(player.technologies.cat2.researchable).toEqual([technology5]);
            });
        });
    });

    describe("ending the turn", function() {
        it("ends the turn for each player owned star", function() {
            var player = new Player();
            spyOn(player, "play");
            player.game = new Game();
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
            var game = new Game();
            var player = new Player();
            player.game = game;
            spyOn(game, "nextPlayer");
            player.endTurn();
            expect(game.nextPlayer.callCount).toEqual(1);
        });

        xit("increases current research funds", function() {

        });
    });
});
