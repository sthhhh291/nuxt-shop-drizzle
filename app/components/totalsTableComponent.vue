<script setup lang="ts">
type Props = {
  labor: number;
  parts: number;
  oil: number;
  subtotal: number;
  tax: number;
  shop_fees: number;
  total: number;
  cost: number;
  parts_margin: number;
  margin: number;
};

const props = defineProps<{
  totals: Props;
}>();

interface RowData {
  category: string;
  amount: number;
  type: string;
  icon: string;
}

const columns = [
  { key: "category", label: "Category" },
  { key: "amount", label: "Amount" },
];

const rows = computed((): RowData[] => [
  {
    category: "Labor",
    amount: props.totals.labor,
    type: "revenue",
    icon: "i-heroicons-wrench-screwdriver",
  },
  {
    category: "Parts",
    amount: props.totals.parts,
    type: "revenue",
    icon: "i-heroicons-cog-6-tooth",
  },
  {
    category: "Oil",
    amount: props.totals.oil,
    type: "revenue",
    icon: "i-heroicons-beaker",
  },
  {
    category: "Subtotal",
    amount: props.totals.subtotal,
    type: "subtotal",
    icon: "i-heroicons-calculator",
  },
  {
    category: "Tax",
    amount: props.totals.tax,
    type: "tax",
    icon: "i-heroicons-receipt-percent",
  },
  {
    category: "Shop Fees",
    amount: props.totals.shop_fees,
    type: "fee",
    icon: "i-heroicons-building-storefront",
  },
  {
    category: "Total",
    amount: props.totals.total,
    type: "total",
    icon: "i-heroicons-currency-dollar",
  },
  {
    category: "Cost",
    amount: props.totals.cost,
    type: "cost",
    icon: "i-heroicons-arrow-down",
  },
  {
    category: "Parts Margin",
    amount: props.totals.parts_margin,
    type: "margin",
    icon: "i-heroicons-arrow-trending-up",
  },
  {
    category: "Overall Margin",
    amount: props.totals.margin,
    type: "margin",
    icon: "i-heroicons-chart-bar",
  },
]);

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount || 0);
};

const getCategoryColor = (type: string) => {
  switch (type) {
    case "revenue":
      return "primary";
    case "subtotal":
      return "gray";
    case "tax":
      return "amber";
    case "fee":
      return "purple";
    case "total":
      return "success";
    case "cost":
      return "error";
    case "margin":
      return "green";
    default:
      return "gray";
  }
};
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center gap-3">
        <UIcon name="i-heroicons-table-cells" class="text-primary-500" />
        <div>
          <h3 class="font-semibold">Financial Summary</h3>
          <p class="text-sm text-gray-500"
            >Detailed breakdown of costs and margins</p
          >
        </div>
      </div>
    </template>

    <UTable :columns="columns" :rows="rows" class="w-full">
      <template #category-data="{ row }">
        <div class="flex items-center space-x-3">
          <div class="shrink-0">
            <div
              class="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <UIcon
                :name="(row as unknown as RowData).icon"
                class="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
          <div>
            <div class="font-medium text-gray-900 dark:text-white">
              {{ (row as unknown as RowData).category }}
            </div>
          </div>
        </div>
      </template>

      <template #amount-data="{ row }">
        <div class="flex items-center justify-end">
          <span class="font-medium text-gray-900 dark:text-white">
            {{ formatCurrency((row as unknown as RowData).amount) }}
          </span>
        </div>
      </template>
    </UTable>

    <!-- Summary Cards -->
    <div
      class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      <div class="text-center">
        <div class="text-2xl font-bold text-green-600 dark:text-green-400">
          {{ formatCurrency(props.totals.total) }}
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400"
          >Total Revenue</div
        >
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-red-600 dark:text-red-400">
          {{ formatCurrency(props.totals.cost) }}
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400">Total Cost</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
          {{ formatCurrency(props.totals.margin) }}
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400">Net Margin</div>
      </div>
    </div>
  </UCard>
</template>
