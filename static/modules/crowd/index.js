define('crowd/index', function(require, exports, module){ var $ = require('zepto');

var Swiper = require('common/swiper/index');

new Swiper({
	container: 'banner',
	pager: 'bannerPager'
}); 
});