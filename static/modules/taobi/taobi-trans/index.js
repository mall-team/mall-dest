define('taobi/taobi-trans/index', function(require, exports, module){ var $ = require('zepto');
var Ajax = require('common/ajax/index');
var Pop = require('common/pop/index');
var Confirm = require('common/confirm/index');

var curUser = null;

init();

function init() {
	addEvent();
}

function addEvent() {
	$('#J-custom-phone').on('input', checkClient);
	$('#J-amount').on('input', validateMoney);
	$('#J-client-btn').on('click', showClientList);
	$('#J-taobi-submit').on('click', submit);
}

/**
 * 检验我的客户
 * @return {[type]} [description]
 */
function checkClient() {
	var phone = $(this).val();

	if (!/^1[3-8]\d{9}$/.test(phone)) {
		// $('#J-nick').addClass('error').text('请输入正确的手机号码');
		curUser = null;
		$('#J-nick').text('');
		return;
	}

	new Ajax().send({
		url: '/User/Center/verifyMyRecommCustomer',
		data: {
			phone: $('#J-custom-phone').val()
		}
	}, function(result) {
		if (result.state == 1) { //存在该客户
			curUser = result.customer;
			$('#J-nick').removeClass('nochecked').text(curUser.nickname || '该客户验证通过');
		} else { //不存在该客户
			curUser = null;
			$('#J-nick').addClass('nochecked').text('*不在我的客户内');
		}

		checkIsSubmit();
	}, function() {
		curUser = null;
		$('#J-nick').addClass('nochecked').text('*不在我的客户内');
	});
}

/**
 * 显示客户列表
 * @return {[type]} [description]
 */
function showClientList() {

	new Ajax().send({
		url: '/User/Center/getMyCustomerList',
	}, function(result) {
		var $container = $(function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='';
 if(list && list.length > 0){ 
__p+='\r\n<ul class="pop-client-list" style="max-height: '+
((__t=( maxHei ))==null?'':__t)+
'px;overflow-y:auto;">\r\n\t';
 $.each(list, function(i, item){ 
__p+='\r\n\t<li userinfo=\''+
((__t=( JSON.stringify(item) ))==null?'':__t)+
'\'>\r\n\t\t<div class="info">\r\n\t\t\t<div class="img-wrap" style="background-image:url('+
((__t=( item['head_sculpture'] ))==null?'':__t)+
')"></div>\r\n\t\t\t<div class="info-inner">\r\n\t\t\t\t<p class="nick">'+
((__t=( item.nickname ))==null?'':__t)+
'</p>\r\n\t\t\t\t<p class="phone">'+
((__t=( item.cellphone ))==null?'':__t)+
'</p>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<div class="radio '+
((__t=( curUser && curUser.id == item.id?'selected':'' ))==null?'':__t)+
'">\r\n\t\t\t<i class="icon-radio"></i>\r\n\t\t</div>\r\n\t</li>\r\n\t';
 }) 
__p+='\r\n</ul>\r\n';
 }else{ 
__p+='\r\n<div class="pop-client-list empty">您暂时还没有客户哦~~</div>\r\n';
 } 
__p+='';
}
return __p;
}({
			list: result.list,
			curUser: curUser,
			maxHei: $(window).height() * 0.7
		}));

		Pop.show({
			title: '我的客户',
			content: $container
		})
		$container.find('li').on('click', selClient);

		checkIsSubmit();
	});
}

/**
 * 选择用户
 * @return {[type]} [description]
 */
function selClient() {
	var $li = $(this);

	curUser = JSON.parse($li.attr('userinfo'));
	$li.parent().find('.selected').removeClass('selected');
	$li.find('.radio').addClass('selected');
	Pop.hide();

	$('#J-custom-phone').val(curUser.cellphone);
	$('#J-nick').removeClass('nochecked').text(curUser.nickname);
}

/**
 * 检查是否可提交
 * @return {[type]} [description]
 */
function checkIsSubmit() {
	var isSubmit = curUser && /^\d+$/.test($('#J-amount').val().trim());

	$('#J-taobi-submit')[(isSubmit ? 'remove' : 'add') + 'Class']('disabled');
	return isSubmit;
}

/**
 * 验证输入数字
 * @return {[type]} [description]
 */
function validateMoney() {
	var $input = $(this);
	var val = $input.val();
	var arr = val.match(/\d+/);

	if (arr) {
		val = +arr[0];

		if (val <= 0) {
			$input.val('');
			// } else if (val > 99999) {
			// 	$input.val(99999);
		} else {
			$input.val(val);
		}
	} else {
		$input.val('');
	}

	checkIsSubmit();
}

/**
 * 提交，转淘币
 * @return {[type]} [description]
 */
function submit(e) {
	e.preventDefault();

	var $cur = $(this);
	var $form = $('#' + $cur.attr('form'));

	Confirm.show({
		msg: '您确定给' + curUser.nickname + '转' + $('#J-amount').val() + '个淘币吗？',
		yesBack: function() {
			new Ajax().send({
				url: $form.attr('action'),
				type: $form.attr('method'),
				data: $form.serialize()
			}, function(result) {});
		}
	});
} 
});