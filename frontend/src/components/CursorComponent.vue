<template>
	<div>
		<div id="custom-cursor" ref="cursorElement"></div>
	</div>
</template>
  
<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'

const cursorElement = ref<null | HTMLElement>(null);

onMounted(() => {
	// Remove cursor from top most element
	document.getElementsByTagName("html")[0].style.cursor = "none"
	const updateMouse = (e: MouseEvent) => {
		if (cursorElement.value) {
			cursorElement.value.style.left = `${e.clientX}px`;
			cursorElement.value.style.top = `${e.clientY}px`;
		}
	};

	window.addEventListener('mousemove', updateMouse);

	// Make sure to remove the listener when the component is unmounted
	onBeforeUnmount(() => {
		window.removeEventListener('mousemove', updateMouse);
	});
});
</script>
  
<style>
* {
	cursor: none;
}
#custom-cursor {
	position: fixed;
	width: 20px;
	/* Adjust as needed */
	height: 20px;
	/* Adjust as needed */
	background: url('../assets/images/curser_28x32.PNG') no-repeat center center;
	/* Replace with your image path */
	background-size: contain;
	pointer-events: none;
	transform: translate(-50%, -50%);
	/* to center the cursor */
	z-index: 1000;
}
</style>