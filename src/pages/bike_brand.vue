<template>
  <tk-container :status="status" class="shop">
    <tkui-header slot="header" background="white" color="#333" center>
      <tkui-button slot="left" class="icon" @click="back()">
        <tk-icon material>keyboard_arrow_left</tk-icon>
      </tkui-button>
      车型列表
    </tkui-header>

    <tkui-list v-if="shop && shop.objectId && commodity && commodity.length>0">
      <span @click="goNewBike(opt)" v-for="opt in commodity">
        <tkui-list-item  divider >
        <tk-image slot="left"  :src="opt.tagImg"  class="avatar"></tk-image>
        <div class="content" >
          <div class="title">{{opt.modelName}}</div>
          <div class="des">{{opt.configInfo}}</div>
          <div class="price">¥{{opt.price}}</div>
        </div>
      </tkui-list-item>
      </span>
    </tkui-list>

    <tkui-list v-else>
      <tkui-list-item divider >
        <div class="content">
          <div class="title">没有查询到数据！请重试！</div>
        </div>
      </tkui-list-item>
    </tkui-list>

    <tkui-button class="circle-btn" icon raised @click="newBike()">
      <tk-icon color="#fff">plus</tk-icon>
    </tkui-button>

  </tk-container>
</template>

<script>
export default {
  name: 'bike-brand',
  layout: 'bike-brand',
  data: function () {
    return {
      shop: {},
      commodity: [],
      brand: null,
      status: 'loading'
    }
  },
  mounted: function () {
    this.init()
  },
  methods: {
    init () {
      this.getModel()
    },
    async getModel () {
      this.shop = this.$store.state.user
      this.brand = this.$getFlash('flash').brand

      // 昂，这一页和之前商品列表是差不多的，再次验证了一下查询逻辑，之前的就先不改了
      let res = await this.$tkParse.getList('/classes/model', {
        params: { // url参数
          where: {
            user: this.shop.objectId,
            brand: this.brand.objectId
          }
        }
      }).catch(e=>{
        this.status = 'error'
        throw e
      })
      this.commodity = res
      this.commodity.length > 0 ? this.status = false : this.status = 'empty'
    },
    back: function () {
      this.$setFlash('flash', {
        shop: this.userInfo,
        brands: this.$getFlash('flash').brands
      })
      this.$back()
    },
    newBike: function (opt) {
      this.$push({
        path: '/new-bike',
        flash: {
          flash: {
            shop: this.userInfo,
            brands: this.$getFlash('flash').brands
          }
        }
      })
    },
    goNewBike: function (opt) {
      this.$push({
        path: '/new-bike',
        flash: {
          flash: {
            bike: opt,
            brands: this.$getFlash('flash').brands
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

  .circle-btn {
    position:fixed;
    bottom:16px;
    right:16px;
    font-size:50px;
    background:rgba(0, 145, 255, 1);
    color:#fff;
    z-index:999;
  }

  .content {
    padding: 16px 16px 16px 0;
    .title {
      margin-bottom: 16px;
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
            font-size:8px;
            font-weight:300;
          }
        }
        .des {
          font-size:13px;
          color:#aaa;
        }
        .price {
          color:red;
          margin-top:5px;
        }
      }
    }
  }
  .tkui-header {
    position: relative;
    z-index: 999;
  }

</style>
