define([
	'goo/loaders/DynamicLoader',
],
function (DynamicLoader) {

	var goo,
		loader;

	var BundleLoader = {
		init: function init (go0, progressCB) {
			goo = go0;

			loader = new DynamicLoader({
				world: goo.world,
				rootPath: 'res',
				progressCallback: progressCB
			});
		},
		loadInitialData: function loadInitialData (onDataLoaded) {
			loader.loadFromBundle('project.project', 'root.bundle',
				{recursive: false, preloadBinaries: true})
			.then(onDataLoaded)
			.then(null, function onDataLoadFailed(e) {
				// If something goes wrong, 'e' is the error message from the engine.
				alert(e);
			});
		},
		getLoadedObjectByRef: function getLoadedObjectByRef (ref) {
			return loader.getCachedObjectForRef(ref);
		}
	};

	return BundleLoader;
});