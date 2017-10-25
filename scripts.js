
window.onload = function() {

	var process;
	var generator; 
	var fire;
	var firegenerator;
	var plantsDamage = 34;
	var zombies = [];
	var counter = 0;
	var amountOfZombies = 15;


	var renderField = function() {
		var field = document.getElementById("content");
		for (var i = 0; i <5; i++) {		
			field.appendChild((function() {
			var row = document.createElement("div");
			row.className = "row";
			row.setAttribute("id", "row" + (i + 1));
				for (var j = 0; j < 6; j++) {
					var cell = document.createElement("div");
					cell.className = "cell";
					if(j % 2 == 0) {
						cell.classList.add("grass");
					}
					else {
						cell.classList.add("grass-even");
					}
					cell.setAttribute("id","col" + (j + 1));
					row.appendChild(cell);
				}
			return row;
			})());
		}
	}


	renderField();
	

	document.getElementById("switcher").addEventListener("click", function() {
		if(this.getAttribute("value") == "pause") {
			stopAllProcesses();
			
			this.setAttribute("value","start");		
		}
		else {
			this.setAttribute("value","pause");
			
			generateZombies();
			generatePlants();
			plantsFire();

		}
	});

	document.getElementById("addDamage").addEventListener("click", function() {
		plantsDamage += 10;
	});

	var generatePlants = function() {	
		for (var i = 0; i < 5; i++) {
			var plant = document.createElement("div");
			plant.className = "plant-model";
		 	document.getElementById("row" + (i + 1) ).firstChild.appendChild(plant);
		} 
	}	

	var plantsFire = function() { 
		firegenerator = setInterval(function(){
			for (var i = 0; i < 5; i++) {
				var bullet = document.createElement("div");
				bullet.className = "bullet";
			 	document.getElementById("row" + (i + 1) ).lastElementChild.appendChild(bullet);		
		 	}
		}, 3000);

		fireProcess();
	}

	var generateZombies = function() { 
		generator = setInterval(function() {
			counter++;
			zombies[counter] =  selectZombieType(random(1,3));
    		document.getElementById("row"+ random(1,5)).lastElementChild.appendChild(zombies[counter].model); 

    		if(counter == amountOfZombies) {
    			clearInterval(generator);
    		}
        }, 2000);

    	zombieMove();
	}

	function selectZombieType(type) { 
		switch(type) {
			default: 
			case 1: 
				return new SimpleZombie();		
			case 2:
				return new StrongZombie();
			case 3:
				return new FastZombie();
		} 
	}

	function zombieMove() {
        process = setInterval(function() {
        	for (var i = 1; i <= counter; i++) {
        		if(zombies[i] == undefined) continue;
        		right = parseInt(document.defaultView.getComputedStyle(zombies[i].model, "").getPropertyValue('right'));
            
                right += zombies[i].move();
                zombies[i].model.style.right = right + 'px';

            	if(right >= 750) {
            		
            		stopAllProcesses();
					zombies = [];
					counter = 0;
					content.innerHTML = "";
					renderField();
					plantsDamage = 34;
					document.getElementById("switcher").setAttribute("value","start");
            		alert("lose");
            	}
        	}
        }, 100);
    }

	var fireProcess = function() { 
		fire = setInterval(function(){
		 	var allBullets = document.getElementsByClassName("bullet");
		 	for (var i = 0; i < allBullets.length; i++) {
		 		var left = parseInt(document.defaultView.getComputedStyle(allBullets[i], "").getPropertyValue('right'));
            	
                left -= 40;
                allBullets[i].style.right = left + 'px';

                if(left <=0) {
                	allBullets[i].remove();
                	allBullets[i] = undefined;
                }

                if(allBullets[i] != undefined && findAttakedZombiew(allBullets[i],left)) {
            
                	var zomb = findAttakedZombiew(allBullets[i],left);

                	allBullets[i] = undefined;
                	allBullets[i].remove();	
                	
                	zomb.zomb.on("killed",function() {
						zomb.zomb.model.remove();
						delete zombies[zomb.index];
						
					});
                	zomb.zomb.hit(plantsDamage);
                }
		 	}
		 	if(counter == amountOfZombies && document.getElementsByClassName("zombie-model").length == 0) {
		 		
		 		stopAllProcesses();
		 		document.getElementById("content").innerHTML = "";
		 		renderField();
		 		document.getElementById("switcher").setAttribute("value","start");
		 		plantsDamage = 34;
		 		zombies = [];
		 		counter = 0;
		 		alert("You win!");
		 	};
		 },100);
	}

	var findAttakedZombiew = function(bull,left) { 	
		for (var i = 1; i < zombies.length; i++) {
			if(zombies[i] == undefined) continue;
			if(parseInt(document.defaultView.getComputedStyle(zombies[i].model, "").getPropertyValue('right')) >= left-15
				&& bull.parentElement.parentElement == zombies[i].model.parentElement.parentElement) {	 
				return {zomb:zombies[i], index:i};
			}
		}
		return undefined;
	}

	function random(min, max) {
		return Math.floor((Math.random() * max) + min);
	}

	function stopAllProcesses() {
		clearInterval(process);
			clearInterval(generator);
			clearInterval(firegenerator);
			clearInterval(fire);
	}
}