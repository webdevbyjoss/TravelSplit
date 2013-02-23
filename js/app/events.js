define(['cordova', 'jquery'], function() {
    "use strict";

    return function(callback) {
        console.log("App init started");
        $(function() {
            console.log("DOM ready");
            if (isCordova()) {
                // Initialize application just after Cordova will be loaded
                document.addEventListener("deviceready", devicereadyHandler, false);
            } else {
                initApp();
            }
        });

        // this will be called only on mobile device
        function devicereadyHandler() {
            console.log("Device ready");
            // Initialize mobile specific application events
            document.addEventListener("pause", pauseHandler, false);
            document.addEventListener("resume", resumeHandler, false);
            document.addEventListener("online", onlineHandler, false);
            document.addEventListener("offline", offlineHandler, false);
            document.addEventListener("backbutton", backbuttonHandler, false);
            document.addEventListener("menubutton", menubuttonHandler, false);
            initApp();
        }

        function initApp() {
            console.log("Ready to load jQuery Mobile");
            // We currently use jQuery Mobile for our application UI
            // so need to wait untill "mobileinit" will be fired
            $(document).bind("mobileinit", function() {
                console.log("Mobile init");
                
                // TODO: hide splash screen if will be available
                callback();
            });
        }

    }


    // Determine whether the file loaded from PhoneGap or not
    function isCordova() {
        return (cordova || PhoneGap || phonegap) 
        && /^file:\/{3}[^\/]/i.test(window.location.href) 
        && /ios|iphone|ipod|ipad|android/i.test(navigator.userAgent);
    }

    function pauseHandler() {
        console.log('Application paused');
    }

    function resumeHandler() {
        console.log('Application resumed');
    }

    function onlineHandler() {
        console.log('Application went online');
    }

    function offlineHandler() {
        console.log('Application went offline');
    }

    function backbuttonHandler() {
        console.log('Application back button pressed');
    }

    function menubuttonHandler() {
        console.log('Application menu button pressed');
    }
});