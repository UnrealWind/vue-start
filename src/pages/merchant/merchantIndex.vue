<template>
  <tk-container>
    <tkui-header slot="header" center :status="status">
      <tkui-button slot="left" class="icon" @click="$back">
        <tk-icon material>keyboard_arrow_left</tk-icon>
      </tkui-button>商家主页
    </tkui-header>

    <tkui-list>
      <span @click="$push({path: '/merchant/brandDetail'})">
        <tkui-list-item>
        主营品牌
        <span slot="right">
          <span v-for="(brand,index) in userInfo.mainBrand" :key="index"><span v-if="index !== 0">、</span>
            <span v-for="(opt,index) in mainBrand" :key="index">
              <span v-if="opt.objectId === brand">{{opt.name}}</span>
            </span>
          </span>
        </span>
        <tk-icon color="#666" slot="right">return1</tk-icon>
      </tkui-list-item>
      </span>
      <span @click="$push({path: '/merchant/changePassword'})">
        <tkui-list-item>
          修改密码
          <tk-icon color="#666" slot="right">return1</tk-icon>
        </tkui-list-item>
      </span>
    </tkui-list>

    <tkui-list>
      <span @click="$push({path: '/merchant/shopAddress'})">
        <tkui-list-item>
          我的店铺
          <tk-icon color="#666" slot="right">return1</tk-icon>
        </tkui-list-item>
      </span>
    </tkui-list>

    <tkui-button @click="logout" class="special" raised big block border>退出登录</tkui-button>
  </tk-container>
</template>

<script>
export default {
  name: 'merchantIndex',
  layout: '',
  data () {
    return {
      mainBrand: [],
      status: 'loading'
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.user
    },
    currentBrands () {
      return this.mainBrand
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    async init () {
      try {
        await this.getBrand()
      } catch (e) {
        this.status = 'error'
        throw e
      }
      this.mainBrand.length > 0 ? this.status = false : this.status = 'empty'
    },
    async getBrand () {
      this.mainBrand = await this.$tkParse.getList('/classes/brand')
    },
    logout () {
      this.$replace('/login')
      this.$store.commit('setSessionToken', null)
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
