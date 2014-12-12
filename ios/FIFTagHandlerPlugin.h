//
//  FIFTagHandlerPlugin.h
//  Fifty-five
//
//  Created by Med on 09/12/14.
//  Copyright (c) 2014 Med. All rights reserved.

#import <Foundation/Foundation.h>
#import <Cordova/CDV.h>
#import "GAI.h"

@interface FIFTagHandlerPlugin : CDVPlugin {
  id<GAITracker> tracker;
}

- (void) setContainerId: (CDVInvokedUrlCommand*)command;
- (void) push: (CDVInvokedUrlCommand*)command;
- (void) setTrackingId: (CDVInvokedUrlCommand*)command;
- (void) setLogLevel: (CDVInvokedUrlCommand*)command;
- (void) setIDFAEnabled: (CDVInvokedUrlCommand*)command;
- (void) get: (CDVInvokedUrlCommand*)command;
- (void) set: (CDVInvokedUrlCommand*)command;
- (void) send: (CDVInvokedUrlCommand*)command;
- (void) close: (CDVInvokedUrlCommand*)command;

@end
