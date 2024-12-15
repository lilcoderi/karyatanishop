<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
    <div class="container">
      <!-- Tombol Kembali di Pojok Kiri -->
      <div class="d-flex align-items-center mr-3">
        <i class="bi bi-arrow-left-circle fa-lg fs-4 text-dark" role="button" @click="goHome"></i>
      </div>
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
          <input type="text" v-model="searchQuery" @input="onSearch" class="form-control"
            placeholder="Cari produk disini..." />
          <i class="fas fa-search search-icon"></i>
        </div>

        <!-- Centered navigation links -->
        <ul class="navbar-nav mx-auto">

        </ul>

        <!-- Utility icons -->
        <div class="navbar-utilities p-2">
          <div class="align-items-center position-relative">
            <router-link to="/kasir-cart">
              <i class="bi bi-cart2 fa-lg nav-icon"></i>
            </router-link>
            <span v-if="cartItemCount > 0" class="badge bg-danger position-absolute text-white"
              style="top: -5px; right: -8px; font-size: 9px;">
              {{ cartItemCount }}
            </span>
          </div>
          <div class="dropdown no-arrow">
            <a type="button" class="dropdown-toggle ml-4 text-decoration-none" data-toggle="dropdown">
              <img
  :src="user.foto ? `http://127.0.0.1:8000/${user.foto}` : '/img/undraw_profile.svg'"
  alt="User"
  class="rounded-circle"
  style="width: 25px; height: 25px;"
/>
<small>{{ user.nama }}</small>

            </a>
            <div class="dropdown-menu no-arrow">
              <router-link to="/profile-kasir" class="dropdown-item">
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
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-danger" data-dismiss="modal" @click="logout">Logout</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios";

export default {
  data() {
    return {
      user: {
        user_id: "",
        nama: "",
      },
      cartItemCount: 0, // Jumlah item di keranjang
      searchQuery: "", // Query pencarian produk
    };
  },
  mounted() {
    console.log("Component mounted. Checking Bootstrap integration...");
    console.log("Bootstrap JS Loaded:", typeof bootstrap !== "undefined");
    this.fetchCartItemCount();
  },
  created() {
    this.getUserProfile();
  },
  methods: {
    async fetchCartItemCount() {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token tidak ditemukan");
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/api/keranjang-offline/count", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("API Response:", response.data);
        if (response.data && typeof response.data.total_items === "number") {
          this.cartItemCount = response.data.total_items;
        } else {
          console.error("API tidak memberikan total_items");
        }
      } catch (error) {
        console.error("Error fetching cart item count:", error);
      }
    },
    async getUserProfile() {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/profile", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    console.log("User profile data fetched:", response.data);

    // Pastikan data user termasuk foto diperoleh dari respons API
    this.user = {
      user_id: response.data.user_id,
      nama: response.data.nama,
      foto: response.data.foto, // Pastikan properti 'foto' ada
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    alert("Failed to load profile data.");
  }
},

    onSearch() {
      // Emit event ke parent dengan searchQuery
      this.$emit("search", this.searchQuery);
    },
    goHome() {
      this.$router.push("/home");
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
  },
};
</script>

<style scoped>
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

