define('index-new/index', function(require, exports, module){ var $ = require('zepto');
require('extend/lazyload');
require('common/gold/index');
var Swiper = require('common/swiper/index');
// require('common/gotop/index');
var Timer = require('common/timer/timer');
var Ajax = require('common/ajax/index');
var Util = require('common/util/index');
var Alert = require('common/alert/alert');
// var KljAlert = require('klj/klj-alert/index');
var CartAni = require('common/cart-ani/index');
var Nav = require('common/nav/index');

require('search-panel/index');
require('common/gotop/index');

init();

function init() {
	sessionStorage.clear();

	new Swiper({
		container: 'banner',
		pager: 'bannerPager'
	});
	// isKlj();
	initTimer();
	lazyLoadImg();
	initImgLoader();
	initMiao();
	initNy();
	Nav.initCart();

	$('.J-add-cart').on('click', addCart);
	window.addCart = addCart;
}

function lazyLoadImg() {
	$("[data-original]").lazyload({
		placeholderClass: 'placeholder',
		effect: 'fadeIn',
		threshold: 1500
	});
}

/**
 * 初始化元旦特卖
 * @return {[type]} [description]
 */
function initNy() {
	$('#J-ny-nav>span').on('click', selNy);
	$('#J-ny-list').on('click', '.ready-btn', remindNy);
	initNyTimer();
}

/**
 * 切换元旦特卖时间点
 * @return {[type]} [description]
 */
function selNy() {
	var $cur = $(this);
	var tmpl = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='';
 $.each(list, function(i, item){ 
__p+='\r\n<li act-id="'+
((__t=( item.id ))==null?'':__t)+
'">\r\n\t<a href="/Mall/Goods/detail?g='+
((__t=( item['goodsInfo']['product_id'] ))==null?'':__t)+
'&spe=1&act_id='+
((__t=( item.id ))==null?'':__t)+
'">\r\n\t\t<div class="img-wrap" style="background-image:url('+
((__t=( item.image_url ))==null?'':__t)+
')">\r\n\t\t\t';
 if(+item['goodsInfo']['product_number'] <= 0){ 
__p+='\r\n\t\t\t<div class="empty"></div>\r\n\t\t\t';
 } 
__p+='\r\n\t\t\t';
 if(!activityAlreadyStart && item.remainTime){ 
__p+='\r\n\t\t\t<div class="ready-tip">\r\n\t\t\t\t<p>距离开抢</p>\r\n\t\t\t\t<p class="J-miao-timer" timer="'+
((__t=( item.remainTime ))==null?'':__t)+
'"></p>\r\n\t\t\t\t';
 if(item.subscribe == 1){ 
__p+='\r\n\t\t\t\t<button class="ready-btn active"><i class="icon-ling"></i><label>已订阅</label></button>\r\n\t\t\t\t';
 }else{ 
__p+='\r\n\t\t\t\t<button class="ready-btn"><i class="icon-ling"></i><label>开抢提醒</label></button>\r\n\t\t\t\t';
 } 
__p+='\r\n\t\t\t</div>\r\n\t\t\t';
 } 
__p+='\r\n\t\t</div>\r\n\t\t<div class="banner-info clearfix">\r\n\t\t\t';
 if(item['goodsInfo']['discount']){ 
__p+='\r\n\t\t\t<span class="qi">'+
((__t=( item['goodsInfo']['discount'] ))==null?'':__t)+
'折</span>\r\n\t\t\t';
 } 
__p+='\r\n\t\t\t<span class="banner-title">'+
((__t=( item.title ))==null?'':__t)+
'</span>\r\n\t\t\t';
 if(activityAlreadyStart){ 
__p+='\r\n\t\t\t<span class="banner-timer right" timer="21100">剩'+
((__t=( item.remainTime ))==null?'':__t)+
'</span>\r\n\t\t\t';
 } 
__p+='\r\n\t\t</div>\r\n\t</a>\r\n</li>\r\n';
 }) 
__p+='';
}
return __p;
};

	new Ajax().send({
		url: '/Mall/Activity/newYearSpeActivity',
		data: {
			type: $cur.attr('type')
		}
	}, function(result) {

		$cur.siblings('.active').removeClass('active');
		$cur.addClass('active');
		$('#J-ny-list').html(tmpl(result));

		initNyTimer();

	});
}

/**
 * 初始化秒杀倒计时
 * @return {[type]} [description]
 */
function initNyTimer() {
	$('#J-ny-list .J-miao-timer').each(function(i, el) {
		new Timer(el, 'time').start().end(function() {});
	});
}

/**
 * 订阅提醒
 * @return {[type]} [description]
 */
function remindNy(evt) {
	evt.preventDefault();

	var $cur = $(this);
	var id = $cur.parents('li').attr('act-id');

	new Ajax().send({
		url: '/Mall/Activity/subscribeSpe',
		data: {
			id: id
		}
	}, function(result) {
		if (result.subscribed) { //已关注
			$cur.addClass('active').find('label').text('已订阅');
		} else { //未关注
			Alert.show(function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="qrcode-panel">\r\n\t<h3>关注公众号获得秒杀提醒</h3>\r\n\t<div class="img-erwei">\r\n\t\t<img src="http://cdn.taojinzi.com/static/images/erwei_51bd0ae.png" />\r\n\t\t<!-- <div class="logo"><img src="/static/images/logo.png" /></div> -->\r\n\t</div>\r\n\t<p class="tip">长按二维码，扫描关注</p>\r\n</div>';
}
return __p;
}(), true, 'alert-qrcode-alert');
		}
	});

}


/**
 * 初始化秒杀
 * @return {[type]} [description]
 */
function initMiao() {
	$('#J-miao-nav').on('click', 'span', selMiao);
	$('#J-miao-list').on('click', '.ready-btn', remind);
	initMiaoTimer();
}

/**
 * 切换秒杀时间点
 * @return {[type]} [description]
 */
function selMiao() {
	var $cur = $(this);
	var tmpl = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='';
 $.each(list, function(i, item){ 
__p+='\r\n<div class="temai-item dib">\r\n\t<a href="/mall/Goods/detail?goodsId='+
((__t=( item['goods_id'] ))==null?'':__t)+
'">\r\n\t\t<div class="img-wrap" style="background-image: url('+
((__t=( item.image_url ))==null?'':__t)+
')">\r\n\t\t\t';
 if(item.soldout == 1){ 
__p+='\r\n\t\t\t<div class="empty"></div>\r\n\t\t\t';
 }else if(item.leftTime > 0){ 
__p+='\r\n\t\t\t<div class="ready-tip">\r\n\t\t\t\t<p>距离开抢</p>\r\n\t\t\t\t<p class="J-miao-timer" timer="'+
((__t=( item.leftTime ))==null?'':__t)+
'"></p>\r\n\t\t\t</div>\r\n\t\t\t';
 } 
__p+='\r\n\t\t</div>\r\n\t\t<div class="item-info">\r\n\t\t\t<div class="item-title">'+
((__t=( item.name ))==null?'':__t)+
'</div>\r\n\t\t\t<div class="item-price">\r\n\t\t\t\t<span class="price">&yen; '+
((__t=( item.sale_price ))==null?'':__t)+
'</span>\r\n\t\t\t\t<a class="btn-sm" ';
 if(item.start == 1){ 
__p+=' onclick="addCart(event)" ';
 } 
__p+=' goods-id="'+
((__t=( item.goods_id ))==null?'':__t)+
'"></a>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</a>\r\n</div>\r\n';
 }) 
__p+='';
}
return __p;
};

	new Ajax().send({
		url: $('#J-ajaxurl-miaoList').val(),
		data: {
			hour: $cur.text().split(':')[0]
		}
	}, function(result) {

		$cur.siblings('.active').removeClass('active');
		$cur.addClass('active');
		$('#J-miao-list').html(tmpl(result));

		initMiaoTimer();

	});
}

/**
 * 初始化秒杀倒计时
 * @return {[type]} [description]
 */
function initMiaoTimer() {
	$('#J-miao-list .J-miao-timer').each(function(i, el) {
		new Timer(el, 'time').start().end(function() {});
	});
}

/**
 * 订阅提醒
 * @return {[type]} [description]
 */
function remind(evt) {
	evt.preventDefault();

	var $cur = $(this);
	var id = $cur.parents('li').attr('act-id');

	new Ajax().send({
		url: '/Mall/Activity/subscribeMiaoSha',
		data: {
			id: id
		}
	}, function(result) {
		if (result.subscribed) { //已关注
			$cur.addClass('active').find('label').text('已订阅');
		} else { //未关注
			Alert.show(function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="qrcode-panel">\r\n\t<h3>关注公众号获得秒杀提醒</h3>\r\n\t<div class="img-erwei">\r\n\t\t<img src="http://cdn.taojinzi.com/static/images/erwei_51bd0ae.png" />\r\n\t\t<!-- <div class="logo"><img src="/static/images/logo.png" /></div> -->\r\n\t</div>\r\n\t<p class="tip">长按二维码，扫描关注</p>\r\n</div>';
}
return __p;
}(), true, 'alert-qrcode-alert');
		}
	});

}


/**
 * 是否弹出可丽金浮层
 * @return {Boolean} [description]
 */
function isKlj() {

	KljAlert.render();

}

/**
 * 初始化定时器
 * @return {[type]} [description]
 */
function initTimer() {
	Util.phpdataReady(function(phpdata) {
		if (phpdata.subscribe == 0) {
			$('.atten-panel').css('display', 'block');
		}

		//全民砍价 倒计时
		new Timer('#J-cut-timer', function(time) {
			var hour = parseInt(time / 3600, 10);
			var min = parseInt((time - hour * 3600) / 60);
			var sec = time - hour * 3600 - min * 60;

			return '<span><b>' + Timer.addZero(hour) + '</b></span><i>:</i><span><b>' + Timer.addZero(min) + '</b></span><i>:</i><span><b>' + Timer.addZero(sec) + '</b></span>';
		}).start();

		$('.J-timer').each(function(i, el) {
			new Timer(el, 'time').start().end(function() {
				// location.reload();
			});
		});


	});
}

/**
 * 添加到购物车
 */
function addCart(evt) {
	evt.preventDefault();
	evt.stopPropagation();

	var $cur = $(evt.target);
	var goodsId = $cur.attr('goods-id');

	new Ajax().send({
		url: $('#J-ajaxurl-addCart').val(),
		type: 'post',
		data: {
			goodsId: goodsId,
		}
	}, function() {
		new CartAni($cur.parent().parent().parent().find('.img-wrap'), $('.gift')).fly(function() {
			Nav.initCart();
		});
	});
}

/**
 * 初始化图片异步加载
 * @return {[type]} [description]
 */
function initImgLoader() {
	window.onload = function() {
		var $bgDoms = $('[tjz-bgimg]');

		$bgDoms.each(function(i, item) {
			var $bgDom = $(item);
			var url = $bgDom.attr('tjz-bgimg');

			if (url) {
				loadImg(url, item);
			}

		});


		function loadImg(url, dom) {
			var img = new Image();

			img.src = url;
			if (img.complete) {
				rendDom();
				return;
			}
			img.onload = function() {
				rendDom();
			}

			function rendDom() {
				$(dom).css('background-image', 'url(' + url + ')');
			}

		}
	};
} 
});