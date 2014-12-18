//
//  FIFTagHandlerPlugin
//  Fifty-five
//
//  Created by Med on 09/12/14.
//  Copyright (c) 2014 Med. All rights reserved.

package com.fiftyfive.fiftaghandler;


import com.fiftyfive.fiftaghandler.FIFTagHandler;

import android.content.Context;

import java.util.concurrent.TimeUnit;
import java.util.HashMap;
import java.util.Map;

import com.google.android.gms.common.api.PendingResult;
import com.google.android.gms.common.api.ResultCallback;
import com.google.android.gms.tagmanager.ContainerHolder;
import com.google.android.gms.tagmanager.DataLayer;
import com.google.android.gms.tagmanager.TagManager;
import com.google.android.gms.analytics.Logger.LogLevel;
import com.google.android.gms.analytics.Tracker;
import com.google.android.gms.analytics.GoogleAnalytics;

import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CallbackContext;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Collections;
import java.util.Map;
import java.util.HashMap;
import java.util.Iterator;

public class FIFTagHandlerPlugin extends CordovaPlugin {
    
    private static GoogleAnalytics ga;
    private static Tracker tracker;
    
    private static final int GA_DISPATCH_PERIOD = 10;
    
    private void initializeGa() {
        ga = GoogleAnalytics.getInstance(cordova.getActivity());
        ga.setLocalDispatchPeriod(GA_DISPATCH_PERIOD);
    }
    
    /**
     * Initializes the plugin
     *
     * @param cordova The context of the main Activity.
     * @param webView The associated CordovaWebView.
     */
    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        initializeGa();
    }
    
    /**
     * Executes the request.
     *
     * @param action          The action to execute.
     * @param args            The exec() arguments.
     * @param callbackContext The callback context used when calling back into JavaScript.
     * @return                Whether the action was valid.
     */
    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callback) throws JSONException {
        try {
            if ("setContainerId".equals(action)) {
                setContainerId(args.getString(0));
                callback.success();
                return true;
            } else if ("push".equals(action)) {
                push(objectMap(args.getJSONObject(0)));
                callback.success();
                return true;
            } 
            else if ("setTrackingId".equals(action)) {
                setTrackingId(args.getString(0));
                callback.success();
                return true;
                
            } else if ("setLogLevel".equals(action)) {
                setLogLevel(args.getInt(0));
                callback.success();
                return true;
                
            } else if ("setIDFAEnabled".equals(action)) {
                setIDFAEnabled();
                callback.success();
                return true;
                
            } else if ("get".equals(action)) {
                callback.success(get(args.getString(0)));
                return true;
                
            } else if ("set".equals(action)) {
                set(args.getString(0), args.isNull(1) ? null : args.getString(1));
                callback.success();
                return true;
                
            } else if ("send".equals(action)) {
                send(objectToMap(args.getJSONObject(0)));
                callback.success();
                return true;
                
            } else if ("close".equals(action)) {
                close();
                callback.success();
                return true;
            }
        } catch (Exception e) {
            ga.getLogger().error(e);
            callback.error(e.getMessage());
        }
        return false;
    }
    
    private void setContainerId(String containerId) {
        //Launch Tag Manager
        Context context = this.cordova.getActivity().getApplicationContext();
        final TagManager tagManager = TagManager.getInstance(context);

        // Modify the log level of the logger to print out not only
        // warning and error messages, but also verbose, debug, info messages.
        tagManager.setVerboseLoggingEnabled(true);

        //Launch FFTagHelper
        FIFTagHandler.getInstance().setTagManager(tagManager);
        FIFTagHandler.getInstance().setApplicationContext(context);


        //GTM
        PendingResult<ContainerHolder> pending =
                tagManager.loadContainerPreferNonDefault(containerId,
                        com.fiftyfive.sample.R.raw.gtm_default_container);

        pending.setResultCallback(new ResultCallback<ContainerHolder>() {
            @Override
            public void onResult(ContainerHolder containerHolder) {
                FIFTagHandler.getInstance().setContainerHolder(containerHolder);
                containerHolder.refresh();

                if (!containerHolder.getStatus().isSuccess()) {
                    return;
                }

                FIFTagHandler.getInstance().register();

                DataLayer dataLayer = FIFTagHandler.getInstance().getTagManager().getDataLayer();
                // Push Google Id
                String googleId = getGoogleUserId();
                if (googleId != null) {
                    Map<String, Object> mapGoogleId = new HashMap<String, Object>();
                    mapGoogleId.put("userGoogleId", googleId);
                    dataLayer.push(mapGoogleId);
                }

                // Push application start event
                Map<String, Object> appStartMap = new HashMap<String, Object>();
                appStartMap.put("event", "applicationStart");
                dataLayer.push(appStartMap);
            }
        }, 2, TimeUnit.SECONDS);
    }

    private String getGoogleUserId() {
        if (tracker == null) {
            tracker = ga.newTracker("UA-11111111-1");
        }

        return tracker.get("cid");
    }

    private void push(Map<String, Object> map) {
        // Fetch the datalayer
        TagManager tagManager = FIFTagHandler.getInstance().getTagManager();
        if (tagManager == null) {
            throw new IllegalStateException("FIFTagHelper not initialized. Call setContainerId.");
        }
        else {
            DataLayer dataLayer = tagManager.getDataLayer();
            dataLayer.push(map);
        }
    }

    private void setTrackingId(String trackingId) {
        if (tracker != null) {
            close();
        }
        tracker = ga.newTracker(trackingId);
        // setup uncaught exception handler
        tracker.enableExceptionReporting(true);
    }
    
    private void setLogLevel(int level) {
        int logLevel = LogLevel.WARNING;
        switch (level) {
            case 0:
                logLevel = LogLevel.VERBOSE;
                break;
            case 1:
                logLevel = LogLevel.INFO;
                break;
            case 2:
                logLevel = LogLevel.WARNING;
                break;
            case 3:
                logLevel = LogLevel.ERROR;
                break;
        }
        ga.getLogger().setLogLevel(logLevel);
    }
    
    private void setIDFAEnabled() {
        assertTracker();
        tracker.enableAdvertisingIdCollection(true);
    }
    
    private String get(String key) {
        assertTracker();
        return tracker.get(key);
    }
    
    private void set(String key, String value) {
        assertTracker();
        tracker.set(key, value);
    }
    
    private void send(Map<String,String> map) {
        assertTracker();
        tracker.send(map);
    }
    
    private void close() {
        assertTracker();
        ga.dispatchLocalHits();
        tracker = null;
    }
    
    private void assertTracker() {
        if (tracker == null) {
            throw new IllegalStateException("Tracker not initialized. Call setTrackingId prior to using tracker.");
        }
    }
    
    private Map<String, String> objectToMap(JSONObject o) throws JSONException {
        if (o.length() == 0) {
            return Collections.<String, String>emptyMap();
        }
        Map<String, String> map = new HashMap<String, String>(o.length());
        Iterator it = o.keys();
        String key, value;
        while (it.hasNext()) {
            key = it.next().toString();
            value = o.has(key) ? o.get(key).toString(): null;
            map.put(key, value);
        }
        return map;
    }
    

    private Map<String, Object> objectMap(JSONObject o) throws JSONException {
        if (o.length() == 0) {
            return Collections.<String, Object>emptyMap();
        }
        Map<String, Object> map = new HashMap<String, Object>(o.length());
        Iterator it = o.keys();
        String key;
        Object value;
        while (it.hasNext()) {
            key = it.next().toString();
            value = o.has(key) ? o.get(key): null;
            map.put(key, value);
        }
        return map;
    }
}
