<template>
	<view class="row box-bb p-2">
		<view class="span-4 mb-2 d-flex flex-column a-center j-center" v-for="(item, index) in navList" :key="item.id" @click="clicknav(item)">
			<image :src="item.src" class="nav_img"></image>
			<view class="nav_name">{{ item.name }}</view>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	props: {
		navList: Array
	},
	computed: {
		...mapState({
			isLogin: state => state.user.isLogin,
			role_code: state => state.user.role_code
		})
	},
	methods: {
		clicknav(item) {
			if (!this.isLogin) {
			 return	uni.showToast({
					title:'还没有登录, 前往登录。',
					icon:'none'
				})
			}

			// 判断是否有访问权限
			if (!item.role_code.includes(this.role_code)) {
				return uni.showToast({
					title: '无权限访问',
					icon: 'none'
				});
			}
			if (!item.isreq) {
				return uni.showToast({
					title: '暂未对外开放...',
					icon: 'none',
					duration: 3000
				});
			}
			let path = item.path;
			if (path) {
				this.$myNavigateTo(path);
			}
		}
	}
};
</script>

<style scoped>
/* nav */
.nav_img {
	width: 120rpx;
	height: 120rpx;
}
.nav_name {
	font-size: 26rpx;
}
</style>
