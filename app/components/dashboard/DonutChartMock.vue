<template>
  <div class="rounded-xl border border-gray-100 bg-white p-5 shadow-card">
    <div class="mb-1">
      <h3 class="text-sm font-semibold text-gray-900">Ocupación</h3>
      <p class="text-xs text-gray-500">5 unidades en total.</p>
    </div>

    <div class="mt-2 flex items-center justify-center gap-8 py-4">
      <!-- Donut chart -->
      <div class="relative h-36 w-36">
        <svg viewBox="0 0 36 36" class="h-full w-full -rotate-90">
          <!-- Background circle (desocupadas) -->
          <circle
            cx="18"
            cy="18"
            r="14"
            fill="none"
            stroke="#e5e7eb"
            stroke-width="4"
          />
          <!-- Occupied segment (60% = 3/5) -->
          <circle
            cx="18"
            cy="18"
            r="14"
            fill="none"
            stroke="#8b5cf6"
            stroke-width="4"
            stroke-dasharray="52.8 88"
            stroke-linecap="round"
          />
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <span class="text-2xl font-semibold text-gray-900">60%</span>
        </div>
      </div>

      <!-- Legend -->
      <div class="space-y-3">
        <div class="flex items-center gap-2.5">
          <span class="h-3 w-3 rounded-sm bg-brand-500" />
          <div>
            <p class="text-xs font-medium text-gray-700">Ocupadas</p>
            <p class="text-lg font-semibold text-gray-900">3</p>
          </div>
        </div>
        <div class="flex items-center gap-2.5">
          <span class="h-3 w-3 rounded-sm bg-gray-300" />
          <div>
            <p class="text-xs font-medium text-gray-700">Desocupadas</p>
            <p class="text-lg font-semibold text-gray-900">2</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
