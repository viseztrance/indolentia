/*
 Copyright (c) 2013 Daniel Mircea

 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the
 "Software"), to deal in the Software without restriction, including
 without limitation the rights to use, copy, modify, merge, publish,
 distribute, sublicense, and/or sell copies of the Software, and to
 permit persons to whom the Software is furnished to do so, subject to
 the following conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var Cyllene = function(contents) {
    this.contents = contents;
};

Cyllene.MATCHER = "(({?{{%?|{%)(.*?)(%}|%?}}}?))";

Cyllene.prototype.render = function(locals) {
    locals = locals || {};

    for(var name in Cyllene.helpers) {
        locals[name] = Cyllene.helpers[name];
    }
    return this.compile(this.preprocess(), locals);
};

Cyllene.prototype.preprocess = function(data) {
    var delimiter = "~~~";
    var fragments = this.contents.replace(new RegExp(Cyllene.MATCHER, "g"), delimiter + "{$1}" + delimiter).
                                  split(new RegExp(delimiter + "{|}" + delimiter));
    var result = "",
        fragmentCount = fragments.length;

    for(var i = 0; i < fragmentCount; i++) {
        result += this.parse(fragments[i]);
    }
    return result;
};

Cyllene.prototype.parse = function(fragment) {
    var result  = "",
        matches = fragment.match(new RegExp(Cyllene.MATCHER));
    if(matches) {
        var type  = matches[2],
            value = matches[3];
        var isCode   = type.slice(-2) == "{%",
            isSafe   = type.substr(0, 3) == "{{{";
        if(isCode) {
            result = value.replace(/(else.*):(\s+)?$/, "} $1 {").
                           replace(/:(\s+)?$/, " {\n").
                           replace(/end.\w+;(\s+)?$/, "}\n");
        } else {
            if(!isSafe) value = "_sanitize(" + value +  ")";
            result = "output += " + value + ";\n";
        }
    } else {
        result = "output += '" + fragment.replace(/'/g, "\\'").
                                          replace(/[\r\n]/g, "\\\n") + "';\n";
    }
    return result;
};

Cyllene.prototype.compile = function(data, locals) {
    var fn = "var output = '';\n\
              with(locals) { \n\
                  " + data + "\
              }; \n\
              return output;";
    return (new Function("locals", fn))(locals);
};

Cyllene.helpers = {
    _sanitize: function(text) {
        var wrapper = document.createElement("div");
        var node = document.createTextNode(text);
        wrapper.appendChild(node);
        return wrapper.innerHTML;
    }
};
