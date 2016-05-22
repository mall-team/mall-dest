define('xiepp/index/index', function(require, exports, module){ var $ = require('zepto');
require('extend/lazyload');
var Ajax = require('common/ajax/index');
var JAjax = require('common/j-ajax/index');
var Guide = require('common/guide/guide');
var Alert = require('common/alert/alert');
var Timer = require('common/timer/timer');
var Util = require('common/util/index');
var JDisabled = require('common/j-disabled/index');
var CommentSection = require('common/comment-section/index');

var productId = $('#J-product-id').val();

init();

function init() {
	addEvent();
	initPreTimer();

	CommentSection.init({
		id: productId,
		name: $('#J-product-name').val()
	});

	JAjax.init();
	JDisabled.init();
	lazyLoadImg();
}

function addEvent() {
	$('.J-remind-btn').on('click', remind); //开抢提醒
	$('#J-rule-btn').on('click', function() {
		Alert.show(function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="rule-panel">\r\n\t<div class="img-wrap"></div>\r\n</div>';
}
return __p;
}(), true, 'rule-alert');
	});
}

function lazyLoadImg() {
	$("[data-original]").lazyload({
		placeholderClass: 'placeholder',
		effect: 'fadeIn',
		threshold: 500
	});
}

/**
 * 开抢提醒
 * @return {[type]} [description]
 */
var reminding = false;

function remind() {

	if (reminding) {
		return false;
	}

	reminding = true;

	new Ajax().send({
		url: '/Activity/Crab/subscribeQrCode',
		data: {
			recommend: Util.getParam('recommend')
		}
	}, function(result) {

		Alert.show(function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="remind-panel remind-over">\r\n\t<div class="tip-wrap">\r\n\t\t<div class="tip-inner"><p>'+
((__t=( startTime))==null?'':__t)+
'</p>准时开团</div>\r\n\t</div>\r\n\t<div class="qrcode-wrap">\r\n\t\t<div class="img-erwei">\r\n\t\t\t<img src="'+
((__t=( qrcode ))==null?'':__t)+
'" />\r\n\t\t\t<!--<div class="logo"><img src="http://cdn0.taojinzi.com/static/images/logo_2a50656.png" /></div>-->\r\n\t\t</div>\r\n\t\t<p class="tip">长按二维码，预约抢购</p>\r\n\t</div>\r\n</div>';
}
return __p;
}({
			qrcode: result.url,
			startTime: result.startTime
		}), true, 'remind-over', function() {
			reminding = false;
		});

	}, function() {
		reminding = false;
	});
}

/**
 * 初始化预热倒计时
 * @return {[type]} [description]
 */
function initPreTimer() {
	var $preTimer = $('#J-pre-timer');
	var timer;

	if (!$preTimer[0]) {
		return;
	}

	timer = new Timer($preTimer, function() {
		var self = this;
		return (self.day > 0 ? (Timer.addZero(self.day) + '天 ') : '') + Timer.addZero(self.hour) + '小时' + Timer.addZero(self.min) + '分钟' + Timer.addZero(self.sec) + '秒';
	});
	timer.start().end(function() {
		location.reload();
	});
} 
});