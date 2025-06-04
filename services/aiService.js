const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");
const { AWS_REGION, BEDROCK_CLAUDE_MODEL_ID } = require("../config/env");

const client = new BedrockRuntimeClient({ region: AWS_REGION });

const getReply = async (userText) => {
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
            messages: [{
                role: "user",
                content: [
                    {
                        type: "text",
                        text: userText
                    }
                ]
            }]
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
