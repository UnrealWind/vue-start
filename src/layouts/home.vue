<template>
  <tk-container disable-scroll>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <tk-flex around slot="footer" class="home-layout-footer">
      <tk-flex column center v-for="(item, index) in menu" :key="index" @click.native="$replace(item.path)" :class="{active: isActive(item.path)}">
        <tk-icon>{{item.icon}}</tk-icon>
        <span>{{item.text}}</span>
      </tk-flex>
    </tk-flex>
  </tk-container>
</template>
<script>
export default {
  name: 'home-layout',
  data () {
    return {
      menu: [
        {
          icon: 'Home',
          text: '首页',
          path: '/'
        }, {
          icon: 'Shopping',
          text: '购物车',
          path: '/cart'
        }, {
          icon: 'Mine',
          text: '我的',
          path: '/user'
        }
      ]
    }
  },
  methods: {
    isActive (path) {
      return this.$route.path === path
    }
  }
}
</script>
<style lang="scss" scoped>
.home-layout-footer {
  color: rgba(209, 201, 201, 1);
  .active {
    color: rgba(11, 148, 255, 1)
  }
}
</style>
