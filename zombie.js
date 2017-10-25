function Zombie(_health, type) {
	
	var health=_health;
	var events = [];

	var view = (function() {
		var el = document.createElement("div");
		if(type == 1 || type == undefined) {
			el.className = "simple-zombie-view";
		}else if(type == 2) {
			el.className = "strong-zombie-view";
		}else if(type == 3) {
			el.className = "fast-zombie-view";
		}
		return el;
	})();

	var healthBlock = (function() {
		var el = document.createElement('div');
		el.className="zombie-health";
		return el;
	})();

	this.model= (function() {
		var el = document.createElement("div");
		el.className="zombie-model";
		el.appendChild(healthBlock);
		el.appendChild(view);
		return el;
	})();
	
	this.on = function(eventName, eventCallback) { 
		events[eventName] = eventCallback;
	};

	this.move = function() {
		if(type == 1 || type == undefined) {
			return 6;	
		}else if(type == 2) {
			return 3;
		}else if(type == 3) {
			return 12;
		}
	}

	this.hit = function(damage) {
		if(health != 0 ) {
			health -= damage;
			if(health <= 0) {
				events["killed"]();
				health = 0;
			}
			else {
			healthBlock.style.width = (health / _health) * 100 + '%';
			}
		}
	}
}

function SimpleZombie() {
	Zombie.call(this,100,1);
}
function StrongZombie() {
	Zombie.call(this,200,2);
}
function FastZombie() {
	Zombie.call(this,50,3);
}