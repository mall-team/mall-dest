define('game-ny/index/index', function(require, exports, module){ var $ = require('zepto');
var Ajax = require('common/ajax/index');
var Alert = require('common/alert/alert');
var Guide = require('common/guide/guide');
var Confirm = require('common/confirm/index');

init();

function init() {
	addEvent();
	isOver();
}

function addEvent() {
	$(document).on('click', '#J-rule-btn', showRule);
	$(document).on('click', '#J-send-wish', sendWish);
	$(document).on('click', '#J-weal-btn', getWeal);

	new Guide('#J-invite-btn');
}

/**
 * 显示规则
 * @return {[type]} [description]
 */
function showRule(e) {
	e.preventDefault();
	Alert.show(function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="rule-panel">\r\n\t<h3>活动规则</h3>\r\n\t<ol>\r\n\t\t<li>每人只能领取一次福利，也只能送出一次祝福；</li>\r\n\t\t<li>福利有限，先到先得，发完即止；</li>\r\n\t\t<li>24：00～8：00点不发放福利，顺延到第二天早上陆续发放；</li>\r\n\t\t<li>存在1%几率因账号异常原因导致福利发放失败，不予补发；</li>\r\n\t\t<li>活动绝对真实，活动解释权归淘金子</li>\r\n\t</ol>\r\n</div>';
}
return __p;
}(), true, 'rule-alert');
}

/**
 * 领福利
 * @return {[type]} [description]
 */
function getWeal() {
	if (checkIsAtten()) {
		location.href = "/Activity/NewYearWish/index";
		// new Guide().show();
	}
}

/**
 * 送祝福
 * @return {[type]} [description]
 */
function sendWish() {
	if (!checkIsAtten()) {
		return;
	}
	var $me = $(this);

	new Ajax().send({
		url: '/Activity/NewYearWish/wish',
		data: {
			toOpenId: $('#J-to-id').val()
		}
	}, function(result) {
		Confirm.show({
			msg: result.msg || '祝福成功送出！',
			type: 'alert'
		});
		$me.attr('id', 'J-weal-btn').find('span').text('我也要领福利');
	});

}


/**
 * 检测是否已关注
 * @return {[type]} [description]
 */
function checkIsAtten() {
	var isAtten = $('#J-is-atten').val() == 1;

	if (!isAtten) {
		alertQrcode();
	}
	return isAtten;
}

/**
 * 弹出关注二维码
 * @return {[type]} [description]
 */
function alertQrcode() {
	new Ajax().send({
		url: '/Activity/NewYearWish/getQRCode',
		data: {
			toOpenId: $('#J-to-id').val()
		}
	}, function(result) {

		Alert.show(function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="remind-panel">\r\n\t<h3>淘金子粉丝专享新年福利</h3>\r\n\t<div class="img-erwei">\r\n\t\t<img src="'+
((__t=( qrcode ))==null?'':__t)+
'" />\r\n\t\t<div class="logo"><img src="http://cdn0.taojinzi.com/static/images/logo_2a50656.png" /></div>\r\n\t</div>\r\n\t<p class="tip">扫码关注，参与活动</p>\r\n</div>';
}
return __p;
}({
			qrcode: result.url
		}), true, 'remind-alert');

	});
}

/**
 * 是否活动结束
 * @return {Boolean} [description]
 */
function isOver() {
	if ($('#J-is-over').val() == 1) { //结束

		Alert.show(function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="remind-panel">\r\n\t<h3>活动已结束</h3>\r\n\t<p class="pre-tip">关注淘金子商城获得更多惊喜</p>\r\n\t<div class="img-erwei">\r\n\t\t<img src="http://cdn0.taojinzi.com/static/images/erwei_51bd0ae.png" />\r\n\t\t<div class="logo"><img src="http://cdn0.taojinzi.com/static/images/logo_2a50656.png" /></div>\r\n\t</div>\r\n\t<p class="tip">长按二维码，扫描关注</p>\r\n</div>';
}
return __p;
}(), false, 'remind-alert');

	}
} 
});