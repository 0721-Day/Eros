// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	devtools: { enabled: true },
	modules: [
		'@nuxtjs/tailwindcss',
		'@vueuse/nuxt',
		'@nuxtjs/device',
		'@logto/nuxt',
		'@nuxt/icon',
		'@pinia/nuxt',
		'@vueuse/nuxt',
	],

	build: {
		// naive-ui 需要这个 不然SSR500
		transpile: process.env.NODE_ENV === 'production' ? ['vueuc'] : [],
	},
});
