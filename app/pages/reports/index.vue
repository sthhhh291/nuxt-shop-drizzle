<script setup lang="ts">
interface Report {
  year: string;
  labor: number;
  parts: number;
  oil: number;
  subtotal: number;
  shop_fees: number;
  tax: number;
  total: number;
  cost: number;
  margin: number;
  parts_margin: number;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 2004 + 1 }, (_, i) => 2004 + i).reverse();
const selectedYear = ref(currentYear);
const isLoading = ref(false);
const toast = useToast();

const report = ref<Report>({
  year: '',
  labor: 0,
  parts: 0,
  oil: 0,
  subtotal: 0,
  shop_fees: 0,
  tax: 0,
  total: 0,
  cost: 0,
  margin: 0,
  parts_margin: 0,
});

// Utility functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount || 0);
};

const formatPercent = (amount: number, total: number): string => {
  if (total === 0) return "0%";
  return ((amount / total) * 100).toFixed(1) + "%";
};

const getReportsForYear = async (year: number) => {
  try {
    isLoading.value = true;
    const { data } = await useFetch(`/api/reports/${year}`, {
      method: "GET",
    });
    console.log("Fetched report data:", data.value);
    if (data.value?.sums) {
      report.value = data.value.sums[0] as unknown as Report;
      toast.add({
        title: 'Success',
        description: `Loaded ${year} financial report`,
        color: 'success'
      });
    } else {
      throw new Error('No data found for selected year');
    }
  } catch (error) {
    console.error("Error fetching report data:", error);
    toast.add({
      title: 'Error',
      description: 'Failed to load report data',
      color: 'warning'
    });
  } finally {
    isLoading.value = false;
  }
};

// Load initial year data
onMounted(() => {
  getReportsForYear(selectedYear.value);
});

// Computed properties for metrics
const profitMargin = computed(() => {
  if (report.value.total === 0) return 0;
  return ((report.value.margin / report.value.total) * 100);
});

const partsMarginPercent = computed(() => {
  if (report.value.parts === 0) return 0;
  return ((report.value.parts_margin / report.value.parts) * 100);
});
</script>

<template>
  <div class="max-w-7xl mx-auto p-6 space-y-6">
    <!-- Header Section -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Financial Reports
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">
          Annual business performance and financial metrics
        </p>
      </div>
      
      <div class="flex items-center gap-4">
        <UFormGroup label="Report Year">
          <USelectMenu
            v-model="selectedYear"
            :items="years"
            placeholder="Select Year"
            icon="i-heroicons-calendar-days"
            size="lg"
            @change="getReportsForYear(selectedYear)"
            :loading="isLoading"
          />
        </UFormGroup>
        
        <UButton
          icon="i-heroicons-arrow-path"
          variant="outline"
          color="neutral"
          @click="getReportsForYear(selectedYear)"
          :loading="isLoading"
        >
          Refresh
        </UButton>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="flex items-center gap-3">
        <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin text-blue-500" />
        <span class="text-lg text-gray-600 dark:text-gray-300">Loading report...</span>
      </div>
    </div>

    <!-- Report Content -->
    <div v-else class="space-y-6">
      <!-- Key Metrics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total Revenue -->
        <UCard class="bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-green-700 dark:text-green-300">Total Revenue</p>
              <p class="text-2xl font-bold text-green-900 dark:text-green-100">
                {{ formatCurrency(report.total) }}
              </p>
            </div>
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <UIcon name="i-heroicons-currency-dollar" class="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </UCard>

        <!-- Total Costs -->
        <UCard class="bg-linear-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-red-700 dark:text-red-300">Total Costs</p>
              <p class="text-2xl font-bold text-red-900 dark:text-red-100">
                {{ formatCurrency(report.cost) }}
              </p>
            </div>
            <div class="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <UIcon name="i-heroicons-minus-circle" class="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </UCard>

        <!-- Profit Margin -->
        <UCard class="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-blue-700 dark:text-blue-300">Net Profit</p>
              <p class="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {{ formatCurrency(report.margin) }}
              </p>
              <p class="text-xs text-blue-600 dark:text-blue-400">
                {{ profitMargin.toFixed(1) }}% margin
              </p>
            </div>
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <UIcon name="i-heroicons-chart-bar" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </UCard>

        <!-- Parts Margin -->
        <UCard class="bg-linear-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-purple-700 dark:text-purple-300">Parts Profit</p>
              <p class="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {{ formatCurrency(report.parts_margin) }}
              </p>
              <p class="text-xs text-purple-600 dark:text-purple-400">
                {{ partsMarginPercent.toFixed(1) }}% margin
              </p>
            </div>
            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <UIcon name="i-heroicons-cog-6-tooth" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </UCard>
      </div>

      <!-- Revenue Breakdown -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <UIcon name="i-heroicons-chart-pie" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Revenue Breakdown</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ selectedYear }} annual revenue by category</p>
            </div>
          </div>
        </template>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Labor Revenue -->
          <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-wrench-screwdriver" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span class="font-medium text-blue-900 dark:text-blue-100">Labor</span>
              </div>
              <span class="text-sm text-blue-600 dark:text-blue-400">
                {{ formatPercent(report.labor, report.subtotal) }}
              </span>
            </div>
            <p class="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {{ formatCurrency(report.labor) }}
            </p>
          </div>

          <!-- Parts Revenue -->
          <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span class="font-medium text-purple-900 dark:text-purple-100">Parts</span>
              </div>
              <span class="text-sm text-purple-600 dark:text-purple-400">
                {{ formatPercent(report.parts, report.subtotal) }}
              </span>
            </div>
            <p class="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {{ formatCurrency(report.parts) }}
            </p>
          </div>

          <!-- Oil Revenue -->
          <div class="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-beaker" class="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span class="font-medium text-amber-900 dark:text-amber-100">Oil & Fluids</span>
              </div>
              <span class="text-sm text-amber-600 dark:text-amber-400">
                {{ formatPercent(report.oil, report.subtotal) }}
              </span>
            </div>
            <p class="text-2xl font-bold text-amber-900 dark:text-amber-100">
              {{ formatCurrency(report.oil) }}
            </p>
          </div>
        </div>
      </UCard>

      <!-- Detailed Financial Table -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <UIcon name="i-heroicons-table-cells" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Detailed Financial Summary</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">Complete breakdown of {{ selectedYear }} finances</p>
            </div>
          </div>
        </template>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">% of Revenue</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              <tr class="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <UIcon name="i-heroicons-wrench-screwdriver" class="w-4 h-4 text-blue-500" />
                    <span class="font-medium text-gray-900 dark:text-white">Labor Revenue</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right font-semibold text-gray-900 dark:text-white">
                  {{ formatCurrency(report.labor) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                  {{ formatPercent(report.labor, report.total) }}
                </td>
              </tr>
              
              <tr class="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <UIcon name="i-heroicons-cog-6-tooth" class="w-4 h-4 text-purple-500" />
                    <span class="font-medium text-gray-900 dark:text-white">Parts Revenue</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right font-semibold text-gray-900 dark:text-white">
                  {{ formatCurrency(report.parts) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                  {{ formatPercent(report.parts, report.total) }}
                </td>
              </tr>

              <tr class="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <UIcon name="i-heroicons-beaker" class="w-4 h-4 text-amber-500" />
                    <span class="font-medium text-gray-900 dark:text-white">Oil & Fluids Revenue</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right font-semibold text-gray-900 dark:text-white">
                  {{ formatCurrency(report.oil) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                  {{ formatPercent(report.oil, report.total) }}
                </td>
              </tr>

              <tr class="bg-gray-100 dark:bg-gray-800 font-semibold">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <UIcon name="i-heroicons-calculator" class="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span class="font-bold text-gray-900 dark:text-white">Subtotal</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right font-bold text-gray-900 dark:text-white">
                  {{ formatCurrency(report.subtotal) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                  {{ formatPercent(report.subtotal, report.total) }}
                </td>
              </tr>

              <tr class="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <UIcon name="i-heroicons-receipt-percent" class="w-4 h-4 text-green-500" />
                    <span class="font-medium text-gray-900 dark:text-white">Tax</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right font-semibold text-gray-900 dark:text-white">
                  {{ formatCurrency(report.tax) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                  {{ formatPercent(report.tax, report.total) }}
                </td>
              </tr>

              <tr class="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <UIcon name="i-heroicons-building-storefront" class="w-4 h-4 text-orange-500" />
                    <span class="font-medium text-gray-900 dark:text-white">Shop Fees</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right font-semibold text-gray-900 dark:text-white">
                  {{ formatCurrency(report.shop_fees) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                  {{ formatPercent(report.shop_fees, report.total) }}
                </td>
              </tr>

              <tr class="bg-green-50 dark:bg-green-900/20 font-bold border-t-2 border-green-200 dark:border-green-800">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <UIcon name="i-heroicons-currency-dollar" class="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span class="font-bold text-green-900 dark:text-green-100">Total Revenue</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right font-bold text-green-900 dark:text-green-100 text-lg">
                  {{ formatCurrency(report.total) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-green-600 dark:text-green-400">
                  100%
                </td>
              </tr>

              <tr class="bg-red-50 dark:bg-red-900/20">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <UIcon name="i-heroicons-minus-circle" class="w-4 h-4 text-red-600 dark:text-red-400" />
                    <span class="font-bold text-red-900 dark:text-red-100">Total Costs</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right font-bold text-red-900 dark:text-red-100">
                  {{ formatCurrency(report.cost) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-red-600 dark:text-red-400">
                  {{ formatPercent(report.cost, report.total) }}
                </td>
              </tr>

              <tr class="bg-blue-50 dark:bg-blue-900/20 font-bold border-t-2 border-blue-200 dark:border-blue-800">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <UIcon name="i-heroicons-chart-bar" class="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span class="font-bold text-blue-900 dark:text-blue-100">Net Profit</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right font-bold text-blue-900 dark:text-blue-100 text-lg">
                  {{ formatCurrency(report.margin) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-blue-600 dark:text-blue-400">
                  {{ profitMargin.toFixed(1) }}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </UCard>
    </div>
  </div>
</template>