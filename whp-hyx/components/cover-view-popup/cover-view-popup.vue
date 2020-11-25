<template>
	<view  v-if="oppup" class="currt-page" :style="{ height: maskHeight + 'px', paddingTop: top + 'px' }">
		<cover-view class="channel-popup" @touchmove.stop.prevent @click="closePopup" :style="{ opacity: oppup ? '1' : '0' }">
			<cover-view class="content" @click.stop>
				<cover-view class="channel-mask">
					<cover-view class="channel-cloumn">
						<cover-view class="channel-row" hover-class="hover-channel-row"  v-for="(item, index) in list" :key="item.id" @click="chang(index, item)">
							<cover-view>{{ item.text }}</cover-view>
							<cover-image v-show="active == index" src="/static/img/check-icon.png" class=" bingo"></cover-image>
						</cover-view>
					</cover-view>
				</cover-view>
				<cover-view class="channel-footer"><cover-view class="submit-btn" @click="submit">确定</cover-view></cover-view>
			</cover-view>
		</cover-view>
	</view>
</template>

<script>
export default {
	props: {
		top: {
			type: Number,
			default: 0
		},
		maskHeight: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			oppup: false,
			active: 0,
			list: [
				{
					id: 1,
					text: '全部导购'
				},
				{
					id: 2,
					text: '有专职导购'
				},
				{
					id: 3,
					text: '有兼职导购'
				},
				{
					id: 4,
					text: '无导购'
				}
			]
		};
	},

	computed: {},
	methods: {
		open() {
			this.oppup = true;
		},

		closePopup() {
			this.oppup = false;
		},
		chang(index, item) {
			if (this.active === index) return;
			this.active = index;
			console.log(item);
		},
		submit() {
			this.$emit('submit', this.list[this.active]);
			this.closePopup();
		}
	}
};
</script>

<style scoped lang="scss">
page {
	width: 100%;
	height: 100%;
}
.currt-page {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 0px;
	z-index: 900;
	box-sizing: border-box;
	overflow: hidden;
}
.channel-popup {
	width: 100%;
	height: 100%;
	opacity: 0;
	background: rgba(161, 161, 161, 0.5);
	transition: all 400ms linear;
	z-index: 900;
	.content {
		background-color: #ffffff;
		display: flex;
		flex-direction: column;
		.channel-mask {
			width: 100%;
			padding-bottom: 30rpx;
			background-color: #ffffff;
			display: flex;
			.channel-cloumn {
				width: 100%;
				.hover-channel-row{
					background: rgba(229, 229, 229, 0.5);
				}
				.channel-row {
					display: flex;
					align-items: center;
					justify-content: space-between;
					color: #333333;
					padding: 0 30rpx;
					height: 100rpx;
					font-size: 30rpx;
					// border: 1rpx solid #EEEEEE;
					.bingo {
		               width: 40rpx;
					   height: 40rpx;
					}
				}
			}
		}
		.channel-footer {
			margin-top: 120rpx;
			padding: 40rpx;
			display: flex;
			align-items: center;
			justify-content: space-around;
			background: #ffffff;
			.submit-btn {
				width: 680rpx;
				height: 70rpx;
				line-height: 70rpx;
				text-align: center;
				border-radius: 10rpx;
				background-color: #fdc100;
				color: #ffffff;
			}
		}
	}
}
</style>
