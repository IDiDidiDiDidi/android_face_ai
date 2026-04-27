@file:Suppress("UNCHECKED_CAST", "USELESS_CAST", "INAPPLICABLE_JVM_NAME", "UNUSED_ANONYMOUS_PARAMETER", "SENSELESS_COMPARISON", "NAME_SHADOWING", "UNNECESSARY_NOT_NULL_ASSERTION")
package uts.sdk.modules.FaceAISearch
import android.app.Activity
import android.app.Application
import android.content.Intent
import com.ai.face.faceSearch.search.FaceSearchFeatureManger
import com.faceAI.demo.FaceSDKConfig
import com.faceAI.demo.SysCamera.addFace.AddFaceFeatureActivity
import com.faceAI.demo.base.utils.BitmapUtils
import com.google.gson.Gson
import io.dcloud.uniapp.*
import io.dcloud.uniapp.extapi.*
import io.dcloud.uniapp.framework.*
import io.dcloud.uniapp.runtime.*
import io.dcloud.uniapp.vue.*
import io.dcloud.uniapp.vue.shared.*
import io.dcloud.uts.*
import io.dcloud.uts.Map
import io.dcloud.uts.Set
import io.dcloud.uts.UTSAndroid
import java.lang.System
import kotlin.properties.Delegates
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Deferred
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
import uts.sdk.modules.uniFaceAISDK.FaceAISDKNative
import uts.sdk.modules.uniFaceAISDK.FaceResultManager
import uts.sdk.modules.uniFaceAISDK.FaceSearchActivity
import uts.sdk.modules.uniFaceAISDK.R
open class ResultJSON (
    @JsonNotNull
    open var code: Number,
    @JsonNotNull
    open var msg: String,
    @JsonNotNull
    open var faceFeature: String,
    @JsonNotNull
    open var faceBase64: String,
) : UTSObject()
fun startFaceSearch(searchThreshold: Number, searchOneTime: Boolean, searchTimeOut: Number, isCameraSizeHigh: Boolean, searchOne: Boolean, callback: (jsonResult: String) -> Unit): Unit {
    FaceResultManager.setCallback(fun(json: String, liveness: Number, base64: String){
        val finalJson = "{\"data\":" + json + ",\"liveness\":" + liveness + ",\"base64\":\"" + base64 + "\"}"
        try {
            callback(finalJson)
        }
         catch (e: Throwable) {
            console.error("FaceAI Callback Error:", e)
        }
    }
    )
    UTSAndroid.getUniActivity()!!.runOnUiThread(fun(){
        val context = UTSAndroid.getUniActivity() as Activity
        FaceSDKConfig.init(context)
        val intent = Intent(context, FaceSearchActivity().javaClass)
        intent.putExtra("THRESHOLD_KEY", searchThreshold)
        intent.putExtra("SEARCH_ONE_TIME", searchOneTime)
        intent.putExtra("SEARCH_TIME_OUT", searchTimeOut)
        intent.putExtra("IS_CAMERA_SIZE_HIGH", isCameraSizeHigh)
        intent.putExtra("SEARCH_ONE", searchOne)
        context.startActivity(intent)
    }
    )
}
fun toastMessage(base64Image: String, message: String): Unit {
    UTSAndroid.getUniActivity()!!.runOnUiThread(fun(){
        val context = UTSAndroid.getUniActivity() as Activity
        FaceAISDKNative.toastMessage(context, base64Image, message)
    }
    )
}
fun switchCamera(cameraID: Number): Unit {
    val context = UTSAndroid.getAppContext() as Application
    FaceSDKConfig.init(context)
    FaceSDKConfig.setCameraID(context, cameraID.toInt())
}
fun insertFaceSearchFeature(faceID: String, faceFeature: String, tag: String, group: String, callback: (result: ResultJSON) -> Unit): Unit {
    val context = UTSAndroid.getAppContext() as Application
    FaceSDKConfig.init(context)
    if (faceID == "") {
        callback(ResultJSON(code = -1, msg = "参数错误: faceID 不能为空", faceFeature = "", faceBase64 = ""))
        return
    }
    if (faceFeature == "" || faceFeature.length != 1024) {
        val currentLen = faceFeature.length
        callback(ResultJSON(code = -2, msg = "参数错误: faceFeature 长度必须为 1024 (当前: " + currentLen + ")", faceFeature = "", faceBase64 = ""))
        return
    }
    try {
        val safeTag = if (tag == "") {
            ""
        } else {
            tag
        }
        val safeGroup = if (group == "") {
            ""
        } else {
            group
        }
        FaceSearchFeatureManger.getInstance(context).insertFaceFeature(faceID, faceFeature, System.currentTimeMillis(), safeTag, safeGroup)
        callback(ResultJSON(code = 1, msg = "success", faceFeature = "", faceBase64 = ""))
    }
     catch (e: Throwable) {
        callback(ResultJSON(code = -3, msg = "Native 执行异常", faceFeature = "", faceBase64 = ""))
    }
}
fun insertManyFeatures(jsonFaceFeatures: String, callback: (result: ResultJSON) -> Unit): Unit {
    val context = UTSAndroid.getAppContext() as Application
    FaceSDKConfig.init(context)
    var faceCount = FaceSearchFeatureManger.getInstance(context).insertFeatures(jsonFaceFeatures)
    callback(ResultJSON(code = faceCount, msg = "code值为有效同步数据量", faceFeature = "", faceBase64 = "-"))
}
fun deleteFaceSearchFeature(faceID: String, callback: (result: ResultJSON) -> Unit): Unit {
    val context = UTSAndroid.getAppContext() as Application
    FaceSDKConfig.init(context)
    FaceSearchFeatureManger.getInstance(context).deleteFaceFaceFeature(faceID)
    callback(ResultJSON(code = 1, msg = "delete success", faceFeature = "", faceBase64 = ""))
}
fun queryFaceSearchFeature(faceID: String, callback: (jsonResult: String) -> Unit): Unit {
    val context = UTSAndroid.getAppContext() as Application
    FaceSDKConfig.init(context)
    try {
        val manager = FaceSearchFeatureManger.getInstance(context)
        var nativeResult: Any? = null
        if (faceID == "") {
            nativeResult = manager.queryAllFaceFaceFeature()
        } else {
            nativeResult = manager.queryFaceFeatureByID(faceID)
        }
        var jsonString = "[]"
        if (nativeResult != null) {
            jsonString = Gson().toJson(nativeResult)
        }
        callback(jsonString)
    }
     catch (e: Throwable) {
        callback("[]")
    }
}
fun addFaceSearchFeatureByImage(faceID: String, base64FaceImage: String, callback: (result: ResultJSON) -> Unit): Unit {
    val context = UTSAndroid.getUniActivity() as Activity
    FaceSDKConfig.init(context)
    FaceAISDKNative.getFaceFeatureByImageNative(context, faceID, base64FaceImage, fun(result: UTSJSONObject){
        callback(ResultJSON(code = (result.getNumber("code") ?: -1) as Number, msg = result.getString("msg") ?: "", faceFeature = result.getString("faceFeature") ?: "", faceBase64 = ""))
    }
    )
}
fun addFaceSearchFeatureByCamera(faceID: String, addFacePerformanceMode: Number, needShowConfirmDialog: Boolean, callback: (result: ResultJSON) -> Unit): Unit {
    UTSAndroid.getUniActivity()!!.runOnUiThread(fun(){
        val context = UTSAndroid.getUniActivity() as Activity
        FaceSDKConfig.init(context)
        val intent = Intent(context, AddFaceFeatureActivity().javaClass)
        intent.putExtra("ADD_FACE_IMAGE_TYPE_KEY", "FACE_SEARCH")
        intent.putExtra("ADD_FACE_PERFORMANCE_MODE", addFacePerformanceMode)
        intent.putExtra("USER_FACE_ID_KEY", faceID)
        intent.putExtra("NEED_CONFIRM_ADD_FACE", needShowConfirmDialog)
        context.startActivityForResult(intent, 10086)
    }
    )
    UTSAndroid.onAppActivityResult(fun(requestCode: Int, resultCode: Int, intentAct: Intent?){
        if (requestCode == 10086) {
            if (intentAct != null) {
                val codeNow = intentAct.getIntExtra("code", 0)
                val rawMsg = intentAct.getStringExtra("msg")
                val msgNow = if ((rawMsg == null)) {
                    ""
                } else {
                    rawMsg
                }
                var faceBase64 = ""
                var faceFeature = ""
                if (0 != codeNow) {
                    faceBase64 = BitmapUtils.bitmapToBase64(FaceSDKConfig.CACHE_SEARCH_FACE_DIR + faceID)
                    faceFeature = intentAct.getStringExtra("faceFeature") ?: ""
                }
                callback(ResultJSON(code = codeNow, msg = msgNow, faceFeature = faceFeature, faceBase64 = faceBase64))
            } else {
                callback(ResultJSON(code = -1, msg = "添加失败", faceFeature = "", faceBase64 = ""))
            }
        }
    }
    )
}
