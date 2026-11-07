<template>
  <div class="rounded-xl border border-gray-100 bg-white p-5 shadow-card">
    <div class="mb-4">
      <h3 class="text-sm font-semibold text-gray-900">Tickets por estado</h3>
      <p class="text-xs text-gray-500">Distribución de incidencias abiertas y cerradas.</p>
    </div>

    <div class="flex items-end justify-around gap-3 px-2" style="height: 160px">
      <div v-for="bar in bars" :key="bar.label" class="flex flex-1 flex-col items-center gap-2">
        <div class="flex w-full flex-1 items-end justify-center">
          <div
            class="w-full max-w-[48px] rounded-t-md transition-all"
            :class="bar.color"
            :style="{ height: `${bar.height}%` }"
          />
        </div>
        <span class="text-[10px] text-gray-500">{{ bar.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const bars = [
  { label: 'Abierto', height: 85, color: 'bg-brand-500' },
  { label: 'En progreso', height: 55, color: 'bg-brand-300' },
  { label: 'Resuelto', height: 70, color: 'bg-green-400' },
  { label: 'Cerrado', height: 40, color: 'bg-gray-300' },
]
</script>
