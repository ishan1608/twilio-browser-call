var call;

$(document).ready(function() {
    $('#call').click(function(event) {
        event.preventDefault();
        event.stopPropagation();

        var params = {"phoneNumber": '+919958956286'};
        call = Twilio.Device.connect(params);
    });

    $('#hangup').click(function(event) {
        event.preventDefault();
        event.stopPropagation();

        if (call) {
            call.disconnect();
            call = null;
        }
    });

    $.get("/get-token/", {}, function(data) {
        // Set up the Twilio Client Device with the token
        Twilio.Device.setup(data.token);
    });
});

/* Callback to let us know Twilio Client is ready */
Twilio.Device.ready(function (device) {
    $('#call').attr('disabled', false);
});

/* Callback for when Twilio Client initiates a new connection */
Twilio.Device.connect(function (connection) {
    // Enable the hang up button and disable the call buttons
    // hangUpButton.prop("disabled", false);
    $('#call').attr('disabled', true);
    $('#hangup').attr('disabled', false);

    // If phoneNumber is part of the connection, this is a call from a
    // support agent to a customer's phone
    if ("phoneNumber" in connection.message) {
        console.log("In call with " + connection.message.phoneNumber);
    }
});

Twilio.Device.disconnect(function(connection) {
    $('#call').attr('disabled', false);
    $('#hangup').attr('disabled', true);

    // If phoneNumber is part of the connection, this is a call from a
    // support agent to a customer's phone
    if ("phoneNumber" in connection.message) {
        console.log("Ended call with " + connection.message.phoneNumber);
    }
});
