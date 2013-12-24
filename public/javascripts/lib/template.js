function Template(name) {
    this.name = name;
}

Template.cache = {};

Template.prototype.read = function() {
    var response = undefined;
    $.ajax({
        url: "/templates/" + this.name + ".tpl",
        async: false,
        cache: false,
        success: function(data) {
            response = data;
        }
    });
    return response;
};

Template.prototype.process = function(data) {
    var processor = Template.cache[this.name];
    if(!processor) {
        processor = Template.cache[this.name] = new Cyllene(this.read());
    }
    return processor.render(data);
};
