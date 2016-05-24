define('common/copyright/index', function(require, exports, module){ var $ = require('zepto');

var _tmpl = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div id="copyright"><i></i></div>';
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
;define('common/addr-sel/index', function(require, exports, module){ var $ = require('zepto');
var Ajax = require('common/ajax/index');
var Alert = require('common/alert/alert');

var _tmpl = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='';
 $.each(list, function(i, item){ 
__p+='\r\n<option value="'+
((__t=( item.region_id ))==null?'':__t)+
'" '+
((__t=( (id==item.region_id&&id>0?'selected="selected"':'') ))==null?'':__t)+
' >'+
((__t=( item.region_name ))==null?'':__t)+
'</option>\r\n';
 }) 
__p+='\r\n';
}
return __p;
};
var $selector;
var selType;

function AddrSel(options) {
	this.options = options;
	this.addr = options.addr || {
		pro: '',
		proId: 0,
		city: '',
		cityId: 0,
		region: '',
		regionId: 0
	};

	this._init();
}

AddrSel.prototype = {
	_init: function() {
		var self = this;

		self.$proBtn = $(self.options.proBtn);
		self.$cityBtn = $(self.options.cityBtn);
		self.$regionBtn = $(self.options.regionBtn);

		self.$proBtn.on('change', function(e) {
			self._proChange(e);
		});

		self.$cityBtn.on('change', function(e) {
			self._cityChange(e);
		});

		self.$regionBtn.on('change', function(e) {
			self._regionChange(e);
		});

		self._getPro();

		if(this.addr.cityId){
			self._getCity();
		}

		if(this.addr.regionId){
			self._getRegion();
		}

		self._onSelect();
	},

	_proChange: function(e) {
		var self = this;
		var select = e.currentTarget;
		var option = select.options[select.selectedIndex];

		self.addr.pro = option.text;
		self.addr.proId = option.value;

		self._getCity(function(){
			self.$regionBtn[0].selectedIndex = 0;
		});
	},

	_cityChange: function(e) {
		var select = e.currentTarget;
		var option = select.options[select.selectedIndex];

		this.addr.city = option.text;
		this.addr.cityId = option.value;

		this._getRegion();
	},


	_regionChange: function(e) {
		// var option = e.currentTarget.selectedOptions[0];
		var select = e.currentTarget;
		var option = select.options[select.selectedIndex];

		this.addr.region = option.text;
		this.addr.regionId = option.value;
	},

	_getPro: function() {
		var self = this;
		new Ajax().send({
			url: '/api/UserAddress/getAllProvince'
		}, function(result) {
			var list = result.data;


			selType = 'pro';
			list.unshift({
				region_id: '-1',
				region_name: '选择省份'
			});


			self.$proBtn.html($(_tmpl({
				list: list,
				id: self.addr[selType + 'Id']
			})));
		});
	},

	_getCity: function(back) {
		var self = this;

		new Ajax().send({
			url: '/api/UserAddress/getAllCity',
			data: {
				province_id: self.addr.proId
			}
		}, function(result) {
			var list = result.data;

			selType = 'city';
			list.unshift({
				region_id: '-1',
				region_name: '选择市区'
			});

			self.$cityBtn.html($(_tmpl({
				list: list,
				id: self.addr[selType + 'Id']
			})));

			back && back();
		});
	},


	_getRegion: function() {
		var self = this;

		new Ajax().send({
			url: '/api/UserAddress/getAllDistrict',
			data: {
				city_id: self.addr.cityId
			}
		}, function(result) {
			var list = result.data;

			selType = 'region';
			list.unshift({
				region_id: '-1',
				region_name: '选择县区'
			});
			self.$regionBtn.html($(_tmpl({
				list: list,
				id: self.addr[selType + 'Id']
			})));

		});
	},


	_onSelect: function() {
		var self = this;

		$(document.body).off('click', '.addr-selector li');
		$(document.body).on('click', '.addr-selector li', function() {
			var $cur = $(this);
			var id, text;

			Alert.hide();

			id = $cur.attr('addrId');
			text = $cur.text();

			self._setText(selType, text, id);

			switch (selType) {
				case 'pro':
					self._setText('city', '请选择市区', -1);
					self._setText('region', '请选择县区', -1);
					break;
				case 'city':
					self._setText('region', '请选择县区', -1);
					break;
			}

			return false;
		});
	},

	_setText: function(selType, text, id) {
		var self = this;

		self.addr[selType] = text;
		self.addr[selType + 'Id'] = id;
		self['$' + selType + 'Btn'].text(text);
	},

	_selPro: function() {
		var self = this;

		new Ajax().send({
			url: '/User/Center/getAllProvince'
		}, function(result) {
			var list = result.data;

			selType = 'pro';
			list.unshift({
				region_id: '-1',
				region_name: '选择省份'
			});
			Alert.show(_tmpl({
				list: list,
				id: self.addr[selType + 'Id']
			}));

		});
	},

	_selCity: function() {
		var self = this;

		new Ajax().send({
			url: '/User/Center/getAllCity',
			data: {
				province_id: self.addr.proId
			}
		}, function(result) {
			var list = result.data;

			selType = 'city';
			list.unshift({
				region_id: '-1',
				region_name: '请选择市区'
			});
			Alert.show(_tmpl({
				list: list,
				id: self.addr[selType + 'Id']
			}));

		});
	},

	_selRegion: function() {
		var self = this;

		new Ajax().send({
			url: '/User/Center/getAllDistrict',
			data: {
				city_id: self.addr.cityId
			}
		}, function(result) {
			var list = result.data;

			selType = 'region';
			list.unshift({
				region_id: '-1',
				region_name: '请选择县区'
			});
			Alert.show(_tmpl({
				list: list,
				id: self.addr[selType + 'Id']
			}));

		});
	}
};


module.exports = AddrSel; 
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
;define('common/address/index', function(require, exports, module){ var $ = require('zepto');
// var _ = require('underscore');
var Pop = require('common/pop/index');
var Ajax = require('common/ajax/index');
var Bubble = require('common/bubble/bubble');
var AddrSel = require('common/addr-sel/index');
var Confirm = require('common/confirm/index');

var listTmpl = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="address-container">\r\n\t<ul class="address-list" style="max-height: '+
((__t=( maxHei ))==null?'':__t)+
'px">\r\n\t\t';
 $.each(list, function(i, item){ 
__p+='\r\n\t\t<li class="address-item dib-wrap" addr-id="'+
((__t=( item.id ))==null?'':__t)+
'">\r\n\r\n\t\t\t<a class="radio ';
 if(item.isDefault == 1){ 
__p+='selected';
 } 
__p+=' dib"><i class="icon-radio"></i></a>\r\n\t\t\t<div class="addr-info dib">\r\n\t\t\t\t<p class="user"><span>'+
((__t=( item.reName ))==null?'':__t)+
'，</span><span>'+
((__t=( item.rePhone ))==null?'':__t)+
'</span></p>\r\n\t\t\t\t<p class="addr">'+
((__t=( item.provinceName + item.cityName + item.districtName + item.detailAddr ))==null?'':__t)+
'</p>\r\n\t\t\t</div>\r\n\t\t\t<a class="edit dib"><i class="icon-edit"></i></a>\r\n\t\t</li>\r\n\t\t';
 }) 
__p+='\r\n\t</ul>\r\n\t<div class="btn-add dib-wrap">\r\n\t\t<span class="dib add-wrap"><i class="icon-add dib"></i></span>\r\n\t\t<label class="dib">新增地址</label>\r\n\t\t<span class="arrow-wrap dib"><i class="icon-arrow dib"></i></span>\r\n\t</div>\r\n</div>';
}
return __p;
};
var editTmpl = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="address-edit">\r\n\t<ul>\r\n\t\t<li>\r\n\t\t\t<label>收货人</label>\r\n\t\t\t<input class="J-name" placeholder="名字" value="'+
((__t=( item.recipient_name ))==null?'':__t)+
'" />\r\n\t\t</li>\r\n\t\t<li>\r\n\t\t\t<label>联系方式</label>\r\n\t\t\t<input class="J-phone" type="tel" placeholder="手机或联系电话" value="'+
((__t=( item.recipient_phone ))==null?'':__t)+
'" />\r\n\t\t</li>\r\n\t\t<li>\r\n\t\t\t<label>选择地区</label>\r\n\t\t\t<div class="addr-sel">\r\n\t\t\t\t<div class="inner">\r\n\t\t\t\t\t<div class="select-wrap">\r\n\t\t\t\t\t\t<select id="J-pro-text">\r\n\t\t\t\t\t\t\t<option>选择省份</option>\r\n\t\t\t\t\t\t</select>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div class="select-wrap">\r\n\t\t\t\t\t\t<select id="J-city-text">\r\n\t\t\t\t\t\t\t<option>选择市区</option>\r\n\t\t\t\t\t\t</select>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div class="select-wrap">\r\n\t\t\t\t\t\t<select id="J-region-text">\r\n\t\t\t\t\t\t\t<option>选择县区</option>\r\n\t\t\t\t\t\t</select>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t\t<!-- <label id="J-pro-text">'+
((__t=( item.province_name || '选择省份' ))==null?'':__t)+
'</label>\r\n\t\t\t\t<label id="J-city-text">'+
((__t=( item.city_name || '选择市区' ))==null?'':__t)+
'</label>\r\n\t\t\t\t<label id="J-region-text">'+
((__t=( item.region_name || '选择县区' ))==null?'':__t)+
'</label> -->\r\n\t\t\t</div>\r\n\t\t</li>\r\n\t\t<li>\r\n\t\t\t<label>详细地址</label>\r\n\t\t\t<input class="J-addr" placeholder="街道门牌信息" value="'+
((__t=( item.recipient_address ))==null?'':__t)+
'" />\r\n\t\t</li>\r\n\t</ul>\r\n\t<div class="btnl-wrap">\r\n\t\t<button type="submit" class="btnl btnl-wx J-save">保存</button>\r\n\t\t';
 if(item.recipient_name){ 
__p+='\r\n\t\t<a class="btnl btnl-default J-del">删除</a>\r\n\t\t';
 } 
__p+='\r\n\t</div>\r\n</div>';
}
return __p;
};

// var listData = [1, 2, 3, 4];
var listData = null;
var curAddr = {};

var $container, $radios, $addBtn, $addrList;
var $editContainer, $saveBtn, $delBtn;
var curItem = {}; //当前编辑地址

var selected;
var $pageContent;
var curType = 'pop';



function show(options) {
	curType = 'pop';
	selected = options.selected;

	getList(function(list) {
		// listData = list;
		// _openList();
	});
}

function initPage(options) {
	curType = 'page';
	$pageContent = $(options.container);

	_rendPage();
}

function _rendPage() {
	getList(function(list) {

		$pageContent.html(listTmpl({
			list: listData,
			maxHei: 'auto'
		}));
		_initNodes();

	}, false);
}

/**
 * 获取地址列表
 * @param  {[type]} back [description]
 * @return {[type]}      [description]
 */
function getList(back, isOpenList) {

	// if (!listData) {
	new Ajax().send({
		url: $('#J-ajaxurl-address-list').val(),
		type: 'get'
	}, function(result) {
		listData = result.data;
		selected && selected(_getDefault());

		if (isOpenList === undefined || isOpenList) {
			if (listData.length == 0) {
				_openDetail();
			} else {
				_openList();
			}
		}
		back && back(result.data);
	}, function(res) {});
	// } else {
	// 	back(listData);
	// }

}

function setDefault(evt) {
	var $radio = $(evt.currentTarget);
	var id = $radio.parents('li').attr('addr-id');

	// if ($radio.hasClass('selected')) {
	// 	return;
	// }
	new Ajax().send({
		url: $('#J-ajaxurl-address-setDefault').val(),
		data: {
			id: id
		}
	}, function() {
		$radios.removeClass('selected');
		$radio.addClass('selected');
		if (curType == 'pop') {
			Pop.hide();
		}
		selected && selected(_getAddr(id));
	});
}

function edit(evt) {
	var $edit = $(evt.currentTarget);
	var addrId = $edit.parents('li').attr('addr-id');

	if (curType == 'pop') {
		Pop.hide(function() {
			doIt();
		});
	} else {
		doIt();
	}

	function doIt() {
		curItem = _getAddr(addrId);
		_openDetail();
	}
}

function add() {
	if (curType == 'pop') {
		Pop.hide(function() {
			doIt();
		});
	} else {
		doIt();
	}

	function doIt() {
		curItem = {};
		_openDetail();
	}
}

/**
 * 保存地址
 */
function save() {
	var name = $editContainer.find('.J-name').val();
	var phone = $editContainer.find('.J-phone').val();
	var pro = curAddr.addr.proId;
	var city = curAddr.addr.cityId;
	var region = curAddr.addr.regionId;
	var addr = $editContainer.find('.J-addr').val();

	if (!name) {
		Bubble.show('请输入用户名');
		return false;
	} else if (name.length > 20) {
		Bubble.show('用户名长度不得超过20位');
		return false;
	} else if (!phone || !/^1[3-8]\d{9}$/.test(phone)) {
		Bubble.show('请输入正确手机号码');
		return false;
	} else if (!pro) {
		Bubble.show('请选择你所在省份');
		return false;
	} else if (!city) {
		Bubble.show('请选择你所在市区');
		return false;
	} else if (!region) {
		Bubble.show('请选择你所在县区');
		return false;
	} else if (!addr) {
		Bubble.show('请输入你的详细地址');
		return false;
	} else if (addr.length > 100) {
		Bubble.show('详细地址长度不得超过100位')
		return false;
	}

	new Ajax().send({
		url: $('#J-ajaxurl-address-save').val(),
		data: {
			id: curItem.id,
			name: name,
			phone: phone,
			provinceId: pro,
			cityId: city,
			districtId: region,
			detailAddr: addr
		}
	}, function() {

		Pop.hide(function() {
			if (curType == 'pop') {
				getList(null, false);
			} else {
				_rendPage();
			}
		});
	});

	return false;
}

/**
 * 删除地址
 */
function del() {
	Confirm.show({
		msg: '您确定删除该地址吗？',
		yesBack: function() {
			new Ajax().send({
				url: $('#J-ajaxurl-address-del').val(),
				data: {
					id: curItem.id
				}
			}, function() {
				curItem = {};
				Pop.hide(function() {
					if (curType == 'pop') {
						getList();
					} else {
						_rendPage();
					}
				});
			});
		}
	});
}

function _getAddr(id) {
	var i = 0,
		item;

	for (; i < listData.length; i++) {
		item = listData[i];
		if (item.id == id) {
			return {
				id: item['id'],
				province_name: item['provinceName'],
				city_name: item['cityName'],
				region_name: item['districtName'],
				province_id: item['provinceId'],
				city_id: item['cityId'],
				district_id: item['districId'],
				recipient_address: item['detailAddr'],
				is_default: item['isDefault'],
				phone: item['rePhone'],
				realName: item['reName'],
			};
		}
	}
	return {};
}

function _getDefault() {
	var i = 0,
		item;

	for (; i < listData.length; i++) {
		item = listData[i];
		if (item['is_default'] == 1) {
			return item;
		}
	}
	return null;
}

/**
 * 打开list页
 */
function _openList() {
	Pop.show({
		title: '选择收货地址',
		content: listTmpl({
			list: listData,
			maxHei: $(window).height() * 0.7
		})
	});

	_initNodes();
}

function _initNodes() {
	$container = $('.address-container');
	$radios = $container.find('.radio');
	$addBtn = $container.find('.btn-add');

	$container.on('click', '.radio', setDefault);
	$container.on('click', '.addr-info', setDefault);
	$container.on('click', '.edit', edit);
	$addBtn.on('click', add);
}

/**
 * 打开detail页
 */
function _openDetail() {
	Pop.show({
		title: '收货地址',
		content: editTmpl({
			item: curItem
		})
	});

	$editContainer = $('.address-edit');
	$saveBtn = $editContainer.find('.J-save');
	$delBtn = $editContainer.find('.J-del');

	$saveBtn.on('click', save);
	$delBtn.on('click', del);

	if (!curItem.province_name) {
		// try {
		// 	getPos(function(lat, lng) {
		// 		if (lat && lng) {
		// 			new Ajax().send({
		// 				url: '/User/Center/getConsigneeInfo',
		// 				data: {
		// 					lat: lat,
		// 					lng: lng
		// 				}
		// 			}, function(result) {
		// 				var bdAddrs = result.addressComponent;
		// 				var ids = result.regionId;

		// 				if (bdAddrs && ids.provinceId && ids.cityId && ids.districtId) {
		// 					curItem = {
		// 						province_name: bdAddrs.province,
		// 						city_name: bdAddrs.city,
		// 						region_name: bdAddrs.district,
		// 						province_id: ids.provinceId,
		// 						city_id: ids.cityId,
		// 						district_id: ids.districtId,
		// 						street: bdAddrs.street,
		// 						streetNum: bdAddrs.street_number,
		// 						phone: result.cellPhone,
		// 						realName: result.realName
		// 					}
		// 				}
		// 				_initAddrSel();
		// 			}, function() {
		// 				_initAddrSel();
		// 			});
		// 		} else {
		// 			_initAddrSel();
		// 		}

		// 	});
		// } catch (e) {
		_initAddrSel();
		// }
	} else {
		_initAddrSel();
	}
}

function _initAddrSel() {
	var $pro = $('#J-pro-text');
	var $city = $('#J-city-text');
	var $region = $('#J-region-text');
	var $addrV = $('.J-addr');
	var $phone = $('.address-edit').find('.J-phone');
	var $name = $('.address-edit').find('.J-name');

	try {
		if (curItem.province_name && $pro.text() == '选择省份') {
			$pro.text(curItem.province_name);
		}
		if (curItem.city_name && $city.text() == '选择市区') {
			$city.text(curItem.city_name);
		}
		if (curItem.region_name && $region.text() == '选择县区') {
			$region.text(curItem.region_name);
		}
		// if (curItem.street && !$addrV.val()) {
		// 	$addrV.val(curItem.street + curItem.streetNum);
		// }
		if (curItem.phone && !$phone.val()) { //电话
			$phone.val(curItem.phone);
		}
		if (curItem.realName && !$name.val()) { //用户名
			$name.val(curItem.realName);
		}
	} catch (e) {}

	curAddr = new AddrSel({
		proBtn: '#J-pro-text',
		cityBtn: '#J-city-text',
		regionBtn: '#J-region-text',
		addr: {
			pro: curItem.province_name,
			proId: curItem.province_id,
			city: curItem.city_name,
			cityId: curItem.city_id,
			region: curItem.region_name,
			regionId: curItem.district_id
		}
	});
}

/**
 * 获取当地地址
 */
function getPos(back) {
	if (window.navigator.geolocation) {
		var options = {
			enableHighAccuracy: true,
			maximumAge: 60000,
			timeout: 3000
		};
		try {

			window.navigator.geolocation.getCurrentPosition(function(position) {
				if (position && position.coords) {
					back(position.coords.latitude, position.coords.longitude);
				} else {
					back();
				}
				// handlePosSuc(position, back);
			}, function(error) {
				back();
				// handlePosError(error);
			}, options);
		} catch (e) {
			back();
		}

	} else {
		back();
		// alert('浏览器不支持');
	}
}

/**
 * 获取经纬度成功
 */
function handlePosSuc(position, back) {
	var lat = position.coords.latitude;
	var lng = position.coords.longitude;

	$.ajax({
		dataType: 'jsonp',
		url: 'http://api.map.baidu.com/geocoder/v2/',
		data: {
			ak: 'StUTq8hxAbyFSGKU2kUiEGFL',
			location: lat + ',' + lng,
			output: 'json',
			pois: 1
		},
		success: function(result) {
			if (result.status == 0) {
				back(result['result']['addressComponent']);
			} else {
				back();
			}
		}
	});
}

function handlePosError(error) {
	switch (error.code) {
		case error.PERMISSION_DENIED:
			// Bubble.show('无法获取当前位置');
			break;
		case error.POSITION_UNAVAILABLE:
			// Bubble.show('无法获取您的当前位置');
			break;
		case error.TIMEOUT:
			// Bubble.show('获取位置超时');
			break;
		case error.UNKNOWN_ERROR:
			// Bubble.show('未获取到您的当前位置');
			break;
	}
}


module.exports = {
	show: show,
	initPage: initPage
}; 
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
;define('common/ticket-pop/index', function(require, exports, module){ var $ = require('zepto');
var Pop = require('common/pop/index');
var Ajax = require('common/ajax/index');

var curOptions;
var ticketList;
var $curContainer;

function show(options) {
	curOptions = options || {};

	new Ajax().send({
		url: '/User/Center/getOrderCouponList',
		data: curOptions.ajaxParams
	}, function(result) {
		var list = result.list;

		Pop.show({
			title: '选择优惠券',
			content: function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="ticket-container">\r\n\t<ul>\r\n\t\t';
 $.each(list, function(i, item){ 
__p+='\r\n\t\t<li>\r\n\t\t\t<div class="money"><i>&yen;</i><b>'+
((__t=( item.coupon_money ))==null?'':__t)+
'</b></div>\r\n\t\t\t<div class="ticket-info">\r\n\t\t\t\t<p class="ticket-title">'+
((__t=( item.title ))==null?'':__t)+
'</p>\r\n\t\t\t\t';
 if(item.order_money==0){ 
__p+='\r\n\t\t\t\t<!-- <p class="des">全场通用</p> -->\r\n\t\t\t\t';
 }else{ 
__p+='\r\n\t\t\t\t<p class="des">满'+
((__t=( item.order_money ))==null?'':__t)+
'可用</p>\r\n\t\t\t\t';
 } 
__p+='\r\n\t\t\t</div>\r\n\t\t\t<a class="radio '+
((__t=( curId==item.coupon_code?'selected':'' ))==null?'':__t)+
' dib" ticket-item=\''+
((__t=( JSON.stringify(item) ))==null?'':__t)+
'\'><i class="icon-radio"></i></a>\r\n\t\t</li>\r\n\t\t';
 }) 
__p+='\r\n\t\t<li>\r\n\t\t\t<div class="ticket-info">不使用优惠券</div>\r\n\t\t\t<a class="radio dib" ticket-item="-1"><i class="icon-radio"></i></a>\r\n\t\t</li>\r\n\t</ul>\r\n</div>';
}
return __p;
}({
				list: (ticketList = list),
				curId: curOptions.curId || 0
			})
		});

		$curContainer = $('.ticket-container');

		$curContainer.on('click', '.radio', sel);
	});
}

function sel() {
	var $cur = $(this);
	var ticketItem = $cur.attr('ticket-item');

	$curContainer.find('.radio.selected').removeClass('selected');
	$cur.addClass('selected');
	Pop.hide();
	curOptions.selected && curOptions.selected(ticketItem != -1 ? JSON.parse(ticketItem) : -1, ticketList.length);
}


module.exports = {
	show: show
}; 
});
;define('pay-new/index', function(require, exports, module){ var $ = require('zepto');
var Pop = require('common/pop/index');
var Address = require('common/address/index');
var Ajax = require('common/ajax/index');
var Timer = require('common/timer/timer');
var Util = require('common/util/index');
var Bubble = require('common/bubble/bubble');
var TicketPop = require('common/ticket-pop/index');

var payTmpl = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="pay-types">\r\n\t<button class="J-pay-btn btnl btnl-default" type="1">支付宝</button>\r\n\t<!-- <button class="J-pay-btn btnl btnl-default" type="3">银联支付</button> -->\r\n</div>';
}
return __p;
};

// var totalVal = (+$('#J-total-val').val() + (+$('#J-trans-val').val())).toFixed(2); //消费金额 + 运费
var totalVal = +$('#J-total-val').val(); //消费金额 + 运费
var lastVal = +$('#J-last-val').val(); //帐户余额

var $moneyLast = $('#J-money-last');
var $minusTicket = $('#J-minus-ticket'); //减去ticket块
var $minusContent = $('#J-minus-content'); //减去余额块
var $lastPay = $('#J-last-pay'); //还需支付
var $lastPayLabel = $('#J-last-text'); //还需支付文案

var $useTicket = $('#J-use-ticket'); //是否使用优惠券
var $useLastInput = $('#J-use-last'); //是否使用余额
var $payTypeInput = $('#J-pay-type'); //支付类型
var $needPayInput = $('#J-need-pay'); //还需支付

var $payBtn = $('.J-pay-btn');
var $address = $('#J-address');

function init() {
	new Timer('#J-wait-timer', function(time) {
		var minute = parseInt(time / 60, 10);
		var sec = time - minute * 60;
		return Timer.addZero(minute) + ':' + Timer.addZero(sec);
	}).start();

	calculateMoney();
	initLastMoney();
	initLastTaobi();
	addEvent();

	if ($address.hasClass('no-address')) {
		showAddr();
	}
}

function addEvent() {
	$address.on('click', showAddr);

	$('#J-pay-other').on('click', function() {

		Pop.show({
			content: payTmpl(),
			hasClose: false
		});
		$payBtn = $('.J-pay-btn');

		$payBtn.off('click', toPay);
		$payBtn.on('click', toPay);
	});

	$payBtn.on('click', toPay);

	$('#J-ticket-section').on('click', showTicket);

}

/**
 * 显示优惠券列表
 * @return {[type]} [description]
 */
function showTicket() {
	var $cur = $(this);
	var cartId = []; //购物车
	var ajaxParams = {};

	if (!$cur.hasClass('has-ticket')) {
		return;
	}

	$('input[name="cartId[]"]').each(function(i, input) {
		cartId.push($(input).val());
	});

	if (cartId.length > 0) { //购物车结算
		ajaxParams.cartId = cartId.join(',');
	} else { //单品结算
		ajaxParams.productId = $('input[name="productId"]').val();
		ajaxParams.num = $('input[name="productNumber"]').val();
		ajaxParams.skuValuesText = $('input[name="skuValuesText"]').val();
	}

	TicketPop.show({
		curId: $useTicket.val(),
		ajaxParams: ajaxParams,
		orderMoney: totalVal,
		selected: function(ticketItem, total) {
			if (ticketItem == -1) {
				$cur.find('.ticket-num b').text(total);
				$cur.addClass('nouse-ticket');

				$useTicket.val('');
				$minusTicket.css('display', 'none');
			} else {
				$('#J-ticket-price').text(ticketItem.coupon_money);
				$cur.removeClass('nouse-ticket');

				$useTicket.val(ticketItem.coupon_code);
				$minusTicket.find('.price b').text(ticketItem.coupon_money);
				$minusTicket.css('display', 'inline');
			}
			calculateMoney();
		}
	});
}

function showAddr() {
	Address.show({
		selected: function(item) {
			if (item && item.recipient_name) {
				//身份证
				if (item.recipient_identity_card) {
					$('#J-idcard').val(item.recipient_identity_card);
				}

				$address.find('.user-name').text(item.recipient_name);
				$address.find('.tel').text(item.recipient_phone);
				$address.find('.addr-addr').text(item.province_name + item.city_name + item.region_name + item.recipient_address);
				$address.removeClass('no-address');
				$('#J-addr-id').val(item.id);
			} else {
				$('#J-address').addClass('no-address');
			}
		}
	});
}

var wxPayData;
var wxLoading = false;
var curBtnText;

function toPay() {
	var $curBtn = $(this);
	var $form = $('#J-pay-form');
	var type = $curBtn.attr('type');

	var $input = $('#J-idcard'); //身份证号

	if ($input.length > 0) {
		var $warn = $input.parent().find('.icon-warning');
		var val = $input.val();

		if (val.length == 18 && Util.IdCard.valid(val)) {} else {
			if (val === '') {
				Bubble.show('请输入身份证号！');
			} else {
				Bubble.show('身份证号格式错误！');
			}
			window.scroll(0, 0);
			$warn.css('display', 'inline-block');
			return false;
		}
	}

	$payTypeInput.val(type);
	// Pop.hide();

	if (wxLoading) {
		return false;
	}
	wxLoading = true;
	curBtnText = $curBtn.text();
	$curBtn.addClass('disabled').text('正在努力加载，请稍候...');
	// setTimeout(function() {
	// 	wxLoading = false;
	// 	$curBtn.text(curBtnText).removeClass('disabled');
	// }, 5000);
	new Ajax().send({
		url: $form.attr('action'),
		data: $form.serialize(),
		type: $form.attr('method')
	}, function(result) {
		var orderId = result.orderId;

		if (orderId) {
			$('#J-order-id').val(orderId);
		}
		if (result.wxPayParams) { //微信支付
			wxPayData = result;
			wxPay();
		}
	}, function(data) {
		wxLoading = false;
		$curBtn.text(curBtnText).removeClass('disabled');

		var orderId = data.result.orderId;
		if (orderId) {
			$('#J-order-id').val(orderId);
		}
	});
	return false;
}

/**
 * 微信支付
 */
function wxPay() {
	if (typeof WeixinJSBridge == "undefined") {
		if (document.addEventListener) {
			document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
		} else if (document.attachEvent) {
			document.attachEvent('WeixinJSBridgeReady', jsApiCall);
			document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
		}
	} else {
		jsApiCall();
	}
}

/**
 * 调用微信支付接口
 */
function jsApiCall() {
	WeixinJSBridge.invoke(
		'getBrandWCPayRequest', JSON.parse(wxPayData.wxPayParams),
		function(res) {
			wxLoading = false;
			$('.J-pay-btn.btnl-wx').removeClass('disabled').text('微信安全支付');

			WeixinJSBridge.log(res.err_msg);
			if (res.err_msg == "get_brand_wcpay_request:ok") {
				setTimeout(function() {
					location.href = wxPayData.wxPaySucUrl;
				}, 500)
			} else {
				if (res.err_msg != "get_brand_wcpay_request:cancel") {
					alert(res.err_code + " " + res.err_desc);
				}
			}
		}
	);
}


/**
 * 初始化余额
 * @return {[type]} [description]
 */
function initLastMoney() {
	if (lastVal == 0) {
		$moneyLast.addClass('disabled');
	} else {
		$moneyLast.addClass('usable').on('click', function() {
			var $cur = $(this);

			if ($cur.hasClass('selected')) { //不用余额
				$cur.removeClass('selected');
				$useLastInput.val(0);
			} else { //使用余额
				$cur.addClass('selected');
				$useLastInput.val(1);

				//不用淘币
				$('#J-taobi-last').removeClass('selected');
				$('#J-use-taobi').val(0);
			}

			calculateMoney();

		});
	}
}

/**
 * 初始化淘币
 * @return {[type]} [description]
 */
function initLastTaobi() {
	var $tbInput = $('#J-taobi-last-val');
	var $tbLast = $('#J-taobi-last');
	var lastVal = $tbInput.val();

	if (lastVal <= 0) {
		$tbLast.addClass('disabled');
	} else {
		$tbLast.addClass('usable').on('click', function() {
			var $cur = $(this);

			if ($cur.hasClass('selected')) { //不用淘币
				$cur.removeClass('selected');
				$('#J-use-taobi').val(0);
			} else { //使用淘币
				$cur.addClass('selected');
				$('#J-use-taobi').val(1);

				//不用余额
				$('#J-money-last').removeClass('selected');
				$('#J-use-last').val(0);
			}

			calculateMoney();
		});
	}
}


var isInit = true; //是否是初始标识，为了做到初始化时，对还需支付金额不做处理
/**
 * 计算需付多少钱
 * @return {[type]} [description]
 */
function calculateMoney() {
	var isUseLast = $useLastInput.val() != 0; //是否使用余额
	var isUseTicket = !!$useTicket.val(); //是否使用优惠券
	var isUseTaobi = $('#J-use-taobi').val() != 0; //是否使用淘币

	var ticketMoney = +$('#J-ticket-price').text();
	var payNum = totalVal; //还需要支付的钱
	var ticketLastNum = payNum;

	//淘币
	var $minusTaobi = $('#J-minus-taobi');
	var taobiMoney = +$('#J-taobi-last-val').val();


	if (isUseTicket) {
		ticketLastNum = payNum = (payNum - ticketMoney).toFixed(2);
		$lastPay.text(payNum);
		$minusTicket.find('.price b').text(ticketMoney);
		$minusTicket.css('display', 'inline');
	} else {
		if (!isInit) {
			$lastPay.text(payNum);
		}
		$minusTicket.css('display', 'none');
	}

	// if (isUseTaobi) {
	// 	ticketLastNum = payNum = (payNum - taobiMoney).toFixed(2);
	// 	$minusTaobi.find('.price b').text(taobiMoney);
	// 	$minusTaobi.css('display', 'inline');
	// } else {
	// 	$minusTaobi.css('display', 'none');
	// }

	$minusContent.css('display', 'none');
	$minusTaobi.css('display', 'none');

	if (isUseLast) {

		payNum = (payNum - lastVal).toFixed(2);

		if (payNum <= 0) { //余额够用
			payNum = 0;

			$lastPay.text(ticketLastNum);
			$minusContent.css('display', 'none');
			$lastPayLabel.text('需付');
			$('.btnl-yue').text('余额安全支付');
			$('footer').addClass('use-yue');
		} else {
			$lastPay.text(payNum);
			$minusContent.find('.price b').text(lastVal);
			$minusContent.css('display', 'inline');
			$lastPayLabel.text('还需支付');
			$('footer').removeClass('use-yue');
		}

	} else if (isUseTaobi) {

		payNum = (payNum - taobiMoney).toFixed(2);

		if (payNum <= 0) { //淘币够用
			payNum = 0;

			$lastPay.text(ticketLastNum);
			$minusTaobi.css('display', 'none');
			$lastPayLabel.text('需付');
			$('.btnl-yue').text('淘币安全支付');
			$('footer').addClass('use-yue');
		} else {
			$lastPay.text(payNum);
			$minusTaobi.find('.price b').text(taobiMoney);
			$minusTaobi.css('display', 'inline');
			$lastPayLabel.text('还需支付');
			$('footer').removeClass('use-yue');
		}
	} else {
		$lastPayLabel.text('需付');
		$('footer').removeClass('use-yue');
	}

	isInit = false;

	$needPayInput.val(payNum);
}


/**
 * 身份证验证
 */
(function() {
	var $input = $('#J-idcard');
	var $warn = $input.parent().find('.icon-warning');
	var $suc = $input.parent().find('.icon-suc');

	$input.on('input', function() {
		var val = $input.val();

		if (val.length == 18 && Util.IdCard.valid(val)) {
			$warn.css('display', 'none');
			$suc.css('display', 'inline-block');
		} else {
			$warn.css('display', 'inline-block');
			$suc.css('display', 'none');
		}
	});


})();


init(); 
});