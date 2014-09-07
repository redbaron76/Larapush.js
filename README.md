## Larapush.js - a Pub/Sub Js Library

#### A dependency-free Pub/Sub JavaScript library to work with [Larapush](https://github.com/redbaron76/Larapush)

This library is still **UNDER DEVELOPMENT** but feel free to download and try it as you wish.

##### Example implementation

```
(function() {

	var larapush = new Larapush('ws://192.168.10.10:8080');

	larapush.watch('demoChannel').on('generic.event', function(msgEvent)
	{
		console.log('generic.event has been fired!', msgEvent.message);
	});

	larapush.watch('profileChannel').on('generic.event', function(msgEvent)
	{
		console.log('profile.visit has been fired!', msgEvent.message);
	});

	larapush.watch('profileChannel').on('profile.visit', function(msgEvent)
	{
		console.log('profile.visit has been fired!', msgEvent.message);
	});

})();
```

Follow my Twitter account [@FFumis](http://twitter.com/FFumis) for any update. 