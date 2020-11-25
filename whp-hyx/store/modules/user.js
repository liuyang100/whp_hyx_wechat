import myConfig from '@/common/config'
export default {
	state: {
		userinfo: {
			gender: 0,
			imagename: "",
			mobile: "",
			name: "",
			birth: "",
			memo: "",
			username: "",
			is_bind_wx: 0,
			company_name: ""
		},
		//登录返回的角色
		loginInfo: {},
		role_code: null, // 角色编码
		is_has_company: true, // 是否为主企业 
		isLogin: false, // 判断当前用户登录的状态
		forcedLogin: true, // 是否显示取消按钮
	},
	mutations: {
		// 我的页面设置个人信息
		getinfo(state, userinfo) {
			state.userinfo = {
				gender: userinfo.gender || 0,
				imagename: userinfo.imagename || "",
				mobile: userinfo.mobile || "",
				name: userinfo.name || "",
				birth: userinfo.birth || "",
				memo: userinfo.memo || "",
				username: userinfo.username || "",
				is_bind_wx: userinfo.is_bind_wx || 0,
				company_name: userinfo.company_name || ""
			}
		},
		// 修改个人信息
		editinfo(state, {
			key,
			value
		}) {
			state.userinfo[key] = value
		},
		clearuserinfo(state) {
			state.userinfo = {
				gender: 0,
				imagename: "",
				mobile: "",
				name: "",
				birth: "",
				memo: "",
				username: "",
				is_bind_wx: 0,
				company_name: ""
			}
		},
		//// 存储登录返回的结果
		setRole(state, optionObj) {
			if (optionObj.is_auth) {
				let trimRoleName = optionObj.role_name;
				trimRoleName = trimRoleName.replace(/\s/g, "");
				switch (trimRoleName) {
					case '惠营销-业务员':
						state.role_code = 'HYXYWY';
						break;
					case '惠营销-分公司经理':
						state.role_code = 'HYXFGSJL'
						break;
					case '惠营销-总部':
						state.role_code = 'HYXZB'
						break;
					case '惠营销-批发渠道总监':
						state.role_code = 'HYXPFQDZJ'
						break;
					case '惠营销-终端主管':
						state.role_code = 'HYXZDZG'
						break;
					case '惠营销-连锁渠道总监':
						state.role_code = 'HYXLSQDZJ'
						break;
					case '惠营销-职能':
						state.role_code = 'HYXZN';
						break;
					default:
						state.role_code = '';
				};
				state.is_main_companyInfo = Reflect.has(optionObj, "is_main_companyInfo") ? (optionObj.is_main_companyInfo) : true;
			}
			console.log("设置登录", optionObj)
			uni.setStorageSync("userInfo", JSON.stringify(optionObj));
			state.loginInfo = optionObj;
		},

		clearnRole(state) {
			state.loginInfo = null;
		},
		setislogin(state, value) {
			try {
				state.isLogin = value;
			} catch (e) {
				// error
				console.log("错误")
			}
		},

		getislogin(state) {
			try {
				state.isLogin = loginInfo.is_auth
			} catch (e) {
				state.isLogin = false;
			}
		},

		removeUserInfoStorage(state) {
			state.isLogin = false;
			state.loginInfo = {};
			this.commit('clearnRole')
			uni.removeStorageSync('userInfo');
		}


	},

	actions: {
		// 微信登录
		async login({
			commit,
			state
		}) {
			return await new Promise((resolve, reject) => {
				uni.login({
					success: (res) => {
						if (!res.code) {
							return uni.showToast({
								title:'微信登录失败',
								icon:'none'
							})
						}
						uni.request({
							url: myConfig.reqDomain + myConfig.reqLoginUrl,
							method: 'POST',
							data: {
								js_code: res.code
							},
							dataType: 'json',
							success: (res) => {
								try {
									let is_auth = res.data.data && res.data.data.is_auth;
									let token = res.data.data && res.data.data.token;
									commit('setRole', res.data.data)
									if (is_auth) {
										commit('setislogin', true);
									} else {
										commit('setislogin', false);
									}
									resolve({
										is_auth: is_auth,
										token: token
									})
								} catch (e) {
									reject()
								}

							},
							fail: (err) => {
								reject()
							}
						})
					},
					fail: err => {
						reject(err.message)
					}
				})
			})

		}
	}
}
