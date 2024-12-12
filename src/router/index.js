import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/auth/LoginView.vue';

const routes = [
  {
    path: '/',
    redirect: '/login' // Redirect otomatis ke /login
  },
  {
    path: '/login',
    name: 'LoginView',
    component: LoginView
  },
  {
    path: '/kasir-view',
    name: 'kasir',
    component: () => import('@/views/kasir/KasirView.vue')
  },
  {
    path: '/profile-customer',
    name: 'profile-customer',
    component: () => import('@/views/customer/ProfileCustomer.vue')
  },
  {
    path: '/product-detail-customer/:produk_id',
    name: 'product-detail-customer',
    props: true,
    component: () => import('@/views/customer/ProductDetailCustomer.vue')
  },
  {
    path: '/address-edit',
    name: 'address-edit',
    component: () => import('@/views/customer/AddressEdit.vue')
  },
  {
    path: '/profile-customer-edit',
    name: 'profile-customer-edit',
    component: () => import('@/views/customer/ProfileCustomerEdit.vue')
  },
  {
    path: '/notif-customer',
    name: 'notif-customer',
    component: () => import('@/views/customer/notifications/NotivicationsCustomer.vue')
  },
  {
    path: '/profile-kasir', // Path absolut
    name: 'profile-kasir',
    component: () => import('@/views/kasir/KasirProfile.vue'),
  },
  {
    path: '/profile-kasir-edit', // Path absolut
    name: 'profile-kasir-edit',
    component: () => import('@/views/kasir/KasirProfileEdit.vue'),
  },
  {
    path: "/print-nota/:id",
    name: "PrintNota",
    component: () => import("@/views/kasir/PrintNota.vue"),
  },
  {
    path: '/kasir-cart',
    name: 'kasir-cart',
    component: () => import('@/views/kasir/KasirCart.vue')
  },
  {
    path: '/shop-view',
    name: 'shop-view',
    component: () => import('@/views/customer/ShopView.vue')
  },
  {
    path: '/order-menu',
    name: 'order-menu',
    component: () => import('@/views/customer/OrderMenu.vue')
  },
  {
    path: '/add-review/:produkId',
    name: 'add-review',
    component: () => import('@/views/customer/AddReview.vue')
  },
  {
    path: '/order-details/:id',
    name: 'order-details',
    component: () => import('@/views/customer/OrderDetails.vue')
  },
  {
    path: '/order-process',
    name: 'order-process',
    component: () => import('@/views/customer/OrderView.vue')
  },
  {
    path: '/order-payment/:orderId',
    name: 'order-payment',
    component: () => import('@/views/customer/OrderPayment.vue')
  },
  {
    path: '/cart-view',
    name: 'cart-view',
    component: () => import('@/views/customer/CartView.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/auth/RegisterView.vue')
  },
  {
    path: '/otp-register',
    name: 'otp-register',
    component: () => import('@/views/auth/OtpRegister.vue')
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('@/views/auth/ForgotPassword.vue')
  },
  {
    path: '/otp-forgot-password',
    name: 'otp-forgot-password',
    component: () => import('@/views/auth/OtpPassword.vue')
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: () => import('@/views/auth/ResetPassword.vue')
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/views/admin/AdminDashboard.vue'),
    redirect: '/admin/dashboard-admin',
    children: [
      {
        path: 'dashboard-admin', // Relatif
        name: 'dashboard-admin',
        component: () => import('@/views/admin/DashboardAdmin.vue')
      },
      {
        path: 'edit-order/:id', // Relatif
        alias: '/edit-order',
        name: 'edit-order',
        component: () => import('@/views/admin/order/EditOrder.vue')
      },
      {
        path: '/detail-order/:id', // Path absolut
        name: 'detail-order',
        component: () => import('@/views/admin/order/OrderDetail.vue'),
      },
      {
        path: '/profile-admin', // Path absolut
        name: 'profile-admin',
        component: () => import('@/views/admin/profile/AdminProfile.vue'),
      },
      {
        path: '/profile-admin-edit', // Path absolut
        name: 'profile-admin-edit',
        component: () => import('@/views/admin/profile/AdminProfileEdit.vue'),
      },

      {
        path: '/notif-navbar', // Path absolut
        name: 'notif-navbar',
        component: () => import('@/views/admin/notifnavbar/NotifNavbar.vue'),
      },
      
      {
        path: 'transaksi-view', // Relatif
        alias: '/transaksi-view',
        name: 'transaksi-view',
        component: () => import('@/views/admin/transaksi/TransaksiView.vue')
      },
      {
        path: '/transaksi-edit/:id', // Relatif
        alias: '/transaksi-edit',
        name: 'transaksi-edit',
        props: true,
        component: () => import('@/views/admin/transaksi/TransaksiEdit.vue')
      },
      {
        path: '/transaksi-detail/:id', // Relatif
        alias: '/transaksi-detail',
        name: 'transaksi-detail',
        props: true,
        component: () => import('@/views/admin/transaksi/TransaksiDetail.vue')
      },
      {
        path: 'kategori-view', // Relatif
        alias: '/kategori-view',
        name: 'kategori-view',
        component: () => import('@/views/admin/kategori/KategoriView.vue')
      },
      {
        path: 'kategori-add', // Relatif
        alias: '/kategori-add',
        name: 'kategori-add',
        component: () => import('@/views/admin/kategori/KategoriAdd.vue')
      },
      {
        path: '/kategori-edit/:id',
        name: 'kategori-edit',
        component: () => import('@/views/admin/kategori/KategoriEdit.vue')
      },
      
      {
        path: '/kategori-detail/:id',  
        name: 'kategori-detail',
        component: () => import('@/views/admin/kategori/KategoriDetail.vue')
      },
      
      {
        path: 'log-view', // Relatif
        alias: '/log-view',
        name: 'log-view',
        component: () => import('@/views/admin/logaktivitas/LogView.vue')
      },
      {
        path: '/log-detail/:id', // Relatif
        alias: 'log-detail',
        name: 'log-detail',
        props: true, 
        component: () => import('@/views/admin/logaktivitas/LogDetail.vue')
      },
      {
        path: 'report-view', // Relatif
        alias: '/report-view',
        name: 'report-view',
        component: () => import('@/views/admin/report/ReportView.vue')
      },
      {
        path: 'report-offline', // Relatif
        alias: '/report-offline',
        name: 'report-offline',
        component: () => import('@/views/admin/report/ReportOffline.vue')
      },
      {
        path: 'report-all', // Relatif
        alias: '/report-all',
        name: 'report-all',
        component: () => import('@/views/admin/report/ReportAll.vue')
      },
      {
        path: 'report-filter', // Relatif
        alias: '/report-filter',
        name: 'report-filter',
        component: () => import('@/views/admin/report/ReportFilter.vue')
      },
      {
        path: 'report-filter-view', // Relatif
        alias: '/report-filter-view',
        name: 'report-filter-view',
        component: () => import('@/views/admin/report/ReportFilterView.vue')
      },
      {
        path: 'user-view', // Relatif
        alias: '/user-view',
        name: 'user-view',
        component: () => import('@/views/admin/users/UserView.vue')
      },
      {
        path: 'user-add', // Relatif
        alias: '/user-add',
        name: 'user-add',
        component: () => import('@/views/admin/users/UserAdd.vue')
      },
      {
        path: 'user-edit/:id', // Relatif
        alias: '/user-edit',
        name: 'user-edit',
        component: () => import('@/views/admin/users/UserEdit.vue')
      },
      {
        path: 'user-detail/:id', // Relatif
        alias: '/user-detail',
        name: 'user-detail',
        props: true,
        component: () => import('@/views/admin/users/UserDetail.vue')
      },
      {
        path: 'product-view', // Relatif
        alias: '/product-view',
        name: 'product-view',
        component: () => import('@/views/admin/products/ProductView.vue')
      },
      {
        path: 'product-add', // Relatif
        alias: '/product-add',
        name: 'product-add',
        component: () => import('@/views/admin/products/ProductAdd.vue')
      },
      {
        path: '/product-edit/:id', // Relatif
        alias: '/product-edit',
        name: 'product-edit',
        component: () => import('@/views/admin/products/ProductEdit.vue')
      },
      {
        path: '/product-detail/:id', // Relatif
        alias: '/product-detail',
        name: 'product-detail',
        component: () => import('@/views/admin/products/ProductDetail.vue')
      },
      {
        path: 'role-view', // Relatif
        alias: '/role-view',
        name: 'role-view',
        component: () => import('@/views/admin/roles/RoleView.vue')
      },
      {
        path: 'role-add', // Relatif
        alias: '/role-add',
        name: 'role-add',
        component: () => import('@/views/admin/roles/RoleAdd.vue')
      },
      {
        path: "/role-edit/:id",
        name: "role-edit",
        component: () => import("@/views/admin/roles/RoleEdit.vue"),
      },
      {
        path: "/role-detail/:id",
        name: "role-detail",
        component: () => import("@/views/admin/roles/RoleDetail.vue"),
      },
      {
        path: "/roles/:id/add-permissions",
        name: "role-add-permissions",
        component: () => import("@/views/admin/roles/RoleAddPermissions.vue"),
      },
      {
        path: 'notif-view', // Relatif
        alias: '/notif-view',
        name: 'notif-view',
        component: () => import('@/views/admin/notifications/NotificationsView.vue')
      },
      {
        path: 'notif-add', // Relatif
        alias: '/notif-add',
        name: 'notif-add',
        component: () => import('@/views/admin/notifications/NotificationsAdd.vue')
      },
      {
        path: 'promo-view', // Relatif
        alias: '/promo-view',
        name: 'promo-view',
        component: () => import('@/views/admin/promo/PromoView.vue')
      },
      {
        path: 'promo-add', // Relatif
        alias: '/promo-add',
        name: 'promo-add',
        component: () => import('@/views/admin/promo/PromoAdd.vue')
      },
      {
        path: '/promo-edit/:id', // Dynamic route with the ID parameter
        name: 'promo-edit',
        component: () => import('@/views/admin/promo/PromoEdit.vue')
      },
      {
        path: '/promo-detail/:id', // Dynamic route with the ID parameter
        name: 'promo-detail',
        component: () => import('@/views/admin/promo/PromoDetail.vue')
      },
      

      {
        path: 'order-view', // Relatif
        alias: '/order-view', // Path alternatif
        name: 'order-view',
        component: () => import('@/views/admin/order/OrderView.vue')
      }
      
    ]
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
