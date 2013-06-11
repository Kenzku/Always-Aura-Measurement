/**
 * Author: Ken
 * Date: 10/06/2013
 * Time: 13:29
 */
/*global phantom, ab*/
var sess,
    system = require('system'),
    when = require('./when.js'),
    host = 'localhost', //localhost or IP
    Look = require('./look.js'),
    CONSTANT = require('./constant.js'),
    StringGenerate = require('./stringgenerate.js'),
    message,
    messageLength,
    messageLengthInByte,
    aStringGenerate = new StringGenerate(),
    look = new Look();

require("./autobahn.js");

(function () {
    "use strict";
    // generate message
    messageLength = system.args[1] ||
        CONSTANT.DEFAULT_VALUE.MESSAGE_LENGTH;
    message = aStringGenerate.
        init({messageLength: messageLength}).
        generate();
}());

function publishEvent() {
    "use strict";
    var evt = {},
        excludeMe = false;

    evt.payload = message;
    sess.publish("measurement:overhead", evt, excludeMe);
}

function onControl(topicUri, event) {
    "use strict";
    publishEvent();
}

function onResult() {
    "use strict";
}

function onOverhead(topicUri, event) {
    "use strict";
    look.recordTimeEnd();
//    console.dir(topicUri);
    console.log(look.transferTime());
    phantom.exit();
}
ab.connect("ws://" + host + ":3000",

    // WAMP session was established
    function (session) {
        "use strict";
        // things to do once the session has been established
        sess = session;
//        console.log("Connected!");

        sess.prefix("measurement", "http://" + host + ":3000/");
//        sess.subscribe("measurement:control", onControl);
//        sess.subscribe("measurement:result", onResult);
        sess.subscribe("measurement:overhead", onOverhead);
        look.recordTimeStart();
        publishEvent();
    },

    // WAMP session is gone
    function (code, reason) {
        "use strict";
        // things to do once the session fails
    }
    );

