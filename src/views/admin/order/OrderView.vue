<template>
  <div class="container">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4>Order List</h4>
    </div>
    <div class="card shadow mb-4">
      <div class="card-header py-3 d-flex justify-content-between align-items-center">
        <h6 class="table-order m-0 font-weight-bold text-success">
          Table Order
        </h6>
        <!-- Input dan tombol untuk pencarian -->
        <div class="input-group" style="max-width: 400px;">
          <input
            type="text"
            class="form-control"
            v-model="searchQuery"
            placeholder="Search by Order ID"
          />
          <button class="btn btn-success" @click="searchOrders">
            Search
          </button>
        </div>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped table-bordered">
            <thead class="bg-success text-white">
              <tr>
                <th>Order ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Products</th>
                <th>Qty</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders" :key="order.order_id">
                <td class="text-truncate" style="max-width: 150px">
                  {{ order.order_id }}
                </td>
                <td class="text-truncate" style="max-width: 150px">
                  {{ order.user ? order.user.nama : "Nama tidak ditemukan" }}
                </td>
                <td class="text-truncate" style="max-width: 150px">
                  {{
                    order.user && order.user.email
                      ? order.user.email
                      : "Email tidak ditemukan"
                  }}
                </td>
                <td style="max-width: 150px">
                  <span
                    v-for="(item, index) in order.produk_items"
                    :key="item.produk_item_id"
                  >
                    {{ String.fromCharCode(97 + index) }}.
                    {{ item.produk?.nama_produk || "Produk tidak ditemukan" }}
                    <br />
                  </span>
                </td>
                <td style="max-width: 150px">
                  <span
                    v-for="(item, index) in order.produk_items"
                    :key="item.produk_item_id"
                  >
                    {{ String.fromCharCode(97 + index) }}. {{ item.kuantitas }}
                    <br />
                  </span>
                </td>
                <td class="text-truncate" style="max-width: 150px">
                  {{ formatDate(order.tgl_order) }}
                </td>
                <td class="text-truncate" style="max-width: 150px">
                  <span
                    :class="statusClass(order.status_order)"
                    class="text-capitalize"
                  >
                    {{ order.status_order }}
                  </span>
                </td>
                <td>
                  <button
                    class="btn btn-info btn-sm mr-1"
                    @click="viewOrder(order.order_id)"
                  >
                    <i class="bi bi-eye-fill"></i>
                  </button>
                  <button
                    class="btn btn-warning btn-sm mr-1"
                    @click="editOrder(order.order_id)"
                  >
                    <i class="bi bi-pencil-fill"></i>
                  </button>
                  <button
                    class="btn btn-danger btn-sm mr-1"
                    @click="deleteOrder(order.order_id)"
                  >
                    <i class="bi bi-trash-fill"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="pagination-controls btn-group">
          <button
            class="btn btn-success btn-sm"
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
          >
            Previous
          </button>
          <button
            v-for="page in lastPage"
            :key="page"
            class="btn"
            :class="{
              'btn-success btn-sm': currentPage === page,
              'btn-outline-success btn-sm': currentPage !== page,
            }"
            @click="changePage(page)"
          >
            {{ page }}
          </button>
          <button
            class="btn btn-success btn-sm"
            :disabled="currentPage === lastPage"
            @click="changePage(currentPage + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios";

export default {
  name: "OrderView",
  data() {
    return {
      orders: [],
      currentPage: 1,
      lastPage: 1,
      searchQuery: "",
    };
  },
  methods: {
    async fetchOrders(page = 1) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("You are not authenticated. Please log in.");
          this.$router.push("/login");
          return;
        }

        const response = await axios.get(
          `http://127.0.0.1:8000/api/orders?page=${page}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.status === "success") {
          const { data } = response.data;
          this.orders = data.data;
          this.currentPage = data.current_page;
          this.lastPage = data.last_page;
        } else {
          alert("Failed to fetch orders");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        if (error.response && error.response.status === 401) {
          alert("Your session has expired. Please log in again.");
          this.$router.push("/login");
        } else {
          alert("An error occurred while fetching orders.");
        }
      }
    },
    async searchOrders() {
      if (!this.searchQuery) {
        alert("Please enter an Order ID.");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("You are not authenticated. Please log in.");
          this.$router.push("/login");
          return;
        }

        const searchData = {
          order_id: this.searchQuery,
        };

        const response = await axios.post(
          `http://127.0.0.1:8000/api/orders-search`,
          searchData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.status === "success") {
          this.orders = [response.data.data];
        } else {
          alert("No orders found for the given Order ID.");
        }
      } catch (error) {
        console.error("Error searching orders:", error);
        if (error.response) {
          alert(
            `Error: ${error.response.status} - ${
              error.response.data.message || "An error occurred"
            }`
          );
        } else {
          alert("An error occurred while searching orders.");
        }
      }
    },

    changePage(page) {
      if (page >= 1 && page <= this.lastPage) {
        this.fetchOrders(page);
      }
    },
    formatDate(date) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(date).toLocaleDateString(undefined, options);
    },
    viewOrder(orderId) {
      this.$router.push(`/detail-order/${orderId}`);
    },
    editOrder(orderId) {
      this.$router.push(`/admin/edit-order/${orderId}`);
    },
    async deleteOrder(orderId) {
      const confirmDelete = confirm(
        `Are you sure you want to delete order #${orderId}?`
      );
      if (!confirmDelete) return;

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("You are not authenticated. Please log in.");
          this.$router.push("/login");
          return;
        }

        const response = await axios.delete(
          `http://127.0.0.1:8000/api/orders/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.status === "success") {
          alert(`Order #${orderId} deleted successfully!`);
          this.orders = this.orders.filter(
            (order) => order.order_id !== orderId
          );
        } else {
          alert(`Failed to delete order #${orderId}: ${response.data.message}`);
        }
      } catch (error) {
        console.error("Error deleting order:", error);
        if (error.response && error.response.status === 401) {
          alert("Your session has expired. Please log in again.");
          this.$router.push("/login");
        } else {
          alert("An error occurred while deleting the order.");
        }
      }
    },
    statusClass(status) {
      switch (status.toLowerCase()) {
        case "pending":
          return "text-warning";
        case "completed":
        case "selesai":
          return "text-success";
        case "cancelled":
        case "dibatalkan":
          return "text-danger";
        default:
          return "";
      }
    },
  },
  created() {
    this.fetchOrders();
  },
};
</script>

<style scoped>
.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
