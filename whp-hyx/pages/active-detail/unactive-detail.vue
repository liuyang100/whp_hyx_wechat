<template>
	<view class="w-100  position-relative">
		<evan-form class="evan-form-show  d-flex" :hide-required-asterisk="hideRequiredAsterisk" ref="form" :model="datas">
			<evan-form-item label="合作状态" class="evan-form-item">
				<input type="text" class="form-input mynowarp" v-model="datas.apply_state_name" disabled style="color: fdc100;" />
			</evan-form-item>
			<uni-section title="渠道类型" marginTop="0rpx" type="square" bgColor="#40CCFF"></uni-section>
			<!-- 大渠道 -->
			<evan-form-item label="大渠道" class="evan-form-item" show_jiantou prop="one_category_id">
				<picker
					mode="selector"
					:disabled="!isedit"
					class="picker"
					@change="formateCurrentIndex($event, 1)"
					:value="coloumOne[oneIndex].name"
					:range="coloumOne"
					range-key="name"
				>
					<input
						disabled
						class="form-input"
						placeholder-style="font-size: 28rpx;color:#ccc;"
						:value="oneIndex != null ? coloumOne[oneIndex].name : ''"
						placeholder="请选择大渠道"
					/>
				</picker>
			</evan-form-item>
			<evan-form-item label="小渠道" class="evan-form-item" show_jiantou prop="two_category_id">
				<picker
					mode="selector"
					:disabled="!isedit"
					class="picker"
					@change="formateCurrentIndex($event, 2)"
					:value="coloumTwo[twoIndex].name"
					:range="coloumTwo"
					range-key="name"
				>
					<input
						disabled
						class="form-input"
						placeholder-style="font-size: 28rpx;color:#ccc;"
						:value="twoIndex != null ? coloumTwo[twoIndex].name : ''"
						placeholder="请选择小渠道"
					/>
				</picker>
			</evan-form-item>
			<evan-form-item label="门店一级类型" class="evan-form-item" show_jiantou prop="three_category_id">
				<picker
					mode="selector"
					:disabled="!isedit"
					class="picker"
					@change="formateCurrentIndex($event, 3)"
					:value="coloumThree[threeIndex].name"
					:range="coloumThree"
					range-key="name"
				>
					<input
						disabled
						class="form-input"
						placeholder-style="font-size: 28rpx;color:#ccc;"
						:value="threeIndex != null ? coloumThree[threeIndex].name : ''"
						placeholder="请选择门店一级类型"
					/>
				</picker>
			</evan-form-item>
			<evan-form-item label="门店二级类型" class="evan-form-item" show_jiantou prop="two_category_id">
				<picker
					mode="selector"
					:disabled="!isedit"
					class="picker"
					@change="formateCurrentIndex($event, 4)"
					:value="coloumFour[fourIndex].name"
					:range="coloumFour"
					range-key="name"
				>
					<input
						disabled
						class="form-input"
						placeholder-style="font-size: 28rpx;color:#ccc;"
						:value="fourIndex != null ? coloumFour[fourIndex].name : ''"
						placeholder="请选择门店二级类型"
					/>
				</picker>
			</evan-form-item>
			<evan-form-item label="经营方式" class="evan-form-item" show_jiantou prop="customer_type">
				<picker
					disabled
					mode="selector"
					:disabled="!isedit"
					class="picker"
					@change="formateCurrentIndex($event, 5)"
					:value="businessStyle[businessStyleIndex].name"
					:range="businessStyle"
					range-key="name"
				>
					<input
						disabled
						class="form-input"
						placeholder-style="font-size: 28rpx;color:#ccc;"
						:value="businessStyleIndex !== null ? businessStyle[businessStyleIndex].name : ''"
						placeholder="请选择经营方式"
					/>
				</picker>
			</evan-form-item>
			<evan-form-item label="门店分类" class="evan-form-item" show_jiantou prop="business_model">
				<picker
					:disabled="!isedit"
					mode="selector"
					class="picker"
					@change="formateCurrentIndex($event, 6)"
					:value="storesClass[storesClassIndex].name"
					:range="storesClass"
					range-key="name"
				>
					<input
						disabled
						class="form-input"
						placeholder-style="font-size: 28rpx;color:#ccc;"
						:value="storesClassIndex !== null ? storesClass[storesClassIndex].name : ''"
						placeholder="请选择门店分类"
					/>
				</picker>
			</evan-form-item>
			<uni-section title="客户分类" marginTop="0rpx" type="square" bgColor="#00EADD"></uni-section>
			<!-- 所属区域 -->
			<evan-form-item label="所属地区" class="evan-form-item" show_jiantou prop="sale_org_id" @click="getStoreData()">
				<picker mode="selector" :disabled="!isedit" class="picker" @change="bindPickerChange3" :value="index3" :range="find_store" range-key="name">
					<input disabled class="form-input" placeholder-style="font-size: 28rpx;color:#ccc;" :value="find_store[index3].name" placeholder="请选择所属地区" />
				</picker>
			</evan-form-item>
			<!-- END 所属区域 -->

			<!-- 网点/门店等级 -->
			<evan-form-item label="网点/门店等级" class="evan-form-item" show_jiantou prop="storeLevel">
				<picker mode="selector" :disabled="!isedit" class="picker" @change="bindPickerChange2" :value="index2" :range="sale_org" range-key="name">
					<input disabled class="form-input" placeholder-style="font-size: 28rpx;color:#ccc;" :value="sale_org[index2].name" placeholder="请选择网点/门店等级" />
				</picker>
			</evan-form-item>
			<!-- end 网点/门店等级 -->
			<!-- 行政划区 -->
			<evan-form-item label="行政划区" class="evan-form-item" show_jiantou prop="administrative">
				<picker mode="selector" :disabled="!isedit" class="picker" @change="bindPickerChange1" :value="index1" :range="huaQuArr" range-key="name">
					<input disabled class="form-input" placeholder-style="font-size: 28rpx;color:#ccc;" :value="huaQuArr[index1].name" placeholder="请选择行政划区" />
				</picker>
			</evan-form-item>
			<!-- end 行政划区 -->
			<uni-section title="基本信息" marginTop="0rpx" type="square" bgColor="#55ff00"></uni-section>

			<evan-form-item label="门店名称" class="evan-form-item" prop="customer_name">
				<input
					type="text"
					confirm-type="确定"
					class="form-input mynowarp"
					:disabled="!isedit"
					placeholder-style="font-size: 28rpx;color:#ccc;"
					v-model="datas.customer_name"
					placeholder="请填写门店名称"
				/>
			</evan-form-item>

			<evan-form-item label="商业单位名称" class="evan-form-item">
				<input
					type="text"
					confirm-type="确定"
					:disabled="!isedit"
					class="form-input mynowarp"
					placeholder-style="font-size: 28rpx;color:#ccc;"
					v-model="datas.business_name"
					placeholder="请填写商业单位名称"
				/>
			</evan-form-item>

			<evan-form-item label="商业单位门店编码" class="evan-form-item">
				<input
					type="text"
					confirm-type="确定"
					:disabled="!isedit"
					class="form-input mynowarp"
					placeholder-style="font-size: 28rpx;color:#ccc;"
					v-model="datas.business_store_code"
					placeholder="请填写商业单位门店编码"
				/>
			</evan-form-item>

			<evan-form-item label="联系人" class="evan-form-item" prop="contacts">
				<input
					type="text"
					confirm-type="确定"
					:disabled="!isedit"
					class="form-input mynowarp"
					placeholder-style="font-size: 28rpx;color:#ccc;"
					v-model="datas.contacts"
					placeholder="请填写联系人"
				/>
			</evan-form-item>

			<evan-form-item label="联系电话" class="evan-form-item" prop="mobile">
				<input
					type="number"
					confirm-type="确定"
					:disabled="!isedit"
					class="form-input mynowarp"
					placeholder-style="font-size: 28rpx;color:#ccc;"
					v-model="datas.mobile"
					placeholder="请填写联系电话"
				/>
			</evan-form-item>

			<evan-form-item label="地址" class="evan-form-item" show_jiantou @tap="selectCity(1)" prop="area_name">
				<input disabled class="form-input mynowarp" placeholder-style="font-size: 28rpx;color:#ccc;" :value="datas.area_name" placeholder="请选择" />
			</evan-form-item>

			<evan-form-item label="详细地址" class="evan-form-item" prop="address">
				<input
					type="text"
					confirm-type="确定"
					:disabled="!isedit"
					class="form-input mynowarp"
					placeholder-style="font-size: 28rpx;color:#ccc;"
					v-model="datas.address"
					placeholder="请填写详细地址"
				/>
			</evan-form-item>

			<evan-form-item label="门店所在地邮政编码" class="evan-form-item" prop="location_code">
				<input
					type="number"
					confirm-type="确定"
					:disabled="!isedit"
					class="form-input mynowarp"
					placeholder-style="font-size: 28rpx;color:#ccc;"
					v-model="datas.location_code"
					placeholder="请填写门店所在地邮政编码"
				/>
			</evan-form-item>
			<evan-form-item label="业务员" class="evan-form-item" show_jiantou>
				<input type="text" disabled class="form-input mynowarp" placeholder-style="font-size: 28rpx;color:#ccc;" :value="loginInfo.name" />
			</evan-form-item>

			<uni-section title="上传图片" marginTop="0rpx" type="square" bgColor="#FD9D14"></uni-section>
			<view class="upimg d-flex flex-wrap">
				<view class="d-flex upload_item flex-column a-center">
					<view @click="chooseImage('door_photo')" class="m-1 upload_item_content">
						<image v-if="datas.door_photo" :src="datas.door_photo" class="upload_item_content_image"></image>
						<view v-else class="iconfont  upload_item_content_haost">&#xe602;</view>
					</view>
					<view class="font-sm text-muted upload_item_bottom_text">
						<i>*</i>
						门头照
					</view>
				</view>
				<view class="d-flex upload_item flex-column a-center">
					<view @click="chooseImage('shop_photo')" class="m-1 upload_item_content">
						<image v-if="datas.shop_photo" :src="datas.shop_photo" class="upload_item_content_image"></image>
						<view v-else class="iconfont  upload_item_content_haost">&#xe602;</view>
					</view>
					<view class="font-sm text-muted upload_item_bottom_text">
						<i>*</i>
						门店整体照片
					</view>
				</view>
				<view class="d-flex upload_item flex-column a-center">
					<view @click="chooseImage('ice_wash_photo')" class="m-1 upload_item_content">
						<image v-if="datas.ice_wash_photo" :src="datas.ice_wash_photo" class="upload_item_content_image"></image>
						<view v-else class="iconfont  upload_item_content_haost">&#xe602;</view>
					</view>
					<view class="font-sm text-muted upload_item_bottom_text">
						<i>*</i>
						冰洗区照片
					</view>
				</view>
				<view class="d-flex upload_item flex-column a-center">
					<view @click="chooseImage('air_conditioning_photo')" class="m-1 upload_item_content">
						<image v-if="datas.air_conditioning_photo" :src="datas.air_conditioning_photo" class="upload_item_content_image"></image>
						<view v-else class="iconfont  upload_item_content_haost">&#xe602;</view>
					</view>
					<view class="font-sm text-muted upload_item_bottom_text">空调区照片</view>
				</view>
				<view class="d-flex upload_item flex-column a-center">
					<view @click="chooseImage('television_photo')" class="m-1 upload_item_content">
						<image v-if="datas.television_photo" :src="datas.television_photo" class="upload_item_content_image"></image>
						<view v-else class="iconfont  upload_item_content_haost">&#xe602;</view>
					</view>
					<view class="font-sm text-muted upload_item_bottom_text">电视区照片</view>
				</view>

				<view class="d-flex upload_item flex-column a-center">
					<view @click="chooseImage('kitchen_photo')" class="m-1 upload_item_content">
						<image v-if="datas.kitchen_photo" :src="datas.kitchen_photo" class="upload_item_content_image"></image>
						<view v-else class="iconfont  upload_item_content_haost">&#xe602;</view>
					</view>
					<view class="font-sm text-muted upload_item_bottom_text">厨电区照片</view>
				</view>
				<view class="d-flex upload_item flex-column a-center">
					<view @click="chooseImage('small_area_photo')" class="m-1 upload_item_content">
						<image v-if="datas.small_area_photo" :src="datas.small_area_photo" class="upload_item_content_image"></image>
						<view v-else class="iconfont  upload_item_content_haost">&#xe602;</view>
					</view>
					<view class="font-sm text-muted upload_item_bottom_text">小电区照片</view>
				</view>
			</view>
			<view class="bctj-btn">
				<button class=" button" size="mini" @click="isedit = true" v-if="!isedit">编辑</button>
				<button class=" button" size="mini" @click="submit" v-else>保存</button>
			</view>
		</evan-form>
		<!-- 地址选择 -->
		<inputting-adress :controlTel="administrative" @maskTask="adMaskTask" ref="inputting-adress" @clickpop="clickpop"></inputting-adress>
		<!-- end 地址选择 -->
	</view>
</template>

<script>
import evanForm from '@/components/evan-form/evan-form.vue';
import evanFormItem from '@/components/evan-form/evan-form-item.vue';
import utils from '@/components/evan-form/utils.js';
import inputtingAdress from '@/components/inputtingAdress/inputtingAdress.vue';
import uniSection from '@/components/uni/uni-section/uni-section.vue';
import { mapState, mapActions } from 'vuex';
import test from '@/ulits/function/test.js';
import { deepClone } from '@/ulits/Validation.js';
export default {
	components: {
		evanForm,
		evanFormItem,
		inputtingAdress,
		uniSection
	},
	data() {
		return {
			clearnTime: null,
			isedit: false,
			hideRequiredAsterisk: true, //表单验证
			oneIndex: null, //大渠道选择
			twoIndex: null, //小渠道选择
			threeIndex: null, //一级门店
			fourIndex: null, //二级门店
			index1: null, //行政划区
			index2: null, //网点/门店等级
			index3: null, //获取所属区域
			popShow: false, // 是否打开地址选择模块框
			storesClassIndex: null,
			storesClass: [
				{
					id: 1,
					name: '线上'
				},
				{
					id: 2,
					name: '线下'
				}
			],
			businessStyleIndex: null,
			businessStyle: [
				{
					id: 1,
					name: '直营'
				},
				{
					id: 2,
					name: '代理'
				}
			],
			datas: {
				door_photo: '',
				shop_photo: '',
				ice_wash_photo: '',
				air_conditioning_photo: '',
				television_photo: '',
				kitchen_photo: '',
				small_area_photo: '',
				one_category_id: null,
				two_category_id: null,
				three_category_id: null,
				four_category_id: null, // 门店二级类型
				business_model: null, //门店分类
				customer_type: null, // 经营的方式
				sale_org_id: null, // 所属区域
				storeLevel: null, //门店等级
				administrative: null, // 行政等级
				customer_name: '', //门店名称
				business_name: '', //商业单位名称
				business_store_code: '', //商业单位门店编码
				contacts: '', //请填写联系人
				mobile: '', //请填写联系电话
				area_name: '', //地址
				area_id: null, // 地址id
				address: '', //详细地址
				location_code: '', //门店所在地编码
				supervisor: null, //终端主管
				apply_state_name: '',
				customer_apply_id: null
			},
			is_active: null,
			rules: {
				one_category_id: {
					required: true,
					message: '请选择大渠道'
				},
				two_category_id: {
					required: true,
					message: '请选择小渠道'
				},

				three_category_id: {
					required: true,
					message: '请选择门店一级类型'
				},
				four_category_id: {
					required: true,
					message: '请选择门店二级类型'
				},
				customer_type: {
					required: true,
					message: '请选择经营方式'
				},
				business_model: {
					required: true,
					message: '请选择门店分类'
				},
				sale_org_id: {
					required: true,
					message: '请选择所属地区'
				},
				storeLevel: {
					required: true,
					message: '请选择门店等级'
				},
				administrative: {
					required: true,
					message: '请选择行政等级'
				},
				customer_name: {
					required: true,
					message: '请输入门店名称'
				},
				contacts: {
					required: true,
					message: '请填写联系人'
				},
				mobile: [
					{
						required: true,
						message: '请输入手机号'
					},
					{
						validator: this.isMobilePhone
					}
				], //请填写联系电话
				area_name: {
					required: true,
					message: '请填写地址'
				},
				area_id: {
					required: true,
					message: '请填写地址'
				},
				address: {
					required: true,
					message: '请填写详细地址'
				},
				location_code: {
					required: true,
					message: '请填写门店所在地邮政编码'
				},
				door_photo: {
					required: true,
					message: '请上传门头照'
				},
				shop_photo: {
					required: true,
					message: '请上传门店整体照'
				},
				ice_wash_photo: {
					required: true,
					message: '请上传冰洗区照'
				}
			}
		};
	},
	onLoad(option) {
		if (option) {
			option = this.$formateOption(option);
			this.is_active = option.is_active;
			this.datas.customer_apply_id = option.customer_apply_id;
		}
		this.$nextTick(() => {
			this.$refs.form.setRules(this.rules);
		});
		this.__init();
	},
	computed: {
		...mapState({
			resultData: state => state.channel.data,
			find_store: state => state.channel.storedata,
			huaQuArr: state => state.channel.huaQuArr,
			sale_org: state => state.channel.sale_org,
			loginInfo: state => state.user.loginInfo
		}),

		coloumOne() {
			let list = [];
			if (this.resultData && this.resultData.length > 0) {
				list = this.resultData;
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
		},
		coloumFour() {
			let list = [];
			if (this.coloumThree.length > 0 && this.threeIndex !== null) {
				if (this.coloumThree[this.threeIndex].list && this.coloumThree[this.threeIndex].list.length > 0 && this.threeIndex !== null) {
					list = this.coloumThree[this.threeIndex].list;
				}
			}
			return list;
		},

		one_category_id: {
			get: function() {
				return this.datas.one_category_id;
			},
			set: function(value) {
				let index = this.coloumOne.findIndex(v => v.id === value);
				if (index > -1) {
					this.oneIndex = index;
					this.twoIndex = null;
					this.threeIndex = null;
					this.fourIndex = null;
					this.datas.one_category_id = value;
					this.datas.two_category_id = null;
					this.datas.three_category_id = null;
					this.datas.four_category_id = null;
				}
			}
		},
		two_category_id: {
			get: function() {
				return this.datas.two_category_id;
			},
			set: function(value) {
				let index = this.coloumTwo.findIndex(v => v.id === value);
				if (index > -1) {
					this.twoIndex = index;
					this.threeIndex = null;
					this.fourIndex = null;
					this.datas.two_category_id = value;
					this.datas.three_category_id = null;
					this.datas.four_category_id = null;
				}
			}
		},

		three_category_id: {
			get: function() {
				return this.datas.three_category_id;
			},
			set: function(value) {
				let index = this.coloumThree.findIndex(v => v.id === value);
				if (index > -1) {
					this.threeIndex = index;
					this.fourIndex = null;
					this.datas.three_category_id = value;
					this.datas.four_category_id = null;
				}
			}
		},
		four_category_id: {
			get: function() {
				return this.datas.four_category_id;
			},
			set: function(value) {
				let index = this.coloumFour.findIndex(v => v.id === value);
				if (index > -1) {
					this.fourIndex = index;
					this.datas.four_category_id = value;
				}
			}
		},
		customer_type: {
			// 经营的方式
			get: function() {
				return this.datas.customer_type;
			},
			set: function(value) {
				let index = this.businessStyle.findIndex(v => v.id === value);
				if (index > -1) {
					this.businessStyleIndex = index;
					this.datas.customer_type = value;
				}
			}
		},
		business_model: {
			// 门店分类
			get: function() {
				return this.datas.business_model;
			},
			set: function(value) {
				let index = this.storesClass.findIndex(v => v.id === value);
				if (index > -1) {
					this.storesClassIndex = index;
					this.datas.business_model = value;
				}
			}
		},
		sale_org_id: {
			get: function() {
				return this.datas.sale_org_id;
			},
			set: function(value) {
				this.datas.sale_org_id = value;
				let index = this.find_store.findIndex(v => v.store_id === value);
				if (index > -1) {
					this.index3 = index;
				}
			}
		},
		store_level: {
			get: function() {
				return this.datas.storeLevel;
			},
			set: function(value) {
				this.datas.storeLevel = value;
				let index = this.sale_org.findIndex(v => v.id === value);
				if (index > -1) {
					this.index2 = index;
				}
			}
		},
		administrative: {
			get: function() {
				return this.datas.administrative;
			},
			set: function(value) {
				this.datas.administrative = value;
				let index = this.huaQuArr.findIndex(v => v.id === value);
				if (index > -1) {
					this.index1 = index;
				}
			}
		}
	},

	methods: {
		...mapActions(['getQuDaoData', 'getStoreData']),
		isMobilePhone(rule, value, callback) {
			if (test.mobile(value)) {
				callback();
			} else {
				callback(new Error('手机号格式不正确'));
			}
		},
		// 上传图片
		async chooseImage(ins) {
			if (!this.isedit) return;
			let { file_info, message, type } = await this.$upImage(ins);
			if (message.type == 'success') {
				this.datas[type] = file_info.url;
			}
		},
		async __init() {
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			try {
				// 渠道
				let res1 = await this.getQuDaoData();
				// 所属地区
				let res2 = await this.getStoreData();
				// 获取详情数
				let resdata = await this.getDetailData();
				if (resdata) {
					this.orgData(resdata);
				}
				uni.hideLoading();
			} catch (error) {
				uni.showToast({
					title:'请求失败',
					icon:'none'
				})
			}
		},
		getDetailData() {
			return new Promise((resolve, reject) => {
				this.$myRequest({
					url: this.$myhttpUrl.customerApply_select,
					data: {
						customer_apply_id: this.datas.customer_apply_id,
						is_active: this.is_active
					},
					success: res => {
						resolve(res.data);
					},
					fail: err => {
						console.log(err.message);
						reject();
					}
				});
			});
		},
		// 详情赋值
		orgData(resdata) {
			console.log('获取详情', JSON.stringify(resdata, null, 4));

			try {
				// 合作状态
				this.datas.apply_state_name = resdata.apply_state_name;
				this.one_category_id = resdata.one_category_id;
				this.two_category_id = resdata.two_category_id;
				this.three_category_id = resdata.three_category_id;
				this.four_category_id = resdata.four_category_id;
				this.customer_type = resdata.customer_type;
				this.business_model = resdata.business_model;
				// 所属区域
				this.sale_org_id = resdata.sale_org_id;
				// 网点等级
				this.store_level = resdata.store_level;
				// 行政区域
				this.administrative = resdata.administrative;
				// 基本信息
				this.datas.customer_name = resdata.customer_name;
				this.datas.business_name = resdata.business_name;
				this.datas.business_store_code = resdata.business_store_code;
				this.datas.contacts = resdata.contacts;
				this.datas.mobile = resdata.mobile;
				this.datas.area_name = resdata.area_name;
				this.datas.area_id = resdata.area_id;
				this.datas.address = resdata.address;
				this.datas.location_code = resdata.location_code;
				// 门头照
				this.datas.door_photo = resdata.door_photo;
				// 整体照
				this.datas.shop_photo = resdata.shop_photo;
				// 冰洗照
				this.datas.ice_wash_photo = resdata.ice_wash_photo;
				// 空调区照
				this.datas.air_conditioning_photo = resdata.air_conditioning_photo;
				// 电视区照
				this.datas.television_photo = resdata.television_photo;
				// 厨电区照
				this.datas.kitchen_photo = resdata.kitchen_photo;
				// 小区照
				this.datas.small_area_photo = resdata.small_area_photo;
			} catch (e) {
				//TODO handle the exception
				uni.showModal({
					title: '提示',
					content: '获取失败',
					showCancel: false,
					success() {
						return false;
					}
				});
			}
		},
		formateCurrentIndex(e, sn) {
			let index = Number(e.detail.value);
			switch (sn) {
				case 1:
					this.one_category_id = this.coloumOne[index].id;
					break;
				case 2:
					this.two_category_id = this.coloumTwo[index].id;
					break;
				case 3:
					this.three_category_id = this.coloumThree[index].id;
					break;
				case 4:
					this.four_category_id = this.coloumFour && this.coloumFour[index] && this.coloumFour[index].id;
					break;
				case 5:
					this.customer_type = this.coloumFour && this.storesClass[index] && this.storesClass[index].id;
					break;
				case 6:
					this.business_model = this.businessStyle && this.businessStyle[index] && this.businessStyle[index].id;
					break;
			}
		},

		//所属区域
		bindPickerChange3(e) {
			this.getStoreData();
			this.sale_org_id = this.find_store[e.detail.value].store_id;
		},

		//行政选择
		bindPickerChange1(e) {
			this.administrative = this.huaQuArr[e.detail.value].id;
		},

		//网点/门店等级
		bindPickerChange2(e) {
			this.store_level = this.sale_org[e.detail.value].id;
		},

		// 触发选择地址
		selectCity(int) {
			if (!this.isedit) return;
			if (this.popShow) {
				return;
			}
			if (this.administrative == null) {
				return uni.showToast({
					title:'请先选择行政划区',
					icon:'none'
				})
			}
			this.selectCityType = int;
			this.popShow = true;
			this.$refs['inputting-adress'].open();
		},
		adMaskTask() {
			this.popShow = false;
		},
		//地区回调选择
		clickpop(obj) {
			this.adMaskTask();
			if (this.selectCityType == 1) {
				this.datas.area_id = obj.area_id;
				this.datas.area_name = obj.text;
			} else {
				this.datas.consignee_area = obj.area_id;
				this.datas.consignee_area_name = obj.text;
			}
		},

		validmyRequest(reqData = {}) {
			let data = { ...this.datas };
			reqData.customer_apply_id = data.customer_apply_id;
			// 大渠道
			reqData.one_category_id = data.one_category_id;
			reqData.two_category_id = data.two_category_id;
			reqData.three_category_id = data.three_category_id;
			reqData.four_category_id = data.four_category_id;
			reqData.customer_type = data.customer_type;
			reqData.business_model = data.business_model;
			// 所属于地区
			reqData.sale_org_id = data.sale_org_id;
			// 行政划区
			reqData.administrative = data.administrative;
			// 门店等级
			reqData.storeLevel = data.storeLevel;
			// 门店名称
			reqData.customer_name = data.customer_name;
			// 商业单位
			data.business_name && (reqData.business_name = data.business_name);
			// 商业单位编码
			data.business_store_code && (reqData.business_store_code = data.business_store_code);
			// 联系人
			reqData.contacts = data.contacts;
			// 联系电话
			reqData.mobile = data.mobile;
			// 区级地址名称
			reqData.area_name = data.area_name;
			// 区级地址id
			reqData.area_id = data.area_id;
			// 详细地址
			reqData.address = data.address;
			// 门店所在地邮政编码
			reqData.location_code = data.location_code;
			// 门头照
			reqData.door_photo = data.door_photo;
			// 整体照
			reqData.shop_photo = data.shop_photo;
			// 冰洗区照
			reqData.ice_wash_photo = data.ice_wash_photo;
			// 空调区照片
			data.air_conditioning_photo && (reqData.air_conditioning_photo = data.air_conditioning_photo);
			// 电视区照
			data.television_photo && (reqData.television_photo = data.television_photo);
			// 厨电区照片
			data.kitchen_photo && (reqData.kitchen_photo = data.kitchen_photo);
			// 小区照
			data.small_area_photo && (reqData.small_area_photo = data.small_area_photo);
			return reqData;
		},
		//客户分类提交
		submit() {
			let isOk = true;
			utils.validate(this.datas, this.rules, (res, errors) => {
				if (!res) {
					isOk = false;
				}
			});
			if (!isOk) return;
			if (this.clearnTime) {
				clearTimeout(this.clearnTime);
			}
			this.clearnTime = setTimeout(() => {
				let data = this.validmyRequest();
				if (!data) return;
				data.is_active = 0; //1为激活  0不激活
				data.is_submit = 0; //0不提交 
				console.log(JSON.stringify(data, null, 4));
				uni.showLoading({
					title: '保存中...',
					mask: true
				});
				if (data) {
					this.holdpost(data)
						.then(res => {
							uni.showToast({
								title: '保存成功',
								icon: 'success'
							});
							setTimeout(function() {
								let pages = getCurrentPages();
								let beforePage = pages[pages.length - 2];
								uni.navigateBack({
									success() {
										beforePage.data.tabIndex = 1;
										beforePage.$vm.updateUnActiveFun();
									}
								});
							}, 1500);
						})
						.catch(err => {
							uni.showToast({
								title: '保存失败',
								icon: 'none'
							});
						});
				}
			}, 800);
		},
		
		holdpost(data) {
			return new Promise((resolve, reject) => {
				this.$myRequest({
					url: this.$myhttpUrl.customerApply_update,
					data: data,
					success: res => {
						resolve();
					},
					fail: err => {
						reject();
					}
				});
			});
		}
	}
};
</script>

<style lang="scss">
@import '@/common/css/jiandang.scss';
</style>
