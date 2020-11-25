<template>
	<cover-view v-if="oppup" :class="oppup ? 'layout' : ''" :style="{ top: top + 'px' }" class="channel-popup" @touchmove.stop.prevent @click="closePopup">
		<cover-view @click.stop>
			<cover-view class="channel-mask">
				<cover-view class="channel-cloumn">
					<cover-view
						class="channel-row"
						v-for="(sitem, sindex) in coloumOne"
						:key="sitem.id"
						:style="{ background: sindex === oneIndex ? '#eeeeee' : '#ffffff', color: sindex === oneIndex ? '#fdc100' : '#000000' }"
						@click="selectItem('oneIndex', sindex)"
					>
						{{ sitem.name }}
					</cover-view>
				</cover-view>
				<cover-view class="channel-cloumn">
					<cover-view
						class="channel-row"
						:style="{ background: sindex === twoIndex ? '#eeeeee' : '#ffffff', color: sindex === twoIndex ? '#fdc100' : '#000000' }"
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
						:style="{ background: sindex === threeIndex ? '#eeeeee' : '#ffffff', color: sindex === threeIndex ? '#fdc100' : '#000000' }"
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
</template>

<script>
export default {
	props: {
		top: {
			type: Number,
			default: 0
		},
		datalist: {
			type: Object,
			default: () => {
				return {
					isload: false,
					data: []
				};
			}
		}
	},
	data() {
		return {
			oneIndex: 3,
			twoIndex: null,
			threeIndex: null,
			one_category_id: null,
			two_category_id: null,
			three_category_id: null,
			qudaoName: '',
			oppup: false
		};
	},

	computed: {
		newCust() {
			console.log(this.datalist, 'computed');
			return this.datalist;
		},
		coloumOne() {
			let list = [];
			if (this.newCust && this.newCust.isload && this.newCust.data.length > 0) {
				list = this.newCust.data;
			}
			return list;
		},

		coloumTwo() {
			let list = [];
			if (this.coloumOne.length > 0 && this.oneIndex !== null) {
				if (this.coloumOne[this.oneIndex].list && this.coloumOne[this.oneIndex].list.length > 0 && this.oneIndex !== null) {
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
		// 选择渠道查询搜索事件
		QuDaoModelSearch() {
			let str = '';
			if (this.oneIndex !== null) {
				this.one_category_id = this.coloumOne[this.oneIndex].id === 'all' ? null : this.coloumOne[this.oneIndex].id;
				str += this.coloumOne[this.oneIndex].name;
			}
			if (this.twoIndex !== null) {
				this.two_category_id = this.coloumTwo[this.twoIndex].id;
				str += `/${this.coloumTwo[this.twoIndex].name}`;
			}
			if (this.threeIndex !== null) {
				this.three_category_id = this.coloumThree[this.threeIndex].id;
				str += `/${this.coloumThree[this.threeIndex].name}`;
			}
			this.qudaoName = str;
			this.oppup = false;
			this.$emit('submit', { one_category_id: this.one_category_id, two_category_id: this.two_category_id, three_category_id: this.three_category_id, text: this.qudaoName });
		},
		// 选择渠道查询重置事件
		QuDaoModelReset() {
			let typeVal;
			if (this.tabindex === 0) {
				typeVal = 'distribution';
			} else if (this.tabindex === 1) {
				typeVal = 'agency';
			}
			this.oneIndex = 3;
			this.twoIndex = null;
			this.threeIndex = null;
			this.pagenumber = 1;
			this.one_category_id = null;
			this.two_category_id = null;
			this.three_category_id = null;
			this.qudaoName = '全部客户';
			this.oppup = false;
			this.$emit('reset', { one_category_id: this.one_category_id, two_category_id: this.two_category_id, three_category_id: this.three_category_id, text: this.qudaoName });
		},
		selectItem(val, index) {
			this[val] = index;
			switch (val) {
				case 'oneIndex':
					this.twoIndex = null;
					this.threeIndex = null;
					break;
				case 'twoIndex':
					this.threeIndex = null;
					break;
				case 'threeIndex':
					break;
			}
		},
		closePopup() {
			let str = '';
			if (this.oneIndex !== null) {
				this.one_category_id = this.coloumOne[this.oneIndex].id === 'all' ? null : this.coloumOne[this.oneIndex].id;
				str += this.coloumOne[this.oneIndex].name;
			}
			if (this.twoIndex !== null) {
				this.two_category_id = this.coloumTwo[this.twoIndex].id;
				str += `/${this.coloumTwo[this.twoIndex].name}`;
			}
			if (this.threeIndex !== null) {
				this.three_category_id = this.coloumThree[this.threeIndex].id;
				str += `/${this.coloumThree[this.threeIndex].name}`;
			}
			this.qudaoName = str;
			this.oppup = false;
		}
	}
};
</script>

<style scoped lang="scss">
/* 渠道框 */
.layout {
	animation: turnmy 0.2s linear 1;
	-webkit-animation: turnmy 0.2s linear 1;
	-webkit-animation-fill-mode: forwards;
	animation-fill-mode: forwards;
}
@keyframes turnmy {
	0% {
		transform: translateY(-100%);
	}
	80% {
		background: rgba(0, 0, 0, 0.2);
	}
	100% {
		transform: translateY(0%);
		background: rgba(0, 0, 0, 0.4);
	}
}
@-webkit-keyframes turnmy {
	0% {
		transform: translateY(-100%);
	}
	80% {
		background: rgba(0, 0, 0, 0.2);
	}
	100% {
		transform: translateY(0%);
		background: rgba(0, 0, 0, 0.4);
	}
}
.layint {
	transform: translateY(-100%);
}
.channel-popup {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 100;
	background: rgba(0, 0, 0, 0);
	.channel-mask {
		width: 100%;
		height: auto;
		padding-bottom: 30rpx;
		background-color: #ffffff;
		display: flex;
		.channel-cloumn {
			width: 33.33%;
			display: flex;
			flex-direction: column;
			.channel-row {
				height: 80rpx;
				padding: 0 30rpx;
				line-height: 80rpx;
				font-size: 28rpx;
				// border-bottom: 1rpx solid #eeeeee;
				// border-right: 1rpx solid #eeeeee;
			}
		}
	}
	.channel-footer {
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
</style>
