define([
	'js/app/Game',
	'js/load/BundleLoader',
	'js/game/Spawner',
	'goo/entities/components/ScriptComponent',
	'js/component/CollisionComponent'
],
function (Game, BundleLoader, Spawner, ScriptComponent, CollisionComponent) {
	'use strict';

	var Scene = {
		init: function init () {
			setupTaxi();
			setupRoad();
			setupZombies();
		}
	};

	function setupTaxi () {
		var taxi = BundleLoader.getLoadedObjectByRef('car/entities/RootNode.entity');
		Game.register('swipeleft', taxi, function moveLeft () {
			if (Game.paused) {return;}
			var newX = taxi.transformComponent.transform.translation.x - 2;
			if (newX < -3) {
				return;
			}
			taxi.transformComponent.transform.translation.x = newX;
			taxi.transformComponent.setUpdated();
		});
		Game.register('swiperight', taxi, function moveRight () {
			if (Game.paused) {return;}
			var newX = taxi.transformComponent.transform.translation.x + 2;
			if (newX > 3) {
				return;
			}
			taxi.transformComponent.transform.translation.x = newX;
			taxi.transformComponent.setUpdated();
		});

		taxi.setComponent(new CollisionComponent({
			// run: function (_entity) {
			// 	console.log('Running CollisionComponent');
			// }
		}));
	}

	function setupRoad () {
		// Fake the car movement by displacing the road
		var road = BundleLoader.getLoadedObjectByRef('entities/Quad.entity');
		var speed = 5;
		var MAX_CHANGE = 15;
		var changed = 0;
		road.setComponent(new ScriptComponent({
			run: function fakeRoadMovement (_entity) {
				var frameChange = speed * _entity._world.tpf;
				changed += frameChange;
				// fake road displacement by resetting it back and translating again
				if (changed >= MAX_CHANGE) {
					frameChange = -MAX_CHANGE;
					changed = 0;
				}

				_entity.transformComponent.transform.translation.z += frameChange;
				_entity.transformComponent.setUpdated();
			}
		}));
	}

	function setupZombies () {
		var zombieRoot = BundleLoader.getLoadedObjectByRef('zombie/zombie_idle01/entities/RootNode.entity');
		var zombieMesh = BundleLoader.getLoadedObjectByRef('zombie/zombie_idle01/entities/Zombie_0.entity');
		// Add a custom property to access the mesh from the root entity
		zombieRoot.mesh = zombieMesh;
		// zombieRoot.removeFromWorld();

		Spawner.init(zombieRoot);
		Spawner.startAutoSpawn();
	}

	return Scene;
});