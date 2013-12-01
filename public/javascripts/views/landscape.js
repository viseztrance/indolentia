UI.views.landscape = function(star) {
    var content = new Template("layouts/landscape").process(star);
    var scene = Scene.findOrCreate("landscape");
    scene.render(content);
    scene.setActive(true);
    $("#landscape").click(function() {
        UI.render("game", UI.game);
    });
};
