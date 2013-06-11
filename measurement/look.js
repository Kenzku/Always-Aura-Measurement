/**
 * Author: Ken
 * Date: 30/05/2013
 * Time: 15:57
 */
/*global module*/
function Look() {
    "use strict";
    var self = this,
        overhead = 0,
        payload = 0,
        numberOfIteration,
        time = {}, // in millisecond
        transferTime; // in millisecond

    self.config = function (options) {
        if (options) {
            if (options.payload) {
                payload = options.payload;
            }
            if (options.numberOfIteration) {
                numberOfIteration = options.numberOfIteration;
            }
        }
    };

    self.record = function (packet) {
        console.log("from look: %j", packet);
        if (packet && packet.length) {
            if (typeof packet.length === 'number') {
                overhead += packet.length;
                // fix headers
                overhead += 2;
            } else {
                overhead += parseInt(packet.length, 10);
            }
            if (packet.cmd === 'publish') {
                overhead -= payload;
//                console.log('length in total: ' + self.finish());
                console.log(self.finish());
                numberOfIteration -= 1;
                if (numberOfIteration === 0) {
                    process.exit(0);
                }
            }
        }
    };

    self.recordTimeStart = function () {
        time.startTime = (new Date()).getTime();
        return time.startTime;
    };

    self.recordTimeEnd = function () {
        time.endTime = (new Date()).getTime();
        return time.endTime;
    };

    self.transferTime = function () {
        transferTime = time.endTime - time.startTime;
        return transferTime;
    };

    self.finish = function () {
        return overhead;
    };

    self.reset = function () {
        overhead = 0;
    };
}

module.exports = Look;