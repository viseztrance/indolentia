var MemoryStore = {

    save: function(key, object) {
        localStorage[key] = JSON.stringify(JSON.decycle(this.preserveConstructor(object)));
    },

    read: function(key) {
        if(localStorage[key]) {
            var data = JSON.parse(localStorage[key]);
            data = this.restoreConstructor(JSON.retrocycle(data));
            return data;
        } else {
            return false;
        }
    },

    delete: function(key) {
        localStorage.removeItem(key);
    },

    preserveConstructor: function(object) {
        if(!(object instanceof Array)) {
            object.__klass__ = this.getClassName(object);
        }

        for(var key in object) {
            if(typeof(object[key]) == "object" && !object[key].__klass__) {
                object[key] = this.preserveConstructor(object[key]);
            }
        }
        return object;
    },

    restoreConstructor: function(object) {
        var parsed = false;

        if(object.__klass__) {
            object.__proto__ = window[object.__klass__].prototype;
            delete object.__klass__;
            parsed = true;
        }
        if(parsed || object instanceof Array) {
            for(var key in object) {
                if(typeof(object[key]) == "object") {
                    object[key] = this.restoreConstructor(object[key]);
                }
            }
        }
        return object;
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
