<template>
  <tk-container class="bg-white" :status="status">
    <tkui-header slot="header" center>
      <tkui-button slot="left" class="icon" @click="$back">
        <tk-icon material>keyboard_arrow_left</tk-icon>
      </tkui-button>订单
    </tkui-header>

    <tkui-tab around ref="tab" v-model="orderType">
      <tkui-tab-item :label="tab.label" :name="tab.name" v-for="(tab,index) in tabs" :key="index">
        <span  @click="goCartDetail(order)"  v-for="(order,index) in tab.orders" :key="index">
          <tkui-list >
            <div class="list-header" >
              <h2><span>{{order.titleName}}</span>
                <span class="pull-right" v-bind:class="{ gray: order.status !== 'complete'}">{{order.paidStatus}}</span>
              </h2>
            </div>
            <tkui-list-item disableHover divider >
              <span v-for="(shop,index) in order.detail" :key="index">
                <tk-image width="1200" height="600" slot="left" v-if="shop && shop.tagimg"  :src="shop.tagimg" class="avatar"></tk-image>
              </span>
              <div class="content"  >
                <div class="price gray" >共{{order.detail.length}}件商品，实付款：¥{{order.price}}
                </div>
              </div>
            </tkui-list-item>
          </tkui-list>
        </span>
        <span v-if="tab.orders.length===0">
          <tkui-list >
            <div class="list-header" >
              <h2><span>暂无数据！</span></h2>
            </div>
          </tkui-list>
        </span>
      </tkui-tab-item>
    </tkui-tab>
  </tk-container>
</template>

<script>
export default {
  name: 'orderList',
  layout: '',
  data () {
    return {
      orders: [],
      paidStatus: '',
      orderUnpaid: [],
      orderComplete: [],
      orderClose: [],
      status: 'loading',
      orderType: this.$getFlash('orderType')
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    tabs () {
      return [{
        name: 'all',
        label: '全部订单',
        orders: this.orders
      }, {
        name: 'unpaid',
        label: '待付款',
        orders: this.orderUnpaid
      }, {
        name: 'complete',
        label: '已完成',
        orders: this.orderComplete
      }, {
        name: 'close',
        label: '已关闭',
        orders: this.orderClose
      }]
    },
    userInfo () {
      return this.$store.state.user
    }
  },
  methods: {
    async init () {
      try {
        await this.getOrder()
      } catch (e) {
        this.status = 'error'
        throw e
      }
      JSON.stringify(this.order) !== '{}' ? this.status = false : this.status = 'empty'
    },
    async getOrder () {
      this.orders = await this.$tkParse.getList('/classes/order', {
        params: {
          order: '-createdAt',
          where: {
            user: this.userInfo.objectId
          }
        }
      })
      this.fixOrder()
    },

    // 这个适配器是必须的，移植computed完全没有必要
    fixOrder () {
      this.orders.forEach((n, i) => {
        n['price'] = 0
        switch (n.status) {
          case 'unpaid':n.paidStatus = '未付款'; this.orderUnpaid.push(n); break
          case 'complete':n.paidStatus = '已完成'; this.orderComplete.push(n); break
          case 'close':n.paidStatus = '已关闭'; this.orderClose.push(n); break
        }
        n['titleName'] = ''
        let titleName = {}
        n.detail.forEach((ni, ii) => {
          if (!ni) return
          if (ni['price']) {
            n.price += ni.price
          }
          if (!titleName[ni.shop.shopName]) {
            if (ii === 0) {
              n['titleName'] += ni.shop.shopName
            } else {
              n['titleName'] += '，' + ni.shop.shopName
              titleName[ni.shop.shopName] = true
            }
          }
        })
      })
    },
    goCartDetail (opt) {
      this.$push({
        path: '/buyer/cartDetail',
        flash: {
          cart_objectId: opt.objectId
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .avatar {
    width: 80px;
    height: 80px;
    margin-right: 16px;
  }

  .content {
    padding: 16px 16px 16px 0;
    .title {
      margin-bottom: 16px;
    }
  }

  .list-header {
    padding: 0 16px;
    font-size: 13px;
    margin-top:16px;
    h2 {
      padding: 8px 0;
      font-size: 14px;
      color: rgba(33, 33, 33, 1);
      .pull-right{
        float:right;
        font-size: 14px;
        color: #0091FF;
      }
      .gray {
        color:#999;
      }
    }
  }

  .tkui-list-item {
    padding:5px 16px;
    .list-item-content {
      .content {
        padding: 5px;
        text-align:left;
        width:100%;
        .title {
          margin-bottom:5px;
          .pull-right {
            float:right;
            display: block;
            font-size:12px;
            font-weight:300;
          }
        }
        .des {
          font-size:14px;
          color:#aaa;
        }
        .price {
          color:red;
          margin-top:5px;
          .right{
            float:right;
            border:0;
            span {
              display: inline-block;
              width:24px;
              height:24px;
              background-color: #eee;
              padding: 3px;
              text-align: center;
              font-size:18px;
              color:#666;
            }
            span:nth-child(2) {
              background: #fff;
              font-size:13px;
            }
          }
        }
      }
    }
  }

  .tkui-list {
    .tkui-list-item {
      display: block;
      .left {
        width:100%;
        >img {
          width:60px;
          height:60px;
        }
      }
      .gray{
        float:right;
        color:#333 !important;
        font-size:14px;
      }
    }
  }

  .bg-white {
    background-color: #fff;
  }

</style>
