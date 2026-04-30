package com.timeleaktracker

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative

// ✅ IMPORT YOUR PACKAGE
import com.timeleaktracker.UsageStatsPackage

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList = PackageList(this).packages.apply {
        // ✅ FIXED LINE
        add(UsageStatsPackage())
      }
    )
  }

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)
  }
}