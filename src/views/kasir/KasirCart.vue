<template>
  <div>
    <!-- Navbar -->
    <NavbarKasir :cartItemCount="cartItemCount" />

    <div class="container mt-4">
      <h4>Shopping List</h4>

      <div v-if="loading" class="text-center my-5">
        <div class="spinner-border text-success" role="status">
          <span class="visually-hidden"></span>
        </div>
      </div>

      <div v-else-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <div v-else class="d-flex justify-content-center align-items-center">
        <div class="col-lg-10 mb-5">
          <div class="card">
            <div class="card-body">
              <div class="text-left mb-2 bg-white shadow-sm p-2 rounded">
                <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" /> Pilih Semua
              </div>
              <ul class="list-group">
                <li v-for="item in cartItems" :key="item.item_keranjang_id"
                  class="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                  <div class="d-flex align-items-center mb-3 mb-md-0 ml-3 text-left">
                    <input type="checkbox" v-model="selectedItems" :value="item.item_keranjang_offline_id"
                      class="form-check-input me-2" />
                    <img v-if="item.produk?.gambar" :src="getImageUrl(item.produk.gambar)" alt="Produk"
                      class="img-thumbnail" style="width: 75px; height: 75px; object-fit: cover;" />
                  </div>
                  <div class="text-end text-md-center mb-3 mb-md-0">
                    <div v-if="item.discount">
                      <div class="text-success font-weight-bold">
                        {{ formatPrice(item.price_after_discount) }}
                      </div>
                      <small class="text-muted">
                        <p>{{ formatPrice(item.original_price) }}</p>
                      </small>
                    </div>
                    <div v-else>
                      <span>Harga Satuan : {{ formatPrice(item.harga_satuan) }}</span>
                    </div>
                  </div>
                  <div class="text-end text-md-center mb-3 mb-md-0">
                    <span> Quantity : {{ item.kuantitas }}</span>
                  </div>
                  <div class="text-end text-md-center mb-3 mb-md-0">
                    <strong>Subtotal : {{ formatPrice(item.subtotal) }}</strong>
                  </div>
                  <div class="text-end">
                    <button class="btn btn-danger btn-sm" @click="deleteItem(item.item_keranjang_offline_id)">
                      <i class="bi bi-trash3-fill"></i>
                    </button>
                  </div>
                </li>
              </ul>
              <div class="mt-3">
                <strong>Total: {{ formatPrice(totalPrice) }}</strong>
              </div>

              <!-- Tombol Aksi -->
              <div class="btn-group justify-content-center gap-2 mt-3">
                <button class="btn btn-info" :disabled="selectedItems.length === 0" @click="checkoutSelectedItems">
                  Print Nota {{ selectedItems.length }} Item
                </button>
                <button class="btn btn-danger" @click="$router.push('/kasir-view')">
                  Back
                </button>
              </div>
              <div v-if="loading" class="text-center my-5">
                <div class="spinner-border text-success" role="status">
                  <span class="visually-hidden"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import NavbarKasir from "@/components/NavbarKasir.vue";

export default {
  components: {
    NavbarKasir,
  },
  data() {
    return {
      cartItems: [],
      selectedItems: [],
      selectAll: false,
      loading: true,
      error: null,
      notaId: null,
    };
  },
  computed: {
    totalPrice() {
      return this.selectedItems.reduce((total, selectedItemId) => {
        const selectedItem = this.cartItems.find(item => item.item_keranjang_offline_id === selectedItemId);
        if (selectedItem) {
          return total + parseFloat(selectedItem.subtotal);
        }
        return total;
      }, 0);
    },
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

        const response = await axios.get(
          "http://127.0.0.1:8000/api/keranjang-offline",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.keranjang_offline?.items) {
          this.cartItems = response.data.keranjang_offline.items;
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
        this.selectedItems = this.cartItems.map(
          (item) => item.item_keranjang_offline_id
        );
      } else {
        this.selectedItems = [];
      }
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

        await axios.delete(`http://127.0.0.1:8000/api/keranjang-offline/${itemId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.cartItems = this.cartItems.filter(
          (item) => item.item_keranjang_offline_id !== itemId
        );
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
    async checkoutSelectedItems() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      this.error = "Anda harus login terlebih dahulu.";
      return;
    }

    const response = await axios.post(
      "http://127.0.0.1:8000/api/post-nota",
      { item_keranjang_offline_id: this.selectedItems },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Periksa respons yang diterima
    console.log("Response from post-nota:", response.data);

    if (response.data.message === 'Checkout berhasil' && response.data.nota_belanja) {
      const nota = response.data.nota_belanja; // Mengakses objek nota_belanja dari respons
      if (nota && nota.nota_belanja_id) {
        this.notaId = nota.nota_belanja_id;
      } else {
        throw new Error("Nota ID tidak ditemukan.");
      }
    } else {
      throw new Error("Data nota tidak valid.");
    }

    alert("Checkout berhasil! Nota telah dibuat.");
    this.selectedItems = [];
    this.fetchCartItems();

    if (this.notaId) {
      window.open(`/print-nota/${this.notaId}`, "_blank");
    }
  } catch (err) {
    this.error =
      err.response?.data?.error || err.message || "Checkout gagal.";
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
