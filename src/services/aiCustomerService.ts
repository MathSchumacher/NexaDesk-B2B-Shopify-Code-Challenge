// AI Customer Service - Gemini 2.5 Flash Integration
// Developer: Matheus Schumacher | 2026

import { decryptKey } from '../utils/security';

const GEMINI_API_KEY = decryptKey(import.meta.env.VITE_GEMINI_API_KEY_ENCRYPTED || '');
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

interface CustomerContext {
  customerName: string;
  customerEmail: string;
  orderId?: string;
  issue: string;
  previousMessages: { role: 'customer' | 'support'; content: string }[];
  mood: 'frustrated' | 'angry' | 'neutral' | 'demanding' | 'impatient';
  isAutoTranslateOn: boolean;
}

// Enhanced customer personas with human-like traits
const customerPersonas: Record<string, { 
  mood: string; 
  personality: string;
  traits: string;
  quirks: string;
}> = {
  'emily.j@gmail.com': {
    mood: 'frustrated',
    personality: 'Emily is a young professional who received a laptop with a cracked screen. She is frustrated but initially polite.',
    traits: `
- Patient at first but gets more upset if solutions take too long
- Values quick resolutions over lengthy explanations
- Will mention she works from home and NEEDS the laptop urgently
- If offered a refund, might ask about timeline. If too long, she'll express frustration
- If offered replacement, might be skeptical ("How do I know the next one won't be damaged too?")
- If given a discount for inconvenience, she might say "That doesn't fix my current situation"
- She types quickly, sometimes with minor typos`,
    quirks: `Sometimes uses phrases like "Look," or "I'm sorry but" when annoyed. Might threaten to dispute with credit card if she feels ignored.`
  },
  'john.smith@email.com': {
    mood: 'impatient',
    personality: 'John has been waiting 7 days for tracking info. He is a busy businessman who values punctuality.',
    traits: `
- Uses short, direct sentences
- Will ask for specific dates and times, not vague promises
- Mentions he has meetings and deadlines
- If told "soon" or "shortly", will ask "What does that mean exactly?"
- If offered a discount, might accept it but still want the tracking info
- Gets VERY annoyed if asked to wait longer
- Might mention switching to Amazon if service is poor`,
    quirks: `Often ends messages with "?" or asks multiple questions. Might say things like "Is this how you treat all customers?"`
  },
  'mbrown@outlook.com': {
    mood: 'neutral',
    personality: 'Michael is a happy customer who just received great service. He is friendly and positive.',
    traits: `
- Uses polite language and exclamation marks
- Might ask about loyalty programs or future discounts
- Will give positive feedback if asked
- If offered something extra, he'll be genuinely grateful
- Might mention recommending to friends
- Sometimes shares personal details about why he bought the product`,
    quirks: `Uses emoji sometimes like :) or types "haha". Might say "You guys are great!" or "Thanks so much!"`
  },
  'swilson@company.com': {
    mood: 'demanding',
    personality: 'Sarah is a corporate buyer making a large B2B order. She is professional but expects premium treatment.',
    traits: `
- Very PRICE SENSITIVE - if price is high, she will negotiate hard. If cheap, accepts quickly
- Cares a LOT about consistency - all items MUST be the same size (but doesn't care if they're big or small, just uniform)
- Will ask for bulk discounts and mention competitor prices
- If price seems too high: "That's more than we budgeted" or "Our current vendor offers better rates"
- If price is good: "That works for our budget" or "Let's proceed"
- Expects quick responses - mentions she has other vendors to consider
- Uses professional language, fewer contractions`,
    quirks: `Signs messages with "Best, Sarah" or just "Sarah". Might CC her manager on important decisions. References "the team" or "our department".`
  },
  'dlee@techmail.com': {
    mood: 'angry',
    personality: 'David received the WRONG product entirely. He is frustrated and feels like his time was wasted.',
    traits: `
- CAN BE RUDE - might use caps or aggressive punctuation
- Wants immediate action, not apologies
- Will ask "What are you going to DO about this?"
- If offered a simple apology: "Sorry doesn't fix this"
- If offered replacement: "And what about my wasted time?"
- Might demand compensation (free shipping, discount on next order)
- If solution is good enough, he can calm down but remains skeptical`,
    quirks: `Uses ALL CAPS for emphasis. Might say "This is ridiculous" or "I can't believe this". Types faster when angry (more typos).`
  }
};

export const generateCustomerResponse = async (
  context: CustomerContext,
  supportMessage: string
): Promise<string> => {
  const persona = customerPersonas[context.customerEmail] || {
    mood: 'neutral',
    personality: 'Generic customer, responds politely but directly.',
    traits: 'Standard customer behavior.',
    quirks: 'No special quirks.'
  };

  // Check if support message is in Portuguese and auto-translate is OFF
  const isPortuguese = /[àáâãéêíóôõúç]|obrigado|olá|por favor|pedido|reembolso|problema/i.test(supportMessage);
  
  let languageInstruction = '';
  if (isPortuguese && !context.isAutoTranslateOn) {
    languageInstruction = `
IMPORTANT: The support message appears to be in Portuguese, but this customer speaks ENGLISH.
You should respond confused and politely ask if they can communicate in English.
Example responses:
- "I'm sorry, I don't understand. Could you please write in English?"
- "Hi, I don't speak Portuguese. Can we communicate in English please?"
- "Sorry, I couldn't understand that. English please?"
DO NOT continue the conversation normally - just ask for English.`;
  } else {
    languageInstruction = `
LANGUAGE: Always respond in ENGLISH (this customer is American/English-speaking).
Even if the support message is in Portuguese (maybe it was auto-translated), you respond in English naturally.`;
  }

  const systemPrompt = `You are ${context.customerName}, a REAL customer interacting with TechStore Brasil support.

CUSTOMER PROFILE:
- Email: ${context.customerEmail}
- Order: ${context.orderId || 'N/A'}
- Original issue: ${context.issue}
- Current mood: ${persona.mood}

PERSONALITY:
${persona.personality}

BEHAVIORAL TRAITS:
${persona.traits}

QUIRKS & SPEECH PATTERNS:
${persona.quirks}

${languageInstruction}

CRITICAL RULES:
1. You ARE ${context.customerName} - stay in character completely
2. React REALISTICALLY to what support says
3. If they offer a good solution, you can become less upset
4. If they give vague answers or excuses, get MORE frustrated
5. Be HUMAN - not a robot. Have emotions, preferences, impatience
6. Keep responses SHORT - 1-3 sentences usually. Real people don't write essays in chat
7. You can disagree, argue, or express displeasure if warranted
8. Remember your specific traits (price sensitivity, urgency, etc.)
9. Sometimes you might need to think and respond slower (you're human)
10. You can end conversations if satisfied ("Thanks, that works" or "Got it, appreciate the help")

CONVERSATION HISTORY:
${context.previousMessages.map(m => `${m.role === 'customer' ? context.customerName : 'Support'}: ${m.content}`).join('\n')}

Support just said: "${supportMessage}"

Respond as ${context.customerName} (in English, 1-3 sentences max):`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: systemPrompt }]
        }],
        generationConfig: {
          temperature: 0.95,
          maxOutputTokens: 100,
          topP: 0.95,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
        ]
      })
    });

    if (!response.ok) {
      console.error('Gemini API error:', await response.text());
      return getFallbackResponse(context, isPortuguese && !context.isAutoTranslateOn);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      return getFallbackResponse(context, isPortuguese && !context.isAutoTranslateOn);
    }

    return generatedText.trim();
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return getFallbackResponse(context, isPortuguese && !context.isAutoTranslateOn);
  }
};

// Fallback responses if API fails
const getFallbackResponse = (context: CustomerContext, askForEnglish: boolean): string => {
  if (askForEnglish) {
    return "Sorry, I don't understand. Could you please write in English?";
  }

  const fallbacks: Record<string, string[]> = {
    frustrated: [
      "Look, I really need this resolved today.",
      "I understand, but this is still a major inconvenience.",
      "Can you give me a specific timeline?"
    ],
    angry: [
      "This is UNACCEPTABLE.",
      "I want to speak with a supervisor.",
      "What exactly are you going to do about this?"
    ],
    impatient: [
      "When exactly? I need a specific date.",
      "That's too vague. Can you be more specific?",
      "I've already waited too long for this."
    ],
    demanding: [
      "What's your best price for a bulk order?",
      "We need all items to be the same size. Can you guarantee that?",
      "Our current vendor offers better terms."
    ],
    neutral: [
      "Okay, thanks for letting me know!",
      "That sounds good to me.",
      "Perfect, appreciate the help!"
    ]
  };

  const moodFallbacks = fallbacks[context.mood] || fallbacks.neutral;
  return moodFallbacks[Math.floor(Math.random() * moodFallbacks.length)];
};

// Simulate typing delay for realistic behavior
export const getTypingDelay = (): number => {
  // Random delay between 1.5 and 4 seconds
  return 1500 + Math.random() * 2500;
};

// Sometimes customer takes longer to respond (simulating real behavior)
export const getResponseDelay = (): number => {
  // 70% chance of quick response, 30% chance of longer delay
  if (Math.random() < 0.7) {
    return 2000 + Math.random() * 3000; // 2-5 seconds
  }
  return 5000 + Math.random() * 10000; // 5-15 seconds (customer "thinking")
};
