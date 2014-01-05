define([
	'js/app/Game',
	'goo/math/Vector2'
], function(
	Game,
	Vector2
){
	"use strict";
	var _self = {};
	_self.init = function init (goo) {
		_self.hammertime = window.Hammer(goo.renderer.domElement);
		_self.hammertime
			.on('swipeleft', onSwipeLeft)
			.on('swiperight', onSwipeRight);
		window.document.body.onkeypress = function onKeyPressed(e) {
			var keynum = false;

			if(window.event){ // IE
				keynum = e.keyCode;
			}else {
				if(e.which){ // Netscape/Firefox/Opera
					keynum = e.which;
				}
			}

			if (keynum !== false) {
				// console.log('pressed: ', String.fromCharCode(keynum));
				var eventName = 'keypress:' + String.fromCharCode(keynum);
				// console.log('eventName', eventName);
				Game.raiseEvent(eventName);
			}
		};
	};

	function onSwipeLeft (event) {
		console.log('swipeleft');
		Game.raiseEvent('swipeleft');
	}

	function onSwipeRight (event) {
		console.log('swiperight');
		Game.raiseEvent('swiperight');
	}

	return _self;
});
