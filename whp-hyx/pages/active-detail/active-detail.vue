<template>
	<view class="w-100 position-relative">
		<evan-form class="evan-form-show " :hide-required-asterisk="hideRequiredAsterisk" ref="form" :model="datas">
			<evan-form-item label="客户分类" :labelStyle="{ color: '#fdc100' }" class="evan-form-item"></evan-form-item>
			<!-- 客户分类 -->
			<uni-section title="渠道类型" marginTop="0px" type="square" bgColor="#40CCFF"></uni-section>
			<!-- 大渠道 -->
			<evan-form-item label="大渠道" class="evan-form-item" show_jiantou prop="one_category_id">
				<picker mode="selector" disabled class="picker" :value="coloumOne[oneIndex].name" :range="coloumOne" range-key="name">
					<input disabled class="form-input" :value="oneIndex != null ? coloumOne[oneIndex].name : ''" />
				</picker>
			</evan-form-item>
			<evan-form-item label="小渠道" class="evan-form-item" show_jiantou prop="two_category_id">
				<picker mode="selector" disabled class="picker" :value="coloumTwo[twoIndex].name" :range="coloumTwo" range-key="name">
					<input disabled class="form-input" :value="twoIndex != null ? coloumTwo[twoIndex].name : ''" />
				</picker>
			</evan-form-item>
			<evan-form-item label="门店一级类型" class="evan-form-item" show_jiantou prop="three_category_id">
				<picker mode="selector" disabled class="picker" :value="coloumThree[threeIndex].name" :range="coloumThree" range-key="name">
					<input disabled class="form-input" :value="threeIndex != null ? coloumThree[threeIndex].name : ''" />
				</picker>
			</evan-form-item>
			<evan-form-item label="门店二级类型" class="evan-form-item" show_jiantou>
				<picker mode="selector" disabled class="picker" @change="formateCurrentIndex($event, 4)" :value="coloumFour[fourIndex].name" :range="coloumFour" range-key="name">
					<input disabled class="form-input" :value="fourIndex != null ? coloumFour[fourIndex].name : ''" />
				</picker>
			</evan-form-item>
			<evan-form-item label="经营方式" class="evan-form-item" show_jiantou>
				<picker disabled mode="selector" class="picker" :value="businessStyle[businessStyleIndex].name" :range="businessStyle" range-key="name">
					<input disabled class="form-input" :value="businessStyleIndex !== null ? businessStyle[businessStyleIndex].name : ''" />
				</picker>
			</evan-form-item>
			<evan-form-item label="门店分类" class="evan-form-item" show_jiantou>
				<picker disabled mode="selector" class="picker" :value="storesClass[storesClassIndex].name" :range="storesClass" range-key="name">
					<input disabled class="form-input" :value="storesClassIndex !== null ? storesClass[storesClassIndex].name : ''" />
				</picker>
			</evan-form-item>
			<uni-section title="客户分类" marginTop="0px" type="square" bgColor="#00EADD"></uni-section>
			<!-- 所属区域 -->
			<evan-form-item label="所属地区" class="evan-form-item" show_jiantou prop="sale_org_id">
				<picker mode="selector" disabled class="picker" :value="index3" :range="find_store" range-key="name">
					<input disabled class="form-input" :value="find_store[index3].name" />
				</picker>
			</evan-form-item>
			<!-- END 所属区域 -->
			<!-- 行政划区 -->
			<evan-form-item label="行政划区" class="evan-form-item" show_jiantou prop="administrative">
				<picker mode="selector" disabled class="picker" :value="index1" :range="huaQuArr" range-key="name">
					<input disabled class="form-input" :value="huaQuArr[index1].name || administrative_name" />
				</picker>
			</evan-form-item>
			<!-- end 行政划区 -->

			<!-- 网点/门店等级 -->
			<evan-form-item label="网点/门店等级" class="evan-form-item" show_jiantou prop="storeLevel">
				<picker mode="selector" disabled class="picker" :value="index2" :range="sale_org" range-key="name">
					<input disabled class="form-input" placeholder-style="font-size: 28rpx;color:#ccc;" :value="sale_org[index2].name" placeholder="请选择网点/门店等级" />
				</picker>
			</evan-form-item>
			<!-- end 网点/门店等级 -->
			

			<!-- 上级店铺 -->
			<view>
				<evan-form-item label="上级店铺" class="evan-form-item" show_jiantou>
					<input disabled class="form-input mynowarp text_overfidden" :value="stop_name_str" />
				</evan-form-item>
				<!-- 店铺下品牌品类 -->
				<view class="shop-list" v-for="item in shopList" :key="item.super_store_id">
					<view class="text-title d-flex" style="font-weight: bold;color: #333333;border-bottom: 1rpx solid #666666;">
						<view class="header" :style="{ flex: store_name_width }">{{ item.super_store_name }}</view>
						<view class="header" :style="{ flex: business_width }">业务员</view>
						<view class="header" :style="{ flex: supervisor_width }">终端主管</view>
					</view>
					<view class="d-flex" v-for="subitem in item.business_category_list" :key="subitem.business_category_id">
						<view class="header" :style="{ flex: store_name_width }">{{ subitem.business_category_name }}</view>
						<view class="header" :style="{ flex: business_width }">{{ subitem.salesman_name || '业务员' }}</view>
						<view class="header" :style="{ flex: supervisor_width }">{{ subitem.supervisor_name || '终端主管' }}</view>
					</view>
				</view>
			</view>
			<!-- 导购信息 -->
			<uni-section title="导购信息" marginTop="0px" type="square" bgColor="#FD9D14"></uni-section>
			<view class="shop-list"  v-if="guideInfos.length">
				<view class="text-title d-flex" style="font-weight: bold;color: #333333;border-bottom: 1rpx solid #666666;">
					<view class="header" :style="{ flex: business_width }">导购员联系人</view>
					<view class="header" :style="{ flex: business_width }">兼职/专职</view>
					<view class="header" :style="{ flex: business_width }">联系电话</view>
				</view>
				<view class="d-flex"  v-for="item in guideInfos" :key="item.guideMobile">
					<view class="header" :style="{ flex: business_width }">{{ item.guideName }}</view>
					<view class="header" :style="{ flex: business_width }">{{item.workType}}</view>
					<view class="header" :style="{ flex: business_width }">{{ item.guideMobile}}</view>
				</view>
			</view>

			<!-- 其他的品类 -->
			<view>
				<evan-form-item label="其他品类" class="evan-form-item" v-if="systemDict_detail_name">
					<input disabled type="text" class="form-input mynowarp" v-model="systemDict_detail_name" />
				</evan-form-item>
			</view>

			<view class="w-100 d-flex a-center reletion-store">
				<view class="dot"></view>
				<view class="name">客户多门店关联</view>
				<view class="sub-name mx-2">(非多门店可不勾选)</view>
			</view>
			<evan-form-item label="是否为店主" class="evan-form-item">
				<input type="text" class="form-input mynowarp" :value="datas.is_main_store === 1 ? '是' : datas.is_main_store === 0 ? '否' : ''" disabled />
			</evan-form-item>

			<evan-form-item label="是否为惠分销门店" class="evan-form-item">
				<input type="text" class="form-input mynowarp" :value="datas.whetherSmallb === 1 ? '是' : datas.whetherSmallb === 0 ? '否' : ''" disabled />
			</evan-form-item>

			<!-- 基本信息 -->
			<uni-section title="基本信息" marginTop="0px" type="square" bgColor="#FFCD00"></uni-section>
			<evan-form-item label="门店名称" class="evan-form-item" prop="customer_name">
				<input disabled type="text" confirm-type="确定" class="form-input mynowarp" :value="datas.customer_name" />
			</evan-form-item>

			<evan-form-item label="商业单位名称" class="evan-form-item"><input disabled type="text" class="form-input mynowarp" :value="datas.business_name" /></evan-form-item>

			<evan-form-item label="商业单位门店编码" class="evan-form-item">
				<input disabled type="text" class="form-input mynowarp" :value="datas.business_store_code" />
			</evan-form-item>

			<evan-form-item label="联系人" class="evan-form-item"><input disabled type="text" class="form-input mynowarp" :value="datas.contacts" /></evan-form-item>

			<evan-form-item label="联系电话" class="evan-form-item"><input disabled type="number" class="form-input mynowarp" :value="datas.mobile" /></evan-form-item>

			<evan-form-item label="地址" class="evan-form-item" show_jiantou><input disabled class="form-input mynowarp" :value="datas.area_name" /></evan-form-item>
			<evan-form-item class="evan-form-item" label="详细地址" prop="address">
				<input type="text" disabled class="form-input mynowarp" :value="datas.address" />
			</evan-form-item>
			<evan-form-item label="门店所在地邮政编码" class="evan-form-item"><input disabled type="number" :value="datas.location_code" /></evan-form-item>
			<evan-form-item label="业务员" class="evan-form-item" show_jiantou><input type="text" disabled class="form-input mynowarp" :value="loginInfo.name" /></evan-form-item>
			<evan-form-item label="终端主管" class="evan-form-item" show_jiantou>
				<input type="text" disabled class="form-input mynowarp" :value="supervisor_name" />
			</evan-form-item>
			<uni-section title="上传图片" marginTop="0px" type="square" bgColor="#FD9D14"></uni-section>
			<view class="upimg d-flex flex-wrap">
				<view class="d-flex upload_item flex-column a-center">
					<view class="m-1 upload_item_content">
						<image v-if="datas.door_photo" :src="datas.door_photo" class="upload_item_content_image"></image>
						<view v-else class="iconfont  upload_item_content_haost">&#xe602;</view>
					</view>
					<view class="font-sm text-muted upload_item_bottom_text">
						<i>*</i>
						门头照
					</view>
				</view>
				<view class="d-flex upload_item flex-column a-center">
					<view class="m-1 upload_item_content">
						<image v-if="datas.shop_photo" :src="datas.shop_photo" class="upload_item_content_image"></image>
						<view v-else class="iconfont  upload_item_content_haost">&#xe602;</view>
					</view>
					<view class="font-sm text-muted upload_item_bottom_text">
						<i>*</i>
						门店整体照片
					</view>
				</view>
				<view class="d-flex upload_item flex-column a-center">
					<view class="m-1 upload_item_content">
						<image v-if="datas.ice_wash_photo" :src="datas.ice_wash_photo" class="upload_item_content_image"></image>
						<view v-else class="iconfont  upload_item_content_haost">&#xe602;</view>
					</view>
					<view class="font-sm text-muted upload_item_bottom_text">
						<i>*</i>
						冰洗区照片
					</view>
				</view>
				<view class="d-flex upload_item flex-column a-center">
					<view class="m-1 upload_item_content">
						<image v-if="datas.air_conditioning_photo" :src="datas.air_conditioning_photo" class="upload_item_content_image"></image>
						<view v-else class="iconfont  upload_item_content_haost">&#xe602;</view>
					</view>
					<view class="font-sm text-muted upload_item_bottom_text">空调区照片</view>
				</view>
				<view class="d-flex upload_item flex-column a-center">
					<view class="m-1 upload_item_content">
						<image v-if="datas.television_photo" :src="datas.television_photo" class="upload_item_content_image"></image>
						<view v-else class="iconfont  upload_item_content_haost">&#xe602;</view>
					</view>
					<view class="font-sm text-muted upload_item_bottom_text">电视区照片</view>
				</view>

				<view class="d-flex upload_item flex-column a-center">
					<view class="m-1 upload_item_content">
						<image v-if="datas.kitchen_photo" :src="datas.kitchen_photo" class="upload_item_content_image"></image>
						<view v-else class="iconfont  upload_item_content_haost">&#xe602;</view>
					</view>
					<view class="font-sm text-muted upload_item_bottom_text">厨电区照片</view>
				</view>
				<view class="d-flex upload_item flex-column a-center">
					<view class="m-1 upload_item_content">
						<image v-if="datas.small_area_photo" :src="datas.small_area_photo" class="upload_item_content_image"></image>
						<view v-else class="iconfont  upload_item_content_haost">&#xe602;</view>
					</view>
					<view class="font-sm text-muted upload_item_bottom_text">小电区照片</view>
				</view>
			</view>
			<!-- 财务信息 -->

			<uni-section title="财务信息" marginTop="0px" type="square" bgColor="#178EF6"></uni-section>

			<!-- 三证合一 -->
			<view class="form" v-if="zsindex === 0">
				<evan-form-item label="统一社会信用代码" class="evan-form-item" prop="snified_social_credit_code">
					<input disabled type="text" class="form-input mynowarp" :value="datas.snified_social_credit_code" />
				</evan-form-item>
				<evan-form-item label="单位名称" class="evan-form-item" prop="company_name">
					<input type="text" disabled class="form-input mynowarp" :value="datas.company_name" />
				</evan-form-item>
				<evan-form-item label="银行账号" class="evan-form-item" prop="bank_account">
					<input disabled type="number" class="form-input mynowarp" :value="datas.bank_account" />
				</evan-form-item>

				<evan-form-item label="开户行" class="evan-form-item" prop="opening_bank">
					<input disabled type="text" class="form-input mynowarp" :value="datas.opening_bank" />
				</evan-form-item>
				<view class=" px-3 py-1">上传附件</view>
				<view class="d-flex upload_item flex-column a-center">
					<view class="m-1 upload_item_content">
						<image v-if="cust_apply_attachs[3].url" :src="cust_apply_attachs[3].url" class="upload_item_content_image"></image>
						<view v-else class="iconfont  upload_item_content_haost">&#xe602;</view>
					</view>
					<view class="font-sm text-muted upload_item_bottom_text">
						<i>*</i>
						统一社会信用代码
					</view>
				</view>
			</view>

			<!-- 三证 -->
			<view class="form" v-if="zsindex === 1">
				<evan-form-item label="营业执照编码" class="evan-form-item" prop="business_license_number">
					<input disabled type="text" class="form-input mynowarp" :value="datas.business_license_number" />
				</evan-form-item>
				<evan-form-item label="组织机构代码" class="evan-form-item" prop="sale_org_code">
					<input disabled type="text" class="form-input mynowarp" :value="datas.sale_org_code" />
				</evan-form-item>

				<evan-form-item label="纳税人识别号" class="evan-form-item" prop="taxpayer_number">
					<input disabled type="text" class="form-input mynowarp" :value="datas.taxpayer_number" />
				</evan-form-item>
				<evan-form-item label="发票抬头" class="evan-form-item" prop="invoice_title">
					<input type="text" disabled class="form-input mynowarp" :value="datas.invoice_title" />
				</evan-form-item>
				<evan-form-item label="银行账号" class="evan-form-item" prop="bank_account">
					<input disabled type="number" confirm-type="确定" class="form-input mynowarp" :value="datas.bank_account" />
				</evan-form-item>
				<evan-form-item label="开户行" class="evan-form-item" prop="opening_bank">
					<input disabled type="text" class="form-input mynowarp" :value="datas.opening_bank" />
				</evan-form-item>
				<view class="px-3 py-1">上传附件</view>
				<view class="d-flex a-center j-center">
					<block v-for="(item, index) in cust_apply_attachs" :key="index">
						<view class="d-flex upload_item flex-column a-center" v-if="item.type !== 0">
							<view class="m-1 upload_item_content">
								<view v-if="!item.url" class="iconfont  upload_item_content_haost">&#xe602;</view>
								<image v-else :src="item.url" class="upload_item_content_image"></image>
							</view>
							<view class="font-sm text-muted upload_item_bottom_text">
								<i>*</i>
								{{ item.attach_name }}
							</view>
						</view>
					</block>
				</view>
			</view>
			<uni-section title="纳税人类型" marginTop="0px" type="square" bgColor="#40CCFF"></uni-section>

			<evan-form-item label="纳税人类型" class="evan-form-item" show_jiantou prop="taxpayer_type">
				<picker mode="selector" disabled class="picker" @change="ontaxpayerType" :range="taxpayer_list" range-key="name">
					<input disabled class="form-input" :value="taxpayerindex !== null ? taxpayer_list[taxpayerindex].name : ''" />
				</picker>
			</evan-form-item>

			<uni-section title="发票寄送地址" marginTop="0px" type="square" bgColor="#40CCFF"></uni-section>

			<evan-form-item label="财务联系人" class="evan-form-item" prop="consignee_name">
				<input disabled type="text" class="form-input mynowarp" :value="datas.consignee_name" />
			</evan-form-item>

			<evan-form-item label="财务联系电话" class="evan-form-item" prop="consignee_mobile">
				<input disabled type="number" class="form-input mynowarp" :value="datas.consignee_mobile" />
			</evan-form-item>

			<evan-form-item label="财务地址" class="evan-form-item" show_jiantou prop="consignee_area">
				<input disabled type="text" class="form-input mynowarp" :value="consignee_area_name" />
			</evan-form-item>
			<evan-form-item label="财务详细地址" class="evan-form-item" prop="consignee_address">
				<input type="text" disabled class="form-input mynowarp" :value="datas.consignee_address" />
			</evan-form-item>
		</evan-form>
	</view>
</template>

<script>
import evanForm from '@/components/evan-form/evan-form.vue';
import evanFormItem from '@/components/evan-form/evan-form-item.vue';
import uniSection from '@/components/uni/uni-section/uni-section.vue';
import utils from '@/components/evan-form/utils.js';
// 基本信息的地址选择
import { mapState, mapActions } from 'vuex';
import test from '@/ulits/function/test.js';
import { deepClone } from '@/ulits/Validation.js';
export default {
	components: {
		evanForm,
		evanFormItem,
		uniSection
	},
	data() {
		return {
			clearnTime: null,
			zsindex: 0,
			hideRequiredAsterisk: false, //表单验证
			oneIndex: null, //大渠道选择
			twoIndex: null, //小渠道选择
			threeIndex: null, //一级门店
			fourIndex: null, //二级门店
			index1: null, //行政划区
			administrative_name: '',
			index2: null, //网点/门店等级
			store_name_width: 2,
			business_width: 1,
			supervisor_width: 1,
			cust_apply_attachs: [
				{
					attach_name: '营业执照编码',
					url: '',
					file_name: '',
					type: 2
				},
				{
					attach_name: '组织机构代码',
					url: '',
					file_name: '',
					type: 3
				},
				{
					attach_name: '纳税人识别号',
					url: '',
					file_name: '',
					type: 4
				},
				{
					attach_name: '统一社会信用代码',
					url: '',
					file_name: '',
					type: 0
				}
			], // 附件
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

			index3: null, //获取所属区域
			stop_id_str: '', //选中店铺的id
			guideInfos:[], //导购信息
			shopList: [], //上级店铺下品牌品类(赋值和shoplist一样格式)
			systemDict: [],
			taxpayerindex: null, //纳税人类型
			selectCityType: 1, // 1选择基本信息地址 2财务信息地址
			popShow: false, // 是否打开地址选择模块框
			supervisor_name: '', //终端主管名称
			systemDict_detail_name: '',
			otherBrand: [], // 选中id[id1,id2,..]
			consignee_area_name: '', //财务地址
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
				is_main_store: null, // 是否主店
				whetherSmallb: null,
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
				snified_social_credit_code: '', //统一社会信用代码
				bank_account: '', //银行账号
				opening_bank: '', //开户行
				business_license_number: '', //营业执照编码
				sale_org_code: '', //组织机构代码
				taxpayer_number: '', //纳税人识别号
				company_name: '', //发票信息-单位名称
				invoice_title: '', //发票信息-发票抬头
				taxpayer_type: null, // 纳税人类型id
				consignee_name: '', //财务联系人
				consignee_mobile: '', //财务联系电话
				consignee_area: null, //财务地址id
				consignee_address: '', //财务详细地址
				customer_apply_id: null // 获取详情的客户id
			},
			is_active: null, // 获取详情的参数 是否合作
			rules: {
				customer_apply_id: {
					required: true,
					message: '请提交客户id'
				},
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
				// four_category_id: {
				// 	required: true,
				// 	message: '请选择门店二级类型'
				// },
				// customer_type: {
				// 	required: true,
				// 	message: '请选择经营方式'
				// },
				// business_model: {
				// 	required: true,
				// 	message: '请选择门店分类'
				// },

				storeLevel: {
					required: true,
					message: '请选择门店等级'
				},
				administrative: {
					required: true,
					message: '请选择行政等级'
				},
				location_code: {
					required: true,
					message: '请输写门店所在地邮政编码'
				}, //门店所在地编码
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
				},
				snified_social_credit_code: {
					required: true,
					validator: (rule, value, callback) => {
						if (this.zsindex == 0) {
							if (value.length === 18) {
								callback();
							} else {
								callback(new Error('请填写18位字符的社会信用代码'));
							}
						} else {
							callback();
						}
					}
				},
				company_name: {
					required: true,
					validator: (rule, value, callback) => {
						if (this.zsindex == 0) {
							if (value.length !== 0) {
								callback();
							} else {
								callback(new Error('请填写发票信息-单位名称'));
							}
						} else {
							callback();
						}
					}
				},

				business_license_number: {
					required: true,
					// 纳税人识别号
					validator: (rule, value, callback) => {
						if (this.zsindex == 1) {
							if (value.length !== 0) {
								callback();
							} else {
								callback(new Error('请填写营业执照编码'));
							}
						} else {
							callback();
						}
					}
				},
				sale_org_code: {
					required: true,
					// 纳税人识别号
					validator: (rule, value, callback) => {
						if (this.zsindex == 1) {
							if (value.length !== 0) {
								callback();
							} else {
								callback(new Error('请填写组织机构代码'));
							}
						} else {
							callback();
						}
					}
				},
				taxpayer_number: {
					required: true,
					// 纳税人识别号
					validator: (rule, value, callback) => {
						if (this.zsindex == 1) {
							if (value.length !== 0) {
								callback();
							} else {
								callback(new Error('请填写纳税人识别号'));
							}
						} else {
							callback();
						}
					}
				},
				invoice_title: {
					required: true,
					// 纳税人识别号
					validator: (rule, value, callback) => {
						if (this.zsindex == 1) {
							if (value.length !== 0) {
								callback();
							} else {
								callback(new Error('请填写发票信息-发票抬头'));
							}
						} else {
							callback();
						}
					}
				},

				bank_account: {
					required: true,
					message: '请填写银行账号'
				},
				opening_bank: {
					required: true,
					message: '请填写开户行'
				},
				taxpayer_type: {
					required: true,
					message: '请选择纳税人类型'
				}, // 纳税人类型id
				consignee_name: {
					required: true,
					message: '请输写财务联系人'
				}, //财务联系人
				consignee_mobile: [
					{
						required: true,
						message: '请输入财务-手机号'
					},
					{
						validator: this.isMobilePhone
					}
				],
				consignee_area: {
					required: true,
					message: '请输写财务地址'
				}, //财务地址
				consignee_address: {
					required: true,
					message: '请输写财务详细地址'
				} //财务详细地址
			}
		};
	},
	onLoad(option) {
		if (option) {
			option && (option = this.$formateOption(option));
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
			taxpayer_list: state => state.channel.taxpayer_list,
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
					this.datas.one_category_id = value;
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
					this.datas.two_category_id = value;
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
					this.datas.three_category_id = value;
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
		// 所属区域
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
		// 门店等级
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
		// 行政等级
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
		},
		// 纳税人类型id
		taxpayer_type: {
			get: function() {
				return this.datas.taxpayer_type;
			},
			set: function(value) {
				this.datas.taxpayer_type = value;
				let index = this.taxpayer_list.findIndex(v => v.id === value);
				if (index > -1) {
					this.taxpayerindex = index;
				}
			}
		},
		// 店铺名称
		stop_name_str() {
			return this.shopList.map(v => v.super_store_name).join(';');
		}
	},

	methods: {
		...mapActions(['getQuDaoData', 'getStoreData']),
		// 其他品牌
		OtherClass() {
			return new Promise((resolve, reject) => {
				this.$myRequest({
					url: this.$myhttpUrl.systemDict,
					success: res => {
						resolve(res.data);
					},
					fail: err => {
						reject(err.message);
					}
				});
			});
		},
		isMobilePhone(rule, value, callback) {
			if (test.mobile(value)) {
				callback();
			} else {
				callback(new Error('手机号格式不正确'));
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
				//获取其他品类
				let res3 = await this.OtherClass();
				res3 = res3.map(v => {
					return {
						...v,
						checked: false
					};
				});
				this.systemDict = res3;
				// 获取详情数
				let resdata = await this.getDetailData();
				if (resdata) {
					this.orgData(resdata);
				}
				uni.hideLoading();
			} catch (error) {
				uni.showToast({
					title: '获取详情失败',
					icon: 'none'
				});
				console.log('error', error.message);
			}
		},
		// 获取详情数据
		getDetailData() {
			if (this.datas.customer_apply_id === null || this.is_active === null) {
				return false;
			}
			return new Promise((resolve, reject) => {
				let parmas = {
					customer_apply_id: this.datas.customer_apply_id,
					is_active: this.is_active
				};

				this.$myRequest({
					url: this.$myhttpUrl.customerApply_select,
					data: parmas,
					success: res => {
						resolve(res.data);
					},
					fail: err => {
						reject();
					}
				});
			});
		},
		// 渲染其他品牌
		rendersystemDict(strIds) {
			const other_catarr = strIds;
			const systemDict = this.systemDict;
			const tempSystemDict = systemDict.map(v => {
				const isHasIncludes = other_catarr.includes(v.id);
				return {
					...v,
					checked: isHasIncludes
				};
			});
			this.systemDict = tempSystemDict;
			this.systemDict_detail_name = this.getSystemDictKeyValue(tempSystemDict, 'value', ';');
		},

		/**
		 * 数组带分割符号的的字符串转为数字数组
		 * @param {String}   strs   要处理原字符串
		 * @param {Object}  options    配置参数
		 * @param {String} options.hasSymbol  获取数据分割的符号
		 * return {Array}
		 * */
		stringToNumberArray(strs, options) {
			const { hasSymbol } = options;
			if (typeof hasSymbol === 'string' && hasSymbol) {
				let ids = [];
				const isHas = strs.includes(hasSymbol);
				if (isHas) {
					ids = strs.split(hasSymbol).filter(v => {
						if (isNaN(parseInt(v))) {
							return false;
						} else {
							return true;
						}
					});
					ids = ids.map(Number);
				}
				return ids;
			}
		},
		/**
		 * @param {Array}  listArr  原数据
		 * @param {String}   keyname   要获取过滤掉check === true ,满足条件的keyname值
		 * @param {Array}  symbol  获取数据分割的符号
		 * return {String}
		 * */
		getSystemDictKeyValue(listArr, keyname, symbol = false) {
			let vaueStr = listArr.filter(v => v.checked).map(v => v[keyname]);
			if (symbol === false) {
				return vaueStr;
			}
			return (vaueStr = vaueStr.join(symbol));
		},

		// 详情赋值
		orgData(resdata) {
			console.log(JSON.stringify(resdata, null, 4));
			// 大渠道
			resdata.one_category_id && (this.one_category_id = resdata.one_category_id);
			// 小渠道
			resdata.two_category_id && (this.two_category_id = resdata.two_category_id);
			resdata.three_category_id && (this.three_category_id = resdata.three_category_id);
			resdata.four_category_id && (this.four_category_id = resdata.four_category_id);
			resdata.customer_type && (this.customer_type = resdata.customer_type);
			resdata.business_model && (this.business_model = resdata.business_model);
			// 所属区域
			resdata.sale_org_id && (this.sale_org_id = resdata.sale_org_id);
			// 网点等级
			resdata.store_level && (this.store_level = resdata.store_level); 
			this.guideInfos = resdata.guideInfos || [];
			// 上级店铺
			if (resdata.stores && Array.isArray(resdata.stores) && resdata.stores.length) {
				// 品牌的ids
				this.stop_id_str = resdata.stores.map(v => v.super_store_id).join(',');
				// 品牌品类
				this.shopList = this.addcheckedFun(resdata.stores, true);
			}

			// 其他品类
			if (resdata.other_category_id) {
				const ids = this.stringToNumberArray(resdata.other_category_id, {
					hasSymbol: ','
				});
				this.rendersystemDict(ids);
			}

			// 行政区域
			resdata.administrative && (this.administrative = resdata.administrative);
			resdata.administrative_name && (this.administrative_name = resdata.administrative_name);
			if (resdata.is_main_store === 1 || resdata.is_main_store === 0) {
				this.datas.is_main_store = resdata.is_main_store;
			}
			this.datas.whetherSmallb = resdata.whetherSmallb;

			// 基本信息
			resdata.customer_name && (this.datas.customer_name = resdata.customer_name);
			resdata.business_name && (this.datas.business_name = resdata.business_name);
			resdata.business_store_code && (this.datas.business_store_code = resdata.business_store_code);
			resdata.contacts && (this.datas.contacts = resdata.contacts);
			resdata.mobile && (this.datas.mobile = resdata.mobile);
			resdata.area_name && (this.datas.area_name = resdata.area_name);
			resdata.area_id && (this.datas.area_id = resdata.area_id);
			resdata.address && (this.datas.address = resdata.address);
			resdata.location_code && (this.datas.location_code = resdata.location_code);
			// 主管id
			resdata.supervisor && (this.datas.supervisor = resdata.supervisor);
			// 主管名称
			resdata.supervisor_name && (this.supervisor_name = resdata.supervisor_name);
			// 门头照
			resdata.door_photo && (this.datas.door_photo = resdata.door_photo);
			// 整体照
			resdata.shop_photo && (this.datas.shop_photo = resdata.shop_photo);
			// 冰洗照
			resdata.ice_wash_photo && (this.datas.ice_wash_photo = resdata.ice_wash_photo);
			// 空调区照
			resdata.air_conditioning_photo && (this.datas.air_conditioning_photo = resdata.air_conditioning_photo);
			// 电视区照
			resdata.television_photo && (this.datas.television_photo = resdata.television_photo);
			// 厨电区照
			resdata.kitchen_photo && (this.datas.kitchen_photo = resdata.kitchen_photo);
			// 小区照
			resdata.small_area_photo && (this.datas.small_area_photo = resdata.small_area_photo);
			// 三证合一
			if (test.isEmpty(resdata.taxpayer_number)) {
				this.zsindex = 0;
				// 统一社会信用代码
				resdata.snified_social_credit_code && (this.datas.snified_social_credit_code = resdata.snified_social_credit_code);
				resdata.company_name && (this.datas.company_name = resdata.company_name);
			} else {
				this.zsindex = 1;
				// 营业执照编码
				resdata.business_license_number && (this.datas.business_license_number = resdata.business_license_number);
				// 组织机构代码
				resdata.organization_code && (this.datas.organization_code = resdata.organization_code);
				// 纳税人识别号
				resdata.taxpayer_number && (this.datas.taxpayer_number = resdata.taxpayer_number);
				resdata.invoice_title && (this.datas.invoice_title = resdata.invoice_title);
			}
			// 附件
			if (resdata.cust_apply_attachs.length) {
				for (let i = 0; i < resdata.cust_apply_attachs.length; i++) {
					this.cust_apply_attachs.forEach(v => {
						if (resdata.cust_apply_attachs[i].type == v.type && resdata.cust_apply_attachs[i].url) {
							v.url = resdata.cust_apply_attachs[i].url;
							v.file_name = resdata.cust_apply_attachs[i].attach_name;
						}
					});
				}
			}

			// 银行账号
			resdata.bank_account && (this.datas.bank_account = resdata.bank_account);
			// 开户行
			resdata.opening_bank && (this.datas.opening_bank = resdata.opening_bank);
			// 纳税人类型
			resdata.taxpayer_type && (this.taxpayer_type = +resdata.taxpayer_type);
			// 财务联系人
			resdata.consignee_name && (this.datas.consignee_name = resdata.consignee_name);
			// 财务联系电话
			resdata.consignee_mobile && (this.datas.consignee_mobile = resdata.consignee_mobile);
			// 财务地址
			resdata.consignee_area_name && (this.consignee_area_name = resdata.consignee_area_name);
			// 财务地址id
			resdata.consignee_area_id && (this.datas.consignee_area = resdata.consignee_area_id);
			// 财务详细地址
			resdata.consignee_address && (this.datas.consignee_address = resdata.consignee_address);
		},

		// 获取店铺的品牌品类
		getFindStoreClass(stop_id_str) {
			this.$myRequest({
				url: this.$myhttpUrl.brandCategoryList,
				data: {
					store_ids: stop_id_str
				},
				success: res => {
					let list = this.addcheckedFun(res.data, false);
					this.shopList = list;
					uni.hideLoading();
				},
				fail: err => {
					uni.showToast({
						title: err.message,
						icon: 'none'
					});
				}
			});
		},
		// 处理店铺加入checked
		addcheckedFun(arr, val) {
			for (let i in arr) {
				for (let k in arr[i].business_category_list) {
					arr[i].business_category_list[k]['checked'] = val;
					arr[i].business_category_list[k]['supervisor'] = val ? arr[i].business_category_list[k]['supervisor'] : '';
					arr[i].business_category_list[k]['supervisor_name'] = val ? arr[i].business_category_list[k]['supervisor_name'] : '';
					arr[i].business_category_list[k]['salesman'] = val ? arr[i].business_category_list[k]['salesman'] : '';
					arr[i].business_category_list[k]['salesman_name'] = val ? arr[i].business_category_list[k]['salesman_name'] : '';
				}
			}
			return arr;
		},
		formaArr1(arr, obja = {}) {
			let newarr = [];
			arr.forEach(v => {
				let tempobj = {};
				for (let key in v) {
					if (key in obja) {
						tempobj[obja[key]] = v[key];
					} else {
						tempobj[key] = v[key];
					}
					if (Array.isArray(tempobj[key]) && tempobj[key].length > 0) {
						let ass = [];
						tempobj[key].forEach(s => {
							if ('checked' in s && s.checked) {
								ass.push({
									business_category_id: s.business_category_id,
									business_category_name: s.business_category_name,
									supervisor_id: s.supervisor,
									supervisor_name: s.supervisor_name,
									salesman: s.salesman,
									salesman_name: s.salesman_name
								});
							}
						});
						tempobj[key] = ass;
					}
				}
				newarr.push(tempobj);
			});
			return newarr;
		}
	}
};
</script>

<style lang="scss" scoped>
@import '@/common/css/jiandang.scss';
.a-center-child {
	height: 66rpx;
	line-height: 66rpx;
	width: 240rpx;
	font-size: 22rpx;
	text-align: center;
	background-color: #f2f2f2;
}

.a-center-child-l {
	background-color: #fdc100;
	color: #ffffff;
}
</style>
