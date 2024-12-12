<template>
  <div class="container">
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
      <h4 class="mb-0 text-gray-800">Dashboard | {{ dynamicTitle }}</h4>
      <router-link to="/report-all">
        <a href="#" class="d-none d-sm-inline-block btn btn-sm btn-success shadow-sm"><i
            class="fas fa-download fa-sm text-white-50"></i> Generate Report</a>
      </router-link>
    </div>

    <!-- Content Row -->
    <div class="row">
      <!-- Earnings (Monthly) Card Example -->
      <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-left-warning shadow h-100 py-2">
          <div class="card-body">
            <div v-if="loading">
              <p class="text-center"></p>
            </div>
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                  Total Online Income
                </div>
                <div class="h5 mb-0 font-weight-bold text-gray-800">
                  {{ formatCurrency(onlineIncome) }}
                </div>
              </div>
              <div class="col-auto">
                <i class="fas fa-calendar fa-2x text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Earnings (Monthly) Card Example -->
      <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-left-success shadow h-100 py-2">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                  Total Offline Income
                </div>
                <div class="h5 mb-0 font-weight-bold text-gray-800">
                  {{ formatCurrency(offlineIncome) }}
                </div>
              </div>
              <div class="col-auto">
                <i class="fas fa-dollar-sign fa-2x text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Row -->

    <div class="row">
      <!-- Bagian untuk menampilkan chart -->
      <div class="col-xl-8 col-lg-7">
        <div class="card shadow mb-4">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Online Sales vs Offline Sales</h6>
          </div>
          <div class="card-body">
            <div class="chart-area">
              <canvas id="salesChart" style="max-width: 300px; margin: 0 auto;"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card shadow mb-4">
      <div class="card-header py-3">
        <h6 class="table-order m-0 font-weight-bold text-success">
          Table Order
        </h6>
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
import { Chart, registerables } from "chart.js";
import axios from "axios";

Chart.register(...registerables);

export default {
  name: "DashboardAdmin",
  data() {
    return {
      dynamicTitle: "", 
      offlineSales: 0,
      onlineSales: 0,
      offlineIncome: 0,
      onlineIncome: 0,
      loading: true,
      error: null,
      orders: [],
      currentPage: 1,
      lastPage: 1,
    };
  },
  methods: {
    getFormattedDate() {
      const today = new Date();
      const options = { year: "numeric", month: "long", day: "numeric" };
      return today.toLocaleDateString("en-US", options);
    },
    async fetchData() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          this.error = "Token not found. Please log in.";
          this.loading = false;
          return;
        }

        const offlineResponse = await axios.get(
          "http://127.0.0.1:8000/api/report-offline",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        this.offlineSales = offlineResponse.data.report.total_sales;
        this.offlineIncome = offlineResponse.data.report.total_payment;

        const onlineResponse = await axios.get(
          "http://127.0.0.1:8000/api/report",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        this.onlineSales = onlineResponse.data.report.total_sales;
        this.onlineIncome = onlineResponse.data.report.total_payment;

        this.loading = false;

        this.$nextTick(() => {
          this.renderChart();
        });
      } catch (err) {
        console.error("Error fetching data:", err);
        this.error = "Failed to fetch data. Please try again later.";
        this.loading = false;
      }
    },

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

    renderChart() {
      const canvas = document.getElementById("salesChart");
      if (!canvas) {
        console.error("Canvas element not found");
        return;
      }

      const ctx = canvas.getContext("2d");
      new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Offline Sales", "Online Sales"],
          datasets: [
            {
              label: "Sales Distribution",
              data: [this.offlineSales, this.onlineSales],
              backgroundColor: ["#4caf50", "#f6c23e"],
              hoverBackgroundColor: ["#45a049", "#e0b138"],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: "bottom",
            },
          },
        },
      });
    },

    formatCurrency(value) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(value);
    },

  },
  mounted() {
    this.dynamicTitle = `Sales on ${this.getFormattedDate()}`;
    this.fetchData();
    this.fetchOrders();
  },
};
</script>

<style scoped>
@import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";

.table-order {
  text-align: left;
}
</style>
