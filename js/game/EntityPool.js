define([
],
function () {
	var pools = {};
	
	var EntityPool = {
		add: function add(poolName, entity) {
			if (!pools.hasOwnProperty(poolName)) {
				pools[poolName] = [];
			}
			
			pools[poolName].push(entity);
		},
		get: function get(poolName) {
			if (!pools.hasOwnProperty(poolName)) {
				pools[poolName] = [];
			}
			return pools[poolName].shift();
		}
	};
	
	return EntityPool;
});