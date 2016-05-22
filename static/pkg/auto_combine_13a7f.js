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
;define('friend-circle/index', function(require, exports, module){ var $ = require('zepto');
var Bubble = require('common/bubble/bubble');

function gotoplay() {
    Bubble.show('暂未开放');
    // var gourl = "http://pyq001.wuse.com/play";
    // if (Math.random() > 0.6) {
    //     gourl = 'http://mp.weixin.qq.com/s?__biz=MzA3MjM1NTM1MA==&mid=209737832&idx=1&sn=0b1278f1a9fbaec425f66afe63b97476&scene=0#rd';
    // }
    // location.href = gourl;
};

function safetostring(str) {
    return String(str).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
}
var nickname = '山';
var headimgurl = "http://wx.qlogo.cn/mmopen/ajNVdqHZLLAkfYkySDWhLS0ib8icMw9iazGC9A2qkq6P93Rnib5C7Av6fDGEDXyv453xgAGricQhmx06GST3JB0Fmjw/0";
var user_sex = 1;
if (user_sex == 2) {
    $("#list").html($("#woman").html());
} else {
    $("#list").html($("#man").html());
}
setTimeout(function() {
    $(".data-name").text(safetostring(nickname));
    $(".data-avt").attr("src", headimgurl);
}, 0);

$(document.body).show();
$("#gotoshare").click(function() {
    $("#guide").show();
});

$("#guide").click(function() {
    $(this).hide();
}); 
});