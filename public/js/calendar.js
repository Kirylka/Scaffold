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
		showUserInputs();
		if (ev.user_id !== undefined) {
			hideUserInputs();
		} else {
			showUserInputs();
		}
		$("#client").val(ev.user_id);
	};

	$( "#start_date" ).datepicker({
		dateFormat: "yy-mm-dd"
	});
	$( "#end_date" ).datepicker({
		dateFormat: "yy-mm-dd"
	});
	scheduler.attachEvent("onClick", function (id, e){
		var ev = scheduler.getEvent(id);
		showDetails(ev.user_id)
		return true;
	});

	$( "#client" ).change(function() {

		if (html("client").value == '') {
			showUserInputs();
		} else {
			hideUserInputs();
		};
	});




});
var html = function(id) { return document.getElementById(id); }; //just a helper

var inputs = {
	'email': $('#email'),
	'client': $('#client'),
	'last_name': $('#last_name'),
	'first_name': $('#first_name'),
	'end_date': $('#end_date'),
	'start_date': $('#start_date'),
};

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
			$("#userEmail").html(email);
			$("#dates").text('');
			for (var i=0;i<response.events.length;i++)
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
	var mode;
	clearErrors();
	var user = html("client").value;
	if (user == '')  {
		mode = 'noClient'
	}
	else
	{
		mode = 'withClient';
	}
	var errors = checkValues(mode);

	// If everything is OK then submit form
	if(errors.length == 0) {
		var ev = scheduler.getEvent(scheduler.getState().lightbox_id);
		var data = {};
		data.data = {};
		data.data.from = ev.start_date = html("start_date").value;
		data.data.to = ev.end_date = html("end_date").value;
		data.data.user_id = ev.user = html("client").value;
		data.data.first_name = ev.user = html("first_name").value;
		data.data.last_name = ev.user = html("last_name").value;
		data.data.email = ev.user = html("email").value;
		data.data.id = ev.id;
		data.url = 'events';

		sendAjax(data, close_form);
		scheduler.load("events", "json");
		scheduler.updateView();
	}
	else
	{
		showErrors(errors);
	}


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

function showErrors(errors) {
	for(var i = 0; i < errors.length; i++) {
		var fieldId = errors[i].id;
		var errorText = errors[i].text;
		var el = html(fieldId);
		$(el).parent().addClass('has-error');
		var help = $(el).parent().children('.help-block');
		$(help).show().html(errorText);
	}
}

function clearErrors() {
	for(var id in inputs) {
		var field = inputs[id];
		$(field).parent().removeClass('has-error');
		$(field).parent().children('.help-block').hide();
	}
}

function checkValues(mode) {
	var errors = [];

	if (mode == 'noClient') {
		if ($('#email').val() == '') errors.push({id: 'email', text: 'Email is required'});
		if ($('#first_name').val() == '') errors.push({id: 'first_name', text: 'First name is required'});
		if ($('#last_name').val() == '') errors.push({id: 'last_name', text: 'Last name is required'});
		var re = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
		if(!re.test($('#email').val())) errors.push({id: 'email', text: 'Invalid email format'});
	}
	else if (mode == 'withClient') {
		if ($('#client').val() == '') errors.push({id: 'client', text: 'Client is required'});
	}

	if ($('#start_date').val() == '') errors.push({id: 'start_date', text: 'Start date is required'});
	if ($('#end_date').val() == '') errors.push({id: 'end_date', text: 'End date is required'});


	return errors;
}

function hideUserInputs() {
	$("#email").parent().parent().hide();
	$("#last_name").parent().parent().hide();
	$("#first_name").parent().parent().hide();
}

function showUserInputs() {
	$("#email").parent().parent().show();
	$("#last_name").parent().parent().show();
	$("#first_name").parent().parent().show();
}