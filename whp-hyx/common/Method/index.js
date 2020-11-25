import {
	MyRequest
} from '@/common/libs/MyRequest.js'
import httpUrl from '@/common/httpUrl'
import MyConfig from '@/common/config'

var paymentType = 'order';
const Method = { //公用方法
	orderPayment(id) { //订单支付
		return new Promise((resolve, reject) => {
			paymentType = 'order';
			MyRequest({
				url: httpUrl.orderPaySubmit,
				data: {
					order_id: id
				},
				success: (data) => {
					Method.requestPayment(data).then(res => {
						resolve(res)
					});
				},
				fail: (err) => {
					uni.hideLoading()
					MyConfig.comFuncs.showToast(err.message)
				}
			})
		})
	},
	adPayment(id){//购买广告支付
		return new Promise((resolve, reject) => {
			paymentType = 'ad';
			MyRequest({
				url: httpUrl.adorderPaySubmit,
				data: {
					ad_order_id: id
				},
				success: (data) => {
					Method.requestPayment(data).then(res => {
						resolve(res)
					});
				},
				fail: (err) => {
					uni.hideLoading()
					MyConfig.comFuncs.showToast(err.message)
				}
			})
		})
	},
	requestPayment(data) { //调起支付
		return new Promise((resolve, reject) => {
			uni.hideLoading()
			wx.requestPayment({
				'timeStamp': data.timeStamp + '',
				'nonceStr': data.nonceStr,
				'package': data.package,
				'signType': data.signType, //  'MD5'
				'paySign': data.paySign,
				success(res) { //支付成功
					Method.paymentPayQuery().then(res => {
						uni.navigateTo({
							url: '/pages/pay-complete/pay-complete'
						});
						resolve(res)
					})
				},
				fail(err) { //支付失败
					MyConfig.comFuncs.showToast(err.message)
				}
			})
		})
	},
	paymentPayQuery() { //支付完成后调用接口
		return new Promise((resolve, reject) => {
			let url = httpUrl.paymentPayQuery;
			paymentType == 'ad' && (url = httpUrl.adPaymentPayQuery);
			MyRequest({
				url: url,
				success: (res) => {
					resolve(res)
				},
				fail: (err) => {
					MyConfig.comFuncs.showToast(err.message)
				},
			})
		})
	},
	showToast(text) { //提示一点五秒
		return new Promise((resolve, reject) => {
			uni.showToast({
				title: text,
				icon: 'none'
			});
			setTimeout(function() {
				uni.hideToast();
				resolve(true)
			}, 1500);
		})
	},
	showModal(text) { //取消 确定模态框
		return new Promise((resolve, reject) => {
			uni.showModal({
				content: text,
				success: function(res) {
					resolve(res.confirm)
				}
			});
		});
	},
	getUserInfo() { //获取用户信息
		let userInfo = uni.getStorageSync(MyConfig.varNames.userInfo)
		userInfo = userInfo ? JSON.parse(userInfo) : false
		return userInfo
	},
	getShareId(member_id, type) { //获取转发id
		return new Promise((resolve, reject) => {
			let myshare_id = uni.getStorageSync('myshare_id');
			// if (myshare_id) {
			// 	resolve(myshare_id)
			// 	return
			// }
			MyRequest({
				url: httpUrl.getShareId,
				data: {
					member_id: member_id ? member_id : '',
					type: type ? type : 0
				},
				success: (res) => {
					uni.setStorageSync('myshare_id', res.share_id);
					resolve(res.share_id)
				},
				fail: (err) => {
					MyConfig.comFuncs.showToast(err.message)
				},
			})
		})
	},
	downloadFile() { //下载图片
		return uni.downloadFile({
			url: img
		}).then(res => {
			return res[1].tempFilePath
		})
	}
}

export default Method