<template>
	<view class="content" @touchmove.stop.prevent :style="{ display: regionaStatus ? 'flex' : 'none', opacity: regionaStatus ? '1' : '0' }" @click="handMask">
		<view class="region-box" :style="{ height: heightCot + 'rpx' }" @click.stop>
			<view class="title-box">
				<text class="title-txt" @click="cancel">取消</text>
				<text class="title-txt" @click="sure">确定</text>
			</view>
			<view class="map-txt">
				<text :class="showIndex == 0 ? 'select' : ''" @click="anewSelect(0)">{{ province.area_name }}</text>
				<text>-</text>
				<text :class="showIndex == 1 ? 'select' : ''" @click="anewSelect(1)">{{ city.area_name }}</text>
				<text>-</text>
				<text :class="showIndex == 2 ? 'select' : ''" @click="anewSelect(2)">{{ area.area_name }}</text>
				<text>-</text>
				<text :class="showIndex == 3 ? 'select' : ''" @click="anewSelect(3)">{{ street.area_name }}</text>
			</view>
			<view class="main-box">
				<scroll-view scroll-y="true" style="height: 100%;width: 100%;">
					<template v-if="showIndex == 0">
						<block v-for="(item, index) in provinceData" :key="index">
							<template v-if="item && item.length > 0">
								<view class="list-box-index">
									<text>{{ index }}</text>
								</view>
								<view class="list-box" v-for="(sitem, sindex) in item" :key="sindex" @click="selectPro(sitem)">
									<text>{{ sitem.area_name }}</text>
								</view>
							</template>
						</block>
					</template>
					<template v-if="showIndex == 1">
						<block v-for="(item, index) in cityData" :key="index">
							<template v-if="item && item.length > 0">
								<view class="list-box-index">
									<text>{{ index }}</text>
								</view>
								<view class="list-box" v-for="(sitem, sindex) in item" :key="sindex" @click="selectCity(sitem)">
									<text>{{ sitem.area_name }}</text>
								</view>
							</template>
						</block>
					</template>
					<template v-if="showIndex == 2">
						<block v-for="(item, index) in areaData" :key="index">
							<template v-if="item && item.length > 0">
								<view class="list-box-index">
									<text>{{ index }}</text>
								</view>
								<view class="list-box" v-for="(sitem, sindex) in item" :key="sindex" @click="selectaArea(sitem)">
									<text>{{ sitem.area_name }}</text>
								</view>
							</template>
						</block>
					</template>

					<template v-if="showIndex == 3">
						<block v-for="(item, index) in streetsData" :key="index">
							<template v-if="item && item.length > 0">
								<view class="list-box-index">
									<text>{{ index }}</text>
								</view>
								<view class="list-box" v-for="(sitem, sindex) in item" :key="sindex" @click="selectStreet(sitem)">
									<text>{{ sitem.area_name }}</text>
								</view>
							</template>
						</block>
					</template>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			regionaStatus: false,
			currentindex: 0,
			showIndex: 0, //地区显示
			province: {
				area_name: '省',
				area_id: null,
				flag: 1
			},
			city: {
				area_name: '市',
				area_id: null,
				flag: 2
			},
			area: {
				area_name: '区/县',
				area_id: null,
				flag: 3
			},
			street: {
				area_name: '街/镇',
				area_id: null,
				flag: 4
			},
			heightCot: 0, //屏幕高度
			provinceData: '', // 当前展示的省数据
			proIndex: '', //当前省的下标
			cityData: '', // 当前展示的市数据
			cityIndex: 0,
			areaData: '', //当前展示的区数据
			areaIndex: 0,
			streetsData: '' //当前展示的区数据,
		};
	},
	mounted() {
		this.getPro();
	},
	methods: {
		handMask() {
			this.close();
		},
		open() {
			this.regionaStatus = true;
		},
		close() {
			this.regionaStatus = false;
		},
		getPro() {
			this.$myRequest({
				url: this.$myhttpUrl.areaSelect,
				data: {
					flag: 1,
					pagesize: 99999,
					pagenumber: 1
				},
				success: res => {
					this.provinceData = res.datas;
				},
				fail: err => {
					uni.hideLoading();
					err.message && this.$myConfig.comFuncs.showToast(err.message);
				}
			});
		},
		//组件高度自适应
		getScreen() {
			let that = this;
			uni.getSystemInfo({
				success: res => {
					that.heightCot = (res.safeArea.height * 3) / 2;
				}
			});
		},
		//取消
		cancel() {
			this.currentindex = 0;
			this.showIndex = 0; //地区显示
			this.province = {
				area_name: '省',
				area_id: null,
				flag: 1
			};
			this.city = {
				area_name: '市',
				area_id: null,
				flag: 2
			};
			this.area = {
				area_name: '区/县',
				area_id: null,
				flag: 3
			};
			this.street = {
				area_name: '街/镇',
				area_id: null,
				flag: 4
			};
			const province = this.province; //省
			const city = this.city; //市
			const area = this.area; //区县
			const street = this.street; //街镇
			const data = [province, city, area, street];
			this.close();
			this.$emit('cancel', { data: data, currentindex: this.currentindex });
		},
		//确定
		sure() {
			const province = this.province; //省
			const city = this.city; //市
			const area = this.area; //区县
			const street = this.street; //街镇
			const data = [province, city, area, street];
			this.close();
			this.$emit('sure', { data: data, currentindex: this.currentindex });
		},
		//下拉选择
		anewSelect(num) {
			this.currentindex = num;
			switch (num) {
				case 0:
					this.showIndex = 0;
					this.cityData = [];
					this.areaData = [];
					this.streetsData = [];
					this.city = {
						area_name: '市',
						area_id: null,
						flag: 2
					};
					this.area = {
						area_name: '区/县',
						area_id: null,
						flag: 3
					};
					this.street = {
						area_name: '街/镇',
						area_id: null,
						flag: 4
					};
					break;
				case 1:
					this.showIndex = 1;
					this.areaData = [];
					this.streetsData = [];
					this.area = {
						area_name: '区/县',
						area_id: null,
						flag: 3
					};
					this.street = {
						area_name: '街/镇',
						area_id: null,
						flag: 4
					};
					break;
				case 2:
					this.showIndex = 2;
					this.streetsData = [];
					this.street = {
						area_name: '街/镇',
						area_id: null,
						flag: 4
					};
					break;
				case 3:
					break;
			}
		},
		//高德获取地区信息
		getMap(parmas) {
			let that = this;
			return new Promise((resolve, reject) => {
				that.$myRequest({
					url: that.$myhttpUrl.areaSelect,
					data: parmas,
					success: res => {
						resolve(res.datas);
					},
					fail: err => {
						uni.hideLoading();
						reject(err);
					}
				});
			});
		},
		//选择当前省
		selectPro(label) {
			let params = {
				flag: 2,
				pagesize: 99999,
				pagenumber: 1,
				area_id: label.area_id
			};
			this.getMap(params)
				.then(res => {
					this.cityData = res;
					this.showIndex = 1;
					this.currentindex = 0;
					this.province = {
						flag: 1,
						...label
					};
				})
				.catch(err => {
					uni.showToast({
						title: '获取市级区域失败',
						icon: 'none',
						duration: 1500
					});
				});
		},
		//选择当前市
		selectCity(label) {
			let params = {
				flag: 3,
				pagesize: 99999,
				pagenumber: 1,
				area_id: label.area_id
			};
			this.getMap(params)
				.then(res => {
					this.areaData = res;
					this.showIndex = 2;
					this.currentindex = 1;
					this.city = {
						flag: 2,
						...label
					};
				})
				.catch(err => {
					uni.showToast({
						title: '获取区/县级区域失败',
						icon: 'none',
						duration: 1500
					});
				});
		},
		// 区、县
		selectaArea(label) {
			let params = {
				flag: 4,
				pagesize: 99999,
				pagenumber: 1,
				area_id: label.area_id
			};
			this.getMap(params)
				.then(res => {
					this.streetsData = res;
					this.showIndex = 3;
					this.currentindex = 2;
					this.area = {
						flag: 3,
						...label
					};
				})
				.catch(err => {
					uni.showToast({
						title: '获取区/县级区域失败',
						icon: 'none',
						duration: 1500
					});
				});
		},
		//街、镇
		selectStreet(label) {
			this.currentindex = 3;
			this.street = {
				flag: 4,
				...label
			};
		}
	}
};
</script>

<style lang="scss" scoped>
.content {
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 900;
	display: flex;
	flex-direction: column;
	opacity: 0;
	transition: all 300ms linear;
}
.region-box {
	margin-top: auto;
	box-sizing: border-box;
	width: 750rpx;
	height: 60vh;
	background-color: #ffffff;
	padding: 10rpx;
	display: flex;
	flex-direction: column;
	.title-box {
		flex-shrink: 0;
		padding: 0 10rpx 30rpx 10rpx;
		display: flex;
		justify-content: space-between;
		// border-bottom: 2rpx solid #f2f2f2;
		.title-txt {
			color: #343434;
			font-size: 30rpx;
			&:nth-child(2) {
				color: #3cba8b;
			}
		}
	}
	.map-txt {
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		color: #343434;
		font-size: 30rpx;
		padding-bottom: 10rpx;
		text {
			margin: 0 12rpx;
			border-bottom: 2rpx solid #dedede;
			&:nth-child(even) {
				border: none;
			}
		}
		.select {
			color: #3cba8b;
			position: relative;

			&::after {
				content: '';
				width: 100%;
				height: 6rpx;
				background: #3cba8b;
				position: absolute;
				left: 0;
				bottom: -8rpx;
			}
		}
	}
	.main-box {
		flex: 1;
		width: 100%;
		color: #343434;
		font-size: 30rpx;
		// box-sizing: border-box;
		// height: 100%;
		overflow-y: scroll;
		.list-box-index {
			display: flex;
			flex-direction: column;
			font-size: 30rpx;
			padding: 10rpx 5rpx;
			border-bottom: 2rpx solid #dedede;
			color: #fdc100;
			background-color: #eeeeee;
		}
		.list-box {
			display: flex;
			flex-direction: column;
			padding: 20rpx 0;
			border-bottom: 2rpx solid #dedede;
		}
	}
}
</style>
