<template>
  <tk-container  :status="status" class="index" infiniteScroll @loadingMore="loadingMore">
      <tkui-header slot="header" >
        <tkui-button  @click="goCityChose" slot="left" class="icon">
          <tk-icon>Positioning</tk-icon>
        </tkui-button>
        <span slot="left" class="city">{{cityName}}</span>
        <tkui-search-input v-model="search" place-holder="输入搜索内容" ></tkui-search-input>
        <div slot="right">
          <tkui-button @click="scan" class="icon">
            <tk-icon>Scan</tk-icon>
          </tkui-button>
        </div>
      </tkui-header>
      <tk-slider loop autoPlay>
        <div class="slider-item" v-for="(image,index) in imgs" :key="index">
          <tk-image style="width: 100%;" :src="image.image" width="1200" height="600"></tk-image>
        </div>
      </tk-slider>
      <div class="center"><tk-image height="40" :src="speImg"></tk-image></div>
      <tkui-list>
        <tkui-list-item divider v-for="(opt,index) in currentShop" :key="index">
          <tk-image slot="left"  :src="opt.storePhoto" width="1200" height="600" class="avatar"></tk-image>
          <div class="content" @click="goShopPage(opt)">
            <div class="title">{{opt.shopName}}
              <span class="pull-right">距离：{{opt.location|distance(location,$tkHelper.distance)}}km</span>
            </div>
            <div class="des">{{opt.txtLocation}}</div>
            <div v-if="opt.user" class="btn-box">
              <span v-for="(tagBrand,index) in opt.user.mainBrand" :key="index">
                <span v-for="(brand,index) in brands" :key="index">
                  <tkui-button raised rounded primary small disabled v-if="tagBrand === brand.objectId" >
                    {{brand.name}}
                  </tkui-button>
                </span>
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
  data () {
    return {
      imgs: [],
      speImg: 'http://moke-store.oss-cn-beijing.aliyuncs.com/b6813a52-5db9-4c65-a8af-60f41e9d15af.png',
      brands: [],
      mapShow: true,
      location: {},
      search: '',
      perPage: 10,
      pageNum: 0,
      status: 'loading',
      targetShop: []
    }
  },
  mounted () {
    this.init()
  },
  filters: {
    distance (value, location, calculation) {
      if (!value) return ''
      return calculation(value, location, 'km')
    }
  },
  computed: {
    currentShop () {
      return this.targetShop
    },
    currentBrands () {
      return this.brands
    },
    currentImg () {
      return this.imgs
    },
    cityName () {
      if (this.$route.query.cityId) {
        return this.$tkRegions.getName(this.$route.query.cityId)
      } else {
        return this.location.name || '定位中'
      }
    }
  },
  methods: {
    async init () {
      try {
        await this.getSlider()
        await this.getBrand()
        // await this.getShop()
      } catch (e) {
        this.status = 'error'
        throw e
      }
      this.status = false
    },

    // 无限加载
    async loadingMore (page, next) {
      // 初始状态不进行loadingmore操作
      if (this.pageNum === 0) {
        await this.getLocal()
      }
      await this.getShop()
      this.targetShop = this.targetShop.concat(this.shop)
      if (this.shop.length < this.perPage || this.shop.length === 0) {
        next('complete')
      } else {
        next('+1')
      }
      this.pageNum++
    },
    async getSlider () {
      this.imgs = await this.$tkParse.getList('/classes/slider')
    },
    async getBrand () {
      this.brands = await this.$tkParse.getList('/classes/brand', {
        params: {
          include: 'user'
        }
      })
    },
    async getShop () {
      this.shop = await this.$tkParse.getList('/classes/shop', {
        params: {
          include: 'user',
          limit: this.perPage,
          skip: this.pageNum * this.perPage,
          order: 'location',
          where: {
            location: {
              $nearSphere: {
                __type: 'GeoPoint',
                latitude: this.location.latitude,
                longitude: this.location.longitude
              }
              // $maxDistanceInKilometers: 20.0 // 附近20公里内,有需求可加
            }
          }
        }
      })
    },
    async getLocal () {
      // 定位是正确的了
      this.location = await this.$tkGeolocation.getCurrentPosition({
        parse: true
      })
    },
    goShopPage (opt) {
      this.$push({
        path: '/buyer/shopDetail',
        flash: {
          shopId: opt.user.objectId,
          shopName: opt.shopName
        }
      })
    },
    checkResult (result) {
      // 对result进行判断，当返回true时,扫码成功，扫描器关闭
      this.$refs.scaner.close()
      result ? this.$push({
        path: '/buyer/cartDetail',
        query: {
          cart_objectId: result
        }
      }) : this.$refs.toast.add('扫码失败！请重试')
    },
    async scan () {
      // scanResult 为成功扫描后返回的数据
      await this.$refs.scaner.scan()
        .catch(e => {
          console.log(e.type) // 错误类型, cancel 代表用户主动取消扫码， error代表其他错误
          console.log(e.message) // 错误说明
          throw e
        })
    },
    goCityChose () {
      this.$push({
        path: '/buyer/cityChose',
        flash: {
          cityName: this.cityName
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
