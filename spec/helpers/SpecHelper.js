var callSvgEvent = function(node, name, argument) {
    var events = node.events;
    for(var i in events) {
        if(events[i].name == name) {
            $.proxy(events[i].f, argument)();
        }
    }
};