<template>
  <div class="rounded-xl border border-gray-100 bg-white p-5 shadow-card">
    <div class="mb-4">
      <h3 class="text-sm font-semibold text-gray-900">Resumen financiero</h3>
      <p class="text-xs text-gray-500">Desglose de ingresos y pendientes.</p>
    </div>

    <div class="space-y-4">
      <div class="flex items-center justify-between border-b border-gray-100 pb-3">
        <span class="text-sm text-gray-600">Total facturado</span>
        <span class="text-sm font-semibold text-gray-900">USD 3.326</span>
      </div>
      <div class="flex items-center justify-between border-b border-gray-100 pb-3">
        <span class="text-sm text-gray-600">Total cobrado</span>
        <span class="text-sm font-semibold text-green-600">USD 600</span>
      </div>
      <div class="flex items-center justify-between border-b border-gray-100 pb-3">
        <span class="text-sm text-gray-600">Por cobrar</span>
        <span class="text-sm font-semibold text-red-500">USD 2.726</span>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-600">Tasa de cobranza</span>
        <div class="flex items-center gap-2">
          <div class="h-2 w-24 overflow-hidden rounded-full bg-gray-100">
            <div class="h-full w-[18%] rounded-full bg-brand-500" />
          </div>
          <span class="text-sm font-semibold text-gray-900">18%</span>
        </div>
      </div>
    </div>
  </div>
</template>
