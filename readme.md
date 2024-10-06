# Codaco Orchestration Layer

This project implements a simple chatbot server with message evaluation using Codaco. It consists of two main components: a server script (`server.js`) and a test script (`test.js`).

## Overview

### server.js

This is the main server script that handles chatbot interactions. It uses Express.js to create a simple HTTP server with a single endpoint for chatbot interactions. Key features include:

- Chatbot endpoint (`/chatbot`) that accepts user messages
- Integration with Codaco API for message evaluation
- Response improvement based on evaluation results
- Basic error handling and logging

### test.js

This is a simple test script that emulates a user interacting with the chatbot. It sends a single message to the chatbot and logs the response.

### Codaco

Codaco is a service used to evaluate chatbot messages. It provides quality scores and improvement suggestions based on predefined rules. In this project, Codaco is used to:

- Evaluate the quality of chatbot responses
- Provide suggestions for improving responses
- Ensure responses meet minimum quality standards

## Setup and Running

1. Install dependencies:

   ```
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file in the root directory and add your Codaco application token:

   ```
   APPLICATION_TOKEN=your_codaco_token_here
   ```

3. Start the server:

   ```
   npm run dev # or nodemon server.js
   ```

   The server will start running on `http://localhost:3000`.

4. Run the test script:
   ```
   node test.js
   ```
   This will send a test message to the chatbot and log the response.

## Configuration

Reading the `server.js` file should give you a good indication on how to configure the project for your specific use case. In the example application, a `MINIMUM_ACCEPTABLE_SCORE` and `CRITICAL_RULE_IDS` are used to determine if a response is acceptable, but this is merely a simple example.

## Extending the Project

Rather than extending this project, it is advised to integrate Codaco into your existing chatbot system. Since the evaluation is done using a simple API call, you can easily implement your own logic for evaluating chatbot responses in any language or framework.

## Troubleshooting

If you encounter issues:

1. Ensure all dependencies are installed
2. Check that the Codaco API is accessible and your APPLICATION_TOKEN is valid
3. Verify that the server is running on the expected port
4. Make sure you have enabled rules for the application in the Codaco dashboard
5. Check the console for any error messages

For any further questions or issues, please open an issue in the project repository.

## Example scenario

The scenario provided by the orchestration layer is that of a user asking a chatbot what job they should do. The chatbot responds with a suggestion for a fireman. In Codaco, a rule is set to check for non-gender-neutral language and a rule is triggered by the word 'fireman'. The triggered rule does not create a critical violation, but the response can be improved by replacing the word 'fireman' with a more gender-neutral alternative.

- **User**: What job should I do?
- **Chatbot**: May I suggest fireman?
- **Improved message**: May I suggest _firefighter_?

This is a very simple example, but it demonstrates the basic functionality of the orchestration layer. In a real-world scenario the complexity of the chatbot logic and the rules used to evaluate responses would be much more extensive.
