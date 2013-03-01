var gpio = require("pi-gpio"),
        async = require("async");

function sleep(milliseconds) {
	var start = new Date().getTime();
	while ((new Date().getTime() - start) < milliseconds){
		// Do nothing
	}
}

var StepperMotor = function(pin1, pin2, pin3, pin4, delay) {
        this._pin1 = parseInt(pin1, 10);
        this._pin2 = parseInt(pin2, 10);
        this._pin3 = parseInt(pin3, 10);
        this._pin4 = parseInt(pin4, 10);
        this._delay = parseInt(delay, 10);

        if(isNaN(this._pin1) || isNaN(this._pin2) ||
        			isNaN(this._pin3) || isNaN(this._pin4) ||
        			isNaN(this._delay)) {
                throw new Error("The pin numbers or delay provided are not valid");
        }
};

StepperMotor.prototype._exportPins = function(done) {
        var self = this;
        async.parallel([
                function(done) { gpio.open(self._pin1, done); },
                function(done) { gpio.open(self._pin2, done); },
                function(done) { gpio.open(self._pin3, done); },
                function(done) { gpio.open(self._pin4, done); }
        ], done);
}

StepperMotor.prototype._unexportPins = function(done) {
        var self = this;
        async.parallel([
                function(done) { gpio.close(self._pin1, done); },
                function(done) { gpio.close(self._pin2, done); },
                function(done) { gpio.close(self._pin3, done); },
                function(done) { gpio.close(self._pin4, done); }
        ], done);
}

StepperMotor.prototype.forward = function(steps, done) {
        var self = this;
        this._exportPins(function(err) {
                if(err) console.log(err);
                for(int i = 0; i++, i < steps) {
                	async.parallel([
                	        function(done) { gpio.write(self._pin1, 1, done); },
                	        function(done) { gpio.write(self._pin2, 0, done); },
                	        function(done) { gpio.write(self._pin3, 1, done); },
                	        function(done) { gpio.write(self._pin4, 0, done); }
                	], done);
                	sleep(delay);
                	async.parallel([
                	        function(done) { gpio.write(self._pin1, 0, done); },
                	        function(done) { gpio.write(self._pin2, 1, done); },
                	        function(done) { gpio.write(self._pin3, 1, done); },
                	        function(done) { gpio.write(self._pin4, 0, done); }
                	], done);
                	sleep(delay);
                	async.parallel([
                	        function(done) { gpio.write(self._pin1, 0, done); },
                	        function(done) { gpio.write(self._pin2, 1, done); },
                	        function(done) { gpio.write(self._pin3, 0, done); },
                	        function(done) { gpio.write(self._pin4, 1, done); }
                	], done);
                	sleep(delay);
                	async.parallel([
                	        function(done) { gpio.write(self._pin1, 1, done); },
                	        function(done) { gpio.write(self._pin2, 0, done); },
                	        function(done) { gpio.write(self._pin3, 0, done); },
                	        function(done) { gpio.write(self._pin4, 1, done); }
                	], done);
                	sleep(delay);
				}
        });
}

StepperMotor.prototype.backward = function(steps, done) {
        var self = this;
        this._exportPins(function(err) {
                if(err) console.log(err);
                for(int i = 0; i++, i < steps) {
                	async.parallel([
                	        function(done) { gpio.write(self._pin1, 1, done); },
                	        function(done) { gpio.write(self._pin2, 0, done); },
                	        function(done) { gpio.write(self._pin3, 0, done); },
                	        function(done) { gpio.write(self._pin4, 1, done); }
                	], done);
                	sleep(delay);
                	async.parallel([
                	        function(done) { gpio.write(self._pin1, 0, done); },
                	        function(done) { gpio.write(self._pin2, 1, done); },
                	        function(done) { gpio.write(self._pin3, 0, done); },
                	        function(done) { gpio.write(self._pin4, 1, done); }
                	], done);
                	sleep(delay);
                	async.parallel([
                	        function(done) { gpio.write(self._pin1, 0, done); },
                	        function(done) { gpio.write(self._pin2, 1, done); },
                	        function(done) { gpio.write(self._pin3, 1, done); },
                	        function(done) { gpio.write(self._pin4, 0, done); }
                	], done);
                	sleep(delay);
                	async.parallel([
                	        function(done) { gpio.write(self._pin1, 1, done); },
                	        function(done) { gpio.write(self._pin2, 0, done); },
                	        function(done) { gpio.write(self._pin3, 1, done); },
                	        function(done) { gpio.write(self._pin4, 0, done); }
                	], done);
                	sleep(delay);
				}
        });
}

StepperMotor.prototype.stop = function(done) {
        var self = this;
        this._unexportPins(done);
};

//["forward", "left", "start"].forEach(function(key) { Motor.prototype[key] = Motor.prototype.clockwise; });
//["backward", "counterclockwise", "reverse", "back", "right"].forEach(function(key) { Motor.prototype[key] = Motor.prototype.anticlockwise; });
//["straight", "reset"].forEach(function(key) { Motor.prototype[key] = Motor.prototype.stop; });


module.exports = StepperMotor;
