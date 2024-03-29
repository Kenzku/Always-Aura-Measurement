/**
 * User: Ken
 * Date: 27/02/2013
 * Time: 14:01
 * This is another server for WebSocket Application Messaging Protocol (WAMP)
 */

/**
 * Module dependencies.
 */

var express = require('express') //http://nodejs.org/api/modules.html#modules_modules
    , routes = require('./routes')
//    , api = require('./routes/api')()
    , http = require('http')
    , path = require('path')
    , WebSocketServer = require('ws').Server
    , wampServer= require('./lib/wamp.io');

// "app" is a "request" object of the "_events" object in the "server"
var app = express();

// http.createServer(app) returns a server, "app" is called whenever an http request comes in
var server = http.createServer(app);
var wss = new WebSocketServer({server:server});
var wamp = wampServer.attach(wss);

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(routes.display404);
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

// rpc
//wamp.on('call',api_tryout.rpc.call); // enable this if want to test rpc on WAMP
//wamp.on('call', api.rpc.call);

server.listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});

