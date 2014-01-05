require([
	'goo/entities/GooRunner',
	'goo/entities/EntityUtils',
	'goo/statemachine/FSMSystem',
	'goo/addons/howler/systems/HowlerSystem',
	'goo/loaders/DynamicLoader',
	'goo/math/Vector3',
	'goo/entities/components/ScriptComponent',
	'js/app/Game',
	'js/io/Input'
], function (
	GooRunner,
	EntityUtils,
	FSMSystem,
	HowlerSystem,
	DynamicLoader,
	Vector3,
	ScriptComponent,
	Game,
	Input
) {
	'use strict';
	var goo;

	function init() {

		// Make sure user is running Chrome/Firefox and that a WebGL context works
		var isChrome, isFirefox, isIE, isOpera, isSafari, isCocoonJS;
		isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
			isFirefox = typeof InstallTrigger !== 'undefined';
			isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
			isChrome = !!window.chrome && !isOpera;
			isIE = false || document.documentMode;
			isCocoonJS = navigator.appName === "Ludei CocoonJS";
		if (!(isFirefox || isChrome || isSafari || isCocoonJS || isIE === 11)) {
			alert("Sorry, but your browser is not supported.\nGoo works best in Google Chrome or Mozilla Firefox.\nYou will be redirected to a download page.");
			window.location.href = 'https://www.google.com/chrome';
		} else if (!window.WebGLRenderingContext) {
			alert("Sorry, but we could not find a WebGL rendering context.\nYou will be redirected to a troubleshooting page.");
			window.location.href = 'http://get.webgl.org/troubleshooting';
		} else {

			// Preventing brower peculiarities to mess with our control
			document.body.addEventListener('touchstart', function(event) {
				event.preventDefault();
			}, false);
			// Loading screen callback
			var progressCallback = function (handled, total) {
				var loadedPercent = (100*handled/total).toFixed();
				var loadingOverlay = document.getElementById("loadingOverlay");
				var progressBar = document.getElementById("progressBar");
				var progress = document.getElementById("progress");
				var loadingMessage = document.getElementById("loadingMessage");
				loadingOverlay.style.display = "block";
				loadingMessage.style.display = "block";
				progressBar.style.display = "block";
				progress.style.width = loadedPercent + "%";
			};

			// Create typical Goo application
			goo = new GooRunner({
				antialias: true,
				manuallyStartGameLoop: true
			});
			goo.world.setSystem(new FSMSystem(goo));
			goo.world.setSystem(new HowlerSystem());
			Game.init(goo);
			Input.init(goo);

			// The loader takes care of loading the data
			var loader = new DynamicLoader({
				world: goo.world,
				rootPath: 'res',
				progressCallback: progressCallback});

			loader.loadFromBundle('project.project', 'root.bundle',
				{recursive: false, preloadBinaries: true})
			.then(onDataLoaded.bind(loader))
			.then(null, function onDataLoadFailed(e) {
				// If something goes wrong, 'e' is the error message from the engine.
				alert(e);
			});

		}
	}

	// This code will be called when the project has finished loading.
	function onDataLoaded(configs) {
		var taxi = this.getCachedObjectForRef('car/entities/RootNode.entity');
		Game.register('swipeleft', taxi, function moveLeft () {
			var newX = taxi.transformComponent.transform.translation.x - 2;
			if (newX < -3) {
				return;
			}
			taxi.transformComponent.transform.translation.x = newX;
			taxi.transformComponent.setUpdated();
		});
		Game.register('swiperight', taxi, function moveRight () {
			var newX = taxi.transformComponent.transform.translation.x + 2;
			if (newX > 3) {
				return;
			}
			taxi.transformComponent.transform.translation.x = newX;
			taxi.transformComponent.setUpdated();
		});

		// Fake the car movement by displacing the road
		var road = this.getCachedObjectForRef('entities/Quad.entity');
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

		var zombie = this.getCachedObjectForRef('zombie/zombie_idle01/entities/RootNode.entity');
		var zombie2 = EntityUtils.clone(Game.goo.world, zombie);
		var walkState = zombie.animationComponent.getStates()[4];
		var runState = zombie.animationComponent.getStates()[3];

		var zSpeed = 5;
		zombie.setComponent(new ScriptComponent({
			run: function runZombieRun(_entity) {
				_entity.transformComponent.transform.translation.z += zSpeed * _entity._world.tpf;
				_entity.transformComponent.setUpdated();
			}
		}));

		zombie2.animationComponent.transitionTo(runState);
		zombie2.transformComponent.transform.translation.x += 2;
		var zSpeed2 = 10;
		zombie2.setComponent(new ScriptComponent({
			run: function runZombieRun(_entity) {
				_entity.transformComponent.transform.translation.z += zSpeed2 * _entity._world.tpf;
				_entity.transformComponent.setUpdated();
			}
		}));
		zombie2.addToWorld();

		// TODO: Add collision

		goo.renderer.domElement.id = 'goo';
		document.body.appendChild(goo.renderer.domElement);
		// Start the rendering loop!
		goo.startGameLoop();
	}

	init();
});
