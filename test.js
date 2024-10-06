import fetch from 'node-fetch';

// This script emulates a single user interaction with the chatbot
async function testChatbot() {
    const userMessage = "What job should I do?";
    const url = `http://localhost:3000/chatbot?message=${encodeURIComponent(userMessage)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('Chatbot response:', data);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testChatbot();