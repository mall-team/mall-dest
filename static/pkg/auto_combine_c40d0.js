define('common/copyright/index', function(require, exports, module){ var $ = require('zepto');

var _tmpl = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div id="copyright">大泽商城&nbsp;提供技术支持</div>';
}
return __p;
};
var HEI = 64; //组件高度

var $body = $(document.body);
var $win = $(window);
var $copyright;


function render() {
	if ($('#copyright').length > 0 || $('.copyright').length > 0) {
		return;
	}

	var noCr = $body.attr('no-copyright'); //是否不显示copyright
	if (noCr == 1) {
		return;
	}

	$body.append($(_tmpl()));
	$copyright = $('#copyright');

	reset();
}

function reset() {
	var bh = $body.height();
	var wh = $win.height();

	if (bh + HEI < wh) { //页面不满
		$body.css({
			'min-height': wh + 'px',
			'position': 'relative'
		});
		$copyright.css({
			'position': 'absolute',
			'width': '100%',
			'bottom': $body.css('padding-bottom')
		});
	} else {
		$copyright.css({
			'position': 'static',
			'width': 'auto'
		})
	}
}

module.exports = {
	render: render,
	reset: reset
}; 
});
;define('pay2/index', function(require, exports, module){ var $ = require('zepto');

// var totalVal = +$('#J-total-val').val() + (+$('#J-trans-val').val()); //消费金额 + 运费
var lastVal = +$('#J-last-val').val(); //帐户余额

var $moneyLast = $('.money-last');
var $payType = $('.pay-types > li');
var $useLastInput = $('#J-use-last');
var $payTypeInput = $('#J-pay-type')

function init() {
	initLastMoney();
	addEvent();
}

function addEvent() {

	$payType.on('click', function() {
		var $cur = $(this);

		if ($cur.hasClass('active')) {
			return;
		}
		$payType.removeClass('active');
		$cur.addClass('active');
		$payTypeInput.val($cur.attr('value'));

		// if (lastVal > totalVal) { //单选
		// 	$moneyLast.removeClass('selected');
		// 	$useLastInput.val(1);
		// }

	});

}


function initLastMoney() {
	if (lastVal == 0) {
		$moneyLast.addClass('disabled');
	} else {
		$moneyLast.addClass('usable').on('click', function() {
			var $cur = $(this);

			if ($cur.hasClass('selected')) { //不用余额
				$cur.removeClass('selected');
				$useLastInput.val(0);
			} else {
				$cur.addClass('selected');
				$useLastInput.val(1);

				// if (lastVal >= totalVal) { //单选
				// 	$payType.removeClass('active');
				// 	$payTypeInput.val(0);
				// }

			}


		});

	}
}

init(); 
});