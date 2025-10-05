console.log("🚀 AI Email Writer Pro - Tone Selection Edition Loaded");

let selectedTone = 'professional'; // Default tone

function createAIButton() {
    const button = document.createElement('div');
    button.className = 'ai-reply-button new'; // Add 'new' class for initial animation
    button.innerHTML = 'AI Reply';
    button.setAttribute('role', 'button');
    button.setAttribute('tabindex', '0');
    button.setAttribute('data-tooltip', '✨ Let AI craft your perfect reply!');
    button.setAttribute('aria-label', 'Generate AI-powered email reply');
    
    // Remove floating animation after first interaction
    setTimeout(() => {
        button.classList.remove('new');
    }, 8000);
    
    return button;
}

function showToneSelectionModal() {
    return new Promise((resolve) => {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'ai-modal-overlay';
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'ai-tone-modal';
        modal.innerHTML = `
            <h3>🎭 Select Email Tone</h3>
            <div class="ai-tone-options">
                <div class="tone-option ${selectedTone === 'professional' ? 'selected' : ''}" data-tone="professional">
                    <div>
                        <span class="tone-emoji">💼</span> Professional
                        <div class="tone-description">Formal, business-appropriate language</div>
                    </div>
                </div>
                <div class="tone-option ${selectedTone === 'friendly' ? 'selected' : ''}" data-tone="friendly">
                    <div>
                        <span class="tone-emoji">😊</span> Friendly
                        <div class="tone-description">Warm, approachable, and casual</div>
                    </div>
                </div>
                <div class="tone-option ${selectedTone === 'casual' ? 'selected' : ''}" data-tone="casual">
                    <div>
                        <span class="tone-emoji">👋</span> Casual
                        <div class="tone-description">Relaxed, informal, and conversational</div>
                    </div>
                </div>
                <div class="tone-option ${selectedTone === 'enthusiastic' ? 'selected' : ''}" data-tone="enthusiastic">
                    <div>
                        <span class="tone-emoji">🎉</span> Enthusiastic
                        <div class="tone-description">Energetic, positive, and excited</div>
                    </div>
                </div>
                <div class="tone-option ${selectedTone === 'empathetic' ? 'selected' : ''}" data-tone="empathetic">
                    <div>
                        <span class="tone-emoji">🤗</span> Empathetic
                        <div class="tone-description">Understanding, supportive, and caring</div>
                    </div>
                </div>
            </div>
            <div class="ai-tone-actions">
                <button class="ai-tone-button secondary" id="ai-tone-cancel">Cancel</button>
                <button class="ai-tone-button primary" id="ai-tone-confirm">Generate Reply</button>
            </div>
        `;
        
        // Add to document
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        // Add event listeners
        const toneOptions = modal.querySelectorAll('.tone-option');
        toneOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove selected class from all options
                toneOptions.forEach(opt => opt.classList.remove('selected'));
                // Add selected class to clicked option
                option.classList.add('selected');
                selectedTone = option.getAttribute('data-tone');
            });
        });
        
        const cancelButton = modal.querySelector('#ai-tone-cancel');
        const confirmButton = modal.querySelector('#ai-tone-confirm');
        
        const cleanup = () => {
            document.body.removeChild(overlay);
        };
        
        cancelButton.addEventListener('click', () => {
            cleanup();
            resolve(null); // Resolve with null to indicate cancellation
        });
        
        confirmButton.addEventListener('click', () => {
            cleanup();
            resolve(selectedTone); // Resolve with selected tone
        });
        
        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                cleanup();
                resolve(null);
            }
        });
        
        // Close on Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                cleanup();
                document.removeEventListener('keydown', handleEscape);
                resolve(null);
            }
        };
        document.addEventListener('keydown', handleEscape);
    });
}

function getEmailContent() {
    const selectors = [
        '.h7',
        '.a3s.aiL',
        '.ii.gt',
        '.adn.ads',
        '[role="main"]',
        '.gs',
        '.a3s'
    ];
    
    for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        for (let i = 0; i < elements.length; i++) {
            const content = elements[i];
            if (content && content.innerText && content.innerText.trim().length > 10) {
                console.log("📧 Found email content with selector:", selector);
                return content.innerText.trim();
            }
        }
    }
    
    console.log("❌ No email content found");
    return "Thank you for your email. I appreciate you reaching out and will respond shortly.";
}

function findComposeToolbar() {
    const selectors = [
        '.gU.Up',
        '.aDh',
        '.btC',
        '[role="toolbar"]',
        '.brC',
        '.oi',
        '.G-Ni.J-J5-Ji'
    ];
    
    for (const selector of selectors) {
        const toolbar = document.querySelector(selector);
        if (toolbar) {
            console.log("🎯 Found toolbar with selector:", selector);
            return toolbar;
        }
    }
    
    console.log("🔍 No toolbar found with standard selectors");
    
    // Fallback: Look for send button and get its parent
    const sendButton = document.querySelector('.T-I.J-J5-Ji.aoO.T-I-atl.L3');
    if (sendButton) {
        let parent = sendButton.parentElement;
        let depth = 0;
        while (parent && depth < 5) {
            if (parent.classList && parent.classList.length > 0) {
                console.log("🎯 Found toolbar via send button parent at depth:", depth);
                return parent;
            }
            parent = parent.parentElement;
            depth++;
        }
        return sendButton.parentElement;
    }
    
    return null;
}

async function generateAIReply(button) {
    try {
        console.log("🎯 Starting AI reply generation with tone:", selectedTone);
        button.innerHTML = 'Thinking...';
        button.classList.add('loading');
        button.setAttribute('disabled', 'true');
        button.setAttribute('aria-label', `AI is generating your ${selectedTone} reply...`);

        const emailContent = getEmailContent();
        console.log("📝 Email content length:", emailContent.length);

        const response = await fetch('http://localhost:8080/api/email/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                emailContent: emailContent,
                tone: selectedTone
            })
        });

        console.log("📡 API response status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Request Failed: ${response.status} - ${errorText}`);
        }

        const generatedReply = await response.text();
        console.log("✅ Generated reply received");

        // Try multiple compose box selectors
        const composeSelectors = [
            '[role="textbox"]',
            '[contenteditable="true"]',
            '.Am.Al.editable',
            '[g_editable="true"]',
            '.aoD.az6'
        ];
        
        let composeBox = null;
        for (const selector of composeSelectors) {
            composeBox = document.querySelector(selector);
            if (composeBox) {
                console.log("📝 Found compose box with selector:", selector);
                break;
            }
        }

        if (composeBox) {
            composeBox.focus();
            
            // Clear and insert new content
            composeBox.textContent = generatedReply;
            
            // Trigger input event for Gmail
            const inputEvent = new Event('input', { bubbles: true });
            const changeEvent = new Event('change', { bubbles: true });
            composeBox.dispatchEvent(inputEvent);
            composeBox.dispatchEvent(changeEvent);
            
            console.log("✨ Reply inserted successfully");
            
            // Show success state with celebration
            button.classList.remove('loading');
            button.classList.add('success');
            button.innerHTML = 'Magic!';
            button.setAttribute('aria-label', `${selectedTone.charAt(0).toUpperCase() + selectedTone.slice(1)} reply generated successfully!`);
            
            setTimeout(() => {
                button.classList.remove('success');
                button.innerHTML = 'AI Reply';
                button.removeAttribute('disabled');
                button.setAttribute('aria-label', 'Generate AI-powered email reply');
            }, 2000);
        } else {
            throw new Error('Compose box was not found');
        }
    } catch (error) {
        console.error('❌ Error generating reply:', error);
        button.classList.remove('loading');
        button.classList.add('error');
        button.innerHTML = 'Oops!';
        button.setAttribute('aria-label', 'Error generating reply');
        
        setTimeout(() => {
            button.classList.remove('error');
            button.innerHTML = 'AI Reply';
            button.removeAttribute('disabled');
            button.setAttribute('aria-label', 'Generate AI-powered email reply');
        }, 2500);
        
        alert('🤖 AI Assistant: Failed to generate reply - ' + error.message);
    }
}

function injectButton() {
    // Remove existing buttons
    const existingButtons = document.querySelectorAll('.ai-reply-button');
    existingButtons.forEach(btn => {
        console.log("🔄 Removing existing AI button");
        btn.remove();
    });

    const toolbar = findComposeToolbar();
    if (!toolbar) {
        console.log("⏸️ Toolbar not found - will retry");
        return;
    }

    console.log("✅ Toolbar found, creating AI button");
    const button = createAIButton();

    button.addEventListener('click', async () => {
        // Show tone selection modal
        const tone = await showToneSelectionModal();
        
        if (tone) {
            // User selected a tone and confirmed
            selectedTone = tone;
            console.log(`🎭 Selected tone: ${selectedTone}`);
            
            // Update button to show selected tone
            button.classList.add('with-tone');
            
            // Generate reply with selected tone
            await generateAIReply(button);
        } else {
            // User cancelled
            console.log("❌ Tone selection cancelled");
        }
    });

    // SAFE INSERTION - Handle different toolbar structures
    const sendButton = toolbar.querySelector('.T-I.J-J5-Ji.aoO.T-I-atl.L3');
    
    if (sendButton) {
        // Check if send button is a direct child of the toolbar
        if (sendButton.parentNode === toolbar) {
            // Insert before send button
            toolbar.insertBefore(button, sendButton);
            console.log("🎉 AI button inserted before send button");
        } else {
            // Send button is nested, find where to insert
            const sendButtonContainer = sendButton.parentElement;
            if (sendButtonContainer.parentNode === toolbar) {
                // Insert before the send button's container
                toolbar.insertBefore(button, sendButtonContainer);
                console.log("🎉 AI button inserted before send button container");
            } else {
                // Append to toolbar as fallback
                toolbar.appendChild(button);
                console.log("🎉 AI button appended to toolbar (nested send button)");
            }
        }
    } else {
        // No send button found, append to toolbar
        toolbar.appendChild(button);
        console.log("🎉 AI button appended to toolbar (no send button found)");
    }
}

// Enhanced observer with better Gmail detection
const observer = new MutationObserver((mutations) => {
    let shouldInject = false;
    
    for(const mutation of mutations) {
        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposeElements = addedNodes.some(node => {
            if (node.nodeType !== Node.ELEMENT_NODE) return false;
            
            // Check if node is a compose-related element
            if (node.matches('.aDh, .btC, [role="dialog"], .gU.Up, .brC, .aQH, .nH, .ao')) {
                return true;
            }
            
            // Check if node contains compose-related elements
            if (node.querySelector && node.querySelector('.aDh, .btC, [role="dialog"], .gU.Up, .brC, [role="textbox"], .T-I.J-J5-Ji.aoO')) {
                return true;
            }
            
            return false;
        });

        if (hasComposeElements) {
            shouldInject = true;
            break;
        }
    }
    
    if (shouldInject) {
        console.log("🎯 Compose Window Detected - Injecting button");
        setTimeout(injectButton, 800);
    }
});

// Start observing
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Periodic check for Gmail's dynamic interface
let checkCount = 0;
const periodicCheck = setInterval(() => {
    const hasComposeBox = document.querySelector('[role="textbox"]');
    const hasSendButton = document.querySelector('.T-I.J-J5-Ji.aoO.T-I-atl.L3');
    
    if (hasComposeBox && hasSendButton) {
        console.log("⏰ Periodic check - injecting button");
        injectButton();
    }
    
    checkCount++;
    // Stop checking after 3 minutes to prevent performance issues
    if (checkCount > 60) {
        clearInterval(periodicCheck);
        console.log("🛑 Stopped periodic checks");
    }
}, 3000);

// Initial injection after page load
setTimeout(injectButton, 2000);

// Re-inject when URL changes (Gmail is a SPA)
let lastUrl = location.href;
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        console.log("🔗 URL changed - reinjecting button");
        setTimeout(injectButton, 1000);
    }
}).observe(document, { subtree: true, childList: true });

// Also inject when the page becomes visible again
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        console.log("👀 Page visible - checking for reply context");
        setTimeout(injectButton, 500);
    }
});

console.log("🎊 AI Email Writer Pro with Tone Selection initialized successfully!");