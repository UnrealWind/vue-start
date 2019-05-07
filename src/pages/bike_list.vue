<template>
  <tk-container class="shop">
    <tkui-header background="white" color="#333" center>
      <tkui-button slot="left" class="icon" @click="back()">
        <tk-icon>me1</tk-icon>
      </tkui-button>
      库存列表
    </tkui-header>

    <tkui-list v-if=" shop && shop.objectId">
      <span v-for="brand in shop.mainBrand">
        <tkui-list-item divider v-if="brand == opt.objectId"  v-for="(opt,index) in brands">
        <img slot="left" v-bind:src="opt.logo" class="avatar" />
        <div class="content"  @click="goBikeBrand(opt)">
          <div class="title">{{opt.name}}</div>
          <div class="des"><span v-if="opt.objectId == info.brand" v-for="(info,index) in commodity">{{info.modelName}}</span></div>
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

    <div @click="newBike()" class="circle-btn">+</div>

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
      brands: []
    }
  },
  mounted: function () {
    this.init()
  },
  methods: {
    init () {
      this.shop = this.$store.state.user
      // fydebug@20190430这里业务逻辑和我自己想的不一样
      // this.brands = JSON.parse(JSON.stringify(this.$getFlash('flash').brands))
      try {
        this.getBrand()
        this.getModel()
      } catch (e) {
        // error code
      }
    },
    async getBrand () {
      let res1 = await this.$tkParse.get('/classes/brand', {
        params: { // url参数

        }
      })
      this.brands = res1.data.results
    },
    async getModel () {
      let res2 = await this.$tkParse.get('/classes/model', {
        params: { // url参数
          where: {
            user: this.shop.objectId
          }
        }
      })
      this.commodity = res2.data.results
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
    height:60px;
    width:60px;
    border-radius:30px;
    position:fixed;
    bottom:16px;
    right:16px;
    font-size:50px;
    border:1px solid #ccc;
    text-align:center;
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

</style>
