define('common/confirm/index', function(require, exports, module){ var $ = require('zepto');
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