
<template>
  <UButton id="scroll-top" color="neutral" variant="outline" class="rounded-full" :ui="ui" @click="scrollTop" aria-label="Scroll to top of page">
    <UIcon :name="Icons.up" aria-hidden="true"/>
  </UButton>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

let scrollButton: HTMLElement;

onMounted(() => {
  // Hide the scroll-top button and set the event listener
  scrollButton = document.getElementById("scroll-top") as HTMLElement;
  scrollButton.style.display = "none";
  window.addEventListener("scroll", updateVisibility);
});

/**
 * Display the scroll-top button to return to the top of the page
 * if the user is no longer at the top; hide otherwise.
 */
function updateVisibility() {
  scrollButton.style.display = window.scrollY > 0 ? "block" : "none";
}

function scrollTop() {
  window.scroll({
    top: 0,
    left: 0,
    behavior: "smooth"
  });
}

const ui = {
  base: "-ml-[50px] fixed top-[70%] z-20"
}

</script>
