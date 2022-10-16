
(function () {
    /*------------------------------------------------------*/
    var isLoading = false, home_url = "http://dbj.org" ;

    if ("function" != typeof "".format)
        // add format() if one does not exist already
        String.prototype.format = (function () {
            // create once Regular Expressions to be used latter
            var rx1 = /\{(\d|\d\d)\}/g, rx2 = /\d+/;
            return function () {
                var args = arguments;
                return this.replace(rx1, function ($0) {
                    var idx = 1 * $0.match(rx2)[0];
                    return args[idx] !== undefined ? args[idx] : (args[idx] === "" ? "" : $0);
                });
            }
        }());


    var dbj = {
        q: (function (cache_) {
            return function (exp) {
                return cache_[exp] || (cache_[exp] = document.querySelector(exp)) ;
            }
        }({})),

        log: function (m_) {
            var prefix = "DBJ BROWSER : ";
            if (m_ instanceof Error) {
                console.error("ERROR in " + prefix_ + m_.stack);
            } else {
                console.log(prefix + m_);
            }
        }
    };

    onload = function () {
        try {
            var webview = dbj.q('webview');
            
            dbj.q('webview').addEventListener("sizechanged", 
                function (oldWidth, oldHeight, newWidth, newHeight) {
                    dbj.log(oldWidth); console.dir(oldWidth);
                    dbj.log(oldHeight); console.dir(oldHeight);
                    dbj.log(newWidth); console.dir(newWidth);
                    dbj.log(newHeight); console.dir(newHeight);
                });

            window.onresize = doLayout;

            doLayout();

            dbj.q('#back').onclick = function () {
                webview.back();
            };

            dbj.q('#forward').onclick = function () {
                webview.forward();
            };

            dbj.q('#home').onclick = function () {
                navigateTo( home_url );
            };

            dbj.q('#reload').onclick = function () {
                if (isLoading) {
                    webview.stop();
                } else {
                    webview.reload();
                }
            };
            dbj.q('#reload').addEventListener('webkitAnimationIteration',
              function () {
                  if (!isLoading) {
                      document.body.classList.remove('loading');
                  }
              });

            dbj.q('#location-form').onsubmit = function (e) {
                e.preventDefault();
                navigateTo(dbj.q('#location').value);
            };

            webview.addEventListener('exit', handleExit);
            webview.addEventListener('loadstart', handleLoadStart);
            webview.addEventListener('loadstop', handleLoadStop);
            webview.addEventListener('loadabort', handleLoadAbort);
            webview.addEventListener('loadredirect', handleLoadRedirect);
            webview.addEventListener('loadcommit', handleLoadCommit);
        } catch (x) {
            console.error("DBJ BROWSER ERROR: " + x);
        }
    };

    function navigateTo(url) {
        resetExitedState();
        dbj.q('webview').src = url;
    }

    function doLayout() {
        var webview = dbj.q('webview');
        var controls = dbj.q('#controls');
        var controlsHeight = controls.offsetHeight;
        var windowWidth = document.documentElement.clientWidth;
        var windowHeight = document.documentElement.clientHeight;
        var webviewWidth = windowWidth;
        var webviewHeight = windowHeight - controlsHeight;

        webview.style.width = webviewWidth + 'px';
        webview.style.height = webviewHeight + 'px';

    }

    function handleExit(event) {
        console.log(event.type);
        document.body.classList.add('exited');
        if (event.type == 'abnormal') {
            document.body.classList.add('crashed');
        } else if (event.type == 'killed') {
            document.body.classList.add('killed');
        }
    }

    function resetExitedState() {
        document.body.classList.remove('exited');
        document.body.classList.remove('crashed');
        document.body.classList.remove('killed');
    }

    function handleLoadCommit(event) {
        resetExitedState();
        if (!event.isTopLevel) {
            return;
        }

        dbj.q('#location').value = event.url;

        var webview = dbj.q('webview');
        dbj.q('#back').disabled = !webview.canGoBack();
        dbj.q('#forward').disabled = !webview.canGoForward();
    }

    function handleLoadStart(event) {
        document.body.classList.add('loading');
        isLoading = true;

        resetExitedState();
        if (!event.isTopLevel) {
            return;
        }

        dbj.q('#location').value = event.url;
    }

    function handleLoadStop(event) {
        // We don't remove the loading class immediately, instead we let the animation
        // finish, so that the spinner doesn't jerkily reset back to the 0 position.
        isLoading = false;
    }

    function handleLoadAbort(event) {
        console.log('oadAbort');
        console.log('  url: ' + event.url);
        console.log('  isTopLevel: ' + event.isTopLevel);
        console.log('  type: ' + event.type);
    }

    function handleLoadRedirect(event) {
        resetExitedState();
        if (!event.isTopLevel) {
            return;
        }

        dbj.q('#location').value = event.newUrl;
    }
    /*------------------------------------------------------*/
}());