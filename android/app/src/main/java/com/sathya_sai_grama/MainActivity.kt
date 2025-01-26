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
            val manager = getSystemService(NotificationManager::class.java)

            // Channel for Pre-Approved Registration Notifications
            val preApprovedChannel = NotificationChannel(
                "pre_approved_sound_channel", // Channel ID
                "Pre-Approved Visitor Notifications", // Channel Name
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Notifications for visitors with pre-approved registration"
                setShowBadge(true)
                val audioAttributes = AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                    .build()
                setSound(
                    Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + packageName + "/raw/pre_approved_sound"),
                    audioAttributes
                )
                enableVibration(true)
                vibrationPattern = longArrayOf(400, 400)
                lockscreenVisibility = NotificationCompat.VISIBILITY_PUBLIC
            }

            // Channel for Spot Registration Notifications
            val spotRegistrationChannel = NotificationChannel(
                "spot_sound_channel", // Channel ID
                "Spot Registration Notifications", // Channel Name
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Notifications for visitors with spot registration"
                setShowBadge(true)
                val audioAttributes = AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                    .build()
                setSound(
                    Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + packageName + "/raw/spot_sound"),
                    audioAttributes
                )
                enableVibration(true)
                vibrationPattern = longArrayOf(400, 400)
                lockscreenVisibility = NotificationCompat.VISIBILITY_PUBLIC
            }

            // Register channels with the NotificationManager
            manager?.createNotificationChannel(preApprovedChannel)
            manager?.createNotificationChannel(spotRegistrationChannel)
        } else {
            println("Running on pre-Oreo device; fallback to 'hello.wav' sound.")
        }
    }
}
