import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

// const express = require('express');
// const fetch = require('node-fetch');
const app = express();
const port = 3000;

// Configuration. Use environment variables for sensitive information
const CODACO_API_URL = process.env.CODACO_API_URL || 'http://codaco.ai/api/v1';
// The application token can be found in the 'Applications' tab of the Codaco dashboard
const APPLICATION_TOKEN = process.env.APPLICATION_TOKEN || "Your application token here";

/**
 * Chatbot endpoint: Retrieves and evaluates a response to a user's message
 * @route GET /chatbot
 * @param {string} message - The user's message
 * @returns {Object} JSON object containing the evaluated and potentially improved response
 */
app.get('/chatbot', async (req, res) => {
    try {
        const userMessage = req.query.message;
        if (!userMessage) {
            return res.status(400).json({ error: 'Missing user message' });
        }

        const serverMessage = await getResponse(userMessage);
        const evaluation = await evaluateResponse(userMessage, serverMessage);

        console.log('Evaluation result:', evaluation);

        // Here we're using a simple accept/reject approach
        // You could implement a more nuanced system, such as:
        // 1. Multiple severity levels (e.g., warn, flag, reject)
        // 2. Automatic retry with different parameters
        // 3. Human-in-the-loop for borderline cases
        if (!isResponseAccceptable(evaluation)) {
            // In a production system, you might want to log this event,
            // trigger an alert, or try to generate a new response
            return res.status(400).json({ error: 'Response did not meet quality standards' });
        }

        const improvedResponse = improveResponse(evaluation.rules, serverMessage);
        res.json({ message: improvedResponse });
    } catch (error) {
        console.error('Error in chatbot endpoint:', error);
        // In a real-world application, you might want to:
        // 1. Log the error to a monitoring service (e.g., Sentry, Logstash)
        // 2. Provide a more user-friendly error message
        // 3. Include a request ID for easier debugging
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * Evaluates the chatbot's response using the Codaco API
 * @param {string} userMessage - The original user message
 * @param {string} serverMessage - The chatbot's response
 * @returns {Object} Evaluation results from Codaco
 */
async function evaluateResponse(userMessage, serverMessage) {
    // Note: In a production environment, you'd want to handle network errors,
    // implement retries, and possibly circuit breaking for resilience
    const response = await fetch(`${CODACO_API_URL}/evaluate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${APPLICATION_TOKEN}`,
        },
        body: JSON.stringify({ userMessage, serverMessage }),
    });

    if (!response.ok) {
        // You could implement more sophisticated error handling here, such as:
        // 1. Retrying the request a certain number of times
        // 2. Falling back to a local evaluation method if the API is down
        // 3. Returning a default "safe" response to the user
        throw new Error(`Codaco API error: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Determines if the response meets quality standards
 * @param {Object} evaluation - The evaluation result from Codaco
 * @returns {boolean} True if the response is acceptable, false otherwise
 */
function isResponseAccceptable(evaluation) {
    // This is a simple implementation. You could extend this to:
    // 1. Use different thresholds for different types of conversations
    // 2. Implement a weighted scoring system
    // 3. Use machine learning to dynamically adjust acceptability criteria

    // Example: Minimum acceptable score
    const MINIMUM_ACCEPTABLE_SCORE = 60;
    if (evaluation.scores.overall < MINIMUM_ACCEPTABLE_SCORE) {
        return false;
    }

    // Check for critical rule violations
    // Rule ID's can be found in the Codaco dashboard or using the /api/v1/rules endpoint
    const CRITICAL_RULE_IDS = ['cm0dy8xir000n6ldc0ol0mr5d', 'cm0bnf3xa0001xoj412d0r198'];

    return !evaluation.rules.some(rule => CRITICAL_RULE_IDS.includes(rule.id));
}

/**
 * Improves the response based on evaluation rules
 * @param {Array} rules - The rules from the Codaco evaluation
 * @param {string} serverMessage - The original server message
 * @returns {string} The improved server message
 */
function improveResponse(rules, serverMessage) {
    let improvedMessage = serverMessage;

    for (const rule of rules) {
        if (rule.data && rule.data.suggestions) {
            for (const [sourceWords, replacements] of rule.data.suggestions) {
                // Using regex for more flexible word replacement
                // For more complex cases, consider using a natural language processing library
                // like compromise (nlp) for more contextual replacements
                const regex = new RegExp(sourceWords.join('|'), 'gi');
                improvedMessage = improvedMessage.replace(regex, () =>
                    replacements[Math.floor(Math.random() * replacements.length)]
                );
            }
        }
        // You could extend this function to handle other types of improvements, such as:
        // 1. Adjusting the tone of the message
        // 2. Adding or removing content based on certain rules
        // 3. Restructuring the sentence for clarity
    }

    return improvedMessage;
}

/**
 * Generates a response to the user's message (placeholder function)
 * @param {string} userMessage - The user's message
 * @returns {string} The chatbot's response
 */
async function getResponse(userMessage) {
    // TODO: Implement actual NLP model or chatbot logic
    // This is where you'd integrate your chatbot or language model
    // Options include:
    // 1. Using a pre-trained model like GPT-3 via API
    // 2. Implementing a retrieval-based chatbot using a database of responses
    // 3. Training and deploying your own model using frameworks like TensorFlow or PyTorch
    return "From your message I gather you're trying to find a profession. May I suggest fireman?";
}

app.listen(port, () => {
    console.log(`Chatbot server running at http://localhost:${port}`);
    // In a production environment, you might want to:
    // 1. Implement a health check endpoint
    // 2. Set up monitoring and logging
    // 3. Implement graceful shutdown procedures
});