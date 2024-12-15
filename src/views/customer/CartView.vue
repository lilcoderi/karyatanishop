<template>
  <!-- Navbar -->
  <NavbarView :cartItemCount="cartItemCount" />
  <div class="container">
    <!-- Breadcrumb -->
    <nav aria-label="breadcrumb">
      <h2>Cart</h2>
      <ol class="breadcrumb bg-white justify-content-center">
        <li class="breadcrumb-item">
          <router-link to="/home" class="text-decoration-none home">Home</router-link>
        </li>
        <li class="breadcrumb-item active text-second" aria-current="page">Cart</li>
      </ol>
    </nav>

    <div class="row">
      <!-- Cart Items -->
      <div class="col-lg-8 mb-5">
        <div class="card">
          <div class="card-body">
            <div class="text-left mb-2 bg-white shadow-sm p-2 rounded">
              <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" /> Pilih Semua
            </div>
            <ul class="list-group">
              <li v-for="item in cartItems" :key="item.item_keranjang_id"
                class="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                <div class="d-flex align-items-center mb-3 mb-md-0 ml-3 text-left">
                  <input type="checkbox" class="form-check-input me-3" v-model="selectedItems"
                    :value="item.item_keranjang_id" />
                  <img :src="getImageUrl(item.produk?.gambar)" alt="Product" class="img-thumbnail"
                    style="width: 60px; height: 60px; object-fit: cover; margin-right: 10px;" />
                  <div class="col-4 col-md-6 text-truncate">
                    <p class="mb-1 font-weight-bold text-capitalize">{{ item.produk?.nama_produk }}</p>
                    <small class="text-capitalize">{{ item.produk?.deskripsi_produk }}</small>
                  </div>
                </div>
                <div class="text-end text-md-center mb-3 mb-md-0">
                  <div v-if="item.discount">
                    <div class="text-success font-weight-bold">
                      {{ formatPrice(item.price_after_discount) }}
                    </div>
                    <small class="text-muted">
                      <s>{{ formatPrice(item.original_price) }}</s>
                    </small>
                  </div>
                  <div v-else>
                    <span>{{ formatPrice(item.harga_satuan) }}</span>
                  </div>
                </div>
                <div class="d-flex align-items-center mb-3 mb-md-0">
                  <button class="btn btn-outline-secondary btn-sm" :disabled="item.kuantitas <= 1"
                    @click="updateQuantity(item.item_keranjang_id, item.kuantitas - 1)">
                    -
                  </button>
                  <span class="mx-2">{{ item.kuantitas }}</span>
                  <button class="btn btn-outline-secondary btn-sm"
                    @click="updateQuantity(item.item_keranjang_id, item.kuantitas + 1)">
                    +
                  </button>
                </div>
                <div class="text-end text-md-center mb-3 mb-md-0">
                  <strong>{{ formatPrice(item.subtotal) }}</strong>
                </div>
                <div class="text-end">
                  <button class="btn btn-danger btn-sm" @click="deleteItem(item.item_keranjang_id)">
                    <i class="bi bi-trash3-fill"></i>
                  </button>
                </div>
              </li>
            </ul>
            <div v-if="loading" class="text-center my-5">
              <div class="spinner-border text-success" role="status">
                <span class="visually-hidden"></span>
              </div>
            </div>
          </div>
        </div>
      </div>


      <!-- Order Details -->
      <div class="col-lg-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Order Details</h5>
            <ul class="list-group list-group-flush">
              <li class="list-group-item d-flex justify-content-between align-items-center">
                Subtotal ({{ selectedItems.length }} items)
                <span>{{ formatPrice(totalPrice) }}</span>
              </li>
              
             
              <li class="list-group-item d-flex justify-content-between align-items-center font-weight-bold">
                Estimated total
                <span>{{ formatPrice(estimatedTotal) }}</span>
              </li>
            </ul>
            <button class="btn btn-success btn-block mt-3" :disabled="selectedItems.length === 0"
              @click="goToOrderSummary">
              Checkout
            </button>
          </div>
        </div>
      </div>
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
      cartItems: [],
      selectedItems: [],
      selectAll: false,
      loading: true,
      error: null,
      discount: 0, // Diskon total
      deliveryFee: 0, // Biaya pengiriman
    };
  },
  computed: {
    totalPrice() {
      // Hitung total hanya dari item yang dipilih
      return this.cartItems.reduce((total, item) => {
        // Periksa jika item ada dalam `selectedItems`
        if (this.selectedItems.includes(item.item_keranjang_id) && item.subtotal) {
          return total + parseFloat(item.subtotal); // Konversi ke angka
        }
        return total;
      }, 0);
    },

    estimatedTotal() {
      const totalPrice = parseFloat(this.totalPrice) || 0; // Konversi dan atur ke 0 jika invalid
      const discount = parseFloat(this.discount) || 0; // Konversi dan atur ke 0 jika invalid
      const deliveryFee = parseFloat(this.deliveryFee) || 0; // Konversi dan atur ke 0 jika invalid

      return totalPrice - discount + deliveryFee;
    }
  },
  watch: {
    selectedItems() {
      this.selectAll =
        this.selectedItems.length === this.cartItems.length &&
        this.cartItems.length > 0;
    },
  },
  methods: {
    async fetchCartItems() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          this.error = "Anda harus login terlebih dahulu.";
          return;
        }

        const response = await axios.get("http://127.0.0.1:8000/api/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(response.data); // Debugging: melihat bentuk data

        // Cek apakah response.data adalah array atau objek
        if (Array.isArray(response.data)) {
          this.cartItems = response.data;  // Jika array, simpan dalam cartItems
        } else if (response.data && response.data.item_keranjang_id) {
          this.cartItems = [response.data];  // Jika objek, jadikan array
        } else {
          this.error = "Keranjang kosong atau tidak valid.";
        }
      } catch (err) {
        this.error = err.response?.data?.message || "Gagal memuat keranjang belanja.";
      } finally {
        this.loading = false;
      }
    },

    toggleSelectAll() {
      if (this.selectAll) {
        this.selectedItems = this.cartItems.map((item) => item.item_keranjang_id);
      } else {
        this.selectedItems = [];
      }
    },
    goToOrderSummary() {
      // Kirim produk yang dipilih ke halaman OrderSummary
      this.$router.push({
        name: 'order-process',
        query: {
          selectedItems: JSON.stringify(this.selectedItems),  // Mengirimkan data yang dipilih
        }
      });
    },
    async deleteItem(itemId) {
      if (!confirm("Apakah Anda yakin ingin menghapus item ini?")) {
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          this.error = "Anda harus login terlebih dahulu.";
          return;
        }

        await axios.delete(`http://127.0.0.1:8000/api/cart/remove/${itemId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.cartItems = this.cartItems.filter((item) => item.item_keranjang_id !== itemId);
        alert("Item berhasil dihapus.");
      } catch (err) {
        this.error = err.response?.data?.message || "Gagal menghapus item.";
      }
    },
    formatPrice(price) {
      return parseFloat(price).toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      });
    },
    getImageUrl(imagePath) {
      return `http://127.0.0.1:8000/${imagePath}`;
    },
    updateQuantity(itemId, newQuantity) {
      const item = this.cartItems.find((item) => item.item_keranjang_id === itemId);
      if (item && newQuantity > 0) {
        // Tampilkan loader (opsional)
        this.loading = true;
        const token = localStorage.getItem("token");

        if (!token) {
          this.error = "Anda harus login terlebih dahulu.";
          this.loading = false;
          return;
        }

        // Perbarui kuantitas ke server
        axios
          .put(
            `http://127.0.0.1:8000/api/cart/update/${itemId}`,
            { kuantitas: newQuantity },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            // Jika sukses, perbarui data item di frontend
            item.kuantitas = response.data.item.kuantitas;
            item.subtotal = response.data.item.subtotal;
            this.error = "";
          })
          .catch((error) => {
            this.error = error.response?.data?.message || "Gagal memperbarui kuantitas.";
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        alert("Kuantitas tidak valid.");
      }
    },

  },
  mounted() {
    this.fetchCartItems();
  },

};
</script>

<style scoped>
.container {
  font-family: "Nunito";
}

.text-second {
  color: #7ABC18;
}

.home:hover {
  color: #7ABC18;
}

.list-group-item {
  background-color: white;
}

.list-group-item:hover {
  background-color: rgb(241, 241, 241);
}
</style>