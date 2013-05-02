describe("Star", function() {

    var star, galaxy;
    var attributes = {
        name: "My star 1",
        type: "blue",
        population: 80,
        production: 10
    };

    beforeEach(function() {
        loadFixtures("map.html");
        Star.canvas = Raphael($("#map").get(0), 500, 500);
        galaxy = new Galaxy();
        galaxy.game = { currentPlayer: new Player() };
        UI.getInstance().set({
            info: $("aside.info")
        });
    });

    describe("when clicked", function() {
        beforeEach(function() {
            star = new Star(attributes);
            star.galaxy = galaxy;
            star.create();
        });

        it("updates galaxy current star to the object instance", function() {
            expect(galaxy.currentStar).toBeFalsy();
            callSvgEvent(star.data.body, "click", star);
            expect(galaxy.currentStar).toEqual(star);
        });
    });

    describe("assigning player", function() {
        it("sets star player", function() {
            var player = new Player();
            star.setPlayer(player);
            expect(star.player).toEqual(player);
        });

        it("adds star to the players owned stars", function() {
            var player = new Player();
            star.setPlayer(player);
            expect(player.ownedStars).toEqual([star]);
        });

        describe("while owned by another player", function() {
            it("removes star from the player owned stars", function() {
                var victim = new Player(),
                    conqueror = new Player();
                star.setPlayer(victim);
                star.setPlayer(conqueror);
                expect(victim.ownedStars).toEqual([]);
            });
        });
    });

    describe("credits", function() {
        it("scales with the number of citizens", function() {
            star.currentPopulation = 10;
            expect(star.creditsPerTurn().value).toEqual(5);
            star.currentPopulation = 50;
            expect(star.creditsPerTurn().value).toEqual(25);
        });

        it("scales with the number of active factories", function() {
            star.currentPopulation = 10;
            spyOn(star, "getActiveFactories");
            star.getActiveFactories.andReturn(5);
            expect(star.creditsPerTurn().value).toEqual(10);
            star.getActiveFactories.andReturn(10);
            expect(star.creditsPerTurn().value).toEqual(15);
        });

        describe("budget allocation", function() {
            var credits;
            beforeEach(function() {
                credits = star.creditsPerTurn();
                credits.value = 120;
            });

            it("has a percentage assigned for ship building", function() {
                star.budget.ship = 0.2;
                expect(credits.forShip()).toEqual(24);
                star.budget.ship = 0.7;
                expect(credits.forShip()).toEqual(84);
            });

            it("has a percentage assigned for defence", function() {
                star.budget.defence = 0.2;
                expect(credits.forDefence()).toEqual(24);
                star.budget.defence = 0.7;
                expect(credits.forDefence()).toEqual(84);
            });

            it("has a percentage assigned for industry", function() {
                star.budget.industry = 0.2;
                expect(credits.forIndustry()).toEqual(24);
                star.budget.industry = 0.7;
                expect(credits.forIndustry()).toEqual(84);
            });

            it("has a percentage assigned for population", function() {
                star.budget.population = 0.2;
                expect(credits.forPopulation()).toEqual(24);
                star.budget.population = 0.7;
                expect(credits.forPopulation()).toEqual(84);
            });

            it("has a percentage assigned for technology", function() {
                star.budget.technology = 0.2;
                expect(credits.forTechnology()).toEqual(24);
                star.budget.technology = 0.7;
                expect(credits.forTechnology()).toEqual(84);
            });
        });
    });

    describe("population", function() {
        it("grows at a cost of " + Star.COST.population + " per unit", function() {
            star.currentPopulation = 0;
            star.budget.population = 1;
            spyOn(star, "getActiveFactories");
            star.getActiveFactories.andReturn(20);
            expect(star.populationGrowth()).toEqual(20 / Star.COST.population);
            star.getActiveFactories.andReturn(50);
            expect(star.populationGrowth()).toEqual(50 / Star.COST.population);
        });

        it("has growth hindered by budget", function() {
            star.budget.population = 0.2;
            spyOn(star, "getActiveFactories");
            star.getActiveFactories.andReturn(20);
            expect(star.populationGrowth()).toEqual(4 / Star.COST.population);
        });
    });

    describe("industry", function() {
        it("grows at a cost of " + Star.COST.industry + " per unit", function() {
            star.currentIndustry = 0;
            star.budget.industry = 1;
            spyOn(star, "getActiveFactories");
            star.getActiveFactories.andReturn(20);
            expect(star.industryGrowth()).toEqual(20 / Star.COST.industry);
            star.getActiveFactories.andReturn(50);
            expect(star.industryGrowth()).toEqual(50 / Star.COST.industry);
        });

        it("has growth hindered by budget", function() {
            star.budget.industry = 0.2;
            spyOn(star, "getActiveFactories");
            star.getActiveFactories.andReturn(20);
            expect(star.industryGrowth()).toEqual(4 / Star.COST.industry);
        });
    });

});
