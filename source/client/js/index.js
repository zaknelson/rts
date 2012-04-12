(function(rts) 
{
	//includes
	var ChatMessage = rts.ChatMessage;
	var MessageParser = rts.MessageParser;
	var WebsocketInterface = rts.WebsocketInterface;
	
	//globals
	var websocketInterface;
	
	var handleEnterKey = function()
	{
		var chatInput = document.getElementById('chatInput');
		var chatInputStyle = chatInput.style;
		if (chatInputStyle.display == 'inline')
		{
			var text = chatInput.value;
			if (text.length > 0)
			{
				var chatMessage = new ChatMessage(text);
				websocketInterface.send(chatMessage);
			}
			chatInputStyle.display = 'none';
		}
		else
		{
			chatInput.value = '';
			chatInputStyle.display = 'inline';
			chatInput.focus();
		}
	}
	
	var resizeFooter = function(childHeight)
	{
		var footer = document.getElementById('footer');
		var style = footer.style;
		var diff = parseInt(style.height) - parseInt(style['margin-top']);
		footer.style.height = (footer.children.length) * childHeight + "px";
		footer.style['margin-top'] = -(footer.children.length) * childHeight - 11 + "px";
	}
	
	var displayChat = function(message)
	{
		console.log('Displaying chat message: ' + message.message);
		
		var footer = document.getElementById('footer');
		var chatInput = document.getElementById('chatInput');
		
		var p = document.createElement('p');
		p.className = 'chat chatHistory overlay';
		p.innerHTML = message.message;
		p.onmousedown = function() { return false; };
		
		footer.insertBefore(p,chatInput);
		var chatHeight = p.clientHeight;
		resizeFooter(chatHeight);
		
		setTimeout(function() 
		{
		    var opacity = 1.0;
		    var animate = setInterval(function() 
			{
				opacity -= 0.05;
				if (opacity < 0) 
				{
					clearInterval(animate);
					footer.removeChild(p);
					resizeFooter(chatHeight);
	            }
				p.style.opacity = opacity;
	        }, 20);
		}, 5000);	
	}
	
	var onMessage = function(message)
	{
		if (message instanceof ChatMessage)
		{
			displayChat(message);
		}
	}

	var initWebGL = function()
	{
		var canvas = document.getElementById('mainCanvas');
		var gl = canvas.getContext('experimental-webgl');
		gl.clearColor(0.1328, 0.1484, 0.1953, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);
	}
	
	var initEventHandlers = function()
	{
		document.body.onkeydown = function(event)
			{
				if (event.keyCode == 13) // Enter key
					handleEnterKey();
			};
		document.body.onmousedown = function() { return false; };
	}
	
	window.onload = function(event)
	{
		initWebGL();
		initEventHandlers();
		
		var messageParser = new MessageParser();
		websocketInterface = new WebsocketInterface();
		websocketInterface.setMessageParser(messageParser);
		websocketInterface.setOnMessage(onMessage);
		websocketInterface.setup();
	}
	
}(rts));
