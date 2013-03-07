
var stream = require('stream')
  , util = require('util')
  , exec = require('child_process').exec,
    child;

// Give our module a stream interface
util.inherits(Device,stream);

// Export it
module.exports=Device;

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

  var self = this;

  // I'm being actuated with data!
  console.log(data);
  child = exec('sudo python stepper.py 5 200',
    function(error, stdout, stderr) {
      stdout.replace(/(\n|\r|\r\n)$/, '');
      console.log("python result " + stdout);
      self.emit('data', stdout);
  });
};
