package com.sathya_sai_grama

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.ContentResolver
import android.media.AudioAttributes
import android.net.Uri
import android.os.Build
import android.os.Bundle
import androidx.core.app.NotificationCompat
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint

class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String = "sathya_sai_grama"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, DefaultNewArchitectureEntryPoint.fabricEnabled)

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    // Create notification channels if Android version is Oreo (API 26) or higher
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val notificationChannel1 = NotificationChannel(
        "sound_channel",
        "Sathya Sai Grama Notifications",
        NotificationManager.IMPORTANCE_HIGH
      ).apply {
        description = "Channel for sound notifications"
        setShowBadge(true)
        val audioAttributes = AudioAttributes.Builder()
          .setUsage(AudioAttributes.USAGE_NOTIFICATION)
          .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
          .build()
        setSound(Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + packageName + "/raw/hello"), audioAttributes)
        enableVibration(true)
        vibrationPattern = longArrayOf(400, 400)
        lockscreenVisibility = NotificationCompat.VISIBILITY_PUBLIC
      }

      val notificationChannel2 = NotificationChannel(
        "sound_channel2",
        "Sathya Sai Grama Custom Sound Channel",
        NotificationManager.IMPORTANCE_HIGH
      ).apply {
        description = "Custom sound channel"
        setShowBadge(true)
        val audioAttributes = AudioAttributes.Builder()
          .setUsage(AudioAttributes.USAGE_NOTIFICATION)
          .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
          .build()
        setSound(Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + packageName + "/raw/hello"), audioAttributes)
        enableVibration(true)
        vibrationPattern = longArrayOf(400, 400)
        lockscreenVisibility = NotificationCompat.VISIBILITY_PUBLIC
      }

      val manager = getSystemService(NotificationManager::class.java)
      manager?.createNotificationChannel(notificationChannel1)
      manager?.createNotificationChannel(notificationChannel2)
    }
  }
}
