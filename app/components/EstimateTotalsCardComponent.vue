<script setup lang="ts">
interface EstimateTotalsCardProps {
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
}
const props = defineProps<{ totals: EstimateTotalsCardProps }>();
</script>

<template>
  <div class="estimate-totals-card">
    <h3>Estimate Totals</h3>
    <p>Labor Total: ${{ props.totals.labor }}</p>
    <p>Parts Total: ${{ props.totals.parts }}</p>
    <p>Oil Total: ${{ props.totals.oil }}</p>
    <p>Subtotal: ${{ props.totals.subtotal }}</p>
    <p>Tax: ${{ props.totals.tax }}</p>
    <p>Shop Fees: ${{ props.totals.shop_fees }}</p>
    <p>Cost: ${{ props.totals.cost }}</p>
    <p>Parts Margin: ${{ props.totals.parts_margin }}</p>
    <p>Overall Margin: ${{ props.totals.margin }}</p>
    <p
      ><strong>Grand Total: ${{ props.totals.total }}</strong></p
    >
  </div>
</template>

<style scoped>
.estimate-totals-card {
  border: 1px solid #ccc;
  padding: 1em;
  margin-top: 1em;
  border-radius: 5px;
}
</style>
