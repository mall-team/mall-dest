define('partner-list/index', function(require, exports, module){ var $ = require('zepto');
var Ajax = require('common/ajax/index');
var Alert = require('common/alert/alert');

var _tmplList = {
	tmpl1: function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='';
 if(list.length > 0){ 
__p+='\r\n<ul class="partner-list">\r\n';
 $.each(list, function(i, item){ 
__p+='\r\n\t<li class="middle">\r\n\t\t<div class="img-wrap" \r\n\t\t';
 if(item.head_sculpture){ 
__p+='\r\n\t\tstyle="background-image: url('+
((__t=( item.head_sculpture ))==null?'':__t)+
')"\r\n\t\t';
 } 
__p+='\r\n\t\t></div>\r\n\t\t<div class="info">\r\n\t\t\t<p class="name">'+
((__t=( item.nickname ))==null?'':__t)+
'</p>\r\n\t\t</div>\r\n\t\t<p class="date">'+
((__t=( item.create_time ))==null?'':__t)+
'</p>\r\n\t</li>\r\n';
 }) 
__p+='\r\n</ul>\r\n';
 } 
__p+='';
}
return __p;
},
	tmpl2: function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='';
 if(list.length > 0){ 
__p+='\r\n<ul class="partner-list">\r\n';
 $.each(list, function(i, item){ 
__p+='\r\n\t<li>\r\n\t\t<div class="img-wrap" \r\n\t\t';
 if(item.head_sculpture){ 
__p+='\r\n\t\tstyle="background-image: url('+
((__t=( item.head_sculpture ))==null?'':__t)+
')"\r\n\t\t';
 } 
__p+='\r\n\t\t></div>\r\n\t\t<div class="info">\r\n\t\t\t<p class="name">'+
((__t=( item.nickname ))==null?'':__t)+
'</p>\r\n\t\t\t<p class="des">贡献了<b>'+
((__t=( item.orderCount ))==null?'':__t)+
'</b>单</p>\r\n\t\t</div>\r\n\t\t<p class="date">'+
((__t=( item.create_time ))==null?'':__t)+
'</p>\r\n\t</li>\r\n';
 }) 
__p+='\r\n</ul>\r\n';
 } 
__p+='';
}
return __p;
}
};

var pageTy = 1; //1.我的引荐 2.小伙伴定单
var dayTy = 1; //1.今天2.昨天


init();

function init() {
	addEvent();

	rendTj();
	rendList();
}

function addEvent() {
	$('.tab-nav').on('click', 'li', pageSwitch);
	$('.partner-nav').on('click', 'li', daySwitch);
	$('#J-rule').on('click', showRule);
}

function showRule() {
	var html = '';

	if (pageTy == 1) {
		html = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="partner-rule">\r\n\t<section>\r\n\t\t<p>从2015年11月1日起，启动社群管理办法。针对社群管理，现对社群招商和销售订单做如下激励政策。</p>\r\n\t\t<p>引荐冠军奖励，社群中的会员引荐其他人注册到自己所在社群店主名下，成为会员，并引荐到所在群中，注册并引荐人数是所在群最多的会员将获得淘金子总部颁发的<b>666元现金</b>奖励。</p>\r\n\t</section>\r\n\t<section>\r\n\t\t<p>获取奖金条件：</p>\r\n\t\t<ul>\r\n\t\t\t<li>1.引荐的小伙伴必须成为所在淘金子社群店主的会员；</li>\r\n\t\t\t<li>2.引荐的小伙伴必须进入社群；</li>\r\n\t\t\t<li>3.在所在群中引荐人数最多的会员获得此奖。</li>\r\n\t\t</ul>\r\n\t</section>\r\n\t<section>\r\n\t\t<p>发奖时间：每晚21点30分</p>\r\n\t\t<p>发奖形式：发放到获奖者淘金子账户中</p>\r\n\t\t<p>活动时间：2015年11月1日至2015年11月4日</p>\r\n\t</section>\r\n</div>';
}
return __p;
}();
	} else {
		html = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="partner-rule">\r\n\t<section>\r\n\t\t<p>销售冠军奖励，社群会员引荐进来的小伙伴产生购买订单（包括自己购买的订单），订单数是所在群中最多的会员奖获得淘金子总部颁发的<b>666元现金</b>奖励。</p>\r\n\t</section>\r\n\t<section>\r\n\t\t<p>获取奖金条件：</p>\r\n\t\t<ul>\r\n\t\t\t<li>1.必须是自己和自己引荐的小伙伴产生的订单才视为有效订单；</li>\r\n\t\t\t<li>2.在所在群中订单数最多的会员获得此奖</li>\r\n\t\t</ul>\r\n\t</section>\r\n\t<section>\r\n\t\t<p>发奖时间：每晚21点30分</p>\r\n\t\t<p>发奖形式：发放到获奖者淘金子账户中</p>\r\n\t\t<p>活动时间：2015年11月1日至2015年11月4日</p>\r\n\t</section>\r\n</div>';
}
return __p;
}();
	}

	Alert.show(html);
}

/**
 * 切换页面
 * @return {[type]} [description]
 */
function pageSwitch() {
	var $cur = $(this);
	var pTy = +$cur.attr('type');

	if (pageTy == pTy) {
		return false;
	}
	pageTy = pTy;
	dayTy = 1;

	$cur.siblings('.active').removeClass('active');
	$cur.addClass('active');

	rendTj(function() {
		rendList(function() {
			$('.partner-nav li').removeClass('active');
			$('.partner-nav li').eq(0).addClass('active');
		});
	});
}

/**
 * 切换日期
 * @return {[type]} [description]
 */
function daySwitch() {
	var $cur = $(this);
	var dTy = +$cur.attr('type');

	if (dayTy == dTy) {
		return false;
	}
	dayTy = dTy;
	rendList(function() {
		$cur.siblings('.active').removeClass('active');
		$cur.addClass('active');
	});
}

/**
 * 渲染统计信息
 * @return {[type]} [description]
 */
function rendTj(back) {
	new Ajax().send({
		url: '/User/Center/myRecommendTotalInfo',
		data: {
			pageType: pageTy
		}
	}, function(result) {
		$('#J-t-num').text(result.data.todayNum);
		$('#J-y-num').text(result.data.yestNum);
		$('#J-t-key').text('今日' + (pageTy == 1 ? '引荐人数' : '订单数'));
		$('#J-y-key').text('昨日' + (pageTy == 1 ? '引荐人数' : '订单数'));

		back && back();
	});
}

/**
 * 渲染列表
 * @return {[type]} [description]
 */
function rendList(back) {
	new Ajax().send({
		url: '/User/Center/myRecommendInfo',
		data: {
			pageType: pageTy,
			dayType: dayTy
		}
	}, function(result) {
		var list = result.data || [];

		$('#J-container-list').html(_tmplList['tmpl' + pageTy]({
			list: list
		}));

		back && back();
	});
} 
});