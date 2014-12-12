//
//  FIFTagHandlerPlugin.m
//  Fifty-five
//
//  Created by Med on 09/12/14.
//  Copyright (c) 2014 Med. All rights reserved.

#import "FIFTagHandlerPlugin.h"
#import "GAI.h"
#import "GAIDictionaryBuilder.h"
#import "GAIFields.h"

//GTM
#import "TAGContainer.h"
#import "TAGContainerOpener.h"
#import "TAGManager.h"
#import "TAGDataLayer.h"

//FIFTagHandler
#import <FIFTagHandler/FIFTagHandler.h>

@implementation FIFTagHandlerPlugin

- (void) setContainerId: (CDVInvokedUrlCommand*)command
{
    CDVPluginResult* result = nil;
    NSString* containerId = [command.arguments objectAtIndex:0];
    
    //GTM
    TAGManager *tagManager = [TAGManager instance];
    
    [tagManager.logger setLogLevel:kTAGLoggerLogLevelVerbose];
    id<TAGContainerFuture> future = [TAGContainerOpener openContainerWithId:containerId
                                                                 tagManager:tagManager
                                                                   openType:kTAGOpenTypePreferFresh
                                                                    timeout:nil];
    
    
    TAGContainer *container = [future get];
    [container refresh];
    
    
    //FIFTagHandler
    [[FIFTagHandler sharedHelper].logger setLevel:kTAGLoggerLogLevelVerbose];
    [[FIFTagHandler sharedHelper] initTagHandlerWithManager:tagManager
                                                  container:container];
    

    


    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:[command callbackId]];
}

- (void) push: (CDVInvokedUrlCommand*)command
{
  CDVPluginResult* result = nil;
  NSString* key = [command.arguments objectAtIndex:0];
  NSString* value = [command.arguments objectAtIndex:1];


  // Fetch the datalayer
  TAGDataLayer *dataLayer = [[FIFTagHandler sharedHelper] tagManager].dataLayer;
  if (!dataLayer) {
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"FIFTagHandler not initialized"];
  } else {
    [dataLayer push:@{key:value}];
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
  }

  [self.commandDelegate sendPluginResult:result callbackId:[command callbackId]];
}

- (void) setTrackingId: (CDVInvokedUrlCommand*)command
{
    CDVPluginResult* result = nil;
    NSString* trackingId = [command.arguments objectAtIndex:0];
    
    [GAI sharedInstance].dispatchInterval = 10;
    [GAI sharedInstance].trackUncaughtExceptions = YES;
    
    if (tracker) {
        [[GAI sharedInstance] removeTrackerByName:[tracker name]];
    }
    
    tracker = [[GAI sharedInstance] trackerWithTrackingId:trackingId];
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    
    [self.commandDelegate sendPluginResult:result callbackId:[command callbackId]];
}


- (void) setLogLevel: (CDVInvokedUrlCommand*)command
{
  CDVPluginResult* result = nil;

  GAILogLevel logLevel = (GAILogLevel)[command.arguments objectAtIndex:0];

  [[[GAI sharedInstance] logger] setLogLevel:logLevel];

  result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];

  [self.commandDelegate sendPluginResult:result callbackId:[command callbackId]];
}

- (void) setIDFAEnabled: (CDVInvokedUrlCommand*)command
{
  CDVPluginResult* result = nil;

  if (!tracker) {
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"tracker not initialized"];
  } else {
    // Enable IDFA collection.
    tracker.allowIDFACollection = YES;
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
  }

  [self.commandDelegate sendPluginResult:result callbackId:[command callbackId]];
}

- (void) get: (CDVInvokedUrlCommand*)command
{
  CDVPluginResult* result = nil;
  NSString* key = [command.arguments objectAtIndex:0];

  if (!tracker) {
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"tracker not initialized"];
  } else {
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[tracker get:key]];
  }

  [self.commandDelegate sendPluginResult:result callbackId:[command callbackId]];
}

- (void) set: (CDVInvokedUrlCommand*)command
{
  CDVPluginResult* result = nil;
  NSString* key = [command.arguments objectAtIndex:0];
  NSString* value = [command.arguments objectAtIndex:1];

  if (!tracker) {
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"tracker not initialized"];
  } else {
    [tracker set:key value:value];
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
  }

  [self.commandDelegate sendPluginResult:result callbackId:[command callbackId]];
}

- (void) send: (CDVInvokedUrlCommand*)command
{
  CDVPluginResult* result = nil;
  NSDictionary* params = [command.arguments objectAtIndex:0];

  if (!tracker) {
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"tracker not initialized"];
  } else {
    [tracker send:params];
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
  }

  [self.commandDelegate sendPluginResult:result callbackId:[command callbackId]];
}

- (void) close: (CDVInvokedUrlCommand*)command
{
  CDVPluginResult* result = nil;

  if (!tracker) {
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"tracker not initialized"];
  } else {
    [[GAI sharedInstance] removeTrackerByName:[tracker name]];
    tracker = nil;
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
  }

  [self.commandDelegate sendPluginResult:result callbackId:[command callbackId]];
}

@end
