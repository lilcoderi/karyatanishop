<template>
  <div class="container-fluid mt-5">
    <div id="featured-box" class="container">
      <div class="row row-cols-md-6 justify-content-center">
        <div class="feature-box ml-3 mb-3 col">
          <img src="/img/onlineOrder.png" />
          <h6>Online Order</h6>
          <p></p>
        </div>
        <div class="feature-box ml-3 mb-3 col">
          <img src="/img/saveMoney.png" />
          <h6>Save Money</h6>
          <p></p>
        </div>
        <div class="feature-box ml-3 mb-3 col">
          <img src="/img/fastDelivery.png" />
          <h6>Fash Delivery</h6>
          <p></p>
        </div>
        <div class="feature-box ml-3 mb-3 col">
          <img src="/img/happySell.png" />
          <h6>Happy Sell</h6>
          <p></p>
        </div>
        <div class="feature-box ml-3 mb-3 col">
          <img src="/img/promotions.png" />
          <h6>Promotions</h6>
          <p></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FeatureBox",
  mounted() {
    const FeatureBox = document.getElementById("featured-box");

    const observer = new IntersectionObserver(
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

    observer.observe(FeatureBox);
  },
  methods: {
    startAnimation() {
      // Logika untuk memulai animasi
      if (!this.animationInterval) {
        this.animationInterval = setInterval(this.cycleText, 3000);
      }
    },
    stopAnimation() {
      // Logika untuk menghentikan animasi
      if (this.animationInterval) {
        clearInterval(this.animationInterval);
        this.animationInterval = null;
      }
    },
  },
  data() {
    return {
      animationInterval: null, // Simpan ID interval animasi
    };
  },

};
</script>

<style scoped>
.container {
  font-family: "Nunito";
}

.feature-box {
  text-align: center;
  padding: 30px;
  border: 1px solid #eaeaea;
  border-radius: 5px;
  transition: transform 0.3s ease;
}

.feature-box:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.feature-box img {
  width: 100px;
  margin-bottom: 15px;
}

.feature-box h6 {
  font-weight: bold;
  margin-top: 10px;
  padding: 5px;
  color: #ffffff;
  background-color: #7ABC18;
}

.feature-box p {
  color: #777;
  font-size: 14px;
}

#featured-box{
  opacity: 0;
}

.animate__animated {
  opacity: 1 !important;
}
</style>