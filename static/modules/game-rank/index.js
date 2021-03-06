define('game-rank/index', function(require, exports, module){ var $ = require('zepto');

var NUM = 10;
var $see = $('.see-more');
var $rankList = $('.rank-list');

$see.on('click', function() {
	$('.rank-list').css({
		'height': 'auto'
	});

	$see.off('click');
	$see.css('display', 'none');
});


$('#J-refresh').on('click', function() {
	location.reload();
})

initRankHei();

function initRankHei() {
	if ($rankList.children().length > NUM) {
		$see.css('display', 'block');
		resetHei($rankList);
	} else {
		$rankList.css('height', 'auto');
	}
}

function resetHei($list) {
	// var winWid = $(window).width();

	$list.height($($list.children()[0]).height() * NUM + 17 * (NUM - 1) + 20 + 10);

} 
});