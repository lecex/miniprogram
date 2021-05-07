const whiteList = ['/pages/register/index', '/pages/register/code'] // no redirect whitelist
const install = (Vue, vm) => {
	vm.$u.routeIntercept = (mergeConfig, resolve)=>{
		let token = uni.getStorageSync('token');
		if (token) {
			resolve(true)
		}
		if (whiteList.indexOf(mergeConfig.url) === -1){
			vm.$u.route({
				url: 'pages/register/index'
			})
		}else{
			resolve(true)
		}
	}
}

export default {
	install
}