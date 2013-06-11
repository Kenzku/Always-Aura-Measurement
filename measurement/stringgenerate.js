/**
 * Author: Ken
 * Date: 06/06/2013
 * Time: 13:02
 */
var CONSTANT = require('./constant.js');
function StringGenerator() {
    "use strict";
    var self = this,
        messageLength = CONSTANT.DEFAULT_VALUE.MESSAGE_LENGTH;

    self.init = function (options) {
        if (options && options.messageLength) {
            messageLength = options.messageLength;
        }
        return self;
    };

    self.generate = function () {
        var i,
            text = "",
            mLength = messageLength ||
                CONSTANT.DEFAULT_VALUE.MESSAGE_LENGTH,
            possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (i = 0; i < mLength; i += 1) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };
}

module.exports = StringGenerator;