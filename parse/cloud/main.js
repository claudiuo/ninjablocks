Parse.Cloud.define("hello", function(request, response) {

	var incomingdata = request.params.DA;
	var incomingValue = incomingdata.substr(0,incomingdata.indexOf("%"));

	var timest = new Date(request.params.timestamp);
	var timest1 = timest.getFullYear()+'-'+("0" + (timest.getMonth() + 1)).slice(-2)+
				'-'+("0" + timest.getDate()).slice(-2)+'T'+("0"+timest.getHours()).slice(-2)+
				':'+("0"+timest.getMinutes()).slice(-2)+':'+("0"+timest.getSeconds()).slice(-2)+'Z';

	var datap = { datapoints: []};
	datap.datapoints.push
	({
		"at" :  timest1,
		"value" : incomingValue
	});

	var requestOptions = {
		method: 'POST',
		url: 'http://api.cosm.com/v2/feeds/122267/datastreams/win_cpu_load/datapoints',
		headers:{
			'X-ApiKey': 'hhnR7WAboPVIAnFCZgrVWdcgLt2SAKxDNVlZb0ZESFN3RT0g',
			'Content-Type': 'application/json'
		},
		body: datap,
		success: function(httpResponse) {
			console.log(httpResponse.text);
			response.success("COSM Updated!");
		},
		error: function(httpResponse) {
			console.error('Request failed with response code ' + httpResponse.status);
			response.error('COSM not updated');
		}
	};

	Parse.Cloud.httpRequest(requestOptions);

// callback for dashboard:
// https://YWbwOmi1tsV7R0MxXTgpEe3fk0q4yxEakxu13Mga:javascript-key=eSZjOdSwyWuqXxpSd9y3y9y4OeT5WmVJ0K1AhPV9@api.parse.com/1/functions/hello

});
