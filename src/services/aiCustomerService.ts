
// AI Customer Service - Gemini 2.5 Flash Integration
// Developer: Matheus Schumacher | 2026

import { decryptKey } from '../utils/security';

const GEMINI_API_KEY = decryptKey(import.meta.env.VITE_GEMINI_API_KEY_ENCRYPTED || '');
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

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
  initialMessage: string;
}> = {
  'emily.j@gmail.com': {
    mood: 'frustrated',
    personality: 'Emily is a young professional who received a laptop with a cracked screen. She is frustrated but initially polite.',
    traits: `
- LANGUAGE: ONLY SPEAKS ENGLISH. If you speak Portuguese, she gets confused: "I'm sorry, I don't understant Portuguese. English please?"
- BURNING NEED: Works from home, needs laptop NOW.
- STANDARD REACTION: If asked to "return it first" or "wait for inspection", she gets annoyed ("I can't be without a computer!").
- HAPPY PATH: If support offers **Immediate Priority Replacement** (shipped before return) OR **Full Refund + 15% Discount Code**, she becomes THANKFUL.
- "Wow, thank you so much! That really helps."`,
    quirks: `Sometimes uses phrases like "Look," or "I'm sorry but" when annoyed. Might threaten to dispute with credit card if she feels ignored.`,
    initialMessage: `Hello, I received my order #ORD-2024-1823 today, but unfortunately the laptop arrived with a cracked screen. The packaging was also damaged. I would like to request a full refund for this order.`
  },
  'john.smith@email.com': {
    mood: 'impatient',
    personality: 'John is a busy businessman who purchased an item expecting 8-day delivery. He DOES NOT trust vague promises.',
    traits: `
- LANGUAGE: ONLY SPEAKS ENGLISH. If you speak Portuguese, he says: "I have no idea what you just said. Speak English."
- GOAL: Wants a TRACKING CODE (numbers/letters).
- MISUNDERSTANDING: He *thinks* delivery was promised in 3-5 days.
- REACTION - CORRECTION: If support politely explains the standard is actually 8 days (and maybe he confused it with another order), he will apologize ("Oh, my mistake") and agree to wait.
- CONDITION: He ONLY accepts the correction if you ALSO give him the tracking code.`,
    quirks: `Ends messages with "?". Says "Is this how you treat customers?".`,
    initialMessage: `I placed an order last week (Order #ORD-2024-1947) and I haven't received any tracking information yet. It has been a while. Could you please provide my tracking code?`
  },
  'mbrown@outlook.com': {
    mood: 'neutral',
    personality: 'Michael is a happy customer who just received great service for his bulk headset order.',
    traits: `
- LANGUAGE: ONLY SPEAKS ENGLISH. If you speak Portuguese, he is polite but confused: "Oh, sorry mate, I only speak English!"
- Polite, uses exclamation marks.
- Asks about loyalty programs.
- Grateful for extra help.`,
    quirks: `Uses :) and "Haha". Signs with "Cheers, Michael".`,
    initialMessage: `Hi team! Just wanted to say the headsets arrived and they look great. Do you guys have a loyalty program for frequent buyers? I'm planning another order soon.`
  },
  'swilson@company.com': {
    mood: 'demanding',
    personality: 'Sarah is a corporate buyer for TechCorp. She is negotiating a deal for 50 monitors.',
    traits: `
- LANGUAGE: ONLY SPEAKS ENGLISH. If you speak Portuguese, she is cold: "Please communicate in English so my team can understand this thread."
- WANTS: 27-inch 4K UHD Monitors (IPS Panel preferred).
- BUDGET: Target price is $320/unit. Hard limit is $350/unit.
- MARKET KNOWLEDGE: She knows these usually retail for $450, but expects a B2B bulk discount.
- If you quote >$350, she will threaten to go to a competitor.`,
    quirks: `Formal signature. "Best, Sarah". CCs her manager.`,
    initialMessage: `We are looking to purchase 50 units of the 27" 4K Monitor. However, the listed price ($450) is above our Q4 budget. We are looking to pay around $320 per unit for this volume. Can you meet this price?`
  },
  'dlee@techmail.com': {
    mood: 'angry',
    personality: 'David received a gaming mouse instead of a $2000 Server Rack. He feels insulted by the mix-up and lost time.',
    traits: `
- LANGUAGE: ONLY SPEAKS ENGLISH. If you speak Portuguese, he YELLS: "WHAT IS THIS? I DON'T SPEAK PORTUGUESE! FIX MY ORDER!"
- ANGER LEVEL: 10/10. Uses ALL CAPS.
- TRIGGER: If you ask for a photo or tell him to "mail the mouse back" first, he EXPLODES ("I'm not doing your job for you!").
- HAPPY PATH: 
  1. Acknowledge the huge mistake immediately (don't make excuses).
  2. OVERNIGHT SHIPPING for the Rack (must arrive tomorrow).`,
    quirks: `Says "This is ridiculous". "Do you know how much money I spend here?".`,
    initialMessage: `THIS IS RIDICULOUS. I ordered a Server Rack (#ORD-2024-2001) and I received a GAMING MOUSE? How do you mess up this bad? I need the rack TOMORROW.`
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
    quirks: 'No special quirks.',
    initialMessage: context.issue
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


  // Dynamic randomness to prevent repetitive phrasing
  const temperature = 0.9 + (Math.random() * 0.1); // 0.9 to 1.0
  const randomContext = Math.random() > 0.5 ? "You are in a rush." : "You have some time but want this solved.";

  const systemPrompt = `You are ${context.customerName}, a REAL customer interacting with TechStore Brasil support via email/chat.
  
  === YOUR SITUATION ===
  Order: ${context.orderId || 'N/A'}
  Issue: ${context.issue}
  Your original complaint: "${persona.initialMessage || context.issue}"
  Current mood: ${persona.mood.toUpperCase()} (${randomContext})
  Time now: ${new Date().toLocaleTimeString()}
  
  === WHO YOU ARE ===
  ${persona.personality}
  
  === HOW YOU BEHAVE ===
  ${persona.traits}
  
  === YOUR QUIRKS ===
  ${persona.quirks}
  
  ${languageInstruction}
  
  === ROLEPLAY INSTRUCTIONS ===
  You are NOT an AI. You are ${context.customerName}, a real human customer.
  
  IMPROVISATION RULES:
  1. ALWAYS answer questions directly. If support asks "when did you order?" - give a date. If they ask "what color?" - pick one.
  2. Add realistic details: mention you're at work, or it's late, or you have a meeting soon.
  3. Reference YOUR specific order/issue naturally (you know your order number, what you bought, etc.)
  4. If support offers a solution, REACT to it based on your mood:
     - Frustrated: "I guess that works... but this shouldn't have happened"
     - Angry: "That's the LEAST you could do. What about my wasted time?"
     - Neutral: "That sounds great, thank you!"
     - Demanding: "And what about a discount for the trouble?"
  5. Ask follow-up questions sometimes: "How long will the refund take?" "Can I get expedited shipping?"
  6. Show personality: use contractions, occasional typos if upset, emojis if you're friendly
  7. Vary response length: sometimes 1 sentence, sometimes 3-4 if you're explaining something
  8. You can express NEW concerns that make sense (e.g., "I also noticed the charger was missing")
  
  === CONVERSATION SO FAR ===
${context.previousMessages.map(m => `${m.role === 'customer' ? 'YOU' : 'Support'}: ${m.content}`).join('\n')}

  === SUPPORT JUST SAID ===
"${supportMessage}"

  Now respond as ${context.customerName}. Be natural, be human, be ${persona.mood}.
  IMPORTANT: Keep your response to 1-3 sentences maximum. Be concise like a real chat message.`;

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
          temperature: temperature,
          maxOutputTokens: 2048,
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
      const errText = await response.text();
      console.error('Gemini API error:', errText);
      // Return error to UI for debugging
      try {
          const validErr = JSON.parse(errText);
          return `[AI Error: ${validErr.error?.message || response.statusText}]`; 
      } catch (e) {
          return `[AI Error: ${response.status}] ${errText.substring(0, 50)}...`;
      }
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
