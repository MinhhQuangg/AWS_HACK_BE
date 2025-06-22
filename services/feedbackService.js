const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");
const { BEDROCK_CLAUDE_MODEL_ID, AWS_REGION } = require("../config/env");

const client = new BedrockRuntimeClient({ region: AWS_REGION });

const getFeedbackFromAI = async (messages, scenario) => {
    const formattedMessages = messages.map(m => {
        const prefix = m.sender === "AI" ? "Coach" : "User";
        return `${prefix}: ${m.message}`;
    }).join("\n");

    const prompt = `
        You are a social skills coach helping a neurodivergent student improve their conversation skills.

        Analyze the following conversation and give structured feedback based on these 5 criteria:

        1. Clarity of Communication  
        2. Social Appropriateness  
        3. Engagement & Responsiveness  
        4. Emotional Expression  
        5. Confidence & Progress (relative to difficulty level ${scenario.difficulty})

        Respond in JSON format like this:
        {
            "feedback": "Your overall communication was polite and confident...",
            "criteria": {
                "clarity": "Strong",
                "appropriateness": "Good",
                "engagement": "Good",
                "emotion": "Needs Improvement",
                "confidence": "Excellent"
            }
        }

        Scenario: ${scenario.title}
        Description: ${scenario.description}

        Conversation:
        ${formattedMessages}`.trim();
    
    const command = new InvokeModelCommand({
        modelId: BEDROCK_CLAUDE_MODEL_ID,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 500,
        temperature: 0.4,
        messages: [
            {
            role: "user",
            content: [
                {
                type: "text",
                text: prompt
                }
            ]
            }
        ]
        })
    });

    try {
        const response = await client.send(command);
        const result = JSON.parse(new TextDecoder().decode(response.body));

        let feedbackText = result.content[0]?.text?.trim();

        // Remove markdown formatting if it exists
        if (feedbackText.startsWith("```json") || feedbackText.startsWith("```")) {
            feedbackText = feedbackText.replace(/```json|```/g, "").trim();
        }

        return JSON.parse(feedbackText);
    } catch (err) {
        console.error("AI Feedback error:", err);
        return null;
    }
};

module.exports = { getFeedbackFromAI };
