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
;define('z-person/index', function(require, exports, module){ var $ = require('zepto');
var Alert = require('common/alert/alert');
var Bubble = require('common/bubble/bubble');

window.Bubble = Bubble;

var $btn = $('#J-register')

$btn.on('click', function(evt) {
	var url = $btn.attr('alert');

	if (url) {
		Alert.show(url);
	}
	evt.preventDefault();
}); 
});