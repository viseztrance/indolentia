describe("Research", function() {

    describe("technologies", function() {
        var technology1, technology2, technology3, technology4, technology5, technologies;

        beforeEach(function() {
            technology1 = new Technology("cat1", { level: 1, default: true }),
            technology2 = new Technology("cat1", { level: 1 }),
            technology3 = new Technology("cat1", { level: 2, default: true }),
            technology4 = new Technology("cat2", { level: 1 }),
            technology5 = new Technology("cat2", { level: 2 });
            technologies = { cat1: [technology1, technology2, technology3], cat2: [technology4, technology5] };
        });

        it("makes defaults available", function() {
            var research = new Research(technologies);
            expect(research.technologies.cat1.available).toEqual([technology1, technology3]);
            expect(research.technologies.cat2.available).toEqual([]);
        });

        it("researches first non default tech and makes the rest researchable", function() {
            var research = new Research(technologies);
            expect(research.technologies.cat1.researching.item).toEqual(technology2);
            expect(research.technologies.cat1.researchable).toEqual([]);

            expect(research.technologies.cat2.researching.item).toEqual(technology4);
            expect(research.technologies.cat2.researchable).toEqual([technology5]);
        });

        describe("researching", function() {
            it("sets current technology to the researching queue", function() {
                var research = new Research(technologies);
                research.study(technology2);
                expect(research.technologies.cat1.researching.item).toEqual(technology2);
            });

            it("removes researched technologies from the researchable stack", function() {
                var research = new Research(technologies);
                research.study(technology4);
                expect(research.technologies.cat2.researchable).toEqual([technology5]);
            });

            it("doesn't take any action if something is already being researched", function() {
                var research = new Research(technologies);
                research.study(technology4);
                research.study(technology5);
                expect(research.technologies.cat2.researchable).toEqual([technology5]);
            });

            describe("being performed", function() {
                var technology, research;

                beforeEach(function() {
                    technology = new Technology("weapons", { level: 1 });
                    research = new Research({ weapons: [technology] });
                    research.budget.weapons = 0.2;
                    research.study(technology);
                });

                it("increases research funds", function() {
                    spyOn(technology, "cost").andReturn(80);
                    research.perform(100);
                    expect(research.technologies.weapons.researching.credits).toEqual(20);
                    research.perform(100);
                    expect(research.technologies.weapons.researching.credits).toEqual(40);
                });

                describe("on finish", function() {
                    beforeEach(function() {
                        spyOn(technology, "cost").andReturn(15);
                    });

                    it("substracts raised credits from the technology cost", function() {
                        research.perform(100);
                        expect(research.technologies.weapons.researching.credits).toEqual(5);
                    });

                    it("moves current item from the researching pool to the researched", function() {
                        expect(research.technologies.weapons.available).toEqual([]);
                        research.perform(100);
                        expect(research.technologies.weapons.researching.item).toBeFalsy();
                        expect(research.technologies.weapons.available).toEqual([technology]);
                    });
                });
            });
        });
    });

    describe("budget allocation", function() {
        var research, credits;
        beforeEach(function() {
            research = new Research({});
        });

        it("has a percentage assigned for computers", function() {
            research.budget.computers = 0.3;
            expect(research.creditsFor("computers", 180)).toEqual(54);
            research.budget.computers = 0.5;
            expect(research.creditsFor("computers", 180)).toEqual(90);
        });

        it("has a percentage assigned for construction", function() {
            research.budget.construction = 0.3;
            expect(research.creditsFor("construction", 180)).toEqual(54);
            research.budget.construction = 0.5;
            expect(research.creditsFor("construction", 180)).toEqual(90);
        });

        it("has a percentage assigned for shields", function() {
            research.budget.shields = 0.3;
            expect(research.creditsFor("shields", 180)).toEqual(54);
            research.budget.shields = 0.5;
            expect(research.creditsFor("shields", 180)).toEqual(90);
        });

        it("has a percentage assigned for planetology", function() {
            research.budget.planetology = 0.3;
            expect(research.creditsFor("planetology", 180)).toEqual(54);
            research.budget.planetology = 0.5;
            expect(research.creditsFor("planetology", 180)).toEqual(90);
        });

        it("has a percentage assigned for propulsion", function() {
            research.budget.propulsion = 0.3;
            expect(research.creditsFor("propulsion", 180)).toEqual(54);
            research.budget.propulsion = 0.5;
            expect(research.creditsFor("propulsion", 180)).toEqual(90);
        });

        it("has a percentage assigned for weapons", function() {
            research.budget.weapons = 0.3;
            expect(research.creditsFor("weapons", 180)).toEqual(54);
            research.budget.weapons = 0.5;
            expect(research.creditsFor("weapons", 180)).toEqual(90);
        });
    });

});
