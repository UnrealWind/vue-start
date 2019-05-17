<template>
  <tk-container class="brand" :status="status">
    <tkui-header slot="header" center>
      <tkui-button slot="left" class="icon" @click="$back">
        <tk-icon material>keyboard_arrow_left</tk-icon>
      </tkui-button>选择品牌
    </tkui-header>
    <h2>主营品牌</h2>
    <tk-flex wrap>
      <div @click="chose(opt)" class="item tk-grid-4" v-for="(opt,index) in currentBrands" :key="index">
        <tkui-button border primary v-show="!opt.active">{{opt.name}}</tkui-button>
        <tkui-button raised primary v-show="opt.active">{{opt.name}}</tkui-button>
      </div>
    </tk-flex>
  </tk-container>
</template>

<script>
export default {
  name: 'brandDetail',
  layout: '',
  data () {
    return {
      mainBrand: [],
      brands: [],
      status: 'loading'
    }
  },
  mounted () {
    this.init()
  },

  // 查了查 vue 这个computed会缓存这个属性 --- 计算属性是基于它们的响应式依赖进行缓存的
  //  https://segmentfault.com/a/1190000010408657  可以看一下这个
  computed: {
    userInfo () {
      return this.$store.state.user
    },
    currentBrands () {
      if (!this.mainBrand.length === 0) return
      return this.resetBrands()
    }
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
    chose (opt) {
      if (opt['active']) {
        opt['active'] = false
        this.userInfo.mainBrand.splice(this.userInfo.mainBrand.indexOf(opt.objectId), 1)
      } else {
        opt['active'] = true
        this.userInfo.mainBrand = this.userInfo.mainBrand.concat([opt.objectId])
      }
      this.putUser()
    },
    async putUser () {
      // ..  这里更新数据的文档写的有些模糊了，不过结合上下文来看是这么写，试了一下是可以的
      await this.$tkParse.put('/classes/_User/' + this.$store.state.user.objectId, {
        mainBrand: this.userInfo.mainBrand
      }, {}).catch(e => {
        this.status = 'error'
        throw e
      })
      this.$store.commit('setUser', this.userInfo)
    },
    resetBrands () {
      let that = this
      let brand = JSON.parse(JSON.stringify(this.mainBrand))
      if (!that.userInfo.mainBrand) {
        that.userInfo.mainBrand = []
      }
      brand.forEach((n, i) => {
        if (!n['active']) {
          n['active'] = false
        }
        that.userInfo.mainBrand.forEach((ni, ii) => {
          if (ni === n.objectId) {
            n['active'] = true
          }
        })
      })
      return brand
    },
    async getBrand () {
      this.mainBrand = await this.$tkParse.getList('/classes/brand')
    }
  }
}
</script>

<style lang="scss" scoped>
  h2 {
    font-size:16px;
    font-weight:500;
    padding:16px;
    color:#666;
    text-align:left;
  }
  .tkui-button {
    min-width:80%;
  }

</style>
