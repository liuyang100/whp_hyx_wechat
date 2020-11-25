<template>
	<view>
		<view class="lis" @click="gopage(n)" v-for="n in data" :key="n.article_id">
			<view class="listext">
				<view class="title">{{ n.title }}</view>
				<text class="datetime">{{ n.time }}</text>
			</view>
			<view class="image"><image class="img" :src="n.img"></image></view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			data: null,
			onchild: null
		};
	},
	onLoad(option) {
		this.getNotice();
	},

	onPullDownRefresh() {
		//下拉刷新
		this.getNotice();
		setTimeout(function() {
			uni.stopPullDownRefresh();
		}, 1000);
	},
	methods: {
		gopage(obj) {
			this.onchild = obj;
			this.$myNavigateTo('/pages/noticechild/noticechild');
		},
		getNotice() {
			this.$myRequest({
				url: this.$myhttpUrl.articleList,
				success: res => {
					this.data = res.date;
				},
				fail: err => {
					uni.showToast({
						title: err.message,
						icon: 'none'
					});
				}
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #f6f6f6;
}
.lis {
	width: 710rpx;
	height: 180rpx;
	padding: 20rpx;
	background-color: #ffffff;
	border-bottom: 2rpx solid #f6f6f6;
	display: flex;
	.listext {
		height: 180rpx;
		flex: 1;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		.title {
			flex: 1;
			display: block;
			box-sizing: border-box;
			width: 100%;
			font-size: 34rpx;
			font-weight: 600;
			overflow: hidden; 
			text-overflow: ellipsis; 
			display: -webkit-box; 
			-webkit-line-clamp: 2; 
			-webkit-box-orient: vertical; 
			vertical-align: bottom;
		}
		.datetime {
			margin-top: auto;
			height: 50rpx;
			line-height: 50rpx;
			color: #888;
		}
	}
	.image {
		width: 230rpx;
		height: 180rpx;
		flex-shrink: 0;
		.img {
			width: 100%;
			height: 100%;
		}
	}
}
</style>
