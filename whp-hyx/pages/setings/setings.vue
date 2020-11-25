<template>
	<view class="w-100 bgcolor">
		<view class="  w-100 ">
			<view class="p-2 d-flex a-center bg-white" >
				<view class="userPic mr-2" >
					<image :src="userInfo.imagename" class="userPic_img" ></image>
				</view>
				<view class="username flex-1">{{ userInfo.username }}</view>
			</view>
			<view class="mt-3 bg-white ">
				<view class="p-2 d-flex a-center px-2 border-bottom">
					<view class="font-md">姓名</view>
					<input class="flex-1" type="text" disabled v-model="userInfo.name" />
					
				</view>
				<view class="p-2 d-flex a-center px-2 border-bottom" >
					<view class="font-md">性别</view>
					<input class="flex-1" type="text" disabled :value="userInfo.gender == 0 ? '男' : '女'" />
				</view>
			</view>

			<view class="mt-3 bg-white ">
				<picker mode="date" disabled :start="startDate" :end="endDate" >
					<view class="p-2 d-flex a-center px-2 border-bottom">
						<view class="font-md">生日</view>
						<input class="flex-1" type="text" disabled :value="userInfo.birth" />
					</view>
				</picker>

				<view class="p-2 d-flex a-center px-2 border-bottom">
					<view class="font-md">个性签名</view>
					<input class="flex-1" type="text" disabled :value="userInfo.memo" />
				</view>
			</view>
			<view class="mt-3 bg-white ">
				<view class="p-2 d-flex a-center px-2 border-bottom">
					<view class="font-md">手机号</view>
					<input class="flex-1" type="text" disabled :value="userInfo.mobile" />
				</view>

				<!-- <view class="p-2 d-flex j-sb a-center px-2 border-bottom" @click="deitPassword">
					<view class="font-md">修改账号密码</view>
					<view class="iconfont">&#xe770;</view>
				</view> -->
			</view>
			<view class="mt-3 bg-white"  @click="outlogin">
				<view class="p-2 d-flex a-center px-2 border-bottom"><view class="font-md" style="color: skyblue;">退出登录</view></view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {
			disabled: false
		};
	},

	computed: {
		...mapState({
			userInfo: state => state.user.userinfo
		})
	},
	methods: {
		// editinfo 修改数据方法 传值({key,value})
		...mapMutations(['editinfo', 'removeUserInfoStorage']),
		
		// deitPassword() {
		// 	this.$myNavigateTo('/pages/login/pwd');
		// },
		outlogin() {
			uni.showLoading({
				title: '正在退出...',
				mask: true
			});
			this.$myRequest({
				url: this.$myhttpUrl.unbind,
				success: res => {
					if (!res.is_auth) {
						this.removeUserInfoStorage();
						uni.showToast({
							title:"退出成功"
						})
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/login/login'
							});
						}, 1500);
					}
				},
				fail: err => {
					uni.showToast({
						title:'退出失败',
						icon:'none'
					})
				}
				
			});
		},
		sendrequest(data, callback = false) {
			this.$myRequest({
				url: this.$myhttpUrl.update_getInfo,
				data: data,
				success: res => {
					if (typeof callback === 'function') {
						callback();
					}
				},
				fail: err => {
					uni.showToast({
						title:err.message,
						icon:'none'
					})
				}
			});
		},
		
	}
};
</script>

<style lang="scss">
.bgcolor {
	background-color: #eeeeee;
}
input {
	text-align: right;
	font-size: 26rpx;
	color: #999999;
}
.userPic{
	width:100rpx; height: 100rpx; border-radius: 100rpx;
	overflow: hidden;
	.userPic_img{
		width:100rpx; height: 100rpx;
	}
}
</style>
