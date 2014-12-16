//
//  FIFTagHandler
//  Fifty-five
//
//  Created by Med on 09/12/14.
//  Copyright (c) 2014 Med. All rights reserved.

'use strict';

var argscheck = require('cordova/argscheck'),
    utils     = require('cordova/utils'),
    exec      = require('cordova/exec'),
    platform  = require('cordova/platform');

var Fields = {
  ANDROID_APP_UID:          'AppUID',
  ANONYMIZE_IP:             '&aip',
  APP_ID:                   '&aid',
  APP_INSTALLER_ID:         '&aiid',
  APP_NAME:                 '&an',
  APP_VERSION:              '&av',
  CAMPAIGN_CONTENT:         '&cc',
  CAMPAIGN_ID:              '&ci',
  CAMPAIGN_KEYWORD:         '&ck',
  CAMPAIGN_MEDIUM:          '&cm',
  CAMPAIGN_NAME:            '&cn',
  CAMPAIGN_SOURCE:          '&cs',
  CLIENT_ID:                '&cid',
  CURRENCY_CODE:            '&cu',
  DESCRIPTION:              '&cd',
  ENCODING:                 '&de',
  EVENT_ACTION:             '&ea',
  EVENT_CATEGORY:           '&ec',
  EVENT_LABEL:              '&el',
  EVENT_VALUE:              '&ev',
  EX_DESCRIPTION:           '&exd',
  EX_FATAL:                 '&exf',
  FLASH_VERSION:            '&fl',
  HIT_TYPE:                 '&t',
  HOSTNAME:                 '&dh',
  ITEM_CATEGORY:            '&iv',
  ITEM_NAME:                '&in',
  ITEM_PRICE:               '&ip',
  ITEM_QUANTITY:            '&iq',
  ITEM_SKU:                 '&ic',
  JAVA_ENABLED:             '&je',
  LANGUAGE:                 '&ul',
  LOCATION:                 '&dl',
  NON_INTERACTION:          '&ni',
  PAGE:                     '&dp',
  REFERRER:                 '&dr',
  SAMPLE_RATE:              '&sf',
  SCREEN_COLORS:            '&sd',
  SCREEN_NAME:              '&cd',
  SCREEN_RESOLUTION:        '&sr',
  SESSION_CONTROL:          '&sc',
  SOCIAL_ACTION:            '&sa',
  SOCIAL_NETWORK:           '&sn',
  SOCIAL_TARGET:            '&st',
  TIMING_CATEGORY:          '&utc',
  TIMING_LABEL:             '&utl',
  TIMING_VALUE:             '&utt',
  TIMING_VAR:               '&utv',
  TITLE:                    '&dt',
  TRACKING_ID:              '&tid',
  TRANSACTION_AFFILIATION:  '&ta',
  TRANSACTION_ID:           '&ti',
  TRANSACTION_REVENUE:      '&tr',
  TRANSACTION_SHIPPING:     '&ts',
  TRANSACTION_TAX:          '&tt',
  USE_SECURE:               'useSecure',
  VIEWPORT_SIZE:            '&vp'
};

var HitTypes = {
  APP_VIEW:     'appview',
  EVENT:        'event',
  EXCEPTION:    'exception',
  ITEM:         'item',
  SOCIAL:       'social',
  TIMING:       'timing',
  TRANSACTION:  'transaction'
};

var LogLevel = {
  VERBOSE: 0,
  INFO:    1,
  WARNING: 2,
  ERROR:   3
};

var logLevelCount = 0, key;
for (key in LogLevel) {
  if (LogLevel.hasOwnProperty(key)) {
    logLevelCount++;
  }
}

function FIFTagHandler() {
}

FIFTagHandler.prototype = {

  Fields: Fields,

  HitTypes: HitTypes,

  LogLevel: LogLevel,

  setContainerId: function (containerId, success, error) {
    argscheck.checkArgs('sFF', 'fiftaghandler.setContainerId', arguments);
    exec(success, error, 'FIFTagHandler', 'setContainerId', [containerId]);
  },

  push: function (map, success, error) {
    argscheck.checkArgs('oFF', 'fiftaghandler.push', arguments);
    exec(success, error, 'FIFTagHandler', 'push', [map]);
  },

  setTrackingId: function (trackingId, success, error) {
    argscheck.checkArgs('sFF', 'fiftaghandler.setTrackingId', arguments);
    exec(success, error, 'FIFTagHandler', 'setTrackingId', [trackingId]);
  },

  setLogLevel: function (logLevel, success, error) {
    argscheck.checkArgs('nFF', 'fiftaghandler.setLogLevel', arguments);
    if (platform.id === 'ios') {
      // the log levels for android are 0,1,2,3 and for ios are 4,3,2,1
      logLevel = logLevelCount - logLevel;
    }
    exec(success, error, 'FIFTagHandler', 'setLogLevel', [logLevel]);
  },

  enableAdvertisingIdCollection: function (success, error) {
       argscheck.checkArgs('FF', 'fiftaghandler.enableAdvertisingIdCollection', arguments);
       exec(success, error, 'FIFTagHandler', 'setIDFAEnabled', []);
  },

  get: function (key, success, error) {
    argscheck.checkArgs('sfF', 'fiftaghandler.get', arguments);
    exec(success, error, 'FIFTagHandler', 'get', [key]);
  },

  set: function (key, value, success, error) {
    argscheck.checkArgs('s*FF', 'fiftaghandler.set', arguments);
    exec(success, error, 'FIFTagHandler', 'set', [key, value]);
  },

  send: function (map, success, error) {
    argscheck.checkArgs('oFF', 'fiftaghandler.send', arguments);
    exec(success, error, 'FIFTagHandler', 'send', [map]);
  },

  close: function (success, error) {
    argscheck.checkArgs('FF', 'fiftaghandler.close', arguments);
    exec(success, error, 'FIFTagHandler', 'close', []);
  },

  customDimension: function (id, value, success, error) {
    argscheck.checkArgs('n*FF', 'fiftaghandler.customDimension', arguments);
    this.set('&cd' + id, value, success, error);
  },

  customMetric: function (id, value, success, error) {
    argscheck.checkArgs('n*FF', 'fiftaghandler.customMetric', arguments);
    this.set('&cm' + id, value, success, error);
  },

  sendEvent: function (category, action, label, value, success, error) {
    this.sendEventWithParams(category, action, label, value, {}, success, error);
  },

  sendEventWithParams: function (category, action, label, value, params, success, error) {
    argscheck.checkArgs('ssSNoFF', 'fiftaghandler.sendEvent', arguments);
    if (params === undefined || params === null) {
      params = {};
    }
    params[Fields.HIT_TYPE]       = HitTypes.EVENT;
    params[Fields.EVENT_CATEGORY] = category;
    params[Fields.EVENT_ACTION]   = action;
    params[Fields.EVENT_LABEL]    = label || '';
    params[Fields.EVENT_VALUE]    = value || 0;
    this.send(params, success, error);
  },

  sendAppView: function (screenName, success, error) {
    this.sendAppViewWithParams(screenName, {}, success, error)
  },

  sendAppViewWithParams: function (screenName, params, success, error) {
    argscheck.checkArgs('soFF', 'fiftaghandler.sendAppView', arguments);
    if (params === undefined || params === null) {
      params = {};
    }
    params[Fields.HIT_TYPE]       = HitTypes.APP_VIEW;
    params[Fields.SCREEN_NAME]    = screenName;
    this.send(params, success, error);
  },

  sendException: function (description, fatal, success, error) {
    argscheck.checkArgs('s*FF', 'fiftaghandler.sendException', arguments);
    var params = {};
    params[Fields.HIT_TYPE]        = HitTypes.EXCEPTION;
    params[Fields.EX_DESCRIPTION]  = description;
    params[Fields.EX_FATAL]        = fatal ? 1 : 0;
    this.send(params, success, error);
  },

  trackUnhandledScriptErrors: function (opts, success, error) {
    argscheck.checkArgs('OFF', 'fiftaghandler.trackUnhandledScriptErrors', arguments);
    var self = this,
      fatal = true,
      formatter;
    if (opts && utils.typeName(opts.formatter) === 'Function') {
      formatter = opts.formatter;
    }
    if (opts && utils.typeName(opts.fatal) === 'Boolean') {
      fatal = opts.fatal;
    }
    window.onError = function (message, file, line, col, error) {
      var description;
      try {
        if (formatter) {
          description = formatter(message, file, line, col, error);
        }
      } catch (e) {
        utils.alert(
          'fiftaghandler.trackUnhandledScriptErrors invalid formatter. error:' + e);
      } finally {
        // if there is an error formatting or no formatter use default
        if (description === undefined) {
          description = (file || '');
          if (line || col) {
            description += ' (' + (line || '') + (col && ',' + col) + ')';
          }
          description += (description.length > 0 ? ':' : '') + message;
        }
      }
      self.sendException(description, fatal, success, error);
    };
  }

};

module.exports = new FIFTagHandler();
