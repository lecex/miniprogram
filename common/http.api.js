// 如果没有通过拦截器配置域名的话，可以在这里写上完整的URL(加上域名部分)

// 此处第二个参数vm，就是我们在页面使用的this，你可以通过vm获取vuex等操作，更多内容详见uView对拦截器的介绍部分：
// https://uviewui.com/js/http.html#%E4%BD%95%E8%B0%93%E8%AF%B7%E6%B1%82%E6%8B%A6%E6%88%AA%EF%BC%9F
const install = (Vue, vm) => {
	// 此处使用了传入的params参数，一切自定义即可
	let Auth = (params = {}) => vm.$u.post('/user-api/auth/auth', params);
	// 此处使用了传入的params参数，一切自定义即可
	let UserInfo = (params = {}) => vm.$u.post('/user-api/users/info', params);
	let UserSelfUpdate = (params = {}) => vm.$u.post('/user-api/users/selfUpdate', params);
	
	// 信息管理
	let SendCaptcha = (params = {}) => vm.$u.post('/message-api/message/sendCaptcha', params); 
	
	// 社会登录授权
	let SocialitesAuth = (params = {}) => vm.$u.post('/socialite-api/socialites/auth', { socialite: params });
	// 涩会登录注册
	let SocialitesRegister = (params = {}) => vm.$u.post('/socialite-api/socialites/register', params);

	/**
	 * sql2000
	 */
	let DepartmentSale = (params = {}) => vm.$u.post('/sql2000-api/department/sale', params);
	let GetGoods = (params = {}) => vm.$u.post('/sql2000-api/items/get', params);
	// 将各个定义的接口名称，统一放进对象挂载到vm.$u.api(因为vm就是this，也即this.$u.api)下
	vm.$u.api = { 
		Auth, 
		UserInfo, 
		UserSelfUpdate,
		
		SendCaptcha,
		
		SocialitesAuth,
		SocialitesRegister,

		DepartmentSale,
		GetGoods
	};
}

export default {
	install
}