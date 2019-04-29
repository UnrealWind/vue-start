import Vue from 'vue'
import Router from 'vue-router'
import routes from 'vue-auto-routing'
import { createRouterLayout } from 'vue-router-layout'

Vue.use(Router)

const RouterLayout = createRouterLayout(layout => {
  return import('@/layouts/' + layout + '.vue')
})

export default new Router({
  routes: [
    {
      path: '/',
      component: RouterLayout,
      children: routes
    },
    {
      path: '/login',
      component: () => import('@/pages/login.vue')
    },
    {
      path: '/shop-detail',
      component: () => import('@/pages/shop_detail.vue')
    },
    {
      path: '/commodity-detail',
      component: () => import('@/pages/commodity_detail.vue')
    },
    {
      path: '/cart-detail',
      component: () => import('@/pages/cart_detail.vue')
    },
    {
      path: '/order-list',
      component: () => import('@/pages/order_list.vue')
    },
    {
      path: '/persion-info',
      component: () => import('@/pages/persion_info.vue')
    },
    {
      path: '/city-chose',
      component: () => import('@/pages/city_chose.vue')
    },
    {
      path: '/merchant-index',
      component: () => import('@/pages/merchant_index.vue')
    },
    {
      path: '/brand-detail',
      component: () => import('@/pages/brand_detail.vue')
    },
    {
      path: '/change-password',
      component: () => import('@/pages/change_password.vue')
    },
    {
      path: '/shop-address',
      component: () => import('@/pages/shop_address.vue')
    },
    {
      path: '/bike-list',
      component: () => import('@/pages/bike_list.vue')
    },
    {
      path: '/new-bike',
      component: () => import('@/pages/new_bike.vue')
    },
    {
      path: '/bike-brand',
      component: () => import('@/pages/bike_brand.vue')
    },
    {
      path: '/help-feedback',
      component: () => import('@/pages/help_feedback.vue')
    }
  ]
})
