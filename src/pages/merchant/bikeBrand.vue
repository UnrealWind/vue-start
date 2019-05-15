<template>
  <tk-container :status="status" class="shop">
    <tkui-header slot="header" background="white" color="#333" center>
      <tkui-button slot="left" class="icon" @click="$back">
        <tk-icon material>keyboard_arrow_left</tk-icon>
      </tkui-button>
      车型列表
    </tkui-header>

    <tkui-list v-if="shop && shop.objectId && commodity && commodity.length>0">
      <span @click="newBike(opt)" v-for="opt in commodity">
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
  name: 'bikeBrand',
  layout: '',
  data: function () {
    return {
      commodity: [],
      status: 'loading'
    }
  },
  activated: function () {
    // fydebug 这里是因为 $back 不会触发mounted ,可能有更好的方法吧
    this.init()
  },
  mounted: function () {
    // this.init()
  },
  computed: {
    shop () {
      return this.$store.state.user
    },
    brandId () {
      this.$route.query.brandId
    }
  },
  methods: {
    init () {
      this.getModel()
    },
    async getModel () {
      // 这一页和之前商品列表是差不多的，再次验证了一下查询逻辑
      let res = await this.$tkParse.getList('/classes/model', {
        params: { // url参数
          where: {
            user: this.shop.objectId,
            brand: this.brandId
          }
        }
      }).catch(e => {
        this.status = 'error'
        throw e
      })
      this.commodity = res
      this.commodity.length > 0 ? this.status = false : this.status = 'empty'
    },
    newBike: function (opt) {
      let query
      opt ? query = {
        bikeId: opt.objectId
      } : query = null
      this.$push({
        path: '/merchant/newBike',
        query: query
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
  .tkui-header {
    position: relative;
    z-index: 999;
  }

</style>
