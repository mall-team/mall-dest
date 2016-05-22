define('score/index', function(require, exports, module){ var $ = require('zepto');
var Tabs = require('common/tabs/index');
var Ajax = require('common/ajax/index');
var PageLoader = require('common/page-loader/index');
var FixTop = require('common/fix-top/index');
var Bubble = require('common/bubble/bubble');
var Copyright = require('common/copyright/index');
var Alert = require('common/alert/alert');

$('#J-score-rule').on('click', showRule);

new FixTop({
	el: '.wallet-detail .nav'
});

new Tabs({
	nav: '.nav li',
	content: '.detail-list',
	switchBack: function(){
		Copyright.reset();
	}
});

Copyright.reset();

new PageLoader({
	container: '#J-bill-all',
	pageBegin: 2,
	getHtml: function(pageNum, back) {

		new Ajax().send({
			url: '/User/Center/scoreList',
			data: {
				page: pageNum
			}
		}, function(result) {
			back && back(function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='';
 $.each(list, function(i, item){ 
__p+='\r\n<li>\r\n\t<span class="title">'+
((__t=( item.remark ))==null?'':__t)+
'</span>\r\n\t<span class="price ';
 if(item.payment_type==1){ 
__p+='income';
 } 
__p+='">'+
((__t=( item.score ))==null?'':__t)+
'</span>\r\n\t<span class="date">'+
((__t=( item.create_time ))==null?'':__t)+
'</span>\r\n</li>\r\n';
 }) 
__p+='';
}
return __p;
}({
				list: result.data
			}));

			Copyright.reset();
		})

	}
}).loadEnd(function() {
	Bubble.show('亲，没有更多钱包数据了~');
});

new PageLoader({
	container: '#J-bill-out',
	pageBegin: 2,
	getHtml: function(pageNum, back) {

		new Ajax().send({
			url: '/User/Center/scoreList',
			data: {
				page: pageNum,
				type: 2
			}
		}, function(result) {
			back && back(function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='';
 $.each(list, function(i, item){ 
__p+='\r\n<li>\r\n\t<span class="title">'+
((__t=( item.remark ))==null?'':__t)+
'</span>\r\n\t<span class="price ';
 if(item.payment_type==1){ 
__p+='income';
 } 
__p+='">'+
((__t=( item.score ))==null?'':__t)+
'</span>\r\n\t<span class="date">'+
((__t=( item.create_time ))==null?'':__t)+
'</span>\r\n</li>\r\n';
 }) 
__p+='';
}
return __p;
}({
				list: result.data
			}));
			Copyright.reset();
		})

	}
}).loadEnd(function() {
	Bubble.show('亲，没有更多钱包数据了~');
});

new PageLoader({
	container: '#J-bill-in',
	pageBegin: 2,
	getHtml: function(pageNum, back) {

		new Ajax().send({
			url: '/User/Center/scoreList',
			data: {
				page: pageNum,
				type: 1
			}
		}, function(result) {
			back && back(function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='';
 $.each(list, function(i, item){ 
__p+='\r\n<li>\r\n\t<span class="title">'+
((__t=( item.remark ))==null?'':__t)+
'</span>\r\n\t<span class="price ';
 if(item.payment_type==1){ 
__p+='income';
 } 
__p+='">'+
((__t=( item.score ))==null?'':__t)+
'</span>\r\n\t<span class="date">'+
((__t=( item.create_time ))==null?'':__t)+
'</span>\r\n</li>\r\n';
 }) 
__p+='';
}
return __p;
}({
				list: result.data
			}));
			Copyright.reset();
		})

	}
}).loadEnd(function() {
	Bubble.show('亲，没有更多钱包数据了~');
});

/**
 * 显示积分规则
 * @return {[type]} [description]
 */
function showRule(){
	Alert.show(function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="score-rule-alert">\r\n\t<h3>积分获取规则：</h3>\r\n\t<ul>\r\n\t\t<li>1、每日分享获得积分，1次分享2分  当日多次分享不再记分</li>\r\n\t\t<li>2、签到完成获得积分，1次签到1分  当日多次签到不再记分</li>\r\n\t\t<li>3、订单完成获得积分，1元获得1分</li>\r\n\t\t<li>4、评论完成获得积分，1次评论5分</li>\r\n\t</ul>\r\n</div>';
}
return __p;
}(), true, 'score-rule-alert');
}


function formatDate(time) {
	var date = new Date(time);
	return _addZero(date.getMonth() + 1) + '-' + _addZero(date.getDate()) + ' ' + _addZero(date.getHours()) + ':' + _addZero(date.getMinutes());
}

function _addZero(num) {
	if (num.toString().length == 1) {
		num = '0' + num;
	}
	return num;
} 
});