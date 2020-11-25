<template>
	<view class="adress-box">
		<!-- 省 -->
		<view class="adress-item " :style="{ color: active == 1 ? '#FDC100' : '#666666' }">
			<picker :range="province.data" :value="province.data.area_id" :range-key="'area_name'" @change="provincePicker" @cancel="provinceCancel">
				<text>{{ province.data[province.index].area_name || '省' }}</text>
				<view class="iconfont  icon-f11"></view>
			</picker>
		</view>

		<!-- 市 -->
		<view class="adress-item " :style="{ color: active == 2 ? '#FDC100' : '#666666' }">
			<picker :range="city.data" :value="city.data.area_id" :range-key="'area_name'" @change="cityPicker" :disabled="true" v-if="province.index === null">
				<text>市</text>
				<view class="iconfont  icon-f11"></view>
			</picker>
			<picker :range="city.data" :value="city.data.area_id" :range-key="'area_name'" @change="cityPicker" v-else @cancel="cityCancel">
				<text>{{ city.data[city.index].area_name || '市' }}</text>
				<view class="iconfont  icon-f11"></view>
			</picker>
		</view>
		<!-- 区 -->
		<view class="adress-item " :style="{ color: active == 3 ? '#FDC100' : '#666666' }">
			<picker :range="area.data" :value="area.data.area_id" :range-key="'area_name'" @change="areaPicker" :disabled="true" v-if="city.index === null">
				<text>区</text>
				<view class="iconfont  icon-f11"></view>
			</picker>
			<picker :range="area.data" :value="area.data.area_id" :range-key="'area_name'" @change="areaPicker" v-else @cancel="areaCancel">
				<text>{{ area.data[area.index].area_name || '区' }}</text>
				<view class="iconfont  icon-f11"></view>
			</picker>
		</view>
		<!-- 乡镇 -->
		<view class="adress-item" :style="{ color: active == 4 ? '#FDC100' : '#666666' }">
			<picker :range="town.data" :value="town.data.area_id" :range-key="'area_name'" @change="townPicker" :disabled="true" v-if="area.index === null">
				<text>乡/镇</text>
				<view class="iconfont  icon-f11"></view>
			</picker>
			<picker :range="town.data" :value="town.data.area_id" :range-key="'area_name'" @change="townPicker" v-else @cancel="townCancel">
				<text>{{ town.data[town.index].area_name || '乡/镇' }}</text>
				<view class="iconfont  icon-f11"></view>
			</picker>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		address: Boolean
	},
	data() {
		return {
			active: 1,
			province: {
				index: null,
				data: []
			}, //省
			city: {
				index: null,
				data: []
			}, //市
			area: {
				index: null,
				data: []
			}, //区
			town: {
				index: null,
				data: []
			} //乡镇
		};
	},

	created() {
		//获取地址信息
		this.getSelect(1, null, result => {
			this.province.data = result;
		});
	},
	watch: {
		address: function(newvalue) {
			
			this.province.index = null;
			this.city.index = null;
			this.area.index = null;
			this.town.index = null;
			this.area.index = null;
			this.active = 1;
		}
	},

	methods: {
		getSelect(flag, area_id, callback = false) {
			let data = {
				flag: flag ? flag : 1,
				pagesize: 99999,
				pagenumber: 1
			};
			area_id && (data['area_id'] = area_id);
			this.$myRequest({
				url: this.$myhttpUrl.areaSelect,
				data: data,
				success: res => {
					let result = [];
					let resultData = res.datas;
					for (let k in resultData) {
						if (resultData.hasOwnProperty(k)) {
							result = result.concat(resultData[k]);
						}
					}
					if (typeof callback == 'function') {
						callback(result);
					}
				},
				fail: err => {
					uni.showToast({
						title:err.message,
						icon:'none'
					})
				}
			});
		},

		provinceCancel() {
			console.log('取消了身份');
			this.province.index = this.city.index = this.area.index = this.town.index = null;
			this.getSelect(1, null, result => {
				this.province.data = result;
			});
			this.$emit('adressClick', { flag: 1, area_id: null });
			this.active = 1;
		},
		cityCancel() {
			console.log('取消选择城市');
			let area_id = this.province.data[this.province.index].area_id;
			this.$emit('adressClick', { flag: 1, area_id: area_id });
			this.city.index = this.area.index = this.town.index = null;
			this.active = 2;
		},
		areaCancel() {
			console.log('取消了区/县');
			let area_id = this.city.data[this.city.index].area_id;
			this.$emit('adressClick', { flag: 2, area_id: area_id });
			this.area.index = this.town.index = null;
			this.active = 3;
		},
		townCancel() {
			console.log('取消了乡镇');
			let area_id = this.area.data[this.area.index].area_id;
			this.$emit('adressClick', { flag: 3, area_id: area_id });
			this.town.index = null;
			this.active = 4;
		},
		provincePicker(e) {
			let sindex = parseInt(e.detail.value);
			let currentObj = this.province;
			//选择省
			this.active = 1;
			currentObj.index = sindex;
			let area_id = currentObj.data[sindex].area_id;

			this.getSelect(2, area_id, result => {
				this.city.data = result;
				console.log('返回城市数据', result);
			});
			this.$emit('adressClick', { flag: 1, area_id: area_id });
			this.city.index = this.area.index = this.town.index = null;
		},

		cityPicker(e) {
			let sindex = parseInt(e.detail.value);
			let currentObj = this.city;
			//选择市
			this.active = 2;
			currentObj.index = sindex;
			console.log(this.city.data);
			console.log(this.city.index);
			let area_id = currentObj.data[sindex].area_id;
			this.getSelect(3, area_id, result => {
				this.area.data = result;
				console.log('返回区/县数据', result);
			});
			this.$emit('adressClick', { flag: 2, area_id: area_id });
			this.area.index = this.town.index = null;
		},
		areaPicker(e) {
			let sindex = parseInt(e.detail.value);
			let currentObj = this.area;
			//选择区
			this.active = 3;
			currentObj.index = sindex;
			console.log(this.area.data);
			console.log(this.area.index);
			let area_id = currentObj.data[sindex].area_id;
			this.getSelect(4, area_id, result => {
				this.town.data = result;
				console.log('返回乡镇数据', result);
			});
			this.$emit('adressClick', { flag: 3, area_id: area_id });
			this.town.index = null;
		},
		townPicker(e) {
			let sindex = parseInt(e.detail.value);
			let currentObj = this.town;
			//选择乡镇
			if (currentObj.data.length) {
				this.active = 4;
				currentObj.index = sindex;
				console.log(this.town.data);
				console.log(this.town.index);
				let area_id = currentObj.data[sindex].area_id;
				this.$emit('adressClick', { flag: 4, area_id: area_id });
			}
		}
	}
};
</script>

<style scopeds>
.adress-box {
	background: #ffffff;
	height: 88rpx;
	border-bottom: 1rpx solid #eeeeee;
	display: flex;
	align-content: center;
	box-sizing: border-box;
}

.adress-item {
	color: #666666;
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
}

.adress-item .icon-f11 {
	display: inline-block;
}
</style>
