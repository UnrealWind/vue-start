<template>
  <tk-container>
    <tkui-header slot="header" center :status="status">
      <tkui-button slot="left" class="icon" @click="$back">
        <tk-icon material>keyboard_arrow_left</tk-icon>
      </tkui-button>商家主页
    </tkui-header>

    <tkui-list>
      <span @click="goBrandDetail()">
        <tkui-list-item>
        主营品牌
        <span slot="right">
          <span v-for="(brand,index) in userInfo.mainBrand"><span v-if="index !== 0">、</span>
            <span v-for="(opt,index) in mainBrand" v-if="opt.objectId == brand">{{opt.name}}</span>
          </span>
        </span>
        <tk-icon color="#666" slot="right">return1</tk-icon>
      </tkui-list-item>
      </span>
      <span @click="goChangePassword()">
        <tkui-list-item>
          修改密码
          <tk-icon color="#666" slot="right">return1</tk-icon>
        </tkui-list-item>
      </span>
    </tkui-list>

    <tkui-list>
      <span @click="goShopAddress()">
        <tkui-list-item>
          我的店铺
          <tk-icon color="#666" slot="right">return1</tk-icon>
        </tkui-list-item>
      </span>
    </tkui-list>

    <tkui-button @click="logout()" class="special" raised big block border>退出登录</tkui-button>
  </tk-container>
</template>

<script>
export default {
  name: 'merchantIndex',
  layout: '',
  data: function () {
    return {
      mainBrand: [],
      status: 'loading'
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.user
    }
  },
  mounted: function () {
    this.init()
  },
  methods: {
    init () {
      this.getBrand()
    },
    async getBrand () {
      let res = await this.$tkParse.get('/classes/brand', {
        params: { // url参数

        }
      }).catch(e => {
        // err code
        this.status = 'error'
        throw e
      })
      this.mainBrand = res.data.results
      this.mainBrand.length > 0 ? this.status = false : this.status = 'empty'
    },
    logout: function () {
      this.$replace('/login')
      this.$store.commit('setSessionToken', null)
    },
    goBrandDetail: function () {
      // 这里测了测query，区别应该是flash会被销毁
      this.$push({
        path: '/merchant/brandDetail'
      })
    },
    goChangePassword: function () {
      this.$push({
        path: '/merchant/changePassword'
      })
    },
    goShopAddress: function () {
      this.$push({
        path: '/merchant/shopAddress'
      })
    },
    gobikeList: function () {
      this.$push({
        path: '/merchant/bikeList'
      })
    }

  }
}
</script>

<style lang="scss" scoped>
  .tkui-button.special {
    margin-top:50px;
    background-color: #fff;
    color:red;
  }

  .tkui-list-item {
    .right>span {
      max-width:200px;
      display:inline-block;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
  }
</style>
