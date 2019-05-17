<template>
  <tk-container :status="status">
    <tkui-header slot="header" center >
      <tkui-button slot="left" class="icon" @click="$replace('/')">
        <tk-icon material>keyboard_arrow_left</tk-icon>
      </tkui-button>订单详情
    </tkui-header>
    <tkui-header class="status" style="">
      <tkui-button slot="left" class="icon">
        <tk-icon color="#fff">Paid1</tk-icon>
      </tkui-button>
      {{paidStatus}}
    </tkui-header>
    <tkui-list v-for="(commoditys, shopId) in cart" :key="shopId">
      <div class="list-header">
        <h2>{{commoditys[0].shop.shopName}}</h2>
      </div>
      <tkui-list-item disableHover divider v-for="(commodity,index) in commoditys" :key="index">
        <tk-image slot="left"  :src="commodity.tagimg"  class="avatar"></tk-image>
        <div class="content" >
          <div class="title">{{commodity.modelName}}</div>
          <div class="des">{{commodity.configInfo}}</div>
          <div class="price gray">共{{commodity.quantity}}件商品，实付款：¥{{commodity.price}}
          </div>
        </div>
      </tkui-list-item>
    </tkui-list>
    <tk-flex wrap class="qrcode"  slot="footer">
      <div class="item tk-grid-3"><h4>订单码</h4></div>
      <div class="item tk-grid-9"><tk-qrcode :value="cart_objectId"></tk-qrcode></div>
      <div class="item tk-grid-3"><h4>合计实付款：</h4></div>
      <div class="item tk-grid-9 red">¥{{totalPrice}}</div>
    </tk-flex>
  </tk-container>
</template>

<script>
export default {
  name: 'cartDetail',
  layout: '',
  data () {
    return {
      order: {},
      status: 'loading'
    }
  },
  computed: {
    totalPrice () {
      return this.order.totalFee || 0
    },
    cart_objectId () {
      return this.$getFlash('cart_objectId')
    },
    cart () {
      if (!this.order.detail) return {}
      let cart = {}
      this.order.detail.forEach((ni, yi) => {
        !cart[ni.shop.objectId] ? cart[ni.shop.objectId] = [ni] : cart[ni.shop.objectId].push(ni)
      })
      return cart
    },
    paidStatus () {
      let order
      switch (this.order) {
        case 'unpaid':order = '未付款'; break
        case 'complete':order = '已完成'; break
        case 'close':order = '已关闭'; break
      }
      return order
    }
  },
  mounted () {
    this.init()
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
      this.order = await this.$tkParse.getFirst('/classes/order', {
        params: { // url参数
          where: {
            objectId: this.cart_objectId
          }
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
    font-size: 12px;
    margin-top:16px;
    h2 {
      padding: 8px 0;
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
          font-size:11px;
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
              padding: 2px;
              text-align: center;
              font-size:18px;
              color:#666;
            }
            span:nth-child(2) {
              background: #fff;
              font-size:12px;
            }
          }
        }
      }
    }
  }

  .qrcode {
    padding: 16px;
    background: #fff;
    margin-top:16px;
    h4  {
      padding-top:8px;
      font-size:14px;
      font-weight:300;
      color:#666;
    }
    .red {
      padding-top:8px;
      color:red;
      font-size:18px;
    }
  }

  .status {
    background-image: url(http://moke-store.oss-cn-beijing.aliyuncs.com/64df0cb9-a4fd-458a-a486-91a7aaebd105.png);
    height:60px;
  }
</style>
