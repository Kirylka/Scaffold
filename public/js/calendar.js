

$( document ).ready(function() {
	scheduler.init('scheduler_here', new Date(),"month");
	scheduler.load("events","json");
	scheduler.config.details_on_dblclick = true;
	scheduler.config.details_on_create = true;

	scheduler.showLightbox = function(id) {
		var ev = scheduler.getEvent(id);
		scheduler.startLightbox(id, html("my_form"));

		var start_date = toDateFormat(ev.start_date);
		var end_date = toDateFormat(ev.end_date);

		html("start_date").value = start_date;
		html("end_date").value = end_date;
		html("end_date").value = end_date;
		$("#client").val(ev.user_id);
	};

	scheduler.attachEvent("onClick", function (id, e){
		var ev = scheduler.getEvent(id);
		showDetails(ev.user_id)
		return true;
	});


});
var html = function(id) { return document.getElementById(id); }; //just a helper


function showDetails(user_id) {
	queryData = {};
	queryData.url = 'user';
	queryData.type = 'GET';
	queryData.data = {};
	queryData.data.user_id = user_id;

	queryData.async = true;

	var xhr = $.ajax(queryData)
		.done(function(response) {


			$( "#clientDetails" ).show();
			var name = response.user.name;
			var email = response.user.email;

			$("#userName").html(name);
			$("#email").html(email);
			$("#dates").text('');
			for(var i=0;i<response.events.length;i++)
			{
				$("#dates").append(response.events[i].from + "<br>");
			}


			return true;
		})
		.fail(function(response) {

			failCallback.call(this);

			return true;
		});
}
function save_form() {
	var ev = scheduler.getEvent(scheduler.getState().lightbox_id);
	var data = {};
	data.data = {};
	data.data.from = ev.start_date = html("start_date").value;
	data.data.to = ev.end_date = html("end_date").value;
	data.data.user_id = ev.user = html("client").value;
	data.data.id = ev.id;
	data.url = 'events';

	sendAjax(data,close_form);
	scheduler.load("events","json");
	scheduler.updateView();


}
function close_form() {
	scheduler.endLightbox(false, html("my_form"));
}

function delete_event() {
	var event_id = scheduler.getState().lightbox_id;
	scheduler.endLightbox(false, html("my_form"));
	scheduler.deleteEvent(event_id);

	var data = {};
	data.data = {};
	data.data.id = event_id;
	data.url = 'events';
	data.queryType = 'DELETE';

	sendAjax(data);
}

function sendAjax(data, successCallback, failCallback)
{
	var queryData = {};
	queryData.url = data.url;
	queryData.type = data.queryType || 'POST';
	queryData.data = data.data || {};

	queryData.async = data.async || true;

	var xhr = $.ajax(queryData)
		.done(function(response) {

			successCallback.call(this, response);


			return true;
		})
		.fail(function(response) {

			failCallback.call(this);

			return true;
		});

	return xhr;
}

function toDateFormat(date) {
	var dd = date.getDate();
	var mm = date.getMonth()+1; //January is 0!

	var yyyy = date.getFullYear();
	if(dd<10){dd='0'+dd}
	if(mm<10){mm='0'+mm}
	return yyyy+'-'+mm+'-'+dd;
}