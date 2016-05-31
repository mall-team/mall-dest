define('goods-list/index', function(require, exports, module){ var _ = require('underscore');
var $ = require('zepto');

var Util = require('common/util/index');
var Ajax = require('common/ajax/index');
var Config = require('common/config/index');
var PageLoader = require('common/page-loader/index');
var Bubble = require('common/bubble/bubble');
var Timer = require('common/timer/timer');
var FixTop = require('common/fix-top/index');
var Swiper = require('common/swiper/index');

require('common/gotop/index');
require('search-panel/index');

new PageLoader({
	container: '#J-goods-list',
	pageBegin: 2,
	scrollKey: location.pathname + location.search,
	getHtml: function(pageNum, back) {
		new Ajax().send({
			url: ($('#J-ajax-url').val()),
			data: {
				order: Util.getParam('order'),
				type: Util.getParam('type'),
				page: pageNum,
				key: decodeURIComponent(Util.getParam('key'))
			}
		}, function(result) {
			back && back(function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='';
 _.each(list, function(item){  
__p+='\r\n<div class="goods">\r\n\t<a href="/mall/Goods/detail?goodsId='+
((__t=( item.goodsId ))==null?'':__t)+
'">\r\n\t\t<div class="img-wrap" style="background-image: url('+
((__t=( item.imageUrl ))==null?'':__t)+
')"></div>\r\n\t\t<div class="goods-title">'+
((__t=( item.name ))==null?'':__t)+
'</div>\r\n\t\t<div class="clearfix">\r\n\t\t\t<label class="price"><i>&yen;</i><b>'+
((__t=( item.salePrice ))==null?'':__t)+
'</b></label>\r\n\t\t\t<a class="btn-sm J-add-cart" goods-id="'+
((__t=( item.goodsId ))==null?'':__t)+
'"></a>\r\n\t\t</div>\r\n\t</a>\r\n</div>\r\n';
 }) 
__p+='';
}
return __p;
}({
				list: result.goodsList
			}));
		});


	}
}).loadEnd(function() {
	Bubble.show('亲，没有更多商品了~');
});

$('[timer]').each(function(i, el) {

	new Timer(el, function(time) {
		var hour = parseInt(time / 3600, 10);
		var min = parseInt((time - hour * 3600) / 60);
		var sec = time - hour * 3600 - min * 60;
		var day = parseInt(hour / 24);

		hour = hour - day * 24;

		return (day ? (Timer.addZero(day) + '天') : '') + Timer.addZero(hour) + ':' + Timer.addZero(min) + ':' + Timer.addZero(sec);

	}).start();

});


new FixTop({
	el: '.goods-order'
});


init();

function init() {
	initCat();
	addEvt();
	initCart();
	initImgLoader();

	new Swiper({
		container: 'banner',
		pager: 'bannerPager'
	});
}

/**
 * 初始化二级分类
 * @return {[type]} [description]
 */
function initCat() {
	var $catList = $('#J-cat-list');

	$('#J-cat-btn').on('touchstart', function(e) {
		e.stopPropagation();
	}).on('click', function() {
		$catList.toggle();
	});
	$(document.body).on('touchstart', function() {
		$catList.hide();
	});
	$catList.on('touchstart', function(e) {
		e.stopPropagation();
		sessionStorage.clear();
	});
}


function addEvt() {
	$('#J-goods-list').on('click', '.J-add-cart', addCart);
}

/**
 * 初始化购物车
 */
function initCart() {
	new Ajax().send({
		url: $('#J-ajaxurl-initCart').val()
	}, function(result) {
		var num = +result.number;
		var $cart = $('.cart');
		var $cartNum = $('.cart > i');

		if (num > 0) {
			$cart.css('display', 'block');
			$cartNum.text(num);
		}
	});
}

/**
 * 添加到购物车
 */
function addCart() {
	var $cur = $(this);
	var goodsId = $cur.attr('goods-id');

	new Ajax().send({
		url: $('#J-ajaxurl-addCart').val(),
		type: 'post',
		data: {
			goodsId: goodsId,
		}
	}, function() {
		initCart();
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