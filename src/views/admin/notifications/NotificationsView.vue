<template>
  <div class="notifications-view">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4>Notifications List</h4>
      <router-link to="/notif-add" class="btn btn-sm btn-success shadow-sm">
        <i class="fas fa-plus fa-sm text-white-50"></i> Add Notifications
      </router-link>
    </div>

    <div class="card shadow mb-4">
      <div class="card-header py-3">
        <h6 class="table-order m-0 font-weight-bold text-success">Table Notifikasi</h6>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped table-bordered">
            <thead class="bg-success text-white">
              <tr>
                <th scope="col">Notification ID</th>
                <th scope="col">User ID</th>
                <th scope="col">Message</th>
                <th scope="col">Status</th>
                <th scope="col">Created At</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="notification in notifications.data" :key="notification.notification_id">
                <td>{{ formatShortId(notification.notification_id) }}</td>
                <td>{{ formatShortId(notification.user_id) }}</td>
                <td>{{ notification.message }}</td>
                <td>
                  <span class="text-white text-capitalize" :class="statusClass(notification.status)">
                    {{ notification.status }}
                  </span>
                </td>
                <td>{{ formatDate(notification.created_at) }}</td>
              </tr>
              <tr v-if="notifications.data.length === 0">
                <td colspan="5" class="text-center">No notifications available. Please add some notifications.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Pagination Controls -->
        <div v-if="notifications.last_page > 1" class="pagination-controls d-flex justify-content-center">
          <button class="btn btn-sm btn-outline-success mx-2" :disabled="notifications.current_page === 1"
            @click="changePage(notifications.current_page - 1)">
            Previous
          </button>

          <span class="text-muted">Page {{ notifications.current_page }} of {{ notifications.last_page }}</span>

          <button class="btn btn-sm btn-outline-success mx-2" :disabled="notifications.current_page === notifications.last_page"
            @click="changePage(notifications.current_page + 1)">
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
  name: "NotificationsView",
  data() {
    return {
      notifications: { data: [], current_page: 1, last_page: 1 },
    };
  },
  methods: {
    async fetchNotifications(page = 1) {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Authentication token not found.");
        return;
      }

      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/notifications?page=${page}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.notifications = response.data;
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    },
    changePage(page) {
      if (page >= 1 && page <= this.notifications.last_page) {
        this.fetchNotifications(page);
      }
    },
    formatShortId(id) {
      return id ? `${id.substring(0, 8)}...` : "N/A";
    },
    statusClass(status) {
      return status === "read" ? "badge bg-success" : "badge bg-warning";
    },
    formatDate(date) {
      return new Date(date).toLocaleString();
    },
  },
  mounted() {
    this.fetchNotifications();
  },
};

</script>

<style scoped>
.notifications-view {
  padding: 20px;
}
</style>