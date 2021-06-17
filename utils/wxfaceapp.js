const events = require('events')

import { EAN } from '@/utils/barcode'
const WxFaceApp = {
  EventEmitter: new events.EventEmitter(),
  code: {
		barCode:"",
		pluCode:"",
		payCode:"",
	},
	method:"", 		//支付方式
  pay(){
		this.EventEmitter.emit('pay', this.code)
	},
  handerGoods(goods,total){
      if (total) { // 计算总价或者数量
        goods.number = Math.round(total / goods.price * 100) / 100
        goods.total = total
      } else {
        goods.number = 1
        goods.total =Math.round(goods.number * goods.price)
      }
      this.EventEmitter.emit('goods', goods)
  },
  goods(total){
    let code
    let item
    const goods = require('@/store').default.state.data.goods
    if (this.code.barCode) {
      code =  this.code.barCode
      item = goods.bars[code]
    }
    if (this.code.pluCode) {
      code =  this.code.pluCode
      item = goods.plus[code]
    }
    if (item) {
      this.handerGoods(item, total)
    }else{
      this.EventEmitter.emit('error', new Error('未找到商品:'+code))
    }
	},
  // code 扫码处理分离 区分付款码和条形码
	codeHandler(code){
      let total = 0
      // 初始化参数
      this.method = "" 
      this.code = {
        bar:"",
        plu:"",
        pay:"",
      }
      const regAlipay = /^(?:2[5-9]|30)\d{14,18}$/
      if (regAlipay.test(code)) { // 支付宝支付
        this.method = 'alipay'
        this.code.payCode = code
      }
      const regWechat = /^1[0-5]\d{16}$/
      if (regWechat.test(code)) { // 微信支付
        this.method = 'wechat'
        this.code.payCode = code
      }
      if (this.method==="") {
        if (!/^\d+$/.test(code)) {
          return new Error('请扫条形码或付款码,不支持二维码。')
        }
        const barcode = EAN.Decode(code)
        if (barcode.check) { // 校验条码
          if (barcode.custom) { // 是否为自定义条码(称重类)
            total = barcode.goods.total // 防止异步导致数据深拷贝
            this.code.pluCode = barcode.goods.pluCode
          }else{
            this.code.barCode = code
          }
        }else{
          this.code.pluCode = code
        }
        return this.goods(total)
      }else{
        return this.pay()
      }
	},
  // FacePay 刷脸支付
	FacePay() {
			//获取青蛙相关信息
			wxfaceapp.facePay({
				requireFaceCode : true,//是否需要获取付款码返回给小程序
				success:(res)=>{
					//刷脸成功Event 建议配合facePay的调用结果进行注册
					wxfaceapp.onFacePayPassEvent((res) =>{
            console.log(this);
						this.codeHandler(res.faceCode)
					})
				},
				fail(err){
					console.log("fail [launchFaceApp]",res)
				}
    })
	},
  ListenCodePayment(){
		//声明取消监听扫码器
		wxfaceapp.listenCodePayment({
			success: res => {
				//被扫码回调事件
				wxfaceapp.onCodePayEvent((res)=> {
					this.codeHandler(res.code)
				})
			},
			fail: res => {
				console.log("监听扫码失败")
			}
		});
	},
	StopListenCodePayment(){
		//声明取消监听扫码器
		wxfaceapp.stopListenCodePayment({
			success: res => {
				console.log("取消监听扫码成功")
			},
			fail: res => {
				console.log("取消监听扫码失败")
			}
		});
	},
  On(event, fun) { // 事件监听
    this.EventEmitter.on(event, fun)
  }
}
export { WxFaceApp }
