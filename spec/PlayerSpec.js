describe("Player", function() {

    describe("explore", function() {
        it("adds star to the players explored stars", function() {
            var player = new Player();
            var star = new Star();
            player.explore(star);
            expect(player.exploredStars).toEqual([star]);
        });
    });

});
