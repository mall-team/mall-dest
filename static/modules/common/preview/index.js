define('common/preview/index', function(require, exports, module){ var $ = require('zepto');
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