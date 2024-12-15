<template>
  <div class="home-view">
    <!-- Navbar -->
    <NavbarView :cartItemCount="cartItemCount" />

    <!-- Hero Section -->
    <HeroSection />

    <!-- Konten Daftar Produk -->
    <div class="product-section mt-5">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h4 class="font-weight-bold mb-0">
            Daftar <span class="text-second">Produk</span>
          </h4>
          <router-link to="/shop-view" class="text-second font-weight-bold text-decoration-none">
            View More <i class="bi bi-arrow-right-circle icon"></i>
          </router-link>
        </div>


        <!-- Loader saat data sedang dimuat -->
        <div v-if="loading" class="text-center my-5">
          <div class="spinner-border text-success" role="status">
            <span class="visually-hidden"></span>
          </div>
        </div>

        <!-- Pesan error -->
        <div v-else-if="error" class="alert alert-danger">
          {{ error }}
        </div>

        <!-- Daftar produk -->
<div v-else class="row row-cols-2 row-cols-md-5 g-4 text-left">
  <div 
    v-for="product in products.filter(product => product.stok > 0).slice(0, 10)" 
    :key="product.produk_id" 
    class="col">
    <!-- Tambahkan @click untuk navigasi -->
    <ProductCardCustomer 
      :product="product" 
      @click="goToProductDetail(product.produk_id)" 
    />
  </div>
</div>

      </div>
    </div>

    <!-- Feature Box Section -->
    <FeatureBox />

    <!-- Cashback Section -->
    <div class="cashback-section mt-5">
      <div id="cashback-section" class="container">
        <div class="row align-items-center justify-content-center text-center text-md-left">
          <!-- Kolom untuk Teks -->
          <div id="text-cashback" class="col-12 col-md-6 mb-4 mb-md-0">
            <h3 class="font-weight-bold">
              <span class="text-cashback">Get 5% Cash Back</span> on Orders Above Rp200,000!
            </h3>
            <p>
              Gardening is a rewarding hobby that grows both plants and joy, plus it’s now a bit easier on the wallet
              too! 🌱
            </p>
          </div>

          <!-- Kolom untuk Gambar -->
          <div id="img" class="col-12 col-md-6 d-flex justify-content-center">
            <img src="/img/tasShoping.png" alt="Shopping Bag" class="img img-fluid">
          </div>
        </div>
      </div>
    </div>

    <!-- Brand Section -->
    <div class="brand-section">
      <div class="container">
        <div>
          <h4 class="font-weight-bold text-center mb-5"><span class="text-second">Brand</span> Unggulan</h4>
        </div>
        <div id="brand-section"
          class="row row-cols-2 row-cols-md-6 g-4 align-items-center justify-content-center text-center text-md-left">
          <!-- Kolom untuk Brand -->
          <div class="col mb-5">
            <img src="/img/brand/image.png" alt="Bio Planmate Indonesia" />
          </div>
          <div class="col mb-5">
            <img src="/img/brand/image-1.png" alt="Agria" />
          </div>
          <div class="col mb-5">
            <img src="/img/brand/image-2.png" alt="Petrokimia Kayaku" />
          </div>
          <div class="col mb-5">
            <img src="/img/brand/image-3.png" alt="Bintang Tani" />
          </div>
          <div class="col mb-5">
            <img src="/img/brand/image-4.png" alt="Biogene" />
          </div>
          <div class="col mb-5">
            <img src="/img/brand/image-5.png" alt="Semusimku" />
          </div>
        </div>
      </div>
    </div>

    <!-- Frame Section -->
    <div class="frame-section">
      <div class="container text-md-left">
        <div class="mb-2">
          <router-link class="navbar-brand" to="/">
            <div class="text-brand text-dark mx-auto">
              <h6 class="font-weight-bold">
                <img src="/img/logo_kat.png" alt="Karya Tani Logo" class="mr-2" />
                KARYA TANI SHOP
              </h6>
            </div>
          </router-link>
        </div>
        <div class="row row-cols-md-4">
          <div class="contact col text-left">
            <h6 class="contact font-weight-bold">Contact Information</h6>
            <p><i class="bi bi-geo-alt mr-2"></i>Kabupaten Bojonegoro, Jawa Timur</p>
            <p><i class="bi bi-telephone mr-2"></i>(+62) 821-9090-1234</p>
            <p>karyatanibojonegoro@gmail.com</p>
          </div>
          <div class="contact col text-left">
            <h6 class="contact font-weight-bold">Customer Support</h6>
            <p>Frequent Questions</p>
            <p>Shipping</p>
            <p>Contact Us</p>
          </div>
          <div class="contact col text-left">
            <h6 class="contact font-weight-bold">Follow Us</h6>
            <div class="row">
              <div class="ml-3">
                <a href="#"><i class="bi bi-facebook text-dark"></i></a>
              </div>
              <div class="ml-3">
                <a href="#"><i class="bi bi-instagram text-dark"></i></a>
              </div>
            </div>
          </div>
          <div class="contact col text-left">
            <h6 class="contact font-weight-bold">Payment Methods</h6>
            <img class="img-payment" src="/img/paymentMethods.png" alt="Payment Methods">
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FeatureBox from "@/components/customer/FeatureBox.vue";
import HeroSection from "@/components/customer/HeroSection.vue";
import NavbarView from "@/components/NavbarView.vue";
import ProductCardCustomer from "@/components/ProductCardCustomer.vue";
import axios from "axios";

export default {
  components: {
    NavbarView,
    ProductCardCustomer,
    HeroSection,
    FeatureBox,
  },
  data() {
    return {
      products: [],
      searchQuery: "",
      loading: true,
      error: null,
      cart: [],
    };
  },
  computed: {
    cartItemCount() {
      return this.cart.reduce((total, item) => total + item.quantity, 0);
    },
  },
  methods: {
    async fetchProducts() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          this.error = "Anda belum login. Silakan login untuk melihat produk.";
          return;
        }

        const response = await axios.get(
          "http://127.0.0.1:8000/api/products-all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        this.products = response.data.data || [];
      } catch (err) {
        this.error =
          err.response?.data?.message || "Gagal memuat daftar produk.";
      } finally {
        this.loading = false;
      }
    },

    async searchProducts() {
      try {
        if (!this.searchQuery) {
          this.fetchProducts();
          return;
        }

        const token = localStorage.getItem("token");
        const response = await axios.post(
          "http://127.0.0.1:8000/api/search-products",
          { nama_produk: this.searchQuery },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        this.products = response.data.data || [];
      } catch (err) {
        this.error =
          err.response?.data?.message || "Produk tidak ditemukan.";
        this.products = [];
      } finally {
        this.loading = false;
      }
    },

    goToProductDetail(produk_id) {
      this.$router.push(`/product-detail-customer/${produk_id}`);
    },
  },
  mounted() {
    this.fetchProducts();
    const observerImg = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate__animated", "animate__fadeInRight");
        }
      });
    },
    {
      threshold: 0.5, // Elemen terlihat minimal 10% untuk memicu animasi
    }
  );
    const observerText = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate__animated", "animate__fadeInLeft");
        }
      });
    },
    {
      threshold: 0.5, // Elemen terlihat minimal 10% untuk memicu animasi
    }
  );
    const observerBrand = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate__animated", "animate__slideInUp");
        }
      });
    },
    {
      threshold: 0.5, // Elemen terlihat minimal 10% untuk memicu animasi
    }
  );

  const textCashback = document.querySelector("#text-cashback");
  const imgCashback = document.querySelector("#img");
  const brandSection = document.querySelector("#brand-section");

  observerText.observe(textCashback);
  observerImg.observe(imgCashback);
  observerBrand.observe(brandSection);
  },
};
</script>

<style>
.home-view {
  font-family: "Nunito";
}

.cashback-section {
  background: url(/public/img/bg_linear.png);
  height: 400px;
  width: 100%;
}

.brand-section {
  background: url(/public/img/bg_linear1.png);
  height: 400px;
  width: 100%;
}

.frame-section {
  background: url(/public/img/frame/frame4.png);
  height: 300px;
  width: 100%;
}

.img {
  width: 300px;
}

.img-frame {
  width: 100%;
}

.img-payment{
  width: 80%;
}

@media (max-width: 768px) {
  .img {
    width: 200px;
  }
  .img-payment{
    width: 60%;
  }
  .frame-section {
    margin-top: 70px;
  }
}

@media (max-width: 767px){
  .img-payment{
    width: 100%;
  }
  .contact{
    font-size: 12px;
  }
}

@media (max-width: 576px) {
  .img {
    width: 200px;
  }
  .img-payment{
    width: 60%;
  }
  .contact{
    font-size: 12px;
  }
  .frame-section {
    margin-top: 70px;
  }
}
.text-second {
  color: #7ABC18;
}

.text-cashback {
  background-color: #7ABC18;
  color: white;
  padding-right: 3px;
  padding-left: 3px;
}

.text-second:hover {
  color: #6ba515;
}

#text-cashback, #img {
  opacity: 0;
}

#brand-section{
  opacity: 0;
}

.animate__animated {
  opacity: 1 !important;
}

</style>
