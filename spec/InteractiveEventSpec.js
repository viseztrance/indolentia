describe("InteractiveEvent", function() {
    var event, category;

    beforeEach(function() {
        category = "someName";
        event = new InteractiveEvent(category);
    });

    afterEach(function() {
        InteractiveEvent.reset();
    });

    describe("creating", function() {
        it("appends entry to the entries list", function() {
            event.create();
            expect(InteractiveEvent.entries[category].length).toEqual(1);
            expect(InteractiveEvent.entries[category]).toContain(event);
        });
    });

    describe("getting next item", function() {
        var secondaryEvent;

        describe("having at least another event in the current category", function() {
            it("retrieves first entry from current category", function() {
                secondaryEvent = new InteractiveEvent(category);
                secondaryEvent.create();
                event.create();
                event.destroy();
                expect(event.next()).toEqual(secondaryEvent);
            });
        });

        describe("having no entries present in current category", function() {
            describe("having entries present in other categories", function() {
                it("retrieves first entry from one of the other categories", function() {
                    secondaryEvent = new InteractiveEvent("misc");
                    secondaryEvent.create();
                    event.create();
                    event.destroy();
                    expect(event.next()).toEqual(secondaryEvent);
                });
            });
            describe("having no entries present in other categories", function() {
                it("returns an falsy value", function() {
                    event.create();
                    event.destroy();
                    expect(event.next()).toBeFalsy();
                });
            });
        });

    });

    describe("destroying", function() {
        beforeEach(function() {
            event.create();
        });

        it("removes instance from list", function() {
            expect(InteractiveEvent.entries[category].length).toEqual(1);
            event.destroy();
            expect(InteractiveEvent.entries[category].length).toEqual(0);
        });
    });
});
