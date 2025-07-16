package com.tabu2.app.plugins;

import android.content.Intent;
import android.net.Uri;
import android.provider.AlarmClock;
import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "AndroidTimer")
public class AndroidTimerPlugin extends Plugin {

    private static final String TAG = "AndroidTimerPlugin";

    @PluginMethod
    public void startTimer(PluginCall call) {
        int durationSeconds = call.getInt("durationSeconds", 60);
        String message = call.getString("message", "Laundry Timer");
        boolean skipUI = call.getBoolean("skipUI", false);

        try {
            Intent timerIntent = new Intent(AlarmClock.ACTION_SET_TIMER);
            timerIntent.putExtra(AlarmClock.EXTRA_LENGTH, durationSeconds);
            timerIntent.putExtra(AlarmClock.EXTRA_MESSAGE, message);
            timerIntent.putExtra(AlarmClock.EXTRA_SKIP_UI, skipUI);

            if (timerIntent.resolveActivity(getContext().getPackageManager()) != null) {
                getActivity().startActivity(timerIntent);
                
                JSObject result = new JSObject();
                result.put("success", true);
                result.put("message", "Timer started successfully");
                call.resolve(result);
            } else {
                // Fallback: Open clock app
                openClockApp(call);
            }
        } catch (Exception e) {
            Log.e(TAG, "Error starting timer: " + e.getMessage());
            
            JSObject result = new JSObject();
            result.put("success", false);
            result.put("error", e.getMessage());
            call.reject("Failed to start timer", e);
        }
    }

    @PluginMethod
    public void openClockApp(PluginCall call) {
        try {
            // Try Google Clock first
            Intent clockIntent = getContext().getPackageManager()
                    .getLaunchIntentForPackage("com.google.android.deskclock");
            
            if (clockIntent == null) {
                // Try Samsung Clock
                clockIntent = getContext().getPackageManager()
                        .getLaunchIntentForPackage("com.sec.android.app.clockpackage");
            }
            
            if (clockIntent == null) {
                // Generic approach - show alarms
                clockIntent = new Intent(AlarmClock.ACTION_SHOW_ALARMS);
            }

            if (clockIntent.resolveActivity(getContext().getPackageManager()) != null) {
                getActivity().startActivity(clockIntent);
                
                JSObject result = new JSObject();
                result.put("success", true);
                result.put("message", "Clock app opened");
                call.resolve(result);
            } else {
                JSObject result = new JSObject();
                result.put("success", false);
                result.put("error", "No clock app found");
                call.reject("No clock app available");
            }
        } catch (Exception e) {
            Log.e(TAG, "Error opening clock app: " + e.getMessage());
            
            JSObject result = new JSObject();
            result.put("success", false);
            result.put("error", e.getMessage());
            call.reject("Failed to open clock app", e);
        }
    }

    @PluginMethod
    public void openTimersPage(PluginCall call) {
        try {
            Intent timerIntent = new Intent(AlarmClock.ACTION_SHOW_TIMERS);
            
            if (timerIntent.resolveActivity(getContext().getPackageManager()) != null) {
                getActivity().startActivity(timerIntent);
                
                JSObject result = new JSObject();
                result.put("success", true);
                result.put("message", "Timers page opened");
                call.resolve(result);
            } else {
                // Fallback to general alarms
                Intent alarmsIntent = new Intent(AlarmClock.ACTION_SHOW_ALARMS);
                getActivity().startActivity(alarmsIntent);
                
                JSObject result = new JSObject();
                result.put("success", true);
                result.put("message", "Alarms page opened (fallback)");
                call.resolve(result);
            }
        } catch (Exception e) {
            Log.e(TAG, "Error opening timers page: " + e.getMessage());
            
            JSObject result = new JSObject();
            result.put("success", false);
            result.put("error", e.getMessage());
            call.reject("Failed to open timers page", e);
        }
    }

    @PluginMethod
    public void setAlarm(PluginCall call) {
        int hour = call.getInt("hour", 8);
        int minutes = call.getInt("minutes", 0);
        String message = call.getString("message", "Laundry Reminder");
        boolean skipUI = call.getBoolean("skipUI", false);

        try {
            Intent alarmIntent = new Intent(AlarmClock.ACTION_SET_ALARM);
            alarmIntent.putExtra(AlarmClock.EXTRA_HOUR, hour);
            alarmIntent.putExtra(AlarmClock.EXTRA_MINUTES, minutes);
            alarmIntent.putExtra(AlarmClock.EXTRA_MESSAGE, message);
            alarmIntent.putExtra(AlarmClock.EXTRA_SKIP_UI, skipUI);

            if (alarmIntent.resolveActivity(getContext().getPackageManager()) != null) {
                getActivity().startActivity(alarmIntent);
                
                JSObject result = new JSObject();
                result.put("success", true);
                result.put("message", "Alarm set successfully");
                call.resolve(result);
            } else {
                JSObject result = new JSObject();
                result.put("success", false);
                result.put("error", "No alarm app found");
                call.reject("No alarm app available");
            }
        } catch (Exception e) {
            Log.e(TAG, "Error setting alarm: " + e.getMessage());
            
            JSObject result = new JSObject();
            result.put("success", false);
            result.put("error", e.getMessage());
            call.reject("Failed to set alarm", e);
        }
    }
}
