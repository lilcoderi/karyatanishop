<template>
  <div class="container mt-5">
    <h1 class="text-center mb-4">Offline Sales Report</h1>
    
    <!-- Back Button -->
    <button @click="goBack" class="btn btn-secondary mb-3">Back</button>

    <div class="card">
      <div class="card-body">
        <template v-if="loading">
          <p class="text-center">Loading...</p>
        </template>
        <template v-else-if="error">
          <p class="text-danger text-center">{{ error }}</p>
        </template>
        <template v-else>
          <h5 class="card-title">Report Details</h5>
          <ul class="list-group">
            <li class="list-group-item">
              <strong>Report ID:</strong> {{ report.id }}
            </li>
            <li class="list-group-item">
              <strong>Total Sales:</strong> {{ report.total_sales }}
            </li>
            <li class="list-group-item">
              <strong>Total Payment:</strong> {{ formatCurrency(report.total_payment) }}
            </li>
            <li class="list-group-item">
              <strong>Date:</strong> {{ formatDate(report.created_at) }}
            </li>
          </ul>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ReportOffline",
  data() {
    return {
      report: null,
      loading: true,
      error: null,
    };
  },
  methods: {
    async fetchReport() {
      try {
        const token = localStorage.getItem("token"); 
        const response = await axios.get("http://127.0.0.1:8000/api/report-offline/", {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        this.report = response.data.report;
        this.loading = false;
      } catch (err) {
        this.error = "Failed to fetch the report. Please try again later.";
        this.loading = false;
      }
    },
    formatCurrency(amount) {
      return parseFloat(amount).toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 2,
      });
    },
    formatDate(date) {
      return new Date(date).toLocaleString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },

    goBack() {
      this.$router.push("/report-view");
    },
  },
  mounted() {
    this.fetchReport();
  },
};
</script>

<style scoped>
.container {
  max-width: 600px;
}
.card {
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.card-title {
  margin-bottom: 20px;
  font-size: 1.5rem;
}
.list-group-item {
  font-size: 1rem;
}
.text-center {
  text-align: center;
}
</style>
