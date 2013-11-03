describe("Scene", function() {
    var scene, content;

    beforeEach(function() {
        content = "<h1>This is the content</h1>";
        scene = new Scene("fluffy");
    });

    afterEach(function() {
        Scene.entries = [];
        $(".scene").remove();
    });

    describe("rendering", function() {
        it("creates an html element", function() {
            expect($("#fluffy.scene").length).toEqual(0);
            scene.render(content);
            expect($("#fluffy.scene").length).toEqual(1);
            expect($("#fluffy.scene").html()).toBe("<h1>This is the content</h1>");
        });

        describe("replacing content", function() {
            beforeEach(function() {
                scene.render(content);
            });

            describe("without the replace option", function() {
                it("doesn't change contents", function() {
                    scene.render("new content");
                    expect($("#fluffy.scene").html()).toBe("<h1>This is the content</h1>");
                });
            });

            describe("given the replace option", function() {
                it("changes contents", function() {
                    scene.render("new content", { replace: true });
                    expect($("#fluffy.scene").html()).toBe("new content");
                });
            });
        });

        describe("being marked as inactive", function() {
            it("doesn't set the element as active", function() {
                scene.active = false;
                spyOn(scene, "setActive");
                scene.render(content);
                expect(scene.setActive.callCount).toEqual(0);
            });
        });

        describe("being marked as active", function() {
            it("sets the element as active", function() {
                scene.active = true;
                spyOn(scene, "setActive");
                scene.render(content);
                expect(scene.setActive.callCount).toEqual(1);
            });
        });
    });

    describe("creating", function() {
        it("appends entry to the entries list", function() {
            scene.create();
            expect(Scene.entries.length).toEqual(1);
            expect(Scene.entries).toContain(scene);
        });
    });

    describe("being set as active", function() {
        beforeEach(function() {
            scene.render(content);
        });

        it("sets the active class", function() {
            expect(scene.getElement().hasClass("active")).toBeFalsy();
            scene.setActive();
            expect(scene.getElement().hasClass("active")).toBeTruthy();
        });

        it("may set as inactive all existing entries", function() {
            var existingScene = new Scene("existing", "test");
            existingScene.active = true;
            existingScene.create();
            existingScene.render(content);
            scene.create();
            expect(existingScene.getElement().hasClass("active")).toBeTruthy();
            scene.setActive(true);
            expect(existingScene.getElement().hasClass("active")).toBeFalsy();
        });
    });

    describe("being set as inactive", function() {
        beforeEach(function() {
            scene.active = true;
            scene.render(content);
        });

        it("removes the active class", function() {
            expect(scene.getElement().hasClass("active")).toBeTruthy();
            scene.setInactive();
            expect(scene.getElement().hasClass("active")).toBeFalsy();
        });
    });

    describe("destroying", function() {
        var existingScene;

        beforeEach(function() {
            existingScene = new Scene("luffy", "<h1>This is the content</h1>");
            existingScene.create();
            scene.create();
        });

        it("removes instance from list", function() {
            expect(Scene.entries.length).toEqual(2);
            scene.destroy();
            expect(Scene.entries).not.toContain(scene);
            expect(Scene.entries.length).toEqual(1);
        });

        it("sets first entry as active", function() {
            expect(existingScene.active).toBeFalsy();
            scene.destroy();
            expect(existingScene.active).toBeTruthy();
        });
    });

});
