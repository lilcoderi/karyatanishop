<template>
  <div class="transaction-detail">
    <h1>Transaction Detail</h1>
    <div v-if="transactionData">
      <p><strong>Transaksi ID:</strong> {{ transactionData.transaksi_id }}</p>
      <p><strong>Order ID:</strong> {{ transactionData.order_id }}</p>
      <p><strong>Total Pembayaran:</strong> Rp {{ transactionData.total_pembayaran }}</p>
      <p><strong>Midtrans ID:</strong> {{ transactionData.midtrans_id || "N/A" }}</p>
      <p><strong>Status Pembayaran:</strong> {{ transactionData.status_pembayaran }}</p>
      <p><strong>Created At:</strong> {{ formatDate(transactionData.created_at) }}</p>
      <p><strong>Updated At:</strong> {{ formatDate(transactionData.updated_at) }}</p>
    </div>
    <div v-else>
      <p>Loading transaction details...</p>
    </div>
    <div v-if="message" :class="messageClass">
      <p>{{ message }}</p>
    </div>

    <div class="button-group">
      <button type="button" class="btn btn-secondary" @click="goBack">Back</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "TransaksiDetail",
  data() {
    return {
      transactionData: null, 
      message: null, 
      messageClass: "", 
    };
  },
  mounted() {
    const transactionId = this.$route.params.id; 
    this.fetchTransactionDetails(transactionId); 
  },
  methods: {
    async fetchTransactionDetails(transactionId) {
      const token = localStorage.getItem("token"); 

      if (!token) {
        this.message = "You are not authenticated. Please log in.";
        this.messageClass = "error";
        this.$router.push("/login");
        return;
      }

      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/transactions/${transactionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.status === "success") {
          this.transactionData = response.data.data; 
        } else {
          throw new Error("Failed to fetch transaction details.");
        }
      } catch (error) {
        console.error("Error fetching transaction details:", error);
        this.message =
          error.response?.data?.message ||
          "An error occurred while fetching transaction details.";
        this.messageClass = "error";
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    },

    goBack() {
      this.$router.push("/transaksi-view");
    },
  },
};
</script>

<style scoped>
.transaction-detail {
  font-family: Arial, sans-serif;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.transaction-detail p {
  margin: 10px 0;
  font-size: 16px;
}

.error {
  color: red;
}

.success {
  color: green;
}

.button-group {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}
</style>
