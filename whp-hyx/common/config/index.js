// let reqDomain = "";
// if (process.env.NODE_ENV === 'development') {
// 	// 开发环境
// 	reqDomain = "http://223.240.70.9:7011";
// } else if (process.env.NODE_ENV === 'production') {
// 	// 生产环境
// 	reqDomain = "https://sales.whirlpool-china.com:7002";
// }
const MyConfig = {
	reqDomain: 'http://223.240.70.9:7011', 
	businessDomain:"https://hyx.whirlpool-china.com",
	tMapsKey: 'MOGBZ-7LA6W-FF2RJ-R5D6X-TDBR2-P7B4M', // 腾讯地图的key
	reqPort: '',
	isDebug: false,
	reqLoginUrl: '/openapi/wxmp/login/submit.jhtml', //登陆接口
	upUrl: 'https://hzx.whirlpool-china.com:7011/common/file/upload.jhtml?companyCode=hyx_mp',
	comFuncs: {
		/**
		 * @param {Object}  obj  页面跳转传递参数
		 * */
		queryParams(obj) {
			if (Object.prototype.toString.call(obj) !== '[object Object]') {
				return ""
			};
			let str = `?item= ${encodeURIComponent(JSON.stringify(obj))}`
			return str
		}
	}
}

export default MyConfig
