//
//  FIFConstants.h
//  FIFTagHandler
//
//  Created by Med on 05/06/14.
//  Copyright (c) 2014 fifty-five. All rights reserved.
//



//GTM functions
/**
 *  GTM funtion init.
 */
#define GTM_INIT                                    @"init"

/**
 *  GTM funtion upload.
 */
#define GTM_UPLOAD                                  @"upload"

/**
 *  GTM funtion close.
 */
#define GTM_CLOSE                                   @"close"

/**
 *  GTM funtion resume.
 */
#define GTM_RESUME                                  @"resume"

/**
 *  GTM funtion set.
 */
#define GTM_SET                                     @"set"

/**
 *  GTM funtion tagEvent.
 */
#define GTM_TAG_EVENT                               @"tagEvent"

/**
 *  GTM funtion tagScreen.
 */
#define GTM_TAG_SCREEN                              @"tagScreen"

/**
 *  GTM funtion tagError.
 */
#define GTM_TAG_ERROR                               @"tagError"

/**
 *  GTM funtion tagTransaction.
 */
#define GTM_TAG_TRANSACTION                         @"tagTransaction"




typedef NS_ENUM(NSInteger, FIFReturnCode) {
    /** Return code - success. */
    FIFSuccessCode = 0,
    
    /** Return code - unsupported. */
    FIFUnsupportedCode = 1,
    
    /** Return code - not supported */
    FIFMissingRequiredParameterCode = -1,
    
    /** Log level of Error. */
    FIFNotInitializedCode = -2,
    
    /** Log level of None. */
    FIFUncastableParameterCode = -3,
};



