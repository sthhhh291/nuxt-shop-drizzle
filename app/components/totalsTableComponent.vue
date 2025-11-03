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
        <td>{{ formatCurrency(props.totals.labor) }}</td>
        <td>{{ formatCurrency(props.totals.parts) }}</td>
        <td>{{ formatCurrency(props.totals.oil) }}</td>
        <td>{{ formatCurrency(props.totals.subtotal) }}</td>
        <td>{{ formatCurrency(props.totals.tax) }}</td>
        <td>{{ formatCurrency(props.totals.shop_fees) }}</td>
        <td>{{ formatCurrency(props.totals.total) }}</td>
        <td>{{ formatCurrency(props.totals.cost) }}</td>
        <td>{{ formatCurrency(props.totals.parts_margin) }}</td>
        <td>{{ formatCurrency(props.totals.margin) }}</td>
      </tr>
    </tbody>
  </table>
</template>
