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