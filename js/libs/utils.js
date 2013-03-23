define(function(){
	return {

	    /**
	     * Determine whether the file loaded from Cordova or not
	     * 
	     * @return {Boolean} true if application is in Cordova environment
	     */
	    isCordova: function() {
	        return (cordova || PhoneGap || phonegap) 
	        && /^file:\/{3}[^\/]/i.test(window.location.href) 
	        && /ios|iphone|ipod|ipad|android/i.test(navigator.userAgent);
	    }

	};
});