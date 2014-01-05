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
		};

	var Spawner = {
		init: function init (_entity) {
			_zombieEntity = _entity;
			_walkState = _entity.animationComponent.getStates()[4];
			_runState = _entity.animationComponent.getStates()[3];
			_stateSpeed[_walkState] = 5;
			_stateSpeed[_runState] = 10;
		},
		spawnZombie: function spawnZombie (state, pos) {
			var zombie = EntityUtils.clone(Game.goo.world, _zombieEntity);
			zombie.animationComponent.transitionTo(state);
			zombie.transformComponent.transform.translation.x = pos;
			zombie.setComponent(_zombieEntity.mesh.meshRendererComponent);
			zombie.setComponent(new ScriptComponent({
				run: function runZombieRun(_entity) {
					_entity.transformComponent.transform.translation.z += _stateSpeed[state] * Game.goo.world.tpf;
					_entity.transformComponent.setUpdated();

					var bounds = _entity.meshRendererComponent.worldBound;
					var result = Game.camera.cameraComponent.camera.contains(bounds);
					if (result === Camera.Outside) {
						console.log('Im outside!!!');
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
			}, 3000);
		}
	};

	// Returns a random integer between min and max
	// Using Math.round() will give you a non-uniform distribution!
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	return Spawner;
});