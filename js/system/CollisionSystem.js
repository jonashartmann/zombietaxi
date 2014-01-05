define([
	'goo/entities/systems/System'
],
function (System) {
	'use strict';

	function CollisionSystem () {
		System.call(this, "CollisionSystem", ['CollisionComponent']);
	}
	CollisionSystem.prototype = Object.create(System.prototype);
	CollisionSystem.prototype.process = function(entities, tpf){
		// console.log('CollisionSystem', entities);
	};

	return CollisionSystem;
});