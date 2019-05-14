<template>
  <tk-container :status="status">
    <tkui-header slot="header" center>购物车</tkui-header>
    <tkui-list v-for="(commoditys, shopId) in cart">
      <div class="list-header">
        <h2>{{commoditys[0].shop.shopName}}</h2>
      </div>
      <tkui-list-item disableHover divider v-for="commodity in commoditys">
        <tk-image slot="left"  :src="commodity.tagImg"  class="avatar"></tk-image>
        <div class="content" >
          <div class="title">{{commodity.modelName}}</div>
          <div class="des">{{commodity.configInfo}}</div>
          <div class="price">¥{{commodity.price}}
            <div class="right">
              <span @click="calculation('-1',commodity)">-</span>
              <span>{{commodity.quantity}}</span>
              <span @click="calculation('1',commodity)">+</span>
            </div>
          </div>
        </div>
      </tkui-list-item>
    </tkui-list>
    <tkui-list v-if="JSON.stringify(cart)=='{}'">
      <tkui-list-item divider >
        <div class="content">
          <div class="title">请添加商品到购物车中！</div>
        </div>
      </tkui-list-item>
    </tkui-list>
    <self-component slot="footer">
      <footer-addin :totalPrice="totalPrice" @chopHand="chopHand"></footer-addin>
    </self-component>
  </tk-container>
</template>
<script>
import selfComponent from '../component/component.vue'
import footerAddin from '../component/footer-addin.vue'
export default {
  name: 'cart',
  layout: 'home',
  data: function () {
    return {
      totalPrice: 0,
      // waiting - 加载中  loading-  empty-
      status: 'loading'
    }
  },
  components: {
    selfComponent,
    footerAddin
  },
  computed:{
    cart(){
      return JSON.parse(JSON.stringify(this.$store.state.cart))
    }
  },
  mounted: function () {
    this.calculationPrice()
    Object.keys(this.cart).length > 0 ? this.status = false : this.status = 'empty'
  },
  methods: {
    async chopHand (mark) {
      if (JSON.stringify(this.cart) == '{}') {
        this.$tkGlobal.toast.add('请先添加商品到购物车内！')
        return false
      };

      // 做一下这个购物车数据
      let detail = this.fixCart()
      let res = await this.$tkParse.post('/classes/order', {
        user: this.$store.state.user.objectId,
        detail: detail,
        status: 'unpaid',
        totalFee: this.totalPrice
      }).catch(err => {
        // error code
        throw err
      })
      this.$push({
        path: '/buyer/cartDetail',
        query: {
          cart_objectId: res.data.objectId,
        }
      })
      this.$store.commit('resetCart', {})
    },
    fixCart () {
      let detail = []
      // 做一下详情数据
      for (let i in this.cart) {
        this.cart[i].forEach((n, i) => {
          detail.push({
            shop: {
              shopName: n.shopName,
              objectId: n.shop
            },
            price: n.price,
            tagimg: n.tagImg,
            modelName: n.modelName,
            configInfo: n.configInfo,
            quantity: n.quantity
          })
        })
      };
      return detail
    },
    calculationPrice: function () {
      for (let i in this.cart) {
        this.cart[i].forEach((n, i) => {
          this.totalPrice += n.price * n.quantity
        })
      }
    },
    calculation: function (num, commodity) {
      if (commodity.quantity == 0 && Number(num) == '-1') return
      commodity.quantity += Number(num)
      this.totalPrice += Number(num) * commodity.price
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

</style>
