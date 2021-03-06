describe("Star", function() {

    var star, galaxy;
    var attributes = {
        name: "My star 1",
        type: "blue",
        population: 80,
        production: 10,
        maxPopulation: 100
    };

    beforeEach(function() {
        loadFixtures("map.html");
        Star.canvas = Raphael($("#map").get(0), 500, 500);
        galaxy = new Galaxy();
        galaxy.game = { currentPlayer: new Player() };
        star = new Star(attributes);
        star.galaxy = galaxy;
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
            star.attributes.population = 10;
            expect(star.creditsPerTurn().value).toEqual(5);
            star.attributes.population = 50;
            expect(star.creditsPerTurn().value).toEqual(25);
        });

        it("scales with the number of active factories", function() {
            star.attributes.population = 10;
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
            star.attributes.population = 0;
            star.budget.population = 1;
            spyOn(star, "getActiveFactories");
            star.getActiveFactories.andReturn(20);
            expect(star.populationGrowth(20)).toEqual(20 / Star.COST.population);
            star.getActiveFactories.andReturn(50);
            expect(star.populationGrowth(50)).toEqual(50 / Star.COST.population);
        });

        it("has growth hindered by budget", function() {
            star.budget.population = 0.2;
            spyOn(star, "getActiveFactories");
            spyOn(star, "wasteGrowth");
            star.wasteGrowth.andReturn(0);
            star.getActiveFactories.andReturn(20);
            star.attributes.waste = 0;
            expect(star.populationGrowth(4)).toEqual(4 / Star.COST.population);
        });
    });

    describe("industry", function() {
        it("grows at a cost of " + Star.COST.industry + " per unit", function() {
            star.attributes.population = 0;
            star.budget.industry = 1;
            spyOn(star, "getActiveFactories");
            star.getActiveFactories.andReturn(20);
            expect(star.industryGrowth()).toEqual(20 / Star.COST.industry);
            star.getActiveFactories.andReturn(50);
            expect(star.industryGrowth()).toEqual(50 / Star.COST.industry);
        });

        it("has growth hindered by budget", function() {
            star.attributes.population = 0;
            star.budget.industry = 0.2;
            spyOn(star, "getActiveFactories");
            star.getActiveFactories.andReturn(20);
            expect(star.industryGrowth()).toEqual(4 / Star.COST.industry);
        });
    });

    describe("ending the turn", function() {
        it("increases population", function() {
            spyOn(star, "populationGrowth").andReturn(5);
            star.attributes.population = 20;
            star.endTurn();
            expect(star.attributes.population).toEqual(25);
        });

        it("doesn't increase population above the preset limit", function() {
            star.attributes.maxPopulation = 22;
            spyOn(star, "populationGrowth").andReturn(5);
            star.attributes.population = 20;
            star.endTurn();
            expect(star.attributes.population).toEqual(22);
        });

        it("increases factories", function() {
            spyOn(star, "industryGrowth").andReturn(5);
            star.attributes.factories = 10;
            star.endTurn();
            expect(star.attributes.factories).toEqual(15);
        });

        it("doesn't increase factories above the preset limit", function() {
            star.attributes.maxPopulation = 22;
            spyOn(star, "industryGrowth").andReturn(60);
            star.attributes.factories = 300;
            star.endTurn();
            expect(star.attributes.factories).toEqual(330);
        });

        it("increases waste generated by active industry", function() {
            star.attributes.waste = 12;
            spyOn(star, "getActiveFactories").andReturn(20);
            expect(star.wasteGrowth()).toEqual(10);
        });

        it("increases waste accumulation", function() {
            star.attributes.waste = 120;
            spyOn(star, "getActiveFactories").andReturn(200);
            star.budget.population = 0;
            star.endTurn();
            expect(star.attributes.waste).toEqual(220);
        });

        it("kills off 1(one) population unit each turn after accumulated waste reaches critical mass", function() {
            star.attributes.population = 100;
            star.attributes.maxPopulation = 100;
            star.attributes.waste = 120;
            star.endTurn();
            expect(star.attributes.population).toEqual(99);
        });

        it("stops killing population when population is down to 15% of max", function() {
            star.attributes.population = 13;
            star.attributes.maxPopulation = 100;
            star.attributes.waste = 1100;
            star.endTurn();
            expect(star.attributes.population).toEqual(13);
        });
    });
});
