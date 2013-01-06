describe("Star", function() {

    var star, galaxy;

    beforeEach(function() {
        loadFixtures("map.html");
        Star.canvas = Raphael($("#map").get(0), 500, 500);
        galaxy = new Galaxy();
        UI.getInstance().set({
            info: $("aside.info")
        });
    });

    describe("when clicked", function() {
        beforeEach(function() {
            star = new Star({
                name: "My star 1",
                type: "blue",
                population: 80,
                production: 10
            });
            star.galaxy = galaxy;
            star.create();
        });

        it("updates galaxy current star to the object instance", function() {
            expect(galaxy.currentStar).toBeFalsy();
            callSvgEvent(star.data.body, "click", star);
            expect(galaxy.currentStar).toEqual(star);
        });
    });

});
