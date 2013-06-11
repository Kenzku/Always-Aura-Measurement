
/*!
 * wamp.io: a node.js WAMP™ server
 * Copyright (c) 2012 Nico Kaiser <nico@kaiser.me>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var EventEmitter = process.EventEmitter,
    handlers = require('./handlers'),
    protocol = require('./protocol'),
    debug = require('debug')('wamp'),
    Look = require('../measurement/look.js');


/**
 * Server constructor.
 *
 * @api public
 */

// when sending a message from a client -
// topics contain { 'event:firstevent': { 'client id': true } },
function Server(options) {
    "use strict";
    this.options = options || {};
    this.topics = {};
    this.clients = {};
}

/**
 * Inherits from EventEmitter.
 */

Server.prototype.__proto__ = EventEmitter.prototype;

/**
 * Handle new connection
 *
 * @param {wsio.Socket} client
 * @return {Server} for chaining
 * @api public
 */

Server.prototype.onConnection = function(client) {
  var self = this;

  client.topics = {};
  client.prefixes = {};
  if (! client.id) client.id = String(Math.random() * Math.random()).substr(3);

  this.clients[client.id] = client;
    console.log("new connection --- wamp.io");
  debug('new connection');

  // Send welcome message
  var msg = [protocol.TYPE_ID_WELCOME, client.id, 1, 'wamp.io'];
  client.send(JSON.stringify(msg));

  client.on('message', function(data) {
      var msg,
          JSONData,
          messageLengthInByte = 0,
          payload,
          topicUri,
          topicUriLengthInByte = 0,
          payloadLengthInByte = 0,
          overhead,
          sum;
    debug('message received: ' + data);
    console.log('message received: ' + data);
    JSONData = JSON.parse(data);
    topicUri = JSONData[1];
    payload = JSONData[2];
    messageLengthInByte = Buffer.byteLength(data, 'utf8');
    topicUriLengthInByte = Buffer.byteLength(topicUri, 'utf8');
      if (payload) {
          payloadLengthInByte = Buffer.byteLength(JSON.stringify(payload), 'utf8');
      }
      overhead = messageLengthInByte - payloadLengthInByte - topicUriLengthInByte;
    try {
        if (JSONData[0] === 1) {
            // for each new request, new the look
            look = new Look();
        }
        if (topicUri === 'measurement:overhead' || topicUri === 'measurement') {
            console.log(overhead);
            look.addOverhead(overhead);
        }
        if (JSONData[0] === 7) {
            sum = look.getOverhead(overhead);
            console.log(sum);
            JSONData[2].payload = sum;
            msg = JSONData;
        } else {
            msg = JSON.parse(data);
        }
        console.log(msg);
    } catch (e) {
      debug('invalid json');
        console.log('invalid json');
      return;
    }

    if (! Array.isArray(msg)) {
      debug('msg not a list');
        console.log('msg not a list');
      return;
    }

    // trigger WAMP message types
    var typeId = msg.shift();
    if (! handlers[typeId]) {
      debug('unknown message type');
        consolog.log('unknown message type')
      return;
    }
    // this line dose WAMP protocol
    handlers[typeId].apply(self, [client, msg]);
  });

  client.on('close', function() {
    debug('client close');
//      /* for Object.keys() check out http://es5.github.com/#x15.2.3.14 */
//      for (var topic_1 in Object.keys(client.topics)) {
//      /* This line will caused a bug
//      * https://github.com/nicokaiser/wamp.io/issues/7
//      * */
//         delete self.topics[topic_1][client.id];
//    }
      /* for Object.keys() check out http://es5.github.com/#x15.2.3.14 */
      var toplicsKeys = Object.keys(client.topics);
      for (var topic in toplicsKeys) {
          delete self.topics[toplicsKeys[topic]][client.id];
      }
    delete self.clients[client.id];
  });

  return this;
};

/**
 * Publish an event to all subscribed clients
 *
 * @Param {Object} client
 * @param {String} topicUri
 * @param {Object} event
 * @param {String} exclude
 * @api public
 */

Server.prototype.publish = function(client, topicUri, event, exclude) {
    var msg,
        id,
        event;
    if (this.topics[topicUri]) {
        if (topicUri === 'measurement:overhead') {
            // for measuring overhead
            event = [event.payload];
        } else {
            // for other purpose
            event = ["message","session id", event, client.id];
        }
        msg = JSON.stringify([protocol.TYPE_ID_EVENT, topicUri, event]);
        this.broadcast(topicUri,msg,exclude);
  }
};

Server.prototype.broadcast = function(topicUri, msg, exclude){
//    var msg, id;
//    msg = JSON.stringify([protocol.TYPE_ID_EVENT, topicUri, event]);
    for (id in this.topics[topicUri]) {
        if (exclude && id === exclude) {
            continue;
        }
//        console.log(this.clients[id]);
        this.clients[id].send(msg);
        debug('delivered event to client ' + id);
        console.log('delivered event to client ' + id);
    }
};

/**
 * Module exports.
 */

module.exports = Server;