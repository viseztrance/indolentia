var MemoryStore = {

    save: function(key, object, filter) {
        var i = 0,
            data = [];

        localStorage[key] = JSON.stringify(object, function(k, value) {
            if(filter) value = filter(value);
            if(typeof(value) == "object" && !(value instanceof Array)) {
                if(value.__klass__) { // Recursion
                    return { $reference: value.__reference__ };
                } else {
                    value.__reference__ = "r" + String(++i); // Set an identifier (keys can't be numbers, including typecasted strings)
                    value.__klass__ = MemoryStore.getClassName(value);
                }
                data.push(value);
            }
            return value;
        });
        // Clean objects
        for(var j in data) {
            delete data[j].__klass__;
            delete data[j].__reference__;
            delete data[j].$reference;
        }
    },

    read: function(key) {
        if(localStorage[key]) {
            var values = {},
                references = [];
            var data = JSON.parse(localStorage[key], function(k, value) {
                if(value && typeof(value) == "object") {
                    if(value.__klass__) {
                        value.__proto__ = window[value.__klass__].prototype;
                        values[value.__reference__] = value;
                        delete value.__klass__;
                        delete value.__reference__;
                    }
                    for(var i in value) {
                        if(value[i] && value[i].$reference) {
                            // Because objects are passed by reference rather than value,
                            // let's leverage this by storing the parent and the attribute that matches
                            // our circular reference
                            references.push({
                                parent: value,
                                attribute: i,
                                reference: value[i].$reference
                            });
                        }
                    }
                }
                return value;
            });
            for(var i in references) {
                // Replace the circular reference in the parent so all objects are modified
                references[i].parent[references[i].attribute] = values[references[i].reference];
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
