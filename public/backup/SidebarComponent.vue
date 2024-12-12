<template>
  <div :class="['sidebar', { 'sidebar-collapsed': isSidebarCollapsed }]">
    <div class="sidebar-header">
      <p class="admin-title" v-if="!isSidebarCollapsed">Admin Dashboard</p>
      <button @click="toggleSidebar" class="toggle-button">
        <i :class="isSidebarCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
      </button>
    </div>
    <ul class="sidebar-menu">
      <li>
        <router-link to="/admin/dashboard-admin" class="menu-item" exact-active-class="active">
          <i class="fas fa-tachometer-alt"></i>
          <span v-if="!isSidebarCollapsed">Dashboard</span>
        </router-link>
      </li>
      <li>
        <router-link to="/order-view" class="menu-item" exact-active-class="active">
          <i class="fas fa-box"></i>
          <span v-if="!isSidebarCollapsed">Orders</span>
        </router-link>
      </li>
      <li>
        <router-link to="/transaksi-view" class="menu-item" exact-active-class="active">
          <i class="fas fa-credit-card"></i>
          <span v-if="!isSidebarCollapsed">Transactions</span>
        </router-link>
      </li>
      <li>
        <router-link to="/product-view" class="menu-item" exact-active-class="active">
          <i class="fas fa-cogs"></i>
          <span v-if="!isSidebarCollapsed">Products</span>
        </router-link>
      </li>
      <li>
        <router-link to="/kategori-view" class="menu-item" exact-active-class="active">
          <i class="fas fa-th-large"></i>
          <span v-if="!isSidebarCollapsed">Categories</span>
        </router-link>
      </li>
      <li>
        <router-link to="/notif-view" class="menu-item" exact-active-class="active">
          <i class="fas fa-bell"></i>
          <span v-if="!isSidebarCollapsed">Notifications</span>
        </router-link>
      </li>
      <li>
        <router-link to="/promo-view" class="menu-item" exact-active-class="active">
          <i class="fas fa-percent"></i>
          <span v-if="!isSidebarCollapsed">Promo</span>
        </router-link>
      </li>
      <li>
        <router-link to="/user-view" class="menu-item" exact-active-class="active">
          <i class="fas fa-users"></i>
          <span v-if="!isSidebarCollapsed">Users</span>
        </router-link>
      </li>
      <li>
        <router-link to="/role-view" class="menu-item" exact-active-class="active">
          <i class="fas fa-user-shield"></i>
          <span v-if="!isSidebarCollapsed">Roles</span>
        </router-link>
      </li>
      <li>
        <router-link to="/report-view" class="menu-item" exact-active-class="active">
          <i class="fas fa-chart-line"></i>
          <span v-if="!isSidebarCollapsed">Reports</span>
        </router-link>
      </li>
      <li>
        <router-link to="/log-view" class="menu-item" exact-active-class="active">
          <i class="fas fa-history"></i>
          <span v-if="!isSidebarCollapsed">Log Activity</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "SidebarComponent",
  data() {
    return {
      isSidebarCollapsed: false,
    };
  },
  methods: {
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    },
  },
};
</script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: #343a40;
  color: #fff;
  height: 100vh;
  transition: width 0.3s ease;
}

.sidebar-collapsed {
  width: 80px;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #495057;
}

.toggle-button {
  background: none;
  border: none;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  color: #fff;
  text-decoration: none;
}

.menu-item:hover {
  background-color: #495057;
}

.menu-item i {
  font-size: 18px;
  margin-right: 10px;
}

/* Hilangkan teks menu saat sidebar collapsed */
.sidebar-collapsed .menu-item span {
  display: none;
}

.sidebar-collapsed .menu-item i {
  margin-right: 0;
}
</style>
