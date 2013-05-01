$(function() {
    var defender = new Fleet(),
        attacker = new Fleet();
    for(var i = 0; i < 6; i++) {
        var defenderShip = new Ship();
        defenderShip.count = Faker.Helpers.randomNumber(10) + 1;
        defender.addShip(defenderShip);

        var attackingShip = new Ship();
        attackingShip.count = Faker.Helpers.randomNumber(10) + 1;
        attacker.addShip(attackingShip);
    }

    var battle = new Battle(defender, attacker);
    battle.setup({
        canvas: {
            element: $("#battle-field").get(0),
            width: 900,
            height: 600
        },
        grid: {
            width: 9,
            height: 6
        }
    });
    $("#move").click(function() {
        // actions: attack or move
        // location from event
        // if it's an attack type of weapon
        battle.takeAction("attack");
        return false;
    });
});
