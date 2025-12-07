<script setup lang="ts">
import type { AdminPanel, Employee, MarkupMatrix } from "~~/db/schema";

// Simple debounce function
function debounce<T extends (...args: any[]) => any>(func: T, wait: number) {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

const toast = useToast();

// Fetch admin settings
const { data: adminSettings, refresh: refreshAdmin } = await useFetch<AdminPanel[]>('/api/admin');
const settings = computed(() => adminSettings.value?.[0]);

// Fetch employees
const { data: employees, refresh: refreshEmployees } = await useFetch<Employee[]>('/api/employees');

// Fetch markup matrix
const { data: markupData, refresh: refreshMarkup } = await useFetch<MarkupMatrix[]>('/api/markup');

// Fetch customers for autocomplete
const customerSearch = ref('');
const customerSearchEdit = ref('');

const { data: customerResults, refresh: refreshCustomers } = await useFetch('/api/customers', {
  query: computed(() => ({ search: customerSearch.value, limit: 50 })),
  immediate: false,
  onRequest({ request, options }) {
    console.log('Fetching customers with params:', options.query);
  },
  onResponse({ response }) {
    console.log('Customer results received:', response._data);
  }
});

const { data: customerResultsEdit, refresh: refreshCustomersEdit } = await useFetch('/api/customers', {
  query: computed(() => ({ search: customerSearchEdit.value, limit: 50 })),
  immediate: false,
  onRequest({ request, options }) {
    console.log('Fetching customers (edit) with params:', options.query);
  },
  onResponse({ response }) {
    console.log('Customer results (edit) received:', response._data);
  }
});

// Initial load
refreshCustomers();
refreshCustomersEdit();

// Debounced search handlers
const debouncedSearchCustomers = debounce(() => {
  console.log('Searching for:', customerSearch.value);
  refreshCustomers();
}, 300);

const debouncedSearchCustomersEdit = debounce(() => {
  console.log('Searching (edit) for:', customerSearchEdit.value);
  refreshCustomersEdit();
}, 300);

const customerOptions = computed(() => {
  const results = customerResults.value?.customers || [];
  console.log('Customer options computed:', results.length, 'customers');
  return results.map((customer: any) => ({
    id: customer.id,
    label: `${customer.first_name} ${customer.last_name}`,
    value: customer.id,
  }));
});

const customerOptionsEdit = computed(() => {
  const results = customerResultsEdit.value?.customers || [];
  console.log('Customer options (edit) computed:', results.length, 'customers');
  return results.map((customer: any) => ({
    id: customer.id,
    label: `${customer.first_name} ${customer.last_name}`,
    value: customer.id,
  }));
});

const selectedCustomer = ref<any>(null);
const selectedCustomerEdit = ref<any>(null);

// Watch for customer selection
watch(selectedCustomer, (customer) => {
  if (customer) {
    newEmployee.value.customer_id = customer.id;
  }
});

watch(selectedCustomerEdit, (customer) => {
  if (customer) {
    editEmployeeForm.value.customer_id = customer.id;
  }
});

// State for editing
const editingAdmin = ref(false);
const adminForm = ref<Partial<AdminPanel>>({});

const editingEmployee = ref<number | null>(null);
const newEmployee = ref<Partial<Employee>>({});
const editEmployeeForm = ref<Partial<Employee>>({});

const editingMarkup = ref<number | null>(null);
const newMarkup = ref<Partial<MarkupMatrix>>({});
const editMarkupForm = ref<Partial<MarkupMatrix>>({});

// Admin Settings Functions
const startEditAdmin = () => {
  if (settings.value) {
    adminForm.value = { ...settings.value };
    editingAdmin.value = true;
  }
};

const saveAdmin = async () => {
  try {
    await $fetch('/api/admin', {
      method: 'PUT',
      body: adminForm.value,
    });
    await refreshAdmin();
    editingAdmin.value = false;
    toast.add({ title: 'Settings updated successfully', color: 'success' });
  } catch (error) {
    toast.add({ title: 'Failed to update settings', color: 'error' });
  }
};

const cancelEditAdmin = () => {
  editingAdmin.value = false;
  adminForm.value = {};
};

// Employee Functions
const addEmployee = async () => {
  try {
    await $fetch('/api/employees', {
      method: 'POST',
      body: newEmployee.value,
    });
    await refreshEmployees();
    newEmployee.value = {};
    toast.add({ title: 'Employee added', color: 'success' });
  } catch (error) {
    toast.add({ title: 'Failed to add employee', color: 'error' });
  }
};

const startEditEmployee = (employee: Employee) => {
  editingEmployee.value = employee.id;
  editEmployeeForm.value = { ...employee };
};

const saveEmployee = async (id: number) => {
  try {
    await $fetch(`/api/employees/${id}`, {
      method: 'PUT',
      body: editEmployeeForm.value,
    });
    await refreshEmployees();
    editingEmployee.value = null;
    toast.add({ title: 'Employee updated', color: 'success' });
  } catch (error) {
    toast.add({ title: 'Failed to update employee', color: 'error' });
  }
};

const deleteEmployee = async (id: number) => {
  if (!confirm('Are you sure you want to delete this employee?')) return;
  
  try {
    await $fetch(`/api/employees/${id}`, { method: 'DELETE' });
    await refreshEmployees();
    toast.add({ title: 'Employee deleted', color: 'success' });
  } catch (error) {
    toast.add({ title: 'Failed to delete employee', color: 'error' });
  }
};

const cancelEditEmployee = () => {
  editingEmployee.value = null;
  editEmployeeForm.value = {};
};

// Markup Functions
const addMarkup = async () => {
  try {
    await $fetch('/api/markup', {
      method: 'POST',
      body: newMarkup.value,
    });
    await refreshMarkup();
    newMarkup.value = {};
    toast.add({ title: 'Markup added', color: 'success' });
  } catch (error) {
    toast.add({ title: 'Failed to add markup', color: 'error' });
  }
};

const startEditMarkup = (markup: MarkupMatrix) => {
  editingMarkup.value = markup.id;
  editMarkupForm.value = { ...markup };
};

const saveMarkup = async (id: number) => {
  try {
    await $fetch(`/api/markup/${id}`, {
      method: 'PUT',
      body: editMarkupForm.value,
    });
    await refreshMarkup();
    editingMarkup.value = null;
    toast.add({ title: 'Markup updated', color: 'success' });
  } catch (error) {
    toast.add({ title: 'Failed to update markup', color: 'error' });
  }
};

const deleteMarkup = async (id: number) => {
  if (!confirm('Are you sure you want to delete this markup rule?')) return;
  
  try {
    await $fetch(`/api/markup/${id}`, { method: 'DELETE' });
    await refreshMarkup();
    toast.add({ title: 'Markup deleted', color: 'success' });
  } catch (error) {
    toast.add({ title: 'Failed to delete markup', color: 'error' });
  }
};

const cancelEditMarkup = () => {
  editingMarkup.value = null;
  editMarkupForm.value = {};
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const formatPercent = (value: number) => {
  return `${(value * 100).toFixed(1)}%`;
};
</script>

<template>
  <UContainer class="py-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
            <UIcon
              name="i-heroicons-cog-6-tooth"
              class="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              Admin Settings
            </h1>
            <p class="text-gray-600 dark:text-gray-400 mt-1">
              Manage shop settings, employees, and pricing
            </p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <!-- Shop Settings -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <UIcon
                    name="i-heroicons-wrench-screwdriver"
                    class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Shop Settings
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Rates and fees
                  </p>
                </div>
              </div>
              <UButton
                v-if="!editingAdmin"
                @click="startEditAdmin"
                icon="i-heroicons-pencil"
                size="sm"
                variant="ghost">
                Edit
              </UButton>
            </div>
          </template>

          <div v-if="settings" class="space-y-4">
            <template v-if="!editingAdmin">
              <div class="space-y-3">
                <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span class="text-gray-600 dark:text-gray-400">Tax Rate:</span>
                  <span class="font-semibold text-gray-900 dark:text-white">
                    {{ formatPercent(settings.tax) }}
                  </span>
                </div>
                <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span class="text-gray-600 dark:text-gray-400">Labor Rate:</span>
                  <span class="font-semibold text-gray-900 dark:text-white">
                    {{ formatCurrency(settings.labor_rate) }}/hr
                  </span>
                </div>
                <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span class="text-gray-600 dark:text-gray-400">Shop Fee Rate:</span>
                  <span class="font-semibold text-gray-900 dark:text-white">
                    {{ formatPercent(settings.shop_fee_rate) }}
                  </span>
                </div>
                <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span class="text-gray-600 dark:text-gray-400">Fee Threshold:</span>
                  <span class="font-semibold text-gray-900 dark:text-white">
                    {{ formatCurrency(settings.shop_fee_threshold) }}
                  </span>
                </div>
              </div>
            </template>

            <template v-else>
              <div class="space-y-4">
                <UFormGroup label="Tax Rate (%)">
                  <UInput
                    v-model.number="adminForm.tax"
                    type="number"
                    step="0.001"
                    placeholder="0.085" />
                </UFormGroup>
                <UFormGroup label="Labor Rate ($/hr)">
                  <UInput
                    v-model.number="adminForm.labor_rate"
                    type="number"
                    step="5"
                    placeholder="125" />
                </UFormGroup>
                <UFormGroup label="Shop Fee Rate (%)">
                  <UInput
                    v-model.number="adminForm.shop_fee_rate"
                    type="number"
                    step="0.001"
                    placeholder="0.03" />
                </UFormGroup>
                <UFormGroup label="Fee Threshold ($)">
                  <UInput
                    v-model.number="adminForm.shop_fee_threshold"
                    type="number"
                    step="10"
                    placeholder="500" />
                </UFormGroup>

                <div class="flex gap-2 pt-2">
                  <UButton @click="saveAdmin" color="primary" block>
                    Save
                  </UButton>
                  <UButton @click="cancelEditAdmin" variant="ghost" block>
                    Cancel
                  </UButton>
                </div>
              </div>
            </template>
          </div>
        </UCard>

        <!-- Employees -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-3">
              <div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <UIcon
                  name="i-heroicons-users"
                  class="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Employees
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ employees?.length || 0 }} employee{{ employees?.length !== 1 ? 's' : '' }}
                </p>
              </div>
            </div>
          </template>

          <div class="space-y-4">
            <!-- Employee List -->
            <div v-if="employees && employees.length > 0" class="space-y-2 max-h-96 overflow-y-auto">
              <div
                v-for="employee in employees"
                :key="employee.id"
                class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <template v-if="editingEmployee === employee.id">
                  <div class="space-y-3">
                    <UFormGroup label="Customer" size="sm">
                      <USelectMenu
                        v-model="selectedCustomerEdit"
                        :options="customerOptionsEdit"
                        searchable
                        placeholder="Search customer..."
                        size="sm"
                        @update:model-value="(val) => editEmployeeForm.customer_id = val?.id"
                        @update:query="(val) => { customerSearchEdit = val; debouncedSearchCustomersEdit(); }" />
                    </UFormGroup>
                    <UFormGroup label="Position" size="sm">
                      <UInput v-model="editEmployeeForm.position" size="sm" />
                    </UFormGroup>
                    <UFormGroup label="Hire Date" size="sm">
                      <UInput v-model="editEmployeeForm.hire_date" type="date" size="sm" />
                    </UFormGroup>
                    <UFormGroup label="Termination Date" size="sm">
                      <UInput v-model="editEmployeeForm.termination_date" type="date" size="sm" />
                    </UFormGroup>
                    <div class="flex gap-2">
                      <UButton @click="saveEmployee(employee.id)" size="sm" color="primary">
                        Save
                      </UButton>
                      <UButton @click="cancelEditEmployee" size="sm" variant="ghost">
                        Cancel
                      </UButton>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">{{ employee.position }}</p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        Customer ID: {{ employee.customer_id }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-500">
                        Hired: {{ employee.hire_date }}
                      </p>
                    </div>
                    <div class="flex gap-1">
                      <UButton
                        @click="startEditEmployee(employee)"
                        icon="i-heroicons-pencil"
                        size="sm"
                        variant="ghost" />
                      <UButton
                        @click="deleteEmployee(employee.id)"
                        icon="i-heroicons-trash"
                        size="sm"
                        color="error"
                        variant="ghost" />
                    </div>
                  </div>
                </template>
              </div>
            </div>

            <!-- Add Employee Form -->
            <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p class="text-sm font-medium text-gray-900 dark:text-white mb-3">Add Employee</p>
              <div class="space-y-3">
                <UFormGroup label="Customer" size="sm">
                  <USelectMenu
                    v-model="selectedCustomer"
                    :options="customerOptions"
                    searchable
                    placeholder="Search customer..."
                    size="sm"
                    @update:model-value="(val) => newEmployee.customer_id = val?.id"
                    @update:query="(val) => { customerSearch = val; debouncedSearchCustomers(); }" />
                </UFormGroup>
                <UFormGroup label="Position" size="sm">
                  <UInput v-model="newEmployee.position" placeholder="Mechanic" size="sm" />
                </UFormGroup>
                <UFormGroup label="Hire Date" size="sm">
                  <UInput v-model="newEmployee.hire_date" type="date" size="sm" />
                </UFormGroup>
                <UButton @click="addEmployee" icon="i-heroicons-plus" block size="sm">
                  Add Employee
                </UButton>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Markup Matrix -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-3">
              <div class="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <UIcon
                  name="i-heroicons-calculator"
                  class="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Parts Markup
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ markupData?.length || 0 }} rule{{ markupData?.length !== 1 ? 's' : '' }}
                </p>
              </div>
            </div>
          </template>

          <div class="space-y-4">
            <!-- Markup List -->
            <div v-if="markupData && markupData.length > 0" class="space-y-2 max-h-96 overflow-y-auto">
              <div
                v-for="markup in markupData"
                :key="markup.id"
                class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <template v-if="editingMarkup === markup.id">
                  <div class="space-y-3">
                    <UFormGroup label="Cost Threshold ($)" size="sm">
                      <UInput v-model.number="editMarkupForm.value" type="number" step="0.01" size="sm" />
                    </UFormGroup>
                    <UFormGroup label="Multiplier" size="sm">
                      <UInput v-model.number="editMarkupForm.multiplier" type="number" step="0.01" size="sm" />
                    </UFormGroup>
                    <div class="flex gap-2">
                      <UButton @click="saveMarkup(markup.id)" size="sm" color="primary">
                        Save
                      </UButton>
                      <UButton @click="cancelEditMarkup" size="sm" variant="ghost">
                        Cancel
                      </UButton>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">
                        {{ formatCurrency(markup.value) }}
                      </p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        {{ markup.multiplier }}x markup
                      </p>
                    </div>
                    <div class="flex gap-1">
                      <UButton
                        @click="startEditMarkup(markup)"
                        icon="i-heroicons-pencil"
                        size="sm"
                        variant="ghost" />
                      <UButton
                        @click="deleteMarkup(markup.id)"
                        icon="i-heroicons-trash"
                        size="sm"
                        color="error"
                        variant="ghost" />
                    </div>
                  </div>
                </template>
              </div>
            </div>

            <!-- Add Markup Form -->
            <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p class="text-sm font-medium text-gray-900 dark:text-white mb-3">Add Markup Rule</p>
              <div class="space-y-3">
                <UFormGroup label="Cost Threshold ($)" size="sm">
                  <UInput
                    v-model.number="newMarkup.value"
                    type="number"
                    step="0.01"
                    placeholder="50.00"
                    size="sm" />
                </UFormGroup>
                <UFormGroup label="Multiplier" size="sm">
                  <UInput
                    v-model.number="newMarkup.multiplier"
                    type="number"
                    step="0.01"
                    placeholder="1.5"
                    size="sm" />
                </UFormGroup>
                <UButton @click="addMarkup" icon="i-heroicons-plus" block size="sm">
                  Add Rule
                </UButton>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>