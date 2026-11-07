<script setup lang="ts">
// El contenido protegido se renderiza sólo con sesión confirmada en el cliente.
const auth = useAuth()
</script>

<template>
  <div class="flex min-h-screen bg-surface-muted">
    <template v-if="auth.isAuthenticated.value">
      <DashboardAppSidebar />
      <div class="flex min-w-0 flex-1 flex-col">
        <DashboardAppHeader />
        <main class="flex-1 overflow-y-auto px-6 pb-6 pt-2 lg:px-8">
          <slot />
        </main>
      </div>
    </template>
    <div v-else class="flex flex-1 items-center justify-center" aria-busy="true">
      <span class="h-6 w-6 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
    </div>
  </div>
</template>
