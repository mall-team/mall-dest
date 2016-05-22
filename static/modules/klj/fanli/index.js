define('klj/fanli/index', function(require, exports, module){ var $ = require('zepto');
var Bubble = require('common/bubble/bubble');
var Pop = require('common/pop/index');
// var Tabs = require('common/tabs/index');
var PageLoader = require('common/page-loader/index');
var Ajax = require('common/ajax/index');
var Util = require('common/util/index');
var LoginPop = require('common/login-pop/index');
var Alert = require('common/alert/alert');

var $managerList = $('#J-manager-list');
var isLogin = !(typeof phpdata !== 'undefined' && phpdata.isLogin == 0);

init();

function init() {
	if (!isLogin) {
		LoginPop.show({
			Ajax: Ajax,
			loginSuc: function() {
				location.reload();
			}
		});
		return;
	}

	addEvent();

	// initTabs();
	if ($managerList.length > 0) {
		initManagerList();
	} else {
		initPageLoader();
	}
}

function addEvent() {
	$('#J-nopay-list, #J-pay-list').on('click', 'li', showPop);
	$('#J-gen-link').on('click', genLink);
	$('#J-rule-btn').on('click', showRule);
}

function showRule(){
	Alert.show($('#J-rule-tmpl').html());
}

function genLink() {
	var phone = $('#J-phone-num').val();

	if (!phone) {
		Bubble.show('请先输入手机号！');
		return;
	} else if (!/^\d{11}$/.test(phone)) {
		Bubble.show('您输入的手机号格式有误！');
		return;
	}
	new Ajax().send({
		url: '/Activity/Home/makeUrl',
		data: {
			phone: phone
		}
	}, function(result) {
		$('#J-url-text').text(result.url);
	});
}

/**
 * 初始化tab
 * @return {[type]} [description]
 */
// function initTabs() {
// new Tabs({
// 	nav: '.tab-nav li',
// 	content: '.content-item'
// });
// }

/**
 * 初始化分布
 * @return {[type]} [description]
 */
function initPageLoader() {
	var type = Util.getParam('type') || '1';
	var containerId;
	var _tmpl;

	switch (type) {
		case '1':
			containerId = '#J-pay-list';
			_tmpl = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='';
 $.each(list, function(i, item){ 
__p+='\r\n<li tel="'+
((__t=( item.cellphone ))==null?'':__t)+
'" \r\n\t';
 if(item.canChat == 1){ 
__p+='\r\n\tchart-href="/User/Customer/single?touser='+
((__t=( item.customer_id ))==null?'':__t)+
'"\r\n\t';
 } 
__p+='\r\n\t>\r\n\t<div class="img-wrap" \r\n\t';
 if(item.head_sculpture){ 
__p+='\r\n\tstyle="background-image: url('+
((__t=( item.head_sculpture ))==null?'':__t)+
')"\r\n\t';
 } 
__p+='\r\n\t></div>\r\n\t<div class="info">\r\n\t\t<p class="name">'+
((__t=( item.nickname ))==null?'':__t)+
'\r\n\t\t\t';
 if(item.state1 == '1'){ 
__p+='\r\n\t\t\t<span class="state complete">已发奖</span>\r\n\t\t\t';
 }else{ 
__p+='\r\n\t\t\t<span class="state doing">未发奖</span>\r\n\t\t\t';
 } 
__p+='\r\n\t\t</p>\r\n\t\t<p class="time">'+
((__t=( item.create_time ))==null?'':__t)+
'支付</p>\r\n\t</div>\r\n\t<div class="btn-wrap">\r\n\t\t';
 if(item.canChat == 1){ 
__p+='\r\n\t\t<a class="btn-contact">联系他</a>\r\n\t\t';
 }else{ 
__p+='\r\n\t\t<a class="btn-contact disabled">联系他</a>\r\n\t\t';
 } 
__p+='\r\n\t</div>\r\n</li>\r\n';
 }) 
__p+='';
}
return __p;
};
			break;
		case '2':
			containerId = '#J-nopay-list';
			_tmpl = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='';
 $.each(list, function(i, item){ 
__p+='\r\n<li tel="'+
((__t=( item.cellphone ))==null?'':__t)+
'" \r\n\t';
 if(item.canChat == 1){ 
__p+='\r\n\tchart-href="/User/Customer/single?touser='+
((__t=( item.customer_id ))==null?'':__t)+
'"\r\n\t';
 } 
__p+='>\r\n\t<div class="img-wrap" \r\n\t';
 if(item.head_sculpture){ 
__p+='\r\n\tstyle="background-image: url('+
((__t=( item.head_sculpture ))==null?'':__t)+
')"\r\n\t';
 } 
__p+='\r\n\t></div>\r\n\t<div class="info">\r\n\t\t<p class="name">'+
((__t=( item.nickname ))==null?'':__t)+
'\r\n\t\t\t';
 if(item['order_id']){ 
__p+='\r\n\t\t\t<span class="state complete">未支付</span>\r\n\t\t\t';
 }else{ 
__p+='\r\n\t\t\t<span class="state doing">未下单</span>\r\n\t\t\t';
 } 
__p+='\r\n\t\t</p>\r\n\t\t<p class="time">'+
((__t=( item.create_time ))==null?'':__t)+
'</p>\r\n\t</div>\r\n\t<div class="btn-wrap">\r\n\t\t';
 if(item.canChat == 1){ 
__p+='\r\n\t\t<a class="btn-contact">联系他</a>\r\n\t\t';
 }else{ 
__p+='\r\n\t\t<a class="btn-contact disabled">联系他</a>\r\n\t\t';
 } 
__p+='\r\n\t</div>\r\n</li>\r\n';
 }) 
__p+='';
}
return __p;
};
			break;
	}

	new PageLoader({
		container: containerId,
		seeMore: '.see-more',
		pageBegin: 2,
		loading: '.J-more-loading',
		getHtml: function(pageNum, back) {

			new Ajax().send({
				url: '/Activity/Home/purchasedFriends',
				data: {
					page: pageNum,
					type: type
				}
			}, function(result) {
				back && back(_tmpl({
					list: result
				}));

			})

		}
	}).loadEnd(function() {
		Bubble.show('亲，没有更多数据了~');
		$('.see-more').remove();
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
	var _tmpl = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="contact-panel">\r\n\t<div class="title">联系方式</div>\r\n\t<div class="btn-wrap">\r\n\t\t';
 if(chartHref){ 
__p+='\r\n\t\t<a href="'+
((__t=( chartHref ))==null?'':__t)+
'" class="btnl btnl-wx">聊一聊</a>\r\n\t\t';
 } 
__p+='\r\n\t\t<a href="tel:'+
((__t=( tel ))==null?'':__t)+
'" class="btnl btnl-default">打电话</a>\r\n\t\t<a href="sms:'+
((__t=( tel ))==null?'':__t)+
'" class="btnl btnl-default">发短信</a>\r\n\t</div>\r\n</div>';
}
return __p;
};

	$cur.parent().children('.active').removeClass('active');
	$cur.addClass('active');
	Pop.show({
		scroll: true,
		content: _tmpl({
			tel: tel,
			chartHref: chartHref
		})
	})
}

function initManagerList() {
	var _tmpl = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='';
 $.each(list, function(i, item){ 
__p+='\r\n<li>\r\n\t<div class="img-wrap" \r\n\t';
 if(item.head_sculpture){ 
__p+='\r\n\tstyle="background-image: url('+
((__t=( item.head_sculpture ))==null?'':__t)+
')"\r\n\t';
 } 
__p+='\r\n\t></div>\r\n\t<div class="info">\r\n\t\t<p class="name">'+
((__t=( item.nickname ))==null?'':__t)+
'</p>\r\n\t\t<p class="time">'+
((__t=( item.create_time ))==null?'':__t)+
'</p>\r\n\t</div>\r\n\t<div class="amount">推荐<b>'+
((__t=( item.num ))==null?'':__t)+
'</b>人</div>\r\n</li>\r\n';
 }) 
__p+='';
}
return __p;
};

	new PageLoader({
		container: '#J-manager-list',
		seeMore: '.see-more',
		pageBegin: 2,
		loading: '.J-more-loading',
		getHtml: function(pageNum, back) {

			new Ajax().send({
				url: '/Activity/Home/getPartnerData',
				data: {
					page: pageNum
				}
			}, function(result) {
				back && back(_tmpl({
					list: result
				}));

			})

		}
	}).loadEnd(function() {
		Bubble.show('亲，没有更多数据了~');
		$('.see-more').remove();
	});
} 
});