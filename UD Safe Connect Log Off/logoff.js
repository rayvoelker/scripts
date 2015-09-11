/*
Ray Voelker
Roesch Library
rvoelker1@udayton.edu
ray.voelker@gmail.com

adapted from:
https://github.com/ariya/phantomjs/blob/master/examples/waitfor.js



notes and future enhancements:

The intended use of this script is in conjunction with the software PhantomJS
http://phantomjs.org/

To log users off of the safe connect network automatically on workstation log off 
do the following:
1) Download and unpack the PhantomJS executable onto the workstation and place in
a path easily accessible.

2) Place this script on the workstation (putting it in the same path as the 
PhantomJS executable is recommended)

3) Modify the Startup/Shutdown, Logon/Logoff scripts using window group policy 
editor ... adding a batch script similar to the following:
	@echo off
	start C:\phantomjs\phantomjs.exe C:\phantomjs\logoff.js
	exit

Issues
------
1) This script doesn't wait for the network, or continue to try the page x number
of times if the network in unavailable. It's probably a good idea to add such 
a thing to a future version of this script.

2) A more elegant 'quit' procedure should be written into the script. Right now
it will exit after 5 seconds, assuming that whatever safeconnect needs to do on 
the page has been done during that time.
*/

var page = require('webpage').create(),
	url = 'http://go.udayton.edu/logoff';

console.log('loading page ' + url + '\n');

// open page and check for successful load ...
page.open(url, function (status) {
    // Check for page load success ...
    if (status !== 'success') {
        console.log('Unable to access network');
    }
	
	else {
		console.log('finished ...');
		// wait for 5 seconds and then close the script ...
		window.setTimeout( function(){
			phantom.exit(0);
		}, 5000);		
    }
}); //end page.open