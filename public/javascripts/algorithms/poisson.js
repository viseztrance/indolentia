// Fast Poisson Disk sampling
// Original paper: http://www.cs.ubc.ca/~rbridson/docs/bridson-siggraph07-poissondisk.pdf
// This implementation is based on the code of Herman Tulleken (herman@luma.co.za).

var Poisson = {

    Distribution: function(attributes) {
        for(name in attributes) {
            this[name] = attributes[name];
        }
        this.cellSize = Math.sqrt(2) / this.minDist;

        this.generate = function() {
            var points      = [];
            this.startPoint = [Math.floor(Math.random() * this.width) + 1,
                              Math.floor(Math.random() * this.height) + 1];
            var queue       = new Poisson.RandomQueue();
            this.grid       = new Poisson.Grid([Math.ceil(this.width * this.cellSize),
                                                Math.ceil(this.height * this.cellSize)]);
            queue.push(this.startPoint);
            points.push(this.startPoint);
            this.grid.set(this.toGrid(this.startPoint), this.startPoint);

            // Generate other points from points in queue.
            while(queue.length()) {
                var point = queue.pop();

                for (var i = 0; i < this.tries; i++) {
                    var newPoint = this.getRandomPointAround(point);
                    // Check that the point is in the image region
                    // and no points exists in the point's neighbourhood
                    if(this.inRectangle(newPoint) && !this.inNeighbourhood(newPoint)) {
                        // Update containers
                        points.push(newPoint);
                        queue.push(newPoint);
                        this.grid.set(this.toGrid(newPoint), newPoint);
                        if(points.length > this.max) {
                            return points;
                        }
                    }
                }
            }
            return points;
        };

        this.toGrid = function(point) {
            var x = parseInt(point[0] * this.cellSize, 10);
            var y = parseInt(point[1] * this.cellSize, 10);
            return [x, y];
        };

        this.getRandomPointAround = function(point) {
            var x = point[0],
                y = point[1],
                rr = this.uniform(this.minDist, 2 * this.minDist),
                rt = this.uniform(0, 2 * Math.PI);
            return [rr * Math.sin(rt) + x, rr * Math.cos(rt) + y];
        };

        this.uniform = function(a, b) {
            return a + (b - a) * Math.random();
        };

        this.inRectangle = function(point) {
            var x = point[0],
                y = point[1];
            return ((0 <= x) && (x < this.width) && (0 <= y) && (y < this.height));
        };

        this.inNeighbourhood = function(point) {
            var coordinates = this.toGrid(point);

            var x = coordinates[0],
                y = coordinates[1];

            if(this.grid.get(coordinates)) return true;
            for(var i in this.range(x)) {
                for(var j in this.range(y)) {
                    var currentPoint = this.grid.get([i, j]);
                    if(currentPoint && this.distance(currentPoint, point) <= this.minDist) {
                        return true;
                    }
                }
            }
            return false;
        };

        this.distance = function(p1, p2) {
            var dx = p1[0] - p2[0];
            var dy = p1[1] - p2[1];
            return Math.sqrt(dx * dx + dy * dy);
        };

        this.range = function(value) {
            var collection = [];
            for(var i = value - this.minDist; i <= value + this.minDist; i++) {
                collection.push(i);
            }
            return collection;
        };

    },

    RandomQueue: function() {
        this.items = [];

        this.length = function() {
            return this.items.length;
        };

        // Push a new element into the queue
        this.push = function(point) {
            this.items.push(point);
        };

        // Pops a random element from the queue
        this.pop = function() {
            var i = this.items.length - 1;

            if(i >= 1) {
                var j = Math.floor(Math.random() * i);
                this.items[i] = this.items[j];
                this.items[j] = this.items[i];
            }
            return this.items.pop();
        };
    },

    // Constructs a new grid with the given width and height, and fills it
    // with the given initial item.
    Grid: function(point, initial) {
        this.width   = point[0];
        this.height  = point[1];
        this.initial = null;
        this.items   = []; // new Array(this.width);
        for(var i = 0; i < this.width; i++) {
            var values = [];
            for(var j = 0; j < this.height; j++) {
                values.push(initial);
            }
            this.items[i] = values;
        }

        // Returns the element at x, y = point. If x or y fall outside the legal range,
        // the initial element is always returned.
        this.get = function(point) {
            var x = point[0],
                y = point[1];
            if (x < 0 || x >= this.width || y < 0 || y >= this.width) {
                return this.initial;
            } else {
                return this.items[x][y];
            }
        };

        // Sets the point at the specified location
        this.set = function(point, value) {
            var x = point[0],
                y = point[1];
            return this.items[x][y] = value;
        };
    }

};
