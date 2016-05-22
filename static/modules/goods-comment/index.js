define('goods-comment/index', function(require, exports, module){ var $ = require('zepto');
var Ajax = require('common/ajax/index');
var PageLoader = require('common/page-loader/index');
var Bubble = require('common/bubble/bubble');
var Preview = require('common/preview/index');

var lastPageNum = 1;
var curDataLen = 0;

init();

function init() {
	addEvent();
	initPage();
}

function addEvent(){
	$('#J-discuss-list').on('click', '.img-list > li', previewImg);
}

function initPage() {
	new PageLoader({
		container: '#J-discuss-list',
		getHtml: function(pageNum, back) {

			lastPageNum = pageNum;

			new Ajax().send({
				url: '/Mall/Goods/moreComment',
				data: {
					g: getParam('g'),
					page: pageNum,
					type: 1
				}
			}, function(result) {
				var list = result.commentlist.data;

				if (list) {
					curDataLen = list.length;
				}
				back && back(function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='';
 $.each(list, function(i, item){  
__p+='\r\n<li>\r\n\t<div class="img-wrap" style="background-image:url('+
((__t=( item.head_sculpture ))==null?'':__t)+
')"></div>\r\n\t<div class="info">\r\n\t\t<div class="name-wrap">\r\n\t\t\t<label class="name">'+
((__t=( item.customer_name ))==null?'':__t)+
'</label>\r\n\t\t\t<span item-id="'+
((__t=( item.id ))==null?'':__t)+
'" class="yes-bar '+
((__t=( item.isSupport?'active':'' ))==null?'':__t)+
'"><i class="icon-yes"></i><b>'+
((__t=( item.comment_praise_num ))==null?'':__t)+
'</b></span>\r\n\t\t</div>\r\n\t\t<div class="star-wrap">\r\n\t\t\t<div class="star-bar">\r\n\t\t\t\t<div class="star-gray"></div>\r\n\t\t\t\t<div class="star-inner" style="width:'+
((__t=( item.product_score/5*100 ))==null?'':__t)+
'%;">\r\n\t\t\t\t\t<div class="star-active"></div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t\t<span class="date">'+
((__t=( item.create_time ))==null?'':__t)+
'</span>\r\n\t\t</div>\r\n\t\t<p class="cotent">'+
((__t=( item.comment_content ))==null?'':__t)+
'</p>\r\n\t\t';
 if(item.imgList && item.imgList.length > 0){ 
__p+='\r\n\t\t<ul class="img-list">\r\n\t\t\t';
 $.each(item.imgList, function(i, imgUrl){ 
__p+='\r\n\t\t\t<li style="background-image:url('+
((__t=( imgUrl ))==null?'':__t)+
')"></li>\r\n\t\t\t';
 }) 
__p+='\r\n\t\t</ul>\r\n\t\t';
 } 
__p+='\r\n\t\t';
 $.each(item.reply, function(index, replyItem){ 
__p+='\r\n\t\t<p class="cotent-replay"><b>'+
((__t=( replyItem.reply_user ))==null?'':__t)+
'</b>回复<b>'+
((__t=( item.customer_name ))==null?'':__t)+
'</b>：'+
((__t=( replyItem.back_content ))==null?'':__t)+
'</p>\r\n\t\t';
 }) 
__p+='\r\n\t</div>\r\n</li>\r\n';
 }) 
__p+='';
}
return __p;
}({
					list: list
				}), result.commentlist.total_num);
			});


		}
	}).loadFirst().loadEnd(function() {
		// $('.see-more').remove();
		if (lastPageNum > 1) {
			Bubble.show('亲，没有评价了~');
		} else {
			if (curDataLen == 0) {
				$('#J-discuss-list').css('display', 'none');
				$('#J-nodata').css('display', 'block');
			}

		}
	});

}

/**
 * 预览图片
 * @return {[type]} [description]
 */
function previewImg() {
	var $cur = $(this);
	var imgArr = [],
		curIndex = 0;

	$cur.parent().children().each(function(i, img) {
		if ($cur[0] == img) {
			curIndex = i;
		}
		imgArr.push($(img).css('background-image').match(/url\((.*)\)/)[1]);
	});
	Preview.show(imgArr, curIndex);
}

function getParam(name) {
	var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
	var search = location.search;
	var r = search.substr(1).match(reg);

	if (search && r) {
		return r[2];
	} else {
		return '';
	}
} 
});