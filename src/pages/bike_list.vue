<template>
  <tk-container :status="status" class="shop">
    <tkui-header slot="header" background="white" color="#333" center>
      <tkui-button slot="left" class="icon" @click="back()">
        <tk-icon>me1</tk-icon>
      </tkui-button>
      库存列表
    </tkui-header>

    <tkui-list v-if=" shop && shop.objectId">
      <span v-for="brand in shop.mainBrand">
        <tkui-list-item divider v-if="brand == opt.objectId"  v-for="(opt,index) in brands">
        <tk-image slot="left"  :src="opt.logo"  class="avatar"></tk-image>
        <div class="content"  @click="goBikeBrand(opt)">
          <div class="title">{{opt.name}}</div>
          <div class="des"><span v-if="opt.objectId == info.brand" v-for="(info,index) in commodity">{{info.modelName}}</span></div>
        </div>
      </tkui-list-item>
      </span>
    </tkui-list>
    <tkui-button class="circle-btn" icon raised @click="newBike()">
      <tk-icon color="#fff">plus</tk-icon>
    </tkui-button>
  </tk-container>
</template>

<script>
export default {
  name: 'bike_list',
  layout: 'bike_list',
  data: function () {
    return {
      shop: {},
      commodity: [],
      brands: [],
      status: 'loading'
    }
  },
  mounted: function () {
    this.init()
  },
  beforeRouteLeave (to, from, next) {

    // 使用了这个让用户不用误操作后退键回到login页面
    to.path == '/login' ? next(false) : next()
  },
  methods: {
    async init () {
      this.shop = this.$store.state.user

      // fydebug这里记一下，以前没遇到过，这里使用try catch 捕获异步操作的时候，由于js单线程的特性，异步的操作会被放进
      // 异步回调队列中，这个时候是catch不到错误的，我可能对这个api的用法有问题，比较简单粗暴的把他打成同步的了
      // 看了一下可以使用 batch 进行批量处理，我会在别的页面进行 batch 的使用处理这种多个请求同时进行的情况
      try {
        await this.getBrand()
        await this.getModel()
      } catch (e) {
        // error code
        this.status = 'error'
        throw e
      }
    },
    async getBrand () {
      let res = await this.$tkParse.getList('/classes/brand', {
        params: { // url参数

        }
      }).catch(e => {
        throw e
      })
      this.brands = res
      this.brands.length > 0 ? this.status = false : this.status = 'empty'
    },
    async getModel () {
      let res = await this.$tkParse.getList('/classes/model', {
        params: { // url参数
          where: {
            user: this.shop.objectId
          }
        }
      }).catch(e => {
        throw e
      })
      this.commodity = res
    },
    back: function () {
      this.$push('/merchant-index')
    },
    goBikeBrand: function (opt) {
      this.$setFlash('flash', {
        shop: this.userInfo,
        brands: this.brands,
        brand: opt
      })
      this.$push('/bike-brand')
    },
    newBike: function (opt) {
      this.$push({
        path: '/new-bike',
        flash: {
          flash: {
            shop: this.userInfo,
            brands: this.brands
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
          >span {
            margin-right:8px;
          }
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
