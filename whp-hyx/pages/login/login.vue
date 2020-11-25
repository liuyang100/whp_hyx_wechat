<template>
	<view>
		<block v-if="v_type === 2">
			<view class="loginTitle">密码登录</view>
			<view class="container">
				<view class="login-row d-flex a-center">
					<text class="iconfont phoneIcon flex-shrink">&#xe6be;</text>
					<input class="login-input flex-1" type="text" placeholder="请输入工号/手机号" v-model="mobile" />
					<icon type="clear" size="20" color="#666666" @click="clearIcon('mobile')" :style="{ display: showClearIcon ? 'inline-block' : 'none' }"></icon>
				</view>
				<view class="login-row d-flex a-center">
					<uni-icons type="locked" size="24" color="#666666" class="flex-shrink" style="margin-right: 14rpx;"></uni-icons>
					<input class="login-input flex-1" type="text" :password="showPassword" placeholder="请输入密码" v-model="password" />
					<uni-icons type="eye" size="24" color="#666666" @click="showPassword = !showPassword"></uni-icons>
				</view>
				<view class="change-loginfun">
					<checkbox-group @change="checkboxChange">
						<checkbox color="#FFCC33" class="chebox-style" style="" id="chkRem" type="checkbox" :checked="rememberPsw"></checkbox>
						<lable for="chkRem">记住密码</lable>
					</checkbox-group>
					<view class="change-type" @tap="changloginType(1)">手机验证码登录</view>
				</view>
			</view>
		</block>
		<block v-if="v_type === 1">
			<view class="loginTitle">验证码登录</view>
			<view class="container">
				<view class="login-row d-flex a-center">
					<text class="iconfont phoneIcon flex-shrink">&#xe6be;</text>
					<input class="login-input flex-1" type="text" placeholder="请输入手机号" v-model="mobile" />
					<icon type="clear" color="#666666" @click="clearIcon('mobile')" :style="{ display: showClearIcon ? 'inline-block' : 'none' }"></icon>
				</view>
				<view class="login-row d-flex a-center">
					<uni-icons type="locked" size="24" color="#666666" class="flex-shrink" style="margin-right: 14rpx;"></uni-icons>
					<input class="login-input flex-1" type="text" placeholder="请输入验证码" v-model="captcha" />
					<view
						:style="{ background: captchaBtnBackColor }"
						style="border-radius: 20rpx;width: 160rpx;font-size: 22rpx; color: #FFFFFF;line-height: 50rpx; text-align: center; height: 50rpx;"
						@click="getCode"
					>
						{{ codeNum ? codeNum + 's' : '获取验证码' }}
					</view>
				</view>
				<view class="change-loginfun"><view class="change-type" @tap="changloginType(2)">账号登录</view></view>
			</view>
		</block>
		<view class="d-flex a-center px-4">
			<checkbox @click="changeCheck" :checked="privacy_agreement" color="#FFCC33" style="transform:scale(0.7)" />
			<navigator url="/pages/privac-agreement/privac-agreement" style="color: #007AFF;">请阅读隐私协议</navigator>
		</view>
		<view class="login-submit">
			<button open-type="getUserInfo" bindgetuserinfo="onGotUserInfo" @getuserinfo="wxGetUserInfo" class="text-white main-bg-color" hover-class="main-bg-hover-color">
				授权登录
			</button>
		</view>
	</view>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import uniIcons from '@/components/uni/uni-icons/uni-icons.vue';
import Test from '@/ulits/function/test.js';
function ishaskeys(obj, val, typea) {
	let temp = typeof obj[val];
	if (temp == typea) {
		if (typea == 'string') {
			return obj.hasOwnProperty(val) && (obj[val].trim() && obj[val].trim() != '');
		} else {
			return obj.hasOwnProperty(val);
		}
	} else {
		return false;
	}
}
export default {
	components: {
		uniIcons
	},
	data() {
		return {
			rememberPsw: false,
			privacy_agreement: false,
			logintype: 0, // 0 手机登陆，1 验证码登陆 标题
			mobile: '', // 手机号
			password: '', // 密码
			captcha: '', // 验证码
			v_type: 2, // 登录的类型  1验证码登录  2密码登录
			codeNuming: 0, // 倒计时时长 默认为60
			opt_type: 10003, // 获取验证的类型   10001注册验证码   10002修改密码  10003绑定账号  10004更换手机号  10005合伙人申请
			showPassword: true, // 显示密码
			nickName: null, //获取的昵称
			avatarUrl: null, //获取的头像
			USER_OBJ: null
		};
	},
	mounted() {
		//缓存的账号
		const USER_OBJ = uni.getStorageSync('USER_KEY');
		this.USER_OBJ = USER_OBJ ? JSON.parse(USER_OBJ) : {};
		const { mobile, password, readPrivacy } = USER_OBJ ? JSON.parse(USER_OBJ) : {};

		//有缓存就赋值给文本没有就清空
		if (mobile && password) {
			this.mobile = mobile;
			this.password = password;
			this.privacy_agreement = readPrivacy;
			this.rememberPsw = true;
		} else {
			this.mobile = '';
			this.password = '';
			this.privacy_agreement = false;
			this.rememberPsw = false;
		}
	},

	computed: {
		...mapState({
			isLogin: state => state.user.isLogin
		}),
		captchaBtnBackColor() {
			let phone = Test.mobile(this.mobile);
			if (phone) {
				return '#fdc100';
			} else {
				return '#cccccc';
			}
		},
		codeNum() {
			return this.codeNuming;
		},
		showClearIcon() {
			return this.mobile.trim().length > 0 ? true : false;
		}
	},

	methods: {
		...mapMutations(['setRole', 'setislogin', 'setToken']),
		...mapActions(['login']),

		changeCheck() {
			this.privacy_agreement = !this.privacy_agreement;
		},
		// 切换登录状态
		changloginType(ins) {
			this.v_type = ins;
		},

		async wxGetUserInfo() {
			let _this = this;
			if (!this.privacy_agreement) {
				return uni.showToast({
					title: '请阅读隐私协议',
					icon: 'none',
					duration: 2000
				});
			}
			uni.getUserInfo({
				provider: 'weixin',
				success: async infoRes => {
					_this.nickName = infoRes.userInfo.nickName; //昵称
					_this.avatarUrl = infoRes.userInfo.avatarUrl; //头像
					if (this.v_type == 2) {
						// 密码登录
						await _this.passwordlogin();
					} else {
						// 验证码登录
						await _this.captchalogin();
					}
				},
				fail: err => {
					uni.getSetting({
						success: res => {
							let authStatus = res.authSetting['scope.userInfo'];
							if (!authStatus) {
								uni.showModal({
									title: '授权失败',
									content: '惠而浦营销需要获取您的用户信息，请在设置界面打开相关权限',
									success: res => {
										if (res.confirm) {
											uni.openSetting();
										}
									}
								});
							} else {
								uni.showModal({
									title: '获取用户信息失败',
									content: '错误原因' + content,
									showCancel: false
								});
							}
						}
					});
				}
			});
		},

		// 清空数据
		clearIcon: function(val) {
			this[val] = '';
		},

		// 密码登录
		passwordlogin: async function() {
			let isbind;
			let data = {
				mobile: this.mobile.trim(),
				password: this.password.trim(),
				v_type: 2, // 验证类型  1 验证码  2密码验证
				name: this.nickName,
				head_image: this.avatarUrl
			};

			if (!Test.mobile(data.mobile)) {
				return uni.showToast({
					title: '请正确输入的手机号/工号',
					icon: 'none',
					duration: 2000
				});
			}
			if (data.password == '' || data.password == null) {
				return uni.showToast({
					title: '请输入密码',
					icon: 'none',
					duration: 2000
				});
			} else {
				if (data.password.length < 6) {
					return uni.showToast({
						title: '密码最短为 6 个字符',
						icon: 'none',
						duration: 2000
					});
				}
			}
			uni.showLoading({
				title: '登录中...',
				mask: true
			});
			try {
				let { token, is_auth } = await this.login();
				if (!token) {
					throw '登录失败';
				}
				if (is_auth) {
					this.setislogin(true);
					if (this.isLogin) {
						uni.reLaunch({
							url: '/pages/main/main'
						});
						uni.hideLoading();
						return;
					}
				}
			} catch (e) {
				this.setislogin(false);
				//TODO handle the exception
				uni.showToast({
					title: '登录失败',
					icon: 'none',
					duration: 3000
				});
				return;
			}

			this.$myRequest({
				type: 'login',
				url: this.$myhttpUrl.bind,
				data: data,
				success: async res => {
					if (this.rememberPsw) {
						const locationObj = {
							mobile: this.mobile,
							password: this.password,
							readPrivacy: true
						};
						uni.setStorage({
							key: 'USER_KEY',
							data: JSON.stringify(locationObj),
							success() {
								console.log('设置成功');
							}
						});
					} else {
						uni.removeStorage('USER_KEY');
					}
					this.setislogin(true);
					this.setRole(res);
					if (this.isLogin) {
						uni.reLaunch({
							url: '/pages/main/main'
						});
					}
					uni.hideLoading();
				},
				fail: err => {
					this.setislogin(false);
					uni.showToast({
						title: '绑定账号失败',
						icon: 'none'
					});
				}
			});
		},
		// 验证码登录
		captchalogin: async function() {
			let isbind;
			let data = {
				mobile: this.mobile.trim(),
				captcha: this.captcha.trim(),
				v_type: 1, // 验证类型  1验证码  2密码验证
				opt_type: 10003,
				name: this.nickName,
				head_image: this.avatarUrl
			};

			if (!Test.mobile(data.mobile)) {
				return uni.showToast({
					title: '请输入正确格式的手机号',
					icon: 'none',
					duration: 2000
				});
			}
			if (data.captcha == '' || data.captcha == null) {
				return uni.showToast({
					title: '请输入验证码',
					icon: 'none',
					duration: 2000
				});
			}
			uni.showLoading({
				title: '登录中...',
				mask: true
			});

			this.$myRequest({
				type: 'login',
				url: this.$myhttpUrl.bind,
				data: data,
				success: async res => {
					if (res) {
						this.setislogin(true);
						this.setRole(res);
						if (this.isLogin) {
							uni.reLaunch({
								url: '/pages/main/main'
							});
						}
					}
					uni.hideLoading();
				},
				fail: err => {
					this.setislogin(false);
					uni.showToast({
						title: err.message,
						icon: 'none'
					});
				}
			});
		},
		/* 记住密码功能 */
		checkboxChange(e) {
			this.rememberPsw = !this.rememberPsw;
		},
		//获取验证码
		async getCode() {
			let isbind;
			if (!Test.mobile(this.mobile)) {
				uni.showToast({
					title: '请输入正确的手机号码',
					icon: 'none'
				});
				return;
			}
			try {
				let { token } = await this.login();
				if (!token) {
					throw new Error('获取验证码失败');
				}
			} catch (e) {
				//TODO handle the exception
				uni.showToast({
					title: '获取验证码失败',
					icon: 'none',
					duration: 3000
				});
				return;
			}
			if (this.codeNuming) {
				return;
			}
			this.codeNuming = 60;
			this.captchaBtnBackColor = '#CCCCCC';

			this.$myRequest({
				type: 'login',
				url: this.$myhttpUrl.sendAuthCode,
				data: {
					mobile: this.mobile,
					opt_type: this.opt_type,
					captcha: this.captcha
				},
				success: res => {
					let interval = setInterval(() => {
						this.codeNuming--;
						if (this.codeNuming == 0) {
							clearInterval(interval);
							this.codeNuming = 0;
							this.captchaBtnBackColor = '#fdc100';
						}
					}, 1000);
				},
				fail: err => {
					this.codeNuming = 0;
					this.captchaBtnBackColor = '#fdc100';
					uni.showToast({
						title: err.message,
						icon: 'none',
						duration: 2000
					});
				},
				complete: () => {
					uni.hideLoading();
				}
			});
		}
	}
};
</script>

<style>
page {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
}
.container {
	padding: 0 40rpx;
}

.loginTitle {
	height: 200rpx;
	background-color: #ffffff;
	display: flex;
	padding: 20rpx;
	font-size: 34rpx;
	align-items: center;
	font-weight: bold;
	background: #fdc100;
}

.login-row {
	margin-top: 30rpx;
	height: 90rpx;
	border-bottom: 1px solid #cccccc;
}
.login-row .login-input {
	height: 60rpx;
}

.phoneIcon {
	font-size: 50rpx;
	color: #666666;
	display: inline-block;
	margin-right: 14rpx;
}

.change-loginfun {
	padding: 20rpx 0;
	font-size: 22rpx;
	color: #333333;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.change-type {
	white-space: nowrap;
}

.login-submit {
	padding: 40rpx;
	margin-top: 40rpx;
}

.main-bg-color {
	background: #fdc100;
}
.chebox-style {
	transform: scale(0.7);
}
</style>
