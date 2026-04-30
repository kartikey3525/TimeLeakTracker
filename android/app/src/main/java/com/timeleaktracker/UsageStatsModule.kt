package com.timeleaktracker

import android.app.usage.UsageStats
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.provider.Settings
import com.facebook.react.bridge.*
import java.util.*
import android.app.AppOpsManager
import android.os.Process

class UsageStatsModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "UsageStatsModule"
    }

    // ✅ OPEN USAGE ACCESS SCREEN
    @ReactMethod
    fun openUsageAccessSettings() {
        val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        reactApplicationContext.startActivity(intent)
    }

    // ✅ CHECK PERMISSION PROPERLY
    @ReactMethod
    fun hasUsagePermission(promise: Promise) {
        try {
            val appOps =
                reactApplicationContext.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager

            val mode = appOps.checkOpNoThrow(
                AppOpsManager.OPSTR_GET_USAGE_STATS,
                Process.myUid(),
                reactApplicationContext.packageName
            )

            val granted = mode == AppOpsManager.MODE_ALLOWED
            promise.resolve(granted)

        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    // ✅ GET USAGE DATA
    @ReactMethod
    fun getUsageStats(interval: String, promise: Promise) {
        try {
            val context = reactApplicationContext
            val usageStatsManager =
                context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

            val calendar = Calendar.getInstance()
            val endTime = calendar.timeInMillis

            when (interval) {
                "today" -> {
                    calendar.set(Calendar.HOUR_OF_DAY, 0)
                    calendar.set(Calendar.MINUTE, 0)
                    calendar.set(Calendar.SECOND, 0)
                }

                "yesterday" -> {
                    calendar.add(Calendar.DAY_OF_YEAR, -1)
                    calendar.set(Calendar.HOUR_OF_DAY, 0)
                    calendar.set(Calendar.MINUTE, 0)
                    calendar.set(Calendar.SECOND, 0)
                }

                else -> {
                    promise.reject("INVALID_INTERVAL", "Invalid interval")
                    return
                }
            }

            val startTime = calendar.timeInMillis

            val stats: List<UsageStats> =
                usageStatsManager.queryUsageStats(
                    UsageStatsManager.INTERVAL_DAILY,
                    startTime,
                    endTime
                )

            val result = Arguments.createArray()

            for (usage in stats) {
                if (usage.totalTimeInForeground > 0) {
                    val map = Arguments.createMap()
                    map.putString("packageName", usage.packageName)
                    map.putDouble("totalTime", usage.totalTimeInForeground.toDouble())
                    result.pushMap(map)
                }
            }

            promise.resolve(result)

        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }
}