define('cut-info/index', function(require, exports, module){ var TAP_EVENT = 'click';
var $ = require('zepto');
var PageLoader = require('common/page-loader/index');

require('common/j-ajax/index').init();
var Util = require('common/util/index');

require('common/ad-layer/index');

function Tab(el) {
	var $el = this.$el = $(el);

	this.order = 0;

	this.$navs = $el.find('.tab-nav').children();
	this.$items = $el.find('.tab-content').children();
	this._init();
}

Tab.prototype = {
	_init: function() {
		var self = this;
		var rankType = Util.getParam('rankType') || 0;

		self._toActive(self.$navs.get(rankType));

		self.$navs.on('click', function(evt) {
			self._toActive($(evt.target));
		});

	},

	_toActive: function($cur) {
		$cur = $($cur);

		var self = this;
		var order = self._getOrder($cur, self.$navs);
		var curItem = $(self.$items[order]);

		self.order = order;

		self.$navs.removeClass('active');
		$cur.addClass('active');
		self.$items.css('display', 'none');
		curItem.css('display', 'block');
	},

	_getOrder: function(ele, list) {
		var i = 0,
			len = list.length;
		var cur = ele[0];

		for (; i < len; i++) {
			if (list[i] == cur) {
				return i;
			}
		}
	}
};

new Tab('#J-tab');

var Guide = require('common/guide/guide');
var Timer = require('common/timer/timer');

// Util.phpdataReady(function() {

if (typeof taojinzi === 'undefined') {
	new Guide('#J-invite');
	$('[invite]').each(function(i, el) {
		new Guide(el);
	});
} else {
	$('#J-invite').add($('[invite]')).on('click', function() {
		taojinzi.share(JSON.stringify({
			title: title,
			link: link,
			imgUrl: imgUrl,
			desc: desc
		}));
	});
}
// });

new Timer('#J-timer').start().end(function() {
	location.reload();
});

var Confirm = require('common/confirm/index');
var $body = $(document.body);
var bodyMsg = $body.attr('alert');
var bodyTo;

if (bodyMsg) {
	bodyTo = $body.attr('alert-to');

	Confirm.show({
		type: 'alert',
		msg: bodyMsg,
		yesBack: function() {
			if (bodyTo) {
				location.href = bodyTo;
			}
		}
	});

}


var Ajax = require('common/ajax/index');
var Bubble = require('common/bubble/bubble');
var Util = require('common/util/index');
var Config = require('common/config/index');
var Confirm = require('common/confirm/index');
var Alert = require('common/alert/alert');

$('#J-help-cut').on(TAP_EVENT, function(evt) {
	evt.preventDefault();
	cut();
});

$('#J-cut').on(TAP_EVENT, function(evt) {
	evt.preventDefault();
	cut();
});

$('[bubble]').each(function(i, el) {
	var $el = $(el);
	var msg = $el.attr('bubble');

	if (msg) {
		$el.on(TAP_EVENT, function() {
			Bubble.show(msg);
		});
	}
});


function cut() {
	var $form = $('form');
	var url = $form.attr('action');
	var data = $form.serialize();

	new Ajax().send({
		url: url,
		data: data,
		type: 'post',
		selfSucBack: true,
		selfLoginSuc: function() {
			location.reload();
		}
	}, function(result, data) {
		var txt = Config.cutArr[Util.random(0, 11) - 1];

		Confirm.show({
			msg: txt.replace('$0', '<b style="color: #ea0079;">' + result.price + '</b>'),
			type: 'alert',
			yesBack: function() {
				if (typeof phpdata != 'undefined' && phpdata.redPackage) {
					// showQrcode(function() {
					// 	location.href = data.url;
					// });
					showRedPacket(function() {
						location.href = data.url;
					});
				} else {
					location.href = data.url;
				}
			}
		})
	});
}

// showRedPacket();

/**
 * 显示红包
 */
function showRedPacket(closeBack) {
	var tmpl = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="red-packet-panel">\r\n\t<div class="packet-inner">\r\n\t\t<div class="packet-close"></div>\r\n\t\t<section class="info-section">\r\n\t\t\t<div class="img-wrap head-img" \r\n\t\t\t';
 if(!isTjz){ 
__p+='\r\n\t\t\tstyle="background-image: url('+
((__t=( ownerHead ))==null?'':__t)+
')"\r\n\t\t\t';
 } 
__p+='\r\n\t\t\t></div>\r\n\t\t\t<p class="user-name">'+
((__t=( isTjz?'淘金子商城':(ownerName) ))==null?'':__t)+
'</p>\r\n\t\t\t<p class="des">给你发了一个惊喜礼包</p>\r\n\t\t\t<p class="thanks">'+
((__t=( isTjz?'感谢亲对淘金子的支持！':'谢谢帮砍！' ))==null?'':__t)+
'</p>\r\n\t\t\t<div class="img-erwei">\r\n\t\t\t\t<img src="'+
((__t=( qrCode ))==null?'':__t)+
'" />\r\n\t\t\t\t<!-- <div class="logo"><img src="/static/images/logo.png" /></div> -->\r\n\t\t\t</div>\r\n\t\t\t<div class="tip-content">\r\n\t\t\t\t<p class="tip">扫描关注领惊喜礼包</p>\r\n\t\t\t\t<ul>\r\n\t\t\t\t\t<li>1、长按上述二维码关注公众账号</li>\r\n\t\t\t\t\t<li>2、关注后即可收到惊喜礼包</li>\r\n\t\t\t\t</ul>\r\n\t\t\t</div>\r\n\t\t</section>\r\n\t</div>\r\n</div>';
}
return __p;
};

	phpdata.isTjz = !phpdata.ownerHead && !phpdata.ownerName;

	Alert.show(tmpl(phpdata), false, 'alert-red-packet');
	$('.packet-close').on('click', function() {
		Alert.hide();
		closeBack && closeBack();
	})
}

// showQrcode(function() {
// 	location.href = 'http://www.baidu.com';
// });

function showQrcode(closeBack) {
	Alert.show(function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="cut-qrcode-panel">\r\n\t<h3>关注商城获得更多惊喜</h3>\r\n\t<div class="img-erwei">\r\n\t\t<img src="'+
((__t=( qrCode ))==null?'':__t)+
'" />\r\n\t\t<div class="logo"><img src="/static/images/logo.png" /></div>\r\n\t</div>\r\n\t<p class="tip">长按二维码，扫描关注</p>\r\n</div>';
}
return __p;
}(phpdata), true, 'alert-qrcode-alert');
	$('#J-alert-close').on('click', function() {
		closeBack && closeBack();
	});
}


// var NUM = 10;

// $('.content-item').each(function(i, el) {
// 	var $el = $(el);
// 	var $more = $el.find('.see-more');
// 	var $list = $el.find('.record-list');
// 	var $childs;

// 	if ($list.children().length > NUM) {
// 		$more.css('display', 'block');
// 		resetHei($list);
// 	} else {
// 		$list.css('height', 'auto');
// 	}

// 	$more.on('click', function() {
// 		$list.css('height', 'auto');
// 		$more.css('display', 'none');
// 	});

// });

// function resetHei($list) {
// 	var winWid = $(window).width();

// 	$list.height(80 / 640 * winWid * NUM + 14 * NUM + 7);

// }

var $recordList = $('.record-list');
var $more = $('.see-more');
var $load = $('.J-more-loading');
var _tmplArr = {
	tmpl0: function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='';
 $.each(list, function(key, item){ 
__p+='\r\n<div class="record-item dib-wrap">\r\n\t<a href="/Mall/Haggle/showHaggle?haggleId='+
((__t=( params.activeId ))==null?'':__t)+
'&cutId='+
((__t=( item['id'] ))==null?'':__t)+
'&rankType=1">\r\n\t\t<div class="img-wrap dib" style="background-image: url('+
((__t=( item['head_sculpture'] ))==null?'':__t)+
')"></div>\r\n\t\t<div class="record-m dib">\r\n\t\t\t<div class="record-user">'+
((__t=( item['customer_nickname'] ))==null?'':__t)+
'</div>\r\n\t\t\t<div class="record-date">'+
((__t=( item['update_time'] ))==null?'':__t)+
'</div>\r\n\t\t</div>\r\n\t\t<div class="record-price dib"><label>砍至</label><small>¥</small>'+
((__t=( item['current_price'] ))==null?'':__t)+
'</div>\r\n\t</a>\r\n</div>\r\n';
 }) 
__p+='';
}
return __p;
},
	tmpl1: function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='';
 $.each(list, function(key, item){ 
__p+='\r\n<div class="record-item dib-wrap">\r\n\t<div class="img-wrap dib" style="background-image: url('+
((__t=( item['head_sculpture'] ))==null?'':__t)+
')"></div>\r\n\t<div class="record-m dib">\r\n\t\t<div class="record-user">'+
((__t=( item['customer_nickname'] ))==null?'':__t)+
'<span class="record-date">'+
((__t=( item['create_time'] ))==null?'':__t)+
'</span></div>\r\n\t\t<div class="record-des">'+
((__t=( item['des'] ))==null?'':__t)+
'</div>\r\n\t</div>\r\n\t<div class="record-price dib"><i>-</i><small>¥</small>'+
((__t=( item['haggle_price'] ))==null?'':__t)+
'</div>\r\n</div>\r\n';
 }) 
__p+='';
}
return __p;
}
};

$recordList.each(function(i) {
	var url, params = {};

	switch (i) {
		case 0:
			url = '/Mall/Haggle/haggleSortByPrice'
			break;
		case 1:
			url = '/Mall/Haggle/haggleSortForOwnerId'
			break;
	}

	params.activeId = Util.getParam('haggleId');
	params.ownerId = Util.getParam('ownerId');

	new PageLoader({
		container: $recordList[i],
		seeMore: $more[i],
		pageBegin: 2,
		loading: $load[i],
		getHtml: function(pageNum, back) {
			params.page = pageNum;

			new Ajax().send({
				url: url,
				data: params
			}, function(result) {
				back && back(_tmplArr['tmpl' + i]({
					list: result,
					params: params
				}));
			});


		}
	}).loadEnd(function() {
		$($more[i]).remove();
	});
}); 
});