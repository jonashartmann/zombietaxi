define([
	'js/app/Game',
	'js/load/BundleLoader',
	'js/game/Spawner',
	'goo/entities/components/ScriptComponent',
	'js/component/CollisionComponent',
	'js/game/EntityPool',
	'js/game/Constants'
],
function (Game, BundleLoader, Spawner, ScriptComponent, CollisionComponent, EntityPool, Constants) {
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

		taxi.setComponent(new CollisionComponent(function (_entity, others) {
			for (var i = 0; i < others.length; i++) {
				var myPos = _entity.transformComponent.transform.translation;
				var other = others[i];
				var otherPos = other.transformComponent.transform.translation;
				//console.log('Im at %d, %d', myPos.x, myPos.z);
				//console.log('Collision with %s at %d, %d ? ', other.name, otherPos.x, otherPos.z);
				// Calculate collision with some space around the car, to be sure we catch it.
				if ((otherPos.x === myPos.x) && (otherPos.z < myPos.z + 2) && (otherPos.z > myPos.z - 2)) {
					console.log('Collision with ', other.name);
					Game.raiseEvent('killed', other);
				}
			}
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
		
		Game.register('killed', this, onZombieKilled);
	}
	
	function onZombieKilled(zombie) {
		console.log('Killed: ', zombie.name);
		zombie.removeFromWorld();
		EntityPool.add(Constants.POOL_ZOMBIE, zombie);
	}

	return Scene;
});