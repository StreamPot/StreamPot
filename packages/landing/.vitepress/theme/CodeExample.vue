<script setup>
import { codeToHtml } from 'shiki'
import { onBeforeMount, ref } from 'vue'

const code = `const client = new StreamPot({
    secret: 'secret',
    baseUrl: 'http://localhost:3000',
})

const clipJob = await client
    .input('https://example.com/input.mp4')
    .setStartTime(1)
    .setDuration(2)
    .output('output.mp4')
    .run()
    
console.log(clipJob)`

const html = ref()

onBeforeMount(async () => {
    html.value = await codeToHtml(code, {
        lang: 'javascript',
        theme: 'synthwave-84'
    })
})
</script>

<template>
    <div class="code" v-html="html"/>
</template>

<style scoped>
.code {
    background-color: #262335;
    color: #d4d4d4;
    padding: 1rem;
    border-radius: 0.5rem;
}
</style>