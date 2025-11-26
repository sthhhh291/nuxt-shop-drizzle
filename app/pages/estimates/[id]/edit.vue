<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const estimateId = route.params.id as string;

const isLoading = ref(false);
const isSaving = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const {data, refresh} = await useFetch(`/api/estimates/${estimateId}`, {
  method: "GET",
  server: false,
});

const estimate = computed(() => {
  return data.value && "estimate" in data.value ? data.value.estimate : null;
});

// Form fields - initialize with reactive data
const form = ref({
  car_id: null as number | null,
  employee_id: null as number | null,
  date: "",
  miles: 0,
  hours_taken: 0,
  estimate_type: "",
  public_notes: "",
  private_notes: "",
});

// Watch for estimate data and populate form
watch(estimate, (newEstimate) => {
  if (newEstimate) {
    form.value = {
      car_id: newEstimate.car_id,
      employee_id: newEstimate.employee_id,
      date: newEstimate.date,
      miles: newEstimate.miles,
      hours_taken: newEstimate.hours_taken,
      estimate_type: newEstimate.estimate_type,
      public_notes: newEstimate.public_notes,
      private_notes: newEstimate.private_notes,
    };
  }
}, { immediate: true });

const saveEstimate = async () => {
  isSaving.value = true;
  errorMessage.value = "";
  successMessage.value = "";
  console.log("Saving estimate with data:", form.value);

  try {
    await $fetch(`/api/estimates/${estimateId}`, {
      method: "PUT",
      body: form.value,
    });
    successMessage.value = "Estimate updated successfully.";
    router.push(`/estimates/${estimateId}`);
  } catch (error) {
    console.error("Error updating estimate:", error);
    errorMessage.value = error instanceof Error ? error.message : "Failed to update estimate. Please try again.";
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <UContainer class="py-8">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Edit Estimate #{{ estimateId }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Modify the details of the estimate below.
      </p>
    </div>

    <div v-if="errorMessage" class="mb-4 p-4 bg-red-100 text-red-700 rounded">
      {{ errorMessage }}
    </div>
    <div v-if="successMessage" class="mb-4 p-4 bg-green-100 text-green-700 rounded">
      {{ successMessage }}
    </div>

    <form @submit.prevent="saveEstimate" class="space-y-6">
      <!-- Date -->
      <div>
        <label for="date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
        <input
          type="string"
          id="date"
          v-model="form.date"
          class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white"
          required
        />
      </div>
      
      <!-- Estimate Type -->
      <div>
        <label for="estimate_type" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Estimate Type</label>
        <!-- convert this back to a select later -->
        <input
          type="text"
          id="estimate_type"
          v-model="form.estimate_type"
          class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white"
          required
        />
        <!-- <select
          id="estimate_type"
          v-model="form.estimate_type"
          class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white"
          required
        >
          <option value="">Select Type</option>
          <option value="Repair">Repair</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Warranty">Warranty</option>
          <option value="Inspection">Inspection</option>
        </select> -->
      </div>
      
      <!-- Hours Taken -->
      <div>
        <label for="hours_taken" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Hours Taken</label>
        <input
          type="number"
          step="0.25"
          id="hours_taken"
          v-model.number="form.hours_taken"
          class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white"
          required
        />
      </div>
      
      <!-- Miles -->
      <div>
        <label for="miles" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Miles</label>
        <input
          type="number"
          id="miles"
          v-model.number="form.miles"
          class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white"
          required
        />
      </div>
      
      <!-- Employee ID -->
      <div>
        <label for="employee_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Employee ID</label>
        <input
          type="number"
          id="employee_id"
          v-model.number="form.employee_id"
          class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white"
        />
      </div>
      
      <!-- Public Notes -->
      <div>
        <label for="public_notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Public Notes</label>
        <textarea
          id="public_notes"
          v-model="form.public_notes"
          class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white"
          rows="4"
        ></textarea>
      </div>
      
      <!-- Private Notes -->
      <div>
        <label for="private_notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Private Notes</label>
        <textarea
          id="private_notes"
          v-model="form.private_notes"
          class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white"
          rows="4"
        ></textarea>
      </div>
      
      <div>
        <UButton type="submit" :loading="isSaving" variant="solid" size="lg">
          Save Changes
        </UButton>
      </div>  
    </form>
    </UContainer>
</template>
