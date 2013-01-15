// Based on the micro templating system made by John Resig (http://ejohn.org/)
//
// http://ejohn.org/blog/javascript-micro-templating/

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

Template.prototype.parse = function(string) {
    return new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +

        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +

        // Convert the template into pure JavaScript
        string.replace(/[\r\t\n]/g, " ")
              .split("<%").join("\t")
              .replace(/((^|%>)[^\t]*)'/g, "$1\r")
              .replace(/\t=(.*?)%>/g, "',$1,'")
              .split("\t").join("');")
              .split("%>").join("p.push('")
              .split("\r").join("\\'")
              + "');}return p.join('');");
};

Template.prototype.process = function(data) {
    var processor = Template.cache[this.name];
    if(!processor) {
        processor = Template.cache[this.name] = this.parse(this.read());
    }
    return processor(data);
};
