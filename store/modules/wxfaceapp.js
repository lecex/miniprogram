import { WxFaceApp } from '@/utils/wxfaceapp'
import { EAN } from '@/utils/barcode'
import { parseTime, addPreZero }  from '@/utils'
const state = {
	order: {
		userId: '',
		terminal: '',
		orderNo: '',
		goods:[
		],
		pays: [],
		type: true, 	// true 正常 false 退货
		number: 0,		// 订单总数量
		total: 0,		// 订单总金额
		waitPay: 0, 	// 等待支付金额
		getAmount: 0,	// 获得的钱数【现金多会出现找零】
		status: false,  // 订单状态是否完结订单
		publish: false, // 订单是否发布
	},
}
const mutations = {
	SET_ORDER_KEY: (state, { key, value }) => { // 根据 key 设置订单参数
		state.order[key] = value
	},
	ADD_GOODS: (state, item) => {
		state.order.goods.unshift(JSON.parse(JSON.stringify(item)))
	},
	DELETE_GOODS: (state, item) => {
		for (var i = 0;i < state.order.goods.length; i++){
			if (state.order.goods[i].no===item.no && 
				state.order.goods[i].price===item.price && 
				state.order.goods[i].number===item.number &&
				state.order.goods[i].total===item.total
			){
				state.order.goods.splice(i,1);
			}
		}
	},
}

const actions = {
	terminal(){
		//获取青蛙相关信息
		wxfaceapp.checkWxFacePayOsInfo({
		success(res){
			console.log(res);
			console.log("success [checkWxFacePayOsInfo]")
			console.log(res.osSerialNumber) // 设备号
			console.log(res.osVersion) // 版本
			console.log(res.deviceInfo) // 设备信息
		},
		fail(res){
			console.log("fail [checkWxFacePayOsInfo]")
			console.log(res)
		}
		})
	},
	// listenCodePayment 监听键盘输入
	listenCodePayment({ state,commit }, api) {
		WxFaceApp.On("error",err=>{
			console.log(err);
		})
		WxFaceApp.On("goods",goods=>{
			commit('ADD_GOODS', goods)
			actions.handerOrder({ state,commit })
		})
		WxFaceApp.On("pay",res=>{
			console.log(2,res);
		})
		WxFaceApp.ListenCodePayment(api)
	},
 	// facePay 刷脸支付
	facePay({ commit }) {
		WxFaceApp.FacePay()
	},
	initOrder({ commit }){
		const terminal = '0001'
		const date = parseTime(new Date(),'{y}{m}{d}').substr(2, 6)
		const no = Number(wx.getStorageSync('{y}{m}{d}'))
		const orderNo = terminal+date+addPreZero(no?no:1, 4)
		commit('SET_ORDER_KEY', { key: 'userId', value: 'userId' })
		commit('SET_ORDER_KEY', { key: 'terminal', value: terminal })
		commit('SET_ORDER_KEY', { key: 'orderNo', value: orderNo })
		commit('SET_ORDER_KEY', { key: 'goods', value: [] })
		commit('SET_ORDER_KEY', { key: 'pays', value: [] })
		commit('SET_ORDER_KEY', { key: 'wtypeaitPay', value: true })
		commit('SET_ORDER_KEY', { key: 'number', value: 0 })
		commit('SET_ORDER_KEY', { key: 'total', value: 0 })
		commit('SET_ORDER_KEY', { key: 'getAmount', value: 0 })
		commit('SET_ORDER_KEY', { key: 'waitPay', value: 0 })
		commit('SET_ORDER_KEY', { key: 'status', value: false })
		commit('SET_ORDER_KEY', { key: 'publish', value: false })
	},
	deleteGoods({ state,commit }, goods){
		commit('DELETE_GOODS', goods)
		actions.handerOrder({ state,commit })
	},
	handerOrder({ state,commit }){
		let number = 0		// 订单数量
		let total = 0		// 订单金额
		let waitPay = 0		// 待支付
		let getAmount = 0	// 获得的钱数【现金多会出现找零】
		let no = state.order.goods.length
		state.order.goods.forEach((item,index) => {
			item.no = no // 计算序号
			no--
			if (!state.order.type && item.number > 0) { // 销货切换退货计算
				item.number = -item.number
				item.total = -item.total
			}
			if (state.order.type && item.number < 0) { // 退货切换销货计算
				item.number = -item.number
				item.total = -item.total
			}
			number = number + item.number
			total = waitPay = total + item.total
		});
		state.order.pays.forEach((pay, index) => {
			waitPay = waitPay - pay.amount
			getAmount = getAmount + pay.getAmount
		})
		commit('SET_ORDER_KEY', { key: 'number', value: Number(number.toFixed(2)) })
		commit('SET_ORDER_KEY', { key: 'total', value: total })
		commit('SET_ORDER_KEY', { key: 'getAmount', value: getAmount })
		commit('SET_ORDER_KEY', { key: 'waitPay', value: waitPay })
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}
