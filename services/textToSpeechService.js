const { PollyClient, StartSpeechSynthesisTaskCommand } = require("@aws-sdk/client-polly");
const { AWS_REGION, S3_BUCKET_NAME } = require("../config/env");

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

module.exports = { synthesizeAndUpload };
