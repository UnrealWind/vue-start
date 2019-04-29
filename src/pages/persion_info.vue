<template>
  <tk-container>
    <tkui-header center>
      <tkui-button slot="left" class="icon" v-on:click="back()">
        <tk-icon material>keyboard_arrow_left</tk-icon>
      </tkui-button>个人主页
    </tkui-header>
    <tkui-list>
      <tkui-list-item >
        <tk-avatar slot="right" size="64">
          <tk-image src="http://moke-store.oss-cn-beijing.aliyuncs.com/5166583b-0ee1-4808-84a4-280abdfa9c2f.png" width="100" height="100"></tk-image>
        </tk-avatar>
        <div class="content">
          <div class="title">头像</div>
        </div>
      </tkui-list-item>
      <tkui-list-item >
        <div class="content">
          <div class="title">昵称</div>
        </div>
        <span slot="right">{{userInfo.phone}}</span>
      </tkui-list-item>
    </tkui-list>

    <tkui-button @click="logout()" class="special" raised big block border>退出登录</tkui-button>
  </tk-container>
</template>

<script>
export default {
  name: 'persion-info',
  layout: 'persion-info',
  data: function() {
    return {
      userInfo:{},
    }
  },
  mounted:function(){
    this.userInfo = this.$store.state.user
  },
  methods:{
    back:function(){
      this.$back();
    },
    logout:function(){
      this.$replace('/login');
    }
  }
}
</script>

<style lang="scss" scoped>
  .tkui-list {
    .tkui-list-item {
      padding: 1rem;
      border-bottom:1px solid #eee;
    }
  }
  .tkui-button.special {
    margin-top:3rem;
    background-color: #fff;
    color:red;
  }

</style>
