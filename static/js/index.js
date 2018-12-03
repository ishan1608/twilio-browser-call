$(document).ready(function() {
    $('#call-customer').click(function(event) {
        event.preventDefault();
        event.stopPropagation();
    });

    $.get("/get-token/", {}, function(data) {
        // Set up the Twilio Client Device with the token
        Twilio.Device.setup(data.token);
    });
});

/* Callback to let us know Twilio Client is ready */
Twilio.Device.ready(function (device) {
    $('#call-customer').removeClass('hide');
});