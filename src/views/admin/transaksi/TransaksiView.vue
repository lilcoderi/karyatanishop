<template>
  <div class="container">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4>Transaction List</h4>
    </div>

    <div class="card shadow mb-4">
      <div class="card-header py-3">
        <h6 class="table-order m-0 font-weight-bold text-success">
          Table Transactions
        </h6>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped table-bordered">
      <thead class="bg-success text-white">
        <tr>
          <th scope="col">Transaction ID</th>
          <th scope="col">Order ID</th>
          <th scope="col">Total Payment</th>
          <th scope="col">Midtrans ID</th>
          <th scope="col">Payment Status</th>
          <th scope="col">Order Date</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="transaction in transactions.data" :key="transaction.transaksi_id">
          <td>{{ formatShortId(transaction.transaksi_id) }}</td>
          <td>{{ formatShortId(transaction.order_id) }}</td>
          <td>{{ formatCurrency(transaction.total_pembayaran) }}</td>
          <td>{{ transaction.midtrans_id || "N/A" }}</td>
          <td>
            <span :class="statusClass(transaction.status_pembayaran)">
              {{ formatStatus(transaction.status_pembayaran) }}
            </span>
          </td>
          <td>{{ transaction.order?.tgl_order || "N/A" }}</td>
          <td>
            <button class="btn btn-info btn-sm mr-1" @click="viewTransaction(transaction.transaksi_id)">
              <i class="bi bi-eye-fill"></i>
            </button>
            <button class="btn btn-primary btn-sm mr-1" @click="editTransaction(transaction.transaksi_id)">
              <i class="bi bi-pencil-fill"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <nav class="mt-3">
    <ul class="pagination justify-content-center">
      <li class="page-item" :class="{ disabled: !transactions.prev_page_url }">
        <button class="page-link" @click="changePage(transactions.current_page - 1)" :disabled="!transactions.prev_page_url">
          Previous
        </button>
      </li>
      <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: page === transactions.current_page }">
        <button class="page-link" @click="changePage(page)">
          {{ page }}
        </button>
      </li>
      <li class="page-item" :class="{ disabled: !transactions.next_page_url }">
        <button class="page-link" @click="changePage(transactions.current_page + 1)" :disabled="!transactions.next_page_url">
          Next
        </button>
      </li>
    </ul>
  </nav>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "TransaksiView",
  data() {
    return {
      transactions: {}, 
    };
  },
  methods: {
    async fetchTransactions(page = 1) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("You are not authenticated. Please log in.");
          this.$router.push("/login");
          return;
        }

        const response = await axios.get(`http://127.0.0.1:8000/api/transactions?page=${page}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.status === "success") {
          this.transactions = response.data.data;
        } else {
          alert("Failed to fetch transactions.");
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        if (error.response && error.response.status === 401) {
          alert("Your session has expired. Please log in again.");
          this.$router.push("/login");
        } else {
          alert("An error occurred while fetching transactions.");
        }
      }
    },
    changePage(page) {
      this.fetchTransactions(page);
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(amount);
    },
    formatStatus(status) {
      const statusMap = {
        pending: "Pending",
        selesai: "Completed",
        batal: "Cancelled",
      };
      return statusMap[status] || "Unknown";
    },
    formatShortId(id) {
      return id ? `${id.slice(0, 8)}...` : "-";
    },
    statusClass(status) {
      switch (status) {
        case "pending":
          return "text-warning";
        case "selesai":
          return "text-success";
        case "batal":
          return "text-danger";
        default:
          return "";
      }
    },
    viewTransaction(transactionId) {
      this.$router.push(`/transaksi-detail/${transactionId}`);
    },
    editTransaction(transactionId) {
      this.$router.push(`/transaksi-edit/${transactionId}`);
    },
  },
  computed: {
    totalPages() {
      return this.transactions.last_page || 0;
    },
  },
  created() {
    this.fetchTransactions();
  },
};
</script>

<style scoped>
@import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
.table {
  width: 100%;
  margin-top: 20px;
}
.text-success {
  color: green;
}

.text-warning {
  color: orange;
}

.text-danger {
  color: red;
}
</style>
