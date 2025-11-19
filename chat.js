const workflowId = "wf_69155f9dfb9c8190bb1415992d48256c06fb2ddd543a6423";
const workflowVersion = "8";

let session = null;

async function startChat() {
    document.getElementById("status").innerText = "Status: Connecting...";

    session = await window.ChatKit.startSession({
        workflowId,
        version: workflowVersion,
        apiBase: "https://api.openai.com", 
    });

    await session.connect();

    document.getElementById("status").innerText = "Status: Connected. Speak now!";
}

async function stopChat() {
    if (session) {
        await session.disconnect();
        session = null;
    }

    document.getElementById("status").innerText = "Status: Disconnected";
}

document.getElementById("startBtn").addEventListener("click", startChat);
document.getElementById("stopBtn").addEventListener("click", stopChat);
