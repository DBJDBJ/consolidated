/* http://perfectionkills.com/global-eval-what-are-the-options/ */
var globalEval=function(){var isIndirectEvalGlobal=function(original,Object){try{return(1,eval)("Object")===original}catch(err){return false}}(Object,123);if(isIndirectEvalGlobal){return function(expression){return(1,eval)(expression)}}else if(typeof window.execScript!=="undefined"){return function(e){return window.execScript(e)}}}()
   /* http://osteele.com/javascripts/functional */
String.prototype.lambda=function(){var e=[],t=this,n=t.ECMAsplit(/\s*->\s*/m);if(n.length>1){while(n.length){t=n.pop();e=n.pop().split(/\s*,\s*|\s+/m);n.length&&n.push("(function("+e+"){return ("+t+")})")}}else if(t.match(/\b_\b/)){e="_"}else{var r=t.match(/^\s*(?:[+*\/%&|\^\.=<>]|!=)/m),i=t.match(/[+\-*\/%&|\^\.=<>!]\s*$/m);if(r||i){if(r){e.push("$1");t="$1"+t}if(i){e.push("$2");t=t+"$2"}}else{var s=this.replace(/(?:\b[A-Z]|\.[a-zA-Z_$])[a-zA-Z_$\d]*|[a-zA-Z_$][a-zA-Z_$\d]*\s*:|this|arguments|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/g,"").match(/([a-z_$][a-z_$\d]*)/gi)||[];for(var o=0,u;u=s[o++];)e.indexOf(u)>=0||e.push(u)}}return new Function(e,"return ("+t+")")};String.prototype.lambda.cache=function(){var e=String.prototype,t={},n=e.lambda,r=function(){var e="#"+this;return t[e]||(t[e]=n.call(this))};r.cached=function(){};r.uncache=function(){e.lambda=n};e.lambda=r};String.prototype.apply=function(e,t){return this.toFunction().apply(e,t)};String.prototype.call=function(){return this.toFunction().apply(arguments[0],Array.prototype.slice.call(arguments,1))};String.prototype.toFunction=function(){var e=this;if(e.match(/\breturn\b/))return new Function(this);return this.lambda()};Function.prototype.toFunction=function(){return this};Function.toFunction=function(e){return e.toFunction()};String.prototype.ECMAsplit="ab".split(/a*/).length>1?String.prototype.split:function(e,t){if(typeof t!="undefined")throw"ECMAsplit: limit is unimplemented";var n=this.split.apply(this,arguments),r=RegExp(e),i=r.lastIndex,s=r.exec(this);if(s&&s.index==0)n.unshift("");r.lastIndex=i;return n}

var odd = function (n){   return (n == parseFloat(n)) && (n % 2 == 1); };

  function hotpo ( x, steps ) {
    return eval(dbj.cond( true,
        x == 1 ,   "steps",
        odd(x) ,   "hotpo( 1 + ( x * 3 ), 1 + steps )",
                   "hotpo ( x / 2, 1 + steps)"
    )) ;
  }


var G = this ;

function evil (x) {
   try {
       return "string" == typeof x ? globalEval(x) : x ;
   } catch (xx) {
        alert(xx+"");
        return undefined ;
   }
}
function PC (v) {

            var j = 1, L = arguments.length;
            for (; j < L; j += 2) {
                if (PC.EQ(
                        eval(v), 
                        eval(arguments[j])
                )
              ) return eval(arguments[j + 1]);
            }
            return eval( arguments[j - 2]) || undefined ;
        }
PC.EQ = function (a, b) { return a === b; };

var x = 7 ;
[PC('true', "odd(x)", "hotpo(x,0)",'"EVEN!"'), hotpo(7,0) ===  eval("hotpo(x,0)"), evil("odd(x)") === odd(x)];
/*
EVEN!,true,false
*/