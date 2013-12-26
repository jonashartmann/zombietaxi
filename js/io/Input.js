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
