define('recommend/index', function(require, exports, module){ var $ = require('zepto');
var RecommendAlert = require('recommend-alert/index');
var Pop = require('common/pop/index');


init();

function init(){
	addEvent();
}

function addEvent(){
	$('#J-modify-btn').on('click', modify);
	$('#J-contact-btn').on('click', showPop);
}

/**
 * 修改服务人
 * @return {[type]} [description]
 */
function modify(){
	RecommendAlert.modify();
}

/**
 * 显示电话、短信浮层
 * @return {[type]} [description]
 */
function showPop() {
	var $cur = $(this);
	var tel = $cur.attr('phone');
	var _tmpl = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="contact-panel">\r\n\t<div class="title">联系方式</div>\r\n\t<div class="btn-wrap">\r\n\t\t<a href="tel:'+
((__t=( tel ))==null?'':__t)+
'" class="btnl btnl-default">打电话</a>\r\n\t\t<a href="sms:'+
((__t=( tel ))==null?'':__t)+
'" class="btnl btnl-default">发短信</a>\r\n\t</div>\r\n</div>';
}
return __p;
};

	if(!tel){
		return;
	}
	Pop.show({
		content: _tmpl({
			tel: tel
		})
	});
} 
});