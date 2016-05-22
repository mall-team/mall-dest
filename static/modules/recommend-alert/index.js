define('recommend-alert/index', function(require, exports, module){ var $ = require('zepto');
var Alert = require('common/alert/alert');
var Ajax = require('common/ajax/index');
var Bubble = require('common/bubble/bubble');

var modifyTmpl = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="recommend-alert-content">\r\n\t<p class="title">修改服务人</p>\r\n\t';
 if(!noLimit){ 
__p+='\r\n\t<p class="tips">*每月只能修改一次哦</p>\r\n\t';
 } 
__p+='\r\n\t<div class="input-wrap">\r\n        <label>手机号</label>\r\n        <input class="J-phone" type="tel" name="phone" placeholder="请输入服务人手机号码" autocomplete="off">\r\n    </div>\r\n    <div class="btn-content">\r\n    \t<button type="button" class="J-yes-btn btnl">确认</button>\r\n    </div>\r\n</div>';
}
return __p;
};
var confirmTmpl = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="recommend-alert-content">\r\n\t<p class="title">确认服务人</p>\r\n\t<section class="userinfo">\r\n\t\t<div class="img-wrap headimg" style="background-image:url('+
((__t=( head_sculpture ))==null?'':__t)+
')"></div>\r\n\t\t<p class="user-name">'+
((__t=( nickname ))==null?'':__t)+
'</p>\r\n\t\t<p class="phone-label">'+
((__t=( cellphone ))==null?'':__t)+
'</p>\r\n\t</section>\r\n    <div class="btn-content">\r\n    \t<button type="button" class="J-yes-btn btnl">确认</button>\r\n    </div>\r\n    <div class="modify-wrap">\r\n    \t<a class="modify-link">修改服务人手机号</a>\r\n    </div>\r\n</div>';
}
return __p;
};

var confirmBack,
	noLimit; //没有次数限制
var isShop = false;
var onlyClickHide = false;

/**
 * 修改我的服务人
 * @return {[type]} [description]
 */
function modify(noLimit) {
	Alert.show(modifyTmpl({
		noLimit: noLimit
	}), true, 'recommend-alert');

	var $container = $('.recommend-alert-content');

	$container.find('.J-yes-btn').on('click', function() {
		confirm({
			phone: $container.find('.J-phone').val(),
			noLimit: noLimit
		});
	});

}

/**
 * 确认我的服务人
 * @return {[type]} [description]
 */
function confirm(params) {

	if (params.success) {
		confirmBack = params.success;
	}
	noLimit = params.noLimit;
	isShop = params.isShop;

	if (isShop) {
		onlyClickHide = true;
	}

	if (params.result) {
		confirmAlert(params.result);
		return;
	}

	getRecommendInfo(params.phone, function(result) {

		confirmAlert(result);

	});
}

function confirmAlert(result) {
	Alert.show(confirmTmpl(result), true, 'recommend-alert');

	var $container = $('.recommend-alert-content');

	$container.find('.J-yes-btn').on('click', function() {
		if (onlyClickHide) {
			Alert.hide();
			confirmBack && confirmBack();
		} else {
			modifySubmit($container.find('.phone-label').text());
		}

	});
	$container.find('.modify-link').on('click', modifyAgain);
}

/**
 * 获取推荐人信息
 * @return {[type]} [description]
 */
function getRecommendInfo(phone, back) {
	if (!phone) {
		Bubble.show('请输入手机号码');
		return;
	}
	if (!/^1[3-8]\d{9}$/.test(phone)) {
		Bubble.show('请输入正确手机号码');
		return;
	}

	new Ajax().send({
		url: '/User/Center/getNewServiceInfo',
		type: 'post',
		data: {
			phone: phone
		}
	}, function(result) {
		Alert.hide();
		back && back(result);
	}, function() {
		// Alert.hide();
	});

}

/**
 * 提交修改
 * @param  {[type]} phone [description]
 * @return {[type]}       [description]
 */
function modifySubmit(phone) {
	new Ajax().send({
		url: '/User/Center/changeMyService',
		type: 'post',
		data: {
			phone: phone,
			flag: noLimit ? 1 : 0
		}
	}, function(result) {
		Alert.hide();
		confirmBack && confirmBack();
	});
}

/**
 * 重新修改
 * @return {[type]} [description]
 */
function modifyAgain() {
	onlyClickHide = false;
	Alert.hide();
	modify(noLimit);
}

module.exports = {
	modify: modify,
	confirm: confirm
}; 
});