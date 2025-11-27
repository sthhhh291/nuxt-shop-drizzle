<script setup lang="ts">
const { session, loading, user, isAuthenticated } = useBetterAuth();
const config = useRuntimeConfig();

// Development mode: bypass auth
const isDevelopment = config.public.disableAuth;
const devBypassAuth = computed(() => isDevelopment || isAuthenticated.value);

// Sidebar state
const isSidebarOpen = ref(false);
const isSidebarCollapsed = ref(false);
const isMobile = ref(false);

// Create a reactive key that changes when auth state changes
const authKey = computed(
  () => `${devBypassAuth.value}-${user.value?.id || "dev"}-${loading.value}`
);

// Add a small delay before showing unauthenticated state to prevent flicker
const showUnauthenticated = ref(false);
watch(
  [loading, isAuthenticated],
  ([newLoading, newAuth]) => {
    if (!newLoading && !newAuth && !isDevelopment) {
      setTimeout(() => {
        showUnauthenticated.value = true;
      }, 200);
    } else {
      showUnauthenticated.value = false;
    }
  },
  { immediate: true }
);

// Navigation items
const navigationItems = [
  {
    label: "Dashboard",
    icon: "i-heroicons-home",
    to: "/",
  },
  {
    label: "Customers",
    icon: "i-heroicons-users",
    to: "/customers",
  },
  {
    label: "Cars",
    icon: "i-heroicons-truck",
    to: "/cars",
  },
  {
    label: "Addresses",
    icon: "i-heroicons-map-pin",
    to: "/addresses",
  },
  {
    label: "Estimates",
    icon: "i-heroicons-document-text",
    to: "/estimates",
  },
  {
    label: "Reports",
    icon: "i-heroicons-chart-bar",
    to: "/reports",
  },
  {
    label: "Quick Estimate",
    icon: "i-heroicons-lightning-bolt",
    to: "/estimates/calculate",
  },
];

// Minimal logging only for authentication changes (not on every render)
watch(devBypassAuth, (newAuth, oldAuth) => {
  if (oldAuth !== undefined && oldAuth !== newAuth) {
    console.log(
      "Auth status changed:",
      newAuth,
      isDevelopment ? "(dev mode)" : ""
    );
  }
});

// Close sidebar on route change for mobile
const route = useRoute();
watch(
  () => route.path,
  () => {
    if (isMobile.value) {
      isSidebarOpen.value = false;
    }
  }
);

// Check if current route is active
const isActiveRoute = (routePath: string) => {
  if (routePath === "/") {
    return route.path === "/";
  }
  return route.path.startsWith(routePath);
};

// Handle window resize for responsive behavior
onMounted(() => {
  const handleResize = () => {
    isMobile.value = window.innerWidth < 1024;
    if (!isMobile.value) {
      isSidebarOpen.value = false;
    }
  };

  handleResize();
  window.addEventListener("resize", handleResize);

  onUnmounted(() => {
    window.removeEventListener("resize", handleResize);
  });
});
</script>

<template>
  <div :key="authKey" class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <UIcon
          name="i-heroicons-arrow-path"
          class="animate-spin text-3xl text-primary-500 mb-4" />
        <p class="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>

    <!-- Unauthenticated State -->
    <div
      v-else-if="!devBypassAuth && showUnauthenticated"
      class="min-h-screen flex items-center justify-center">
      <UCard class="w-full max-w-md">
        <div class="text-center space-y-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Shop Management
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              Please sign in to continue
            </p>
          </div>

          <div class="space-y-3">
            <UButton
              block
              to="/auth/login"
              icon="i-heroicons-arrow-right-on-rectangle">
              Sign In
            </UButton>

            <UButton
              block
              variant="outline"
              to="/auth/signup"
              icon="i-heroicons-user-plus">
              Sign Up
            </UButton>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Development Mode Banner -->
    <div
      v-if="isDevelopment"
      class="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-black text-center py-1 text-xs font-medium">
      🔓 Development Mode - Authentication Disabled
    </div>

    <!-- Authenticated Sidebar Layout -->
    <div v-else class="flex min-h-screen" :class="{ 'pt-6': isDevelopment }">
      <!-- Sidebar -->
      <aside
        class="fixed inset-y-0 left-0 z-40 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-all duration-200 ease-in-out lg:static lg:inset-0"
        :class="{
          'translate-x-0': isSidebarOpen,
          '-translate-x-full': !isSidebarOpen,
          'top-6': isDevelopment,
          'w-64': !isSidebarCollapsed,
          'w-16': isSidebarCollapsed && !isMobile,
          'lg:translate-x-0': !isMobile,
        }"
        :style="isDevelopment ? { top: '24px' } : {}">
        <!-- Sidebar Header -->
        <div
          class="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700"
          :class="{ 'px-3': isSidebarCollapsed }">
          <div class="flex items-center gap-2 overflow-hidden">
            <UIcon
              name="i-heroicons-wrench-screwdriver"
              class="text-2xl text-primary-600 dark:text-primary-400 shrink-0" />
            <h1
              v-show="!isSidebarCollapsed"
              class="text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">
              Shop Manager
            </h1>
          </div>

          <!-- Close button for mobile -->
          <UButton
            variant="ghost"
            size="sm"
            icon="i-heroicons-x-mark"
            class="lg:hidden"
            @click="isSidebarOpen = false" />

          <!-- Collapse button for desktop -->
          <UButton
            v-show="!isMobile"
            variant="ghost"
            size="sm"
            :icon="
              isSidebarCollapsed ?
                'i-heroicons-chevron-right'
              : 'i-heroicons-chevron-left'
            "
            class="hidden lg:block"
            @click="isSidebarCollapsed = !isSidebarCollapsed" />
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <NuxtLink
            v-for="item in navigationItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 group relative"
            :class="[
              isActiveRoute(item.to) ?
                'bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 border-r-2 border-primary-500'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
              isSidebarCollapsed ? 'justify-center' : '',
            ]">
            <UIcon :name="item.icon" class="text-lg shrink-0" />
            <span v-show="!isSidebarCollapsed">{{ item.label }}</span>

            <!-- Tooltip for collapsed sidebar -->
            <div
              v-if="isSidebarCollapsed"
              class="hidden group-hover:block absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap z-50">
              {{ item.label }}
            </div>
          </NuxtLink>
        </nav>

        <!-- User Section -->
        <div
          class="border-t border-gray-200 dark:border-gray-700 p-4 space-y-3"
          :class="{ 'px-2': isSidebarCollapsed }">
          <!-- Color Mode Toggle -->
          <div
            class="flex items-center justify-between"
            :class="isSidebarCollapsed ? 'justify-center px-0' : 'px-2'">
            <span
              v-show="!isSidebarCollapsed"
              class="text-sm text-gray-600 dark:text-gray-400"
              >Theme</span
            >
            <ClientOnly>
              <UButton
                :icon="
                  $colorMode.value === 'dark' ?
                    'i-heroicons-moon'
                  : 'i-heroicons-sun'
                "
                size="sm"
                color="neutral"
                variant="ghost"
                @click="
                  $colorMode.preference =
                    $colorMode.value === 'dark' ? 'light' : 'dark'
                " />
            </ClientOnly>
          </div>

          <div
            v-if="!isDevelopment"
            class="flex items-center gap-3"
            :class="{ 'flex-col': isSidebarCollapsed }">
            <UAvatar
              :alt="user?.name || user?.email || 'User'"
              size="sm"
              class="bg-primary-500 dark:bg-primary-400">
              {{ (user?.name || user?.email || "U")?.[0]?.toUpperCase() }}
            </UAvatar>

            <div v-show="!isSidebarCollapsed" class="flex-1 min-w-0">
              <p
                class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ user?.name || "User" }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                {{ user?.email }}
              </p>
            </div>
          </div>

          <div
            v-else
            class="flex items-center gap-3"
            :class="{ 'flex-col': isSidebarCollapsed }">
            <UAvatar size="sm" class="bg-yellow-500"> D </UAvatar>

            <div v-show="!isSidebarCollapsed" class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                Dev Mode
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Auth Disabled
              </p>
            </div>
          </div>

          <Signout
            v-if="!isDevelopment && !isSidebarCollapsed"
            class="w-full" />
          <UButton
            v-if="!isDevelopment && isSidebarCollapsed"
            icon="i-heroicons-arrow-right-on-rectangle"
            size="sm"
            color="red"
            variant="ghost"
            class="w-full"
            @click="() => {}" />
        </div>
      </aside>

      <!-- Sidebar Overlay for Mobile -->
      <div
        v-if="isSidebarOpen && isMobile"
        class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
        @click="isSidebarOpen = false" />

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col min-h-screen lg:ml-0">
        <!-- Top Header for Mobile -->
        <header
          class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 lg:hidden"
          :class="{ 'mt-6': isDevelopment }">
          <div class="flex items-center justify-between h-16 px-4">
            <UButton
              variant="ghost"
              icon="i-heroicons-bars-3"
              @click="isSidebarOpen = true">
              Menu
            </UButton>

            <div class="flex items-center gap-2">
              <UIcon
                name="i-heroicons-wrench-screwdriver"
                class="text-xl text-primary-600 dark:text-primary-400" />
              <h1 class="text-lg font-semibold text-gray-900 dark:text-white">
                Shop Manager
              </h1>
            </div>

            <div class="w-16"></div>
            <!-- Spacer for centering -->
          </div>
        </header>

        <!-- Main Content -->
        <main class="flex-1 bg-gray-50 dark:bg-gray-900">
          <NuxtPage />
        </main>
      </div>
    </div>
  </div>
</template>
