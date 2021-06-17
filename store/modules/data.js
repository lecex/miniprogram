const url = 'https://service.xilewanggou.com:1443/sql2000-api/items/all'
const filePath = wx.env.USER_DATA_PATH + '/goods.json'
const state = {
	goods: {
		bars:{},
		plus:{}
	},
}

const mutations = {
	INIT_GOODS: (state, goods) => {
		state.goods = goods
	},
}

const actions = {
	// loadGoods 加载商品信息
	load({ commit }) {
		const fs = uni.getFileSystemManager()
		fs.readFile({
			filePath:filePath,
			encoding: 'UTF-8',
			success: function (res) {
				commit('INIT_GOODS', JSON.parse(res.data).goods)
			},
			fail(err){
				actions.downloadFile({ commit })
			}
		})
	},
 	// downloadFile 下载商品数据文件
	downloadFile({ commit }) {
		uni.downloadFile({
			url:url,
			filePath: filePath,
			success:(res)=>{
				if (res.statusCode === 200) {
					actions.load({ commit })
				}
			},
			fail(err){
				console.log(err);
			}
		})
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}
