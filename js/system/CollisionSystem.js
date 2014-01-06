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
		//console.log('Processing collisions for %d entities', entities.length);
		for (var i = 0; i < entities.length; i++) {
			//console.log('Entity:', entities[i].name);
			var logic = entities[i].collisionComponent.logic;
			var otherEntities = entities.slice(); // clone array
			otherEntities.splice(i, 1); // remove the current element
			logic && typeof logic === 'function' && logic(entities[i], otherEntities);
		}
	};

	return CollisionSystem;
});