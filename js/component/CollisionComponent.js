define([
	'goo/entities/components/Component'
],
function (Component) {
	function CollisionComponent (logic) {
		this.type = "CollisionComponent";
		this.logic = logic;
	}
	CollisionComponent.prototype = Object.create(Component.prototype);

	return CollisionComponent;
});