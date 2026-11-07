<script setup lang="ts">
definePageMeta({ layout: 'auth', public: true })

const appName = useRuntimeConfig().public.appName
useHead({ title: `Iniciar sesión · ${appName}` })

const auth = useAuth()
const route = useRoute()
const email = ref('')
const password = ref('')
const error = ref<string | null>(null)
const loading = ref(false)

/** Sólo se permiten redirecciones internas (evita open redirect). */
function safeRedirect(value: unknown): string {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : '/'
}

async function submit() {
  error.value = null
  loading.value = true
  try {
    await auth.login(email.value.trim(), password.value)
    password.value = ''
    await navigateTo(safeRedirect(route.query.redirect))
  }
  catch (e) {
    const data = (e as { data?: { message?: string } }).data
    error.value = data?.message ?? 'No pudimos iniciar sesión. Intenta nuevamente.'
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-8 shadow-card">
    <div class="mb-6 flex items-center gap-2.5">
      <div class="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
        {{ appName.charAt(0) }}
      </div>
      <span class="text-lg font-semibold text-gray-900">{{ appName }}</span>
    </div>

    <h1 class="text-xl font-semibold text-gray-900">
      Iniciar sesión
    </h1>
    <p class="mt-1 text-sm text-gray-500">
      Ingresa con tu correo corporativo.
    </p>

    <form class="mt-6 space-y-4" novalidate @submit.prevent="submit">
      <div>
        <label for="email" class="mb-1 block text-xs font-medium text-gray-600">Correo</label>
        <input
          id="email"
          v-model="email"
          type="email"
          autocomplete="username"
          required
          maxlength="254"
          class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        >
      </div>
      <div>
        <label for="password" class="mb-1 block text-xs font-medium text-gray-600">Contraseña</label>
        <input
          id="password"
          v-model="password"
          type="password"
          autocomplete="current-password"
          required
          maxlength="128"
          class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        >
      </div>

      <p v-if="error" role="alert" class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
        {{ error }}
      </p>

      <button
        type="submit"
        :disabled="loading || !email || !password"
        class="w-full rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {{ loading ? 'Ingresando…' : 'Ingresar' }}
      </button>
    </form>
  </div>
</template>
