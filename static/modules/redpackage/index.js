define('redpackage/index', function(require, exports, module){ var $ = require('zepto');
var Ajax = require('common/ajax/index');
var LoginPop = require('common/login-pop/index');
var Alert = require('common/alert/alert');
var Bubble = require('common/bubble/bubble');

var ticketTmpl = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="redpackage-panel ticket-panel">\r\n\t<div class="inner-content">\r\n\t\t<p class="title">恭喜您</p>\r\n\t\t<p class="sub-title">抽中一个代金券！</p>\r\n\t\t<div class="item-content item-ticket">\r\n\t\t\t<p class="price-wrap"><i>&yen;</i><b>'+
((__t=( price ))==null?'':__t)+
'</b><span class="unit">优惠券</span></p>\r\n\t\t\t<p class="item-des">请尽快使用哦</p>\r\n\t\t</div>\r\n\t\t<div class="btn-wrap">\r\n\t\t\t<a href="/User/Center/myCoupon" class="btnl">去看看</a>\r\n\t\t</div>\r\n\t</div>\r\n</div>';
}
return __p;
}; //优惠券
var redTmpl = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="redpackage-panel">\r\n\t<div class="inner-content">\r\n\t\t<p class="title">恭喜您</p>\r\n\t\t<p class="sub-title">抽中一个红包！</p>\r\n\t\t<div class="item-content item-red">\r\n\t\t\t<p class="price-wrap"><i>&yen;</i><b>'+
((__t=( price ))==null?'':__t)+
'</b><span class="unit">元</span></p>\r\n\t\t\t<p class="item-des">现金红包将会在3分钟内发放给您哦~<br/>(0点至8点的红包将会在8点后发放哈）</p>\r\n\t\t</div>\r\n\t\t<div class="btn-wrap">\r\n\t\t\t<a href="/Mall/Home" class="btnl">确认</a>\r\n\t\t</div>\r\n\t</div>\r\n</div>';
}
return __p;
}; //优惠券

init();

function init() {
	addEvent();
	isLogin();
}

function addEvent() {
	$('#J-award-btn').on('click', getAward);
}

/**
 * 判断用户是否登陆
 * @return {Boolean} [description]
 */
function isLogin() {
	if ($(document.body).attr('is-login') == 0) {
		LoginPop.show({
			Ajax: Ajax,
			manualClose: false,
			loginSuc: function() {
				location.reload();
			}
		});
	}
}

/**
 * 抽奖
 * @return {[type]} [description]
 */
function getAward() {
	new Ajax().send({
		url: '/Activity/LotteryRedPackage/doLottery'
	}, function(result) {
		alertAward(result.type, {
			price: result.content
		});
	});
}



/**
 * 弹出奖励
 * @param  {[type]} type [description]
 * @return {[type]}      [description]
 */
function alertAward(type, data) {
	var html;

	switch (type) {
		case 1: //优惠券
			html = ticketTmpl(data);
			break;
		case 2: //红包
			html = redTmpl(data);
			break;
	}

	Alert.show(html, false, 'redpackage-alert');
} 
});