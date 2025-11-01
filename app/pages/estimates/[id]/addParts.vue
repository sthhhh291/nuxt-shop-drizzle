<script setup lang="ts">
const { id } = useRoute().params;
const router = useRouter();
const part = ref({
  description: "",
  quantity: 0,
  cost: 0,
  list: 0,
  unit_price: 0,
  estimate_id: Number(id),
});
const submitPart = async () => {
  const npart = {
    ...part.value,
    quantity: Number(part.value.quantity),
    part_number: "",
    mfr_number: "",
    cost: Number(part.value.cost),
    list: Number(part.value.list),
    unit_price: Number(part.value.unit_price),
    estimate_id: Number(part.value.estimate_id),
  };
  try {
    await useFetch(`/api/parts`, {
      method: "POST",
      body: JSON.stringify(npart),
      headers: {
        "Content-Type": "application/json",
      },
    });
    router.push(`/estimates/${id}`);
  } catch (error) {
    console.error("Error adding part:", error);
  }
};

const calcPrice = () => {
  part.value.cost * 1.86 > part.value.list ?
    (part.value.unit_price = part.value.cost * 1.86)
  : (part.value.unit_price = part.value.list);
  // Implement price calculation logic here if needed
};
</script>

<template>
  <div>
    <h1>Add Part to Estimate {{ id }}</h1>
    <form @submit.prevent="submitPart" class="card p-3">
      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <Input
          type="text"
          class="form-control"
          id="description"
          name="description"
          v-model="part.description"
          required />
      </div>
      <div class="mb-3">
        <label for="quantity" class="form-label">Quantity</label>
        <Input
          type="number"
          class="form-control"
          id="quantity"
          name="quantity"
          v-model="part.quantity"
          @input="calcPrice"
          required />
      </div>
      <div class="mb-3">
        <label for="cost" class="form-label">Cost</label>
        <Input
          type="number"
          step="0.01"
          class="form-control"
          id="cost"
          name="cost"
          v-model="part.cost"
          @input="calcPrice"
          required />
      </div>
      <div class="mb-3">
        <label for="list" class="form-label">List</label>
        <Input
          type="number"
          class="form-control"
          id="list"
          name="list"
          v-model="part.list"
          @input="calcPrice"
          readonly />
      </div>
      <div class="mb-3">
        <label for="unit_price" class="form-label">Unit Price</label>
        <Input
          type="number"
          step="0.01"
          class="form-control"
          id="unit_price"
          name="unit_price"
          v-model="part.unit_price"
          required />
      </div>
      <Button type="submit" class="btn btn-primary">Add Part</Button>
    </form>
  </div>
</template>
