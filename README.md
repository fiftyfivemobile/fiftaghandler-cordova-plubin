FIFTagHandler cordova plugin
============================

* [Introduction](#introduction)
* [Installation](#installation)
* [Getting started](#getting-started)
* [Tracker reference](#tracker-reference)

## Introduction

This plugin provides Apache Cordova/Phonegap support for the FIFTagHandler using the native sdks for Android & iOS. The FIFTagHandler SDK is a wrapper above the Google Tag Manager SDK. It enable iOS/Android developers to track their apps using only GTM. The FIFTagHandler SDK currently support the following trackers: Google Analytics, Facebook, Localytics, ATInternet, MobileAppTracker and Follow Analtics.

Android Native SDK v4 (using Google Play Services SDK)
iOS Native SDK v3
This plugin provides support for some of the most specific analytics functions (screen, event & exception tracking, custom metrics & dimensions) and also the more generic set and send functions which can be used to implement all of the Google Analytics collection features.

## Installation

#### Using the Cordova CLI [Android Only]
To install the FIFTagHandler plugin in your app, use the following command-line

```shell

	cordova plugin add com.fifty-five.fiftaghandler

```


#### Cordova Registry Warning [iOS]


Installing this plugin directly from Cordova Registry results in Xcode using a broken FIFTagHandler.framework, this is because the current publish procedure to NPM breaks symlinks [CB-6092](https://issues.apache.org/jira/browse/CB-6092). Please install the plugin through a locally cloned copy or from the [plugin git repository](https://github.com/MedHaj/fiftaghandler-cordova-plugin) using the following command

```shell

	cordova plugin add https://github.com/medhaj/fiftaghandler-cordova-plugin.git

```

## Getting started

#### Initialize the FIFTagHandler SDK

To initialize the FIFTagHandler SDK, use the `setContainerId` function. Make sure to pass the Google Tag Manager container identifier as parameter.

```js

	var fiftaghandler = navigator.fiftaghandler;
	
	// Init using the GTM container id
	fiftaghandler.setContainerId('GTM-XXXX');

```

#### Push key / value object to the DataLayer

Once the FIFTagHandler SDK is initialized, you can push events / data to the Google Tag Manager DataLayer. Using the `push` function to push any key/value pair. For instance, just after initializing the FIFTagHandler, we push an appStarted event to the DataLayer

```js

	// Push appStarted event to the DataLayer
	fiftaghandler.push('event', 'appStarted');

```


#### Initialize the Google Analytics tracker

In the previous step, the FIFTagHandler SDK got initialized. This will lead to initializing the Google Tag Manager SDK. Next instructions will initialize the Google Analytics tracker

```js

	// Init with the tracking id
	fiftaghandler.setTrackingId('UA-XXXXX-X');

```

#### Use the Google Analytics tracker

As an example tracking a screen could be implemented using either the `sendAppView` function or the send function:


```js

	// Send screen view hit
	fiftaghandler.sendAppView('home', successCallback, errorCallback);

```

Alternatively, use the `send` function

```js

	var Fields    = analytics.Fields,
    HitTypes  = analytics.HitTypes,
    LogLevel  = analytics.LogLevel,
    params    = {};

	params[Fields.HIT_TYPE]     = HitTypes.APP_VIEW;
	params[Fields.SCREEN_NAME]  = 'home';

	fiftaghandler.setLogLevel(LogLevel.INFO);

	fiftaghandler.send(params, successCallback, errorCallback);

```


The send & set functions provide maximum flexibility and allow you to utilize all of the Google Analytics collection calls. Some helper function are also provided to support some of the more common analytic functions.

## Tracker reference


* Field mapping


```js

	// object containing field mapping
	fiftaghandler.Fields

```

* Type mapping


```js

	// object containing type mapping
	fiftaghandler.HitTypes

```

* Log level constants


```js

	// object containing log level constants
	fiftaghandler..LogLevel (VERBOSE, INFO, WARNING, ERROR)

```

* Callbacks

All of the function support success and error callback functions

* Set container id

```js

	// Sets the container id (must be called at app launch)
	//
	//  containerId - String    (required)
	//  success     - Function  (optional)
	//  error       - Function  (optional)
	fiftaghandler.setContainerId(containerId, success, error);

```

* Set GA tracking id

```js

	// Sets the tracking id (must be called at app launch)
	//
	//  trackingId  - String    (required)
	//  success     - Function  (optional)
	//  error       - Function  (optional)
	fiftaghandler.setTrackingId(trackingId, success, error);

```


* Set the log level

```js

	// Sets the log level
	//
	//  logLevel    - Number    (required)
	//  success     - Function  (optional)
	//  error       - Function  (optional)
	fiftaghandler.setLogLevel(logLevel, success, error);

```

* Set the advertising id

```js

	// Sets whether the advertising id and ad targeting 
	// preference should be collected
	//
	//  success     - Function  (optional)
	//  error       - Function  (optional)
	fiftaghandler.enableAdvertisingIdCollection(success, error);

```

* Log screen views

```js

	// Logs screen views in GA
	//
	//  screenName  - String    (required)
	//  success     - Function  (optional)
	//  error       - Function  (optional)
	fiftaghandler.sendAppView(screenName, success, error);

```

* Log screen views with additional parameters

```js

	// Logs screen views in GA
	// also supports the ability to send additional paramaters in the request
	// The params argument is an object which can contain additional key and value
	// parameters which will be sent as part of the analytics request

	//  screenName 	- String    (required)
	//  params	   	- Map	    (required)
	//  success    	- Function  (optional)
	//  error      	- Function  (optional)
	fiftaghandler.sendAppViewWithParams(screenName, params, success, error);

```


* Log app events

```js

	// Sends an event hit
	//
	//  category  - String    (required)
	//  action    - String    (required)
	//  label     - String    (optional, defaults to '')
	//  value     - Number    (optional, defaults to 0)
	//  success   - Function  (optional)
	//  error     - Function  (optional)
	fiftaghandler.sendEvent(category, action, label, value, success, error);

```

* Log app events with parameters

```js

	// Sends an event hit
	// also supports the ability to send additional paramaters in the request
	// The params argument is an object which can contain additional key and value
	// parameters which will be sent as part of the analytics request
	
	//  category  	- String   	(required)
	//  action    	- String   	(required)
	//  label     	- String  	(optional, defaults to '')
	//  value     	- Number   	(optional, defaults to 0)
	//  params		- Map		(required)
	//  success   	- Function 	(optional)
	//  error     	- Function 	(optional)
	fiftaghandler.sendEventWithParams(category, action, label, value, params, success, error);

```

* Log an exception

```js

	// Sends an exception hit
	//
	//  description - String    (required)
	//  fatal       - boolean   (required)
	//  success     - Function  (optional)
	//  error       - Function  (optional)
	fiftaghandler.sendException(description, fatal, success, error);

```

* Track app errors/crashes

```js

	// Tracks unhandled scripts errors (window.onerror) and then calls sendException.
	// This function optionally can be passed an object containing a formmatter function
	// which takes in all the args to window.onError and should return a String with
	// the formatted error description to be sent to Google Analytics. Also the object
	// can provide a fatal property which will be passed to sendException (defaults
	// to true).
	//
	//  opts        - Object    (optional) {formatter: Function, fatal: Boolean}
	//  success     - Function  (optional)
	//  error       - Function  (optional)
	fiftaghandler.trackUnhandledScriptErrors(opts, success, error);
	
```

* Set custom dimensions

```js

	// Sets a custom dimension
	//
	//  id        - Number    (required)
	//  value     - String    (optional)
	//  success   - Function  (optional)
	//  error     - Function  (optional)
	fiftaghandler.customDimension(id, value, success, error);
	
```

* Set custom metrics

```js

	// Sets a custom metric
	//
	//  id        - Number    (required)
	//  value     - Number    (optional)
	//  success   - Function  (optional)
	//  error     - Function  (optional)
	fiftaghandler.customMetric(id, value, success, error);
	
```


* Set a field

```js

	// Sets a field
	//
	//  name        - String    (required)
	//  value       - String    (optional) use null to unset a field
	//  success     - Function  (optional)
	//  error       - Function  (optional)
	fiftaghandler.set(name, value, success, error);
	
```

* Get a field

```js

	// Gets a field value. Returned as argument to success callback
	//
	//  name        - String    (required)
	//  success     - Function  (required)
	//  error       - Function  (optional)
	fiftaghandler.get(name, success, error);
	
```

* Send a hit

```js

	// Generates a hit to be sent with the specified params and current field values
	//
	//  params      - Object    (required)
	//  success     - Function  (optional)
	//  error       - Function  (optional)
	fiftaghandler.send(params, success, error);
	
```

* Close the tracker

```js

	// Closes the the tracker
	//
	//  success     - Function  (optional)
	//  error       - Function  (optional)
	fiftaghandler.close(success, error);
	
```
