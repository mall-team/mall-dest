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
;define('common/j-disabled/index', function(require, exports, module){ var $ = require('zepto');

function init() {
	$('.j-disabled').each(function(i, el) {
		var $el = $(el);
		var forever = $el.attr('disabled-forever'); //是否永久禁用，默认5s后自动可用
		var timer;

		$el.on('touchstart', function(evt) {
			if ($el.hasClass('disabled')) {
				evt.preventDefault();
				evt.stopPropagation();
				return false;
			}
		});

		$el.on('disabled:click', function() {

			if (!$el.hasClass('disabled')) {
				$el.addClass('disabled');

				if (!forever || forever != 1) {
					timer = setTimeout(function() {
						$el.removeClass('disabled');
					}, 5000);
				}
			}
		});

		$el.on('disabled:ok', function() {
			clearTimeout(timer);
			$el.removeClass('disabled');
		});
	});
}


module.exports = {
	init: init
}; 
});
;define('common/bullet/index', function(require, exports, module){ var $ = require('zepto');
var Util = require('common/util/index');

var colors = ['#fff', '#918dfe', '#f371b1', '#23cebd'];
var duration = [1000, 1500, 2000, 2500];
// var speed = ['slow', 'normal', 'fast', 'faster'];
// var duration = [4000, 4500, 5000, 5500];
// var speed = [3000, 3500, 4000, 4500];
var speed = [4000];

var winWid = $(window).width();

function Bullet(container, textList) {
	this.container = $(container);
	this.textList = textList;

	this._index = 0;
	this._init();
}

Bullet.prototype = {
	tmpl: function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="bullet-container">\r\n\t<div class="bullet-list"></div>\r\n\t<div class="bullet-list"></div>\r\n\t<div class="bullet-list"></div>\r\n</div>';
}
return __p;
},

	start: function() {
		var self = this;

		self.$list.each(function() {
			self._frame($(this));
		});
	},

	_init: function() {
		var self = this;
		var $el;

		$el = self.$el = $(self.tmpl());
		self.$list = $el.children('.bullet-list');

		self.container.html($el);
	},

	_frame: function($curList) {
		var self = this;
		// var $lastEl = $curList.children().eq(-1);

		// if (!$lastEl[0] || $lastEl.width() < winWid) {
		self._addItem($curList)
			// }

		setTimeout(function() {
			self._frame($curList);
		}, duration[Util.random2(0, duration.length)]);
	},

	_addItem: function($curList) {
		var self = this;
		var text = self.textList[self._index];
		var $el, wid;
		var $lastEl = $curList.children().eq(-1);
		var offsetLeft;

		wid = text.length * 15 + 30;

		if ($lastEl[0]) {
			offsetLeft = $lastEl.offset().left;
			console.log('------:' + offsetLeft);
		}
		if ($lastEl[0] && offsetLeft + $lastEl.width() > winWid) {
			// console.log('--222:' + (offsetLeft + wid));
			// console.log('--333:' + winWid + '---------------------------------------');
			return;
		}

		$el = $('<div class="item" style="color:' + colors[Util.random2(0, colors.length)] + ';right: ' + (-wid) + 'px;">' + text + '</div>');
		$curList.append($el);

		$el.animate({
			translateX: -(wid + winWid) + 'px'
		}, speed[Util.random2(0, speed.length)] * ((wid + winWid) / 320), 'linear', function() {
			$el.remove();
		});

		self._index++;
		if (self._index >= self.textList.length) {
			self._index = 0;
		}
		return $el;
	}
};



module.exports = Bullet; 
});
;define('common/swipe/swipe', function(require, exports, module){ function Swipe(container, options) {

  "use strict";

  // utilities
  var noop = function() {}; // simple no operation function
  var offloadFn = function(fn) { setTimeout(fn || noop, 0) }; // offload a functions execution
  
  // check browser capabilities
  var browser = {
    addEventListener: !!window.addEventListener,
    touch: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
    transitions: (function(temp) {
      var props = ['transitionProperty', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'];
      for ( var i in props ) if (temp.style[ props[i] ] !== undefined) return true;
      return false;
    })(document.createElement('swipe'))
  };

  // quit if no root element
  if (!container) return;
  var element = container.children[0];
  var slides, slidePos, width, length;
  options = options || {};
  var index = parseInt(options.startSlide, 10) || 0;
  var speed = options.speed || 300;
  options.continuous = options.continuous !== undefined ? options.continuous : true;

  function setup() {

    // cache slides
    slides = element.children;
    length = slides.length;

    // set continuous to false if only one slide
    if (slides.length < 2) options.continuous = false;

    //special case if two slides
    if (browser.transitions && options.continuous && slides.length < 3) {
      element.appendChild(slides[0].cloneNode(true));
      element.appendChild(element.children[1].cloneNode(true));
      slides = element.children;
    }

    // create an array to store current positions of each slide
    slidePos = new Array(slides.length);

    // determine width of each slide
    width = container.getBoundingClientRect().width || container.offsetWidth;

    element.style.width = (slides.length * width) + 'px';

    // stack elements
    var pos = slides.length;
    while(pos--) {

      var slide = slides[pos];

      slide.style.width = width + 'px';
      slide.setAttribute('data-index', pos);

      if (browser.transitions) {
        slide.style.left = (pos * -width) + 'px';
        move(pos, index > pos ? -width : (index < pos ? width : 0), 0);
      }

    }

    // reposition elements before and after index
    if (options.continuous && browser.transitions) {
      move(circle(index-1), -width, 0);
      move(circle(index+1), width, 0);
    }

    if (!browser.transitions) element.style.left = (index * -width) + 'px';

    container.style.visibility = 'visible';

  }

  function prev() {

    if (options.continuous) slide(index-1);
    else if (index) slide(index-1);

  }

  function next() {

    if (options.continuous) slide(index+1);
    else if (index < slides.length - 1) slide(index+1);

  }

  function circle(index) {

    // a simple positive modulo using slides.length
    return (slides.length + (index % slides.length)) % slides.length;

  }

  function slide(to, slideSpeed) {

    // do nothing if already on requested slide
    if (index == to) return;
    
    if (browser.transitions) {

      var direction = Math.abs(index-to) / (index-to); // 1: backward, -1: forward

      // get the actual position of the slide
      if (options.continuous) {
        var natural_direction = direction;
        direction = -slidePos[circle(to)] / width;

        // if going forward but to < index, use to = slides.length + to
        // if going backward but to > index, use to = -slides.length + to
        if (direction !== natural_direction) to =  -direction * slides.length + to;

      }

      var diff = Math.abs(index-to) - 1;

      // move all the slides between index and to in the right direction
      while (diff--) move( circle((to > index ? to : index) - diff - 1), width * direction, 0);
            
      to = circle(to);

      move(index, width * direction, slideSpeed || speed);
      move(to, 0, slideSpeed || speed);

      if (options.continuous) move(circle(to - direction), -(width * direction), 0); // we need to get the next in place
      
    } else {     
      
      to = circle(to);
      animate(index * -width, to * -width, slideSpeed || speed);
      //no fallback for a circular continuous if the browser does not accept transitions
    }

    index = to;
    offloadFn(options.callback && options.callback(index, slides[index]));
  }

  function move(index, dist, speed) {

    translate(index, dist, speed);
    slidePos[index] = dist;

  }

  function translate(index, dist, speed) {

    var slide = slides[index];
    var style = slide && slide.style;

    if (!style) return;

    style.webkitTransitionDuration = 
    style.MozTransitionDuration = 
    style.msTransitionDuration = 
    style.OTransitionDuration = 
    style.transitionDuration = speed + 'ms';

    style.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
    style.msTransform = 
    style.MozTransform = 
    style.OTransform = 'translateX(' + dist + 'px)';

  }

  function animate(from, to, speed) {

    // if not an animation, just reposition
    if (!speed) {

      element.style.left = to + 'px';
      return;

    }
    
    var start = +new Date;
    
    var timer = setInterval(function() {

      var timeElap = +new Date - start;
      
      if (timeElap > speed) {

        element.style.left = to + 'px';

        if (delay) begin();

        options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);

        clearInterval(timer);
        return;

      }

      element.style.left = (( (to - from) * (Math.floor((timeElap / speed) * 100) / 100) ) + from) + 'px';

    }, 4);

  }

  // setup auto slideshow
  var delay = options.auto || 0;
  var interval;

  function begin() {

    interval = setTimeout(next, delay);

  }

  function stop() {

    delay = 0;
    clearTimeout(interval);

  }


  // setup initial vars
  var start = {};
  var delta = {};
  var isScrolling;      

  // setup event capturing
  var events = {

    handleEvent: function(event) {

      switch (event.type) {
        case 'touchstart': this.start(event); break;
        case 'touchmove': this.move(event); break;
        case 'touchend': offloadFn(this.end(event)); break;
        case 'webkitTransitionEnd':
        case 'msTransitionEnd':
        case 'oTransitionEnd':
        case 'otransitionend':
        case 'transitionend': offloadFn(this.transitionEnd(event)); break;
        case 'resize': offloadFn(setup.call()); break;
      }

      if (options.stopPropagation) event.stopPropagation();

    },
    start: function(event) {

      var touches = event.touches[0];

      // measure start values
      start = {

        // get initial touch coords
        x: touches.pageX,
        y: touches.pageY,

        // store time to determine touch duration
        time: +new Date

      };
      
      // used for testing first move event
      isScrolling = undefined;

      // reset delta and end measurements
      delta = {};

      // attach touchmove and touchend listeners
      element.addEventListener('touchmove', this, false);
      element.addEventListener('touchend', this, false);

    },
    move: function(event) {

      // ensure swiping with one touch and not pinching
      if ( event.touches.length > 1 || event.scale && event.scale !== 1) return

      if (options.disableScroll) event.preventDefault();

      var touches = event.touches[0];

      // measure change in x and y
      delta = {
        x: touches.pageX - start.x,
        y: touches.pageY - start.y
      }

      // determine if scrolling test has run - one time test
      if ( typeof isScrolling == 'undefined') {
        isScrolling = !!( isScrolling || Math.abs(delta.x) < Math.abs(delta.y) );
      }

      // if user is not trying to scroll vertically
      if (!isScrolling) {

        // prevent native scrolling 
        event.preventDefault();

        // stop slideshow
        stop();

        // increase resistance if first or last slide
        if (options.continuous) { // we don't add resistance at the end

          translate(circle(index-1), delta.x + slidePos[circle(index-1)], 0);
          translate(index, delta.x + slidePos[index], 0);
          translate(circle(index+1), delta.x + slidePos[circle(index+1)], 0);

        } else {

          delta.x = 
            delta.x / 
              ( (!index && delta.x > 0               // if first slide and sliding left
                || index == slides.length - 1        // or if last slide and sliding right
                && delta.x < 0                       // and if sliding at all
              ) ?                      
              ( Math.abs(delta.x) / width + 1 )      // determine resistance level
              : 1 );                                 // no resistance if false
          
          // translate 1:1
          translate(index-1, delta.x + slidePos[index-1], 0);
          translate(index, delta.x + slidePos[index], 0);
          translate(index+1, delta.x + slidePos[index+1], 0);
        }

      }

    },
    end: function(event) {

      // measure duration
      var duration = +new Date - start.time;

      // determine if slide attempt triggers next/prev slide
      var isValidSlide = 
            Number(duration) < 250               // if slide duration is less than 250ms
            && Math.abs(delta.x) > 20            // and if slide amt is greater than 20px
            || Math.abs(delta.x) > width/2;      // or if slide amt is greater than half the width

      // determine if slide attempt is past start and end
      var isPastBounds = 
            !index && delta.x > 0                            // if first slide and slide amt is greater than 0
            || index == slides.length - 1 && delta.x < 0;    // or if last slide and slide amt is less than 0

      if (options.continuous) isPastBounds = false;
      
      // determine direction of swipe (true:right, false:left)
      var direction = delta.x < 0;

      // if not scrolling vertically
      if (!isScrolling) {

        if (isValidSlide && !isPastBounds) {

          if (direction) {

            if (options.continuous) { // we need to get the next in this direction in place

              move(circle(index-1), -width, 0);
              move(circle(index+2), width, 0);

            } else {
              move(index-1, -width, 0);
            }

            move(index, slidePos[index]-width, speed);
            move(circle(index+1), slidePos[circle(index+1)]-width, speed);
            index = circle(index+1);  
                      
          } else {
            if (options.continuous) { // we need to get the next in this direction in place

              move(circle(index+1), width, 0);
              move(circle(index-2), -width, 0);

            } else {
              move(index+1, width, 0);
            }

            move(index, slidePos[index]+width, speed);
            move(circle(index-1), slidePos[circle(index-1)]+width, speed);
            index = circle(index-1);

          }

          options.callback && options.callback(index, slides[index]);

        } else {

          if (options.continuous) {

            move(circle(index-1), -width, speed);
            move(index, 0, speed);
            move(circle(index+1), width, speed);

          } else {

            move(index-1, -width, speed);
            move(index, 0, speed);
            move(index+1, width, speed);
          }

        }

      }

      // kill touchmove and touchend event listeners until touchstart called again
      element.removeEventListener('touchmove', events, false)
      element.removeEventListener('touchend', events, false)

    },
    transitionEnd: function(event) {

      if (parseInt(event.target.getAttribute('data-index'), 10) == index) {
        
        if (delay) begin();

        options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);

      }

    }

  }

  // trigger setup
  setup();

  // start auto slideshow if applicable
  if (delay) begin();


  // add event listeners
  if (browser.addEventListener) {
    
    // set touchstart event on element    
    if (browser.touch) element.addEventListener('touchstart', events, false);

    if (browser.transitions) {
      element.addEventListener('webkitTransitionEnd', events, false);
      element.addEventListener('msTransitionEnd', events, false);
      element.addEventListener('oTransitionEnd', events, false);
      element.addEventListener('otransitionend', events, false);
      element.addEventListener('transitionend', events, false);
    }

    // set resize event on window
    window.addEventListener('resize', events, false);

  } else {

    window.onresize = function () { setup() }; // to play nice with old IE

  }

  // expose the Swipe API
  return {
    setup: function() {

      setup();

    },
    slide: function(to, speed) {
      
      // cancel slideshow
      stop();
      
      slide(to, speed);

    },
    prev: function() {

      // cancel slideshow
      stop();

      prev();

    },
    next: function() {

      // cancel slideshow
      stop();

      next();

    },
    getPos: function() {

      // return current index position
      return index;

    },
    getNumSlides: function() {
      
      // return total number of slides
      return length;
    },
    kill: function() {

      // cancel slideshow
      stop();

      // reset element
      element.style.width = 'auto';
      element.style.left = 0;

      // reset slides
      var pos = slides.length;
      while(pos--) {

        var slide = slides[pos];
        slide.style.width = '100%';
        slide.style.left = 0;

        if (browser.transitions) translate(pos, 0, 0);

      }

      // removed event listeners
      if (browser.addEventListener) {

        // remove current event listeners
        element.removeEventListener('touchstart', events, false);
        element.removeEventListener('webkitTransitionEnd', events, false);
        element.removeEventListener('msTransitionEnd', events, false);
        element.removeEventListener('oTransitionEnd', events, false);
        element.removeEventListener('otransitionend', events, false);
        element.removeEventListener('transitionend', events, false);
        window.removeEventListener('resize', events, false);

      }
      else {

        window.onresize = null;

      }

    }
  }

}

module.exports = Swipe;

// if ( window.jQuery || window.Zepto ) {
//   (function($) {
//     $.fn.Swipe = function(params) {
//       return this.each(function() {
//         $(this).data('Swipe', new Swipe($(this)[0], params));
//       });
//     }
//   })( window.jQuery || window.Zepto )
// }
 
});
;define('common/swiper/index', function(require, exports, module){ var $ = require('zepto');
var Swipe = require('common/swipe/swipe');


function S(options) {
	this.$container = typeof options.container == 'string' ? $('#' + options.container) : options.container;
	this.$pager = typeof options.container == 'string' ? $('#' + options.pager) : options.pager;
	this.swipeOptions = options.swipeOptions;

	this._init();
};

S.prototype = {
	_init: function() {
		this._initSwipe();
	},
	/**
	 * 初始化滑动插件
	 * @return {[type]} [description]
	 */
	_initSwipe: function() {
		var self = this;
		var swipeOptions = $.extend({
			startSlide: 0,
			auto: 2500,
			continuous: true,
			disableScroll: false,
			stopPropagation: true,
			callback: function(index, element) {},
			transitionEnd: function(index, element) {
				self._changePager(index);
			}
		}, self.swipeOptions);

		self.swipe = Swipe(self.$container[0], swipeOptions);
		self._initPager(self.swipe.getNumSlides());
		self._changePager(swipeOptions.startSlide || 0);
	},
	/**
	 * 初始化页码
	 * @param  {[type]} length [description]
	 * @return {[type]}        [description]
	 */
	_initPager: function(length) {
		var self = this;
		var $pagerContent = self.$pager.find("span");
		var i = 1;
		var sLen = self.sLen = length;

		$pagerContent.html('<a href="javascript:;" class="sel"></a>');
		for (i; i < sLen; i++) {
			$pagerContent.append('<a href="javascript:;" class="nosel"></a>');
		}
	},
	/**
	 * 更改页码
	 * @param  {[type]} index [description]
	 * @return {[type]}       [description]
	 */
	_changePager: function(index) {
		var self = this;
		var $pager = self.$pager;
		var $pagerContent = self.$pager.find("span");
		var sLen = self.sLen;

		$pagerContent.children('a').attr("class", "nosel");
		if (sLen == 2 && index > 1) { //处理插件BUG
			switch (index) {
				case 2:
					$pagerContent.children('a').eq(0).attr("class", "sel");
					break;
				case 3:
					$pagerContent.children('a').eq(1).attr("class", "sel");
					break;
			}
		} else {
			$pagerContent.children('a').eq(index).attr("class", "sel");
		}
	}

};



// var bannerLength = 0,
// 	pictureName = new Array();

// var curOptions;

// function init(options) {
// 	curOptions = options;
// 	initSwipe();
// 	$("#bannerPager").children('label').text(pictureName[0]);
// }

// //初始化滑动插件
// function initSwipe() {
// 	var elem = document.getElementById("banner");

// 	window.mySwipe = Swipe(elem, {
// 		startSlide: 0,
// 		auto: 2500,
// 		continuous: true,
// 		disableScroll: false,
// 		stopPropagation: true,
// 		callback: function(index, element) {},
// 		transitionEnd: function(index, element) {
// 			changeBannerPager(index);
// 		}
// 	});
// 	initBannerPager(mySwipe.getNumSlides());
// }
// //写入banner页数
// function initBannerPager(length) {
// 	var i = 1;
// 	bannerLength = length;

// 	$("#bannerPager").find("span").html('<a href="javascript:;" class="sel"></a>');
// 	for (i; i < bannerLength; i++) {
// 		$("#bannerPager").find("span").append('<a href="javascript:;" class="nosel"></a>');
// 	}
// }
// //banner页数标记改变
// function changeBannerPager(index) {
// 	$("#bannerPager").find("span").children('a').attr("class", "nosel");
// 	if (bannerLength == 2 && index > 1) { //处理插件BUG
// 		switch (index) {
// 			case 2:
// 				$("#bannerPager").find("span").children('a').eq(0).attr("class", "sel");
// 				$("#bannerPager").children('label').text(pictureName[0]);
// 				break;
// 			case 3:
// 				$("#bannerPager").find("span").children('a').eq(1).attr("class", "sel");
// 				$("#bannerPager").children('label').text(pictureName[1]);
// 				break;
// 		}
// 	} else {
// 		$("#bannerPager").find("span").children('a').eq(index).attr("class", "sel");
// 		$("#bannerPager").children('label').text(pictureName[index]);
// 	}
// }

module.exports = S; 
});
;define('common/preview/index', function(require, exports, module){ var $ = require('zepto');
var Swiper = require('common/swiper/index');

var _tmpl = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="preview-container">\r\n\t<div class="preview-close"></div>\r\n\t<div id="banner" class=\'J-banner swipe\'>\r\n\t\t<div class="swipe-wrap">\r\n\t\t\t';
 $.each(imgArr, function(i, imgUrl){ 
__p+='\r\n\t\t\t<div>\r\n\t\t\t\t<a>\r\n\t\t\t\t\t<div class="img-wrap">\r\n\t\t\t\t\t\t<div class="img-inner">\r\n\t\t\t\t\t\t\t<div class="img-table">\r\n\t\t\t\t\t\t\t\t<div class="img-v">\r\n\t\t\t\t\t\t\t\t\t<img src="'+
((__t=( imgUrl ))==null?'':__t)+
'" />\r\n\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</a>\r\n\t\t\t</div>\r\n\t\t    ';
 }) 
__p+='\r\n\t    </div>\r\n\t    <div id="bannerPager" class="J-bannerPager"><span id="page"></span></div>\r\n\t</div>\r\n</div>';
}
return __p;
};
var $el, $close;
var S;


function show(imgArr, i) {
	var index = i || 0;

	$(document.body).append($el = $(_tmpl({
		imgArr: imgArr
	})));
	$close = $el.find('.preview-close');
	
	$close.on('click', close);

	S = new Swiper({
		container: $el.find('.J-banner'),
		pager: $el.find('.J-bannerPager'),
		swipeOptions: {
			auto: 0,
			continuous: false,
			startSlide: index
		}
	});

}

function close() {
	S.swipe.kill();
	$el.remove();
}

module.exports = {
	show: show
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
;define('common/comment-section/index', function(require, exports, module){ var $ = require('zepto');
var Ajax = require('common/ajax/index');
var Preview = require('common/preview/index');
var PageLoader = require('common/page-loader/index');
var Util = require('common/util/index');
var Bubble = require('common/bubble/bubble');

var isInitSupport = false; //是否初始化过赞数据
var productId, productName;

var $discussList = $('#J-discuss-list');

/**
 * 初始化
 * @return {[type]} [description]
 */
function init(options) {
	options = options || {};
	productId = options.id || Util.getParam('g');
	productName = options.name || $('.item-title').text();

	addEvent();
	initPageLoader();
	initSupport();
}

/**
 * 添加事件监听
 */
function addEvent() {
	$('#J-support-btn').on('click', support);
	$discussList.on('click', '.img-list > li', previewImg);
	$discussList.on('click', '.yes-bar', discussSupport);
	$('#J-layer-btn').on('click', showLayer);
	$(document.body).on('click', function() {
		$('#J-layer-btn').parent().removeClass('show');
	});
}

function showLayer(evt) {
	evt.stopPropagation();

	var $parent = $(this).parent();

	if ($parent.hasClass('show')) {
		$parent.removeClass('show');
	} else {
		$parent.addClass('show');
	}
}

/**
 * 初始化分页
 * @return {[type]} [description]
 */
function initPageLoader() {
	var ajaxUrl = $('#J-ajaxurl-moreComment').val();

	if (!ajaxUrl) {
		return;
	}
	new PageLoader({
		container: '#J-discuss-list',
		seeMore: '.see-more',
		getHtml: function(pageNum, back) {

			new Ajax().send({
				url: ajaxUrl,
				data: {
					g: productId,
					page: pageNum
				}
			}, function(result) {
				var list = result.commentlist.data;

				if (list.length == 0 && pageNum == 1) { //无数据
					$('#J-discuss-list').parent().addClass('empty');
				}

				if (pageNum == 1) { //初始化总评论数
					$('#J-discuss-amount').text(result.commentlist.total_num);
					resetLayer({
						canComment: result.commentlist.canComment,
						link: result.commentlist.commentUrl
					});
				}


				back && back(function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='';
 $.each(list, function(i, item){  
__p+='\r\n<li>\r\n\t<div class="img-wrap" style="background-image:url('+
((__t=( item.head_sculpture ))==null?'':__t)+
')"></div>\r\n\t<div class="info">\r\n\t\t<div class="name-wrap">\r\n\t\t\t<label class="name">'+
((__t=( item.customer_name ))==null?'':__t)+
'</label>\r\n\t\t\t<span item-id="'+
((__t=( item.id ))==null?'':__t)+
'" class="yes-bar '+
((__t=( item.isSupport?'active':'' ))==null?'':__t)+
'"><i class="icon-yes"></i><b>'+
((__t=( item.comment_praise_num ))==null?'':__t)+
'</b></span>\r\n\t\t</div>\r\n\t\t<div class="star-wrap">\r\n\t\t\t<div class="star-bar">\r\n\t\t\t\t<div class="star-gray"></div>\r\n\t\t\t\t<div class="star-inner" style="width:'+
((__t=( item.product_score/5*100 ))==null?'':__t)+
'%;">\r\n\t\t\t\t\t<div class="star-active"></div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t\t<span class="date">'+
((__t=( item.create_time ))==null?'':__t)+
'</span>\r\n\t\t</div>\r\n\t\t<p class="cotent">'+
((__t=( item.comment_content ))==null?'':__t)+
'</p>\r\n\t\t';
 if(item.imgList && item.imgList.length > 0){ 
__p+='\r\n\t\t<ul class="img-list">\r\n\t\t\t';
 $.each(item.imgList, function(i, imgUrl){ 
__p+='\r\n\t\t\t<li style="background-image:url('+
((__t=( imgUrl ))==null?'':__t)+
')"></li>\r\n\t\t\t';
 }) 
__p+='\r\n\t\t</ul>\r\n\t\t';
 } 
__p+='\r\n\t\t';
 $.each(item.reply, function(index, replyItem){ 
__p+='\r\n\t\t<p class="cotent-replay"><b>'+
((__t=( replyItem.reply_user ))==null?'':__t)+
'</b>回复<b>'+
((__t=( item.customer_name ))==null?'':__t)+
'</b>：'+
((__t=( replyItem.back_content ))==null?'':__t)+
'</p>\r\n\t\t';
 }) 
__p+='\r\n\t</div>\r\n</li>\r\n';
 }) 
__p+='';
}
return __p;
}({
					list: list
				}), result.commentlist.total_num);
			});


		}
	}).loadFirst().loadEnd(function() {
		$('.see-more').remove();
	});
}

function resetLayer(obj) {
	var $layer = $('#J-discuss-layer');

	if (obj.canComment == 1) { //可以评论
		$layer.find('.J-comment').attr('href', obj.link);
		$layer.css('display', 'block');
	}
}

/**
 * 初始化点赞相关数据
 * @return {[type]} [description]
 */
function initSupport() {
	var ajaxUrl = $('#J-ajaxurl-initProductLikeData').val();

	if (!ajaxUrl) {
		return;
	}
	new Ajax().send({
		url: ajaxUrl,
		data: {
			g: productId
		}
	}, function(result) {
		var $btn = $('#J-support-btn');
		var $supportList = $('.support-list');

		isInitSupport = true;

		if (result.isSupport) {
			$btn.addClass('active');
		}
		$btn.find('.J-num').text(result.supportTotal);
		$supportList.html(function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='';
 $.each(list, function(i, item){ 
__p+='\r\n<li style="background-image:url('+
((__t=( item.headImg ))==null?'':__t)+
')"></li>\r\n';
 }) 
__p+='';
}
return __p;
}({
			list: result.supportList
		}));
		if (result.supportList.length > 0) {
			$supportList.css('display', 'block');
		}
	});
}

/**
 * 点赞
 * @return {[type]} [description]
 */
function support() {
	var $cur = $(this);
	var $num = $cur.find('.J-num');

	if (!isInitSupport) {
		return false;
	}
	if ($cur.hasClass('active')) {
		Bubble.show('您已赞过，不能重复点赞');
		return;
	}
	$cur.addClass('active');
	$num.text(parseInt($num.text(), 10) + 1);
	new Ajax().send(Ajax.formatAjaxParams($cur), function(result) {
		if (result.headImg) {
			$('.support-list').prepend('<li style="background-image:url(' + result.headImg + ')"></li>').css('display', 'block');
		}
	});
}

/**
 * 评论点赞
 * @return {[type]} [description]
 */
function discussSupport() {
	var $cur = $(this);
	var $num = $cur.find('b');

	if ($cur.hasClass('active')) {
		return;
	}
	$cur.addClass('active');
	$num.text(+$num.text() + 1);
	new Ajax().send({
		url: '/Mall/Goods/setCommentLike',
		data: {
			id: $cur.attr('item-id')
		}
	}, function() {});
}

/**
 * 预览图片
 * @return {[type]} [description]
 */
function previewImg() {
	var $cur = $(this);
	var imgArr = [],
		curIndex = 0;

	$cur.parent().children().each(function(i, img) {
		if ($cur[0] == img) {
			curIndex = i;
		}
		imgArr.push($(img).css('background-image').match(/url\((.*)\)/)[1]);
	});
	Preview.show(imgArr, curIndex);
}

module.exports = {
	init: init
}; 
});
;define('danpin/index/index', function(require, exports, module){ var $ = require('zepto');
var Ajax = require('common/ajax/index');
var JAjax = require('common/j-ajax/index');
var Guide = require('common/guide/guide');
var Alert = require('common/alert/alert');
var Timer = require('common/timer/timer');
var Util = require('common/util/index');
var JDisabled = require('common/j-disabled/index');
var Bullet = require('common/bullet/index');
var CommentSection = require('common/comment-section/index');

var productId = $('#J-product-id').val();
var firRank = true; //首次进入排队流程

init();

function init() {
	addEvent();
	initPreTimer();

	CommentSection.init({
		id: productId,
		name: $('#J-product-name').val()
	});

	JAjax.init();
	JDisabled.init();
	new Guide('#J-invite-btn', 'guide-klj', '邀请好友来参与活动吧～<br/><i>怎么邀请？你懂得！</i>');

	if ($(document.body).attr('is-over') == 1) {
		remindOver(1);
	}
}

function addEvent() {
	$('.J-remind-btn').on('click', function(){remindOver(2)}); //开抢提醒
	$('#J-award-guide').on('click', function() {
		$(this).remove();
	});
	$('.J-quick-buy').on('click', quickBuy);
}

/**
 * 购买
 * @return {[type]} [description]
 */
function quickBuy(evt) {
	evt.preventDefault();

	var $el = $(this),
		$form = $('#' + $el.attr('form'));

	$el.trigger('disabled:click');
	buyRank(function() {

		new Ajax().send({
			url: $form.attr('action'),
			type: $form.attr('method'),
			data: $form.serialize()
		}, function(result) {

		}, function() { //购买异常
			$el.trigger('disabled:ok');
		});

	}, function() {
		$el.trigger('disabled:ok');
	});
}

/**
 * 购买排队
 * @return {[type]} [description]
 */
function buyRank(sucBack, errorBack) {
	new Ajax().send({
		url: '/Activity/DanPin/addQueue'
	}, function(result) {
		if (result == 0) { //进入购买流程
			sucBack && sucBack();
		} else { //进入排队流程
			if (firRank) {
				Alert.show(function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="rank-alert-panel">\r\n\t<div class="img-wrap"></div>\r\n\t<p>努力排队中...</p>\r\n</div>';
}
return __p;
}(), false, 'rank-alert');
				firRank = false;
			}

			setTimeout(function() {
				buyRank(sucBack, errorBack);
			}, 1000);
		}
	}, function() { //接口异常
		errorBack && errorBack();
	});
}

/**
 * 结束提醒
 * @param type 1 结束没有关闭按钮，2预约有关闭按钮
 * @return {[type]} [description]
 */
function remindOver(type) {
	var $bulletContainer;
	var closeBut = (type == 1) ? false : true;
	Alert.show($('#J-remind-over').html(), closeBut, 'remind-over');

	$bulletContainer = $('#J-bullet-screen').css('top', '-' + $('#J-alert-content-wrap').css('margin-top'));
	// new Bullet($bulletContainer, ['123', '4556']).start();
	// return;

	//获取评论第二页数据
	new Ajax().send({
		url: '/Mall/Goods/moreComment',
		data: {
			g: productId,
			page: 2
		}
	}, function(result) {
		var list = result.commentlist.data;

		if (!list || list.length <= 0) {
			return;
		}
		new Bullet($bulletContainer, list.map(function(item, i) {
			return item['customer_name'] + '：' + item['comment_content'];
		})).start();
	});

	new Guide('#J-share-friend', 'guide-klj', '邀请好友来参与活动吧～<br/><i>怎么邀请？你懂得！</i>');
}

/**
 * 开抢提醒
 * @return {[type]} [description]
 */
function remind() {
	new Ajax().send({
		url: '/Activity/DanPin/subscribeQrCode',
		data: {
			pid: Util.getParam('pid'),
			did: Util.getParam('did'),
			recommend: Util.getParam('recommend')
		}
	}, function(result) {

		Alert.show(function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="remind-panel">\r\n\t<h3>开抢提醒</h3>\r\n\t<p class="pre-tip">关注商城获得开抢提醒</p>\r\n\t<div class="img-erwei">\r\n\t\t<img src="'+
((__t=( qrcode ))==null?'':__t)+
'" />\r\n\t\t<div class="logo"><img src="http://cdn0.taojinzi.com/static/images/logo_2a50656.png" /></div>\r\n\t</div>\r\n\t<p class="tip">长按二维码，扫描关注</p>\r\n</div>';
}
return __p;
}({
			qrcode: result.url
		}), true, 'remind-alert');

	});
}

/**
 * 初始化预热倒计时
 * @return {[type]} [description]
 */
function initPreTimer() {
	var isPre = $(document.body).hasClass('pre');

	if (!isPre) {
		start();
		return;
	}
	var timer = new Timer('#J-pre-timer', function() {
		var self = this;
		return (self.day > 0 ? (Timer.addZero(self.day) + '天 ') : '') + Timer.addZero(self.hour) + ':' + Timer.addZero(self.min) + ':' + Timer.addZero(self.sec);
	});
	timer.start().end(function() {
		location.reload();
	});
}

/**
 * 启动获取红包数据定时器
 * @return {[type]} [description]
 */
function start() {
	rendSendMoney();
	setTimeout(start, 5000);
}

/**
 * 渲染已发送红包数额
 * @param  {[type]} back [description]
 * @return {[type]}      [description]
 */
function rendSendMoney(back) {
	new Ajax().send({
		url: '/Activity/DanPin/alreadySendRedPackage'
	}, function(result) {
		var $money = $('#J-send-money');

		if (result.redPackage != $money.text()) {
			$money.html(result.redPackage).addClass('money-ani');
			setTimeout(function() {
				$('#J-send-money').removeClass('money-ani');
			}, 1000);
		}
		back && back();
	});
} 
});