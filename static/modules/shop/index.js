define('shop/index', function(require, exports, module){ var $ = require('zepto');
var Swiper = require('common/swiper/index');
var Alert = require('common/alert/alert');
var Bubble = require('common/bubble/bubble');
var Ajax = require('common/ajax/index');
var LoginPop = require('common/login-pop/index');
var RecommendAlert = require('recommend-alert/index');
var Util = require('common/util/index');

window.Bubble = Bubble;

// phpdata = {
// 	isLogin: 0
// };

var toUrl;

new Swiper({
	container: 'banner',
	pager: 'bannerPager'
});


$('#J-shop, #J-fenxiao').on('click', function(evt) {
	evt.preventDefault();

	var fromSrc = Util.getParam('from_src');

	if(!fromSrc || fromSrc != 'app'){
		Alert.show(function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="shop-tip-panel">\r\n\t<div class="title">开店方法</div>\r\n\t<div class="content">\r\n\t\t<p>1、店主邀请开店：找店主朋友发送开店邀请链接给您，通过邀请链接开通店主。</p>\r\n\t\t<p>2、客服申请开店：在"淘金子商城"公众号中直接咨询客服，申请开店。</p>\r\n\t</div>\r\n</div>';
}
return __p;
}(), true, 'shop-tip-alert');
		return false;
	}

	var $btn = $(this);
	var isLogin = phpdata.isLogin;
	var msg = $btn.attr('alert-msg');

	toUrl = $btn.attr('href');

	if (msg) {
		Alert.show(msg);
		return false;
	}
	if (isLogin == 0) {
		LoginPop.show({
			Ajax: Ajax,
			loginSuc: function() {
				confirmService();
			}
		});
		return false;
	}

	confirmService();
	return false;
});

/**
 * 确认服务人
 * @return {[type]} [description]
 */
function confirmService() {
	new Ajax().send({
		url: '/User/ApplyShop/confirmServiceInfo'
	}, function(result) {
		RecommendAlert.confirm({
			noLimit: true, //没有次数限制
			isShop: true,
			result: result,
			success: function(){
				location.href = toUrl;
			}
		});
	});


}


var Confirm = require('common/confirm/index');

var $body = $(document.body);
var url = $body.attr('alert');
var msg = $body.attr('alert-msg');

if (url) {
	Alert.show(url);
} else if (msg) {
	Confirm.show({
		msg: msg,
		type: 'alert',
		yesBack: function() {
			// window.history.back();
		}
	});
} 
});