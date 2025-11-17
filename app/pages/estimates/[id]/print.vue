<script setup lang="ts">
// Disable layout for print page
definePageMeta({
  layout: false
});

const route = useRoute();
const { id } = route.params;



const { data, pending, error } = await useFetch(`/api/estimates/${id}`, {
  method: "GET",
});

if (error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Estimate not found'
  });
}

const estimate = computed(() => data.value?.estimate);
const totals = computed(() => data.value?.totals);

// Utility functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount || 0);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

// Auto-print when page loads
onMounted(() => {
  // Small delay to ensure content is rendered
  setTimeout(() => {
    window.print();
  }, 500);
});
</script>

<template>
  <div class="print-container">
    <!-- Loading State -->
    <div v-if="pending" class="loading-state">
      <div class="loader">Loading estimate...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <h2>Error Loading Estimate</h2>
      <p>Unable to load estimate data for printing.</p>
    </div>

    <!-- Print Content -->
    <div v-else class="estimate-print">
      <!-- Header -->
      <header class="company-header">
        <div class="company-info">
          <h1 class="company-name">Chuck's Car Care, Inc.</h1>
          <div class="company-details">
            <p>4007 Pontoon Road, Pontoon Beach, IL 62040</p>
            <p>Phone: (618)931-2064</p>
          </div>
        </div>
        <div class="estimate-info">
          <h2 class="estimate-title">ESTIMATE</h2>
          <div class="estimate-details">
            <p><strong>Estimate #:</strong> {{ estimate.id }}</p>
            <p><strong>Date:</strong> {{ formatDate(estimate.date) }}</p>
          </div>
        </div>
      </header>

      <!-- Customer & Vehicle Information -->
      <section class="customer-vehicle-section">
        <div class="customer-info">
          <h3>Customer Information</h3>
          <div class="info-content">
            <p><strong>{{ estimate.car.customer.first_name }} {{ estimate.car.customer.last_name }}</strong></p>
            <div v-if="estimate.car.customer.addresses?.length">
              <p>{{ estimate.car.customer.addresses[0].street }}</p>
              <p>{{ estimate.car.customer.addresses[0].city }}, {{ estimate.car.customer.addresses[0].state }} {{ estimate.car.customer.addresses[0].zip_code }}</p>
            </div>
            <div v-if="estimate.car.customer.phones?.length">
              <p>Phone: {{ formatPhone(estimate.car.customer.phones[0].phone_number) }}</p>
            </div>
            <div v-if="estimate.car.customer.emails?.length">
              <p>Email: {{ estimate.car.customer.emails[0].email_address }}</p>
            </div>
          </div>
        </div>

        <div class="vehicle-info">
          <h3>Vehicle Information</h3>
          <div class="info-content">
            <p><strong>{{ estimate.car.year }} {{ estimate.car.make }} {{ estimate.car.model }}</strong></p>
            <p v-if="estimate.car.engine">Engine: {{ estimate.car.engine }}</p>
            <p v-if="estimate.car.vin">VIN: {{ estimate.car.vin }}</p>
            <p v-if="estimate.car.license">License: {{ estimate.car.license }}</p>
            <p>Mileage: {{ estimate.miles?.toLocaleString() || 'N/A' }}</p>
          </div>
        </div>
      </section>

      <!-- Service Description -->
      <section class="service-description" v-if="estimate.public_notes">
        <h3>Service Description</h3>
        <p>{{ estimate.public_notes }}</p>
      </section>

      <!-- Labor Items -->
      <section class="items-section" v-if="estimate.labor?.length">
        <h3>Labor</h3>
        <table class="items-table">
          <thead>
            <tr>
              <th class="description-col">Description</th>
              <th class="hours-col">Hours</th>
              <th class="rate-col">Rate</th>
              <th class="amount-col">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="labor in estimate.labor" :key="labor.id">
              <td class="description-col">{{ labor.description }}</td>
              <td class="hours-col">{{ labor.hours }}</td>
              <td class="rate-col">{{ formatCurrency(labor.rate) }}</td>
              <td class="amount-col">{{ formatCurrency(labor.price) }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Parts Items -->
      <section class="items-section" v-if="estimate.parts?.length">
        <h3>Parts</h3>
        <table class="items-table">
          <thead>
            <tr>
              <th class="description-col">Description</th>
              <th class="part-number-col">Part #</th>
              <th class="qty-col">Qty</th>
              <th class="rate-col">Price</th>
              <th class="amount-col">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="part in estimate.parts" :key="part.id">
              <td class="description-col">{{ part.description }}</td>
              <td class="part-number-col">{{ part.part_number || '-' }}</td>
              <td class="qty-col">{{ part.quantity }}</td>
              <td class="rate-col">{{ formatCurrency(part.unit_price) }}</td>
              <td class="amount-col">{{ formatCurrency(part.quantity * part.unit_price) }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Oil/Fluids Items -->
      <section class="items-section" v-if="estimate.oil?.length">
        <h3>Oil & Fluids</h3>
        <table class="items-table">
          <thead>
            <tr>
              <th class="description-col">Type</th>
              <th class="qty-col">Qty</th>
              <th class="rate-col">Price</th>
              <th class="amount-col">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="oil in estimate.oil" :key="oil.id">
              <td class="description-col">{{ oil.type }}</td>
              <td class="qty-col">{{ oil.quantity }} qt</td>
              <td class="rate-col">{{ formatCurrency(oil.price_per_unit) }}</td>
              <td class="amount-col">{{ formatCurrency(oil.quantity * oil.price_per_unit) }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Totals Section -->
      <section class="totals-section">
        <div class="totals-container">
          <div class="totals-table">
            <div class="total-row">
              <span class="total-label">Labor Total:</span>
              <span class="total-amount">{{ formatCurrency(totals?.labor || 0) }}</span>
            </div>
            <div class="total-row">
              <span class="total-label">Parts Total:</span>
              <span class="total-amount">{{ formatCurrency(totals?.parts || 0) }}</span>
            </div>
            <div class="total-row">
              <span class="total-label">Oil & Fluids Total:</span>
              <span class="total-amount">{{ formatCurrency(totals?.oil || 0) }}</span>
            </div>
            <div class="total-row subtotal-row">
              <span class="total-label">Subtotal:</span>
              <span class="total-amount">{{ formatCurrency(totals?.subtotal || 0) }}</span>
            </div>
            <div class="total-row">
              <span class="total-label">Tax:</span>
              <span class="total-amount">{{ formatCurrency(totals?.tax || 0) }}</span>
            </div>
            <div class="total-row">
              <span class="total-label">Shop Fees:</span>
              <span class="total-amount">{{ formatCurrency(totals?.shop_fees || 0) }}</span>
            </div>
            <div class="total-row grand-total">
              <span class="total-label">Grand Total:</span>
              <span class="total-amount">{{ formatCurrency(totals?.total || 0) }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="estimate-footer">
        <div class="footer-notes">
          <p><strong>Important Notes:</strong></p>
          <ul>
            <li>This estimate is valid for 30 days from the date above</li>
            <li>Prices may vary if additional work is discovered</li>
            <li>All work is guaranteed for 12 months or 12,000 miles</li>
            <li>Customer authorization required before work begins</li>
          </ul>
        </div>
        
        <div class="signature-section">
          <div class="signature-line">
            <span>Customer Signature: ________________________________</span>
            <span class="signature-date">Date: ________________</span>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
/* Print-specific styles */
@media print {
  .print-container {
    margin: 0;
    padding: 0;
  }
  
  body {
    margin: 0;
    font-size: 10pt;
    line-height: 1.2;
  }
  
  .estimate-print {
    page-break-inside: avoid;
  }
  
  .items-section {
    page-break-inside: auto;
  }
  
  .totals-section {
    page-break-inside: avoid;
  }
  
  /* Force smaller fonts for print */
  .company-name {
    font-size: 18pt !important;
  }
  
  .estimate-title {
    font-size: 16pt !important;
  }
  
  .items-section h3 {
    font-size: 11pt !important;
  }
}

/* General styles */
.print-container {
  max-width: 8.5in;
  margin: 0 auto;
  background: white;
  font-family: 'Arial', sans-serif;
  color: #000;
  line-height: 1.2;
}

.loading-state, .error-state {
  text-align: center;
  padding: 1rem;
}

.estimate-print {
  padding: 0.3in;
}

/* Header */
.company-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.8rem;
  border-bottom: 1px solid #000;
  padding-bottom: 0.5rem;
}

.company-name {
  font-size: 18pt;
  font-weight: bold;
  margin: 0 0 0.2rem 0;
}

.company-details p {
  margin: 0.1rem 0;
  font-size: 9pt;
}

.estimate-title {
  font-size: 16pt;
  font-weight: bold;
  margin: 0 0 0.2rem 0;
  text-align: right;
}

.estimate-details p {
  margin: 0.1rem 0;
  font-size: 10pt;
  text-align: right;
}

/* Customer & Vehicle Info */
.customer-vehicle-section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.8rem;
  gap: 1rem;
}

.customer-info, .vehicle-info {
  flex: 1;
}

.customer-info h3, .vehicle-info h3 {
  font-size: 11pt;
  font-weight: bold;
  margin: 0 0 0.3rem 0;
  border-bottom: 1px solid #ccc;
  padding-bottom: 0.1rem;
}

.info-content p {
  margin: 0.15rem 0;
  font-size: 9pt;
}

/* Service Description */
.service-description {
  margin-bottom: 0.8rem;
}

.service-description h3 {
  font-size: 11pt;
  font-weight: bold;
  margin: 0 0 0.3rem 0;
}

.service-description p {
  font-size: 9pt;
  margin: 0.2rem 0;
}

/* Items Tables */
.items-section {
  margin-bottom: 0.8rem;
}

.items-section h3 {
  font-size: 11pt;
  font-weight: bold;
  margin: 0 0 0.2rem 0;
  background-color: #f0f0f0;
  padding: 0.2rem;
  border: 1px solid #000;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 0.3rem;
}

.items-table th {
  background-color: #f8f8f8;
  border: 1px solid #000;
  padding: 0.2rem;
  font-weight: bold;
  font-size: 9pt;
  text-align: left;
}

.items-table td {
  border: 1px solid #000;
  padding: 0.2rem;
  font-size: 9pt;
}

.description-col {
  width: 45%;
}

.part-number-col {
  width: 15%;
}

.hours-col, .qty-col {
  width: 10%;
  text-align: center;
}

.rate-col, .amount-col {
  width: 15%;
  text-align: right;
}

/* Totals */
.totals-section {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
}

.totals-container {
  width: 250px;
}

.totals-table {
  border: 1px solid #000;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 0.2rem 0.5rem;
  border-bottom: 1px solid #ccc;
}

.total-row:last-child {
  border-bottom: none;
}

.subtotal-row {
  border-top: 1px solid #000;
  font-weight: bold;
}

.grand-total {
  background-color: #f0f0f0;
  font-weight: bold;
  font-size: 11pt;
  border-top: 1px solid #000;
}

.total-label {
  font-size: 9pt;
}

.total-amount {
  font-size: 9pt;
  font-weight: bold;
}

/* Footer */
.estimate-footer {
  margin-top: 1rem;
  border-top: 1px solid #ccc;
  padding-top: 0.5rem;
}

.footer-notes ul {
  font-size: 8pt;
  margin: 0.3rem 0;
  padding-left: 1rem;
}

.footer-notes li {
  margin: 0.1rem 0;
}

.signature-section {
  margin-top: 1rem;
}

.signature-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 9pt;
}

.signature-date {
  margin-left: 1rem;
}
</style>