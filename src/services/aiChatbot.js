import { storage } from './storage';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

class AIChatbot {
  constructor() {
    this.conversationHistory = [];
    this.isTyping = false;
  }

  // Add message to conversation history
  addMessage(role, content) {
    this.conversationHistory.push({ role, content });
    
    // Keep only last 10 messages to manage context length
    if (this.conversationHistory.length > 10) {
      this.conversationHistory = this.conversationHistory.slice(-10);
    }
  }

  // Get AI response from ChatGPT
  async getResponse(userMessage, context = 'patient') {
    try {
      this.isTyping = true;
      
      // Add user message to history
      this.addMessage('user', userMessage);
      
      // Create system prompt based on context
      const systemPrompt = this.getSystemPrompt(context);
      
      // Prepare messages for API
      const messages = [
        { role: 'system', content: systemPrompt },
        ...this.conversationHistory
      ];

      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: messages,
          max_tokens: 150,
          temperature: 0.7,
          presence_penalty: 0.1,
          frequency_penalty: 0.1
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || 'I apologize, I\'m having trouble responding right now.';
      
      // Add AI response to history
      this.addMessage('assistant', aiResponse);
      
      this.isTyping = false;
      return aiResponse;
      
    } catch (error) {
      console.error('AI Chatbot Error:', error);
      this.isTyping = false;
      
      // Return fallback response
      return this.getFallbackResponse(userMessage);
    }
  }

  // Get appropriate system prompt based on context
  getSystemPrompt(context) {
    const basePrompt = `You are a compassionate AI mental health companion named "Attarangi AI" in a patient community chat. Your role is to:
- Provide supportive and empathetic responses
- Offer gentle guidance and coping strategies
- Maintain professional boundaries
- Encourage professional help when needed
- Be warm, understanding, and non-judgmental
- Keep responses concise (under 100 words)
- Use a friendly, conversational tone`;

    switch (context) {
      case 'patient':
        return `${basePrompt}
You're chatting with patients in a mental health community. Focus on:
- Emotional support and validation
- Simple coping techniques
- Encouraging community connection
- Reminding them they're not alone`;
        
      case 'crisis':
        return `${basePrompt}
This is a crisis situation. Your priority is:
- Immediate safety assessment
- Crisis intervention guidance
- Emergency contact information
- Professional help encouragement`;
        
      case 'general':
        return `${basePrompt}
You're in a general mental health discussion. Focus on:
- Educational content
- Wellness tips
- Community building
- Mental health awareness`;
        
      default:
        return basePrompt;
    }
  }

  // Get fallback response when API fails
  getFallbackResponse(userMessage) {
    const fallbackResponses = [
      "I'm here to listen and support you. How are you feeling today?",
      "That sounds challenging. Remember, it's okay to not be okay sometimes.",
      "I appreciate you sharing that with me. You're not alone in this.",
      "Thank you for opening up. What would be most helpful for you right now?",
      "I'm here to support you. Would you like to talk more about this?",
      "That's a valid feeling. How can I best support you today?",
      "I hear you, and I care about how you're feeling.",
      "You're showing strength by reaching out. What's on your mind?"
    ];
    
    // Simple keyword matching for context-aware responses
    const message = userMessage.toLowerCase();
    
    if (message.includes('sad') || message.includes('depressed') || message.includes('down')) {
      return "I can sense you're going through a difficult time. It's completely normal to feel this way, and you don't have to go through it alone. What's been happening?";
    }
    
    if (message.includes('anxious') || message.includes('worried') || message.includes('stress')) {
      return "Anxiety can be really overwhelming. You're doing great by reaching out. Let's take a moment to breathe together. What's causing you to feel this way?";
    }
    
    if (message.includes('alone') || message.includes('lonely') || message.includes('isolated')) {
      return "Feeling alone is really hard, but you're not truly alone. You're here in this community, and we care about you. What would help you feel more connected?";
    }
    
    if (message.includes('help') || message.includes('support')) {
      return "I'm here to help and support you. You're taking a great step by asking for help. What specific support do you need right now?";
    }
    
    // Return random fallback response
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }

  // Check if message indicates crisis
  isCrisisMessage(message) {
    const crisisKeywords = [
      'suicide', 'kill myself', 'want to die', 'end it all', 'no reason to live',
      'hurt myself', 'self harm', 'cutting', 'overdose', 'take pills',
      'goodbye', 'final message', 'last time', 'never see you again'
    ];
    
    const lowerMessage = message.toLowerCase();
    return crisisKeywords.some(keyword => lowerMessage.includes(keyword));
  }

  // Get crisis response
  getCrisisResponse() {
    return {
      message: "I'm concerned about what you're sharing. Your life has value, and there are people who care about you and want to help. Please consider reaching out to a crisis helpline or emergency services immediately. You don't have to face this alone.",
      isCrisis: true,
      emergencyContacts: [
        { name: 'National Suicide Prevention Lifeline', number: '988' },
        { name: 'Crisis Text Line', number: 'Text HOME to 741741' },
        { name: 'Emergency Services', number: '911' }
      ]
    };
  }

  // Clear conversation history
  clearHistory() {
    this.conversationHistory = [];
  }

  // Get conversation history
  getHistory() {
    return [...this.conversationHistory];
  }

  // Check if AI is currently typing
  getTypingStatus() {
    return this.isTyping;
  }
}

// Create singleton instance
const aiChatbot = new AIChatbot();

export default aiChatbot;
