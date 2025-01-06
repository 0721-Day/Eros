<template>
	<ProvidersNaiveUI class="flex flex-col relative h-screen w-screen">
		<NLayout>
			<NLayoutHeader>
				<NFlex justify="space-between">
					<NFlex> </NFlex>
					<div></div>
					<NFlex>
						<NButton
							:strong="true"
							:secondary="true"
							:circle="true"
							@click="() => colorMode.change()"
						>
							<Icon
								:name="
									colorMode.value === 'dark'
										? 'ic:round-dark-mode'
										: 'ic:round-wb-sunny'
								"
							/>
						</NButton>
						<NButton
							:strong="true"
							:secondary="true"
							:circle="true"
						>
							<Icon name="ic:round-group" />
						</NButton>
					</NFlex>
				</NFlex>
			</NLayoutHeader>
			<NLayoutContent class="h-full overflow-auto">
				<slot />
			</NLayoutContent>
		</NLayout>
	</ProvidersNaiveUI>
</template>

<script lang="ts" setup>
import {
	NButton,
	NFlex,
	NLayout,
	NLayoutContent,
	NLayoutHeader,
} from 'naive-ui';

const colorMode = useColorMode();
</script>

<style>
.n-layout-header,
.n-layout-footer {
	background: rgba(128, 128, 128, 0.1);
	padding: 12px;
}
</style>
