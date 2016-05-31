define('underscore', function(require, exports, module){ //     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = property;

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));
 
});
;define('common/copyright/index', function(require, exports, module){ var $ = require('zepto');

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
;define('common/timer/timer', function(require, exports, module){ var $ = require('zepto');

// var TimerManager = {
// 	start: function(el) {
// 		$(el).each(function(i, curEle) {
// 			var time = $(curEle).attr('timer');

// 			if (time) {
// 				new Timer(time, curEle);
// 			}
// 		});
// 	}
// };

function Timer(el, format) {
	this.$el = $(el);
	this.format = format;

	var endTime = +this.$el.attr('timer-end');
	var starTime = typeof phpdata == 'object' ? phpdata.serverTime : null;
	var lastTime = +this.$el.attr('timer');

	if (endTime && starTime) {
		this.lastTime = endTime - starTime;
	} else if (lastTime || lastTime == 0) {
		this.lastTime = this.oTime = lastTime;
	}

	this.day = 0;
	this.hour = 0;
	this.min = 0;
	this.sec = 0;
	this._timer = null;
}

Timer.prototype = {

	start: function() {
		var self = this;

		if (!self.lastTime && self.lastTime != 0) {
			return;
		}

		self._walk();
		return self;
	},

	end: function(back) {
		this._endBack = back;
		return this;
	},

	_walk: function() {
		var self = this;

		self.$el.html(self._format(self.lastTime < 0 ? 0 : self.lastTime));

		if (self.lastTime <= 0) {
			if (this.oTime > 0) {
				self._endBack && self._endBack();
			}
			return;
		}
		self.lastTime--;
		self._timer = setTimeout(function() {
			self._walk();
		}, 1000);
	},

	_format: function(time) {
		var self = this;


		var hour = parseInt(time / 3600, 10);
		var min = parseInt((time - hour * 3600) / 60);
		var sec = time - hour * 3600 - min * 60;

		var day = parseInt(hour / 24);

		hour = hour - day * 24;

		self.day = day;
		self.hour = hour;
		self.min = min;
		self.sec = sec;

		if (typeof self.format === 'function') {
			return self.format(time);
		}
		
		if (self.format == 'single') {
			if (day > 0) {
				return self._addZero(day) + '天';
			} else if (hour > 0) {
				return self._addZero(hour) + '小时';
			} else if (min > 0) {
				return self._addZero(min) + '分钟';
			} else if (sec > 0) {
				return self._addZero(sec) + '秒';
			} else {
				return '0秒';
			}
		}

		if (self.format == 'time') {
			return self._addZero(day * 24 + hour) + ':' + self._addZero(min) + ':' + self._addZero(sec);
		}

		return (day > 0 ? self._addZero(day) + '天' : '') + self._addZero(hour) + '时' + self._addZero(min) + '分' + self._addZero(sec) + '秒';
		// return (day > 0 ? self._addZero(day) + '天' : '') + (hour > 0 ? self._addZero(hour) + '时' : '') + (min > 0 ? self._addZero(min) + '分' : '') + self._addZero(sec) + '秒';
	},

	_addZero: function(num) {
		if (num.toString().length < 2) {
			return '0' + num;
		}
		return num;
	}

};

Timer.addZero = function(num) {
	if (num.toString().length < 2) {
		return '0' + num;
	}
	return num;
};

module.exports = Timer; 
});
;define('common/fix-top/index', function(require, exports, module){ var $ = require('zepto');
var win = window;

function FixTop(options) {
	this.$el = $(options.el);
	this.pos = this.$el.offset();
	this.gap = 5;

	this.status = 'normal';

	this._init();
}

FixTop.prototype = {

	_init: function() {
		this._addEvent();
	},

	_addEvent: function() {
		var self = this;

		$(window).on('scroll', function() {
			self._scroll();
		});

	},

	_scroll: function() {
		var self = this;
		var scrollY = win.scrollY;
		var sT = scrollY + self.gap;

		// if(self.status == 'fixed'){
		// 	sT = sT + self.$el.height();
		// }

		if (self.pos.top < sT) {
			if(self.status == 'fixed'){
				return;
			}
			self.$el.css({
				'position': 'fixed',
				'z-index': 500,
				'top': 0,
				'width': '100%'
			});
			self.status = 'fixed';
		} else {
			if(self.status == 'normal'){
				return;
			}
			self.$el.css({
				'position': 'static'
			})
			self.status = 'normal';
		}


	}

};



module.exports = FixTop; 
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
;define('search-panel/index', function(require, exports, module){ var $ = require('zepto');

var $container = $('#J-search-panel');
var $input = $container.find('input[type="search"]');
var $clear = $container.find('.icon-clear');
var isClearShow = false;
var isOpt = false; //是否操作过input框

if ($input.val()) {
	showClear();
}

$input.addClass('noOpt');

$clear.on('click', function() {
	$input.val('');
	hideClear();
});

$input.on('focus', function(){
	if(!isOpt){
		$input.val('').removeClass('noOpt');
		hideClear();
		isOpt = true;
	}
});

$input.on('input', function() {
	if ($input.val()) {
		if (isClearShow) {
			return;
		}

		showClear();
	} else {
		hideClear();
	}
});

function showClear() {
	isClearShow = true;
	$clear.css('display', 'block');
}

function hideClear() {
	isClearShow = false;
	$clear.css('display', 'none');
} 
});
;define('goods-list/index', function(require, exports, module){ var _ = require('underscore');
var $ = require('zepto');

var Util = require('common/util/index');
var Ajax = require('common/ajax/index');
var Config = require('common/config/index');
var PageLoader = require('common/page-loader/index');
var Bubble = require('common/bubble/bubble');
var Timer = require('common/timer/timer');
var FixTop = require('common/fix-top/index');
var Swiper = require('common/swiper/index');

require('common/gotop/index');
require('search-panel/index');

new PageLoader({
	container: '#J-goods-list',
	pageBegin: 2,
	scrollKey: location.pathname + location.search,
	getHtml: function(pageNum, back) {
		new Ajax().send({
			url: ($('#J-ajax-url').val()),
			data: {
				order: Util.getParam('order'),
				type: Util.getParam('type'),
				page: pageNum,
				key: decodeURIComponent(Util.getParam('key'))
			}
		}, function(result) {
			back && back(function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='';
 _.each(list, function(item){  
__p+='\r\n<div class="goods">\r\n\t<a href="/mall/Goods/detail?goodsId='+
((__t=( item.goodsId ))==null?'':__t)+
'">\r\n\t\t<div class="img-wrap" style="background-image: url('+
((__t=( item.imageUrl ))==null?'':__t)+
')"></div>\r\n\t\t<div class="goods-title">'+
((__t=( item.name ))==null?'':__t)+
'</div>\r\n\t\t<div class="clearfix">\r\n\t\t\t<label class="price"><i>&yen;</i><b>'+
((__t=( item.salePrice ))==null?'':__t)+
'</b></label>\r\n\t\t\t<a class="btn-sm J-add-cart" goods-id="'+
((__t=( item.goodsId ))==null?'':__t)+
'"></a>\r\n\t\t</div>\r\n\t</a>\r\n</div>\r\n';
 }) 
__p+='';
}
return __p;
}({
				list: result.goodsList
			}));
		});


	}
}).loadEnd(function() {
	Bubble.show('亲，没有更多商品了~');
});

$('[timer]').each(function(i, el) {

	new Timer(el, function(time) {
		var hour = parseInt(time / 3600, 10);
		var min = parseInt((time - hour * 3600) / 60);
		var sec = time - hour * 3600 - min * 60;
		var day = parseInt(hour / 24);

		hour = hour - day * 24;

		return (day ? (Timer.addZero(day) + '天') : '') + Timer.addZero(hour) + ':' + Timer.addZero(min) + ':' + Timer.addZero(sec);

	}).start();

});


new FixTop({
	el: '.goods-order'
});


init();

function init() {
	initCat();
	addEvt();
	initCart();
	initImgLoader();

	if ($('#banner')[0]) {
		new Swiper({
			container: 'banner',
			pager: 'bannerPager'
		});
	}
}

/**
 * 初始化二级分类
 * @return {[type]} [description]
 */
function initCat() {
	var $catList = $('#J-cat-list');

	$('#J-cat-btn').on('touchstart', function(e) {
		e.stopPropagation();
	}).on('click', function() {
		$catList.toggle();
	});
	$(document.body).on('touchstart', function() {
		$catList.hide();
	});
	$catList.on('touchstart', function(e) {
		e.stopPropagation();
		sessionStorage.clear();
	});
}


function addEvt() {
	$('#J-goods-list').on('click', '.J-add-cart', addCart);
}

/**
 * 初始化购物车
 */
function initCart() {
	new Ajax().send({
		url: $('#J-ajaxurl-initCart').val()
	}, function(result) {
		var num = +result.number;
		var $cart = $('.cart');
		var $cartNum = $('.cart > i');

		if (num > 0) {
			$cart.css('display', 'block');
			$cartNum.text(num);
		}
	});
}

/**
 * 添加到购物车
 */
function addCart(evt) {
	evt.preventDefault();

	var $cur = $(this);
	var goodsId = $cur.attr('goods-id');

	new Ajax().send({
		url: $('#J-ajaxurl-addCart').val(),
		type: 'post',
		data: {
			goodsId: goodsId,
		}
	}, function() {
		initCart();
	});
}


/**
 * 初始化图片异步加载
 * @return {[type]} [description]
 */
function initImgLoader() {
	window.onload = function() {
		var $bgDoms = $('[tjz-bgimg]');

		$bgDoms.each(function(i, item) {
			var $bgDom = $(item);
			var url = $bgDom.attr('tjz-bgimg');

			if (url) {
				loadImg(url, item);
			}

		});


		function loadImg(url, dom) {
			var img = new Image();

			img.src = url;
			if (img.complete) {
				rendDom();
				return;
			}
			img.onload = function() {
				rendDom();
			}

			function rendDom() {
				$(dom).css('background-image', 'url(' + url + ')');
			}

		}
	};
} 
});