var WebSocketServer = require('ws').Server;
require('../shared/global');
require('../shared/message_parser');
require('../shared/chat_message');

var MessageParser = rts.MessageParser;

var connections = {};

var printUsage = function()
{
	console.log('Usage: node websocket.js [port]');
}

var sendMessage = function(connection, message)
{
	var data = new Buffer(message.serialize());
	connection.send(data, {binary:true, masked:true});	
}

var onMessage = function(message)
{
	if (message instanceof ChatMessage)
	{
		console.log('Broadcasting chat message: ' + message.message );
		for (var c in connections) 
		{
			sendMessage(connections[c], message);
		}
	}
}

var main = function(argv)
{	
	if (process.argv.length > 3 || (process.argv.length == 3 && !parseInt(process.argv[2])))
	{
		printUsage();
		process.exit(1);
	}

	var port = 8080;
	if (process.argv[2])
		port = process.argv[2];
	
	var ids = 0;
	var messageParser = new MessageParser();
	
	var wss = new WebSocketServer({port: port});
	wss.on('connection', function(ws) 
	{
		var id = ids++;
		connections[id] = ws;
	    ws.on('message', function(data, flags) 
		{
	        process.stdout.write('Received message: ');
			console.log(data);

			var message = messageParser.parse(new Uint8Array(data));
			onMessage(message);
	    });
	
		ws.on('close', function(code, message) 
		{
			delete connections[id];
		});
	});
}

main(process.argv);