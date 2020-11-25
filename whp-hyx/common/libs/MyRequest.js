import MyConfig from '../config'
import Store from '../../store'
let requestTasks = null;
let isloadSuccess = true;
let requestcoun = {
	olgUrl: '',
	maxNum: 3,
	beginNum: 1
}

let reqArguments = null;
let config = {
	BASR_URL: MyConfig.reqDomain,
	header: {
		'Content-Type': 'application/json;charset=UTF-8',
		'token': '',
		'client-type': 'wxminiprogram'
	},
	method: 'POST',
	data: {},
	dataType: 'json'
}

async function UniRequest(options, reqComplete, reqPort, otherParams = false) {
	reqArguments = arguments
	return new Promise((resolve, reject) => {
		requestTasks = uni.request({
			...options,
			success: async function(res) {
				if (res.statusCode === 200) {
					let {
						data,
						error,
						msg,
						status,
						success
					} = res.data
					if (status === 200 && success == 2) {
						requestcoun.beginNum = 0
						if (typeof otherParams === 'object') {
							resolve({ ...otherParams,
								data
							} || {})
						} else {
							resolve(data)
						}
					} else {
						uni.hideLoading()
						if (status === 40003) {
							uni.showModal({
								title: "提示",
								content: "token无效或者已过期,请重新登录",
								showCancel: false,
								confirmText: "前往登录",
								success: (res) => {
									if (res.confirm) {
										uni.reLaunch({
											url: '/pages/login/login'
										})
									}
								}
							})
							throw error
						} else {
							showModelFun(status, error)
							reject(error)
						}
					}
				} else {
					showModelFun(status, error)
				}
			},
			fail: function(err) {
				uni.hideLoading()
				reject(err)
			},
			complete: function() {
				reqComplete && reqComplete()
			}

		})

	})
}


function showModelFun(status, error = '请求失败') {
	uni.showModal({
		title: "提示",
		content: error || '请求失败'
	})
	throw error;
}


async function myRequest(reqCon) {
	if (reqCon.isStopReq == undefined) {
		reqCon.isStopReq = false
	}
	if (reqCon.isStopReq) {
		// 终端请求
		requestTasks.abort()
	}
	try {
		let token;
		uni.checkSession({
			success: async () => {
				token = Store.state.user.loginInfo.token
				config.header.token = token;
				reqCon.url = config.BASR_URL + reqCon.url;
				reqCon.method = reqCon.method ? reqCon.method : config.method;
				reqCon.header = reqCon.header ? reqCon.header : config.header;
				reqCon.timeout = reqCon.timeout ? reqCon.timeout : config.timeout;
				reqCon.data = reqCon.data ? reqCon.data : config.data;
				let resData = await UniRequest(reqCon, reqCon.complete, reqCon.port, reqCon.other)
				reqCon.success && reqCon.success(resData);
			},
			fail: () => {
				Store.dispatch('login').then(async res => {
					token = Store.state.user.loginInfo.token
					config.header.token = token;
					reqCon.url = config.BASR_URL + reqCon.url;
					reqCon.method = reqCon.method ? reqCon.method : config.method;
					reqCon.header = reqCon.header ? reqCon.header : config.header;
					reqCon.data = reqCon.data ? reqCon.data : config.data;
					let resData = await UniRequest(reqCon, reqCon.complete, reqCon.port, reqCon.other)
					reqCon.success && reqCon.success(resData);
				})
			}
		})

	} catch (err) {
		console.log("in httpRequest err", err)
		reqCon.fail && reqCon.fail(err.message);
	};
}

module.exports = {
	MyRequest: myRequest
}
