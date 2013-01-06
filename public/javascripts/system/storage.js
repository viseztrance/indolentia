var MemoryStore = {

    save: function(key, object) {
        localStorage[key] = JSON.stringify(JSON.decycle(object));
    },

    read: function(key) {
        if(localStorage[key]) {
            var data = JSON.parse(localStorage[key]);
            data = JSON.retrocycle(this.toObject(data));
            return data;
        } else {
            return false;
        }
    },

    delete: function(key) {
        localStorage.removeItem(key);
    },

    toObject: function(object) {
        if(object.__className__) {
            object.__proto__ = window[object.__className__].prototype;
        }
        for(key in object) {
            if(typeof(object[key]) == "object") {
                object[key] = this.toObject(object[key]);
            }
        }
        return object;
    }

};
