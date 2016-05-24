define('common/copyright/index', function(require, exports, module){ var $ = require('zepto');

var _tmpl = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div id="copyright"><i></i></div>';
}
return __p;
};
var HEI = 64; //组件高度

var $body = $(document.body);
var $win = $(window);
var $copyright;


function render() {
	if ($('#copyright').length > 0 || $('.copyright').length > 0) {
		return;
	}

	var noCr = $body.attr('no-copyright'); //是否不显示copyright
	if (noCr == 1) {
		return;
	}

	$body.append($(_tmpl()));
	$copyright = $('#copyright');

	reset();
}

function reset() {
	var bh = $body.height();
	var wh = $win.height();

	if (bh + HEI < wh) { //页面不满
		$body.css({
			'min-height': wh + 'px',
			'position': 'relative'
		});
		$copyright.css({
			'position': 'absolute',
			'width': '100%',
			'bottom': $body.css('padding-bottom')
		});
	} else {
		$copyright.css({
			'position': 'static',
			'width': 'auto'
		})
	}
}

module.exports = {
	render: render,
	reset: reset
}; 
});
;define('common/swipe/swipe', function(require, exports, module){ function Swipe(container, options) {

  "use strict";

  // utilities
  var noop = function() {}; // simple no operation function
  var offloadFn = function(fn) { setTimeout(fn || noop, 0) }; // offload a functions execution
  
  // check browser capabilities
  var browser = {
    addEventListener: !!window.addEventListener,
    touch: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
    transitions: (function(temp) {
      var props = ['transitionProperty', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'];
      for ( var i in props ) if (temp.style[ props[i] ] !== undefined) return true;
      return false;
    })(document.createElement('swipe'))
  };

  // quit if no root element
  if (!container) return;
  var element = container.children[0];
  var slides, slidePos, width, length;
  options = options || {};
  var index = parseInt(options.startSlide, 10) || 0;
  var speed = options.speed || 300;
  options.continuous = options.continuous !== undefined ? options.continuous : true;

  function setup() {

    // cache slides
    slides = element.children;
    length = slides.length;

    // set continuous to false if only one slide
    if (slides.length < 2) options.continuous = false;

    //special case if two slides
    if (browser.transitions && options.continuous && slides.length < 3) {
      element.appendChild(slides[0].cloneNode(true));
      element.appendChild(element.children[1].cloneNode(true));
      slides = element.children;
    }

    // create an array to store current positions of each slide
    slidePos = new Array(slides.length);

    // determine width of each slide
    width = container.getBoundingClientRect().width || container.offsetWidth;

    element.style.width = (slides.length * width) + 'px';

    // stack elements
    var pos = slides.length;
    while(pos--) {

      var slide = slides[pos];

      slide.style.width = width + 'px';
      slide.setAttribute('data-index', pos);

      if (browser.transitions) {
        slide.style.left = (pos * -width) + 'px';
        move(pos, index > pos ? -width : (index < pos ? width : 0), 0);
      }

    }

    // reposition elements before and after index
    if (options.continuous && browser.transitions) {
      move(circle(index-1), -width, 0);
      move(circle(index+1), width, 0);
    }

    if (!browser.transitions) element.style.left = (index * -width) + 'px';

    container.style.visibility = 'visible';

  }

  function prev() {

    if (options.continuous) slide(index-1);
    else if (index) slide(index-1);

  }

  function next() {

    if (options.continuous) slide(index+1);
    else if (index < slides.length - 1) slide(index+1);

  }

  function circle(index) {

    // a simple positive modulo using slides.length
    return (slides.length + (index % slides.length)) % slides.length;

  }

  function slide(to, slideSpeed) {

    // do nothing if already on requested slide
    if (index == to) return;
    
    if (browser.transitions) {

      var direction = Math.abs(index-to) / (index-to); // 1: backward, -1: forward

      // get the actual position of the slide
      if (options.continuous) {
        var natural_direction = direction;
        direction = -slidePos[circle(to)] / width;

        // if going forward but to < index, use to = slides.length + to
        // if going backward but to > index, use to = -slides.length + to
        if (direction !== natural_direction) to =  -direction * slides.length + to;

      }

      var diff = Math.abs(index-to) - 1;

      // move all the slides between index and to in the right direction
      while (diff--) move( circle((to > index ? to : index) - diff - 1), width * direction, 0);
            
      to = circle(to);

      move(index, width * direction, slideSpeed || speed);
      move(to, 0, slideSpeed || speed);

      if (options.continuous) move(circle(to - direction), -(width * direction), 0); // we need to get the next in place
      
    } else {     
      
      to = circle(to);
      animate(index * -width, to * -width, slideSpeed || speed);
      //no fallback for a circular continuous if the browser does not accept transitions
    }

    index = to;
    offloadFn(options.callback && options.callback(index, slides[index]));
  }

  function move(index, dist, speed) {

    translate(index, dist, speed);
    slidePos[index] = dist;

  }

  function translate(index, dist, speed) {

    var slide = slides[index];
    var style = slide && slide.style;

    if (!style) return;

    style.webkitTransitionDuration = 
    style.MozTransitionDuration = 
    style.msTransitionDuration = 
    style.OTransitionDuration = 
    style.transitionDuration = speed + 'ms';

    style.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
    style.msTransform = 
    style.MozTransform = 
    style.OTransform = 'translateX(' + dist + 'px)';

  }

  function animate(from, to, speed) {

    // if not an animation, just reposition
    if (!speed) {

      element.style.left = to + 'px';
      return;

    }
    
    var start = +new Date;
    
    var timer = setInterval(function() {

      var timeElap = +new Date - start;
      
      if (timeElap > speed) {

        element.style.left = to + 'px';

        if (delay) begin();

        options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);

        clearInterval(timer);
        return;

      }

      element.style.left = (( (to - from) * (Math.floor((timeElap / speed) * 100) / 100) ) + from) + 'px';

    }, 4);

  }

  // setup auto slideshow
  var delay = options.auto || 0;
  var interval;

  function begin() {

    interval = setTimeout(next, delay);

  }

  function stop() {

    delay = 0;
    clearTimeout(interval);

  }


  // setup initial vars
  var start = {};
  var delta = {};
  var isScrolling;      

  // setup event capturing
  var events = {

    handleEvent: function(event) {

      switch (event.type) {
        case 'touchstart': this.start(event); break;
        case 'touchmove': this.move(event); break;
        case 'touchend': offloadFn(this.end(event)); break;
        case 'webkitTransitionEnd':
        case 'msTransitionEnd':
        case 'oTransitionEnd':
        case 'otransitionend':
        case 'transitionend': offloadFn(this.transitionEnd(event)); break;
        case 'resize': offloadFn(setup.call()); break;
      }

      if (options.stopPropagation) event.stopPropagation();

    },
    start: function(event) {

      var touches = event.touches[0];

      // measure start values
      start = {

        // get initial touch coords
        x: touches.pageX,
        y: touches.pageY,

        // store time to determine touch duration
        time: +new Date

      };
      
      // used for testing first move event
      isScrolling = undefined;

      // reset delta and end measurements
      delta = {};

      // attach touchmove and touchend listeners
      element.addEventListener('touchmove', this, false);
      element.addEventListener('touchend', this, false);

    },
    move: function(event) {

      // ensure swiping with one touch and not pinching
      if ( event.touches.length > 1 || event.scale && event.scale !== 1) return

      if (options.disableScroll) event.preventDefault();

      var touches = event.touches[0];

      // measure change in x and y
      delta = {
        x: touches.pageX - start.x,
        y: touches.pageY - start.y
      }

      // determine if scrolling test has run - one time test
      if ( typeof isScrolling == 'undefined') {
        isScrolling = !!( isScrolling || Math.abs(delta.x) < Math.abs(delta.y) );
      }

      // if user is not trying to scroll vertically
      if (!isScrolling) {

        // prevent native scrolling 
        event.preventDefault();

        // stop slideshow
        stop();

        // increase resistance if first or last slide
        if (options.continuous) { // we don't add resistance at the end

          translate(circle(index-1), delta.x + slidePos[circle(index-1)], 0);
          translate(index, delta.x + slidePos[index], 0);
          translate(circle(index+1), delta.x + slidePos[circle(index+1)], 0);

        } else {

          delta.x = 
            delta.x / 
              ( (!index && delta.x > 0               // if first slide and sliding left
                || index == slides.length - 1        // or if last slide and sliding right
                && delta.x < 0                       // and if sliding at all
              ) ?                      
              ( Math.abs(delta.x) / width + 1 )      // determine resistance level
              : 1 );                                 // no resistance if false
          
          // translate 1:1
          translate(index-1, delta.x + slidePos[index-1], 0);
          translate(index, delta.x + slidePos[index], 0);
          translate(index+1, delta.x + slidePos[index+1], 0);
        }

      }

    },
    end: function(event) {

      // measure duration
      var duration = +new Date - start.time;

      // determine if slide attempt triggers next/prev slide
      var isValidSlide = 
            Number(duration) < 250               // if slide duration is less than 250ms
            && Math.abs(delta.x) > 20            // and if slide amt is greater than 20px
            || Math.abs(delta.x) > width/2;      // or if slide amt is greater than half the width

      // determine if slide attempt is past start and end
      var isPastBounds = 
            !index && delta.x > 0                            // if first slide and slide amt is greater than 0
            || index == slides.length - 1 && delta.x < 0;    // or if last slide and slide amt is less than 0

      if (options.continuous) isPastBounds = false;
      
      // determine direction of swipe (true:right, false:left)
      var direction = delta.x < 0;

      // if not scrolling vertically
      if (!isScrolling) {

        if (isValidSlide && !isPastBounds) {

          if (direction) {

            if (options.continuous) { // we need to get the next in this direction in place

              move(circle(index-1), -width, 0);
              move(circle(index+2), width, 0);

            } else {
              move(index-1, -width, 0);
            }

            move(index, slidePos[index]-width, speed);
            move(circle(index+1), slidePos[circle(index+1)]-width, speed);
            index = circle(index+1);  
                      
          } else {
            if (options.continuous) { // we need to get the next in this direction in place

              move(circle(index+1), width, 0);
              move(circle(index-2), -width, 0);

            } else {
              move(index+1, width, 0);
            }

            move(index, slidePos[index]+width, speed);
            move(circle(index-1), slidePos[circle(index-1)]+width, speed);
            index = circle(index-1);

          }

          options.callback && options.callback(index, slides[index]);

        } else {

          if (options.continuous) {

            move(circle(index-1), -width, speed);
            move(index, 0, speed);
            move(circle(index+1), width, speed);

          } else {

            move(index-1, -width, speed);
            move(index, 0, speed);
            move(index+1, width, speed);
          }

        }

      }

      // kill touchmove and touchend event listeners until touchstart called again
      element.removeEventListener('touchmove', events, false)
      element.removeEventListener('touchend', events, false)

    },
    transitionEnd: function(event) {

      if (parseInt(event.target.getAttribute('data-index'), 10) == index) {
        
        if (delay) begin();

        options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);

      }

    }

  }

  // trigger setup
  setup();

  // start auto slideshow if applicable
  if (delay) begin();


  // add event listeners
  if (browser.addEventListener) {
    
    // set touchstart event on element    
    if (browser.touch) element.addEventListener('touchstart', events, false);

    if (browser.transitions) {
      element.addEventListener('webkitTransitionEnd', events, false);
      element.addEventListener('msTransitionEnd', events, false);
      element.addEventListener('oTransitionEnd', events, false);
      element.addEventListener('otransitionend', events, false);
      element.addEventListener('transitionend', events, false);
    }

    // set resize event on window
    window.addEventListener('resize', events, false);

  } else {

    window.onresize = function () { setup() }; // to play nice with old IE

  }

  // expose the Swipe API
  return {
    setup: function() {

      setup();

    },
    slide: function(to, speed) {
      
      // cancel slideshow
      stop();
      
      slide(to, speed);

    },
    prev: function() {

      // cancel slideshow
      stop();

      prev();

    },
    next: function() {

      // cancel slideshow
      stop();

      next();

    },
    getPos: function() {

      // return current index position
      return index;

    },
    getNumSlides: function() {
      
      // return total number of slides
      return length;
    },
    kill: function() {

      // cancel slideshow
      stop();

      // reset element
      element.style.width = 'auto';
      element.style.left = 0;

      // reset slides
      var pos = slides.length;
      while(pos--) {

        var slide = slides[pos];
        slide.style.width = '100%';
        slide.style.left = 0;

        if (browser.transitions) translate(pos, 0, 0);

      }

      // removed event listeners
      if (browser.addEventListener) {

        // remove current event listeners
        element.removeEventListener('touchstart', events, false);
        element.removeEventListener('webkitTransitionEnd', events, false);
        element.removeEventListener('msTransitionEnd', events, false);
        element.removeEventListener('oTransitionEnd', events, false);
        element.removeEventListener('otransitionend', events, false);
        element.removeEventListener('transitionend', events, false);
        window.removeEventListener('resize', events, false);

      }
      else {

        window.onresize = null;

      }

    }
  }

}

module.exports = Swipe;

// if ( window.jQuery || window.Zepto ) {
//   (function($) {
//     $.fn.Swipe = function(params) {
//       return this.each(function() {
//         $(this).data('Swipe', new Swipe($(this)[0], params));
//       });
//     }
//   })( window.jQuery || window.Zepto )
// }
 
});
;define('common/swiper/index', function(require, exports, module){ var $ = require('zepto');
var Swipe = require('common/swipe/swipe');


function S(options) {
	this.$container = typeof options.container == 'string' ? $('#' + options.container) : options.container;
	this.$pager = typeof options.container == 'string' ? $('#' + options.pager) : options.pager;
	this.swipeOptions = options.swipeOptions;

	this._init();
};

S.prototype = {
	_init: function() {
		this._initSwipe();
	},
	/**
	 * 初始化滑动插件
	 * @return {[type]} [description]
	 */
	_initSwipe: function() {
		var self = this;
		var swipeOptions = $.extend({
			startSlide: 0,
			auto: 2500,
			continuous: true,
			disableScroll: false,
			stopPropagation: true,
			callback: function(index, element) {},
			transitionEnd: function(index, element) {
				self._changePager(index);
			}
		}, self.swipeOptions);

		self.swipe = Swipe(self.$container[0], swipeOptions);
		self._initPager(self.swipe.getNumSlides());
		self._changePager(swipeOptions.startSlide || 0);
	},
	/**
	 * 初始化页码
	 * @param  {[type]} length [description]
	 * @return {[type]}        [description]
	 */
	_initPager: function(length) {
		var self = this;
		var $pagerContent = self.$pager.find("span");
		var i = 1;
		var sLen = self.sLen = length;

		$pagerContent.html('<a href="javascript:;" class="sel"></a>');
		for (i; i < sLen; i++) {
			$pagerContent.append('<a href="javascript:;" class="nosel"></a>');
		}
	},
	/**
	 * 更改页码
	 * @param  {[type]} index [description]
	 * @return {[type]}       [description]
	 */
	_changePager: function(index) {
		var self = this;
		var $pager = self.$pager;
		var $pagerContent = self.$pager.find("span");
		var sLen = self.sLen;

		$pagerContent.children('a').attr("class", "nosel");
		if (sLen == 2 && index > 1) { //处理插件BUG
			switch (index) {
				case 2:
					$pagerContent.children('a').eq(0).attr("class", "sel");
					break;
				case 3:
					$pagerContent.children('a').eq(1).attr("class", "sel");
					break;
			}
		} else {
			$pagerContent.children('a').eq(index).attr("class", "sel");
		}
	}

};



// var bannerLength = 0,
// 	pictureName = new Array();

// var curOptions;

// function init(options) {
// 	curOptions = options;
// 	initSwipe();
// 	$("#bannerPager").children('label').text(pictureName[0]);
// }

// //初始化滑动插件
// function initSwipe() {
// 	var elem = document.getElementById("banner");

// 	window.mySwipe = Swipe(elem, {
// 		startSlide: 0,
// 		auto: 2500,
// 		continuous: true,
// 		disableScroll: false,
// 		stopPropagation: true,
// 		callback: function(index, element) {},
// 		transitionEnd: function(index, element) {
// 			changeBannerPager(index);
// 		}
// 	});
// 	initBannerPager(mySwipe.getNumSlides());
// }
// //写入banner页数
// function initBannerPager(length) {
// 	var i = 1;
// 	bannerLength = length;

// 	$("#bannerPager").find("span").html('<a href="javascript:;" class="sel"></a>');
// 	for (i; i < bannerLength; i++) {
// 		$("#bannerPager").find("span").append('<a href="javascript:;" class="nosel"></a>');
// 	}
// }
// //banner页数标记改变
// function changeBannerPager(index) {
// 	$("#bannerPager").find("span").children('a').attr("class", "nosel");
// 	if (bannerLength == 2 && index > 1) { //处理插件BUG
// 		switch (index) {
// 			case 2:
// 				$("#bannerPager").find("span").children('a').eq(0).attr("class", "sel");
// 				$("#bannerPager").children('label').text(pictureName[0]);
// 				break;
// 			case 3:
// 				$("#bannerPager").find("span").children('a').eq(1).attr("class", "sel");
// 				$("#bannerPager").children('label').text(pictureName[1]);
// 				break;
// 		}
// 	} else {
// 		$("#bannerPager").find("span").children('a').eq(index).attr("class", "sel");
// 		$("#bannerPager").children('label').text(pictureName[index]);
// 	}
// }

module.exports = S; 
});
;define('common/bubble/bubble', function(require, exports, module){ var $ = require('zepto');
var _tmpl = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div id="J-bubble" class="bubble">\r\n\t<div class="mask"></div>\r\n\t<div class="bubble-content"></div>\r\n</div>';
}
return __p;
}();
var timer;

var $b, $content;

function show(msg, duration) {
	if (!$b) {
		$(document.body).append(_tmpl);
		$b = $('#J-bubble');
		$content = $b.find('.bubble-content');
	}
	$content.text(msg);
	$b.css('display', 'block').animate({
		opacity: 1
	});
	if (timer) {
		clearTimeout(timer);
	}
	timer = setTimeout(function() {
		hide();
		timer = null;
	}, duration || 2000);

}

function hide() {
	$b.animate({
		opacity: 0
	}, function(){
		$b.css('display', 'none');
	})
}

module.exports = {
	show: show,
	hide: hide
}; 
});
;define('common/util/index', function(require, exports, module){ /**
 * 获取min到max之间的一个随机数(包含max，不含min)
 */
function random(min, max) {
	return min + Math.ceil(Math.random() * max);
}

function random2(min, max) {
	return min + Math.floor(Math.random() * max);
}

/**
 * 通过url获取参数
 */
function getParam(name, search) {
	var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
	var search = search || location.search;
	var r = search.substr(1).match(reg);

	if (search && r) {
		return r[2];
	} else {
		return '';
	}
}

/**
 * 获取动画结束事件的名字
 */
function getAniEndName() {
	var transElement = document.createElement('trans');
	var transitionEndEventNames = {
		'WebkitTransition': 'webkitTransitionEnd',
		'MozTransition': 'transitionend',
		'OTransition': 'oTransitionEnd',
		'transition': 'transitionend'
	};
	var animationEndEventNames = {
		'WebkitTransition': 'webkitAnimationEnd',
		'MozTransition': 'animationend',
		'OTransition': 'oAnimationEnd',
		'transition': 'animationend'
	};

	function findEndEventName(endEventNames) {
		for (var name in endEventNames) {
			if (transElement.style[name] !== undefined) {
				return endEventNames[name];
			}
		}
	}
	return {
		transEvtName: findEndEventName(transitionEndEventNames),
		aniEvtName: findEndEventName(animationEndEventNames)
	};
}

/**
 * phpdata已预备好
 */
function phpdataReady(back) {
	if (typeof phpdata == 'object') {
		back && back(phpdata);
		return;
	}

	setTimeout(function() {
		phpdataReady(back);
	}, 200);
}

/**
 * 验证身份证号码
 */
var IdCard = {};

(function(IdCard) {
	var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // 加权因子
	var ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 身份证验证位值.10代表X

	IdCard.valid = IdCardValidate;


	function IdCardValidate(idCard) {
		idCard = trim(idCard.replace(/ /g, "")); //去掉字符串头尾空格                     
		if (idCard.length == 15) {
			return isValidityBrithBy15IdCard(idCard); //进行15位身份证的验证    
		} else if (idCard.length == 18) {
			var a_idCard = idCard.split(""); // 得到身份证数组   
			if (isValidityBrithBy18IdCard(idCard) && isTrueValidateCodeBy18IdCard(a_idCard)) { //进行18位身份证的基本验证和第18位的验证
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
	/**  
	 * 判断身份证号码为18位时最后的验证位是否正确  
	 * @param a_idCard 身份证号码数组  
	 * @return  
	 */
	function isTrueValidateCodeBy18IdCard(a_idCard) {
		var sum = 0; // 声明加权求和变量   
		if (a_idCard[17].toLowerCase() == 'x') {
			a_idCard[17] = 10; // 将最后位为x的验证码替换为10方便后续操作   
		}
		for (var i = 0; i < 17; i++) {
			sum += Wi[i] * a_idCard[i]; // 加权求和   
		}
		valCodePosition = sum % 11; // 得到验证码所位置   
		if (a_idCard[17] == ValideCode[valCodePosition]) {
			return true;
		} else {
			return false;
		}
	}
	/**  
	 * 验证18位数身份证号码中的生日是否是有效生日  
	 * @param idCard 18位书身份证字符串  
	 * @return  
	 */
	function isValidityBrithBy18IdCard(idCard18) {
		var year = idCard18.substring(6, 10);
		var month = idCard18.substring(10, 12);
		var day = idCard18.substring(12, 14);
		var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
		// 这里用getFullYear()获取年份，避免千年虫问题   
		if (temp_date.getFullYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day)) {
			return false;
		} else {
			return true;
		}
	}
	/**  
	 * 验证15位数身份证号码中的生日是否是有效生日  
	 * @param idCard15 15位书身份证字符串  
	 * @return  
	 */
	function isValidityBrithBy15IdCard(idCard15) {
		var year = idCard15.substring(6, 8);
		var month = idCard15.substring(8, 10);
		var day = idCard15.substring(10, 12);
		var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
		// 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法   
		if (temp_date.getYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day)) {
			return false;
		} else {
			return true;
		}
	}
	//去掉字符串头尾空格   
	function trim(str) {
		return str.replace(/(^\s*)|(\s*$)/g, "");
	}



})(IdCard);

module.exports = {
	getParam: getParam,
	random: random,
	random2: random2,
	getAniEndName: getAniEndName,
	phpdataReady: phpdataReady,
	IdCard: IdCard
}; 
});
;define('common/alert/alert', function(require, exports, module){ var $ = require('zepto');
var Util = require('common/util/index');
var _tmpl = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div id="J-alert" class="alert">\r\n\t<div id="J-alert-mask" class="mask"></div>\r\n\t<div id="J-alert-content-wrap" class="alert-content">\r\n\t\t<i id="J-alert-close" class="icon-close"></i>\r\n\t\t<div id="J-alert-content"></div>\r\n\t</div>\r\n</div>';
}
return __p;
};

var $win = $(window),
	$html = $('html'),
	$body = $(document.body);
var winHei = $win.height();
var $alert, $mask, $contentWrap, $content, $close;
var winScrollY = 0;
var bodyStyle, htmlStyle;

var addClsName;

/**
 * 显示alert框
 * @param  {[type]}  html     [html代码]
 * @param  {Boolean} hasClose [是否显示关闭按钮]
 * @param  {[type]}  addCls   [添加自定义class]
 * @return {[type]}           [description]
 */
function show(html, hasClose, addCls, closeBack) {
	if (!$alert) {
		$(document.body).append(_tmpl());
		$alert = $('#J-alert');
		$contentWrap = $('#J-alert-content-wrap');
		$content = $('#J-alert-content');
		$mask = $('#J-alert-mask');
		$close = $('#J-alert-close');

		$close.on('click', function(evt) {
			hide();
			evt.preventDefault();
			closeBack && closeBack();
		});
	} else {
		$alert.css('display', 'block');
	}
	if(addCls){
		addClsName = addCls;
		$contentWrap.addClass(addCls);
	}

	winScrollY = window.scrollY;
	htmlStyle = $html.attr('style');
	bodyStyle = $body.attr('style');
	$html.attr('style', 'position: relative; overflow: hidden; height: ' + winHei + 'px;');
	$body.attr('style', 'overflow: hidden; height: ' + winHei + 'px; padding: 0px;');


	if (typeof html === 'string' && !/<.*>/.test(html)) { //url
		if(/close=0/.test(html)){
			hasClose = false;
		}
		$content.html($(_createIframe(html)));
	} else { //html
		$content.html($(html));
	}

	if (hasClose === true || hasClose === undefined) {
		$close.css('display', 'block');
	} else {
		$close.css('display', 'none')
	}
	_resize();
	$win.on('resize', _resize);
}

function hide() {
	if(addClsName){
		$contentWrap.removeClass(addClsName);
		addClsName = undefined;
	}

	$alert.css('display', 'none');
	$win.off('resize', _resize);

	$html.attr('style', htmlStyle);
	$body.attr('style', bodyStyle);
	window.scroll(0, winScrollY);
}

function _createIframe(url) {
	var iframe = document.createElement('iframe');

	iframe.src = url;
	iframe.onload = function() {
		// iframe.style.height = $(iframe.contentWindow.document.body).height() + 'px';
		_hasCloseByUrl(iframe.contentWindow.location.search);
		iframe.style.height = iframe.contentWindow.document.body.offsetHeight + 'px';
		_resize();
	};
	return iframe;
}

function _resize() {
	var winHei = $win.height();
	var hei = $contentWrap.height();

	$contentWrap.css('margin-top', (winHei - hei) / 2);
}

function _hasCloseByUrl(search) {
	var isClose = Util.getParam('close', search);

	if (isClose === '0') {
		$close.css('display', 'none');
	} else {
		$close.css('display', 'block');
	}
}


module.exports = {
	show: show,
	hide: hide
}; 
});
;define('common/confirm-service/index', function(require, exports, module){ var $ = require('zepto');
var Ajax;
var Bubble = require('common/bubble/bubble');
var Alert = require('common/alert/alert');

var _selServiceTmpl = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="service-alert-content">\r\n\t';
 if(userList.length == 2){ 
__p+='\r\n\t<p class="title">请选择一位朋友作为您的推荐人(<b>2选1</b>)</p>\r\n\t';
 }else{ 
__p+='\r\n\t<p class="title">请确认您的推荐人</p>\r\n\t';
 } 
__p+='\r\n\t<ul class="service-list">\r\n\t\t';
 $.each(userList, function(i, user){ 
__p+='\r\n\t\t<li>\r\n\t\t\t<div class="img-wrap headimg" style="background-image:url('+
((__t=( user.headImg ))==null?'':__t)+
')"></div>\r\n\t\t\t<p class="user-name">'+
((__t=( user.userName ))==null?'':__t)+
'</p>\r\n\t\t\t<p class="phone-label">'+
((__t=( user.phone ))==null?'':__t)+
'</p>\r\n\t\t\t<a class="J-sel-btn btnl" recommend="'+
((__t=( user.recommend ))==null?'':__t)+
'">就Ta了</a>\r\n\t\t</li>\r\n\t\t';
 }) 
__p+='\r\n\t</ul>\r\n</div>';
}
return __p;
};
var _phoneServiceTmpl = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="service-alert-content">\r\n\t<p class="title">请填写您的推荐人</p>\r\n\t<div class="input-wrap phone-wrap">\r\n        <label>手机号</label>\r\n        <input class="J-phone" type="tel" name="phone" placeholder="请输入推荐人手机号码" autocomplete="off">\r\n    </div>\r\n    <div class="userinfo"></div>\r\n    <div class="btn-content">\r\n    \t<button type="button" class="J-submit btnl btnl-wx disabled">确认</button>\r\n    </div>\r\n    <div class="link-wrap">\r\n        <a class="J-self-link link">我自己逛来的</a>\r\n    </div>\r\n</div>';
}
return __p;
};

var recommend;
var recommendLog;

/**
 * 验证服务人
 * @param  {[type]} phone [description]
 * @return {[type]}       [description]
 */
function validService(phone, code, ajax, back, errorBack) {

	Ajax = ajax;
	recommend = '';
	recommendLog = {};

	new Ajax().send({
		url: '/WeChat/Band/checkUserRecommend',
		type: 'post',
		data: {
			phone: phone,
			code: code
		}
	}, function(result) {
		var type = result.type; //0已有服务人 1有服务人推荐 2无服务人推荐

		recommendLog.type = type;
		recommendLog.phone = phone;

		switch (type) {
			case 0:
				back && back();
				break;
			case 1:
				selServicePeople(result, function() {
					recommendLog.userList = result.user;
					recommendLog.selRecommend = recommend;

					recordLog();
					back && back(recommend);
				});
				break;
			case 2:
				showPhoneService(function() {
					if (recommendLog.type == 10) {
					} else {
						recommendLog.selRecommend = recommend;
					}

					recordLog();
					back && back(recommend);
				});
				break;
		}

	}, function() {
		errorBack && errorBack();
	});
}

/**
 * 记录推荐选择
 * @return {[type]} [description]
 */
function recordLog() {
	new Ajax().send({
		url: '/User/Register/selectRecommendLog',
		type: 'post',
		data: {
			data: JSON.stringify(recommendLog)
		}
	}, function(result) {
		console.log(result);
	});
}

/**
 * 选择服务人
 * @return {[type]} [description]
 */
function selServicePeople(result, back) {
	var $container;

	Alert.show(_selServiceTmpl({
		userList: result.user
	}), false, 'service-alert');

	$container = $('.service-alert-content');

	$container.find('.J-sel-btn').on('click', function() {
		Alert.hide();
		recommend = $(this).attr('recommend');

		back && back();
	});

}

function showPhoneService(back) {
	var $container;
	var $phone, $submit;
	Alert.show(_phoneServiceTmpl(), false, 'service-alert');

	$container = $('.service-alert-content');
	$phone = $container.find('.J-phone');
	$submit = $container.find('.J-submit');

	$phone.get(0).focus();
	$phone.on('input', function() {
		var phone = $phone.val().trim();

		if (/^1[3-8]\d{9}$/.test(phone)) {

			getService(phone, function(user) {
				recommendLog.userList = [user];

				$submit.removeClass('disabled');
				recommend = user.recommend;
				$container.find('.userinfo').html('<div class="head-img" style="background-image:url(' + user.headImg + ')"></div><div class="user-name">' + user.userName + '</div>');

			}, function(err) {
				$submit.addClass('disabled');
				$container.find('.userinfo').html('<p class="err">' + err.msg + '</p>');
			});

		} else {
			$submit.addClass('disabled');
			$container.find('.userinfo').html('');
		}
	});
	$submit.on('click', function() {
		var phone = $phone.val();

		if ($submit.hasClass('disabled')) {
			return false;
		}
		Alert.hide();
		back && back();
	});

	//自己来的
	$container.find('.J-self-link').on('click', function() {
		recommend = '';
		Alert.hide();

		recommendLog.type = 10;
		back && back();
	});
}

/**
 * 获取服务人
 * @param  {[type]} phone [description]
 * @return {[type]}       [description]
 */
function getService(phone, back, errorBack) {
	new Ajax().send({
		url: '/WeChat/Band/getRecommendPhone',
		data: {
			phone: phone
		},
		selfErrorBack: true
	}, function(result) {
		back && back(result);
	}, function(err) {
		errorBack && errorBack(err);
	});
}

module.exports = {
	start: validService
}; 
});
;define('common/config/index', function(require, exports, module){ 

module.exports = {
	// mod: 'dev',
	// mock: true,
	// host: 'http://172.18.8.95',
	// host: 'http://devmall.taojinzi.cn',
	// host: 'http://testmall.taojinzi.cn',
	// host: 'http://wemall.shaowei.com',

	cutArr: [
		'华丽的一刀！砍掉了$0元！',
		'好狠的一刀！砍掉了$0元！',
		'帅气的一刀！砍掉了$0元！',
		'猥琐的一刀！砍掉了$0元！',
		'霸气的一刀！砍掉了$0元！',
		'精彩的一刀！砍掉了$0元！',
		'犀利的一刀！砍掉了$0元！',
		'轻轻的一刀！砍掉了$0元！',
		'温柔的一刀！砍掉了$0元！',
		'潇洒的一刀！砍掉了$0元！',
		'漂亮的一刀！砍掉了$0元！'
	]
}; 
});
;define('common/pop/index', function(require, exports, module){ var $ = require('zepto');
var _tmpl = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div id="J-pop" class="pop">\r\n\t<div class="mask"></div>\r\n\t<div class="container">\r\n\t\t<div class="close"></div>\r\n\t\t<div class="title"></div>\r\n\t\t<div class="content"></div>\r\n\t</div>\r\n</div>';
}
return __p;
};

var curOptions;
var $pop, $mask, $container, $content;
var winHei = $(window).height();
var winScrollY = 0;

var focusGap = 100;

function _init() {
	if (!$pop) {
		$(document.body).append(_tmpl());

		$pop = $('#J-pop');
		$mask = $pop.find('.mask');
		$container = $pop.find('.container');
		$title = $pop.find('.title');
		$content = $pop.find('.content');
		$close = $pop.find('.close');

		// $pop.css('min-height', winHei + 'px');
	}

	$mask.add($close).on('click', function() {
		if(curOptions.manualClose === false){
			return;
		}
		hide();
	});

}

_init();

function show(options) {
	curOptions = options;

	if (options.autoY) {
		winScrollY = window.scrollY;
	} else {
		winScrollY = 0;
	}

	// $pop.css('height', winHei);

	$content.html($(options.content));
	$('input').on('focus', inputFocus);

	if (options.hasClose === false) {
		$close.css('display', 'none');
	} else {
		$close.css('display', 'block');
	}

	if (options.title) {
		$title.text(options.title).css('display', 'block');
	} else {
		$title.css('display', 'none');
	}

	if (options.scroll) {
		$pop.css('position', 'fixed');
	} else {
		$pop.css('position', 'absolute');
		$('html').attr('style', 'position: relative; overflow: hidden; height: ' + winHei + 'px;');
		$('body').attr('style', 'overflow: hidden; height: ' + winHei + 'px; padding: 0px;');
	}

	$pop.css('display', 'block');

	$container.animate({
		translateY: '0'
	}, 500, 'ease-out');

	// $mask.animate({
	// 	opacity: '0.8'
	// }, 500, 'ease-out');


}

function hide(back) {
	$container.animate({
		translateY: '100%'
	}, 500, 'ease-in', function() {
		$('html').attr('style', '');
		$('body').attr('style', '');
		$pop.css('display', 'none');
		if (!curOptions.scroll && winScrollY) {
			window.scroll(0, winScrollY);
		}
		back && back();
	});
	// $mask.animate({
	// 	opacity: 0
	// }, 500, 'ease-in', function() {
	// 	$('html').attr('style', '');
	// 	$('body').attr('style', '');
	// });

}


function inputFocus(evt) {
	var $cur = $(this);

	$(window).on('resize', fixPos);

	function fixPos() {
		$(window).off('resize', fixPos);

		// var offset = $cur.offset();
		// var winHei = $(window).height();
		// var bottom = winHei - offset.top - $cur.height() - focusGap; //输入框距页面底部距离

		// if (bottom < 0) {
		// 	bottom = 0;
		// }
		// $container.css('bottom', '-' + bottom + 'px');
	}

}


module.exports = {
	show: show,
	hide: hide
}; 
});
;define('common/login-pop/index', function(require, exports, module){ var $ = require('zepto');
var Pop = require('common/pop/index');
// var Ajax = require('common/ajax/index');
var Ajax;
var Bubble = require('common/bubble/bubble');
var Alert = require('common/alert/alert');
var ConfirmService = require('common/confirm-service/index');

var _tmpl = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<section class="phone-panel">\r\n\t<div class="input-wrap">\r\n\t\t<label>手机号</label>\r\n\t\t<input id="J-phone" type="tel" placeholder="请输入您的手机号码" />\r\n\t</div>\r\n\t<div class="yzm">\r\n\t\t<div class="input-wrap">\r\n\t\t\t<label>验证码</label>\r\n\t\t\t<input id="J-code" type="tel" placeholder="输入验证码" />\r\n\t\t</div>\r\n\t\t<button style="vertical-align: top;" id="J-yzm-bt" type="button">获取验证码</button>\r\n\t</div>\r\n\t<div>\r\n\t\t<button id="J-phone-ok" class="btnl btnl-wx">确认</button>\r\n\t</div>\r\n</section>';
}
return __p;
};

var options;
var disabled = false; //验证按钮是否禁用

var $yzmBt, $submitBt, $phone, $code;
var loagining = false;

function show(opts) {
	Pop.show({
		content: _tmpl(),
		hasClose: false,
		manualClose: opts.manualClose
	});

	init(opts);
}

function init(opts) {
	options = opts;
	Ajax = opts.Ajax;

	$yzmBt = $('#J-yzm-bt');
	$submitBt = $('#J-phone-ok');
	$phone = $('#J-phone');
	$code = $('#J-code');

	$yzmBt.on('click', getCode);
	$submitBt.on('click', login);
}

/**
 * 获取验证码
 */
function getCode() {
	if (disabled) {
		return false;
	}

	var phone = $phone.val();
	var curTime = 60;

	new Ajax().send({
		url: '/WeChat/Band/sendMsg',
		data: {
			phone: phone
		}
	}, function() {
		disabled = true;
		$yzmBt.text(curTime).addClass('disabled');
		start();
	});

	function start() {
		setTimeout(function() {
			curTime--;
			$yzmBt.text(curTime);

			if (curTime <= 0) {
				disabled = false;
				$yzmBt.text('获取验证码').removeClass('disabled');
				return;
			}
			start();
		}, 1000)
	}
	return false;
}

/**
 * 验证登陆
 */
function login(evt) {
	var phone = $phone.val();
	var code = $code.val();
	// var recommend = getParam('recommend');
	var params;

	if (!phone) {
		Bubble.show('请输入您的手机号码');
		return false;
	} else if (!/^\d{11}$/.test(phone)) {
		Bubble.show('请输入正确的手机号码');
		return false;
	} else if (!code) {
		Bubble.show('请输入验证码');
		return false;
	} else if (loagining) {
		return false;
	}

	params = {
		phone: phone,
		code: code
	};

	// if (recommend) {
	// 	params.recommend = recommend;
	// }

	if (typeof phpdata === 'object') {
		$.each(['channelType', 'channelId'], function(i, key) {
			if (phpdata[key]) {
				params[key] = phpdata[key];
			}
		});
	}

	loagining = true;

	if (options.noSelRecommend) {
		loginAjax();
	} else {
		ConfirmService.start(phone, code, Ajax, function(recommend) {

			if (recommend) {
				params.recommend = recommend;
			}

			loginAjax();

		}, function() {
			loagining = false;
		});
	}

	function loginAjax() {

		new Ajax().send({
			url: '/WeChat/Band/bandAccount',
			type: 'post',
			data: params
		}, function() {
			loagining = false;
			Pop.hide();
			options.loginSuc && options.loginSuc();
		}, function() {
			loagining = false;
		});
	}
	return false;
}


/**
 * 通过url获取参数
 */
function getParam(name, search) {
	var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
	var search = search || location.search;
	var r = search.substr(1).match(reg);

	if (search && r) {
		return r[2];
	} else {
		return '';
	}
}


module.exports = {
	show: show,
	init: init
}; 
});
;define('common/ajax/index', function(require, exports, module){ var $ = require('zepto');
var Bubble = require('common/bubble/bubble');
var Conf = require('common/config/index');
var LoginPop = require('common/login-pop/index');


// if (Conf.mod == 'dev' && Conf.mock) {
// 	require.async('common/mock-list/index');
// }

function Ajax() {}

Ajax.prototype = {

	send: function(options, back, errorBack) {
		var self = this;

		if (!options) {
			options = {};
		}

		if (Conf.mod == 'dev') {
			options.dataType = 'jsonp';
			options.type = 'get';
			options.url = Conf.host + options.url;
		} else {
			options.dataType = options.dataType || 'json';
		}

		//添加ajax请求参数，给php用
		// var data = options.data = options.data || {};
		// if (typeof data === 'string') {
		// 	data += '&tjzAjax=1';
		// } else if (typeof data === 'object') {
		// 	data.tjzAjax = 1;
		// }
		// options.data = data;
		if (options.url.match(/\?[^=]+=.*$/)) {
			options.url += '&isAjax=1';
		} else {
			options.url += '?isAjax=1';
		}

		options.success = function(data) {
			if (options.selfBack) { //调用者自己处理返回结果
				back && back(data);
				return;
			}
			var msg = data.msg,
				url = data.url;

			if (data.code == 0) { //成功
				back && back(data.result, data);
				if(options.selfSucBack){ //调用者自己处理返回成功结果
					return;
				}
			} else {
				if(data.code == 1000){ //快速登陆
					LoginPop.show({
						Ajax: Ajax,
						loginSuc: function(){
							if(options.selfLoginSuc){
								options.selfLoginSuc();
								return;
							}
							self.send(options, back, errorBack);
						}
					});

					return;
				}
				errorBack && errorBack(data);
				if (options.selfErrorBack) { //调用者自己处理返回失败结果
					return;
				}
			}

			if (msg) {
				Bubble.show(msg);
				if (url) {
					setTimeout(function() {
						location.href = url;
					}, 2000);
				}
			} else {
				if (url) {
					location.href = url;
				}
			}


		};
		options.error = function(xhr, errorType, error) {
			// alert(options.url);
			// alert(errorType);
			// alert(error);
			Bubble.show('啊哦，网络异常啦！检查下网络吧~');
			errorBack && errorBack();
		};

		$.ajax(options);
	}

};

Ajax.formatAjaxParams = function(el){
	var $el = $(el);
	var data = $el.attr('ajax-data');
	var ajaxParams = {
		url: $el.attr('ajax-url'),
		type: $el.attr('ajax-type') || 'get'
	};

	if(data){
		ajaxParams.data = JSON.parse(data);
	}
	return ajaxParams;
};

module.exports = Ajax; 
});
;define('common/guide/guide', function(require, exports, module){ var $ = require('zepto');

function Guide(btn, type, text) {
	this.$btn = $(btn);
	this.type = type;
	this.text = text;

	this._init();
}

Guide.prototype = {
	_tmpl: function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div id="J-guide" class="guide '+
((__t=( type?type:'' ))==null?'':__t)+
'"><i class="icon-guide">'+
((__t=( text ))==null?'':__t)+
'</i></div>';
}
return __p;
},
	_init: function() {
		var self = this;

		self.$btn.on('click', function() {
			self.show();
		});


	},

	show: function() {
		var self = this;

		$(document.body).append(self._tmpl({
			type: self.type,
			text: self.text
		}));
		// location.hash = "#guide";
		// setTimeout(function(){
		// 	window.onhashchange = function() {
		// 		self._close();
		// 	};
		// });

		$('#J-guide').on('click', function() {
			self._close();
		});
	},
	_close: function() {
		$('#J-guide').off('click').remove();
		// window.onhashchange = null;
		// location.hash = "";
	}
};

module.exports = Guide; 
});
;define('common/amount/index', function(require, exports, module){ var EVENT_TAP = 'click';
var $ = require('zepto');


function Amount(el) {
	this.$el = el ? $(el) : $('.J-amount-bar');
	if (this.$el.length > 1) {
		this.$el = $($el[0]);
	}
	this.$minus = this.$el.find('.btn-minus');
	this.$add = this.$el.find('.btn-add');
	this.$val = this.$el.find('.amount-val');

	this._timer = null; //控制请求发送频率timer
}

Amount.prototype = {
	resetBtn: function() {
		this._resetBtn();
	},
	init: function(ajaxUpdate) {
		var self = this;

		self.ajaxUpdate = ajaxUpdate;

		var $el = self.$el;
		var $minus = self.$minus;
		var $add = self.$add;
		var $val = self.$val;

		self._resetBtn();
		$minus.on(EVENT_TAP, function() {
			var min = $el.attr('min');
			var v = +$val.text();

			v = v - 1;

			if (min !== null && v < +min) {
				return;
			}

			$val.text(v);
			self._resetBtn();

			self._ajax(v);
			return false;
		});
		$add.on(EVENT_TAP, function() {
			var max = $el.attr('max');
			var v = +$val.text();

			v = v + 1;

			if (max !== null && v > +max) {
				return;
			}
			$val.text(v);
			self._resetBtn();

			self._ajax(v);
			return false;
		});
	},
	_ajax: function(v) {
		var self = this;
		var ajaxUpdate = self.ajaxUpdate;

		if (ajaxUpdate) {
			if (self._timer) {
				clearTimeout(self._timer);
			}
			self._timer = setTimeout(function(){
				ajaxUpdate(v, self.$el);
			}, 500);
		}
	},
	_resetBtn: function() {
		var $el = this.$el;
		var $minus = this.$minus;
		var $add = this.$add;
		var $val = this.$val;
		var min = $el.attr('min');
		var max = $el.attr('max');
		var val = +$val.text();

		if (min != null && val <= min) {
			$minus.addClass('disabled');
		} else {
			$minus.removeClass('disabled');
		}
		if (max != null && val >= max) {
			$add.addClass('disabled');
		} else {
			$add.removeClass('disabled');
		}
	}
};

// function init() {
// 	$('.J-amount-bar').each(function(idx, el) {
// 		var $el = $(el);
// 		var $minus = $el.find('.btn-minus');
// 		var $add = $el.find('.btn-add');
// 		var $val = $el.find('.amount-val');

// 		resetBtn();

// 		$minus.on(EVENT_TAP, function() {
// 			var min = $el.attr('min');
// 			var v = +$val.text();

// 			v = v - 1;

// 			if (min !== null && v < +min) {
// 				return;
// 			}
// 			$val.text(v);
// 			resetBtn();
// 		});
// 		$add.on(EVENT_TAP, function() {
// 			var max = $el.attr('max');
// 			var v = +$val.text();

// 			v = v + 1;

// 			if (max !== null && v > +max) {
// 				return;
// 			}
// 			$val.text(v);
// 			resetBtn();
// 		});

// 		function resetBtn() {
// 			var min = $el.attr('min');
// 			var max = $el.attr('max');
// 			var val = +$val.text();

// 			if (min != null && val <= min) {
// 				$minus.addClass('disabled');
// 			} else {
// 				$minus.removeClass('disabled');
// 			}
// 			if (max != null && val >= max) {
// 				$add.addClass('disabled');
// 			} else {
// 				$add.removeClass('disabled');
// 			}
// 		}

// 	});
// }

module.exports = Amount; 
});
;define('notice/index', function(require, exports, module){ var $ = require('zepto');

var timeSmall = [6, 8, 10, 12, 14];
var timeBig = [10, 15, 20, 25, 30];
var provinceArr = ["北京市", "天津市", "河北省", "山西省", "内蒙古自治区", "辽宁省", "吉林省", "黑龙江省", "上海市", "江苏省", "浙江省", "安徽省", "福建省", "江西省", "山东省", "河南省", "湖北省", "湖南省", "广东省", "广西壮族自治区", "重庆市", "四川省", "贵州省", "云南省", "陕西省", "甘肃省", "青海省", "宁夏回族自治区"]

var tmpl = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="notice-panel">\r\n\t<div class="notice-msg ani-up"></div>\r\n</div>';
}
return __p;
}();
var $el, $msgWrap;
var num = 1;

function start() {
	var time;

	if (num > 1) {
		time = timeBig[random(0, 5)];
	} else {
		time = timeSmall[random(0, 5)];
	}
	setTimeout(function() {
		num++;
		show();
	}, time * 1000);
}

function show() {
	if (!$el) {
		$(document.body).append($el = $(tmpl));
		$msgWrap = $el.find('.notice-msg');
		$msgWrap.on(getAniEndName().aniEvtName, hide);
	}

	$msgWrap.text(random(2, 18) + '秒前，小金子收到来自' + provinceArr[random(0, 28)] + '的新订单');
	$el.addClass('block');
}

function hide() {
	$el.removeClass('block');
	start();
}


/**
 * 获取min到max之间的一个随机数(包含min，不含max)
 */
function random(min, max) {
	return min + Math.floor(Math.random() * max);
}

/**
 * 获取动画结束事件的名字
 */
function getAniEndName() {
	var transElement = document.createElement('trans');
	var transitionEndEventNames = {
		'WebkitTransition': 'webkitTransitionEnd',
		'MozTransition': 'transitionend',
		'OTransition': 'oTransitionEnd',
		'transition': 'transitionend'
	};
	var animationEndEventNames = {
		'WebkitTransition': 'webkitAnimationEnd',
		'MozTransition': 'animationend',
		'OTransition': 'oAnimationEnd',
		'transition': 'animationend'
	};

	function findEndEventName(endEventNames) {
		for (var name in endEventNames) {
			if (transElement.style[name] !== undefined) {
				return endEventNames[name];
			}
		}
	}
	return {
		transEvtName: findEndEventName(transitionEndEventNames),
		aniEvtName: findEndEventName(animationEndEventNames)
	};
}

module.exports = {
	start: start
}; 
});
;define('common/preview/index', function(require, exports, module){ var $ = require('zepto');
var Swiper = require('common/swiper/index');

var _tmpl = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="preview-container">\r\n\t<div class="preview-close"></div>\r\n\t<div id="banner" class=\'J-banner swipe\'>\r\n\t\t<div class="swipe-wrap">\r\n\t\t\t';
 $.each(imgArr, function(i, imgUrl){ 
__p+='\r\n\t\t\t<div>\r\n\t\t\t\t<a>\r\n\t\t\t\t\t<div class="img-wrap">\r\n\t\t\t\t\t\t<div class="img-inner">\r\n\t\t\t\t\t\t\t<div class="img-table">\r\n\t\t\t\t\t\t\t\t<div class="img-v">\r\n\t\t\t\t\t\t\t\t\t<img src="'+
((__t=( imgUrl ))==null?'':__t)+
'" />\r\n\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</a>\r\n\t\t\t</div>\r\n\t\t    ';
 }) 
__p+='\r\n\t    </div>\r\n\t    <div id="bannerPager" class="J-bannerPager"><span id="page"></span></div>\r\n\t</div>\r\n</div>';
}
return __p;
};
var $el, $close;
var S;


function show(imgArr, i) {
	var index = i || 0;

	$(document.body).append($el = $(_tmpl({
		imgArr: imgArr
	})));
	$close = $el.find('.preview-close');
	
	$close.on('click', close);

	S = new Swiper({
		container: $el.find('.J-banner'),
		pager: $el.find('.J-bannerPager'),
		swipeOptions: {
			auto: 0,
			continuous: false,
			startSlide: index
		}
	});

}

function close() {
	S.swipe.kill();
	$el.remove();
}

module.exports = {
	show: show
}; 
});
;define('common/page-loader/index', function(require, exports, module){ var TAP_EVENT = 'click';
var $ = require('zepto');

var win = window;
var $win = $(win),
	lastScrollY = win.scrollY,
	winH = $win.height();

function PageLoader(options) {
	this.options = options;
	this.$container = $(options.container);
	this.$seeMore = $(options.seeMore);
	this.$loading = $(options.loading);
	this.getHtml = options.getHtml;
	this.pageNum = options.pageBegin || 1;
	this.loading = false;
	this.hasAll = false;

	this.scrollKey = options.scrollKey;
	this.isScrollInit = true;

	this._init();
}

PageLoader.prototype = {
	/**
	 * 加载首页
	 * @return {[type]} [description]
	 */
	loadFirst: function() {
		this._rendData();
		return this;
	},
	/**
	 * 所有数据加载完成
	 * @param  {[type]} back [description]
	 * @return {[type]}      [description]
	 */
	loadEnd: function(back) {
		this._loadEndBack = back;
	},

	_init: function() {
		this._addEvents();
	},
	_addEvents: function() {
		var ths = this;

		if (ths.options.seeMore) { // 查看更多
			ths.$seeMore.on(TAP_EVENT, function(evt) {
				if (!hasMore()) {
					return;
				}
				ths._rendData();
				evt.preventDefault();
			});
		} else { //滚动加载

			if (ths.scrollKey) {
				ths._scollTo(ths.scrollKey);
			} else {
				ths.isScrollInit = false;
			}
			$win.on('scroll', function() {
				if (!ths.isScrollInit && ths.scrollKey) {
					sessionStorage.setItem(ths.scrollKey, scrollY);
				}
				if (!hasMore()) {
					return;
				}
				ths._scroll();
			});
		}

		function hasMore() {
			if (ths.$container.css('display') == 'none') {
				return false;
			}
			if (ths.hasAll) { //加载已完成
				return false;
			}
			return true;
		}

	},
	_scollTo: function(key) {
		var pos = sessionStorage.getItem(key);
		var self = this;

		if (!pos) {
			self.isScrollInit = false;
			return;
		}

		if (window.scrollY >= pos) {
			self.isScrollInit = false;
			return;
		}
		setTimeout(function() {
			window.scroll(0, pos);
			self._scollTo(key);
		}, 50);
	},
	_scroll: function() {
		var ths = this;
		var scrollY = win.scrollY,
			dir;
		var isBottom = scrollY >= ($(document).height() - winH) * 0.9;

		if (scrollY >= lastScrollY) {
			dir = 'up';
		} else {
			dir = 'down';
		}
		lastScrollY = scrollY;

		if (!ths.loading && dir == 'up' && isBottom) {
			ths._rendData();
		}
	},
	_rendData: function() {
		var ths = this;
		var pageNum = ths.pageNum;
		var $loading = ths.$loading.length > 0 ? ths.$loading : $('#J-loading');

		if (ths.loading) {
			return false;
		}
		ths.loading = true;
		$loading.css('display', 'block');

		ths.getHtml(pageNum, function(html, total) {

			ths.loading = false;
			$loading.css('display', 'none');

			if (ths.pageNum == 1) {
				ths.$container.html(html);
				if (ths.$seeMore[0]) {
					ths.$seeMore.css('display', 'block');
				}
			} else {
				ths.$container.append(html);
			}

			ths.pageNum++;

			if (!html.trim() || (total && ths.$container.children().length >= total)) {
				ths.hasAll = true;
				ths._loadEndBack && ths._loadEndBack();
				ths.$seeMore[0] && ths.$seeMore.remove();
			}
		});
	}
};

module.exports = PageLoader; 
});
;define('common/comment-section/index', function(require, exports, module){ var $ = require('zepto');
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
	var ajaxUrl = $('#J-ajaxurl-moreComment').val();

	if (ajaxUrl) {
		return;
	}
	new PageLoader({
		container: '#J-discuss-list',
		seeMore: '.see-more',
		getHtml: function(pageNum, back) {

			new Ajax().send({
				url: ajaxUrl,
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
	var ajaxUrl = $('#J-ajaxurl-initProductLikeData').val();

	if (ajaxUrl) {
		return;
	}
	new Ajax().send({
		url: ajaxUrl,
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
	new Ajax().send(Ajax.formatAjaxParams($cur), function(result) {
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
;define('common/gotop/index', function(require, exports, module){ var $ = require('zepto');
var tmpl = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<i id="J-gotop" class="icon-gotop"></i>';
}
return __p;
}();

var win = window,
	$win = $(win),
	$body = $(document.body);

var winHei = $win.height();
var $gotop;
var isShow = false;

$win.on('scroll', _onscroll);

function _onscroll() {
	var scrollY = win.scrollY;

	if (scrollY / winHei >= 1.5) {

		if (!$gotop) {
			$body.append($(tmpl));

			$gotop = $('#J-gotop');

			$gotop.on('click', function() {
				win.scroll(0, 0);
				hidden();
			});;
		}

		show();

	} else {
		if (isShow) {
			hidden();
		}
	}
}

function show() {
	if(isShow){
		return;
	}
	isShow = true;
	$gotop.css('display', 'block').animate({
		'opacity': 1
	}, 1000, 'ease-in');
}

function hidden() {
	if(!isShow){
		return;
	}
	isShow = false;
	$gotop.animate({
		'opacity': 0
	}, 1000, 'ease-in', function() {
		$gotop.css('display', 'none');
	});
}

function BackTop(btnId) {
	var btn = document.getElementById(btnId);
	var d = document.documentElement;
	window.onscroll = set;
	btn.onclick = function() {
		btn.style.display = "none";
		window.onscroll = null;
		this.timer = setInterval(function() {
			d.scrollTop -= Math.ceil(d.scrollTop * 0.1);
			if (d.scrollTop == 0) clearInterval(btn.timer, window.onscroll = set);
		}, 10);
	};

	function set() {
		btn.style.display = d.scrollTop ? 'block' : "none"
	}
}; 
});
;define('goods/index', function(require, exports, module){ var EVENT_TAP = 'click';

var $ = require('zepto');
var Swiper = require('common/swiper/index');
var ConfirmService = require('common/confirm-service/index');

var Conf = require('common/config/index');
var Ajax = require('common/ajax/index');
var Bubble = require('common/bubble/bubble');
var Guide = require('common/guide/guide');
var Util = require('common/util/index');
var Amount = require('common/amount/index');
var Alert = require('common/alert/alert');
var LoginPop = require('common/login-pop/index');
var Notice = require('notice/index');
var amount = new Amount();
var CommentSection = require('common/comment-section/index');

require('common/gotop/index');
var globalGuide = new Guide();

Notice.start();

Util.phpdataReady(function() {
	var $share = $('#J-share');

	if (typeof taojinzi === 'undefined') {
		new Guide($share);
	} else {
		$share.on('click', function() {
			taojinzi.share(JSON.stringify({
				title: title,
				link: link,
				imgUrl: imgUrl,
				desc: desc
			}));
		});
	}
});

var $phoneOk = $('#J-phone-ok2');

var $phone = $('#phone2');
var $code = $('#code2');
var $yzmBt = $('#J-yzm-bt2');

var winHei = $(window).height();
var winScrollY = 0;

new Swiper({
	container: 'banner',
	pager: 'bannerPager'
});

Util.phpdataReady(function(phpdata) {
	var isLogin = phpdata.isLogin;

	if (isLogin == 0) { //未登陆
		$('#J-panel-cm').addClass('add-phone');
		$yzmBt.on('click', getCode);
		$phoneOk.on('click', login);
	}
});


var minnum = Util.getParam('minnum');

/**
 * 数量 颜色等选择等浮层
 * @type {Object}
 */
var Panel = {
	type: '',
	init: function() {
		var self = this;
		var $panel = $('#J-panel-cm');
		var $close = $panel.find('.close');
		var $mask = $panel.find('.mask');
		var $ok = $panel.find('.J-ok');

		$panel.on('click', function() {
			return false;
		});

		$close.on(EVENT_TAP, function(evt) {
			self.hidden();
			evt.preventDefault();
		});
		$mask.on(EVENT_TAP, function(evt) {
			self.hidden();
			evt.preventDefault();
		});

		$ok.on(EVENT_TAP, function(evt) {
			self.hidden();

			if (self.type == 'cart') {
				addCar();
			} else {
				quickBuy();
			}
			evt.preventDefault();
		});

		// self._hasPhone();
		// if (!hasLogin) {
		// 	$yzmBt.on('click', getCode);
		// 	$phoneOk.on('click', login);
		// }
		self._initSel();
	},

	// _hasPhone: function() {

	// 	if (hasLogin) {
	// 		$('#J-panel-cm').removeClass('add-phone');
	// 	} else {
	// 		$('#J-panel-cm').addClass('add-phone');
	// 	}
	// },
	_initSel: function() {
		var self = this;

		self._resetSku();
		amount.init();
		$('#J-cm').delegate('label', EVENT_TAP, function(evt) {
			var $cur = $(evt.target);

			$cur.siblings('label').removeClass('sel');
			$cur.addClass('sel');
			$cur.siblings('input').val($cur.attr('value'));

			self._resetSku();
			amount.resetBtn();
		});

	},

	_resetSku: function() {
		var sku = search_sku_key();
		var $bar = $('.J-amount-bar');

		$('#J-last-num').text(sku.amount);

		// if (!$bar.attr('max')) {
			$bar.attr('max', sku.amount);
		// }
		$('#J-sku-price').text(sku.price);
	},

	show: function(ty) {
		var $cm = $('#J-panel-cm');
		var $mask = $cm.find('.mask');
		var $content = $cm.find('.panel-content');

		this.type = ty;

		// winScrollY = window.scrollY;

		$cm.find('.amount-val').text(minnum ? minnum : 1);
		amount.resetBtn();
		$('html').attr('style', 'position: relative; overflow: hidden; height: ' + winHei + 'px;');
		$('body').attr('style', 'overflow: hidden; height: ' + winHei + 'px; padding: 0px;');
		$cm.css('display', 'block');
		$content.animate({
			translateY: '0'
		}, 300, 'ease-out');
		// $mask.animate({
		// 	opacity: '0.8'
		// }, 300, 'ease-out');
	},
	hidden: function() {
		var $cm = $('#J-panel-cm');
		var $mask = $cm.find('.mask');
		var $content = $cm.find('.panel-content');

		$content.animate({
			translateY: '100%'
		}, 300, 'ease-in', function() {
			$('html').attr('style', '');
			$('body').attr('style', '');
			$cm.css('display', 'none');
		});
		// $mask.animate({
		// 	opacity: 0
		// }, 300, 'ease-in', function(){
		// 	$('html').attr('style', '');
		// 	$('body').attr('style', '');
		// 	window.scroll(0, winScrollY);
		// });

	}
}

var CartNum = {
	init: function() {
		var $cartNum = $('#J-cart-num');
		var num = +$cartNum.text();

		if (num && num > 0) {
			$cartNum.addClass('has-num');
		} else {
			$cartNum.removeClass('has-num');
		}
	},
	add: function(num) {
		var $cartNum = $('#J-cart-num');
		var curNum = +$cartNum.text();

		$cartNum.text(curNum + num).addClass('has-num');
	}
};
CartNum.init();

/**
 * 获取验证码
 */
var disabled = false;

function getCode() {
	if (disabled) {
		return false;
	}

	var phone = $phone.val();
	var curTime = 60;

	new Ajax().send({
		url: '/WeChat/Band/sendMsg',
		data: {
			phone: phone
		}
	}, function() {
		disabled = true;
		$yzmBt.text(curTime).addClass('disabled');
		start();
	});

	function start() {
		setTimeout(function() {
			curTime--;
			$yzmBt.text(curTime);

			if (curTime <= 0) {
				disabled = false;
				$yzmBt.text('获取验证码').removeClass('disabled');
				return;
			}
			start();
		}, 1000)
	}
	return false;
}

/**
 * 验证登陆
 */
function login(evt) {
	evt.preventDefault();

	var phone = $phone.val();
	var code = $code.val();
	// var recommend = Util.getParam('recommend');
	var params;

	if (!phone) {
		Bubble.show('请输入您的手机号码');
		return false;
	} else if (!/^\d{11}$/.test(phone)) {
		Bubble.show('请输入正确的手机号码');
		return false;
	} else if (!code) {
		Bubble.show('请输入验证码');
		return false;
	}
	params = {
		phone: phone,
		code: code
	};
	// if(recommend){
	// 	params.recommend = recommend;
	// }

	ConfirmService.start(phone, code, Ajax, function(recommend) {
		if (recommend) {
			params.recommend = recommend;
		}

		new Ajax().send({
			url: '/WeChat/Band/bandAccount',
			type: 'post',
			data: params
		}, function() {
			Panel.hidden();

			if (Panel.type == 'cart') {
				addCar();
			} else {
				quickBuy();
			}
		});
	});
}


function initPage() {
	Panel.init();
	addEvent();
	CommentSection.init(); //初始始评论组件
}

function addEvent() {
	$('#J-btn-cart').on(EVENT_TAP, function(evt) {
		Panel.show('cart');
		evt.preventDefault();
	});

	$('#J-btn-buy').on(EVENT_TAP, function(evt) {
		Panel.show('buy');
		evt.preventDefault();
	});

	$('#J-make-money').on('click', makeMoney);
}

window.jumpurl = location.href;

initPage();

/**
 * 分销赚钱
 * @return {[type]} [description]
 */
function makeMoney(evt) {
	evt.preventDefault();

	var $cur = $(this);

	if (phpdata && phpdata.isLogin != 1) { //未登陆
		LoginPop.show({
			Ajax: Ajax,
			loginSuc: function() {
				// location.href = $cur.attr('href');
				showAlert();
			}
		});
		return false;
	}

	showAlert();

	return false;

	function showAlert() {
		new Ajax().send({
			url: '/Mall/Goods/goodsShareMoney'
		}, function(result) {
			var hasPermission = result.hasPermission;

			phpdata.isLogin = 1;
			if (hasPermission == 1) {
				globalGuide.show();
			} else {
				location.href = $cur.attr('href');
				// Alert.show($('#J-make-money-tmpl').html(), true, 'make-moeny-alert');
			}
		});


	}

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


function addCar() {
	if ($('#spe_id').val() > 0) {
		if ($('#spe_already_start').val() == 0) {
			return false;
		}
	}
	var goods_id = $("#gid").val();
	var sku_info = search_sku_key();
	var goods_number = parseInt($('#J-cm-amount').find('.amount-val').text(), 10);

	// if (!sku_info) {
	// 	Bubble.show('请选择商品属性');
	// 	return;
	// }
	// if (parseInt(sku_info.sku_num) == 0 || parseInt(sku_info.sku_num) < goods_number || sku_info.sku_id == 'empty') {
	// 	Bubble.show('已经卖光了，下次早点哦!');
	// 	return;
	// }
	var url = $('#J-ajaxurl-addCart').val();
	var data = {
		goodsId: goods_id,
		skuAttr: sku_info.skuAttr,
		skuValue: sku_info.skuValue,
		// skuIds: sku_info.sku_id,
		// skuTexts: sku_info.skuTexts,
		// skuValues: sku_info.skuValues,
		// skuValuesText: sku_info.skuValuesText,
		amount: goods_number
	};

	new Ajax().send({
		url: url,
		data: data,
		type: 'post',
		// selfBack: true
	}, function(resp) {
		resetCart();
		// if (resp.code == 1) {
		// CartNum.add(goods_number);
		// } else if (resp.code == 5) {
		// 	Bubble.show(resp.msg);
		// 	setTimeout(function() {
		// 		window.location.href = resp.url;
		// 	}, 2000);
		// } else {
		// 	Bubble.show(resp.msg);
		// }
	});
}


function quickBuy() {
	if ($('#spe_id').val() > 0) {
		if ($('#spe_already_start').val() == 0) {
			return false;
		}
	}
	var goods_id = $("#gid").val();
	var sku_info = search_sku_key();
	var goods_number = parseInt($('#J-cm-amount').find('.amount-val').text(), 10);

	// if (!sku_info) {
	// 	Bubble.show('请选择商品属性');
	// 	return;
	// }
	// if (parseInt(sku_info.sku_num) == 0 || parseInt(sku_info.sku_num) < goods_number || sku_info.sku_id == 'empty') {
	// 	Bubble.show('已经卖光了，下次早点哦!');
	// 	return;
	// }
	if (parseInt($('#J-last-num').text()) < goods_number) {
		Bubble.show('库存不足，下次早点哦!');
		return;
	}
	var url = $('#J-ajaxurl-quickBuy').val();
	var data = {
		goodsId: goods_id,
		skuAttr: sku_info.skuAttr,
		skuValue: sku_info.skuValue,
		// skuIds: sku_info.sku_id,
		// skuTexts: sku_info.skuTexts,
		// skuValues: sku_info.skuValues,
		// skuValuesText: sku_info.skuValuesText,
		amount: goods_number,
		// spe: $('#J-goods-type').val(),
		// speId: $('#J-spe-id').val()
	};


	new Ajax().send({
		url: url,
		data: data,
		type: 'post',
		selfSucBack: true
	}, function(result, originData) {

		var form = '<form action="' +
			originData.url + '" method="post">'

		$.each(data, function(key, val) {
			if (key != 'tjzAjax') {
				form += '<input type="hidden" name="' + key + '" value="' + val + '" />'
			}
		});

		form += '</form>';

		$(form).appendTo($('body')).submit();
	});
}

function search_sku_key() {
	var sku_key = [];
	var checked = '';
	var exit = false;
	var $dts = $('#J-cm').find('dt');
	var $dds = $('#J-cm').find('dd');

	$dts.each(function(i, dt) {
		var $dt = $(dt);
		var $dd = $($dds[i]);

		sku_key.push($dd.find('.sel').text());

	});

	var sku_json = $('#goods_sku_json').val();
	var sku_o;
	var res = {};

	try {
		sku_o = JSON.parse(sku_json);
	} catch (e) {
		return;
	}

	for (var i = 0; i < sku_o.length; i++) {
		// if ('|' + sku_key.join('|') + '|' == sku_o[i].sku_values_text) {
		if(sku_key[0] == sku_o[i].skuValue){
			res = sku_o[i];
			break;
		}
	}
	return {
		skuId: res.skuId,
		skuAttr: res.skuAttr,
		skuValue: res.skuValue,
		price: res.price,
		amount: res.amount
	};
	// return {
	// 	sku_num: res.actual_quantity || 0,
	// 	sku_id: res.sku_ids || 'empty',
	// 	skuTexts: res.sku_texts,
	// 	skuValues: res.sku_values,
	// 	skuValuesText: res.sku_values_text,
	// 	skuPrice: res.retail_price
	// };
}

/**
 * 初始化购物车
 */
function resetCart() {
	var ajaxUrl = $('#J-ajaxurl-initCart').val();

	if(ajaxUrl){
		return;
	}
	new Ajax().send({
		url: ajaxUrl
	}, function(result) {
		var num = +result.number;
		var $cart = $('#J-cart-num');

		if (num > 0) {
			$cart.text(num).parent().css('display', 'block');
		} else {
			$cart.parent().css('display', 'none');
		}
	});
}

setTimeout(function() {
	resetCart();
}, 0); 
});