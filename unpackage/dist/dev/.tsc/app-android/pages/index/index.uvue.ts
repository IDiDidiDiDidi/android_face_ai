
	import {
		startFaceSearch,
		switchCamera,
		insertFaceSearchFeature,
		insertManyFeatures,
		addFaceSearchFeatureByCamera,
		addFaceSearchFeatureByImage,
		deleteFaceSearchFeature,
		queryFaceSearchFeature,
		toastMessage,
		ResultJSON
	} from "@/uni_modules/FaceAI-Search";
	import { JSON_FACE_FEATURES_DATA } from "./faceFeatureList.uts";
	import { base64FaceImage } from './imageData.uts';
	import { saveFacePhotoRecord } from '@/pages/photo-list/photoStore.uts';

	const __sfc__ = defineComponent({
		data() {
			return {
				faceID: 'Test',
				faceFeature: 'faceFeature is a string with lenth 1024',
				faceSearchResult: 'faceSearchResult',
				base64FaceImage: base64FaceImage as string
			}
		},
		methods: {
			openPhotoList: function () {
				uni.navigateTo({
					url: '/pages/photo-list/index'
				})
			},
			saveSearchPhoto: function (base64: string, results: UTSJSONObject[] | null) {
				if (base64.length == 0) {
					return
				}

				let matched = false
				let faceName = ''
				let faceScore = 0
				if (results != null && results.length > 0) {
					matched = true
					const firstFace = results[0]
					faceName = firstFace.getString("faceName") ?? ''
					faceScore = firstFace.getNumber("faceScore") ?? 0
				}

				saveFacePhotoRecord(base64, matched, faceName, faceScore)
			},
			startFaceSearchDemo: function () {
				const threshold = 0.85
				const oneTime = false
				const searchTimeOut = 5
				const highRes = false
				const searchOne = true
				startFaceSearch(
					threshold,
					oneTime,
					searchTimeOut,
					highRes,
					searchOne,
					(jsonStr: string) => {
						try {
							const root = UTSAndroid.consoleDebugError(JSON.parse(jsonStr), " at pages/index/index.uvue:85") as UTSJSONObject
							const results = root.getArray<UTSJSONObject>("data")
							const base64 = root.getString("base64") ?? ""

							console.log("收到搜索结果:", results, " at pages/index/index.uvue:89")
							this.faceSearchResult = "【人脸搜索回调】\n" + JSON.stringify(results)
							this.saveSearchPhoto(base64, results)

							if (results != null && results.length > 0) {
								const firstFace = results[0]
								const name = firstFace.getString("faceName")
								const score = firstFace.getNumber("faceScore")

								if (name != null && searchOne) {
									toastMessage(base64, "最匹配:" + name + "," + score)
								}
							} else {
								if (searchOne) {
									toastMessage("", "无结果")
								}
							}
						} catch (e) {
							console.error("解析数据失败:", e, " at pages/index/index.uvue:107")
						}
					}
				)
			},
			addFaceSearchFeatureByCameraDemo: function () {
				addFaceSearchFeatureByCamera(
					this.faceID,
					1,
					true,
					(result: ResultJSON) => {
						console.log("result:", result, " at pages/index/index.uvue:118")
						this.faceSearchResult = JSON.stringify(result, ['code', 'msg', 'faceBase64'], 4)
					}
				)
			},
			addFaceSearchFeatureByImageDemo: function () {
				addFaceSearchFeatureByImage(
					this.faceID,
					this.base64FaceImage,
					(result: ResultJSON) => {
						console.log("result:", result, " at pages/index/index.uvue:128")
						this.faceSearchResult = JSON.stringify(result, ['code', 'msg', 'faceBase64'], 4)
					}
				)
			},
			deleteFaceSearchFeatureDemo: function () {
				deleteFaceSearchFeature(
					this.faceID,
					(result: ResultJSON) => {
						this.faceSearchResult = JSON.stringify(result)
					}
				)
			},
			queryFaceSearchFeatureDemo: function () {
				queryFaceSearchFeature(
					this.faceID,
					(result: string) => {
						this.faceSearchResult = "【人脸查询回调】\n" + result
					}
				)
			},
			insertFaceSearchFeatureDemo: function () {
				insertFaceSearchFeature(
					this.faceID,
					this.faceFeature,
					"tag",
					"group",
					(result: ResultJSON) => {
						this.faceSearchResult = JSON.stringify(result)
					}
				)
			},
			insertManyFaceFeatureSDemo: function () {
				insertManyFeatures(
					JSON_FACE_FEATURES_DATA,
					(result: ResultJSON) => {
						this.faceSearchResult = JSON.stringify(result)
					}
				)
			},
			switchCameraDemo: function () {
				switchCamera(0)
			},
		}
	})

export default __sfc__
function GenPagesIndexIndexRender(this: InstanceType<typeof __sfc__>): any | null {
const _ctx = this
const _cache = this.$.renderCache
  return _cE("view", _uM({ class: "page" }), [
    _cE("button", _uM({
      class: "gray-button",
      onClick: _ctx.startFaceSearchDemo
    }), "1:N人脸搜索识别", 8 /* PROPS */, ["onClick"]),
    _cE("button", _uM({
      class: "gray-button",
      onClick: _ctx.openPhotoList
    }), "查看所有照片", 8 /* PROPS */, ["onClick"]),
    _cE("button", _uM({
      class: "gray-button",
      onClick: _ctx.addFaceSearchFeatureByCameraDemo
    }), "SDK相机录入人脸信息", 8 /* PROPS */, ["onClick"]),
    _cE("button", _uM({
      class: "gray-button",
      onClick: _ctx.addFaceSearchFeatureByImageDemo
    }), "通过图片录入人脸信息", 8 /* PROPS */, ["onClick"]),
    _cE("button", _uM({
      class: "gray-button",
      onClick: _ctx.deleteFaceSearchFeatureDemo
    }), "删除人脸搜索特征值", 8 /* PROPS */, ["onClick"]),
    _cE("button", _uM({
      class: "gray-button",
      onClick: _ctx.queryFaceSearchFeatureDemo
    }), "查询人脸搜索特征值", 8 /* PROPS */, ["onClick"]),
    _cE("button", _uM({
      class: "gray-button",
      onClick: _ctx.insertFaceSearchFeatureDemo
    }), "同步人脸搜索特征值", 8 /* PROPS */, ["onClick"]),
    _cE("button", _uM({
      class: "gray-button",
      onClick: _ctx.insertManyFaceFeatureSDemo
    }), "批量同步人脸搜索特征值", 8 /* PROPS */, ["onClick"]),
    _cE("button", _uM({
      class: "gray-button",
      onClick: _ctx.switchCameraDemo
    }), "切换前后摄像头", 8 /* PROPS */, ["onClick"]),
    _cE("view", _uM({ class: "result-box" }), [
      _cE("view", _uM({ class: "contact-text" }), "Email: FaceAISDK.Service@gmail.com"),
      _cE("scroll-view", _uM({
        "scroll-y": "true",
        class: "scroll-view-box"
      }), [
        _cE("text", _uM({ class: "text-content" }), _tD(_ctx.faceSearchResult), 1 /* TEXT */)
      ])
    ])
  ])
}
const GenPagesIndexIndexStyles = [_uM([["page", _pS(_uM([["paddingBottom", "30rpx"]]))], ["result-box", _pS(_uM([["marginTop", "20rpx"], ["marginRight", "20rpx"], ["marginBottom", "20rpx"], ["marginLeft", "20rpx"]]))], ["contact-text", _pS(_uM([["fontSize", "28rpx"], ["color", "#475569"], ["marginBottom", "12rpx"]]))], ["scroll-view-box", _pS(_uM([["height", "400rpx"], ["borderTopWidth", 1], ["borderRightWidth", 1], ["borderBottomWidth", 1], ["borderLeftWidth", 1], ["borderTopStyle", "solid"], ["borderRightStyle", "solid"], ["borderBottomStyle", "solid"], ["borderLeftStyle", "solid"], ["borderTopColor", "#cccccc"], ["borderRightColor", "#cccccc"], ["borderBottomColor", "#cccccc"], ["borderLeftColor", "#cccccc"], ["borderTopLeftRadius", "10rpx"], ["borderTopRightRadius", "10rpx"], ["borderBottomRightRadius", "10rpx"], ["borderBottomLeftRadius", "10rpx"], ["backgroundColor", "#f8f8f8"], ["paddingTop", "15rpx"], ["paddingRight", "15rpx"], ["paddingBottom", "15rpx"], ["paddingLeft", "15rpx"], ["boxSizing", "border-box"]]))], ["text-content", _pS(_uM([["fontSize", "28rpx"], ["color", "#333333"], ["whiteSpace", "pre-wrap"]]))], ["gray-button", _pS(_uM([["backgroundColor", "#ffffff"], ["color", "#800080"], ["borderTopWidth", "medium"], ["borderRightWidth", "medium"], ["borderBottomWidth", "medium"], ["borderLeftWidth", "medium"], ["borderTopStyle", "none"], ["borderRightStyle", "none"], ["borderBottomStyle", "none"], ["borderLeftStyle", "none"], ["borderTopColor", "#000000"], ["borderRightColor", "#000000"], ["borderBottomColor", "#000000"], ["borderLeftColor", "#000000"], ["marginTop", "12rpx"], ["marginRight", "20rpx"], ["marginBottom", "12rpx"], ["marginLeft", "20rpx"]]))]])]
