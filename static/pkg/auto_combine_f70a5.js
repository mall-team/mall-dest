define('common/copyright/index', function(require, exports, module){ var $ = require('zepto');

var _tmpl = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div id="copyright">大泽商城&nbsp;提供技术支持</div>';
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
;define('langsha-index/index', function(require, exports, module){ 
var Swiper = require('common/swiper/index');

var $fixPanel = $('.fix-panel');

new Swiper({
	container: 'banner',
	pager: 'bannerPager'
});


$fixPanel.on('click', '.close', function(){
	$fixPanel.remove();
	$(document.body).css('padding-bottom', '10px');
}); 
});