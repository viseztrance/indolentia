// Convex Hull using the Graham Scan algorithm
// Implementation based on the work of Mark Nelson
// http://marknelson.us/2007/08/22/convex/

function ConvexHull(points) {
    this.points = points;
}

ConvexHull.prototype.getValues = function() {
    this.points = this.points.sort(function(a, b) {
        return a[1] > b[1];
    });

    // Designate most left and right points
    this.left = this.points.shift();
    this.right = this.points.pop();

    var upperPoints = [],
        lowerPoints = [];

    // Split points into upper and lower regions
    for(var i in this.points) {
        var point = this.points[i];
        var currentDirection = this.direction(this.left, this.right, point);
        if(currentDirection < 0) {
            upperPoints.push(point);
        } else {
            lowerPoints.push(point);
        }
    }

    // Build hull
    var lowerHull = this.buildHalf(lowerPoints, 1);
    var upperHull = this.buildHalf(upperPoints, -1);

    // Merge points
    var result =  lowerHull.concat(upperHull);

    // Remove duplicates
    return result.filter(function(element, position) {
        return result.indexOf(element) == position;
    });

};

ConvexHull.prototype.buildHalf = function(collectedPoints, factor) {
    collectedPoints.push(this.right);
    var object = [this.left];

    while(collectedPoints.length) {
        object.push(collectedPoints.shift());

        while(object.length >= 3) {
            var currentDirection = this.direction(object.length - object[-3],
                                                  object.length - object[-1],
                                                  object.length - object[-2]);
            if(factor * currentDirection <= 0) {
                object.splice(object[-2], 1);
            } else {
                break;
            }
        }
    }

    return object;
};

// Determine if points are convex
ConvexHull.prototype.direction = function(a, b ,c) {
    return ((a[0] - b[0]) * (c[1] - b[1])) -
           ((c[0] - b[0] ) * (a[1] - b[1]));
};
