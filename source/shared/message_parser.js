(function(rts) 
{
	MessageParser = function()
	{
	}
	rts.MessageParser = MessageParser;

	MessageParser.prototype.parse = function(uintArray) 
	{
		console.log('Parsing message data');
		var payload = uintArray.subarray(1, uintArray.length);
		if (uintArray.length <= 0)
			throw 'Message data length is not greater than 0';
	
		var result;
		var type = uintArray[0];
		switch(type)
		{
			case rts.ChatMessage.ID:
				result = rts.ChatMessage.deserialize(payload);
				break;
			
			default:
				throw 'Unable to find implmentation for type ' + type;
				break;
		}
	
		return result;
	}
})(rts);