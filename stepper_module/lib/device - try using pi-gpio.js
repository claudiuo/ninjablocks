
var stream = require('stream')
  , util = require('util'),
    gpio = require('pi-gpio'),
    async = require('async');

// Give our module a stream interface
util.inherits(Device,stream);

// Export it
module.exports=Device;

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
    for(var i = 0; i < steps; i++) {
      async.parallel([
        function(done) { gpio.write(self._pin1, 1, done); },
        function(done) { gpio.write(self._pin2, 0, done); },
        function(done) { gpio.write(self._pin3, 1, done); },
        function(done) { gpio.write(self._pin4, 0, done); }
      ], done);
      sleep(self._delay);
      async.parallel([
        function(done) { gpio.write(self._pin1, 0, done); },
        function(done) { gpio.write(self._pin2, 1, done); },
        function(done) { gpio.write(self._pin3, 1, done); },
        function(done) { gpio.write(self._pin4, 0, done); }
      ], done);
      sleep(self._delay);
      async.parallel([
        function(done) { gpio.write(self._pin1, 0, done); },
        function(done) { gpio.write(self._pin2, 1, done); },
        function(done) { gpio.write(self._pin3, 0, done); },
        function(done) { gpio.write(self._pin4, 1, done); }
      ], done);
      sleep(self._delay);
      async.parallel([
        function(done) { gpio.write(self._pin1, 1, done); },
        function(done) { gpio.write(self._pin2, 0, done); },
        function(done) { gpio.write(self._pin3, 0, done); },
        function(done) { gpio.write(self._pin4, 1, done); }
      ], done);
      sleep(self._delay);
    }
  });
}

StepperMotor.prototype.backward = function(steps, done) {
  var self = this;
  this._exportPins(function(err) {
    if(err) console.log(err);
    for(var i = 0; i < steps; i++) {
      async.parallel([
        function(done) { gpio.write(self._pin1, 1, done); },
        function(done) { gpio.write(self._pin2, 0, done); },
        function(done) { gpio.write(self._pin3, 0, done); },
        function(done) { gpio.write(self._pin4, 1, done); }
      ], done);
      sleep(self._delay);
      async.parallel([
        function(done) { gpio.write(self._pin1, 0, done); },
        function(done) { gpio.write(self._pin2, 1, done); },
        function(done) { gpio.write(self._pin3, 0, done); },
        function(done) { gpio.write(self._pin4, 1, done); }
      ], done);
      sleep(self._delay);
      async.parallel([
        function(done) { gpio.write(self._pin1, 0, done); },
        function(done) { gpio.write(self._pin2, 1, done); },
        function(done) { gpio.write(self._pin3, 1, done); },
        function(done) { gpio.write(self._pin4, 0, done); }
      ], done);
      sleep(self._delay);
      async.parallel([
        function(done) { gpio.write(self._pin1, 1, done); },
        function(done) { gpio.write(self._pin2, 0, done); },
        function(done) { gpio.write(self._pin3, 1, done); },
        function(done) { gpio.write(self._pin4, 0, done); }
      ], done);
      sleep(self._delay);
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


//module.exports = StepperMotor;

var stepperMotor = new StepperMotor(7,11,16,18,5);


/**
 * Creates a new Device Object
 *
 * @property {Boolean} readable Whether the device emits data
 * @property {Boolean} writable Whether the data can be actuated
 *
 * @property {Number} G - the channel of this device
 * @property {Number} V - the vendor ID of this device
 * @property {Number} D - the device ID of this device
 *
 * @property {Function} write Called when data is received from the cloud
 *
 * @fires data - Emit this when you wish to send data to the cloud
 */
function Device() {

  var self = this;

  // This device will emit data
  this.readable = false;
  // This device can be actuated
  this.writeable = true;

  this.G = "0"; // G is a string a represents the channel
  this.V = 0; // 0 is Ninja Blocks' device list
  this.D = 239; // 2000 is a generic actuator stepper motor Ninja Blocks device

  process.nextTick(function() {
    self.emit('data','Hello World');
  });
};

/**
 * Called whenever there is data from the cloud
 * This is required if Device.writable = true
 *
 * @param  {String} data The data received
 */
Device.prototype.write = function(data) {

  // I'm being actuated with data!
  console.log(data);
  stepperMotor.forward(200, function(err) {
    if(err) console.log(err);
    stepperMotor.stop();
  });
};
