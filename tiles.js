
var Tiles = new EntityTree();

Tiles.add([
	{
		name: 'tile',
	},
	{
		name: 'item',
		cost: 1,
		touch: function(board) {
			if (!this.cost || coins >= this.cost) {
				coins -= this.cost
				this.collect()
				board.clear()
			} else {
				board.swap()
			}
		},
		parent: 'tile'
	},
	{
		name: 'monster',
		parent: 'tile'
	},
	{
		name: 'effect',
		parent: 'tile',
		touch: function(board) {
			this.collect();
			board.clear();
		}
	},
	{
		name: 'apple',
		parent: 'effect',
		collect: function() {
			hearts = Math.min(max_hearts, hearts + 1);
		}
	},
	{
		name: 'cheese',
		parent: 'effect',
		collect: function() {
			hearts = Math.min(max_hearts, hearts + 3);
		}
	},
	{
		name: 'carrot',
		parent: 'effect',
		collect: function() {
			hearts = Math.min(max_hearts, hearts + 2);
		}
	},
	{	
		name: 'fire',
		collect: function() {
			if (pet !== 'ra-gem') {
				hearts --;
			}
		},
		parent: 'effect'
	},
	{
		name: 'heart-bottle',
		collect: function() {
			max_hearts ++;
		},
		parent: 'effect'
	},
	{
		collect: function() {
			coins ++;
		},
		icon: 'ra-gold-bar',
		name: 'gold-bar',
		parent: 'effect'
	},
	{
		name: 'weapon',
		collect: function() {
			weapon = this.icon
		},
		parent: 'item'
	},
	{
		name: 'sword',
		icon: 'ra-sword',
		cost: 1,
		parent: 'weapon'
	},
	{
		name: 'dripping-sword',
		icon: 'ra-dripping-sword ',
		cost: 3,
		parent: 'weapon'
	},
	{
		name: 'vest',
		collect: function() {
			armor = this.icon
		},
		icon: 'ra-vest',
		parent: 'item'
	},
	
	// pets
	{
		name: 'pet',
		parent: 'tile',
		touch: function(board) {
			pet = 'ra-' + this.name
			board.clear()
		}
	},
	{
		name: 'cat',
		parent: 'pet'
	},
	{
		name: 'gem',
		parent: 'pet'
	},
	
	// enemies
	{
		name: 'enemy',
		speed: 10,
		touch: function(board) {
			if (!armor) {
				hearts -= this.damage;
			}
			if (weapon) {
				$dest.clear()
				if ($('.ra-fox').length === 0) {
					addTile('ra-shoe-prints')
				}
			}
		},
		parent: 'tile'
	},
	{
		name: 'fox',
		damage: 1,
		speed: 8,
		parent: 'enemy'
	},
	{
		name: 'snake',
		damage: 2,
		speed: 4,
		parent: 'enemy'
	}
])