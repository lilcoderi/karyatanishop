<template>
  <div id="wrapper">
    <div id="page-top"></div>
    <!-- Sidebar -->
    <SidebarComponent />

    <!-- Content Wrapper -->
    <div id="content-wrapper" class="d-flex flex-column">
      <!-- Main Content -->

      <div id="content">
        <!-- Topbar -->
        <NavbarAdmin />
        <!-- End of Topbar -->

        <!-- Begin Page Content -->
        <div class="main-content">
          <router-view></router-view>
        </div>
        <!-- /.container-fluid -->
      </div>
      <!-- End of Main Content -->

      <!-- Footer -->
      <FooterAdmin />
      <!-- End of Footer -->
    </div>
    <!-- End of Content Wrapper -->
  </div>
  <!-- End of Page Wrapper -->

  <!-- Scroll to Top Button-->
  <a class="scroll-to-top rounded" href="#page-top">
    <i class="fas fa-angle-up"></i>
  </a>
</template>

<script>
import NavbarAdmin from "../../components/NavbarAdmin.vue";
import SidebarComponent from "../../components/SidebarComponent.vue";

export default {
  name: "AdminDashboard",
  components: {
    NavbarAdmin,
    SidebarComponent,
  },
  mounted() {
    // Toggle sidebar
    $("#sidebarToggle, #sidebarToggleTop").on("click", function () {
      $("body").toggleClass("sidebar-toggled");
      $(".sidebar").toggleClass("toggled");
      if ($(".sidebar").hasClass("toggled")) {
        $(".sidebar .collapse").collapse("hide");
      }
    });

    // Handle window resize
    $(window).resize(() => {
      if ($(window).width() < 768) {
        $(".sidebar .collapse").collapse("hide");
      }

      if ($(window).width() < 480 && !$(".sidebar").hasClass("toggled")) {
        $("body").addClass("sidebar-toggled");
        $(".sidebar").addClass("toggled");
        $(".sidebar .collapse").collapse("hide");
      }
    });
  },
};
</script>

<style>
#wrapper {
  font-family: "Nunito";
}
</style>
