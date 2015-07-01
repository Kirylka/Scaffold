$( document ).ready(function() {
	scheduler.config.hour_date = "%g:%i %A";
	scheduler.init('scheduler_here', new Date(),"month");
	scheduler.load("events","json");
	scheduler.config.details_on_dblclick = true;
	scheduler.config.details_on_create = true;

	scheduler.showLightbox = function(id) {
		var ev = scheduler.getEvent(id);
		scheduler.startLightbox(id, html("my_form"));

		var start_date = moment(ev.start_date);
		var end_date = moment(ev.end_date);

		html("start_date").value = start_date.format("YYYY-MM-DD");
		html("end_date").value = end_date.format("YYYY-MM-DD");

        html("start_time").value = start_date.format("h:mm A");
        html("end_time").value = end_date.format("h:mm A");

		if (ev.user_id !== undefined) {
			hideUserInputs();
		} else {
			$("#delete").hide();
            hideUserInputs();
		}
		$("#client").val(ev.user_id);
	};

	$( "#start_date" ).datepicker({
		dateFormat: "yy-mm-dd"
	});
	$( "#end_date" ).datepicker({
		dateFormat: "yy-mm-dd"
	});
    $( "#start_time" ).timepicker();
    $( "#end_time" ).timepicker();
	scheduler.attachEvent("onClick", function (id, e){
		var ev = scheduler.getEvent(id);
		showDetails(ev.user_id)
		return false;
	});



	$( "#client" ).change(function() {

		if ($("#client").find(":selected")[0].id == "new_client") {
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
    'start_time': $('#start_time'),
    'end_time': $('#end_time')
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
				$("#dates").append(response.events[i].from.split(' ')[0] + "<br>");
			}


			return true;
		})
		.fail(function(response) {

			failCallback.call(this);

			return true;
		});
}
function save_form() {
	var mode,
        from,
        from_obj,
        from_string,
        to,
        to_obj,
        to_string;

    clearErrors();

	var user = $("#client").find(":selected")[0].id;
	if (user == "new_client")
	{
		mode = 'withClient';
	}
    else
    {
        mode = 'noClient'
    }

    //time formatting
    from_string = $("#start_date").val() +  " " + $("#start_time").val();
    to_string = $("#end_date").val() +  " " + $("#end_time").val();
    from_obj = moment(from_string, ["YYYY-M-D h:mm A"]);
    to_obj = moment(to_string, ["YYYY-M-D h:mm A"]);
    from = from_obj.format("YYYY-MM-DD H:mm");
    to = to_obj.format("YYYY-MM-DD H:mm");

	var errors = checkValues(mode, from_obj, to_obj);

	// If everything is OK then submit form
	if(errors.length == 0) {

		var ev = scheduler.getEvent(scheduler.getState().lightbox_id);
		var data = {};
		data.data = {};

		data.data.from = from;
		data.data.to = to;
		data.data.user_id  = html("client").value;
		data.data.first_name  = html("first_name").value;
		data.data.last_name  = html("last_name").value;
		data.data.email  = html("email").value;
		data.data.id = ev.id;
		data.url = 'events';

		sendAjax(data, close_form);


	}
	else
	{
		showErrors(errors);
	}


}

function clearValues() {


	$.each(inputs, function(index, value) {
		value.val("");;
	})
}

function close_form(response) {
	$("#delete").show();
	if (response) {
		addToUsers(response.id, response.username);
	}
	scheduler.endLightbox(false, html("my_form"));
	scheduler.load("events", "json");
	scheduler.updateView();
	clearValues();
    clearErrors();

}

function addToUsers(id, username) {
	$('#client').append($('<option>', {
		value: id,
		text: username
	}));
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


function sendAjax(data, successCallback)
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
		var help = $("#show_error");
		$(help).show().html(errorText);
	}
}

function clearErrors() {
	for(var id in inputs) {
		var field = inputs[id];
		$(field).parent().removeClass('has-error');
		$(field).parent().children('.help-block').hide();


	}
    var help = $("#show_error");
    $(help).hide().html("");
}

function checkValues(mode, from_obj ,to_obj) {
	var errors = [];

	if (mode == 'withClient') {
		if ($('#email').val().trim() == '') errors.push({id: 'email', text: 'Email is required'});
		if ($('#first_name').val().trim() == '') errors.push({id: 'first_name', text: 'First name is required'});
		if ($('#last_name').val().trim() == '') errors.push({id: 'last_name', text: 'Last name is required'});
		var re = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
		if(!re.test($('#email').val().trim())) errors.push({id: 'email', text: 'Invalid email format'});

	}
	else if (mode == 'noClient') {
		if ($('#client').val().trim() == '') errors.push({id: 'client', text: 'Client is required'});
	}

	if ($('#start_date').val().trim() == '') errors.push({id: 'start_date', text: 'Start date is required'});
	if ($('#end_date').val().trim() == '') errors.push({id: 'end_date', text: 'End date is required'});
    if ($('#start_time').val().trim() == '') errors.push({id: 'start_time', text: 'End date is required'});
    if ($('#end_time').val().trim() == '') errors.push({id: 'end_time', text: 'End date is required'});

    if (to_obj.unix() < from_obj.unix()) {
        errors.push({id: 'end_date', text: ''});
        errors.push({id: 'start_date', text: ''});
        errors.push({id: 'start_time', text: ''});
        errors.push({id: 'end_time', text: ''});
    }

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