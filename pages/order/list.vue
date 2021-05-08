<template>
	<view class="wrap">
		<view class="list-wrap">
			<u-cell-group title="订单列表">
                <u-cell-item 
                    v-for="(row, index) in orders" 
                    :icon="getItemIcon(row.method)" 
                    :title="row.orderNo" 
                    :arrow="false"
                    :key="index"
                    :icon-style="getItemIconStyle(row.method)"
                    @click="onPaysQuery(row)"
                >
                    <span class="total-mount">
                        {{(row.totalAmount/100).toFixed(2)}} 
                    </span>
                    <span class="stauts">
                        <span v-if="row.totalAmount>0">
                            <u-tag v-if="Number(row.stauts)===-1" size="mini" type="info" text="订单关闭" shape="circleLeft"></u-tag>
                            <u-tag v-if="Number(row.stauts)===0||!row.stauts" size="mini" type="warning" text="等待付款" shape="circleLeft"></u-tag>
                            <u-tag v-if="Number(row.stauts)===1" size="mini" type="success" text="支付成功" shape="circleLeft"></u-tag>
                        </span>
                        <span v-else>
                            <u-tag v-if="Number(row.stauts)===-1" size="mini" type="danger" text="退款关闭" shape="circleLeft"></u-tag>
                            <u-tag v-if="Number(row.stauts?row.stauts:0)===0" size="mini" type="warning" text="等待退款" shape="circleLeft"></u-tag>
                            <u-tag v-if="Number(row.stauts)===1" size="mini" type="info" text="退款成功" shape="circleLeft"></u-tag>
                        </span>
                    </span>
                </u-cell-item>
            </u-cell-group>
            <u-loadmore bg-color="rgb(240, 240, 240)" :status="loadStatus"></u-loadmore>
		</view>
	</view>
</template>

<script>
	import {  mapState } from 'vuex'
    import utilsPay from '@/utils/pay'
	export default {
		components: { 
		},
		data() {
			return {
                loadStatus:'loadmore',
                page:0,
                limit:15,
                total:0,
                orders:[],
			}
		},
		computed: {
            ...mapState({
                onReachBottom: state => state.onReachBottom,
            })
		},
		created() {
		},
        watch: {
            onReachBottom: {
                handler() {
                    this.page = this.page + 1
                    this.getOrder()
                },
                immediate: true
            }
        },
		methods: {
            getOrder(){
                this.$u.api.OrdersSelfList({
                    limit: this.limit,
                    page: this.page,
                    sort: "created_at desc",
                }).then(res =>{
                    if (res.orders) {
                        this.orders = this.orders.concat(res.orders)
                    }
                    this.total = Number(res.total)
                })
            },
            onPaysQuery(order){
                this.$u.api.PaysQuery({
                    orderNo:order.orderNo,
                    storeId: order.storeId,
                }).then(response => {
						utilsPay.hander(response, order.method)
						if (utilsPay.valid) {
                            this.orders = []
                            this.page = 1
                            this.getOrder()
                             setTimeout(function () {
                                uni.showToast({
                                    duration: 5000,
                                    icon:'success',
                                    title:'支付成功',
                                })
                            }, 500);
						} else {
							if (utilsPay.error.code === 'USERPAYING') {
								uni.showToast({
                                    duration: 5000,
                                    icon:'warning',
                                    title:'等待用户付款'
                                })
							} else {
                                uni.showToast({
                                    duration: 5000,
                                    icon:'error',
                                    title:utilsPay.error.detail
                                })
							}
						}

				}).catch(error => {
                    console.log(error);
					uni.showToast({
                        duration: 5000,
						icon:'error',
						title:'查询失败'
					})
				})
            },
            getItemIcon(method) {
                let icon = ''
                switch (method) {
                    case 'alipay':
                        icon= 'zhifubao'
                        break;
                    case 'wechat':
                        icon= 'weixin-fill'
                        break;
                    default:
                        break;
                }
				return icon
			},
            getItemIconStyle(method) {
                let style = {
                    color:"#000000"
                }
                switch (method) {
                    case 'alipay':
                        style= {
                            color:"#409EFF"
                        }
                        break;
                    case 'wechat':
                        style= {
                            color:"#67C23A"
                        }
                        break;
                    default:
                        break;
                }
				return style
			},
		},
		destroyed() {
		}
	}
</script>

<style lang="scss" scoped>
	.list-wrap{
        background-color: #FFFFFF;
    }
    .total-mount{
        font-size: 32rpx;
        padding-right:1vw;
        color: #000000;
    }
    .stauts{
        min-width: 200px;
    }
</style>