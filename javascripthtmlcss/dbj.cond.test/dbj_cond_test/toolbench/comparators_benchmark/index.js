'use strict';

/*global dbj:true*/

exports.run = function () {

 // already done on app startup in index.js --> require('dbj.cond.comparators');
  require('colors');
  const fast_deep_equal = require('fast-deep-equal');
  // const strictEqual = require('assert').deepStrictEqual;
  const tests = require('../dbj_comparators_tests/testlist');
  const Benchmark = require('benchmark');
  const suite = new Benchmark.Suite;

  const equalPackages = {
    'fast-deep-equal': fast_deep_equal,
    /*
        'shallow-equal-fuzzy': require('shallow-equal-fuzzy'),
      'nano-equal': true,
      'underscore.isEqual': require('underscore').isEqual,
      'lodash.isEqual': require('lodash').isEqual,
      'deep-equal': true,
      'deep-eql': true,
        */
    'dbj cond arr': dbj.compare.arr,
    'dbj cond lookup': dbj.compare.lookup,
  };

  console.log('\nComparators Benchmarking\n'.underline.padStart(60));

  for (const equalName in equalPackages) {
    let equalFunc = equalPackages[equalName];
    if (equalFunc === true) equalFunc = require(equalName);
    /*
      for (const testSuite of tests) {
          for (const test of testSuite.tests) {
          try {
              if (equalFunc(test.value1, test.value2, fast_deep_equal) !== test.equal)
              console.error('different result'.red, equalName, testSuite.description, test.description);
          } catch(e) {
            console.error("Exception ".red, equalName, testSuite.description, test.description, e.bold.red);
          }
        }
      }
        */
    console.log((equalName + '\tbenchmarking started').padStart(60));
    suite.add(equalName, function() {
      for (const testSuite of tests) {
        for (const test of testSuite.tests) {
          if (test.description != 'pseudo array and equivalent array are not equal')
            equalFunc(test.value1, test.value2, fast_deep_equal);
        }
      }
    });
  }

  console.log('\nRezults\n'.underline.padStart(60));

  suite
    .on('cycle', (event) => console.log(String(event.target)))
    .on('complete', function() {
      console.log(
        ('\nThe fastest is ' + this.filter('fastest').map('name') + '\n').bold.cyan
      );
    })
    .run({ async: true });
};
