
	import { getAllFacePhotoRecords, deleteFacePhotoRecord, type FacePhotoRecord } from './photoStore.uts'

	const __sfc__ = defineComponent({
		data() {
			return {
				photoRecords: [] as FacePhotoRecord[],
				previewVisible: false,
				previewImageSrc: '',
			}
		},
		onShow() {
			this.loadPhotoRecords()
		},
		methods: {
			loadPhotoRecords() {
				this.photoRecords = getAllFacePhotoRecords()
			},
			openPhotoPreview(item: FacePhotoRecord) {
				const imageSrc = this.getImageSrc(item)
				if (imageSrc.length == 0) {
					return
				}
				this.previewImageSrc = imageSrc
				this.previewVisible = true
			},
			closePhotoPreview() {
				this.previewVisible = false
				this.previewImageSrc = ''
			},
			handleDeletePhoto(item: FacePhotoRecord) {
				uni.showModal({
					title: '删除照片',
					content: '确认删除这张抓拍照片吗？',
					confirmText: '删除',
					cancelText: '取消',
					success: (res) => {
						if (!res.confirm) {
							return
						}

						const deleted = deleteFacePhotoRecord(item.id)
						if (deleted) {
							if (this.previewVisible && this.previewImageSrc == this.getImageSrc(item)) {
								this.closePhotoPreview()
							}
							this.loadPhotoRecords()
							uni.showToast({
								title: '删除成功',
								icon: 'success'
							})
							return
						}

						uni.showToast({
							title: '删除失败',
							icon: 'error'
						})
					}
				})
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
      _cE("view", _uM({ class: "content" }), [
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
              mode: "widthFix",
              onClick: () => {_ctx.openPhotoPreview(item)}
            }), null, 8 /* PROPS */, ["src", "onClick"]),
            _cE("view", _uM({ class: "photo-meta" }), [
              _cE("text", _uM({ class: "photo-status" }), _tD(item.matched ? '匹配成功' : '未匹配到结果'), 1 /* TEXT */),
              _cE("text", _uM({ class: "photo-time" }), _tD(_ctx.formatTime(item.createdAt)), 1 /* TEXT */),
              _cE("text", _uM({ class: "photo-name" }), _tD(_ctx.getFaceNameText(item)), 1 /* TEXT */),
              _cE("text", _uM({ class: "photo-score" }), _tD(_ctx.getFaceScoreText(item)), 1 /* TEXT */)
            ]),
            _cE("view", _uM({ class: "photo-actions" }), [
              _cE("button", _uM({
                class: "delete-button",
                onClick: () => {_ctx.handleDeletePhoto(item)}
              }), "删除照片", 8 /* PROPS */, ["onClick"])
            ])
          ])
        }), 128 /* KEYED_FRAGMENT */)
      ])
    ]),
    isTrue(_ctx.previewVisible)
      ? _cE("view", _uM({
          key: 0,
          class: "preview-mask",
          onClick: _ctx.closePhotoPreview
        }), [
          _cE("view", _uM({ class: "preview-body" }), [
            _cE("image", _uM({
              class: "preview-image",
              src: _ctx.previewImageSrc,
              mode: "aspectFit"
            }), null, 8 /* PROPS */, ["src"]),
            _cE("button", _uM({
              class: "preview-close",
              onClick: _ctx.closePhotoPreview
            }), "关闭", 8 /* PROPS */, ["onClick"])
          ])
        ], 8 /* PROPS */, ["onClick"])
      : _cC("v-if", true)
  ])
}
const GenPagesPhotoListIndexStyles = [_uM([["page", _pS(_uM([["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"], ["flexDirection", "column"], ["backgroundColor", "#f5f7fb"]]))], ["scroll-view", _pS(_uM([["flexGrow", 1], ["flexShrink", 1], ["flexBasis", "0%"]]))], ["content", _pS(_uM([["paddingTop", "24rpx"], ["paddingRight", "24rpx"], ["paddingBottom", "24rpx"], ["paddingLeft", "24rpx"], ["boxSizing", "border-box"]]))], ["empty-box", _pS(_uM([["flexDirection", "column"], ["marginTop", "160rpx"], ["paddingTop", "48rpx"], ["paddingRight", "36rpx"], ["paddingBottom", "48rpx"], ["paddingLeft", "36rpx"], ["borderTopLeftRadius", "24rpx"], ["borderTopRightRadius", "24rpx"], ["borderBottomRightRadius", "24rpx"], ["borderBottomLeftRadius", "24rpx"], ["backgroundImage", "linear-gradient(135deg, #ffffff 0%, #eef3ff 100%)"], ["backgroundColor", "rgba(0,0,0,0)"], ["boxShadow", "0 12rpx 40rpx rgba(40, 68, 120, 0.08)"]]))], ["empty-title", _pS(_uM([["fontSize", "34rpx"], ["fontWeight", "600"], ["color", "#1f2a44"], ["marginBottom", "16rpx"]]))], ["empty-desc", _pS(_uM([["fontSize", "28rpx"], ["lineHeight", "42rpx"], ["color", "#60708f"]]))], ["photo-card", _pS(_uM([["marginBottom", "24rpx"], ["borderTopLeftRadius", "24rpx"], ["borderTopRightRadius", "24rpx"], ["borderBottomRightRadius", "24rpx"], ["borderBottomLeftRadius", "24rpx"], ["overflow", "hidden"], ["backgroundColor", "#ffffff"], ["boxShadow", "0 12rpx 36rpx rgba(27, 39, 79, 0.08)"]]))], ["photo-image", _pS(_uM([["width", "100%"], ["backgroundColor", "#dfe6f5"]]))], ["photo-meta", _pS(_uM([["flexDirection", "column"], ["paddingTop", "24rpx"], ["paddingRight", "24rpx"], ["paddingBottom", "12rpx"], ["paddingLeft", "24rpx"]]))], ["photo-status", _pS(_uM([["fontSize", "30rpx"], ["lineHeight", "42rpx"], ["color", "#0f6b57"], ["fontWeight", "600"], ["marginBottom", "10rpx"]]))], ["photo-time", _pS(_uM([["fontSize", "28rpx"], ["lineHeight", "42rpx"], ["color", "#33415c"]]))], ["photo-name", _pS(_uM([["fontSize", "28rpx"], ["lineHeight", "42rpx"], ["color", "#33415c"]]))], ["photo-score", _pS(_uM([["fontSize", "28rpx"], ["lineHeight", "42rpx"], ["color", "#33415c"]]))], ["photo-actions", _pS(_uM([["paddingTop", 0], ["paddingRight", "24rpx"], ["paddingBottom", "24rpx"], ["paddingLeft", "24rpx"], ["flexDirection", "row"], ["justifyContent", "flex-end"]]))], ["delete-button", _pS(_uM([["backgroundColor", "#fff1f2"], ["color", "#be123c"], ["borderTopColor", "#fecdd3"], ["borderRightColor", "#fecdd3"], ["borderBottomColor", "#fecdd3"], ["borderLeftColor", "#fecdd3"], ["borderTopWidth", 1], ["borderRightWidth", 1], ["borderBottomWidth", 1], ["borderLeftWidth", 1], ["borderTopStyle", "solid"], ["borderRightStyle", "solid"], ["borderBottomStyle", "solid"], ["borderLeftStyle", "solid"], ["borderTopLeftRadius", "999rpx"], ["borderTopRightRadius", "999rpx"], ["borderBottomRightRadius", "999rpx"], ["borderBottomLeftRadius", "999rpx"], ["fontSize", "26rpx"], ["paddingTop", 0], ["paddingRight", "28rpx"], ["paddingBottom", 0], ["paddingLeft", "28rpx"], ["marginTop", 0], ["marginRight", 0], ["marginBottom", 0], ["marginLeft", 0]]))], ["preview-mask", _pS(_uM([["position", "fixed"], ["left", 0], ["top", 0], ["right", 0], ["bottom", 0], ["backgroundColor", "rgba(15,23,42,0.92)"], ["zIndex", 999], ["alignItems", "center"], ["justifyContent", "center"], ["paddingTop", "40rpx"], ["paddingRight", "40rpx"], ["paddingBottom", "40rpx"], ["paddingLeft", "40rpx"], ["boxSizing", "border-box"]]))], ["preview-body", _pS(_uM([["width", "100%"], ["height", "100%"], ["alignItems", "center"], ["justifyContent", "center"]]))], ["preview-image", _pS(_uM([["width", "100%"], ["height", "100%"]]))], ["preview-close", _pS(_uM([["position", "fixed"], ["top", "40rpx"], ["right", "40rpx"], ["backgroundColor", "rgba(255,255,255,0.12)"], ["color", "#ffffff"], ["borderTopLeftRadius", "999rpx"], ["borderTopRightRadius", "999rpx"], ["borderBottomRightRadius", "999rpx"], ["borderBottomLeftRadius", "999rpx"], ["fontSize", "26rpx"], ["paddingTop", 0], ["paddingRight", "28rpx"], ["paddingBottom", 0], ["paddingLeft", "28rpx"], ["marginTop", 0], ["marginRight", 0], ["marginBottom", 0], ["marginLeft", 0]]))]])]
