describe("Battle", function() {
    var battle, canvas;

    beforeEach(function() {
        loadFixtures("battle.html");
        canvas = Raphael($("#battle-field").get(0), 500, 500);
    });

    afterEach(function() {
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
        var ship1 = new Ship({ initiative: 4 }),
            ship2 = new Ship({ initiative: 8 }),
            ship3 = new Ship({ initiative: 2 });

        beforeEach(function() {
            var attacker = new Fleet();
            attacker.addShip(ship1);
            attacker.addShip(ship2);

            var defender = new Fleet();
            defender.addShip(ship3);

            battle = new Battle(attacker, defender);
            battle.setup({
                canvas: { element: canvas },
                grid: { width: 10, height: 5 }
            });
        });

        describe("at start", function() {
            it("selects ship with the highest initiative", function() {
                expect(battle.currentShip).toEqual(ship2);
            });
        });

        describe("at end", function() {
            it("selects selects next ships by decending initiative", function() {
                battle.endTurn();
                expect(battle.currentShip).toEqual(ship1);
                battle.endTurn();
                expect(battle.currentShip).toEqual(ship3);
            });

            it("cycles through all existing ships", function() {
                var firstShip = battle.currentShip;
                battle.endTurn();
                battle.endTurn();
                battle.endTurn();
                expect(battle.currentShip).toEqual(firstShip);
            });
        });
    });
});
