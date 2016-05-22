define('common/ad-layer/index', function(require, exports, module){ var $ = require('zepto');
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