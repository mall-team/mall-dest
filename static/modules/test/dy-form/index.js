define('test/dy-form/index', function(require, exports, module){ var $ = require('zepto');


$('#J-submit').on('click', function(){
	$('<form action="bb.html"></form>').appendTo($('body')).submit();
});
 
});