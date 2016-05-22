define('chat/client-list/index', function(require, exports, module){ var $ = require('zepto');
var Ajax = require('common/ajax/index');
var PageLoader = require('common/page-loader/index');
var Bubble = require('common/bubble/bubble');
var Util = require('common/util/index');
var Pop = require('common/pop/index');

var listType = Util.getParam('type') || 0;
var atten = Util.getParam('atten') || 0;
var $clientList = $('.client-list');

init();

function init() {
	initPageLoader();
	addEvent();
}

function addEvent() {
	$clientList.on('click', '.J-contact-him', showPop);
}

/**
 * 初始化分页
 * @return {[type]} [description]
 */
function initPageLoader() {
	var curPageNum = 1;
	var curList;

	new PageLoader({
		container: $clientList,
		seeMore: '.see-more',
		getHtml: function(pageNum, back) {
			curPageNum = pageNum;

			new Ajax().send({
				url: '/User/Customer/customerList',
				data: {
					type: listType,
					atten: atten,
					page: pageNum
				}
			}, function(result) {
				curList = result.list;
				back && back(function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='';
 $.each(list, function(i, item){ 
__p+='\r\n<li>\r\n\t<div class="img-content">\r\n\t\t<div class="img-wrap" \r\n\t\t';
 if(item.headimgurl){ 
__p+='\r\n\t\tstyle="background-image: url('+
((__t=( item.headimgurl ))==null?'':__t)+
');"\r\n\t\t';
 } 
__p+='\r\n\t\t>\r\n\t\t</div>\r\n\t\t';
 if(item.newOne == 1){ 
__p+='\r\n\t\t<i class="new"></i>\r\n\t\t';
 } 
__p+='\r\n\t</div>\r\n\t<div class="info">\r\n\t\t<p class="name"><span>'+
((__t=( item.nickname ))==null?'':__t)+
'</span></p>\r\n\t\t<p class="time">'+
((__t=( item.remark ))==null?'':__t)+
'</p>\r\n\t</div>\r\n\t<div class="opt-wrap">\r\n\t\t';
 if(item.canChat == 1){ 
__p+='\r\n\t\t<a chart-href="/User/Customer/single?touser='+
((__t=( item.uid ))==null?'':__t)+
'" tel="'+
((__t=( item.phone ))==null?'':__t)+
'" class="J-contact-him contact-btn">联系他</a>\r\n\t\t';
 }else{ 
__p+='\r\n\t\t<a tel="'+
((__t=( item.phone ))==null?'':__t)+
'" class="J-contact-him contact-btn disabled">联系他</a>\r\n\t\t';
 } 
__p+='\r\n\t</div>\r\n</li>\r\n';
 }) 
__p+='';
}
return __p;
}({
					list: curList,
					pageNum: pageNum
				}), +$('.atten-nav .active .amount').text());
			});


		}
	}).loadFirst().loadEnd(function() {
		if(curPageNum == 1 && curList.length == 0){ //无数据
			$clientList.html('<li class="nodata">暂无客户</li>')
		}
	});
}

/**
 * 显示电话、短信浮层
 * @return {[type]} [description]
 */
function showPop() {
	var $cur = $(this);
	var tel = $cur.attr('tel');
	var chartHref = $cur.attr('chart-href');

	if (listType == 2) { // 2代表准顾客，直接聊天
		// Bubble.show('此功能正在升级中，即将开放');
		// return;

		location.href = chartHref;
		return;
	}

	var _tmpl = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="contact-panel">\r\n\t<div class="title">联系方式</div>\r\n\t<div class="btn-wrap">\r\n\t\t';
 if(chartHref){ 
__p+='\r\n\t\t<a href="'+
((__t=( chartHref ))==null?'':__t)+
'" class="J-chat-chat btnl btnl-wx">聊一聊</a>\r\n\t\t';
 } 
__p+='\r\n\t\t<a href="tel:'+
((__t=( tel ))==null?'':__t)+
'" class="btnl btnl-default">打电话</a>\r\n\t\t<a href="sms:'+
((__t=( tel ))==null?'':__t)+
'" class="btnl btnl-default">发短信</a>\r\n\t</div>\r\n</div>';
}
return __p;
};

	Pop.show({
		autoY: true,
		content: _tmpl({
			chartHref: chartHref,
			tel: tel
		})
	});

	// $(document.body).on('click', '.J-chat-chat', function(evt){
	// 	evt.preventDefault();
	// 	Bubble.show('此功能正在升级中，即将开放');
	// 	return false;
	// });

} 
});