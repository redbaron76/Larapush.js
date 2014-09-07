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