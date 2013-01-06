describe("Galaxy", function() {
    var starAttributes = {
        name: "My shining star",
        type: "blue",
        population: 50
    };

    beforeEach(function() {
        loadFixtures("map.html");
        Star.canvas = Raphael($("#map").get(0), 500, 500);
        UI.getInstance().set({
            info: $("aside.info")
        });
    });

    it("creates a star for each entry received", function() {
        var galaxy = new Galaxy([starAttributes, starAttributes, starAttributes]);
        galaxy.create();
        expect(galaxy.stars.length).toEqual(3);
    });

    it("finds a star by its coordinates", function() {
        var galaxy = new Galaxy([
            $.extend({}, starAttributes, { x_axis: 5, y_axis: 10 }),
            $.extend({}, starAttributes, { x_axis: 5, y_axis: 13 }),
            $.extend({}, starAttributes, { x_axis: 7, y_axis: 1 })
        ]);
        galaxy.create();
        var star = galaxy.findStarByCoordinates([5, 13]);
        expect(star instanceof(Star)).toBeTruthy();
        expect(star.attributes.x_axis).toEqual(5);
        expect(star.attributes.y_axis).toEqual(13);
    });

});
