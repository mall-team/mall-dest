define('activity/index', function(require, exports, module){ var $ = require('zepto');
var Ajax = require('common/ajax/index');
var Bubble = require('common/bubble/bubble');
var PageLoader = require('common/page-loader/index');

new PageLoader({
	container: '.act-list',
	pageBegin: 2,
	getHtml: function(pageNum, back) {
		new Ajax().send({
			url: ($(document.body).attr('pageurl')),
			data: {
				page: pageNum
			}
		}, function(result) {
			back && back(function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='';
 $.each(list, function(i, item){ 
__p+='\r\n<li>\r\n\t<a>\r\n\t\t<div class="img-wrap" style="background-image: url('+
((__t=( item.img ))==null?'':__t)+
')"></div>\r\n\t\t<div class="act-info">\r\n\t\t\t<p class="act-title">'+
((__t=( item.title ))==null?'':__t)+
'</p>\r\n\t\t\t';
 if(item.state == 1){ 
__p+='\r\n\t\t\t<div class="act-state doing">进行中</div>\r\n\t\t\t';
 }else if(item.state ==2 ){ 
__p+='\r\n\t\t\t<div class="act-state">已完成</div>\r\n\t\t\t';
 }else if(item.state == 3){ 
__p+='\r\n\t\t\t<div class="act-state cancel">已取消</div>\r\n\t\t\t';
 } 
__p+='\r\n\t\t</div>\r\n\t\t<i class="icon-arrow"></i>\r\n\t</a>\r\n</li>\r\n';
 }) 
__p+='';
}
return __p;
}({
				list: result.actlist
			}));
		});


	}
}).loadEnd(function() {
	Bubble.show('亲，没有更多活动数据了~');
});
 
});