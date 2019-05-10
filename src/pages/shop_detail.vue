<template>
  <tk-container class="shop">
    <tkui-header slot="header" background="white" color="#333" center>
      <tkui-button slot="left" class="icon" @click="$back()">
        <tk-icon material>keyboard_arrow_left</tk-icon>
      </tkui-button>
      {{shop.shopName}}
    </tkui-header>

    <tkui-list v-if="shop.user && shop.user.objectId &&commodity && commodity.length>0">
      <tkui-list-item divider v-for="opt in commodity" >
        <tk-image slot="left"  :src="opt.tagImg"  class="avatar"></tk-image>
        <div class="content"  @click="goCommodityPage(opt)">
          <div class="title">{{opt.modelName}}</div>
          <div class="des">{{opt.configInfo}}</div>
          <div class="price">¥{{opt.price}}</div>
        </div>
      </tkui-list-item>
    </tkui-list>

    <tkui-list v-else>
      <tkui-list-item divider >
        <div class="content">
          <div class="title">没有查询到数据！请重试！</div>
        </div>
      </tkui-list-item>
    </tkui-list>

  </tk-container>
</template>

<script>
export default {
  name: 'shop_detail',
  layout: 'shop_detail',
  data: function () {
    return {
      shop: {},
      commodity: []
    }
  },
  mounted: function () {
    this.shop = this.$getFlash('flash').shop
    this.init()
  },
  methods: {
    init () {
      try {
        this.getCommodity()
      } catch (e) {
        // code
        throw e
      }
    },
    async getCommodity () {
      let res = await this.$tkParse.get('/classes/model', {
        params: { // url参数
          where: {
            user: this.shop.user.objectId
          }
        }
      }).catch(err => {
        // error code
        throw err
      })
      this.commodity = res.data.results
    },
    goCommodityPage: function (opt) {
      this.$setFlash('flash', {
        commodity: opt,
        shop: this.shop
      })
      this.$push('/commodity-detail')
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

</style>
