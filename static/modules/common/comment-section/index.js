define('common/comment-section/index', function(require, exports, module){ var $ = require('zepto');
var Ajax = require('common/ajax/index');
var Preview = require('common/preview/index');
var PageLoader = require('common/page-loader/index');
var Util = require('common/util/index');
var Bubble = require('common/bubble/bubble');

var isInitSupport = false; //是否初始化过赞数据
var productId, productName;

var $discussList = $('#J-discuss-list');

/**
 * 初始化
 * @return {[type]} [description]
 */
function init(options) {
	options = options || {};
	productId = options.id || Util.getParam('g');
	productName = options.name || $('.item-title').text();

	addEvent();
	initPageLoader();
	initSupport();
}

/**
 * 添加事件监听
 */
function addEvent() {
	$('#J-support-btn').on('click', support);
	$discussList.on('click', '.img-list > li', previewImg);
	$discussList.on('click', '.yes-bar', discussSupport);
	$('#J-layer-btn').on('click', showLayer);
	$(document.body).on('click', function() {
		$('#J-layer-btn').parent().removeClass('show');
	});
}

function showLayer(evt) {
	evt.stopPropagation();

	var $parent = $(this).parent();

	if ($parent.hasClass('show')) {
		$parent.removeClass('show');
	} else {
		$parent.addClass('show');
	}
}

/**
 * 初始化分页
 * @return {[type]} [description]
 */
function initPageLoader() {
	new PageLoader({
		container: '#J-discuss-list',
		seeMore: '.see-more',
		getHtml: function(pageNum, back) {

			new Ajax().send({
				url: '/Mall/Goods/moreComment',
				data: {
					g: productId,
					page: pageNum
				}
			}, function(result) {
				var list = result.commentlist.data;

				if (list.length == 0 && pageNum == 1) { //无数据
					$('#J-discuss-list').parent().addClass('empty');
				}

				if (pageNum == 1) { //初始化总评论数
					$('#J-discuss-amount').text(result.commentlist.total_num);
					resetLayer({
						canComment: result.commentlist.canComment,
						link: result.commentlist.commentUrl
					});
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
		$('.see-more').remove();
	});
}

function resetLayer(obj) {
	var $layer = $('#J-discuss-layer');

	if (obj.canComment == 1) { //可以评论
		$layer.find('.J-comment').attr('href', obj.link);
		$layer.css('display', 'block');
	}
}

/**
 * 初始化点赞相关数据
 * @return {[type]} [description]
 */
function initSupport() {
	new Ajax().send({
		url: '/Mall/Goods/initProductLikeData',
		data: {
			g: productId
		}
	}, function(result) {
		var $btn = $('#J-support-btn');
		var $supportList = $('.support-list');

		isInitSupport = true;

		if (result.isSupport) {
			$btn.addClass('active');
		}
		$btn.find('.J-num').text(result.supportTotal);
		$supportList.html(function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='';
 $.each(list, function(i, item){ 
__p+='\r\n<li style="background-image:url('+
((__t=( item.headImg ))==null?'':__t)+
')"></li>\r\n';
 }) 
__p+='';
}
return __p;
}({
			list: result.supportList
		}));
		if (result.supportList.length > 0) {
			$supportList.css('display', 'block');
		}
	});
}

/**
 * 点赞
 * @return {[type]} [description]
 */
function support() {
	var $cur = $(this);
	var $num = $cur.find('.J-num');

	if (!isInitSupport) {
		return false;
	}
	if ($cur.hasClass('active')) {
		Bubble.show('您已赞过，不能重复点赞');
		return;
	}
	$cur.addClass('active');
	$num.text(parseInt($num.text(), 10) + 1);
	new Ajax().send({
		url: '/Mall/Goods/setProductLike',
		data: {
			g: productId,
			goodsName: productName,
			act_id: $('#J-spe-id').val(),
			spe: $('#J-goods-type').val()
		}
	}, function(result) {
		if (result.headImg) {
			$('.support-list').prepend('<li style="background-image:url(' + result.headImg + ')"></li>').css('display', 'block');
		}
	});
}

/**
 * 评论点赞
 * @return {[type]} [description]
 */
function discussSupport() {
	var $cur = $(this);
	var $num = $cur.find('b');

	if ($cur.hasClass('active')) {
		return;
	}
	$cur.addClass('active');
	$num.text(+$num.text() + 1);
	new Ajax().send({
		url: '/Mall/Goods/setCommentLike',
		data: {
			id: $cur.attr('item-id')
		}
	}, function() {});
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

module.exports = {
	init: init
}; 
});