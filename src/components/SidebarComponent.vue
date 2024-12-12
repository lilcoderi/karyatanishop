<template>
  <!-- Sidebar -->
  <ul
    class="navbar-nav bg-gradient-success sidebar sidebar-dark accordion"
    id="accordionSidebar"
  >
    <!-- Sidebar - Brand -->
     <router-link to="/admin/dashboard-admin" class="text-decoration-none">
       <a
         class="sidebar-brand d-flex align-items-center justify-content-center mt-4"
         href="#"
       >
         <div class="sidebar-brand-icon">
           <img src="/img/logo_kat.png" alt="Logo" />
         </div>
         <div class="sidebar-brand-text mx-2">
           Karya Tani Bojonegoro <sup>Admin</sup>
         </div>
       </a>
     </router-link>

    <!-- Divider -->
    <hr class="sidebar-divider my-0" />

    <!-- Nav Item - Dashboard -->
    <li class="nav-item active">
      <router-link to="/admin/dashboard-admin" class="nav-link" exact-active-class="active">
        <i class="fas fa-fw fa-tachometer-alt"></i>
        <span>Dashboard</span>
      </router-link>
    </li>

    <!-- Divider -->
    <hr class="sidebar-divider" />

    <!-- Heading -->
    <div class="sidebar-heading">Interface</div>

    <!-- Nav Item - Pages Collapse Menu -->
    <li class="nav-item">
      <router-link to="/product-view" class="nav-link">
        <i class="fas fa-fw fa-cubes"></i>
        <span>Product</span>
      </router-link>
    </li>

    <!-- Nav Item - Utilities Collapse Menu -->
    <li class="nav-item">
      <router-link to="/kategori-view" class="nav-link">
        <i class="fas fa-fw fa-th-list"></i>
        <span>Categories</span>
      </router-link>
    </li>

    <li class="nav-item">
      <router-link to="/notif-view" class="nav-link">
        <i class="fas fa-fw fa-bell"></i>
        <span>Notifications</span>
      </router-link>
    </li>

    <li class="nav-item">
      <router-link to="/promo-view" class="nav-link">
        <i class="fas fa-fw fa-percent"></i>
        <span>Promo</span>
      </router-link>
    </li>

    <li class="nav-item">
      <router-link to="/user-view" class="nav-link">
        <i class="fas fa-fw fa-users"></i>
        <span>Users</span>
      </router-link>
    </li>

    <li class="nav-item">
      <router-link to="/role-view" class="nav-link">
        <i class="fas fa-fw fa-user-shield"></i>
        <span>Roles</span>
      </router-link>
    </li>

    <!-- Nav Item - Pages Collapse Menu -->
    <li class="nav-item">
      <router-link to="/order-view" class="nav-link">
        <i class="fas fa-fw fa-check-square"></i>
        <span>Orders</span>
      </router-link>
    </li>

    <!-- Nav Item - Charts -->
    <li class="nav-item">
      <router-link to="/report-view" class="nav-link">
        <i class="fas fa-fw fa-chart-area"></i>
        <span>Reports</span> 
      </router-link>
    </li>

    <!-- Nav Item - Tables -->
    <li class="nav-item">
      <router-link to="/transaksi-view" class="nav-link">
        <i class="fas fa-fw fa-credit-card"></i>
        <span>Transactions</span> 
      </router-link>
    </li>

    <!-- Divider -->
    <hr class="sidebar-divider d-none d-md-block" />

    <!-- Sidebar Toggler (Sidebar) -->
    <div class="text-center d-none d-md-inline">
      <button class="rounded-circle border-0" id="sidebarToggle"></button>
    </div>
  </ul>
  <!-- End of Sidebar -->
</template>

<script>

export default {
name: "AdminSidebar",
};
</script>


<style scoped>

</style>
