<template>
  <div class="flex min-h-screen bg-surface-muted">
    <DashboardAppSidebar />
    <div class="flex min-w-0 flex-1 flex-col">
      <DashboardAppHeader />
      <main class="flex-1 overflow-y-auto px-6 pb-6 pt-2 lg:px-8">
        <slot />
      </main>
    </div>
  </div>
</template>
