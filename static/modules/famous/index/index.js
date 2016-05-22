define('famous/index/index', function(require, exports, module){ var Swiper = require('common/swiper/index');

new Swiper({
	container: 'banner',
	pager: 'bannerPager'
});
 
});