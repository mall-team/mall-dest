define('common/ticket-pop/index', function(require, exports, module){ var $ = require('zepto');
var Pop = require('common/pop/index');
var Ajax = require('common/ajax/index');

var curOptions;
var ticketList;
var $curContainer;

function show(options) {
	curOptions = options || {};

	new Ajax().send({
		url: curOptions.ajaxUrl,
		data: curOptions.ajaxParams || {}
	}, function(result) {
		var list = result.list;

		Pop.show({
			title: '选择优惠券',
			content: function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="ticket-container">\r\n\t<ul>\r\n\t\t';
 $.each(list, function(i, item){ 
__p+='\r\n\t\t<li>\r\n\t\t\t<div class="money"><i>&yen;</i><b>'+
((__t=( item.coupon_money ))==null?'':__t)+
'</b></div>\r\n\t\t\t<div class="ticket-info">\r\n\t\t\t\t<p class="ticket-title">'+
((__t=( item.title ))==null?'':__t)+
'</p>\r\n\t\t\t\t';
 if(item.order_money==0){ 
__p+='\r\n\t\t\t\t<!-- <p class="des">全场通用</p> -->\r\n\t\t\t\t';
 }else{ 
__p+='\r\n\t\t\t\t<p class="des">满'+
((__t=( item.order_money ))==null?'':__t)+
'可用</p>\r\n\t\t\t\t';
 } 
__p+='\r\n\t\t\t</div>\r\n\t\t\t<a class="radio '+
((__t=( curId==item.coupon_code?'selected':'' ))==null?'':__t)+
' dib" ticket-item=\''+
((__t=( JSON.stringify(item) ))==null?'':__t)+
'\'><i class="icon-radio"></i></a>\r\n\t\t</li>\r\n\t\t';
 }) 
__p+='\r\n\t\t<li>\r\n\t\t\t<div class="ticket-info">不使用优惠券</div>\r\n\t\t\t<a class="radio dib" ticket-item="-1"><i class="icon-radio"></i></a>\r\n\t\t</li>\r\n\t</ul>\r\n</div>';
}
return __p;
}({
				list: (ticketList = list),
				curId: curOptions.curId || 0
			})
		});

		$curContainer = $('.ticket-container');

		$curContainer.on('click', '.radio', sel);
	});
}

function sel() {
	var $cur = $(this);
	var ticketItem = $cur.attr('ticket-item');

	$curContainer.find('.radio.selected').removeClass('selected');
	$cur.addClass('selected');
	Pop.hide();
	curOptions.selected && curOptions.selected(ticketItem != -1 ? JSON.parse(ticketItem) : -1, ticketList.length);
}


module.exports = {
	show: show
}; 
});