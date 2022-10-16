/*@cc_on
(function() {
    var style = document.createStyleSheet();
    window.select = function(selector) {
        style.addRule(selector, "foo:bar");
        var all = document.all, resultSet = [], i = 0, l = all.length;
        for (; i < l; i++) {
            if (all[i].currentStyle.foo === "bar") {
                resultSet[resultSet.length] = all[i];
            }
        }
              style.cssText="" // delete IE stylesheet.
           delete style ;
        return resultSet;
    }
})();
@*/
select("body > #toolbar")
/*
[object HTMLDivElement]
*/