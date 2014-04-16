define(['app/entity/building', 'app/entity/block', 'app/analytics', 'app/gamecontent'], 
		function(Building, Block, Analytics, Content) {
	
	return {
		create: function() {
			this.buildings = [];
			this.stores = [];
			this.level = 1;
			this.xp = 0;
			this.dayNumber = 1;
			this.items = {};
			this.gem = 0;
			this.mana = 0;
			this.counts = {};
			this.prestige = 0;
			Analytics.trackEvent('game', 'create');
		},
		
		load: function() {
			try {
				var savedState = JSON.parse(localStorage.gameState);
				if(savedState) {
					this.buildings = [];
					for(var i in savedState.buildings) {
						this.buildings.push(Building.makeBuilding(savedState.buildings[i]));
					}
					this.stores = [];
					for (var i in savedState.stores) {
						this.stores.push(Block.makeBlock(savedState.stores[i]));
					}
					this.items = savedState.items || {};
					this.level = savedState.level;
					this.xp = savedState.xp;
					this.dayNumber = savedState.dayNumber || 1;
					this.gem = savedState.gem || 0;
					this.mana = savedState.mana || 0;
					this.counts = savedState.counts || {};
					this.prestige = savedState.prestige || 0;
				} else {
					this.create();
				}
			} catch(e) {
				this.create();
			}
			return this;
		},
		
		save: function() {
			if(typeof Storage != 'undefined' && localStorage) {
				var state = {
					buildings: [],
					stores: [],
					level: this.level,
					xp: this.xp,
					dayNumber: this.dayNumber,
					items: this.items,
					gem: this.gem,
					mana: this.mana,
					counts: this.counts,
					prestige: this.prestige
				};
				for(b in this.buildings) {
					var building = this.buildings[b];
					state.buildings.push(Building.makeBuilding(building));
				}
				for(s in this.stores) {
					var store = this.stores[s];
					state.stores.push(Block.makeBlock(store));
				}
				localStorage.gameState = JSON.stringify(state);
			}
			return this;
		},
		
		doPrestige: function() {
			this.buildings.length = 0;
			this.stores.length = 0;
			this.prestige = this.prestige ? this.prestige + 1 : 1;
			this.save();
		},
		
		savePersistents: function() {
			if(typeof Storage != 'undefined' && localStorage && localStorage.gameState) {
				var savedState = JSON.parse(localStorage.gameState);
				savedState.xp = this.xp;
				savedState.level = this.level;
				savedState.counts = this.counts;
				localStorage.gameState = JSON.stringify(savedState);
			}
		},
		
		removeBlock: function(block) {
			this.stores.splice(this.stores.indexOf(block), 1);
		},
		
		hasBuilding: function(type, ignoreObsolete) {
			for(var i in this.buildings) {
				var building = this.buildings[i];
				if(building.options.type.className == type.className && building.built && 
						(!ignoreObsolete || !building.obsolete)) {
					return true;
				}
			}
			return false;
		},
		
		getBuilding: function(type) {
			for(var i in this.buildings) {
				var building = this.buildings[i];
				if(building.options.type.className == type.className) {
					return building;
				}
			}
			return null;
		},
		
		maxHealth: function() {
			return 20 + 10 * this.level;
		},
		
		maxShield: function() {
			var highestMod = 1;
			for(var i in this.buildings) {
				var building = this.buildings[i];
				if(building.options.type.tileMod == 'wood' && 
						building.options.type.tileLevel > highestMod &&
						building.built) {
					highestMod = building.options.type.tileLevel;
				}
			}
			return 3 * highestMod;
		},
		
		maxSword: function() {
			var highestMod = 1;
			for(var i in this.buildings) {
				var building = this.buildings[i];
				if(building.options.type.tileMod == 'stone' && 
						building.options.type.tileLevel > highestMod &&
						building.built) {
					highestMod = building.options.type.tileLevel;
				}
			}
			// 3, 6, 9, 3, 6, 9, 3, 6, 9...
			return 3 * (((highestMod - 1) % 3) + 1);
		},
		
		swordDamage: function() {
			var highestMod = 1;
			for(var i in this.buildings) {
				var building = this.buildings[i];
				if(building.options.type.tileMod == 'stone' && 
						building.options.type.tileLevel > highestMod &&
						building.built) {
					highestMod = building.options.type.tileLevel;
				}
			}
			// 3, 3, 3, 6, 6, 6, 9, 9, 9...
			return 3 + Math.floor((highestMod - 1) / 3) * 3;
		},
		
		maxMana: function() {
			return 3;
		},
		
		magicEnabled: function() {
			return this.gem >= 4;
		},
		
		count: function(key, num) {
			var value = this.counts[key] || 0;
			value += num;
			this.counts[key] = value;
		},
		
		setIfHigher: function(key, num) {
			var value = this.counts[key] || 0;
			value = num > value ? num : value;
			this.counts[key] = value;
		}
	};
});
