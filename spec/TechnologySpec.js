describe("Technology", function() {
    var technologyAttributes = {
        level: 1,
        description: "some description",
        name: "Some name"
    };

    describe("given a json object", function() {
        var technologies = [];

        it("groups entries by category", function() {
            var data = {
                category1: [technologyAttributes, technologyAttributes],
                category2: [technologyAttributes]
            };
            var entries = Technology.create(data);
            expect(entries["category1"]).toBeTruthy();
            expect(entries["category2"]).toBeTruthy();
        });

        it("populates categories with instances", function() {
            var data = { category1: [technologyAttributes, technologyAttributes] };
            var entries = Technology.create(data);
            expect(entries["category1"].length).toEqual(2);
            expect(entries["category1"][0] instanceof(Technology)).toBeTruthy();
            expect(entries["category1"][1] instanceof(Technology)).toBeTruthy();
        });
    });

    describe("cost", function() {
        it("scales up with level", function() {
            var technology = new Technology("category1", technologyAttributes);
            var initialCost = technology.cost();
            technology.level += 1;
            expect(technology.cost()).toBeGreaterThan(initialCost);
        });
    });

});

