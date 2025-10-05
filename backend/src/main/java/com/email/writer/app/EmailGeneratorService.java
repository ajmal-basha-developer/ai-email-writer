package com.email.writer.app;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class EmailGeneratorService {

    private final WebClient webClient;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public EmailGeneratorService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String generateEmailReply(EmailRequest emailRequest) {
        try {
            System.out.println("🚀 Starting email generation...");
            System.out.println("🎭 Requested tone: " + emailRequest.getTone());

            // Build the prompt with tone-specific instructions
            String prompt = buildPrompt(emailRequest);
            System.out.println("📝 Prompt: " + prompt);

            // Craft the request body
            Map<String, Object> requestBody = Map.of(
                    "contents", new Object[] {
                            Map.of("parts", new Object[]{
                                    Map.of("text", prompt)
                            })
                    },
                    "generationConfig", Map.of(
                            "temperature", getTemperatureForTone(emailRequest.getTone()),
                            "topK", 40,
                            "topP", 0.95,
                            "maxOutputTokens", 1024
                    )
            );

            System.out.println("📤 Sending request to Gemini API...");
            System.out.println("🔗 URL: " + geminiApiUrl);
            System.out.println("🔑 API Key: " + geminiApiKey.substring(0, 10) + "***");

            // Make the API call with header authentication
            String response = webClient.post()
                    .uri(geminiApiUrl)
                    .header("Content-Type", "application/json")
                    .header("X-goog-api-key", geminiApiKey)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            System.out.println("✅ Received response from API");

            // Extract and return the response
            String result = extractResponseContent(response);
            System.out.println("📨 Generated reply: " + result);

            return result;

        } catch (Exception e) {
            System.out.println("❌ ERROR: " + e.getMessage());
            e.printStackTrace();
            return "Sorry, I encountered an error while generating your " +
                    (emailRequest.getTone() != null ? emailRequest.getTone() : "professional") +
                    " reply: " + e.getMessage();
        }
    }

    private String extractResponseContent(String response) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(response);

            // Check for API errors
            if (rootNode.has("error")) {
                String errorMsg = rootNode.path("error").path("message").asText();
                System.out.println("❌ API Error: " + errorMsg);
                return "API Error: " + errorMsg;
            }

            // Extract generated text
            JsonNode candidates = rootNode.path("candidates");
            if (candidates.isArray() && candidates.size() > 0) {
                String text = candidates.get(0)
                        .path("content")
                        .path("parts")
                        .get(0)
                        .path("text")
                        .asText("No response generated");

                return text.trim();
            } else {
                return "No response generated from AI";
            }
        } catch (Exception e) {
            System.out.println("❌ Error parsing response: " + e.getMessage());
            return "Error parsing response: " + e.getMessage();
        }
    }

    private String buildPrompt(EmailRequest emailRequest) {
        StringBuilder prompt = new StringBuilder();

        // Base instruction
        prompt.append("You are a professional email assistant. Write an email reply to the following message. ");
        prompt.append("Do not include a subject line. ");
        prompt.append("Keep it concise (2-3 sentences).\n\n");

        // Tone-specific instructions
        String tone = emailRequest.getTone() != null ? emailRequest.getTone().toLowerCase() : "professional";
        prompt.append(getToneSpecificInstructions(tone));

        prompt.append("\nOriginal email:\n");
        prompt.append(emailRequest.getEmailContent());
        prompt.append("\n\nReply:");

        return prompt.toString();
    }

    private String getToneSpecificInstructions(String tone) {
        switch (tone.toLowerCase()) {
            case "professional":
                return "TONE: Professional and formal\n" +
                        "STYLE: Business-appropriate, respectful, clear, and concise\n" +
                        "LANGUAGE: Use formal language, proper grammar, and avoid contractions\n" +
                        "PURPOSE: Maintain professional relationships and clear communication\n\n";

            case "friendly":
                return "TONE: Warm and friendly\n" +
                        "STYLE: Approachable, positive, and engaging\n" +
                        "LANGUAGE: Use contractions, friendly expressions, and positive language\n" +
                        "PURPOSE: Build rapport and maintain positive relationships\n\n";

            case "casual":
                return "TONE: Relaxed and casual\n" +
                        "STYLE: Conversational, informal, and comfortable\n" +
                        "LANGUAGE: Use everyday language, contractions, and friendly expressions\n" +
                        "PURPOSE: Communicate in a relaxed, approachable manner\n\n";

            case "enthusiastic":
                return "TONE: Energetic and enthusiastic\n" +
                        "STYLE: Positive, excited, and motivational\n" +
                        "LANGUAGE: Use exclamation points sparingly, positive adjectives, and energetic phrases\n" +
                        "PURPOSE: Convey excitement and positive energy\n\n";

            case "empathetic":
                return "TONE: Understanding and supportive\n" +
                        "STYLE: Compassionate, caring, and validating\n" +
                        "LANGUAGE: Use supportive phrases, show understanding, and be reassuring\n" +
                        "PURPOSE: Show empathy and build trust\n\n";

            default:
                return "TONE: Professional and balanced\n" +
                        "STYLE: Clear, respectful, and appropriate for business communication\n" +
                        "LANGUAGE: Use standard professional language\n" +
                        "PURPOSE: Effective and clear communication\n\n";
        }
    }

    private double getTemperatureForTone(String tone) {
        if (tone == null) return 0.7;

        switch (tone.toLowerCase()) {
            case "professional":
                return 0.3; // More deterministic for professional tone
            case "friendly":
                return 0.6; // Balanced creativity
            case "casual":
                return 0.8; // More creative for casual tone
            case "enthusiastic":
                return 0.9; // High creativity for enthusiasm
            case "empathetic":
                return 0.5; // Balanced for empathetic tone
            default:
                return 0.7; // Default balanced temperature
        }
    }
}