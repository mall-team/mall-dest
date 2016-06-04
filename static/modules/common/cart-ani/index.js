define('common/cart-ani/index', function(require, exports, module){ var $ = require('zepto');

function CartAni(img, cart) {
	this.$cart = $(cart);
	this.$img = $(img);
}

CartAni.prototype = {
	fly: function(back) {
		var $img = this.$img;
		var $cart = this.$cart;
		var $imgCloneWrap = $(document.createElement('div'));
		var $imgClone = $img.clone();

		$imgCloneWrap.offset({
			top: $img.offset().top,
			left: $img.offset().left
		}).css({
			'opacity': '1',
			'position': 'absolute',
			'height': $img.height(),
			'width': $img.width(),
			'z-index': '10000'
		}).append($imgClone.css({
			position: 'absolute',
			width: '100%',
			height: '100%',
		})).appendTo($('body'));

		$imgCloneWrap.animate({
			'top': $cart.offset().top + 10,
			'left': $cart.offset().left + 10,
			'width': '20px',
			'height': '20px'
		}, 800, 'ease-in-out', function() {
			$imgClone.remove();
			back && back();
		});

		$imgClone.addClass('animated infinite rotate');

	}
};

module.exports = CartAni; 
});