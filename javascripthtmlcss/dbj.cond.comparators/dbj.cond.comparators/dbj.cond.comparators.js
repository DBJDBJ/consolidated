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
See the License for the specific language governing
permissions and limitations under the License.
*/

/*global dbj:true*/

/*
place for dbj comparators
dependancy: dbj.core (above) and ES5
NOTE: since 2013 quite a few comparators have been implemented please be sure which
comparator you need and use the ones bellow after that.
*/
(function (dbj, undefined) {
    "use strict";

    // also defines what is a comparator : 
    function strict_eq(a, b) { return a === b; }
    // as per ES5 spec this returns false on different types


    /*
    two_way_lookup  allows arrays v.s. singles to be compared 
    
    Examples:
    
    two_way_lookup( 1, [3,2,1] ) --> true
    two_way_lookup( [3,2,1], 1 ) --> true
    two_way_lookup( function (){ return 1;}, [3,2,1] ) --> false
    two_way_lookup( [3,2,1], ["x",[3,2,1]] ) --> true
    
    if some complex comparator is used then two_way_lookup works for all types
    */
    const two_way_lookup = function (a, b, comparator) {

    /*
    return index of an elelemnt found in the array
    (as customary) returns -1 , on not found
    use comparator function
    */
        const array_lookup = function (array, searched_element) {

            if (!Array.isArray(array)) array = [array]; 

        return array.findIndex(
            function (element) {
                return (comparator(element, searched_element));
            });
        };

        if (comparator(a, b)) return true;          /* covers arr to arr too */
        if (array_lookup(b, a ) > -1) return true;  /* a found in arr b */
        if (array_lookup(a, b ) > -1) return true;  /* b found in arr a */

        return false;
    };

    /*
    Two arrays are considered equal when all their elements 
    fulfill the following conditions:

    1.  types are equal
    2.  positions are equal
    3. values are equal

    Sparse arrays are also compared for equality

    this is the tough test, that has to be satisfied:

                 equal_arrays([1, 2, , 3], [1, 2, 3]); // => false
    
    function has(element, index) {
        return this[index] === element;
    }

    function equal_arrays(a, b) {
        return (a.length === b.length) && a.every(has, b) && b.every(has, a);
    }
    
    optimised version of the above, also using the comparator
    */
    function equal_arrays(a, b, comparator) {

        if (a.length != b.length) return false;

        for (let i = 0; i < a.length; i++)
            if (!comparator(a[i], b[i])) return false;
        return true;     
    }

    /* interface */
    dbj.compare = {
        'standard': strict_eq,
/* 
deep compare two arrays 

if comparator is given it is used
otherwise strict_eq() is used for default shallow comparisons.

NOTE: this method is in here because it is faster than 
dbj.compare.lookup()
*/
        'arr': function (a, b, /* optional */ comparator) {

            if (!!comparator && "function" != typeof comparator)
                throw TypeError("Secondary comparator is given but is not a function");

            if (!Array.isArray(a)) a = [a]; // cludge or brilliance ;)
            if (!Array.isArray(b)) b = [b]; // 

            return equal_arrays(
                a, b, comparator || strict_eq
            );
        },
        /*
        REMOVED! name 'multi' is removed in favour of 'lookup'
        */
        'multi': function () {
            throw TypeError('[dbj.cond.comparators]REMOVED: name "multi" is deprecated in favour of "lookup"');
        },
/*
Can lookup both ways from a ot b or b to a.
        Where either can be a single value or object or array.

That is if deep seocnd comparator is given.

Otherwise strict_eq() is used for default shallow comparisons.
*/
        'lookup': function (a, b, comparator) {

            if (!!comparator && "function" != typeof comparator)
                throw TypeError("Secondary comparator is given but is not a function");

            return two_way_lookup(a, b, comparator || strict_eq);
        },

        'make': function (name_, secondary_comparator) {
            const production_line_ = {
                'arr': function () {
                    return function (a, b) {
                        return dbj.compare.arr(a, b, secondary_comparator);
                    };
                  },
                'lookup': function () {
                    return function (a, b) {
                        return dbj.compare.lookup(a, b, secondary_comparator);
                    };
                }
            };
            if (name_ in production_line_) {
                return production_line_[name_](secondary_comparator);
            } 
            throw TypeError("[dbj.compare.make][Error][Name '"
                + name_
                + " is not available, we curently deliver 'arr' and 'lookup' only");
        }
    };

    /*
    export to Node.JS
    (also works in the presence of qUnit "module")
    */
    if ("undefined" != typeof module) {
        module['exports'] = dbj;  // for node js usage
    }

}(function () {
    // for dom env this creates window.dbj
    // for node env this creates module local var
    if ("undefined" == typeof dbj)
        dbj = {};
    return dbj;
}()
    )
);

