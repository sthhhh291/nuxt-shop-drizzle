<script setup lang="ts">
import type { customerWithRelations } from "~~/db/schema";

defineProps<{
  customer: customerWithRelations;
}>();

const router = useRouter();
const toast = useToast();
const isDeleting = ref(false);

const deletePhone = async (phoneId: number, phoneNumber: string) => {
  try {
    isDeleting.value = true;
    await $fetch(`/api/phones/${phoneId}`, {
      method: "DELETE",
    });

    toast.add({
      title: "Success!",
      description: `Phone number ${phoneNumber} deleted successfully`,
      color: "green",
    });

    await refreshNuxtData();
  } catch (error) {
    console.error("Error deleting phone:", error);
    toast.add({
      title: "Error",
      description: "Failed to delete phone number",
      color: "red",
    });
  } finally {
    isDeleting.value = false;
  }
};

const deleteEmail = async (emailId: number, emailAddress: string) => {
  try {
    isDeleting.value = true;
    await $fetch(`/api/emails/${emailId}`, {
      method: "DELETE",
    });

    toast.add({
      title: "Success!",
      description: `Email ${emailAddress} deleted successfully`,
      color: "green",
    });

    await refreshNuxtData();
  } catch (error) {
    console.error("Error deleting email:", error);
    toast.add({
      title: "Error",
      description: "Failed to delete email address",
      color: "red",
    });
  } finally {
    isDeleting.value = false;
  }
};

const deleteAddress = async (addressId: number, addressText: string) => {
  try {
    isDeleting.value = true;
    await $fetch(`/api/addresses/${addressId}`, {
      method: "DELETE",
    });

    toast.add({
      title: "Success!",
      description: "Address deleted successfully",
      color: "green",
    });

    await refreshNuxtData();
  } catch (error) {
    console.error("Error deleting address:", error);
    toast.add({
      title: "Error",
      description: "Failed to delete address",
      color: "red",
    });
  } finally {
    isDeleting.value = false;
  }
};

const getPhoneTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "mobile":
      return "i-heroicons-device-phone-mobile";
    case "work":
      return "i-heroicons-building-office";
    case "home":
      return "i-heroicons-home";
    default:
      return "i-heroicons-phone";
  }
};

const getEmailTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "work":
      return "i-heroicons-building-office";
    case "personal":
      return "i-heroicons-user";
    default:
      return "i-heroicons-envelope";
  }
};

const getAddressTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "home":
      return "i-heroicons-home";
    case "work":
      return "i-heroicons-building-office";
    case "billing":
      return "i-heroicons-credit-card";
    case "shipping":
      return "i-heroicons-truck";
    default:
      return "i-heroicons-map-pin";
  }
};
</script>

<template>
  <UCard class="customer-card">
    <!-- Customer Header -->
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <UAvatar
            :alt="`${customer.first_name} ${customer.last_name}`"
            size="lg"
            :ui="{ background: 'bg-primary-500 dark:bg-primary-400' }">
            <template #fallback>
              <span class="text-white font-medium">
                {{ customer.first_name?.charAt(0)
                }}{{ customer.last_name?.charAt(0) }}
              </span>
            </template>
          </UAvatar>

          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ customer.first_name }} {{ customer.last_name }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Customer ID: {{ customer.id }}
            </p>
          </div>
        </div>

        <UButton
          icon="i-heroicons-pencil-square"
          size="sm"
          color="primary"
          variant="ghost"
          @click="router.push(`/customers/edit/${customer.id}`)">
          Edit Customer
        </UButton>
      </div>
    </template>

    <!-- Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Addresses Section -->
      <div class="space-y-4">
        <div class="flex items-center gap-2 mb-3">
          <UIcon
            name="i-heroicons-map-pin"
            class="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h4 class="font-medium text-gray-900 dark:text-white">Addresses</h4>
          <UBadge size="xs" variant="soft">{{
            customer.addresses?.length || 0
          }}</UBadge>
        </div>

        <div v-if="customer.addresses?.length" class="space-y-3">
          <div
            v-for="address in customer.addresses"
            :key="address.id"
            class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <UIcon
                    :name="getAddressTypeIcon(address.address_type)"
                    class="w-4 h-4 text-gray-500" />
                  <UBadge
                    size="xs"
                    :label="address.address_type"
                    variant="soft" />
                </div>

                <p class="text-sm text-gray-900 dark:text-white">
                  {{ address.street }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ address.city }}, {{ address.state }} {{ address.zip_code }}
                </p>
              </div>

              <div class="flex gap-1 ml-2">
                <UButton
                  icon="i-heroicons-pencil-square"
                  size="2xs"
                  color="primary"
                  variant="ghost"
                  @click="router.push(`/addresses/edit/${address.id}`)" />
                <UButton
                  icon="i-heroicons-trash"
                  size="2xs"
                  color="red"
                  variant="ghost"
                  :loading="isDeleting"
                  @click="
                    deleteAddress(
                      address.id,
                      `${address.street}, ${address.city}`
                    )
                  " />
              </div>
            </div>
          </div>
        </div>

        <div
          v-else
          class="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
          No addresses added
        </div>
      </div>

      <!-- Phones Section -->
      <div class="space-y-4">
        <div class="flex items-center gap-2 mb-3">
          <UIcon
            name="i-heroicons-phone"
            class="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h4 class="font-medium text-gray-900 dark:text-white"
            >Phone Numbers</h4
          >
          <UBadge size="xs" variant="soft">{{
            customer.phones?.length || 0
          }}</UBadge>
        </div>

        <div v-if="customer.phones?.length" class="space-y-3">
          <div
            v-for="phone in customer.phones"
            :key="phone.id"
            class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <UIcon
                    :name="getPhoneTypeIcon(phone.phone_type)"
                    class="w-4 h-4 text-gray-500" />
                  <UBadge size="xs" :label="phone.phone_type" variant="soft" />
                </div>

                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ phone.phone_number }}
                </p>
              </div>

              <div class="flex gap-1 ml-2">
                <UButton
                  icon="i-heroicons-pencil-square"
                  size="2xs"
                  color="primary"
                  variant="ghost"
                  @click="router.push(`/phones/edit/${phone.id}`)" />
                <UButton
                  icon="i-heroicons-trash"
                  size="2xs"
                  color="red"
                  variant="ghost"
                  :loading="isDeleting"
                  @click="deletePhone(phone.id, phone.phone_number)" />
              </div>
            </div>
          </div>
        </div>

        <div
          v-else
          class="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
          No phone numbers added
        </div>
      </div>

      <!-- Emails Section -->
      <div class="space-y-4">
        <div class="flex items-center gap-2 mb-3">
          <UIcon
            name="i-heroicons-envelope"
            class="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h4 class="font-medium text-gray-900 dark:text-white"
            >Email Addresses</h4
          >
          <UBadge size="xs" variant="soft">{{
            customer.emails?.length || 0
          }}</UBadge>
        </div>

        <div v-if="customer.emails?.length" class="space-y-3">
          <div
            v-for="email in customer.emails"
            :key="email.id"
            class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <UIcon
                    :name="getEmailTypeIcon(email.email_type)"
                    class="w-4 h-4 text-gray-500" />
                  <UBadge size="xs" :label="email.email_type" variant="soft" />
                </div>

                <p
                  class="text-sm font-medium text-gray-900 dark:text-white break-all">
                  {{ email.email_address }}
                </p>
              </div>

              <div class="flex gap-1 ml-2">
                <UButton
                  icon="i-heroicons-pencil-square"
                  size="2xs"
                  color="primary"
                  variant="ghost"
                  @click="router.push(`/emails/edit/${email.id}`)" />
                <UButton
                  icon="i-heroicons-trash"
                  size="2xs"
                  color="red"
                  variant="ghost"
                  :loading="isDeleting"
                  @click="deleteEmail(email.id, email.email_address)" />
              </div>
            </div>
          </div>
        </div>

        <div
          v-else
          class="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
          No email addresses added
        </div>
      </div>
    </div>

    <!-- Footer with Notes if they exist -->
    <template #footer v-if="customer.notes">
      <div class="flex items-start gap-2">
        <UIcon
          name="i-heroicons-document-text"
          class="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5" />
        <div>
          <h5 class="font-medium text-gray-900 dark:text-white mb-1">Notes</h5>
          <p class="text-sm text-gray-600 dark:text-gray-400">{{
            customer.notes
          }}</p>
        </div>
      </div>
    </template>
  </UCard>
</template>
