<script setup lang="ts">
// @ts-nocheck
// Page metadata is handled by global auth middleware

// Imports
const route = useRoute();
const router = useRouter();
const toast = useToast();

// Reactive data
const estimate = ref<any>(null);
const totals = ref<any>(null);
const pending = ref(true);
const error = ref<string | null>(null);

// Modal states
const showAddLaborModal = ref(false);
const showAddPartModal = ref(false);
const showAddOilModal = ref(false);

// Loading states
const addingLabor = ref(false);
const addingPart = ref(false);
const addingOil = ref(false);

// Form data
const newLabor = ref({
  description: "",
  hours: 0,
  rate: 0,
});

const newPart = ref({
  part_name: "",
  part_number: "",
  quantity: 1,
  price: 0,
});

const newOil = ref({
  oil_type: "",
  brand: "",
  quantity: 0,
  price_per_quart: 0,
});

// Oil types for dropdown
const oilTypes = [
  "Engine Oil",
  "Transmission Fluid",
  "Brake Fluid",
  "Power Steering Fluid",
  "Coolant",
  "Differential Oil",
  "Hydraulic Fluid",
];

// Utility functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount || 0);
};

const getEstimateTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    "Basic Service": "info",
    "Major Repair": "error",
    Maintenance: "success",
    Inspection: "warning",
    Emergency: "error",
  };
  return colors[type] || "neutral";
};

// Data fetching
const fetchEstimateData = async (): Promise<void> => {
  try {
    pending.value = true;
    error.value = null;

    const estimateId = route.params.id;
    const response = (await $fetch(`/api/estimates/${estimateId}`)) as any;

    if (response?.estimate && response?.totals) {
      estimate.value = response.estimate;
      totals.value = response.totals;
    } else {
      throw new Error("Invalid response format");
    }
  } catch (err) {
    console.error("Error fetching estimate:", err);
    error.value = "Failed to load estimate";
    toast.add({
      title: "Error",
      description: "Failed to load estimate data",
      color: "error",
    });
  } finally {
    pending.value = false;
  }
};

// CRUD operations for Labor
const addLabor = async (): Promise<void> => {
  try {
    addingLabor.value = true;

    const laborItem = {
      ...newLabor.value,
      estimate_id: route.params.id,
      total: newLabor.value.hours * newLabor.value.rate,
    };

    await $fetch("/api/labor", {
      method: "POST",
      body: laborItem,
    });

    // Reset form and close modal
    newLabor.value = { description: "", hours: 0, rate: 0 };
    showAddLaborModal.value = false;

    // Refresh data
    await fetchEstimateData();

    toast.add({
      title: "Success",
      description: "Labor item added successfully",
      color: "success",
    });
  } catch (err) {
    console.error("Error adding labor:", err);
    toast.add({
      title: "Error",
      description: "Failed to add labor item",
      color: "error",
    });
  } finally {
    addingLabor.value = false;
  }
};

// CRUD operations for Parts
const addPart = async (): Promise<void> => {
  try {
    addingPart.value = true;

    const partItem = {
      ...newPart.value,
      estimate_id: route.params.id,
      total: newPart.value.quantity * newPart.value.price,
    };

    await $fetch("/api/parts", {
      method: "POST",
      body: partItem,
    });

    // Reset form and close modal
    newPart.value = { part_name: "", part_number: "", quantity: 1, price: 0 };
    showAddPartModal.value = false;

    // Refresh data
    await fetchEstimateData();

    toast.add({
      title: "Success",
      description: "Part added successfully",
      color: "success",
    });
  } catch (err) {
    console.error("Error adding part:", err);
    toast.add({
      title: "Error",
      description: "Failed to add part",
      color: "error",
    });
  } finally {
    addingPart.value = false;
  }
};

// CRUD operations for Oil
const addOil = async (): Promise<void> => {
  try {
    addingOil.value = true;

    const oilItem = {
      ...newOil.value,
      estimate_id: route.params.id,
      total: newOil.value.quantity * newOil.value.price_per_quart,
    };

    await $fetch("/api/oil", {
      method: "POST",
      body: oilItem,
    });

    // Reset form and close modal
    newOil.value = { oil_type: "", brand: "", quantity: 0, price_per_quart: 0 };
    showAddOilModal.value = false;

    // Refresh data
    await fetchEstimateData();

    toast.add({
      title: "Success",
      description: "Oil/fluid added successfully",
      color: "success",
    });
  } catch (err) {
    console.error("Error adding oil:", err);
    toast.add({
      title: "Error",
      description: "Failed to add oil/fluid",
      color: "error",
    });
  } finally {
    addingOil.value = false;
  }
};

// Action handlers
const printEstimate = (): void => {
  window.print();
};

const exportToPDF = (): void => {
  toast.add({
    title: "Coming Soon",
    description: "PDF export functionality will be available soon",
    color: "info",
  });
};

const emailEstimate = (): void => {
  toast.add({
    title: "Coming Soon",
    description: "Email functionality will be available soon",
    color: "info",
  });
};

// Initialize data on mount
onMounted(() => {
  fetchEstimateData();
});
</script>

<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-4">
        <UButton
          icon="i-heroicons-arrow-left"
          color="neutral"
          variant="ghost"
          @click="$router.push('/estimates')">
          Back
        </UButton>
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            Estimate #{{ estimate?.id }}
          </h1>
          <p class="text-gray-500 dark:text-gray-400 mt-1">
            {{
              estimate?.created_at ?
                new Date(estimate.created_at).toLocaleDateString()
              : ""
            }}
          </p>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div v-if="estimate && totals">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <UCard>
          <div class="text-center">
            <div
              class="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
              {{ formatCurrency(totals.grand_total || totals.total) }}
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
          </div>
        </UCard>

        <UCard>
          <div class="text-center">
            <div
              class="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              {{ formatCurrency(totals.labor_cost || totals.labor) }}
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Labor Cost</p>
          </div>
        </UCard>

        <UCard>
          <div class="text-center">
            <div
              class="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
              {{ formatCurrency(totals.parts_cost || totals.parts) }}
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Parts Cost</p>
          </div>
        </UCard>

        <UCard>
          <div class="text-center">
            <div
              class="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
              {{ formatCurrency(totals.oil_cost || totals.oil) }}
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Oil Cost</p>
          </div>
        </UCard>
      </div>

      <!-- Additional Info Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <UCard>
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {{ estimate.miles?.toLocaleString() || "N/A" }}
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Miles</p>
          </div>
        </UCard>

        <UCard>
          <div class="text-center">
            <UBadge
              :color="getEstimateTypeColor(estimate.estimate_type) as any"
              variant="subtle"
              class="text-lg px-3 py-1">
              {{ estimate.estimate_type }}
            </UBadge>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-2"
              >Service Type</p
            >
          </div>
        </UCard>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Details -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Customer & Vehicle Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Customer Info -->
            <UCard v-if="estimate.car?.customer">
              <template #header>
                <div class="flex items-center gap-3">
                  <UIcon
                    name="i-heroicons-user"
                    class="text-xl text-primary-600 dark:text-primary-400" />
                  <h3 class="text-lg font-semibold">Customer</h3>
                </div>
              </template>
              <div class="space-y-3">
                <div>
                  <p class="font-semibold text-gray-900 dark:text-white">
                    {{ estimate.car.customer.first_name }}
                    {{ estimate.car.customer.last_name }}
                  </p>
                </div>
                <div v-if="estimate.car.customer.phones?.length">
                  <p class="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                  <p class="font-medium">{{
                    estimate.car.customer.phones[0].phone_number
                  }}</p>
                </div>
                <div v-if="estimate.car.customer.emails?.length">
                  <p class="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p class="font-medium">{{
                    estimate.car.customer.emails[0].email
                  }}</p>
                </div>
              </div>
            </UCard>

            <!-- Vehicle Info -->
            <UCard v-if="estimate.car">
              <template #header>
                <div class="flex items-center gap-3">
                  <UIcon
                    name="i-heroicons-truck"
                    class="text-xl text-primary-600 dark:text-primary-400" />
                  <h3 class="text-lg font-semibold">Vehicle</h3>
                </div>
              </template>
              <div class="space-y-3">
                <div>
                  <p class="font-semibold text-gray-900 dark:text-white">
                    {{ estimate.car.year }} {{ estimate.car.make }}
                    {{ estimate.car.model }}
                  </p>
                </div>
                <div v-if="estimate.car.vin">
                  <p class="text-sm text-gray-500 dark:text-gray-400">VIN</p>
                  <p class="font-mono text-sm">{{ estimate.car.vin }}</p>
                </div>
                <div v-if="estimate.car.license_plate">
                  <p class="text-sm text-gray-500 dark:text-gray-400"
                    >License Plate</p
                  >
                  <p class="font-medium">{{ estimate.car.license_plate }}</p>
                </div>
                <div v-if="estimate.car.color">
                  <p class="text-sm text-gray-500 dark:text-gray-400">Color</p>
                  <p class="font-medium">{{ estimate.car.color }}</p>
                </div>
              </div>
            </UCard>
          </div>

          <!-- Management Section -->
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold">Manage Estimate</h3>
            </template>
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <UButton
                  color="primary"
                  size="lg"
                  block
                  @click="router.push(`/estimates/${estimate.id}/addLabor`)">
                  <UIcon
                    name="i-heroicons-wrench-screwdriver"
                    class="w-5 h-5 mr-2" />
                  Add Labor
                </UButton>

                <UButton
                  color="primary"
                  size="lg"
                  block
                  @click="router.push(`/estimates/${estimate.id}/addParts`)">
                  <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5 mr-2" />
                  Add Parts
                </UButton>

                <UButton
                  color="primary"
                  size="lg"
                  block
                  @click="router.push(`/estimates/${estimate.id}/addOil`)">
                  <UIcon name="i-heroicons-beaker" class="w-5 h-5 mr-2" />
                  Add Oil
                </UButton>
              </div>
            </div>
          </UCard>

          <!-- Labor Items -->
          <UCard v-if="estimate?.labor?.length">
            <template #header>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <UIcon
                    name="i-heroicons-wrench-screwdriver"
                    class="text-xl text-blue-600 dark:text-blue-400" />
                  <h3 class="text-lg font-semibold">Labor Items</h3>
                </div>
                <div class="text-right">
                  <div class="text-sm text-gray-500 dark:text-gray-400"
                    >{{ estimate.labor.length }} item(s)</div
                  >
                  <div class="font-semibold text-blue-600">
                    {{ formatCurrency(totals.labor) }}
                  </div>
                </div>
              </div>
            </template>
            <!-- <LaborCardComponent
              :labor="estimate.labor"
              @emit="fetchEstimateData" /> -->
            <LaborTableComponent
              :labor="estimate.labor"
              @emit="fetchEstimateData" />
          </UCard>

          <!-- Parts -->
          <UCard v-if="estimate?.parts?.length">
            <template #header>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <UIcon
                    name="i-heroicons-cog-6-tooth"
                    class="text-xl text-purple-600 dark:text-purple-400" />
                  <h3 class="text-lg font-semibold">Parts</h3>
                </div>
                <div class="text-right">
                  <div class="text-sm text-gray-500 dark:text-gray-400"
                    >{{ estimate.parts.length }} item(s)</div
                  >
                  <div class="font-semibold text-purple-600">
                    {{ formatCurrency(totals.parts) }}
                  </div>
                </div>
              </div>
            </template>
            <PartTableComponent
              :parts="estimate.parts"
              @emit="fetchEstimateData" />
          </UCard>

          <!-- Oil & Fluids -->
          <UCard v-if="estimate?.oil?.length">
            <template #header>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <UIcon
                    name="i-heroicons-beaker"
                    class="text-xl text-orange-600 dark:text-orange-400" />
                  <h3 class="text-lg font-semibold">Oil & Fluids</h3>
                </div>
                <div class="text-right">
                  <div class="text-sm text-gray-500 dark:text-gray-400"
                    >{{ estimate.oil.length }} item(s)</div
                  >
                  <div class="font-semibold text-orange-600">
                    {{
                      formatCurrency(
                        estimate.oil.reduce(
                          (sum, item) =>
                            sum +
                            (item.total ||
                              item.quantity * item.price_per_quart),
                          0
                        )
                      )
                    }}
                  </div>
                </div>
              </div>
            </template>
            <OilTableComponent
              :oils="estimate.oil"
              @emit="fetchEstimateData" />
          </UCard>

          <!-- Empty States -->
          <div
            v-if="
              !estimate?.labor?.length &&
              !estimate?.parts?.length &&
              !estimate?.oil?.length
            "
            class="text-center py-12">
            <UIcon
              name="i-heroicons-clipboard-document-list"
              class="text-6xl text-gray-400 mb-4 mx-auto" />
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2"
              >No Items Added Yet</h3
            >
            <p class="text-gray-500 dark:text-gray-400 mb-6">
              Start building your estimate by adding labor, parts, or oil items
              using the buttons above.
            </p>
            <div class="flex justify-center gap-3">
              <UButton color="primary" @click="showAddLaborModal = true">
                <UIcon
                  name="i-heroicons-wrench-screwdriver"
                  class="w-4 h-4 mr-2" />
                Add Labor
              </UButton>
              <UButton color="primary" @click="showAddPartModal = true">
                <UIcon name="i-heroicons-cog-6-tooth" class="w-4 h-4 mr-2" />
                Add Parts
              </UButton>
              <UButton color="primary" @click="showAddOilModal = true">
                <UIcon name="i-heroicons-beaker" class="w-4 h-4 mr-2" />
                Add Oil
              </UButton>
            </div>
          </div>

          <!-- Individual Empty States -->
          <UCard
            v-if="
              !estimate?.labor?.length &&
              (estimate?.parts?.length || estimate?.oil?.length)
            ">
            <template #header>
              <div class="flex items-center gap-3">
                <UIcon
                  name="i-heroicons-wrench-screwdriver"
                  class="text-xl text-gray-400" />
                <h3 class="text-lg font-semibold text-gray-500">Labor Items</h3>
              </div>
            </template>
            <div class="text-center py-8">
              <p class="text-gray-500 mb-4">No labor items added yet</p>
              <UButton color="primary" @click="router.push(`/estimates/${estimate.id}/addLabor`)"
                >Add Labor Item</UButton
              >
            </div>
          </UCard>

          <UCard
            v-if="
              !estimate?.parts?.length &&
              (estimate?.labor?.length || estimate?.oil?.length)
            ">
            <template #header>
              <div class="flex items-center gap-3">
                <UIcon
                  name="i-heroicons-cog-6-tooth"
                  class="text-xl text-gray-400" />
                <h3 class="text-lg font-semibold text-gray-500">Parts</h3>
              </div>
            </template>
            <div class="text-center py-8">
              <p class="text-gray-500 mb-4">No parts added yet</p>
              <UButton color="primary" @click="router.push(`/estimates/${estimate.id}/addParts`)"
                >Add Parts</UButton
              >
            </div>
          </UCard>

          <UCard
            v-if="
              !estimate?.oil?.length &&
              (estimate?.labor?.length || estimate?.parts?.length)
            ">
            <template #header>
              <div class="flex items-center gap-3">
                <UIcon
                  name="i-heroicons-beaker"
                  class="text-xl text-gray-400" />
                <h3 class="text-lg font-semibold text-gray-500"
                  >Oil & Fluids</h3
                >
              </div>
            </template>
            <div class="text-center py-8">
              <p class="text-gray-500 mb-4">No oil/fluid items added yet</p>
              <UButton color="primary" @click="router.push(`/estimates/${estimate.id}/addOil`)"
                >Add Oil/Fluid</UButton
              >
            </div>
          </UCard>
        </div>

        <!-- Right Column - Totals & Actions -->
        <div class="space-y-6">
          <!-- Detailed Totals Card -->
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold">Detailed Cost Breakdown</h3>
            </template>
            <div class="space-y-4">
              <!-- Labor Details -->
              <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <div class="flex justify-between items-center mb-2">
                  <div class="flex items-center gap-2">
                    <UIcon
                      name="i-heroicons-wrench-screwdriver"
                      class="text-blue-600" />
                    <span class="font-medium text-blue-800 dark:text-blue-200"
                      >Labor</span
                    >
                  </div>
                  <span class="font-semibold text-blue-600">
                    {{ formatCurrency(totals.labor_cost || totals.labor) }}
                  </span>
                </div>
                <div
                  v-if="estimate?.labor?.length"
                  class="text-sm text-blue-600 dark:text-blue-400">
                  {{
                    estimate.labor
                      .reduce((sum, item) => sum + (item.hours || 0), 0)
                      .toFixed(2)
                  }}
                  total hours • {{ estimate.labor.length }} item(s)
                </div>
              </div>

              <!-- Parts Details -->
              <div class="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                <div class="flex justify-between items-center mb-2">
                  <div class="flex items-center gap-2">
                    <UIcon
                      name="i-heroicons-cog-6-tooth"
                      class="text-purple-600" />
                    <span
                      class="font-medium text-purple-800 dark:text-purple-200"
                      >Parts</span
                    >
                  </div>
                  <span class="font-semibold text-purple-600">
                    {{ formatCurrency(totals.parts_cost || totals.parts) }}
                  </span>
                </div>
                <div
                  v-if="estimate?.parts?.length"
                  class="text-sm text-purple-600 dark:text-purple-400">
                  {{
                    estimate.parts.reduce(
                      (sum, item) => sum + (item.quantity || 0),
                      0
                    )
                  }}
                  total pieces • {{ estimate.parts.length }} item(s)
                </div>
              </div>

              <!-- Oil Details -->
              <div class="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                <div class="flex justify-between items-center mb-2">
                  <div class="flex items-center gap-2">
                    <UIcon name="i-heroicons-beaker" class="text-orange-600" />
                    <span
                      class="font-medium text-orange-800 dark:text-orange-200"
                      >Oil & Fluids</span
                    >
                  </div>
                  <span class="font-semibold text-orange-600">
                    {{ formatCurrency(totals.oil_cost || totals.oil) }}
                  </span>
                </div>
                <div
                  v-if="estimate?.oil?.length"
                  class="text-sm text-orange-600 dark:text-orange-400">
                  {{
                    estimate.oil
                      .reduce((sum, item) => sum + (item.quantity || 0), 0)
                      .toFixed(2)
                  }}
                  total quarts • {{ estimate.oil.length }} item(s)
                </div>
              </div>

              <!-- Subtotal -->
              <UDivider />
              <div class="flex justify-between text-lg">
                <span class="font-medium">Subtotal:</span>
                <span class="font-semibold">
                  {{
                    formatCurrency(
                      (totals.labor_cost || totals.labor) +
                        (totals.parts_cost || totals.parts) +
                        (totals.oil_cost || totals.oil)
                    )
                  }}
                </span>
              </div>

              <!-- Tax (if applicable) -->
              <div v-if="totals.tax_amount" class="flex justify-between">
                <span>Tax ({{ totals.tax_rate }}%):</span>
                <span>{{ formatCurrency(totals.tax_amount) }}</span>
              </div>

              <!-- Discount (if applicable) -->
              <div
                v-if="totals.discount_amount"
                class="flex justify-between text-red-600">
                <span>Discount:</span>
                <span>-{{ formatCurrency(totals.discount_amount) }}</span>
              </div>

              <!-- Grand Total -->
              <UDivider />
              <div class="flex justify-between font-bold text-xl">
                <span>Grand Total:</span>
                <span class="text-green-600">
                  {{ formatCurrency(totals.grand_total || totals.total) }}
                </span>
              </div>
            </div>
          </UCard>

          <!-- Actions Card -->
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold">Actions</h3>
            </template>
            <div class="space-y-3">
              <UButton color="primary" block @click="router.push(`/estimates/${estimate.id}/edit`)">
                <UIcon name="i-heroicons-pencil" class="w-4 h-4 mr-2" />
                Edit Estimate
              </UButton>
              <UButton color="primary" block @click="router.push(`/estimates/${estimate.id}/print`)">
                <UIcon name="i-heroicons-printer" class="w-4 h-4 mr-2" />
                Print
              </UButton>
              <UButton
                color="neutral"
                variant="outline"
                block
                @click="exportToPDF">
                <UIcon
                  name="i-heroicons-document-arrow-down"
                  class="w-4 h-4 mr-2" />
                Export PDF
              </UButton>
              <UButton
                color="neutral"
                variant="outline"
                block
                @click="emailEstimate">
                <UIcon name="i-heroicons-envelope" class="w-4 h-4 mr-2" />
                Email
              </UButton>
            </div>
          </UCard>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else-if="pending" class="flex items-center justify-center py-12">
      <UCard class="max-w-md">
        <div class="text-center">
          <UIcon
            name="i-heroicons-arrow-path"
            class="animate-spin text-4xl text-primary-600 dark:text-primary-400 mb-4" />
          <h3 class="text-lg font-semibold mb-2">Loading Estimate</h3>
          <p class="text-gray-500"
            >Please wait while we fetch the estimate details...</p
          >
        </div>
      </UCard>
    </div>

    <!-- Error State -->
    <div v-else class="flex items-center justify-center py-12">
      <UCard class="max-w-md">
        <div class="text-center">
          <UIcon
            name="i-heroicons-document-text"
            class="text-4xl text-gray-400 mb-4" />
          <h3 class="text-lg font-semibold mb-2">Estimate Not Found</h3>
          <p class="text-gray-500 mb-4">
            The estimate you're looking for doesn't exist or may have been
            deleted.
          </p>
          <UButton @click="$router.push('/estimates')">
            Back to Estimates
          </UButton>
        </div>
      </UCard>
    </div>
  </div>
</template>
