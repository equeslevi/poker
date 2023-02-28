<script lang="ts">
    import { onMount } from "svelte";
    import { io } from "socket.io-client";
    import MsgDiv from "$lib/_components/messagediv.svelte";
    import dayjs from "dayjs";

    let chatSocket: any;
    let messages: any[];
    $: messages = [];
    onMount(() => {
        chatSocket = io("http://localhost:5000/");
        chatSocket.on("connect", () => {
            console.log("connected on chatsocket");
        });

        chatSocket.on("new-chat", (args: any) => {
            // ...
            messages = [
                {
                    self: false,
                    time: args.time,
                    message: args.message,
                },
                ...messages,
            ];
        });

        chatSocket.on("self-chat", (args: any) => {
            // ...
            messages = [
                {
                    self: true,
                    time: args.time,
                    message: args.message,
                },
                ...messages,
            ];
        });

        chatSocket.on("disconnect", (reason: any) => {
            console.log(reason);
        });
    });
    let message = "";
    const sendMsg = () => {
        chatSocket.emit("message", message);
        message = "";
    };
</script>

<div>TESTING FOR SOCKET</div>
<div>
    <textarea bind:value={message} />
    <button on:click={sendMsg}>Send</button>
</div>
<div>
    <div class="messageRow">
        {#each messages as message}
            <div class:fromSelf={message.self}>
                <span>{message.time} | </span>{message.message} <span>
                    | {message.time}</span
                >
            </div>
        {/each}
    </div>
</div>

<style lang="scss">
    .messageRow {
        padding: 10px;
        margin: 10px 0;
        border-radius: 10px;
        text-align: left;

        div {
            span:last-child {
                display: none;
            }
        }

        div:nth-child(odd) {
            background-color: #d8d8d8;
        }
        div:nth-child(odd) {
            background-color: #f2f2f2;
        }

        .fromSelf {
            background-color: #e6e6e6;
            text-align: right;

            span:first-child {
                display: none;
            }

            span:last-child {
                display: inline;
            }
        }
    }
</style>
