package com.tabu2.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.tabu2.app.plugins.AndroidTimerPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Register our custom plugin
        registerPlugin(AndroidTimerPlugin.class);
    }
}
