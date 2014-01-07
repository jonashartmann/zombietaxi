define([
	'goo/entities/EntityUtils',
	'goo/entities/components/ScriptComponent',
	'goo/renderer/Camera',
	'js/app/Game',
	'js/load/BundleLoader',
	'js/component/CollisionComponent',
	'js/game/EntityPool',
	'js/game/Constants'
],
function (
	EntityUtils,
	ScriptComponent,
	Camera,
	Game,
	BundleLoader,
	CollisionComponent,
	EntityPool,
	Constants
) {
	'use strict';
	var INITIAL_Z = -50,
		POOL_NAME = Constants.POOL_ZOMBIE;

	var _zombieEntity,
		_walkState,
		_runState,
		_zombies = [],
		_stateSpeed = {};

	var Spawner = {
		init: function init (_entity) {
			_zombieEntity = _entity;
			_walkState = _entity.animationComponent.getStates()[4];
			_runState = _entity.animationComponent.getStates()[3];
			_stateSpeed[_walkState] = 5;
			_stateSpeed[_runState] = 10;
			this._lanes = [
				-3,
				-1,
				1,
				3
			];
		},
		spawnZombie: function spawnZombie (state, pos) {
			var zombie = getNewZombieEntity();
			zombie.animationComponent.transitionTo(state);
			// set a custom property with the current state so we can get it later
			zombie.animationComponent.currentState = state;
			zombie.transformComponent.transform.translation.x = pos;
			zombie.transformComponent.transform.translation.z = INITIAL_Z;
			zombie.setComponent(_zombieEntity.mesh.meshRendererComponent);
			zombie.setComponent(new ScriptComponent({
				run: function runZombieRun(_entity) {
					_entity.transformComponent.transform.translation.z += _stateSpeed[state] * Game.goo.world.tpf;
					_entity.transformComponent.setUpdated();

					var pos = _entity.transformComponent.transform.translation;
					if (pos.z > 0) {
						_entity.removeFromWorld();
						EntityPool.add(POOL_NAME, _entity);
						Game.raiseEvent(Constants.EVENT_ESCAPED, _entity);
					}
				}
			}));
			// Add a collision component, so the taxi can kill them!
			zombie.setComponent(new CollisionComponent());
			zombie.addToWorld();
		},
		startAutoSpawn: function startAutoSpawn () {
			var states = [_walkState, _runState];
			var self = this;
			var _timeout,
				_interval = 5000,
				_spawnAmount = 0;

			var autoSpawn = function autoSpawn () {
				if (Game.paused) {
					_timeout = setTimeout(autoSpawn, _interval);
					return;
				}
				var freeLane = getRandomInt(0,3);
				for (var i = 0; i < self._lanes.length; i++) {
					if (i === freeLane) { continue; }
					self.spawnZombie(states[getRandomInt(0,1)], self._lanes[i]);
				}
				_spawnAmount++;
				if (_spawnAmount > 3) {
					_interval -= 500;
					if (_interval <= 2000) { _interval = 2000; }
					_spawnAmount = 0;
				}

				_timeout = setTimeout(autoSpawn, _interval);
			};

			_timeout = setTimeout(autoSpawn, 1000);
		}
	};

	function getNewZombieEntity() {
		// Get from the pool if available
		// Otherwise, create a new one by cloning
		return EntityPool.get(POOL_NAME) || EntityUtils.clone(Game.goo.world, _zombieEntity);
	}

	// Returns a random integer between min and max
	// Using Math.round() will give you a non-uniform distribution!
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	return Spawner;
});