define('index-new2/index', function(require, exports, module){ var $ = require('zepto');
var Swiper = require('common/swiper/index');
var Timer = require('common/timer/timer');
var Ajax = require('common/ajax/index');
var Util = require('common/util/index');
var FixTop = require('common/fix-top/index');

// require('common/gotop/index');

// setTimeout(function(){
// 	new FixTop({
// 		el: '.tab-nav'
// 	});
// }, 100);

new Swiper({
	container: 'banner',
	pager: 'bannerPager'
});


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


/**
 * 初始化购物车
 */
function initCart() {
	new Ajax().send({
		url: '/Mall/Home/cartGoodsNumber'
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

// initCart();

var tmplList = {
	'cut-list.tmpl': function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="section cut-container">\r\n\t<div class="section-title">\r\n\t\t<span>限时限量疯砍中 (每天早10:00上新）</span>\t\r\n\t</div>\r\n\t<ul class="cut-list">\r\n\t\t';
 $.each(list, function(i, item){ 
__p+='\r\n\t\t<li>\r\n\t\t\t<div class="img-wrap" style="background-image: url(/static/images/test/banner.png)"></div>\r\n\t\t\t<p class="item-name">淑女绣花连衣长裙</p>\r\n\t\t\t<div class="item-foot">\r\n\t\t\t\t<div class="price-wrap">\r\n\t\t\t\t\t<span class="price price-low"><label>底价:</label><i>&yen;</i><b>2</b></span>\r\n\t\t\t\t\t<span class="price"><label>原价:</label><i>&yen;</i><b>128.00</b></span>\r\n\t\t\t\t</div>\r\n\t\t\t\t<div class="btn-wrap">\r\n\t\t\t\t\t<a class="btnl">发起砍价>></a>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</li>\r\n\t\t<li class="over">\r\n\t\t\t<div class="img-wrap" style="background-image: url(/static/images/test/banner.png)"></div>\r\n\t\t\t<p class="item-name">淑女绣花连衣长裙</p>\r\n\t\t\t<div class="item-foot">\r\n\t\t\t\t<div class="price-wrap">\r\n\t\t\t\t\t<span class="price price-low"><label>底价:</label><i>&yen;</i><b>2</b></span>\r\n\t\t\t\t\t<span class="price"><label>原价:</label><i>&yen;</i><b>128.00</b></span>\r\n\t\t\t\t</div>\r\n\t\t\t\t<div class="btn-wrap">\r\n\t\t\t\t\t<a class="btnl">发起砍价>></a>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</li>\r\n\t\t';
 }) 
__p+='\r\n\t</ul>\r\n</div>';
}
return __p;
},
	'worth-list.tmpl': function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="section worth-container">\r\n\t<div class="section-title">\r\n\t\t<span>精选单品</span>\r\n\t</div>\r\n\t<ul class="banner-list">\r\n\t\t<li>\r\n\t\t\t<div class="img-wrap" style="background-image:url(/static/images/index-new/test/12.jpg)"></div>\r\n\t\t\t<div class="banner-info clearfix">\r\n\t\t\t\t<span class="qi">2折起</span>\r\n\t\t\t\t<span class="banner-title">海洋基因嫩颜秘诀专场</span>\r\n\t\t\t\t<span class="banner-timer right">剩1天</span>\r\n\t\t\t</div>\r\n\t\t</li>\r\n\t\t<li>\r\n\t\t\t<div class="img-wrap" style="background-image:url(/static/images/index-new/test/2.jpg)"></div>\r\n\t\t\t<div class="banner-info clearfix">\r\n\t\t\t\t<span class="qi">2折起</span>\r\n\t\t\t\t<span class="banner-title">海洋基因嫩颜秘诀专场</span>\r\n\t\t\t\t<span class="banner-timer right">剩1天</span>\r\n\t\t\t</div>\r\n\t\t</li>\r\n\t\t<li>\r\n\t\t\t<div class="img-wrap" style="background-image:url(/static/images/index-new/test/10.jpg)"></div>\r\n\t\t\t<div class="banner-info clearfix">\r\n\t\t\t\t<span class="qi">2折起</span>\r\n\t\t\t\t<span class="banner-title">海洋基因嫩颜秘诀专场</span>\r\n\t\t\t\t<span class="banner-timer right">剩1天</span>\r\n\t\t\t</div>\r\n\t\t</li>\r\n\t\t<li>\r\n\t\t\t<div class="img-wrap" style="background-image:url(/static/images/index-new/test/11.jpg)"></div>\r\n\t\t\t<div class="banner-info clearfix">\r\n\t\t\t\t<span class="qi">2折起</span>\r\n\t\t\t\t<span class="banner-title">海洋基因嫩颜秘诀专场</span>\r\n\t\t\t\t<span class="banner-timer right">剩1天</span>\r\n\t\t\t</div>\r\n\t\t</li>\r\n\t\t<li>\r\n\t\t\t<div class="img-wrap" style="background-image:url(/static/images/index-new/test/1.jpg)"></div>\r\n\t\t\t<div class="banner-info clearfix">\r\n\t\t\t\t<span class="qi">2折起</span>\r\n\t\t\t\t<span class="banner-title">海洋基因嫩颜秘诀专场</span>\r\n\t\t\t\t<span class="banner-timer right">剩1天</span>\r\n\t\t\t</div>\r\n\t\t</li>\r\n\t\t<li>\r\n\t\t\t<div class="img-wrap" style="background-image:url(/static/images/index-new/test/13.jpg)"></div>\r\n\t\t\t<div class="banner-info clearfix">\r\n\t\t\t\t<span class="qi">2折起</span>\r\n\t\t\t\t<span class="banner-title">海洋基因嫩颜秘诀专场</span>\r\n\t\t\t\t<span class="banner-timer right">剩1天</span>\r\n\t\t\t</div>\r\n\t\t</li>\r\n\t\t<!-- <li>\r\n\t\t\t<div class="img-wrap" style="background-image:url(/static/images/index-new/test/14.jpg)"></div>\r\n\t\t\t<div class="banner-info clearfix">\r\n\t\t\t\t<span class="qi">2折起</span>\r\n\t\t\t\t<span class="banner-title">海洋基因嫩颜秘诀专场</span>\r\n\t\t\t\t<span class="banner-timer right">剩1天</span>\r\n\t\t\t</div>\r\n\t\t</li> -->\r\n\t\t<li>\r\n\t\t\t<div class="img-wrap" style="background-image:url(/static/images/index-new/test/15.jpg)"></div>\r\n\t\t\t<div class="banner-info clearfix">\r\n\t\t\t\t<span class="qi">2折起</span>\r\n\t\t\t\t<span class="banner-title">海洋基因嫩颜秘诀专场</span>\r\n\t\t\t\t<span class="banner-timer right">剩1天</span>\r\n\t\t\t</div>\r\n\t\t</li>\r\n\t</ul>\r\n</div>';
}
return __p;
},
	'overseas.tmpl': function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="section worth-container">\r\n\t<div class="section-title">\r\n\t\t<span>全球精选</span>\r\n\t</div>\r\n\t<ul class="banner-list">\r\n\t\t<li>\r\n\t\t\t<div class="img-wrap" style="background-image:url(/static/images/index-new/test/3.jpg)"></div>\r\n\t\t\t<div class="banner-info clearfix">\r\n\t\t\t\t<span class="banner-title">海洋基因嫩颜秘诀专场</span>\r\n\t\t\t\t<span class="price right"><i>&yen;</i><b>298.00</b></span>\r\n\t\t\t</div>\r\n\t\t</li>\r\n\t\t<li>\r\n\t\t\t<div class="img-wrap" style="background-image:url(/static/images/index-new/test/4.jpg)"></div>\r\n\t\t\t<div class="banner-info clearfix">\r\n\t\t\t\t<span class="banner-title">海洋基因嫩颜秘诀专场</span>\r\n\t\t\t\t<span class="price right"><i>&yen;</i><b>298.00</b></span>\r\n\t\t\t</div>\r\n\t\t</li>\r\n\t\t<li>\r\n\t\t\t<div class="img-wrap" style="background-image:url(/static/images/index-new/test/5.jpg)"></div>\r\n\t\t\t<div class="banner-info clearfix">\r\n\t\t\t\t<span class="banner-title">海洋基因嫩颜秘诀专场</span>\r\n\t\t\t\t<span class="price right"><i>&yen;</i><b>298.00</b></span>\r\n\t\t\t</div>\r\n\t\t</li>\r\n\t\t<li>\r\n\t\t\t<div class="img-wrap" style="background-image:url(/static/images/index-new/test/6.jpg)"></div>\r\n\t\t\t<div class="banner-info clearfix">\r\n\t\t\t\t<span class="banner-title">海洋基因嫩颜秘诀专场</span>\r\n\t\t\t\t<span class="price right"><i>&yen;</i><b>298.00</b></span>\r\n\t\t\t</div>\r\n\t\t</li>\r\n\t\t<li>\r\n\t\t\t<div class="img-wrap" style="background-image:url(/static/images/index-new/test/7.jpg)"></div>\r\n\t\t\t<div class="banner-info clearfix">\r\n\t\t\t\t<span class="banner-title">海洋基因嫩颜秘诀专场</span>\r\n\t\t\t\t<span class="price right"><i>&yen;</i><b>298.00</b></span>\r\n\t\t\t</div>\r\n\t\t</li>\r\n\t\t<li>\r\n\t\t\t<div class="img-wrap" style="background-image:url(/static/images/index-new/test/8.jpg)"></div>\r\n\t\t\t<div class="banner-info clearfix">\r\n\t\t\t\t<span class="banner-title">海洋基因嫩颜秘诀专场</span>\r\n\t\t\t\t<span class="price right"><i>&yen;</i><b>298.00</b></span>\r\n\t\t\t</div>\r\n\t\t</li>\r\n\t\t<li>\r\n\t\t\t<div class="img-wrap" style="background-image:url(/static/images/index-new/test/9.jpg)"></div>\r\n\t\t\t<div class="banner-info clearfix">\r\n\t\t\t\t<span class="banner-title">海洋基因嫩颜秘诀专场</span>\r\n\t\t\t\t<span class="price right"><i>&yen;</i><b>298.00</b></span>\r\n\t\t\t</div>\r\n\t\t</li>\r\n\t</ul>\r\n</div>';
}
return __p;
},
	'hot-list.tmpl': function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="hot-container">\r\n\t<ul class="tj-types">\r\n\t\t<li>\r\n\t\t\t<a>\r\n\t\t\t\t<i class="icon"></i><label>食品</label>\r\n\t\t\t</a>\r\n\t\t</li>\r\n\t\t<li>\r\n\t\t\t<a>\r\n\t\t\t\t<i class="icon"></i><label>保健</label>\r\n\t\t\t</a>\r\n\t\t</li>\r\n\t\t<li>\r\n\t\t\t<a>\r\n\t\t\t\t<i class="icon"></i><label>美妆</label>\r\n\t\t\t</a>\r\n\t\t</li>\r\n\t\t<li>\r\n\t\t\t<a>\r\n\t\t\t\t<i class="icon"></i><label>母婴</label>\r\n\t\t\t</a>\r\n\t\t</li>\r\n\t\t<li>\r\n\t\t\t<a>\r\n\t\t\t\t<i class="icon"></i><label>居家</label>\r\n\t\t\t</a>\r\n\t\t</li>\r\n\t</ul>\r\n\t<div class="section">\r\n\t\t<div class="section-title">\r\n\t\t\t<span>热销宝贝</span>\r\n\t\t</div>\r\n\t\t<div class="temai-list dib-wrap">\r\n\t\t\t<div class="temai-item dib">\r\n\t\t\t\t<a>\r\n\t\t\t\t\t<div class="img-wrap" style="background-image: url(/static/images/test/goods.png)"></div>\r\n\t\t\t\t\t<div class="item-info">\r\n\t\t\t\t\t\t<div class="item-title">clinique超值润肤水1clinique超值润肤水1</div>\r\n\t\t\t\t\t\t<div class="item-price">\r\n\t\t\t\t\t\t\t<span class="price">&yen; 253.00</span>\r\n\t\t\t\t\t\t\t<label class="discount">7.8折</label>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</a>\r\n\t\t\t</div>\r\n\t\t\t<div class="temai-item dib">\r\n\t\t\t\t<a>\r\n\t\t\t\t\t<div class="img-wrap" style="background-image: url(/static/images/test/goods.png)"></div>\r\n\t\t\t\t\t<div class="item-info">\r\n\t\t\t\t\t\t<div class="item-title">clinique超值润肤水1clinique超值润肤水1</div>\r\n\t\t\t\t\t\t<div class="item-price">\r\n\t\t\t\t\t\t\t<span class="price">&yen; 253.00</span>\r\n\t\t\t\t\t\t\t<label class="discount">7.8折</label>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</a>\r\n\t\t\t</div>\r\n\t\t\t<div class="temai-item dib">\r\n\t\t\t\t<a>\r\n\t\t\t\t\t<div class="img-wrap" style="background-image: url(/static/images/test/goods.png)"></div>\r\n\t\t\t\t\t<div class="item-info">\r\n\t\t\t\t\t\t<div class="item-title">clinique超值润肤水1clinique超值润肤水1</div>\r\n\t\t\t\t\t\t<div class="item-price">\r\n\t\t\t\t\t\t\t<span class="price">&yen; 253.00</span>\r\n\t\t\t\t\t\t\t<label class="discount">7.8折</label>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</a>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n';
}
return __p;
}
};

var $navList = $('.tab-nav a[tmpl-href]');
var $tabContainer = $('.tab-container');

init();

function init() {
	initNav();
	addEvent();
}

function addEvent() {
	$navList.on('click', switchNav);
}

/**
 * 初始化导航
 */
function initNav() {
	switchNav('init');
}

/**
 * 导航切换
 */
function switchNav(isInit) {
	var $nav = isInit === 'init' ? $navList.eq(0) : $(this);
	var tmplHref = $nav.attr('tmpl-href');
	var htmlTmpl = tmplList[tmplHref]({
		list: [1, 2, 3, 4, 5]
	});

	$nav.parent().siblings('.active').removeClass('active');
	$nav.parent().addClass('active');
	$tabContainer.html(htmlTmpl);
} 
});