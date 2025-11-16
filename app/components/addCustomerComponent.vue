<script setup lang="ts">
import { z } from "zod";

const customerSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters").max(100),
  last_name: z.string().min(2, "Last name must be at least 2 characters").max(100),
  notes: z.string().max(500, "Notes must be less than 500 characters").optional(),
});

const emit = defineEmits(["customerAdded", "cancel"]);
const isSubmitting = ref(false);
const message = ref<{ type: 'success' | 'error'; text: string } | null>(null);

// Form state
const formState = reactive({
  first_name: "",
  last_name: "",
  notes: "",
});

const addCustomer = async (event: any) => {
  isSubmitting.value = true;
  message.value = null;

  try {
    const validatedData = customerSchema.parse(event.data);
    
    const response = await $fetch("/api/customers", {
      method: "POST",
      body: validatedData,
    });

    message.value = {
      type: 'success',
      text: 'Customer added successfully!'
    };

    // Reset form
    Object.keys(formState).forEach(key => {
      formState[key as keyof typeof formState] = "";
    });

    // Emit success
    setTimeout(() => {
      emit("customerAdded");
    }, 1000);

  } catch (error) {
    console.error("Error adding customer:", error);
    message.value = {
      type: 'error',
      text: error instanceof Error ? error.message : 'Failed to add customer. Please try again.'
    };
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div>
    <UForm 
      :schema="customerSchema" 
      :state="formState" 
      @submit="addCustomer"
      class="space-y-4"
    >
      <UFormGroup label="First Name" name="first_name" required>
        <UInput 
          v-model="formState.first_name" 
          placeholder="Enter first name"
          size="lg"
          :disabled="isSubmitting"
        />
      </UFormGroup>

      <UFormGroup label="Last Name" name="last_name" required>
        <UInput 
          v-model="formState.last_name" 
          placeholder="Enter last name"
          size="lg"
          :disabled="isSubmitting"
        />
      </UFormGroup>

      <UFormGroup label="Notes" name="notes">
        <UTextarea 
          v-model="formState.notes" 
          placeholder="Add any notes about this customer..."
          :rows="3"
          :disabled="isSubmitting"
        />
      </UFormGroup>

      <div class="flex justify-end gap-3 pt-4">
        <UButton 
          color="neutral" 
          variant="ghost" 
          @click="$emit('cancel')"
          :disabled="isSubmitting"
        >
          Cancel
        </UButton>
        <UButton 
          type="submit" 
          color="primary"
          :loading="isSubmitting"
          :disabled="isSubmitting"
        >
          Add Customer
        </UButton>
      </div>
    </UForm>

    <!-- Success/Error Toast -->
    <div v-if="message" class="mt-4">
      <UAlert
        :color="message.type === 'success' ? 'success' : 'error'"
        :title="message.type === 'success' ? 'Success!' : 'Error'"
        :description="message.text"
        :close-button="{ }"
        @close="message = null"
      />
    </div>
  </div>
</template>


