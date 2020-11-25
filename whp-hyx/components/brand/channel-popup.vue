<template>
	<view class="channel-popup" v-if="oppup" :style="{ height: maskHeightCom + 'px', paddingTop: top + 'px' }">
		<cover-view class="channel-mask" @click="handMask" @touchmove.stop.prevent>
			<cover-view class="popup-conent" @click.stop>
				<cover-view class="predefat-view">
					<cover-view class="channel-cloumn">
						<cover-view
							class="channel-row"
							:style="{
								background: sindex === oneIndex ? '#eeeeee' : '#ffffff',
								color: sindex === oneIndex ? '#fdc100' : '#000000'
							}"
							v-for="(sitem, sindex) in coloumOne"
							:key="sitem.id"
							@click="selectItem('oneIndex', sindex)"
						>
							{{ sitem.name }}
						</cover-view>
					</cover-view>
					<cover-view class="channel-cloumn">
						<cover-view
							class="channel-row"
							:style="{
								background: sindex === twoIndex ? '#eeeeee' : '#ffffff',
								color: sindex === twoIndex ? '#fdc100' : '#000000'
							}"
							v-for="(sitem, sindex) in coloumTwo"
							:key="sitem.id"
							@click="selectItem('twoIndex', sindex)"
						>
							{{ sitem.name }}
						</cover-view>
					</cover-view>
					<cover-view class="channel-cloumn">
						<cover-view
							class="channel-row"
							:style="{
								background: sindex === threeIndex ? '#eeeeee' : '#ffffff',
								color: sindex === threeIndex ? '#fdc100' : '#000000'
							}"
							v-for="(sitem, sindex) in coloumThree"
							:key="sitem.id"
							@click="selectItem('threeIndex', sindex)"
						>
							{{ sitem.name }}
						</cover-view>
					</cover-view>
				</cover-view>
				<cover-view class="channel-footer">
					<cover-view class="reset-btn" @click="QuDaoModelReset">重置</cover-view>
					<cover-view class="submit-btn" @click="QuDaoModelSearch">确定</cover-view>
				</cover-view>
			</cover-view>
		</cover-view>
	</view>
</template>

<script>
export default {
	props: {
		newCust: {
			type: Array,
			default: function() {
				return [];
			}
		},
		maskHeight: Number,
		top: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			oppup: false,
			oneIndex: null,
			twoIndex: null,
			threeIndex: null,
			one_category_id: null,
			two_category_id: null,
			three_category_id: null
		};
	},
	watch: {
		oppup: function(newvlaue) {
			console.log(this.maskHeight);
		},
		newCust: function(newvlaue) {
			newvlaue && (this.oneIndex = newvlaue.length - 1);
		}
	},
	computed: {
		maskHeightCom() {
			return this.maskHeight;
		},
		coloumOne() {
			let list = [];
			if (this.newCust.length > 0) {
				list = this.newCust;
			}
			return list;
		},

		coloumTwo() {
			let list = [];
			if (this.coloumOne.length > 0 && this.oneIndex !== null) {
				if (this.coloumOne[this.oneIndex] && this.coloumOne[this.oneIndex].list && this.coloumOne[this.oneIndex].list.length > 0 && this.oneIndex !== null) {
					list = this.coloumOne[this.oneIndex].list;
				}
			}
			return list;
		},

		coloumThree() {
			let list = [];
			if (this.coloumTwo.length > 0 && this.twoIndex !== null) {
				if (this.coloumTwo[this.twoIndex].list && this.coloumTwo[this.twoIndex].list.length > 0 && this.twoIndex !== null) {
					list = this.coloumTwo[this.twoIndex].list;
				}
			}
			return list;
		}
	},

	methods: {
		open() {
			this.oppup = true;
		},
		close() {
			this.oppup = false;
		},
		// 选择渠道查询重置事件
		QuDaoModelReset() {
			this.oneIndex = this.newCust.length - 1;
			this.twoIndex = null;
			this.threeIndex = null;
			this.close();
			this.$emit('qdreset');
		},
		// 选择渠道查询搜索事件
		QuDaoModelSearch() {
			let fromatData = this.renderArg();
			this.close();
			this.$emit('qdsearch', fromatData);
		},

		renderArg() {
			let str = '';
			if (this.oneIndex !== null) {
				this.one_category_id = this.coloumOne[this.oneIndex].id === 'all' ? null : this.coloumOne[this.oneIndex].id;
				this.two_category_id = null;
				this.three_category_id= null;
				str += this.coloumOne[this.oneIndex].name;
			}
			if (this.twoIndex !== null) {
				this.two_category_id = this.coloumTwo[this.twoIndex].id;
				this.three_category_id= null;
				str += `/${this.coloumTwo[this.twoIndex].name}`;
			}
			if (this.threeIndex !== null) {
				this.three_category_id = this.coloumThree[this.threeIndex].id;
				str += `/${this.coloumThree[this.threeIndex].name}`;
			}
			return {
				one_category_id: this.one_category_id,
				two_category_id: this.two_category_id,
				three_category_id: this.three_category_id,
				text: str
			};
		},
		handMask() {
			let fromatData = this.renderArg();
			this.close();
			this.$emit('rqmask', { text: fromatData.text });
		},
		selectItem(val, index) {
			switch (val) {
				case 'oneIndex':
					this.oneIndex = index;
					this.twoIndex = null;
					this.threeIndex = null;
					break;
				case 'twoIndex':
					this.twoIndex = index;
					this.threeIndex = null;
					break;
				case 'threeIndex':
					this.threeIndex = index;
					break;
				default:
					break;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
/* 渠道框 */
.channel-popup {
	position: absolute;
	top: 0px;
	left: 0;
	right: 0;
	height: 0px;
	z-index: 900;
	box-sizing: border-box;
	overflow: hidden;
	.channel-mask {
		// position: absolute;
		// top: 0;
		// left: 0;
		// right: 0;
		// height: 0rpx;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		opacity: 1;
		background: rgba(141, 141, 141, 0.4);
		.popup-conent {
			display: flex;
			flex-direction: column;
			background: #ffffff;
			height: auto;
			// transition: all 300ms linear;
			.predefat-view {
				flex: 1;
				width: 100%;
				display: flex;
				box-sizing: border-box;
				.channel-cloumn {
					height: 100%;
					width: 33.33%;
					display: flex;
					flex-direction: column;
					flex-wrap: nowrap;
					.channel-row {
						height: 80rpx;
						padding: 0 30rpx;
						line-height: 80rpx;
						font-size: 28rpx;
					}
				}
			}
			.channel-footer {
				flex-shrink: 0;
				height: 120rpx;
				display: flex;
				align-items: center;
				justify-content: space-around;
				background: #ffffff;
				border-top: 1px solid #eeeeee;
				.reset-btn {
					width: 270rpx;
					height: 70rpx;
					line-height: 70rpx;
					text-align: center;
					border-radius: 10rpx;
					background-color: #f0f0f0;
					color: #366699;
				}
				.submit-btn {
					width: 270rpx;
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
}
</style>
