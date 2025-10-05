package com.email.writer.app;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
@AllArgsConstructor
public class TestController {

    private final EmailGeneratorService emailGeneratorService;

    @GetMapping("/gemini")
    public ResponseEntity<String> testGemini() {
        try {
            System.out.println("🧪 Testing Gemini API...");

            EmailRequest testRequest = new EmailRequest();
            testRequest.setEmailContent("Hello, can we schedule a meeting tomorrow? I want to discuss the new project requirements.");
            testRequest.setTone("professional");

            String result = emailGeneratorService.generateEmailReply(testRequest);
            return ResponseEntity.ok("✅ TEST SUCCESSFUL!\n\nResponse: " + result);
        } catch (Exception e) {
            System.out.println("❌ Test failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body("❌ TEST FAILED: " + e.getMessage());
        }
    }

    @GetMapping("/simple")
    public ResponseEntity<String> simpleTest() {
        return ResponseEntity.ok("✅ Spring Boot is running! Server is working.");
    }
}