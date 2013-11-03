$(function() {
    $("form").submit(function() {
        Perseverance.delete("game");

        var current = $(this).find("fieldset:visible");
        var next = current.next("fieldset");
        if(next.length) {
            current.hide();
            next.show();
        } else {
            Perseverance.save("map", $(this).serializeJSON());
            window.location = "/game.html";
        }
        return false;
    });
});
