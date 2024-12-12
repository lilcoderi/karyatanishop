<template>
  <div class="transaction-edit">
    <h1 class="mb-4">Edit Transaction</h1>
    <form @submit.prevent="updateTransaction">
      <div class="form-group">
        <label for="payment-status">Payment Status</label>
        <select 
          id="payment-status" 
          v-model="paymentStatus" 
          class="form-control"
        >
          <option value="pending">Pending</option>
          <option value="selesai">Completed</option>
          <option value="batal">Cancelled</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary mt-3">Update</button>
      <button type="button" class="btn btn-secondary mt-3 ml-2" @click="cancelEdit">Cancel</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "TransaksiEdit",
  data() {
    return {
      paymentStatus: "pending", 
      message: null, 
      messageClass: "", 
    };
  },
  mounted() {
    const transactionId = this.$route.params.id;
    this.fetchTransactionData(transactionId); 
  },
  methods: {
    async fetchTransactionData(transactionId) {
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
          this.paymentStatus = response.data.data.status_pembayaran;
        } else {
          throw new Error("Failed to fetch transaction data.");
        }
      } catch (error) {
        console.error("Error fetching transaction data:", error);
        this.message = error.response?.data?.message || "An error occurred while fetching transaction data.";
        this.messageClass = "error";
      }
    },
    async updateTransaction() {
      const token = localStorage.getItem("token"); 
      const transactionId = this.$route.params.id; 

      if (!token) {
        this.message = "You are not authenticated. Please log in.";
        this.messageClass = "error";
        this.$router.push("/login");
        return;
      }

      try {
        const response = await axios.put(
          `http://127.0.0.1:8000/api/transactions/${transactionId}`,
          { status_pembayaran: this.paymentStatus },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.status === "success") {
          this.message = "Transaction updated successfully!";
          this.messageClass = "success";
          this.$router.push("/transaksi-view"); 
        } else {
          throw new Error(response.data.message || "Failed to update transaction.");
        }
      } catch (error) {
        console.error("Error updating transaction:", error);
        this.message = error.response?.data?.message || "An error occurred while updating the transaction.";
        this.messageClass = "error";
      }
    },
    cancelEdit() {
      this.$router.push("/transaksi-view");
    },
  },
};
</script>


<style scoped>
.transaction-edit {
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

button {
  min-width: 100px;
}
</style>
