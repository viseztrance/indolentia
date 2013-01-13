function MyObject(value) {
    this.attr = value;
};

describe("MemoryStore", function() {

    beforeEach(function() {
        localStorage.clear();
    });

    describe("Saving", function() {
        it("serializes data into localStorage", function() {
            MemoryStore.save("say", { hello: "world" });
            expect(localStorage["say"]).toEqual('{"hello":"world","__klass__":"Object"}');
        });

        it("serializes circular dependencies", function() {
            var a = new MyObject();
            var b = new MyObject();
            a.b = a;
            expect(function() {
                MemoryStore.save("circular", a);
            }).not.toThrow();
        });
    });

    describe("Retrieving", function() {
        it("deserializes data from localStorage", function() {
            localStorage["say"] = '{"hello":"world"}';
            expect(MemoryStore.read("say")).toEqual({ hello: "world" });
        });

        it("restores object prototypes", function() {
            var greeting = new MyObject("hello world");
            MemoryStore.save("say", greeting);
            greeting = MemoryStore.read("say");
            expect(greeting instanceof(MyObject)).toBeTruthy();
            expect(greeting.attr).toEqual("hello world");
        });

        it("restores nested objects", function() {
            var greeting = new MyObject(new MyObject("Nested hello world"));
            MemoryStore.save("say", greeting);
            greeting = MemoryStore.read("say");
            expect(greeting.attr.attr).toEqual("Nested hello world");
        });

        it("restores circular dependencies", function() {
            var a = new MyObject();
            var b = new MyObject();
            a.b = a;
            MemoryStore.save("circular", a);
            var circular = MemoryStore.read("circular");
            expect(circular.b).toEqual(circular);
        });
    });

    describe("Deleting", function() {
        it("removes key value from localStorage", function() {
            MemoryStore.save("say", { hello: "world" });
            MemoryStore.delete("say");
            expect(localStorage["say"]).toBeFalsy();
        });

        it("doesn't affect other stored values", function() {
            MemoryStore.save("say", { hello: "world" });
            MemoryStore.save("whisper", { goodbye: "world" });
            MemoryStore.delete("say");
            expect(localStorage["whisper"]).toEqual('{"goodbye":"world","__klass__":"Object"}');
        });
    });

});
