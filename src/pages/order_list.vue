<template>
  <tk-container>
    <tkui-header center>
      <tkui-button slot="left" class="icon" @click="back()">
        <tk-icon material>keyboard_arrow_left</tk-icon>
      </tkui-button>订单
    </tkui-header>
    <tkui-tab v-if="orderType" :value="orderType"  average style="height: auto;">
      <tkui-tab-item label="全部订单">
        <span  @click="goCartDetail(order)"  v-for="order in orders">
          <tkui-list >
            <div class="list-header" >
              <h2><span>{{order.titleName}}</span>
                <span class="pull-right" v-bind:class="{ gray: order.status !== 'complete'}">{{order.paidStatus}}</span>
              </h2>
            </div>
            <tkui-list-item disableHover divider >
              <img slot="left" v-if="shop && shop.tagimg" v-for="shop in order.detail" v-bind:src="shop.tagimg" class="avatar" />
              <div class="content"  >
                <div class="price gray" >共{{order.detail.length}}件商品，实付款：¥{{order.price}}
                </div>
              </div>
            </tkui-list-item>
          </tkui-list>
        </span>
      </tkui-tab-item>
      <tkui-tab-item label="待付款">
        <span v-if=" order.status == 'unpaid'" @click="goCartDetail(order)"  v-for="order in orders">
          <tkui-list>
            <div class="list-header" >
              <h2><span>{{order.titleName}}</span>
                <span class="pull-right" v-bind:class="{ gray: order.status !== 'complete'}">{{order.paidStatus}}</span>
              </h2>
            </div>
            <tkui-list-item disableHover divider >
              <img slot="left" v-if="shop &&shop.tagimg" v-for="shop in order.detail" v-bind:src="shop.tagimg" class="avatar" />
              <div class="content"  >
                <div class="price gray" >共{{order.detail.length}}件商品，实付款：¥{{order.price}}
                </div>
              </div>
            </tkui-list-item>
          </tkui-list>
        </span>
      </tkui-tab-item>
      <tkui-tab-item label="已完成">
        <span v-if="order.status == 'complete'" @click="goCartDetail(order)"  v-for="order in orders">
          <tkui-list>
            <div class="list-header" >
              <h2><span>{{order.titleName}}</span>
                <span class="pull-right" v-bind:class="{ gray: order.status !== 'complete'}">{{order.paidStatus}}</span>
              </h2>
            </div>
            <tkui-list-item disableHover divider >
              <img slot="left" v-if="shop &&shop.tagimg"  v-for="shop in order.detail" v-bind:src="shop.tagimg" class="avatar" />
              <div class="content"  >
                <div class="price gray" >共{{order.detail.length}}件商品，实付款：¥{{order.price}}
                </div>
              </div>
            </tkui-list-item>
          </tkui-list>
        </span>
      </tkui-tab-item>
      <tkui-tab-item label="已取消">
        <span v-if=" order.status == 'close'" @click="goCartDetail(order)"  v-for="order in orders">
          <tkui-list>
            <div class="list-header" >
              <h2><span>{{order.titleName}}</span>
                <span class="pull-right" v-bind:class="{ gray: order.status !== 'complete'}">{{order.paidStatus}}</span>
              </h2>
            </div>
            <tkui-list-item disableHover divider >
              <img slot="left" v-if="shop && shop.tagimg" v-for="shop in order.detail" v-bind:src="shop.tagimg" class="avatar" />
              <div class="content"  >
                <div class="price gray" >共{{order.detail.length}}件商品，实付款：¥{{order.price}}
                </div>
              </div>
            </tkui-list-item>
          </tkui-list>
        </span>
      </tkui-tab-item>
    </tkui-tab>
  </tk-container>
</template>

<script>
export default {
  name: 'order-list',
  layout: 'order-list',
  data: function() {
    return {
      orders:[],
      paidStatus:'',
      userInfo:{},
      orderType:''
    }
  },
  activated:function(){

  },
  mounted:function(){
    this.init();
  },
  methods:{
    init:function(){
      var that = this;
      let orderType = this.$getFlash('orderType');

      //标一下全局状态
      switch (orderType){
        case 'all':this.orderType = '全部订单';break;
        case 'unpaid':this.orderType = '未付款';break;
        case 'complete':this.orderType = '已完成';break;
        case 'close':this.orderType = '已取消';break;
      }

      //获取数据，然后总价需要计算一下
      this.userInfo = this.$store.state.user;
      (async () => {
        let res = await this.$tkParse.get('/classes/order',{
          params: {  // url参数
            //include:'user',
            order:'-createdAt',
            where:{
              user:this.userInfo.objectId
            }
          },
        });
        that.orders = res.data.results;

        //算一下总价
        that.orders.forEach((n,i)=>{
          n['price'] = 0;
          switch (n.status){
            case 'unpaid':n.paidStatus = '未付款';break;
            case 'complete':n.paidStatus = '已完成';break;
            case 'close':n.paidStatus = '已关闭';break;
          }
          n['titleName'] = '';
          let titleName = {};
          n.detail.forEach((ni,ii)=>{
            if(!ni) return;
            ni['price']?n.price += ni.price:'';
            !titleName[ni.shop.shopName]?
              (ii==0?n['titleName']+= ni.shop.shopName:n['titleName']+= '，'+ni.shop.shopName,titleName[ni.shop.shopName] =true):'';
          })
        })
      })();
    },
    goCartDetail:function(opt){
      this.$push({
        path:'/cart-detail',
        flash:{
          flash:{
            cart_objectId:opt.objectId,
          }
        }
      });
    },
    back:function(){
      this.$back();
    },
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

  .list-header {
    padding: 0 1rem;
    font-size: 0.8rem;
    margin-top:1rem;
    h2 {
      padding: 0.5rem 0;
      font-size: 14px;
      color: rgba(33, 33, 33, 1);
      .pull-right{
        float:right;
        font-size: 14px;
        color: #0091FF;
      }
      .gray {
        color:#999;
      }
    }
  }

  .tkui-list-item {
    padding:0.3rem 1rem;
    .list-item-content {
      .content {
        padding: 0.3rem;
        text-align:left;
        width:100%;
        .title {
          margin-bottom:0.3rem;
          .pull-right {
            float:right;
            display: block;
            font-size:0.5rem;
            font-weight:300;
          }
        }
        .des {
          font-size:0.75rem;
          color:#aaa;
        }
        .price {
          color:red;
          margin-top:0.3rem;
          .right{
            float:right;
            border:0;
            span {
              display: inline-block;
              width:1.5rem;
              height:1.5rem;
              background-color: #eee;
              padding: 0.1rem;
              text-align: center;
              font-size:1.2rem;
              color:#666;
            }
            span:nth-child(2) {
              background: #fff;
              font-size:0.8rem;
            }
          }
        }
      }
    }
  }

  .fix-footer-addin {
    bottom: 0;
    background-color: #fff;
    width: 100%;
    height:3rem;
    margin-top:1rem;
    position:fixed;
    .left{
      padding:1rem;
      color:red;
      float:left;
      font-size:1.2rem;
      span {
        font-size:0.5rem;
      }
    }
    .tkui-button {
      float: right;
      margin:0;
      border-radius:0;
      height: 100%;
    }
  }

  .tkui-list {
    .tkui-list-item {
      display: block;
      .left {
        width:100%;
        >img {
          width:60px;
          height:60px;
        }
      }
      .gray{
        float:right;
        color:#333 !important;
        font-size:0.8rem;
      }
    }
  }

</style>

