@file:Suppress("UNCHECKED_CAST", "USELESS_CAST", "INAPPLICABLE_JVM_NAME", "UNUSED_ANONYMOUS_PARAMETER", "SENSELESS_COMPARISON", "NAME_SHADOWING", "UNNECESSARY_NOT_NULL_ASSERTION")
package uni.UNID755185
import io.dcloud.uniapp.*
import io.dcloud.uniapp.extapi.*
import io.dcloud.uniapp.framework.*
import io.dcloud.uniapp.runtime.*
import io.dcloud.uniapp.vue.*
import io.dcloud.uniapp.vue.shared.*
import io.dcloud.unicloud.*
import io.dcloud.uts.*
import io.dcloud.uts.Map
import io.dcloud.uts.Set
import io.dcloud.uts.UTSAndroid
import kotlin.properties.Delegates
open class GenPagesPhotoListIndex : BasePage {
    constructor(__ins: ComponentInternalInstance, __renderer: String?) : super(__ins, __renderer) {
        onPageShow(fun() {
            this.loadPhotoRecords()
        }
        , __ins)
    }
    @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
    override fun `$render`(): Any? {
        val _ctx = this
        val _cache = this.`$`.renderCache
        return _cE("view", _uM("class" to "page"), _uA(
            _cE("scroll-view", _uM("scroll-y" to "true", "class" to "scroll-view"), _uA(
                if (_ctx.photoRecords.length == 0) {
                    _cE("view", _uM("key" to 0, "class" to "empty-box"), _uA(
                        _cE("text", _uM("class" to "empty-title"), "还没有识别抓拍照片"),
                        _cE("text", _uM("class" to "empty-desc"), "开始 1:N 人脸识别后，抓拍照片会自动保存在这里。")
                    ))
                } else {
                    _cC("v-if", true)
                }
                ,
                _cE(Fragment, null, RenderHelpers.renderList(_ctx.photoRecords, fun(item, __key, __index, _cached): Any {
                    return _cE("view", _uM("key" to item.id, "class" to "photo-card"), _uA(
                        _cE("image", _uM("class" to "photo-image", "src" to _ctx.getImageSrc(item), "mode" to "widthFix"), null, 8, _uA(
                            "src"
                        )),
                        _cE("view", _uM("class" to "photo-meta"), _uA(
                            _cE("text", _uM("class" to "photo-status"), _tD(if (item.matched) {
                                "匹配成功"
                            } else {
                                "未匹配到结果"
                            }
                            ), 1),
                            _cE("text", _uM("class" to "photo-time"), _tD(_ctx.formatTime(item.createdAt)), 1),
                            _cE("text", _uM("class" to "photo-name"), _tD(_ctx.getFaceNameText(item)), 1),
                            _cE("text", _uM("class" to "photo-score"), _tD(_ctx.getFaceScoreText(item)), 1)
                        ))
                    ))
                }
                ), 128)
            ))
        ))
    }
    open var photoRecords: UTSArray<FacePhotoRecord> by `$data`
    @Suppress("USELESS_CAST")
    override fun data(): Map<String, Any?> {
        return _uM("photoRecords" to _uA<FacePhotoRecord>())
    }
    open var loadPhotoRecords = ::gen_loadPhotoRecords_fn
    open fun gen_loadPhotoRecords_fn() {
        this.photoRecords = getAllFacePhotoRecords()
    }
    open var formatTime = ::gen_formatTime_fn
    open fun gen_formatTime_fn(timestamp: Number): String {
        val date = Date(timestamp)
        val year = date.getFullYear()
        val month = ("" + (date.getMonth() + 1)).padStart(2, "0")
        val day = ("" + date.getDate()).padStart(2, "0")
        val hour = ("" + date.getHours()).padStart(2, "0")
        val minute = ("" + date.getMinutes()).padStart(2, "0")
        val second = ("" + date.getSeconds()).padStart(2, "0")
        return "" + year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second
    }
    open var getFaceNameText = ::gen_getFaceNameText_fn
    open fun gen_getFaceNameText_fn(item: FacePhotoRecord): String {
        if (item.faceName.length > 0) {
            return "\u59d3\u540d\uff1a" + item.faceName
        }
        return "\u59d3\u540d\uff1a\u65e0"
    }
    open var getFaceScoreText = ::gen_getFaceScoreText_fn
    open fun gen_getFaceScoreText_fn(item: FacePhotoRecord): String {
        if (item.matched) {
            return "\u5206\u6570\uff1a" + item.faceScore
        }
        return "\u5206\u6570\uff1a\u65e0"
    }
    open var getImageSrc = ::gen_getImageSrc_fn
    open fun gen_getImageSrc_fn(item: FacePhotoRecord): String {
        if (item.imagePath.length > 0) {
            if (item.imagePath.startsWith("file://")) {
                return item.imagePath
            }
            return "file://" + item.imagePath
        }
        return item.imageBase64
    }
    companion object {
        val styles: Map<String, Map<String, Map<String, Any>>> by lazy {
            _nCS(_uA(
                styles0
            ))
        }
        val styles0: Map<String, Map<String, Map<String, Any>>>
            get() {
                return _uM("page" to _pS(_uM("flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "backgroundColor" to "#f5f7fb")), "scroll-view" to _pS(_uM("paddingTop" to "24rpx", "paddingRight" to "24rpx", "paddingBottom" to "24rpx", "paddingLeft" to "24rpx", "boxSizing" to "border-box")), "empty-box" to _pS(_uM("marginTop" to "160rpx", "paddingTop" to "48rpx", "paddingRight" to "36rpx", "paddingBottom" to "48rpx", "paddingLeft" to "36rpx", "borderTopLeftRadius" to "24rpx", "borderTopRightRadius" to "24rpx", "borderBottomRightRadius" to "24rpx", "borderBottomLeftRadius" to "24rpx", "backgroundImage" to "linear-gradient(135deg, #ffffff 0%, #eef3ff 100%)", "backgroundColor" to "rgba(0,0,0,0)", "boxShadow" to "0 12rpx 40rpx rgba(40, 68, 120, 0.08)")), "empty-title" to _pS(_uM("fontSize" to "34rpx", "fontWeight" to "600", "color" to "#1f2a44", "marginBottom" to "16rpx")), "empty-desc" to _pS(_uM("fontSize" to "28rpx", "lineHeight" to "42rpx", "color" to "#60708f")), "photo-card" to _pS(_uM("marginBottom" to "24rpx", "borderTopLeftRadius" to "24rpx", "borderTopRightRadius" to "24rpx", "borderBottomRightRadius" to "24rpx", "borderBottomLeftRadius" to "24rpx", "overflow" to "hidden", "backgroundColor" to "#ffffff", "boxShadow" to "0 12rpx 36rpx rgba(27, 39, 79, 0.08)")), "photo-image" to _pS(_uM("width" to "100%", "backgroundColor" to "#dfe6f5")), "photo-meta" to _pS(_uM("paddingTop" to "24rpx", "paddingRight" to "24rpx", "paddingBottom" to "24rpx", "paddingLeft" to "24rpx")), "photo-status" to _pS(_uM("fontSize" to "30rpx", "lineHeight" to "42rpx", "color" to "#0f6b57", "fontWeight" to "600", "marginBottom" to "10rpx")), "photo-time" to _pS(_uM("fontSize" to "28rpx", "lineHeight" to "42rpx", "color" to "#33415c")), "photo-name" to _pS(_uM("fontSize" to "28rpx", "lineHeight" to "42rpx", "color" to "#33415c")), "photo-score" to _pS(_uM("fontSize" to "28rpx", "lineHeight" to "42rpx", "color" to "#33415c")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
