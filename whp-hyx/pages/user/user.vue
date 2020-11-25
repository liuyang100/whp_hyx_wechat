<template>
	<view class="content w-100">
		<uni-status-bar bgcolor="#fdc100"></uni-status-bar>
		<view class="userInfo main-bg-color">
			<view class="desc" v-if="isLogin">
				<image :src="userinfo.imagename" class="userpicer"></image>
				<view class="user-right">
					<view class="user-name">{{ userinfo.name }}</view>
					<view class="user-adress" v-if="userinfo.company_name">{{ userinfo.company_name }}</view>
				</view>
			</view>
			<view class="desc" v-else>
				<view class="userpicer"></view>
				<!-- <image src="" ></image> -->
				<view class="user-right" style="margin-left:50rpx;"><button type="primary" size="mini" @click="gologin">立即登录</button></view>
			</view>
		</view>
		<view class="nav-list">
			<view class="nav-list-item">
				<view class="icon-box" style="background-color:#FEC208"><view class="iconfont" style="font-size: 60rpx;">&#xe6bf;</view></view>

				<view class="name">全部排名</view>
			</view>
			<view class="nav-list-item">
				<view class="icon-box" style="background-color:#FF832B"><view class="iconfont" style="font-size: 50rpx;">&#xe631;</view></view>

				<view class="name">机型采购排名</view>
			</view>
			<view class="nav-list-item">
				<view class="icon-box" style="background-color:#478AFF"><view class="iconfont" style="font-size: 50rpx;">&#xe632;</view></view>

				<view class="name">机型零售排名</view>
			</view>
		</view>

		<view class="list_items" @click="seting">
			<view class="flex-1 w-100 d-flex a-center">
				<view class="iconfont pr-2" style="color: #478AFF;font-size: 40rpx;">&#xe71f;</view>
				设置
			</view>
			<view class="iconfont" style="font-size: 40rpx;">&#xe770;</view>
		</view>
	</view>
</template>

<script>
import uniStatusBar from '@/components/uni/uni-status-bar/uni-status-bar.vue';
import { mapState, mapMutations } from 'vuex';
export default {
	components: {
		uniStatusBar
	},
	data() {
		return {
			count: 0
		};
	},
	computed: {
		...mapState({
			userinfo: state => state.user.userinfo,
			loginInfo: state => state.user.loginInfo,
			role_code: state => state.user.role_code,
			is_has_company: state => state.user.is_has_company,
			isLogin: state => state.user.isLogin
		})
	},
	onLoad() {
		if (this.isLogin) {
			this.getuserInfo();
		}
	},

	methods: {
		...mapMutations(['getinfo', 'removeUserInfoStorage']),
		gologin() {
			this.removeUserInfoStorage();
			uni.reLaunch({
				url: '/pages/login/login'
			});
		},
		getuserInfo() {
			this.$myRequest({
				url: this.$myhttpUrl.member_getInfo,
				success: res => {
					// 调用vuex中存储数据
					let result = res;
					this.getinfo(result);
				},
				fail: err => {
					while (this.count < 3) {
						this.getuserInfo();
						this.count++;
					}
					uni.showToast({
						title: err.message,
						icon: 'none'
					});
				}
			});
		},
		seting() {
			if (!this.isLogin) {
				return uni.showToast({
					title: '还没有登录, 前往登录。',
					icon: 'none'
				});
			}
			uni.navigateTo({
				url: '/pages/setings/setings'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.userInfo {
	width: 100%;
	height: 300rpx;
	box-sizing: border-box;
	padding: 100rpx 0 0 30rpx;
	.desc {
		display: flex;
		align-items: center;
		.userpicer {
			width: 124rpx;
			height: 124rpx;
			border-radius: 124rpx;
			background: #eeeeee;
		}
		.user-right {
			padding-left: 30rpx;
			.user-name {
				font-size: 40rpx;
				color: #fefefe;
				font-weight: bold;
				line-height: 2;
			}
			.user-adress {
				margin-top: 10rpx;
				line-height: 1.6;
				display: flex;
				font-size: 28rpx;
				padding: 0 30rpx;
				color: #fefefe;
				border-radius: 40rpx;
				border: 1rpx solid #fefefe;
				display: inline-block;
			}
		}
	}
}
.nav-list {
	width: 100%;
	height: 231rpx;
	display: flex;
	align-items: center;
	background-color: #ffffff;
	.nav-list-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.icon-box {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100rpx;
			height: 100rpx;
			border-radius: 100rpx;
			.iconfont {
				color: #ffffff;
			}
		}

		.name {
			padding-top: 10rpx;
			font-size: 28rpx;
			color: #333333;
		}
	}
}
.content {
	box-sizing: border-box;
	background-color: #eeeeee;

	.list_items {
		width: 100%;
		height: 90rpx;
		margin-top: 20rpx;
		box-sizing: border-box;
		padding-left: 20rpx;
		padding-right: 20rpx;
		font-size: 32rpx;
		display: flex;
		align-items: center;
		background-color: #ffffff;
	}
}
</style>
