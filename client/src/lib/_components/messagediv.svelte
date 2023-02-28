<script lang="ts">
    export let messages: any[] = [];

    $: messages
</script>

{#each messages as message}
    <div>
        {message}
    </div>
{/each}
