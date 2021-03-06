UI.views.landscape = function(star) {
    var content = new Template("layouts/landscape").process({ star: star });
    var scene = Scene.findOrCreate("landscape");
    scene.render(content, { replace: true });
    scene.setActive(true);
    $("#landscape").click(function() {
        UI.render("game", UI.game);
    });
};
