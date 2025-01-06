<template>
	<NConfigProvider
		:theme="useColorMode().value === 'dark' ? darkTheme : lightTheme"
	>
		<NGlobalStyle />
		<NModalProvider>
			<NMessageProvider>
				<NLoadingBarProvider>
					<NNotificationProvider>
						<slot />
					</NNotificationProvider>
				</NLoadingBarProvider>
			</NMessageProvider>
		</NModalProvider>
	</NConfigProvider>
</template>

<script setup>
import {
	NConfigProvider,
	NGlobalStyle,
	NModalProvider,
	NMessageProvider,
	NLoadingBarProvider,
	NNotificationProvider,
} from 'naive-ui';

import { darkTheme, lightTheme } from 'naive-ui';
</script>

<style scoped>
/* 这里可以添加样式 */
</style>
