<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
})
</script>

<template>
  <div>
    <!-- Panel header -->
    <div class="mb-6">
      <h2 class="text-lg font-semibold text-gray-900">Panel</h2>
      <p class="mt-0.5 text-sm text-gray-500">
        Vista general de la ocupación, cobranzas y operaciones de tu cartera.
      </p>
    </div>

    <!-- Summary cards -->
    <div class="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
      <DashboardSummaryCard
        title="Ocupación"
        value="60.0%"
        subtitle="3 de 5 unidades ocupadas"
        icon="building"
      />
      <DashboardSummaryCard
        title="Morosidad"
        value="82.0%"
        subtitle="USD 2,726 por cobrar"
        icon="alert"
        variant="danger"
      />
      <DashboardSummaryCard
        title="Cobrado"
        value="USD 600"
        subtitle="de USD 3,326 facturado"
        icon="wallet"
      />
      <DashboardSummaryCard
        title="Tickets abiertos"
        value="5"
        subtitle="Tickets pendientes de resolución"
        icon="ticket"
        variant="danger"
      />
      <DashboardSummaryCard
        title="Reservas pendientes"
        value="0"
        subtitle="Reservas en espera de aprobación"
        icon="calendar"
      />
      <DashboardSummaryCard
        title="Mantenimiento"
        value="1"
        subtitle="Tareas aún pendientes"
        icon="wrench"
        variant="danger"
      />
    </div>

    <!-- Charts row -->
    <div class="mb-6 grid gap-4 lg:grid-cols-2">
      <DashboardLineChartMock />
      <DashboardDonutChartMock />
    </div>

    <!-- Bottom row -->
    <div class="grid gap-4 lg:grid-cols-2">
      <DashboardBarChartMock />
      <DashboardFinancialSummary />
    </div>

    <!-- Page footer -->
    <div class="mt-8 flex items-center justify-between">
      <p class="text-xs text-gray-400">Dashboard del administrador</p>
      <div class="flex items-center gap-1.5">
        <span class="h-1.5 w-6 rounded-full bg-brand-600" />
        <span class="h-1.5 w-1.5 rounded-full bg-gray-300" />
        <span class="h-1.5 w-1.5 rounded-full bg-gray-300" />
      </div>
    </div>
  </div>
</template>
