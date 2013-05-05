var MemoryStore = {

    save: function(key, object) {
        var i = 0;

        localStorage[key] = JSON.stringify(object, function(k, value) {
            if(typeof(value) == "object" && !(value instanceof Array)) {
                if(value.__klass__) { // Recursion
                    return { $reference: value.__reference__ };
                } else {
                    value.__reference__ = "r" + String(++i); // Set an identifier (keys can't be integers)
                    value.__klass__ = MemoryStore.getClassName(value);
                }
            }
            return value;

        });
    },

    read: function(key) {
        if(localStorage[key]) {
            var values = {},
                references = {};
            var data = JSON.parse(localStorage[key], function(k, value) {
                if(typeof(value) == "object") {
                    if(value.__klass__) {
                        value.__proto__ = window[value.__klass__].prototype;
                        values[value.__reference__] = value;
                        delete value.__klass__;
                        delete value.__reference__;
                    }
                    for(var i in value) {
                        if(value[i].$reference) {
                            // Because objects are passed by reference rather than value,
                            // let's leverage this by storing the parent and the attribute that matches
                            // our circular reference
                            references[value[i].$reference] = {
                                parent: value,
                                attribute: i,
                                reference: value[i].$reference
                            };
                        }
                    }
                }
                return value;
            });
            for(var i in references) {
                // Replace the circular reference in the parent so all objects are modified
                references[i].parent[references[i].attribute] = values[i];
            }
            return data;
        } else {
            return false;
        }
    },

    delete: function(key) {
        localStorage.removeItem(key);
    },

    getClassName: function(object) {
        if (object && object.constructor && object.constructor.toString) {
            var result = object.constructor.toString().match(/^function\s+(\w+)/);
            if(result && result.length > 1) {
                return result[1];
            }
        }
        return undefined;
    }

};
