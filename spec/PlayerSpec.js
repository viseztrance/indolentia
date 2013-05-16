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

        it("makes defaults available", function() {
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

            describe("being performed", function() {
                var technology, game, player;

                beforeEach(function() {
                    technology = new Technology("weapons", { level: 1 });
                    game = new Game();
                    player = new Player();
                    player.researchBudget.weapons = 0.2;
                    player.game = game;
                    spyOn(game, "nextPlayer"); // Let's avoid recursion
                    spyOn(player, "creditsPerTurn").andReturn({ research: 100 });
                    player.setTechnologies({ weapons: [technology] });
                    player.research(technology);
                });

                it("increases research funds", function() {
                    spyOn(technology, "cost").andReturn(80);
                    player.performResearch();
                    expect(player.technologies.weapons.researching.credits).toEqual(20);
                    player.performResearch();
                    expect(player.technologies.weapons.researching.credits).toEqual(40);
                });

                describe("on finish", function() {
                    beforeEach(function() {
                        spyOn(technology, "cost").andReturn(15);
                    });

                    it("substracts raised credits from the technology cost", function() {
                        player.performResearch();
                        expect(player.technologies.weapons.researching.credits).toEqual(5);
                    });

                    it("moves current item from the researching pool to the researched", function() {
                        expect(player.technologies.weapons.available).toEqual([]);
                        player.performResearch();
                        expect(player.technologies.weapons.researching.item).toBeFalsy();
                        expect(player.technologies.weapons.available).toEqual([technology]);
                    });
                });
            });
        });
    });

    describe("ending the turn", function() {
        var game, player;

        beforeEach(function() {
            game = new Game();
            player = new Player();
            player.game = game;
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
            spyOn(player, "performResearch");
            player.endTurn();
            expect(player.performResearch.callCount).toEqual(1);
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

    describe("budget allocation", function() {
        var player, credits;
        beforeEach(function() {
            player = new Player();
            credits = player.researchPerTurn();
            credits.value = 180;
        });

        it("has a percentage assigned for computers", function() {
            player.researchBudget.computers = 0.3;
            expect(credits.forComputers()).toEqual(54);
            player.researchBudget.computers = 0.5;
            expect(credits.forComputers()).toEqual(90);
        });

        it("has a percentage assigned for construction", function() {
            player.researchBudget.construction = 0.3;
            expect(credits.forConstruction()).toEqual(54);
            player.researchBudget.construction = 0.5;
            expect(credits.forConstruction()).toEqual(90);
        });

        it("has a percentage assigned for shields", function() {
            player.researchBudget.shields = 0.3;
            expect(credits.forShields()).toEqual(54);
            player.researchBudget.shields = 0.5;
            expect(credits.forShields()).toEqual(90);
        });

        it("has a percentage assigned for planetology", function() {
            player.researchBudget.planetology = 0.3;
            expect(credits.forPlanetology()).toEqual(54);
            player.researchBudget.planetology = 0.5;
            expect(credits.forPlanetology()).toEqual(90);
        });

        it("has a percentage assigned for propulsion", function() {
            player.researchBudget.propulsion = 0.3;
            expect(credits.forPropulsion()).toEqual(54);
            player.researchBudget.propulsion = 0.5;
            expect(credits.forPropulsion()).toEqual(90);
        });

        it("has a percentage assigned for weapons", function() {
            player.researchBudget.weapons = 0.3;
            expect(credits.forWeapons()).toEqual(54);
            player.researchBudget.weapons = 0.5;
            expect(credits.forWeapons()).toEqual(90);
        });
    });
});
