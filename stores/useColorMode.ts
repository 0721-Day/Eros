import { useColorMode } from '@vueuse/core';import { darkTheme, lightTheme } from 'naive-ui';
type ColorMode = 'light' | 'dark' | 'auto';
export default defineStore('useColorMode', () => {
	const cookieSet = useColorMode({
		storageRef: useCookie('colorMode', {
			default() {
				return 'auto';
			},
		}),
		disableTransition: false,
	});

	return {
		value: cookieSet,
		theme: computed(() => {
			return cookieSet.value === 'dark' ? darkTheme : lightTheme;
		}),
		change: (to?: ColorMode) =>
			(cookieSet.value =
				to ?? (cookieSet.value === 'light' ? 'dark' : 'light')),
	};
});
