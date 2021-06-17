<template>
	<view class="wrap">
		<scroll-view class="list-wrap" scroll-y="true" scroll-left="120">
            <u-cell-item 
                v-for="(item, index) in items"
                :key="index"
                :arrow="false"
                class="cell"
                hover-class="cell-hover-class"
                @click="deleteItem(item)"
            >
                <view class="item">
                    <view class="one">
                        <span class="no">{{item.no}}</span>
                        <span class="plu">{{item.pluCode}}</span>
                    </view>
                    <view class="name">{{item.name}}</view>
                    <view class="attribute">
                        <span class="price">{{(item.price / 100).toFixed(2)}}</span>
                        <span class="number">{{item.number.toFixed(2)}}</span>
                    </view>
                    <view class="total">{{(item.total / 100).toFixed(2)}}</view>
                </view>
            </u-cell-item>
        </scroll-view>
        <u-modal 
            v-model="show" 
            :content="content"
            confirm-text="删除"
            :show-cancel-button="true"
            @confirm="deleteItemHander"
            cancel-text="取消"
        ></u-modal>
	</view>
</template>

<script>
    import { mapState } from 'vuex'
	export default {
		components: { 
		},
		data() {
			return {
                show:false,
                content:"此操作将删除商品, 是否继续?",
                currentRow:{}
			}
		},
        computed: {
            ...mapState({
                items: state => state.wxfaceapp.order.goods,
            }),
        },
		created() {
		},
        mounted() {
			this.$store.dispatch('wxfaceapp/initOrder') //订单初始化
		},
		methods: {
            deleteItem(row){
                this.show = true
                this.currentRow = row
                this.content = "删除商品【"+row.name+"】, 是否继续?"
            },
            deleteItemHander(){
                this.$store.dispatch('wxfaceapp/deleteGoods',this.currentRow)
            }
		},
		destroyed() {
		}
	}
</script>

<style lang="scss" scoped>
	.list-wrap{
        width: 100vw;
        height: 80vh;
        background-color: hsl(220, 13%, 18%);
    }
    .item{
        display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
        color:#FFFFFF;
        .one{
            width: 20vw;
            display: flex;
            flex-direction: column;
            .no{
                line-height:70%;
                height:2vw;
                font-size:2vw;
                text-align: left;
                color:#F56C6C;
            }
            .plu{
                line-height:70%;
                height:4vw;
                text-align: left;
            }
        }
        .name{
            width: 35vw;
            text-align: left;
        }
        .attribute{
            width: 15vw;
            display: flex;
            flex-direction: column;
            .price{
                line-height:70%;
                height:2vw;
                font-size:2vw;
                color:#F56C6C;
            }
            .number{
                line-height:70%;
                height:4vw;
                font-size:4vw;
                color:#E6A23C;
                font-weight: 900;
            }
        }
        .total{
            width: 30vw;
            color:#F56C6C;
            font-size:6vw;
            font-weight: 900;
        }
    }
</style>