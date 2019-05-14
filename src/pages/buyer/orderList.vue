<template>
  <tk-container class="bg-white">
    <tkui-header slot="header" center>
      <tkui-button slot="left" class="icon" @click="$back">
        <tk-icon material>keyboard_arrow_left</tk-icon>
      </tkui-button>订单
    </tkui-header>
    <tkui-tab v-if="orderType" :value="orderType"  average style="height: auto;">
      <tkui-tab-item label="全部订单">
        <span  @click="goCartDetail(order)"  v-for="order in orders">
          <tkui-list >
            <div class="list-header" >
              <h2><span>{{order.titleName}}</span>
                <span class="pull-right" v-bind:class="{ gray: order.status !== 'complete'}">{{order.paidStatus}}</span>
              </h2>
            </div>
            <tkui-list-item disableHover divider >
              <img slot="left" v-if="shop && shop.tagimg" v-for="shop in order.detail" v-bind:src="shop.tagimg" class="avatar" />
              <div class="content"  >
                <div class="price gray" >共{{order.detail.length}}件商品，实付款：¥{{order.price}}
                </div>
              </div>
            </tkui-list-item>
          </tkui-list>
        </span>
        <span v-if="orders.length==0">
          <tkui-list >
            <div class="list-header" >
              <h2><span>暂无数据！</span></h2>
            </div>
          </tkui-list>
        </span>
      </tkui-tab-item>
      <tkui-tab-item label="待付款">
        <span @click="goCartDetail(order)"  v-for="order in orderUnpaid">
          <tkui-list>
            <div class="list-header" >
              <h2><span>{{order.titleName}}</span>
                <span class="pull-right" v-bind:class="{ gray: order.status !== 'complete'}">{{order.paidStatus}}</span>
              </h2>
            </div>
            <tkui-list-item disableHover divider >
              <img slot="left" v-if="shop &&shop.tagimg" v-for="shop in order.detail" v-bind:src="shop.tagimg" class="avatar" />
              <div class="content"  >
                <div class="price gray" >共{{order.detail.length}}件商品，实付款：¥{{order.price}}
                </div>
              </div>
            </tkui-list-item>
          </tkui-list>
        </span>
        <span v-if="orderUnpaid.length==0">
          <tkui-list >
            <div class="list-header" >
              <h2><span>暂无数据！</span></h2>
            </div>
          </tkui-list>
        </span>
      </tkui-tab-item>
      <tkui-tab-item label="已完成">
        <span  @click="goCartDetail(order)"  v-for="order in orderComplete">
          <tkui-list>
            <div class="list-header" >
              <h2><span>{{order.titleName}}</span>
                <span class="pull-right" v-bind:class="{ gray: order.status !== 'complete'}">{{order.paidStatus}}</span>
              </h2>
            </div>
            <tkui-list-item disableHover divider >
              <img slot="left" v-if="shop &&shop.tagimg"  v-for="shop in order.detail" v-bind:src="shop.tagimg" class="avatar" />
              <div class="content"  >
                <div class="price gray" >共{{order.detail.length}}件商品，实付款：¥{{order.price}}
                </div>
              </div>
            </tkui-list-item>
          </tkui-list>
        </span>
        <span v-if="orderComplete.length==0">
          <tkui-list >
            <div class="list-header" >
              <h2><span>暂无数据！</span></h2>
            </div>
          </tkui-list>
        </span>
      </tkui-tab-item>
      <tkui-tab-item label="已取消">
        <span @click="goCartDetail(order)"  v-for="order in orderClose">
          <tkui-list>
            <div class="list-header" >
              <h2><span>{{order.titleName}}</span>
                <span class="pull-right" v-bind:class="{ gray: order.status !== 'complete'}">{{order.paidStatus}}</span>
              </h2>
            </div>
            <tkui-list-item disableHover divider >
              <img slot="left" v-if="shop && shop.tagimg" v-for="shop in order.detail" v-bind:src="shop.tagimg" class="avatar" />
              <div class="content"  >
                <div class="price gray" >共{{order.detail.length}}件商品，实付款：¥{{order.price}}
                </div>
              </div>
            </tkui-list-item>
          </tkui-list>
        </span>
        <span  v-if="orderClose.length==0">
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
  data: function () {
    return {
      orders: [],
      paidStatus: '',
      userInfo: {},
      orderType: '',
      orderUnpaid: [],
      orderComplete: [],
      orderClose: []
    }
  },
  mounted: function () {
    this.init()
  },
  methods: {
    init: function () {
      let orderType = this.$route.query.orderType

      // 标一下全局状态
      switch (orderType) {
        case 'all':this.orderType = '全部订单'; break
        case 'unpaid':this.orderType = '未付款'; break
        case 'complete':this.orderType = '已完成'; break
        case 'close':this.orderType = '已取消'; break
      }

      // 获取数据，然后总价需要计算一下
      this.userInfo = this.$store.state.user
      this.getOrder()
    },
    async getOrder () {
      let res = await this.$tkParse.get('/classes/order', {
        params: { // url参数
          // include:'user',
          order: '-createdAt',
          where: {
            user: this.userInfo.objectId
          }
        }
      }).catch(e => {
        // error code
        throw e
      })
      this.orders = res.data.results

      // 算一下总价
      /* orderUnpaid:[],
          orderComplete:[],
          orderClose:[] */

      this.orders.forEach((n, i) => {
        n['price'] = 0
        switch (n.status) {
          case 'unpaid':n.paidStatus = '未付款', this.orderUnpaid.push(n); break
          case 'complete':n.paidStatus = '已完成'; this.orderComplete.push(n); break
          case 'close':n.paidStatus = '已关闭'; this.orderClose.push(n); break
        }
        n['titleName'] = ''
        let titleName = {}
        n.detail.forEach((ni, ii) => {
          if (!ni) return
          ni['price'] ? n.price += ni.price : ''
          !titleName[ni.shop.shopName]
            ? (ii == 0 ? n['titleName'] += ni.shop.shopName : n['titleName'] += '，' + ni.shop.shopName, titleName[ni.shop.shopName] = true) : ''
        })
      })
    },
    goCartDetail: function (opt) {
      this.$push({
        path: '/buyer/cartDetail',
        query: {
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
