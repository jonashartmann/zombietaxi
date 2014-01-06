define([
	'goo/entities/EntityUtils',
	'goo/entities/components/ScriptComponent',
	'goo/renderer/Camera',
	'js/app/Game',
	'js/load/BundleLoader'
],
function (
	EntityUtils,
	ScriptComponent,
	Camera,
	Game,
	BundleLoader
) {
	'use strict';
	var INITIAL_Z = -100;
	
	var _zombieEntity,
		_walkState,
		_runState,
		_zombies = [],
		_stateSpeed = {},
		_lanes = {
			1: -3,
			2: -1,
			3: 1,
			4: 3
		},
		_zombiePool = [];

	var Spawner = {
		init: function init (_entity) {
			_zombieEntity = _entity;
			_walkState = _entity.animationComponent.getStates()[4];
			_runState = _entity.animationComponent.getStates()[3];
			_stateSpeed[_walkState] = 5;
			_stateSpeed[_runState] = 10;
		},
		spawnZombie: function spawnZombie (state, pos) {
			var zombie = getNewZombieEntity();
			zombie.animationComponent.transitionTo(state);
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
						_zombiePool.push(_entity);
					}
				}
			}));
			zombie.addToWorld();
		},
		startAutoSpawn: function startAutoSpawn () {
			var states = [_walkState, _runState];
			var self = this;

			self.spawnZombie(_runState, _lanes[1]);
			setInterval(function autoSpawn () {
				if (Game.paused) { return; }
				self.spawnZombie(states[getRandomInt(0,1)], _lanes[getRandomInt(1,4)]);
			}, 5000);
		}
	};

	function getNewZombieEntity() {
		// Get from the pool if available
		if (_zombiePool.length > 0) {
			return _zombiePool.shift();
		} else {
			// Otherwise, create a new one by cloning
			return EntityUtils.clone(Game.goo.world, _zombieEntity);
		}
	}

	// Returns a random integer between min and max
	// Using Math.round() will give you a non-uniform distribution!
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	return Spawner;
});