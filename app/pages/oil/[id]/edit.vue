<script setup lang="ts">
import { z } from "zod";
const { id } = useRoute().params;
const router = useRouter();
const { data } = await useFetch(`/api/oil/${id}`, {
  method: "GET",
});
const part = ref({
  type: data.value?.type || "",
  quantity: data.value?.quantity || 1,
  mfr_number: data.value?.mfr_number || "",
  part_number: data.value?.part_number || "",
  cost: data.value?.cost || 0,
  list: data.value?.list || 0,
  price_per_unit: data.value?.price_per_unit || 0,
  estimate_id: data.value?.estimate_id || 0,
});
const partSchema = z.object({
  type: z.string().min(1).max(255),
  mfr_number: z.string().optional(),
  part_number: z.string().optional(),
  quantity: z.number().min(1),
  cost: z.number().min(0),
  list: z.number().min(0),
  price_per_unit: z.number().min(0),
  estimate_id: z.number().min(1),
});
const calcPrice = () => {
  // const compare = part.value.cost * 1.86;
  part.value.cost * 1.86 > part.value.list ?
    (part.value.price_per_unit = part.value.list)
  : (part.value.price_per_unit = parseFloat(
      (part.value.cost * 1.86).toFixed(2)
    ));
  // Implement price calculation logic here if needed
};
const submitPart = async () => {
  const npart = partSchema.parse({
    type: part.value.type,
    quantity: Number(part.value.quantity),
    mfr_number: part.value.mfr_number,
    part_number: part.value.part_number,
    cost: Number(part.value.cost),
    list: Number(part.value.list),
    price_per_unit: Number(part.value.price_per_unit),
    estimate_id: Number(part.value.estimate_id),
  });
  try {
    await useFetch(`/api/oil/${id}`, {
      method: "PUT",
      body: npart,
      headers: {
        "Content-Type": "application/json",
      },
    });
    router.push(`/estimates/${data.value?.estimate_id}`);
  } catch (error) {
    console.error("Error updating oil:", error);
  }
};
</script>

<template>
  <div>
    <h1>Edit Oil Entry</h1>
    <form class="card p-3" @submit.prevent="submitPart">
      <div class="mb-3">
        <label for="type" class="form-label">Type</label>
        <Input
          v-model="part.type"
          type="text"
          id="type"
          class="form-control"
          required />
      </div>
      <div class="mb-3">
        <label for="quantity" class="form-label">Quantity</label>
        <Input
          v-model.number="part.quantity"
          type="number"
          id="quantity"
          class="form-control"
          min="1"
          required />
      </div>
      <div class="mb-3">
        <label for="cost" class="form-label">Cost</label>
        <Input
          v-model.number="part.cost"
          type="number"
          id="cost"
          class="form-control"
          min="0"
          step="0.01"
          @Input="calcPrice"
          required />
      </div>
      <!-- <div class="mb-3">
        <label for="list" class="form-label">List Price</label>
        <Input
          v-model.number="part.list"
          type="number"
          id="list"
          class="form-control"
          min="0"
          step="0.01"
          @Input="calcPrice"
          required />
      </div> -->
      <div class="mb-3">
        <label for="price_per_unit" class="form-label">Price Per Unit</label>
        <Input
          v-model.number="part.price_per_unit"
          type="number"
          id="price_per_unit"
          class="form-control"
          min="0"
          step="0.01" />
      </div>
      <Button type="submit" class="btn btn-primary">Update Oil</Button>
      <Button type="button" class="btn btn-secondary" @click="router.back()"
        >Cancel</Button
      >
    </form>
  </div>
</template>
