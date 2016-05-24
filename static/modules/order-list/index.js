define('order-list/index', function(require, exports, module){ var $ = require('zepto');
var Timer = require('common/timer/timer');
var Ajax = require('common/ajax/index');
var PageLoader = require('common/page-loader/index');
var Bubble = require('common/bubble/bubble');


function renderTimer($timerList) {
	$timerList.each(function(i, item) {

		new Timer($(item), function(time) {
			var minute = parseInt(time / 60, 10);
			var sec = time - minute * 60;
			return Timer.addZero(minute) + ':' + Timer.addZero(sec);
		}).start();

	});
}

renderTimer($('[timer]'));


var orderType = $('body').attr('order-type');
var ajaxUrl, itemLink;

ajaxUrl = $('#J-ajaxurl-list').val();
itemLink = $('#J-detail-prefix').val();

new PageLoader({
	container: '.order-list',
	pageBegin: 2,
	getHtml: function(pageNum, back) {

		new Ajax().send({
			url: ajaxUrl,
			data: {
				page: pageNum
			}
		}, function(result) {
			back && back(function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='';
 $.each(list, function(i, item){ 
__p+='\r\n<li class="order-item">\r\n\t<a href="'+
((__t=( itemLink + item.orderId ))==null?'':__t)+
'">\r\n\t\t<p class="top-info clearfix">\r\n\t\t\t<span class="date"><label>下单时间:</label><b>'+
((__t=( item.createTime ))==null?'':__t)+
'</b></span>\r\n\t\t\t';
 if(item.showStateName == '已取消'){ 
__p+='\r\n\t\t\t<span class="state cancel right">'+
((__t=( item.showStateName ))==null?'':__t)+
'</span>\r\n\t\t\t';
 }else{ 
__p+='\r\n\t\t\t<span class="state right">'+
((__t=( item.showStateName ))==null?'':__t)+
'</span>\r\n\t\t\t';
 } 
__p+='\r\n\t\t</p>\r\n\t\t<div class="order-info dib-wrap">\r\n\t\t\t<div class="img-wrap dib" style="background-image: url('+
((__t=( item.iShowImageUrl ))==null?'':__t)+
')"></div>\r\n\t\t\t<dl class="dib clearfix">\r\n\t\t\t\t<dt>订单编号</dt>\r\n\t\t\t\t<dd>'+
((__t=( item.orderId ))==null?'':__t)+
'</dd>\r\n\t\t\t\t<dt>订单金额</dt>\r\n\t\t\t\t<dd><span class="price"><i>&yen;</i><b>'+
((__t=( item.totalAmount ))==null?'':__t)+
'</b></span></dd>\r\n\t\t\t\t<dt>商品件数</dt>\r\n\t\t\t\t<dd>'+
((__t=( item.productList.length ))==null?'':__t)+
'</dd>\r\n\t\t\t</dl>\r\n\t\t\t<i class="icon-arrow"></i>\r\n\t\t</div>\r\n\t\t';
 if(orderType == 'pay-wait'){ 
__p+='\r\n\t\t<div class="btn-wrap">\r\n\t\t\t<button class="btnl">支付<span class="J-timer-'+
((__t=( pageNum ))==null?'':__t)+
'" timer="'+
((__t=( item.iLeftTime ))==null?'':__t)+
'"></span></button>\r\n\t\t</div>\r\n\t\t';
 } 
__p+='\r\n\t</a>\r\n</li>\r\n';
 }) 
__p+='';
}
return __p;
}({
				list: result.orderList,
				pageNum: pageNum
			}));
			if (orderType == 'pay-wait') {
				renderTimer($('.J-timer-' + pageNum));
			}
		})

	}
}).loadEnd(function() {
	Bubble.show('亲，没有更多订单了~');
}); 
});