<template>
  <div>
    <!-- Navbar -->
    <NavbarView :cartItemCount="cartItemCount" />

    <!-- Menu untuk memilih status order -->
    <div class="container mt-4">
      <div class="btn-group w-100 mb-4" role="group" aria-label="Order Status">
        <button class="btn btn-outline-success" :class="{ active: activeTab === 'pending' }"
          @click="setActiveTab('pending')">
          Pending
        </button>
        <button class="btn btn-outline-success" :class="{ active: activeTab === 'proses' }"
          @click="setActiveTab('proses')">
          Proses
        </button>
        <button class="btn btn-outline-success" :class="{ active: activeTab === 'selesai' }"
          @click="setActiveTab('selesai')">
          Selesai
        </button>
        <button class="btn btn-outline-success" :class="{ active: activeTab === 'batal' }"
          @click="setActiveTab('batal')">
          Batal
        </button>
      </div>
    </div>

    <!-- Spinner loading -->
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden"></span>
      </div>
    </div>

    <!-- Error alert -->
    <div v-if="error" class="alert alert-danger container">
      {{ error }}
    </div>

    <!-- Daftar order -->
    <div v-if="orders.length > 0" class="container">
      <div class="row g-3">
        <div v-for="order in filteredOrders" :key="order.order_id" class="col-lg-6 col-md-12">
          <div class="card shadow-sm mb-4">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div class="text-left">
                  <h6 class="card-title">Order #{{ order.order_id }}</h6>
                  <span class="badge" :class="getStatusClass(order.status_order)">{{ order.status_order.toUpperCase()
                    }}</span>
                </div>
                <div>
                  <button class="btn btn-outline-info btn-sm mb-2" @click="viewOrderDetails(order.order_id)">
                    <i class="bi bi-eye"></i> Lihat Detail
                  </button>
                  <button v-if="order.status_order === 'selesai' && !order.id_review"
                    class="btn btn-outline-success btn-sm ms-2" @click="handleReview(order)">
                    <i class="bi bi-star"></i> Add Review
                  </button>

                  <button v-if="order.status_order === 'selesai' && order.id_review"
                    class="btn btn-outline-secondary btn-sm ms-2" @click="handleReview(order)">
                    <i class="bi bi-pencil"></i> Edit Review
                  </button>
                </div>
              </div>
              <hr />
              <!-- Produk items -->
              <div v-for="item in order.produk_items" :key="item.produk_item_id" class="d-flex align-items-center mb-3">
                <img :src="`http://127.0.0.1:8000/${item.produk.gambar}`" class="rounded" alt="product image"
                  style="width: 80px; height: 80px; object-fit: cover;" />
                <div class="ms-3 ml-3 text-left">
                  <h6 class="mb-1">
                    {{ item.produk.nama_produk || "Nama Produk Tidak Tersedia" }}
                  </h6>
                  <p class="mb-0 text-muted">
                    Harga: Rp{{ item.produk.after_diskon || "0" }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <nav aria-label="Page navigation" class="mt-4">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="changePage(currentPage - 1)">
              Previous
            </button>
          </li>
          <li v-for="page in totalPages" :key="page" class="page-item " :class="{ active: currentPage === page }">
            <button class="page-link" @click="changePage(page)">
              {{ page }}
            </button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="changePage(currentPage + 1)">
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Pesanan tidak ditemukan -->
    <div v-else class="text-center mt-5">
      <p class="text-muted">No orders found for this status.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import NavbarView from "@/components/NavbarView.vue";

export default {
  components: {
    NavbarView,
  },
  data() {
    return {
      activeTab: "pending",
      orders: [],
      error: null,
      loading: true,
      currentPage: 1,
      totalPages: 1,
    };
  },
  computed: {
    filteredOrders() {
      return this.orders.filter(
        (order) => order.status_order === this.activeTab
      );
    },
  },
  methods: {
    getStatusClass(status) {
      switch (status) {
        case "pending":
          return "bg-warning text-dark";
        case "proses":
          return "bg-primary";
        case "selesai":
          return "bg-success";
        case "batal":
          return "bg-danger";
        default:
          return "bg-secondary";
      }
    },
    async handleReview(order) {
      const produkId = order.produk_items[0]?.produk?.produk_id;

      if (produkId) {
        try {
          // Redirect ke halaman Add/Edit Review
          await this.$router.push(`/add-review/${produkId}`);

          // Setelah review berhasil, perbarui id_review untuk order ini
          this.$nextTick(() => {
            order.id_review = true; // Anggap review berhasil dan id_review diperbarui
          });
        } catch (error) {
          console.error("Gagal memperbarui review:", error);
        }
      } else {
        console.warn("Produk tidak ditemukan pada order:", order);
      }
    },
    async fetchOrders() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          this.error = "Anda harus login terlebih dahulu.";
          this.loading = false;
          return;
        }

        const response = await axios.get(
          `http://127.0.0.1:8000/api/orders?page=${this.currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status === "success" && response.data.data) {
          this.orders = response.data.data.data;
          this.totalPages = response.data.data.last_page;
          this.loading = false;
        } else {
          this.error = "Gagal memuat pesanan.";
          this.loading = false;
        }
      } catch (err) {
        this.error = err.response?.data?.message || "Gagal memuat pesanan.";
        this.loading = false;
      }
    },
    setActiveTab(status) {
      this.activeTab = status;
      this.currentPage = 1;
      this.fetchOrders();
    },
    changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
      this.fetchOrders();
    },
    viewOrderDetails(orderId) {
      this.$router.push(`/order-details/${orderId}`);
    },
  },
  mounted() {
    this.fetchOrders();
  },
};
</script>

<style scoped>
.container {
  font-family: "Nunito";
}
</style>