define(['utils', 'cordova'], function(utils) {
    "use strict";

    return function(initCallback) {

        // Just init app on regular browser
        // Without Cordova we can perfrom that immediately
        if (!utils.isCordova()) {
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