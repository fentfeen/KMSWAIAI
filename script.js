document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

async function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    if (!message) return;

    appendMessage('You: ' + message, 'user-message');
    input.value = '';

    // Send message to the AI server
    const response = await fetch('http://127.0.0.1:8000/chat/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: message })
    });

    // Process streaming response
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let done = false;
    let aiResponse = '';

    // Read response data and append to messages
    while (!done) {
        const { done: streamDone, value } = await reader.read();
        done = streamDone;
        aiResponse += decoder.decode(value, { stream: true });
        // Update the AI message in the chat area
        appendMessage('AI: ' + aiResponse, 'ai-message');
    }
}

function appendMessage(message, className) {
    const messagesDiv = document.getElementById('messages');
    const newMessageDiv = document.createElement('div');
    newMessageDiv.innerText = message;
    newMessageDiv.classList.add('message', className);
    messagesDiv.appendChild(newMessageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto-scroll to the bottom
}
