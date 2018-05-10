package com.chinatop;

import android.app.Application;

import com.chinatop.component.VideoPlayerPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.react.ReactApplication;
import com.reactnative.photoview.PhotoViewPackage;
import com.greatdroid.reactnative.media.MediaKitPackage;
import com.merryjs.PhotoViewer.MerryPhotoViewPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.merryjs.PhotoViewer.MerryPhotoViewPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.reactnative.ivpusic.imagepicker.PickerPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
            new PhotoViewPackage(),
            new MediaKitPackage(),
            new MerryPhotoViewPackage(),
                    new MerryPhotoViewPackage(),
                    new LinearGradientPackage(),
                    new VectorIconsPackage(),
                    new ReactVideoPackage(),
                    new PickerPackage(),
                    new FastImageViewPackage(),
                    new RNDeviceInfo(),
                    new VideoPlayerPackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
        Fresco.initialize(this);
    }

}
