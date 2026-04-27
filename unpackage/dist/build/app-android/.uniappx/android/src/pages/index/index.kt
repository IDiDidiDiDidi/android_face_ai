@file:Suppress("UNCHECKED_CAST", "USELESS_CAST", "INAPPLICABLE_JVM_NAME", "UNUSED_ANONYMOUS_PARAMETER", "SENSELESS_COMPARISON", "NAME_SHADOWING", "UNNECESSARY_NOT_NULL_ASSERTION")
package uni.UNID755185
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
import kotlin.properties.Delegates
import uts.sdk.modules.FaceAISearch.startFaceSearch
import uts.sdk.modules.FaceAISearch.switchCamera
import uts.sdk.modules.FaceAISearch.insertFaceSearchFeature
import uts.sdk.modules.FaceAISearch.insertManyFeatures
import uts.sdk.modules.FaceAISearch.addFaceSearchFeatureByCamera
import uts.sdk.modules.FaceAISearch.addFaceSearchFeatureByImage
import uts.sdk.modules.FaceAISearch.deleteFaceSearchFeature
import uts.sdk.modules.FaceAISearch.queryFaceSearchFeature
import uts.sdk.modules.FaceAISearch.toastMessage
import uts.sdk.modules.FaceAISearch.ResultJSON
open class GenPagesIndexIndex : BasePage {
    constructor(__ins: ComponentInternalInstance, __renderer: String?) : super(__ins, __renderer) {
        onLoad(fun(_: OnLoadOptions) {}, __ins)
    }
    @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
    override fun `$render`(): Any? {
        val _ctx = this
        val _cache = this.`$`.renderCache
        return _cE("view", null, _uA(
            _cE("button", _uM("class" to "gray-button", "onClick" to _ctx.startFaceSearchDemo), "1:N人脸搜索识别", 8, _uA(
                "onClick"
            )),
            _cE("button", _uM("class" to "gray-button", "onClick" to _ctx.addFaceSearchFeatureByCameraDemo), "SDK相机录入人脸信息", 8, _uA(
                "onClick"
            )),
            _cE("button", _uM("class" to "gray-button", "onClick" to _ctx.addFaceSearchFeatureByImageDemo), "通过图片录入人脸信息", 8, _uA(
                "onClick"
            )),
            _cE("button", _uM("class" to "gray-button", "onClick" to _ctx.deleteFaceSearchFeatureDemo), "删除人脸搜索特征值", 8, _uA(
                "onClick"
            )),
            _cE("button", _uM("class" to "gray-button", "onClick" to _ctx.queryFaceSearchFeatureDemo), "查询人脸搜索特征值", 8, _uA(
                "onClick"
            )),
            _cE("button", _uM("class" to "gray-button", "onClick" to _ctx.insertFaceSearchFeatureDemo), "同步人脸搜索特征值", 8, _uA(
                "onClick"
            )),
            _cE("button", _uM("class" to "gray-button", "onClick" to _ctx.insertManyFaceFeatureSDemo), "批量同步人脸搜索特征值", 8, _uA(
                "onClick"
            )),
            _cE("button", _uM("class" to "gray-button", "onClick" to _ctx.switchCameraDemo), "切换前后摄像头", 8, _uA(
                "onClick"
            )),
            _cE("view", _uM("class" to "result-box"), _uA(
                _cE("view", null, " Email: FaceAISDK.Service@gmail.com"),
                _cE("scroll-view", _uM("scroll-y" to "true", "class" to "scroll-view-box"), _uA(
                    _cE("text", _uM("class" to "text-content"), _tD(_ctx.faceSearchResult), 1)
                ))
            ))
        ))
    }
    open var faceID: String by `$data`
    open var faceFeature: String by `$data`
    open var faceSearchResult: String by `$data`
    open var base64FaceImage: String by `$data`
    @Suppress("USELESS_CAST")
    override fun data(): Map<String, Any?> {
        return _uM("faceID" to "Test", "faceFeature" to "faceFeature is a string with lenth 1024", "faceSearchResult" to "faceSearchResult", "base64FaceImage" to uni.UNID755185.base64FaceImage as String)
    }
    open var startFaceSearchDemo = ::gen_startFaceSearchDemo_fn
    open fun gen_startFaceSearchDemo_fn() {
        val threshold: Number = 0.85
        val oneTime = false
        val searchTimeOut: Number = 5
        val highRes = false
        val searchOne = true
        startFaceSearch(threshold, oneTime, searchTimeOut, highRes, searchOne, fun(jsonStr: String){
            try {
                val root = JSON.parse(jsonStr) as UTSJSONObject
                val results = root.getArray<UTSJSONObject>("data")
                console.log("收到搜索结果:", results)
                this.faceSearchResult = "【人脸搜索回调】\n " + JSON.stringify(results)
                val base64 = root.getString("base64") ?: ""
                val liveness = root.getNumber("liveness")
                if (results != null && results.length > 0) {
                    val firstFace = results[0]
                    val name = firstFace.getString("faceName")
                    val score = firstFace.getNumber("faceScore")
                    if (name != null && searchOne) {
                        toastMessage(base64, "最匹配:" + name + "," + score)
                    }
                } else {
                    if (searchOne) {
                        toastMessage("", "无结果")
                    }
                }
            }
             catch (e: Throwable) {
                console.error("解析数据失败:", e)
            }
        }
        )
    }
    open var addFaceSearchFeatureByCameraDemo = ::gen_addFaceSearchFeatureByCameraDemo_fn
    open fun gen_addFaceSearchFeatureByCameraDemo_fn() {
        addFaceSearchFeatureByCamera(this.faceID, 1, true, fun(result: ResultJSON){
            console.log("result:", result)
            this.faceSearchResult = JSON.stringify(result, _uA(
                "code",
                "msg",
                "faceBase64"
            ), 4)
        }
        )
    }
    open var addFaceSearchFeatureByImageDemo = ::gen_addFaceSearchFeatureByImageDemo_fn
    open fun gen_addFaceSearchFeatureByImageDemo_fn() {
        addFaceSearchFeatureByImage(this.faceID, this.base64FaceImage, fun(result: ResultJSON){
            console.log("result:", result)
            this.faceSearchResult = JSON.stringify(result, _uA(
                "code",
                "msg",
                "faceBase64"
            ), 4)
        }
        )
    }
    open var deleteFaceSearchFeatureDemo = ::gen_deleteFaceSearchFeatureDemo_fn
    open fun gen_deleteFaceSearchFeatureDemo_fn() {
        deleteFaceSearchFeature(this.faceID, fun(result: ResultJSON){
            this.faceSearchResult = JSON.stringify(result)
        }
        )
    }
    open var queryFaceSearchFeatureDemo = ::gen_queryFaceSearchFeatureDemo_fn
    open fun gen_queryFaceSearchFeatureDemo_fn() {
        queryFaceSearchFeature(this.faceID, fun(result: String){
            this.faceSearchResult = "【人脸查询回调】\n" + result
        }
        )
    }
    open var insertFaceSearchFeatureDemo = ::gen_insertFaceSearchFeatureDemo_fn
    open fun gen_insertFaceSearchFeatureDemo_fn() {
        insertFaceSearchFeature(this.faceID, this.faceFeature, "tag", "group", fun(result: ResultJSON){
            this.faceSearchResult = JSON.stringify(result)
        }
        )
    }
    open var insertManyFaceFeatureSDemo = ::gen_insertManyFaceFeatureSDemo_fn
    open fun gen_insertManyFaceFeatureSDemo_fn() {
        insertManyFeatures(JSON_FACE_FEATURES_DATA, fun(result: ResultJSON){
            this.faceSearchResult = JSON.stringify(result)
        }
        )
    }
    open var switchCameraDemo = ::gen_switchCameraDemo_fn
    open fun gen_switchCameraDemo_fn() {
        switchCamera(0)
    }
    companion object {
        val styles: Map<String, Map<String, Map<String, Any>>> by lazy {
            _nCS(_uA(
                styles0
            ))
        }
        val styles0: Map<String, Map<String, Map<String, Any>>>
            get() {
                return _uM("result-box" to _pS(_uM("marginTop" to "20rpx", "marginRight" to "20rpx", "marginBottom" to "20rpx", "marginLeft" to "20rpx")), "scroll-view-box" to _pS(_uM("height" to "400rpx", "borderTopWidth" to 1, "borderRightWidth" to 1, "borderBottomWidth" to 1, "borderLeftWidth" to 1, "borderTopStyle" to "solid", "borderRightStyle" to "solid", "borderBottomStyle" to "solid", "borderLeftStyle" to "solid", "borderTopColor" to "#cccccc", "borderRightColor" to "#cccccc", "borderBottomColor" to "#cccccc", "borderLeftColor" to "#cccccc", "borderTopLeftRadius" to "10rpx", "borderTopRightRadius" to "10rpx", "borderBottomRightRadius" to "10rpx", "borderBottomLeftRadius" to "10rpx", "backgroundColor" to "#f8f8f8", "paddingTop" to "15rpx", "paddingRight" to "15rpx", "paddingBottom" to "15rpx", "paddingLeft" to "15rpx", "boxSizing" to "border-box")), "text-content" to _pS(_uM("fontSize" to "28rpx", "color" to "#333333", "whiteSpace" to "pre-wrap")), "gray-button" to _pS(_uM("backgroundColor" to "#ffffff", "color" to "#800080", "borderTopWidth" to "medium", "borderRightWidth" to "medium", "borderBottomWidth" to "medium", "borderLeftWidth" to "medium", "borderTopStyle" to "none", "borderRightStyle" to "none", "borderBottomStyle" to "none", "borderLeftStyle" to "none", "borderTopColor" to "#000000", "borderRightColor" to "#000000", "borderBottomColor" to "#000000", "borderLeftColor" to "#000000")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
