<template>
	<div v-if="showLoadingText">
		<h1 class="loading-text">
			Finding players <span class="loading-dots">{{ animatedDots }}</span>
		</h1>
	</div>
</template>

<script lang="ts">
import { onMounted, ref, computed} from 'vue'

export default {
	name: 'MatchMaking',
	setup() {
		const showLoadingText = ref(true)
		const dotsCount = ref(1);
		const animateDots = () => {
			setInterval(() => {
				dotsCount.value = (dotsCount.value % 3) + 1;
		}, 1000);
	};
	const animatedDots = computed(() => {
		return '.'.repeat(dotsCount.value);
	});
	onMounted(() => {
		animateDots();
	});

	return {
		animatedDots,
		showLoadingText
		};
	},
};
</script>

<style>
.loading-text {
  position: relative;
  color: #134279;
}

.loading-dots {
  display: inline-block;
  font-size: inherit;
  line-height: inherit;
  animation: loadingAnimation 1s infinite;
  opacity: 100%;
  font-size: 40px;
}

@keyframes loadingAnimation {
  100% {
	opacity: 1;
  }
}

.circle-container {
  display: flex;
}

</style>
