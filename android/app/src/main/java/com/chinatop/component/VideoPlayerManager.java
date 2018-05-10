package com.chinatop.component;


import android.view.View;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;


public class VideoPlayerManager extends SimpleViewManager<View> {


    @Override
    public String getName() {
        return "VideoPlayer";
    }

    @Override
    protected View createViewInstance(ThemedReactContext reactContext) {


        return new View(reactContext);
    }

    @ReactProp(name = "src")
    public void setSrc(View player, String src) {

    }

    @ReactProp(name = "cover")
    public void setThumb(View player, String cover) {

    }


}
