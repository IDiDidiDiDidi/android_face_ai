 
	import {startFaceSearch,
	        switchCamera,
		    insertFaceSearchFeature,
			insertManyFeatures,
	        addFaceSearchFeatureByCamera,
			addFaceSearchFeatureByImage,
			deleteFaceSearchFeature,
			queryFaceSearchFeature,
			toastMessage,
			ResultJSON} from "@/uni_modules/FaceAI-Search";
	// 注意：vue应该使用 testData.uts 而不是 testData.js		
    import { JSON_FACE_FEATURES_DATA } from "./faceFeatureList.uts";  //模拟服务端测试数据批量插入
	import { base64FaceImage } from './imageData.uts';
	
	const __sfc__ = defineComponent({
		  
		data() {
			return {
				faceID: 'Test',
				faceFeature: 'faceFeature is a string with lenth 1024',
				faceSearchResult: 'faceSearchResult',
				base64FaceImage:base64FaceImage as string //建议640*480 人脸图需要遵守规范：https://i.postimg.cc/RCwNy0kV/add-Face.jpg
			}
		},
		onLoad() {

		},
		
		methods: {
			
			/**
			 * 人脸搜索识别，返回大于threshold的json List数组，1:N搜索相似度高的在最前面（M：N不排序）
			 * 
			 */
			startFaceSearchDemo: function () {

			                const threshold = 0.85;    // 阈值[0.8.0.9],只有人脸库中匹配到的人脸相似度大于此才有结果返回
				            const oneTime = false;     // 搜索页持续搜索返回结果 还是仅仅搜索一次返回结果后关闭
							const searchTimeOut = 5;   // 搜索超时时间[3,22],仅仅是oneTime=true才生效，超时没有大于threshold搜索结果自动关闭页面
			                const highRes = false;     // true，高分辨率模式，远距离识别更佳，但会牺牲性能和速度以及定制设备不兼容黑屏
			                const searchOne = true;    // true（1:N）：取镜头画面最大人脸进行搜索匹配 false（M：N）：镜头画面所有人脸都进行搜索
						    startFaceSearch(
			                    threshold,
			                    oneTime,
								searchTimeOut,
			                    highRes,
								searchOne,
			                    (jsonStr: string) => {
					
									try {
										   const root = JSON.parse(jsonStr) as UTSJSONObject;
										    // 获取人脸列表
										    const results = root.getArray<UTSJSONObject>("data");
											console.log("收到搜索结果:", results);
											this.faceSearchResult = "【人脸搜索回调】\n " + JSON.stringify(results);
											
											// 人脸搜索场景图，可作为日志备份
											const base64 = root.getString("base64") ?? ""; 
											
											// 如果需要活体检测，加上相应的判断
											const liveness = root.getNumber("liveness");
											//console.log("静默活体:", "分数："+liveness);

										    if (results != null && results.length > 0) {
												//1:N搜索大于阈值的结果已经排好序，第一个就是相似度最高的（M：N不排序）
										        const firstFace = results[0];
										        const name = firstFace.getString("faceName");
										        const score = firstFace.getNumber("faceScore");
										        
										        if (name != null&&searchOne) {
										            toastMessage(base64,"最匹配:" + name + "," + score);
										        }
										    } else {
												if (searchOne) {
													toastMessage("","无结果");
												}
										    }
									}catch (e) {
			                            console.error("解析数据失败:", e);
			                        }
			                    }
						    );  
						},
			
			
			/**
			* 人脸搜索人脸特征录入，通过相机
			* 
			*/
			addFaceSearchFeatureByCameraDemo: function () {
				addFaceSearchFeatureByCamera(
				     this.faceID,
					 1,   //1.快速模式2.精确模式
					 true, //是否需要显示确认框，强烈建议需要,防止抓取的人脸因为晃动等原因不合格
					 (result: ResultJSON)  => {
						//打印结果 json
						console.log("result:", result);
						this.faceSearchResult = JSON.stringify(result, ['code', 'msg', 'faceBase64'], 4)
					})
			},
			
			
			/**
			* 人脸搜索人脸特征录入，通过Base64图片
			* 
			* 建议640*480 人脸图需要遵守规范：https://i.postimg.cc/RCwNy0kV/add-Face.jpg
			*/
			addFaceSearchFeatureByImageDemo: function () {
				addFaceSearchFeatureByImage(
				     this.faceID,
					 this.base64FaceImage,
					 (result: ResultJSON)  => {
						//打印结果 json
						console.log("result:", result);
						this.faceSearchResult = JSON.stringify(result, ['code', 'msg', 'faceBase64'], 4)
					})
			},
			
			/**
			* 删除人脸搜索人脸特征
			* 
			*/
			deleteFaceSearchFeatureDemo: function () {
				deleteFaceSearchFeature(
				     this.faceID,
					 (result: ResultJSON)  => {
						this.faceSearchResult =JSON.stringify(result)
					})
			},
			
			/**
			* 删除人脸搜索人脸特征
			* 
			* faceID 传入值
			* 查询成功返回json 单个对象，否则返回空 ""
			* 
			* faceID不传值（“” 代表查询所有）
			* 返回jsong 数组[] 0到N 个对象
			*/
			queryFaceSearchFeatureDemo: function () {
				queryFaceSearchFeature(
				     this.faceID,  //不传则查询本地所有的数据
					 (result: string)  => {
						 //简单判断，result 长度小于1024 肯定是没数据结果
						 this.faceSearchResult = "【人脸查询回调】\n" + result;
					})
			},
			
			
		   /**
			* 人脸搜索人脸特征更新同步。人脸特征字符长度当前是1024
			* 
			*/
			insertFaceSearchFeatureDemo: function () {
				insertFaceSearchFeature(
				   this.faceID,
				   this.faceFeature,
				   "tag",
				   "group",
					 (result: ResultJSON)  => {
						this.faceSearchResult =JSON.stringify(result)
					})
			},
			
		   /**
			* 批量操作人脸搜索人脸特征更新同步
			* 
			*/
			insertManyFaceFeatureSDemo: function () {
				insertManyFeatures(
				     JSON_FACE_FEATURES_DATA,
					 (result: ResultJSON)  => {
						this.faceSearchResult =JSON.stringify(result)
					})
			},
			
		   /**
			* 切换前后摄像头，一般0是前置， 1是后置 （但是部分定制Android设备不太标准）
			* 插件目前仅仅支持系统RGB摄像头，UVC协议相机只有原生Android 代码支持
			* 
			*/
			switchCameraDemo: function () {
				switchCamera(0)
			},		
			
			
	   }			

	})

export default __sfc__
function GenPagesIndexIndexRender(this: InstanceType<typeof __sfc__>): any | null {
const _ctx = this
const _cache = this.$.renderCache
  return _cE("view", null, [
    _cE("button", _uM({
      class: "gray-button",
      onClick: _ctx.startFaceSearchDemo
    }), "1:N人脸搜索识别", 8 /* PROPS */, ["onClick"]),
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
      _cE("view", null, " Email: FaceAISDK.Service@gmail.com"),
      _cE("scroll-view", _uM({
        "scroll-y": "true",
        class: "scroll-view-box"
      }), [
        _cE("text", _uM({ class: "text-content" }), _tD(_ctx.faceSearchResult), 1 /* TEXT */)
      ])
    ])
  ])
}
const GenPagesIndexIndexStyles = [_uM([["result-box", _pS(_uM([["marginTop", "20rpx"], ["marginRight", "20rpx"], ["marginBottom", "20rpx"], ["marginLeft", "20rpx"]]))], ["scroll-view-box", _pS(_uM([["height", "400rpx"], ["borderTopWidth", 1], ["borderRightWidth", 1], ["borderBottomWidth", 1], ["borderLeftWidth", 1], ["borderTopStyle", "solid"], ["borderRightStyle", "solid"], ["borderBottomStyle", "solid"], ["borderLeftStyle", "solid"], ["borderTopColor", "#cccccc"], ["borderRightColor", "#cccccc"], ["borderBottomColor", "#cccccc"], ["borderLeftColor", "#cccccc"], ["borderTopLeftRadius", "10rpx"], ["borderTopRightRadius", "10rpx"], ["borderBottomRightRadius", "10rpx"], ["borderBottomLeftRadius", "10rpx"], ["backgroundColor", "#f8f8f8"], ["paddingTop", "15rpx"], ["paddingRight", "15rpx"], ["paddingBottom", "15rpx"], ["paddingLeft", "15rpx"], ["boxSizing", "border-box"]]))], ["text-content", _pS(_uM([["fontSize", "28rpx"], ["color", "#333333"], ["whiteSpace", "pre-wrap"]]))], ["gray-button", _pS(_uM([["backgroundColor", "#ffffff"], ["color", "#800080"], ["borderTopWidth", "medium"], ["borderRightWidth", "medium"], ["borderBottomWidth", "medium"], ["borderLeftWidth", "medium"], ["borderTopStyle", "none"], ["borderRightStyle", "none"], ["borderBottomStyle", "none"], ["borderLeftStyle", "none"], ["borderTopColor", "#000000"], ["borderRightColor", "#000000"], ["borderBottomColor", "#000000"], ["borderLeftColor", "#000000"]]))]])]
