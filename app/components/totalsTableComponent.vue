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
const props = defineProps<Props>();
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
        <td>{{ props.labor }}</td>
        <td>{{ props.parts }}</td>
        <td>{{ props.oil }}</td>
        <td>{{ props.subtotal }}</td>
        <td>{{ props.tax }}</td>
        <td>{{ props.shop_fees }}</td>
        <td>{{ props.total }}</td>
        <td>{{ props.cost }}</td>
        <td>{{ props.parts_margin }}</td>
        <td>{{ props.margin }}</td>
      </tr>
    </tbody>
  </table>
</template>
