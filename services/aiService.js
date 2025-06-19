const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");
const { AWS_REGION, BEDROCK_CLAUDE_MODEL_ID } = require("../config/env");

const client = new BedrockRuntimeClient({ region: AWS_REGION });

const formatMessage = (sender, text) => ({
    role: sender === "AI" ? "assistant" : "user",
    content: [{ type: "text", text }]
});
  
const buildPromptFromHistory = (history, scenario) => {
    const base = [
        {
            role: "system",
            content: [{
            type: "text",
            text: `
                You are a supportive, friendly coach helping neurodivergent students (especially those with autism) practice real-world social scenarios.
                
                Each session involves a realistic situation. Based on the difficulty level from 1 to 5, adjust your speaking style:
                
                - Difficulty 1: Use very short, simple sentences. Speak slowly. Repeat or explain ideas gently. Offer lots of encouragement.
                - Difficulty 2: Keep it light and encouraging. Be supportive and help build confidence with simple follow-up questions.
                - Difficulty 3: Use natural conversation flow. Introduce light social complexity (e.g., tone, timing, politeness).
                - Difficulty 4: Ask more challenging or open-ended questions. Simulate real conversations while still being kind.
                - Difficulty 5: Respond like a real person in this role would. Be kind, but avoid extra hints or coaching.
                
                Never explain that you are an AI. Just act as a real person in the chosen scenario.`.trim()
            }]
        },
        {
            role: "user",
            content: [{
                type: "text",
                text: `Scenario: ${scenario.title}\nDifficulty: ${scenario.difficulty}\nDescription: ${scenario.description}`
            }]
        }
    ];
  
    const conversation = history.map(msg => formatMessage(msg.sender, msg.message));
    return [...base, ...conversation];
};
  
const getReply = async (messageHistory, scenario) => {
    const messages = buildPromptFromHistory(messageHistory, scenario);
  
    const command = new InvokeModelCommand({
        modelId: BEDROCK_CLAUDE_MODEL_ID,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: 200,
            top_k: 250,
            stop_sequences: [],
            temperature: 1,
            top_p: 0.999,
            messages
        })
    });
  
    try {
        const response = await client.send(command);
        if (!response.body) throw new Error("No response body from Bedrock");
    
        const result = JSON.parse(new TextDecoder().decode(response.body));
        if (!result?.content || !Array.isArray(result.content)) {
            throw new Error("Malformed response from Bedrock");
        }
  
        return result.content[0]?.text?.trim() || "(No response)";
    } 
    catch (err) {
        console.error("Bedrock AI error:", err);
        return "Sorry, I'm having trouble responding right now.";
    }
};
  
  module.exports = { getReply };
  





