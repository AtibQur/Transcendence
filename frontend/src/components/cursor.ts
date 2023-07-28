import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useMousePosition(cb: (cursorX: number, cursorY: number) => void) {
	const cursorX = ref(0);
	const cursorY = ref(0);
  
	const updateMouse = (e: MouseEvent) => {
		cursorX.value = e.clientX;
		cursorY.value = e.clientY;
		cb(cursorX.value, cursorY.value)
	};
  
	onMounted(() => {
		window.addEventListener('mousemove', updateMouse);
	});
  
	onBeforeUnmount(() => {
		window.removeEventListener('mousemove', updateMouse);
	});
  
	return { cursorX, cursorY}
}