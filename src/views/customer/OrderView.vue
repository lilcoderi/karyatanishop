<template>
  <div>
    <!-- Navbar -->
    <NavbarView :cartItemCount="cartItemCount" />

    <div class="container mt-5">
      <div class="card checkout-card">
        <div class="card-header text-center bg-success">
          <h4 class="text-white">Checkout</h4>
        </div>
        <div class="card-body">
          <!-- Loader -->
          <div v-if="loading" class="loading-container">
            <div class="spinner-border text-success" role="status"></div>
          </div>

          <!-- Error Handling -->
          <div v-else-if="error" class="alert alert-danger text-center">
            {{ error }}
          </div>

          <!-- Order Summary List -->
          <div v-else>
            <ul class="list-group mb-3">
              <li
                v-for="item in cartItems"
                :key="item.item_keranjang_id"
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                <div class="product-container">
                  <img
                    v-if="item.produk?.gambar"
                    :src="getImageUrl(item.produk.gambar)"
                    alt="Produk"
                    class="product-img"
                  />
                  <div class="text-left text-capitalize">
                    <strong>{{ item.produk?.nama_produk }}</strong>
                    <p class="mb-0 text-muted">{{ item.produk?.deskripsi_produk }}</p>
                  </div>
                </div>
                <div class="price-info">
                  <span class="price">{{ formatPrice(item.harga_satuan) }}</span> x {{ item.kuantitas }}
                </div>
              </li>
            </ul>

            <!-- Voucher Input -->
            <div class="voucher-section mb-3">
              <input
                v-model="voucherCode"
                class="form-control"
                placeholder="Masukkan Kode Voucher"
                @change="applyVoucher"
              />
            </div>

            <!-- Shipping Method Selection -->
            <div class="shipping-method mb-3">
              <h6>Metode Pengiriman</h6>
             <!-- <div class="form-check">
                <input
                  type="radio"
                  id="jtr"
                  value="JTR"
                  v-model="selectedCourier"
                  class="form-check-input"
                  :disabled="loading"
                  @change="fetchDeliveryFee"
                />
                <label class="form-check-label" for="jtr">JNE Trucking (JTR)</label>
              </div> -->
              <div class="form-check">
                <input
                  type="radio"
                  id="reg"
                  value="REG"
                  v-model="selectedCourier"
                  class="form-check-input"
                  :disabled="loading"
                  @change="fetchDeliveryFee"
                />
                <label class="form-check-label" for="reg">Layanan Reguler (REG)</label>
              </div>
            </div>

            <!-- Delivery Fee Section -->
            <div v-if="deliveryFee > 0" class="delivery-fee mb-3 text-left">
              <h6 class="mb-2">Ongkir:</h6>
              <p>{{ formatPrice(deliveryFee) }} ({{ selectedCourier }})</p>
            </div>

            <!-- Total Section -->
            <div class="total-section text-right mb-3">
              <h5>Total: <strong>{{ formatPrice(totalPrice) }}</strong></h5>
            </div>

            <!-- Checkout Buttons -->
            <div class="btn-container text-center mt-3 btn-group">
              <button
                class="btn btn-success"
                :disabled="cartItems.length === 0 || !selectedCourier"
                @click="checkoutOrder"
              >
                Checkout
              </button>
              <button
                class="btn btn-secondary"
                @click="$router.push('/cart-view')"
              >
                Back
              </button>
            </div>
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
      voucherCode: "",
      loading: true,
      error: null,
      discount: 0,
      selectedCourier: "", // Selected courier (JTR or REG)
      deliveryFee: 0, // Delivery fee based on the selected courier
      destination: null, // Province destination (to calculate shipping)
      totalWeight: 0, // Total weight of selected products
    };
  },
  computed: {
    totalPrice() {
      const total = this.cartItems.reduce(
        (total, item) => total + parseFloat(item.subtotal),
        0
      );
      return total - this.discount + this.deliveryFee; // Include delivery fee in total
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

        const selectedItemIds =
          JSON.parse(this.$route.query.selectedItems) || [];
        const response = await axios.get(
          "http://127.0.0.1:8000/api/cart",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data) {
          this.cartItems = response.data.filter((item) =>
            selectedItemIds.includes(item.item_keranjang_id)
          );
        } else {
          this.error = "Keranjang kosong atau tidak valid.";
        }
      } catch (err) {
        this.error =
          err.response?.data?.message || "Gagal memuat keranjang belanja.";
      } finally {
        this.loading = false;
      }
    },

    async fetchDestination() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          this.error = "Anda harus login terlebih dahulu.";
          return;
        }

        const response = await axios.get("http://127.0.0.1:8000/api/address", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data) {
          this.destination = response.data.provinsi;
        } else {
          this.error = "Gagal memuat alamat tujuan.";
        }
      } catch (err) {
        this.error = err.response?.data?.message || "Gagal mendapatkan alamat tujuan.";
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

    async fetchDeliveryFee() {
      if (!this.selectedCourier || !this.destination) {
        this.error = "Kurir atau tujuan tidak dipilih.";
        return;
      }

      this.calculateTotalWeight();

      try {
        const response = await axios.post("http://127.0.0.1:8000/api/check-ongkir", {
          origin: "35",
          destination: this.destination,
          weight: this.totalWeight,
          courier: "jne", // Kirim fixed courier ke backend
        });

        const courierInfo = response.data.find(
          (service) => service.service === this.selectedCourier
        );

        if (!courierInfo) {
          this.error = `Layanan ${this.selectedCourier} tidak ditemukan.`;
          return;
        }

        this.deliveryFee = courierInfo.cost[0]?.value || 0;

        if (this.deliveryFee === 0) {
          this.error = `Tidak ada ongkir tersedia untuk layanan ${this.selectedCourier}.`;
        }
      } catch (err) {
        this.error = "Gagal mendapatkan ongkir.";
      }
    },

    calculateTotalWeight() {
      this.totalWeight = this.cartItems.reduce((total, item) => {
        if (item.produk?.berat) {
          return total + parseFloat(item.produk.berat) * item.kuantitas;
        }
        return total;
      }, 0);
    },

    async applyVoucher() {
      if (this.voucherCode) {
        try {
          const response = await axios.post('http://127.0.0.1:8000/api/check-voucher', {
            kode_voucher: this.voucherCode,
          });

          if (response.data.status === 'success') {
            this.discount = response.data.data.discount_value; // Misalnya, diskon yang diterima
          } else {
            this.discount = 0;
            this.error = response.data.message;
          }
        } catch (err) {
          this.error = "Gagal menerapkan voucher.";
        }
      } else {
        this.discount = 0;
      }
    },

    async checkoutOrder() {
      try {
        if (this.deliveryFee === 0) {
          this.error = "Ongkir belum dihitung.";
          return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
          this.error = "Anda harus login terlebih dahulu.";
          return;
        }

        const response = await axios.post(
          "http://127.0.0.1:8000/api/orders",
          {
            item_keranjang_id: this.cartItems.map((item) => item.item_keranjang_id),
            kode_voucher: this.voucherCode,
            ongkir: this.deliveryFee, // Perbaikan: kirim ongkir di sini
            total_price: this.totalPrice, // Total price sudah dihitung (termasuk ongkir dan diskon)
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status === "success") {
          alert(response.data.message);
          window.location.href = `http://127.0.0.1:8000/pay/${response.data.data.order.order_id}`;
        } else {
          this.error = response.data.message || "Checkout gagal.";
        }
      } catch (err) {
        this.error = err.response?.data?.message || "Checkout gagal.";
      }
    },
  },
  mounted() {
    this.fetchCartItems();
    this.fetchDestination();
  },
};
</script>

<style scoped>
/* General container setup */
.container {
  max-width: 1200px;
  font-family: "Nunito";
}

.shipping-method {
  text-align: left;
}

/* Styling untuk card */
.checkout-card {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 15px;
}

/* Header Card */
.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
}

/* Order List */
.product-container {
  display: flex;
  align-items: center;
}

.product-img {
  width: 50px;
  height: 50px;
  margin-right: 10px;
  object-fit: cover;
  border-radius: 5px;
}

.list-group-item {
  border: none;
  transition: all 0.2s ease;
}

.list-group-item:hover {
  background-color: #f1f1f1;
}

/* Responsive Styles */
@media (max-width: 576px) {
  .checkout-card {
    max-width: 100%;
    padding: 10px;
  }
}

@media (min-width: 577px) and (max-width: 768px) {
  .checkout-card {
    max-width: 90%;
  }
}

@media (min-width: 769px) {
  .checkout-card {
    max-width: 600px;
  }
}
</style>
