
/*
Copyright 2018 dbj.org

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed
on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

/*global dbj:true*/

require('colors');

(function(dbj, undefined) {

  dbj.nano = {
    'padStart': function(context, maxlen, filler) { return context.padStart(maxlen, filler); },
    'padEnd': function(context, maxlen, filler) { return context.padEnd(maxlen, filler); },
    'evil': function evalInContext(jscode, context) {
      return function() { return (new Function ("return " + jscode))(); }.call(context);
    },
    'msg': function(s_) {
      console.log(s_.padEnd(99).bold);
    },
    'group': function(prompt, cb) {
      console.log();
      console.log((prompt).padEnd(99, ' ').bold.underline.white);
      // console.log();
      cb(dbj.nano);
      console.log();
    },
    'test': function(prompt, cb) {

      let retval = true;
      // console.log();
      try {
        if (cb(dbj.nano) == true) {
            // print on FAILED only
          // console.info('OK'.bold.green);
          retval = true;
        } else {
            // print on FAILED only
          console.log((prompt).padEnd(99, ' '));
          console.error('FAILED'.bold.red);
          retval = false;
        }
      } catch (x) {
        console.error(('Exception: ' + x.message).padEnd(99).bold.red);
        retval = false;
      }
      return retval;
    },
  };

  /*
    export to Node.JS
    (also works in the presence of qUnit "module")
    */
  if (typeof module !== 'undefined') {
    module['exports'] = dbj; // for node js usage
  }

  /* --------------------------------------------------------------------------------------------*/
}(function() {
  // for dom  this creates window.dbj
  // for node this creates module local var
  if (typeof dbj === 'undefined')
    dbj = {};
  return dbj;
}()
)
);

/*
inspired by
http://2ality.com/2015/11/string-padding.html

function string_padding_ (context, fillString, left_fill = true ) {

    let str = String(context);
        if (str.length >= maxLength) {
            return str;
        }

    fillString = String(fillString);
    if (fillString.length === 0) {
        fillString = ' ';
    }

    let fillLen = maxLength - str.length;
    let timesToRepeat = Math.ceil(fillLen / fillString.length);
    let truncatedStringFiller = fillString
        .repeat(timesToRepeat)
        .slice(0, fillLen);
    return left_fill ? truncatedStringFiller + str : str + truncatedStringFiller ;
}

if ("function" != typeof String.prototype.padStart)
String.prototype.padStart =
    function (maxLength, fillString = ' ') {
        return string_padding_(this, fillString);
     };

if ("function" != typeof String.prototype.padEnd)
String.prototype.padEnd =
    function (maxLength, fillString = ' ') {
        return string_padding_(this, fillString, false);
    };
*/
