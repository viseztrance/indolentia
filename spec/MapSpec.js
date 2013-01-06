describe("Map", function() {

    var wrapper, map;

    beforeEach(function() {
        loadFixtures("map.html");
        wrapper = $("#map");
        wrapper.width("600");
        wrapper.height("400");
        map = new Map(wrapper);
    });

    it("uses entire container width", function() {
        map.create();
        expect(wrapper.find("svg").width()).toEqual(600);
        expect(wrapper.find("svg").height()).toEqual(400);
    });

    describe("zooming in", function() {
        beforeEach(function() {
            map.create();
        });

        it("is prohibited once max zoom is reached", function() {
            map.MAX_ZOOM = 2;
            spyOn(map, "render");
            expect(map.zoomIn(1.3)).toBeTruthy();
            expect(map.zoomIn(1.3)).toBeTruthy();
            expect(map.zoomIn(1.3)).toBeFalsy();
            expect(map.render.callCount).toEqual(2);
        });
    });

    describe("zooming out", function() {
        it("is prohibited once min zoom is reached", function() {
            map.MIN_ZOOM = -2;
            spyOn(map, "render");
            expect(map.zoomOut(1.3)).toBeTruthy();
            expect(map.zoomOut(1.3)).toBeTruthy();
            expect(map.zoomOut(1.3)).toBeFalsy();
            expect(map.render.callCount).toEqual(2);
        });
    });

});