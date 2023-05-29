import Vue from 'vue'
import Router from 'vue-router'
import Ebook from '@/Ebook'
import Test from '@/Test'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/ebook'
    },
    {
      path: '/ebook',
      component: Ebook
    },
    {
      path: '/test',
      component: Test
    }
  ]
})
