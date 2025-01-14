<template>
	<ProvidersNaiveUI>
		<!-- 主页面 -->
		<NLayout
			class="h-screen w-screen"
			content-class="flex flex-col relative"
			@="drag.handles"
		>
			<NLayoutHeader
				:style="{
					padding: `${drag.expansionPer.value * 0.09 + 12}px`,
					paddingBottom: `12px`,
					transition: 'padding 0.3s ease',
				}"
			>
				<NFlex justify="space-between" class="items-center">
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
					<NFlex justify="center">11</NFlex>
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
				<div
					style="
						height: 2000px;
						background: linear-gradient(blue, pink);
					"
				></div>
			</NLayoutContent>
		</NLayout>

		<!-- 遮罩 -->
		<Transition>
			<div
				v-if="drag.expansionPer.value > 1 || drag.isOpen.value"
				class="absolute top-0 left-0 w-screen h-screen bg-black"
				:style="{
					'--tw-bg-opacity': drag.expansionPer.value / 100 / 2.7,
				}"
			></div>
		</Transition>
		<!-- 侧边栏 -->
		<NLayout
			class="h-screen w-full absolute top-0 left-0"
			:style="{
				transform: `translateX(${drag.expansionPer.value - 100}%)`,
				transition: drag.isDragging.value
					? 'none'
					: 'transform 0.3s ease',
			}"
			@="drag.handles"
		>
			<!-- 侧边栏内容 -->
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

// 使用 useDrag 钩子来处理拖拽事件
const drag = useQQSiderDrag({
	dragDirection: 'horizontal',
	openDirection: 'right',
	switchBoundary: {
		speedThreshold: 0.3,
		distanceThreshold: 40,
	},
	onDragEnd(result) {
		result.switch();
	},
});
</script>

<style scoped>
.n-layout-header,
.n-layout-footer {
	background: rgba(128, 128, 128, 0.1);
	padding: 12px;
}

.v-enter-active,
.v-leave-active {
	transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
}
</style>

<style>
body {
	overscroll-behavior: none;
}
</style>
