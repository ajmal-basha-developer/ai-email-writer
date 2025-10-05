# 🤖 AI Email Writer Pro

A powerful Chrome extension that integrates AI-powered email reply generation directly into Gmail. Built with Spring Boot and Google Gemini AI with multiple tone options for personalized email responses.

[![Java 17](https://img.shields.io/badge/Java-17-orange)](https://img.shields.io/badge/Java-17-orange) [![Spring Boot 3.2](https://img.shields.io/badge/Spring%20Boot-3.2-green)](https://img.shields.io/badge/Spring%20Boot-3.2-green) [![Chrome Extension MV3](https://img.shields.io/badge/Chrome%20Extension-MV3-blue)](https://img.shields.io/badge/Chrome%20Extension-MV3-blue) [![AI-Powered](https://img.shields.io/badge/AI-Powered-purple)](https://img.shields.io/badge/AI-Powered-purple) [![License MIT](https://img.shields.io/badge/License-MIT-lightgrey)](https://img.shields.io/badge/License-MIT-lightgrey)

---

## ✨ Features

* 🎭 **5 Tone Options**: Professional, Friendly, Casual, Enthusiastic, Empathetic
* ⚡ **Real-time Generation**: Instant AI replies directly in Gmail
* 🎨 **Beautiful UI**: Futuristic design with smooth animations and hover effects
* 🔒 **Secure**: No data stored, all processing happens locally
* 🚀 **One-Click Operation**: Simple and intuitive user interface
* 📧 **Gmail Integrated**: Seamlessly works within Gmail's compose window

---

## 🎭 Tone Options

| Tone | Emoji | Description |
|------|-------|-------------|
| Professional | 💼 | Formal, business-appropriate language |
| Friendly     | 😊 | Warm, approachable, and casual |
| Casual       | 👋 | Relaxed, informal, and conversational |
| Enthusiastic | 🎉 | Energetic, positive, and excited |
| Empathetic   | 🤗 | Understanding, supportive, and caring |

---

## 🏗️ Architecture

`Chrome Extension (Frontend) → Spring Boot API (Backend) → Google Gemini AI`

---

## 🚀 Complete Setup Guide

### Prerequisites

* Java 17 or higher
* Maven
* Chrome Browser
* Google Gemini API Key

### Step 1: Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy your API key

### Step 2: Configure Backend

#### Create `backend/src/main/resources/application.properties`
```properties
spring.application.name=email-writer-sb
gemini.api.url=
gemini.api.key=
server.port=
logging.level.com.email.writer=DEBUG
```

> Replace `YOUR_ACTUAL_API_KEY_HERE` with your real Gemini API key

#### Run the Backend
```bash
cd backend
./mvnw spring-boot:run
```

Verify it's running: [http://localhost:8080/api/test/simple](http://localhost:8080/api/test/simple)

### Step 3: Install Chrome Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `chrome-extension/` folder from this project
5. The extension will be installed and ready to use

### Step 4: Usage in Gmail

1. Open Gmail in Chrome
2. Click on any email to view it
3. Click "Reply" to open the compose window
4. Click the "🤖 AI Reply" button in the toolbar
5. Select your preferred tone
6. Watch as AI generates your email reply

---

## 🛠️ Technical Stack

### Backend
* Spring Boot 3 - REST API framework
* WebClient - Reactive web client for API calls
* Google Gemini AI - Advanced language model
* Lombok - Reduced boilerplate code
* Maven - Dependency management

### Frontend
* Chrome Extension MV3
* Vanilla JavaScript
* CSS3 - Advanced animations and gradients
* HTML5 - Modal and UI components

---

## 📁 Project Structure

```
ai-email-writer/
├── backend/                 # Spring Boot Application
│   ├── src/main/java/com/email/writer/
│   │   ├── app/
│   │   │   ├── EmailGeneratorController.java
│   │   │   ├── EmailGeneratorService.java
│   │   │   ├── EmailRequest.java
│   │   │   └── TestController.java
│   │   └── EmailWriterSbApplication.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
├── chrome-extension/        # Chrome Extension Files
│   ├── manifest.json
│   ├── content.js
│   └── content.css
├── README.md
└── .gitignore
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| POST   | /api/email/generate | Generate AI email reply |
| GET    | /api/test/gemini    | Test Gemini API connection |
| GET    | /api/test/simple    | Simple health check |
| GET    | /api/email/health   | Health check endpoint |

### Example Request
```json
POST /api/email/generate
{
  "emailContent": "Hello, can we schedule a meeting tomorrow?",
  "tone": "professional"
}
```

### Example Response
```json
"Thank you for your email. I would be happy to schedule a meeting tomorrow. Please let me know what time works best for you."
```

---

## 🎨 UI Features

* Animated Button with gradient backgrounds
* Smooth Transitions and Hover Effects
* Loading States with Spinner
* Modal Interface for tone selection
* Responsive Design for various Gmail layouts

---

## 🔧 Development

### Build from Source
```bash
cd backend
mvn clean package
# Load the chrome-extension/ folder in Chrome
```

### Run Tests
```bash
cd backend
mvn test
```

---

## 🐛 Troubleshooting

1. **Extension not loading**
   - Check Chrome console (F12)
   - Verify manifest.json
   - Load correct folder
2. **API not responding**
   - Ensure backend running on port 8080
   - Validate Gemini API key
   - Check firewall
3. **No AI Reply button**
   - Reload Gmail
   - Ensure in reply compose window
4. **Authentication errors**
   - Check Gemini API permissions and limits
5. **Button appears but doesn't work**
   - Check console and backend logs
   - Ensure CORS enabled

---

## 🤝 Contributing

1. Fork repository
2. Create branch (`git checkout -b feature-name`)
3. Commit changes (`git commit -m 'message'`)
4. Push branch (`git push origin feature-name`)
5. Open Pull Request

---

## 📄 License

MIT License. See [LICENSE](https://opensource.org/licenses/MIT) for details.

---

## 🙏 Acknowledgments

* Google Gemini AI
* Spring Boot Team
* Chrome Extensions Team

---

## 🔒 Security

* No API keys committed
* Local processing only
* No user data stored
* Environment variables for sensitive data

---

## 📞 Support

1. Check troubleshooting section
2. Open an issue on GitHub
3. Include environment details and error logs

---

## 🎯 Quick Commands

### Run Backend
```bash
cd backend
./mvnw spring-boot:run
```

### Test Endpoints
```bash
curl http://localhost:8080/api/test/simple
curl http://localhost:8080/api/test/gemini
```

### Build & Test
```bash
mvn clean package
mvn test
```

---

## 🚀 Built with ❤️ for better email productivity

**⭐ If this project helps you, please give it a star!**

---

## 📝 Changelog

### Version 1.0
* 5 tone options
* Styled Chrome extension UI
* Spring Boot backend with Gemini AI
* Real-time Gmail integration
* Secure configuration

### 🌟 Future Enhancements
* Multi-language support
* Email summarization
* Custom tone training
* Batch email processing
* Advanced formatting options

**Happy Emailing! ✉️🚀**

