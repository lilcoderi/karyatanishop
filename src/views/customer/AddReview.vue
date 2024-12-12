<template>
  <NavbarView :cartItemCount="cartItemCount" />
  <div class="container mt-4">
    <!-- Header -->
    <div class="text-center mb-4">
      <h2 class="fw-bold text-success">Review Produk</h2>
      <p class="text-muted">Bagikan pengalaman Anda dengan produk ini</p>
    </div>

    <!-- Formulir Review -->
    <div class="card shadow border-0">
      <div class="card-body p-4">
        <form @submit.prevent="submitReview">
          <!-- Produk ID -->
          <div class="mb-3">
            <label for="produk_id" class="form-label fw-semibold">Produk ID</label>
            <input
              type="text"
              id="produk_id"
              v-model="produk_id"
              class="form-control bg-light"
              readonly
            />
          </div>

          <!-- Konten Review -->
          <div class="mb-3">
            <label for="content" class="form-label fw-semibold">Konten</label>
            <textarea
              id="content"
              v-model="content"
              class="form-control"
              rows="4"
              placeholder="Ceritakan pengalaman Anda..."
              required
            ></textarea>
          </div>

          <!-- Rating -->
          <div class="mb-3">
            <label for="rating" class="form-label fw-semibold">Rating</label>
            <div class="star-rating d-flex align-items-center">
              <span
                v-for="n in 5"
                :key="n"
                :class="['star', { 'filled text-warning': n <= rating }, 'fs-3']"
                @click="setRating(n)"
                style="cursor: pointer;"
              >
                ★
              </span>
              <span class="ms-2 text-muted">{{ rating }} / 5</span>
            </div>
          </div>

          <!-- Tombol Kirim -->
          <button type="submit" class="btn btn-success w-100 fw-semibold">
            Kirim Review
          </button>
        </form>

        <!-- Pesan Error -->
        <div v-if="error" class="alert alert-danger mt-3 text-center">
          {{ error }}
        </div>

        <!-- Pesan Sukses -->
        <div v-if="success" class="alert alert-success mt-3 text-center">
          {{ success }}
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import NavbarView from "@/components/NavbarView.vue";
import axios from "axios";

export default {
  data() {
    return {
      produk_id: this.$route.params.produkId, // Mengambil produk_id dari route params
      content: "",  // Konten review
      rating: 0,    // Rating review (1-5)
      error: null,  // Pesan error
      success: null, // Pesan sukses
    };
  },
  components:{
    NavbarView
  },
  methods: {
    // Mengubah rating saat bintang diklik
    setRating(rating) {
      this.rating = rating;
    },
    async submitReview() {
      // Validasi input sebelum mengirim review
      if (this.rating === 0) {
        this.error = "Rating harus dipilih.";
        return;
      }
      if (this.content.trim() === "") {
        this.error = "Konten review tidak boleh kosong.";
        return;
      }

      try {
        const token = localStorage.getItem("token"); // Ambil token dari localStorage
        if (!token) {
          this.error = "Anda harus login terlebih dahulu.";
          return;
        }

        // Mengirimkan review ke API
        const response = await axios.post(
          "http://127.0.0.1:8000/api/reviews",
          {
            produk_id: this.produk_id,
            content: this.content,
            rating: this.rating,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Menampilkan pesan sukses
        this.success = response.data.message;
        this.error = null;

        // Reset form setelah pengiriman
        this.content = "";
        this.rating = 0;
      } catch (err) {
        console.error(err);
        this.error = err.response?.data?.message || "Terjadi kesalahan saat mengirim review.";
        this.success = null;
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 600px;
  font-family: "Nunito";
}

h2 {
  text-align: center;
}

form {
  margin-top: 20px;
}

button {
  width: 100%;
}

.star-rating .star {
  font-size: 2rem;
  color: #d3d3d3; /* Warna default bintang (abu-abu) */
  transition: color 0.2s ease-in-out;
}

.star-rating .star.filled {
  color: #ffc107; /* Warna bintang terisi (emas) */
}

textarea {
  resize: none;
}

.card {
  border-radius: 15px;
}

.btn {
  border-radius: 25px;
}

</style>
