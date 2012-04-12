(function(rts) 
{
	WebsocketInterface = function()
	{
		this.messageParser;
		this.ws;
		this.onMessage;
	}
	rts.WebsocketInterface = WebsocketInterface

	WebsocketInterface.prototype.setMessageParser = function(messageParser) 
	{
		this.messageParser = messageParser;
	}

	WebsocketInterface.prototype.setOnMessage = function(onMessage)
	{
		this.onMessage = onMessage;
	}

	WebsocketInterface.prototype.setup = function() 
	{
		console.log('Setting up websocket connection');
	
		console.log('Waiting for response from server');
		var ws = new WebSocket('ws://0.0.0.0:8080');
		ws.binaryType = 'arraybuffer';
		this.ws = ws;

		ws.onopen = function() 
		{  
			console.log('Received open event from socket');
		}
	
		var messageParser = this.messageParser;
		var onMessage = this.onMessage;
		ws.onmessage = function(rawMessage) 
		{
			console.log('Received message from socket');
		    var message = messageParser.parse(new Uint8Array(rawMessage.data));
			onMessage(message);
		}	
	}

	WebsocketInterface.prototype.send = function(message) 
	{
		var array = message.serialize();
		this.ws.send(array.buffer, {binary: true, mask: true});
	}
})(rts);