<template>
  <div class="notif-card card shadow-sm p-3 bg-white rounded mx-auto">
  <div class="card-header d-flex justify-content-between align-items-center">
    <h5 class="mb-0">All Notifications</h5>
    <span class="badge bg-primary text-white">
      Unread: {{ unreadCount }}
    </span>
  </div>
  <div class="card-body overflow-auto">
    <ul class="list-group">
      <li
        v-for="notification in notifications"
        :key="notification.notification_id"
        class="list-group-item d-flex justify-content-between align-items-start text-left bordered"
      >
        <div>
          <p
            :class="['mb-1', { 'text-muted': notification.status === 'read' }]"
          >
            {{ notification.message }}
          </p>
          <small class="text-muted">{{ formatDate(notification.created_at) }}</small>
        </div>
        <button
          v-if="notification.status === 'unread'"
          class="btn btn-sm btn-outline-success"
          @click="markAsRead(notification.notification_id)"
        >
          <i class="bi bi-check-circle"></i> Mark as Read
        </button>
      </li>
    </ul>
  </div>
  <div v-if="message" :class="['mt-3 alert', messageClass]">
    <p class="mb-0">{{ message }}</p>
  </div>
</div>

</template>

<script>
import axios from "axios";

export default {
  name: "NotifNavbar",
  data() {
    return {
      notifications: [],
      unreadCount: 0, 
      message: null,
      messageClass: "",
    };
  },
  mounted() {
    this.fetchNotifications();
  },
  methods: {
    async fetchNotifications() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://127.0.0.1:8000/api/notif-all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.notifications = response.data.notifications;
        this.unreadCount = response.data.unread_count; 
      } catch (error) {
        console.error("Error fetching notifications:", error);
        this.message = "Failed to load notifications.";
        this.messageClass = "text-danger";
      }
    },
    async markAsRead(notificationId) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.put(
          `http://127.0.0.1:8000/api/notifications/${notificationId}/read`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          const notification = this.notifications.find(
            (notif) => notif.notification_id === notificationId
          );
          if (notification) {
            notification.status = "read";
            this.unreadCount--; 
          }
          this.message = response.data.message;
          this.messageClass = "text-success";
        }
      } catch (error) {
        console.error("Error marking notification as read:", error);
        this.message = "Failed to mark notification as read.";
        this.messageClass = "text-danger";
      }
    },
    formatDate(date) {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(date).toLocaleDateString(undefined, options);
    },
  },
};
</script>

<style scoped>
.notif-card {
  width: 90%; /* Mengambil 90% dari lebar layar */
  max-width: 600px; /* Lebar maksimum tetap 600px */
  height: 80vh; /* Tinggi responsif berdasarkan viewport height */
  max-height: 600px; /* Tinggi maksimum tetap 600px */
  margin: 0 auto; /* Memusatkan card */
}

.notif-card .card-body {
  height: calc(100% - 56px); /* Mengurangi tinggi header card */
  overflow-y: auto; /* Scroll hanya untuk konten berlebih */
}

/* Responsiveness untuk layar kecil */
@media (max-width: 768px) {
  .notif-card {
    width: 95%; /* Lebar lebih kecil untuk layar kecil */
    height: 70vh; /* Tinggi lebih kecil */
  }
}

/* Responsiveness untuk layar sangat kecil (mobile) */
@media (max-width: 480px) {
  .notif-card {
    width: 100%; /* Penuh untuk layar kecil */
    height: 60vh; /* Tinggi lebih kecil */
  }
}

.list-group-item {
  /* border: none; Opsional: Menghilangkan border antara item */
  padding: 10px 15px;
}

</style>
