// Select all chat items, chat window elements, and message input elements
const chatItems = document.querySelectorAll('.chat-item');
const chatHeaderName = document.querySelector('.chat-header .chat-info span');
const chatMessagesContainer = document.querySelector('.chat-messages');
const messageInput = document.querySelector('.message-input input[type="text"]');
const sendButton = document.querySelector('.message-input button:nth-child(2)'); // Second button is send

// Sample chat data for all listed contacts
const chatData = {
    "Sakwe Jovi": [
        { type: "received", text: "Yo bro hafa", time: "10:21pm" },
        { type: "received", text: "OK", time: "10:21pm" },
        { type: "sent", text: "I dey Massa", time: "10:21pm" }
    ],
    "Weriwoh Naomi": [
        { type: "received", text: "Hello, good day!", time: "1:40pm" },
        { type: "sent", text: "Good day, Naomi!", time: "1:45pm" }
    ],
    "Emile": [
        { type: "received", text: "God bless you", time: "1:40pm" },
        { type: "sent", text: "Thank you, Emile!", time: "1:45pm" }
    ],
    "Babila Ivy Rose": [
        { type: "received", text: "Good morning!", time: "9:15am" },
        { type: "sent", text: "Morning, Ivy!", time: "9:17am" }
    ],
    "Mosco F": [
        { type: "received", text: "Let’s meet later", time: "3:30pm" },
        { type: "sent", text: "Sure, let me know the time.", time: "3:35pm" }
    ],
    "Mr Amstrong": [
        { type: "received", text: "See you soon!", time: "6:00pm" },
        { type: "sent", text: "Looking forward to it!", time: "6:05pm" }
    ]
};

// Function to display chat messages
function displayChat(name) {
    chatMessagesContainer.innerHTML = '';
    chatHeaderName.textContent = name;

    if (chatData[name]) {
        chatData[name].forEach(message => {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', message.type);
            messageDiv.innerHTML = `<p>${message.text}</p><span>${message.time}</span>`;
            chatMessagesContainer.appendChild(messageDiv);
        });
    }
}

// Send message function
function sendMessage() {
    const name = chatHeaderName.textContent;
    const messageText = messageInput.value.trim();
    if (!messageText || !name) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', 'sent');
    messageDiv.innerHTML = `<p>${messageText}</p><span>${currentTime}</span>`;
    chatMessagesContainer.appendChild(messageDiv);
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;

    chatData[name] = chatData[name] || [];
    chatData[name].push({ type: "sent", text: messageText, time: currentTime });
    messageInput.value = '';
}

// Receive message function (simulated)
function receiveMessage(name, text) {
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', 'received');
    messageDiv.innerHTML = `<p>${text}</p><span>${currentTime}</span>`;
    chatMessagesContainer.appendChild(messageDiv);
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;

    chatData[name].push({ type: "received", text: text, time: currentTime });
}

// Add event listeners to each chat item
chatItems.forEach(item => {
    item.addEventListener('click', () => {
        chatItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        const name = item.querySelector('.chat-details p').textContent;
        displayChat(name);
    });
});

// Event listener for the send button
sendButton.addEventListener('click', sendMessage);

// Optional: Send message on Enter key press
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Clear any initial content from the chat header and messages container
chatHeaderName.textContent = '';
chatMessagesContainer.innerHTML = '';

function fetchMessages(sender, receiver) {
    fetch('chat_handler.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            action: 'fetch',
            sender: sender,
            receiver: receiver
        })
    })
    .then(response => response.json())
    .then(data => {
        chatMessagesContainer.innerHTML = '';
        data.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', msg.sender === sender ? 'sent' : 'received');
            messageDiv.innerHTML = `<p>${msg.message}</p><span>${new Date(msg.timestamp).toLocaleTimeString()}</span>`;
            chatMessagesContainer.appendChild(messageDiv);
        });
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    })
    .catch(error => console.error('Error fetching messages:', error));
}

function sendMessage() {
    const messageText = messageInput.value.trim();
    if (!messageText) return;

    const sender = chatHeaderName.textContent; // Assuming sender is the logged-in user
    const receiver = chatHeaderName.textContent; // Set this dynamically based on the active chat

    fetch('chat_handler.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            action: 'send',
            sender: sender,
            receiver: receiver,
            message: messageText
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            fetchMessages(sender, receiver); // Refresh messages after sending
        } else {
            console.error('Error sending message:', data.message);
        }
        messageInput.value = ''; // Clear the input field
    })
    .catch(error => console.error('Error:', error));
}
