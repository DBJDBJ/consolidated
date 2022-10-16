/* 

*/

function MirrorFrame(place_id, options) {

    var self = this; //
    $place = $("#" + place_id);
    $home = $("<div style='min-height:100%;height:100%;'></div>");
    $tbar = $("<div class='toolbar' ></div>");

    $place.append($tbar).append($home);

self.log = function(s) { options.log(s); };

function makeButton(name, action) {
    var $b = $("<button>" + name + "</button>");
    $b[0].onclick = function() { self[action].call(self); };
    $tbar.append($b);
  }

  makeButton("Search", "search");
  makeButton("Replace", "replace");
  makeButton("Current line", "line");
  makeButton("Jump to line", "jump");
  makeButton("Insert constructor", "macro");
  makeButton("Indent all", "reindent");
  makeButton("Evaluator", "code");
  makeButton("Analist", "analisa");

  $home.height($(document.body).height() - (2.8 * $tbar.height()));
  options.height = $home.height();

  self.mirror = new CodeMirror($home[0], options);
}

//--------------------------------------------------------------------
MirrorFrame.prototype = {
    //--------------------------------------------------------------------
    // BEGIN DBJ added
    rx1: /(\/\*)(.*?)(\*\/)/mg,  // match /* comments
    rx2: /(\/\/)(.*?)($)/mg,  // match // comments
    rx3: /\n+|\t+|\r+|\s+/g, // match tab's, new lines, etc ...
    compress: function(o) {
        if ("string" != typeof o) return null;
        return o.replace(this.rx2, "")
                .replace(this.rx3, " ")
                .replace(this.rx1, "")
                .replace(this.rx3, " ");
    },
    analisa: function(o, Rx) {
        var rx = [
        /[\w\W]*/g, // http://noteslog.com/post/how-to-write-a-fast-catch-all-regexp/
        /(?:\w|\W)/g,
        /.|\n/g
        ];
        o = o || this.mirror.getCode();
        var lisa = ["input length:" + o.length], cnt = 0;
        o.replace(Rx || rx[2], function(c) {
            try {
                lisa.push((cnt++) + " : " + (c !== "" ? c.charCodeAt(0) : "EMPTY"));
            } catch (x) {
                lisa.push((cnt++) + " : " + "!");
            }
            return c;
        });
        this.log(lisa.join("\n"));
    },
    code: function() {
        try {
            var code_ = this.mirror.getCode();
            this.mirror.setCode(code_ + "\n/*" +
                 eval(code_) +
                 "*/"
            );
        } catch (x) {
            if (x instanceof Error) {
                x = x.name + " " + "\nNumber : " + (x.number & 0xFFFF) + "\nDescription : " + x.description;
            }
            alert(x);
        }
    },
    // END DBJ added
    //--------------------------------------------------------------------    
    search: function() {
        var text = prompt("Enter search term:", "");
        if (!text) return;

        var first = true;
        do {
            var cursor = this.mirror.getSearchCursor(text, first);
            first = false;
            while (cursor.findNext()) {
                cursor.select();
                if (!confirm("Search again?"))
                    return;
            }
        } while (confirm("End of document reached. Start over?"));
    },

    replace: function() {
        // This is a replace-all, but it is possible to implement a
        // prompting replace.
        var from = prompt("Enter search string:", ""), to;
        if (from) to = prompt("What should it be replaced with?", "");
        if (to == null) return;

        var cursor = this.mirror.getSearchCursor(from, false);
        while (cursor.findNext())
            cursor.replace(to);
    },

    jump: function() {
        var line = prompt("Jump to line:", "");
        if (line && !isNaN(Number(line)))
            this.mirror.jumpToLine(Number(line));
    },

    line: function() {
        alert("The cursor is currently at line " + this.mirror.currentLine());
        this.mirror.focus();
    },

    macro: function() {
        var name = prompt("Name your constructor:", "");
        if (name)
            this.mirror.replaceSelection("function " + name + "() {\n  \n}\n\n" + name + ".prototype = {\n  \n};\n");
    },

    reindent: function() {
        this.mirror.reindent();
    }
};
