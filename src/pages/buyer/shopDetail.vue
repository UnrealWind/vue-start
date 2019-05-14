<template>
  <tk-container class="shop" :status="status">
    <tkui-header slot="header" background="white" color="#333" center>
      <tkui-button slot="left" class="icon" @click="$back()">
        <tk-icon material>keyboard_arrow_left</tk-icon>
      </tkui-button>
      {{shop.shopName}}
    </tkui-header>
    <tkui-list>
      <tkui-list-item divider v-for="opt in commodity" >
        <tk-image  slot="left" alt="标签照" :src="opt.tagImg"  class="avatar"></tk-image>
        <div class="content"  @click="goCommodityPage(opt)">
          <div class="title">{{opt.modelName}}</div>
          <div class="des">{{opt.configInfo}}</div>
          <div class="price">¥{{opt.price}}</div>
        </div>
      </tkui-list-item>
    </tkui-list>
  </tk-container>
</template>

<script>
export default {
  name: 'shopDetail',
  layout: '',
  data: function () {
    return {
      commodity: [],
      // waiting - 加载中  loading-  empty-
      status: 'loading'
    }
  },
  mounted: function () {
    this.init()
  },
  computed: {
    shop () {
      return this.$route.query.shop
    }
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
            user: this.shop
          }
        }
      }).catch(e => {
        // error code
        this.status = 'empty'
        throw e
      })
      res.data.results.length > 0 ? this.status = false : this.status = 'empty'
      this.commodity = res.data.results
    },
    goCommodityPage: function (opt) {
      this.$push({
        path: '/buyer/commodityDetail',
        query: {
          commodity: opt.objectId,
          shop: this.shop,
          shopName: this.$route.query.shopName
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
