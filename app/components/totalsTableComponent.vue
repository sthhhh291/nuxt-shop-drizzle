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
</script>

<template>
  <table class="table">
    <thead>
      <tr>
        <th>Labor</th>
        <th>Parts</th>
        <th>Oil</th>
        <th>Subtotal</th>
        <th>Tax</th>
        <th>Shop Fees</th>
        <th>Total</th>
        <th>Cost</th>
        <th>Parts Margin</th>
        <th>Overall Margin</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{{ props.totals.labor }}</td>
        <td>{{ props.totals.parts }}</td>
        <td>{{ props.totals.oil }}</td>
        <td>{{ props.totals.subtotal }}</td>
        <td>{{ props.totals.tax }}</td>
        <td>{{ props.totals.shop_fees }}</td>
        <td>{{ props.totals.total }}</td>
        <td>{{ props.totals.cost }}</td>
        <td>{{ props.totals.parts_margin }}</td>
        <td>{{ props.totals.margin }}</td>
      </tr>
    </tbody>
  </table>
</template>
