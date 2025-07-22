package com.tabu2.app;

import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.firebase.messaging.FirebaseMessaging;

@CapacitorPlugin(name = "FCMPlugin")
public class FCMPlugin extends Plugin {
    private static final String TAG = "FCMPlugin";

    @PluginMethod
    public void getToken(PluginCall call) {
        FirebaseMessaging.getInstance().getToken()
                .addOnCompleteListener(task -> {
                    if (!task.isSuccessful()) {
                        Log.e(TAG, "Exception getting FCM token", task.getException());
                        call.reject("Failed to get token: " + task.getException().getMessage());
                        return;
                    }

                    String token = task.getResult();
                    Log.d(TAG, "FCM Token: " + token);

                    JSObject ret = new JSObject();
                    ret.put("token", token);
                    call.resolve(ret);
                });
    }
}
