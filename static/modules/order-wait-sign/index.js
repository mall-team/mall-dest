define('order-wait-sign/index', function(require, exports, module){ var $ = require('zepto');
var Alert = require('common/alert/alert');
var Confirm = require('common/confirm/index');

var _soldTmpl = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="sold-panel">\r\n\t<div class="title">联系客服</div>\r\n\t<p class="desc">关注淘金子公众账号，在公众账号反馈售后问题，客服即可受理。</p>\r\n\t<img src="http://cdn0.taojinzi.com/static/images/erwei-atten_01fff6c.png" />\r\n</div>';
}
return __p;
}();

//售后
$('.J-sold-btn').on('click', function(){
	Alert.show(_soldTmpl);
});

//提醒发货
$('.J-remind-btn').on('click', function(){
	Confirm.show({
		msg: '提醒卖家发货成功，请耐心等待！',
		type: 'alert'
	})
});

/**
 * 确认发货
 */
require('common/j-ajax/index').init({
	// selfLoginSuc: function(){
	// 	location.reload();
	// }
});

 
});