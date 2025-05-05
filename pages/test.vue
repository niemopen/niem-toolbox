
<template>
  <div class="m-5">
    <p class="mb-5"><a href="/">Back</a></p>

    <h2>TEST</h2>

    <pre>
      <code>
{{ JSON.stringify(property, undefined, 2) }}
      </code>
    </pre>
  </div>
</template>

<!-- TODO: Test hosted hydration errors -->

<script setup lang="ts">

definePageMeta({
  layout: "custom"
})

console.log("HERE");

let response = await fetch(Config.baseURL + "stewards/niem/models/model/versions/5.0/properties/nc:PersonGivenName");

let property = "";

if (response.ok) {
  property = await response.json();
}
else {
  console.error("Property request failed", response);
}


</script>