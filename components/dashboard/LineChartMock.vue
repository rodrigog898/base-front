<template>
  <div class="rounded-xl border border-gray-100 bg-white p-5 shadow-card">
    <div class="mb-1">
      <h3 class="text-sm font-semibold text-gray-900">Facturado vs. cobrado</h3>
      <p class="text-xs text-gray-500">Tendencia mensual de los últimos períodos.</p>
    </div>

    <div class="mt-4 flex gap-4">
      <!-- Y-axis labels -->
      <div class="flex flex-col justify-between py-1 text-[10px] text-gray-400">
        <span>1.4k</span>
        <span>1.05k</span>
        <span>700</span>
        <span>350</span>
        <span>0</span>
      </div>

      <!-- Chart area -->
      <div class="relative min-h-[180px] flex-1">
        <!-- Grid lines -->
        <div class="absolute inset-0 flex flex-col justify-between">
          <div v-for="i in 5" :key="i" class="border-t border-gray-100" />
        </div>

        <svg class="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 400 160" preserveAspectRatio="none">
          <!-- Facturado (purple) -->
          <path
            d="M 0,140 C 40,135 60,130 80,125 S 120,100 133,95 S 160,70 200,55 S 240,30 267,25 S 300,15 333,20 S 370,40 400,45"
            fill="none"
            stroke="#8b5cf6"
            stroke-width="2.5"
            stroke-linecap="round"
            vector-effect="non-scaling-stroke"
          />
          <!-- Cobrado (green) -->
          <path
            d="M 0,150 C 40,148 60,145 80,142 S 120,130 133,128 S 160,120 200,115 S 240,105 267,100 S 300,95 333,98 S 370,105 400,108"
            fill="none"
            stroke="#22c55e"
            stroke-width="2.5"
            stroke-linecap="round"
            vector-effect="non-scaling-stroke"
          />
        </svg>

        <!-- X-axis labels -->
        <div class="absolute -bottom-5 left-0 right-0 flex justify-between text-[10px] text-gray-400">
          <span>Feb</span>
          <span>Mar</span>
          <span>Abr</span>
          <span>May</span>
          <span>Jun</span>
          <span>Jul</span>
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div class="mt-8 flex items-center gap-5">
      <div class="flex items-center gap-2">
        <span class="h-2.5 w-2.5 rounded-full bg-brand-500" />
        <span class="text-xs text-gray-600">Facturado</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="h-2.5 w-2.5 rounded-full bg-green-500" />
        <span class="text-xs text-gray-600">Cobrado</span>
      </div>
    </div>
  </div>
</template>
