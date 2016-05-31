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
;define('common/lrz/index', function(require, exports, module){ !function(e){function t(r){if(n[r])return n[r].exports;var i=n[r]={exports:{},id:r,loaded:!1};return e[r].call(i.exports,i,i.exports,t),i.loaded=!0,i.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){n(5),n(6),e.exports=n(7)},function(e,t,n){(function(t){!function(n){function r(e,t){return function(){e.apply(t,arguments)}}function i(e){if("object"!=typeof this)throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=null,this._value=null,this._deferreds=[],l(e,r(a,this),r(s,this))}function o(e){var t=this;return null===this._state?void this._deferreds.push(e):void f(function(){var n=t._state?e.onFulfilled:e.onRejected;if(null===n)return void(t._state?e.resolve:e.reject)(t._value);var r;try{r=n(t._value)}catch(i){return void e.reject(i)}e.resolve(r)})}function a(e){try{if(e===this)throw new TypeError("A promise cannot be resolved with itself.");if(e&&("object"==typeof e||"function"==typeof e)){var t=e.then;if("function"==typeof t)return void l(r(t,e),r(a,this),r(s,this))}this._state=!0,this._value=e,c.call(this)}catch(n){s.call(this,n)}}function s(e){this._state=!1,this._value=e,c.call(this)}function c(){for(var e=0,t=this._deferreds.length;t>e;e++)o.call(this,this._deferreds[e]);this._deferreds=null}function u(e,t,n,r){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof t?t:null,this.resolve=n,this.reject=r}function l(e,t,n){var r=!1;try{e(function(e){r||(r=!0,t(e))},function(e){r||(r=!0,n(e))})}catch(i){if(r)return;r=!0,n(i)}}var f="function"==typeof t&&t||function(e){setTimeout(e,1)},h=Array.isArray||function(e){return"[object Array]"===Object.prototype.toString.call(e)};i.prototype["catch"]=function(e){return this.then(null,e)},i.prototype.then=function(e,t){var n=this;return new i(function(r,i){o.call(n,new u(e,t,r,i))})},i.all=function(){var e=Array.prototype.slice.call(1===arguments.length&&h(arguments[0])?arguments[0]:arguments);return new i(function(t,n){function r(o,a){try{if(a&&("object"==typeof a||"function"==typeof a)){var s=a.then;if("function"==typeof s)return void s.call(a,function(e){r(o,e)},n)}e[o]=a,0===--i&&t(e)}catch(c){n(c)}}if(0===e.length)return t([]);for(var i=e.length,o=0;o<e.length;o++)r(o,e[o])})},i.resolve=function(e){return e&&"object"==typeof e&&e.constructor===i?e:new i(function(t){t(e)})},i.reject=function(e){return new i(function(t,n){n(e)})},i.race=function(e){return new i(function(t,n){for(var r=0,i=e.length;i>r;r++)e[r].then(t,n)})},i._setImmediateFn=function(e){f=e},i.prototype.always=function(e){var t=this.constructor;return this.then(function(n){return t.resolve(e()).then(function(){return n})},function(n){return t.resolve(e()).then(function(){throw n})})},"undefined"!=typeof e&&e.exports?e.exports=i:n.Promise||(n.Promise=i)}(this)}).call(t,n(2).setImmediate)},function(e,t,n){(function(e,r){function i(e,t){this._id=e,this._clearFn=t}var o=n(3).nextTick,a=Function.prototype.apply,s=Array.prototype.slice,c={},u=0;t.setTimeout=function(){return new i(a.call(setTimeout,window,arguments),clearTimeout)},t.setInterval=function(){return new i(a.call(setInterval,window,arguments),clearInterval)},t.clearTimeout=t.clearInterval=function(e){e.close()},i.prototype.unref=i.prototype.ref=function(){},i.prototype.close=function(){this._clearFn.call(window,this._id)},t.enroll=function(e,t){clearTimeout(e._idleTimeoutId),e._idleTimeout=t},t.unenroll=function(e){clearTimeout(e._idleTimeoutId),e._idleTimeout=-1},t._unrefActive=t.active=function(e){clearTimeout(e._idleTimeoutId);var t=e._idleTimeout;t>=0&&(e._idleTimeoutId=setTimeout(function(){e._onTimeout&&e._onTimeout()},t))},t.setImmediate="function"==typeof e?e:function(e){var n=u++,r=arguments.length<2?!1:s.call(arguments,1);return c[n]=!0,o(function(){c[n]&&(r?e.apply(null,r):e.call(null),t.clearImmediate(n))}),n},t.clearImmediate="function"==typeof r?r:function(e){delete c[e]}}).call(t,n(2).setImmediate,n(2).clearImmediate)},function(e,t){function n(){u=!1,a.length?c=a.concat(c):l=-1,c.length&&r()}function r(){if(!u){var e=setTimeout(n);u=!0;for(var t=c.length;t;){for(a=c,c=[];++l<t;)a&&a[l].run();l=-1,t=c.length}a=null,u=!1,clearTimeout(e)}}function i(e,t){this.fun=e,this.array=t}function o(){}var a,s=e.exports={},c=[],u=!1,l=-1;s.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];c.push(new i(e,t)),1!==c.length||u||setTimeout(r,0)},i.prototype.run=function(){this.fun.apply(null,this.array)},s.title="browser",s.browser=!0,s.env={},s.argv=[],s.version="",s.versions={},s.on=o,s.addListener=o,s.once=o,s.off=o,s.removeListener=o,s.removeAllListeners=o,s.emit=o,s.binding=function(e){throw new Error("process.binding is not supported")},s.cwd=function(){return"/"},s.chdir=function(e){throw new Error("process.chdir is not supported")},s.umask=function(){return 0}},function(e,t,n){var r,i;(function(){function n(e){return!!e.exifdata}function o(e,t){t=t||e.match(/^data\:([^\;]+)\;base64,/im)[1]||"",e=e.replace(/^data\:([^\;]+)\;base64,/gim,"");for(var n=atob(e),r=n.length,i=new ArrayBuffer(r),o=new Uint8Array(i),a=0;r>a;a++)o[a]=n.charCodeAt(a);return i}function a(e,t){var n=new XMLHttpRequest;n.open("GET",e,!0),n.responseType="blob",n.onload=function(e){(200==this.status||0===this.status)&&t(this.response)},n.send()}function s(e,t){function n(n){var r=c(n),i=u(n);e.exifdata=r||{},e.iptcdata=i||{},t&&t.call(e)}if(e.src)if(/^data\:/i.test(e.src)){var r=o(e.src);n(r)}else if(/^blob\:/i.test(e.src)){var i=new FileReader;i.onload=function(e){n(e.target.result)},a(e.src,function(e){i.readAsArrayBuffer(e)})}else{var s=new XMLHttpRequest;s.onload=function(){200==this.status||0===this.status?n(s.response):t(new Error("Could not load image")),s=null},s.open("GET",e.src,!0),s.responseType="arraybuffer",s.send(null)}else if(window.FileReader&&(e instanceof window.Blob||e instanceof window.File)){var i=new FileReader;i.onload=function(e){m&&console.log("Got file of length "+e.target.result.byteLength),n(e.target.result)},i.readAsArrayBuffer(e)}}function c(e){var t=new DataView(e);if(m&&console.log("Got file of length "+e.byteLength),255!=t.getUint8(0)||216!=t.getUint8(1))return m&&console.log("Not a valid JPEG"),!1;for(var n,r=2,i=e.byteLength;i>r;){if(255!=t.getUint8(r))return m&&console.log("Not a valid marker at offset "+r+", found: "+t.getUint8(r)),!1;if(n=t.getUint8(r+1),m&&console.log(n),225==n)return m&&console.log("Found 0xFFE1 marker"),g(t,r+4,t.getUint16(r+2)-2);r+=2+t.getUint16(r+2)}}function u(e){var t=new DataView(e);if(m&&console.log("Got file of length "+e.byteLength),255!=t.getUint8(0)||216!=t.getUint8(1))return m&&console.log("Not a valid JPEG"),!1;for(var n=2,r=e.byteLength,i=function(e,t){return 56===e.getUint8(t)&&66===e.getUint8(t+1)&&73===e.getUint8(t+2)&&77===e.getUint8(t+3)&&4===e.getUint8(t+4)&&4===e.getUint8(t+5)};r>n;){if(i(t,n)){var o=t.getUint8(n+7);o%2!==0&&(o+=1),0===o&&(o=4);var a=n+8+o,s=t.getUint16(n+6+o);return l(e,a,s)}n++}}function l(e,t,n){for(var r,i,o,a,s,c=new DataView(e),u={},l=t;t+n>l;)28===c.getUint8(l)&&2===c.getUint8(l+1)&&(a=c.getUint8(l+2),a in b&&(o=c.getInt16(l+3),s=o+5,i=b[a],r=d(c,l+5,o),u.hasOwnProperty(i)?u[i]instanceof Array?u[i].push(r):u[i]=[u[i],r]:u[i]=r)),l++;return u}function f(e,t,n,r,i){var o,a,s,c=e.getUint16(n,!i),u={};for(s=0;c>s;s++)o=n+12*s+2,a=r[e.getUint16(o,!i)],!a&&m&&console.log("Unknown tag: "+e.getUint16(o,!i)),u[a]=h(e,o,t,n,i);return u}function h(e,t,n,r,i){var o,a,s,c,u,l,f=e.getUint16(t+2,!i),h=e.getUint32(t+4,!i),g=e.getUint32(t+8,!i)+n;switch(f){case 1:case 7:if(1==h)return e.getUint8(t+8,!i);for(o=h>4?g:t+8,a=[],c=0;h>c;c++)a[c]=e.getUint8(o+c);return a;case 2:return o=h>4?g:t+8,d(e,o,h-1);case 3:if(1==h)return e.getUint16(t+8,!i);for(o=h>2?g:t+8,a=[],c=0;h>c;c++)a[c]=e.getUint16(o+2*c,!i);return a;case 4:if(1==h)return e.getUint32(t+8,!i);for(a=[],c=0;h>c;c++)a[c]=e.getUint32(g+4*c,!i);return a;case 5:if(1==h)return u=e.getUint32(g,!i),l=e.getUint32(g+4,!i),s=new Number(u/l),s.numerator=u,s.denominator=l,s;for(a=[],c=0;h>c;c++)u=e.getUint32(g+8*c,!i),l=e.getUint32(g+4+8*c,!i),a[c]=new Number(u/l),a[c].numerator=u,a[c].denominator=l;return a;case 9:if(1==h)return e.getInt32(t+8,!i);for(a=[],c=0;h>c;c++)a[c]=e.getInt32(g+4*c,!i);return a;case 10:if(1==h)return e.getInt32(g,!i)/e.getInt32(g+4,!i);for(a=[],c=0;h>c;c++)a[c]=e.getInt32(g+8*c,!i)/e.getInt32(g+4+8*c,!i);return a}}function d(e,t,n){var r,i="";for(r=t;t+n>r;r++)i+=String.fromCharCode(e.getUint8(r));return i}function g(e,t){if("Exif"!=d(e,t,4))return m&&console.log("Not valid EXIF data! "+d(e,t,4)),!1;var n,r,i,o,a,s=t+6;if(18761==e.getUint16(s))n=!1;else{if(19789!=e.getUint16(s))return m&&console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)"),!1;n=!0}if(42!=e.getUint16(s+2,!n))return m&&console.log("Not valid TIFF data! (no 0x002A)"),!1;var c=e.getUint32(s+4,!n);if(8>c)return m&&console.log("Not valid TIFF data! (First offset less than 8)",e.getUint32(s+4,!n)),!1;if(r=f(e,s,s+c,v,n),r.ExifIFDPointer){o=f(e,s,s+r.ExifIFDPointer,w,n);for(i in o){switch(i){case"LightSource":case"Flash":case"MeteringMode":case"ExposureProgram":case"SensingMethod":case"SceneCaptureType":case"SceneType":case"CustomRendered":case"WhiteBalance":case"GainControl":case"Contrast":case"Saturation":case"Sharpness":case"SubjectDistanceRange":case"FileSource":o[i]=S[i][o[i]];break;case"ExifVersion":case"FlashpixVersion":o[i]=String.fromCharCode(o[i][0],o[i][1],o[i][2],o[i][3]);break;case"ComponentsConfiguration":o[i]=S.Components[o[i][0]]+S.Components[o[i][1]]+S.Components[o[i][2]]+S.Components[o[i][3]]}r[i]=o[i]}}if(r.GPSInfoIFDPointer){a=f(e,s,s+r.GPSInfoIFDPointer,y,n);for(i in a){switch(i){case"GPSVersionID":a[i]=a[i][0]+"."+a[i][1]+"."+a[i][2]+"."+a[i][3]}r[i]=a[i]}}return r}var m=!1,p=function(e){return e instanceof p?e:this instanceof p?void(this.EXIFwrapped=e):new p(e)};"undefined"!=typeof e&&e.exports&&(t=e.exports=p),t.EXIF=p;var w=p.Tags={36864:"ExifVersion",40960:"FlashpixVersion",40961:"ColorSpace",40962:"PixelXDimension",40963:"PixelYDimension",37121:"ComponentsConfiguration",37122:"CompressedBitsPerPixel",37500:"MakerNote",37510:"UserComment",40964:"RelatedSoundFile",36867:"DateTimeOriginal",36868:"DateTimeDigitized",37520:"SubsecTime",37521:"SubsecTimeOriginal",37522:"SubsecTimeDigitized",33434:"ExposureTime",33437:"FNumber",34850:"ExposureProgram",34852:"SpectralSensitivity",34855:"ISOSpeedRatings",34856:"OECF",37377:"ShutterSpeedValue",37378:"ApertureValue",37379:"BrightnessValue",37380:"ExposureBias",37381:"MaxApertureValue",37382:"SubjectDistance",37383:"MeteringMode",37384:"LightSource",37385:"Flash",37396:"SubjectArea",37386:"FocalLength",41483:"FlashEnergy",41484:"SpatialFrequencyResponse",41486:"FocalPlaneXResolution",41487:"FocalPlaneYResolution",41488:"FocalPlaneResolutionUnit",41492:"SubjectLocation",41493:"ExposureIndex",41495:"SensingMethod",41728:"FileSource",41729:"SceneType",41730:"CFAPattern",41985:"CustomRendered",41986:"ExposureMode",41987:"WhiteBalance",41988:"DigitalZoomRation",41989:"FocalLengthIn35mmFilm",41990:"SceneCaptureType",41991:"GainControl",41992:"Contrast",41993:"Saturation",41994:"Sharpness",41995:"DeviceSettingDescription",41996:"SubjectDistanceRange",40965:"InteroperabilityIFDPointer",42016:"ImageUniqueID"},v=p.TiffTags={256:"ImageWidth",257:"ImageHeight",34665:"ExifIFDPointer",34853:"GPSInfoIFDPointer",40965:"InteroperabilityIFDPointer",258:"BitsPerSample",259:"Compression",262:"PhotometricInterpretation",274:"Orientation",277:"SamplesPerPixel",284:"PlanarConfiguration",530:"YCbCrSubSampling",531:"YCbCrPositioning",282:"XResolution",283:"YResolution",296:"ResolutionUnit",273:"StripOffsets",278:"RowsPerStrip",279:"StripByteCounts",513:"JPEGInterchangeFormat",514:"JPEGInterchangeFormatLength",301:"TransferFunction",318:"WhitePoint",319:"PrimaryChromaticities",529:"YCbCrCoefficients",532:"ReferenceBlackWhite",306:"DateTime",270:"ImageDescription",271:"Make",272:"Model",305:"Software",315:"Artist",33432:"Copyright"},y=p.GPSTags={0:"GPSVersionID",1:"GPSLatitudeRef",2:"GPSLatitude",3:"GPSLongitudeRef",4:"GPSLongitude",5:"GPSAltitudeRef",6:"GPSAltitude",7:"GPSTimeStamp",8:"GPSSatellites",9:"GPSStatus",10:"GPSMeasureMode",11:"GPSDOP",12:"GPSSpeedRef",13:"GPSSpeed",14:"GPSTrackRef",15:"GPSTrack",16:"GPSImgDirectionRef",17:"GPSImgDirection",18:"GPSMapDatum",19:"GPSDestLatitudeRef",20:"GPSDestLatitude",21:"GPSDestLongitudeRef",22:"GPSDestLongitude",23:"GPSDestBearingRef",24:"GPSDestBearing",25:"GPSDestDistanceRef",26:"GPSDestDistance",27:"GPSProcessingMethod",28:"GPSAreaInformation",29:"GPSDateStamp",30:"GPSDifferential"},S=p.StringValues={ExposureProgram:{0:"Not defined",1:"Manual",2:"Normal program",3:"Aperture priority",4:"Shutter priority",5:"Creative program",6:"Action program",7:"Portrait mode",8:"Landscape mode"},MeteringMode:{0:"Unknown",1:"Average",2:"CenterWeightedAverage",3:"Spot",4:"MultiSpot",5:"Pattern",6:"Partial",255:"Other"},LightSource:{0:"Unknown",1:"Daylight",2:"Fluorescent",3:"Tungsten (incandescent light)",4:"Flash",9:"Fine weather",10:"Cloudy weather",11:"Shade",12:"Daylight fluorescent (D 5700 - 7100K)",13:"Day white fluorescent (N 4600 - 5400K)",14:"Cool white fluorescent (W 3900 - 4500K)",15:"White fluorescent (WW 3200 - 3700K)",17:"Standard light A",18:"Standard light B",19:"Standard light C",20:"D55",21:"D65",22:"D75",23:"D50",24:"ISO studio tungsten",255:"Other"},Flash:{0:"Flash did not fire",1:"Flash fired",5:"Strobe return light not detected",7:"Strobe return light detected",9:"Flash fired, compulsory flash mode",13:"Flash fired, compulsory flash mode, return light not detected",15:"Flash fired, compulsory flash mode, return light detected",16:"Flash did not fire, compulsory flash mode",24:"Flash did not fire, auto mode",25:"Flash fired, auto mode",29:"Flash fired, auto mode, return light not detected",31:"Flash fired, auto mode, return light detected",32:"No flash function",65:"Flash fired, red-eye reduction mode",69:"Flash fired, red-eye reduction mode, return light not detected",71:"Flash fired, red-eye reduction mode, return light detected",73:"Flash fired, compulsory flash mode, red-eye reduction mode",77:"Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",79:"Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",89:"Flash fired, auto mode, red-eye reduction mode",93:"Flash fired, auto mode, return light not detected, red-eye reduction mode",95:"Flash fired, auto mode, return light detected, red-eye reduction mode"},SensingMethod:{1:"Not defined",2:"One-chip color area sensor",3:"Two-chip color area sensor",4:"Three-chip color area sensor",5:"Color sequential area sensor",7:"Trilinear sensor",8:"Color sequential linear sensor"},SceneCaptureType:{0:"Standard",1:"Landscape",2:"Portrait",3:"Night scene"},SceneType:{1:"Directly photographed"},CustomRendered:{0:"Normal process",1:"Custom process"},WhiteBalance:{0:"Auto white balance",1:"Manual white balance"},GainControl:{0:"None",1:"Low gain up",2:"High gain up",3:"Low gain down",4:"High gain down"},Contrast:{0:"Normal",1:"Soft",2:"Hard"},Saturation:{0:"Normal",1:"Low saturation",2:"High saturation"},Sharpness:{0:"Normal",1:"Soft",2:"Hard"},SubjectDistanceRange:{0:"Unknown",1:"Macro",2:"Close view",3:"Distant view"},FileSource:{3:"DSC"},Components:{0:"",1:"Y",2:"Cb",3:"Cr",4:"R",5:"G",6:"B"}},b={120:"caption",110:"credit",25:"keywords",55:"dateCreated",80:"byline",85:"bylineTitle",122:"captionWriter",105:"headline",116:"copyright",15:"category"};p.getData=function(e,t){return(e instanceof Image||e instanceof HTMLImageElement)&&!e.complete?!1:(n(e)?t&&t.call(e):s(e,t),!0)},p.getTag=function(e,t){return n(e)?e.exifdata[t]:void 0},p.getAllTags=function(e){if(!n(e))return{};var t,r=e.exifdata,i={};for(t in r)r.hasOwnProperty(t)&&(i[t]=r[t]);return i},p.pretty=function(e){if(!n(e))return"";var t,r=e.exifdata,i="";for(t in r)r.hasOwnProperty(t)&&(i+="object"==typeof r[t]?r[t]instanceof Number?t+" : "+r[t]+" ["+r[t].numerator+"/"+r[t].denominator+"]\r\n":t+" : ["+r[t].length+" values]\r\n":t+" : "+r[t]+"\r\n");return i},p.readFromBinaryFile=function(e){return c(e)},r=[],i=function(){return p}.apply(t,r),!(void 0!==i&&(e.exports=i))}).call(this)},function(e,t,n){var r,i;!function(){function n(e){var t=e.naturalWidth,n=e.naturalHeight;if(t*n>1048576){var r=document.createElement("canvas");r.width=r.height=1;var i=r.getContext("2d");return i.drawImage(e,-t+1,0),0===i.getImageData(0,0,1,1).data[3]}return!1}function o(e,t,n){var r=document.createElement("canvas");r.width=1,r.height=n;var i=r.getContext("2d");i.drawImage(e,0,0);for(var o=i.getImageData(0,0,1,n).data,a=0,s=n,c=n;c>a;){var u=o[4*(c-1)+3];0===u?s=c:a=c,c=s+a>>1}var l=c/n;return 0===l?1:l}function a(e,t,n){var r=document.createElement("canvas");return s(e,r,t,n),r.toDataURL("image/jpeg",t.quality||.8)}function s(e,t,r,i){var a=e.naturalWidth,s=e.naturalHeight,u=r.width,l=r.height,f=t.getContext("2d");f.save(),c(t,f,u,l,r.orientation);var h=n(e);h&&(a/=2,s/=2);var d=1024,g=document.createElement("canvas");g.width=g.height=d;for(var m=g.getContext("2d"),p=i?o(e,a,s):1,w=Math.ceil(d*u/a),v=Math.ceil(d*l/s/p),y=0,S=0;s>y;){for(var b=0,I=0;a>b;)m.clearRect(0,0,d,d),m.drawImage(e,-b,-y),f.drawImage(g,0,0,d,d,I,S,w,v),b+=d,I+=w;y+=d,S+=v}f.restore(),g=m=null}function c(e,t,n,r,i){switch(i){case 5:case 6:case 7:case 8:e.width=r,e.height=n;break;default:e.width=n,e.height=r}switch(i){case 2:t.translate(n,0),t.scale(-1,1);break;case 3:t.translate(n,r),t.rotate(Math.PI);break;case 4:t.translate(0,r),t.scale(1,-1);break;case 5:t.rotate(.5*Math.PI),t.scale(1,-1);break;case 6:t.rotate(.5*Math.PI),t.translate(0,-r);break;case 7:t.rotate(.5*Math.PI),t.translate(n,-r),t.scale(-1,1);break;case 8:t.rotate(-.5*Math.PI),t.translate(-n,0)}}function u(e){if(window.Blob&&e instanceof Blob){var t=new Image,n=window.URL&&window.URL.createObjectURL?window.URL:window.webkitURL&&window.webkitURL.createObjectURL?window.webkitURL:null;if(!n)throw Error("No createObjectURL function found to create blob url");t.src=n.createObjectURL(e),this.blob=e,e=t}if(!e.naturalWidth&&!e.naturalHeight){var r=this;e.onload=function(){var e=r.imageLoadListeners;if(e){r.imageLoadListeners=null;for(var t=0,n=e.length;n>t;t++)e[t]()}},this.imageLoadListeners=[]}this.srcImage=e}u.prototype.render=function(e,t,n){if(this.imageLoadListeners){var r=this;return void this.imageLoadListeners.push(function(){r.render(e,t,n)})}t=t||{};var i=this.srcImage,o=i.src,c=o.length,u=i.naturalWidth,l=i.naturalHeight,f=t.width,h=t.height,d=t.maxWidth,g=t.maxHeight,m=this.blob&&"image/jpeg"===this.blob.type||0===o.indexOf("data:image/jpeg")||o.indexOf(".jpg")===c-4||o.indexOf(".jpeg")===c-5;f&&!h?h=l*f/u<<0:h&&!f?f=u*h/l<<0:(f=u,h=l),d&&f>d&&(f=d,h=l*f/u<<0),g&&h>g&&(h=g,f=u*h/l<<0);var p={width:f,height:h};for(var w in t)p[w]=t[w];var v=e.tagName.toLowerCase();"img"===v?e.src=a(this.srcImage,p,m):"canvas"===v&&s(this.srcImage,e,p,m),"function"==typeof this.onrender&&this.onrender(e),n&&n()},r=[],i=function(){return u}.apply(t,r),!(void 0!==i&&(e.exports=i))}()},function(e,t){function n(e){function t(e){for(var t=[16,11,10,16,24,40,51,61,12,12,14,19,26,58,60,55,14,13,16,24,40,57,69,56,14,17,22,29,51,87,80,62,18,22,37,56,68,109,103,77,24,35,55,64,81,104,113,92,49,64,78,87,103,121,120,101,72,92,95,98,112,100,103,99],n=0;64>n;n++){var r=F((t[n]*e+50)/100);1>r?r=1:r>255&&(r=255),U[N[n]]=r}for(var i=[17,18,24,47,99,99,99,99,18,21,26,66,99,99,99,99,24,26,56,99,99,99,99,99,47,66,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99],o=0;64>o;o++){var a=F((i[o]*e+50)/100);1>a?a=1:a>255&&(a=255),D[N[o]]=a}for(var s=[1,1.387039845,1.306562965,1.175875602,1,.785694958,.5411961,.275899379],c=0,u=0;8>u;u++)for(var l=0;8>l;l++)x[c]=1/(U[N[c]]*s[u]*s[l]*8),C[c]=1/(D[N[c]]*s[u]*s[l]*8),c++}function n(e,t){for(var n=0,r=0,i=new Array,o=1;16>=o;o++){for(var a=1;a<=e[o];a++)i[t[r]]=[],i[t[r]][0]=n,i[t[r]][1]=o,r++,n++;n*=2}return i}function r(){y=n(W,V),S=n(q,X),b=n(H,z),I=n(J,Y)}function i(){for(var e=1,t=2,n=1;15>=n;n++){for(var r=e;t>r;r++)L[32767+r]=n,T[32767+r]=[],T[32767+r][1]=n,T[32767+r][0]=r;for(var i=-(t-1);-e>=i;i++)L[32767+i]=n,T[32767+i]=[],T[32767+i][1]=n,T[32767+i][0]=t-1+i;e<<=1,t<<=1}}function o(){for(var e=0;256>e;e++)B[e]=19595*e,B[e+256>>0]=38470*e,B[e+512>>0]=7471*e+32768,B[e+768>>0]=-11059*e,B[e+1024>>0]=-21709*e,B[e+1280>>0]=32768*e+8421375,B[e+1536>>0]=-27439*e,B[e+1792>>0]=-5329*e}function a(e){for(var t=e[0],n=e[1]-1;n>=0;)t&1<<n&&(M|=1<<_),n--,_--,0>_&&(255==M?(s(255),s(0)):s(M),_=7,M=0)}function s(e){G.push(j[e])}function c(e){s(e>>8&255),s(255&e)}function u(e,t){var n,r,i,o,a,s,c,u,l,f=0;const h=8,d=64;for(l=0;h>l;++l){n=e[f],r=e[f+1],i=e[f+2],o=e[f+3],a=e[f+4],s=e[f+5],c=e[f+6],u=e[f+7];var g=n+u,m=n-u,p=r+c,w=r-c,v=i+s,y=i-s,S=o+a,b=o-a,I=g+S,P=g-S,F=p+v,U=p-v;e[f]=I+F,e[f+4]=I-F;var D=.707106781*(U+P);e[f+2]=P+D,e[f+6]=P-D,I=b+y,F=y+w,U=w+m;var x=.382683433*(I-U),C=.5411961*I+x,T=1.306562965*U+x,L=.707106781*F,A=m+L,G=m-L;e[f+5]=G+C,e[f+3]=G-C,e[f+1]=A+T,e[f+7]=A-T,f+=8}for(f=0,l=0;h>l;++l){n=e[f],r=e[f+8],i=e[f+16],o=e[f+24],a=e[f+32],s=e[f+40],c=e[f+48],u=e[f+56];var M=n+u,_=n-u,E=r+c,O=r-c,k=i+s,j=i-s,B=o+a,N=o-a,W=M+B,V=M-B,H=E+k,z=E-k;e[f]=W+H,e[f+32]=W-H;var q=.707106781*(z+V);e[f+16]=V+q,e[f+48]=V-q,W=N+j,H=j+O,z=O+_;var X=.382683433*(W-z),J=.5411961*W+X,Y=1.306562965*z+X,Q=.707106781*H,K=_+Q,Z=_-Q;e[f+40]=Z+J,e[f+24]=Z-J,e[f+8]=K+Y,e[f+56]=K-Y,f++}var $;for(l=0;d>l;++l)$=e[l]*t[l],R[l]=$>0?$+.5|0:$-.5|0;return R}function l(){c(65504),c(16),s(74),s(70),s(73),s(70),s(0),s(1),s(1),s(0),c(1),c(1),s(0),s(0)}function f(e,t){c(65472),c(17),s(8),c(t),c(e),s(3),s(1),s(17),s(0),s(2),s(17),s(1),s(3),s(17),s(1)}function h(){c(65499),c(132),s(0);for(var e=0;64>e;e++)s(U[e]);s(1);for(var t=0;64>t;t++)s(D[t])}function d(){c(65476),c(418),s(0);for(var e=0;16>e;e++)s(W[e+1]);for(var t=0;11>=t;t++)s(V[t]);s(16);for(var n=0;16>n;n++)s(H[n+1]);for(var r=0;161>=r;r++)s(z[r]);s(1);for(var i=0;16>i;i++)s(q[i+1]);for(var o=0;11>=o;o++)s(X[o]);s(17);for(var a=0;16>a;a++)s(J[a+1]);for(var u=0;161>=u;u++)s(Y[u])}function g(){c(65498),c(12),s(3),s(1),s(0),s(2),s(17),s(3),s(17),s(0),s(63),s(0)}function m(e,t,n,r,i){var o,s=i[0],c=i[240];const l=16,f=63,h=64;for(var d=u(e,t),g=0;h>g;++g)A[N[g]]=d[g];var m=A[0]-n;n=A[0],0==m?a(r[0]):(o=32767+m,a(r[L[o]]),a(T[o]));for(var p=63;p>0&&0==A[p];p--);if(0==p)return a(s),n;for(var w,v=1;p>=v;){for(var y=v;0==A[v]&&p>=v;++v);var S=v-y;if(S>=l){w=S>>4;for(var b=1;w>=b;++b)a(c);S=15&S}o=32767+A[v],a(i[(S<<4)+L[o]]),a(T[o]),v++}return p!=f&&a(s),n}function p(){for(var e=String.fromCharCode,t=0;256>t;t++)j[t]=e(t)}function w(e){if(0>=e&&(e=1),e>100&&(e=100),P!=e){var n=0;n=50>e?Math.floor(5e3/e):Math.floor(200-2*e),t(n),P=e}}function v(){var t=(new Date).getTime();e||(e=50),p(),r(),i(),o(),w(e);(new Date).getTime()-t}var y,S,b,I,P,F=(Math.round,Math.floor),U=new Array(64),D=new Array(64),x=new Array(64),C=new Array(64),T=new Array(65535),L=new Array(65535),R=new Array(64),A=new Array(64),G=[],M=0,_=7,E=new Array(64),O=new Array(64),k=new Array(64),j=new Array(256),B=new Array(2048),N=[0,1,5,6,14,15,27,28,2,4,7,13,16,26,29,42,3,8,12,17,25,30,41,43,9,11,18,24,31,40,44,53,10,19,23,32,39,45,52,54,20,22,33,38,46,51,55,60,21,34,37,47,50,56,59,61,35,36,48,49,57,58,62,63],W=[0,0,1,5,1,1,1,1,1,1,0,0,0,0,0,0,0],V=[0,1,2,3,4,5,6,7,8,9,10,11],H=[0,0,2,1,3,3,2,4,3,5,5,4,4,0,0,1,125],z=[1,2,3,0,4,17,5,18,33,49,65,6,19,81,97,7,34,113,20,50,129,145,161,8,35,66,177,193,21,82,209,240,36,51,98,114,130,9,10,22,23,24,25,26,37,38,39,40,41,42,52,53,54,55,56,57,58,67,68,69,70,71,72,73,74,83,84,85,86,87,88,89,90,99,100,101,102,103,104,105,106,115,116,117,118,119,120,121,122,131,132,133,134,135,136,137,138,146,147,148,149,150,151,152,153,154,162,163,164,165,166,167,168,169,170,178,179,180,181,182,183,184,185,186,194,195,196,197,198,199,200,201,202,210,211,212,213,214,215,216,217,218,225,226,227,228,229,230,231,232,233,234,241,242,243,244,245,246,247,248,249,250],q=[0,0,3,1,1,1,1,1,1,1,1,1,0,0,0,0,0],X=[0,1,2,3,4,5,6,7,8,9,10,11],J=[0,0,2,1,2,4,4,3,4,7,5,4,4,0,1,2,119],Y=[0,1,2,3,17,4,5,33,49,6,18,65,81,7,97,113,19,34,50,129,8,20,66,145,161,177,193,9,35,51,82,240,21,98,114,209,10,22,36,52,225,37,241,23,24,25,26,38,39,40,41,42,53,54,55,56,57,58,67,68,69,70,71,72,73,74,83,84,85,86,87,88,89,90,99,100,101,102,103,104,105,106,115,116,117,118,119,120,121,122,130,131,132,133,134,135,136,137,138,146,147,148,149,150,151,152,153,154,162,163,164,165,166,167,168,169,170,178,179,180,181,182,183,184,185,186,194,195,196,197,198,199,200,201,202,210,211,212,213,214,215,216,217,218,226,227,228,229,230,231,232,233,234,242,243,244,245,246,247,248,249,250];this.encode=function(e,t,n){var r=(new Date).getTime();t&&w(t),G=new Array,M=0,_=7,c(65496),l(),h(),f(e.width,e.height),d(),g();var i=0,o=0,s=0;M=0,_=7,this.encode.displayName="_encode_";for(var u,p,v,P,F,U,D,T,L,R=e.data,A=e.width,j=e.height,N=4*A,W=0;j>W;){for(u=0;N>u;){for(F=N*W+u,U=F,D=-1,T=0,L=0;64>L;L++)T=L>>3,D=4*(7&L),U=F+T*N+D,W+T>=j&&(U-=N*(W+1+T-j)),u+D>=N&&(U-=u+D-N+4),p=R[U++],v=R[U++],P=R[U++],E[L]=(B[p]+B[v+256>>0]+B[P+512>>0]>>16)-128,O[L]=(B[p+768>>0]+B[v+1024>>0]+B[P+1280>>0]>>16)-128,k[L]=(B[p+1280>>0]+B[v+1536>>0]+B[P+1792>>0]>>16)-128;i=m(E,x,i,y,b),o=m(O,C,o,S,I),s=m(k,C,s,S,I),u+=32}W+=8}if(_>=0){var V=[];V[1]=_+1,V[0]=(1<<_+1)-1,a(V)}if(c(65497),n){for(var H=G.length,z=new Uint8Array(H),q=0;H>q;q++)z[q]=G[q].charCodeAt();G=[];(new Date).getTime()-r;return z}var X="data:image/jpeg;base64,"+btoa(G.join(""));G=[];(new Date).getTime()-r;return X},v()}e.exports=n},function(e,t,n){function r(e,t){var n=this;if(!e)throw new Error("没有收到图片，可能的解决方案：https://github.com/think2011/localResizeIMG4/issues/7");t=t||{},n.defaults={width:null,height:null,quality:.7},n.file=e;for(var r in t)t.hasOwnProperty(r)&&(n.defaults[r]=t[r]);return this.init()}function i(e){var t=null;return t=e?[].filter.call(document.scripts,function(t){return-1!==t.src.indexOf(e)})[0]:document.scripts[document.scripts.length-1],t?t.src.substr(0,t.src.lastIndexOf("/")):null}n.p=i("lrz")+"/",window.URL=window.URL||window.webkitURL;var o=n(1),a=n(4),s=function(e){var t=/OS (\d)_.* like Mac OS X/g.exec(e),n=/Android (\d.*?);/g.exec(e)||/Android\/(\d.*?) /g.exec(e);return{oldIOS:t?+t.pop()<8:!1,oldAndroid:n?+n.pop().substr(0,3)<4.5:!1,iOS:/\(i[^;]+;( U;)? CPU.+Mac OS X/.test(e),android:/Android/g.test(e),mQQBrowser:/MQQBrowser/g.test(e)}}(navigator.userAgent);r.prototype.init=function(){var e=this,t=e.file,n=new Image,r=document.createElement("canvas"),i="string"==typeof t?t:URL.createObjectURL(t);if(e.img=n,e.blob=i,e.canvas=r,!document.createElement("canvas").getContext)throw new Error("浏览器不支持canvas");return new o(function(t,r){n.onerror=function(){throw new Error("加载图片文件失败")},n.onload=function(){e._getBase64().then(function(e){return e.length<10&&r("生成base64失败"),e}).then(function(n){t({origin:e.file,base64:n,base64Len:n.length});for(var r in e)e.hasOwnProperty(r)&&(e[r]=null);URL.revokeObjectURL(e.blob)})},n.crossOrigin="*",n.src=i})},r.prototype._getBase64=function(){var e=this,t=e.img,n=e.file,r=e.canvas;return new o(function(i){a.getData("object"==typeof n?n:t,function(){e.orientation=a.getTag(this,"Orientation"),e.resize=e._getResize(),e.ctx=r.getContext("2d"),r.width=e.resize.width,r.height=e.resize.height,e.ctx.fillStyle="#fff",e.ctx.fillRect(0,0,r.width,r.height),s.oldIOS?e._createBase64ForOldIOS().then(i):e._createBase64().then(i)})})},r.prototype._createBase64ForOldIOS=function(){var e=this,t=e.img,r=e.canvas,i=e.defaults,a=e.orientation;return new o(function(e){!function(){var o=[n(5)];(function(n){var o=new n(t);"5678".indexOf(a)>-1?o.render(r,{width:r.height,height:r.width,orientation:a}):o.render(r,{width:r.width,height:r.height,orientation:a}),e(r.toDataURL("image/jpeg",i.quality))}).apply(null,o)}()})},r.prototype._createBase64=function(){var e=this,t=e.resize,r=e.img,i=e.canvas,a=e.ctx,c=e.defaults,u=e.orientation;switch(u){case 3:a.rotate(180*Math.PI/180),a.drawImage(r,-t.width,-t.height,t.width,t.height);break;case 6:a.rotate(90*Math.PI/180),a.drawImage(r,0,-t.width,t.height,t.width);break;case 8:a.rotate(270*Math.PI/180),a.drawImage(r,-t.height,0,t.height,t.width);break;case 2:a.translate(t.width,0),a.scale(-1,1),a.drawImage(r,0,0,t.width,t.height);break;case 4:a.translate(t.width,0),a.scale(-1,1),a.rotate(180*Math.PI/180),a.drawImage(r,-t.width,-t.height,t.width,t.height);break;case 5:a.translate(t.width,0),a.scale(-1,1),a.rotate(90*Math.PI/180),a.drawImage(r,0,-t.width,t.height,t.width);break;case 7:a.translate(t.width,0),a.scale(-1,1),a.rotate(270*Math.PI/180),a.drawImage(r,-t.height,0,t.height,t.width);break;default:a.drawImage(r,0,0,t.width,t.height)}return new o(function(e){s.oldAndroid||s.mQQBrowser||!navigator.userAgent?!function(){var t=[n(6)];(function(t){var n=new t,r=a.getImageData(0,0,i.width,i.height);e(n.encode(r,100*c.quality))}).apply(null,t)}():e(i.toDataURL("image/jpeg",c.quality))})},r.prototype._getResize=function(){var e=this,t=e.img,n=e.defaults,r=n.width,i=n.height,o=e.orientation,a={width:t.width,height:t.height};if(o&&"5678".indexOf(o)>-1&&(a.width=t.height,a.height=t.width,r=n.height,i=n.width),a.width<r||a.height<i)return a;var s=a.width/a.height;for(r&&i?s>=r/i?a.width>r&&(a.width=r,a.height=Math.ceil(r/s)):a.height>i&&(a.height=i,a.width=Math.ceil(i*s)):r?r<a.width&&(a.width=r,a.height=Math.ceil(r/s)):i&&i<a.height&&(a.width=Math.ceil(i*s),a.height=i);a.width>=3264||a.height>=2448;)a.width*=.8,a.height*=.8;return a},window.lrz=function(e,t){return new r(e,t)},window.lrz.version="4.2.10",e.exports=window.lrz}]);
;module.exports = lrz; 
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
;define('question/index', function(require, exports, module){ var $ = require('zepto');
var Ajax = require('common/ajax/index');
var Bubble = require('common/bubble/bubble');
var JAjax = require('common/j-ajax/index');
var lrz = require('common/lrz/index');
var Preview = require('common/preview/index');
var JDisabled = require('common/j-disabled/index');
var Copyright = require('common/copyright/index');

var $area = $('#J-area');
var $phone = $('#J-phone');
var $uploaderList = $('#J-uploader-list');

var hasExtra = false; //是否超长过


init();

function init() {
	addEvent();

	initJAjax();
	JDisabled.init();
	// initArea();
}

function addEvent() {
	$('#J-file-input').on('change', selPic);
	$uploaderList.on('click', '.item-preview .img-wrap', showPreview);
	$uploaderList.on('click', '.J-close', delPic);

	$('.J-star-bar').on('click', star);
}

/**
 * 评价星级
 * @return {[type]} [description]
 */
function star(evt) {
	var $cur = $(this);
	var eveWid = $cur.width() / 5;
	var num = Math.ceil(evt.layerX / eveWid);

	if (num == 0) {
		num = 1;
	}

	$cur.find('.star-inner').width(num * eveWid);
	$('#J-score-input').val(num);
}

/**
 * 初始化jajax
 * @return {[type]} [description]
 */
function initJAjax() {
	JAjax.init({
		validateFunc: function() {
			if (!$area.val()) {
				Bubble.show('请输入你的建议');
				return false;
			}
			// if(!$phone.val()){
			// 	Bubble.show('请输入你的手机号');
			// 	return false;
			// }
			return true;
		}
	});
}

/**
 * 初始化textarea
 * @return {[type]} [description]
 */
function initArea() {
	$area.on('input propertychange', function() {
		var len = $(this).val().length;
		var $num = $('#J-num');

		$num.text(len);

		if (len > 200) {
			hasExtra = true;
			$num.addClass('extra');
		} else {
			if (hasExtra) {
				$num.removeClass('extra');
			}
		}
	});
}

/**
 * 上传图片
 * @return {[type]} [description]
 */
function selPic() {
	var $uplaoder = $(this).parent();
	var $curItem = $uplaoder.parent('.item');
	var files = this.files;
	var len = files.length,
		index = 0;

	uploading = true;
	$uplaoder.addClass('loading');

	upload();

	function upload() {
		lrz(files[index], {
			width: 500
		}).then(function(rst) {
			new Ajax().send({
				url: $('#J-uploader-url').val(),
				type: 'post',
				data: {
					image: rst.base64,
					size: rst.base64Len
				}
			}, function(result) {

				var result = result || {
					url: ''
				};

				if (len - 1 <= index || index >= 8) {
					uploading = false;
					files = null;
					Copyright.reset();
				} else {
					upload();
				}
				index++;
				$uplaoder.removeClass('loading');
				$curItem.before('<div class="item item-preview">\
								<div class="J-close close"></div>\
								<div class="img-wrap item-inner" style="background-image:url(' + result.url + ')"></div>\
								<input type="hidden" name="imgUrl[]" value="' + result.url + '" />\
							</div>');

				if ($uploaderList.children().length > 9) {
					$curItem.css('display', 'none');
				}
			});
			return rst;
		}).catch(function(err) {});


	}

}

/**
 * 预览
 * @return {[type]} [description]
 */
function showPreview() {
	var $el = $(this);
	var imgArr = [],
		curIndex = 0;

	$uploaderList.find('.item-preview .img-wrap').each(function(i, img) {
		if ($el[0] == img) {
			curIndex = i;
		}
		imgArr.push($(img).css('background-image').match(/url\((.*)\)/)[1]);
	});
	Preview.show(imgArr, curIndex);
}

/**
 * 删除图片
 * @return {[type]} [description]
 */
function delPic(evt) {
	evt.stopPropagation();

	var $cur = $(this);
	$cur.parent('.item').remove();
	$uploaderList.children('.item-upload').css('display', 'block');
} 
});