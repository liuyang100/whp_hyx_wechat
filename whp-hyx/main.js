import Vue from 'vue'
import App from './App'
import store from './store'

// TOOD
import MyConfig from './common/config'
import httpUrl from './common/httpUrl'


// 支付方式
import Method from './common/Method'
import {
	MyRequest
} from './common/libs/MyRequest.js'
// 全局组件
import animateLoading from "@/components/common/animate-loading/animate-loading.vue";
Vue.component('animate-loading', animateLoading)

Vue.prototype.$myConfig = MyConfig
Vue.prototype.$myRequest = MyRequest
Vue.prototype.$myhttpUrl = httpUrl
Vue.prototype.$myMethod = Method

Vue.prototype.$myNavigateTo = function(path, params) {
	if (!path) return false
	let url = path
	if (params) {
		url += MyConfig.comFuncs.queryParams(params)
	}
	uni.navigateTo({
		url: url
	})
}
// END
// 解析路由参数
Vue.prototype.$formateOption = function(parmas) {
	try {
		const item = JSON.parse(decodeURIComponent(parmas.item));
		return item
	} catch (error) {
		return {}
	}
}
Vue.prototype.$upImage = function(type) {
	return new Promise((resolve, reject) => {
		uni.chooseImage({
			count: 1,
			sizeType: ['compressed'],
			sourceType: ['album', 'camera'],
			success: async function(res) {
				if (res && res.tempFilePaths && res.tempFilePaths[0]) {
					uni.showLoading({
						title: '上传中...'
					})
					uni.uploadFile({
						url: MyConfig.upUrl,
						filePath: res.tempFilePaths[0],
						name: 'file',
						success: (res) => {
							if (res.statusCode === 200) {
								let data = JSON.parse(res.data);
								resolve({
									type,
									...data
								})

							} else {
								uni.showToast({
									title: '上传图片失败',
									icon: 'none',
									duration: 2000
								})
								reject(err)
							}
						},
						fail: (err) => {
							uni.showToast({
								title: '上传图片失败',
								icon: 'none',
								duration: 2000
							})
							reject(err)
						},
						complete: () => {
							uni.hideLoading()
						}
					})
				}
			}
		})
	})
}
Vue.config.productionTip = false
// 引入request库
Vue.prototype.$eventHub = new Vue();
Vue.prototype.$store = store

// 权限跳转
App.mpType = 'app'
const app = new Vue({
	store,
	...App
})
app.$mount()
