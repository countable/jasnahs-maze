
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
			mmm.play()
		}
	},
	{
		name: 'cheese',
		parent: 'effect',
		collect: function() {
			hearts = Math.min(max_hearts, hearts + 3);
			mmm.play()
		}
	},
	{
		name: 'carrot',
		parent: 'effect',
		collect: function() {
			hearts = Math.min(max_hearts, hearts + 2);
			mmm.play()
		}
	},
	{	
		name: 'fire',
		collect: function() {
			if (pet !== 'ra-gem') {
				hurt(1)
			}
		},
		parent: 'effect'
	},
	{
		name: 'heart-bottle',
		collect: function() {
			max_hearts ++;
			mmm.play()
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

			if (weapon) {
				$dest.clear()
				if ($('.ra-fox').length === 0) {
					addTile('ra-shoe-prints')
				}
			}
			board.block()
		},
		tick: function($el) {

			if (Math.random() > this.speed/10) return;
			var options = [];
			var player_here = null;
			const addOpt = ($opt) => {
				if ($opt.isEmpty()) {
					options.push($opt)
				}
				if ($opt.hasClass('ra-player')) {
					player_here=$opt
				}
			}
			if (!$el.hasClass('border-top-wall')) {
				addOpt($el.up())
			}
			if (!$el.hasClass('border-bottom-wall')) {
				addOpt($el.down())
			}
			if (!$el.hasClass('border-left-wall')) {
				addOpt($el.left())
			}
			if (!$el.hasClass('border-right-wall')) {
				addOpt($el.right())
			}
			
			if (player_here) {
				hurt(this.damage)
			} else if (options.length) {
				$dest = options[Math.floor(Math.random()*options.length)]
				cls = $el.getGameClasses()
				cls.forEach((c) => {$dest.addClass(c)})
				$el.clear()
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