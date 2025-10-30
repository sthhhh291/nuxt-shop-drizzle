<script setup lang="ts">
const { id } = useRoute().params;
const router = useRouter();
import type { Labor } from "~~/db/schema";
const labor = await useFetch(`/api/labor/${id}`, {
  method: "GET",
});

const laborData = computed(() => {
  return labor.data.value && "labor" in labor.data.value ?
      (labor.data.value.labor as Labor)
    : null;
});
console.log("Fetched labor:", laborData.value);

