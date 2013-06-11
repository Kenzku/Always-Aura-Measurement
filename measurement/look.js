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
        time = {}, // in millisecond
        transferTime; // in millisecond

    self.addOverhead = function (eachOverhead) {
        if (eachOverhead && typeof eachOverhead === 'number') {
            overhead += eachOverhead;
        }
    };

    self.getOverhead = function () {
        return overhead;
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