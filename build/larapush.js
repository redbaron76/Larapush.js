/**
 * Larapush JavaScript Library v0.1.1
 *
 * A client-side js library for Larapush
 * WebSocket Push Server for Laravel 4
 *
 * Copyright 2014, Fabio Fumis - f.fumis@gmail.com
 * Released under the MIT licence.
 */

;(function() {

	function Larapush(ConnectionUri)
	{
		var self = this;

		self.connection = new Larapush.Connection(ConnectionUri);
		self.pubsub = new Larapush.PubSub();

		self.connection.onopen = function()
		{
			// console.log('onopen');
		};

		self.connection.onerror = function(error)
		{
			console.log('onerror', error);
		};

		self.connection.onclose = function(closeEvent)
		{
			console.log('onclose', closeEvent);
		};

		self.connection.onmessage = function(messageEvent)
		{
			self.parseMessage(messageEvent.data);
		};

	}

	var prototype = Larapush.prototype;

	// Send message to the server
	prototype.dispatch = function(message)
	{
		if ("JSON" in window)
		{
			var strMessage = JSON.stringify(message);
			
			this.waitForSocketConnection(this.connection, function(connection)
			{
				connection.send(strMessage);
			});
		}
		else
		{
			alert('Your browser doesn\'t support JSON');
			return;
		}		
	};

	// Trigger callback(s) on event
	prototype.on = function(eventName, callback)
	{
		if (this.pubsub.bind(eventName, callback))
		{
			return this;
		}		
	};

	// Parse the message from the server in 'onmessage'
	prototype.parseMessage = function(data)
	{
		if (data && window.JSON)
		{
			var receivedObject = JSON.parse(data);
			var typeID = receivedObject[0];
			var channel = receivedObject[1];
			var object = receivedObject[2];

			switch (typeID)
			{
				case (this.pubsub.MESSAGE_TYPEID_EVENT):
					this.pubsub.fire(channel, object.event, object);
					break;

				default:
					// console.log('default message: ', receivedObject);
			}
		}
		else
		{
			alert('Your browser doesn\'t support JSON');
		}
	};

	// Check or wait for a socket connection
	prototype.waitForSocketConnection = function(conn, callback)
	{
		var self = this;
		setTimeout(function() {
			if (conn.readyState === 1)
			{
				if (typeof(callback) === 'function')
				{
					callback(conn);
				}
				return;
			}
			else
			{
				self.waitForSocketConnection(conn, callback);
			}
		}, 5);
	};

	// Subscribe to a channel
	prototype.watch = function(channelName)
	{
		var submitStr = this.pubsub.channel(channelName);

		if(typeof(submitStr) === 'object')
		{
			this.dispatch(submitStr);
		}

		return this;		
	};

	this.Larapush = Larapush;

}).call(this);
/**
 * Larapush JavaScript Library v0.1.1
 *
 * A client-side js library for Larapush
 * WebSocket Push Server for Laravel 4
 *
 * Copyright 2014, Fabio Fumis - f.fumis@gmail.com
 * Released under the MIT licence.
 */

;(function() {	

	function Connection(ConnectionUri, protocols)
	{
		this.CONNECTION_CLOSED = 0;
		this.CONNECTION_LOST = 1;
		this.CONNECTION_RETRIES_EXCEEDED = 2;
		this.CONNECTION_UNREACHABLE = 3;
		this.CONNECTION_UNSUPPORTED = 4;
		this.CONNECTION_UNREACHABLE_SCHEDULED_RECONNECT = 5;
		this.CONNECTION_LOST_SCHEDULED_RECONNECT = 6;

		this.socket = null;
		this.state = 'initialized';

		if ("WebSocket" in window)
		{
			// Chrome, MSIE, newer Firefox
			if (protocols)
			{
				this.socket = new WebSocket(ConnectionUri, protocols);
			}
			else
			{
				this.socket = new WebSocket(ConnectionUri);
			}
		}
		else if ("MozWebSocket" in window)
		{
			// older versions of Firefox prefix the WebSocket object
			if (protocols)
			{
				this.socket = new MozWebSocket(ConnectionUri, protocols);
			}
			else
			{
				this.socket = new MozWebSocket(ConnectionUri);
			}
		}
		else
		{
			alert('Your browser doesn\'t support WebSocket');
		}

		return this.socket;	
	}

	var prototype = Connection.prototype;
	
	Larapush.Connection = Connection;

}).call(this);
/**
 * Larapush JavaScript Library v0.1.1
 *
 * A client-side js library for Larapush
 * WebSocket Push Server for Laravel 4
 *
 * Copyright 2014, Fabio Fumis - f.fumis@gmail.com
 * Released under the MIT licence.
 */

;(function() {

	function PubSub()
	{
		this.MESSAGE_TYPEID_WELCOME        = 0;
		this.MESSAGE_TYPEID_PREFIX         = 1;
		this.MESSAGE_TYPEID_CALL           = 2;
		this.MESSAGE_TYPEID_CALL_RESULT    = 3;
		this.MESSAGE_TYPEID_CALL_ERROR     = 4;
		this.MESSAGE_TYPEID_SUBSCRIBE      = 5;
		this.MESSAGE_TYPEID_UNSUBSCRIBE    = 6;
		this.MESSAGE_TYPEID_PUBLISH        = 7;
		this.MESSAGE_TYPEID_EVENT          = 8;

		this.channelName = "";
		this.channels = [];
	}

	var prototype = PubSub.prototype;

	// Add a channelName to channels and return itself
	prototype.channel = function(channelName)
	{
		var channels = this.channels;
		
		if ( ! channels[channelName])
		{
			channels[channelName] = [];
		}
		
		this.channelName = channelName;

		return [this.MESSAGE_TYPEID_SUBSCRIBE, this.channelName];		
	};

	// Bind an eventName to a callback function
	prototype.bind = function(eventName, callback)
	{
		var args = arguments,
			channel = this.channels[this.channelName],
			i, argLen = args.length,
			tmp, ai = [];

		// Starting from 2nd argument (1)
		for (i = 1; i < argLen; i++)
		{
			ai = args[i];
			
			// if just a function, array it
			tmp = (typeof(ai) === 'function' ) ? [ai] : ai;

			// push object with eventName and related callback
			if (typeof(tmp) === 'object' && tmp.length)
			{
				channel.push({'event': eventName, 'callback': tmp})
			}
		}

		return true;
	};

	// Fire an event on message received from the server
	prototype.fire = function(channelName, eventName, object)
	{
		var i, tmp = [];
			ch = this.channels[channelName];

		if (ch.length > 0)
		{
			for (i = 0; i < ch.length; i++)
			{
				if (ch[i].event == eventName)
				{
					tmp.push({'callback': ch[i].callback});
				}					
			}

			for (i = 0; i < tmp.length; i++)
			{
				tmp[i].callback[i](object);
			}
		}
	}

	Larapush.PubSub = PubSub;

}).call(this);