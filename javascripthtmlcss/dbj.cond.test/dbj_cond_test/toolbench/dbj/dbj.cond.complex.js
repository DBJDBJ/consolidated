/*
Copyright 2018 dbj.org

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed
on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
either express or implied.
See the License for the specific language governing permissions
and limitations under the License.
*/
'use strict';
/*global dbj:true*/
/**
 *  test dbj complex comparators with cond
 */
require('../../dbj.nanotest'); // defines dbj.nano
const deep_equal = require('fast-deep-equal');
// const util = require('util');

/**
 * At this point we have dbj object 
 * That contains :
 *    core          -- object -- dbj core lib
 *    cond          -- function
 *    comparator    -- swappable comparators for dbj.cond
 *                  -- note: there are many comparators available on npm
 *                     'deep-equal' and the rest
 *                     jQuery qUnit contains few, etc.
 *
 * It is beyond ESLINT abilities to notice this and thus it complains
 * about every dbj mentioned in a code, so we use
   global dbj:true 
 */

function test_with_comparators (required_rezult, expression) {

  const prompt =
      "Using comparators: " + dbj.cond.setcmp() + "\n" +
      expression + ', should return: >' + required_rezult + '<';

  dbj.nano.test(prompt, function(n) {
    const retval = eval(expression);
    // n.msg('Returned: >' + retval + '<');
    return (
      retval === required_rezult
    );
  });
}

module.exports.run = function() {

    dbj.cond.setcmp(deep_equal);

    dbj.nano.group("dbj.cond complex tests", function (n) {

      test_with_comparators(
      'Found!',
      'dbj.cond([1, 2], [3,2], false, [1,2], "Found!", "None found")'
    );

   test_with_comparators(
      'Found!',
      'dbj.cond([1, 2], [3,2], false, [1,2], "Found!", "None found")'
    );

  dbj.cond.setcmp(dbj.compare.arr, deep_equal);

    test_with_comparators(
        'Found!',
        'dbj.cond([1, 2], [3,2], false, [1,2], "Found!", "None found")'
    );

    dbj.cond.setcmp(dbj.compare.lookup, deep_equal);

    test_with_comparators(
    'Found!',
    'dbj.cond([1, 2], [3,2], false, 2, "Found!", "None found")'
);

        test_with_comparators(
        'Found!',
        'dbj.cond([1, 2], [3,2], false, ["2D",[1,2]], "Found!", "None found")'
    );

        test_with_comparators(
        'Found!',
        'dbj.cond(["2D",[1, 2]], [3,2], false, [1,2], "Found!", "None found")'
    );

        test_with_comparators(
      'Found!',
      'dbj.cond([{1:2},{3:4}], {2:3}, false, {3:4}, "Found!", "None found")'
      );

   return true;

 });


};
