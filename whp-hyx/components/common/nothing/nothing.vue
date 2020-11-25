<template>
	<view class="nothings">
		<view class="not-content">
			<!-- <image src="/static/img/nothing/no_comment.png" class="img"></image> -->
			<text class="text-info" >暂时没有数据哦~~</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'nothing',
	
	}
</script>

<style lang="scss" >
	.nothings{
		height: 100%;
		width: 100%;
		display: flex;
		.not-content{
			flex:1;
			background-color: #F5F5F5;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			.img{
				width: 60%;
				height: 60%;
			}
			.text-info{
				margin-top: 30rpx;
				color: #7d7d7d!important;
				font-size: 30rpx;
			}
			// .not-text{
			// 	display: flex;
			// 	align-items: center;
			// 	justify-content: center;
			// 	margin-top: 50rpx;
			// 	.text-info{
			// 		color: #7d7d7d!important;
			// 		font-size: 44rpx;
			// 	}
			// }
			
		}
	}

</style>
