define('towel/index/index', function(require, exports, module){ var $ = require('zepto');
var Ajax = require('common/ajax/index');
var JAjax = require('common/j-ajax/index');
var Guide = require('common/guide/guide');
var Alert = require('common/alert/alert');
var Timer = require('common/timer/timer');
var Util = require('common/util/index');
var JDisabled = require('common/j-disabled/index');
var Bullet = require('common/bullet/index');
var CommentSection = require('common/comment-section/index');

var productId = $('#J-product-id').val();
var firRank = true; //首次进入排队流程

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
	new Guide('#J-invite-btn', 'guide-klj', '邀请好友来参与活动吧～<br/><i>怎么邀请？你懂得！</i>');

	var $wakeTmpl = $('#J-wake-tmpl');

	// if ($wakeTmpl[0]) { //支付完成，提醒看消息领奖励
	// Alert.show($wakeTmpl.html(), true, 'wake-award-alert');
	// } else {
	if ($(document.body).attr('is-over') == 1) {
		remindOver();
	}
	// }
}

function addEvent() {
	$('.J-remind-btn').on('click', remindOver); //开抢提醒
	$('#J-award-guide').on('click', function() {
		$(this).remove();
	});
	$('.J-quick-buy').on('click', quickBuy);
}

/**
 * 购买
 * @return {[type]} [description]
 */
function quickBuy(evt) {
	evt.preventDefault();

	var $el = $(this),
		$form = $('#' + $el.attr('form'));

	$el.trigger('disabled:click');
	buyRank(function() {

		new Ajax().send({
			url: $form.attr('action'),
			type: $form.attr('method'),
			data: $form.serialize()
		}, function(result) {

		}, function() { //购买异常
			$el.trigger('disabled:ok');
		});

	}, function() {
		$el.trigger('disabled:ok');
	});
}

/**
 * 购买排队
 * @return {[type]} [description]
 */
function buyRank(sucBack, errorBack) {
	new Ajax().send({
		url: '/Activity/Towel/addQueue'
	}, function(result) {
		if (result == 0) { //进入购买流程
			sucBack && sucBack();
		} else { //进入排队流程
			if (firRank) {
				Alert.show(function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="rank-alert-panel">\r\n\t<div class="img-wrap"></div>\r\n\t<p>努力排队中...</p>\r\n</div>';
}
return __p;
}(), false, 'rank-alert');
				firRank = false;
			}

			setTimeout(function() {
				buyRank(sucBack, errorBack);
			}, 1000);
		}
	}, function() { //接口异常
		errorBack && errorBack();
	});
}

/**
 * 结束提醒
 * @return {[type]} [description]
 */
function remindOver() {
	var $bulletContainer;

	Alert.show($('#J-remind-over').html(), false, 'remind-over');

	$bulletContainer = $('#J-bullet-screen').css('top', '-' + $('#J-alert-content-wrap').css('margin-top'));
	// new Bullet($bulletContainer, ['123', '4556']).start();
	// return;

	//获取评论第二页数据
	new Ajax().send({
		url: '/Mall/Goods/moreComment',
		data: {
			g: productId,
			page: 2
		}
	}, function(result) {
		var list = result.commentlist.data;

		if (!list || list.length <= 0) {
			return;
		}
		new Bullet($bulletContainer, list.map(function(item, i) {
			return item['customer_name'] + '：' + item['comment_content'];
		})).start();
	});

	new Guide('#J-share-friend', 'guide-klj', '邀请好友来参与活动吧～<br/><i>怎么邀请？你懂得！</i>');
}

/**
 * 开抢提醒
 * @return {[type]} [description]
 */
function remind() {
	new Ajax().send({
		url: '/Activity/Towel/subscribeQrCode',
		data: {
			pid: Util.getParam('pid'),
			did: Util.getParam('did'),
			recommend: Util.getParam('recommend')
		}
	}, function(result) {

		Alert.show(function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="remind-panel">\r\n\t<h3>开抢提醒</h3>\r\n\t<p class="pre-tip">关注商城获得开抢提醒</p>\r\n\t<div class="img-erwei">\r\n\t\t<img src="'+
((__t=( qrcode ))==null?'':__t)+
'" />\r\n\t\t<div class="logo"><img src="http://cdn0.taojinzi.com/static/images/logo_2a50656.png" /></div>\r\n\t</div>\r\n\t<p class="tip">长按二维码，扫描关注</p>\r\n</div>';
}
return __p;
}({
			qrcode: result.url
		}), true, 'remind-alert');

	});
}

/**
 * 初始化预热倒计时
 * @return {[type]} [description]
 */
function initPreTimer() {
	var isPre = $(document.body).hasClass('pre');

	if (!isPre) {
		start();
		return;
	}
	var timer = new Timer('#J-pre-timer', function() {
		var self = this;
		return (self.day > 0 ? (Timer.addZero(self.day) + '天 ') : '') + Timer.addZero(self.hour) + ':' + Timer.addZero(self.min) + ':' + Timer.addZero(self.sec);
	});
	timer.start().end(function() {
		location.reload();
	});
}

/**
 * 启动获取红包数据定时器
 * @return {[type]} [description]
 */
function start() {
	rendSendMoney();
	setTimeout(start, 5000);
}

/**
 * 渲染已发送红包数额
 * @param  {[type]} back [description]
 * @return {[type]}      [description]
 */
function rendSendMoney(back) {
	new Ajax().send({
		url: '/Activity/Towel/alreadySendRedPackage'
	}, function(result) {
		var $money = $('#J-send-money');

		if (result.redPackage != $money.text()) {
			$money.html(result.redPackage).addClass('money-ani');
			setTimeout(function() {
				$('#J-send-money').removeClass('money-ani');
			}, 1000);
		}
		back && back();
	});
} 
});