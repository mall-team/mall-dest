define('common/copyright/index', function(require, exports, module){ var $ = require('zepto');

var _tmpl = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div id="copyright">大泽商城&nbsp;提供技术支持</div>';
}
return __p;
};
var HEI = 64; //组件高度

var $body = $(document.body);
var $win = $(window);
var $copyright;


function render() {
	if ($('#copyright').length > 0 || $('.copyright').length > 0) {
		return;
	}

	var noCr = $body.attr('no-copyright'); //是否不显示copyright
	if (noCr == 1) {
		return;
	}

	$body.append($(_tmpl()));
	$copyright = $('#copyright');

	reset();
}

function reset() {
	var bh = $body.height();
	var wh = $win.height();

	if (bh + HEI < wh) { //页面不满
		$body.css({
			'min-height': wh + 'px',
			'position': 'relative'
		});
		$copyright.css({
			'position': 'absolute',
			'width': '100%',
			'bottom': $body.css('padding-bottom')
		});
	} else {
		$copyright.css({
			'position': 'static',
			'width': 'auto'
		})
	}
}

module.exports = {
	render: render,
	reset: reset
}; 
});
;define('common/page-loader/index', function(require, exports, module){ var TAP_EVENT = 'click';
var $ = require('zepto');

var win = window;
var $win = $(win),
	lastScrollY = win.scrollY,
	winH = $win.height();

function PageLoader(options) {
	this.options = options;
	this.$container = $(options.container);
	this.$seeMore = $(options.seeMore);
	this.$loading = $(options.loading);
	this.getHtml = options.getHtml;
	this.pageNum = options.pageBegin || 1;
	this.loading = false;
	this.hasAll = false;

	// this.scrollKey = options.scrollKey;
	this.isScrollInit = true;

	this._init();
}

PageLoader.prototype = {
	/**
	 * 加载首页
	 * @return {[type]} [description]
	 */
	loadFirst: function() {
		this._rendData();
		return this;
	},
	/**
	 * 所有数据加载完成
	 * @param  {[type]} back [description]
	 * @return {[type]}      [description]
	 */
	loadEnd: function(back) {
		this._loadEndBack = back;
	},

	_init: function() {
		this._addEvents();
	},
	_addEvents: function() {
		var ths = this;

		if (ths.options.seeMore) { // 查看更多
			ths.$seeMore.on(TAP_EVENT, function(evt) {
				if (!hasMore()) {
					return;
				}
				ths._rendData();
				evt.preventDefault();
			});
		} else { //滚动加载

			if (ths.scrollKey) {
				ths._scollTo(ths.scrollKey);
			} else {
				ths.isScrollInit = false;
			}
			$win.on('scroll', function() {
				if (!ths.isScrollInit && ths.scrollKey) {
					sessionStorage.setItem(ths.scrollKey, scrollY);
				}
				if (!hasMore()) {
					return;
				}
				ths._scroll();
			});
		}

		function hasMore() {
			if (ths.$container.css('display') == 'none') {
				return false;
			}
			if (ths.hasAll) { //加载已完成
				return false;
			}
			return true;
		}

	},
	_scollTo: function(key) {
		var pos = sessionStorage.getItem(key);
		var self = this;

		if (!pos) {
			self.isScrollInit = false;
			return;
		}

		if (window.scrollY >= pos) {
			self.isScrollInit = false;
			return;
		}
		setTimeout(function() {
			window.scroll(0, pos);
			self._scollTo(key);
		}, 50);
	},
	_scroll: function() {
		var ths = this;
		var scrollY = win.scrollY,
			dir;
		var isBottom = scrollY >= ($(document).height() - winH) * 0.9;

		if (scrollY >= lastScrollY) {
			dir = 'up';
		} else {
			dir = 'down';
		}
		lastScrollY = scrollY;

		if (!ths.loading && dir == 'up' && isBottom) {
			ths._rendData();
		}
	},
	_rendData: function() {
		var ths = this;
		var pageNum = ths.pageNum;
		var $loading = ths.$loading.length > 0 ? ths.$loading : $('#J-loading');

		if (ths.loading) {
			return false;
		}
		ths.loading = true;
		$loading.css('display', 'block');

		ths.getHtml(pageNum, function(html, total) {

			ths.loading = false;
			$loading.css('display', 'none');

			if (ths.pageNum == 1) {
				ths.$container.html(html);
				if (ths.$seeMore[0]) {
					ths.$seeMore.css('display', 'block');
				}
			} else {
				ths.$container.append(html);
			}

			ths.pageNum++;

			if (!html.trim() || (total && ths.$container.children().length >= total)) {
				ths.hasAll = true;
				ths._loadEndBack && ths._loadEndBack();
				ths.$seeMore[0] && ths.$seeMore.remove();
			}
		});
	}
};

module.exports = PageLoader; 
});
;define('common/bubble/bubble', function(require, exports, module){ var $ = require('zepto');
var _tmpl = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div id="J-bubble" class="bubble">\r\n\t<div class="mask"></div>\r\n\t<div class="bubble-content"></div>\r\n</div>';
}
return __p;
}();
var timer;

var $b, $content;

function show(msg, duration) {
	if (!$b) {
		$(document.body).append(_tmpl);
		$b = $('#J-bubble');
		$content = $b.find('.bubble-content');
	}
	$content.text(msg);
	$b.css('display', 'block').animate({
		opacity: 1
	});
	if (timer) {
		clearTimeout(timer);
	}
	timer = setTimeout(function() {
		hide();
		timer = null;
	}, duration || 2000);

}

function hide() {
	$b.animate({
		opacity: 0
	}, function(){
		$b.css('display', 'none');
	})
}

module.exports = {
	show: show,
	hide: hide
}; 
});
;define('common/config/index', function(require, exports, module){ 

module.exports = {
	// mod: 'dev',
	// mock: true,
	// host: 'http://172.18.8.95',
	// host: 'http://devmall.taojinzi.cn',
	// host: 'http://testmall.taojinzi.cn',
	// host: 'http://wemall.shaowei.com',

	cutArr: [
		'华丽的一刀！砍掉了$0元！',
		'好狠的一刀！砍掉了$0元！',
		'帅气的一刀！砍掉了$0元！',
		'猥琐的一刀！砍掉了$0元！',
		'霸气的一刀！砍掉了$0元！',
		'精彩的一刀！砍掉了$0元！',
		'犀利的一刀！砍掉了$0元！',
		'轻轻的一刀！砍掉了$0元！',
		'温柔的一刀！砍掉了$0元！',
		'潇洒的一刀！砍掉了$0元！',
		'漂亮的一刀！砍掉了$0元！'
	]
}; 
});
;define('common/pop/index', function(require, exports, module){ var $ = require('zepto');
var _tmpl = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div id="J-pop" class="pop">\r\n\t<div class="mask"></div>\r\n\t<div class="container">\r\n\t\t<div class="close"></div>\r\n\t\t<div class="title"></div>\r\n\t\t<div class="content"></div>\r\n\t</div>\r\n</div>';
}
return __p;
};

var curOptions;
var $pop, $mask, $container, $content;
var winHei = $(window).height();
var winScrollY = 0;

var focusGap = 100;

function _init() {
	if (!$pop) {
		$(document.body).append(_tmpl());

		$pop = $('#J-pop');
		$mask = $pop.find('.mask');
		$container = $pop.find('.container');
		$title = $pop.find('.title');
		$content = $pop.find('.content');
		$close = $pop.find('.close');

		// $pop.css('min-height', winHei + 'px');
	}

	$mask.add($close).on('click', function() {
		if(curOptions.manualClose === false){
			return;
		}
		hide();
	});

}

_init();

function show(options) {
	curOptions = options;

	if (options.autoY) {
		winScrollY = window.scrollY;
	} else {
		winScrollY = 0;
	}

	// $pop.css('height', winHei);

	$content.html($(options.content));
	$('input').on('focus', inputFocus);

	if (options.hasClose === false) {
		$close.css('display', 'none');
	} else {
		$close.css('display', 'block');
	}

	if (options.title) {
		$title.text(options.title).css('display', 'block');
	} else {
		$title.css('display', 'none');
	}

	if (options.scroll) {
		$pop.css('position', 'fixed');
	} else {
		$pop.css('position', 'absolute');
		$('html').attr('style', 'position: relative; overflow: hidden; height: ' + winHei + 'px;');
		$('body').attr('style', 'overflow: hidden; height: ' + winHei + 'px; padding: 0px;');
	}

	$pop.css('display', 'block');

	$container.animate({
		translateY: '0'
	}, 500, 'ease-out');

	// $mask.animate({
	// 	opacity: '0.8'
	// }, 500, 'ease-out');


}

function hide(back) {
	$container.animate({
		translateY: '100%'
	}, 500, 'ease-in', function() {
		$('html').attr('style', '');
		$('body').attr('style', '');
		$pop.css('display', 'none');
		if (!curOptions.scroll && winScrollY) {
			window.scroll(0, winScrollY);
		}
		back && back();
	});
	// $mask.animate({
	// 	opacity: 0
	// }, 500, 'ease-in', function() {
	// 	$('html').attr('style', '');
	// 	$('body').attr('style', '');
	// });

}


function inputFocus(evt) {
	var $cur = $(this);

	$(window).on('resize', fixPos);

	function fixPos() {
		$(window).off('resize', fixPos);

		// var offset = $cur.offset();
		// var winHei = $(window).height();
		// var bottom = winHei - offset.top - $cur.height() - focusGap; //输入框距页面底部距离

		// if (bottom < 0) {
		// 	bottom = 0;
		// }
		// $container.css('bottom', '-' + bottom + 'px');
	}

}


module.exports = {
	show: show,
	hide: hide
}; 
});
;define('common/util/index', function(require, exports, module){ /**
 * 获取min到max之间的一个随机数(包含max，不含min)
 */
function random(min, max) {
	return min + Math.ceil(Math.random() * max);
}

function random2(min, max) {
	return min + Math.floor(Math.random() * max);
}

/**
 * 通过url获取参数
 */
function getParam(name, search) {
	var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
	var search = search || location.search;
	var r = search.substr(1).match(reg);

	if (search && r) {
		return r[2];
	} else {
		return '';
	}
}

/**
 * 获取动画结束事件的名字
 */
function getAniEndName() {
	var transElement = document.createElement('trans');
	var transitionEndEventNames = {
		'WebkitTransition': 'webkitTransitionEnd',
		'MozTransition': 'transitionend',
		'OTransition': 'oTransitionEnd',
		'transition': 'transitionend'
	};
	var animationEndEventNames = {
		'WebkitTransition': 'webkitAnimationEnd',
		'MozTransition': 'animationend',
		'OTransition': 'oAnimationEnd',
		'transition': 'animationend'
	};

	function findEndEventName(endEventNames) {
		for (var name in endEventNames) {
			if (transElement.style[name] !== undefined) {
				return endEventNames[name];
			}
		}
	}
	return {
		transEvtName: findEndEventName(transitionEndEventNames),
		aniEvtName: findEndEventName(animationEndEventNames)
	};
}

/**
 * phpdata已预备好
 */
function phpdataReady(back) {
	if (typeof phpdata == 'object') {
		back && back(phpdata);
		return;
	}

	setTimeout(function() {
		phpdataReady(back);
	}, 200);
}

/**
 * 验证身份证号码
 */
var IdCard = {};

(function(IdCard) {
	var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // 加权因子
	var ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 身份证验证位值.10代表X

	IdCard.valid = IdCardValidate;


	function IdCardValidate(idCard) {
		idCard = trim(idCard.replace(/ /g, "")); //去掉字符串头尾空格                     
		if (idCard.length == 15) {
			return isValidityBrithBy15IdCard(idCard); //进行15位身份证的验证    
		} else if (idCard.length == 18) {
			var a_idCard = idCard.split(""); // 得到身份证数组   
			if (isValidityBrithBy18IdCard(idCard) && isTrueValidateCodeBy18IdCard(a_idCard)) { //进行18位身份证的基本验证和第18位的验证
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
	/**  
	 * 判断身份证号码为18位时最后的验证位是否正确  
	 * @param a_idCard 身份证号码数组  
	 * @return  
	 */
	function isTrueValidateCodeBy18IdCard(a_idCard) {
		var sum = 0; // 声明加权求和变量   
		if (a_idCard[17].toLowerCase() == 'x') {
			a_idCard[17] = 10; // 将最后位为x的验证码替换为10方便后续操作   
		}
		for (var i = 0; i < 17; i++) {
			sum += Wi[i] * a_idCard[i]; // 加权求和   
		}
		valCodePosition = sum % 11; // 得到验证码所位置   
		if (a_idCard[17] == ValideCode[valCodePosition]) {
			return true;
		} else {
			return false;
		}
	}
	/**  
	 * 验证18位数身份证号码中的生日是否是有效生日  
	 * @param idCard 18位书身份证字符串  
	 * @return  
	 */
	function isValidityBrithBy18IdCard(idCard18) {
		var year = idCard18.substring(6, 10);
		var month = idCard18.substring(10, 12);
		var day = idCard18.substring(12, 14);
		var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
		// 这里用getFullYear()获取年份，避免千年虫问题   
		if (temp_date.getFullYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day)) {
			return false;
		} else {
			return true;
		}
	}
	/**  
	 * 验证15位数身份证号码中的生日是否是有效生日  
	 * @param idCard15 15位书身份证字符串  
	 * @return  
	 */
	function isValidityBrithBy15IdCard(idCard15) {
		var year = idCard15.substring(6, 8);
		var month = idCard15.substring(8, 10);
		var day = idCard15.substring(10, 12);
		var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
		// 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法   
		if (temp_date.getYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day)) {
			return false;
		} else {
			return true;
		}
	}
	//去掉字符串头尾空格   
	function trim(str) {
		return str.replace(/(^\s*)|(\s*$)/g, "");
	}



})(IdCard);

module.exports = {
	getParam: getParam,
	random: random,
	random2: random2,
	getAniEndName: getAniEndName,
	phpdataReady: phpdataReady,
	IdCard: IdCard
}; 
});
;define('common/alert/alert', function(require, exports, module){ var $ = require('zepto');
var Util = require('common/util/index');
var _tmpl = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div id="J-alert" class="alert">\r\n\t<div id="J-alert-mask" class="mask"></div>\r\n\t<div id="J-alert-content-wrap" class="alert-content">\r\n\t\t<i id="J-alert-close" class="icon-close"></i>\r\n\t\t<div id="J-alert-content"></div>\r\n\t</div>\r\n</div>';
}
return __p;
};

var $win = $(window),
	$html = $('html'),
	$body = $(document.body);
var winHei = $win.height();
var $alert, $mask, $contentWrap, $content, $close;
var winScrollY = 0;
var bodyStyle, htmlStyle;

var addClsName;

/**
 * 显示alert框
 * @param  {[type]}  html     [html代码]
 * @param  {Boolean} hasClose [是否显示关闭按钮]
 * @param  {[type]}  addCls   [添加自定义class]
 * @return {[type]}           [description]
 */
function show(html, hasClose, addCls, closeBack) {
	if (!$alert) {
		$(document.body).append(_tmpl());
		$alert = $('#J-alert');
		$contentWrap = $('#J-alert-content-wrap');
		$content = $('#J-alert-content');
		$mask = $('#J-alert-mask');
		$close = $('#J-alert-close');

		$close.on('click', function(evt) {
			hide();
			evt.preventDefault();
			closeBack && closeBack();
		});
	} else {
		$alert.css('display', 'block');
	}
	if(addCls){
		addClsName = addCls;
		$contentWrap.addClass(addCls);
	}

	winScrollY = window.scrollY;
	htmlStyle = $html.attr('style');
	bodyStyle = $body.attr('style');
	$html.attr('style', 'position: relative; overflow: hidden; height: ' + winHei + 'px;');
	$body.attr('style', 'overflow: hidden; height: ' + winHei + 'px; padding: 0px;');


	if (typeof html === 'string' && !/<.*>/.test(html)) { //url
		if(/close=0/.test(html)){
			hasClose = false;
		}
		$content.html($(_createIframe(html)));
	} else { //html
		$content.html($(html));
	}

	if (hasClose === true || hasClose === undefined) {
		$close.css('display', 'block');
	} else {
		$close.css('display', 'none')
	}
	_resize();
	$win.on('resize', _resize);
}

function hide() {
	if(addClsName){
		$contentWrap.removeClass(addClsName);
		addClsName = undefined;
	}

	$alert.css('display', 'none');
	$win.off('resize', _resize);

	$html.attr('style', htmlStyle);
	$body.attr('style', bodyStyle);
	window.scroll(0, winScrollY);
}

function _createIframe(url) {
	var iframe = document.createElement('iframe');

	iframe.src = url;
	iframe.onload = function() {
		// iframe.style.height = $(iframe.contentWindow.document.body).height() + 'px';
		_hasCloseByUrl(iframe.contentWindow.location.search);
		iframe.style.height = iframe.contentWindow.document.body.offsetHeight + 'px';
		_resize();
	};
	return iframe;
}

function _resize() {
	var winHei = $win.height();
	var hei = $contentWrap.height();

	$contentWrap.css('margin-top', (winHei - hei) / 2);
}

function _hasCloseByUrl(search) {
	var isClose = Util.getParam('close', search);

	if (isClose === '0') {
		$close.css('display', 'none');
	} else {
		$close.css('display', 'block');
	}
}


module.exports = {
	show: show,
	hide: hide
}; 
});
;define('common/confirm-service/index', function(require, exports, module){ var $ = require('zepto');
var Ajax;
var Bubble = require('common/bubble/bubble');
var Alert = require('common/alert/alert');

var _selServiceTmpl = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="service-alert-content">\r\n\t';
 if(userList.length == 2){ 
__p+='\r\n\t<p class="title">请选择一位朋友作为您的推荐人(<b>2选1</b>)</p>\r\n\t';
 }else{ 
__p+='\r\n\t<p class="title">请确认您的推荐人</p>\r\n\t';
 } 
__p+='\r\n\t<ul class="service-list">\r\n\t\t';
 $.each(userList, function(i, user){ 
__p+='\r\n\t\t<li>\r\n\t\t\t<div class="img-wrap headimg" style="background-image:url('+
((__t=( user.headImg ))==null?'':__t)+
')"></div>\r\n\t\t\t<p class="user-name">'+
((__t=( user.userName ))==null?'':__t)+
'</p>\r\n\t\t\t<p class="phone-label">'+
((__t=( user.phone ))==null?'':__t)+
'</p>\r\n\t\t\t<a class="J-sel-btn btnl" recommend="'+
((__t=( user.recommend ))==null?'':__t)+
'">就Ta了</a>\r\n\t\t</li>\r\n\t\t';
 }) 
__p+='\r\n\t</ul>\r\n</div>';
}
return __p;
};
var _phoneServiceTmpl = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="service-alert-content">\r\n\t<p class="title">请填写您的推荐人</p>\r\n\t<div class="input-wrap phone-wrap">\r\n        <label>手机号</label>\r\n        <input class="J-phone" type="tel" name="phone" placeholder="请输入推荐人手机号码" autocomplete="off">\r\n    </div>\r\n    <div class="userinfo"></div>\r\n    <div class="btn-content">\r\n    \t<button type="button" class="J-submit btnl btnl-wx disabled">确认</button>\r\n    </div>\r\n    <div class="link-wrap">\r\n        <a class="J-self-link link">我自己逛来的</a>\r\n    </div>\r\n</div>';
}
return __p;
};

var recommend;
var recommendLog;

/**
 * 验证服务人
 * @param  {[type]} phone [description]
 * @return {[type]}       [description]
 */
function validService(phone, code, ajax, back, errorBack) {

	Ajax = ajax;
	recommend = '';
	recommendLog = {};

	new Ajax().send({
		url: '/WeChat/Band/checkUserRecommend',
		type: 'post',
		data: {
			phone: phone,
			code: code
		}
	}, function(result) {
		var type = result.type; //0已有服务人 1有服务人推荐 2无服务人推荐

		recommendLog.type = type;
		recommendLog.phone = phone;

		switch (type) {
			case 0:
				back && back();
				break;
			case 1:
				selServicePeople(result, function() {
					recommendLog.userList = result.user;
					recommendLog.selRecommend = recommend;

					recordLog();
					back && back(recommend);
				});
				break;
			case 2:
				showPhoneService(function() {
					if (recommendLog.type == 10) {
					} else {
						recommendLog.selRecommend = recommend;
					}

					recordLog();
					back && back(recommend);
				});
				break;
		}

	}, function() {
		errorBack && errorBack();
	});
}

/**
 * 记录推荐选择
 * @return {[type]} [description]
 */
function recordLog() {
	new Ajax().send({
		url: '/User/Register/selectRecommendLog',
		type: 'post',
		data: {
			data: JSON.stringify(recommendLog)
		}
	}, function(result) {
		console.log(result);
	});
}

/**
 * 选择服务人
 * @return {[type]} [description]
 */
function selServicePeople(result, back) {
	var $container;

	Alert.show(_selServiceTmpl({
		userList: result.user
	}), false, 'service-alert');

	$container = $('.service-alert-content');

	$container.find('.J-sel-btn').on('click', function() {
		Alert.hide();
		recommend = $(this).attr('recommend');

		back && back();
	});

}

function showPhoneService(back) {
	var $container;
	var $phone, $submit;
	Alert.show(_phoneServiceTmpl(), false, 'service-alert');

	$container = $('.service-alert-content');
	$phone = $container.find('.J-phone');
	$submit = $container.find('.J-submit');

	$phone.get(0).focus();
	$phone.on('input', function() {
		var phone = $phone.val().trim();

		if (/^1[3-8]\d{9}$/.test(phone)) {

			getService(phone, function(user) {
				recommendLog.userList = [user];

				$submit.removeClass('disabled');
				recommend = user.recommend;
				$container.find('.userinfo').html('<div class="head-img" style="background-image:url(' + user.headImg + ')"></div><div class="user-name">' + user.userName + '</div>');

			}, function(err) {
				$submit.addClass('disabled');
				$container.find('.userinfo').html('<p class="err">' + err.msg + '</p>');
			});

		} else {
			$submit.addClass('disabled');
			$container.find('.userinfo').html('');
		}
	});
	$submit.on('click', function() {
		var phone = $phone.val();

		if ($submit.hasClass('disabled')) {
			return false;
		}
		Alert.hide();
		back && back();
	});

	//自己来的
	$container.find('.J-self-link').on('click', function() {
		recommend = '';
		Alert.hide();

		recommendLog.type = 10;
		back && back();
	});
}

/**
 * 获取服务人
 * @param  {[type]} phone [description]
 * @return {[type]}       [description]
 */
function getService(phone, back, errorBack) {
	new Ajax().send({
		url: '/WeChat/Band/getRecommendPhone',
		data: {
			phone: phone
		},
		selfErrorBack: true
	}, function(result) {
		back && back(result);
	}, function(err) {
		errorBack && errorBack(err);
	});
}

module.exports = {
	start: validService
}; 
});
;define('common/login-pop/index', function(require, exports, module){ var $ = require('zepto');
var Pop = require('common/pop/index');
// var Ajax = require('common/ajax/index');
var Ajax;
var Bubble = require('common/bubble/bubble');
var Alert = require('common/alert/alert');
var ConfirmService = require('common/confirm-service/index');

var _tmpl = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<section class="phone-panel">\r\n\t<div class="input-wrap">\r\n\t\t<label>手机号</label>\r\n\t\t<input id="J-phone" type="tel" placeholder="请输入您的手机号码" />\r\n\t</div>\r\n\t<div class="yzm">\r\n\t\t<div class="input-wrap">\r\n\t\t\t<label>验证码</label>\r\n\t\t\t<input id="J-code" type="tel" placeholder="输入验证码" />\r\n\t\t</div>\r\n\t\t<button style="vertical-align: top;" id="J-yzm-bt" type="button">获取验证码</button>\r\n\t</div>\r\n\t<div>\r\n\t\t<button id="J-phone-ok" class="btnl btnl-wx">确认</button>\r\n\t</div>\r\n</section>';
}
return __p;
};

var options;
var disabled = false; //验证按钮是否禁用

var $yzmBt, $submitBt, $phone, $code;
var loagining = false;

function show(opts) {
	Pop.show({
		content: _tmpl(),
		hasClose: false,
		manualClose: opts.manualClose
	});

	init(opts);
}

function init(opts) {
	options = opts;
	Ajax = opts.Ajax;

	$yzmBt = $('#J-yzm-bt');
	$submitBt = $('#J-phone-ok');
	$phone = $('#J-phone');
	$code = $('#J-code');

	$yzmBt.on('click', getCode);
	$submitBt.on('click', login);
}

/**
 * 获取验证码
 */
function getCode() {
	if (disabled) {
		return false;
	}

	var phone = $phone.val();
	var curTime = 60;

	new Ajax().send({
		url: '/WeChat/Band/sendMsg',
		data: {
			phone: phone
		}
	}, function() {
		disabled = true;
		$yzmBt.text(curTime).addClass('disabled');
		start();
	});

	function start() {
		setTimeout(function() {
			curTime--;
			$yzmBt.text(curTime);

			if (curTime <= 0) {
				disabled = false;
				$yzmBt.text('获取验证码').removeClass('disabled');
				return;
			}
			start();
		}, 1000)
	}
	return false;
}

/**
 * 验证登陆
 */
function login(evt) {
	var phone = $phone.val();
	var code = $code.val();
	// var recommend = getParam('recommend');
	var params;

	if (!phone) {
		Bubble.show('请输入您的手机号码');
		return false;
	} else if (!/^\d{11}$/.test(phone)) {
		Bubble.show('请输入正确的手机号码');
		return false;
	} else if (!code) {
		Bubble.show('请输入验证码');
		return false;
	} else if (loagining) {
		return false;
	}

	params = {
		phone: phone,
		code: code
	};

	// if (recommend) {
	// 	params.recommend = recommend;
	// }

	if (typeof phpdata === 'object') {
		$.each(['channelType', 'channelId'], function(i, key) {
			if (phpdata[key]) {
				params[key] = phpdata[key];
			}
		});
	}

	loagining = true;

	if (options.noSelRecommend) {
		loginAjax();
	} else {
		ConfirmService.start(phone, code, Ajax, function(recommend) {

			if (recommend) {
				params.recommend = recommend;
			}

			loginAjax();

		}, function() {
			loagining = false;
		});
	}

	function loginAjax() {

		new Ajax().send({
			url: '/WeChat/Band/bandAccount',
			type: 'post',
			data: params
		}, function() {
			loagining = false;
			Pop.hide();
			options.loginSuc && options.loginSuc();
		}, function() {
			loagining = false;
		});
	}
	return false;
}


/**
 * 通过url获取参数
 */
function getParam(name, search) {
	var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
	var search = search || location.search;
	var r = search.substr(1).match(reg);

	if (search && r) {
		return r[2];
	} else {
		return '';
	}
}


module.exports = {
	show: show,
	init: init
}; 
});
;define('common/ajax/index', function(require, exports, module){ var $ = require('zepto');
var Bubble = require('common/bubble/bubble');
var Conf = require('common/config/index');
var LoginPop = require('common/login-pop/index');


// if (Conf.mod == 'dev' && Conf.mock) {
// 	require.async('common/mock-list/index');
// }

function Ajax() {}

Ajax.prototype = {

	send: function(options, back, errorBack) {
		var self = this;

		if (!options) {
			options = {};
		}

		if (Conf.mod == 'dev') {
			options.dataType = 'jsonp';
			options.type = 'get';
			options.url = Conf.host + options.url;
		} else {
			options.dataType = options.dataType || 'json';
		}

		//添加ajax请求参数，给php用
		// var data = options.data = options.data || {};
		// if (typeof data === 'string') {
		// 	data += '&tjzAjax=1';
		// } else if (typeof data === 'object') {
		// 	data.tjzAjax = 1;
		// }
		// options.data = data;
		if (options.url.match(/\?[^=]+=.*$/)) {
			options.url += '&isAjax=1';
		} else {
			options.url += '?isAjax=1';
		}

		options.success = function(data) {
			if (options.selfBack) { //调用者自己处理返回结果
				back && back(data);
				return;
			}
			var msg = data.msg,
				url = data.url;

			if (data.code == 0) { //成功
				back && back(data.result, data);
				if(options.selfSucBack){ //调用者自己处理返回成功结果
					return;
				}
			} else {
				if(data.code == 1000){ //快速登陆
					LoginPop.show({
						Ajax: Ajax,
						loginSuc: function(){
							if(options.selfLoginSuc){
								options.selfLoginSuc();
								return;
							}
							self.send(options, back, errorBack);
						}
					});

					return;
				}
				errorBack && errorBack(data);
				if (options.selfErrorBack) { //调用者自己处理返回失败结果
					return;
				}
			}

			if (msg) {
				Bubble.show(msg);
				if (url) {
					setTimeout(function() {
						location.href = url;
					}, 2000);
				}
			} else {
				if (url) {
					location.href = url;
				}
			}


		};
		options.error = function(xhr, errorType, error) {
			// alert(options.url);
			// alert(errorType);
			// alert(error);
			Bubble.show('啊哦，网络异常啦！检查下网络吧~');
			errorBack && errorBack();
		};

		$.ajax(options);
	}

};

Ajax.formatAjaxParams = function(el){
	var $el = $(el);
	var data = $el.attr('ajax-data');
	var ajaxParams = {
		url: $el.attr('ajax-url'),
		type: $el.attr('ajax-type') || 'get'
	};

	if(data){
		ajaxParams.data = JSON.parse(data);
	}
	return ajaxParams;
};

module.exports = Ajax; 
});
;define('common/confirm/index', function(require, exports, module){ var $ = require('zepto');
var Alert = require('common/alert/alert');

var _tmpl = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div id="J-confirm" class="confirm '+
((__t=( type=='alert'?'alert-msg':'' ))==null?'':__t)+
'">\r\n\t<div class="confirm-content">'+
((__t=( msg ))==null?'':__t)+
'</div>\r\n\t<div class="confirm-btns">\r\n\t\t<button class="btn-no btnl btnl-default">'+
((__t=( noLabel || '取消' ))==null?'':__t)+
'</button>\r\n\t\t<button class="btn-yes btnl">'+
((__t=( okLabel||'确定' ))==null?'':__t)+
'</button>\r\n\t</div>\r\n</div>';
}
return __p;
};
var $confirm, $content, $yes, $no;


function show(options) {

	Alert.show(_tmpl({
		msg: options.msg,
		type: options.type,
		okLabel: options.okLabel,
		noLabel: options.noLabel
	}), false);
	$confirm = $('#J-confirm');
	$content = $confirm.find('.confirm-content');
	$yes = $confirm.find('.btn-yes');
	$no = $confirm.find('.btn-no');

	$yes.on('click', function(){
		hide();
		options.yesBack && options.yesBack();
	});

	$no.on('click', function(){
		hide();
		options.noBack && options.noBack();
	});

}

function hide() {
	Alert.hide();
	$yes.off('click');
	$no.off('click');
}

module.exports = {
	show: show,
	hide: hide
}; 
});
;define('common/j-ajax/index', function(require, exports, module){ var TAP_EVENT = 'click';
var $ = require('zepto');
var Ajax = require('common/ajax/index');
var Confirm = require('common/confirm/index');

var validateFunc;

function init(options) {

	options = options || {};
	validateFunc = options.validateFunc;

	$('.j-ajax').each(function(i, el) {
		var $el = $(el);
		var $form = $('#' + $el.attr('form'));
		var url, type, data;
		var alert = $el.attr('alert');
		var alertTo = $el.attr('alert-to');


		$el.on(TAP_EVENT, function(evt) {
			if(validateFunc && !validateFunc()){
				return false;
			}

			$el.trigger('disabled:click');

			if ($form.length > 0) {
				url = $form.attr('action');
				type = $form.attr('method');
				data = $form.serialize();
			} else {
				url = $el.attr('ajax-url');
				type = $el.attr('ajax-type') || 'get';
				data = JSON.parse($el.attr('ajax-data'));
			}

			var requestObj = {
				url: url,
				type: type,
				data: data,
				selfLoginSuc: options.selfLoginSuc
			};
			
			new Ajax().send(requestObj, function() {
				if (alert) {
					Confirm.show({
						msg: alert,
						type: 'alert',
						yesBack: function() {
							if (alertTo) {
								location.href = alertTo;
							}
						}
					});
				}
			}, function(){
				$el.trigger('disabled:ok');
			});

			evt.preventDefault();
		});

	});

}

module.exports = {
	init: init
}; 
});
;define('common/ad-layer/index', function(require, exports, module){ var $ = require('zepto');
var _tmpl = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div id="J-ad-layer" class="ad-layer">\r\n\t';
 if(hasMask){ 
__p+='\r\n\t\t<div class="mask"></div>\r\n\t';
 } 
__p+='\r\n\t<a href="'+
((__t=( link ))==null?'':__t)+
'" class="ad-content">\r\n\t\t<span class="close"></span>\r\n\t</a>\r\n</div>';
}
return __p;
};

var $layer, $mask, $close;


function init() {
	window.shareSuccess = show;
}

function show(obj) {
	obj = obj || {
		link: ''
	};

	obj.hasMask = ($('#J-guide').length == 0);

	$(document.body).append($(_tmpl(obj)));

	$layer = $('#J-ad-layer');
	$mask = $layer.find('.mask');
	$close = $layer.find('.close');

	$close.on('click', close);
	$mask.on('click', close);
}

function close() {
	$layer.remove();
	return false;
}



init(); 
});
;define('common/guide/guide', function(require, exports, module){ var $ = require('zepto');

function Guide(btn, type, text) {
	this.$btn = $(btn);
	this.type = type;
	this.text = text;

	this._init();
}

Guide.prototype = {
	_tmpl: function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div id="J-guide" class="guide '+
((__t=( type?type:'' ))==null?'':__t)+
'"><i class="icon-guide">'+
((__t=( text ))==null?'':__t)+
'</i></div>';
}
return __p;
},
	_init: function() {
		var self = this;

		self.$btn.on('click', function() {
			self.show();
		});


	},

	show: function() {
		var self = this;

		$(document.body).append(self._tmpl({
			type: self.type,
			text: self.text
		}));
		// location.hash = "#guide";
		// setTimeout(function(){
		// 	window.onhashchange = function() {
		// 		self._close();
		// 	};
		// });

		$('#J-guide').on('click', function() {
			self._close();
		});
	},
	_close: function() {
		$('#J-guide').off('click').remove();
		// window.onhashchange = null;
		// location.hash = "";
	}
};

module.exports = Guide; 
});
;define('common/timer/timer', function(require, exports, module){ var $ = require('zepto');

// var TimerManager = {
// 	start: function(el) {
// 		$(el).each(function(i, curEle) {
// 			var time = $(curEle).attr('timer');

// 			if (time) {
// 				new Timer(time, curEle);
// 			}
// 		});
// 	}
// };

function Timer(el, format) {
	this.$el = $(el);
	this.format = format;

	var endTime = +this.$el.attr('timer-end');
	var starTime = typeof phpdata == 'object' ? phpdata.serverTime : null;
	var lastTime = +this.$el.attr('timer');

	if (endTime && starTime) {
		this.lastTime = endTime - starTime;
	} else if (lastTime || lastTime == 0) {
		this.lastTime = this.oTime = lastTime;
	}

	this.day = 0;
	this.hour = 0;
	this.min = 0;
	this.sec = 0;
	this._timer = null;
}

Timer.prototype = {

	start: function() {
		var self = this;

		if (!self.lastTime && self.lastTime != 0) {
			return;
		}

		self._walk();
		return self;
	},

	end: function(back) {
		this._endBack = back;
		return this;
	},

	_walk: function() {
		var self = this;

		self.$el.html(self._format(self.lastTime < 0 ? 0 : self.lastTime));

		if (self.lastTime <= 0) {
			if (this.oTime > 0) {
				self._endBack && self._endBack();
			}
			return;
		}
		self.lastTime--;
		self._timer = setTimeout(function() {
			self._walk();
		}, 1000);
	},

	_format: function(time) {
		var self = this;


		var hour = parseInt(time / 3600, 10);
		var min = parseInt((time - hour * 3600) / 60);
		var sec = time - hour * 3600 - min * 60;

		var day = parseInt(hour / 24);

		hour = hour - day * 24;

		self.day = day;
		self.hour = hour;
		self.min = min;
		self.sec = sec;

		if (typeof self.format === 'function') {
			return self.format(time);
		}
		
		if (self.format == 'single') {
			if (day > 0) {
				return self._addZero(day) + '天';
			} else if (hour > 0) {
				return self._addZero(hour) + '小时';
			} else if (min > 0) {
				return self._addZero(min) + '分钟';
			} else if (sec > 0) {
				return self._addZero(sec) + '秒';
			} else {
				return '0秒';
			}
		}

		if (self.format == 'time') {
			return self._addZero(day * 24 + hour) + ':' + self._addZero(min) + ':' + self._addZero(sec);
		}

		return (day > 0 ? self._addZero(day) + '天' : '') + self._addZero(hour) + '时' + self._addZero(min) + '分' + self._addZero(sec) + '秒';
		// return (day > 0 ? self._addZero(day) + '天' : '') + (hour > 0 ? self._addZero(hour) + '时' : '') + (min > 0 ? self._addZero(min) + '分' : '') + self._addZero(sec) + '秒';
	},

	_addZero: function(num) {
		if (num.toString().length < 2) {
			return '0' + num;
		}
		return num;
	}

};

Timer.addZero = function(num) {
	if (num.toString().length < 2) {
		return '0' + num;
	}
	return num;
};

module.exports = Timer; 
});
;define('cut-info/index', function(require, exports, module){ var TAP_EVENT = 'click';
var $ = require('zepto');
var PageLoader = require('common/page-loader/index');

require('common/j-ajax/index').init();
var Util = require('common/util/index');

require('common/ad-layer/index');

function Tab(el) {
	var $el = this.$el = $(el);

	this.order = 0;

	this.$navs = $el.find('.tab-nav').children();
	this.$items = $el.find('.tab-content').children();
	this._init();
}

Tab.prototype = {
	_init: function() {
		var self = this;
		var rankType = Util.getParam('rankType') || 0;

		self._toActive(self.$navs.get(rankType));

		self.$navs.on('click', function(evt) {
			self._toActive($(evt.target));
		});

	},

	_toActive: function($cur) {
		$cur = $($cur);

		var self = this;
		var order = self._getOrder($cur, self.$navs);
		var curItem = $(self.$items[order]);

		self.order = order;

		self.$navs.removeClass('active');
		$cur.addClass('active');
		self.$items.css('display', 'none');
		curItem.css('display', 'block');
	},

	_getOrder: function(ele, list) {
		var i = 0,
			len = list.length;
		var cur = ele[0];

		for (; i < len; i++) {
			if (list[i] == cur) {
				return i;
			}
		}
	}
};

new Tab('#J-tab');

var Guide = require('common/guide/guide');
var Timer = require('common/timer/timer');

// Util.phpdataReady(function() {

if (typeof taojinzi === 'undefined') {
	new Guide('#J-invite');
	$('[invite]').each(function(i, el) {
		new Guide(el);
	});
} else {
	$('#J-invite').add($('[invite]')).on('click', function() {
		taojinzi.share(JSON.stringify({
			title: title,
			link: link,
			imgUrl: imgUrl,
			desc: desc
		}));
	});
}
// });

new Timer('#J-timer').start().end(function() {
	location.reload();
});

var Confirm = require('common/confirm/index');
var $body = $(document.body);
var bodyMsg = $body.attr('alert');
var bodyTo;

if (bodyMsg) {
	bodyTo = $body.attr('alert-to');

	Confirm.show({
		type: 'alert',
		msg: bodyMsg,
		yesBack: function() {
			if (bodyTo) {
				location.href = bodyTo;
			}
		}
	});

}


var Ajax = require('common/ajax/index');
var Bubble = require('common/bubble/bubble');
var Util = require('common/util/index');
var Config = require('common/config/index');
var Confirm = require('common/confirm/index');
var Alert = require('common/alert/alert');

$('#J-help-cut').on(TAP_EVENT, function(evt) {
	evt.preventDefault();
	cut();
});

$('#J-cut').on(TAP_EVENT, function(evt) {
	evt.preventDefault();
	cut();
});

$('[bubble]').each(function(i, el) {
	var $el = $(el);
	var msg = $el.attr('bubble');

	if (msg) {
		$el.on(TAP_EVENT, function() {
			Bubble.show(msg);
		});
	}
});


function cut() {
	var $form = $('form');
	var url = $form.attr('action');
	var data = $form.serialize();

	new Ajax().send({
		url: url,
		data: data,
		type: 'post',
		selfSucBack: true,
		selfLoginSuc: function() {
			location.reload();
		}
	}, function(result, data) {
		var txt = Config.cutArr[Util.random(0, 11) - 1];

		Confirm.show({
			msg: txt.replace('$0', '<b style="color: #ea0079;">' + result.price + '</b>'),
			type: 'alert',
			yesBack: function() {
				if (typeof phpdata != 'undefined' && phpdata.redPackage) {
					// showQrcode(function() {
					// 	location.href = data.url;
					// });
					showRedPacket(function() {
						location.href = data.url;
					});
				} else {
					location.href = data.url;
				}
			}
		})
	});
}

// showRedPacket();

/**
 * 显示红包
 */
function showRedPacket(closeBack) {
	var tmpl = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="red-packet-panel">\r\n\t<div class="packet-inner">\r\n\t\t<div class="packet-close"></div>\r\n\t\t<section class="info-section">\r\n\t\t\t<div class="img-wrap head-img" \r\n\t\t\t';
 if(!isTjz){ 
__p+='\r\n\t\t\tstyle="background-image: url('+
((__t=( ownerHead ))==null?'':__t)+
')"\r\n\t\t\t';
 } 
__p+='\r\n\t\t\t></div>\r\n\t\t\t<p class="user-name">'+
((__t=( isTjz?'淘金子商城':(ownerName) ))==null?'':__t)+
'</p>\r\n\t\t\t<p class="des">给你发了一个惊喜礼包</p>\r\n\t\t\t<p class="thanks">'+
((__t=( isTjz?'感谢亲对淘金子的支持！':'谢谢帮砍！' ))==null?'':__t)+
'</p>\r\n\t\t\t<div class="img-erwei">\r\n\t\t\t\t<img src="'+
((__t=( qrCode ))==null?'':__t)+
'" />\r\n\t\t\t\t<!-- <div class="logo"><img src="/static/images/logo.png" /></div> -->\r\n\t\t\t</div>\r\n\t\t\t<div class="tip-content">\r\n\t\t\t\t<p class="tip">扫描关注领惊喜礼包</p>\r\n\t\t\t\t<ul>\r\n\t\t\t\t\t<li>1、长按上述二维码关注公众账号</li>\r\n\t\t\t\t\t<li>2、关注后即可收到惊喜礼包</li>\r\n\t\t\t\t</ul>\r\n\t\t\t</div>\r\n\t\t</section>\r\n\t</div>\r\n</div>';
}
return __p;
};

	phpdata.isTjz = !phpdata.ownerHead && !phpdata.ownerName;

	Alert.show(tmpl(phpdata), false, 'alert-red-packet');
	$('.packet-close').on('click', function() {
		Alert.hide();
		closeBack && closeBack();
	})
}

// showQrcode(function() {
// 	location.href = 'http://www.baidu.com';
// });

function showQrcode(closeBack) {
	Alert.show(function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="cut-qrcode-panel">\r\n\t<h3>关注商城获得更多惊喜</h3>\r\n\t<div class="img-erwei">\r\n\t\t<img src="'+
((__t=( qrCode ))==null?'':__t)+
'" />\r\n\t\t<div class="logo"><img src="/static/images/logo.png" /></div>\r\n\t</div>\r\n\t<p class="tip">长按二维码，扫描关注</p>\r\n</div>';
}
return __p;
}(phpdata), true, 'alert-qrcode-alert');
	$('#J-alert-close').on('click', function() {
		closeBack && closeBack();
	});
}


// var NUM = 10;

// $('.content-item').each(function(i, el) {
// 	var $el = $(el);
// 	var $more = $el.find('.see-more');
// 	var $list = $el.find('.record-list');
// 	var $childs;

// 	if ($list.children().length > NUM) {
// 		$more.css('display', 'block');
// 		resetHei($list);
// 	} else {
// 		$list.css('height', 'auto');
// 	}

// 	$more.on('click', function() {
// 		$list.css('height', 'auto');
// 		$more.css('display', 'none');
// 	});

// });

// function resetHei($list) {
// 	var winWid = $(window).width();

// 	$list.height(80 / 640 * winWid * NUM + 14 * NUM + 7);

// }

var $recordList = $('.record-list');
var $more = $('.see-more');
var $load = $('.J-more-loading');
var _tmplArr = {
	tmpl0: function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='';
 $.each(list, function(key, item){ 
__p+='\r\n<div class="record-item dib-wrap">\r\n\t<a href="/Mall/Haggle/showHaggle?haggleId='+
((__t=( params.activeId ))==null?'':__t)+
'&cutId='+
((__t=( item['id'] ))==null?'':__t)+
'&rankType=1">\r\n\t\t<div class="img-wrap dib" style="background-image: url('+
((__t=( item['head_sculpture'] ))==null?'':__t)+
')"></div>\r\n\t\t<div class="record-m dib">\r\n\t\t\t<div class="record-user">'+
((__t=( item['customer_nickname'] ))==null?'':__t)+
'</div>\r\n\t\t\t<div class="record-date">'+
((__t=( item['update_time'] ))==null?'':__t)+
'</div>\r\n\t\t</div>\r\n\t\t<div class="record-price dib"><label>砍至</label><small>¥</small>'+
((__t=( item['current_price'] ))==null?'':__t)+
'</div>\r\n\t</a>\r\n</div>\r\n';
 }) 
__p+='';
}
return __p;
},
	tmpl1: function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='';
 $.each(list, function(key, item){ 
__p+='\r\n<div class="record-item dib-wrap">\r\n\t<div class="img-wrap dib" style="background-image: url('+
((__t=( item['head_sculpture'] ))==null?'':__t)+
')"></div>\r\n\t<div class="record-m dib">\r\n\t\t<div class="record-user">'+
((__t=( item['customer_nickname'] ))==null?'':__t)+
'<span class="record-date">'+
((__t=( item['create_time'] ))==null?'':__t)+
'</span></div>\r\n\t\t<div class="record-des">'+
((__t=( item['des'] ))==null?'':__t)+
'</div>\r\n\t</div>\r\n\t<div class="record-price dib"><i>-</i><small>¥</small>'+
((__t=( item['haggle_price'] ))==null?'':__t)+
'</div>\r\n</div>\r\n';
 }) 
__p+='';
}
return __p;
}
};

$recordList.each(function(i) {
	var url, params = {};

	switch (i) {
		case 0:
			url = '/Mall/Haggle/haggleSortByPrice'
			break;
		case 1:
			url = '/Mall/Haggle/haggleSortForOwnerId'
			break;
	}

	params.activeId = Util.getParam('haggleId');
	params.ownerId = Util.getParam('ownerId');

	new PageLoader({
		container: $recordList[i],
		seeMore: $more[i],
		pageBegin: 2,
		loading: $load[i],
		getHtml: function(pageNum, back) {
			params.page = pageNum;

			new Ajax().send({
				url: url,
				data: params
			}, function(result) {
				back && back(_tmplArr['tmpl' + i]({
					list: result,
					params: params
				}));
			});


		}
	}).loadEnd(function() {
		$($more[i]).remove();
	});
}); 
});