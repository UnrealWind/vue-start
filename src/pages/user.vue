<template>
  <tk-container class="help-feedback">
    <tk-image height="220" :src="speImg"></tk-image>
    <div class="header">
      <span  @click="goPersional()">
        <tk-avatar  @click="goPersional()" size="64">
          <tk-image v-if="!userInfo.avatar" src="http://moke-store.oss-cn-beijing.aliyuncs.com/5166583b-0ee1-4808-84a4-280abdfa9c2f.png" width="100" height="100"></tk-image>
          <tk-image v-else :src="userInfo.avatar" width="100" height="100"></tk-image>
        </tk-avatar>
      </span>
      <h2  @click="goPersional()">{{userInfo.username}}</h2>
      <div class="setting"  @click="goPersional()">
        <tk-icon color="#fff" material>settings</tk-icon>
      </div>
    </div>

    <div class="tab">
      <h3>
        <span class="pull-left">我的订单</span>
        <span class="pull-right"  @click="goOrderList('all')">查看全部订单></span>
      </h3>
      <tk-flex wrap gutter="8px">
        <div class="item tk-grid-4" @click="goOrderList('unpaid')"><tk-icon >Paid</tk-icon><p>待付款</p></div>
        <div class="item tk-grid-4" @click="goOrderList('complete')"><tk-icon >Completed</tk-icon><p>已完成</p></div>
        <div class="item tk-grid-4" @click="goOrderList('close')"><tk-icon >Cancelled</tk-icon><p>已取消</p></div>
      </tk-flex>
    </div>

    <tkui-list class="margin-top">
      <span @click="goHelpFeedback()">
        <tkui-list-item>
        <tk-icon size="17" slot="left">Help</tk-icon>
        帮助反馈
        <tk-icon color="#666" slot="right">return1</tk-icon>
      </tkui-list-item>
      </span>
    </tkui-list>

  </tk-container>
</template>

<script>
export default {
  name: 'user',
  layout: 'home',
  data: function () {
    return {
      speImg: 'http://moke-store.oss-cn-beijing.aliyuncs.com/7ee4acc4-75c8-4812-8d3b-b970d54de161.png',
    }
  },
  computed:{
    userInfo(){
      return this.$store.state.user
    }
  },
  mounted: function () {
    //
  },
  methods: {
    goOrderList: function (type) {
      this.$push({
        path: '/buyer/orderList',
        query: {
          orderType: type
        }
      })
    },
    goPersional: function () {
      this.$push('/buyer/persionInfo')
    },
    goHelpFeedback: function () {
      this.$push('/buyer/helpFeedback')
    }
  }
}
</script>

<style lang="scss" scoped>
  .tk-image-wrap {
   float:left;
  }
  .header {
    position:absolute;
    padding: 50px 0 0 16px;
    width:100%;
    h2 {
      display: inline-flex;
      color: #fff;
      font-size: 20px;
      font-weight: 300;
      margin-left: 24px;
    }
    .setting {
      position: absolute;
      top:16px;
      right:16px;
      display: inline-flex;
    }
  }
  .tab {
    position: absolute;

    /*这个挺好用的,记一笔*/
    left:calc((100% - 345px)/2);
    margin: 130px auto;
    width: 345px;
    height: 112px;
    background-color: rgba(255, 255, 255, 1);
    border-radius: 10px;
    padding: 6px;
    box-shadow:0 2px 5px rgba(0, 0, 0, 0.3);
    h3 {
      font-weight:300;
      border-bottom:1px solid #eee;
      padding: 5px 8px;
      .pull-left {
        font-size:14px;
      }
      .pull-right{
        float:right;
        font-size:13px;
        padding: 3px;
        color:#666;
      }
    }
  }
  .item {
    text-align:center;
    padding: 13px;
    p {
      font-size:13px;
      padding: 8px 0;
      color: #666;
    }
  }

  .margin-top {
    pointer-events: auto;
    position: absolute;
    margin: 280px 0 0 0;
    width: 100%;

  }
</style>
