<template>
	<view>
		<view class="main-lis">
			<view class="lis-title" @click="childShow = !childShow">
				<view>
					<text class="iconfont color-ddd">&#xe71a;</text>
					<text class="iconfont color-r1">&#xe7b9;</text>
					<text class="text">{{data.member_name}}</text>
				</view>
				<view>
					<text class="iconfont color-g2" v-if="data.selection">&#xe61f;</text>
					<text class="iconfont color-g1" v-if="!data.selection">&#xe634;</text>
				</view>
			</view>
			<view class="lis-child" v-if="data.list && childShow">
				<view class="lis-child-title" @click="onchild(c, index)" v-for="(c, index) in data.list" :key="c.store_id">
					<view>
						<text class="iconfont color-r2">&#xe7b9;</text>
						<text class="text">{{c.name}}</text>
					</view>
					<view>
						<text class="iconfont color-g2" v-if="c.selection">&#xe61f;</text>
						<text class="iconfont color-g1" v-if="!c.selection">&#xe634;</text>
						
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: ['screen', 'index'],
		data() {
			return {
				data: this.screen,
				childShow: false
			};
		},
		created() {
			console.log(this.screen);
		},
		
		methods: {
			onchild(child, indexs){
				this.data.list[indexs].selection = !this.data.list[indexs].selection;
				this.$emit("onscreen", {index: this.index, childindex: indexs});
				this.dataLis();
			},
			dataLis(){
				for(let i in this.data.list){
					if(this.data.list[i].selection){
						this.data.selection = true;
						return
					}
				}
				this.data.selection = false;
			}
		}
	};
</script>

<style lang="scss">
	.main-lis{
		.lis-title{
			width: 710upx;
			height: 74upx;
			line-height: 74upx;
			padding: 20upx;
			background-color: #fff;
			display: flex;
			justify-content: space-between;
			font-size: 32upx;
			border-bottom: 2upx solid #f0f0f0;
			.color-ddd{
				font-size: 28upx;
				margin-right: 20upx;
			}
			.color-r1{
				margin-right: 20upx;
			}
		}
		.lis-child{
			.lis-child-title{
				width: 670upx;
				min-height: 74upx;
				padding: 20upx;
				padding-left: 60upx;
				display: flex;
				justify-content: space-between;
				font-size: 32upx;
				border-bottom: 2upx solid #f0f0f0;
				.color-r2{
					margin-right: 20upx;
				}
			}
		}
	}
	
	.color-ddd{
		color: #DDDDDD !important;
	}
	.color-r1{
		color: #F5A623 !important;
	}
	.color-r2{
		color: #42DC61 !important;
	}
	.color-g1{
		color: #BDC3C7 !important;
	}
	.color-g2{
		color: #FDC100 !important;
	}
</style>