
	import { getAllFacePhotoRecords, type FacePhotoRecord } from './photoStore.uts'

	const __sfc__ = defineComponent({
		data() {
			return {
				photoRecords: [] as FacePhotoRecord[],
			}
		},
		onShow() {
			this.loadPhotoRecords()
		},
		methods: {
			loadPhotoRecords() {
				this.photoRecords = getAllFacePhotoRecords()
			},
			formatTime(timestamp: number): string {
				const date = new Date(timestamp)
				const year = date.getFullYear()
				const month = `${date.getMonth() + 1}`.padStart(2, '0')
				const day = `${date.getDate()}`.padStart(2, '0')
				const hour = `${date.getHours()}`.padStart(2, '0')
				const minute = `${date.getMinutes()}`.padStart(2, '0')
				const second = `${date.getSeconds()}`.padStart(2, '0')
				return `${year}-${month}-${day} ${hour}:${minute}:${second}`
			},
			getFaceNameText(item: FacePhotoRecord): string {
				if (item.faceName.length > 0) {
					return '\u59d3\u540d\uff1a' + item.faceName
				}
				return '\u59d3\u540d\uff1a\u65e0'
			},
			getFaceScoreText(item: FacePhotoRecord): string {
				if (item.matched) {
					return '\u5206\u6570\uff1a' + item.faceScore
				}
				return '\u5206\u6570\uff1a\u65e0'
			},
			getImageSrc(item: FacePhotoRecord): string {
				if (item.imagePath.length > 0) {
					if (item.imagePath.startsWith('file://')) {
						return item.imagePath
					}
					return `file://${item.imagePath}`
				}
				return item.imageBase64
			},
		},
	})

export default __sfc__
function GenPagesPhotoListIndexRender(this: InstanceType<typeof __sfc__>): any | null {
const _ctx = this
const _cache = this.$.renderCache
  return _cE("view", _uM({ class: "page" }), [
    _cE("scroll-view", _uM({
      "scroll-y": "true",
      class: "scroll-view"
    }), [
      _ctx.photoRecords.length == 0
        ? _cE("view", _uM({
            key: 0,
            class: "empty-box"
          }), [
            _cE("text", _uM({ class: "empty-title" }), "还没有识别抓拍照片"),
            _cE("text", _uM({ class: "empty-desc" }), "开始 1:N 人脸识别后，抓拍照片会自动保存在这里。")
          ])
        : _cC("v-if", true),
      _cE(Fragment, null, RenderHelpers.renderList(_ctx.photoRecords, (item, __key, __index, _cached): any => {
        return _cE("view", _uM({
          key: item.id,
          class: "photo-card"
        }), [
          _cE("image", _uM({
            class: "photo-image",
            src: _ctx.getImageSrc(item),
            mode: "widthFix"
          }), null, 8 /* PROPS */, ["src"]),
          _cE("view", _uM({ class: "photo-meta" }), [
            _cE("text", _uM({ class: "photo-status" }), _tD(item.matched ? '匹配成功' : '未匹配到结果'), 1 /* TEXT */),
            _cE("text", _uM({ class: "photo-time" }), _tD(_ctx.formatTime(item.createdAt)), 1 /* TEXT */),
            _cE("text", _uM({ class: "photo-name" }), _tD(_ctx.getFaceNameText(item)), 1 /* TEXT */),
            _cE("text", _uM({ class: "photo-score" }), _tD(_ctx.getFaceScoreText(item)), 1 /* TEXT */)
          ])
        ])
      }), 128 /* KEYED_FRAGMENT */)
    ])
  ])
}
const GenPagesPhotoListIndexStyles = [_uM([["page", _pS(_uM([["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["backgroundColor", "#f5f7fb"]]))], ["scroll-view", _pS(_uM([["paddingTop", "24rpx"], ["paddingRight", "24rpx"], ["paddingBottom", "24rpx"], ["paddingLeft", "24rpx"], ["boxSizing", "border-box"]]))], ["empty-box", _pS(_uM([["marginTop", "160rpx"], ["paddingTop", "48rpx"], ["paddingRight", "36rpx"], ["paddingBottom", "48rpx"], ["paddingLeft", "36rpx"], ["borderTopLeftRadius", "24rpx"], ["borderTopRightRadius", "24rpx"], ["borderBottomRightRadius", "24rpx"], ["borderBottomLeftRadius", "24rpx"], ["backgroundImage", "linear-gradient(135deg, #ffffff 0%, #eef3ff 100%)"], ["backgroundColor", "rgba(0,0,0,0)"], ["boxShadow", "0 12rpx 40rpx rgba(40, 68, 120, 0.08)"]]))], ["empty-title", _pS(_uM([["fontSize", "34rpx"], ["fontWeight", "600"], ["color", "#1f2a44"], ["marginBottom", "16rpx"]]))], ["empty-desc", _pS(_uM([["fontSize", "28rpx"], ["lineHeight", "42rpx"], ["color", "#60708f"]]))], ["photo-card", _pS(_uM([["marginBottom", "24rpx"], ["borderTopLeftRadius", "24rpx"], ["borderTopRightRadius", "24rpx"], ["borderBottomRightRadius", "24rpx"], ["borderBottomLeftRadius", "24rpx"], ["overflow", "hidden"], ["backgroundColor", "#ffffff"], ["boxShadow", "0 12rpx 36rpx rgba(27, 39, 79, 0.08)"]]))], ["photo-image", _pS(_uM([["width", "100%"], ["backgroundColor", "#dfe6f5"]]))], ["photo-meta", _pS(_uM([["paddingTop", "24rpx"], ["paddingRight", "24rpx"], ["paddingBottom", "24rpx"], ["paddingLeft", "24rpx"]]))], ["photo-status", _pS(_uM([["fontSize", "30rpx"], ["lineHeight", "42rpx"], ["color", "#0f6b57"], ["fontWeight", "600"], ["marginBottom", "10rpx"]]))], ["photo-time", _pS(_uM([["fontSize", "28rpx"], ["lineHeight", "42rpx"], ["color", "#33415c"]]))], ["photo-name", _pS(_uM([["fontSize", "28rpx"], ["lineHeight", "42rpx"], ["color", "#33415c"]]))], ["photo-score", _pS(_uM([["fontSize", "28rpx"], ["lineHeight", "42rpx"], ["color", "#33415c"]]))]])]
