const { PollyClient, StartSpeechSynthesisTaskCommand } = require("@aws-sdk/client-polly");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { AWS_REGION, S3_BUCKET_NAME } = require("../config/env");
const { v4: uuidv4 } = require("uuid");

const pollyClient = new PollyClient({ region: AWS_REGION });

const synthesizeAndUpload = async (text, voiceId = "Matthew") => {
    const params = {
        OutputFormat: "mp3",
        OutputS3BucketName: S3_BUCKET_NAME,
        Text: text,
        TextType: "text",
        VoiceId: voiceId,
        SampleRate: "22050",
      };


    try {
        const response = await pollyClient.send(new StartSpeechSynthesisTaskCommand(params));
        const audioUrl = response.SynthesisTask?.OutputUri;

        if (!audioUrl) throw new Error("No OutputUri from Polly task");

        return audioUrl;
    } catch (err) {
        console.error("Polly TTS error:", err);
        throw err;
    }
};

// Helper: convert stream to buffer
const streamToBuffer = async (stream) => {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", chunk => chunks.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(chunks)));
        stream.on("error", reject);
    });
};

module.exports = { synthesizeAndUpload };
