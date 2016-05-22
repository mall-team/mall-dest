define('klj/klj-alert/index', function(require, exports, module){ var $ = require('zepto');
var Ajax = require('common/ajax/index');
var Alert = require('common/alert/alert');

var tmpl = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="klj-alert-wrap">\r\n\t<a href="/Activity/DanPin/publicUrl" class="img-wrap"></a>\r\n</div>';
}
return __p;
}();


function render() {
	new Ajax().send({
		url: '/Activity/DanPin/showActivity'
	}, function(result) {
		if (result.isShow) {

			Alert.show(tmpl, true, 'klj-alert-content');
			
		}
	});
}


module.exports = {
	render: render
}; 
});