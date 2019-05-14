<template>
  <tk-container  class="index"  infiniteScroll @loadingMore="loadingMore">
      <tkui-header slot="header" >
        <tkui-button  @click="goCityChose()" slot="left" class="icon">
          <tk-icon>Positioning</tk-icon>
        </tkui-button>
        <span slot="left" class="city">{{city}}</span>
        <tkui-search-input v-model="search" place-holder="输入搜索内容" ></tkui-search-input>
        <div slot="right">
          <tkui-button @click="scan" class="icon">
            <tk-icon>Scan</tk-icon>
          </tkui-button>
        </div>
      </tkui-header>
      <tk-slider loop autoPlay>
        <div class="slider-item" v-for="image,index in imgs" :key="index">
          <tk-image style="width: 100%;" :src="image.image" width="1200" height="600"></tk-image>
        </div>
      </tk-slider>
      <div class="center"><tk-image height="40" :src="speImg"></tk-image></div>
      <tkui-list>
        <tkui-list-item divider v-for="opt in targetShop" v-if="opt && opt.shopName.indexOf(search)>-1">
          <tk-image slot="left"  :src="opt.storePhoto" width="1200" height="600" class="avatar"></tk-image>
          <div class="content" @click="goShopPage(opt)">
            <div class="title">{{opt.shopName}}
              <span class="pull-right">距离：{{opt.position}}km</span>
            </div>
            <div class="des">{{opt.txtLocation}}</div>
            <div v-if="opt.user" class="btn-box">
              <span v-for="tagBrand in opt.user.mainBrand">
              <tkui-button raised rounded primary small disabled v-for="brand in brands" v-if="tagBrand == brand.objectId">{{brand.name}}</tkui-button>
            </span>
            </div>
          </div>
        </tkui-list-item>
      </tkui-list>
      <tk-scaner ref="scaner" :filter="checkResult" color="color"></tk-scaner>
      <tk-toast ref="toast"></tk-toast>
  </tk-container>
</template>

<script>
export default {
  name: 'home',
  layout: 'home',
  data: function () {
    return {
      imgs: [],
      shop: [],
      speImg: 'http://moke-store.oss-cn-beijing.aliyuncs.com/b6813a52-5db9-4c65-a8af-60f41e9d15af.png',
      brands: [],
      mapShow: true,
      city: '加载中',
      position: {},
      location: [],
      search: '',
      perPage: 5,
      targetShop: []
    }
  },
  mounted: function () {
    this.getLocal().then(() => {
      this.init()
    })
  },
  computed: {

  },
  methods: {
    init: function () {
      try {
        this.getSlider()
        this.getBrand()
        this.getShop()
      } catch (e) {
        // code
        throw e
      }
    },

    // 无限加载的例子
    loadingMore: function (page, next) {
      setTimeout(() => {
        this.targetShop = this.targetShop.concat(this.shop.slice((page) * this.perPage, (page + 1) * this.perPage))
        if (page >= 5) {
          next('complete')
        } else {
          next('+1')
        }
      }, 1000)
    },
    async getSlider () {
      let res = await this.$tkParse.get('/classes/slider', {})
      this.imgs = res.data.results
    },
    async getBrand () {
      let res = await this.$tkParse.get('/classes/brand', {
        params: { // url参数
          include: 'user'
        }
      })
      this.brands = res.data.results
    },
    async getShop () {
      let res = await this.$tkParse.get('/classes/shop', {
        params: {
          include: 'user'
        }
      })
      this.shop = res.data.results

      // 获取数据的时候算一下距离
      this.shop.forEach((n, i) => {
        n['position'] = this.getPosition([n.location.latitude, n.location.longitude])
      })

      this.shop.sort(function (a, b) {
        return a.position - b.position
      })
    },
    goShopPage: function (opt) {
      this.$push({
        path: '/buyer/shopDetail',
        query: {
          shop: opt.user.objectId,
          shopName: opt.shopName
        }
      })
    },
    checkResult (result) {
      // 对result进行判断，当返回true时,扫码成功，扫描器关闭
      this.$refs.scaner.close()
      result ? (() => {
        this.$push({
          path: '/buyer/cartDetail',
          query: {
            cart_objectId: result
          }
        })
      })() : this.$refs.toast.add('扫码失败！请重试')
    },
    async scan () {
      // scanResult 为成功扫描后返回的数据
      let scanResult = await this.$refs.scaner.scan()
        .catch(e => {
          console.log(e.type) // 错误类型, cancel 代表用户主动取消扫码， error代表其他错误
          console.log(e.message) // 错误说明
          throw e
        })
    },
    async getLocal () {
      // 定位是正确的了
      let position = await this.$tkGeolocation.getCurrentPosition({
        parse: true
      })
      this.$getFlash('city') ? this.city = this.$getFlash('city').name : this.city = position.name
      this.location = [position.latitude, position.longitude]
    },
    getPosition: function (posi1) {
      return this.$tkHelper.distance({
        latitude: posi1[0],
        longitude: posi1[1]
      }, {
        latitude: this.location[0],
        longitude: this.location[1]
      }, 'km')
    },
    goCityChose () {
      this.$push({
        path: '/buyer/cityChose',
        query: {
          targetCity: this.city
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
          font-size:12px;
          color:#aaa;
        }
        .btn-box {
          margin-top:5px;
          .tkui-button.small {
            width: auto;
            min-width:auto;
            height: auto;
            background-color: rgba(1, 144, 255, 0.3) !important; /*原生上有这个important无法通过权重去除*/
            border-radius: 8px;
            font-size:12px;
            margin-left:0;
            color: rgba(1, 144, 255, 1) !important;
          }
        }
      }
    }
  }

  .city {
    font-size:13px;
    width:40px;
    margin-right:10px;
    position:relative;
    left:-10px;
  }
  .center {
    text-align:center;
  }
  .tkui-search-input {
    margin:0 0 0 15px;
  }
</style>
