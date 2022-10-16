  /**
   * Checks if an object is of the specified class.
   * @private
   * @param {Object} object The object.
   * @param {String} name The name of the class.
   * @returns {Boolean} Returns `true` if of the class, else `false`.
   */
  function isClassOf(object, name) {
    return object != null && {}.toString.call(object).slice(8, -1) == name;
  }

 /**
   * Checks if an object has the specified key as a direct property.
   * @private
   * @param {Object} object The object to check.
   * @param {String} key The key to check for.
   * @returns {Boolean} Returns `true` if key is a direct property, else `false`.
   */
  function hasKey(object, key) {
    var result,
        o = {},
        hasOwnProperty = o.hasOwnProperty,
        parent = (object.constructor || Object).prototype;

    // for modern browsers
    object = Object(object);
    if (isClassOf(hasOwnProperty, 'Function')) {
      result = hasOwnProperty.call(object, key);
    }
    // for Safari 2
    else if (o.__proto__ == Object.prototype) {
      object.__proto__ = [object.__proto__, object.__proto__ = null, result = key in object][0];
    }
    // for others (not as accurate)
    else {
      result = key in object && !(key in parent && object[key] === parent[key]);
    }
    return result;
  }

  /**
   * A generic `Array#forEach` / `for...in` own property utility function.
   * Callbacks may terminate the loop by explicitly returning `false`.
   * @static
   * @memberOf Benchmark
   * @param {Array|Object} object The object to iterate over.
   * @param {Function} callback The function called per iteration.
   * @param {Object} thisArg The `this` binding for the callback function.
   * @returns {Array|Object} Returns the object iterated over.
   */
  function each(object, callback, thisArg) {
    var index = -1,
        result = [object, object = Object(object)][0],
        isSnapshot = 'snapshotLength' in object && 'snapshotItem' in object,
        skipCheck = isSnapshot || 'item' in object,
        length = isSnapshot ? object.snapshotLength : object.length;

    // in Opera < 10.5 `hasKey(object, 'length')` returns `false` for NodeLists
    if (length == length >>> 0) {
      while (++index < length) {
        // in Safari 2 `index in object` is always `false` for NodeLists
        if ((skipCheck || index in object) &&
            callback.call(thisArg, isSnapshot ? object.snapshotItem(index) : object[index], index, object) === false) {
          break;
        }
      }
    } else {
      for (index in object) {
        if (hasKey(object, index) &&
            callback.call(thisArg, object[index], index, object) === false) {
          break;
        }
      }
    }
    return result;
  }
/**
   * A generic `Array#reduce` utility function.
   * @static
   * @memberOf Benchmark
   * @param {Array} array The array to iterate over.
   * @param {Function} callback The function called per iteration.
   * @param {Mixed} accumulator Initial value of the accumulator.
   * @returns {Mixed} The accumulator.
   */
  function reduce(array, callback, accumulator) {
    var noaccum = arguments.length < 3;
    each(array, function(value, index) {
      accumulator = noaccum ? (noaccum = 0, value) : callback(accumulator, value, index, array);
    });
    return accumulator;
  }
  /**
   * Modify a string by replacing named tokens with matching object property values.
   * @private
   * @param {String} string The string to modify.
   * @param {Object} object The template object.
   * @returns {String} The modified string.
   */
  function interpolate(string, object) {
    return reduce(object || {}, function(string, value, key) {
      return string.replace(RegExp('#\\{' + key + '\\}', 'g'), value);
    }, string);
  }

interpolate("#{a}#{b}", {a:1,b:2});
/*
12
*/