//
//  FIFTagHandler.h
//  FIFTagHandler
//
//  Created by Med on 05/06/14.
//  Copyright (c) 2014 fifty-five. All rights reserved.
//


#import <Foundation/Foundation.h>
#import "FIFLogger.h"
#import "FIFConstants.h"

@class TAGManager;
@class TAGContainer;


/**
 *  A class that provides a template to manage and schedule different function 
 *  calls from different mobile tracking frameworks using GTM.
 */
@interface FIFTagHandler : NSObject

/** Default logger */
@property (nonatomic, strong) FIFLogger *logger;

/** GTM tag manager */
@property (nonatomic, strong) TAGManager *tagManager;


/** GTM container */
@property (nonatomic, strong) TAGContainer *container;


/**
 *  Use sharedHandler to get a shared instance of FIFTagHandler.
 *
 *  @return a shared instance of type FIFTagHandler *
 */
+ (FIFTagHandler *) sharedHelper;


#pragma mark - GoogleTagManager
/**
 *  Use initTagHandlerWithManager:container: to configure and initilize 
 *  FIFTagHandler with Google Tag Manager.
 *
 *  @param tagManager A google tag manager instance.
 *  @param container  The tag container.
 */
- (void)initTagHandlerWithManager:(TAGManager *)tagManager
                        container:(TAGContainer *)container;


@end
