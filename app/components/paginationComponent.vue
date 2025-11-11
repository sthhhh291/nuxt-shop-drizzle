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
    <div class="pagination">
        <button 
            :disabled="!props.hasPrevPage" 
            @click="goToPage(props.currentPage - 1)"
        >
            Previous
        </button>
        
        <span>Page {{ props.currentPage }} of {{ props.totalPages }}</span>
        
        <button 
            :disabled="!props.hasNextPage" 
            @click="goToPage(props.currentPage + 1)"
        >
            Next
        </button>
    </div>
</template>