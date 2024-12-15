<template>
  <!-- Topbar -->
  <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
    <!-- Sidebar Toggle (Topbar) -->
    <button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle mr-3">
      <i class="fa fa-bars"></i>
    </button>

    <!-- Topbar Search -->
    <form class="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
      <div class="input-group">
  <input
    type="text"
    class="form-control bg-light border-0 small"
    placeholder="Navigate to a menu by searching..."
    aria-label="Search"
    aria-describedby="basic-addon2"
  />
  <div class="input-group-append">
    <button class="btn btn-success" type="button" @click="handleSearch">
      <i class="fas fa-search fa-sm"></i>
    </button>
  </div>
</div>

    </form>

    <!-- Topbar Navbar -->
    <ul class="navbar-nav ml-auto">
      <!-- Nav Item - Search Dropdown (Visible Only XS) -->
      <li class="nav-item dropdown no-arrow d-sm-none">
        <a class="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button" data-toggle="dropdown"
          aria-haspopup="true" aria-expanded="false">
          <i class="fas fa-search fa-fw"></i>
        </a>
        <!-- Dropdown - Messages -->
        <div class="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in" aria-labelledby="searchDropdown">
          <form class="form-inline mr-auto w-100 navbar-search">
            <div class="input-group">
              <input type="text" class="form-control bg-light border-0 small" placeholder="Search for..."
                aria-label="Search" aria-describedby="basic-addon2" />
              <div class="input-group-append">
                <button class="btn btn-success" type="button">
                  <i class="fas fa-search fa-sm"></i>
                </button>
              </div>
            </div>
          </form>
        </div>
      </li>

      <!-- Nav Item - Alerts -->
      <li class="nav-item dropdown no-arrow mx-1">
        <a class="nav-link dropdown-toggle" href="#" id="alertsDropdown" role="button" data-toggle="dropdown"
          aria-haspopup="true" aria-expanded="false">
          <i class="fas fa-bell fa-fw"></i>
          <span v-if="unreadCount > 0" class="badge badge-danger badge-counter">{{ unreadCount }}</span>
          <!-- Counter - Alerts -->
        </a>
        <!-- Dropdown - Alerts -->
        <div class="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
          aria-labelledby="alertsDropdown">
          <h6 class="dropdown-header">Alerts Center</h6>

          <!-- Tampilkan maksimal 5 notifikasi -->
          <a v-for="(notification) in limitedNotifications" :key="notification.notification_id"
            class="dropdown-item d-flex align-items-center" href="#" @click="markAsRead(notification.notification_id)">
            <div class="mr-3">
              <div class="icon-circle bg-success">
                <i class="bi bi-list-check fa-lg text-white"></i>
              </div>
            </div>
            <div>
              <div class="small text-gray-500">{{ formatDate(notification.created_at) }}</div>
              <span class="font-weight-bold">{{ notification.message }}</span>
            </div>
          </a>

          <!-- Jika tidak ada notifikasi -->
          <a v-if="notifications.length === 0" class="dropdown-item text-center small text-gray-500" href="#">
            No alerts available.
          </a>

          <!-- Tombol untuk mengarahkan ke semua notifikasi -->
          <div class="dropdown-item text-center small text-gray-500" @click="onNotificationClick">
            <a href="" class="text-decoration-none">
              View All Notifications
            </a>
          </div>
        </div>
      </li>

      <div class="topbar-divider d-none d-sm-block"></div>

      <!-- Nav Item - User Information -->
      <li class="nav-item dropdown no-arrow">
        <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown"
          aria-haspopup="true" aria-expanded="false">
          <span class="mr-2 d-none d-lg-inline text-gray-600 small">{{ userName }}</span>

          <img class="img-profile rounded-circle" :src="userPhoto" alt="User Photo" />
        </a>
        <!-- Dropdown - User Information -->
        <div class="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
          <router-link to="/profile-admin" class="text-decoration-none">
            <a class="dropdown-item" href="#">
              <i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
              Profile
            </a>
          </router-link>
          <router-link to="/log-view" class="text-decoration-none">
            <a class="dropdown-item" href="#">
              <i class="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
              Activity Log
            </a>
          </router-link>
          <router-link to="/home" class="text-decoration-none">
            <a class="dropdown-item" href="#">
              <i class="bi bi-arrow-left-circle fa-sm fa-fw mr-2 text-gray-400"></i>
              My App
            </a>
          </router-link>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
            <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
            Logout
          </a>
        </div>
      </li>
    </ul>
  </nav>

  <!-- Logout Modal-->
  <div class="modal fade" id="logoutModal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">

        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title">Ready to Leave?</h4>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          Select "Logout" below if you are ready to end your current session.
        </div>

        <!-- Modal footer -->
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-danger" data-dismiss="modal" @click="logout">Logout</button>
        </div>

      </div>
    </div>
  </div>
  <!-- End of Topbar -->
</template>
<script>
import axios from "axios";

export default {
  name: "NavbarAdmin",
  data() {
    return {
      unreadCount: 0,
      notifications: [],
      message: null,
      messageClass: "",
      userName: "Guest", // Default nama user
    };
  },
  mounted() {
    this.fetchUnreadCount();
    this.fetchNotifications();
    this.fetchUserName(); // Ambil nama user saat komponen dimuat
  },
  computed: {
    /**
     * Membatasi hanya 5 notifikasi pertama untuk ditampilkan
     */
    limitedNotifications() {
      return this.notifications.slice(0, 5);
    },
  },
  methods: {
    async fetchUnreadCount() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://127.0.0.1:8000/api/notif-all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        this.unreadCount = response.data.unread_count;
      } catch (error) {
        console.error("Error fetching unread notifications:", error);
      }
    },

    handleSearch() {
    const searchQuery = document.querySelector(".navbar-search input").value.toLowerCase();

    // Mapping kata kunci ke rute
    const routeMapping = {
      product: "/product-view",
      categories: "/kategori-view",
      notifications: "/notif-view",
      promo: "/promo-view",
      users: "/user-view",
      roles: "/role-view",
      orders: "/order-view",
      reports: "/report-view",
      transactions: "/transaksi-view",
    };

    // Cari rute yang sesuai dengan keyword
    const targetRoute = Object.keys(routeMapping).find((key) => searchQuery.includes(key));

    // Arahkan ke rute yang ditemukan, atau tampilkan pesan error jika tidak ditemukan
    if (targetRoute) {
      this.$router.push(routeMapping[targetRoute]);
    } else {
      alert("No matching view found for your search.");
    }
  },
    async fetchNotifications() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://127.0.0.1:8000/api/notif-all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.notifications = response.data.notifications;
        this.unreadCount = response.data.unread_count;
      } catch (error) {
        console.error("Error fetching notifications:", error);
        this.message = "Failed to load notifications.";
        this.messageClass = "text-danger";
      }
    },
    async fetchUserName() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://127.0.0.1:8000/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.nama) {
          this.userName = response.data.nama; // Set nama pengguna dari respons API
        } else {
          this.userName = "Guest";
        }

        if (response.data.foto) {
          this.userPhoto = `http://127.0.0.1:8000/${response.data.foto}`; // Set foto pengguna dari respons API
        } else {
          this.userPhoto = "/img/undraw_profile.svg"; // Default foto jika tidak ada
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        this.userName = "Error";
        this.userPhoto = "/img/undraw_profile.svg"; // Default foto jika gagal
      }
    },
    async markAsRead(notificationId) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.put(
          `http://127.0.0.1:8000/api/notifications/${notificationId}/read`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          const notification = this.notifications.find(
            (notif) => notif.notification_id === notificationId
          );
          if (notification) {
            notification.status = "read";
            this.unreadCount--;
          }
          this.message = response.data.message;
          this.messageClass = "text-success";
        }
      } catch (error) {
        console.error("Error marking notification as read:", error);
        this.message = "Failed to mark notification as read.";
        this.messageClass = "text-danger";
      }
    },
    formatDate(date) {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(date).toLocaleDateString(undefined, options);
    },
    onNotificationClick() {
      this.$router.push("/notif-navbar");
    },
    logout() {
      axios
        .post(
          "http://127.0.0.1:8000/api/auth/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then(() => {
          // Hapus token dari localStorage
          localStorage.removeItem("token");

          // Periksa ulang localStorage setelah penghapusan
          if (!localStorage.getItem("token")) {
            // Arahkan ke halaman login jika token berhasil dihapus
            this.$router.push("/login");
          }
        })
        .catch((error) => {
          console.error("Logout error:", error);
          alert("Terjadi kesalahan saat logout");
        });
    },
    goHome() {
      this.$router.push("/home");
    },
    goToProfile() {
      this.$router.push("/profile-admin");
    },
  },
};
</script>


<style scoped>
/* .badge {
  font-size: 0.6rem;
  width: 1rem;
  height: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  position: absolute;
  top: 6px !important;
  right: -5px;
  transform: translate(50%, -50%);
  background-color: red;
  color: white;
} */

.navbar {
  z-index: 1000;
}

.profile-icon {
  font-size: 27px;
  color: #495057;
  cursor: pointer;
}

.profile-icon:hover {
  color: #007bff;
}
</style>
