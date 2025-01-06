import { useColorMode } from '@vueuse/core';
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
		change: (to?: ColorMode) =>
			(cookieSet.value =
				to ?? (cookieSet.value === 'light' ? 'dark' : 'light')),
	};
});
