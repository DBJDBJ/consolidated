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
 *  test shallow aka simplex comparators with dbj cond
 */
require('../../dbj.nanotest'); // defines dbj.nano
/*
already done in index.js

require('dbj.cond');
require('dbj.cond.comparators');
*/

/**
 * At this point both dbj and dbj_comparators are equal
 * They contain :
 *    core          -- object -- dbj core lib
 *    cond          -- function
 *    comparator    -- swappable comparators for dbj.cond
 *                  -- note: there are many comparators available on npm
 *                     'deep-equal' and the rest
 *                     jQuery qUnit contains few, etc.
 */

function test_with_comparators(required_rezult, expression) {

    const prompt =
        "Using comparators: " + dbj.cond.setcmp() + "\n" +
        expression + ', should return: >' + required_rezult + '<';

    dbj.nano.test(prompt, function (n) {
        const retval = eval(expression);
        if (retval !== required_rezult)
           n.msg('Returned: >' + retval + '<');
        return (
            retval === required_rezult
        );
    });

}

module.exports.run = function() {
  dbj.nano.group('dbj.cond simple tests', function(n) {

    test_with_comparators('input found',
      'dbj.cond("input", "one", "found one", "input", "input found", "fall through")');

    test_with_comparators('fall through',
      'dbj.cond("input", "one", "found one", "two", "input found", "fall through")');

    dbj.cond.setcmp(function (a, b) { return a !== b; });

    test_with_comparators('found one',
      'dbj.cond("input", "not input", "found one", "input", "input found", "fall through")'
      );

    test_with_comparators('fall through',
      'dbj.cond("input", "input", "found one", "input", "input found", "fall through")'
      );

    return true;
  });
};
