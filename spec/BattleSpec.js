describe("Battle", function() {
    var battle, canvas;

    beforeEach(function() {
        loadFixtures("battle.html");
        canvas = Raphael($("#battle-field").get(0), 500, 500);
        $("svg").hide();
    });

    describe("setting up", function() {
        var attacker1 = new Ship(),
            attacker2 = new Ship(),
            defender1 = new Ship();

        beforeEach(function() {
            var attacker = new Fleet();
            attacker.addShip(attacker1);
            attacker.addShip(attacker2);

            var defender = new Fleet();
            defender.addShip(defender1);

            battle = new Battle(attacker, defender);
            battle.setup({
                canvas: { element: canvas },
                grid: { width: 10, height: 5 }
            });
        });

        it("creates a grid of a given width and height", function() {
            expect(battle.grid.length).toEqual(5);
            for(var i = 0; i < 5; i++) {
                expect(battle.grid[i].length).toEqual(10);
            }
        });

        it("assigns attacking ships to the left side of the grid", function() {
            expect(attacker1.tile.coordinates).toEqual([0, 0]);
            expect(attacker2.tile.coordinates).toEqual([0, 1]);
        });

        it("assigns defending ships to the right side of the grid", function() {
            expect(defender1.tile.coordinates).toEqual([9, 0]);
        });
    });

    describe("player turn", function() {
        describe("at start", function() {
            it("selects fastest ship", function() {

            });
        });

        describe("at end", function() {
            it("selects selects next ships by decending speed", function() {

            });

            it("cycles through all existing ships", function() {

            });
        });
    });
});
