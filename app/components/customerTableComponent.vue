<script setup lang="ts">
import type { customerWithRelations } from "~~/db/schema";

const props = defineProps<{
  customer: customerWithRelations;
}>();

const columns = computed(() => {
  const baseColumns = [
    { key: "first_name", label: "First Name" },
    { key: "last_name", label: "Last Name" },
    { key: "phones", label: "Phone Numbers" },
    { key: "emails", label: "Emails" },
    { key: "notes", label: "Notes" },
  ];
  return baseColumns;
});

const rows = computed(() => [props.customer]);
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center gap-3">
        <UAvatar
          :alt="`${customer.first_name} ${customer.last_name}`"
          size="sm"
          class="bg-primary-500">
          {{ customer.first_name?.[0] }}{{ customer.last_name?.[0] }}
        </UAvatar>
        <div>
          <h3 class="font-semibold">Customer Details</h3>
          <p class="text-sm text-gray-500"
            >{{ customer.first_name }} {{ customer.last_name }}</p
          >
        </div>
      </div>
    </template>

    <UTable
      :columns="columns"
      :rows="rows"
      :empty-state="{
        icon: 'i-heroicons-users-20-solid',
        label: 'No customer data available.',
      }">
      <template #phones-data="{ row }">
        <div class="space-y-1">
          <div
            v-for="phone in row.phones"
            :key="phone.id"
            class="flex items-center gap-2">
            <UBadge
              :color="phone.phone_type === 'mobile' ? 'primary' : 'secondary'"
              variant="soft"
              size="xs">
              {{ phone.phone_type }}
            </UBadge>
            <span class="text-sm">{{ phone.phone_number }}</span>
          </div>
          <span v-if="!row.phones?.length" class="text-gray-400 text-sm"
            >No phones</span
          >
        </div>
      </template>

      <template #emails-data="{ row }">
        <div class="space-y-1">
          <div
            v-for="email in row.emails"
            :key="email.id"
            class="flex items-center gap-2">
            <UBadge
              :color="email.email_type === 'primary' ? 'primary' : 'secondary'"
              variant="soft"
              size="xs">
              {{ email.email_type }}
            </UBadge>
            <span class="text-sm">{{ email.email_address }}</span>
          </div>
          <span v-if="!row.emails?.length" class="text-gray-400 text-sm"
            >No emails</span
          >
        </div>
      </template>

      <template #notes-data="{ row }">
        <div class="max-w-xs">
          <p
            v-if="row.notes"
            class="text-sm text-gray-600 truncate"
            :title="row.notes">
            {{ row.notes }}
          </p>
          <span v-else class="text-gray-400 text-sm">No notes</span>
        </div>
      </template>
    </UTable>
  </UCard>
</template>
