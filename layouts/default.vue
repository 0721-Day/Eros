<template>
	<ProvidersNaiveUI>
		<NLayout
			class="h-screen w-screen"
			content-class="flex flex-col relative"
		>
			<NLayoutHeader>
				<NFlex justify="space-between">
					<NFlex>
						<NButton
							:strong="true"
							:secondary="true"
							:circle="true"
						>
							<Icon
								name="ic:round-account-circle"
								size="1.25em"
							/>
						</NButton>
					</NFlex>
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
								size="1.25em"
							/>
						</NButton>
						<NButton
							:strong="true"
							:secondary="true"
							:circle="true"
						>
							<Icon name="ic:round-group" size="1.25em" />
						</NButton>
					</NFlex>
				</NFlex>
			</NLayoutHeader>
			<NLayoutContent class="bg-blue-500 h-full overflow-auto">
			</NLayoutContent>
		</NLayout>

		<!--左侧侧滑-->
		<NLayout class="h-screen w-screen absolute top-0 left-0 " style="transform: translateX(-100%);">

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
