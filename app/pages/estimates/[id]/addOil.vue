<script setup lang="ts">
import { z } from "zod";
const { id } = useRoute().params;
const router = useRouter();
const part = ref({
  type: "",
  quantity: 1,
  mfr_number: "",
  part_number: "",
  cost: 0,
  list: 0,
  price_per_unit: 0,
  estimate_id: Number(id),
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

const submitPart = async () => {
  const npart = partSchema.parse({
    type: part.value.type,
    quantity: Number(part.value.quantity),
    mfr_number: "",
    part_number: "",
    cost: Number(part.value.cost),
    list: Number(part.value.list),
    price_per_unit: Number(part.value.price_per_unit),
    estimate_id: Number(part.value.estimate_id),
  });
  try {
    await useFetch(`/api/oil`, {
      method: "POST",
      body: npart,
      headers: {
        "Content-Type": "application/json",
      },
    });
    router.push(`/estimates/${id}`);
  } catch (error) {
    console.error("Error adding oil:", error);
  }
};

const calcPrice = () => {
  // const compare = part.value.cost * 1.86;
  part.value.cost * 1.86 > part.value.list ?
    (part.value.price_per_unit = part.value.list)
  : (part.value.price_per_unit = parseFloat(
      (part.value.cost * 1.86).toFixed(2)
    ));
  // Implement price calculation logic here if needed
};
</script>

<template>
  <div>
    <h1>Add Oil to Estimate {{ id }}</h1>
    <form class="card p-3" @submit.prevent="submitPart">
      <div class="mb-3">
        <label for="type" class="form-label">type</label>
        <Input
          id="type"
          v-model="part.type"
          type="text"
          class="form-control"
          name="type"
          required />
      </div>
      <div class="mb-3">
        <label for="mfr_number" class="form-label">Manufacturer Number</label>
        <Input
          id="mfr_number"
          v-model="part.mfr_number"
          type="text"
          class="form-control"
          name="mfr_number" />
      </div>
      <div class="mb-3">
        <label for="part_number" class="form-label">Part Number</label>
        <Input
          id="part_number"
          v-model="part.part_number"
          type="text"
          class="form-control"
          name="part_number" />
      </div>
      <div class="mb-3">
        <label for="quantity" class="form-label">Quantity</label>
        <Input
          id="quantity"
          v-model="part.quantity"
          type="number"
          class="form-control"
          name="quantity"
          required
          @input="calcPrice" />
      </div>
      <div class="mb-3">
        <label for="cost" class="form-label">Cost</label>
        <Input
          id="cost"
          v-model="part.cost"
          type="number"
          step="0.01"
          class="form-control"
          name="cost"
          required
          @input="calcPrice" />
      </div>
      <div class="mb-3">
        <label for="list" class="form-label">List</label>
        <Input
          id="list"
          v-model="part.list"
          type="number"
          class="form-control"
          name="list"
          @input="calcPrice" />
      </div>
      <div class="mb-3">
        <label for="price_per_unit" class="form-label">Unit Price</label>
        <Input
          id="price_per_unit"
          v-model="part.price_per_unit"
          type="number"
          step="0.01"
          class="form-control"
          name="price_per_unit"
          required />
      </div>
      <Button type="submit" class="btn btn-primary">Add Part</Button>
      <Button @click="router.push(`/estimates/${id}`)">Cancel</Button>
    </form>
  </div>
</template>
