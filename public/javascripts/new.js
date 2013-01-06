$(function() {
    $("form").submit(function() {
        var current = $(this).find("fieldset:visible");
        var next = current.next("fieldset");
        if(next.length) {
            current.hide();
            next.show();
        } else {
            MemoryStore.save("map", $(this).serializeJSON());
            window.location = "/game.html";
        }
        return false;
    });
});
