<script setup lang="ts">
// Enhanced interfaces with ID for better tracking
interface Labor {
  id: string;
  description: string;
  hours: number;
  rate: number;
  price: number;
}

interface Part {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  price: number;
}

interface Estimate {
  labor_cost: number;
  parts_cost: number;
  oil_cost: number;
  subtotal: number;
  tax: number;
  fees: number;
  total: number;
}

// State management
const labors = ref<Labor[]>([]);
const parts = ref<Part[]>([]);
const oils = ref<Part[]>([]);
const taxRate = ref(0.085); // 8.5% tax rate
const minimumFee = ref(15);
const feeRate = ref(0.03); // 3% fee rate
const feeThreshold = ref(500);

// Utility function to generate unique IDs
const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).substr(2);

// Currency formatting
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// Labor management
const addLabor = () => {
  labors.value.push({
    id: generateId(),
    description: "",
    hours: 0,
    rate: 125,
    price: 0,
  });
};

const removeLabor = (index: number) => {
  labors.value.splice(index, 1);
};

const calculateLaborPrice = (labor: Labor) => {
  const hours = Number(labor.hours) || 0;
  const rate = Number(labor.rate) || 0;
  labor.price = hours * rate;
};

const totalLaborCost = computed(() => {
  return labors.value.reduce((total, labor) => total + labor.price, 0);
});
// Parts management
const addPart = () => {
  parts.value.push({
    id: generateId(),
    description: "",
    quantity: 1,
    unit_price: 0,
    price: 0,
  });
};

const removePart = (index: number) => {
  parts.value.splice(index, 1);
};

const calculatePartPrice = (part: Part) => {
  const quantity = Number(part.quantity) || 0;
  const unitPrice = Number(part.unit_price) || 0;
  part.price = quantity * unitPrice;
};

const totalPartsCost = computed(() => {
  return parts.value.reduce((total, part) => total + part.price, 0);
});

// Oil management
const addOil = () => {
  oils.value.push({
    id: generateId(),
    description: "",
    quantity: 1,
    unit_price: 0,
    price: 0,
  });
};

const removeOil = (index: number) => {
  oils.value.splice(index, 1);
};

const calculateOilPrice = (oil: Part) => {
  const quantity = Number(oil.quantity) || 0;
  const unitPrice = Number(oil.unit_price) || 0;
  oil.price = quantity * unitPrice;
};

const totalOilCost = computed(() => {
  return oils.value.reduce((total, oil) => total + oil.price, 0);
});
// Enhanced estimate calculation
const estimate = computed<Estimate>(() => {
  const labor_cost = totalLaborCost.value;
  const parts_cost = totalPartsCost.value;
  const oil_cost = totalOilCost.value;
  const subtotal = labor_cost + parts_cost + oil_cost;

  // Tax only applies to parts and oil, not labor
  const tax = (parts_cost + oil_cost) * taxRate.value;

  // Fees calculation: flat fee for large jobs, percentage for smaller ones
  const fees =
    subtotal > feeThreshold.value ? minimumFee.value : subtotal * feeRate.value;

  const total = subtotal + tax + fees;

  return {
    labor_cost,
    parts_cost,
    oil_cost,
    subtotal,
    tax,
    fees,
    total,
  };
});

// Watch for changes in labor items to ensure calculations stay in sync
watch(
  () => labors.value,
  (newLabors) => {
    newLabors.forEach((labor) => {
      calculateLaborPrice(labor);
    });
  },
  { deep: true }
);

// Watch for changes in parts items
watch(
  () => parts.value,
  (newParts) => {
    newParts.forEach((part) => {
      calculatePartPrice(part);
    });
  },
  { deep: true }
);

// Watch for changes in oil items
watch(
  () => oils.value,
  (newOils) => {
    newOils.forEach((oil) => {
      calculateOilPrice(oil);
    });
  },
  { deep: true }
);

// Initialize with some default items for better UX
onMounted(() => {
  // Add default labor item
  addLabor();
});
</script>

<template>
  <UContainer class="py-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <div class="text-center">
          <div
            class="w-16 h-16 mx-auto mb-4 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
            <UIcon
              name="i-heroicons-calculator"
              class="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Estimate Calculator
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            Build detailed estimates with labor, parts, and materials
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <!-- Main Content -->
        <div class="xl:col-span-3 space-y-8">
          <!-- Labor Section -->
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <UIcon
                      name="i-heroicons-wrench-screwdriver"
                      class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3
                      class="text-lg font-semibold text-gray-900 dark:text-white"
                      >Labor Items</h3
                    >
                    <p class="text-sm text-gray-600 dark:text-gray-400"
                      >Professional services and time</p
                    >
                  </div>
                </div>
                <UButton @click="addLabor" icon="i-heroicons-plus" size="sm">
                  Add Labor
                </UButton>
              </div>
            </template>

            <div v-if="labors.length === 0" class="text-center py-8">
              <div
                class="w-12 h-12 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <UIcon
                  name="i-heroicons-wrench-screwdriver"
                  class="w-6 h-6 text-gray-400" />
              </div>
              <p class="text-gray-600 dark:text-gray-400 mb-4"
                >No labor items added yet</p
              >
              <UButton
                @click="addLabor"
                icon="i-heroicons-plus"
                variant="outline">
                Add First Labor Item
              </UButton>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="(labor, index) in labors"
                :key="labor.id"
                class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div class="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                  <div class="md:col-span-2">
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >Description</label
                    >
                    <UInput
                      v-model="labor.description"
                      placeholder="e.g., Oil change, brake repair..."
                      icon="i-heroicons-pencil" />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >Hours</label
                    >
                    <UInput
                      v-model.number="labor.hours"
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="0.0"
                      icon="i-heroicons-clock"
                      @update:model-value="() => calculateLaborPrice(labor)" />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >Rate/Hour</label
                    >
                    <UInput
                      v-model.number="labor.rate"
                      type="number"
                      step="5"
                      min="0"
                      placeholder="125"
                      icon="i-heroicons-currency-dollar"
                      @update:model-value="() => calculateLaborPrice(labor)" />
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="flex-1">
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >Total</label
                      >
                      <div
                        class="text-lg font-semibold text-gray-900 dark:text-white">
                        {{ formatCurrency(labor.price) }}
                      </div>
                    </div>
                    <UButton
                      @click="removeLabor(index)"
                      icon="i-heroicons-trash"
                      color="error"
                      variant="ghost"
                      size="sm" />
                  </div>
                </div>
              </div>

              <div
                class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <span
                  class="text-lg font-semibold text-gray-900 dark:text-white">
                  Total Labor: {{ formatCurrency(totalLaborCost) }}
                </span>
                <UButton
                  @click="addLabor"
                  icon="i-heroicons-plus"
                  variant="outline"
                  size="sm">
                  Add Another
                </UButton>
              </div>
            </div>
          </UCard>

          <!-- Parts Section -->
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <UIcon
                      name="i-heroicons-cog"
                      class="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3
                      class="text-lg font-semibold text-gray-900 dark:text-white"
                      >Parts & Components</h3
                    >
                    <p class="text-sm text-gray-600 dark:text-gray-400"
                      >Replacement parts and materials</p
                    >
                  </div>
                </div>
                <UButton @click="addPart" icon="i-heroicons-plus" size="sm">
                  Add Part
                </UButton>
              </div>
            </template>

            <div v-if="parts.length === 0" class="text-center py-8">
              <div
                class="w-12 h-12 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <UIcon name="i-heroicons-cog" class="w-6 h-6 text-gray-400" />
              </div>
              <p class="text-gray-600 dark:text-gray-400 mb-4"
                >No parts added yet</p
              >
              <UButton
                @click="addPart"
                icon="i-heroicons-plus"
                variant="outline">
                Add First Part
              </UButton>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="(part, index) in parts"
                :key="part.id"
                class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div class="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                  <div class="md:col-span-2">
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >Description</label
                    >
                    <UInput
                      v-model="part.description"
                      placeholder="e.g., Brake pads, air filter..."
                      icon="i-heroicons-cube" />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >Quantity</label
                    >
                    <UInput
                      v-model.number="part.quantity"
                      type="number"
                      min="1"
                      placeholder="1"
                      icon="i-heroicons-hashtag"
                      @update:model-value="() => calculatePartPrice(part)" />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >Unit Price</label
                    >
                    <UInput
                      v-model.number="part.unit_price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      icon="i-heroicons-currency-dollar"
                      @update:model-value="() => calculatePartPrice(part)" />
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="flex-1">
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >Total</label
                      >
                      <div
                        class="text-lg font-semibold text-gray-900 dark:text-white">
                        {{ formatCurrency(part.price) }}
                      </div>
                    </div>
                    <UButton
                      @click="removePart(index)"
                      icon="i-heroicons-trash"
                      color="error"
                      variant="ghost"
                      size="sm" />
                  </div>
                </div>
              </div>

              <div
                class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <span
                  class="text-lg font-semibold text-gray-900 dark:text-white">
                  Total Parts: {{ formatCurrency(totalPartsCost) }}
                </span>
                <UButton
                  @click="addPart"
                  icon="i-heroicons-plus"
                  variant="outline"
                  size="sm">
                  Add Another
                </UButton>
              </div>
            </div>
          </UCard>

          <!-- Oil & Fluids Section -->
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                    <UIcon
                      name="i-heroicons-beaker"
                      class="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3
                      class="text-lg font-semibold text-gray-900 dark:text-white"
                      >Oil & Fluids</h3
                    >
                    <p class="text-sm text-gray-600 dark:text-gray-400"
                      >Motor oil, transmission fluid, coolant</p
                    >
                  </div>
                </div>
                <UButton @click="addOil" icon="i-heroicons-plus" size="sm">
                  Add Fluid
                </UButton>
              </div>
            </template>

            <div v-if="oils.length === 0" class="text-center py-8">
              <div
                class="w-12 h-12 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <UIcon
                  name="i-heroicons-beaker"
                  class="w-6 h-6 text-gray-400" />
              </div>
              <p class="text-gray-600 dark:text-gray-400 mb-4"
                >No fluids added yet</p
              >
              <UButton
                @click="addOil"
                icon="i-heroicons-plus"
                variant="outline">
                Add First Fluid
              </UButton>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="(oil, index) in oils"
                :key="oil.id"
                class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div class="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                  <div class="md:col-span-2">
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >Description</label
                    >
                    <UInput
                      v-model="oil.description"
                      placeholder="e.g., 5W-30 motor oil, coolant..."
                      icon="i-heroicons-beaker" />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >Quantity</label
                    >
                    <UInput
                      v-model.number="oil.quantity"
                      type="number"
                      min="1"
                      placeholder="1"
                      icon="i-heroicons-hashtag"
                      @update:model-value="() => calculateOilPrice(oil)" />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >Unit Price</label
                    >
                    <UInput
                      v-model.number="oil.unit_price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      icon="i-heroicons-currency-dollar"
                      @update:model-value="() => calculateOilPrice(oil)" />
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="flex-1">
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >Total</label
                      >
                      <div
                        class="text-lg font-semibold text-gray-900 dark:text-white">
                        {{ formatCurrency(oil.price) }}
                      </div>
                    </div>
                    <UButton
                      @click="removeOil(index)"
                      icon="i-heroicons-trash"
                      color="error"
                      variant="ghost"
                      size="sm" />
                  </div>
                </div>
              </div>

              <div
                class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <span
                  class="text-lg font-semibold text-gray-900 dark:text-white">
                  Total Fluids: {{ formatCurrency(totalOilCost) }}
                </span>
                <UButton
                  @click="addOil"
                  icon="i-heroicons-plus"
                  variant="outline"
                  size="sm">
                  Add Another
                </UButton>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Estimate Summary Sidebar -->
        <div class="xl:col-span-1">
          <div class="sticky top-8">
            <UCard>
              <template #header>
                <div class="flex items-center gap-3">
                  <div
                    class="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                    <UIcon
                      name="i-heroicons-document-text"
                      class="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3
                      class="text-lg font-semibold text-gray-900 dark:text-white"
                      >Estimate Summary</h3
                    >
                  </div>
                </div>
              </template>

              <div class="space-y-4">
                <!-- Breakdown -->
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600 dark:text-gray-400"
                      >Labor Cost:</span
                    >
                    <span class="font-medium text-gray-900 dark:text-white">{{
                      formatCurrency(estimate.labor_cost)
                    }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600 dark:text-gray-400"
                      >Parts Cost:</span
                    >
                    <span class="font-medium text-gray-900 dark:text-white">{{
                      formatCurrency(estimate.parts_cost)
                    }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600 dark:text-gray-400"
                      >Fluids Cost:</span
                    >
                    <span class="font-medium text-gray-900 dark:text-white">{{
                      formatCurrency(estimate.oil_cost)
                    }}</span>
                  </div>
                </div>

                <div class="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600 dark:text-gray-400"
                      >Subtotal:</span
                    >
                    <span class="font-medium text-gray-900 dark:text-white">{{
                      formatCurrency(estimate.subtotal)
                    }}</span>
                  </div>
                </div>

                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600 dark:text-gray-400"
                      >Tax ({{ (taxRate * 100).toFixed(1) }}%):</span
                    >
                    <span class="font-medium text-gray-900 dark:text-white">{{
                      formatCurrency(estimate.tax)
                    }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600 dark:text-gray-400"
                      >Service Fees:</span
                    >
                    <span class="font-medium text-gray-900 dark:text-white">{{
                      formatCurrency(estimate.fees)
                    }}</span>
                  </div>
                </div>

                <div
                  class="border-t-2 border-primary-200 dark:border-primary-800 pt-4">
                  <div class="flex justify-between items-center">
                    <span
                      class="text-xl font-bold text-gray-900 dark:text-white"
                      >Total:</span
                    >
                    <span
                      class="text-2xl font-bold text-primary-600 dark:text-primary-400"
                      >{{ formatCurrency(estimate.total) }}</span
                    >
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="space-y-3 pt-4">
                  <UButton
                    color="primary"
                    block
                    size="lg"
                    icon="i-heroicons-document-duplicate">
                    Save Estimate
                  </UButton>
                  <UButton variant="outline" block icon="i-heroicons-printer">
                    Print Preview
                  </UButton>
                  <UButton variant="ghost" block icon="i-heroicons-share">
                    Share Estimate
                  </UButton>
                </div>

                <!-- Quick Settings -->
                <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4
                    class="text-sm font-medium text-gray-900 dark:text-white mb-3"
                    >Quick Settings</h4
                  >
                  <div class="space-y-3">
                    <div>
                      <label
                        class="block text-xs text-gray-600 dark:text-gray-400 mb-1"
                        >Tax Rate (%)</label
                      >
                      <UInput
                        v-model.number="taxRate"
                        type="number"
                        step="0.001"
                        min="0"
                        max="1"
                        size="sm" />
                    </div>
                    <div>
                      <label
                        class="block text-xs text-gray-600 dark:text-gray-400 mb-1"
                        >Service Fee ($)</label
                      >
                      <UInput
                        v-model.number="minimumFee"
                        type="number"
                        step="5"
                        min="0"
                        size="sm" />
                    </div>
                  </div>
                </div>
              </div>
            </UCard>
          </div>
        </div>
      </div>
    </div>
  </UContainer>
</template>
