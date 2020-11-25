<template>
	<uni-popup ref="popup_view" type="bottom">
		<view class="time-module">
			<view class="time-head">
				<view class="time-item" :class="activeIndex === 0 ? 'active' : ''" @click="selectTime(0)">
					<text class="name">开始时间</text>
					<text class="tis">{{ starttime_str || '请选择' }}</text>
				</view>
				<view class="time-item" :class="activeIndex === 1 ? 'active' : ''" @click="selectTime(1)">
					<text class="name">结束时间</text>
					<text class="tis">{{ endtime_str || '请选择' }}</text>
				</view>
			</view>
			<view class="time-main">
				<view class="line-style"></view>
				<picker-view class="picker-view-style" style="width: 100%;height: 100%;" indicator-style="height: 50px;" :value="value" @change="bindChange">
					<picker-view-column style="border-right: 1px solid #eee;">
						<view class="item" v-for="(item, index) in years" :key="index">{{ item }}年</view>
					</picker-view-column>
					<picker-view-column style="border-right: 1px solid #eee;">
						<view class="item" v-for="(item, index) in months" :key="index">{{ item }}月</view>
					</picker-view-column>
					<picker-view-column>
						<view class="item" v-for="(item, index) in days" :key="index">{{ item }}日</view>
					</picker-view-column>
				</picker-view>
			</view>
			<view class="footer">
				<view class="btn cancel-btn" @click="cancel">取消</view>
				<view class="btn confirm-btn" @click="confirm">确定</view>
			</view>
			<!-- 取消按钮 -->
			<view class="iconfont close" @click="close">&#xe61b;</view>
		</view>
	</uni-popup>
</template>
<script>
import uniPopup from '@/components/uni/uni-popup/uni-popup.vue';
import { getDaysNum } from '@/ulits/function/timeFormat.js';
export default {
	components: {
		uniPopup
	},
	data() {
		const date = new Date();
		const years = [];
		const year = date.getFullYear();
		const months = [];
		const month = date.getMonth() + 1;
		const day = date.getDate();
		for (let i = date.getFullYear() - 10; i <= date.getFullYear() + 10; i++) {
			years.push(i);
		}
		for (let i = 1; i <= 12; i++) {
			months.push(i);
		}

		return {
			changedays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
			activeIndex: 0,
			years,
			year: date.getFullYear(),
			months,
			month: date.getMonth() + 1,
			day: date.getDate(),
			value: [0, 0, 0],
			start_item: {},
			end_item: {},
			starttime_str: '',
			endtime_str: '',
			starttime_isload: false,
			endtime_isload: false
		};
	},

	computed: {
		days() {
			const daysNum = getDaysNum(this.year, this.month);
			return this.changedays.slice(0, daysNum);
		}
	},
	created() {
		this.$nextTick(() => {
			this.value = [10, this.month - 1, this.day - 1];
		});
	},
	methods: {
		formateDays() {},
		selectTime(ins) {
			if (ins === 0) {
				if (this.activeIndex === 0) return;
				this.end_item = {};
				this.endtime_str = '';
				this.endtime_isload = false;
				this.activeIndex = 0;
			} else if (ins === 1) {
				if (this.activeIndex === 1) return;
				const timeobj ={
						year: this.year,
						month: this.month,
						day: this.day
				}
				this.start_item = this.startTimeFun(timeobj);
				this.starttime_str = `${this.start_item.year}.${this.start_item.month}.${this.start_item.day}`;
				this.endtime_isload = true;
				this.end_item = this.startTimeFun(timeobj);
				
				this.endtime_str = `${this.end_item.year}.${this.end_item.month}.${this.end_item.day}`;
				this.activeIndex = 1;
				
			}
		},

		startTimeFun(obj) {
			if (Object.prototype.toString.call(obj) == '[object Object]') {
				for (let key in obj) {
					let val = obj[key].toString();
					if (val.length < 2) {
						obj[key] = '0' + obj[key];
					} else {
						obj[key] = val;
					}
				}
			}
			return obj;
		},
		bindChange(e) {
			const [yearIndex, monthIndex, dayIndex] = e.detail.value;
			this.year = this.years[yearIndex];
			this.month = this.months[monthIndex];
			this.day = this.days[dayIndex];
			let timeobj = {
				year: this.years[yearIndex],
				month: this.months[monthIndex],
				day: this.days[dayIndex]
			};
			if (this.activeIndex === 0) {
				this.starttime_isload = true;
				this.start_item = this.startTimeFun(timeobj);
				this.starttime_str = `${this.start_item.year}.${this.start_item.month}.${this.start_item.day}`;
			} else if (this.activeIndex === 1) {
				this.endtime_isload = true;
				this.end_item = this.startTimeFun(timeobj);

				this.endtime_str = `${this.end_item.year}.${this.end_item.month}.${this.end_item.day}`;
			}
		},
		open() {
			this.$refs['popup_view'].open();
		},
		close() {
			this.$refs['popup_view'].close();
		},
		cancel() {
			this.starttime_isload = false;
			this.endtime_isload = false;
			this.endtime_isload = false;
			this.activeIndex = 0;
			this.endtime_str = '';
			this.starttime_str = '';
			this.start_item = null;
			this.end_item = null;
			this.$emit('cancel');
			this.close();
		},
		confirm() {
			this.$nextTick(() => {
				if (!this.endtime_isload) {
					return uni.showToast({
						title: '请选择结束时间',
						icon: 'none',
						duration: 2000
					});
				}
				if (this.end_item.year < this.start_item.year) {
					return uni.showToast({
						title: '结束的年份不应该小于开始的年份',
						icon: 'none',
						duration: 2000
					});
				}

				if (this.end_item.year == this.start_item.year && this.end_item.month < this.start_item.month) {
					return uni.showToast({
						title: '结束的月份不应该小于开始的月份',
						icon: 'none',
						duration: 2000
					});
				}
				if (this.end_item.year == this.start_item.year && this.end_item.month === this.start_item.month && this.end_item.day < this.start_item.day) {
					return uni.showToast({
						title: '结束的日期不应该小于开始的日期',
						icon: 'none',
						duration: 2000
					});
				}
				this.$emit('confirm', {
					start_time: this.start_item,
					end_time: this.end_item
				});
				this.close();
			});
		}
	}
};
</script>
<style lang="scss" scoped>
.time-module {
	width: 750rpx;
	height: 66vh;
	background-color: #fff;
	border-top-left-radius: 30rpx;
	border-top-right-radius: 30rpx;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	position: relative;
	.time-head {
		flex-shrink: 0;
		padding-top: 88rpx;
		width: 100%;
		height: 150rpx;
		display: flex;
		align-items: center;
		.time-item {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			line-height: 50rpx;
			.name {
				font-size: 26rpx;
				color: #c2c2c2;
			}
			.tis {
				font-size: 32rpx;
				color: #c2c2c2;
			}
			&.active {
				.name {
					font-size: 26rpx;
					color: #fdc100;
				}
				.tis {
					font-size: 32rpx;
					color: #444444;
				}
			}
		}
	}

	.time-main {
		width: 750rpx;
		flex: 1;
		box-sizing: border-box;
		overflow: hidden;
		background-color: #ffffff;
		text-align: center;
		padding: 30rpx 0;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		.picker-view-style {
			background-color: #f3f4f5;
			border: 1px solid #eeeeee;
			width: 650rpx;
			height: 100%;
			box-sizing: border-box;
			.item {
				line-height: 50px;
			}
		}
		.line-style {
			position: absolute;
			width: 8rpx;
			height: 50px;
			background-color: #fdc100;
			top: 50%;
			transform: translateY(-50%);
			left: 50rpx;
		}
	}
	.footer {
		flex-shrink: 0;
		height: 180rpx;
		width: 100%;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-around;
		padding: 0 50rpx;
		.btn {
			width: 280rpx;
			height: 70rpx;
			border-radius: 35rpx;
			color: #ffffff;
			font-size: 34rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			letter-spacing: 4px;
			&.cancel-btn {
				background-color: #c1c1c1;
			}
			&.confirm-btn {
				background-color: #fdc100;
			}
		}
	}
	.close {
		position: absolute;
		top: 10rpx;
		right: 20rpx;
		color: #fdc100;
		font-size: 45rpx;
	}
}
</style>
