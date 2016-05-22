define('pay-suc/index', function(require, exports, module){ var Alert = require('common/alert/alert');
var Bubble = require('common/bubble/bubble');
var Guide = require('common/guide/guide');

var url = document.body.getAttribute('alert');

window.Bubble = Bubble;

if(url){
	Alert.show(url);
}

new Guide('#J-share-order');

checkCoupon();

/**
 * 检查是否有优惠券可领
 * @return {[type]} [description]
 */
function checkCoupon(){
	var hasCoupon = $('#J-has-coupon').val() == 1;

	if(hasCoupon){
		Alert.show(function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="coupon-rain-panel">\r\n\t<h3>'+
((__t=( title ))==null?'':__t)+
'</h3>\r\n\t<section>\r\n\t\t<p class="msg">'+
((__t=( msg ))==null?'':__t)+
'</p>\r\n\t\t<div class="img-wrap icon-ok"></div>\r\n\t\t<div class="btn-wrap">\r\n\t\t\t<a href="/User/Coupon/paySuccGetCoupon?orderId='+
((__t=( order ))==null?'':__t)+
'" class="btnl btnl-see">去领取优惠券</a>\r\n\t\t</div>\r\n\t</section>\r\n</div>';
}
return __p;
}({
			title: '手气不错哦',
			msg: '共有1张优惠券可领',
			order: $('#J-order').text()
		}), true, 'coupon-rain-alert');
	}
} 
});