<template>
  <div class="edit-order">
    <h2>Edit Order</h2>
    <form @submit.prevent="updateOrderStatus">
      <div class="form-group">
        <label for="order-status" class="label-status">Order Status</label>
        <select 
          id="order-status" 
          v-model="orderStatus" 
          class="form-control"
        >
          <option value="pending">Pending</option>
          <option value="proses">Process</option>
          <option value="selesai">Completed</option>
          <option value="batal">Cancelled</option>
        </select>
      </div>
      <div class="button-group">
        <button type="submit" class="btn btn-primary">Update Status</button>
        <button type="button" class="btn btn-secondary" @click="goBack">Back</button>
      </div>
    </form>

    <div v-if="message" :class="messageClass" class="message">
      {{ message }}
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "EditOrder",
  data() {
    return {
      orderStatus: "pending", 
      message: null, 
      messageClass: "", 
    };
  },
  methods: {
    async fetchOrderData(orderId) {
      const token = localStorage.getItem("token"); 

      if (!token) {
        this.message = "You are not authenticated. Please log in.";
        this.messageClass = "error";
        this.$router.push("/login");
        return;
      }

      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.status === "success") {
          this.orderStatus = response.data.data.status_order;
        } else {
          throw new Error("Failed to fetch order data.");
        }
      } catch (error) {
        console.error("Error fetching order data:", error);
        this.message = error.response?.data?.message || "An error occurred while fetching order data.";
        this.messageClass = "error";
      }
    },

    async updateOrderStatus() {
  const token = localStorage.getItem("token");
  const orderId = this.$route.params.id;

  if (!token) {
    this.message = "Unauthorized. Please login.";
    this.messageClass = "error";
    return;
  }

  console.log("Sending token:", token); // Tambahkan log untuk memeriksa token

  try {
    const response = await axios.put(
      `http://127.0.0.1:8000/api/orders/${orderId}`,
      { status_order: this.orderStatus },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.status === "success") {
      this.message = "Order status updated successfully!";
      this.messageClass = "success";
    } else {
      throw new Error(response.data.message || "Failed to update status.");
    }
  } catch (error) {
    console.error("Error:", error);

    // Cek apakah ada response error dari server
    if (error.response) {
      console.log("Error response:", error.response); // Tambahkan log untuk mengecek respons
      this.message = error.response?.data?.message || "Unauthorized or Invalid request.";
    } else {
      this.message = "Network or server error.";
    }
    
    this.messageClass = "error";
  }
},


    goBack() {
      this.$router.push("/order-view");
    },
  },
  async mounted() {
    const orderId = this.$route.params.id; 
    await this.fetchOrderData(orderId); 
  },
};
</script>

<style scoped>
.edit-order {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.label-status {
  font-weight: bold;
}

select {
  width: 160px;
  padding: 8px;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid #ccc;
  appearance: none;
  cursor: pointer;
}

.button-group {
  display: flex;
  justify-content: center; 
  gap: 10px;
  margin-top: 15px;
}

button {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

button:hover {
  opacity: 0.9;
}

.message {
  margin-top: 20px;
  padding: 10px;
  border-radius: 4px;
  font-size: 14px;
}

.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>
