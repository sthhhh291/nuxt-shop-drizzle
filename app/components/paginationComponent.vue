<script setup lang="ts">

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    offset: number;
}

const props = defineProps<PaginationProps>();
const emit = defineEmits<{
    (e: 'page-changed', page: number): void;
}>();

const goToPage = (page: number) => {
    if (page >= 1 && page <= props.totalPages) {
        emit('page-changed', page);
    }
};
</script>

<template>
    <div class="flex items-center justify-center gap-4">
        <UButton 
            variant="outline"
            icon="i-heroicons-chevron-left"
            :disabled="!props.hasPrevPage" 
            @click="goToPage(props.currentPage - 1)"
        >
            Previous
        </UButton>
        
        <div class="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <span class="text-sm text-gray-600 dark:text-gray-400">
                Page {{ props.currentPage }} of {{ props.totalPages }}
            </span>
        </div>
        
        <UButton 
            variant="outline"
            trailing-icon="i-heroicons-chevron-right"
            :disabled="!props.hasNextPage" 
            @click="goToPage(props.currentPage + 1)"
        >
            Next
        </UButton>
    </div>
</template>