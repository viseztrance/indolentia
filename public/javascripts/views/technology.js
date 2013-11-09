UI.views.technology = function(technology) {
    var technologies = UI.game.currentPlayer.research.technologies[technology.category]["researchable"];
    var args = $.extend({}, { researchedTechnology: technology}, {technologies: technologies });
    var content = new Template("layouts/technology").process(args);
    var scene = Scene.findOrCreate("technology");
    scene.render(content, { replace: true });
    scene.setActive(true);
    $("#technology .choice").click(function(e) {
        e.preventDefault();
        var level = $(this).data("level");
        UI.game.currentPlayer.research.technologies[technology.category]["researchable"].every(function(technology) {
            if(technology.level == level) {
                UI.game.currentPlayer.research.study(technology);
                UI.render(UI.game);
                return false;
            }
            return true;
        });
        InteractiveEvent.current().end();
    });
};
