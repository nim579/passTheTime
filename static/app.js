var Bouble, TimeWatch;

TimeWatch = (function() {
  function TimeWatch($el) {
    this.$el = $el;
    this.settings = {
      resumeTimeout: 100,
      resumeStep: 1000
    };
    this.startWatch();
  }

  TimeWatch.prototype.startWatch = function() {
    this._to = setInterval((function(_this) {
      return function() {
        return _this.setTime();
      };
    })(this), 500);
    return this.setTime();
  };

  TimeWatch.prototype.setTime = function() {
    return this.renderTime(this.getTime());
  };

  TimeWatch.prototype.getTime = function() {
    var date, time;
    date = new Date();
    time = date.getTime() - (date.getTimezoneOffset() * 60000);
    return time;
  };

  TimeWatch.prototype.renderTime = function(time) {
    var hours, minutes, seconds;
    time = Math.round((time / 1000) % 86400);
    hours = Math.floor(time / 3600);
    minutes = Math.floor((time - hours * 3600) / 60);
    seconds = Math.floor(time - hours * 3600 - minutes * 60);
    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    return this.$el.text(hours + ":" + minutes + ":" + seconds);
  };

  TimeWatch.prototype.pauseTime = function() {
    this._stopTime = this.getTime();
    return clearInterval(this._to);
  };

  TimeWatch.prototype.resumeTime = function() {
    var resume;
    if (this._stopTime) {
      resume = (function(_this) {
        return function() {
          return setTimeout(function() {
            _this._stopTime += _this.settings.resumeStep;
            _this.renderTime(_this._stopTime);
            if (!(_this._stopTime >= _this.getTime())) {
              return resume();
            } else {
              delete _this._stopTime;
              return _this.startWatch();
            }
          }, _this.settings.resumeTimeout);
        };
      })(this);
      return resume();
    }
  };

  return TimeWatch;

})();

Bouble = (function() {
  function Bouble($el, timeWatch1) {
    this.timeWatch = timeWatch1;
    this.settings = {
      returnTime: 700
    };
    this.$el = $el;
    this.r = Raphael($el[0]);
    this.renderBouble();
    this.addDragger();
  }

  Bouble.prototype.renderBouble = function() {
    return this.path = this.r.path().attr({
      fill: "90-#4d57d0-#131ea8",
      "stroke-width": 0,
      path: this.getBoublePath()
    });
  };

  Bouble.prototype.updateBouble = function(path) {
    return this.path.attr({
      path: path
    });
  };

  Bouble.prototype.returnBouble = function() {
    return this.path.animate({
      path: this.getBoublePath(0, 0)
    }, this.settings.returnTime, 'backOut');
  };

  Bouble.prototype.getBoublePath = function(dx, dy) {
    var fix, fx, fy;
    if (dx == null) {
      dx = 0;
    }
    if (dy == null) {
      dy = 0;
    }
    fix = 0 + Math.abs(dy) / this.getScaleX();
    fix = 0;
    fx = 150 + dx / this.getScaleX();
    fy = 120 + dy / this.getScaleY();
    fx = fx > 260 ? 260 : fx;
    fx = fx < 40 ? 40 : fx;
    fy = fy > 300 ? 300 : fy;
    fy = fy < 120 ? 120 : fy;
    return "M0,0R" + fx + "," + fy + ",300,0";
  };

  Bouble.prototype.getScaleX = function() {
    return $('#bouble').width() / 300;
  };

  Bouble.prototype.getScaleY = function() {
    return $('#bouble').width() / 300;
  };

  Bouble.prototype.addDragger = function() {
    this.dragCricle = this.r.ellipse(150, 110, 40, 15);
    this.dragCricle.attr({
      'stroke-width': 0,
      fill: 'rgba(0,0,0,0)'
    });
    return this.dragCricle.drag(_.bind(this.drag, this), _.bind(this.dragStart, this), _.bind(this.dragEnd, this));
  };

  Bouble.prototype.drag = function(dx, dy, x, y) {
    this._dragParams = {
      dx: dx,
      dy: dy
    };
    return this.updateBouble(this.getBoublePath(dx, dy));
  };

  Bouble.prototype.dragStart = function() {
    return this.timeWatch.pauseTime();
  };

  Bouble.prototype.dragEnd = function() {
    if (this._dragParams) {
      this.returnBouble();
      this.timeWatch.resumeTime();
      return delete this._dragParams;
    }
  };

  return Bouble;

})();

$(function() {
  window.timeWatch = new TimeWatch($('.time'));
  return window.bouble = new Bouble($('#bouble'), timeWatch);
});
