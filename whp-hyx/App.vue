<script>
export default {
	globalData: {
		tabBarHeight: 50,
		windowHeight: null,
		pixelRatio: null,
		screenHeight: null,
		token: ''
	},
	onLaunch: function() {
		var _this = this;
		uni.onNetworkStatusChange(function(res) {
			if (!res.isConnected) {
				uni.showToast({
					title: '当前网络不可用, 请检查网络!',
					icon: 'none',
					duration: 2500
				});
				throw new Error('当前网络不可用, 请检查网络!');
			}
		});
		console.log('App onLaunch');
		uni.getSystemInfo({
			success: function(res) {
				console.log(res);
				_this.globalData.pixelRatio = res.pixelRatio;
				_this.globalData.windowHeight = res.windowHeight;
				_this.globalData.screenHeight = res.screenHeight;
				_this.globalData.statusBarHeight = res.statusBarHeight;
			}
		});
	},
	onShow: function() {
		// #ifdef MP-WEIXIN
		//获取二维码携带的参数
		// let scene = decodeURIComponent(e.query.scene);
		// scene = scene.split('&');
		// let data = {
		// 	//场景值
		// 	scene: e.scene
		// };
		// scene.forEach(item => {
		// 	let arr = item.split('=');
		// 	if (arr.length == 2) {
		// 		data[arr[0]] = arr[1];
		// 	}
		// });
		
		//小程序更新
		if (uni.getUpdateManager) {
			const updateManager = uni.getUpdateManager();
			updateManager.onCheckForUpdate(function(res) {
				// 请求完新版本信息的回调
				console.log(res.hasUpdate);
			});
			updateManager.onUpdateReady(function(res) {
				uni.showModal({
					title: '更新提示',
					content: '新版本已经准备好，是否重启应用？',
					success(res) {
						if (res.confirm) {
							// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
							updateManager.applyUpdate();
						}
					}
				});
			});
			updateManager.onUpdateFailed(function(res) {
				// 新的版本下载失败
				uni.showModal({
					title: '已经有新版本了哟~',
					content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
					showCancel: false
				});
			});
		}
		// #endif
	},
	onHide: function() {
		console.log('App Hide');
	},
	onError: function(err) {
		uni.hideLoading();
		console.error('捕获错误', err);
	},
	methods: {
		
	}
};
</script>

<style lang="scss">
/* uni.scss */
@import './uni.scss';
@import '/common/uni.css';
@import '/common/ly-main.css';
@import '/common/common.css';
@import './common/iconfont/iconfont.css';
/*每个页面公共css */
</style>
