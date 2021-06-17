<template>
	<view class="wrap">
        <view class="payable">
            <view class="orderNo">单号: {{ order.orderNo }}</view>
            <view class="total"> 
                <span>待 付</span>   
                <span></span> 
                <span>数 量: {{ order.number.toFixed(2) }}</span>
            </view>
            <view class="totals">￥{{ (order.waitPay / 100).toFixed(2) }}</view>
        </view>
        <view class="right">
            <view class="bag">
                <button class="custom-bag" size="mini">
                    <span>大号</span><br>
                    <span>购物袋</span>
                </button>
                <button 
                    class="custom-bag" 
                    size="mini"
                    @click="to"
                >
                    <span>小号</span><br>
                    <span>购物袋</span>
                </button>
            </view>
            <button 
                class="custom-face" 
                size="default"
                @click="facePay"
            >刷脸支付</button>
        </view>
	</view>
</template>

<script>
    import { mapState } from 'vuex'
	export default {
		components: { 
		},
		data() {
			return {
			}
		},
        computed: {
            ...mapState({
                order: state => state.wxfaceapp.order,
            }),
        },
		created() {
		},
		methods: {
            facePay(){
                this.$store.dispatch('wxfaceapp/facePay')
			},
            to(){
                wx.navigateToMiniProgram({
                    appId: 'wxa75efa648b60994b',
                    success(res) {
                        // 打开成功
                        console.log(res);
                    },
                    fail(err){
                        console.log(err);
                    }
                })
            }
		},
		destroyed() {
		}
	}
</script>

<style lang="scss" scoped>
    .wrap{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100vw;
        height: 15vh;
        background-color: hsl(220, 13%, 18%);
    }
    .payable{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 60vw;
        height: 15vh;
        color: #ffffff;
        background-color: #F56C6C;
        font-weight: 900;
        .orderNo{
            height: 2vh;
            font-size: 1.5vh;
            padding-top: 1vw;
            padding-left: 2vw;
            font-weight: 400;
        }
        .total{
            height: 3vh;
            display: flex;
            justify-content: space-between;
            font-size: 4vw;
            margin-top:3vw;
            padding-left: 2vw;
            padding-right: 2vw;
            
        }
        .totals {
            height: 10vh;
            font-size: 9vw;
        }
    }
    .right{
        width: 40vw;
        height: 15vh; 
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding:1vw;
        background-color: #F56C6C;
        .bag{
            width: 38vw;
            height: 6vh;
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-end;
            .custom-bag{
                width: 17.5vw;
                height: 7vh;
                font-size: 1.5vh;
                font-weight: 900;
                margin-left: 1vw;
            }
        }
        .custom-face{
            width: 36vw;
            height: 6vh;
            font-size: 2.5vh;
            font-weight: 900;
        }
    }
</style>