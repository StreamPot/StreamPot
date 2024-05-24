<script setup>
import { codeToHtml } from 'shiki';
import { onBeforeMount, ref } from 'vue';

const code = `const streampot = new StreamPot({
    secret: 'YOUR_API_KEY',
})

const clipJob = await streampot
    .input('https://example.com/input.mp4')
    .setStartTime(1)
    .setDuration(2)
    .output('output.mp4')
    .run()`;

const html = ref();

onBeforeMount(async () => {
    html.value = await codeToHtml(code, {
        lang: 'javascript',
        theme: 'tokyo-night',
    });
});
</script>

<template>
    <div class="code" v-html="html" />
</template>

<style scoped>
.code {
    background-color: #1a1b26;
    color: #d4d4d4;
    padding: 1rem;
    border-radius: 0.5rem;
}
</style>
