<template>
  <NavbarView :cartItemCount="cartItemCount" />
  <div class="container mt-4">
    <h2>Edit Review</h2>

    <!-- Tampilkan loading atau error jika data belum tersedia -->
    <div v-if="loading" class="text-center">Loading...</div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <!-- Formulir edit review -->
    <form v-if="review" @submit.prevent="updateReview">
      <div class="form-group mb-3">
        <label for="content">Review Content</label>
        <textarea
          id="content"
          v-model="form.content"
          class="form-control"
          rows="5"
          required
        ></textarea>
      </div>

      <div class="form-group mb-3">
        <label>Rating</label>
        <div class="rating-container">
          <span 
            v-for="star in 5" 
            :key="star" 
            class="star" 
            :class="{ active: form.rating >= star }" 
            @click="form.rating = star"
          >
            ★
          </span>
        </div>
      </div>

      <button type="submit" class="btn btn-primary">Update Review</button>
    </form>
  </div>
</template>

<script>
import NavbarView from "@/components/NavbarView.vue";
import axios from "axios";

export default {
  name: "EditReview",
  data() {
    return {
      loading: true,
      error: null,
      review: null,
      form: {
        content: "",
        rating: 0, // Default rating
      },
    };
  },
  components: {
    NavbarView,
  },
  methods: {
    async fetchReview() {
      try {
        this.loading = true;
        this.error = null;

        const orderId = this.$route.query.order_id;
        if (!orderId) throw new Error("Order ID tidak ditemukan atau tidak valid.");

        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://127.0.0.1:8000/api/review/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.data || !response.data.id_review) {
          throw new Error("Data review tidak valid atau tidak ditemukan.");
        }

        this.review = response.data;
        this.form.content = this.review.content;
        this.form.rating = this.review.rating;
      } catch (err) {
        console.error("Error saat memuat review:", err);
        this.error = err.response?.data?.message || "Gagal memuat data review.";
      } finally {
        this.loading = false;
      }
    },
    async updateReview() {
      try {
        this.loading = true;
        this.error = null;

        const orderId = this.$route.query.order_id;
        if (!orderId) throw new Error("Order ID tidak ditemukan atau tidak valid.");

        const token = localStorage.getItem("token");
        await axios.put(
          `http://127.0.0.1:8000/api/reviews/${orderId}`,
          this.form,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        alert("Review berhasil diperbarui");
        this.$router.push("/order-menu");
      } catch (err) {
        console.error("Error saat memperbarui review:", err);
        this.error = err.response?.data?.message || "Gagal memperbarui review.";
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.fetchReview();
  },
};
</script>

<style>

.rating-container {
  display: flex;
  justify-content: center; /* Menempatkan bintang di tengah secara horizontal */
  align-items: center;    /* Menempatkan bintang di tengah secara vertikal */
  gap: 8px;
  font-size: 24px;
  cursor: pointer;
}

.star {
  color: #ccc;
  transition: color 0.3s;
}

.star.active {
  color: gold;
}

.star:hover {
  color: orange;
}
</style>
