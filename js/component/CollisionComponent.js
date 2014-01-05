define([
	'goo/entities/components/Component'
],
function (Component) {
	function CollisionComponent () {
		this.type = "CollisionComponent";
	}
	CollisionComponent.prototype = Object.create(Component.prototype);

	return CollisionComponent;
});