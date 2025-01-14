import { clamp } from 'lodash';

type HorizontalOpenDirection = 'left' | 'right';
type VerticalOpenDirection = 'top' | 'bottom';

type _this = {
	close: () => void;
	open: () => void;
};

type UseSiderDragOptions<DragDir extends DragDirection> = {
	// 拖拽方向
	dragDirection: DragDir;
	// 打开方向（根据拖拽方向动态变化）
	openDirection: DragDir extends 'horizontal'
		? HorizontalOpenDirection
		: VerticalOpenDirection;
	// 角度限制（默认 40 度）
	angleThreshold?: number;

	// 最终开关状态计算参数
	switchBoundary?: {
		// 拖拽速度阈值（px/ms）
		speedThreshold?: number;
		// 拖拽距离阈值（%）
		distanceThreshold?: number;
	};

	// 拖拽开始时的回调
	onDragStart?: (this: _this, event: TouchEvent) => void;
	onDragMove?: (
		this: _this,
		result: {
			offsetX: number;
			offsetY: number;
			offsetPer: number;
			initX: number;
			initY: number;
			toward: {
				x: 'left' | 'right';
				y: 'top' | 'bottom';
			};
		},
		event: TouchEvent
	) => void;
	onDragEnd?: (
		this: _this,
		result: {
			offsetPer: number;
			speed: number;
			speedWithAngle: number;
			isOpen: boolean;
			switch: () => void;
		},
		event: TouchEvent
	) => void;
};

type DragDirection = 'horizontal' | 'vertical';

// 参数校验函数
const validateOptions = <DragDir extends DragDirection>(
	options: UseSiderDragOptions<DragDir>
) => {
	const { dragDirection, openDirection, angleThreshold } = options;

	// 校验 dragDirection
	if (dragDirection !== 'horizontal' && dragDirection !== 'vertical') {
		throw new Error(
			`Invalid dragDirection: ${dragDirection}. Must be 'horizontal' or 'vertical'.`
		);
	}

	// 校验 openDirection
	if (dragDirection === 'horizontal') {
		if (openDirection !== 'left' && openDirection !== 'right') {
			throw new Error(
				`Invalid openDirection for horizontal drag: ${openDirection}. Must be 'left' or 'right'.`
			);
		}
	} else if (dragDirection === 'vertical') {
		if (openDirection !== 'top' && openDirection !== 'bottom') {
			throw new Error(
				`Invalid openDirection for vertical drag: ${openDirection}. Must be 'top' or 'bottom'.`
			);
		}
	}

	// 校验 angleThreshold
	if (
		angleThreshold !== undefined &&
		(angleThreshold < 0 || angleThreshold > 90)
	) {
		throw new Error(
			`Invalid angleThreshold: ${angleThreshold}. Must be between 0 and 90 degrees.`
		);
	}

	// 校验 switchBoundary
	if (options.switchBoundary) {
		const { speedThreshold, distanceThreshold } = options.switchBoundary;

		if (speedThreshold !== undefined && speedThreshold < 0) {
			throw new Error(
				`Invalid speedThreshold: ${speedThreshold}. Must be a non-negative number.`
			);
		}

		if (distanceThreshold !== undefined && distanceThreshold < 0) {
			throw new Error(
				`Invalid distanceThreshold: ${distanceThreshold}. Must be a non-negative number.`
			);
		}
	}
};

export const useQQSiderDrag = <DragDir extends DragDirection>(
	options: UseSiderDragOptions<DragDir>
) => {
	// 校验参数
	validateOptions(options);

	const { dragDirection, openDirection, angleThreshold = 40 } = options;
	const isHorizontal = dragDirection === 'horizontal';

	const expansionPer = ref(0); // 当前轴向展开度
	const isDragging = ref(false); // 是否正在拖动
	const isOpen = ref(false); // 是否打开

	// 初始触摸点坐标
	let elAxialSize = 0;
	let initX = 0;
	let initY = 0;
	let startTime = 0;
	let isToward: -1 | 0 | 1 = 0;

	// 偏移量变化
	let offsetX = 0;
	let offsetY = 0;
	let offsetPer = 0;

	// 计算展开度
	const computeExpansionPer = () => {
		// 计算本次移动占的百分比
		offsetPer = ((isHorizontal ? offsetX : offsetY) / elAxialSize) * 100;

		// 计算最终展开度
		expansionPer.value = clamp(
			(isOpen.value ? 100 : 0) + offsetPer,
			0,
			100
		);
	};

	// 计算轴向拖动角度
	const computeAxialDragAngle = (() => {
		if (isHorizontal) {
			return () => Math.atan2(Math.abs(offsetY), Math.abs(offsetX));
		} else {
			return () => Math.atan2(Math.abs(offsetX), Math.abs(offsetY));
		}
	})();

	// 角度限制计算函数
	const isWithinAngleThreshold = () => {
		// 如果之前计算过方向，则直接返回
		if (isToward === -1) return false;
		if (isToward === 1) return true;

		// 计算角度
		let angle = computeAxialDragAngle() * (180 / Math.PI);

		// 如果角度超过阈值，则是为非轴向拖动
		if (angle > angleThreshold) {
			isToward = -1;
			return false;
		}

		// 否则为轴向拖动
		isToward = 1;
		return true;
	};

	const close = () => {
		isOpen.value = false;
		expansionPer.value = 0;
	};

	const open = () => {
		isOpen.value = true;
		expansionPer.value = 100;
	};

	// 获取拖拽方向
	const getToward = (): {
		x: 'left' | 'right';
		y: 'top' | 'bottom';
	} => {
		return {
			x: offsetX > 0 ? 'right' : 'left',
			y: offsetY > 0 ? 'top' : 'bottom',
		};
	};

	const _this = {
		close,
		open,
	};

	const getAxialToward = (() => {
		if (isHorizontal) {
			return () => (offsetX > 0 ? 'right' : 'left');
		} else {
			return () => (offsetY > 0 ? 'top' : 'bottom');
		}
	})();

	const handleDragStart = (event: TouchEvent) => {
		if (isDragging.value) return;

		// 获取拖拽元素的轴向长度
		if (!(event.currentTarget instanceof HTMLElement)) return;
		elAxialSize = isHorizontal
			? event.currentTarget.offsetWidth
			: event.currentTarget.offsetHeight;

		// 记录初始信息
		initX = event.touches[0].clientX;
		initY = event.touches[0].clientY;
		startTime = Date.now();

		// 更新状态
		isDragging.value = true;

		options.onDragStart?.call(_this, event);
	};

	const handleDragMove = (event: TouchEvent) => {
		// 如果不是拖动状态，或标记为非轴向拖动，则忽略
		if (!isDragging.value || isToward === -1) return;

		offsetX = event.touches[0].clientX - initX;
		offsetY = event.touches[0].clientY - initY;

		// 如果角度超过阈值，忽略本轮拖动
		if (!isWithinAngleThreshold()) return;

		// 阻止默认行为
		event.preventDefault();

		// 计算
		computeExpansionPer();

		options.onDragMove?.call(
			_this,
			{
				offsetPer,
				offsetX,
				offsetY,
				initX,
				initY,
				toward: getToward(),
			},
			event
		);
	};

	// 拖拽结束
	const handleDragEnd = (event: TouchEvent) => {
		isDragging.value = false;
		if (isToward == -1) {
			isToward = 0;
			return;
		}
		isToward = 0;

		// 计算拖拽时间
		const deltaTime = Date.now() - startTime;
		// 计算(无角度)拖拽速度 (px/ms)
		const speed = (isHorizontal ? offsetX : offsetY) / deltaTime;
		// 计算携带角度的速度 (px/ms)
		const speedWithAngle =
			Math.sqrt(offsetX ** 2 + offsetY ** 2) / deltaTime;

		// 计算
		computeExpansionPer();

		options.onDragEnd?.call(
			_this,
			{
				offsetPer,
				speed,
				speedWithAngle,
				isOpen: isOpen.value,
				switch: computeSwitch(speed),
			},
			event
		);
	};

	const switchBoundary = options.switchBoundary;
	const computeSwitch = (() => {
		// 如果未设置边界，则直接返回
		if (switchBoundary === undefined) return () => () => {};

		const { speedThreshold: st, distanceThreshold: dt } = switchBoundary;

		// 使用 IIFE 优化 shouldTrigger
		const shouldTrigger = (() => {
			// 如果 st 和 dt 都未定义，直接返回 false
			if (st === undefined && dt === undefined) return () => false;

			// 如果只有 st 定义了
			if (st !== undefined && dt === undefined)
				return (speed: number) =>
					Math.abs(speed) > st &&
					(Math.abs(offsetPer) > 5 || Math.abs(offsetPer) < 95);

			// 如果只有 dt 定义了
			if (st === undefined && dt !== undefined)
				return () => Math.abs(offsetPer) > dt;

			// 如果 st 和 dt 都定义了
			return (speed: number) =>
				Math.abs(speed) > st! || Math.abs(offsetPer) > dt!;
		})();

		return (speed: number) => {
			const shouldSave =
				openDirection === 'right' || openDirection === 'bottom'
					? (isOpen.value && speed > 0) ||
						(!isOpen.value && speed < 0)
					: (isOpen.value && speed < 0) ||
						(!isOpen.value && speed > 0);

			if (shouldSave) return isOpen.value ? open : close;

			// 判断是否为关闭方向
			const isClosing = getAxialToward() !== openDirection;
			return shouldTrigger(speed) === isClosing ? close : open;
		};
	})();

	return {
		handles: {
			touchstart: handleDragStart,
			touchmove: handleDragMove,
			touchend: handleDragEnd,
			touchcancel: handleDragEnd,
		},
		close,
		open,
		expansionPer,
		isToward: () => isToward,
		isDragging,
		isOpen,
	};
};
