/**
 * Author: Ken
 * Date: 10/06/2013
 * Time: 13:29
 */
/*global phantom, ab*/
var sess,
    when = require('./when.js'),
    host = 'localhost', //localhost or IP
    message,
    messageLength,
    messageLengthInByte,
    aStringGenerate = new StringGenerate(),
    look = new Look();

require("./autobahn.js");

function publishEvent() {
    "use strict";
    var evt = {},
        excludeMe = false;

    evt.payload =
    sess.publish("measurement:overhead", evt, excludeMe);
}

function onControl(topicUri, event) {
    "use strict";
//    console.log(topicUri);
//    console.log(event);
    publishEvent();
}
function onOverhead(topicUri, event) {
    "use strict";
//    console.log(topicUri);
//    console.log(event);
}
ab.connect("ws://" + host + ":3000",

    // WAMP session was established
    function (session) {
        "use strict";
        // things to do once the session has been established
        sess = session;
        console.log("Connected!");

        sess.prefix("measurement", "http://" + host + ":3000/");
        sess.subscribe("measurement:control", onControl);
        sess.subscribe("measurement:overhead", onOverhead);
    },

    // WAMP session is gone
    function (code, reason) {
        "use strict";
        // things to do once the session fails
    }
    );

