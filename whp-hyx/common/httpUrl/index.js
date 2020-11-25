
const httpUrl = {
	login: '/openapi/wxmp/login/submit.jhtml', // 登录获取token
	indexTop_ad: '/openapi/wxmp/index/top_ad.jhtml', // 首页顶部广告
	index_new_dot: "/openapi/wxmp/index/new_dot.jhtml", //首页网店进度
	index_not_dot_list: "/openapi/wxmp/index/not_dot_list.jhtml", //首页网店进度(详细)
	index_store_dot: "/openapi/wxmp/index/store_dot.jhtml", //首页巡店计划(详细)
	index_NoVisitedStore: "/openapi/wxmp/index/getNoVisitedStoreByRole.jhtml", //首页未巡逻店
	index_visitedStore: "/openapi/wxmp/index/getVisitedStoreByRole.jhtml", //首页已巡逻店
	index_topList: "/openapi/wxmp/product/topList.jhtml", // 首页top机型
	index_cg_and_ls: "/openapi/wxmp/store/index_cg_and_ls.jhtml", // 首页采购和零售任务进度
	/* 首页活动促销START  */
	store_pc_list: '/openapi/wxmp/store/pc_list.jhtml', // 获取品牌品类
	index_sales_promotion_save: "/openapi/wxmp/sales_promotion/save.jhtml", // 活动上报
	index_sales_promotion_list: "/openapi/wxmp/sales_promotion/list.jhtml", // 
	/* 首页活动促销END  */
	bind: '/openapi/wxmp/bind/submit.jhtml', // 登录绑定
	sendAuthCode: '/openapi/wxmp/sms_auth_code/send_auth_code.jhtml', //获取短信验证码  可选：10001注册验证码, 10002 修改密码, 10003 绑定账号, 10004 更换手机号码，10005 合伙人申请
	custBizIndex: '/openapi/wxmp/cust_biz_index/index.jhtml', // 业务员首页
	areaSelect: '/openapi/wxmp/area/select.jhtml', //获取省市区
	custBaseData: '/openapi/wxmp/cust_base_data/list.jhtml', // 客户申请中基础数据
	customerApply_select: '/openapi/wxmp/customer_apply/select.jhtml', // 客户申请详情
	findStore: '/openapi/wxmp/company_info/find_store.jhtml', // 查询所选区域 type  1:区域 2:店铺
	brandCategoryList: '/openapi/wxmp/brand_category/list.jhtml', //获取品牌品类
	customerApply_update: '/openapi/wxmp/customer_apply/update.jhtml', //提交客户申请
	customerApply_save: '/openapi/wxmp/customer_apply/save.jhtml', //保存客户申请
	twkanban_list: '/openapi/wxmp/twkanban/list.jhtml', //网点拜访首页列表
	memberSaleOrgList: '/openapi/wxmp/member/sale_org_list.jhtml', // 网点拜访-按业务员角色选择分公司             (废弃)
	findSalemanList:'/openapi/wxmp/member/find_saleman_list.jhtml',  // 筛选分工司人员
	salemanList: '/openapi/wxmp/twkanban/saleman_list.jhtml', // 网点拜访-分公司-人员                              (废弃)
	kpi_choose_salesman: "/openapi/wxmp/store/kpi_choose_salesman.jhtml", //原kpi模块 筛选分公司/人员               (废弃)
	storeList: '/openapi/wxmp/customer_apply/store_list.jhtml', //分店
	customerList: '/openapi/wxmp/twkanban/customer_list.jhtml', //网点拜访获取客户名称
	businessCategoryList: '/openapi/wxmp/brand_category/business_category_list.jhtml', // 根据客户id获取授权品牌
	searchList: '/openapi/wxmp/member/searchList.jhtml', //选择抄送员列表
	twkanbanSave: '/openapi/wxmp/twkanban/save.jhtml', // 提交访问发布
	unbind: '/openapi/wxmp/unbind/submit.jhtml', // 解绑
	visitCustomerList: '/openapi/wxmp/twkanban/visit_customer_list.jhtml', // 网点拜访查询
	saleOrgList: '/openapi/wxmp/twkanban/sale_org_list.jhtml', // 网点拜访-分公司
	memberSupervisorList: '/openapi/wxmp/member/supervisor_list.jhtml', //客户建档-分公司终端主管筛选
	supervisorList: '/openapi/wxmp/customer_apply/supervisor_list.jhtml', // 终端主管人员
	getRsaCode: '/openapi/wxmp/login/get_rsa_code.jhtml', // 获取公钥,私钥
	sendAuthCode4updatePwd: '/openapi/wxmp/password/send_auth_code.jhtml', // 修改密码-获取验证码
	updatePwdOrPaypwd: '/openapi/wxmp/password/update_pwd_or_paypwd.jhtml', // 修改密码
	twkanbanDetail: '/openapi/wxmp/twkanban/select.jhtml', // 获取看板详情
	customer_apply_list: '/openapi/wxmp/customer_apply/list.jhtml', //客户申请列表
	customer_apply_submit: '/openapi/wxmp/customer_apply/submit.jhtml', // 客户申请提交
	addCommon: '/openapi/wxmp/member/addCommon.jhtml', // 常用联系人
	customer_apply_statback: '/openapi/wxmp/customer_apply/statback.jhtml', // 客户申请提交撤回
	systemDict: '/openapi/wxmp/systemDict/list.jhtml', // 建党其他品类
	articleList: '/openapi/wxmp/index/article_list.jhtml', // 通知公告列表
	articleSelect: '/openapi/wxmp/index/article_select.jhtml', // 通知公告详情
	member_getInfo: '/openapi/wxmp/member/getInfo.jhtml', //我的页面获取个人信息
	update_getInfo: '/openapi/wxmp/member/update.jhtml', //更新个人信息
	getCustomerByRole: '/openapi/wxmp/store/getCustomerByRole.jhtml', //客户运营 - 分销商
	getAgentCustomerByRole: '/openapi/wxmp/store/getAgentCustomerByRole.jhtml', //客户运营 - 代理商
	custBaseDatalist: '/openapi/wxmp/cust_base_data/list.jhtml', //客户运营-基础数据选项值
	// 报表我的采购
	kpi_mycg_all: "/openapi/wxmp/store/kpi_mycg_all.jhtml", //年月汇总
	brand_pc_list: "/openapi/wxmp/store/brand_pc_list.jhtml", //品牌品类
	kpi_mycg_brand_pc: "/openapi/wxmp/store/kpi_mycg_brand_pc.jhtml", //获取品牌年月汇总
	kpi_mycg_all_items: "/openapi/wxmp/store/kpi_mycg_all_items.jhtml", //我的采购年月汇总(不含品牌)
	kpi_mycg_brand_pc_items: "/openapi/wxmp/store/kpi_mycg_brand_pc_items.jhtml", //我的采购年月汇总详情(含品牌)
	//我的零售
	record_amount_items: "/openapi/wxmp/countResellerRetail/record_amount_items.jhtml", //年月汇总详细
	brand_record_amount_items: "/openapi/wxmp/countResellerRetail/brand_record_amount_items.jhtml", //kpi报表我的零售品牌品类年月汇总明细列表
	record_amount: "/openapi/wxmp/countResellerRetail/record_amount.jhtml", // 我的零售年月汇总
	brand_record_amount: "/openapi/wxmp/countResellerRetail/brand_record_amount.jhtml", // 我的零售品牌年月汇总
	//我的批发分销
	kpi_myfx_all: "/openapi/wxmp/store/kpi_myfx_all.jhtml", //我的批发分销年月汇总
	kpi_myfx_brand_pc: "/openapi/wxmp/store/kpi_myfx_brand_pc.jhtml", //我的批发分销品牌品类年月汇总
	kpi_myfx_all_items: "/openapi/wxmp/store/kpi_myfx_all_items.jhtml", //我的批发分销年月汇总明细
	kpi_myfx_brand_pc_items: "/openapi/wxmp/store/kpi_myfx_brand_pc_items.jhtml", //我的批发分销品牌品类年月汇总明细
	// sellout
	sellout_record_amount: "/openapi/wxmp/sellout/record_amount.jhtml", //KPI-我的sellout-年汇总和月汇总
	sellout_brand_record_amount: "/openapi/wxmp/sellout/brand_record_amount.jhtml", //KPI我的sellout-品牌品类年月汇总
	kpi_my_sellout_all_items: "/openapi/wxmp/sellout/kpi_my_sellout_all_items.jhtml", // 年月总汇总
	kpi_my_sellout_brand_pc_items: "/openapi/wxmp/sellout/kpi_my_sellout_brand_pc_items.jhtml", // 品牌品类年月汇总
	
	customer_apply_update: "/openapi/wxmp/store/update.jhtml", // 已激活客户详情修改
	xieyi_member: "/resources/xieyi/member.html", //隐私协议

	// 考勤打卡 
	store_attendance_clock: "/openapi/wxmp/storeAttendanceClock/findCustomerList.jhtml", // 获取客户列表
	store_attendance_clock_save: "/openapi/wxmp/storeAttendanceClock/save.jhtml", //提交考勤接口
	
}


export default httpUrl
