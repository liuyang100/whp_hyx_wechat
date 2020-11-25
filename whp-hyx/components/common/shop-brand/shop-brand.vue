<template>
	<view class="shop-list" >
		<!-- 店铺下品牌品类 -->
		<view class="text-title " >
			<view class="name">{{ item.super_store_name }}</view>
			<view class="delete" v-if="!disabled" @click="deleteStop">删除</view>
		</view>
		<view class="d-flex a-center mt-1" v-for="(subitem,sindex) in item.business_category_list" :key="subitem.business_category_id">
			<label for="" class="d-flex a-center">
				<checkbox :disabled="disabled" color="#fdc100" @click="stopChang(sindex)" style="transform:scale(0.7)"  :checked="subitem.checked"></checkbox>
			{{ subitem.business_category_name }}
			</label>
			<view v-if="subitem.checked" style="font-size: 24rpx;color: #6D6D72; margin-left: auto; display: flex;line-height: 24rpx;" @click="goarchivesScreen(sindex)">
				<text>{{ subitem.supervisor_name || '请选择终端主管' }}</text>
				<view class="iconfont">&#xe601;</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		// props:['item','index','disabled'],
		props:{
			item:{
				type:Object
			},
			index:{
				type:Number
			},
			disabled:{
				type:Boolean,
				default:false
			}
		},
		methods:{
			stopChang(sindex){
				if(this.disabled){ return }
				this.$emit('stopChang',this.index,sindex)
			},
			goarchivesScreen(sindex){
				if(this.disabled){ return }
				this.$emit("goarchivesScreen",this.index,sindex)
			},
			deleteStop(){
				if(this.disabled){ return }
				this.$emit("deleteStop",this.index)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.shop-list {
		width: 100%;
		box-sizing: border-box;
		background-color: #eeeeee;
		padding: 10rpx 30rpx 20rpx 30rpx;
		color: #333333;
		border-bottom: 4rpx solid #ffffff;
		.text-title {
			width: 100%;
			border-bottom: 1px solid #CCCCCC;
			display: flex;
			font-size: 30rpx;
			.name {
				flex: 1;
				overflow: hidden;
				padding-right: 20rpx;
			}
			.delete {
				flex-shrink: 0;
				color: #007aff;
			}
		}
		.redio-list {
			width: 100%;
			box-sizing: border-box;
			display: flex;
			flex-wrap: wrap;
			.rlabel {
				display: flex;
				align-items: center;
				padding-right: 0;
				font-size: 28rpx;
				width: 33.33%;
				height: 50rpx;
				margin: 10rpx 0 0 0;
				text {
					height: 50rpx;
					white-space: nowrap;
					line-height: 50rpx;
				}
			}
		}
		
	}
</style>
