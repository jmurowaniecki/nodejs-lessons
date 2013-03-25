nodejs-lessons
==============

Experimentations with NodeJS.

Install and Run
===============

To install (or update) the requirements of this package you'll need to execute `npm install` and `npm start` (or simply `node app-server.js`) to run.

Todo:
=====

Create a simple webserver
-------------------------
Let's create a simple service using express. That's easy and there's a lot of documentation on the Internet.

After execute `npm start` connect to your http://localhost:1313 to see the greetings message.

Creating some routes to our application
---------------------------------------
Our application need to be functional (non fiction), so we must add the functionalities. For this we'll create an about route and load the json package file to see how it works.

Note that we've changed the package.json to start our script using nodemon.

If you want to start the script manually you should use `nodemon app-server.js` or the old-fashion way `node app-server.js`.

So, now we have the http://localhost:1313/about that loads the data from our package.json, also we have the http://localhost:1313/mynameis/yourname that returns yourname as a simple example of uri parsing as our meeting page.