define(['cordova', 'jquery', 'underscore'], function() {
    "use strict";

    return function(initCallback) {

        // DOM ready
        $(function() {

            // Just init app on regular browser
            // Without Cordova we can perfrom that immediately
            if (!isCordova()) {
                initCallback();
                return;
            }

            // This will be called only on Cordova device
            // Application init on Cordova should be done on "deviceready"
            document.addEventListener("deviceready", function() {
            
                // Initialize Cordova specific application events
                document.addEventListener("pause", pauseHandler, false);
                document.addEventListener("resume", resumeHandler, false);
                document.addEventListener("online", onlineHandler, false);
                document.addEventListener("offline", offlineHandler, false);
                document.addEventListener("backbutton", backbuttonHandler, false);
                document.addEventListener("menubutton", menubuttonHandler, false);

                // finally start application initialization
                initCallback();

            }, false);

        });

    }


    /**
     * Determine whether the file loaded from Cordova or not
     * 
     * @return Boolean true if application is in Cordova environment
     */
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
        if (confirm("Do you want to exit the application?")) {
            navigator.app.exitApp();
        }
    }

    function menubuttonHandler() {
        console.log('Application menu button pressed');
    }



});