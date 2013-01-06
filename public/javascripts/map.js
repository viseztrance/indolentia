function Map(wrapper) {
    this.RESIZE_DELAY = 200;
    this.ZOOM_FACTOR  = 1.05;
    this.MIN_ZOOM     = 0;
    this.MAX_ZOOM     = 30;
    this.DRAG_DELAY   = 50;

    this.wrapper      = wrapper;
    this.resizing     = false;
    this.zoomLevel    = 0;
    this.view         = {};
}

Map.prototype.create = function() {
    this.canvas = Raphael(this.wrapper.get(0), "100%", "100%");
    this.resize();
    this.bind();
    this.view = {
        width: this.getWidth(),
        height: this.getHeight(),
        offsetX: 0,
        offsetY: 0
    };
};

Map.prototype.getWidth = function() {
    return this.wrapper.width();
};

Map.prototype.getHeight = function() {
    return this.wrapper.height();
};

Map.prototype.bind = function() {
    var that = this;

    $(window).resize(function() {
        clearTimeout(that.resizing);
        that.resizing = setTimeout(function() {
            that.resize();
        }, that.RESIZE_DELAY);
    });

    this.wrapper.mousewheel($.proxy(this.scroll, this));
    this.wrapper.mousedown($.proxy(this.grab, this));
    this.wrapper.mouseup($.proxy(this.release, this));
};

Map.prototype.resize = function() {
    this.canvas.setSize(this.getWidth(), this.getHeight());
};

Map.prototype.render = function() {
    var x = ((this.getWidth() - this.view.width) / 2) + this.view.offsetX;
    var y = ((this.getHeight() - this.view.height) / 2) + this.view.offsetY;
    this.canvas.setViewBox(x, y, this.view.width , this.view.height);
};

Map.prototype.scroll = function(e, delta) {
    if(delta > 0) {
        this.zoomIn(this.ZOOM_FACTOR);
    } else {
        this.zoomOut(this.ZOOM_FACTOR);
    }
};

Map.prototype.grab = function(e) {
    if(e.which == 1) {
        this.grabEvent = e;
        this.previousOffset = {
            x: this.view.offsetX,
            y: this.view.offsetY
        };
        // this.grabStart = +new Date;
        this.wrapper.addClass("grabbing");
        this.wrapper.mousemove($.proxy(this.drag, this));
    }
    return false; // Allows cursor icon to be changed on Chrome
};

Map.prototype.release = function(e) {
    this.easeOut(e, 50);
    this.wrapper.removeClass("grabbing");
    this.wrapper.unbind("mousemove");
    delete this.previousOffset;
    delete this.grabEvent;
};

Map.prototype.drag = function(e) {
    this.view.offsetX = this.previousOffset.x + this.grabEvent.clientX - e.clientX;
    this.view.offsetY = this.previousOffset.y + this.grabEvent.clientY - e.clientY;
    this.render();
};

Map.prototype.zoomIn = function(factor) {
    if(this.zoomLevel >= this.MAX_ZOOM) {
        return false;

    }
    this.zoomLevel += 1;
    this.view.width /= factor;
    this.view.height /= factor;
    this.render();
    return true;
};

Map.prototype.zoomOut = function(factor) {
    if(this.zoomLevel <= this.MIN_ZOOM) {
        return false;
    }
    this.zoomLevel -= 1;
    this.view.width *= factor;
    this.view.height *= factor;
    this.render();
    return true;
};

Map.prototype.center = function(x, y) {
    this.view.offsetX = x - this.canvas.width / 2;
    this.view.offsetY = y - this.canvas.height / 2;
    this.render();
};

Map.prototype.easeOut = function(e, minDrag) {
    var that = this;
    var x1 = that.grabEvent.clientX,
        y1 = that.grabEvent.clientY,
        x2 = e.clientX,
        y2 = e.clientY;
    var dragLength = (function() {
        var dx = x1 - x2;
        var dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    })();
    if(dragLength > minDrag) {
        var angle = Math.atan2(y1 - y2, x1 - x2),
            velocity = 150,
            factor = 0;
        var animation = setInterval(function() {
            factor += 1;
            velocity -= factor;
            var point = { x: that.view.offsetX, y: that.view.offsetY },
                distance = Math.round(velocity / 30);
            that.view.offsetX = distance * (Math.cos(angle)) + point.x;
            that.view.offsetY = distance * (Math.sin(angle)) + point.y;
            that.render();
            if(velocity <= 0) clearInterval(animation);
        }, 10);
    }
};