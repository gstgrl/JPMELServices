<script setup>
    const props = defineProps({
        item: {
            type: Object,
            required: true
        }
    })

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("it-IT", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };
</script>

<template>
    <div class="order-container">
        <h5 class="order-date">📅 Scaricato in data: {{ formatDate(item.dischargedAt) }}</h5>

        <div class="order-card">
            <h6 class="order-title">📦 Ordini presenti:</h6>
            <ul class="order-list">
                <li v-for="(order, index) in item.orders" :key="index" class="order-item">
                    <label class="order-label">
                        <input type="checkbox" class="order-checkbox">
                        <span class="order-info">{{ index + 1 }} - {{ order.data.address }}, {{ order.data.city }}, {{ order.data.province }}</span>
                    </label>

                    <p class="barcode-info">📄 Barcode: {{ order.barcode }}</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
    .order-container {
        background: #f9f9f9;
        padding: 16px;
        border-radius: 8px;
        box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
        margin-bottom: 20px;
    }

    .order-date {
        font-size: 16px;
        font-weight: 600;
        color: #333;
    }

    .order-card {
        background: white;
        padding: 12px;
        border-radius: 8px;
        box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.05);
    }

    .order-title {
        font-size: 14px;
        font-weight: bold;
        color: #666;
        margin-bottom: 8px;
    }

    .order-list {
        list-style: none;
        padding: 0;
    }

    .order-item {
        display: flex;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid #ddd;
    }

    .order-label {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        width: 100%;
    }

    .order-checkbox {
        transform: scale(1.2);
        accent-color: #4CAF50;
    }

    .order-info {
        font-size: 14px;
        color: #444;
    }

    .barcode-info {
        font-size: 12px;
        color: #555;
        margin-top: 5px;
        font-style: italic;
    }
</style>