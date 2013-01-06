(function($) {
    $.fn.slide = function(options) {
        options = options || {};

        function Slider(input) {
            this.input = input;
        }

        Slider.prototype.render = function() {
            this.input.hide();
            this.ui = {
                wrapper:   $('<nav class="slider">'),
                increment: $('<span class="increment">'),
                decrement: $('<span class="decrement">'),
                bar:       $('<span class="bar">'),
                fill:      $('<span class="fill">')
            };
            this.ui.bar.append(this.ui.fill);
            this.ui.wrapper.append(this.ui.decrement);
            this.ui.wrapper.append(this.ui.bar);
            this.ui.wrapper.append(this.ui.increment);
            this.setValue(this.getValue(), { animate: true });
            this.input.before(this.ui.wrapper);
        };

        Slider.prototype.bind = function() {
            var that = this;
            var timer = false;
            var clear = function() {
                clearTimeout(timer);
                return false;
            };

            this.ui.increment.mousedown(function(){
                timer = setInterval(function() {
                    that.increment();
                }, 20);
                return false;
            }).mouseup(clear);

            this.ui.decrement.mousedown(function() {
                timer = setInterval(function() {
                    that.decrement();
                }, 20);
                return false;
            }).mouseup(clear);

            this.ui.bar.mousewheel(function(e, delta) {
                if(delta > 0) {
                    that.increment();
                } else {
                    that.decrement();
                }
                return false;
            });

            this.ui.bar.mousedown(function(e) {
                var percentage = function(e) {
                    var position = e.pageX - that.ui.bar.offset().left,
                        width = that.ui.bar.width();
                    return parseInt(position / width * 100, 10);
                };
                var animation = that.setValue(percentage(e), { animate: true, callback: true });
                $(this).mousemove(function(e) {
                    animation.stop();
                    that.setValue(percentage(e), { callback: true });
                });
            }).mouseup(function() {
                $(this).unbind("mousemove");
            });
        };

        Slider.prototype.setValue = function(value, options) {
            options = options || {};
            this.input.val(value);
            if(options.callback) this.input.trigger("change");
            var width = value + "%";
            if(options.animate) {
                return this.ui.fill.animate({ width: width });
            } else {
                return this.ui.fill.width(width);
            }
        };

        Slider.prototype.getValue = function() {
            return parseInt(this.input.val(), 10) || 0;
        };

        Slider.prototype.increment = function() {
            var value = Math.min(this.getValue() + 1, 100);
            this.setValue(value, { callback: true });
            return false;
        };

        Slider.prototype.decrement = function() {
            var value = Math.max(this.getValue() - 1, 0);
            this.setValue(value, { callback: true });
            return false;
        };

        var sliders = [];

        this.each(function(i, input) {
            var slider = new Slider($(input));
            slider.render();
            slider.bind();
            sliders.push(slider);
        });

        if(options.equalize) {
            this.change(function() {
                var that = this,
                    sum = 0;
                $.each(sliders, function(i, slider) {
                    sum += sliders[i].getValue();
                });
                var offset = sum - 100;
                if(offset) {
                    $.each(sliders, function(i, slider) {
                        if(slider.input.get(0) != that) {
                            var initial = slider.getValue(),
                                value = 0;
                            if(offset > 0) {
                                value = slider.getValue() - offset;
                                slider.setValue(Math.max(0, value));
                                if(value < 0) {
                                    offset -= initial;
                                } else {
                                    return false;
                                }
                            } else {
                                value = slider.getValue() + Math.abs(offset);
                                slider.setValue(Math.min(100, value));
                                if(value > 100) {
                                    offset += (value - 100);
                                } else {
                                    return false;
                                }
                            }
                        }
                        return true;
                    });
                }
            });
        }
    };
})(jQuery);
