<template>
  <div class="container-fluid hero-section">
    <div class="container">
      <div class="row align-items-center text-md-left">
        <!-- Left Content -->
        <div class="col-lg-6 hero-content animate__animated animate__backInLeft">
          <h6 class="font-weight-bold">Exclusive Deals</h6>
          <h1>
            <span>Top Products Deals</span> <br />
            <span class="highlight changing-text">{{ currentText }}</span>
          </h1>
          <p>Grow Your Garden with the Best Essentials</p>
          <router-link to="/shop-view" class="btn btn-shop mt-2 mb-5 w3-container w3-animate-top">Shop Now</router-link>
        </div>
        <!-- Right Image -->
        <div class="col-lg-6 d-none d-lg-block hero-image animate__animated animate__backInRight">
          <img src="/img/shop.png" alt="Farm Supplies" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HeroSection",
  data() {
    return {
      textOptions: ["In Farm Supplies", "For Your Garden", "With Exclusive Offers"],
      currentIndex: 0,
    };
  },
  computed: {
    currentText() {
      return this.textOptions[this.currentIndex];
    },
  },
  methods: {
  cycleText() {
    // Hilangkan teks sebelumnya dengan animasi
    const highlightElement = this.$el.querySelector(".highlight");
    highlightElement.classList.remove("fade-in"); // Hapus animasi sebelumnya
    highlightElement.style.opacity = 0; // Hilangkan teks dengan efek

    // Tunggu hingga animasi selesai sebelum mengganti teks
    setTimeout(() => {
      this.currentIndex = (this.currentIndex + 1) % this.textOptions.length;
      highlightElement.classList.add("fade-in"); // Tambahkan efek masuk
      highlightElement.style.opacity = 1; // Tampilkan teks baru
    }, 500); // Durasi sama dengan CSS transition
  },
},

  mounted() {
    setInterval(this.cycleText, 3000); // Change text every 3 seconds
  },
};
</script>

<style scoped>
.hero-section {
  background-color: #ffffff;
  padding: 50px 0;
  font-family: "Nunito";
}
.hero-content h1 {
  font-weight: bold;
}
.hero-content .highlight {
  color: #f39c12;
  font-size: larger;
  font-family: "Nunito";
  transition: opacity 0.5s ease, transform 0.5s ease;
  transform: scale(1.1); /* Sedikit perbesaran */
  opacity: 0; /* Atur nilai awal */
}
.hero-content .highlight.fade-in {
  transform: scale(1); /* Kembali ke ukuran normal */
  opacity: 1;
}

.hero-content p {
  color: #777;
}
.hero-image img {
  max-width: 100%;
}
.btn-shop {
  background-color: #7ABC18;
  color: #fff;
  font-weight: bold;
  padding: 10px 20px;
  border-radius: 50px;
  text-decoration: none;
}
.btn-shop:hover {
  background-color: #6ca516;
  color: #fff;
}
</style>
