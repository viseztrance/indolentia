UI.views.research = function(research) {
    var content = new Template("layouts/research").process(research);
    var scene = Scene.findOrCreate("research");
    scene.render(content);
    scene.setActive(true);

    $("#research .back").click(function() {
        scene.destroy();
        UI.render("game", UI.game);
        UI.game.save();
        return false;
    });

    for(var i in research.budget) {
        $("#research input.slider[name=" + i + "]").val(research.budget[i] * 100);
    }
    $("#research input.slider").slide({
        equalize: true,
        change: function() {
            $("#research input.slider").each(function(i, item) {
                research.budget[$(item).attr("name")] = $(item).val() / 100;
            });
            UI.game.save();
        },
        load: function(slider) {
            slider.ui.wrapper.siblings("label").click(function() {
                slider.isFrozen() ? slider.unfreeze() : slider.freeze();
            });
        }
    });
    $("#research .available nav a").click(function() {
        $("#research .available").find("nav li, .contents div").removeClass("active");
        $("#" + $(this).data("content-for") + "-content").add($(this).parents("li")).addClass("active");
        return false;
    });
    $("#research .available nav a:first").click();
};
