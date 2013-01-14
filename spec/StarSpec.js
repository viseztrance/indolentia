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
        describe("per turn", function() {
            it("scales with the number of citizens", function() {
                star.currentPopulation = 10;
                expect(star.creditsPerTurn()).toEqual(5);
                star.currentPopulation = 50;
                expect(star.creditsPerTurn()).toEqual(25);
            });
        });
    });

});
