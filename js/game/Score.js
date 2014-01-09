define([
	'js/app/Game',
	'js/game/Constants',
	'goo/entities/EntityUtils',
	'goo/entities/components/ScriptComponent'
],
function (
	Game,
	Constants,
	EntityUtils,
	ScriptComponent
) {
	'use strict';

	var hudEl = document.createElement('div');
	hudEl.className = 'hud';
	document.body.appendChild(hudEl);

	var Score = {
		score: 0,
		entity: null,
		escapedAmount: 0,
		multiplier: 1,
		scoreEl: null,
		init: function init () {
			var self = this;

			if (!self.entity) {
				self.entity = Game.goo.world.createEntity('score');
				self.entity.setComponent(new ScriptComponent({
					run: function () {
						// Create a hud element
						if (!self.scoreEl) {
							self.scoreEl = document.createElement('span');
							hudEl.innerText = 'Score: ';
							self.scoreEl.innerText = 0;
							hudEl.appendChild(self.scoreEl);
						}
					}
				}));
				self.entity.addToWorld();
			}
			Game.register(Constants.EVENT_KILLED, self.entity,
				function onZombieKilled (_zombie) {
					var runState = _zombie.animationComponent.getStates()[3];
					if (self.escapedAmount >= 3) {
						// multiplier for those who escape enough zombies first!
						self.multiplier = Math.floor(self.escapedAmount / 3);
						// console.log('multiplier', self.multiplier);
					}
					if (_zombie.animationComponent.currentState === runState) {
						// harder to catch them running!
						self.score += 50 * self.multiplier;
					}
					self.score += 100 * self.multiplier;
					self.escapedAmount = 0;
					self.scoreEl.innerText = self.score;
					// console.log('Score: %d', self.score);
				}
			);
			Game.register(Constants.EVENT_ESCAPED, self.entity,
				function onEscapedZombie (_zombie) {
					self.escapedAmount++;
					self.score += 10;
					self.scoreEl.innerText = self.score;
					// console.log('Escaped',self.escapedAmount);
				}
			);
		}
	};

	return Score;
});