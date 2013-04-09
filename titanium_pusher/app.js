// Initialization

var Pusher = require('com.pusher');
Pusher.setup({
  key: 'ccff70362850caf79c9f'
});

var window = Ti.UI.createWindow({
	backgroundColor:'white',
  title: 'Pusher'
});
window.open();

// Handlers
var handleConnected = function() {
  Pusher.addEventListener('connected', function(e) {
    Ti.API.warn("PUSHER CONNECTED");

    // Connect to channel
    window.channel = Pusher.subscribeChannel('Get_your_pusher_channel_key_from_https://a.ninja.is/hacking');

    // Bind to all events on this channel
    window.channel.addEventListener('event', handleEvent);

    // Bind to a specific event on this channel
    window.channel.addEventListener('alert', handleAlertEvent);
  });
  Pusher.connect();
};

var handleDisconnected = function() {
  if(window.channel) {
    window.channel.removeEventListener('event', handleEvent);
    window.channel.removeEventListener('alert', handleAlertEvent);
  }

  Pusher.disconnect();
}

var handleEvent = function(e) {
  Ti.API.warn("ATAO event fired");

  var label = Ti.UI.createLabel({
    text: "channel:" + e.channel + " event: " + e.name,
    top: 3,
    left: 10,
    height: '12',
    font: {fontSize: 10}
  });

  var sublabel = Ti.UI.createLabel({
    text: JSON.stringify(e.data),
    top: 15,
    left: 10,
    height: '15',
    font: {fontSize:8}
  });

  var incomingdata = e.data.DA;
  var incomingValue = incomingdata.substr(0,incomingdata.indexOf("%"));

  var daDataLabel = Ti.UI.createLabel({
    text: JSON.stringify(incomingValue),
    top: 30,
    left: 10,
    height: '15',
    font: {fontSize:8}
  });

  var tableViewRow = Ti.UI.createTableViewRow({});
  tableViewRow.add(label);
  tableViewRow.add(sublabel);
  tableViewRow.add(daDataLabel);

  Ti.API.warn("ATAO append table row");

  tableview.appendRow(tableViewRow, {animated:true});
};

var handleAlertEvent = function(e) {
  alert(JSON.stringify(e.data));
}

var menu;
var CONNECT = 1, DISCONNECT = 2;
Ti.Android.currentActivity.onCreateOptionsMenu = function(e) {
  menu = e.menu;
  var connect = menu.add({title:'Connect', itemId:CONNECT});
  connect.addEventListener('click', handleConnected);

  var disconnect = menu.add({title:'Disconnect', itemId:DISCONNECT});
  disconnect.addEventListener('click', handleDisconnected);
}

var tableview = Ti.UI.createTableView({
  data: [],
  headerTitle: 'Events from the channel'
});
window.add(tableview);
