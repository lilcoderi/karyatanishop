<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow">
    <div class="container">
      <!-- Brand logo -->
      <router-link class="navbar-brand" to="/">
        <img src="/img/logo_kat.png" alt="Karya Tani Logo" class="mr-2" />
      </router-link>
      <div class="text-brand mx-auto">KARYA TANI SHOP</div>

      <!-- Toggler for mobile -->
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navbar links -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <!-- Search bar -->
        <div class="navbar-search position-relative ml-lg-5 mr-lg-5">
          <input type="text" v-model="searchQuery" @input="debouncedSearch" class="form-control"
            placeholder="Cari produk disini..." />
          <i class="fas fa-search search-icon"></i>
        </div>

        <!-- Centered navigation links -->
        <ul class="navbar-nav mx-auto">
          <li class="nav-item">
            <router-link class="nav-link" :class="{ active: isActive('/home') }" to="/home">Home</router-link>
          </li>
          <li v-if="!isLoggedIn" class="nav-item">
            <router-link class="nav-link" :class="{ active: isActive('/about') }" to="/about">About</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :class="{ active: isActive('/shop-view') }" to="/shop-view">Shop</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :class="{ active: isActive('/order-menu') }"
              to="/order-menu">Orders</router-link>
          </li>
        </ul>

        <!-- Utility icons -->
        <div class="navbar-utilities d-flex align-items-center">
          <!-- Cart -->
          <div class="position-relative mr-2 ml-3">
            <div :class="{
              'animate__animated animate__heartBeat animate__infinite': cartItemCount > 0,
            }">
              <i class="bi bi-cart2 fa-lg nav-icon" @click="goToCart"></i>
            </div>
            <span v-if="cartItemCount > 0" class="badge bg-danger position-absolute text-white"
              style="top: -5px; right: -8px; font-size: 9px;">
              {{ cartItemCount }}
            </span>
          </div>

          <!-- Notifications -->
          <div class="position-relative mt-1 mr-2">
            <div :class="{
              'animate__animated animate__swing animate__infinite': unreadCount > 0,
            }">
              <i class="bi bi-bell fa-lg nav-icon" @click="goToNotifications"></i>
            </div>
            <span v-if="unreadCount > 0" class="badge bg-danger position-absolute text-white"
              style="top: -5px; right: -8px; font-size: 9px;">
              {{ unreadCount }}
            </span>
          </div>

          <!-- Profile -->
          <div class="dropdown no-arrow mr-2">
            <a type="button" class="dropdown-toggle mt-1" data-toggle="dropdown">
              <i class="bi bi-person fa-lg nav-icon"></i>
            </a>
            <div class="dropdown-menu no-arrow">
              <router-link to="/profile-customer" class="dropdown-item">
                <i class="bi bi-person fa-lg fa-fw mr-2 text-gray-600"></i>
                My Profile
              </router-link>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
                <i class="fas fa-sign-out-alt fa-lg fa-fw mr-2 text-danger"></i>
                Logout
              </a>
            </div>
          </div>

          <!-- Admin -->
<div class="dropdown no-arrow" v-if="showAdminIcon">
  <a type="button" class="dropdown-toggle mt-1" data-toggle="dropdown">
    <i class="bi bi-person-gear fa-lg nav-icon"></i>
  </a>
  <div class="dropdown-menu dropdown-menu-right no-arrow">
    <router-link to="/admin" class="dropdown-item">
      <i class="bi bi-person-gear fa-lg fa-fw mr-2 text-gray-600"></i>
      Admin
    </router-link>
    <div class="dropdown-divider"></div>
    <router-link to="/kasir-view" class="dropdown-item">
      <i class="bi bi-person-lines-fill fa-lg fa-fw mr-2 text-gray-600"></i>
      Kasir
    </router-link>
  </div>
</div>

        </div>
      </div>
    </div>
  </nav>

  <!-- Logout Modal -->
  <div class="modal fade" id="logoutModal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Ready to Leave?</h4>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        <div class="modal-body">
          Select "Logout" below if you are ready to end your current session.
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">
            Close
          </button>
          <button type="button" class="btn btn-danger" data-dismiss="modal" @click="logout">
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios";
import debounce from "lodash/debounce";

export default {
  data() {
    return {
      searchQuery: "", // For the search input
      cartItemCount: 0,
      isLoggedIn: false, // Status login awal
      unreadCount: 0,
      notifications: [],
      message: null,
      messageClass: "",
      showAdminIcon: false,
    };
  },
  methods: {
    async fetchCartItemCount() {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token tidak ditemukan");
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/api/cart/count", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data && typeof response.data.count === "number") {
          this.cartItemCount = response.data.count;
        } else {
          console.error("API tidak memberikan count");
        }
      } catch (error) {
        console.error("Error fetching cart item count:", error);
      }
    },
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
    computed: {
      /**
       * Membatasi hanya 5 notifikasi pertama untuk ditampilkan
       */
      limitedNotifications() {
        return this.notifications.slice(0, 5);
      },
    },
    formatDate(date) {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(date).toLocaleDateString(undefined, options);
    },
    NotificationClick() {
      this.$router.push("/notif-customer");
    },
    // Emit search event
    onSearch() {
      this.$emit("search", this.searchQuery); // Emit searchQuery to parent if needed
    },
    // Navigate to cart
    goToCart() {
      this.$router.push("/cart-view");
    },
    // Navigate to cart
    goToNotifications() {
      this.$router.push("/notif-customer");
    },
    // Navigate to profile
    goToProfile() {
      this.$router.push("/profile");
    },
    // Gunakan debounce untuk menghindari terlalu sering request API
    debouncedSearch: debounce(function () {
      if (this.$route.name !== "shop-view") {
        this.$router.push({ name: "shop-view" });
      }
      this.$emit("onSearch", this.searchQuery); // Emit ke parent
    }, 300),

    isActive(route) {
      return this.$route.path === route;
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
          localStorage.removeItem("token");
          if (!localStorage.getItem("token")) {
            this.$router.push("/login");
          }
        })
        .catch((error) => {
          console.error("Logout error:", error);
          alert("Terjadi kesalahan saat logout");
        });
    },
  },
 async mounted() {
  const token = localStorage.getItem("token");
  this.isLoggedIn = !!token; // true jika token ada

  if (this.isLoggedIn) {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const profileData = response.data;
      this.showAdminIcon = profileData.show_admin_icon; // Ambil data dari API
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }

  this.fetchCartItemCount();
  this.fetchNotifications();
}

};
</script>

<style scoped>
.animate__animated{
  animation-duration: 2s;
}
/* Custom logo style */
.navbar {
  font-family: "Nunito";

}

.navbar-brand img {
  height: 40px;
}

.text-brand {
  font-weight: bold;
}

/* Search bar */
.navbar-search {
  flex-grow: 1;
}

.navbar-search input {
  border: 1px solid #e3e3e3;
  border-radius: 20px;
  padding-left: 15px;
  padding-right: 35px;
  width: 100%;
}

.navbar-search .search-icon {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  color: #888;
  cursor: pointer;
}

/* Centered menu */
.navbar-nav {
  margin: auto;
}

.navbar-nav .nav-item .nav-link {
  color: #333;
}

.navbar-nav .nav-item .nav-link.active {
  color: #7ABC18;
}

.navbar-nav .nav-item .nav-link:hover {
  color: #7ABC18;
  transform: scale(1.2,1.2);
}

/* Utility icons */
.navbar-utilities {
  display: flex;
  align-items: center;
}

.navbar-utilities .nav-icon {
  margin-left: 15px;
  cursor: pointer;
  color: #7ABC18;
}
</style>
