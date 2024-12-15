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
                :disabled="!selectedCourier"
                @click="checkoutOrder"
              >
                Checkout
              </button>
              <button
                class="btn btn-secondary"
                @click="$router.push('/product-detail/' + productId)"
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
      selectedCourier: "",
      deliveryFee: 0,
      productId: this.$route.params.productId, // Correctly fetch productId from route params
      quantity: 1, // Default quantity is 1
      totalWeight: 0,
      destination: null, // To store destination
    };
  },

  computed: {
    totalPrice() {
      // Calculate total price including delivery fee and discount
      const total = this.cartItems.reduce(
        (total, item) => total + parseFloat(item.subtotal),
        0
      );
      return total - this.discount + this.deliveryFee;
    },
  },

  methods: {
    formatPrice(amount) {
      // Format the price to currency (Indonesian Rupiah)
      return amount.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
      });
    },

    async fetchProduct() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          this.error = "Anda harus login terlebih dahulu.";
          return;
        }

        const response = await axios.get(
          `http://127.0.0.1:8000/api/products/${this.productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data) {
          this.cartItems = [{
            produk: response.data,
            kuantitas: this.quantity,
            harga_satuan: response.data.harga_satuan,
            subtotal: response.data.harga_satuan * this.quantity
          }];
        }
      } catch (err) {
        this.error = err.response?.data?.message || "Produk tidak ditemukan.";
      } finally {
        this.loading = false;
      }
    },

    getImageUrl(imagePath) {
      return `http://127.0.0.1:8000/${imagePath}`;
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
          courier: "jne",
        });

        const courierInfo = response.data.find(
          (service) => service.service === this.selectedCourier
        );

        if (!courierInfo) {
          this.error = `Layanan ${this.selectedCourier} tidak ditemukan.`;
          return;
        }

        this.deliveryFee = courierInfo.cost[0]?.value || 0;
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

    async checkoutOrder() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      this.error = "Anda harus login terlebih dahulu.";
      return;
    }

    // Mengirimkan ongkir bersama dengan data lainnya
    const response = await axios.post(
      "http://127.0.0.1:8000/api/order-now",
      {
        produk_id: this.productId,
        quantity: this.quantity,
        kode_voucher: this.voucherCode,
        ongkir: this.deliveryFee, // Mengirim ongkir ke backend
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
    this.fetchProduct();
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
