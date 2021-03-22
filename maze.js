
var WIDTH = 6
var HEIGHT = 6
var coins = 0;
var hearts = 3;
var max_hearts = 3;
var pet = '';
var weapon = '';
var armor = '';

function infobar_update(){
	$('.infobar .ra-gold-bar').text(coins);
	$('.infobar .weapon').addClass(weapon);
	$('td .weapon').addClass(weapon)
	$('td .armor').addClass(armor)
	$('.infobar .armor').addClass(armor);
	$('.infobar .ra-hearts').text(hearts + '/' + max_hearts);
}

function init() {
	
	/*WIDTH = Math.floor(WIDTH * 1.5)
	HEIGHT = Math.floor(HEIGHT * 1.5)*/

	var edges = []
	var removed_edges = []
	var num_cells_in_maze = 0;
	
	$('table').empty()
	for (var i=0; i<HEIGHT; i++) {
		$tr = $("<tr></tr>")
		for (var j=0; j<WIDTH; j++) {
			$tr.append("<td class='ra'><div class='weapon'></div><div class='armor'></div>&nbsp;</td>")
		}
		$('table').append($tr)
	}

	$('td').css('width', 80/WIDTH + 'vmin')
	$('td').css('height', 80/HEIGHT + 'vmin')
	$('td').css('font-size', 60/HEIGHT + 'vmin')

	function checkNeighbour($cell, $neighbour, dx, dy) {
		//console.log('checking', $neighbour)
		if (!$neighbour || !$neighbour.length) return
		if (!$neighbour.hasClass('in-maze')) {
			edges.push({
				$cell: $cell,
				$neighbour: $neighbour,
				dx: dx,
				dy: dy,
			})
		}
	}
	function removeEdge() {
		var edge_idx = Math.floor(num_cells_in_maze % edges.length)
		var edge = edges.splice(edge_idx, 1)[0]
		if (edge.$neighbour.hasClass('in-maze')) {
			removed_edges.push(edge)
		} else {
			addToMaze(edge.$neighbour)
		}
	}
	function addToMaze($cell) {
		num_cells_in_maze ++;
		$cell.addClass('in-maze')
		checkNeighbour($cell, $cell.next(), 1, 0)
		checkNeighbour($cell, $cell.prev(), -1, 0)
		checkNeighbour($cell, $cell.parent().next().children().eq($cell.index()), 0, 1)
		checkNeighbour($cell, $cell.parent().prev().children().eq($cell.index()), 0, -1)
	}

	addToMaze($("td").eq(Math.floor(WIDTH*HEIGHT/2)))

	while (num_cells_in_maze < WIDTH*HEIGHT) {
		removeEdge()
	}

	var m = {
		'01': 'border-bottom-wall',
		'0-1': 'border-top-wall',
		'-10': 'border-left-wall',
		'10': 'border-right-wall'
	}
	edges.concat(removed_edges).forEach(function(edge){
		edge.$cell.addClass(m[''+edge.dx+edge.dy])
		edge.$neighbour.addClass(m[''+(-edge.dx)+(-edge.dy)])
	})
	$("tr td:first-child").addClass('border-left-wall')
	$("tr td:last-child").addClass('border-right-wall')
	$("tr:first-child td").addClass('border-top-wall')
	$("tr:last-child td").addClass('border-bottom-wall')

	addTile('ra-player')
	//addTile('ra-shoe-prints')
	/*addTile('ra-gold-bar')
	addTile('ra-gold-bar')
	addTile('ra-gold-bar')
	addTile('ra-fire')
	addTile('ra-fire')
	addTile('ra-fire')
	addTile('ra-fire')
	addTile('ra-heart-bottle')
	addTile('ra-apple')
	addTile('ra-carrot')
	addTile('ra-cheese')
	addTile('ra-gem')
	addTile('ra-fox')
	addTile('ra-fox')*/
	addTile('ra-fox')
	addTile('ra-snake')
	addTile('ra-cat')
	/*addTile('ra-vest').addClass('cost-1')
	addTile('ra-sword').addClass('cost-1')
	addTile('ra-dripping-sword').addClass('cost-3')*/

	/*addTile('cost-3 sword')*/
	infobar_update()

}

$.fn.isEmpty = function(undefined) {
	return $(this).attr('class') !== undefined && $(this).attr('class').indexOf('ra-') === -1
}

function addTile(cls) {
	let $td = null;
	while (!$td ||
		!$td.isEmpty()
	  ) {
		$td = $("td").eq(Math.floor(Math.random()*WIDTH*HEIGHT))
	}
	$td.addClass(cls)
	return $td;
}

function moveRandomly($el) {
	Tile = Tiles.get($el.getTileName())
	if (Math.random() > Tile.speed/10) return;
	var options = [];
	const addOpt = ($opt) => {
		if ($opt.isEmpty()) {
			options.push($opt)
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
	
	if (options.length) {
		$dest = options[Math.floor(Math.random()*options.length)]
		cls = $el.getGameClasses()
		cls.forEach((c) => {$dest.addClass(c)})
		$el.clear()
	}
}

$.fn.getTileName = function() {
	const cls = $(this).attr('class').split(' ').filter((t) => {
		return t.indexOf("ra-") > -1
	})[0]
	
	if (cls) return cls.substr(3)
}

function moveTo($src, $dest) {
	if (!$dest || !$dest.length) return

	const destTileName = $dest.getTileName()
	const Tile = Tiles.get(destTileName)
	oldClasses = $dest.getGameClasses()
	
	const board = {
		clear: function(){
			$src.removeClass('ra-player')
			$dest.clear()
			$dest.addClass('ra-player')
		},
		swap: function() {
			$src.removeClass('ra-player')
			$dest.clear()
			$dest.addClass('ra-player')
			oldClasses.forEach((c) => {$src.addClass(c)})
		}
	}
	
	
	if(Tile) {
		Tile.touch(board)
	} else {
	
		if ($dest.hasClass('ra-shoe-prints')) {
			init()
		}
		
		board.clear()
	}
	infobar_update();
	
	moveRandomly($('.ra-snake').eq(0))
	moveRandomly($('.ra-fox').eq(0))
	//moveRandomly($('.ra-fox').eq(1))
	//moveRandomly($('.ra-fox').eq(2))
	
	// update pet.
	if (pet && $src.isEmpty()) {
		$('.' + pet).removeClass(pet)
		$src.addClass(pet)
	}
	
	if (hearts < 1) {
	  $dest.removeClass('ra-player').addClass('ra-falling')
	}
	

}

$.fn.up = function() {
	return $(this).parent().prev().children().eq($(this).index())
}
$.fn.down = function() {
	return $(this).parent().next().children().eq($(this).index())
}
$.fn.left = function() {
	return $(this).prev()
}
$.fn.right = function() {
	return $(this).next()
}

$.fn.getGameClasses = function() {
	const cls_list = $(this).attr('class').split(' ');
	return cls_list.filter((cls) => {
		return (cls.substr(0,3) == 'ra-' || cls.substr(0,5) == 'cost-')
	});
}
$.fn.clear = function() {
	const cls_list = $(this).getGameClasses()
	cls_list.forEach((cls) => {
		$(this).removeClass(cls)
	});
}

$(document).keyup(function(e){
	$m = $('.ra-player')
	if (e.key === 'ArrowUp') {
		$dest = $m.up()
		if (!$m.hasClass('border-top-wall')) {
			moveTo($m, $dest)
		}
	}
	if (e.key === 'ArrowDown') {
		$dest = $m.parent().next().children().eq($m.index())
		if (!$m.hasClass('border-bottom-wall')) {
			moveTo($m, $dest)
		}
	}
	if (e.key === 'ArrowLeft') {
		$dest = $m.prev()
		if (!$m.hasClass('border-left-wall')) {
			moveTo($m, $dest)
		}
	}
	if (e.key === 'ArrowRight') {
		$dest = $m.next()
		if (!$m.hasClass('border-right-wall')) {
			moveTo($m, $dest)
		}
	}
})

init()