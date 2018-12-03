$(document).ready(function() {
    $('#call-customer').click(function(event) {
        event.preventDefault();
        event.stopPropagation();

        var params = {"phoneNumber": '+919958956286'};
        Twilio.Device.connect(params);
    });

    $.get("/get-token/", {}, function(data) {
        // Set up the Twilio Client Device with the token
        Twilio.Device.setup(data.token);
    });
});

/* Callback to let us know Twilio Client is ready */
Twilio.Device.ready(function (device) {
    $('#call-customer').attr('disabled', false);
});

/* Callback for when Twilio Client initiates a new connection */
Twilio.Device.connect(function (connection) {
    // Enable the hang up button and disable the call buttons
    // hangUpButton.prop("disabled", false);
    $('#call-customer').attr('disabled', true);

    // If phoneNumber is part of the connection, this is a call from a
    // support agent to a customer's phone
    if ("phoneNumber" in connection.message) {
        console.log("In call with " + connection.message.phoneNumber);
    }
});

Twilio.Device.disconnect(function(connection) {
    $('#call-customer').attr('disabled', false);

    // If phoneNumber is part of the connection, this is a call from a
    // support agent to a customer's phone
    if ("phoneNumber" in connection.message) {
        console.log("Ended call with " + connection.message.phoneNumber);
    }
});
