<template>
	<view class=" box-bb h-100 w-100 p-3">
		<view class="uni-form-item uni-row border-bottom">
			<view class="iconfont " style="font-size: 50rpx;color: #666666;">&#xe760;</view>
			<view class="with-fun  w-100">
				<input class="uni-input" type="phone" placeholder-style="font-size:26rpx;color:#cccccc;" placeholder="请输入手机号" v-model="mobile" @input="inputMobile" />
				<view class="uni-icon uni-icon-clear" v-if="mobile.length" @click="clearIcon('mobile')"></view>
			</view>
		</view>
		<view class="uni-form-item w-100 box-bb d-flex a-center border-bottom">
			<view class="iconfont " style="font-size: 50rpx; color: #666666;">&#xe610;</view>
			<view class="with-fun  flex-1 d-flex a-center pr-2">
				<input class="uni-input" placeholder="请输入验证码" v-model="code" />
				<view
					class="flex-shrink"
					v-bind:style="{ background: captchaBtnBackColor }"
					style="border-radius: 20rpx;width: 170rpx; color: #FFFFFF;line-height: 60rpx; text-align: center; height: 60rpx;"
					@click="getCode"
				>
					{{ codeNuming ? codeNuming + 's' : '获取验证码' }}
				</view>
			</view>
		</view>
		<view class="uni-form-item uni-row border-bottom">
			<view class="iconfont " style="font-size: 50rpx;color: #666666;">&#xe651;</view>
			<view class="with-fun  w-100">
				<input type="password" class="uni-input" placeholder="请输入新密码" v-model="oldPassword" placeholder-style="font-size:26rpx;color:#cccccc;" />
				<view class="uni-icon uni-icon-clear" v-if="oldPassword.length" @click="clearIcon('oldPassword')"></view>
			</view>
		</view>
		<view class="uni-form-item uni-row border-bottom">
			<view class="iconfont " style="font-size: 50rpx;color: #666666;">&#xe651;</view>
			<view class="with-fun  w-100">
				<input type="password" class="uni-input" placeholder="请输入新密码" v-model="newPassword" placeholder-style="font-size:26rpx;color:#cccccc;" />
				<view class="uni-icon uni-icon-clear" v-if="oldPassword.length" @click="clearIcon('newPassword')"></view>
			</view>
		</view>

		<view class="submit_btn"><button @click="onqd()" class="text-white main-bg-color" hover-class="main-bg-hover-color">登录</button></view>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { fnencrypt } from '@/common/rsa/rsa.js';
import rsa from '@/common/rsa/rsa.js';
export default {
	data() {
		return {
			mobile: '',
			code: '', //验证码
			oldPassword: '', //密码
			newPassword: '', //确认密码
			// 显示清空图标
			showClearIcon: false,
			codeNuming: 0,
			captchaBtnBackColor: '#CCCCCC'
		};
	},
	onLoad() {
		this.mobile = this.loginInfo.mobile;
	},
	onShow() {
		rsa.gergs();
		if (this.mobile && this.mobile.length == 11) {
			this.captchaBtnBackColor = '#fdc100';
		}
	},
	computed: {
		...mapState({
			loginInfo: state => state.user.loginInfo
		})
	},
	methods: {
		...mapMutations(['setRole']),
		onqd() {
			//提交
			let checkMobile = /^(?=.*[a-z])(?=.*[A-Z])(?![0-9]+$)[A-Za-z0-9]{8,20}$/;
			if (!this.mobile || this.mobile.length != 11) {
				uni.showToast({
					title: '请输入正确的手机号',
					icon: 'none'
				});
				return;
			} else if (!checkMobile.test(this.oldPassword)) {
				uni.showToast({
					title: '密码由8到20位数，字母大小写加数字组成',
					icon: 'none'
				});
				return;
			} else if (this.oldPassword != this.newPassword) {
				uni.showToast({
					title: '两次密码不匹配，请重新输入',
					icon: 'none'
				});
				return;
			} else if (!this.code) {
				uni.showToast({
					title: '请输入验证码',
					icon: 'none'
				});
				return;
			}
			let data = {
				opt_type: 0,
				mobile: fnencrypt(this.mobile),
				newpwd: fnencrypt(this.oldPassword),
				auth_code: this.code,
				private_key: rsa.gerprivateKey()
			};
			uni.showLoading({
				title: '修改中...',
				mask: true
			});
			this.$myRequest({
				type: 'login',
				url: this.$myhttpUrl.updatePwdOrPaypwd,
				data: data,
				success: res => {
					uni.showToast({
						title: '修改成功',
						icon: 'success'
					});
					let userinfo = uni.getStorageSync('userInfo');
					userinfo.show_change_pwd = false;
					this.setRole(userinfo);
					setTimeout(function() {
						uni.switchTab({
							url: '/pages/main/main'
						});
					}, 1500);
				},
				fail: err => {
					uni.showToast({
						title: err.message,
						icon: 'none'
					});
				}
			});
		},
		// 清空数据
		clearIcon(val) {
			this[val] = '';
			this.showClearIcon = false;
			if (!this.mobile || this.mobile.length != 11) {
				this.captchaBtnBackColor = '#CCCCCC';
			}
		},
		//获取验证码
		getCode() {
			if (!this.mobile || this.mobile.length != 11) {
				uni.showToast({
					title: '请输入正确的手机号码',
					icon: 'none'
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
				url: this.$myhttpUrl.sendAuthCode4updatePwd,
				data: {
					mobile: this.mobile,
					is_biz: 1
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
						icon: 'none'
					});
				}
			});
		},
		inputMobile() {
			if (this.mobile && this.mobile.length == 11) {
				this.captchaBtnBackColor = '#fdc100';
			} else {
				this.captchaBtnBackColor = '#CCCCCC';
			}
		}
	}
};
</script>

<style scoped>
.loginTitle {
	height: 200rpx;
	width: 100%;
	background-color: #ffffff;

	display: flex;
	align-items: center;
	font-weight: bold;
}

.uni-form-item .title {
	padding: 10upx 25upx;
}

.uni-icon-clear,
.uni-icon-eye {
	color: #999;
}

.input-placeholder {
	font-size: 14rpx;
	color: red;
}

.getcode {
	background: #fdc100;
	padding: 0 20rpx;
	color: #ffffff;
	font-size: 24rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 20rpx;
	line-height: 1;
}

.main-bg-color {
	background: #fdc100;
}
.submit_btn {
	margin-top: 80rpx;
}
</style>
