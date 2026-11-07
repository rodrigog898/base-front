<script setup lang="ts">
const { appName, appVersion } = useRuntimeConfig().public

const navItems = [
  { label: 'Dashboard', icon: 'grid', active: true },
  { label: 'Asistente', icon: 'sparkles' },
  { label: 'Edificios', icon: 'building' },
  { label: 'Personas', icon: 'users' },
  { label: 'Finanzas', icon: 'chart' },
  { label: 'Pagos', icon: 'wallet' },
  { label: 'Incidencias', icon: 'alert' },
  { label: 'Reportes', icon: 'report' },
  { label: 'Mantenimiento', icon: 'wrench' },
  { label: 'Horas', icon: 'clock' },
  { label: 'Compras', icon: 'cart' },
  { label: 'Reservas', icon: 'calendar' },
  { label: 'Comunicación', icon: 'chat' },
  { label: 'Juntas', icon: 'meeting' },
  { label: 'Documentos', icon: 'document' },
  { label: 'Configurar', icon: 'settings' },
]
</script>

<template>
  <aside class="flex w-60 shrink-0 flex-col border-r border-gray-200/80 bg-white">
    <!-- Logo -->
    <div class="flex items-center gap-2.5 px-5 py-5">
      <div class="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600">
        <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      </div>
      <span class="text-lg font-semibold text-gray-900">{{ appName }}</span>
    </div>

    <!-- Entity selector -->
    <div class="mx-4 mb-4">
      <button
        type="button"
        class="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/80 px-3 py-2.5 text-left transition hover:bg-gray-50"
      >
        <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-100">
          <svg class="h-4 w-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
          </svg>
        </div>
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-medium text-gray-900">Administradora Mir...</p>
          <p class="text-xs text-gray-500">Condominio activo</p>
        </div>
        <svg class="h-4 w-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 15L12 18.75 15.75 15M8.25 9L12 5.25 15.75 9" />
        </svg>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
      <a
        v-for="item in navItems"
        :key="item.label"
        href="#"
        class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition"
        :class="item.active
          ? 'bg-brand-50 text-brand-700'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
      >
        <DashboardNavIcon :name="item.icon" :active="item.active" />
        {{ item.label }}
      </a>
    </nav>

    <!-- Footer -->
    <div class="border-t border-gray-100 px-5 py-4">
      <p class="text-xs text-gray-400">{{ appName }} · v{{ appVersion }}</p>
    </div>
  </aside>
</template>
