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